// Express, body-parser, mongoose, nodemon
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./models/dbConfig');
const usersRoutes = require('./routes/usersController')
const postingsRoutes = require('./routes/postingsController')
const mongoose = require('mongoose');
const port = 3000;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());

app.use('/users', usersRoutes);
app.use('/postings', postingsRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
