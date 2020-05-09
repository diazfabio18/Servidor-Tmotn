const router = require('express').Router();
const passport = require('passport');
const path = require('path');

const user_model = require('../models/user.js');
const media_model = require('../models/media.js');
const media_juli = require('../models/media_juli.js');

const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
    /*cloud_name: 'dynuxoctm',
    api_key: '226813993954677',
    api_secret:'_HG5hTTep4uWCQj1Y7Fdi1czKls'*/
});

const fs = require('fs-extra');

/*
router.get('/', (req, res, next) => {
  res.render('index');
});*/

/*
router.get('/signup', (req, res, next) => {
  res.render('signup');
});


router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 
*/

router.get('/signin', (req, res, next) => {
  res.render('signin');
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

function conversion(dato1){
  var dias = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  
  var semana = dato1.getDay();

  var dateStr =
  dias[semana]+ " " +
  ("00" + dato1.getDate()).slice(-2) + "/" +
  ("00" + (dato1.getMonth() + 1)).slice(-2) + "/" +
  dato1.getFullYear() + " " +
  ("00" + dato1.getHours()).slice(-2) + ":" +
  ("00" + dato1.getMinutes()).slice(-2) + ":" +
  ("00" + dato1.getSeconds()).slice(-2);
  return dateStr
}

router.get('/profile',isAuthenticated, async (req, res, next) => {
  
  const dato = await user_model.find({username: 'julieta'});

  const dato1 = dato[0].ult_conexion;

  const dateStr = conversion(dato1);
  const dateFabio = conversion(req.user.ult_conexion);

  const info = {
    nombre: req.user.username,
    ult_conexion: dateFabio,
    data: dateStr
  };
  res.render('profile',{info});

});

router.get('/profile/add',isAuthenticated, async(req, res, next) => {
  //const nombre = req.user.username;
  var todos;

  if(!((req.user.username).localeCompare("fabio"))){
    todos = await media_model.find();
  }
  else if(!((req.user.username).localeCompare("julieta"))){
    todos = await media_juli.find();
  }

  var numero1;
  var todos1;
  if(todos[0]){
    todos1 = await todos.reverse();
    //console.log(todos1);
    numero1 = (todos1[0]).numero;
  }
  else{
    numero1 = 0.9;
  }

  res.render('profile-add',{numero1});
});


router.get('/profile/list',isAuthenticated, async (req, res, next) => {

  if((req.user.username).localeCompare("fabio") == 0){
    const todos = await media_model.find();
    res.render('profile-list', {todos});
  }
  else if((req.user.username).localeCompare("julieta") == 0){
    const todos = await media_juli.find();
    res.render('profile-list', {todos});
  }

});

router.post('/profile/imagenes/add',isAuthenticated, async (req,res,next)=>{
      
      console.log(req.file);
      //recibo los datos del body de media
      const {fecha,numero,alt,enlace,parrafo}=req.body;
      const alt2 = numero;
      //Como fecha es un String recibido, cambio su formato de fecha
      var fecha2;
      if(!fecha){
        fecha2 = '???';
      }
      else{
        fecha2 = fecha.split("-").reverse().join("/");
      }
      //console.log(fecha2);
      console.log('empiezo a subir el video');
      //subo a cloudinary el archivo de uploads recibido previamente por multer
      var result;

        if(path.extname(req.file.path) == '.mp4'){
          console.log('voy a subir un video');
          const superq = (req.file.filename).split('.');
          console.log(superq);

          result = await cloudinary.v2.uploader.upload(req.file.path, 
          { resource_type: "video", 
            public_id: superq[0],
            chunk_size: 6000000,
            eager: [
              { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
              { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
            eager_async: true,
            eager_notification_url: "https://localhost:3000/" },
          function(error, result) {console.log(result, error)});

          console.log('terminando de subir el video');
        }
        else{

        result = await cloudinary.v2.uploader.upload(req.file.path);
        }
      console.log('termino de subir el video');

      if((req.user.username).localeCompare("fabio") == 0){
            const  nuevo_post = new media_model({
              fecha: fecha2,
              numero: numero,
              alt: alt2,
              enlace: enlace,
              parrafo: parrafo,
              imgURL: result.url,
              public_id: result.public_id
          });

          //guardo en la base de datos
          await nuevo_post.save();
      }
      else if((req.user.username).localeCompare("julieta") == 0){
            const  nuevo_julipost = new media_juli({
              fecha: fecha2,
              numero: numero,
              alt: alt2,
              enlace: enlace,
              parrafo: parrafo,
              imgURL: result.url,
              public_id: result.public_id
          });
          
          //guardo en la base de datos
          await nuevo_julipost.save();
      }

      //una vez almacenado, borro la foto de uploads
      await fs.unlink(req.file.path);

      //modo de prueba: respondo con un arary json
      //const todos = await media_model.find();
      //res.status(200).json(todos);
     
      res.redirect('/profile/add');
});

//Editar en base de datos
router.get('/images/edit/:photo_id', isAuthenticated,async(req,res)=>{
  const {photo_id}=req.params;
  var data = await media_model.findById(photo_id);

  if(!data){
      data = await media_juli.findById(photo_id);
  }

  data.fecha = (data.fecha).split("/").reverse().join("-"); 
  
  res.render('profile-edit',{data});
  //res.status(200).json(data);
});

router.post('/images/edit/edicion',isAuthenticated,async(req,res)=>{

  const filter = {_id: req.body.identificacion};

  const fecha2 = (req.body.fecha).split("-").reverse().join("/"); 

  const actualizacion = {
    fecha: fecha2,
    numero: req.body.numero,
    alt: req.body.numero,
    enlace: req.body.enlace,
    parrafo: req.body.parrafo
  };

  if(!((req.user.username).localeCompare("fabio"))){
    
    await media_model.findByIdAndUpdate(
      filter,
      actualizacion,
      {new: true}
      );
  }
  else if(!((req.user.username).localeCompare("julieta"))){
    await media_juli.findByIdAndUpdate(
      filter,
      actualizacion,
      {new: true}
      );
  }

  res.redirect('/profile/list');
});


router.get('/logout', async (req, res, next) => {
  
    const filter = {_id: req.user._id};
    const actualizacion = {ult_conexion: Date.now()};

    await user_model.findByIdAndUpdate(
      filter,
      actualizacion,
      {new: true}
      );
  
  req.logout();
  res.redirect('/');
});

//Funcion autenticacion
function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/signin');
}

module.exports = router;

