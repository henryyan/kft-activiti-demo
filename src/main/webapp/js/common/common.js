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
            if(parent) {
                var tempParent = parent;
                while(true) {
                    $.common.plugin$.common.plugin
                    if(tempParent.parent) {
                        if(tempParent.parent == tempParent) {
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
                autoSuit: true,
                // 自动适应高度，因为在firefox下面不减10会出现滚动条
                autoSuitValue: -13
            };
            options = $.extend({}, defaults, options);
            if(options.autoSuit) {
                return document.documentElement.clientHeight + options.autoSuitValue;
            } else {
                return document.documentElement.clientHeight;
            }
        }
    };

    /*******************************************/
    /**         jquery.validator插件--开始    **/
    /*******************************************/
    var _plugin_validator = {
        // 错误信息显示位置
        errorPlacement: function(error, element) {
            // Set positioning based on the elements position in the form
            var elem = $(element), corners = ['right center', 'left bottom'], flipIt = elem.parents('span.right').length > 0;

            // Check we have a valid error message
            if (!error.is(':empty')) {
                // Apply the tooltip only if it isn't valid
                elem.filter(':not(.valid)').qtip({
                    overwrite: false,
                    content: error,
                    position: {
                        my: corners[flipIt ? 0 : 1],
                        at: corners[flipIt ? 1 : 0],
                        viewport: $(window),
                        adjust: {
                            x: 2,
                            y: 10
                        }
                    },
                    show: {
                        event: false,
                        ready: true
                    },
                    hide: false,
                    style: {
                        classes: 'ui-tooltip-red validator-error'
                    },
                    events: {
                        show: function(event, api) {
                            // 设置qtip绑定的表单元素
                            $(this).data('elem', elem);
                        }
                    }
                }).qtip('option', 'content.text', error);
            } else {
                elem.qtip('destroy');
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
    /**         jquery.validator插件--结束    **/
    /*******************************************/

    /*******************************************/
    /**         $.common--开始                  **/
    /*******************************************/
    var _common_plugins = {
        validator: _plugin_validator
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

    /*
     * 是否可以写日志
     */

    function can_log() {
        if(javascript_log_enable == false || $.common.browser.isIE()) {
            return false;
        }
        return console != undefined;
    };

    /**
     * jquery插件形式的firebug日志
     * @param {Object} msg
     */
    $.fn.log = function(msg) {
        if(!can_log()) {
            return this;
        }
        console.log("%s: %o", msg, this);
        return this;
    };

    $.log = $.log || {};
    /**
     * firebug日志
     * @param {Object} msg
     */
    $.extend($.log, {
        log: function(msg) {
            if(!can_log()) {
                return;
            }
            console.log(msg);
        },
        debug: function(msg) {
            if(!can_log()) {
                return;
            }
            console.debug(msg);
        },
        info: function(msg) {
            if(!can_log()) {
                return;
            }
            console.info(msg);
        },
        warn: function(msg) {
            if(!can_log()) {
                return;
            }
            console.warn(msg);
        },
        error: function(msg) {
            if(!can_log()) {
                return;
            }
            console.error(msg);
        }
    });

    /**
     * 获取元素的outerHTML
     */
    $.fn.outerHTML = function() {

        // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
        return(!this.length) ? this : (this[0].outerHTML || (function(el) {
            var div = document.createElement('div');
            div.appendChild(el.cloneNode(true));
            var contents = div.innerHTML;
            div = null;
            return contents;
        })(this[0]));
    };

})(jQuery);

//-- 自定义函数 --//
function _initFunction() {
    $.extend({
        jsonToString: function(object) {
            if(object == null) {
                return 'null';
            }
            var type = typeof object;
            if('object' == type) {
                if(Array == object.constructor) {
                    type = 'array';
                } else if(RegExp == object.constructor) {
                    type = 'regexp';
                } else {
                    type = 'object';
                }
            }
            switch(type) {
            case 'undefined':
            case 'unknown':
                {
                    return;
                    break;
                }
            case 'function':
                {
                    return '"' + object() + '"';
                    break;
                }
            case 'boolean':
            case 'regexp':
                {
                    return object.toString();
                    break;
                }
            case 'number':
                {
                    return isFinite(object) ? object.toString() : 'null';
                    break;
                }
            case 'string':
                {
                    return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function() {
                        var a = arguments[0];
                        return(a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : ""
                    }) + '"';
                    break;
                }
            case 'object':
                {
                    if(object === null) return 'null';
                    var results = [];
                    for(var property in object) {
                        var value = jquery.jsonToString(object[property]);
                        if(value !== undefined) results.push(jquery.jsonToString(property) + ':' + value);
                    }
                    return '{' + results.join(',') + '}';
                    break;

                }
            case 'array':
                {
                    var results = [];
                    for(var i = 0; i < object.length; i++) {
                        var value = jquery.jsonToString(object[i]);
                        if(value !== undefined) results.push(value);
                    }
                    return '[' + results.join(',') + ']';
                    break;

                }
            }
        }
    });

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
    return(this.toUpperCase().match(str.toUpperCase() + "$") == str.toUpperCase()) || (this.toLowerCase().match(str.toLowerCase() + "$") == str.toLowerCase());
}

/**
 * 输出2010-02-05格式的日期字符串
 *
 * @return {}
 */
Date.prototype.toDateStr = function() {
    return($.common.browser.isMozila() || $.common.browser.isChrome() ? (this.getYear() + 1900) : this.getYear()) + "-" + (this.getMonth() < 10 ? "0" + this.getMonth() : this.getMonth()) + "-" + (this.getDate() < 10 ? "0" + this.getDate() : this.getDate());
};

/**
 * 日期格式化
 * @param {Object} format
 */
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        //month
        "d+": this.getDate(),
        //day
        "h+": this.getHours(),
        //hour
        "m+": this.getMinutes(),
        //minute
        "s+": this.getSeconds(),
        //second
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for(var k in o)
    if(new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
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
    switch(strInterval) {
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
            for(var i = 0; i < this.arr.length; i++) {
                if(this.arr[i].key === key) {
                    this.arr[i].value = value;
                    return;
                }
            }
            this.arr[this.arr.length] = new struct(key, value);
            this._keys[this._keys.length] = key;
        };

    var get = function(key) {
            for(var i = 0; i < this.arr.length; i++) {
                if(this.arr[i].key === key) {
                    return this.arr[i].value;
                }
            }
            return null;
        };

    var remove = function(key) {
            var v;
            for(var i = 0; i < this.arr.length; i++) {
                v = this.arr.pop();
                if(v.key === key) {
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
    if($("link.ui-theme").size() > 3) {
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
    if($("link.custom-style").size() > 3) {
        $("link.custom-style:first").remove();
    }
}

/**
 * 引入css、script文件
 * @param {Object} file
 */

function include(file) {
    var files = typeof file == "string" ? [file] : file;
    for(var i = 0; i < files.length; i++) {
        var name = files[i].replace(/^\s|\s$/g, "");
        var att = name.split('.');
        var ext = att[att.length - 1].toLowerCase();
        var isCSS = ext == "css";
        var tag = isCSS ? "link" : "script";
        var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
        var link = (isCSS ? "href" : "src") + "='" + '' + name + "'";
        if($(tag + "[" + link + "]").length == 0) {
            $("<" + tag + attr + link + "></" + tag + ">").appendTo('head');
        }
    }
}

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while(i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if(isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if(isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while(i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if(enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if(enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for(var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if(c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while(i < utftext.length) {

            c = utftext.charCodeAt(i);

            if(c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

};

function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = Base64.encode(tok);
    return "Basic " + hash;
}
//-- 自定义类-结束 --/