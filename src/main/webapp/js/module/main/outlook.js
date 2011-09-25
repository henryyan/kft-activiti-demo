$(function(){
    tabClose();
    tabCloseEven();
    
    /* 导航菜单绑定初始化
    $("#wnav").accordion({
        animate: false
    });
    
    addNav(_menus[user_role_map[userName]]);
    InitLeftMenu();*/
});

/**
 * 清空左边的菜单
 *
 * @return
 */
function Clearnav(){
    var wp = $('#wnav .panel-title');
    $.each(wp, function(i, n){
        if (n) {
            var t = $(n).text();
            $('#wnav').accordion('remove', t);
        }
    });
}

/**
 * 添加左侧的菜单
 *
 * @param data
 * @return
 */
function addNav(data){

    $.each(data, function(i, sm){
        var menulist = "";
        menulist += '<ul>';
        $.each(sm.menus, function(j, o){
            menulist += '<li><div><a ref="' + o.menuid + '" href="#" rel="' +
            o.url +
            '" ><span class="icon ' +
            o.icon +
            '" >&nbsp;</span><span class="nav">' +
            o.menuname +
            '</span></a></div></li> ';
        });
        menulist += '</ul>';
        
        $('#wnav').accordion('add', {
            title: sm.menuname,
            content: menulist,
            iconCls: 'icon ' + sm.icon
        });
        
    });
    
    var pp = $('#wnav').accordion('panels');
    var t = pp[0].panel('options').title;
    $('#wnav').accordion('select', t);
    
}

// 初始化左侧
function InitLeftMenu(){

    hoverMenuItem();
    
    $('#wnav li a').live('click', function(){
        var tabTitle = $(this).children('.nav').text();
        
        var url = $(this).attr("rel");
        var menuid = $(this).attr("ref");
        var icon = getIcon(menuid, icon);
        
        closeaddTab(tabTitle, url, icon);
        $('#wnav li div').removeClass("selected");
        $(this).parent().addClass("selected");
    });
    
}

/**
 * 菜单项鼠标Hover
 */
function hoverMenuItem(){
    $(".easyui-accordion").find('a').hover(function(){
        $(this).parent().addClass("hover");
    }, function(){
        $(this).parent().removeClass("hover");
    });
}

// 获取左侧导航的图标
function getIcon(menuid){
    var icon = 'icon ';
    $.each(_menus, function(i, n){
        $.each(n, function(j, o){
            $.each(o.menus, function(k, m){
                if (m.menuid == menuid) {
                    icon += m.icon;
                    return false;
                }
            });
        });
    });
    return icon;
}

//新的:关闭原来标签在打开新标签
function closeaddTab(subtitle, url, icon){
    //close old panels
    var tabslength = $('#tabs').tabs("tabs").length;
    var tabstitle;
    while (tabslength > 1) {
        tabstitle = $('#tabs').tabs("tabs")[tabslength - 1].panel('options').title;
        $('#tabs').tabs('close', tabstitle);
        tabslength = tabslength - 1;
    }
    
    if (!$('#tabs').tabs('exists', subtitle)) {
        $('#tabs').tabs('add', {
            title: subtitle,
            content: createFrame(url),
            closable: true,
            icon: icon
        });
    }
    else {
        $('#tabs').tabs('select', subtitle);
        $('#mm-tabupdate').click();
    }
    tabClose();
}

//原来的
function addTab(subtitle, url, icon){
    if (!$('#tabs').tabs('exists', subtitle)) {
        $('#tabs').tabs('add', {
            title: subtitle,
            content: createFrame(url),
            closable: true,
            icon: icon
        });
    }
    else {
        $('#tabs').tabs('select', subtitle);
        $('#mm-tabupdate').click();
    }
    tabClose();
}

function createFrame(url){
    var s = '<iframe scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;"></iframe>';
    return s;
}

function tabClose(){
    /* 双击关闭TAB选项卡 */
    $(".tabs-inner").dblclick(function(){
        var subtitle = $(this).children(".tabs-closable").text();
        $('#tabs').tabs('close', subtitle);
    });
    /* 为选项卡绑定右键 */
    $(".tabs-inner").bind('contextmenu', function(e){
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        
        var subtitle = $(this).children(".tabs-closable").text();
        
        $('#mm').data("currtab", subtitle);
        $('#tabs').tabs('select', subtitle);
        return false;
    });
}

// 绑定右键菜单事件
function tabCloseEven(){
    // 刷新
    $('#mm-tabupdate').click(function(){
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        $('#tabs').tabs('update', {
            tab: currTab,
            options: {
                content: createFrame(url)
            }
        });
    });
    // 关闭当前
    $('#mm-tabclose').click(function(){
        var currtab_title = $('#mm').data("currtab");
        $('#tabs').tabs('close', currtab_title);
    });
    // 全部关闭
    $('#mm-tabcloseall').click(function(){
        $('.tabs-inner span').each(function(i, n){
            var t = $(n).text();
            $('#tabs').tabs('close', t);
        });
    });
    // 关闭除当前之外的TAB
    $('#mm-tabcloseother').click(function(){
        $('#mm-tabcloseright').click();
        $('#mm-tabcloseleft').click();
    });
    // 关闭当前右侧的TAB
    $('#mm-tabcloseright').click(function(){
        var nextall = $('.tabs-selected').nextAll();
        if (nextall.length == 0) {
            msgShow('系统提示', '后边没有啦~~', 'error');
            return false;
        }
        nextall.each(function(i, n){
            var t = $('a:eq(0) span', $(n)).text();
            $('#tabs').tabs('close', t);
        });
        return false;
    });
    // 关闭当前左侧的TAB
    $('#mm-tabcloseleft').click(function(){
        var prevall = $('.tabs-selected').prevAll();
        if (prevall.length == 0) {
            alert('到头了，前边没有啦~~');
            return false;
        }
        prevall.each(function(i, n){
            var t = $('a:eq(0) span', $(n)).text();
            $('#tabs').tabs('close', t);
        });
        return false;
    });
    
    // 退出
    $("#mm-exit").click(function(){
        $('#mm').menu('hide');
    });
}

// 弹出信息窗口 title:标题 msgString:提示信息 msgType:信息类型 [error,info,question,warning]
function msgShow(title, msgString, msgType){
    $.messager.alert(title, msgString, msgType);
}

// 本地时钟
function clockon(){
    var now = new Date();
    var year = now.getFullYear(); // getFullYear getYear
    var month = now.getMonth();
    var date = now.getDate();
    var day = now.getDay();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var sec = now.getSeconds();
    var week;
    month = month + 1;
    if (month < 10) 
        month = "0" + month;
    if (date < 10) 
        date = "0" + date;
    if (hour < 10) 
        hour = "0" + hour;
    if (minu < 10) 
        minu = "0" + minu;
    if (sec < 10) 
        sec = "0" + sec;
    var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    week = arr_week[day];
    var time = "";
    time = year + "年" + month + "月" + date + "日" + " " + hour + ":" + minu +
    ":" +
    sec +
    " " +
    week;
    
    $("#bgclock").html(time);
    
    var timer = setTimeout("clockon()", 200);
}
