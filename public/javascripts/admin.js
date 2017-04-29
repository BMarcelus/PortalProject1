

$("form").on("submit", function(e){
	e.preventDefault();
	var coupon = {
		name: $('input[name=Name]')[0].value,
		code: $('input[name=Code]')[0].value,
		discountType: $('select')[0].value,
		discount: $('input[name=discount]')[0].value,
		numberOfUses: $('input[name=numuse]')[0].value,
	}
	$.ajax({
	    url:  "./coupons",
	    data: coupon,
	    type: "POST",
	    dataType : "json",
	})
	  .done(function( res ) {
	  	if(res)
	  		addCouponDisplay(res);
	  })
	  .fail(function( xhr, status, errorThrown ) {
	    alert( "Sorry, there was a problem!" );
	    console.log( "Error: " + errorThrown );
	    console.log( "Status: " + status );
	    console.dir( xhr );
	  });

});

var discountTypeSelect = $("select");
var discountLabel = $("#discountLabel")[0];
discountTypeSelect.on("change",function(e){
	console.log(discountTypeSelect);
	if(discountTypeSelect[0].selectedIndex==0){
		discountLabel.innerHTML = "Percentage Off:";
	}
	else if(discountTypeSelect[0].selectedIndex==1){
		discountLabel.innerHTML = "Discount:";
	}
	else if(discountTypeSelect[0].selectedIndex==2){
		discountLabel.innerHTML = "Max Price:";
	}
})

var couponDisplay = $('#couponList')[0];

function addCouponDisplay(coupon){

	var gridItem = document.createElement("div");
	gridItem.className = "gridItem";
	var title = document.createElement("H3");
	title.innerHTML="Name: "+coupon.name;
	var code = document.createElement("p");
	code.innerHTML="Code: "+coupon.code;
	var discountType = document.createElement("p");
	discountType.innerHTML = "Discount Type: "+coupon.discountType;
	var discount = document.createElement("p");
	discount.innerHTML = "Discount: "+coupon.discount;
	var numuse = document.createElement("p");
	numuse.innerHTML = "Number of Uses: "+coupon.numberOfUses;

	var disableButton = document.createElement("button");
		disableButton.innerHTML = coupon.enabled ? "Disable" : "Enable";

	var enabled = document.createElement("p");
	enabled.innerHTML = coupon.enabled ? "Enabled" : "Disabled";

	gridItem.appendChild(enabled);
	gridItem.appendChild(title);
	gridItem.appendChild(code);
	gridItem.appendChild(discountType);
	gridItem.appendChild(discount);
	gridItem.appendChild(numuse);
	gridItem.appendChild(disableButton);

	couponDisplay.appendChild(gridItem);

	disableButton.addEventListener("click", function(){
		coupon.enabled=!coupon.enabled;
		$.ajax({
			url: './coupons',
			type: 'PATCH',
			data: coupon,
			dataType: "json"
		})
		.done(function(res){
			coupon = res;
			console.log(res);
		})
		.fail(function( xhr, status, errorThrown ) {
		    alert( "Sorry, there was a problem!" );
		    console.log( "Error: " + errorThrown );
		    console.log( "Status: " + status );
		    console.dir( xhr );
		  });
		disableButton.innerHTML = coupon.enabled ? "Disable" : "Enable";
		enabled.innerHTML = coupon.enabled ? "Enabled" : "Disabled";
	})

}


$.ajax({
    url:  "./coupons",
    type: "GET",
    dataType : "json",
})
  .done(function( res ) {
  	res.forEach(function(e){
  		console.log(e);
  		addCouponDisplay(e);
  	})
  })
  .fail(function( xhr, status, errorThrown ) {
    alert( "Sorry, there was a problem!" );
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  });