const express=require('express');
const router=express.Router();
const User=require('../models/users');

router.get('/', (req, res)=>{
    res.render('index');
})

router.get('/homepage/:uname', (req, res)=>{
    const uname=req.params.uname;
    res.render('home',{uname});
})

router.post('/login',async(req, res)=>{
    console.log('Request body:', req.body);
    try{
        const { uname, pword } = req.body;
        const user = await User.findOne({ uname, pword });
        if(user){
            console.log("Successful login");
            res.redirect(`/homepage/${uname}`);
        }else {
            console.log("Invalid credentials");
        }
    }catch(err){
        console.log(err);
    }
})

router.post('/register',async(req, res)=>{
    console.log('Request body:', req.body);
    try{
        const { uname, pword } = req.body;
        const existingu = await User.findOne({ uname, pword });
        if(existingu){
            console.log("User already exists");
        }
        else{
            const user = new User({ uname, pword });
            await user.save();
            console.log("Successful register");
            res.redirect(`/homepage/${uname}`);
        }
    }catch(err){
        console.log(err);
    }
})

module.exports=router;