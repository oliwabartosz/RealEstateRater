const express = require('express');

const apiRouter = express.Router();

apiRouter
    .get('/', (req, res) => {
        res.redirect('/')
    })

module.exports = {
    apiRouter,
}