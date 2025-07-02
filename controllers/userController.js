const User = require('../model/userModel');
exports.updateUser = async(req,res,next)=>{
   try{
     const{firstname,lastname,email,location} = req.body;
    if(!firstname || !lastname || !email || !location){
        next('please provide all fields');
    }
    const user = await User.findOne({_id:req.user.userId})
    if(!user){
        next('user not found');
    }
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.location = location;

    await user.save();
    const token = user.createJWT()
    res.status(200).json({
        user,token
    })
   }catch(error){
    console.log(error);
   }
}