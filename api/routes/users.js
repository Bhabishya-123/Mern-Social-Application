const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId==req.params.id || req.body.isAdmin){

    if(req.body.password){
        try{
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password,salt)
        }catch(err){
            return res.status(500).json(err)
        }
    }
    
    try{
        const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body})
        res.status(200).json("Your profile has been updated")
    }catch(err){
        return res.status(500).json(err)
    }

    }else{
        return res.status(403).json("you can update only your account")
    }
})
//delete user
router.delete("/:id",async(req,res)=>{
    if(req.body.userId==req.params.id || req.body.isAdmin){

    try{
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Your account has been deleted")
    }catch(err){
        return res.status(500).json(err)
    }
    }else{
        return res.status(403).json("you can delete only your account")
    }
})
//get a user
router.get("/:id",async(req,res)=>{

    try{
        const user = await User.findById(req.params.id)
        //below we are not going to show all details of user so 
        //despite that we will show only others data of a user
        const {password,updatedAt,...others} = user._doc
        res.status(200).json(others)
    }catch(err){
        return res.status(500).json(err)
    }
})
//follow user
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!==req.params.id){

    try{
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        if(!user.followers.includes(req.body.userId)){
            await user.updateOne({$push:{followers:req.body.userId}});
            await currentUser.updateOne({$push:{followings:req.params.id}});
            res.status(200).json("This user has been followed")
        }else{
            res.status(403).json("You have already followed this user")
        }
    }catch(err){
        return res.status(500).json(err)
    }
    }else{
        return res.status(403).json("you cannot follow yourself")
    }
})
//unfollow user
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!==req.params.id){

    try{
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        if(user.followers.includes(req.body.userId)){
            await user.updateOne({$pull:{followers:req.body.userId}});
            await currentUser.updateOne({$pull:{followings:req.params.id}});
            res.status(200).json("This user has been unfollowed")
        }else{
            res.status(403).json("You haven't followed this user yets")
        }
    }catch(err){
        return res.status(500).json(err)
    }
    }else{
        return res.status(403).json("you cannot unfollow yourself")
    }
})

module.exports = router;

//Note:-
//1.$push does adding data
//2.$pull does removing data