/**
 * 公共函数库，主要是一些JS工具函数，各种插件的公共设置
 * @author HenryYan
 */
(function($) {

    $.common = {};
    
    //-- 初始化方法 --//
    _initFunction();
    
    //-- 窗口工具 --//
    $.common.window = {
        //-- 获得最上层的window对象 --//
        getTopWin: function() {
            if (parent) {
                var tempParent = parent;
                while (true) {
                    if (tempParent.parent) {
                        if (tempParent.parent == tempParent) {
                            break;
                        }
                        tempParent = tempParent.parent;
                    } else {
                        break;
                    }
                }
                return tempParent;
            } else {
                return window;
            }
        },
        // 获取可见区域的宽度
        getClientWidth: function() {
            return document.documentElement.clientWidth - 10;
        },
        // 获取可见区域的高度
        getClientHeight: function(options) {
            var defaults = {
                autoSuit: true, // 自动适应高度，因为在firefox下面不减10会出现滚动条
                autoSuitValue: -13
            };
            options = $.extend({}, defaults, options);
            if (options.autoSuit) {
                return document.documentElement.clientHeight + options.autoSuitValue;
            } else {
                return document.documentElement.clientHeight;
            }
        }
    };
    
    /*******************************************/
    /**				jqGrid插件--开始			  **/
    /*******************************************/
    var _plugin_jqGrid = {
        prmNames: {
            page: 'page.pageNo',
            rows: 'page.pageSize',
            sort: 'page.orderBy',
            order: 'page.order',
            search: 'page.search',
            id: 'jqid'
        },
        jsonReader: {
            root: 'page.result',
            page: 'page.pageNo',
            total: 'page.totalPages',
            records: 'page.totalCount',
            repeatitems: false
        },
        pager: {
            add: true,
            edit: true,
            view: true,
            del: true,
            addtext: '新增',
            edittext: '编辑',
            viewtext: '查看',
            deltext: '删除',
            searchtext: '查询',
            refreshtext: '刷新'
        },
        navGrid: {
            /**
             * 显示对话框字段，如果不指定fields参数显示所有隐藏的字段
             * @param {Object} formid	jqGrid表单ID
             * @param {Object} includes	要显示的字段名称，规则tr_字段
             * @param {Object} excludes	要显示的字段名称，规则tr_字段
             */
            showAllField: function(formid, includes, excludes) {
                if (includes && includes.length > 0) {
                    $.each(includes, function(i, n) {
                        // 编辑时
                        // 查看时
                        $('tr[id=trv_' + n + ']', formid).show();
                    });
                    return;
                }
                if (excludes && excludes.length > 0) {
                    // 编辑时
                    var $trs = $('tr[id^=tr_].FormData', formid);
                    $.each($trs, function() {
                        var fieldName = $(this).attr('id').substring(3);
                        if ($.inArray(fieldName, excludes) == -1) {
                            $(this).show();
                        }
                    });
                    
                    // 查看时
                    $trs = $('tr[id^=trv].FormData', formid);
                    $.each($trs, function() {
                        var fieldName = $(this).attr('id').substring(4);
                        if ($.inArray(fieldName, excludes) == -1) {
                            $(this).show();
                        }
                    });
                    return;
                }
                $('tr[id^=tr].FormData', formid).show();
            }
        },
        //-- jqGrid工具栏按钮 --//
        navButtonAdd: {
            //-- 显示/隐藏字段 --//
            setColumns: {
                caption: "字段",
                title: "设置列表显示的字段",
                buttonicon: "ui-icon-wrench",
                onClickButton: function() {
                    $(this).jqGrid('columnChooser');
                }
            }
        },
        //-- 搜索比较符号 --/
        search: {
            text: ['eq', 'ne', 'cn'],
            select: ['eq', 'ne'],
            integer: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
            'float': ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
            date: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
            // 初始化My97日期组件
            initDate: function(settings) {
                $(settings.elem).addClass('Wdate');
                $(settings.elem).click(function() {
                    WdatePicker();
                });
            }
        },
        //-- 格式化 值--//
        formatter: {
            // 日期类型，例如：2010-08-19
            date: function(cellvalue, options, cellobject) {
                if (cellvalue == null || cellvalue == 'null') 
                    return "";
                else {
                    if (cellvalue.length >= 10) {
                        return cellvalue.substring(0, 10);
                    } else {
                        return cellvalue;
                    }
                }
            },
            // 日期和时间类型，例如：2010-08-19 12:12:13
            datetime: function(cellvalue, options, cellobject) {
                if (cellvalue == null || cellvalue == 'null') {
                    return "";
                } else {
                    var preCellValue = cellvalue.substring(0, 10);
                    var postCellvalue = cellvalue.substring(11, cellvalue.length);
                    return preCellValue + " " + postCellvalue;
                }
            },
            trueOrfalse: function(cellvalue, options, cellobject) {
                if (cellvalue == null ||
                cellvalue == 'null' ||
                cellvalue == 0) 
                    return "否";
                return "是";
            },
            // 使用图片显示是否值，是显示图片，否不显示任何值
            trueOrFalseImg: function(cellvalue, options, cellobject) {
                if (cellvalue == null ||
                cellvalue == 'null' ||
                cellvalue == 0) 
                    return "";
                var okImgPath = $.common.custom.getCtx() + "/images/tip/ok.gif";
                return "<img src='" + okImgPath + "'/>";
            },
            float2precent: function(cellvalue, options, cellobject) {
                if (cellvalue == null || cellvalue == 'null') 
                    return "";
                return cellvalue * 100 + '%';
            }
        },
        form: {
            // 表单必填标志
            must: function() {
                return "<span class='must'>*</span>";
            },
            mustTip: "带 <span class='must'>*</span> 为必填(选)项。",
            // 设置表单的LABEL宽度，防止自动列宽在验证组件添加文字提示的时候表格会动的问题
            setLabelWidth: function(options) {
                var opts = $.extend(options, {
                    selector: '.CaptionTD',
                    width: 0
                });
                $(opts.selector).width(opts.width);
            },
            // 添加设置
            add: {
                closeAfterAdd: true,
                recreateForm: true,
                closeOnEscape: true,
                savekey: [true, 13],
                navkeys: [true, 38, 40],
                bottominfo: "带 <span class='must'>*</span> 为必填(选)项。",
                onInitializeForm: function(formObj) {
                
                    // 如果对话框的高度超过了列表的高度则出现滚动条，延迟20毫秒执行
                    setTimeout(function() {
                        var formDialogHeight = $(formObj).parents('.ui-jqdialog').height();
                        var listId = $(formObj).attr('id').replace('FrmGrid_', '');
                        var gridHeight = $('#gview_' + listId).height();
                        if (formDialogHeight > gridHeight) {
                            $(formObj).height($.common.window.getClientHeight() - $(formObj).next('.EditTable').height() - 38);
                        }
                    }, 20);
                }
            },
            // 编辑设置
            edit: {
                closeAfterEdit: true,
                recreateForm: true,
                closeOnEscape: true,
                savekey: [true, 13],
                navkeys: [true, 38, 40],
                bottominfo: "带 <span class='must'>*</span> 为必填(选)项。",
                onInitializeForm: function(formObj) {
                
                    // 如果对话框的高度超过了列表的高度则出现滚动条，延迟20毫秒执行
                    setTimeout(function() {
                        var formDialogHeight = $(formObj).parents('.ui-jqdialog').height();
                        var listId = $(formObj).attr('id').replace('FrmGrid_', '');
                        var gridHeight = $('#gview_' + listId).height();
                        if (formDialogHeight > gridHeight) {
                            $(formObj).height($.common.window.getClientHeight() - $(formObj).next('.EditTable').height() - 38);
                        }
                    }, 20);
                }
            },
            // 删除设置
            del: { // empty
}            ,
            // 搜索设置
            search: {
                multipleSearch: true,
                caption: '查询',
                afterShowSearch: function() {
                    /*
                     * 添加回车键搜索功能
                     */
                    $('.ui-searchFilter .data *').keydown(function(e) {
                        if (e.which == 13 || e.which == 10) {
                            $('.ui-searchFilter tfoot .ui-search').trigger('click');
                        }
                    });
                    
                    /*
                     * hack: 搜索类型有select时点击重置按钮后无效
                     */
                    $('.ui-reset').bind('click', function() {
                        $('.data').find('.vdata').removeClass('vdata');
                        $('.data').find('select').hide();
                        $('.data').find('.default').addClass('vdata').show();
                        
                        // 比较符号重置为默认(第一个)
                        $('.ops').find('select').hide();
                        $('.ops').find('.field0').show();
                    });
                }
            },
            // 查看设置
            view: {
                beforeShowForm: function(formid) {
                    $.common.plugin.jqGrid.navGrid.showAllField(formid);
                    setTimeout(function() {
                        // 隐藏编辑按钮
                        $('#trv_options').hide();
                    }, 10);
                }
            }
        },
        /**
         * 改变窗口大小的时候自动根据iframe大小设置jqGrid列表宽度和高度
         * 参数说明：{
         * 		enableAutoResize : 是否开启自动高度和宽度调整开关
         * 		dataGrid : jqGrid数据列表的ID
         * 		callback : 计算完dataGrid需要的高度和宽度后的回调函数
         * 		width : 默认为iframe的宽度，如果指定则设置为指定的宽度
         * 		height : 默认为iframe的高度，如果指定则设置为指定的高度
         * 		beforeAutoResize : 窗口大小调整时自动设置之前
         * 		afterAutoResize : 窗口大小调整时自动设置之后
         * }
         */
        autoResize: function(options) {
            var defaults = {
                gridContainer: 'body',
                filterToolbar: false,
                groupHeaders: false,
                enableAutoResize: true,
                beforeAutoResize: null,
                afterAutoResize: null
            };
            options = $.extend({}, defaults, options);
            
            // 第一次调用
            var size = getWidthAndHeigh();
            if ($.isFunction(options.callback)) {
                options.callback(size);
                setToolbarHeight();
            }
            
            // 窗口大小改变的时候
            if (options.enableAutoResize === true) {
                if ($.isFunction(options.beforeAutoResize)) {
                    options.beforeAutoResize();
                }
                window.onresize = function() {
                    var size = getWidthAndHeigh(true);
                    $(options.dataGrid).jqGrid('setGridHeight', size.height).jqGrid('setGridWidth', size.width);
                    setToolbarHeight();
                    if ($.isFunction(options.afterAutoResize)) {
                        options.afterAutoResize(size);
                    }
                };
            }
            
            // 根据浏览器不同设置工具栏的高度
            function setToolbarHeight() {
                // 根据浏览器不同设置工具栏的高度
                if ($.common.browser.isIE() && options.toolbarHeight) {
                    if (options.toolbarHeight.top && options.toolbarHeight.top.ie) {
                        $('#t_' + options.dataGrid.substr(1)).height(options.toolbarHeight.top.ie);
                    }
                    if (options.toolbarHeight.bottom && options.toolbarHeight.bottom.ie) {
                        $('#tb_' + options.dataGrid.substr(1)).height(options.toolbarHeight.bottom.ie);
                    }
                }
            }
            
            // 获取iframe大小
            function getWidthAndHeigh(resize) {
                var hasToolbar = !options.toolbar ? false : options.toolbar[0];
                if (hasToolbar) {
                    var toolbarType = options.toolbar[1];
                    if (!toolbarType) {
                        alert('请设置工具栏的属性，toolbar ： [true, [top, both, bottom]]');
                    }
                }
                
                // 根据列表的容器设置宽度和高度
                var clientHeight = options.gridContainer == 'body' ? document.documentElement.clientHeight : $(options.gridContainer).get(0).clientHeight;
                var clientWidth = options.gridContainer == 'body' ? document.documentElement.clientWidth : $(options.gridContainer).get(0).clientWidth;
                
                var iframeHeight = !options.height ? clientHeight : options.height;
                var iframeWidth = !options.width ? clientWidth : options.width;
                
                // chrome
                if ($.common.browser.isChrome()) {
                    if (hasToolbar) {
                        if (toolbarType == 'top' || toolbarType == 'bottom') {
                            iframeWidth -= 8;
                            iframeHeight -= 128;
                        } else if (toolbarType == 'both') {
                            iframeWidth -= 14;
                            iframeHeight -= 140;
                        }
                    } else {
                        iframeWidth -= 5;
                        iframeHeight -= 82;
                    }
                } // firefox
 else if ($.common.browser.isMozila() || $.common.browser.isOpera()) {
                    if (hasToolbar) {
                        if (toolbarType == 'top' || toolbarType == 'bottom') {
                            iframeWidth -= 10;
                            iframeHeight -= 122;
                        } else if (toolbarType == 'both') {
                            iframeWidth -= 12;
                            iframeHeight -= 145;
                        }
                    } else {
                        iframeWidth -= 4;
                        iframeHeight -= 85;
                    }
                } // IE
 else {
                    if (hasToolbar) {
                        if (toolbarType == 'top' || toolbarType == 'bottom') {
                            if ($.common.browser.isIE() && options.toolbarHeight) {
                                if (options.toolbarHeight.top && options.toolbarHeight.top.ie) {
                                    // 减去jqGrid的t_list默认高度和IE的兼容高度
                                    iframeHeight -= (options.toolbarHeight.top.ie - 21) - 15;
                                }
                            }
                            iframeHeight -= 133;
                            iframeWidth -= 6;
                            setTimeout(function() {
                                // 设置上方的toolbar
                                $('#t_' + options.dataGrid.substr(1)).width(iframeWidth - 11);
                            });
                        } else if (toolbarType == 'both') {
                            iframeWidth -= 6;
                            iframeHeight -= 156;
                            setTimeout(function() {
                                // 设置上方的toolbar
                                $('#t_' + options.dataGrid.substr(1)).width(iframeWidth - 11);
                            });
                        }
                    } else {
                        iframeWidth -= 6;
                        iframeHeight -= 93;
                    }
                }
                
                // 是否有搜索工具条
                if (options.filterToolbar) {
                    iframeHeight -= 23;
                }
                
                // 是否开启标头分组
                if (options.groupHeaders) {
                    iframeHeight -= 22;
                }
                return {
                    width: iframeWidth,
                    height: iframeHeight
                };
            }
            
        },
        // jqGrid快捷键支持
        keys: {
            savekey: [true, 13],
            navkeys: [true, 38, 40]
        },
        // checkbox工具
        checkbox: {
            /**
             * 获取选中的checkbox
             * @param {Object} listId
             */
            getChecked: function(listId) {
                return $('#' + listId + ' :checkbox[name!=cb_' + listId + ']:checked');
            },
            
            /**
             * 获取选中的记录ID，以逗号分隔
             * @param {Object} listObj	列表对象
             * @param {Object} dealFn	过滤函数，如果加入选中的ID那么return true，否则return false
             */
            convertToString: function(listObj, dealFn) {
                var chks = $(listObj + ' :checkbox[name^=jqg_list]:checked');
                var ids = "";
                $.each(chks, function(i, n) {
                    var tempId = $(this).attr('name').replace('jqg_list_', '');
                    // 调用过滤函数
                    if ($.isFunction(dealFn)) {
                        var useId = dealFn(tempId);
                        if (useId) {
                            ids += tempId + ",";
                        }
                    } else {
                        ids += tempId + ",";
                    }
                    
                });
                if (ids.indexOf(',') != -1) {
                    ids = ids.substring(0, ids.length - 1);
                }
                return ids;
            }
            
        },
        /**
         * jqgrid列表的gridComplete方法
         * @param {Object} listId	列表ID
         * @param {Object} callback	回调函数
         */
        gridComplete: function(listId, callback) {
            if (listId.substring(0, 1) == '#') {
                listId = listId.substring(1);
            }
            if (!$('#' + listId).data('gridComplete')) {
                setTimeout(function() {
                    // 修复IE下鼠标移动到按钮后格式会乱的问题
                    /*$('#' + listId + ' td[$=_left] .ui-pg-button').each(function(){
                     $(this).width($(this).width() + 3);
                     });*/
                    if ($.isFunction(callback)) {
                        callback(listId);
                    }
                    $('#' + listId).data('gridComplete', true);
                }, 100);
            }
        },
        
        /**
         * 顶部的搜索条
         */
        filterToolbar: {
            settings: {
                stringResult: true
            }
        },
        
        /**
         * 标头分组
         */
        groupHeaders: {
            settings: {
                useColSpanStyle: true
            }
        }
    };
    
    /**
     * jqGrid公共参数，供集成使用
     */
    _plugin_jqGrid.settings = function(options) {
        return {
            datatype: "json",
            prmNames: _plugin_jqGrid.prmNames,
            jsonReader: _plugin_jqGrid.jsonReader,
            width: options.size.width,
            height: options.size.height,
            rowNum: options.rowNum || 20,
            rowList: options.rowList || [10, 15, 20, 30, 40, 50, 100],
            pager: options.pager || '#pager',
            viewrecords: true,
            rownumbers: true,
            subGridOptions: {
                "plusicon": "ui-icon-triangle-1-e",
                "minusicon": "ui-icon-triangle-1-s",
                "openicon": "ui-icon-arrowreturn-1-e"
            },
            loadError: function(xhr, st, err) {
                //alert("很抱歉，出错了！\n错误类型: " + st + "； 错误内容: "+ xhr.status + " " + xhr.statusText);
                var s = "未知";
                if (xhr.status == 404) {
                    s = "找不到数据源";
                } else if (xhr.status == 500) {
                    s = "服务器内部错误";
                } else if (xhr.responseText == '_login_timeout') {
                    s = "登录超时！";
                }
                alert("很抱歉，数据加载失败！\n错误类型: " + s);
            }
        };
    };
    
    /*******************************************/
    /**				jqGrid插件--结束			  **/
    /*******************************************/
    
    /*******************************************/
    /**			jquery.validator插件--开始	  **/
    /*******************************************/
    var _plugin_validator = {
        // 错误信息显示位置
        error: function(error, element) {
            if (element.is(":radio")) {
                error.appendTo(element.parent());
            } else if (element.is(":checkbox")) {
                error.appendTo(element.parent());
            } else {
                error.appendTo(element.parent());
            }
        },
        success: function(label) {
            label.html("&nbsp;").addClass("checked");
            var forEle = label.attr('for');
            if (forEle == 'phone') {
                if ($.isFunction(callback)) {
                    callback();
                }
            }
        }
    };
    /*******************************************/
    /**			jquery.validator插件--结束	  **/
    /*******************************************/
    
    /*******************************************/
    /**			jQuery UI--开始	  			  **/
    /*******************************************/
    var _plugin_jqui = {
    
        /**
         * 按钮相关
         */
        button: {
            onOff: function(options) {
                var defaults = {
                    btnText: false // text
                };
                options = $.extend({}, defaults, options);
                var dlgButton = $('.ui-dialog-buttonpane button');
                if (options.btnText) {
                    // TODO 查询优化，兼容有相同文字的情况
                    dlgButton = $('.ui-button-text:contains(' + options.btnText + ')').parent();
                }
                if (options.enable) {
                    dlgButton.attr('disabled', '');
                    dlgButton.removeClass('ui-state-disabled');
                } else {
                    dlgButton.attr('disabled', 'disabled');
                    dlgButton.addClass('ui-state-disabled');
                }
            }
        },
        
        /**
         * 对话框相关
         */
        dialog: {
            /**
             * 按钮相关方法
             */
            button: {
                /**
                 * 为dialog中的button设置icon，参数结构
                 * [{
                 *     text: '暂存',
                 *     title: '暂时存储',
                 *     icons: {
                 *         primary: 'ui-icon-disk'
                 *     }
                 * }]
                 * @param {Object} options
                 */
                setAttrs: function(options) {
                    var _set_btns = [];
                    $.each(options, function(i, v) {
                        _set_btns[_set_btns.length] = v;
                    });
                    
                    $.each(_set_btns, function(i, v) {
                        var $btn = $('.ui-dialog-buttonpane').find('button:contains(' + v.text + ')');
                        var _icons = {};
                        if (v.icons) {
                            var arrayIcons = v.icons.split(' ');
                            if (arrayIcons.length == 1) {
                                _icons.primary = arrayIcons[0];
                            } else if (arrayIcons.length == 2) {
                                _icons.primary = arrayIcons[0];
                                _icons.secondary = arrayIcons[1];
                            }
                            $btn.button({
                                icons: _icons
                            });
                        }
                        $btn.attr('title', v.title);
                    });
                }
            },
            /**
             * 根据浏览器差异获取window的高度
             */
            getBodyHeight: function() {
                var tempBodyHeight = document.documentElement.clientHeight;
                if ($.common.browser.isIE()) {
                    //tempBodyHeight += 150;
                } else {
                    tempBodyHeight -= 10;
                }
                return tempBodyHeight;
            },
            
            /**
             * 根据浏览器差异获取设置对话框的高度
             */
            getHeight: function(_height) {
                var tempBodyHeight = _height;
                if ($.common.browser.isIE()) {
                    tempBodyHeight += 100;
                } else {
                    tempBodyHeight -= 10;
                }
                return tempBodyHeight;
            }
        },
        
        /**
         * 选项卡相关
         */
        tab: {
            /**
             * 自动设置选项卡的高度
             * @param {Object} options
             */
            autoHeight: function(options) {
                var defaults = {
                    increment: {
                        ie: 0,
                        firefox: 0,
                        chrome: 0
                    }
                };
                
                options = $.extend({}, defaults, options);
                
                /**
                 * 核心处理函数
                 */
                function innerDeal() {
                    // 非IE默认值
                    var gap = 80;
                    // 特殊处理IE
                    if ($.common.browser.isIE()) {
                        gap = 60;
                        gap += options.increment.ie;
                    } else if ($.common.browser.isMozila()) {
                        gap += options.increment.firefox;
                    } else if ($.common.browser.isChrome()) {
                        gap += options.increment.chrome;
                    }
                    
                    var height = document.body.clientHeight - gap;
                    $('.ui-tabs-panel').height(height);
                    if ($.isFunction(options.callback)) {
                        options.callback();
                    }
                }
                
                innerDeal();
                
                // 窗口大小改变的时候
                window.onresize = innerDeal;
                
            }
        }
    };
    /*******************************************/
    /**			jQuery UI--结束	  			  **/
    /*******************************************/
    
    /*******************************************/
    /**			jstree --开始	  			  **/
    /*******************************************/
    
    var _plugin_jstree = {
    
        // 单击名称展开子节点
        clickNameToUnfold: function(jstreeObj) {
            $(jstreeObj).bind('click.jstree', function(event) {
                var eventNodeName = event.target.nodeName;
                if (eventNodeName == 'INS') {
                    return;
                } else if (eventNodeName == 'A') {
                    var $city = $(event.target);
                    
                    // 点击A展开子节点
                    $("#areaInfoTree").jstree('toggle_node', $city.parent().find('ins').get(0));
                    
                    if ($city.attr('leaf')) {
                        $('#result').text($city.text() + "，ID=" + $city.parent().attr('id'));
                    }
                }
            });
        }
    };
    
    /*******************************************/
    /**			jstree --结束	  			  **/
    /*******************************************/
    
    /*******************************************/
    /**			$.common--开始	  			  **/
    /*******************************************/
    var _common_plugins = {
        // jqGrid默认参数
        jqGrid: _plugin_jqGrid,
        validator: _plugin_validator,
        jqui: _plugin_jqui,
        jstree: _plugin_jstree
    };
    
    // 插件扩展
    $.common.plugin = _common_plugins;
    
    //-- frame工具 --//
    $.common.frame = {
        /**
         * 让iframe自适应高度
         */
        autoSizeIframe: function(iframeId) {
            var parentHeight = $('#' + iframeId).parent();
            $('#' + iframeId).height(parentHeight);
        }
    };
    
    //-- 和系统有关的函数 --//
    $.common.system = {
        // 获取系统属性
        getProp: function(options) {
            var defaults = {
                url: ctx + '/common/sysprop!findProp.action',
                params: {
                    key: ''
                },
                callback: null,
                error: null
            };
            
            $.extend(true, defaults, options);
            
            $.ajax({
                url: defaults.url,
                cache: false,
                dataType: 'json',
                data: defaults.params,
                success: function(prop, textStatus) {
                    if ($.isFunction(defaults.callback)) {
                        defaults.callback(prop);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if ($.isFunction(defaults.error)) {
                        defaults.error(XMLHttpRequest, textStatus, errorThrown);
                    }
                }
            });
            
        }
    };
    
    //-- 浏览器工具 --//
    $.common.browser = {
        // 检测是否是IE浏览器
        isIE: function() {
            var _uaMatch = $.uaMatch(navigator.userAgent);
            var _browser = _uaMatch.browser;
            if (_browser == 'msie') {
                return true;
            } else {
                return false;
            }
        },
        // 检测是否是chrome浏览器
        isChrome: function() {
            var _uaMatch = $.uaMatch(navigator.userAgent);
            var _browser = _uaMatch.browser;
            if (_browser == 'webkit') {
                return true;
            } else {
                return false;
            }
        },
        // 检测是否是Firefox浏览器
        isMozila: function() {
            var _uaMatch = $.uaMatch(navigator.userAgent);
            var _browser = _uaMatch.browser;
            if (_browser == 'mozilla') {
                return true;
            } else {
                return false;
            }
        },
        // 检测是否是Firefox浏览器
        isOpera: function() {
            var _uaMatch = $.uaMatch(navigator.userAgent);
            var _browser = _uaMatch.browser;
            if (_browser == 'opera') {
                return true;
            } else {
                return false;
            }
        }
    };
    
    //-- 编码相关 --//
    $.common.code = {
        /**
         * 把文本转换为HTML代码
         * @param {Object} text	原始文本
         */
        htmlEncode: function(text) {
            var textold;
            do {
                textold = text;
                text = text.replace("\n", "<br>");
                text = text.replace("\n", "<br/>");
                text = text.replace("\n", "<BR/>");
                text = text.replace("\n", "<BR>");
                text = text.replace(" ", "&nbsp;");
            } while (textold != text);
            
            return text;
        },
        
        /**
         * 把HTML代码转换为文本
         * @param {Object} text	原始HTML代码
         */
        htmlDecode: function(text) {
            var textold;
            do {
                textold = text;
                text = text.replace("<br>", "\n");
                text = text.replace("<br/>", "\n");
                text = text.replace("<BR>", "\n");
                text = text.replace("<BR/>", "\n");
                text = text.replace("&nbsp;", " ");
            } while (textold != text);
            return text;
        }
        
    };
    
    //-- 文件相关 --//
    $.common.file = {
        /**
         * 下载文件
         * @fileName	相对于Web根路径
         */
        download: function(fileName) {
            var downUrl = $.common.custom.getCtx() + '/file/download.action?fileName=' + fileName;
            //open(encodeURI(encodeURI(downUrl)));
            location.href = encodeURI(encodeURI(downUrl));
        }
    };
    
    //-- 数学工具 --//
    $.common.math = {
        /*
         * 四舍五入
         */
        round: function(dight, how) {
            return dight.toFixed(how);
        }
    };
    
    //-- 未分类 --//
    $.common.custom = {
        // 得到应用名
        getCtx: function() {
            try {
                return ctx || '';
            } catch (e) {
                //alert('没有设置ctx变量');
            }
        },
        getLoadingImg: function() {
            return '<img src="' + $.common.custom.getCtx() + '/images/ajax/loading.gif" align="absmiddle"/>&nbsp;';
        },
        /**
         * 创建小时下拉框
         */
        createHourSelect: function(selectId, defaultValue) {
            var hours = new StringBuffer();
            var tempValue = "";
            for (var i = 0; i < 24; i++) {
                if (i < 10) {
                    tempValue = "0" + i;
                } else {
                    tempValue = i;
                }
                hours.append("<option value='" + tempValue + "'" + (defaultValue == tempValue ? " selected" : "") + ">" + tempValue + "</option>");
            }
            $(selectId).append(hours.toString());
        },
        /**
         * 创建分钟下拉框
         */
        createMinuteSelect: function(selectId, defaultValue) {
            var hours = new StringBuffer();
            var tempValue = "";
            for (var i = 0; i < 60; i++) {
                if (i < 10) {
                    tempValue = "0" + i;
                } else {
                    tempValue = i;
                }
                hours.append("<option value='" + tempValue + "'" + (defaultValue == tempValue ? " selected" : "") + ">" + tempValue + "</option>");
            }
            $(selectId).append(hours.toString());
        },
        
        /**
         * 日期增加年数或月数或天数
         * @param {String} BaseDate	要增加的日期
         * @param {Object} interval	增加数量
         * @param {Object} DatePart	增加哪一部分
         * @param {String} ReturnType 返回类型strunt|date
         */
        dateAdd: function(BaseDate, interval, DatePart, ReturnType) {
            var dateObj;
            if (typeof BaseDate == 'object') {
                dateObj = BaseDate;
            } else {
                var strDs = BaseDate.split('-');
                var year = parseInt(strDs[0]);
                var month = parseInt(strDs[1]);
                var date = parseInt(strDs[2]);
                dateObj = new Date(year, month, date);
            }
            ReturnType = ReturnType || 'string';
            var millisecond = 1;
            var second = millisecond * 1000;
            var minute = second * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var year = day * 365;
            
            var newDate;
            var dVal = new Date(dateObj);
            var dVal = dVal.valueOf();
            switch (DatePart) {
                case "ms":
                    newDate = new Date(dVal + millisecond * interval);
                    break;
                case "s":
                    newDate = new Date(dVal + second * interval);
                    break;
                case "mi":
                    newDate = new Date(dVal + minute * interval);
                    break;
                case "h":
                    newDate = new Date(dVal + hour * interval);
                    break;
                case "d":
                    newDate = new Date(dVal + day * interval);
                    break;
                case "y":
                    newDate = new Date(dVal + year * interval);
                    break;
                default:
                    return escape("日期格式不对");
            }
            newDate = new Date(newDate);
            if (ReturnType == 'string') {
                return newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDate();
            } else if (ReturnType == 'date') {
                return newDate;
            }
        }
    };
    
    /*******************************************/
    /**			$.form--开始  	  			  **/
    /*******************************************/
    //-- 表单自定义功能 --//
    $.form = {};
    
    // 绑定form的ajax提交功能
    $.form.bindAjaxSubmit = function(settings) {
    
        var defaults = {
            formId: '',
            beforeSubmit: showRequest,
            success: showResponse,
            clearForm: false
        };
        
        settings = $.extend({}, defaults, settings);
        
        $(settings.formId).submit(function() {
            $(this).ajaxSubmit(settings);
            return false;
        });
        
    };
    
    // 表示层设置
    $.form.ui = {
        // 红色星号
        required: function() {
            return $.common.plugin.jqGrid.form.must();
        }
    };
    
    // -- 自定义插件 --//
    /**
     * 插件名称：cursorInsert（光标处插入） 功能：可以在文本框的
     */
    $.fn.cursorInsert = function(options) {
    
        // default settings
        var settings = {
            content: ''
        };
        
        if (options) {
            $.extend(settings, options);
        }
        
        return this.each(function() {
            var obj = $(this).get(0);
            if (document.selection) {
                obj.focus();
                var sel = document.selection.createRange();
                document.selection.empty();
                sel.text = options.content;
            } else {
                var prefix, main, suffix;
                prefix = obj.value.substring(0, obj.selectionStart);
                main = obj.value.substring(obj.selectionStart, obj.selectionEnd);
                suffix = obj.value.substring(obj.selectionEnd);
                obj.value = prefix + options.content + suffix;
            }
            obj.focus();
        });
    };
    
    /**
     * 随滚动条滚动
     */
    $.fn.autoScroll = function() {
        var _this = this;
        $(_this).css({
            position: 'absolute'
        });
        
        $(window).scroll(function() {
            $(_this).css({
                top: $(this).scrollTop() + $(this).height() - 500
            });
        });
        
    };
    
    /**
     * 动态加载JavaScript
     */
    $.loadScript = function(options) {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = options.src;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    };
    
})(jQuery);

//-- 自定义函数 --//
function _initFunction() {

    // 全局ajax设置
    $.ajaxSetup({
        cache: false,
        global: true,
        jsonp: null,
        jsonpCallback: null,
        complete: function(req, status) {
            if (req.responseText == '_login_timeout' || req.responseText.indexOf('登录页') != -1) {
                // 打开重新登录窗口
                if ($.isFunction($.common.window.getTopWin().relogin)) {
                    $.common.window.getTopWin().relogin();
                } else {
                    alert('登录已超时，请保存数据后重新登录！');
                }
            }
        },
        error: function(req, status) {
            var reqText = req.responseText;
            if (reqText == 'login') {
                return;
            }
            if (reqText == 'error') {
                alert('提示：操作失败！');
            } else if (reqText != '') {
                alert("提示：" + reqText);
            }
        }
    });
    
    if ($.jgrid) {
        $.jgrid.no_legacy_api = true;
        $.jgrid.useJSON = true;
        $.jgrid.ajaxOptions.type = 'post';
    }
    
};

//-- Javascript对象扩展--开始-//
/**
 * 去掉开头、结尾的空格
 *
 * @return {}
 */
String.prototype.trim = function() {
    return this.replace(/(^\s+)|\s+$/g, "");
};

/**
 * 转换字符串为json对象
 */
String.prototype.toJson = function() {
    return eval('(' + this + ')');
};

String.prototype.endsWithIgnoreCase = function(str) {
    return (this.toUpperCase().match(str.toUpperCase() + "$") == str.toUpperCase()) ||
    (this.toLowerCase().match(str.toLowerCase() + "$") == str.toLowerCase());
}

/**
 * 输出2010-02-05格式的日期字符串
 *
 * @return {}
 */
Date.prototype.toDateStr = function() {
    return ($.common.browser.isMozila() || $.common.browser.isChrome() ? (this.getYear() + 1900) : this.getYear()) + "-" +
    (this.getMonth() < 10 ? "0" + this.getMonth() : this.getMonth()) +
    "-" +
    (this.getDate() < 10 ? "0" + this.getDate() : this.getDate());
};

/**
 * 日期格式化
 * @param {Object} format
 */
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }
    if (/(y+)/.test(format)) 
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) 
        if (new RegExp("(" + k + ")").test(format)) 
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


