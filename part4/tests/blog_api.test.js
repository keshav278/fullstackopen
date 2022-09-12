const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const bcrypt = require('bcryptjs')
const User = require('../models/user')

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
      username: 'root',
      name: 'keshav',
      blogs: [],
      passwordHash
    })
  
    await user.save()
  })
  
  beforeEach(async () => {
    await Blog.deleteMany({})
  
    const users = await User.find({})
    const user = users[0]
    const id = users[0]._id
  
    const blogObject = helper.initialBlogs
      .map(blog => new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: id.toString(),
        likes: blog.likes ? blog.likes : 0
      }))
    const promiseArray = blogObject.map(blog => {
      blog.save()
      user.blogs = user.blogs.concat(blog._id)
    })
    await Promise.all(promiseArray)
    await user.save()
  })
  
  describe('Check ID definition:', () => {
    test('Is ID field defined as `id` insted of `_id`', async () => {
      const response = await api
        .get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })
  })
  
  describe('Testing GET', () => {
    test('Blogs are returned as JSON', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 10000)
  
    test('All blogs are returned', async () => {
      const response = await api
        .get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
  
    test('All blogs are containing info about creator', async () => {
      const response = await api
        .get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
  
    test('Check if a blog posts without likes (zero likes) are exist', async () => {
      const blogs = await helper.blogsInDb()
      const likes = blogs.map(response => response.likes)
      expect(likes).toContain(0)
    })
  })
  
  describe('Testing POST', () => {
    let headers
  
    beforeEach(async () => {
      const user = {
        username: 'root',
        password: 'password',
      }
  
      const loginUser = await api
        .post('/api/login')
        .send(user)
  
      headers = {
        'Authorization': `bearer ${loginUser.body.token}`
      }
    })
  
    test('Adding new blog to DB', async () => {
  
      const newBlog = {
        title: 'Test',
        author: 'keshav',
        url: 'example.net',
        likes: 250,
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .set(headers)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
      const contents = blogsAtEnd.map(response => response.title)
      expect(contents).toContain('Test')
    }, 10000)
  
    test('Adding new blog to database without auth token', async () => {
  
      const newBlog = {
        title: 'Test blog without token',
        author: 'keshav',
        url: 'example',
        likes: 340,
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
  
    }, 10000)
  
    test('Adding new blog without likes', async () => {
  
      const newBlog = {
        title: 'Another blog',
        author: 'keshav',
        url: 'example.net',
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .set(headers)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
      const contents = blogsAtEnd.map(response => response.likes)
  
      expect(
        contents.reduce(
          (count, num) => (num === 0 ? count + 1: count), 0
        )
      ).toBe(2)
  
    }, 10000)
  
    test('POST request without title and url', async () => {
  
      const newBlog = {
        author: 'keshav',
        likes: 350,
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .set(headers)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })
  
  describe('Testing POST request with wrong header:',  () => {
    test('Adding new blog to DB with wrong headers', async () => {
      const newBlog = {
        title: 'wrongblog',
        author: 'fakeauthor',
        url: 'example.net',
        likes: 2,
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  
      const contents = blogsAtEnd.map(response => response.title)
      expect(contents).not.toContain('wrongblog')
    }, 10000)
  })
  
  describe('Testing DELETE request(s):',  () => {
    let headers
  
    beforeEach(async () => {
      const user = {
        username: 'root',
        password: 'password',
      }
  
      const loginUser = await api
        .post('/api/login')
        .send(user)
  
      headers = {
        'Authorization': `bearer ${loginUser.body.token}`
      }
    })
  
    test('Deleting saved blog from DB', async () => {
      const currentBlogsInDb = await helper.blogsInDb()
      const blogToDelete = currentBlogsInDb[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
        .set(headers)
  
      const blogsAfterDelete = await helper.blogsInDb()
  
      expect(blogsAfterDelete).toHaveLength(
        helper.initialBlogs.length - 1
      )
  
      const contents = blogsAfterDelete.map(response => response.title)
  
      expect(contents).not.toContain(blogToDelete.title)
    })
  
    test('Loggined user deleting saved blog from DB', async () => {
      const currentBlogsInDb = await helper.blogsInDb()
      const blogToDelete = currentBlogsInDb[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
        .set(headers)
  
      const blogsAfterDelete = await helper.blogsInDb()
  
      expect(blogsAfterDelete).toHaveLength(
        helper.initialBlogs.length - 1
      )
  
      const contents = blogsAfterDelete.map(response => response.title)
  
      expect(contents).not.toContain(blogToDelete.title)
    })
  
    test('Deleting nonexisting blog', async () => {
      const nonExistId = await helper.nonExistingId()
      await api
        .delete(`/api/blogs/${nonExistId}`)
        .expect(204)
        .set(headers)
    })
  })
  
  describe('Testing PUT request(s):', () => {
    test('Updating likes in post', async () => {
      const currentBlogsInDb = await helper.blogsInDb()
      const blogToUpdate = currentBlogsInDb[0]
      blogToUpdate.likes = 420
  
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
  
      const blogsAfterUpdate = await helper.blogsInDb()
      const contents = blogsAfterUpdate.map(response => response.likes)
  
      expect(contents).toContain(420)
    }, 10000)
  })
  
  describe ('Testing creator info:', () => {
    test ('creators id', async () => {
      const users = await User.find({})
      const id = users[0]._id
  
      const blogs = await helper.blogsInDb()
      const contents = blogs.map(response => response.user)
      expect(contents).toContainEqual(id)
    })
  })
afterAll(()=>{
    mongoose.connection.close()
})