import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    getAvailableTimes,
    getUserAppointments,
    setAppointment
} from '../utils';
import Appointments from './Appointments';
import SendComplaint from './SendComplaint';

const HomepageUser = ({ user, formatDate, getBookedDaysHelper }) => {
    const [selectedTime, setSelectedTime] = useState('');

    const [value, setValue] = useState(new Date());
    const today = new Date();
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [available_times, setAvailable_times] = useState([]);
    const [bookedDays, setBookedDays] = useState({});
    const [current_date, setCurrent_date] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointments_dates, setAppointments_dates] = useState([]);

    const [isOpen2, setIsOpen2] = useState(false);

    useEffect(() => {
        getBookedDaysHelper(setBookedDays);
    }, []);

    const handleTimeChange = (event) => {
        const time = event.target.value;
        setSelectedTime(time);
    };

    const getUserAppointmentsHelper = async () => {
        try {
            const data = await getUserAppointments();
            console.log(data.appointments_dates);
            setAppointments(data.appointments);
            setAppointments_dates(data.appointments_dates);
        } catch (error) {
            console.error('Error in getting user`s appointments:', error);
        }
    }

    const dateChosen = async (date) => {
        try {
            setError('');
            const temp = formatDate(date);
            const date_formatted = new Date(temp);
            setCurrent_date(date_formatted);
            setAvailable_times(await getAvailableTimes(date_formatted));
        } catch (error) {
            console.error('Error connectiong to server:', error);
        }
        const month = date.getMonth() + 1;
        setNote(date.getDate() + "/" + month);
    }

    const scheduleAppointmentAtTime = async (time) => {
        try {
            const data = await setAppointment(current_date, time, user);
            if (data.error) {
                throw data.error;
            }
            setAvailable_times(await getAvailableTimes(current_date));
        } catch (error) {
            console.error('Error scheduling an appointment:', error);
            setError(error);
        }
    }

    const logOut = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = "/";
    }

    return (
        <div>
            <nav className="bg-blue-600 p-4 flex justify-between items-center mb-10">
                <div className="text-white font-semibold">Welcome {user.name}</div>
                <div>
                    <button className="bg-white text-blue-600 py-2 px-4 rounded-md mr-2 
          hover:bg-blue-500 hover:text-white" onClick={() => setIsOpen2(true)}>
                        Send a Complaint
                    </button>
                    <button className="bg-white text-blue-600 py-2 px-4 rounded-md mr-2 
          hover:bg-blue-500 hover:text-white" onClick={async () => {
                            await getUserAppointmentsHelper();
                            setIsOpen(true)
                        }}>
                        Show Appointments
                    </button>
                    <button className="bg-white text-blue-600 py-2 px-4 rounded-md 
          hover:bg-blue-500 hover:text-white" onClick={logOut}>
                        Log Out
                    </button>
                </div>
            </nav>

            {!!user &&
                <div className='flex flex-col'>
                    <div className='flex flex-col'>
                        <Calendar className='m-auto' onChange={dateChosen} value={value} minDate={today}
                            tileDisabled={({ date }) =>
                                formatDate(date).substring(0, 10) in bookedDays
                            }
                        />
                        <label>{note}</label>
                        <label className='text-red-800'>{error}</label>
                    </div>

                    <div className='flex flex-wrap'>
                        <div className='w-full p-1'>
                            <select
                                className='rounded-full sign-in__btn min-h-[30px] w-full'
                                value={selectedTime}
                                onChange={handleTimeChange}
                            >
                                <option value='' disabled>Select a time</option>
                                {available_times.map((time, index) => (
                                    <option value={time} key={index}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type='button' className='rounded-full sign-in__btn min-h-[30px] w-full'
                        onClick={() => scheduleAppointmentAtTime(selectedTime)}>
                        Set Appointment
                    </button>
                </div>
            }

            <Appointments isOpen={isOpen} closeWin={() => { setIsOpen(false) }}
                appointments={appointments} appointments_dates={appointments_dates} />
            <SendComplaint isOpen={isOpen2} closeWin={() => { setIsOpen2(false) }} user={user} />
        </div>
    )
}

export default HomepageUser