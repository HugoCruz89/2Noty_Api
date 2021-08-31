const express= require('express');
require('dotenv').config();

const app = express();

// Directorio Público
app.use(express.static('public'))

// Lectura y parceo del body
app.use(express.json())

//RUTAS
app.use('/api/auth', require('./routes/auth'))

// escuchar peticiones
app.listen(process.env.PORT,()=>{
    console.log(`servidor corriendo ${process.env.PORT} `)
})
