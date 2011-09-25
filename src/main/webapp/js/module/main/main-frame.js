var homePages = {};
var themeswitcherDialog;

$(function() {
	// 布局
	$('body').layout({
		north: {
			size: 47
		}
	});
	$('.ui-layout-resizer').addClass('ui-state-default');
	
	// 初始化中间内容区域
	initMainContent();
	
	// 设置角色名称
	$('#username').text($('#roles option[value=' + role + ']').text());
	
	// 风格切换
	$('#chang-theme').click(function() {
		$('#themeswitcherDialog').dialog({
			modal: true,
			title: '切换系统主题',
			height: 78,
			resizable: false,
			position: 'top',
			open: function() {
				if ($('.jquery-ui-themeswitcher-trigger').length == 0) {
					$('#switcher').themeswitcher({
						width: 200,
						initialText: "切换主题",
						buttonPreText: "当前主题：",
						onSelect: function() {
							var themeName = $.cookie('jquery-ui-theme');
							$.post(ctx + '/common/change-theme.jsp', {
								themeName: themeName
							});
						}
					});
				}
			}
		});
		
	});
	
	// 处理角色以及切换
	dealRoles();
	
	
	// 退出系统
	$('#loginOut').click(function(){
		if (confirm('系统提示，您确定要退出本次登录吗?')) {
			location.href = '../login.action';
		}
    });
});

/**
 * 初始化中间内容区域
 */
function initMainContent() {
	$('#tabs').tabs();
	$('.ui-tabs-panel').height($('#centerPane').height() - 35);
}

/**
 * 处理角色以及切换
 */
function dealRoles() {
	role = role == '' ? 'systemManager' : role;
	$('#roles').val(role).change(function() {
		location.href = ctx + '/main/main.action?role=' + $(this).val();
	});
	
	$('#css3menu a').click(function() {
		if ($(this).attr('rel') == '#') {
			return false;
		}
		$('.active').removeClass('active');
		$(this).addClass('active');
		$(this).parents('li').find('a:eq(0)').addClass('active');
		$('#centerIframe').attr('src', ctx + "/" + $(this).attr('rel') + '?role=' + role);
		$('.tabs-title').text($(this).hasClass('use-title') ? $(this).attr('title') : $(this).text());
		
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
    
	if (homePages[role]) {
		$('.tabs-title').text($('.active:last').text());
		$('#centerIframe').attr('src', ctx + '/' + homePages[role]);
	} else {
		$('#centerIframe').attr('src', ctx + '/main/welcome.action');
	}
}
