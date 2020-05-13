//llamo a la configuracion del server
const app = require('./app');


async function init(){
    await app.listen(app.get('port'));
    console.log('Servidor iniciando en puerto: ', app.get('port'));
}

//llamo al puerto
init();