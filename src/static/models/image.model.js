// importar mongoose
import mongoose from "mongoose";

// definir esquema de usuario
const imageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
    }
);

// creo un modelo
const Image = mongoose.model('images',imageSchema);

export default Image;