const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    uname:{
        type: String,
        required: true,
        unique: true
    },

    pword:{
        type: String,
        required:true
    },
    wishlist: {
        type: [String],
        default: []
    },

    own: {
        type: [String],
        default: []
    },

    friend:{
        type: [String],
        default:[]
    },

    recreq:{
        type: [String],
        default:[]
    },
})

module.exports=mongoose.model('User',userSchema);