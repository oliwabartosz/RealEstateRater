const express = require('express');

const flatsRouter = express.Router();

flatsRouter
    .get('/test', (req, res) => {
        res.send('Hello, sir!')
    })

module.exports = {
    flatsRouter,
}