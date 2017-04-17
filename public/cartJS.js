
	var itemDatas = [
		{
			name: "Triangular Cheese Chip",
			img: "./images/dorito.png",
			price: 1
		},
		{
			name: "Triangular Watermelon",
			img: "./images/watermelon.jpg",
			price: 2
		},
		{
			name: "Triangular Pizza Slice",
			img: "./images/pizza.jpg",
			price: 3
		},
		{
			name: "Triangular Pie Slice",
			img: "./images/pie.jpg",
			price: 4
		},
		{
			name: "Triangular Rice Ball",
			img: "./images/onigiri.png",
			price: 5
		},
		{
			name: "Triangular Cake Slice",
			img: "./images/cake.jpg",
			price: 6
		},
	];
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
		localStorage.setItem("cart", cartToString());
		localStorage.setItem("totalPrice", priceString(totalPriceCount));
	}

	function removeParent()
	{
		totalPriceCount-= itemDatas[this.name].price;
		cartArray[this.name]--;
		cart.removeChild(this.parentElement.parentElement);
		totalPriceDisplay.innerHTML = priceString(totalPriceCount);
		cartTotalDisplay.innerHTML = priceString(totalPriceCount);
		saveData();
	}


	function addItem(index, shouldUpdate, beforeElement)
	{
		var item = itemDatas[index];
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
		remove.name = index;
		remove.className = "clickable";
		remove.addEventListener("click", removeParent);
		var details = document.createElement('a');
		details.innerHTML="details";
		details.className = "clickable";
		var add = document.createElement('a');
		add.innerHTML="add";
		add.name = index;
		add.className = "clickable";
		add.addEventListener('click', function(){addItem(this.name,true,this.parentElement.parentElement);});
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

		totalPriceCount += item.price;
		totalPriceDisplay.innerHTML = priceString(totalPriceCount);
		cartTotalDisplay.innerHTML = priceString(totalPriceCount);

		if(shouldUpdate)
		{
			cartArray[index]++;
			saveData();
		}
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
				index++;continue;
			}
			quantityStrings[index] += cartString[i];
		}
		var quantityInts = [];
		for(var i=0;i<quantityStrings.length;i++)
		{
			quantityInts[i] = parseInt(quantityStrings[i]);
		}
		for(var i=0;i<quantityInts.length;i++)
		{
			for(var j =0;j<quantityInts[i];j++)
			{
				addItem(i);
			}
		}
		cartArray = quantityInts;
	} else {

	}