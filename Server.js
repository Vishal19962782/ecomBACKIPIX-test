const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./Routes/AuthRoutes');
const productRouter=require('./Routes/productRoutes');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const path=require('path');

const port = process.env.PORT || 5000;
const mongoURL= process.env.MONGODB_URI || 'mongodb://localhost:27017/ECOMIPIX';

//MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use(morgan('tiny')); 
//Router Middlewares
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

mongoose.connect(mongoURL).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.log(err);
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}) 
//provide react build html file
// app.use(express.static(path.join(__dirname, "/public")));
// app.get('/*',(req,res)=>{
//     res.sendFile(__dirname+'/build/index.html');
// })