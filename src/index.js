import express from 'express'
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import {join,dirname} from 'path'
import { fileURLToPath } from 'url';
// Inicializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))

// Configuraion
app.set('port', process.env.PORT || 3000);
app.set("views", join(__dirname, 'views'));
app.engine(".hbs", engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Rutas
app.get('/', (req,res)=>{
    res.render('index');
});

//Archivos publicos
app.use(express.static(join(__dirname, 'public')));

// Run server
app.listen(app.get('port'), ()=>console.log('Server listening on port', app.get('port')));