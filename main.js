require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const PORT= process.env.PORT || 4000;
const app=express();

mongoose.connect(process.env.DB_URI);
db=mongoose.connection;
db.on('error',(err)=>console.log(err));
db.once('open',()=>console.log("Connected to database"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',require("./routes/routes"));
app.set('view engine', 'ejs');


app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});

app.use(express.static('css'));
app.use(express.static('scripts'));