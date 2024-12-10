//importar jwt
import jwt from 'jsonwebtoken';
//importamos bcryptjs
import bcrypt from 'bcryptjs';

// importar modelo User
import User from '../models/user.model.js';

async function registerController(req,res) {
    // obtengo el usuario que viene en el req
    const usuario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: req.body.password,
        rol: req.body.rol || 'user'
    };
    // console.log('user: ',usuario)

    try {
        // verificar si el email se encuentra disponible para registro
        const emailFind = await User.findOne({email:usuario.email});
        
        if(emailFind){
            // email no disponible para registro
            res.status(401).json(
                {
                    message:'error',
                    description:'El email ya está registrado en este sitio, por favor elija otro'
                }
            );
        }
        else{
            // email esta disponible para registro
            
            // encriptar password
            let passHash = await bcrypt.hash(usuario.password,8);
            usuario.password = passHash;

            const user = new User(usuario);
            // insertar usuario
            const data = await user.save();

            res.json(
                {
                    message:'exito',
                    data: data
                }
            );
        }
        
    }
    catch (error) {
        console.log('error al agregar nuevo usuario',error);
        res.status(401).json(
            {
                message:'error',
                error: error,
                description: 'error desconocido'
            }
        );
    }
}

async function loginController(req,res) {
    // obtengo el usuario (email) y password proporcionado por el usuario en el frontend
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        // consulto a la BBDD si existe un usuario con el email proporcionado por el usuario
        const userExist = await User.findOne({email: user.email});

        if(!userExist){
            console.log('usuario no encontrado');
            //usuario (email) no encontrado
            res.json({auth: false, message: "usuario no encontrado"});
        }
        else{
            // si existe el usuario

            // comparar password obtenido de la BBDD con el password ingresado por el usuario en el frontend
            const validPassword = await bcrypt.compare(user.password,userExist.password);

            // verificar si el password que ingresó el usuario es correcto
            if(validPassword){
                // password correcto => generar token con jsonwebtoken
                const token = jwt.sign({id: userExist._id}, process.env.claveSecret);

                res.json({
                    auth: true,
                    token: token,
                    rol: userExist.rol,
                    usuario: user.email,
                    id: userExist._id
                });
            }
            else{
                //password incorrecto
                res.json({auth: false, message: 'Password incorrecto'});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            auth: false,
            message:'Ha ocurrido un error',
            error: error
        })
    }
}

async function deleteUser(req,res) {
    // obtengo el id del usuario como un parámetro de ruta
    const id = req.params.id;

    try {
        const userDelete = await User.findByIdAndDelete(id);

        res.json({
            message:'exito',
            response: userDelete
        });
    } catch (error) {
        console.log('error al eliminar el usuario: ',error);

        res.status(401).json({
            message: 'error',
            error: error
        });
    }
}

async function emailAvailable(req,res) {
    // obtener email como parametro de ruta
    const email = req.params.email;

    try {
        // consulto a la BBDD si existe el email
        const resultado = await User.find({email: email});

        if(resultado[0]){
            // si obtengo un resultado quiere decir que el email ya existe en la BBDD
            // entonces no está disponible para registro
            res.json({available: false});
        }
        else{
            // no obtuve resultado => email si está disponible para registro
            res.json({available: true});
        }
    } catch (error) {
        res.json({available: false});
    }
}

async function getUsers(req,res) {
    try {
        const users = await User.find();

        res.json({
            message: 'exito',
            users: users
        });
    } catch (error) {
        console.log('error: ',error);
        res.status(401).json({
            message: 'error',
            error: error
        });
    }
}

async function getUser(req,res) {
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        res.json({
            message: 'exito',
            user: user
        });
    } catch (error) {
        console.log('error: ',error);
        res.status(401).json({
            message: 'error',
            error: error
        });
    }
}

async function updateUser(req,res) {
    // obtengo el id de la ruta
    const id = req.params.id;

    // obtengo el usuario que viene en el req
    const usuario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        rol: req.body.rol
    };
    
    try {
        const userUpdate = await User.findByIdAndUpdate(id,usuario);

        res.json({
            message: 'exito',
            userupdate: userUpdate
        });
    } catch (error) {
        console.log('error: ',error);
        res.status(401).json({
            message: 'error',
            error: error
        });
    }
}

export {
    registerController,
    loginController,
    deleteUser,
    emailAvailable,
    getUsers,
    getUser,
    updateUser
}