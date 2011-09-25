function showDetails(e,data) {
	$(this).show().siblings().hide();
	if (this.id == "SHOW_CLUSTER") $("#INSTANCE_LIST").show();
};

$.extend($.UIOS,{
	Products: [
		new _UIO("#PRODUCT_LIST")
	],
	Customers: [
		new _UIO("#CUSTOMER_LIST")
	]
});

function XDOLiveEvents(){
	$("a.refresh").live("click",function(){
		$.triggerEvent("refreshEvent", this.rev.split("#"));
		return false;
	});
	$("a.showObj").live("click", function(){
		$.triggerEvent('showObjEvent', this.rev.split("#"));
		return false;
	});
	$("a.action").live("click", function(){
		$.triggerEvent('actionEvent',(this.rev).split("#"));
		return false;
	});
	$("li.treeLi").live("click", function(){
		$(this).addClass("on").siblings(".on").removeClass("on");
		$("a", this).click();
		return false;
	});
};

function XDOCustomEvents(){
	$.regEvent({
		"moduleLoadedEvent": function(e, t){
			$("a.refresh",t).click();
		},
		"refreshEvent": function(e, t, url, f){
			var x = $.XDOS[t];
			if (x) x.show(url, f);
		},
		"showObjEvent": function(e, t, url){
			var x = $.XDOS[t];
			if (x) x.show(url);
		},
		"destroyEvent": function(e, t, p){
			var x = $.XDOS[t];
			if (x) x.destroy(p);
		},
		"actionEvent": function(e, t, a, p){
			var x = $.XDOS[t];
			if (x) x.action(a, p);
		}
	});
};

$(function(){
	XDOLiveEvents();
	XDOCustomEvents();
	$.getJSON("root.js",function(data){
		for (var i = 0; i < data.length; i++) new XDO(data[i]);
	});
});
