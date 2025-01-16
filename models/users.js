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
    wishlist: {
        type: [String],
        default: []
    }
})

module.exports=mongoose.model('User',userSchema);