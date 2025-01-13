const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    uname:{
        type: String,
        required: true
    },

    pword:{
        type: String,
        required:true
    },
})

module.exports=mongoose.model('User',userSchema);