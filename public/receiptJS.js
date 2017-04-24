var cart = $('.cart')[0];
var totalPriceCount = 0;
var totalPriceDisplay = document.getElementById("totalprice");

function addItem(id)
{
	var item = findById(itemDatas, id);
	var cartItem = document.createElement('div');
	cartItem.className = 'cartItem';
	var img = document.createElement('img');
	img.src = item.img;

	var div2 = document.createElement('div');
	var title = document.createElement("H4");
	title.innerHTML = item.name;
	var cost = document.createElement('p');
	cost.innerHTML = "Cost: "+priceString(item.price);
	cost.className = "costDisplay";

	cartItem.appendChild(img);
	cartItem.appendChild(div2);

	cart.appendChild(cartItem);
	
	totalPriceCount += parseInt(item.price);
	totalPriceDisplay.innerHTML = priceString(totalPriceCount);

	div2.appendChild(title);
	div2.appendChild(cost);
}
var wholeCartObject;
var wholeOrderObject;
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
function dynamicLoad()
{
	$.ajax({
	    url: serverUrl+"/orders",
	    type: "GET",
	    dataType : "json",
	})
	  .done(function( order ) {
	  	wholeOrderObject=order;
	  	loadCart(order.cart);
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
	
function priceString(value)
{
	return "$" + value + ".00";
}
