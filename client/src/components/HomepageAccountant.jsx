import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { accountantCacnelAppointment, getAppointedDays, getComplaints, getComplaintsResponses, getReservedTimes } from '../utils';
import Complaints from './Complaints';
import ComplaintsResponses from './ComplaintsResponses';

const HomepageAccountant = ({ user, formatDate, getBookedDaysHelper }) => {
    const [appointedDays, setAppointedDays] = useState({});
    const [value, setValue] = useState(new Date());
    const today = new Date();
    const [note, setNote] = useState("");
    const [reserved_times, setReserved_times] = useState([]);
    const [current_date, setCurrent_date] = useState("");
    const [complaints, setComplaints] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [complaintsResponses, setComplaintsResponses] = useState([]);
    const [isOpen2, setIsOpen2] = useState(false);
    const [timestamp, setTimestamp] = useState(Date.now());

    const [cancelationReason, setCancelationReason] = useState((new Array(30)).fill(''));
    const [cancel, setCancel] = useState((new Array(30)).fill(false));

    useEffect(() => {
        getAppointedDaysHelper();
    }, []);

    const getAppointedDaysHelper = async () => {
        try {
            const data = await getAppointedDays();
            setAppointedDays(data);
        } catch (error) {
            console.error('Error in getting appointed days:', error);
        }
    }

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = formatDate(date).split('T')[0];
            if (appointedDays[dateString]) {
                return 'appointed-day';
            }
        }
        return null;
    };

    const dateChosen = async (date) => {
        try {
            setValue(date);
            const temp = formatDate(date);
            const date_formatted = new Date(temp);
            setCurrent_date(date_formatted);
            const data = await getReservedTimes(date_formatted);
            setReserved_times(data);
        } catch (error) {
            console.error('Error connectiong to server:', error);
        }
        const month = date.getMonth() + 1;
        setNote(date.getDate() + "/" + month);
    }

    const accountantCancelAppointmentHelper = async (time, user_id, to_remove) => {
        try {
            const index = Number(time.substring(0, 2)) + Number(time[3]) / 6;
            const data = accountantCacnelAppointment(formatDate(value).split('T')[0], index, user_id, cancelationReason[to_remove])
            if (data.error) {
                throw 'Unsuccessful';
            }
            reserved_times.splice(to_remove, 1);
            setTimestamp(Date.now());
        } catch (error) {
            console.error('Error canceling Appointment By Accountant: ', error)
        }
    }

    const getComplaintsHelper = async () => {
        try {
            const data = await getComplaints();
            setComplaints(data);
        } catch (error) {
            console.error('Error getting complaints: ', error)
        }
    }

    const getComplaintsResponsesHelper = async () => {
        try {
            const data = await getComplaintsResponses();
            if (data.error) {
                throw data.error;
            }
            setComplaintsResponses(data);
        } catch (error) {
            console.error('Error getting complaints responses:', error);
        }
    }

    const modifyCancelationReason = (value, index) => {
        const newCancelationReason = [...cancelationReason];
        newCancelationReason[index] = value;
        setCancelationReason(newCancelationReason);
    }

    const logOut = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = "/";
    }

    return (
        <>
            <nav className="nav-color h-[50px] p-4 flex justify-between items-center mb-10">
                <div className="text-white font-semibold">Welcome {user.name}</div>
                <div>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
            hover:text-white"
                        onClick={async () => { await getComplaintsHelper(); setIsOpen(true) }}>
                        Show Inquiries
                    </button>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
            hover:text-white"
                        onClick={async () => { await getComplaintsResponsesHelper(); setIsOpen2(true) }}>
                        Addressed Inquiries
                    </button>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
            hover:text-white" onClick={logOut}>
                        Log Out
                    </button>
                </div>
            </nav>

            <div className='flex flex-col'>
                <div className='flex flex-col'>
                    <Calendar className='m-auto' onChange={dateChosen} value={value} minDate={today}
                        tileClassName={tileClassName} />
                    <label>{note}</label>
                </div>
                <div key={timestamp}>
                    {reserved_times.map((time, index) => (
                        <div className='flex flex-col' key={index}>
                            <div className='sign-in__bar' id='signin'>
                                <p className='txt-5xl font-bold'>{time.val}</p>
                                <h3><b>ID:</b> {time.id}</h3>
                                <h3><b>Name:</b> {time.user_name}</h3>
                                <h3><b>Location:</b> {time.location}</h3>
                                <h3><b>Appointment Matter:</b> {time.matter}</h3>
                                <button className="text-gray-500 py-2 px-4 rounded-md mr-2 hover:text-white" onClick={() => {
                                    const newCancel = [...cancel];
                                    newCancel[index] = !cancel[index];
                                    setCancel(newCancel);
                                    setCancelationReason((new Array(30)).fill(''));
                                }}
                                >
                                    {cancel[index] ? 'Keep Appointment' : 'Cancel Appointment'}
                                </button>
                                {cancel[index] &&
                                    <div className='flex flex-row'>
                                        <input
                                            type='text'
                                            name='model'
                                            value={cancelationReason[index]}
                                            onChange={(e) => modifyCancelationReason(e.target.value, index)}
                                            placeholder='Cancelation Reason'
                                            className='bar__input'
                                        />
                                        <button className="text-gray-500 py-2 px-4 rounded-md mr-2
            hover:text-white" onClick={() => accountantCancelAppointmentHelper(time.val, time.id, index)}>Cancel Appointment</button>
                                    </div>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Complaints isOpen={isOpen} closeWin={() => setIsOpen(false)} complaints={complaints} />
            <ComplaintsResponses isOpen={isOpen2} closeWin={() => { setIsOpen2(false) }}
                complaintsResponses={complaintsResponses} isAccountant={true} />
        </>
    )
}

export default HomepageAccountant