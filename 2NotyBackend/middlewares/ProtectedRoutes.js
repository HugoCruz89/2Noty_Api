const { response } = require("express");
const jwt= require('jsonwebtoken')
const config= require('./../configs/config')
const security=( token,res= response) => {
   
    if (token) {
      jwt.verify(token, config.llave, (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 }
 module.exports={security}

//  const token = req.headers['access-token'];
//  console.log('token',token)
//   if (token) {
//     jwt.verify(token, config.llave, (err, decoded) => {      
//       if (err) {
//         return  res.status(200).json({
//           ok: false,
//           msg:'Token no proveída.' ,
//         });  
//       } else {
//         req.decoded = decoded;    
//        console.log('req.decoded',req.decoded)
//       }
//     });
//   } else {
//     res.status(200).json({
//       ok: false,
//       msg:'Token no proveída.' ,
//     });
   
//   }