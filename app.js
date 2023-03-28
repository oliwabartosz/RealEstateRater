const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
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
//const {handleError} = require("./utils/error");


const app = express();

app.use(express.urlencoded( {
    extended: true,
}));

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
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);

app.use(verifyJwt);
app.use('/flats', flatsRouter);
app.use('/houses', housesRouter);
app.use('/plots', plotsRouter);
app.use('/api', apiRouter);


app.get('/test', (req, res) => {
    res.send('Hi.')
})

//app.use(handleError);

app.listen(3000, 'localhost', () => {
    console.log('Starting server on http://localhost:3000');
});