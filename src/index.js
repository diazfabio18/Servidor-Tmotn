//llamo a la configuracion del server
/*const app = require('./app');


async function init(){
    await app.listen(app.get('port'));
    console.log('Servidor iniciando en puerto: ', app.get('port'));
}
*/
//llamo al puerto
//init();

const express = require('express');
const app = express(); /* me facilita el server */
const path = require('path'); /* directorio actual */
const morgan = require('morgan'); /* muestra data de peticiones http */
const cors = require('cors'); /* peticiones desde otros dominios */

app.use(morgan('tiny')); /*middleware*/
app.use(cors()); /*evito problemas de cors */
app.use(express.json());

app.use(express.urlencoded({extended: true}));

/*configuro ruta raiz del servidor */
/*app.get('/', function(req,res){
    res.send('Hola a etodos!!!!1!');
});*/

/* **************** Conexoin DB ********** */
const mongoose = require('mongoose');
//const uri = 'mongodb://localhost:27017/mibase'; /* conexion local */
const uri = 'mongodb+srv://fabio:tmotn23xj@clustertmotn-vvcw8.mongodb.net/tmotn?retryWrites=true&w=majority';
//const uri = process.env.MONGODB_URI;

const options = {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(uri,options).then(
    () => {console.log('conectando a mongoose xdd');},
    err => {err}
);
/* *****************  */

/* middewlare paara vuejs mdo historia*/
const history = require('connect-history-api-fallback');
app.use(history());
/* sitio web statico */
app.use(express.static(path.join(__dirname,'dist')));
/*path para acceder a encontrar rutas sin especificar */
/*middewlare:  funciones que se requieren
antes de que nosotros consumamos
nuestras rutas, en este caseo: tiny*/ 

//const indexRouter= require('./routes/nota');
//const usersRouter= require('./routes/users');

app.use('/',require('./routes/routes'));
// Usamos las rutas
//app.use('/nota', indexRouter);
//app.use('/users', usersRouter);
//app.use('/login', require('./routes/login'));

app.set('puerto', process.env.PORT || 3000);
/*configuro puerto */
app.listen(app.get('puerto'),function(){
    console.log('Escuho al ', app.get('puerto'));
});