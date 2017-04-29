var cart = $('.cart')[0];
var totalPriceCount = 0;
var totalPriceDisplay = document.getElementById("totalprice");

var activeCoupon;

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
	
	}
	return "$"+value;
	// return "$" + value + ( (Math.floor(value)==value) ? ".00" : "");
}

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
	totalPriceDisplay.innerHTML = discountPriceString(totalPriceCount);

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

function priceString(value){
	return "$"+value;
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


