const User = require('../model/userModel');

  /*
  with the use of express-async-errors no need to use try catch block
  but prefer to use try catch block 
   */

exports.registerUser = async(req,res,next)=>{
    try{
        const  {firstname,email,password,lastname} =req.body;
        if(!firstname && !email && !password && !lastname){
           next('invalid credentials');
        }
        const exuser = await User.findOne({email});
        if(exuser){
           next('user already exist');
        }
        const user = await User.create({email,password,firstname,lastname });
        const token = user.createJWT();
        res.status(201).json({
            success:true,
            messag:'user created successfully',
            user:{
                name:user.firstname,
                email:user.email,
                location:user.location
            },token
        })

    }catch(error){
        next(error);
    }
}

exports.login = async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email,!password){
        next('please provide credentials');
    }
    const exuser = await User.findOne({email}).select("+password");
    if(!exuser){
        next('user not found');
    }
    const isMatch = await exuser.comparepassword(password);
    if(!isMatch){
        next('invalid username or password');
    }
    const token = exuser.createJWT();
    res.status(200).json({
        success:true,
        message:'login successfull',
        exuser,
        token
    })
}
