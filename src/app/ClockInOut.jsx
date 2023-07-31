'use client'
import {useState} from "react";
import {format} from "date-fns";
import {Providers} from "@/app/Providers";
import {useToast} from "@chakra-ui/react";

function ClockInOutComponent({clockIn, clockOut, employees, fetchCurrentOpenEndedAttendance}) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [currentActiveAttendancePeriod, setCurrentActiveAttendancePeriod] = useState(null);
    const toast = useToast()
    const handleSubmit = async () => {

        if (currentActiveAttendancePeriod.length === 0) {
            // Create attendance event
            const AttendanceEvent = {
                attendances: [
                    {
                        start_time: format(new Date(), 'HH:mm'),
                        employee: selectedEmployeeId,
                        date: format(new Date(), 'yyyy-MM-dd'),
                        break: 0
                    }
                ]
            };
            await clockIn(AttendanceEvent);
            toast({
                title: 'You successfully clocked in',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } else {
            await clockOut({
                id: currentActiveAttendancePeriod[0].id,
                end_time: format(new Date(), 'HH:mm'),
            })
            toast({
                title: 'You successfully clocked out',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }

        setSelectedEmployeeId('');
        setCurrentActiveAttendancePeriod(null);
    };

    const handleNameChange = async (event) => {
        setCurrentActiveAttendancePeriod(null)
        setSelectedEmployeeId(event.target.value);
        const attendances = await fetchCurrentOpenEndedAttendance(event.target.value)
        if (attendances.length === 0) {
            setCurrentActiveAttendancePeriod([])
        } else {
            setCurrentActiveAttendancePeriod([attendances[0]])
        }
    };

    return (
        <Providers>
            <div className="flex flex-col items-center">
                <form action={handleSubmit} className="relative inline-flex">
                    <select
                        value={selectedEmployeeId}
                        onChange={handleNameChange}
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-blue-500">
                        <option value="">Select Name</option>
                        {employees.map((employee) => (
                            <option key={employee.attributes.id.value} value={employee.attributes.id.value}>
                                {employee.attributes.first_name.value} {employee.attributes.last_name.value}
                            </option>
                        ))}
                    </select>
                    {currentActiveAttendancePeriod && <button
                        type="submit"
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Clock {currentActiveAttendancePeriod.length === 1 ? "Out" : "In"}
                    </button>}
                </form>
            </div>
        </Providers>
    );
}

export default ClockInOutComponent;
