
require('dotenv').config();
const express = require('express')
const app = express();
const cors=require('cors');
const morgan=require('morgan');
const userController=require('./Controller/user')

const port  = process.env.PORT;

require('./db')

// Middle Ware Setup
app.use(morgan('dev'))
app.use(cors())

// user Controller Data
app.use('/api/user',userController)

// Defaults Routes

app.all('/',(req,res)=>{
    return res.json({
        status:'true',
        message:'Index Page Loading...',
    })
})

app.listen(port, console.log(`Your Port Connect at port Number ${port}`))