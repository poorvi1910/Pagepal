const express=require('express');
const router=express.Router();
const User=require('../models/users');
const Chat = require('../models/chat');
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

router.get('/homepage', isAuthenticated, (req, res) => {
    const uname = req.session.uname;
    res.render('home', { uname });
});

router.post('/login',async(req, res)=>{
    try{
        const { uname, pword } = req.body;
        const user = await User.findOne({ uname });
        if(user){
            const isMatch = await bcrypt.compare(pword, user.pword);
            if (isMatch){
                req.session.uname=uname;
                console.log("Successful login");
                res.redirect(`/homepage`);
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
            res.redirect(`/homepage`);
        }
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
})

router.post('/wishlist', isAuthenticated, async (req, res) => {
    try {
        const wish = req.body["book-title"];
        const user = await User.findOne({ uname: req.session.uname });
        user.wishlist.push(wish);
        await user.save();
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/wishlist', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ uname: req.session.uname });
        res.json(user.wishlist);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


router.post('/wishlist/:id',isAuthenticated, async(req, res)=>{
    try{
        const user = await User.findOne({ uname: req.session.uname });
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

router.get('/requests/:uname', isAuthenticated, async (req, res) => {
    try {
        const { uname } = req.params;
        const user = await User.findOne({ uname });
        res.json(user.recreq);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/find/:bookTitle', isAuthenticated, async (req, res) => {
    try {
        const users = await User.find({ own: req.params.bookTitle }, 'uname');
        res.json(users.map(u => u.uname));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/sendreq', isAuthenticated, async (req, res) => {
    try {
        const { from, to } = req.body;
        const user = await User.findOne({ uname: to });
        if (!user.recreq.includes(from)) {
            user.recreq.push(from);
            await user.save();
        }
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/acceptreq', isAuthenticated, async (req, res) => {
    try {
        const { from, to } = req.body;
        const user = await User.findOne({ uname: to });
        const sender = await User.findOne({ uname: from });

        if (!user.friend.includes(from)) user.friend.push(from);
        if (!sender.friend.includes(to)) sender.friend.push(to);

        user.recreq = user.recreq.filter(u => u !== from);

        await user.save();
        await sender.save();

        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/rejectreq', isAuthenticated, async (req, res) => {
    try {
        const { from, to } = req.body;
        const user = await User.findOne({ uname: to });
        user.recreq = user.recreq.filter(u => u !== from);
        await user.save();
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/ownlist',isAuthenticated, async(req,res)=>{
    try{
        const wish = req.body["book-title"];
        const user = await User.findOne({ uname: req.session.uname });
        user.own.push(wish);
        await user.save();
        res.sendStatus(204)
    }catch(err){
        console.log(err);
    }
})

router.get('/ownlist',isAuthenticated, async(req,res)=>{
    try{
        const user = await User.findOne({ uname: req.session.uname });
        res.json(user.own);

    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/ownlist/:id',isAuthenticated, async(req, res)=>{
    try{
        const user = await User.findOne({ uname: req.session.uname });
        if(user){
            user.own.splice(id, 1);
            await user.save();
            res.status(204).send();
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);

    }
})

router.get('/chat', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ uname: req.session.uname });
    const friends = await User.find({ uname: { $in: user.friend } });
    res.json({
      currentUser: { _id: user._id },
      friends
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/chat/history/:otherUserId', async (req, res) => {
  try {
    const currentUser = await User.findOne({ uname: req.session.uname });
    if (!currentUser) return res.status(404).json({ error: "Current user not found" });

    const chats = await Chat.find({
      $or: [
        { sender_id: currentUser._id, receiver_id: req.params.otherUserId },
        { sender_id: req.params.otherUserId, receiver_id: currentUser._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Logout error:', err);
            return res.sendStatus(500);
        }
        res.redirect('/');
    });
});

module.exports=router;