import dotenv from 'dotenv';
//seteamos las variables de entorno
dotenv.config({path: './src/env/.env'});

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// importar routes
import authRoutes from './static/routes/auth.routes.js';
import imageRoutes from './static/routes/images.routes.js';

// crear app
const app = express();

//configurar cors, listDomain='lista de sitios permitidos'
const listDomain = [
    process.env.HOST_FRONTEND
];
//opciones de CORS
const corsOpcions = {
    origin: function(origin,callback){
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
app.use('/', cors(), authRoutes);
app.use('/', cors(), imageRoutes);

// iniciar servidor
app.listen(app.get('port'), () => {
    console.log(`servidor escuchando en puerto ${app.get('port')}`);
});