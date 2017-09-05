const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('Sequelize');

const app = express();

app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');

// needed to access req.body from forms!
app.use(bodyparser.urlencoded({ extended: true }));

/*********TODO LIST SCHEMA*****************/
//my username is my firstlast name w/ no spaces - all lower caps

const db = new Sequelize('todolist', 'stevehorlback', '', {
  dialect: 'postgres',
});

const JustDo = db.define('mylist', {
  todo: Sequelize.STRING,
  start: Sequelize.BOOLEAN,
});

app.get('/', function (req, res){

      JustDo.findAll({
        order: [
          ['createdAt', 'DESC']
        ]
      }).then(function (justdoit) {
          res.render('list', {
              mylist: justdoit, // todo: get info from database
          });
      });
  });

  app.get('/add', function (req, res) {
        res.render('add');
    });

//changing value from Are you done to finished because start: Sequelize.BOOLEAN. I didn't have the below start: true in my app.post


    app.post('/mylist', function (req, res) {
        JustDo.create({
            todo: req.body.todo,
            start: true,
        }).then(function () {
            // Wait until insert is finished, then redirect.
            res.redirect('/');
        });
    });

    app.post('/startThat/:theList', function (req, res) {
            const id = parseInt(req.params.theList);


            JustDo.update({
                start: true
            }, {
                where: {
                    id: id,
                },
                  order: [
                    ['createdAt', 'DESC']
                  ]
            }).then(function() {
                res.redirect('/');
            });
        });

      app.post('/startThis/:theList', function (req, res)
        {
        const id = parseInt(req.params.theList);


        JustDo.update({
            start: false},
        {
            where: {
                id: id,
            },
            order: [
              ['createdAt', 'DESC']
            ]
        }).then(function() {
            res.redirect('/');
        });
        });



      app.post('/delete/:theList' , function (req, res){
      let id  = req.params.theList;
      JustDo.destroy({


          where: {
              id: id,
          },

      }).then(function() {
          res.redirect('/');
      });
      });

      app.listen(3005, function () {
  console.log('Keep At It!')
});
