// Express, body-parser, mongoose, nodemon
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

// *** Upload Images
var multer = require('multer');
var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: "hros8ekbx", 
    api_key: 216132947267715,
    api_secret: "5EfTBvLVtVTCU6MzefuUZxnzvxg"
});
var cloudinaryStorage = require('multer-storage-cloudinary');
// Config cloudinary storage for multer-storage-cloudinary
var storage = cloudinaryStorage.createCloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'api-images', // give cloudinary folder where you want to store images
    allowedFormats: ['jpg', 'png'],
  });
var parser = multer({ storage: storage });
// ***

app.post('/upload', parser.single('image'), function (req, res) {
    console.log(req.file);
    res.status(201);
    res.json(req.file);
});


///users/6037c1893b80f3000405c88b/postings/6037c1c63b80f3000405c88c

app.get('/', function(req, res) {
  res.send("Welcome to My API, NOIRAUD Loreleï");
});

app.use('/users', usersRoutes);
app.use('/postings', postingsRoutes);


app.listen(app.get('port'), function() {
  console.log('App is running on port',app.get('port'));
});
