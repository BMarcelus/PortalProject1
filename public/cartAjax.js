
	var serverUrl = "."//"http://localHost:3000";
	
	function priceString(value)
	{
		return "$" + value + ".00";
	}

	var cartArray = [0,0,0,0,0,0];
	var cart = document.querySelector(".cart");
	var totalPriceCount = 0;
	var totalPriceDisplay = document.getElementById("totalprice");
	var cartTotalDisplay = document.getElementById("cartTotal");

	var cartItems = [];
	var wholeCartObject = {};

	function removeParent()
	{
		cart.removeChild(this.parentElement.parentElement);
		var id = this.getAttribute("data-id");
		var cartItem = findByMenuId(cartItems, id);
		var menuItem = findById(itemDatas, id);

		totalPriceCount -= menuItem.price;

		cartItem.quantity = parseInt(cartItem.quantity) - 1;

		totalPriceDisplay.innerHTML = priceString(totalPriceCount);
		cartTotalDisplay.innerHTML = priceString(totalPriceCount);

		wholeCartObject.totalPrice = totalPriceCount;
		postWholeCart();
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
			var cartItem = findByMenuId(cartItems, id);
			cartItem.quantity = parseInt(cartItem.quantity)+1;
			wholeCartObject.totalPrice = totalPriceCount;
			postWholeCart();
		}
	}

function dynamicLoad()
{
	$.ajax({
	    url: serverUrl+"/cart",
	    type: "GET",
	    dataType : "json",
	})
	  .done(function( json ) {
	  	loadCart(json);
	  })
	  .fail(function( xhr, status, errorThrown ) {
	    alert( "Sorry, there was a problem!" );
	    console.log( "Error: " + errorThrown );
	    console.log( "Status: " + status );
	    console.dir( xhr );
	  })
}


function findById(array, id)
{
	for(var i =0;i<array.length;i++)
	{
		if(array[i]._id == id)return array[i];
	}
}
function findByMenuId(array, id)
{
	for(var i =0;i<array.length;i++)
	{
		if(array[i].menuID == id)return array[i];
	}
}
function loadCart(json)
{
	wholeCartObject=json;
	if(!wholeCartObject||!wholeCartObject.items)
		wholeCartObject.items=[];
	cartItems = wholeCartObject.items;
	for(var i =0;i<cartItems.length;i++)
	{
		for(var j =0;j<cartItems[i].quantity;j++)
			addItem(cartItems[i].menuID);
	}
}
function trimmedCart(itemsarray)
{
	var result = [];
	itemsarray.forEach(function(item)
	{
		if(item.quantity>0)
			result.push(item);
	})
	return result;
}
function postWholeCart()
{
	wholeCartObject.items = trimmedCart(cartItems);
	$.ajax({
	    url: serverUrl + "/cart",
	    data: wholeCartObject,
	    type: "POST",
	    dataType : "json",
	})
	  .done(function( json ) {
	  	wholeCartObject=json;
	  })
	  .fail(function( xhr, status, errorThrown ) {
	    alert( "Sorry, there was a problem!" );
	    console.log( "Error: " + errorThrown );
	    console.log( "Status: " + status );
	    console.dir( xhr );
	  });
}
