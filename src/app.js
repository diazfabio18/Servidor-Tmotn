//configuracion basica del servidor con Framework express
const express = require('express');
const morgan = require('morgan'); //Informacion de peticiones http
const multer = require('multer'); //captura y condiguracion de archivos multimedia
const path = require('path');

const cors = require('cors'); // peticiones desde otros dominios

const engine = require('ejs-mate'); //motor de plantillas
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Inicializaciones
const app = express();
require('./database'); 
require('./passport/local-auth');

//configuracion del servidor
app.set('port',process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');

//Middlewars
app.use(morgan('dev'));
app.use(cors()); //evito problemas de cors
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Configuracion de destino cuando multer obtiene una image
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req,file,cb) =>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({storage}).single('image')); //a traves del campo image de html multer va a saber si hay imagen

app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
  }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
  
//Configuracion de mensajes entre paginas
app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  next();
});

//Rutas
app.use(require('./routes/routes'));

app.use(require('./routes/logueo'));

//carpeta necesaria para utilizar archivos estaticos
app.use(express.static(__dirname + '/publico'));

//exporto el modulo app
module.exports = app;