/*
 * XML Data Object, cache+view layer for server side resources
 * with RESTful resource discovery mechanism embedded 
 * Currently only support JSON formatted data
 *
 * A Global Naming System of Resources is necessary to avoid conflict & simplify implementation
 * Furthermore, domain/site NameSpaces should be considered also to support cross-site computing
 */

$.extend({
	XDOS: {},
	UIOS: {}
});

/*
 * XML Data Object, actually JSON Data Object for now
 * Initialization sample
 * objCollection = {
		name:	"Products",
		url:  	"/products",
		type:	"Collection",
		data:	[]	//list of objects
   }
 * objMember = {
		name:	"Product",
		url:  	"/products/123",
		type:	"Member",
		data:	{}	//properties, may include sub-objects
   }
 */
function XDO(obj) {
	$.extend(this, obj);
	this.label = obj.label || obj.name;
	this.loaded = false;

	if (!$.XDOS[this.name]) $.XDOS[this.name] = new XDO_List;
	$.XDOS[this.name].push(this);
};

/*
 * Hash to store a series of XDO objects of the same name
 */
function XDO_List() {
	this.list = {};
	this.one = false;
};

/*
 * UI Objects, show XDO by transforming its data into HTML through JSONT
 * Currently using the Chain.js engine
 */
function _UIO(id, chain, update){
	this.ID = id;					//Selector for $() to find target element(s)
	this.chain = chain || {};		//Transformation string to change XDO into HTML
	this.update = update || null;	//Optional update event call back
};

/*
 * Extend XDO object
 */
$.extend(XDO.prototype, {
	//Ajax load data into object, load all children recursively if deep==true
	loadData:function(deep) {
		var y = this;

		$.ajax({
			async:		false,	//Synchronous load for now
			url:		y.url,
			dataType:	"json",
			success:	function(data){
				if (data.error) {
					$.gritter.add({
						title: 'Data Loading Error - ' + y.label,
						text: data.error,
						image: false
					});
					return;
				};
				y.loaded = true;
				switch (y.type) {
				case	"Collection":		//Array of objects expected - [{},{}]
						y.data = [];
	
						for (var i in data) {
							y.data.push(new XDO(data[i]));
						}
						if (deep) for (i in data) y.data[i].loadData(true);
						break;
				case	"Member":			//One Object expected - {}
						$.extend(y, data);
						//Initialize sub-resource XDO objects if any
						for (p in y) if (y[p].type) y[p] = new XDO(y[p]);
						break;
				};
				$.alert({
					title: y.label,
					text: 'loaded successfully!'
				});
			}
		});
		return y.loaded;
	},
	//Show XDO on screen through UIO of the same name, call loadData if forceLoad==true
	show:function(forceLoad) {
		var u = $.UIOS[this.name];
		if (!u) return;
		if (!this.loaded || forceLoad) this.loadData();
		if (this.loaded) for (var i = 0; i < u.length; i++) u[i].show(this)
	},
	//Activate action form in DIV#{XDO.name}_{action}
	action:function(a, p) {
		var formID = "#" + this.name + "_" + a;

		$(formID).jqmShow();
		var f = $("form:visible");
		f[0].action = this.url;
//		f[0].reset();	//Optional, to clear the form or not
		$(".error, .notice, .subForm", f).hide();
	},
	//Erase screen display of the object if any
	destroy:function() {
		if (!(u = $.UIOS[this.name])) return;

		for (var i = 0; i < u.length; i++) u[i].erase();
	}
});

/*
 * Extend XDO_List object
 */
$.extend(XDO_List.prototype, {
	//Add a new object into the Hash
	push:function(xdo) {
		if (xdo instanceof XDO) {
			this.list[xdo.url] = xdo;
			if (!this.one) this.one = xdo;	//1st as default value when getting without a key
		}
	},
	//Try to retrieve a XDO, given its url
	get:function(url) {
		return url ? this.list[url] : this.one;	
	},
	//Try to show a XDO, given its url
	show:function(url, f) {
		if (url && (url.constructor == Boolean)) {
			f = url;
			url = null;
		};
		var r = this.get(url);
		if (r) r.show(f);
	},
	//Destroy a XDO, and remove it from the Hash
	destroy:function(p) {
		var r = this.get(p);
		if (r) {
			r.destroy();
			delete this.list[r.url];
		}
	},
	//Trigger a XDO's action form, given its url
	action:function(a, p) {
		var r = this.get(p);
		if (r) r.action(a, p);
	}
});

/*
 * Extend UIO Object
 */
$.extend(_UIO.prototype, {
	//Show an XDO obj on screen through Chain.js
	show:function(xdo) {
		var x = $(this.ID);			//Selector called each time to ensure existence of target elements
		if (x.size() < 1) return;	//Return if they don't exist

		var t = x.is(".chain-element");
		if (xdo.data) x.items('replace', xdo.data);
		else x.item('replace', xdo).update();
		if (!t) x.chain(this.chain).update(this.update).update();

		$.widgetize.apply(x[0]);
		x.children("a.refresh").click();
	},
	//Erase an XDO obj from screen
	erase:function() {
		var x = $(this.ID);			//Selector need to be called each time to check existence of target elements
		if (x.size() < 1) return;	//Return if they don't exist

		if (x.is(".chain-element")) x.hide().siblings(".default").show();
	}
});