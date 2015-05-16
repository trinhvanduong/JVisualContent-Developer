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

    // Choose extrafield plugin
    $.fn.tzTypeChooseExtraField = function(options){
        var $this   = this,
            $settings   = $.extend({
                'fieldListId'           : '#tz-extra-field',
                'draggableItem'         : '.tz-drag',
                'fieldChosenId'         : '#tz-shortcode-type',
                'inputHiddenName'       : 'jform[extrafields][]',
                'insideItem'            : '.tz-inside',
                'dataIdPrefix'          : 'tz-extrafield-drag-',
                'deleteText'            : 'Are you sure to delete this options?',

                // Draggable settings
                'dragzIndex'            : 100,
                'dragCursor'            : "move",
                'dragHandle'            : '.tz-title',
                'dragHelper'            : 'clone',
                'dragConnectToSortable' : false,

                // Sortable settings
                'sortItems'             : ".tz-drag:not(.placeholder)",
                'sortCursor'            : "move",
                'sortDistance'          : 2,
                'sortCancel'            : ".tz-delete",
                'sortPlaceholder'       : 'tz-placeholder',
                'sortDeactivate'        : function(event,ui){},
                'sortStop'              : function(event,ui){},

                // Droppable settings
                'dropTolerance'         : "pointer",
                'dropActiveClass'       : "tz-state-default",
                'dropHoverClass'        : "ui-state-hover",
                'dropAccept'            : ":not(.ui-sortable-helper)",
                'drop'                  : function(event,ui){}
            },options);

        var $extraField = $($settings.fieldListId),
            $shortType  = $($settings.fieldChosenId),
            $hidden     = $extraField.find('input[name="'+ $settings.inputHiddenName +'"]');

        if($shortType.find('input[name="'+ $settings.inputHiddenName +'"]').length){
            $extraField.find($hidden).remove();
        }

        //// Call function draggable
        //$($settings.fieldListId).find($settings.draggableItem).draggable({
        //    zIndex              : $settings.dragzIndex,
        //    cursor              : $settings.dragCursor,
        //    handle              : $settings.dragHandle,
        //    helper              : $settings.dragHelper,
        //    connectToSortable   : $settings.dragConnectToSortable
        //});
        //
        //// Call function sortable and droppable
        //$shortType.sortable({
        //    items       : $settings.sortItems,
        //    cursor      : $settings.sortCursor,
        //    distance    : $settings.sortDistance,
        //    cancel      : $settings.sortCancel,
        //    placeholder : $settings.sortPlaceholder,
        //    start       : function(event,ui){
        //        $("[data-toggle~=\'tooltip\'],[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
        //            .jvc_tooltip('hide').jvc_tooltip('disable');
        //    },
        //    deactivate  : function(event,ui){
        //        // Remove item dragging if have in extrafield was chosen
        //        if($(this).find($settings.draggableItem + '[data-id="'+ui.item.attr('data-id')+'"]').length > 1){
        //            ui.item.remove();
        //        }
        //
        //        $settings.sortDeactivate(event,ui);
        //    },
        //    stop        : function(event, ui){
        //        $( this ).removeClass( $settings.dropActiveClass);
        //        var inside  = ui.item.find($settings.insideItem);
        //
        //        // Hidden title, after display html have tz-inside class
        //        ui.item.find($settings.dragHandle).fadeOut(0,function(){
        //            ui.item.find($settings.insideItem).css('display','block');
        //        });
        //
        //        // Add hidden field to extrafield was chose
        //        if(!ui.item.find('input[name="'+ $settings.inputHiddenName +'"]').length){
        //            $hidden.clone().removeAttr('id').val(ui.item.attr('data-id').replace($settings.dataIdPrefix,''))
        //                .appendTo(ui.item).removeClass('invalid');
        //        }
        //
        //        if($extraField.find('input[name="'+ $settings.inputHiddenName +'"]').length){
        //            $extraField.find('input[name="'+ $settings.inputHiddenName +'"]').remove();
        //        }
        //
        //        if($extraField.hasClass('tz-invalid')){
        //            $extraField.removeClass('tz-invalid');
        //        }
        //        if($shortType.hasClass('tz-invalid')){
        //            $shortType.removeClass('tz-invalid');
        //        }
        //
        //        // Add class disabled to extrafield was chosen
        //        //$extraField.find($settings.draggableItem + '[data-id="'+ ui.item.attr('data-id') +'"]').addClass('jvc_disabled ');
        //
        //        // Create method click for delete icon
        //        ui.item.find($settings.sortCancel).die( "click" ).live('click',function(event){
        //            event.preventDefault();
        //            var ok = confirm($settings.deleteText);
        //            if(ok){
        //                //$extraField.find('[data-id="'+ui.item.attr('data-id')+'"]').removeClass('jvc_disabled ');
        //                $(this).parents('.tz-drag').remove();
        //                if(!$shortType.find('input[name="'+ $settings.inputHiddenName +'"]').length){
        //                    $hidden.val('').appendTo($extraField);
        //                }
        //            }
        //        });
        //
        //        $settings.sortStop(event,ui);
        //    }
        //}).droppable({
        //    tolerance   : $settings.dropTolerance,
        //    activeClass : $settings.dropActiveClass,
        //    hoverClass  : $settings.dropHoverClass,
        //    accept      : $settings.dropAccept,
        //    drop: function( event, ui ) {
        //
        //        $( this ).find( ".placeholder" ).remove();
        //
        //        $settings.drop(event,ui);
        //    }
        //});

        // Delete function
        function removeItem(){
            $shortType.find($settings.sortCancel).die('click').live('click',function(event){
                event.preventDefault();
                var ok = confirm($settings.deleteText);
                if(ok){
                    //$extraField.find('[data-id="'+ $(this).parent().parent().parent().parent().attr('data-id')+'"]').removeClass('jvc_disabled ');
                    $(this).parents('.tz-drag').remove();
                    if(!$shortType.find('input[name="'+ $settings.inputHiddenName +'"]').length){
                        $hidden.val('').appendTo($extraField);
                    }
                }
            });
        }

        removeItem();
    };


    // Process shortcode type is layout
    $.tzProcessLayout    = function(el,options){
        var $this   = $(el),
            settings  = $.extend({}, $.tzProcessLayout.defaults, options),
            $shortCodeItem  = $this.find(settings.strItem),
            $shortCodeRow  = $shortCodeItem.find(settings.strElementParent);
        settings.obj    = $this;

        $.tzProcessLayout.settings  = settings;

        var $rowidMax   = $shortCodeItem.find(settings.strElement).data('row-id'),
            $empty  = $this.find(settings.strToolbar).next().last(),
            $item   = $shortCodeItem.find(settings.strItem).clone(true);

        // Remove class active when modal hidden
        $(settings.strModal).on("hidden",function(){
            $(settings.strItem + ',' + settings.strElementParent).removeClass(settings.strActive.replace('.',''))
                .find(settings.strElement).removeClass(settings.strActive.replace('.',''));
        });

        // Remove class active when modal field hidden
        $(settings.strModalField).on("hidden",function(){
            $(settings.strItem).removeClass(settings.strActive.replace('.',''));
        });

        // Add item
        $shortCodeItem.undelegate(" >"+ settings.strToolbar + " .tz-add-item",'click')
            .delegate(" >"+ settings.strToolbar + " .tz-add-item",'click', function(){

            var $parent = $(this).parent().parent().parent();

            $parent.addClass(settings.strActive.replace('.',''));
            var $innerActive =$(settings.strItem + settings.strActive).parents(settings.strInner).eq(0),
                $index = $innerActive.find(settings.strItem + settings.strActive).parent().eq(0)
                    .find('>'+settings.strItem).index($innerActive.find(settings.strItem + settings.strActive));

            $parent.after($parent.parent().find(">"+settings.strItemHidden).clone(true)
                .wrap('<div></div>').parent()
                .html().replace(settings.strItemHidden.replace('.',''),'')
                .replace(/\{|\}/gi,''));

            if($(settings.strLoopItems).length){
                $(settings.strLoopItems).each(function(index,value){
                    if($innerActive.find(value+settings.strLoopItemHidden).length){

                        $($innerActive.find(value)[$index]).after($(value+settings.strLoopItemHidden).clone(true)
                            .wrap('<div></div>').parent()
                            .html().replace(settings.strLoopItemHidden.replace('.',''),'')
                            .replace(/\{|\}/gi,''));
                    }
                });
            }

            $parent.removeClass(settings.strActive.replace('.',''));

            new $.tzProcessLayout($this,settings);

        });

        // Edit item click to show modal
        $shortCodeItem.undelegate(" >"+ settings.strToolbar + " .tz-edit-item",'click')
            .delegate(" >"+ settings.strToolbar + " .tz-edit-item",'click', function(){
            var $parent = $(this).parent().parent().parent();

            $parent.addClass(settings.strActive.replace('.',''));
            $(settings.strModalField).find('#tz-form-field').html($(this).parent().parent().find('> .tz-form-hidden').clone(true).html());

        });
        $this.delegate(settings.strInner + " >"+ settings.strToolbar + " .tz-edit-item",'click', function(){
            var $parent = $(this).parent().parent().parent();

            $parent.addClass(settings.strActive.replace('.',''));
            $(settings.strModalField).find('#tz-form-field').html($(this).parent().parent().find('> .tz-form-hidden').clone(true).html());

        });
        // Edit item (add data from modal)
        $this.undelegate(settings.strModalField+" .tz-add-value",'click')
            .delegate(settings.strModalField+" .tz-add-value",'click',function(){
            var $data    = $(settings.strModalField).find('#tz-form-field').serializeArray().reduce(function(obj, item) {
                if(item.name.match(/\[\]/i)){
                    if(obj[item.name.replace(/\[\]/i,'')]){
					   obj[item.name.replace(/\[\]/i,'')] += " " + item.value;
                    }else{                        
					   obj[item.name.replace(/\[\]/i,'')] = item.value;
                    }
                }else{
					obj[item.name] = item.value;
                }
					
				return obj;
            }, {});
            var $innerActive =$(settings.strItem + settings.strActive).parents(settings.strInner).eq(0),
                $index = $innerActive.find(settings.strItem + settings.strActive).parent().eq(0)
                    .find('>'+settings.strItem).index($innerActive.find(settings.strItem + settings.strActive)),
                $itemHidden = $(settings.strItem + settings.strActive).parent().find('>'+settings.strItemHidden);

            if($(settings.strLoopItems).length){
                $(settings.strLoopItems).each(function(index,value){
                    if($innerActive.find(value).length){
                        var $hidden = $innerActive.find(value).eq($index).parent().eq(0)
                            .find('>'+value+settings.strLoopItemHidden).clone(true);

                        if($hidden && $hidden.length){
                            var $html  = $hidden[0].outerHTML.replace(settings.strLoopItemHidden.replace('.',''),''),
                                $match  = $html.match(/(\{.*?\})/gi);

                            if($match && $match.length > 1 && $data){
                                $match.each(function(fieldname,key){
                                 var $_fieldname	= fieldname.replace(/\{|\}/gi,'');
                                    if($data[$_fieldname]){
                                        $html  = $html.replace(fieldname.trim(),$data[$_fieldname]);
                                    }else{
                                        $html  = $html.replace(fieldname.trim(),'');
                                    }
                                });

                                $innerActive.find(value).eq($index).after($html).remove();

                            }
                        }
                    }
                });
            }else{
                var $hidden   = $(settings.strItem + settings.strActive).parent()
                    .find(settings.strItem + settings.strItemHidden);
                var $html  = $hidden.clone(true).html(),
                    $match  = $html.match(/(\{)(.*?)(\})/i);

                if($match && $match.length > 0 && $data){
                    $($(settings.strItem)[$index]).html($html.replace(/\{.*?\}/i,$data[$match[2]]));
                }
            }
                
            if($itemHidden && $itemHidden.length){
                var $itemHiddenClone    = $itemHidden.clone(true).wrap('<div></div>').parent(),
                $itemHtml  = $itemHiddenClone.html().replace(settings.strItemHidden.replace('.',''),''),
                    $matchItem  = $itemHtml.match(/(\{.*?\})/gi);
                if($matchItem && $matchItem.length > 0 && $data){
					$matchItem.each(function(fieldname,key){
					   var $_fieldname	= fieldname.replace(/\{|\}/gi,'');

                        if($data[$_fieldname]){
                            //$(settings.strItem + settings.strActive).html($html.replace(/\{.*?\}/i,$data[$match[2]]));
                            $itemHiddenClone.html($itemHiddenClone.html()
                                .replace(settings.strItemHidden.replace('.',''),'')
                                .replace(fieldname.trim(),$data[$_fieldname]));
                        }else{
                            $itemHiddenClone.html($itemHiddenClone.html()
                                .replace(settings.strItemHidden.replace('.',''),'')
                                .replace(fieldname.trim(),''));
                        }
                    });

                    if($(settings.strItem + settings.strActive)
                        .find(">"+settings.strElement).length){
                        $(settings.strItem + settings.strActive)
                            .find(">"+settings.strElement).each(function(){
                                if(!$(this).find(">"+settings.strEmpty).length){
                                    if($itemHiddenClone.find(">"+settings.strItem)
                                        .find(">"+settings.strElement).find(">"+settings.strEmpty).length){
                                        $itemHiddenClone.find(">"+settings.strItem)
                                            .find(">"+settings.strElement).remove();
                                    }
                                    $itemHiddenClone.find(">"+settings.strItem).append($(this));
                                }
                            });
                    }

                    $(settings.strItem + settings.strActive)
                        .after($itemHiddenClone.html()).remove();
                }
            }
            new $.tzProcessLayout($this,settings);
            // Hide modal
            $(settings.strModalField).modal('hide');
        });

        // Duplicate item
        $shortCodeItem.undelegate('>' + settings.strToolbar + ' .tz-clone-item','click')
            .delegate('>' + settings.strToolbar + ' .tz-clone-item','click',function(){
            var $parent = $(this).parent().parent().parent(),
                $innerActive  = $parent.parents(settings.strInner).eq(0),
                $index = $innerActive.find($parent).parent().eq(0)
                    .find('>'+settings.strItem).index($innerActive.find($parent));
                $parent.after($parent.clone(true));

                if($(settings.strLoopItems).length){
                    $(settings.strLoopItems).each(function(index,value){
                        if($innerActive.find(value).length){
                            $innerActive.find(value).eq($index).after($innerActive.find(value).eq($index).clone(true));
                        }
                    });
                }else{
                    $(settings.strItem).eq($index).after($(settings.strItem).eq($index));
                }

        });

        // Delete item
        $shortCodeItem.undelegate(">"+ settings.strToolbar + " .tz-delete-item",'click')
            .delegate(">"+ settings.strToolbar + " .tz-delete-item",'click', function(){
            // Get row count
            var elCount    = $(this).parent().parent().parent().parent().find(">" + settings.strItem+":not("
                +settings.strItemHidden+")").length;

            if(elCount > 1){
                if($(settings.strLoopItems).length){
                    var $innerActive =$(this).parents(settings.strInner).eq(0),
                        $index = $innerActive.find($(this).parent().parent().parent()).parent().eq(0)
                            .find('>'+settings.strItem).index($innerActive.find($(this).parent().parent().parent()));

                    $(settings.strLoopItems).each(function(index,value){
                        $innerActive.find(value).eq($index).remove();
                    });
                }else{
                    var $index  = $(settings.strItem).index($(this).parent().parent().parent());
                    $($($(settings.strLoopItem)[$index])).remove();
                }

                $(this).parent().parent().parent().remove();
            }

            return false;
        });

        // Add row (add element)
        if(settings.addRow){
//            $shortCodeItem.undelegate(settings.strElement +" >"+settings.strEmpty,'click')
//                .delegate(settings.strElement +" >"+settings.strEmpty,'click', function(){
//
//                $(this).parent().addClass(settings.strActive.replace('.',''))
//                    .parent().addClass(settings.strActive.replace('.',''));
//
//                var $empty  = $(this);
//                $(settings.strModal).find(".modal-body iframe").attr("src", function( arr,value ) {
//                    if($empty.attr('data-row-id')){
//                        if(value.match(/\&row_id\=([0-9]+)\&?/i)){
//                            var re = /(.*?\&row_id=)([0-9]+)(\&?)/i;
//                            return value.replace(re,'$1'+$empty.data('row-id')+'$3')
//                        }else{
//                            return value + '&row_id=' + $empty.data('row-id');
//                        }
//                    }
//                }).one('load',function(){
//                    $(settings.strModal).modal('show');
//                });
//            });

            $shortCodeItem.undelegate(settings.strEmpty,'click')
                .delegate(settings.strEmpty,'click', function(){

                $(this).parent().addClass(settings.strActive.replace('.',''));

                var $empty  = $(this);
                $(settings.strModal).find(".modal-body iframe").attr("src", function( arr,value ) {
                    if($empty.attr('data-row-id')){
                        if(value.match(/\&row_id\=([0-9]+)\&?/i)){
                            var re = /(.*?\&row_id=)([0-9]+)(\&?)/i;
                            return value.replace(re,'$1'+$empty.data('row-id')+'$3')
                        }else{
                            return value + '&row_id=' + $empty.data('row-id');
                        }
                    }
                }).one('load',function(){
                    $(settings.strModal).modal('show');
                });
            });

            $shortCodeItem.undelegate(">"+ settings.strToolbar +" .tz-add-element",'click')
                .delegate(">"+ settings.strToolbar +" .tz-add-element",'click', function(){

                $(this).parent().addClass(settings.strActive.replace('.',''))
                    .parent().addClass(settings.strActive.replace('.',''));

                var $empty  = $(this);
                $(settings.strModal).find(".modal-body iframe").attr("src", function( arr,value ) {
                    if($empty.attr('data-row-id')){
                        if(value.match(/\&row_id\=([0-9]+)\&?/i)){
                            var re = /(.*?\&row_id=)([0-9]+)(\&?)/i;
                            return value.replace(re,'$1'+$empty.data('row-id')+'$3')
                        }else{
                            return value + '&row_id=' + $empty.data('row-id');
                        }
                    }
                }).one('load',function(){
                    $(settings.strModal).modal('show');
                });
            });


            // Add Click function
            $shortCodeItem.undelegate(settings.strElement + " "+ settings.strToolbar + " .tz-add-row",'click')
                .delegate(settings.strElement + " "+ settings.strToolbar + " .tz-add-row",'click', function(){
                var $parent   = $(this).parent().parent().parent();
                $.get(settings.root + settings.path + '/layout_element_row.php?time='+$.now(), function($row){
                    $rowidMax ++;
                    $($row).attr('data-row-id',$rowidMax)
                        .find(settings.strEmpty).attr('data-row-id',$rowidMax)
                        .end().insertAfter($parent).slideDown('slow');
                    $.tzRowSortable();
                });
                return false;
            });

        }

        // Duplicate row
        $shortCodeItem.undelegate(settings.strElement +  " >" + settings.strToolbar + " .tz-duplicate-row",'click')
            .delegate(settings.strElement +  " >" + settings.strToolbar + " .tz-duplicate-row",'click', function(){
                var $parent   = $(this).parent().parent().parent();
                $rowidMax++;
                $parent.after($parent.clone(true).attr('data-row-id',$rowidMax));
        });

        // Delete row
        $shortCodeItem.undelegate(settings.strElement +  " >" + settings.strToolbar + " .tz-delete-row",'click')
            .delegate(settings.strElement +  " >" + settings.strToolbar + " .tz-delete-row",'click', function(){
            // Get row count
            var elCount    = $(this).parent().parent().parent().parent().find(">" + settings.strElement).length;
            if(elCount > 1){
                $(this).parent().parent().parent().remove();
            }else{
                var toolbar = $(this).parent().parent(settings.strToolbar);
                $(this).parent().parent().parent().children().remove(':not('+settings.strToolbar+')').end().append($empty.clone(true));
            }

            return false;
        });

        $.tzItemSortable();
        $.tzRowSortable();
    };
    $.tzProcessLayout.defaults   = {
        strItemParent       : '.tz-shortcode-item-outer',
        strItem             : '.tz-shortcode-item',
        strInner            : '.tz-shortcode-inner',
        strItemHidden       : '.tz-shortcode-item-hidden',
        strElementParent    : '.tz-loop',
        strElement          : '.tz-element',
        strModal            : '#tzCollapseModal',
        strModalField       : '#tzCollapseModalField',
        strToolbar          : '.btn-toolbar',
        strEmpty            : '.tz-empty',
        strActive           : '.tz-active',
        strLoopItems        : [],
        strLoopItem         : '.tz-loop-item',
        strLoopItemHidden   : '.tz-loop-item-hidden',
        strDisplayBlock     : '.tz-display-block',
        moveRow             : true,
        addRow              : true,
        root                : '',
        path                : '/administrator/components/com_jvisualcontent/views/type/tmpl'
    };
    $.tzProcessLayout.settings  = $.tzProcessLayout.defaults;

    // Move row (sort row)
    $.tzRowSortable = function(){
        $($.tzProcessLayout.settings.strElement).parent().sortable({
            axis: "x,y",
            handle: '.move-row',
            items: '>'+$.tzProcessLayout.settings.strElement,
            tolerance: "pointer",
            placeholder: "tz-placeholder tz-placeholder-warning"
        }).disableSelection();
    };

    // Move row (sort row)
    $.tzItemSortable    = function(){
        var $count  = 0;
        $($.tzProcessLayout.settings.strItem).parent().sortable({
            axis: "x,y",
            handle: '.tz-move-item',
            items: ">"+$.tzProcessLayout.settings.strItem,
            tolerance: "pointer",
            placeholder: "tz-placeholder-item tz-placeholder-warning",
            start: function(event,ui){
                var $innerActive =$(ui.item).parents($.tzProcessLayout.settings.strInner).eq(0),
                    $index = $innerActive.find(ui.item).parent().eq(0)
                        .find('>'+$.tzProcessLayout.settings.strItem).index(ui.item);

                $count = $($.tzProcessLayout.settings.strItem).index(ui.item);
                $(this).find(">"+ $.tzProcessLayout.settings.strItem+":not("
                        +$.tzProcessLayout.settings.strItemHidden+")")
                    .addClass($.tzProcessLayout.settings.strDisplayBlock.replace('.',''));
                $(this).sortable( "refresh" );
            },
            stop: function(event,ui){
                var $innerActive =$(ui.item).parents($.tzProcessLayout.settings.strInner).eq(0),
                    $index = $innerActive.find(ui.item).parent().eq(0)
                        .find('>'+$.tzProcessLayout.settings.strItem).index(ui.item);

                if($($.tzProcessLayout.settings.strLoopItems).length){
                    $($.tzProcessLayout.settings.strLoopItems).each(function(index,value){
                        $innerActive.find(value).eq($index).after($(value).eq($count));
                    });
                }else{
                    $($.tzProcessLayout.settings.strLoopItem).eq($index).after($($.tzProcessLayout.settings.strLoopItem).eq($count));
                }
                $(this).find(">"+ $.tzProcessLayout.settings.strItem+":not("
                        +$.tzProcessLayout.settings.strItemHidden+")")
                    .removeClass($.tzProcessLayout.settings.strDisplayBlock.replace('.',''));
                $(this).sortable( "refresh" );
            }
        }).disableSelection();
    };

    // Add html to row
    $.tzAddHtmlToRow    = function(html){
        $($.tzProcessLayout.settings.strElement+ $.tzProcessLayout.settings.strActive)
            .find(" >"+ $.tzProcessLayout.settings.strEmpty)
            .after($(html)).remove()
            .end().removeClass($.tzProcessLayout.settings.strActive.replace('.',''))
            .parent().removeClass($.tzProcessLayout.settings.strActive.replace('.',''));

//        $($.tzProcessLayout.settings.strItem + $.tzProcessLayout.settings.strActive)
//            .append(html)
//            .find($.tzProcessLayout.settings.strEmpty).remove()
//            .end().removeClass($.tzProcessLayout.settings.strActive.replace('.',''))
//            .parent().removeClass($.tzProcessLayout.settings.strActive.replace('.',''));
        $($.tzProcessLayout.settings.strModal).modal('hide');

        new $.tzProcessLayout($.tzProcessLayout.settings.obj, $.tzProcessLayout.settings);

    };

    $.fn.tzProcessLayout    = function(options){
        if (options === undefined) options = {};
        if (typeof options === "object") {
            return new $.tzProcessLayout(this,options);
        }
    }


})(jQuery);


