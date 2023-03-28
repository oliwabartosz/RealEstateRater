const express = require('express');

const plotsRouter = express.Router();

plotsRouter
    .get('/', (req, res) => {
        res.redirect('/')
    })

module.exports = {
    plotsRouter,
}