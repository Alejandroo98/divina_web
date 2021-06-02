const bcrypt = require("bcryptjs");
const helpers = {};

helpers.encryptPassword = async ( password ) => { //encryptPassword son nombres creados por nosotros igual el de abajo
    const salt =  await bcrypt.genSalt(10); //Este simplemente es el tipo de sifrado
    const hash = await bcrypt.hash( password , salt );
    return hash 
};

helpers.matchPassword = async ( password , savedPassword ) => {
    try {
        return await bcrypt.compare( password , savedPassword ) //password es la clave que nos envia el usuario tal cual, y savedPassword es la contraseña guardad en la base de datos con la que comparara la contraseña ingresada
    } catch (error) {
        console.log(error);
    }

};

module.exports = helpers;