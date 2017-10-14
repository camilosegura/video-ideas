const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
require('./models/Idea');
const port = 3000;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/video-ideas-dev', {
  useMongoClient: true
})
  .then(() => {
    console.log('Mongo Connected...');
  })
  .catch(e => console.log(e));


const Idea = mongoose.model('ideas');

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.get('/', (req, res) => {
  const title = 'Index Page';
  res.render('index', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
