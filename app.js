const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const port = 3000;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/video-ideas-dev', {
  useMongoClient: true
})
  .then(() => {
    console.log('Mongo Connected...');
  })
  .catch(e => console.log(e));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg  = req.flash('success_msg');
  res.locals.error_msg  = req.flash('error_msg');
  res.locals.error  = req.flash('error');

  next();
})

app.get('/', (req, res) => {
  const title = 'Index Page';
  res.render('index', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
