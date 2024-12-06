# Programacion_Web
Vista Web del proyecto parroquial

Para el funcionamiento de la aplicacion es necesario tener
    Node.js -----> https://nodejs.org/en

Una ves clonado el repositorio hay que instalar:
    express
    express-handlebars
    morgan
    mysql2
POR LO QUE HAY QUE EJECUTAR EL SIGUIENTE COMANDO:
copien sin las "" en la terminal del proyecto
    "npm i "

Una ves instalado los modulos hay que asegurarse de que en
archivo package.json este en el apartado de scripts el comando
    "dev": "nodemon ./src/index.js",
    "build:css": "npx tailwindcss -i ./src/public/css/tailwind.css -o ./src/public/css/output.css --watch",
    "start": "concurrently \"npm run dev\" \"npm run build:css\""

Ahora si para usar l pagina en la terminal usen el comando
    "npm run start"

y podran ingresar desde cualqueir navegador web:
    localhost:3000
