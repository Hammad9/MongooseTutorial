const router = require('express').Router();

const bodyParser = require('body-parser');  // is say html form may jo data jae ga isko handle karay ga

const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator')

const User = require('../Models/user')   //export module ke waja say yeah yaha export howa


//  MiddleWare Setup

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))


// default Routes
router.all('/', (req, res) => {
    return res.json({
        status: 'true',
        message: "User Controller Working ...."
    })
})


router.post('/createNew', [
    // Check Not Empty Field
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()

], (req, res) => {
    // Check Validation Errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Form Validation Errors',
            errors: errors.array()      //yeah error ko array may store karta jae ga and then show
        })
    }

    // Here We Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)  //get password and convert 10 hash salt


    // Create UserObject to save data using save method
    // Here we create or save data using the object
    const temp=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
    })

    // Inser Data into data base 
    temp.save((error,result)=>{
        // Check if Error
        if(error){
            return res.json({
                status: false,
                message:"Data not Save into Db",
                error:error,
            })
        }
 
        // Everything OK
        return res.json({
            status: true,
            message:"Data Successfully Saved",
            result:result,
        })
    })


   
    
});

 // Find Data And REad

 router.get('/find',(req,res)=>{
    //  Find User Document
    User.find((error,result)=>{
        // Check if Error
        if(error){
            return res.json({
                status: false,
                message:"Falid to access Data",
                error:error,
            })

        }
        // If Every thing Ok 
        return res.json({
            status: true,
            message:"Data Find",
            result:result,
        })
    })
    
 })

// Module Exports
module.exports = router