const _= require('underscore')
const __ = require('lodash') //lodash does not work for chaining!!!
const dummy = (blogs) =>{
    return 1
}

const totalLikes = (blogs) =>{
    let sum = 0;
    blogs.forEach(blog => sum+=blog.likes)
    return sum
}

const favoriteBlog = (blogs) =>{
    let favBlog;
    let maxlikes = 0;
    blogs.forEach((blog)=>{
        if(blog.likes>=maxlikes)
          {favBlog = blog;
           maxlikes = blog.likes;}
    })
    if(favBlog===undefined) return undefined;
    const selected = (({title,author,likes})=> ({title,author,likes}))(favBlog);
    return selected;
}
const mostBlogs = (blogs) =>{
     let authors = _.map(blogs,'author')
     let maxAuthor = _.chain(authors).countBy().pairs().max(_.last).head().value();
     let numBlogs = _.chain(authors).countBy().pairs().max(_.last).tail().value();
     return (maxAuthor===undefined)?undefined:{author:maxAuthor,blogs:numBlogs[0]}
}
const mostLikes = (blogs) =>{
    let numBlogsByAuthor = _.groupBy(blogs,'author')
    let mostLikedAuthor = undefined
    let maxlikes = 0;
    __.forOwn(numBlogsByAuthor,function(value,key){
        let listOfBlogs = value
        let sum = 0;
        listOfBlogs.forEach(blog => sum+=blog.likes)
        if(sum>maxlikes){
            mostLikedAuthor = {
                author: key,
                likes: sum
            }
            maxlikes = sum;
        }
    })
   return mostLikedAuthor;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}