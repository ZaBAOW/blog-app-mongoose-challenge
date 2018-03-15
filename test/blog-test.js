const mongoose = require('mongoose');
const faker = require('faker');
const mocha = require('mocha');
const chai = require('chai');
const chaiHTTP = require('chai-http')

mongoose.Promise = global.Promise;

const {app, runserver, closeServer} = require('../server');
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
		expect(res.body.blogposts).to.have.length.of.at.least(1);
		return BlogPost.count();
	})
	.then(function(count){
		exjpect(res.body.BlogPost).to.have.length.of(count);
	});
});


describe('should post a new blog post to database with POST', function() {
	let res;
	return chai.request()

	const newBlogPost = {
		title: faker.lorem.sentence(),
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		},
		content: faker.lorem.text()
	};

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
	.then(function(blogposts) {
		expect(blogposts.title).to.equal(newBlogPost.title);
		expect(blogposts.content).to.equal(newBlogPost.content);
		expect(blogposts.author).to.equal(newBlogPost.author);
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
	.then(function(blogposts) {
		updateData.id = blog-posts.id;

		return chai.request(app)
		.put(`/blog-posts/${blog-posts.id}`)
		.send(updateData);
	})
	.then(function(res) {
		expect(res).to.have.status(204);

		return BlogPost.findById(updateData.id);
	})
	.then(function(blogposts) {
		expect(blogposts.title).to.equal(updateData.name);
		expect(blogposts.content).to.equal(updateData.content);
		expect(blogposts.author).to.equal(updateData.author);
	});
});

describe('should delete blog post with DELETE', function() {
	let blogposts;

	return  BlogPost
	.findOne()
	.then(function(_blogposts) {
		blogposts = _blogposts;
		return chai.request(app).delete(`/blog-posts/${blog-posts.id}`);
	})
	.then(function(res) {
		expect(res).to.have.status(204);
		return BlogPost.findById(blog-posts.id);
	})
	.then(function(_blogposts){
		expect(_blog-posts).to.be.null;
	});
});