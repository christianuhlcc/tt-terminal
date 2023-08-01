"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Providers } from "@/app/Providers";
import { VStack, useToast } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { BarcodeScanner } from "@/app/Scanner";
import { Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

const ClockedInText = ({ currentActiveAttendancePeriod }) =>
  currentActiveAttendancePeriod &&
  currentActiveAttendancePeriod.length === 1 ? (
    <p style={{ alignSelf: "flex-start" }}>
      {`You've clocked in at ${currentActiveAttendancePeriod[0].attributes.start_time}`}
    </p>
  ) : null;

function ClockInOutComponent({
  clockIn,
  clockOut,
  employees,
  fetchCurrentOpenEndedAttendance,
}) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [currentActiveAttendancePeriod, setCurrentActiveAttendancePeriod] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    const currentDate = new Date();
    const currentEmployee = employees.find(
      (employee) =>
        employee.attributes.id.value === parseInt(selectedEmployeeId, 10)
    );

    const currentEmployeeName = currentEmployee
      ? currentEmployee.attributes.first_name.value
      : "Bob";

    if (currentActiveAttendancePeriod.length === 0) {
      const AttendanceEvent = {
        attendances: [
          {
            start_time: format(currentDate, "HH:mm"),
            employee: selectedEmployeeId,
            date: format(currentDate, "yyyy-MM-dd"),
            break: 0,
          },
        ],
      };
      await clockIn(AttendanceEvent);
      toast({
        title: `Welcome to work ${currentEmployeeName}!`,
        description: `It's ${format(currentDate, "HH:mm")}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      await clockOut({
        id: currentActiveAttendancePeriod[0].id,
        end_time: format(currentDate, "HH:mm"),
      });
      toast({
        title: `Bye ${currentEmployeeName}`,
        description: `You clocked out at ${format(currentDate, "HH:mm")}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }

    setSelectedEmployeeId("");
    setCurrentActiveAttendancePeriod(null);
    setIsLoading(false);
  };

  const handleNameChange = async (event) => {
    setIsLoading(true);
    setCurrentActiveAttendancePeriod(null);
    setSelectedEmployeeId(event.target.value);
    const attendances = await fetchCurrentOpenEndedAttendance(
      event.target.value
    );
    if (attendances.length === 0) {
      setCurrentActiveAttendancePeriod([]);
    } else {
      setCurrentActiveAttendancePeriod([attendances[0]]);
    }
    setIsLoading(false);
  };

  return (
    <Providers>
      <VStack spacing={"16px"}>
        <Heading>Time Clock</Heading>
        <Text>Select your Name or scan a Barcode to Clock in</Text>

        <BarcodeScanner handleNameChange={handleNameChange} />

        <Heading>Your Name</Heading>
        <form action={handleSubmit} className="">
          <VStack spacing={"16px"}>
            <Select
              value={selectedEmployeeId}
              onChange={handleNameChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Name</option>
              {employees.map((employee) => (
                <option
                  key={employee.attributes.id.value}
                  value={employee.attributes.id.value}
                >
                  {employee.attributes.first_name.value}{" "}
                  {employee.attributes.last_name.value}
                </option>
              ))}
            </Select>
            <ClockedInText
              currentActiveAttendancePeriod={currentActiveAttendancePeriod}
            />
            <Button
              type="submit"
              variant="solid"
              colorScheme="linkedin"
              isLoading={isLoading}
              isDisabled={!currentActiveAttendancePeriod}
              width={"100%"}
            >
              {getButtonText(currentActiveAttendancePeriod)}
            </Button>
          </VStack>
        </form>
      </VStack>
    </Providers>
  );
}

const getButtonText = (currentActiveAttendancePeriod) => {
  if (!currentActiveAttendancePeriod) {
    return "Clock In / Out";
  }
  return currentActiveAttendancePeriod.length === 1 ? "Clock Out" : "Clock In";
};

export default ClockInOutComponent;
