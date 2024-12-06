import express from 'express'
import { engine } from 'express-handlebars';
import session from 'express-session';
import morgan from 'morgan';
import {join,dirname} from 'path'
import { fileURLToPath } from 'url';
import principal from './routes/principal.js'


// Inicializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_FOLDER = join(__dirname, "public", "uploads");
export { __dirname, IMAGES_FOLDER };

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
app.use(session({
    secret: "e16b7c6a03f728b8c3d215fdacbd9f92c4ad3a6760f1d282832bf312bb3d9a85",
    resave: false,
    saveUninitialized: false, 
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Rutas
app.use(principal);

//Archivos publicos
app.use(express.static(join(__dirname, 'public')));

// Run server
app.listen(app.get('port'), ()=>console.log('Server listening on port', app.get('port')));