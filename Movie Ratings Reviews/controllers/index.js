const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const { saveValidation } = require('../middlewares');
const { movieValidation } = require('../middlewares/movie')
const { ratingValidation } = require('../middlewares/rating')
const {
  checkEmail,
  deleteUser,
  registerUser
} = require('../services');

const { saveMovie, getAllMovie } = require('../services/movie')

const { checkEmailExists, saveRatingComment, listratingsComments, calAvrgRating, getAllRatings, getRatingCount } = require('../services/rating')

const messages = require('../messages')
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


/*Register User:-*/

app.post('/register', saveValidation, async (req, res) => {

  const hash = await bcrypt.hash(req.body.password, 10);

  let email = req.body.email;

  /*Check, User already register*/
 
  let checkUser = await checkEmail({email}).then(user =>{
    if(user){
      res.status(500)
      .send({
        status: false,
        message: messages.message.EXIST,
      })
    } 
    else {
      const newUser = ({
        name: req.body.name,
        email: req.body.email,
        password: hash,
       });
    
      registerUser(newUser)
      .then(user => {
        res.status(200)
            .send({
              status: true,
              message: messages.message.CREATE,
              data: user
            })
      })
      .catch(error => {
        res.status(500)
        .send({
          status: false,
          message: error.message,
          data: error
        })
      })
  
    }
  }) .catch(error => {
    res.status(500)
    .send({
      status: false,
      message: error.message,
      data: error
    })
  })

  })


 /*Login User*/ 

 
app.post('/login', saveValidation, async (req, res) => {

  var newUser = {
    email: req.body.email,
    password: req.body.password
  }

 
  var checkUser = await checkEmail({email:newUser.email}).then(user =>{
    if(!user){
      res.status(500)
      .send({
        status: false,
        message: messages.message.NOT_FOUND,
      })
    } 
    else if(user) {
      bcrypt.compare(newUser.password, user.password, function (error, result){
      if(error){
        res.status(500)
    .send({
      status: false,
      message: error.message,
      data: error
    })
      }else if( result ){
        res.status(200)
            .send({
              status: true,
              message: messages.message.SUCCESS,
              data: result
            })
      }
      })
      
    }
  }) .catch(error => {
    res.status(500)
    .send({
      status: false,
      message: error.message,
      data: error
    })
  })

  })





/*Post Ratings and Comments*/

app.post('/postRating', ratingValidation, async (req, res) => {
  
  let email = req.body.email;

  /*Check, Each user can rate only once in a movie*/
 
  let checkUser = await checkEmailExists({email}).then(user =>{
    if(user){
      if(user.movieName == req.body.movieName){
        res.status(500)
      .send({
        status: false,
        message: messages.message.RATED,
      })
      }else {

        /* Post Rating And Comments */ 
        saveRatingComment(req.body)
           .then(user => {
             res.status(200)
                 .send({
                   status: true,
                   message: messages.message.CREATE,
                   data: user
                 })
           })
           .catch(error => {
             res.status(500)
             .send({
               status: false,
               message: error.message,
               data: error
             })
           })
         }
      
    }
    else
    {

/* Post Rating And Comments */ 
saveRatingComment(req.body)
.then(user => {
  res.status(200)
      .send({
        status: true,
        message: messages.message.CREATE,
        data: user
      })
})
.catch(error => {
  res.status(500)
  .send({
    status: false,
    message: error.message,
    data: error
  })
})

    } 
    
  }) .catch(error => {
    res.status(500)
    .send({
      status: false,
      message: error.message,
      data: error
    })
  })
 
});

/*List All Comments and ratings*/

app.get('/getRatings', async (req, res) => {

  let page = 1,
			limit = 10,
			skip = 0
  if (req.query.page) page = req.query.page
  if (req.query.limit) limit = req.query.limit
    skip = (page - 1) * limit
  
  /*Get Record Count */  

  let ratingCount = await getRatingCount()

  listratingsComments({}, parseInt(skip), parseInt(limit))
    .then(users => {
      res.status(200)
          .send({
            status: true,
            message: messages.message.GET,
            data: users,
            totalRecords: ratingCount
          })
    })
    .catch(error => {
      res.status(500)
          .send({
            status: false,
            message: error.message,
            data: error
          })
    });
});


/*Calculate  Average Ratings of particular user*/

app.get('/calculateArvgRating', (req, res) => {
  calAvrgRating ({})
    .then(users => {
      res.status(200)
          .send({
            status: true,
            message: messages.message.GET,
            data: users
          })
    })
    .catch(error => {
      res.status(500)
          .send({
            status: false,
            message: error.message,
            data: error
          })
    });
});


/*Calculate Total  Rating And Total Rating Average*/

/*
Firt I have calculate total sum of rating then divide total number of rating by total sum of rating.
*/

/*
Note:- This api is just for checking 
*/

app.get('/totalAvrg', (req, res) => {
  getAllRatings()
    .then(users => {
      let sum = 0;
      for (let i = 0; i < users.length; i++) {
        sum += users[i].rating;
      }
      let avg = sum / users.length;
      res.status(200)
          .send({
            status: true,
            message: messages.message.GET,
            totalAverageRating: avg,
            totalRatingCount: sum
          })
    })
    .catch(error => {
      res.status(500)
          .send({
            status: false,
            message: error.message,
            data: error
          })
    });
});

/*delete Rating by id*/
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  deleteUser(id)
    .then(() => {
      res.status(200)
          .send({
            status: true,
            message: messages.message.DELETE,
          })
    })
    .catch(error => {
      res.send(error.message)
    })
});



/* Movies Post Movies, Get Movies */

/* Post Movies */ 

app.post('/addMovie', movieValidation, async (req, res) => {

saveMovie(req.body)
.then(user => {
  res.status(200)
      .send({
        status: true,
        message: messages.message.CREATE,
        data: user
      })
})
.catch(error => {
  res.status(500)
  .send({
    status: false,
    message: error.message,
    data: error
  })
})

})


/*Get Movie*/

app.get('/getMovies', (req, res) => {
  getAllMovie()
    .then(users => {
      res.status(200)
          .send({
            status: true,
            message: messages.message.GET,
           data: users
          })
    })
    .catch(error => {
      res.status(500)
          .send({
            status: false,
            message: error.message,
            data: error
          })
    });
});


module.exports = app;