/**
 * 将字符串格式的日期转换为日期类型对象
 * @param {Object} strDate
 */
Date.toDate = function(strDate) {
    var strDs = strDate.split('-');
    var year = parseInt(strDs[0]);
    var month = parseInt(strDs[1]);
    var date = parseInt(strDs[2]);
    return new Date(year, month, date);
};

/**
 * 通过当前时间计算当前周数
 */
Date.prototype.getWeekNumber = function() {
    var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var DoW = d.getDay();
    d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
    var ms = d.valueOf(); // GMT
    d.setMonth(0);
    d.setDate(4); // Thu in Week 1
    return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
}


//+---------------------------------------------------
//| 日期计算
//+---------------------------------------------------
Date.prototype.DateAdd = function(strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's':
            return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n':
            return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h':
            return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd':
            return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w':
            return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y':
            return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};

//-- Javascript对象扩展--结束 -//

//-- 自定义类-开始 --/
function StringBuffer() {
    this._strings_ = new Array();
}

StringBuffer.prototype.append = function(str) {
    this._strings_.push(str);
    return this;
};

StringBuffer.prototype.toString = function() {
    return this._strings_.join("").trim();
};

/**
 * 以键值对存储
 */
function Map() {
    var struct = function(key, value) {
        this.key = key;
        this.value = value;
    };
    
    var put = function(key, value) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                this.arr[i].value = value;
                return;
            }
        }
        this.arr[this.arr.length] = new struct(key, value);
        this._keys[this._keys.length] = key;
    };
    
    var get = function(key) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                return this.arr[i].value;
            }
        }
        return null;
    };
    
    var remove = function(key) {
        var v;
        for (var i = 0; i < this.arr.length; i++) {
            v = this.arr.pop();
            if (v.key === key) {
                continue;
            }
            this.arr.unshift(v);
            this._keys.unshift(v);
        }
    };
    
    var size = function() {
        return this.arr.length;
    };
    
    var keys = function() {
        return this._keys;
    };
    
    var isEmpty = function() {
        return this.arr.length <= 0;
    };
    
    this.arr = new Array();
    this._keys = new Array();
    this.keys = keys;
    this.get = get;
    this.put = put;
    this.remove = remove;
    this.size = size;
    this.isEmpty = isEmpty;
}

/**
 * 更新jquery ui css
 * @param {Object} locStr
 */
function updateCSS(locStr) {
    var cssLink = $('<link href="' + locStr + '" type="text/css" rel="Stylesheet" class="ui-theme" />');
    $("head").append(cssLink);
    if ($("link.ui-theme").size() > 3) {
        $("link.ui-theme:first").remove();
    }
}

/**
 * 更新自定义CSS
 */
function updateCustomCss() {
    var customStyleUrl = ctx + '/css/style.css';
    var cssLink = $('<link href="' + customStyleUrl + '" type="text/css" rel="Stylesheet" class="custom-style" />');
    $("head").append(cssLink);
    if ($("link.custom-style").size() > 3) {
        $("link.custom-style:first").remove();
    }
}

//-- 自定义类-结束 --/
