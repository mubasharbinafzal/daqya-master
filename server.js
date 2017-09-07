var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var sha1 = require('sha1');
var cors = require('cors');
var nodemailer = require('nodemailer');

// use it before all route definitions

var ObjectID = mongodb.ObjectID;

 
var app = express();
app.use(cors())
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server. 
mongodb.MongoClient.connect("mongodb://heroku_60d6qf4w:3n8fv6s42m7bf0vjjgerunclhp@ds163561.mlab.com:63561/heroku_60d6qf4w", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}



//===========================================================================================
// USERS API ROUTES BELOW
//===========================================================================================


var USERS_COLLECTION = "users";


// get all users
app.get("/users/all", function(req, res) {
  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {
      res.status(200).json(docs);  
    }
  });
});

// get user by id
app.get("/user/:id", function(req, res) {
  db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get user.");
    } else {
      res.status(200).json(doc);  
    }
  });
});


// delete user
app.delete("/users/delete/:id", function(req, res) {
  db.collection(USERS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete user");
    } else {
      res.status(204).end();
    }
  });
});

// sign up step 1
app.post("/users/register", function(req, res) {
  var newUser = req.body;
  newUser.createDate = new Date();
  var error = 0

  if (!(req.body.fname || req.body.email)) {
    handleError(res, "Invalid user input", "Must provide a name and email.", 400);
  }

  newUser.password = sha1(newUser.password);
  newUser.password2 = sha1(newUser.password2);

  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {
      // res.status(200).json(docs);  
      for(var i = 0; i < docs.length; i++) {
        if(docs[i].email==newUser.email) {
         error++
        }
      }
      if(error>0){
        res.status(500).json("User already exists");
      }
       else {
          console.log("create")

            db.collection(USERS_COLLECTION).insertOne(newUser, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new user.");
              } else {
                // successfully create user
                res.status(201).json(doc.ops[0]);
                // drivincci_mailer(newUser.name, "Welcome to Drivincci", newUser.email, "Thank you for joining Drivincci. We hope you have a pleasant ride with us.")

              }
            });

        }
    }
  });  
});

// sign up step 2
app.post("/users/update/:id", function(req, res) {
  var newUser = req.body;
  // newUser.createDate = new Date();
  
db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get user");
    } else {
      doc.address = newUser.address
      doc.city = newUser.city
      doc.country = newUser.country
      doc.zip = newUser.zip
      // doc.wallet.payment_methods.push(cc)
    
      db.collection(USERS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, doc, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to update user");
        } else {
          res.status(204).end();
        }
      });
    
    }
  });


});


// login user
app.post("/users/login", function(req, res) {
  var data = req.body;
  var email = data.email;
  var password = sha1(data.password);
  var response = {}
  db.collection(USERS_COLLECTION).findOne({ email: data.email, password: password}, function(err, doc) {
      if (err) {
        response.message = "User not found"
        handleError(res, err.message, response);
      } else {
        response.user = doc
        if(doc==null) {
          response.message = "Cannot login"
        } else {
          response.message = "Logged In"
        }
        res.status(200).json(response);
      }
  });
});


// user post
app.post("/users/post/:id", function(req, res) {
  var data = req.body;
  data.id = makeid()
  // newUser.createDate = new Date();
  
db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get user");
    } else {
     doc.posts.push(data)
    
      db.collection(USERS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, doc, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to update user");
        } else {
          res.status(204).end();
        }
      });
    
    }
  });
});


// get all posts
app.get("/posts", function(req, res) {
  var posts = []
  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {

      for(var i = 0; i < docs.length; i++) {
        for(var j = 0; j < docs[i].posts.length; j++) {
          docs[i].posts[j].userName = docs[i].fname
          docs[i].posts[j].userLocation = docs[i].city + ", " + docs[i].country
        }
        posts.push(docs[i].posts)
      }
      res.status(200).json(posts);
    }
  });
});

