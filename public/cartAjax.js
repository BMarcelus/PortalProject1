
	
	function priceString(value)
	{
		return "$" + value + ".00";
	}

	var cartArray = [0,0,0,0,0,0];
	var cart = document.querySelector(".cart");
	var totalPriceCount = 0;
	var totalPriceDisplay = document.getElementById("totalprice");
	var cartTotalDisplay = document.getElementById("cartTotal");

	function cartToString()
	{
		var result = "[";
		for(var i =0;i<cartArray.length;i++)
		{
			result += cartArray[i]+",";
		}
		result += "]";
		return result;
	}

	function saveData()
	{

	}

	function removeParent()
	{
		// totalPriceCount-= itemDatas[this.name].price;
		cart.removeChild(this.parentElement.parentElement);
		var id = this.getAttribute("data-id");
		var cartItem = findById(cartJson, id);
		var menuItem = findById(itemDatas, id);

		totalPriceCount -= menuItem.price;

		cartItem.quantity = parseInt(cartItem.quantity) - 1;
		if(cartItem.quantity==0)
		{
			deleteCartItem(cartItem);
		}
		else
		{
			patchCartItem(cartItem);
		}

		totalPriceDisplay.innerHTML = priceString(totalPriceCount);
		cartTotalDisplay.innerHTML = priceString(totalPriceCount);
		saveData();
	}


	function addItem(id, shouldUpdate, beforeElement)
	{
		var item = findById(itemDatas, id);
		var cartItem = document.createElement('div');
		cartItem.className = 'cartItem';
		var img = document.createElement('img');
		img.src = item.img;

		var div2 = document.createElement('div');
		var title = document.createElement("H4");
		title.innerHTML = item.name;
		// title.appendChild(document.createTextNode(itemDatas[i].name));
		var remove = document.createElement('a');
		remove.innerHTML="remove";
		remove.className = "clickable";
		remove.setAttribute("data-id", id);
		remove.addEventListener("click", removeParent);
		var details = document.createElement('a');
		details.innerHTML="details";
		details.className = "clickable";
		var add = document.createElement('a');
		add.innerHTML="add";
		add.setAttribute("data-id", id);
		add.className = "clickable";
		add.addEventListener('click', function(){addItem(this.getAttribute("data-id"),true,this.parentElement.parentElement);});
		var cost = document.createElement('p');
		cost.innerHTML = "Cost: "+priceString(item.price);
		cost.className = "costDisplay";


		cartItem.appendChild(img);
		cartItem.appendChild(div2);

		if(beforeElement)
		{
			cart.insertBefore(cartItem, beforeElement);
		}
		else
		{
			cart.appendChild(cartItem);
		}

		div2.appendChild(title);
		div2.appendChild(remove);
		div2.appendChild(details);
		div2.appendChild(add);
		div2.appendChild(cost);

		totalPriceCount += parseInt(item.price);
		totalPriceDisplay.innerHTML = priceString(totalPriceCount);
		cartTotalDisplay.innerHTML = priceString(totalPriceCount);

		if(shouldUpdate)
		{
			var cartItem = findById(cartJson, id);
			cartItem.quantity = parseInt(cartItem.quantity)+1;
			patchCartItem(cartItem);
			// cartArray[index]++;
			// saveData();
		}
	}
var cartJson;

function dynamicLoad()
{
	$.ajax({
 
	    // The URL for the request
	    url: "http://thiman.me:1337/cart/brian",
	 
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
	  	// console.log(json);
	  	// itemDatas = JSON.parse(json);
	  	cartJson = json;
	  	loadCart(json);
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
	    // alert( "The request is complete!" );
	  });
}


function findById(array, id)
{
	for(var i =0;i<array.length;i++)
	{
		if(array[i]._id == id)return array[i];
	}
}

function loadCart(json)
{
	for(var i =0;i<json.length;i++)
	{
		for(var j =0;j<json[i].quantity;j++)
			addItem(json[i]._id);
	}
}


function deleteCartItem(item)
	{
		$.ajax({
	 
		    // The URL for the request
		    url: "http://thiman.me:1337/cart/brian/"+item._id,
		 
		    // Whether this is a POST or GET request
		    type: "DELETE",
		 
		    // The type of data we expect back
		    // dataType : "json",
		})
		  .done(function( json ) {
		  })
		  .fail(function( xhr, status, errorThrown ) {
		    alert( "Sorry, there was a problem!" );
		    console.log( "Error: " + errorThrown );
		    console.log( "Status: " + status );
		    console.dir( xhr );
		  });
		  
	}
function patchCartItem(item)
	{
		$.ajax({
	 
		    // The URL for the request
		    url: "http://thiman.me:1337/cart/brian/"+item._id,
		 
		    data: item,
		 
		    // Whether this is a POST or GET request
		    type: "PATCH",
		 
		    // The type of data we expect back
		    dataType : "json",
		})
		  .done(function( json ) {
		  	
		  })
		  .fail(function( xhr, status, errorThrown ) {
		    alert( "Sorry, there was a problem!" );
		    console.log( "Error: " + errorThrown );
		    console.log( "Status: " + status );
		    console.dir( xhr );
		  });
	}