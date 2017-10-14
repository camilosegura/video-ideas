const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

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

app.post('/ideas', (req, res) => {
  const errors = [];

  if (!req.body.title) {
    errors.push({text: 'Please add a title'});
  }

  if (!req.body.details) {
    errors.push({text: 'Please add some details'});
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      erros: erros,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(() => {
        res.redirect('/ideas');
      });
  }
});

app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
      });
    });
});

app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
   .then(idea => {
     idea.title = req.body.title;
     idea.details = req.body.details;

     return idea.save();
   })
   .then(idea => {
     res.redirect('/ideas');
   });
});

app.delete('/ideas/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/ideas')
    })
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
