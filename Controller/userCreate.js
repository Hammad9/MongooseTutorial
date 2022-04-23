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


    // Create Function for insert data into mongodb using create method

     User.create(
        {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,

        },
        (error,result)=>{
            // Check Error
            if(error){
                return res.status(500).json({
                    status:false,
                    message:"DB Insert Data Fail....",
                    error:error,
                })
            }

            // if Every thing OK
            res.json({
                status:true,
                message:'Every Thing Ok and Data insert',
                result:result
            })
        }
    )

   

    // Output data to User
    {/** 
    return res.json({
        status:'true',
        message:"User Data OK",
        data:req.body,
        hashpassword:hashedPassword,  //show the hash passwor in postman
    })
    */}
})



// Module Exports
module.exports = router