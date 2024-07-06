import axios from "axios";

export const signIn = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3100/signin', {
            email: email,
            password: password
        }, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Error Signing in:', error);
    }
}

export const getAvailableTimes = async (date_formatted) => {
    try {
        const response = await axios.post('http://localhost:3100/getavailabletimes', {
            date_formatted: date_formatted
        }, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error fetching times:', error);
    }
}

export const getBookedDays = async () => {
    try {
        const response = await axios.get('http://localhost:3100/bookedDays', {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching booked days:', error);
    }
}

export const getReservedTimes = async (date_formatted) => {
    try {
        const response = await axios.post('http://localhost:3100/getreservedtimes', {
            date_formatted: date_formatted
        }, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error fetching times:', error);
    }
}

export const setAppointment = async (date_formatted, time, user) => {
    try {
        const response = await axios.post('http://localhost:3100/setappointment', {
            date_formatted: date_formatted,
            time,
            user
        }, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error Setting Appointment:', error);
    }
}

export const cacnelAppointment = async (appointment_id, appointment_date) => {
    try {
        const response = await axios.post('http://localhost:3100/cancelappointment',
            {
                appointment_id: appointment_id,
                appointment_date: appointment_date
            }, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Error Canceling Appointment:', error);
    }
}

export const getUserAppointments = async () => {
    try {
        const response = await axios.get('http://localhost:3100/getuserappointments', {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error Getting Appointments:', error);
    }
}

export const signUp = async (email, name, password) => {
    try {
        const response = await axios.post('http://localhost:3100/signup', {
            email: email,
            name: name,
            password: password
        }, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Error Signing Up:', error);
    }
}