//llamo a la configuracion del server app
const app = require('./app');

async function init(){
    await app.listen(app.get('port'));
    console.log('Servidor iniciando en puerto: ', app.get('port'));
}

//Inicio el servidor
init();