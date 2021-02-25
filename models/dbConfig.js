const mongoose = require('mongoose');
const uri = "mongodb+srv://dbUserLN:dbUserLNmdp@graded-exercise-cluster.05bgr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(
    uri,
    { useNewUrlParser : true, useUnifiedTopology: true},
    (err) => {
        if (!err) 
            console.log("Mongodb connected");
        else 
            console.log("Connected error : " + err);
    }
)
