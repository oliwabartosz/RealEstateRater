import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import {Application, json, Request, Response, static as expressStatic} from "express";
import * as cookieParser from 'cookie-parser';
import {engine} from "express-handlebars";
import {handlebarsHelpers} from "./utils/handlebars-helpers";

import cors from 'cors';

import path from "path";
import bodyParser from "body-parser";


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