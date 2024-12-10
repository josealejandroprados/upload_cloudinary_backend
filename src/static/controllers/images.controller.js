import Image from '../models/image.model.js';

import dotenv from 'dotenv';
//seteamos las variables de entorno
dotenv.config({path: './src/env/.env'});

import { v2 as cloudinary } from 'cloudinary';

// configurar cloudinary
cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME
})

async function addImageController(req,res) {
    const image = req.file;
    // console.log(image);

    if(!image){
        return res.status(402).json({
            message:'No se proporcionó ningun archivo'
        });
    }

    try {
        // cargar imagen en cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'image',
                folder: 'media_nodejs'
            }, // Especificamos que estamos subiendo una imagen
              (error, result) => {
                if (error) {
                  return reject(error);
                }
                resolve(result);
              }
            ).end(image.buffer); // Enviamos el archivo en buffer a Cloudinary
        });

        // Guardar la URL de la imagen en MongoDB
        const imagen = new Image({
            name: req.body.nombre,
            url: result.secure_url,
            public_id: result.public_id
        });
        const imag = await imagen.save();

        res.json({
            message:'exito',
            image: imag
        });
    }
    catch (error) {
        console.log('error: ',error);
        res.status(405).json({
            message:'error',
            error:error
        });
    }
    // 
}

async function getAllImages(req,res) {
    try {
        const images = await Image.find();

        res.json({
            message:'exito',
            images:images
        });
    } catch (error) {
        console.log('error: ',error);
        res.status(401).json({
            message:'error',
            error:error
        });
    }
}

async function deleteImage(req,res) {

    const id = req.body.id;
    const public_id = req.body.public_id;

    try {

        // eliminar imagen de cloudinary usando el public_id
        const resultImageDelete = await cloudinary.uploader.destroy(public_id);
        
        if(resultImageDelete.result=='ok'){
            // imagen eliminada con éxito => eliminar registro en BBDD
            const imageDelete = await Image.findByIdAndDelete(id);

            return res.json({
                message:'exito',
                info: imageDelete
            });
        }
        else{
            // error al eliminar imagen en cloudinary
            return res.status(401).json({
                message:'error',
                error: resultImageDelete.result
            });
        }

    } catch (error) {
        console.log('error al eliminar imagen: ',error);
        res.status(401).json({
            message:'error',
            error:error.message
        });
    }
}


export {
    addImageController,
    getAllImages,
    deleteImage
}