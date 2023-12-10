const router = require("express").Router();
const Post = require('../models/Post')
const User = require('../models/User')

//create post
router.post("/",async(req,res)=>{
    const newPost = await new Post(req.body)
    try{
     const savedPost = await newPost.save()
     res.status(200).json('Posted successfully')
    }catch(err){
        res.status(500).json(err)
    }
})
//update post
router.put("/:id",async(req,res)=>{
    
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Your post has been updated")
        }else{
            res.status(403).json("Your can update only your post")
        }
       
    }catch(err){
        return res.status(500).json(err)
    }

})
//delete post
router.delete("/:id",async(req,res)=>{
    
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("Your post has been deleted")
        }else{
            res.status(403).json("Your can delete only your post")
        }
       
    }catch(err){
        return res.status(500).json(err)
    }

})
//like & dislike post
router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("This post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(403).json("This post has been disliked")
        }
    }catch(err){
        return res.status(500).json(err)
    }

})
//get a post of each of your friend or someone
router.get("/:id",async(req,res)=>{
    
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        return res.status(500).json(err)
    }

})
//get timeline posts means all post fetch that we can see in home
router.get("/timeline/:userId",async(req,res)=>{
    try{
        //for fetching my own post
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({userId:currentUser._id})
        //for fetching other friends post
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId})
            })
        )
        //concating currentuser post with all friends post
        res.status(200).json(userPosts.concat(...friendPosts));//...for getting each post of friendPosts array
    }catch(err){
        return res.status(500).json(err)
    }

})
//get users all post means particular user all post
router.get("/profile/:username",async(req,res)=>{
    try{
        //first find user by that username
        const user = await User.findOne({username:req.params.username})
        const posts = await Post.find({userId:user._id})
        res.status(200).json(posts)
    }catch(err){
        return res.status(500).json(err)
    }

})

module.exports = router