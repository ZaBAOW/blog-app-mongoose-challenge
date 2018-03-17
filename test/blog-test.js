const mongoose = require('mongoose');
const faker = require('faker');
const mocha = require('mocha');
const chai = require('chai');
const chaiHTTP = require('chai-http')

mongoose.Promise = global.Promise;

const {runServer, app, closeServer} = require('../server');
const {PORT, DATABASE_URL} = require('../config');
const {BlogPost} = require('../models');
const {TEST_DATABASE_URL} = require('../config');
const expect = chai.expect;

let server;

chai.use(chaiHTTP);


function tearDownDb() {
	return new Promise((resolve, reject) => {
		console.warn('Deleting database');
		mongoose.connection.dropDatabase()
		.then(result => resolve(result))
		.catch(err => reject(err));
	});
};

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
};

describe('blog posts API resource', function() {
	before('test running', function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedBlogPostData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after('server closing', function () {
		return closeServer();
	});



	it('should return all existing blog posts with GET', function(){
		let res;
		return chai.request(app)
		.get('/blog-posts')
		.then(function(_res){
			res = _res;
			expect(res).to.have.status(200);
			expect(res.body).to.be.a('array');
			expect(res.body).to.have.length.of.at.least(1);
			return BlogPost.count();
		})
		.then(function(count){
			expect(res.body).to.have.lengthOf(count);
		});
	});

	it('should post a new blog post to database with POST', function() {
		let res;
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
				'id', 'title', 'content', 'author', 'created');
			expect(res.body.title).to.equal(newBlogPost.title);
			expect(res.body.content).to.equal(newBlogPost.content);
			console.log(res.body.author);
			return BlogPost.findById(res.body.id);
		})
		.then(function(blogposts) {
			expect(blogposts.title).to.equal(newBlogPost.title);
			expect(blogposts.content).to.equal(newBlogPost.content);
			expect(blogposts.author.firstName).to.equal(newBlogPost.author.firstName);
			expect(blogposts.author.lastName).to.equal(newBlogPost.author.lastName);
		})
	});

	
	it('should update blog post with PUT', function() {
		let res;
		const updateData = {
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			author: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			}
		};

		return BlogPost
		.findOne()
		.then(function(blogposts) {
			updateData.id = blogposts.id;

			return chai.request(app)
			.put(`/blog-posts/${blogposts.id}`)
			.send(updateData);
		})
		.then(function(res) {
			expect(res).to.have.status(204);

			return BlogPost.findById(updateData.id);
		})
		.then(function(blogposts) {
			expect(blogposts.title).to.equal(updateData.title);
			expect(blogposts.content).to.equal(updateData.content);
			console.log(blogposts.author);
			expect(blogposts.author.firstName).to.equal(updateData.author.firstName);
			expect(blogposts.author.lastName).to.equal(updateData.author.lastName);
		});
	});

	it('should delete blog post with DELETE', function() {
		let res;
		return  BlogPost
		.findOne()
		.then(function(_blogposts) {
			blogposts = _blogposts;
			return chai.request(app).delete(`/blog-posts/${blogposts.id}`);
		})
		.then(function(res) {
			expect(res).to.have.status(204);
		})
		.then(function(_blogposts){
			console.log(_blogposts);
			expect(_blogposts).to.equal(undefined);
		});
	});
});