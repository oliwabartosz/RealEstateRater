const express = require('express');

const housesRouter = express.Router();

housesRouter
    .get('/', (req, res) => {
        res.redirect('/')
    })

module.exports = {
    housesRouter,
}