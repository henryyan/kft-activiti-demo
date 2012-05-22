/**
 * 运行中流程查询
 *
 * @author HenryYan
 */
$(function() {
    // 自动根据窗口大小改变数据列表大小
    $.common.plugin.jqGrid.autoResize({
        dataGrid: '#list',
        callback: listDatas,
        filterToolbar: true
    });
});


/**
 * 加载列表
 *
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid($.extend($.common.plugin.jqGrid.settings({
        size: size
    }), {
        url: 'task-query!runningList.action',
        colNames: ['key'],
        colModel: [{
            name: 'key'
        }],
        caption: "运行中流程查询"
    })).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
        add: false,
        edit: false,
        del: false
    }), {}, {}, {}, $.extend($.common.plugin.jqGrid.form.search), {}).jqGrid('filterToolbar', $.extend($.common.plugin.jqGrid.filterToolbar.settings));
    
}
