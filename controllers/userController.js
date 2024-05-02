const User = require('../models/userModel');

const bcrypt = require('bcrypt')


const securePassword = async(password)=>{
  try {

    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
    
  } catch (error) {
    console.log(error.message);
  }
}

const loadRegister = async(req,res)=>{
  try {
    res.render('registration');
  } catch (error) {
    console.log(error.message);
  }
}

const insertUser = async (req, res) => {
  try {
    const { name, email, mno, password } = req.body;
    let image = ''; // Initialize image variable

    // Check if req.file exists before trying to access its properties
    if (req.file) {
      // If req.file exists, extract the filename
      image = req.file.filename;
    }

    // Validation
    const errors = [];
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    if (!email) errors.push({ field: 'email', message: 'Email is required' });
    if (!mno) errors.push({ field: 'mno', message: 'Mobile number is required' });
    if (!password) errors.push({ field: 'password', message: 'Password is required' });

    if (errors.length > 0) {
      return res.render('registration', { errors });
    }

    // Other validations like email format, password strength, etc., can be added here

    const spassword = await securePassword(password);
    const user = new User({ name, email, mobile: mno, image, password: spassword, is_admin: 0 });
    const userData = await user.save();

    if (userData) {
      return res.render('registration', { message: 'Your registration has been successful' });
    } else {
      return res.render('registration', { message: 'Failed to register. Please try again later' });
    }
  } catch (error) {
    console.log(error.message);
    return res.render('registration', { message: 'An error occurred. Please try again later' });
  }
};



//login user methods started

const loginLoad = async(req,res)=>{

  try {

    res.render('login')

  } catch (error) {

    console.log(error.message);

  }

}

const verifyLogin = async(req,res)=>{
  try {
    
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({email:email});

    if(userData){
     
    const passwordMatch = await bcrypt.compare(password,userData.password)

              req.session.user_id = userData._id;
              res.redirect('/home');

    }
    else{
      res.render('login',{message:"Email and password is incorrect"})
    }

  } catch (error) {
    console.log(error.message);
  }
}


const loadHome = async(req,res)=>{
  try {

    const userData = await User.findById({_id:req.session.user_id});
    console.log("user details",userData);
    res.render('home',{user:userData});
  } catch (error) {
    console.log(error.message);
  }

}


const userLogout = async(req,res)=>{
  try {
    
    req.session.destroy();
    res.redirect('/');


  } catch (error) {
    console.log(error.message);    
  }
}

//user profile edit & update

const editLoad = async(req,res)=>{
  try {
    
  const id = req.query.id;
  const userData = await User.findById({_id:id});

  if(userData){
     res.render('edit',{user:userData});
  }
  else{
     res.redirect('/home');
  }
  } catch (error) {
    console.log(error.message);    
  }
}

const updateProfile = async(req,res)=>{

try {
  if(req.file){
    const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email, mobile:req.body.mno, image:req.file.filename}});
  }
  else{
    const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email, mobile:req.body.mno}});
  }
  res.redirect('/home');
} catch (error) {
  console.log(error.message);
}

}


module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  editLoad,
  updateProfile
 
}