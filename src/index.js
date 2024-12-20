import dotenv from 'dotenv';
//seteamos las variables de entorno
dotenv.config({path: './src/env/.env'});

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import http from 'http';
import {Server} from "socket.io";

// importar routes
import authRoutes from './static/routes/auth.routes.js';
import imageRoutes from './static/routes/images.routes.js';

import sockets from './sockets.js';

// crear app
const app = express();

//configurar cors, listDomain='lista de sitios permitidos'
const listDomain = [
    process.env.HOST_FRONTEND
];
//opciones de CORS
const corsOpcions = {
    origin: (origin,callback) => {
        if(listDomain.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus:200,
    credentials:true
};

// crear servidor
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: listDomain,
        optionsSuccessStatus:200,
        credentials:true,
        methods: ['GET', 'POST']
    }
});

// usar sockets
sockets(io);

//usar CORS
app.use(cors(corsOpcions));

//setting express
app.set('port', process.env.PORT || 3000);

//configuracion archivos estaticos
app.use(express.static('./src/static'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// usar morgan para ver solicitudes http en consola
app.use(morgan('dev'));

// usar routes
app.use('/', authRoutes);
app.use('/', imageRoutes);

// iniciar servidor
server.listen(app.get('port'), () => {
    console.log(`servidor escuchando en puerto ${app.get('port')}`);
});