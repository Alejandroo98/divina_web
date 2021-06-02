const express = require('express');
const app = express();
const path = require('path');
const Admin = require('./models/admin');
const passport = require('passport');
const { isNotLoggedIn, isLoggedIn } = require('./lib/auth');
const { encryptPassword } = require('./lib/helpers');

/* RUTA DE LOS VIEWS */
app.set('views', path.resolve(__dirname, 'public'));

/* INDEX */
app.get('/', (req, res) => {
  res.render('index.hbs');
});

/* CONTACTOS */
app.get('/contactos', (req, res) => {
  res.render('views/contactos.hbs');
});

/* LOGIN ADMIN */
app.get('/admin/login', isNotLoggedIn, (req, res) => {
  res.render('views/login.hbs');
});

app.post('/admin/login', (req, res, next) => {
  // const { email, password } = req.body; //para guardar un usuario nuevo
  // guardarAdmin(email, password); //para guardar un usuario nuevo
  // res.redirect('back');//para guardar un usuario nuevo
  passport.authenticate('local_signin', { successRedirect: '/admin/admin', failureRedirect: '/admin/login', failureFlash: true })(req, res, next);
});

const guardarAdmin = async (email, password) => {
  //correo@gmail.com'
  const user = new Admin({
    email,
    password: await encryptPassword(password),
  });

  user
    .save()
    .then((x) => {
      console.log('Datos guardados', x);
    })
    .catch((err) => {
      console.error(err);
    });
};

/* EMAILS ADMIN */
app.get('/admin/admin', isLoggedIn, (req, res) => {
  res.render('views/admin.hbs');
});

/* CERRAR SESION */
app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('back');
});

module.exports = app;
