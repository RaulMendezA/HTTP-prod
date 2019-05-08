const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const auth = require('../middleware/autenticacion.js');
 
const users = JSON.parse(fs.readFileSync('./data/usuarios.json')); //cp,p arcjovp
const keys = JSON.parse(fs.readFileSync('./configuracion/keys.json'));
 
// @route   POST usuarios/login
// @desc    Autenticar usuario y generar token
// @access  Public
router.post('/login', (req, res) => {
    const {usuario, contraseña} = req.body; //como en postman, como envía el usuario
 
    try {
        // Checar usuario y contraseña
        if (!users.find(user => { //usuarios por el 
            return user.contraseña === contraseña && user.usuario === usuario //como en docs json
        })) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }


        console.log('LLegue aca');
 
        // Se agrega payload
        const payload = {
        };
 
        // Expira en 5 minutos
        jwt.sign(
            payload,
            keys.jwtSecret,
            {expiresIn: 300},
            (err, token) => {
                if (err) throw err;
                res.json({token});
            });
 
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
    }
});
 
// @route   POST usuarios/logout
// @desc    Modifica el jwtSecret
// @access  Private
router.post('/logout', auth, (req, res) => {
    const test = {
        "jwtSecret": makeid(30)
    };
    fs.writeFileSync('./configuracion/keys.json', JSON.stringify(test));
    res.status(200).send('User logged out');
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
 
 
module.exports = router;