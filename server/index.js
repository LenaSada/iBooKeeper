const express = require('express');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const {mongoose} = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(() => console.log('Database connected'))
.catch((err) => console.log('Database not connected', err));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/', require('./routes'));
app.listen(process.env.PORT, () => console.log(`Server is running ${process.env.PORT}`));