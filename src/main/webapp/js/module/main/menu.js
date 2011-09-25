var _menus = {
	
	 /**
     * 普通用户
     */
    normal: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }]
    }, {
        "menuid": "15",
        "icon": "icon-sys",
        "menuname": "信息查询",
        "menus": [{
            "menuid": "151",
            "menuname": "查询",
            "icon": "icon-nav",
            "url": ctx + "/search/search.action"
        }]
    
    }],
	
	/**
	 * 小组组长
	 */
	groupLeader: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }, {
            "menuid": "104",
            "menuname": "日志查阅",
            "icon": "icon-nav",
            "url": ctx + "/journal/consult-journal-list.action"
        }]
    }, {
        "menuid": "11",
        "icon": "icon-sys",
        "menuname": "工作周报",
        "menus": [{
            "menuid": "113",
            "menuname": "小组周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/group/group-weekly.action"
        }]
    }, {
        "menuid": "15",
        "icon": "icon-sys",
        "menuname": "信息查询",
        "menus": [{
            "menuid": "151",
            "menuname": "查询",
            "icon": "icon-nav",
            "url": ctx + "/search/search.action"
        }]
    
    }],
	
	/**
	 * 小组信息员
	 */
	groupInfo: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }, {
            "menuid": "104",
            "menuname": "日志查阅",
            "icon": "icon-nav",
            "url": ctx + "/journal/consult-journal-list.action"
        }]
    }, {
        "menuid": "11",
        "icon": "icon-sys",
        "menuname": "工作周报",
        "menus": [{
            "menuid": "113",
            "menuname": "小组周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/group/group-weekly.action"
        }]
    }],
	
	/**
	 * 部门信息员
	 */
	deptInfo: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }, {
            "menuid": "104",
            "menuname": "日志查阅",
            "icon": "icon-nav",
            "url": ctx + "/journal/consult-journal-list.action"
        }]
    }, {
        "menuid": "11",
        "icon": "icon-sys",
        "menuname": "工作周报",
        "menus": [{
            "menuid": "106",
            "menuname": "部门综合周报",
            "icon": "icon-nav",
            "url": "#"
        }, {
            "menuid": "1061",
            "menuname": "部门ARJ21周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/dept/dept-weekly-arj.action"
        }, {
            "menuid": "1062",
            "menuname": "部门大客周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/dept/dept-weekly-c919.action"
        }]
    }, {
        "menuid": "13",
        "icon": "icon-sys",
        "menuname": "工作月报",
        "menus": [{
            "menuid": "131",
            "menuname": "部门ARJ21月报",
            "icon": "icon-nav",
            "url": ctx + "/monthly/dept/dept-monthly-arj.action"
        }, {
            "menuid": "132",
            "menuname": "部门大客月报",
            "icon": "icon-nav",
            "url": ctx + "/monthly/dept/dept-monthly-c919.action"
        }]
    }, {
        "menuid": "14",
        "icon": "icon-sys",
        "menuname": "工作动态",
        "menus": [{
            "menuid": "141",
            "menuname": "编写半月信息",
            "icon": "icon-nav",
            "url": ctx + "/trend/half-moon/half-moon-list2.action"
        }]
    
    }, {
        "menuid": "16",
        "icon": "icon-sys",
        "menuname": "系统设置",
        "menus": [{
            "menuid": "161",
            "menuname": "组织用户",
            "icon": "icon-nav",
            "url": "#"
        }, {
            "menuid": "165",
            "menuname": "ARJ<b>周</b>报部门任务分配",
            "icon": "icon-search",
            "url": ctx + "/template/arj/arj-weekly-template-dept.action"
        }, {
            "menuid": "165",
            "menuname": "大客<b>周</b>报部门任务分配",
            "icon": "icon-search",
            "url": ctx + "/template/c919/c919-weekly-template-dept.action"
        }]
    
    }],
	
	/**
	 * 部门领导
	 */
	deptLeader: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }, {
            "menuid": "104",
            "menuname": "日志查阅",
            "icon": "icon-nav",
            "url": ctx + "/journal/consult-journal-list.action"
        }]
    }, {
        "menuid": "11",
        "icon": "icon-sys",
        "menuname": "工作周报",
        "menus": [{
            "menuid": "106",
            "menuname": "部门综合周报",
            "icon": "icon-nav",
            "url": "#"
        }, {
            "menuid": "1061",
            "menuname": "部门ARJ21周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/dept/dept-weekly-arj.action"
        }, {
            "menuid": "1062",
            "menuname": "部门大客周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/dept/dept-weekly-c919.action"
        }]
    }, {
        "menuid": "13",
        "icon": "icon-sys",
        "menuname": "工作月报",
        "menus": [{
            "menuid": "131",
            "menuname": "部门ARJ21月报",
            "icon": "icon-nav",
            "url": ctx + "/monthly/dept/dept-monthly-arj.action"
        }, {
            "menuid": "132",
            "menuname": "部门大客月报",
            "icon": "icon-nav",
            "url": ctx + "/monthly/dept/dept-monthly-c919.action"
        }]
    }, {
        "menuid": "14",
        "icon": "icon-sys",
        "menuname": "工作动态",
        "menus": [{
            "menuid": "141",
            "menuname": "编写半月信息",
            "icon": "icon-nav",
            "url": ctx + "/trend/half-moon/half-moon-list2.action"
        }]
    
    }],
	
	/**
	 * ARJ信息员
	 */
	arjInfo: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }]
    }, {
        "menuid": "11",
        "icon": "icon-sys",
        "menuname": "工作周报",
        "menus": [{
            "menuid": "107",
            "menuname": "AJR项目周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/arj/arj-weekly.action"
        }]
    }, {
        "menuid": "13",
        "icon": "icon-sys",
        "menuname": "工作月报",
        "menus": [{
            "menuid": "133",
            "menuname": "ARJ21项目月报",
            "icon": "icon-search",
            "url": ctx + "/monthly/arj/arj-monthly.action"
        }]
    }, {
        "menuid": "16",
        "icon": "icon-sys",
        "menuname": "系统设置",
        "menus": [{
            "menuid": "164",
            "menuname": "ARJ<b>周</b>报模板管理",
            "icon": "icon-search",
            "url": ctx + "/template/arj/arj-weekly-template.action"
        }, {
            "menuid": "166",
            "menuname": "ARJ<b>月</b>报模板管理",
            "icon": "icon-search",
            "url": ctx + "/template/arj/arj-month-template.action"
        }]
    
    }],
	
	c919Info: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }]
    }, {
        "menuid": "11",
        "icon": "icon-sys",
        "menuname": "工作周报",
        "menus": [{
            "menuid": "109",
            "menuname": "大客项目周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/c919/c919-weekly.action"
        }]
    }, {
        "menuid": "13",
        "icon": "icon-sys",
        "menuname": "工作月报",
        "menus": [{
            "menuid": "135",
            "menuname": "大客项目月报",
            "icon": "icon-rmb",
            "url": "#"
        }]
    }, {
        "menuid": "16",
        "icon": "icon-sys",
        "menuname": "系统设置",
        "menus": [{
            "menuid": "164",
            "menuname": "大客C919模板管理",
            "icon": "icon-search",
            "url": "#"
        }]
    
    }],
	
	yuanbanInfo: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }]
    }, {
        "menuid": "14",
        "icon": "icon-sys",
        "menuname": "工作动态",
        "menus": [{
            "menuid": "143",
            "menuname": "简报",
            "icon": "icon-search",
            "url": ctx + "/trend/briefing/briefing-edit.action"
        }, {
            "menuid": "145",
            "menuname": "专报",
            "icon": "icon-rmb",
            "url": ctx + "/trend/special-report/special-report-list.action"
        }]
    
    }],
	
	fazhanInfo: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }]
    }, {
        "menuid": "14",
        "icon": "icon-sys",
        "menuname": "工作动态",
        "menus": [{
            "menuid": "146",
            "menuname": "技改建设月报",
            "icon": "icon-rmb",
            "url": ctx + "/trend/rebuilding/rebuilding-list.action"
        }]
    
    }],
	
	/**
	 * 系统管理员
	 */
	systemManager: [{
        "menuid": "10",
        "icon": "icon-sys",
        "menuname": "工作日志",
        "menus": [{
            "menuid": "103",
            "menuname": "编写日志",
            "icon": "icon-nav",
            "url": ctx + "/journal/journal-list.action"
        }, {
            "menuid": "104",
            "menuname": "日志查阅",
            "icon": "icon-nav",
            "url": ctx + "/journal/consult-journal-list.action"
        }]
    }, {
        "menuid": "11",
        "icon": "icon-sys",
        "menuname": "工作周报",
        "menus": [{
            "menuid": "113",
            "menuname": "小组周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/group/group-weekly.action"
        }, {
            "menuid": "106",
            "menuname": "部门综合周报",
            "icon": "icon-nav",
            "url": "#"
        }, {
            "menuid": "1061",
            "menuname": "部门ARJ21周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/dept/dept-weekly-arj.action"
        }, {
            "menuid": "1062",
            "menuname": "部门大客周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/dept/dept-weekly-c919.action"
        }, {
            "menuid": "107",
            "menuname": "AJR项目周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/arj/arj-weekly.action"
        }, {
            "menuid": "109",
            "menuname": "大客项目周报",
            "icon": "icon-nav",
            "url": ctx + "/weekly/c919/c919-weekly.action"
        }, {
            "menuid": "1010",
            "menuname": "汇总完的大客项目周报(from portal)",
            "icon": "icon-nav",
            "url": ctx + "/weekly/c919/c919-collected-weekly-list.action"
        }]
    }, {
        "menuid": "13",
        "icon": "icon-sys",
        "menuname": "工作月报",
        "menus": [{
            "menuid": "131",
            "menuname": "部门ARJ21月报",
            "icon": "icon-nav",
            "url": ctx + "/monthly/dept/dept-monthly-arj.action"
        }, {
            "menuid": "132",
            "menuname": "部门大客月报",
            "icon": "icon-nav",
            "url": ctx + "/monthly/dept/dept-monthly-c919.action"
        }, {
            "menuid": "133",
            "menuname": "ARJ21项目月报",
            "icon": "icon-search",
            "url": ctx + "/monthly/arj/arj-monthly.action"
        }, {
            "menuid": "135",
            "menuname": "大客项目月报",
            "icon": "icon-rmb",
            "url": ctx + "/monthly/c919/c919-monthly.action"
        }]
    
    }, {
        "menuid": "14",
        "icon": "icon-sys",
        "menuname": "工作动态",
        "menus": [{
            "menuid": "141",
            "menuname": "编写半月信息",
            "icon": "icon-nav",
            "url": ctx + "/trend/half-moon/half-moon-list2.action"
        }, {
            "menuid": "143",
            "menuname": "简报",
            "icon": "icon-search",
            "url": ctx + "/trend/briefing/briefing-edit.action"
        }, {
            "menuid": "144",
            "menuname": "简报列表(from portal)",
            "icon": "icon-search",
            "url": ctx + "/trend/briefing/briefing-list.action"
        }, {
            "menuid": "145",
            "menuname": "部门专报",
            "icon": "icon-rmb",
            "url": ctx + "/trend/special-report/special-report-dept-list.action"
        }, {
            "menuid": "146",
            "menuname": "专报",
            "icon": "icon-rmb",
            "url": ctx + "/trend/special-report/special-report-list.action"
        }, {
            "menuid": "148",
            "menuname": "技改建设月报",
            "icon": "icon-rmb",
            "url": ctx + "/trend/rebuilding/rebuilding-list.action"
        }]
    
    }, {
        "menuid": "15",
        "icon": "icon-sys",
        "menuname": "信息查询",
        "menus": [{
            "menuid": "151",
            "menuname": "查询",
            "icon": "icon-nav",
            "url": ctx + "/search/search.action"
        }]
    
    }, {
        "menuid": "16",
        "icon": "icon-sys",
        "menuname": "系统设置",
        "menus": [{
            "menuid": "161",
            "menuname": "组织用户",
            "icon": "icon-nav",
            "url": "#"
        }, {
            "menuid": "164",
            "menuname": "ARJ<b>周</b>报模板管理",
            "icon": "icon-search",
            "url": ctx + "/template/arj/arj-weekly-template.action"
        }, {
            "menuid": "165",
            "menuname": "ARJ<b>周</b>报部门任务分配",
            "icon": "icon-search",
            "url": ctx + "/template/arj/arj-weekly-template-dept.action"
        }, {
            "menuid": "166",
            "menuname": "ARJ<b>月</b>报模板管理",
            "icon": "icon-search",
            "url": ctx + "/template/arj/arj-month-template.action"
        }, {
            "menuid": "164",
            "menuname": "大客<b>周</b>报模板管理",
            "icon": "icon-search",
            "url": ctx + "/template/c919/c919-weekly-template.action"
        }, {
            "menuid": "165",
            "menuname": "大客<b>周</b>报部门任务分配",
            "icon": "icon-search",
            "url": ctx + "/template/c919/c919-weekly-template-dept.action"
        }, {
            "menuid": "166",
            "menuname": "大客<b>月</b>报模板管理",
            "icon": "icon-search",
            "url": ctx + "/template/c919/c919-month-template.action"
        }]
    
    }]

};
