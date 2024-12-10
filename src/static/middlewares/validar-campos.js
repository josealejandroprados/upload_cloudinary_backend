// import express from 'express';
import { validationResult } from 'express-validator';


function validarCampos(req,res,next){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            message:'error',
            errors: errors.array()
        });
    }

    next();
}

export {
    validarCampos
}