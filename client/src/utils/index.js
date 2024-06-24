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