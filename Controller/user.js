const router = require('express').Router();

const bodyParser = require('body-parser');  // is say html form may jo data jae ga isko handle karay ga

const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator')

const User = require('../Models/user');   //export module ke waja say yeah yaha export howa
const { json } = require('express/lib/response');


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

 router.get('/find/:email',(req,res)=>{
    //  Find User Document
        // req.query.email  is say ham url may email say data access karay gay
        // {password:0} this will hide the specific field using projection
    User.find({email:req.params.email},{password:0},(error,result)=>{
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


// Update User Documents

router.put('/update/:id',(req,res)=>{
    // Update User Document

    // Check id is not or not
   if(req.params.id){
    User.findByIdAndUpdate(    
        req.params.id,
        
        {username:'Shahzaib'},
        (error,result)=>{

            // Check Error
            if(error){
                return res.json({
                    status:false,
                    message:"User Not Update",
                    error:error,
                })
            }

            // Check If Ok 
            return res.json({
                status: true,
                message:'User Update',
                result:result,
            })
        }
    )
   }
   else{
       return res.json({
           status: false,
           message:"Email is Not Provided"
       })
   }
})


// Delete User Document
router.delete('/delete/:email',(req,res)=>{

    // check email is empty or not
    if(req.params.email){
        User.remove(
            {email:req.params.email},
            (error,result)=>{
                // Check if Error
                if(error){
                    return res.json({
                        status: false,
                        message:"Falid to Remove Data",
                        error:error,
                    })
                }

                // If Ok 
                return res.json({
                    status: true,
                    message:'Data SuccessFully Remove',
                    result:result
                })
            }
        )
    }

    else{
        return res.json({
            // If Emaail is not provided
            status:false,
            message:"Email is Not provided",
           
        })
    }
})


// Login Router for User

router.get('/login',[
     // Check Not Empty Field
    
     check('password').not().isEmpty().trim().escape(),
     check('email').isEmail().normalizeEmail()
],(req,res)=>{
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Form Validation Errors',
            errors: errors.array()      //yeah error ko array may store karta jae ga and then show
        })
    }

    // Check Email Exsit or Not
    User.findOne(
        {email:req.body.email},
        (error,result)=>{
            // Check email exist or not
            if(error){
                return res.json({
                    status: false,
                    message:"Emali No exist",
                    error:error,
                })
            }

            // if Result is empty or not
            if(result){
                // When result variable containe docuemtn
                // match password
                const isMatch=bcrypt.compareSync(req.body.password,result.password)

                if(isMatch){
                    return res.json({
                        status:true,
                        message:"User Login Success ......",
                        result:result,
                    })
                }
                return res.json({
                    status:true,
                    message:"Password Not Matched Login Failed ......",
                    
                })
            }
            else{
                // User Document Not exist
                return res.json({
                    status:false,
                    message:"User Not Exist",
                    result:result,
                })
            }

        }
    )
})

// Module Exports
module.exports = router