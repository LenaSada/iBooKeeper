const express = require('express');
const router = express.Router();
const cors = require('cors');
const User = require('./user')
const jwt = require('jsonwebtoken');
const Appointments = require('./appointments')
const nodemailer = require('nodemailer');
const Complaint = require('./complaint');
const ComplaintResponse = require('./complaintresponse')

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
);

router.get('/', async (req, res) => {
    console.log('A client is connected');
    res.json('connected to server');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user || user.password != password) {
            return res.json({
                error: 'Email or Password are incorrect'
            });
        }

        console.log(user);
        jwt.sign({ email: email, name: user.name, role: user.role, appointments: user.appointments }, process.env.JWT_SECRET, {},
            (err, token) => {
                if (err) throw err
                console.log(token);
                res.cookie('token', token).json(user);
            })
    } catch (error) {
        console.log('Error signing in: ', error);
        return res.status(500).send('Error signing in');
    }
});

router.get('/getuser', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            console.log(token);
            jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                if (err) throw err
                res.json(user);
            })
        } else {
            res.json(null);
        }
    } catch (error) {
        console.log('Error getting user: ', error);
        return res.status(500).send('Error getting user');
    }
})

router.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const exists = await User.findOne({ email: email });
        const valid = String(email).toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        if (!valid) {
            return res.json({ error: 'invalid email' });
        } else if (exists) {
            return res.json({ error: 'Email Already exists' })
        }
        const user = await User.create({
            name: name,
            email: email,
            password: password
        })
        res.json("User is saved");
    } catch (error) {
        console.log('Error signing up: ', error);
        return res.status(500).send('Error signing up');
    }
});

const getTimes = async (date_formatted, get_available = true) => {
    const date = date_formatted.substring(0, 10);
    try {
        const appointment = await Appointments.create({ date: date });
    } catch (error) {
        console.log('Date already exists: ', error);
    }
    const day = await Appointments.findOne({ date: date })    // Represents the appointments of the given date
    var available_hours = [];
    for (const key in day.time_intervals) {  // Save available times for appointments in the array, in the format: 15:00
        if (day.time_intervals[key] && get_available) {
            continue;
        } else if (!day.time_intervals[key] && !get_available) {
            continue;
        }
        var time = key;
        var val = Math.floor(time).toString();
        if (time < 10) {
            val = "0" + val;
        }
        if (time != Math.floor(time)) {
            val += ":30";
        }
        else {
            val += ":00";
        }
        if (get_available) {
            available_hours.push(val);
        } else {
            const user = await User.findById(day.time_intervals[key]);
            const user_name = user.name;
            const id = day.time_intervals[key];
            const location = day.locations[key];
            const matter = day.matters[key];
            available_hours.push({ val, user_name, id, location, matter });
        }
    }
    if (!get_available) {
        available_hours.sort((a, b) => { return a.val.localeCompare(b.val); })
    }
    return available_hours.sort();
}

router.post('/getavailabletimes', async (req, res) => {
    try {
        const { date_formatted } = req.body;
        available_hours = await getTimes(date_formatted);
        res.json(available_hours);
    } catch (error) {
        console.log("Error getting available times: ", error);
        return res.status(500).send('Error getting available times');
    }
});

router.post('/getreservedtimes', async (req, res) => {
    try {
        const { date_formatted } = req.body;
        available_hours = await getTimes(date_formatted, false);
        res.json(available_hours);
    } catch (error) {
        console.log("Error getting reserved times: ", error);
        return res.status(500).send('Error getting reserved times');
    }
});

router.get('/bookedDays', async (req, res) => {
    bookedDays = {}
    await Appointments.find({})
        .then(appointments => {
            for (const appointment of appointments) {
                let test = true;
                for (const key in appointment.time_intervals) {
                    if (appointment.time_intervals[key] === null) {
                        test = false;
                        break;
                    }
                }
                if (test === true) {
                    bookedDays[appointment.date] = true;
                }
            }
        })
        .catch(error => console.error(error));
    console.log(bookedDays);
    res.json(bookedDays);
});

