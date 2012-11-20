$.widget("kft.portlet", {
    options: {
        columns: {}
    },
    _create: function() {
        this.element.addClass("ui-portlet");
        this._update();
        $(".ui-portlet-column").sortable({
            connectWith: ".ui-portlet-column"
        }).disableSelection();
    },

    _setOption: function(key, value) {
        this.options[key] = value;
        this._update();
    },

    _update: function() {
        var _this = this;
        var $ctn = _this.element;
        var opts = _this.options;
        $.each(opts.columns, function(ci, c) {

            var $column = $('<div/>', {
                'class': 'ui-portlet-column',
                width: c.width
            }).appendTo($ctn);

            $.each(c.portlets, function(pi, p) {

                var $item = $('<div/>', {
                    'class': 'ui-portlet-item ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'
                }).appendTo($column);

                // title
                $('<div/>', {
                    'class': 'ui-portlet-header ui-widget-header ui-corner-all',
                    html: p.title
                }).appendTo($item).prepend("<span class='ui-icon ui-icon-minusthick'></span>");

                // content
                var $ct = $('<div/>', {
                    'class': 'ui-portlet-content'
                }).appendTo($item);
                $ct.html(_this._content($ct, c, p));
            });
        });

        // init events
        _this._initEvents();
    },

    /*
    events and handlers
     */
    _initEvents: function() {
        // toggle contents
        $(".ui-portlet-header .ui-icon", this).click(function() {
            $(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
            $(this).parents(".ui-portlet-item:first").find(".ui-portlet-content").toggle();
        });
    },

    /*
    get content from multi styles
     */
    _content: function(ct, c, p) {
        var type = p.content.type;
        if(type == 'text') {
            return p.content.text;
        } else if(type == 'ajax') {
            var dataType = p.content.dataType || 'html';
            $.ajax({
                url: p.content.url,
                dataType: dataType,
                success: function(data, textStatus, jqXHR) {
                    if(dataType == 'html') {
                        $(ct).html(data);
                    } else if (dataType == 'json') {
                        $(ct).html(p.content.formatter(data));
                    }
                }
            });

        }
    },

    /*
    destory portlet
     */
    destroy: function() {
        this.element.removeClass("ui-portlet").text("");

        // call the base destroy function
        $.Widget.prototype.destroy.call(this);
    }
});