// get post by id
app.get("/posts/:pid", function(req, res) {

 var posts = []
  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {


    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {



      for(var i = 0; i < docs.length; i++) {
        for(var j = 0; j < docs[i].posts.length; j++) {
          docs[i].posts[j].userName = docs[i].fname
          docs[i].posts[j].userLocation = docs[i].city + ", " + docs[i].country
          docs[i].posts[j].userEmail = docs[i].email
        }
        posts.push(docs[i].posts)
      }
      var b = []


      for (var i = 0; i < posts.length; i++) {
        for (var j = 0; j < posts[i].length; j++) {
          b.push(posts[i][j])
        }
      }


      for (var i = 0; i < b.length; i++) {
        if(b[i].id==req.params.pid) {
          res.status(200).json(b[i]);
        }
      }



    }
  });

});


// get all posts
app.get("/opt/:email", function(req, res) {
  
drivincci_mailer("Daqya", "Someone wants you to send something", req.params.email, "Hey, Someone wants you to send something. Please visit daqya.com for more. - This is a beta email.")


          res.status(200).json("Done");
});



//===========================================================================================
// ADMIN API ROUTES BELOW
//===========================================================================================


var ADMINS_COLLECTION = "admins";

// create new admin
app.post("/admins/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  newAdmin.createDate = new Date();

  if (!(req.body.name || req.body.email)) {
    handleError(res, "Invalid user input", "Must provide a name and email.", 400);
  }

  newAdmin.password = sha1(newAdmin.password);

  db.collection(ADMINS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get admins.");
    } else {
      // res.status(200).json(docs);  
      for(var i = 0; i < docs.length; i++) {
        if(docs[i].email==newAdmin.email) {
         error++
        }
      }
      if(error>0){
        res.status(500).json("Admin already exists");
      }
       else {
          // console.log("create")

            db.collection(ADMINS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new admins.");
              } else {
                res.status(201).json(doc.ops[0]);
              }
            });

        }
    }
  });  
});

// login an admin
app.post("/admin/login", function(req, res) {
  var admin = req.body;
  var error = 0
  admin.password = sha1(admin.password);
  db.collection(ADMINS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get admins.");
    } else {
      for(var i = 0; i < docs.length; i++) {
        if(docs[i].email==admin.email && docs[i].password==admin.password) {
          res.status(201).json(docs[0]);
          error++
        }
      }
      if(error==0) {
        res.status(403).json("Login invalid");
      }
    }
  });
});

// get all admins
app.get("/admins/all", function(req, res) {
  db.collection(ADMINS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get admins.");
    } else {
      res.status(200).json(docs);  
    }
  });
});


// delete admin
app.delete("/admins/delete/:id", function(req, res) {
  db.collection(ADMINS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete admin");
    } else {
      res.status(204).end();
    }
  });
});


//===========================================================================================
// make unique ids
//===========================================================================================


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


/*  "/users/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */



// app.put("/users/:id", function(req, res) {
//   var updateDoc = req.body;
//   delete updateDoc._id;

//   db.collection(USERS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to update user");
//     } else {
//       res.status(204).end();
//     }
//   });
// });

// app.delete("/users/:id", function(req, res) {
//   db.collection(USERS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
//     if (err) {
//       handleError(res, err.message, "Failed to delete user");
//     } else {
//       res.status(204).end();
//     }
//   });
// });



//===========================================================================================
// SEND EMAILS
//===========================================================================================


function drivincci_mailer(fullName, subject, email, body) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'drivincci@gmail.com',
        pass: 'drivincci123'
    }
});

var html_body = "<b>Drivincci</b><br/><br/>" + body + "<br/><br/><b> - From Drivincci Team</b>"

let mailOptions = {
    from: '"Drivincci" <drivincci@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: body, // plain text body
    html: html_body // html body
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    // res.status(200).json("Success");
    return;
});

}

