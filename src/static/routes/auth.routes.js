//importamos express
import express from 'express';
//creamos un metodo router
const router = express.Router();

// importamos controllers
import {
    registerController,
    loginController,
    getUsers,
    deleteUser,
    getUser,
    updateUser
} from '../controllers/auth.controller.js';

// importar middleware isAuth
import { isAuth } from '../middlewares/auth.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';

import {db} from '../db/db.js'

// ruta inicial
router.get('/', (req,res) => {
    db;
    res.send('Aplicacion de cargar imagenes a drive en funcionamiento');
});

// endpoint registrar un usuario
router.post(
    '/register',
    isAuth,
    [
        check('nombre','el nombre es obligatorio').notEmpty(),
        check('apellido', 'el apellido es obligatorio').notEmpty(),
        check('email','el email es obligatorio y debe ser válido').isEmail(),
        check('password', 'el password es obligatorio').notEmpty()
    ],
    validarCampos,
    registerController
);

// endpoint inicio sesion/login de usuario
router.post(
    '/login',
    [
        check('email','el email es obligatorio y debe ser válido').isEmail(),
        check('password', 'el password es obligatorio').not().isEmpty()
    ],
    validarCampos,
    loginController
);


// endpoint para consultar disponibilidad de email en la BBDD
// router.get('/emailAvailable/:email', emailAvailable);

// end point para obtener todos los usuarios
router.get('/users', isAuth, getUsers);

// end point para obtener un usuario con su id
router.get('/getuser/:id', isAuth, getUser);

// end point para actualizar un usuario con su id
router.put(
    '/updateuser/:id',
    isAuth,
    [
        check('nombre','el nombre es obligatorio').notEmpty(),
        check('apellido', 'el apellido es obligatorio').notEmpty(),
        check('email','el email es obligatorio y debe ser válido').isEmail(),
        check('rol', 'el rol es obligatorio').notEmpty()
    ],
    validarCampos,
    updateUser
);

// end point para eliminar un usuario
router.delete(
    '/deleteuser/:id',
    isAuth,
    deleteUser
);



export default router;