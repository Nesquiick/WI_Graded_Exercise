/* 
The paths :
  /postings/category/{name}
  /postings/location/{place}
  /postings/date
  /users/{user_id}/postings/{posting_id}/upload

  are not implemented.
  See README to learn more.

*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./models/dbConfig');
const usersRoutes = require('./routes/usersController')
const postingsRoutes = require('./routes/postingsController')
const mongoose = require('mongoose');

app.set('port', (process.env.PORT || 80));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send("Welcome to My API, NOIRAUD Loreleï");
});

app.use('/users', usersRoutes);
app.use('/postings', postingsRoutes);

app.listen(app.get('port'), function() {
  console.log('App is running on port',app.get('port'));
});
