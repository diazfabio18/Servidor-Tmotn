//configuracion basica del servidor
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

const cors = require('cors'); /* peticiones desde otros dominios */

/* ***** */
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
/* ***** */

//Inicializaciones
const app = express();
require('./database');
/* ********** */
require('./passport/local-auth');
/* *********** */

//configuracion del servidor
app.set('port',process.env.PORT || 3000);
/* ************* */
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');

/* ************** */

//Middlewars
app.use(morgan('dev'));
app.use(cors()); /*evito problemas de cors */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Configuracion de destino cuando multer obtiene una image
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req,file,cb) =>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({storage}).single('image')); //a traves del campo image multer va a saber si hay imagen

/* *************** */
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
  }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
  
  app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.user = req.user;
    //console.log(app.locals);
    next();
  });
/* *************** */

/* middewlare paara vuejs mdo historia*/
const history = require('connect-history-api-fallback');
app.use(history());
/* sitio web statico */
app.use(express.static(path.join(__dirname,'dist')));

//Rutas
app.use(require('./routes/routes'));

/***** */
app.use(require('./routes/logueo'));
/***** */
//app.use(express.static(__dirname + '/publico'));
//exporto el modulo app
module.exports = app;