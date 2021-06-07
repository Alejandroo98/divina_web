const express = require('express');
const app = express();
const path = require('path');
const Admin = require('./models/admin');
const passport = require('passport');
const { isNotLoggedIn, isLoggedIn } = require('./lib/auth');
const { encryptPassword } = require('./lib/helpers');
const Email = require('./models/email');

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

app.post('/contactos', (req, res) => {
  const { nombres, email, mensaje } = JSON.parse(JSON.stringify(req.body));
  const date = new Date();
  const fechaMensaje = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}`;

  if (nombres === '' || email === '' || mensaje === '') {
    req.flash('err', 'Llena todos los campos');
    res.redirect('back');
    return;
  }

  const emailSave = new Email({
    nombres,
    email,
    mensaje,
    fechaMensaje,
  });

  emailSave.save((err, email) => {
    if (err) {
      req.flash('err', 'A ocurrido un error, intenta mas tarde');
      console.log('err');
      return;
    }

    if (!email) {
      req.flash('err', 'A ocurrido un error, intenta mas tarde');
      console.log('email');

      return;
    }
  });
  req.flash('success', 'Mensaje enviado');
  res.redirect('back');
});

/* LOGIN ADMIN */
app.get('/admin/login', isNotLoggedIn, (req, res) => {
  res.render('views/login.hbs');
});

app.post('/admin/login', (req, res, next) => {
  // const { email, password } = req.body; //para guardar un usuario nuevo
  // guardarAdmin(email, password); //para guardar un usuario nuevo
  // res.redirect('back');//para guardar un usuario nuevo
  const { email, password } = req.body;
  if (email === '' || password === '') {
    req.flash('err', '¡Llena los campos!');
    res.redirect('back');
    return;
  }
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
app.get('/admin/admin', isLoggedIn, async (req, res) => {
  const emails = await Email.find({});
  res.render('views/admin.hbs', { emails });
});

/* ELIMINAR EMAIL */
app.get('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await Email.findOneAndDelete({ _id: id });
  res.redirect('back');
});

/* CERRAR SESION */
app.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/admin/login');
  });
});

module.exports = app;
