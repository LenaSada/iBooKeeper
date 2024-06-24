const express = require('express');
const router = express.Router();
const cors = require('cors');
const User = require('./user')
const jwt = require('jsonwebtoken');
const Appointments = require('./appointments')
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
    }
})

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
            available_hours.push({ val, user_name, id });
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
    }
});

router.post('/getreservedtimes', async (req, res) => {
    try {
        const { date_formatted } = req.body;
        available_hours = await getTimes(date_formatted, false);
        res.json(available_hours);
    } catch (error) {
        console.log("Error getting reserved times: ", error);
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

router.post('/setappointment', async (req, res) => {
    try {
        const { date_formatted, time, user } = req.body;
        // date used to fetch the specific appointment
        const date = date_formatted.substring(0, 10);
        // Fetching user to attach to appointment
        const user_id = (await User.findOne({ email: user.email })).id;
        // Index of the time_intervals in the appointments date
        const index = Number(time.substring(0, 2)) + Number(time[3]) / 6;
        const appointment = await Appointments.findOne({ date: date });

        console.log(index);
        console.log(appointment.time_intervals[index]);

        const updatedTimeIntervals = { ...appointment.time_intervals, [index]: user_id };
        appointment.time_intervals = updatedTimeIntervals;
        await appointment.save();

        res.json('Appointment Set!')
    } catch (error) {
        console.log('Error signing in: ', error);
    }
});

module.exports = router;