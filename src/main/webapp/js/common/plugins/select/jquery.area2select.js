/*!
 * 
 * jquery.area2select
 * 
 * @license	无限，男女老少皆宜
 * @version 1.0.0
 * @author  咖啡兔
 * @site    www.wsria.cn
 */
(function($){
    $.fn.area2select = function(settings){
		// 内部对象
		var _this = this;
		
		// 获取应用名称
		function getCtx() {
			var url = location.pathname;
			var contextPath = url.substr(0, url.indexOf('/', 1));
			return contextPath;
		};
	
		/* 默认参数 */
        var defaults = {
			url : getCtx() + '/bmc/basic/area-info!findArea.action', // 数据源
			fromHtmlUrl : getCtx() + '/bmc/basic/area-info!htmlCode.action', // 直接读取生成好的HTML代码路径
			topLevel : 1, // 最高级别标示，每一个地区信息都有一个Leve标示是哪一级的
			defaultValue : null, // 需要选择的下拉框默认值，会自动逐级选中
			parentName : null, // 从以此名字的下级显示，例如设置了”上海市“，则页面显示的是上海市下面的所有区县
			layer : null, // 加载地区的级别，默认全部加载
			attrs : {}, // 属性集合
			callback : null //没加载完一级后回调，有默认值加载时只调用一次
		};
        
        /* 合并默认参数和用户自定义参数  */
        settings = $.extend(true, defaults, settings);
		
		/**
		 * 插件初始化
		 */
		function _plugin_init() {
			if ($.isFunction(settings.defaultValue)){
				settings.defaultValue = settings.defaultValue();
			}
			
			if (settings.parentName) {
				// 转码
				settings.parentName = encodeURIComponent(settings.parentName);
			}
		};
		// 初始化插件
		_plugin_init();
		
		/**
		 * 设置默认值
		 */
		function setDefaultValue() {
			if (settings.defaultValue) {
				$(_this).html('&nbsp;').addClass('loading').load(settings.fromHtmlUrl, {
					childId : settings.defaultValue
				}, function() {
					$('select', _this).attr(settings.attrs).bind('change', function(){
						if (settings.layer > $('.area2select', _this).length) {
							loadChilds(this, true);
						}
					}).addClass('area2select');
					
					if ($.isFunction(settings.callback)) {
						settings.callback();
					}
				});
			}
		};
		
		/**
		 * 加载下级地区
		 */
		function loadChilds(selem, manual) {
			// 检查设置的级别
			if (settings.layer) {
				if ($.isFunction(settings.callback)) {
					settings.callback();
				}
				if (settings.layer == $('.area2select', _this).length) {
					// 改变事件的方式
					$('select:not(:last)', _this).unbind('change').bind('change', function(){
						loadChilds(this, true);
						return;
					});
					
					// 自动触发的事件，满足设置的layer时退出插件的循环
					if (!manual) {
						return;
					}
					
				}
			};
			// 清楚选择的下拉框后面的下拉框
			$(selem).nextAll().remove();
			
			// loading状态
			$('<span/>', {html : '&nbsp;&nbsp;'}).addClass('loading').appendTo(_this);
			
			// 加载下级创建选择框
			$.getJSON(settings.url, {
				parentId : parseInt($(selem).val())
			}, function(areas){
				$('.loading', _this).remove();
				if (areas.length == 0) {
					if ($.isFunction(settings.callback)) {
						settings.callback();
					}
					return;
				}
				var _level = $('select', _this).length + 1;
				var $select = $('<select/>').addClass('area2select').data('level', _level).bind('change', function(){
					// 自动触发
					loadChilds(this, false); 
				});
				$.each(areas, function(i, n) {
					$('<option/>', {
						value : n.id,
						text : n.areaName
					}).appendTo($select);
				});
				$(_this).append($select);
				$select.attr(settings.attrs).trigger('change');
			});
		};
		
		/* 循环处理 */
        return this.each(function(){
			// 默认值情况
			if (settings.defaultValue) {
				setDefaultValue();
			} else { // 只显示列表
				// 先清空现有的下拉框
				$('.area2select', _this).remove();
				$('<span/>', {html : '&nbsp;&nbsp;'}).addClass('loading').appendTo(_this);
				
				// 设置第一次加载标志
				if ($('select', this).length == 0) {
					$(this).data('first', true);
				}
				
				var _param = {};
				if (settings.parentName) {
					_param.parentName = settings.parentName;
				} else {
					_param.level = settings.topLevel;
				}
				// 加载创建选择框
				$.getJSON(settings.url, _param, function(areas){
					$('.loading', _this).remove();
					// 创建并绑定事件
					var $select = $('<select/>').addClass('area2select').data('level', settings.topLevel).bind('change', function(){
						// 自动触发
						loadChilds(this, false); 
					});
					$.each(areas, function(i, n){
						$('<option/>', {
							value: n.id,
							text: n.areaName
						}).appendTo($select);
					});
					$(_this).append($select);
					$select.attr(settings.attrs).trigger('change');
				});
			}
			
        });
        
    };
	
	/**
	 * 获取选中的地区ID
	 */
	$.fn.getAreaId = function(index) {
		if (index) {
			var _select = $('select:eq(' + (parseInt(index) - 1) + ')', this);
			return {text : _select.find('option:selected').text(), value : _select.val()};
		}
		var _select = $('select:last', this);
		return {text : _select.find('option:selected').text(), value : _select.val()};
	};
    
})(jQuery);
