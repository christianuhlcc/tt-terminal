'use client'
import {useState} from "react";
import {format} from "date-fns";

function ClockInOutComponent({sumbitAttendance, employees}) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    //'2023-07-31'
    const handleSubmit = async () => {
        // Create attendance event
        const AttendanceEvent = {
            attendances: [
                {
                    start_time: format(new Date(), 'HH:mm'),
                    //end_time: endTime,
                    employee: selectedEmployeeId,
                    date: format(new Date(), 'yyyy-MM-dd'),
                    break: 0
                }
            ]
        };
        sumbitAttendance(AttendanceEvent);
    };

    const handleNameChange = (event) => {
        setSelectedEmployeeId(event.target.value);
    };

    return (
        <div className="flex flex-col items-center">
            <form action={handleSubmit} className="relative inline-flex">
                <select
                    value={selectedEmployeeId}
                    onChange={handleNameChange}
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select Name</option>
                    {employees.map((employee) => (
                        <option key={employee.attributes.id.value} value={employee.attributes.id.value}>
                            {employee.attributes.first_name.value} {employee.attributes.last_name.value}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 12l-4-4h8l-4 4z"/>
                    </svg>
                </div>
                <button
                    type="submit"
                    className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Clock In
                </button>
            </form>
        </div>
    );
}

export default ClockInOutComponent;
