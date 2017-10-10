// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
var path = require('path');
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname + '/views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Use native promises
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect('mongodb://localhost/mongoosedashboard');
mongoose.Promise = global.Promise;
var MongooseSchema = new mongoose.Schema({
  name: {
    type: String
  },
  info: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})
mongoose.model('Animal', MongooseSchema);

var Animal = mongoose.model('Animal');


app.get('/', function(req, res) {
  // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
  res.render('index');
});
//
app.get('/mongooses/:id', function(req, res) {
  Animal.find({
    _id: req.params.id
  }, function(err, animals) {
    if (err) {
      console.log("error, line 47");
    } else {
      res.render('mongeese', {
        'animal': animals[0]
      });
    }
  })
});
app.get('/mongooses/:id/edit', function(req, res) {
  Animal.find({
    _id: req.params.id
  }, function(err, animals) {
    if (err) {
      console.log("error, line 47");
    } else {
      res.render('edit', {
        'animal': animals[0]
      });
    }
  })


});
app.get('/mongooses/:id/delete', function(req, res) {
  Animal.remove({
    _id: req.params.id
  }, function(err) {
    res.redirect('/mongooses')
  })
})

app.post('/mongooses/:id', function(req, res) {
  console.log("inside edit route", req.params.id);
  console.log("POST DATA", req.body);
  Animal.update({
      _id: req.params.id
    }, {
      name: req.body.name,
      info: req.body.info
    },
    function(err) {
      if (err) {
        console.log("error on line 80");
      } else {
        res.redirect('/mongooses/' + req.params.id)
      }
    })
})

app.post('/mongooses', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var animal = new Animal({
    name: req.body.name,
    info: req.body.info,

  });
  //   // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  animal.save(function(err) {
    // if there is an error console.log that something went wrong!
    if (err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added animal!');
      console.log(animal);
      res.redirect('/mongooses');
    }
  })
})
app.get('/mongooses', function(req, res) {
  Animal.find({}).sort({
    'timestamps': -1
  }).exec(function(err, animals) {
    if (err) {
      console.log(err);
    }
    res.render('mongooses', {
      'animal': animals

      //
    });
    //     // This is the method that finds all of the users from the database
    //     // Notice how the first parameter is the options for what to find and the second is the
    //     //   callback function that has an error (if any) and all of the users
    //     // Keep in mind that everything you want to do AFTER you get the users from the database must
    //     //   happen inside of this callback for it to be synchronous
    //     // Make sure you handle the case when there is an error, as well as the case when there is no error
  })
})
app.listen(8000, function() {
  console.log("listening on port 8000");
});
