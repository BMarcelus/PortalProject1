
var signinEmail = document.querySelector("#signinForm input[name=email]");
var signinPassword = document.querySelector("#signinForm input[name=password]");
var signinEmailError = document.querySelector("#signinEmailMissing");
var signinPasswordError = document.querySelector("#signinPasswordMissing");

var registerName = document.querySelector("#registerForm input[name=firstname]");
var registerLastName = document.querySelector("#registerForm input[name=lastname]");
var registerEmail = document.querySelector("#registerForm input[name=email]");
var registerPassword = document.querySelector("#registerForm input[name=password]");

var registerNameError = document.querySelector("#registerNameMissing");
var registerLastNameError = document.querySelector("#registerLastNameMissing");
var registerEmailError = document.querySelector("#registerEmailMissing");
var registerPasswordError = document.querySelector("#registerPasswordMissing");


var serverUrl= "http://localhost:3000";


document.getElementById("signinButton").addEventListener("click", function(e)
{
	e.preventDefault();
	signinPasswordError.style.display="none";
	signinEmailError.style.display="none";
	var filled = true;
	if(signinEmail.value == "" || signinEmail.value.indexOf("@")==-1 || signinEmail.value.indexOf(".")==-1)
	{
		signinEmailError.style.display = "block";
		filled=false;
	}
	if(signinPassword.value == "")
	{
		signinPasswordError.style.display = "block";
		filled=false;
	}
	if(filled)
	$.ajax({
		url: serverUrl+"/user/login",
		data: {
			email: signinEmail.value,
			password: signinPassword.value
		},
		type: "POST",
		dataType: 'json',
	})
	.done(function( json ) {
	  	console.log(json);
	  	if(json.length==0)
	  	{
	  		alert("invalid login");
	  	}
	  	else
	  	{
	 	 	window.location = '/';	
	  	}
	 })
	 .fail(function( xhr, status, errorThrown ) {
	    alert( "Sorry, there was a problem!" );
	    console.log( "Error: " + errorThrown );
	    console.log( "Status: " + status );
	    console.dir( xhr );
	  })
});

document.getElementById("createAccountButton").addEventListener("click", function(e)
{
	e.preventDefault();
	registerNameError.style.display="none";
	registerLastNameError.style.display="none";
	registerEmailError.style.display="none";
	registerPasswordError.style.display="none";
	var filled = true;
	if(registerName.value == "")
	{
		registerNameError.style.display = "block";
		filled=false;
	}
	if(registerLastName.value == "")
	{
		registerLastNameError.style.display = "block";
		filled=false;
	}
	if(registerEmail.value == "" || registerEmail.value.indexOf("@")==-1 || registerEmail.value.indexOf(".")==-1)
	{
		registerEmailError.style.display = "block";
		filled=false;
	}
	if(registerPassword.value == "")
	{
		registerPasswordError.style.display = "block";
		filled=false;
	}
	if(filled)
		$.ajax({
			url: serverUrl+"/user",
			data:
			{
				email: registerEmail.value,
				password: registerPassword.value,
				firstname: registerName.value,
				lastname: registerLastName.value
			},
			type: "POST",
			dataType: 'json'
		})
		.done(function( json ) {
		  	console.log(json);
		  	if(json==[])
		  	{
		  		alert("email already registered");
		  	}
		  	else
		  	{
		  		window.location = '/';
		  	}
	  })
	  .fail(function( xhr, status, errorThrown ) {
	    alert( "Sorry, there was a problem!" );
	    console.log( "Error: " + errorThrown );
	    console.log( "Status: " + status );
	    console.dir( xhr );
	  });
});

