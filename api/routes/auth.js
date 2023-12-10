const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

//Register
router.post('/register',async(req,res)=>{
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)

        //create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });

        //save user and return response
        const user = await newUser.save();
        res.status(200).json(`Congratulations ${req.body.username}, you have successfully registered. You can login now!`);
    }catch(err){
        res.status(500).json(err)
    }

})


//Login
router.post('/login',async(req,res)=>{
  try{
    //checking email
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(404).json("user not found");

    //checking encrypt pwd
    const validPwd = await bcrypt.compare(req.body.password,user.password);
    if(!validPwd) return res.status(404).json("password is wrong");

    // const token = generateToken(user); 
    res.status(200).json(
      {
            message: "Login successful",
            // token: token,
            user: {
                _id: user._id
            }
          }
    );

  }catch(err){
    res.status(500).json(err)
  }
})

module.exports = router;