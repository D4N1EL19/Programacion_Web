import express from 'express'

// Inicializacion
const app = express();

// Configuraion
app.set('port', process.env.PORT || 3000);
// Middlewares

//Rutas

//Archivos publicos

// Run server
app.listen(app.get('port'), ()=>console.log('Server listening on port', app.get('port')));