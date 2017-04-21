
var serverUrl = "."//http://localHost:3000";


	var cart = [];
	var cartTotal = 0;
	var cartTotalDisplay = document.getElementById("cartTotal");
	var popupOverlay = document.querySelector(".popupOverlay");
	var popupOverlay = $('.popupOverlay');
	var modal = $('#modal');

	var wholeCartObject = {};


	var menuDiv = document.getElementById("menu");

	function priceString(value)
	{
		return "$" + value + ".00";
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
		wholeCartObject.items = trimmedCart(cart);
		// console.log(wholeCartObject);
		$.ajax({
		    url: serverUrl + "/cart",
		    data: wholeCartObject,
		    type: "POST",
		    dataType : "json",
		})
		  .done(function( json ) {
		  	// console.log(json);
		  	wholeCartObject=json;
		  })
		  .fail(function( xhr, status, errorThrown ) {
		    alert( "Sorry, there was a problem!" );
		    console.log( "Error: " + errorThrown );
		    console.log( "Status: " + status );
		    console.dir( xhr );
		  });
	}
	
	function addIdToCart(id)
	{
		for(var i =0;i<cart.length;i++)
		{
			var item = cart[i];
			if(item.menuID ==id)
			{
				item.quantity++;
				break;
			}
		}
		for(var i=0;i<itemDatas.length;i++)
		{
			var item = itemDatas[i];
			if(item._id == id)
			{
				cartTotal += parseInt(item.price);
				cartTotalDisplay.innerHTML = priceString(cartTotal);
				break;
			}
		}
		wholeCartObject.totalPrice = cartTotal;
		postWholeCart();
	}

	popupOverlay.on("click", function()
	{
		modal.addClass("hide");
		popupOverlay.addClass("hide");
	});

	var currentSelection = 0;

	function findByMenuId(array, id)
	{
		for(var i =0;i<array.length;i++)
		{
			if(array[i].menuID == id)return array[i];
		}
	}
	function findById(array, id)
	{
		for(var i =0;i<array.length;i++)
		{
			if(array[i]._id == id)return array[i];
		}
	}
	var cartItems;
	function loadCart(json)
	{
		if(json)
			wholeCartObject=json;
		else
			wholeCartObject={};
		if(!wholeCartObject||!wholeCartObject.items)
			cartItems=[];
		else
			cartItems= json.items;
		for(var i =0;i<cartItems.length;i++)
		{
			var cartItem = findByMenuId(cart, cartItems[i].menuID);
			cartItem.quantity = cartItems[i].quantity;
			cartItem._id = cartItems[i]._id;
			var item = findById(itemDatas, cartItems[i].menuID);
			cartTotal += parseInt(item.price) * parseInt(cartItem.quantity);
		}
		cartTotalDisplay.innerHTML = priceString(cartTotal);
	}

	function dynamicLoad()
	{
		for(var i =0;i<itemDatas.length;i++)
		{
			dynamicAdd(i);
			cart[i]={menuID:itemDatas[i]._id, quantity:0};
		}
		$.ajax({
	 
		    // The URL for the request
		    url: serverUrl+"/cart",
		 
		    // The data to send (will be converted to a query string)
		    // data: {
		    // },
		 
		    // Whether this is a POST or GET request
		    type: "GET",
		 
		    // The type of data we expect back
		    dataType : "json",
		})
		  .done(function( json ) {
		  	// console.log(json);
		  	loadCart(json);
		  })
		  .fail(function( xhr, status, errorThrown ) {
		    alert( "Sorry, there was a problem!" );
		    console.log( "Error: " + errorThrown );
		    console.log( "Status: " + status );
		    console.dir( xhr );
		  })
	}

	function dynamicAdd(index)
	{
		var item = itemDatas[index];
		var gridItem = document.createElement("div");
		gridItem.className = "gridItem";
		{
			var title = document.createElement("H3");
			title.innerHTML=item.name;
			var img = document.createElement("img");
			img.src= item.img;
			var orderButton = document.createElement("button");
			orderButton.className="addButton";
			orderButton.id = "item"+(index)+"Button";
			// orderButton.name = index;
			orderButton.setAttribute("data-id", item._id);
			orderButton.innerHTML="Order Now";

			gridItem.appendChild(title);
			gridItem.appendChild(img);
			gridItem.appendChild(document.createElement("br"));
			gridItem.appendChild(orderButton);
			gridItem.appendChild(document.createElement("br"));


			orderButton.addEventListener("click",function()
			{
				popupOverlay.removeClass("hide");
				modal.removeClass("hide");
				document.querySelector('#modal h4').innerHTML = item.name;
				document.querySelector('#modal img').src = item.img;
				document.querySelector('#modal p').innerHTML = item.details;
				currentSelection = this.getAttribute("data-id");
			});
		}
		menuDiv.appendChild(gridItem);

		
	}


$('#modal button').on("click", function()
{
	addIdToCart(currentSelection);
	modal.addClass("hide");
	popupOverlay.addClass("hide");
});





