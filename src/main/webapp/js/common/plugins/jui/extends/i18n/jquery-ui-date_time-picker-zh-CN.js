/* Catalan translation for the jQuery Timepicker Addon */
/* Written by Henry Yan */
(function($) {
	if ($.datepicker) {
		$.datepicker.regional['zh-CN'] = {
			closeText: '关闭',
			prevText: '&#x3C;上月',
			nextText: '下月&#x3E;',
			currentText: '今天',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
			weekHeader: '周',
			dateFormat: 'yy-mm-dd',
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: true,
			yearSuffix: '年'
		};
		$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
	}
	
	if ($.timepicker) {
		$.timepicker.regional['zh-CN'] = {
			timeOnlyTitle: '选择时间',
			timeText: '时间',
			hourText: '小时',
			minuteText: '分钟',
			secondText: '妙',
			millisecText: '毫秒',
			timezoneText: '时区',
			currentText: '当前',
			closeText: '确定',
			timeFormat: 'hh:mm',
			amNames: ['上午', 'A'],
			pmNames: ['下午', 'P']
		};
		$.timepicker.setDefaults($.timepicker.regional['zh-CN']);
	}
})(jQuery);
