// var itemDatas = [
// 	{
// 		id: 0,
// 		name: "Triangular Cheese Chip",
// 		img: "./images/dorito.png",
// 		price: 1,
// 		details: "This is a chip"
// 	},
// 	{
// 		id: 1,
// 		name: "Triangular Watermelon",
// 		img: "./images/watermelon.jpg",
// 		price: 2,
// 		details: "this is a watermelon slice"
// 	},
// 	{
// 		id: 2,
// 		name: "Triangular Pizza Slice",
// 		img: "./images/pizza.jpg",
// 		price: 3,
// 		details: "This is a pizza slice"
// 	},
// 	{
// 		id: 3,
// 		name: "Triangular Pie Slice",
// 		img: "./images/pie.jpg",
// 		price: 4,
// 		details: "This is a pie slice"
// 	},
// 	{
// 		id: 4,
// 		name: "Triangular Rice Ball",
// 		img: "./images/onigiri.png",
// 		price: 5,
// 		details: "This is an onigiri"
// 	},
// 	{
// 		id: 5,
// 		name: "Triangular Cake Slice",
// 		img: "./images/cake.jpg",
// 		price: 6,
// 		details: "This is a cake slice"
// 	},
// ];

var itemDatas;
// var serverUrl = "http://thiman.me:1337";
var serverUrl = "."//http://localHost:3000";

$.ajax({
 
    // The URL for the request
    url: serverUrl+"/menu",
 
    // The data to send (will be converted to a query string)
    // data: {
    // },
 
    // Whether this is a POST or GET request
    type: "GET",
 
    // The type of data we expect back
    dataType : "json",
})
// Code to run if the request succeeds (is done);
  // The response is passed to the function
  .done(function( json ) {
  	// console.log(json);f
  	// itemDatas = JSON.parse(json);
  	itemDatas = json;
  	dynamicLoad(itemDatas);
  })
  // Code to run if the request fails; the raw request and
  // status codes are passed to the function
  .fail(function( xhr, status, errorThrown ) {
    alert( "Sorry, there was a problem!" );
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  })
  // Code to run regardless of success or failure;
  .always(function( xhr, status ) {
    // alert( "The request is complete!" )
  });
















