const express=require('express');
const router=express.Router();
const User=require('../models/users');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function isAuthenticated(req, res, next) {
    if (req.session && req.session.uname) {
      return next();
    }
    res.redirect('/');
  }

router.get('/', (req, res)=>{
    res.render('index');
})

router.get('/homepage/:uname',isAuthenticated, (req, res)=>{
    const uname=req.params.uname;
    res.render('home',{uname});
})

router.post('/login',async(req, res)=>{
    try{
        const { uname, pword } = req.body;
        const user = await User.findOne({ uname });
        if(user){
            const isMatch = await bcrypt.compare(pword, user.pword);
            if (isMatch){
                req.session.uname=uname;
                console.log("Successful login");
                res.redirect(`/homepage/${uname}`);
            }
            else {
                console.log("Invalid credentials");
                res.sendStatus(401);
            }
        }else {
            console.log("Invalid credentials");
            res.sendStatus(401);
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/register',async(req, res)=>{
    try{
        const { uname, pword } = req.body;
        const existingu = await User.findOne({ uname });
        if(existingu){
            console.log("User already exists");
            res.sendStatus(409);
        }
        else{
            const hashedPassword = await bcrypt.hash(pword, SALT_ROUNDS);
            const user = new User({ uname , pword: hashedPassword  });
            await user.save();
            req.session.uname=uname;
            console.log("Successful register");
            res.redirect(`/homepage/${uname}`);
        }
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
})

router.post('/wishlist/:uname',isAuthenticated, async(req,res)=>{
    try{
        const {uname}=req.params;
        const wish = req.body["book-title"];
        const user=await User.findOne({uname});
        user.wishlist.push(wish);
        await user.save();
        res.sendStatus(204)
    }catch(err){
        console.log(err);
    }
})

router.get('/wishlist/:uname',isAuthenticated, async(req,res)=>{
    try{
        const {uname}=req.params;
        const user=await User.findOne({uname});
        res.json(user.wishlist);

    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/wishlist/:uname/:id',isAuthenticated, async(req, res)=>{
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
        res.sendStatus(500);

    }
})

module.exports=router;