// const mongoose = require('mongoose');
// const faker = require('faker');
// const mocha = require('mocha');
// const chai = require('chai');
// const chaiHTTP = require('chai-http')

// mongoose.Promise = global.Promise;

// const {app, runserver, closeServer} = require('../server');
// const {PORT, DATABASE_URL} = require('../config');
// const {BlogPost} = require('../models');
// const {TEST_DATABASE_URL} = require('../config');
// const expect = chai.expect;

// let server;

// chai.use(chaiHTTP);


// function tearDownDb() {
// 	return new Promise((resolve, reject) => {
// 		console.warn('Deleting database');
// 		mongoose.connection.dropDatabase()
// 		.then(result => resolve(result))
// 		.catch(err => reject(err));
// 	});
// };

// function seedBlogPostData() {
// 	console.info('seeding blog post data');
// 	const seedData = [];
// 	for(let i = 1; i <= 10; i++) {
// 		seedData.push({
// 			author: {
// 				firstName: faker.name.firstName(),
// 				lastName: faker.name.lastName()
// 			},
// 			title: faker.lorem.sentence(),
// 			content: faker.lorem.text()
// 		});
// 	}
// 	return BlogPost.insertMany(seedData);
// };

// describe('blog posts API resource', function() {
// 	before('test running', function() {
// 		return runServer(TEST_DATABASE_URL);
// 	});

// 	beforeEach(function() {
// 		return seedBlogPostData();
// 	});

// 	afterEach(function() {
// 		return tearDownDb();
// 	});

// 	after('server closing', function () {
// 		return closeServer();
// 	});
// });

// describe('GET', function() {
// 	let res;
// 	BlogPost.create(
// 		{
// 			title: faker.lorem.sentence(),
// 			author: {
// 				firstName: faker.name.firstName(),
// 				lastName: faker.name.lastName()
// 			},
// 			content: faker.lorem.text()
// 		});

// 	it('should return all existing blog posts with GET', function(){
// 		return chai.request(app)
// 		.get('/blog-posts')
// 		.then(function(_res){
// 			res = _res;
// 			expect(res).to.have.status(200);
// 			expect(res.body.blogposts).to.have.length.of.at.least(1);
// 			return BlogPost.count();
// 		})
// 		.then(function(count){
// 			expect(res.body.BlogPost).to.have.length.of(count);
// 		});
// 	});
// });


// // describe('POST', function() {
// // 	let res;
// // 	it('should post a new blog post to database with POST', function() {
// // 		return chai.request()

// // 		const newBlogPost = {
// // 			title: faker.lorem.sentence(),
// // 			author: {
// // 				firstName: faker.name.firstName(),
// // 				lastName: faker.name.lastName()
// // 			},
// // 			content: faker.lorem.text()
// // 		};

// // 		return chai.request(app)
// // 		.post('/blog-posts')
// // 		.send(newBlogPost)
// // 		.then(function(res) {
// // 			expect(res).to.have.status(201);
// // 			expect(res).to.be.json;
// // 			expect(res.body).to.be.a('object');
// // 			expect(res.body).to.include.keys(
// // 				'id', 'title', 'content', 'author', 'publishDate');
// // 			expect(res.body.title).to.equal(newBlogPost.title);
// // 			expect(res.body.content).to.equal(newBlogPost.content);
// // 			expect(res.body.author).to.equal(newBlogPost.author);
			
// // 			return BlogPost.findById(res.body.id);
// // 		})
// // 		.then(function(blogposts) {
// // 			expect(blogposts.title).to.equal(newBlogPost.title);
// // 			expect(blogposts.content).to.equal(newBlogPost.content);
// // 			expect(blogposts.author).to.equal(newBlogPost.author);
// // 		})
// // 	});
// // });

// // describe('PUT', function() {
// // 	let res;
// // 	it('should update blog post with PUT', function() {
// // 		const updateData = {
// // 			title: 'best title yet',
// // 			content: 'best content yet',
// // 			author: 'best author yet'
// // 		}

// // 		return BlogPost
// // 		.findOne()
// // 		.then(function(blogposts) {
// // 			updateData.id = blog-posts.id;

// // 			return chai.request(app)
// // 			.put(`/blog-posts/${blog-posts.id}`)
// // 			.send(updateData);
// // 		})
// // 		.then(function(res) {
// // 			expect(res).to.have.status(204);

// // 			return BlogPost.findById(updateData.id);
// // 		})
// // 		.then(function(blogposts) {
// // 			expect(blogposts.title).to.equal(updateData.name);
// // 			expect(blogposts.content).to.equal(updateData.content);
// // 			expect(blogposts.author).to.equal(updateData.author);
// // 		});
// // 	});
// // });

// describe('DELETE', function() {
// 	it('should delete blog post with DELETE', function() {
// 		return  BlogPost
// 		.findOne()
// 		.then(function(_blogposts) {
// 			blogposts = _blogposts;
// 			return chai.request(app).delete(`/blog-posts/${blogposts.id}`);
// 		})
// 		.then(function(res) {
// 			expect(res).to.have.status(204);
// 		})
// 		.then(function(_blogposts){
// 			expect(_blogposts).to.be.null;
// 		});
// 	});
// });