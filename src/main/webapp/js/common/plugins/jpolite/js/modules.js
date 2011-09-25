/*
 * Module ID & link definitions
 * Format:
 * moduleId:{url: "url_of_this_module (relative to index.html)",
 *  		 t:   "title_for_this_module",
 */ 
var _modules={
	m101:{url:"modules/m101.html",	t:"Motivation"},
	m102:{url:"modules/m102.html",	t:"Philisophy"},
	m103:{url:"modules/m103.html",	t:"Buzz"},

	m200:{url:"modules/m200.html",	t:"Layout Width"},
	m201:{url:"modules/m201.html",	t:"Module Definition"},
	m202:{url:"modules/m202.html",	t:"Module Layout Definition"},
	m203:{url:"modules/m203.html",	t:"Column Layout Definition"},

	m301:{url:"modules/m301.html",	t:"About Module Template Customization"},
	m302:{url:"modules/m302.html",	t:"Custom Module Template B"},
	m303:{url:"modules/m303.html",	t:"Custom Module Template C"},

	m400:{url:"modules/m400.html",	t:"Side Menu"},
	m401:{url:"modules/m401.html",	t:"Tabs Control"},
	m402:{url:"modules/m402.html",	t:"Accordion Control"},
	m403:{url:"modules/m403.html",	t:"Local Link"},
	m404:{url:"modules/m404.html",	t:"Tab Link"},
	m405:{url:"modules/m405.html",	t:"How to integrate jQuery UI Plugins"},
	m406:{url:"modules/m406.html",	t:"Example: jqModal"},
	m407:{url:"modules/m407.html",	t:"jQuery UI Controls with Theme Support"},
	
	m500:{url:"modules/m500.html",	t:"Customization Guide"},
	m501:{url:"modules/m501.html",	t:"Customize Navigation Tabs"},
	m502:{url:"modules/m502.html",	t:"Customize Content Layout"},
	m503:{url:"modules/m503.html",	t:"Customize Module"},
	m504:{url:"modules/m504.html",	t:"Customize Tab Background"},
	m505:{url:"modules/m505.html",	t:"Customize Themes"},
	m506:{url:"modules/m506.html",	t:"Customize Features"},
	m507:{url:"modules/m507.html",	t:"Lose Some Weight"},

	m600:{url:"modules/m600.html",	t:"XDO Features"},
	m601:{url:"modules/m601.html",	t:"XML Data Object"},
	m602:{url:"modules/m602.html",	t:"Message Processing"},
	m603:{url:"modules/m603.html",	t:"Event Handling"},
	m604:{url:"modules/m604.html",	t:"XDO Programming Model"},

	m801:{url:"modules/m801.html",	t:"Resources & Credits"},
	m802:{url:"modules/m802.html",	t:"License"}
};

/*
 * Layout definitions for each tab, i.e., which modules go to which columns under which tab
 * Format:
 * 		tab_id: [
 * 			...
 * 			"{module_id}:{column_id, c1, c2, ...}:[optional color class]:[optional template name]",
 * 			...
 * 		]
 */
var _moduleLayout={
	t1:["m101:c1:red", "m102:c2:yellow", "m103:c3:green"],
	
	t2:["m200:c1", "m201:c2", "m202:c3", "m203:c4"],
	t21:["m200:c1", "m201:c2", "m202:c2", "m203:c2"],
	
	t3:["m301:c1", "m302:c2::B", "m303:c3::C"],

	t4:["m400:c1", "m401:c2"],
	t41:["m401:c1", "m402:c2"],
	t42:["m407:c1"],
	
	t5:['m500:c1', 'm501:c2'],
	
	t6:['m600:c1', 'm601:c2'],
	t61:['m604:c1'],
	
	t8:['m801:c1', 'm802:c1']
};

/* 
 * Column layout definitions, i.e., how the columns (containers) are placed under each tab
 * Pure CSS properties can be set upon each column, e.g., width, float, etc. You can refer
 * to jQuery.fn.css() for more details.
 * 
 * The "bg" property is used to set the background of all columns, which actually affects <body>
 * 
 * A _default value set is provided, to save your efforts of setting each tab manually
 */
var _columnLayout = {
	_default: { bg:'normal',
				c1:'span-8',
				c2:'span-8',
				c3:'span-8 last',
				c4:'span-24'
	},
	t2:{ bg:'darker',
		 c1:'span-24 last',
		 c2:'span-8',
		 c3:'span-8',
		 c4:'span-8 last'
	},
	t21:{ bg:'darker',
		 c1:'span-4',
		 c2:'span-20 last'
	},
	t3:{ bg:'dark',
		 c1:'span-24',
		 c2:'span-12',
		 c3:'span-12 last'
	},
	t4:{ bg:'lighter',
		 c1:'span-6',
		 c2:'span-18 last',
		 c3:'hide'
	},
	t41:{ c1:'span-12',
		  c2:'span-12 last'
	},
	t42:{ c1:'span-24 last'
	},
	t5:{ c1:'span-6',
		 c2:'span-18 last',
		 c3:'hide'
	},
	t6:{ c1:'span-6',
		 c2:'span-18 last',
		 c3:'hide'
	},
	t61:{ c1:'span-24 last'
	},
	t7:{ c1:'span-24 last'
	},
	t8:{ c1:'span-24',
		 c2:'span-8',
		 c3:'span-8 last'
	}
};