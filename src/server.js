const express = require('express');
const app = express();
const path = require('path');
const mg = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const hbs = require('hbs');

require('./config/config');

//PASSPORT
require('./lib/passport');

//BODY-PARSER
app.use(express.urlencoded({ extended: false }));
// PARE APLLICATION/JSON
app.use(express.json());

//FLASH
app.use(
  session({
    secret: 'estaEsUnaClaveDeDivina',
    resave: true,
    saveUninitialized: true,
  })
);

//MIDELWARES
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//COFIGURACIONES
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/public/partials');

//VARABLES GLOBALES
app.use((req, res, next) => {
  res.locals.err = req.flash('err');
  res.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

//RUTAS
app.use(require('./rutas'));

//ARCHIVOS ESTATICOS
app.use(express.static(path.resolve(__dirname, './public')));

//DB
mg.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
  if (err) throw err;
  console.log('Data base is alive in port ', 3000);
});

//SERVIDOR
app.listen(process.env.PORT, () => {
  console.log('Servidor en puerto', process.env.PORT);
});
