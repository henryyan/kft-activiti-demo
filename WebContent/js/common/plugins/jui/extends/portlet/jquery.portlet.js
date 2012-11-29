/*
 * jquery.portlet 1.0.0
 *
 * Copyright (c) 2012
 *   咖啡兔 (http://www.kafeitu.me)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * See Detail: http://www.kafeitu.me/jquery-ui-portlet.html
 */
(function($) {
    $.widget("kft.portlet", {
        options: {
            columns: {},
            sortable: true,
            removeItem: null
        },

        /**
         * create portlet widget
         */
        _create: function() {
            this.element.addClass("ui-portlet");
            var _this = this;
            var _ele = _this.element;
            var o = _this.options;

            $.each(o.columns, function(ci, c) {

                var $column = $('<div/>', {
                    'class': 'ui-portlet-column',
                    width: c.width
                }).appendTo(_ele);

                $.each(c.portlets, function(pi, p) {

                    var item = $('<div/>', {
                        'class': 'ui-portlet-item ui-widget ui-widget-content ui-helper-clearfix ui-corner-all',
                    }).data('option', p).appendTo($column);
                    if(p.attrs) {
                        item.attr(p.attrs);
                    }

                    // title
                    var title = $('<div/>', {
                        'class': 'ui-portlet-header ui-widget-header ui-corner-all',
                        html: function() {
                            if ($.isFunction(p.title)) {
                                return p.title;
                            }
                            return p.title;
                        }
                    }).appendTo(item);

                    // event element
                    title.prepend("<a href='#' class='ui-corner-all'><span class='ui-icon ui-icon-refresh ui-portlet-refresh'></span></a>");
                    title.prepend("<a href='#' class='ui-corner-all'><span class='ui-icon ui-icon-minusthick ui-portlet-toggle'></span></a>");
                    title.prepend("<a href='#' class='ui-corner-all'><span class='ui-icon ui-icon-closethick ui-portlet-close'></span></a>");

                    // content
                    var ct = $('<div/>', {
                        'class': 'ui-portlet-content'
                    }).appendTo(item);

                    // set attrs
                    if(p.content.attrs) {
                        $.each(p.content.attrs, function(k, v) {
                            var attr = ct.attr(k);
                            if(attr) {
                                if(k == 'style' && v.substr(v.length - 1) != ';') {
                                    attr += ';';
                                }
                                if(k == 'class') {
                                    attr += ' ';
                                }
                                attr += v;
                            }
                            ct.attr(k, attr);
                        });
                    }

                    // load content
                    _this._content.call(_ele, item, p, function(data) {
                        // load scripts
                        _this._loadScripts(p.scripts);
                    });
                });
            });

            // init events
            _this._initEvents();

            // enable/disable sortable
            _this._sortable(o.sortable);
        },

        _setOption: function(key, value) {
            // static options
            if(this.options[key]) {
                this.options[key] = value;
            }

            // need handle speical
            switch(key) {
            case "sortable":
                this._sortable(value);
                break;
            }
        },

        /**
         * load java scripts
         * @param  {[string]} scripts [description]
         */
        _loadScripts: function(scripts) {
            if(scripts) {
                $.each(scripts, function() {
                    var head = $('head').remove('#loadScript');
                    $("<script>" + "</script>").attr({
                        src: this,
                        type: 'text/javascript',
                        id: 'loadScript'
                    }).appendTo(head);
                });
            }
        },

        /**
         * enable/disable sortable
         * @param  {[type]} value [true|false]
         */
        _sortable: function(value) {
            var st = $(".ui-portlet-column").sortable({
                connectWith: ".ui-portlet-column"
            }).disableSelection();
            if(value === true) {
                st.sortable('enable');
            } else {
                st.sortable('disable');
            }
        },

        /**
         * events and handlers
         * @return {[type]} [description]
         */
        _initEvents: function() {
            var _this = this;

            // toggle contents
            var toggle = $(".ui-portlet-toggle", this.element).click(function() {
                $(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
                $(this).parents(".ui-portlet-item:first").find(".ui-portlet-content").toggle();
            });

            var refresh = $(".ui-portlet-refresh", this.element).click(function(event) {
                _this.refresh.call(_this, event);
            });

            var close = $(".ui-portlet-close", this.element).click(function(event) {
                _this._destoryItem.call(_this, event);
            });

            this._hoverable(toggle.parent());
            this._hoverable(refresh.parent());
        },

        /**
         * hoverable
         */
        _hoverable: function(element) {
            $(element).hover(function() {
                $(this).addClass('ui-state-hover');
            }, function() {
                $(this).removeClass('ui-state-hover');
            });
        },

        /**
         * destory single portlet
         */
        _destoryItem: function(event) {
            var o = this.options;
            var item = $(event.target).parents('.ui-portlet-item');
            item.remove();
            if($.isFunction(o.removeItem)) {
                o.removeItem();
            }
        },

        /**
         * refresh contents
         */
        refresh: function(event) {
            var o = this.options;
            var portlet = $(event.target).parents('.ui-portlet');
            var item = $(event.target).parents('.ui-portlet-item');
            var pio = item.data('option');
            var ct = item.find('.ui-portlet-content');
            var pt = item.parents('.ui-portlet');

            // callback
            if($.isFunction(pio.beforeRefresh)) {
                pio.beforeRefresh.call(pt, pio);
            }

            // set contents
            this._content.call(portlet, item, pio, function(data) {
                // callback
                if($.isFunction(pio.afterRefresh)) {
                    pio.afterRefresh.call(pt, data, pio);
                }
            });

            // load scripts
            this._loadScripts(pio.scripts);
        },

        /**
         * get content from multi styles
         * @param  {[type]} item [.ui-portlet-item]
         * @param  {[type]} pio  [portlet configs]
         * @param  {[type]} cl   [callback after load]
         */
        _content: function(item, pio, cl) {
            var o = this.options;
            var that = this;
            var type = pio.content.type;
            var content = null;
            var ct = item.find('.ui-portlet-content');

            // before show callback
            if($.isFunction(pio.content.beforeShow)) {
                pio.content.beforeShow.call(this, pio.content.text);
            }

            if(type == 'text') {
                content = pio.content.text;

                // get content from function
                if($.isFunction(content)) {
                    content = content(that, item, pio);
                }

                if($.isFunction(cl)) {
                    cl.call(that, content);
                }
                ct.html(content);
                _callAfterShow(pio.content.text);
            } else if(type == 'ajax') {
                var dataType = pio.content.dataType || 'html';
                $.ajax({
                    url: pio.content.url,
                    dataType: dataType,
                    beforeSend: function() {
                        $(ct).html('Loading...');
                    },
                    success: function(data, textStatus, jqXHR) {
                        if(dataType == 'html') {
                            content = data;
                            $(ct).html(data);
                        } else if(dataType == 'json') {
                            content = pio.content.formatter(o, pio, data)
                            $(ct).html(content);
                        }
                        _callAfterShow(content);
                        if($.isFunction(cl)) {
                            cl.call(that, data);
                        }
                    }
                });
            }

            /**
             * after show callback
             */
            function _callAfterShow(content) {
                if($.isFunction(pio.content.afterShow)) {
                    pio.content.afterShow.call(that, content);
                }
            }

        },

        /**
         * destory portlet
         */
        _destroy: function() {
            this.element.removeClass("ui-portlet").text("");

            // call the base destroy function
            $.Widget.prototype.destroy.call(this);
            return this;
        }
    });

})(jQuery);