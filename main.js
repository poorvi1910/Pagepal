require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const PORT= process.env.PORT || 4000;
const app=express();
const session = require('express-session');

mongoose.connect(process.env.DB_URI);
db=mongoose.connection;
db.on('error',(err)=>console.log(err));
db.once('open',()=>console.log("Connected to database"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'finD#74N$*ce8bB#*9HeizrjapUGSG83?><w@', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
      cookie: { secure: false, maxAge: 600000 }, // Set `secure: true` in production
    })
  );

app.use('/',require("./routes/routes"));
app.set('view engine', 'ejs');

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});

app.use(express.static('css'));
app.use(express.static('scripts'));