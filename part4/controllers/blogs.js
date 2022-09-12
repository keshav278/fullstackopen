const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/',async (request,response)=>{
   const blogs = await Blog
   .find({}).populate('user',{username: 1,name: 1})
   response.json(blogs)
})

blogsRouter.post('/',middleware.userExtractor,async (request,response)=>{
    const body = request.body
    if(body.title === undefined || body.url === undefined || body.title === null || body.url === null)
       response.status(400).json('No title and url in blog')
   
  
   
   const user = request.user 
   if(!user){
        response.status(401).json({error:"invalid or missing token"})
   }    
    
       const blog = new Blog({
       title: body.title,
       author: body.author,
       url:body.url,
       likes:(body.likes=== undefined)?0:body.likes,
       user: user
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})
blogsRouter.delete('/:id',middleware.userExtractor,async (request,response)=>{
  
   const user  = request.user
   const blogToDelete = await Blog.findById(request.params.id)
   if(!blogToDelete){
      return response.status(401).json({error: 'invalid blog id'})
   }
   if(blogToDelete.user.toString() === user._id.toString()){
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
   }
   else{
      return response.status(401).json({error: 'wrong user'})
   }
   
})
blogsRouter.put('/:id',async (request,response)=>{
   const body = request.body
   const toUpdate = {
      title:body.title,
      author:body.author,
      url:body.url,
      likes: body.likes
   }
   const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,toUpdate,{new:true})
   response.status(201).json(updatedBlog)
})
module.exports = blogsRouter