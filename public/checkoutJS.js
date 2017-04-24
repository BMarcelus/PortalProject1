
var payButton = document.getElementById("payButton");

// var fields = document.querySelectorAll("input[type=text]");
var fields = $('.required');
var errors = document.querySelectorAll(".errorMessage");
var paymentOption = $('#paymentOption');
var creditFields = $('.credit');
var creditContainer = $('.creditContainer')[0];

serverUrl = ".";

paymentOption.on("change", function(e)
{
	if(paymentOption[0].selectedIndex==0)
	{
		creditContainer.style.display = "block";
	}
	else
	{
		creditContainer.style.display="none";
	}
})

$('form').on("submit", function(e){
	e.preventDefault();
	var valid = true;
	var j = 0;
	for(var i =0;i<fields.length;i++)
	{
		if(fields[i].value == "")
		{
			e.preventDefault();
			errors[i].style.display = "block";
			valid = false;
		}
		else
		{
			errors[i].style.display = "none";
		}
		j=i;
	}
	j++;
	if(paymentOption[0].selectedIndex == 0)
	{
		for(var i =0;i<creditFields.length;i++)
		{
			if(creditFields[i].value == "")
			{
				e.preventDefault();
				errors[j+i].style.display = "block";
				valid = false;
			}
			else
			{
				errors[j+i].style.display = "none";
			}
		}
	}
	if(valid)
	{
		console.log("about to post");

		if(!wholeCartObject)
		{
			console.log("no loaded cart to order");
			alert("No cart to checkout");
			return;
		}
		var order = {
			cart: wholeCartObject,
	    	deliveryAddress: {
				country: $('input[name=country]')[0].value,
				streetAddress: $('input[name=address]')[0].value, 
				apt: $('input[name=apt]')[0].value,
				zipCode: $('input[name=zipcode]')[0].value,
			},
			userInfo:{
				firstname: $('input[name=firstname]')[0].value,
				lastname: $('input[name=lastname]')[0].value,
				email: $('input[name=email]')[0].value,
				phone: $('input[name=phone]')[0].value
			},
			paymentType: paymentOption[0].value
		}
		if(order.paymentType==="credit")
		{
			order.creditInfo = {
				cardNumber: $('input[name=cardnumber]')[0].value,
				securityCode: $('input[name=securitycode]')[0].value,
				expirationDate: $('input[name=cardexpire]')[0].value,
				name: $('input[name=cardname]')[0].value,
				zipCode: $('input[name=cardzip]')[0].value,
			}
		}
		console.log(order);
		e.preventDefault();
		$.ajax({
		    url: serverUrl + "/orders",
		    data: order,
		    type: "POST",
		    dataType : "json",
		})
		  .done(function( json ) {
		  	window.location = "/receipt";

		  })
		  .fail(function( xhr, status, errorThrown ) {
		    alert( "Sorry, there was a problem!" );
		    console.log( "Error: " + errorThrown );
		    console.log( "Status: " + status );
		    console.dir( xhr );
		  });
	}
});

var wholeCartObject;
$.ajax({
	url: serverUrl + "/cart",
	type: "GET",
	dataType: "json",
})
	.done(function(cart){
		wholeCartObject=cart;
	})
	.fail(function(xhr, status, errorThrown){
		alert( "Sorry, there was a problem!" );
	    console.log( "Error: " + errorThrown );
	    console.log( "Status: " + status );
	    console.dir( xhr );
	})

// payButton.addEventListener("click", function(e){
// 	for(var i =0;i<fields.length;i++)
// 	{
// 		if(fields[i].value == "")
// 		{
// 			e.preventDefault();
// 			errors[i].style.display = "block";
// 		}
// 		else
// 		{
// 			errors[i].style.display = "none";
// 		}
// 	}
// });