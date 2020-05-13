const {Router} = require('express');

const router = Router();

//require('./logueo');

//model de media
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

router.get('/',async(req,res)=>{

    //encuentro todas las fotos y videos
    //const fotos = await media_model.find();
    res.render('index');
});

/*
router.get('/images/add',(req,res)=>{
    res.render('image_form');
});*/

router.get('/images/all', async(req,res)=>{
    const todos = await media_model.find();
    res.status(200).json(todos);
});

router.get('/images/juli/all', async(req,res)=>{
    const todos = await media_juli.find();
    res.status(200).json(todos);
});



//recibo el json del formulario
router.post('/images/add',async (req,res)=>{

    //recibo los datos del body de media
    const {fecha,numero,alt,enlace,parrafo}=req.body;
    
    //Como fecha es un String recibido, cambio su formato de fecha
    const fecha2 = fecha.split("-").reverse().join("/");

    //console.log(req.body);
    //console.log(req.file);

    //subo a cloudinary el archivo de uploads recibido previamente por multer
    const result = await cloudinary.v2.uploader.upload(req.file.path);

    const  nuevo_post = new media_model({
        fecha: fecha2,
        numero: numero,
        alt: alt,
        enlace: enlace,
        parrafo: parrafo,
        imgURL: result.url,
        public_id: result.public_id
    });

    //guardo en la base de datos
    await nuevo_post.save();

    //una vez almacenado, borro la foto de uploads
    await fs.unlink(req.file.path);

    //modo de prueba: respondo con un arary json
    //const todos = await media_model.find();
    //res.status(200).json(todos);
    res.redirect('/profile/list');
    //res.status(200).json(nuevo_post);
});


router.get('/images/delete/:photo_id',async(req,res)=>{
    const {photo_id}=req.params;
    var img_borrado= await media_model.findByIdAndDelete(photo_id);
    if(!img_borrado){
        img_borrado = await media_juli.findByIdAndDelete(photo_id);
    }
    await cloudinary.v2.uploader.destroy(img_borrado.public_id);

    //res.redirect('/images/add');
    res.redirect('/profile/list');
});



module.exports = router;