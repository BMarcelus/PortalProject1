// var assert = require('assert');
var chai = require('chai');
var assert = chai.assert;
var request = require('superagent');

var port = process.env.PORT;
var url = `http://localhost:${port}`;

before(function(){
	console.log(`Attempting to start server on ${port}`);
	require('../bin/www');	


});


describe.skip("Menu", function(){
	it('should post a menu object on post', function(done){
		request
			.post(`http://localhost:${port}/menu`)
			.send({
				name: "test",
				details: "this is a test",
				price: 42,
				img: "imgurl"
			})
			.end(function(err,res){
				done();
			});
	});
	it('should return a menu on get', function(done){
		request
			.get(`http://localhost:${port}/menu`)
			.end(function(err,res){
				//Check status code
				assert.equal(res.statusCode, 200, 'invalid status code');
				//Check content type
				assert.equal(res.type, 'application/json', 'response type not json');
				//Check data
				assert.isOk(Array.isArray(res.body), 'Expected Menu response to be an array');
				assert.isOk(res.body.length>0, 'menu is empty');

				done();
			});
	});
})
describe('User',function(){
	it('Post login to user' ,function(done)
	{
		request
			.post(`http://localhost:${port}/user/login`)
			.send({
				email:"test",
				password: "a"
			})
			.then(function(res){
				assert.equal(res.statusCode, 200, 'invalid status code');
				assert.equal(res.type, 'application/json', 'response type not json');
				assert.isObject(res.body, "response body not an object");
				assert.equal(res.body.email, "test", "user email not matched in login");

				done();
			})
			.catch(function(err){
				done(err);
			})
	})
	it.skip('Post create new user', function(done)
	{
		request
		.delete(url + "/user")
		.send({
			email: "test"
		})
		.end(function(err, res){
			if(err)done(err);
			request
			.post(`http://localhost:${port}/user`)
			.send({
				email: "test",
				password: "a",
				firstname: "Tester",
				lastname: "McTesterson"
			})
			.end(function(err,res){
				if(err)done(err);
				assert.equal(res.statusCode, 200, 'invalid status code');
				assert.equal(res.type, 'application/json', 'response type not json');
				assert.isObject(res.body, "response body not an object");
				assert.equal(res.body.email, "test", "user email not matched in login");
				assert.equal(res.body.firstname, "Tester", "user firstname not matched in login")
				assert.equal(res.body.lastname, "McTesterson", "user lastname not matched in login")
				
				done();
			});
		})
		
	})
});



describe('Cart', function(){
	it('Get should return an empty Cart with no session', function(done){
		request
			.get(`http://localhost:${port}/cart`)
			.end(function(err,res){
				//Check status code
				assert.equal(res.statusCode, 200, 'invalid status code');
				//Check content type
				assert.equal(res.type, 'application/json', 'response type not json');
				//Check data
				assert.isObject(res.body, 'Expected response to be an object');
				assert.equal(JSON.stringify(res.body), "{}", "Cart body is not {}");

				done();
			});
	})
	it('Post with no session user should give uuid',function(done){
		request
			.post(`http://localhost:${port}/cart`)
			.send({
				totalPrice:1,
				items:[]
			})
			.end(function(err,res){
				assert.isOk(res.body.userID, "does not have uuid");
				done();
			})
	})
})

describe('Logged in session interactions', function()
{
	let agent;
	let userID;
	before(function(done)
	{
		agent = request.agent();
		agent
		  .post(`http://localhost:${port}/user/login`)
		  .withCredentials()
		  .send({
				email:"test",
				password: "a"
			})
		  .end(function(err,res)
		  {
		  	userID=res.body._id;
		  	done();
		  })
	});

	it("Cart post has userID",function(done){
		// assert.fail(0,0,"test failure");
		agent
			.post(url+"/cart")
			.send({})
			.then(function(res)
			{
				// assert.fail(0,0,"test failure then");
				assert.equal(res.body.userID, userID, "Cart does not have user ID");
				done();
			})
			.catch(function(err){
				done(err);
			})

	});	
	it('Can get Cart after adding',function(done){
		var cartObject = {
			totalPrice: 7,
			items:[
			{
				menuID: 3,
				quantity: 4	
			}]
		}
		agent
			.post(url+'/cart')
			.send(cartObject)
			.then(function(res){
				assert.equal(res.body.userID, userID, "Cart does not have user ID");
				agent
					.get(url+'/cart')
					.then(function(res){
						assert.equal(res.body.userID, userID, "Retrieved Cart object does not have user ID");
						assert.equal(res.body.totalPrice, 7, "Retrieved Cart totalPrice does not matched sent");
						assert.equal(res.body.items.length, 1, "Retrieved Cart items has incorrect length");
						assert.equal(res.body.items[0].menuID, 3, "Retrieved Cart items object menuID does not matched sent");
						assert.equal(res.body.items[0].quantity, 4, "Retrieved Cart items object quantity does not matched sent");
						done();
					})
					.catch(function(err){
						done(err);
					})
			})
			.catch(function(err){
				done(err);
			})
	});


	it('Logout changes ID', function(done)
	{
		agent.get(url+'/signin')
			.then(function(){
				agent
					.post(url+'/cart')
					.send({})
					.then(function(res){
						res.userID
						assert.notEqual(res.body.userID, userID, "userID not changed after logout");
						done();
					})
					.catch(function(err){
						console.log(err);
					})
			})
			.catch(function(err){
				done(err);
			})
	});
	it('Log back in gets same userID',function(done){
		agent
		  .post(`http://localhost:${port}/user/login`)
		  .withCredentials()
		  .send({
				email:"test",
				password: "a"
			})
		  .then(function(res){
		  	assert.equal(res.body._id, userID, "userID not the same after log back in");
		  	done();
		  })
		  .catch(function(err){
		  	done(err);
		  })
	})
})

