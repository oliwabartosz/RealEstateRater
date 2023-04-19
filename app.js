require('dotenv').config();
const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./middlewares/config/corsOptions')
const cookieParser = require('cookie-parser');
const {flatsRouter} = require("./routers/flats/flats");
const {housesRouter} = require("./routers/houses/houses");
const {plotsRouter} = require("./routers/plots/plots");
const {homeRouter} = require("./routers/home/home");
const {apiRouter} = require("./routers/api/api");
const {registerRouter} = require("./routers/admin/register");
const {authRouter} = require("./routers/login/auth");
const {verifyJwt} = require("./middlewares/verifyJWT");
const {refreshRouter} = require("./routers/login/refresh");
const {logoutRouter} = require("./routers/login/logout");
const {loginRouter} = require("./routers/login/login");
const credentials = require("./middlewares/credentials");
const {handleError} = require("./config/error");
const {handlebarsHelpers} = require("./config/handlebarHelpers");


const app = express();

app.use(express.urlencoded( {
    extended: true,
}));

app.use(credentials)
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.engine('.hbs', hbs.engine({
    extname: '.hbs',
    helpers: handlebarsHelpers,
}));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

// ROUTERS
app.use('/', homeRouter);
app.use('/rer/login', loginRouter);
app.use('/rer/auth', authRouter);
app.use('/rer/refresh', refreshRouter);
app.use('/rer/logout', logoutRouter);

// app.use(verifyJwt);
app.use('/rer/register', registerRouter)
app.use('/rer/flats', flatsRouter);
app.use('/rer/houses', housesRouter);
app.use('/rer/plots', plotsRouter);
app.use('/rer/api', apiRouter);

app.use(handleError);

app.listen(3000, 'localhost', () => {
    console.log('Starting server on http://localhost:3000');
});