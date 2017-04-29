
	var serverUrl = "."//"http://localHost:3000";
	var activeCoupon;
	var hasCoupon=false;
	var discountPrice;
	
	function discountPriceString(value)
	{
		if(activeCoupon){
			if(activeCoupon.discountType === "Percentage Off"){
				value = value * (100-activeCoupon.discount)/100;
			}
			else if(activeCoupon.discountType === "Flat $ Discount"){
				value -= activeCoupon.discount;
			}
			else if(activeCoupon.discountType === "Buy One Get One Free")
			{
				var max, secondMax;
				wholeCartObject.items.forEach(function(item){
					var mi = findById(itemDatas, item.menuID);
					if(mi){
						var price = mi.price;
						if(!max||price>=max){
							secondMax=max;
							max=price;
							if(item.quantity>1)secondMax=max;
						}
					}
				})
				if(secondMax){
					value-=secondMax;
				}
			}
			if(value<0)value=0;
			discountPrice = value;
		
		}
		return "$"+value;
		// return "$" + value + ( (Math.floor(value)==value) ? ".00" : "");
	}
	function priceString(value){
		return "$"+value;
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

		totalPriceDisplay.innerHTML = discountPriceString(totalPriceCount);
		cartTotalDisplay.innerHTML = discountPriceString(totalPriceCount);

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
		// div2.appendChild(details);
		div2.appendChild(add);
		div2.appendChild(cost);

		totalPriceCount += parseInt(item.price);
		totalPriceDisplay.innerHTML = discountPriceString(totalPriceCount);
		cartTotalDisplay.innerHTML = discountPriceString(totalPriceCount);

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
	if(wholeCartObject.coupon){
		addCouponDisplay(wholeCartObject.coupon);
		activeCoupon=wholeCartObject.coupon;
		hasCoupon=true;
	}
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
	if(hasCoupon)
	wholeCartObject.discountPrice = discountPrice;
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



var couponDisplay = $('#couponList')[0];
function addCouponDisplay(coupon){
	couponDisplay.innerHTML = "";
	var gridItem = document.createElement("div");
	gridItem.className = "gridItem";
	var title = document.createElement("H3");
	title.innerHTML="Coupon: "+coupon.name;
	var discountType = document.createElement("p");
	discountType.innerHTML = "Discount Type: "+coupon.discountType;
	var discount = document.createElement("p");
	discount.innerHTML = "Discount: "+coupon.discount;



	gridItem.appendChild(title);
	gridItem.appendChild(discountType);
	gridItem.appendChild(discount);

	couponDisplay.appendChild(gridItem);

}





var couponCode = $('input[name=couponcode]')[0];
$('#couponForm').on('submit', function(e){
	e.preventDefault();
	var code = couponCode.value;
	$.ajax({
		url:  "./coupons/code",
		data: {code, cartID: wholeCartObject._id},
	    type: "POST",
	    dataType : "json",
	})
	  .done(function( res ) {

	  	console.log(res);
	  	if(res.noCart){
	  		alert("No Cart");
	  	}
	  	else if(res.outOfUses){
	  		alert("Out of uses");
	  	}
	  	else if(res.disabled){
	  		alert("Error: Coupon disabled")
	  	}
	  	else if(res.invalidCode){
	  		alert("Invalid Code");
	  	}
	  	else{
	  		// alert("success");
	  		addCouponDisplay(res.coupon);
	  		activeCoupon=res.coupon;
	  		hasCoupon=true;
	  		// totalPriceCount = res.newPrice;
	  		totalPriceDisplay.innerHTML = discountPriceString(totalPriceCount);
			cartTotalDisplay.innerHTML = discountPriceString(totalPriceCount);
	  	}
	  })
	  .fail(function( xhr, status, errorThrown ) {
	    alert( "Sorry, there was a problem!" );
	    console.log( "Error: " + errorThrown );
	    console.log( "Status: " + status );
	    console.dir( xhr );
	  });
})


