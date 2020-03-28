const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = {

    generateUniqueId(){
        return crypto.randomBytes(4).toString('HEX');
    },
    
    encryptPassword(password){
        const salt = bcrypt.genSaltSync(10); //20 primeiros caracteres
        return bcrypt.hashSync(password, salt);
    },
    
    validatePassword(password, encryptedPassword){
        const salt = encryptedPassword.substring(0, 40);
        const testPassword = bcrypt.hashSync(password, salt);
        return (testPassword === encryptedPassword);
    }

}

