/*------------------------------------------------------------------------

 # JVisualContent Extension

 # ------------------------------------------------------------------------

 # author    DuongTVTemPlaza

 # copyright Copyright (C) 2012 templaza.com. All Rights Reserved.

 # @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL

 # Websites: http://www.templaza.com

 # Technical Support:  Forum - http://templaza.com/Forum

 -------------------------------------------------------------------------*/

(function($) {
    $.fn.tzExtraFieldsTypes = function(options){
        var $this   = this,
            settings = $.extend({
            // These are the defaults.
            'value'             : '',
            'sample'            : true,
            'htmlForm'          : '',
            'htmlSample'        : '',
            'sortRowIcon'       : '.icon-move',
            'deleteRowIcon'     : '.icon-remove',
            'sampleIdPrefix'    : '',
            'addButtonString'   : '',
            'deleteText'        : 'Are you sure to delete this options?',
            'AfterHtmlAppend'   : function(){},
            'AfterChange'       : function(valSelected){}
        }, options );


        $.loadHtml  = function(value){

            if(settings.sample){
                $($this.selector+'_tztype'+settings.sampleIdPrefix).html('').html($(settings.htmlSample).find($this.selector+'_'+value+settings.sampleIdPrefix).html());
            }
            switch (value){
                default :
                    if($(settings.htmlForm).find($this.selector+'_'+value).text().length){
                        $($this.selector+'_tztype').html($(settings.htmlForm).find($this.selector+'_'+value).html());
                    }else{
                        $($this.selector+'_tztype').html('');
                    }
                    break;
                case 'select':
                case 'multiselect':
                case 'checkbox':
                case 'radio':

                    // Append Html
                    $($this.selector+'_tztype').html($(settings.htmlForm).find($this.selector+'_select').html());

                    // Call function to delete row
                    $($this.selector+'_select_option').find(settings.deleteRowIcon).die('click').live('click',function(e){
                        e.preventDefault();
                        var ok = confirm(settings.deleteText);
                        if(ok){
                            $(this).parents('.tz-control-group').remove();
                        }
                    });

                    // Call function click to add row
                    $($this.selector+'_select_add').click(function(e){
                        e.preventDefault();
                        // Add row data
                        var $row = $(settings.htmlForm).find($this.selector+'_select_option')
                            .find('.tz-control-group:last').find('input').val('').end();
                        $($this.selector+'_select_option').prepend(
                            $row
                        );
                    });
                    if(typeof $($this.selector+'_select_option').sortable() != 'undefined'){
                        $($this.selector+'_select_option').sortable({
                            handle  : settings.sortRowIcon,
                            start   : function(event,ui){
                                $("[data-toggle~=\'tooltip\'],.hasTooltip")
                                    .tooltip('hide').tooltip('disable');
                            },
                            stop    : function(event,ui){
                                $("[data-toggle~=\'tooltip\'],.hasTooltip").tooltip('enable');
                            }
                        });
                    }
                    break;
            }
        }

        $.loadHtml(settings.value);

        // Call function after append html
        settings.AfterHtmlAppend();

        $.tzExtraFieldsTypes    = function(){
            $($this.selector).bind('change',function(e,obj){
                e.preventDefault();

                $.loadHtml(obj.selected);

                // Call function after append html
                settings.AfterHtmlAppend();


                settings.AfterChange(obj.selected);

//                switch (obj.selected){
//                    default :
//                        $($this.selector+'_tztype').html($(settings.htmlForm).find($this.selector+'_'+obj.selected).html());
//                        break;
//                    case 'select':
//                    case 'multiselect':
//                    case 'checkbox':
//                    case 'radio':
//                        $($this.selector+'_tztype').html($(settings.htmlForm).find($this.selector+'_select').html());
//
//                        // Call function to delete row
//                        $($this.selector+'_select_option').find(settings.deleteRowIcon).live('click',function(){
//                            var ok = confirm(settings.deleteText);
//                            if(ok){
//                                $(this).parents('.tz-control-group').remove();
//                            }
//                        });
//
//                        // Call function click to add row
//                        $($this.selector+'_select_add').click(function(){
//                            // Add row data
//                            $($this.selector+'_select_option').prepend(
//                                    $(settings.htmlForm).find($this.selector+'_select_option')
//                                    .find('.tz-control-group:last')
//                                );
//                        });
//                        if(typeof $($this.selector+'_select_option').sortable() != 'undefined'){
//                            $($this.selector+'_select_option').sortable({
//                                handle: settings.sortRowIcon
//                            });
//                        }
//                        break;
//                }
            });
        }

        return $.tzExtraFieldsTypes();
    };

})(jQuery);
