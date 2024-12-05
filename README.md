# Programacion_Web
Vista Web del proyecto parroquial

Para el funcionamiento de la aplicacion es necesario tener
    Node.js -----> https://nodejs.org/en

Una ves clonado el repositorio hay que instalar:
    express
    express-handlebars
    morgan
    mysql2

copien sin las "" en la terminal del proyecto
    "npm i express express-handlebars morgan mysql2"

Una ves instalado los modulos hay que asegurarse de que en
archivo package.json este en el apartado de scripts el comando
    "dev": "nodemon ./src/index.js"

Ahora si para usar l pagina en la terminal usen el comando
    "npm dev run"

y podran ingresar desde cualqueir navegador web:
    localhost:3000
