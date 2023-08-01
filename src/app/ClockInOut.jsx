"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Providers } from "@/app/Providers";
import {
  VStack,
  useToast,
  PinInputField,
  PinInput,
  HStack,
  FormLabel,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { BarcodeScanner } from "@/app/Scanner";
import { Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

const findCurrentEmployee = (employees, selectedEmployeeId) => {
  if (!selectedEmployeeId) return undefined;
  return employees.find(
    (employee) =>
      employee.attributes.id.value === parseInt(selectedEmployeeId, 10)
  );
};

const getTerminalPin = (employee) => {
  if (!employee) return undefined;
  const terminalPin = Object.values(employee.attributes).find(
    (attribute) => attribute.label === "Terminal PIN"
  );
  return terminalPin?.value;
};

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
  const [pin, setPin] = useState("");
  const [currentActiveAttendancePeriod, setCurrentActiveAttendancePeriod] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPinInputInvalid, setIsPinInputInvalid] = useState(false);
  const toast = useToast();
  const currentEmployee = findCurrentEmployee(employees, selectedEmployeeId);
  const terminalPin = getTerminalPin(currentEmployee);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      videoDevices.forEach((device) => {
        console.log("device", device.label, device.deviceId, device.groupId);
      });
    };
    getDevices();
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const currentDate = new Date();

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
    setPin("");
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

  const handlePINChange = (inputPin) => {
    if (inputPin.length !== 4) {
      setIsPinInputInvalid(false);
    }
    setPin(inputPin);
  };

  const handlePINComplete = (inputPin) => {
    if (terminalPin === inputPin) {
      setIsPinInputInvalid(false);
    } else {
      setIsPinInputInvalid(true);
    }
  };
  const isPinValid = terminalPin === "" || terminalPin === pin;

  return (
    <Providers>
      <VStack spacing={"16px"}>
        <Heading alignSelf="flex-start">Time Clock</Heading>
        <Text alignSelf="flex-start">
          Select your name or scan a QR to clock in
        </Text>

        <BarcodeScanner handleNameChange={handleNameChange} />

        <form action={handleSubmit} className="">
          <FormLabel alignSelf="flex-start">Your name</FormLabel>
          <VStack spacing={"16px"}>
            <Select
              value={selectedEmployeeId}
              onChange={handleNameChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="">Select name</option>
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

            {currentEmployee && terminalPin && terminalPin !== "" && (
              <FormControl isInvalid={isPinInputInvalid}>
                <FormLabel>PIN</FormLabel>
                <HStack alignSelf="flex-start">
                  <PinInput
                    size="lg"
                    onChange={handlePINChange}
                    onComplete={handlePINComplete}
                    mask
                    isInvalid={isPinInputInvalid}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
                <FormErrorMessage>
                  Invalid pin! Correct it and try again.
                </FormErrorMessage>
              </FormControl>
            )}

            <ClockedInText
              currentActiveAttendancePeriod={currentActiveAttendancePeriod}
            />
            <Button
              type="submit"
              variant="solid"
              colorScheme="linkedin"
              isLoading={isLoading}
              isDisabled={!currentActiveAttendancePeriod || !isPinValid}
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
    return "Clock in / out";
  }
  return currentActiveAttendancePeriod.length === 1 ? "Clock out" : "Clock in";
};

export default ClockInOutComponent;
