const { use } = require('../controllers');
const ratings = require('../models/index');
const user = require('../models/index')


/* Register User */
const registerUser = async (payload = {}) =>
  new Promise((resolve, reject) => {
    const newUser = new user(payload);
    newUser.save()
      .then(resolve)
      .catch(reject);
  });



/* Check Email Already Exist Or Not */  
const checkEmail = async (data) => user.findOne(data)
  .sort()
  .lean()
  .exec(); 
  
  

 
const deleteUser = async (id) => ratings.findByIdAndDelete(id)
  .lean()
  .exec();



module.exports = {  registerUser, checkEmail , deleteUser };
