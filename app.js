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
const {registerRouter} = require("./routers/login/register");
const {authRouter} = require("./routers/login/auth");
const {verifyJwt} = require("./middlewares/veryfiyJwt");
const {refreshRouter} = require("./routers/login/refresh");
const {logoutRouter} = require("./routers/login/logout");
const {loginRouter} = require("./routers/login/login");
const credentials = require("./middlewares/credentials");
//const {handleError} = require("./utils/error");


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
    // helpers: handlebarsHelpers,
}));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

// ROUTERS
app.use('/', homeRouter);
app.use('/re/login', loginRouter);
app.use('/re/register', registerRouter);
app.use('/re/auth', authRouter);
app.use('/re/refresh', refreshRouter);
app.use('/re/logout', logoutRouter);


// app.use(verifyJwt);
app.use('/re/flats', flatsRouter);
app.use('/re/houses', housesRouter);
app.use('/re/plots', plotsRouter);
app.use('/re/api', apiRouter);


app.get('/test', (req, res) => {
    res.send('Hi.')
})

//app.use(handleError);

app.listen(3000, 'localhost', () => {
    console.log('Starting server on http://localhost:3000');
});