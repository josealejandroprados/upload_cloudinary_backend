//importamos express
import express from 'express';
//creamos un metodo router
const router = express.Router();

// importamos multer
import multer from 'multer';

// Configurar Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// importamos controllers
import {
    addImageController,
    deleteImage,
    getAllImages,
} from '../controllers/images.controller.js';

// importar middleware isAuth
import { isAuth } from '../middlewares/auth.js';
import { check, body } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';


router.post(
    '/addimage',
    isAuth,
    upload.single('imagen'),
    [
        check('nombre','el nombre es obligatorio').notEmpty()
    ],
    validarCampos,
    addImageController
);

router.get('/getimages', isAuth, getAllImages);

router.delete(
    '/deleteimage',
    isAuth,
    [
        check('id','El id es obligatorio').notEmpty(),
        check('public_id','Es obligatorio el public_id').notEmpty()
    ],
    validarCampos,
    deleteImage
);

export default router;