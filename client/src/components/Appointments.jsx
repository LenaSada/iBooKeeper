import { cacnelAppointment } from '../utils';
import MyDialog from './MyDialog';
import { useState } from 'react';

const Appointments = ({ isOpen, closeWin, appointments, appointments_dates, coming_appointments = true }) => {
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  const cancelAppointmentHelper = async (index) => {
    setLoading(true);
    console.log(appointments[index]);
    cacnelAppointment(appointments[index], appointments_dates[index]);
    appointments_dates.splice(index, 1);
    appointments.splice(index, 1);
    setTimestamp(Date.now());
    setLoading(false);
  }

  const isAfterCurrentDateTime = (dateTimeString) => {
    const inputDate = new Date(dateTimeString.replace(' ', 'T'));
    const currentDate = new Date();
    console.log(inputDate > currentDate && coming_appointments);

    return inputDate > currentDate;
  }

  return (
    <MyDialog isOpen={isOpen} closeWin={closeWin}>
      <div key={timestamp}>
        {!loading && appointments_dates && appointments_dates.map((appointment_date, index) => (
          <>
            {((isAfterCurrentDateTime(appointment_date) && coming_appointments) ||
              (!isAfterCurrentDateTime && !coming_appointments)) &&
              <div key={index} className='sign-in__bar'>
                <h1>{appointment_date}</h1>
                <button onClick={() => { cancelAppointmentHelper(index) }}>Cancel appointment</button>
              </div>
            }
          </>
        ))}
        {loading &&
          <h1>Loading...</h1>
        }
      </div>
    </MyDialog>
  )
}

export default Appointments