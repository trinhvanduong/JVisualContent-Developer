/*------------------------------------------------------------------------

 # JVisualContent Extension

 # ------------------------------------------------------------------------

 # author    DuongTVTemPlaza

 # copyright Copyright (C) 2012 templaza.com. All Rights Reserved.

 # @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL

 # Websites: http://www.templaza.com

 # Technical Support:  Forum - http://templaza.com/Forum

 -------------------------------------------------------------------------*/

(function($){
    $(document).ready(function(){
        var $jscontent_options  = $('.jscontent_options'),
            $jscontent_sc_toolbar   = $('.jscontent_shortcode-toolbar');
        $jscontent_sc_toolbar.undelegate('.tz_panel-btn-close','click')
            .delegate('.tz_panel-btn-close','click',function(){
                window.parent.jQuery.fancybox.close();
            });

        // Simplify control change
        $jscontent_options.undelegate('#tz_edit-form-column-tabs .tz_simplify, #tz_edit-form-row-tabs .tz_simplify','change')
            .delegate('#tz_edit-form-column-tabs .tz_simplify, #tz_edit-form-row-tabs .tz_simplify','change',function(e){
                $jscontent_options.find('.tz_css-editor').removeClass('tz_simplified');
                if($(this).attr('checked')){
                    $jscontent_options.find('.tz_css-editor').addClass('tz_simplified');
                }else{
                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=margin-right]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());
                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=margin-bottom]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());
                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=margin-left]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());

                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=padding-right]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());
                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=padding-bottom]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());
                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=padding-left]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());

                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=border-right-width]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val());
                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=border-bottom-width]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val());
                    $jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=border-left-width]').val($jscontent_options.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val());
                }
            });
        $jscontent_options.undelegate('#tz_edit-form-column-tabs [data-name=padding-top],' +
        ' #tz_edit-form-row-tabs  [data-name=padding-top]','change')
            .delegate('#tz_edit-form-column-tabs [data-name=padding-top],' +
            '#tz_edit-form-row-tabs  [data-name=padding-top]','change',function(e){
                var $simplify   = $('#tz_edit-form-column-tabs .tz_simplify, #tz_edit-form-row-tabs .tz_simplify');
                if($simplify.attr('checked')){
                    $('#tz_edit-form-column-tabs [data-name=padding-right],' +
                    ' #tz_edit-form-column-tabs  [data-name=padding-bottom]'
                    +' #tz_edit-form-column-tabs  [data-name=padding-left],'
                    +'#tz_edit-form-row-tabs [data-name=padding-right],' +
                    ' #tz_edit-form-row-tabs  [data-name=padding-bottom],'
                    +'#tz_edit-form-row-tabs  [data-name=padding-left]').val($(this).val());
                }
            });
        $jscontent_options.undelegate('#tz_edit-form-column-tabs [data-name=margin-top],' +
        ' #tz_edit-form-row-tabs  [data-name=margin-top]','change')
            .delegate('#tz_edit-form-column-tabs [data-name=margin-top],' +
            '#tz_edit-form-row-tabs  [data-name=margin-top]','change',function(e){
                var $simplify   = $('#tz_edit-form-column-tabs .tz_simplify, #tz_edit-form-row-tabs .tz_simplify');
                if($simplify.attr('checked')){
                    $('#tz_edit-form-column-tabs [data-name=margin-right],' +
                    ' #tz_edit-form-column-tabs  [data-name=margin-bottom]'
                    +' #tz_edit-form-column-tabs  [data-name=margin-left],'
                    +'#tz_edit-form-row-tabs [data-name=margin-right],' +
                    ' #tz_edit-form-row-tabs  [data-name=margin-bottom],'
                    +'#tz_edit-form-row-tabs  [data-name=margin-left]').val($(this).val());
                }
            });
        $jscontent_options.undelegate('#tz_edit-form-column-tabs [data-name=border-top-width],' +
        ' #tz_edit-form-row-tabs  [data-name=border-top-width]','change')
            .delegate('#tz_edit-form-column-tabs [data-name=border-top-width],' +
            '#tz_edit-form-row-tabs  [data-name=border-top-width]','change',function(e){
                var $simplify   = $('#tz_edit-form-column-tabs .tz_simplify, #tz_edit-form-row-tabs .tz_simplify');
                if($simplify.attr('checked')){
                    $('#tz_edit-form-column-tabs [data-name=border-right-width],' +
                    ' #tz_edit-form-column-tabs  [data-name=border-bottom-width]'
                    +' #tz_edit-form-column-tabs  [data-name=border-left-width],'
                    +'#tz_edit-form-row-tabs [data-name=border-right-width],' +
                    ' #tz_edit-form-row-tabs  [data-name=border-bottom-width],'
                    +'#tz_edit-form-row-tabs  [data-name=border-left-width]').val($(this).val());
                }
            });
    });
})(jQuery);