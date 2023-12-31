const mongoose=require('mongoose');
const path=require('path');
const fs = require('fs');
const url='mongodb+srv://Devi1609:dhRuv16o9@cluster0.68xzs.mongodb.net/mern?retryWrites=true&w=majority';
const express=require('express');
const bodyParser=require('body-parser');
const HttpError=require('./models/error')
const PlacesRoutes=require('./routes/places-routes');
const UsersRoutes=require('./routes/user-routes'); 
const app=express();
const cors = require('cors');
const corsOptions = {
    origin: 'https://ilocate.netlify.app'
  };
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('uploads/images',express.static(path.join('uploads','images')));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,PATCH,POST,DELETE');
    next();
})


app.use('/api/places',PlacesRoutes);
app.use('/api/users',UsersRoutes);
app.use((req,res,next)=>{
const error=new HttpError('Could not find this route ',404);
throw(error);
});
app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
            console.log("error from app.js"+err);
        });
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code||500).json({message:error.message||"An unknown error occured ,sorry!"});
})
mongoose.connect(url).then(()=>{
    app.listen(5000);
}).catch((error)=>{
console.log("mongo db connect error"+error);
});
