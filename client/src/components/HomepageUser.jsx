import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    getAvailableTimes,
    getUserComplaintsResponses,
    getUserAppointments,
    setAppointment
} from '../utils';
import Appointments from './Appointments';
import SendComplaint from './SendComplaint';
import ComplaintsResponses from './ComplaintsResponses';

const HomepageUser = ({ user, formatDate, getBookedDaysHelper }) => {
    const [selectedTime, setSelectedTime] = useState('');

    const [value, setValue] = useState(new Date());
    const today = new Date();
    const [note, setNote] = useState('');
    const [confirmation, setConfirmationr] = useState('');
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [available_times, setAvailable_times] = useState([]);
    const [bookedDays, setBookedDays] = useState({});
    const [current_date, setCurrent_date] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointments_dates, setAppointments_dates] = useState([]);

    const [isOpen2, setIsOpen2] = useState(false);

    const [complaintsResponses, setComplaintsResponses] = useState([]);
    const [isOpen3, setIsOpen3] = useState(false);

    const [appointmentMatter, setAppointmentMatter] = useState('');
    const [appointmentLocation, setAppointmentLocation] = useState('');

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
            setConfirmationr('');
            setError('');
            setError2('');
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
            if (!appointmentLocation || !appointmentMatter.trim()) {
                setError2('All fields are mandatory');
                return;
            }
            const data = await setAppointment(current_date, time, user, appointmentLocation, appointmentMatter);
            if (!data) {
                throw 'Failed to set appointment!';
            }
            setConfirmationr('Appointment was set successfully!');
            setAvailable_times(await getAvailableTimes(current_date));
            setSelectedTime('');
            setAppointmentLocation('');
            setAppointmentMatter('');
            if (data.error) {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error scheduling an appointment:', error);
            setError(error);
        }
    }

    const getUserComplaintsResponsesHelper = async () => {
        try {
            const data = await getUserComplaintsResponses(user);
            if (data.error) {
                throw data.error;
            }
            setComplaintsResponses(data);
        } catch (error) {
            console.error('Error getting complaints responses:', error);
            setError(error);
        }
    }

    const logOut = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = "/";
    }

    return (
        <div>
            <nav className="nav-color h-[50px] p-4 flex justify-between items-center mb-10">
                <div className="text-white font-semibold">Welcome {user.name}</div>
                <div>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
                    hover:text-white" onClick={() => setIsOpen2(true)}>
                        Send an Inquiry
                    </button>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
                    hover:text-white" onClick={async () => {
                            await getUserAppointmentsHelper();
                            setIsOpen(true)
                        }}>
                        Show Appointments
                    </button>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
                    hover:text-white" onClick={async () => {
                            await getUserComplaintsResponsesHelper();
                            setIsOpen3(true)
                        }}>
                        Inquiries Responses
                    </button>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
                    hover:text-white" onClick={logOut}>
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
                        <label className='text-green-800'>{confirmation}</label>
                    </div>

                    <div className='flex flex-col items-center mt-8'>
                        <div className='w-1/3 mb-4'>
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
                        <div className='w-1/3 mb-4'>
                            <select
                                className='rounded-full sign-in__btn min-h-[30px] w-full'
                                value={appointmentLocation}
                                onChange={(event) => {
                                    console.log(event.target.value);
                                    setAppointmentLocation(event.target.value)
                                }}
                            >
                                <option value='' disabled>Select Appointment Location</option>
                                <option value='Zoom'>Zoom</option>
                                <option value='Nof Hagalil Office'>Nof Hagalil Office</option>
                            </select>
                        </div>
                        <div className='w-1/3 mb-4'>
                            Appointment Matter
                            <input
                                type='text'
                                value={appointmentMatter}
                                className='bar__input m-2'
                                onChange={(e) => setAppointmentMatter(e.target.value)}
                            />
                        </div>
                        <div className='w-1/3 mb-4'>
                            <button type='button' className='rounded-full sign-in__btn min-h-[30px] w-full'
                                onClick={() => scheduleAppointmentAtTime(selectedTime)}>
                                Set Appointment
                            </button>
                        </div>
                        <label className='text-red-800'>{error2}</label>
                    </div>
                </div>
            }

            <Appointments isOpen={isOpen} closeWin={() => { setIsOpen(false) }}
                appointments={appointments} appointments_dates={appointments_dates} />
            <SendComplaint isOpen={isOpen2} closeWin={() => { setIsOpen2(false) }} user={user} />
            <ComplaintsResponses isOpen={isOpen3} closeWin={() => { setIsOpen3(false) }}
                complaintsResponses={complaintsResponses} />
        </div>
    )
}

export default HomepageUser