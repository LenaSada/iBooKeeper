import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    getAvailableTimes
} from '../utils';

const HomepageUser = ({user, formatDate, getBookedDaysHelper}) => {
    const [value, setValue] = useState(new Date());
    const today = new Date();
    const [note, setNote] = useState("");
    const [available_times, setAvailable_times] = useState([]);
    const [bookedDays, setBookedDays] = useState({});
    const [current_date, setCurrent_date] = useState("");

    useEffect(() => {
        getBookedDaysHelper(setBookedDays);
    }, []);

    const dateChosen = async (date) => {
        try {
            const temp = formatDate(date);
            const date_formatted = new Date(temp);
            setCurrent_date(date_formatted);
            setValue(date);
            setAvailable_times(await getAvailableTimes(date_formatted));
        } catch (error) {
            console.error('Error connectiong to server:', error);
        }
        const month = date.getMonth() + 1;
        setNote(date.getDate() + "/" + month);
    }

    return (
        <div>
            {!!user &&
                <div className='flex flex-col'>
                    <div className='flex flex-col'>
                        <Calendar className='m-auto' onChange={dateChosen} value={value} minDate={today}
                            tileDisabled={({ date }) =>
                                formatDate(date).substring(0, 10) in bookedDays
                            }
                        />
                        <label>{note}</label>
                    </div>
                    <div className='flex flex-wrap'>
                        {available_times.map((time, index) => (
                            <div className='w-1/2 md:w-1/4 lg:w-1/8 p-1' key={index}>
                                <button
                                    type='button'
                                    className='rounded-full sign-in__btn min-h-[30px] w-full'
                                    key={index}
                                    onClick={() => {  }}>
                                    {time}
                                </button>
                            </div>
                        ))}
                    </div>
                    <input type='file' onChange={() => {}} />
                    <button onClick={() => {}}>Upload</button>
                </div>
            }
        </div>
    )
}

export default HomepageUser