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
    // Fix incompatibilities between BootStrap and Prototype
    var jvc_bootstrap3_conflict   = function(){
        var jvc_disablePrototypeJS = function (method, pluginsToDisable) {
                var handler = function (event) {
                    event.target[method] = undefined;
                    setTimeout(function () {
                        delete event.target[method];
                    }, 0);
                };
                if(pluginsToDisable && typeof pluginsToDisable == 'object') {
                    $.each(pluginsToDisable,function (index,plugin) {
                        $(window).on(method + '.bs.' + plugin, handler);
                    });
                }
            },
            //jscontent_pluginsToDisable = ['tooltip'];
            jvc_pluginsToDisable = ['jvc_collapse', 'jvc_dropdown', 'jvc_modal', 'jvc_tooltip', 'jvc_tab', 'jvc_popover'];
        jvc_disablePrototypeJS('show', jvc_pluginsToDisable);
        jvc_disablePrototypeJS('hide', jvc_pluginsToDisable);
    };
    jvc_bootstrap3_conflict();
})(jQuery);