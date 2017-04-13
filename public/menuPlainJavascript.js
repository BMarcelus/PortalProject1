// console.log('test');
	
	var itemDatas = [
		{
			id: 0,
			name: "Triangular Cheese Chip",
			img: "./images/dorito.png",
			price: 1,
			details: "This is a chip"
		},
		{
			id: 1,
			name: "Triangular Watermelon",
			img: "./images/watermelon.jpg",
			price: 2,
			details: "this is a watermelon slice"
		},
		{
			id: 2,
			name: "Triangular Pizza Slice",
			img: "./images/pizza.jpg",
			price: 3,
			details: "This is a pizza slice"
		},
		{
			id: 3,
			name: "Triangular Pie Slice",
			img: "./images/pie.jpg",
			price: 4,
			details: "This is a pie slice"
		},
		{
			id: 4,
			name: "Triangular Rice Ball",
			img: "./images/onigiri.png",
			price: 5,
			details: "This is an onigiri"
		},
		{
			id: 5,
			name: "Triangular Cake Slice",
			img: "./images/cake.jpg",
			price: 6,
			details: "This is a cake slice"
		},
	];
	
	var cart = [];
	for(var i =0;i<itemDatas.length;i++)
	{
		cart[i]=0;
	}
	var cartTotal = 0;
	var cartTotalDisplay = document.getElementById("cartTotal");
	var popupOverlay = document.querySelector(".popupOverlay");
	var currentPopup;


	var menuDiv = document.getElementById("menu");
	var popupsDiv = document.getElementById("popups");

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

	if (typeof(Storage) !== "undefined") {
		var cartString = localStorage.getItem("cart");
		var quantityStrings = [];
		for(var i=0;i<itemDatas.length;i++)quantityStrings[i]="";
		var index = 0;
		for(var i =1;i<cartString.length-1;i++)
		{
			if(cartString[i]==",")
			{
				index++;
				continue;
			}
			quantityStrings[index] += cartString[i];
		}
		var quantityInts = [];
		for(var i=0;i<quantityStrings.length;i++)
		{
			quantityInts[i] = parseInt(quantityStrings[i]);

			cartTotal += itemDatas[i].price * quantityInts[i];
		}
		cartTotalDisplay.innerHTML = priceString(cartTotal);
		cart=quantityInts;
	} else {

	}

	// for(var i =1;i<=6;i++)
	// {
	// 	var name = "item"+i+"Button";
	// 	var infoName = name+"_info";
	// 	document.getElementById(name).addEventListener("click", function()
	// 	{
	// 		document.getElementById(infoName).style.display="block";
	// 	});
	// 	// document.getElementById(name).onclick = function()
	// 	// {
	// 	// 	document.getElementById(infoName).hidden=false;
	// 	// }

	// }
	popupOverlay.addEventListener("click", function()
	{
		currentPopup.style.display="none";
		this.style.display="none";
	});
	var popups = [];
	// var popups = document.querySelectorAll(".popup");
	// {
	// 	var addButtons = document.querySelectorAll(".addButton");
		
	// 	for(var i =0;i<addButtons.length&&i<popups.length;i++)
	// 	{
	// 		addButtons[i].addEventListener("click", function()
	// 		{
	// 			popups[this.name-1].style.display="block";
	// 			popupOverlay.style.display="block";
	// 			currentPopup = popups[this.name-1];
	// 		})
	// 	}
	// }

	// document.getElementById("item1Button").onclick = function(){
	// 	document.getElementById("item1_info").style.display="block";
	// }

	// {
	// 	var closeButtons = document.querySelectorAll(".closePopup");
	// 	for(var i =0;i<closeButtons.length;i++)
	// 	{
	// 		var b = closeButtons[i];
	// 		b.addEventListener("click",function()
	// 		{
	// 			this.parentElement.style.display="none";
	// 			popupOverlay.style.display="none";
	// 		});
	// 	}

	// 	var addButtons = document.querySelectorAll(".addToCartButton");
	// 	for(var i=0;i<addButtons.length;i++)
	// 	{
	// 		var b = addButtons[i];
	// 		b.addEventListener("click", function()
	// 		{
	// 			addIndexToCart(this.name-1);
	// 			this.parentElement.style.display="none";
	// 			popupOverlay.style.display="none";
	// 		});
	// 	}
	// }

	function dynamicLoad()
	{
		for(var i =0;i<itemDatas.length;i++)
		{
			dynamicAdd(i);
		}
	}
	dynamicLoad();
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
			orderButton.name = index;
			orderButton.setAttribute("data-index", index);
			orderButton.innerHTML="Order Now";

			gridItem.appendChild(title);
			gridItem.appendChild(img);
			gridItem.appendChild(document.createElement("br"));
			gridItem.appendChild(orderButton);
			gridItem.appendChild(document.createElement("br"));

			orderButton.addEventListener("click",function()
			{
				popups[this.name].style.display="block";
				popupOverlay.style.display="block";
				currentPopup = popups[this.name];
			});
		}
		menuDiv.appendChild(gridItem);

		// var gridItem2 = `<div class = "gridItem">
		// 	<h3>${item.name}</h3>
		// 	<img src = ${item.img}/><br>
		// 	<button class="addButton" name = ${index}>Order Now</button><br>
		// </div>`;

		// menuDiv.appendChild(gridItem2);

		var popup = document.createElement("div");
		popup.className="popup";
		popup.id = "item"+index + "_info";
		{
			var title = document.createElement("H4");
			title.innerHTML=item.name;
			var img = document.createElement("img");
			img.src = item.img;
			var desc = document.createElement("p");
			desc.innerHTML=item.details;
			var price = document.createElement("p");
			price.innerHTML="Price: "+priceString(item.price);
			var cartButton = document.createElement("button");
			cartButton.className = "addToCartButton";
			cartButton.name = index;
			cartButton.setAttribute("data-index", index);
			cartButton.innerHTML = "Add to Cart";
			var closeButton = document.createElement("button");
			closeButton.className="closePopup";
			closeButton.innerHTML="Close";

			popup.appendChild(title);
			popup.appendChild(img);
			popup.appendChild(desc);
			popup.appendChild(price);
			popup.appendChild(cartButton);
			popup.appendChild(closeButton);

			closeButton.addEventListener("click",function()
			{
				this.parentElement.style.display="none";
				popupOverlay.style.display="none";
			});
			cartButton.addEventListener("click", function()
			{
				addIndexToCart(this.name);
				this.parentElement.style.display="none";
				popupOverlay.style.display="none";
			});
		}
		popupsDiv.appendChild(popup);
		popups.push(popup);
		
	}
