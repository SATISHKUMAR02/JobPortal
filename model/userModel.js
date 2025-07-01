const mongoose = require('mongoose');
const validator = require('validator');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname is required']
    },
    lastname: {
        type: String,
        required: [true, 'lastname is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unquie: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select :true
    },
    location: {
        type: String,
        default: 'India',
    }
}, {
    timeStamps: true
}
);
userSchema.pre('save',async function(){
    if(!this.isModified) return ;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.comparepassword = async function(userpassword){
    const isMatch = await bcrypt.compare(userpassword,this.password);
    return isMatch;
}

userSchema.methods.createJWT = function(){
    return jwt.sign(
        {userId:this._id,
        username:this.firstname},
        process.env.JWT_SECRET,{
            expiresIn:'1d'
        }
    )
}
module.exports = mongoose.model('User',userSchema);