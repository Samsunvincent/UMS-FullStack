const express = require('express');
const router = express.Router();
const controller = require('../user-controller/controller');
const accessControl = require('../util/access-control').accessControl



function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}
router.post('/signin',controller.signin)
router.get(`/getAllData`,setAccessControl("*"),controller.getAllData)
router.get(`/user/:id`,setAccessControl('*'),controller.getsingle)
router.put('/user/:id',setAccessControl('*'),controller.updateUser)
router.delete('/user/:id',setAccessControl('1'),controller.deleteUser);
router.put('/passwordreset/:id',controller.resetPassword)


module.exports = router

