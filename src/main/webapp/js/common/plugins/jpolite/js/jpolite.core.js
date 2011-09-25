/**
 * JPolite V2
 * http://www.trilancer.com/jpolite214
 *
 * Copyright (c) 2009 Wayne Lee
 * Dual licensed under the MIT and GPL licenses.
 *
 * Date: January 28, 2010
 * Version: 2.14 - for jQuery 1.4.1
 */
(function($){
	
/**
 * Extensions to jQuery to apply widgetization actions on newly DOM nodes,
 * module_content, helper, dynamic content ...
 */
$.extend({
	/**
	 * Handy alert alternative based on Gritter (http://boedesign.com/blog/2009/07/11/growl-for-jquery-gritter/)
	 */
	alert: function(msg) {
		this.gritter.add(msg);
	},

	//Registry of controls that may appear in modules
	_widgetControls:{},
	/**
	 * Register Controls into the Control registry
	 * @param {Object} ctrls - hash key:value pairs wherein
	 * 		key:   jQuery selector, e.g., ".class"
	 * 		value: jQuery plugin function Array
	 * 				[$.fn.plugin_func] or
	 * 				[$.fn.plugin_func, settings_obj]
	 */
	regControls: function(ctrls) {	//{selector:handler}
		this.extend(this._widgetControls, ctrls);
	},
	/**
	 * Search and initialize controls on a given DOM node
	 */
	widgetize: function() {
		//Make external links open in new window
		$("a[href^=http]", this).attr("target", "_blank");
		for (var c in $._widgetControls) {		//c is the key, a.k.a., selector
			var f = $._widgetControls[c][0],	//Function
				p = $._widgetControls[c][1];	//Settings

			if ($.isArray(p)) f.apply($(c, this), p);
			else f.call($(c, this), p);
		}
	},

	//A message registry and handling system to handle server side messages
	//Can be used for local messaging as well
	_MsgRegistry: {
		//find out what the target: header, tab#id, helper, container#id, module#id
		jpolite: [],
		//update content of a module
		module: [],
		//find out which XDO to handle, name#url
		resource: [],
		//show some alerts to user (after success)
		msg: [
			function(msg) {
				$.alert({title:'System Notification', text:msg});
				return true;
			}
		]
	},
	/**
	 * Register Controls into the Control registry
	 * @param {Object} handlers - hash key:value pairs wherein
	 * 		key:   message name, e.g., "greeting"
	 * 		value: message processing function
	 */
	regMsgHandlers: function(handlers) {
		var mr = this._MsgRegistry;
		for (var x in handlers) {
			if (!mr[x]) mr[x]=[];
			mr[x].push(handlers[x])
		}
	},
	/**
	 * Process a given message
	 * @param {Object} m - message hash key:value pairs wherein
	 * 		key:   message name, e.g., "greeting"
	 * 		value: content of the message, e.g., "hello"
	 */
	handleMessage: function(m) {
		var rv = true;
		for (var k in m) {
			var x = this._MsgRegistry[k];
			if (x) for (var i in x) x[i](m[k])
		};
		return rv;
	},

	//A global custom event processing mechanism
	_DOC: $(document),
	/**
	 * Register custom events onto document
	 * @param {Object} evt - event hash key:value pairs wherein
	 * 		key:   event name, e.g., "moduleLoadedEvent"
	 * 		value: event processing function
	 */
	regEvent: function(evt){
		for (var e in evt) this._DOC.bind(e, evt[e]);
	},
	/**
	 * Trigger a given event
	 * @param {string} e - name of the custom event
	 * @param {object} data - event associated data
	 */
	triggerEvent: function(e, data){
		this._DOC.trigger(e, data);
	}
});


/**
 * Utility functions added to jQuery.fn
 */
$.fn.extend({
	// Shortcut function to for tab / menu item switching
	on: function() {
		if (this.is(".on")) return false;
		this.siblings(".on").andSelf().toggleClass("on");
		return true;
	}
});


/**
 * JPolite Core Features and Functions
 */
$.jpolite = {
	/**
	 * Main Navigator Object & Methods
	 */
	Nav: {
		its: null,			//A jQuery collection of tab items, set in init() 
		tabs: {},			//Hash for tabs, tabs[tab_x_id] => tab_x DOM node
		ct:	null,			//Current tab id
		cc: $("#content"),	//Content container
		t1: $.fn.fadeOut,	//Content transition out function
		t2: $.fn.fadeIn,	//Content transition in function
		showModules: function() {	//Utility function to show all modules under a certain main nav item
			for (var i in this.modules) {
				var m = this.modules[i];
				$(m).show();
				m.loadContent();
			};
		},

		/**
		 * Initialization method
		 * @param {String} cts - main nav selector object, "#main_nav" by default
		 * @param {String} its - main nav item selector,   "li" by default
		 * @param {Function} func - optional init method to be applied upon main nav
		 * @param {Object} p - optional parameter for the init method
		 */
		init: function(cts, its, func, p){
			var t = this.tabs;
			func.call($(cts), p);		//Pre-process main nav
			this.its = $(its, cts).each(function(){
				this.modules = {};		//Modules fall logically under this main nav item
				this.showModules = $.jpolite.Nav.showModules;

				t[this.id] = this;		//"this" is a main nav item DOM node 
				$(this).click(function(e){
					//If click on an active item without submenu, then return
					if (!$(this).on() && !$(".on",this).length) return false;

					//If click on a leaf menu item => switch it on, and off others
					if (e.originalEvent || $(".on",this).length == 0) {
						$.jpolite.Nav.switchTab(this.id);
						$(".on", $.jpolite.Nav.its).not(this).not($(this).parents()).removeClass("on");
					}
					$(this.parentNode).click();
					return false;
				});
			});
		},
		/**
		 * Switch to designated main nav item 
		 * @param {String} id - main nav item's ID
		 */
		switchTab: function(id){
			var cc = this.cc,
				x = this.tabs[id],
				t2 = this.t2,
				mv = $(".module:visible"),
				//Call back function to be executed after tab switching
				f = function(){
					mv.hide();
					$.jpolite.Content.switchTab(x.id);
					x.showModules();
					t2.call(cc, 500)
				};
			this.ct = id;
			this.t1.apply(cc, [500, f])
		},
		/**
		 * Retrieve the DOM node
		 * @param {String} id - main nav item ID
		 * 		"tab_id" ==> return tab#tab_id DOM node
		 * 		null	 ==> return current active tab node
		 */
		getTab: function(id) {
			return this.tabs[id || this.ct];
		},
		/**
		 * Link modules statically defined in index.html to designated tab item
		 * @param {DOM node} m - static module DOM node
		 * @param {String} tid - main nav item ID
		 */
		addStaticModule: function(m, tid){
			m.tab = this.tabs[tid];		//Link tab to module
			m.tab.modules[m.id] = m;	//Add module to tab
		},
		/**
		 * Unlink modules from tab item
		 * @param {DOM node} m - static module DOM node
		 */
		removeModule: function(m){
			delete m.tab.modules[m.id];
		}
	},

	/**
	 * Content Area (module container) - Object and Methods
	 */
	Content: {
		_loadLayout: function(){},	//Customizable Method to load layout
		_saveLayout: function(){},	//Customizable Method to save layout
		cc: $(".cc"),				//Containers jQuery object
		MTS: {}, 					//Module Templates
		//Actions to be assigned upon each module
		moduleActions: {
			loadContent: function(url, forced) {
				var x = this;
				if (typeof url === "boolean") {
					forced = url;
					url = x.url;
				} else url = url || x.url;

				if (!url || (x.loaded && !forced)) return;
				$(".moduleContent", this).load(url, function(){
					$.widgetize.apply(this);
					$.triggerEvent("moduleLoadedEvent", x);
					x.loaded = true;
				});
			},
			max: function(){
				$(".moduleContent,.actionMin", this).show();
				$(".actionMax",this).hide();
			},
			min: function(){
				$(".moduleContent,.actionMin", this).hide();
				$(".actionMax",this).show();
			},
			close: function(){
				$(this).remove();
				$.jpolite.Nav.removeModule(this);
				$.jpolite.Content.saveLayout();
			}
		},

		/**
		 * Initialization method
		 * @param {Boolean} moduleSortable - if true, enable module drag & drop
		 */
		init: function(moduleSortable) {
			var x = this.cc;
			if (moduleSortable) x.sortable({
				start: function(){
					$.jpolite.Content.cc.addClass("dragging")
				},
				stop:  function(e, u){
					$.jpolite.Content.cc.removeClass("dragging");
					var m = u.item[0]; 
					if (m.c) m.c = m.parentNode.id;	//Change module container ID
					$.jpolite.Content.saveLayout();
				},
				connectWith: '.cc',
				handle: '.moduleHeader',
				opacity: .5,
				placeholder: 'ui-sortable-placeholder',
				tolerance: 'pointer',
				revert: true
			});
			x = x.toArray(); 
			for (var i in x) this[x[i].id] = $(x[i]);	//Now Content has properties c1, c2, c3 ... each is an jQuery object

			//Detach module templates from index.html and put into MTS
			x = $(".module_template").toArray();
			for (i in x){
				var id = x[i].id || 0;	//MTS[0] => default template
				this.MTS[id] = $(x[i]).attr("class","module").remove();
			};
			this.loadStatic();
			this.loadLayout();
		},
		/**
		 * Content area change (column class) according to tab_id
		 * @param {String} tab_id - new ID of tab
		 */
		switchTab: function (tab_id) {
			var x = $.extend({}, _columnLayout._default, _columnLayout[tab_id]),
				bc = $('body').attr('class') || 'normal';

			if (bc != x.bg) $('body').switchClass(bc, x.bg);
			delete x.bg;
			for (var c in x) this[c].attr('class', 'cc ' + x[c]);
		},
		/**
		 * Add a new module to a given tab
		 * @param {Object} m - module definition, properties include
		 * 			id: unique ID of the module defined in modules.js, e.g., m101
		 *			c:	container ID, e.g., c1, c2 ...
		 *			mc: (optional) module color class, e.g., 'red'
		 *			mt:	(optional) module template name as defined in index.html
		 * @param {DOM node} t - target tab
		 */
		addModule: function(m, t) {
			var c = this[m.c];
			if (!c) return;		//return if invalid column ID given
			
			//Check for duplicate module, and refuse
			if (t.modules[m.id]) {
				$(t.modules[m.id]).fadeTo(200,0.5).fadeTo(200,1)
				return;
			};

			//Load module definition
			var y = _modules[m.id];
			var x = this.MTS[m.mt || 0].clone()[0];
			$.extend(x, {mc:'', mt:''}, this.moduleActions, m, {
				loaded: false,
				url: y.url,
				tab: t
			});

			t.modules[m.id] = x;

			$(".moduleTitle", x).text(y.t);
			if (m.mc) $(x).addClass(m.mc);
			c.append(x);
			if (t.id == $.jpolite.Nav.ct) {
				$(x).show();
				x.loadContent();
			}
		}, 
		/**
		 * Make DIV.module sections preloaded in index.html active modules
		 */
		loadStatic: function(){
			var ma = this.moduleActions;
			$(".module").each(function(){
				var p = this.id.split(":");	//e.g., m101:t1
				$.extend(this, {
					id: p[0],
					tab: p[1],
					//url: _modules[p[0]],
					loaded: true
				}, ma);
				$.widgetize.apply(this);
				$.jpolite.Nav.addStaticModule(this, p[1])
			});
		},
		/**
		 * Load layout defined in modules.js
		 */
		loadLayout: function() {
			//Load layout via custom method or _moduleLayout variable defined in modules.js
			var l = this._loadLayout() || _moduleLayout;

			for (var t in l) {
				var tab = $.jpolite.Nav.getTab(t);
				if (tab) for (var i in l[t]) {
					var s = l[t][i].split(":");
					this.addModule({
						id: s[0],
						c:	s[1],
						mc: s[2] || '',
						mt:	s[3] || ''
					}, tab) 	
				}
			}
		},
		/**
		 * Retrieve current layout and save via customizable method
		 */
		saveLayout: function() {
			var r = "{" + $.jpolite.Nav.its.map(function(){
				var t = [], m = this.modules;
				for (var i in m)
					if (m[i].c)		//Skip static modules
						t.push("'".concat(m[i].id, ":", m[i].c, ":", m[i].mc, ":", m[i].mt, "'"));
				
				return "'" + this.id + "':[" + t.toString() + "]";
			}).get().join(",") + "}";
			if (this._saveLayout) this._saveLayout(r);
		}
	},

	/**
	 * JPolite initialization method
	 * @param {Object} options - initialization parameters, with default values
	 * 		cts: "#main_nav",				//Navigation Tab container id
	 * 		its: "li",						//Navigation Tab selector
	 * 		t1: $.fn.fadeOut,				//Content transition Out callback
	 * 		t2: $.fn.fadeIn,				//Content transition In callback
	 * 		navInit: TraditionalTabs,		//Navigation Tab Initialization callback
	 * 		navInitArguments: {},			//Navigation Tab Initialization parameters
	 * 		moduleSortable: true			//Whether to allow module drag-n-drop
	 * 		layoutPersistence: []			//Methods to load/save layout of modules
	 */
	init: function(options){
		var s = $.extend({
	 		cts: "#main_nav",
	 		its: "li",
	 		t1: $.fn.fadeOut,
	 		t2: $.fn.fadeIn,
	 		navInit: TraditionalTabs,
	 		navInitArguments: {},
	 		moduleSortable: true
		}, options);

		this.Nav.init(s.cts, s.its, s.navInit, s.navInitArguments);
		this.Nav.t1 = s.t1;
		this.Nav.t2 = s.t2;
		if (s.layoutPersistence) {
			this.Content._loadLayout = s.layoutPersistence[0];
			this.Content._saveLayout = s.layoutPersistence[1];
		}
		this.Content.init(s.moduleSortable);

		delete this.Nav.init;
		delete this.Nav.addStaticModule;
		delete this.Content.init;
		delete this.Content.loadStatic;
		delete $.jpolite.init;
	},
	gotoTab: function(id) {
		$(this.Nav.getTab(id)).click();
	},
	addModule: function(m) {
		this.Content.addModule(m, this.Nav.getTab());
	},
	replaceModule: function(col, ids) {
		var x = $(".module:visible", this.Content[col]).get();
		var t = this.Nav.getTab();
		for (var i in x) x[i].close();
		for (i in ids) this.Content.addModule({id: ids[i], c: col}, t);
		this.Content.saveLayout();
	}
}

})(jQuery);
