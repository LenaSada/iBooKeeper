const express = require('express');
const router = express.Router();
const cors = require('cors');
const User = require('./user')
const jwt = require('jsonwebtoken');
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

module.exports = router;