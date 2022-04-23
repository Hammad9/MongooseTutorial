const assert=require('assert')
const mongoose = require('mongoose');

const db_url=process.env.DB_URL;

// Connection Code

mongoose.connect(
    db_url,
    (error,link)=>{
        // Check Error
        assert.equal(error,null,"Connection Failed");

        console.log("DB Connect Success Full");
        console.log(link)
    }   
)