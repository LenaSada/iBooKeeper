import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAppointedDays, getComplaints, getComplaintsResponses, getReservedTimes } from '../utils';
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
            console.log(dateString);
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
            setReserved_times(await getReservedTimes(date_formatted));
        } catch (error) {
            console.error('Error connectiong to server:', error);
        }
        const month = date.getMonth() + 1;
        setNote(date.getDate() + "/" + month);
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
                        Show Complaints
                    </button>
                    <button className="text-gray-300 py-2 px-4 rounded-md mr-2
            hover:text-white"
                        onClick={async () => { await getComplaintsResponsesHelper(); setIsOpen2(true) }}>
                        Addressed Complaints
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
                </div>
                {reserved_times.map((time, index) => (
                    <div className='flex flex-col' key={index}>
                        <div className='sign-in__bar' id='signin'>
                            <p className='txt-5xl font-bold'>{time.val}</p>
                            <h3><b>ID:</b> {time.id}</h3>
                            <h3><b>Name:</b> {time.user_name}</h3>
                            <h3><b>Location:</b> {time.location}</h3>
                            <h3><b>Appointment Matter:</b> {time.matter}</h3>
                        </div>
                    </div>
                ))}
            </div>
            <Complaints isOpen={isOpen} closeWin={() => setIsOpen(false)} complaints={complaints} />
            <ComplaintsResponses isOpen={isOpen2} closeWin={() => { setIsOpen2(false) }}
                complaintsResponses={complaintsResponses} isAccountant={true} />
        </>
    )
}

export default HomepageAccountant