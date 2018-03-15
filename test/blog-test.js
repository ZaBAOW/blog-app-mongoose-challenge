const mongoose = require('mongoose');
const faker = require('faker');
const mocha = require('mocha');
const chai = require('chai');
const chaiHTTP = require('chai-http')

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('../config');
const {BlogPost} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

let server;

chai.use(chaiHTTP);


function tearDownDb() {
	return new Promise((resolve, reject) => {
		console.warn('Deleting database');
		mongoose.connection.dropDatabase()
		.then(result => resolve(result))
		.catch(err => reject(err));
	});
}

function seedBlogPostData() {
	console.info('seeding blog post data');
	const seedData = [];
	for(let i = 1; i <= 10; i++) {
		seedData.push({
			author: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			},
			title: faker.lorem.sentence(),
			content: faker.lorem.text()
		});
	}
	return BlogPost.insertMany(seedData);
}

describe('blog posts API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedBlogPostData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function () {
		return closeServer();
	});
});

describe('should return all existing blog posts with GET', function() {
	let res;
	return chai.request(app)
	.get('/blog-posts')
	.then(function(_res){
		res = _res;
		expect(res).to.have.status(200);
		expect(res.body.blog-posts).to.have.length.of.at.least(1);
		return BlogPost.count();
	})
	.then(function(count){
		exjpect(res.body.BlogPost).to.have.length.of(count);
	});
});


describe('should post a new blog post to database with POST', function() {
	let res;
	const newBlogPost = generateBlogPostData();

	return chai.request(app)
	.post('/blog-posts')
	.send(newBlogPost)
	.then(function(res) {
		expect(res).to.have.status(201);
		expect(res).to.be.json;
		expect(res.body).to.be.a('object');
		expect(res.body).to.include.keys(
			'id', 'title', 'content', 'author', 'publishDate');
		expect(res.body.title).to.equal(newBlogPost.title);
		expect(res.body.content).to.equal(newBlogPost.content);
		expect(res.body.author).to.equal(newBlogPost.author);
		
		return BlogPost.findById(res.body.id);
	})
	.then(function(blog-posts) {
		expect(blog-posts.title).to.equal(newBlogPost.title);
		expect(blog-posts.content).to.equal(newBlogPost.content);
		expect(blog-posts.author).to.equal(newBlogPost.author);
	})
})

describe('should update blog post with PUT', function() {
	let res;
	const updateData = {
		title: 'best title yet',
		content: 'best content yet',
		author: 'best author yet'
	}

	return BlogPost
	.findOne()
	.then(function(blog-posts) {
		updateData.id = blog-posts.id;

		return chai.request(app)
		.put(`/blog-posts/${blog-posts.id}`)
		.send(updateData);
	})
	.then(function(res) {
		expect(res).to.have.status(204);

		return BlogPost.findById(updateData.id);
	})
	.then(function(blog-posts) {
		expect(blog-posts.title).to.equal(updateData.name);
		expect(blog-posts.content).to.equal(updateData.content);
		expect(blog-posts.author).to.equal(updateData.author);
	});
});

describe('should delete blog post with DELETE', function() {
	let blog-posts;

	return  BlogPost
	.findOne()
	.then(function(_blog-posts) {
		blog-posts = _blog-posts;
		return chai.request(app).delete(`/blog-posts/${blog-posts.id}`);
	})
	.then(function(res) {
		expect(res).to.have.status(204);
		return BlogPost.findById(blog-posts.id);
	})
	.then(function(_blog-posts){
		expect(_blog-posts).to.be.null;
	});
});