const express = require('express');
const router = express.Router();
const cors = require('cors');
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

module.exports = router;