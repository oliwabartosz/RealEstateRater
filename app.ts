import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import {Application, json, Request, Response, static as expressStatic} from 'express';
import cookieParser from 'cookie-parser';
import {engine} from 'express-handlebars';
import cors from 'cors';
import {handlebarsHelpers} from "./config/handlebarHelpers"
import path from "path";
import bodyParser from "body-parser";

// Routers
import {homeRouter} from './routers/home/home';
import {loginRouter} from "./routers/login/login";

// Errors
import {handleError} from "./config/error";
import {authRouter} from "./routers/login/auth";

// Middlewares
import {corsOptions} from "./middlewares/config/corsOptions"; //@TODO: corsOptions
import credentials from "./middlewares/credentials"; //@TODO: credentials
import {verifyJwt} from "./middlewares/verifyJWT";
import {refreshRouter} from "./routers/login/refresh";
import {logoutRouter} from "./routers/login/logout";
import {registerRouter} from "./routers/admin/register";
import {flatsRouter} from "./routers/flats/flats";
import {apiRouter} from "./routers/api/api";
import {housesRouter} from "./routers/houses/houses";
import {plotsRouter} from "./routers/plots/plots"; //@TODO: JWT verify

const app: Application = express();

app.use(express.urlencoded( {
    extended: true,
}));

app.use(credentials)
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.engine('.hbs', engine({
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

app.use(verifyJwt);
app.use('/rer/register', registerRouter)
app.use('/rer/flats', flatsRouter);
app.use('/rer/houses', housesRouter);
app.use('/rer/plots', plotsRouter);
app.use('/rer/api', apiRouter);

app.use(handleError);

app.listen(3000, 'localhost', () => {
    console.log('Starting server on http://localhost:3000');
});