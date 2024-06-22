import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getReservedTimes } from '../utils';

const HomepageAccountant = ({ user, formatDate, getBookedDaysHelper }) => {
    const [value, setValue] = useState(new Date());
    const today = new Date();
    const [note, setNote] = useState("");
    const [reserved_times, setReserved_times] = useState([]);
    const [current_date, setCurrent_date] = useState("");

    useEffect(() => {
    }, []);

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

    const logOut = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = "/";
    }

    return (
        <>
            <nav className="bg-blue-600 p-4 flex justify-between items-center mb-10">
                <div className="text-white font-semibold">Welcome {user.name}</div>
                <div>
                    <button className="bg-white text-blue-600 py-2 px-4 rounded-md 
          hover:bg-blue-500 hover:text-white" onClick={logOut}>
                        Log Out
                    </button>
                </div>
            </nav>

            <div className='flex flex-col'>
                <div className='flex flex-col'>
                    <Calendar className='m-auto' onChange={dateChosen} value={value} minDate={today} />
                </div>
                {reserved_times.map((time, index) => (
                    <div className='flex flex-col' key={index}>
                        <div className='sign-in__bar' id='signin'>
                            <h2 className='txt-3xl font-bold'>{time.val}</h2>
                            <h3>ID: {time.id}</h3>
                            <h3>Name: {time.user_name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default HomepageAccountant