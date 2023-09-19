const experss=require('express');
const { userRegister, userValidation } = require('../controller/user.js');
const validateIP = require('../utils/ip-verify-middleware/ipValidation.js');
const router=experss.Router();

router.post("/register",userRegister)//user register
router.post("/userValidation",validateIP,userValidation)//user otp validation



module.exports=router