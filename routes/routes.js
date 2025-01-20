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

router.post('/wishlist/:uname', async(req,res)=>{
    try{
        const {uname}=req.params;
        const wish = req.body["book-title"];
        const user=await User.findOne({uname});
        user.wishlist.push(wish);
        await user.save();
        res.status(204).send();
    }catch(err){
        console.log(err);
    }
})

router.get('/wishlist/:uname', async(req,res)=>{
    try{
        const {uname}=req.params;
        const user=await User.findOne({uname});
        res.json(user.wishlist);

    }
    catch(err){
        console.log(err);
    }
})

router.post('/wishlist/:uname/:id', async(req, res)=>{
    try{
        const {uname, id}=req.params;
        const user= await User.findOne({uname});
        if(user){
            user.wishlist.splice(id, 1);
            await user.save();
            res.status(204).send();
        }
    }catch(err){
        console.log(err);
    }
})

module.exports=router;