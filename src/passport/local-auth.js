const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

//Verificacion de registro
passport.use('local-signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
 
      const user = await User.findOne({'username': username})
     
      if(user) {
        return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
      } else {
        const newUser = new User({
          username: username,
          password : password,
          media_subidas: 0,
          ult_conexion: Date.now()
        });
        
        newUser.password = await newUser.encriptacion(newUser.password);
       
        await newUser.save();
        done(null, newUser);
      }
}));

//Verificacion de logueo
passport.use('local-signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
    const user = await User.findOne({username: username});
    if(!user) {
      return done(null, false, req.flash('signinMessage', 'Usuario no encontrado'));
    }
    const valor =  await user.validarcontrasenia(password);
    if(!valor) {
      return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
    }
    return done(null, user);
}));