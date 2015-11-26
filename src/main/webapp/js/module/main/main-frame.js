var homePages = {};
var themeswitcherDialog;

// tabs
var $tabs = null;
var tabCounter = 1;
var lastMenuUrl = '';
var openedTabs = new Map();

$(function() {
	// 布局
	$('body').layout({
		north: {
			size: 47
		}
	});
	$('.ui-layout-resizer').addClass('ui-state-default');
	
	// 设置菜单样式
	$('#css3menu > li:last').addClass('toplast');
	
	// 初始化中间内容区域
	initMainContent();
	
	// 处理角色以及切换
	dealRoles();
	
	// 退出系统
	$('#loginOut').click(function(){
		if (confirm('系统提示，您确定要退出本次登录吗?')) {
			location.href = ctx + '/user/logout';
		}
    });
});

/**
 * 初始化中间内容区域
 */
function initMainContent() {
	var tabPanelHeight = $('#centerPane').height() - 35;
	$tabs = $('#tabs').tabs({
		tabTemplate: "<li><a class='tabs-title' href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close' title='关闭标签页'></span></li>",
		add: function( event, ui ) {
			$('#tabs-menu-' + tabCounter).css({height: tabPanelHeight + 'px', width: '100%'});
			$( ui.panel ).append( "<iframe id='iframe" + tabCounter + "' name='iframe" + tabCounter + "' scrolling='auto' frameborder='0' class='module-iframe' style='width:100%;height:100%;'></iframe>" );
			$('#tabs').tabs('select', $('.tabs-title').length - 1);
			$('#iframe' + tabCounter).attr('src', lastMenuUrl);
			tabCounter++;
		}
	}).find( ".ui-tabs-nav" ).sortable({ axis: "x" });
	$('#tab-index').height(tabPanelHeight);
	
	// close icon: removing the tab on click
	// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
	$( "#tabs span.ui-icon-close" ).live( "click", function() {
		var index = $( " #tabs li" ).index( $( this ).parent() );
		$('#tabs').tabs( "remove", index );
		openedTabs.remove($(this).parent().find('a').text());
	});
}

/**
 * 处理角色以及切换
 */
function dealRoles() {
	openedTabs.put("首页", 0);
	
	$('#css3menu a').click(function() {
		if ($(this).attr('rel') == '#') {
			return false;
		} else if (!$(this).attr('rel')) {
			return true;
		}
		$('.active').removeClass('active');
		$(this).addClass('active');
		$(this).parents('li').find('a:eq(0)').addClass('active');
		
		// 多个标签页
		var moduleName = $(this).hasClass('use-title') ? $(this).attr('title') : $(this).text();
		if (openedTabs.get(moduleName) == null) {
			lastMenuUrl = ctx + "/" + $(this).attr('rel');
			openedTabs.put($(this).text(), tabCounter);
			$('#tabs').tabs( "add", "#tabs-menu-" + tabCounter, moduleName );
		} else {
			$('#tabs').tabs('select', openedTabs.get(moduleName));
            lastMenuUrl = ctx + "/" + $(this).attr('rel');
            $('#iframe' + openedTabs.get(moduleName)).attr('src', lastMenuUrl);
		}
		
		var menuNames = "";
		var alink = $(this).parent().parent().parent().find('a:first');
		while (true) {
			if (alink.text() != '') {
				var hasSameLink = false;
				$('#css3menu a').each(function() {
					if ($(this).text() == $(alink).text()) {
						hasSameLink = true;
						return true;
					}
				});
				if (!hasSameLink) {
					break;
				}
				if (menuNames != '') {
					menuNames = "->" + menuNames;
				}
				menuNames = $(alink).text() + menuNames;
				alink = $(alink).parent().parent().parent().find('a:first');
			} else {
				break;
			}
		}
		var p = $('.ui-tabs-nav').position();
		$('#menu-road').css({left: 100, top: 80});
	});
    
}

/**
 * 使用菜单中的rel添加一个标签页
 * @param {Object} menuLink
 */
function addTab(menuLink) {
	// 多个标签页
	var $menuItem = $('#css3menu a[rel="' + menuLink + '"]');
	var moduleName = $menuItem.hasClass('use-title') ? $($menuItem).attr('title') : $($menuItem).text();
	if (openedTabs.get(moduleName) == null) {
		lastMenuUrl = ctx + "/" + $($menuItem).attr('rel');
		openedTabs.put($($menuItem).text(), tabCounter);
		$('#tabs').tabs( "add", "#tabs-menu-" + tabCounter, moduleName );
	} else {
		$('#tabs').tabs('select', openedTabs.get(moduleName));
	}
}