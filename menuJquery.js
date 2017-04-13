	// var button = $("<button/>").addClass('button').text("add to cart");
	// var container = $('<div/>').addClass('menu-item');
	// var title = $('<div/>').addClass('title').html(item.title);
	// var image = $('<img/>').attr('id', `menu-${i}`).attr('src', item.img);
	// var itemEle = $('<div/>').addClass("item").append(image);

	// container
	// 	.append(title)
	// 	.append(itemEle)
	// 	.append(button);

var serverUrl = "http://thiman.me:1337";


	var cart = [];
	var cartTotal = 0;
	var cartTotalDisplay = document.getElementById("cartTotal");
	var popupOverlay = document.querySelector(".popupOverlay");
	var popupOverlay = $('.popupOverlay');
	var modal = $('#modal');


	var menuDiv = document.getElementById("menu");

	function priceString(value)
	{
		return "$" + value + ".00";
	}
	function cartToString()
	{
		var result = "[";
		for(var i =0;i<cart.length;i++)
		{
			result += cart[i]+",";
		}
		result += "]";
		return result;
	}
	function addIndexToCart(index)
	{
		cart[index] ++;
		cartTotal += itemDatas[index].price;
		cartTotalDisplay.innerHTML = priceString(cartTotal);
		localStorage.setItem("cart", cartToString());
		localStorage.setItem("totalPrice", priceString(cartTotal));
	}

	function postCartItem(item)
	{
		$.ajax({
	 
		    // The URL for the request
		    url: "http://thiman.me:1337/cart/brian",
		 
		    data: item,
		 
		    // Whether this is a POST or GET request
		    type: "POST",
		 
		    // The type of data we expect back
		    dataType : "json",
		})
		// Code to run if the request succeeds (is done);
		  // The response is passed to the function
		  .done(function( json ) {
		  })
		  // Code to run if the request fails; the raw request and
		  // status codes are passed to the function
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
		// Code to run if the request succeeds (is done);
		  // The response is passed to the function
		  .done(function( json ) {
		  })
		  // Code to run if the request fails; the raw request and
		  // status codes are passed to the function
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
			if(item._id ==id)
			{
				item.quantity++;
				if(item.quantity==1)
				{
					postCartItem(item);
				}
				else
				{
					patchCartItem(item);
				}
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
		// cart[index] ++;
		// cartTotal += itemDatas[index].price;
		// cartTotalDisplay.innerHTML = priceString(cartTotal);
		// localStorage.setItem("cart", cartToString());
		// localStorage.setItem("totalPrice", priceString(cartTotal));
	}

	// if (typeof(Storage) !== "undefined") {
	// 	var cartString = localStorage.getItem("cart");
	// 	var quantityStrings = [];
	// 	for(var i=0;i<itemDatas.length;i++)quantityStrings[i]="";
	// 	var index = 0;
	// 	for(var i =1;i<cartString.length-1;i++)
	// 	{
	// 		if(cartString[i]==",")
	// 		{
	// 			index++;
	// 			continue;
	// 		}
	// 		quantityStrings[index] += cartString[i];
	// 	}
	// 	var quantityInts = [];
	// 	for(var i=0;i<quantityStrings.length;i++)
	// 	{
	// 		quantityInts[i] = parseInt(quantityStrings[i]);

	// 		cartTotal += itemDatas[i].price * quantityInts[i];
	// 	}
	// 	cartTotalDisplay.innerHTML = priceString(cartTotal);
	// 	cart=quantityInts;
	// } else {

	// }

	popupOverlay.on("click", function()
	{
		modal.addClass("hide");
		popupOverlay.addClass("hide");
	});

	var currentSelection = 0;

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
			var cartItem = findById(cart, json[i]._id);
			cartItem.quantity = json[i].quantity;
			var item = findById(itemDatas, json[i]._id);
			cartTotal += parseInt(item.price) * parseInt(cartItem.quantity);
		}

		cartTotalDisplay.innerHTML = priceString(cartTotal);
	}

	function dynamicLoad()
	{
		for(var i =0;i<itemDatas.length;i++)
		{
			dynamicAdd(i);
			cart[i]={_id:itemDatas[i]._id, quantity:0};
		}
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
	// dynamicLoad();
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
				// popups[this.name].style.display="block";
				// popupOverlay.style.display="block";
				// currentPopup = popups[this.name];
				popupOverlay.removeClass("hide");
				modal.removeClass("hide");
				document.querySelector('#modal h4').innerHTML = item.name;
				document.querySelector('#modal img').src = item.img;
				document.querySelector('#modal p').innerHTML = item.details;
				currentSelection = this.getAttribute("data-id");
			});
		}
		menuDiv.appendChild(gridItem);

		// var gridItem2 = `<div class = "gridItem">
		// 	<h3>${item.name}</h3>
		// 	<img src = ${item.img}/><br>
		// 	<button class="addButton" name = ${index}>Order Now</button><br>
		// </div>`;

		// menuDiv.appendChild(gridItem2);


		
	}


$('#modal button').on("click", function()
{
	addIdToCart(currentSelection);
	modal.addClass("hide");
	popupOverlay.addClass("hide");
});





