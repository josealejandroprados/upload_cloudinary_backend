import dotenv from 'dotenv';
//seteamos las variables de entorno
dotenv.config({path: './src/env/.env'});

// importo mongoose para la conexión con la BBDD de MongoDB
import mongoose from "mongoose";

// Conexión a MongoDB Atlas
const db = mongoose.connect(process.env.MONGODB_URI)
.then( () => {
    console.log('Conexión exitosa a la BBDD de MongoDB Atlas');
})
.catch(error => {
    console.log('error al conectarse a la BBDD de MongoDB Atlas',error);
    console.log(process.env.MONGODB_URI)
});


export {
    db
}