router.get('/appointeddays', async (req, res) => {
    appointedDays = {}
    await Appointments.find({})
        .then(appointments => {
            for (const appointment of appointments) {
                let test = false;
                for (const key in appointment.time_intervals) {
                    if (appointment.time_intervals[key] !== null) {
                        test = true;
                        break;
                    }
                }
                if (test === true) {
                    appointedDays[appointment.date] = true;
                }
            }
        })
        .catch(error => console.error(error));
    console.log(appointedDays);
    res.json(appointedDays);
});

router.post('/setappointment', async (req, res) => {
    try {
        const { date_formatted, time, user, location, appointmentMatter } = req.body;
        // date used to fetch the specific appointment
        const date = date_formatted.substring(0, 10);
        // Fetching user to attach to appointment
        const user2 = await User.findOne({ email: user.email })

        const date1Obj = new Date(date);
        for (let i = 0; i < user2.appointments_dates.length; i++) {
            const date2Obj = new Date(user2.appointments_dates[i]);
            const timeDifference = date2Obj - date1Obj;
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            if (daysDifference > -7 && daysDifference < 7) {
                return res.json({ error: 'Appointments must be at least week apart' });
            }
        }

        const user_id = user2.id;
        // Index of the time_intervals in the appointments date
        const index = Number(time.substring(0, 2)) + Number(time[3]) / 6;
        const appointment = await Appointments.findOne({ date: date });

        const updatedTimeIntervals = { ...appointment.time_intervals, [index]: user_id };
        appointment.time_intervals = updatedTimeIntervals;
        const updatedLocation = { ...appointment.locations, [index]: location };
        appointment.locations = updatedLocation;
        const updatedMatter = { ...appointment.matters, [index]: appointmentMatter };
        appointment.matters = updatedMatter;
        await appointment.save();

        user2.appointments.push(appointment.id);
        user2.appointments_dates.push(appointment.date + " " + time);
        await user2.save();

        const eventName = encodeURIComponent("Meeting with Accountant");

        const start = date_formatted.replace(/21:00/g, time);
        const startDate = (start.split('.')[0]).replace(/[-:]/g, '');
        let end = start
        if (end[14] == '3') {
            end = end.substring(0, 14) + '0' + end.substring(15);
            end = end.substring(0, 11) + String(Number(time.substring(0, 2)) + 1) + end.substring(13);
        } else {
            end = end.substring(0, 14) + '3' + end.substring(15);
        }

        const endDate = end.replace(/[-:]/g, '').split('.')[0];
        const description = location == 'Zoom' ? encodeURIComponent(appointmentMatter + '\nhttps://zoom.com/...') : encodeURIComponent(appointmentMatter)
        const location_url = encodeURIComponent(location);
        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventName}&dates=${startDate}/${endDate}&details=${description}&location=${location_url}`;

        send_mail(user.email, 'New Appointment Set', `New Appointment with accountant was set at {startDate}`, "", "", googleCalendarUrl);

        res.json('Appointment Set!')
    } catch (error) {
        console.log('Error Setting Appointment: ', error);
        return res.status(500).send('Error Setting Appointment');
    }
});

router.get('/getuserappointments', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            console.log("Token: ", token);
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
                if (err) throw err
                console.log(user);
                const user2 = await User.findOne({ email: user.email });
                res.json({ appointments: user2.appointments, appointments_dates: user2.appointments_dates });
            })
        } else {
            res.json(null);
        }
    } catch (error) {
        console.log('Error getting user: ', error);
        return res.status(500).send('Error getting user');
    }
});

router.post('/cancelappointment', async (req, res) => {
    const { appointment_id, appointment_date } = req.body;
    try {
        // Deleting the appointment from the Appointments Schema
        const time = appointment_date.substring(11, 16);
        const hour = parseInt(time.substring(0, 2))
        const fraction = time[3] == '3' ? 0.5 : 0;
        const index = hour + fraction;
        const appointment = await Appointments.findById(appointment_id);
        const new_time_intervals = { ...appointment.time_intervals };
        new_time_intervals[index] = null;
        appointment.time_intervals = new_time_intervals;
        await appointment.save();

        // Deleting the appontment from the User's appointments array (in the User Schema)
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
                if (err) throw err
                const user2 = await User.findOne({ email: user.email });
                let i = 0
                for (i = 0; i < user2.appointments.length; i++) {
                    if (user2.appointments[i] == appointment_id) {
                        break;
                    }
                }
                user2.appointments.splice(i, 1);
                user2.appointments_dates.splice(i, 1);
                await user2.save();
            })
        } else {
            res.json(null);
        }
        res.json('Appointment Canceled!');
    } catch (error) {
        console.log('Error canceling appointment: ', error);
        return res.status(500).send('Error canceling appointment');
    }
});

router.post('/accountantcancelappointment', async (req, res) => {
    const { appointment_date, index, user_id, cancelationReason } = req.body;
    try {
        // Deleting the appointment from the Appointments Schema
        const appointment = await Appointments.findOne({ date: appointment_date });
        const new_time_intervals = { ...appointment.time_intervals };
        new_time_intervals[index] = null;
        appointment.time_intervals = new_time_intervals;
        const appointment_id = appointment.id;
        await appointment.save();

        // Deleting the appontment from the User's appointments array (in the User Schema)
        const user = await User.findById(user_id);
        let i = 0
        console.log(appointment_id);
        for (i = 0; i < user.appointments.length; i++) {
            if (user.appointments[i] == appointment_id) {
                break;
            }
        }
        user.appointments.splice(i, 1);
        user.appointments_dates.splice(i, 1);
        await user.save();

        send_mail(user.email, 'Appointment Canceled', `Appointment Canceled By Accountant at date ${appointment.date}!\n
            Cancelation Reason: ${cancelationReason}`)
        res.json('Appointment Canceled By Accountant!');
    } catch (error) {
        console.log('Error canceling appointment by accountant: ', error);
        return res.status(500).send('Error canceling appointment by accountant');
    }
});

const send_mail = async (mail, subject, txt, file_name, file_path, googleCalendarUrl = "") => {
    try {
        console.log(mail);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false, // use SSL
            port: 25, // port for secure SMTP
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mailOptions = {
            from: 'ibookeeper4@gmail.com',
            to: mail,
            subject: subject,
            text: txt
        };

        if (googleCalendarUrl) {
            mailOptions.html = `<p>You have a meeting scheduled. Click the button below to add it to your Google Calendar:</p>
         <a href="${googleCalendarUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4285f4; text-decoration: none; border-radius: 5px;">
             Add to Google Calendar
         </a>`
        }

        if (file_name) {
            mailOptions.attachments = [
                { filename: file_name, path: file_path }
            ];
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.error('Error occurs', err);
                return;
            }
            console.log('Email sent!!!');
            return res.send('ok');
        });
    } catch (error) {
        console.log('Error sending file: ', error);
        return error;
    }
}


/******************************** send appointments reminders ********************************/

const cron = require('node-cron')

// This runs every hour
cron.schedule("0 0 * * * *", async function () {
    const now = new Date();
    const twentyFourHoursLater = (new Date(now.getTime() + 27 * 60 * 60 * 1000)).toISOString();
    const date = twentyFourHoursLater.substring(0, 10);
    const hour = twentyFourHoursLater.substring(11, 13);
    console.log(date + "  " + hour);

    try {
        const txt = "This is a reminder that you have an appointment tommorrow at ";
        const date_appointments = await Appointments.findOne({ date: date });
        if (!date_appointments) {
            console.log('No appointments at that date!');
            return;
        }
        if (date_appointments.time_intervals[hour] !== null) {
            const user_id = date_appointments.time_intervals[hour];
            const user = await User.findById(user_id);
            const email = user.email;
            send_mail(email, "Appointment Reminder!", txt + hour.toString());
        }
        if (date_appointments.time_intervals[(parseInt(hour, 10) + 0.5).toString()] !== null) {
            const user_id = date_appointments.time_intervals[hour + 0.5];
            const user = await User.findById(user_id);
            const email = user.email;
            send_mail(email, "Appointment Reminder!", txt + (parseInt(hour, 10) + 0.5).toString());
        }
    } catch (error) {
        console.log('Error crontabing: ', error);
        return res.status(500).send('Error crontabing');
    }
})

/*************************************************************************************/

/************************************ Multer Section ************************************/
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/sendcomplaint', upload.single('file'), async (req, res) => {
    try {
        const { user_email, subject, complaint } = req.body;
        // Fetching user to attach to complaint
        const user = (await User.findOne({ email: String(user_email) }));
        if (req.file && req.file.filename) {
            Complaint.create({
                user: user, subject: subject,
                complaint: String(complaint),
                file_path: 'uploads/' + req.file.filename
            });
        } else {
            Complaint.create({
                user: user, subject: subject,
                complaint: String(complaint)
            });
        }
        res.json('Saved');
    } catch (error) {
        console.log('Error saving complaint: ', error);
        return res.status(500).send('Error saving complaint');
    }
})

/******************************** send mail to client ********************************/

router.post('/sendcomplaintresponse', upload.single('file'), async (req, res) => {
    try {
        const { user_id, complaintResponse, complaint_id } = req.body;
        console.log(complaint_id);
        const user = await User.findById(user_id);
        const complaint = await Complaint.findById(complaint_id);
        const subject = complaint.subject;
        if (req.file && req.file.filename) {
            const file_name = 'uploads/' + req.file.filename;
            send_mail(user.email, subject, 'You recieved a response to a complaint, Log In to the website to view it');
            complaint_response = await ComplaintResponse.create({
                complaint: complaint, user: user,
                response: complaintResponse, file_path: file_name
            })
        } else {
            send_mail(user.email, subject, 'You recieved a response to a complaint, Log In to the website to view it');
            complaint_response = await ComplaintResponse.create({
                complaint: complaint, user: user,
                response: complaintResponse
            })
        }
        complaint.addressed = true;
        await complaint.save();
        res.json("Response Sent!");
    } catch (error) {
        console.log('Error sending complaint response: ', error);
        return res.status(500).send('Error sending complaint response');
    }
})

/*************************** send complaints to accountant ***************************/

router.get('/getcomplaints', async (req, res) => {
    try {
        const complaints = await Complaint.find({ addressed: false });
        complaints.sort((a, b) => {
            return a.date - b.date;
        });
        let result = [];
        for (let complaint of complaints) {
            const user_name = (await User.findById(complaint.user)).name;
            result.push({
                id: complaint._id, complaint: complaint.complaint, date: complaint.date,
                file_path: complaint.file_path, subject: complaint.subject, user: complaint.user,
                user_name: user_name
            })
        }
        res.json(result);
    } catch (error) {
        console.log('Error getting complaint: ', error);
        return res.status(500).send('Error getting complaint');
    }
})

/*************************************************************************************/

/*************************** send complaints responses to user ***************************/

router.get('/getusercomplaintsresponses', async (req, res) => {
    try {
        const { user } = req.query;
        const userRecord = await User.findOne({ email: user.email }).lean();
        if (!userRecord) {
            return res.status(404).json({ error: "User not found" });
        }

        const user_id = userRecord._id;

        const user_responses = await ComplaintResponse.find({ user: user_id })
            .populate('complaint')
            .lean(); // Use .lean() for better performance

        const result = user_responses.map(response => ({
            id: response._id,
            complaint_subject: response.complaint.subject,
            user_name: user.name,
            complaint: response.complaint.complaint,
            complaint_file_path: response.complaint.file_path,
            response: response.response,
            file_path: response.file_path,
            date: response.date
        }));

        result.sort((a, b) => b.date - a.date);

        res.json(result);
    } catch (error) {
        console.log('Error getting user complaints responses: ', error);
        return res.status(500).send('EError getting user complaints responses');
    }
})

/*************************************************************************************/

/*************************** send complaints responses to accountant ***************************/

router.get('/getcomplaintsresponses', async (req, res) => {
    try {
        const responses = await ComplaintResponse.find({})
            .populate('user')
            .populate('complaint')
            .lean(); // Use .lean() for better performance

        const result = responses.map(response => ({
            id: response._id,
            complaint_subject: response.complaint.subject,
            user_name: response.user.name,
            complaint: response.complaint.complaint,
            complaint_file_path: response.complaint.file_path,
            response: response.response,
            file_path: response.file_path,
            date: response.date
        }));

        result.sort((a, b) => b.date - a.date);

        res.json(result);
    } catch (error) {
        console.log('Error getting complaints responses: ', error);
        return res.status(500).send('Error getting complaint responses');
    }
})

/*************************************************************************************/

/******************************** send file to client ********************************/

router.get('/getfile', async (req, res) => {
    try {
        const { file_path } = req.query;
        res.download(file_path);
    } catch (error) {
        console.log('Error sending file: ', error);
        return res.status(500).send('Error sending file');
    }
})

/*************************************************************************************/

module.exports = router;