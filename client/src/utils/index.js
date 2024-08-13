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

export const getAppointedDays = async () => {
    try {
        const response = await axios.get('http://localhost:3100/appointeddays', {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching appointed days:', error);
    }
}

export const setAppointment = async (date_formatted, time, user, appointmentLocation, appointmentMatter) => {
    try {
        const response = await axios.post('http://localhost:3100/setappointment', {
            date_formatted: date_formatted,
            time,
            user,
            location: appointmentLocation,
            appointmentMatter: appointmentMatter
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

export const sendComplaint = async (user, subject, complaint, formData) => {
    try {
        const user_email = user.email;
        formData.append('user_email', user_email);
        formData.append('subject', subject);
        formData.append('complaint', complaint);
        const response = await axios.post('http://localhost:3100/sendcomplaint', formData, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error Sending Complaint:', error);
    }
}

export const getComplaints = async () => {
    try {
        const response = await axios.get('http://localhost:3100/getcomplaints', {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error Getting Complaints:', error);
    }
}

export const downloadFile = async (file_path) => {
    try {
        const response = await axios.get('http://localhost:3100/getfile', {
            params: {
                file_path: file_path
            },
            responseType: 'blob', // Set the responseType to 'blob'
            withCredentials: true
        });

        // Create a blob from the response data
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        // Create a temporary link element to initiate the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", file_path.split('/')[1]);
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading file:', error);
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
        console.error('Error Getting Complaints:', error);
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

export const sendComplaintResponse = async (user_id, complaintResponse, complaint_id, formData) => {
    try {
        formData.append('user_id', user_id);
        formData.append('complaintResponse', complaintResponse);
        formData.append('complaint_id', complaint_id);
        const response = await axios.post('http://localhost:3100/sendcomplaintresponse', formData, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Error Sending complaint response:', error);
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

export const getUserComplaintsResponses = async (user) => {
    try {
        console.log(user);
        const response = await axios.get('http://localhost:3100/getusercomplaintsresponses', {
            params: {
                user: user
            },
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error Getting User Complaints Responses:', error);
    }
}

export const getComplaintsResponses = async () => {
    try {
        const response = await axios.get('http://localhost:3100/getcomplaintsresponses', {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error Getting Complaints Responses:', error);
    }
}