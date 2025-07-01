const mongoose = require('mongoose');
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{

        });
        console.log("connected to mongo DB");
    }catch(error){
        console.log(error);
        process.exit(1);

    }
}
module.exports = connectDB;