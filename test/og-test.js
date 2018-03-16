const chai = require('chai');
const chaiHTTP = require('chai-http');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {app, runServer, closeServer} = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const expect = chai.expect;


const {BlogPost} = require('../models');


chai.use(chaiHTTP);

describe('Blogpost List', function(){
	before(function(){
		console.log('befor function running');
		return runServer(TEST_DATABASE_URL);
	});

	after(function(){
		console.log('after function running');
		return closeServer();
	});

	it('Should list Blogpost on GET', function(){
		BlogPost.create(
			{
				title: 'blog post 1', 
				content: 'my content 1', 
				author: 'Zable1',
				publishDate: Date.now()
			}
		).then(function(res) {
			return chai
				.request(app)
				.get('/blog-posts')
				.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				//console.log("RES BODY = ", res.body);
				expect(res.body).to.be.a('object');
				//expect(res.body.length).to.be.at.least(1);
	
				// const expectKeys = ['id', 'title', 'content', 'author', 'publishDate'];
				// res.body.forEach(function(item){
				// 	expect(item).to.be.a('object');
				// 	expect(item).to.include.keys(expectKeys);
				// });
			});
		});
	});

	it('Should add a Blogpost on POST', function(){
		const newBlogPost = {
			'title': 'new title', 
			'content': 'new content', 
			'author': 'new Zabel', 
			'publishDate': Date.now()
			
		}
		return chai.request(app).post('/blog-posts').send(newBlogPost).then(function(res){
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			//console.log("RES BODY = ", res.body);
			expect(res.body).to.include.keys('title', 'content', 'author', 'publishDate');
			expect(res.body.id).to.not.equal(null);

			//expect(res.body).to.deep.equal(Object.assign(newBlogPosts, {id: res.body.id}));
		});
	});

	it('Should update Blogposts on PUT', function(){
	
		const updateData = {
			title: 'update title',
			content: 'update content',
			author: 'update author',
			publishDate: Date.now()
		};
		const post = BlogPost.create(updateData).then(function(post) {
			updateData['id'] = post.id;
			return chai.request(app)
				.put(`/blog-posts/${post.id}`)
				.send(updateData)
				.then(function(res) {
					expect(res).to.have.status(204);
					expect(res).to.be.a('object');
					expect(res.body).to.deep.equal({});
				})
			});
	});

	it('Should delete Blogposts on DELETE', function(){
		const post = {
			title: 'update title',
			content: 'update content',
			author: 'update author',
			publishDate: Date.now()
		};
		return BlogPost.create(post).then(function(post) {
			return chai.request(app).delete(`/blog-posts/${post.id}`)
				.then(function(res){
					expect(res).to.have.status(204);
				});
			})
		
	});
});