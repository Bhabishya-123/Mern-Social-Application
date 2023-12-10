const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


dotenv.config();
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},()=>{
    console.log('connected to MongoDB')
})

//middlewares
app.use(express.json());//It parses incoming requests with JSON payloads 
app.use(helmet());// helps you secure HTTP headers returned by your Express apps
app.use(morgan('common'));//simplifies the process of logging requests to your application
                          //think Morgan as a helper that generates request logs
app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);

app.listen(8080,()=>{
    console.log('backend is running')
})