const express = require('express');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', require('./routes'));
app.listen(process.env.PORT, () => console.log(`Server is running ${process.env.PORT}`));