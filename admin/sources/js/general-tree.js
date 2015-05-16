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
    $.jscontent_htmlTree   = function(el,options){
        var $el   = $(el),
            $var    = $.extend({},$.jscontent_htmlTree.defaults,options),
            $childCount   = 0;
        const NIL = -1;

        var tzparent  = {};
        var newElement  = $('<div></div>').clone();
        var $tree;

        function tzTree(node){
            var $node    = node;
            if(typeof node != 'object'){
                $node    = $(node);
            }

            $tree   = $('<div></div>').append(node.clone())
                .find('[data-model-id][data-element_type],[data-model-id][data-aria-control]');
            ReadTree($tree,tzparent);
            PreOrder(Root($tree,tzparent),$tree,tzparent,newElement);

            return newElement.html();
        }

        // Read Tree
        function ReadTree(Tree,tzparent){
            if(Tree.length){
                Tree.each(function(index){
                    if(index == 0){
                        tzparent[index]   = NIL;
                    }else{
                        tzparent[index]   = Tree.index($(Tree[index]).parents('[data-model-id][data-element_type],[data-model-id][data-aria-control]').first());
                    }
                });
            }
        }

        // Check empty tree
        function EmptyTree(Tree,tzparent)
        {
            return Tree.length == 0;
        }
        // Find parent's node on tree
        function Parent(Node,Tree,tzparent)
        {
            if (EmptyTree(Tree,tzparent) || ( Node > Tree.length-1)){
                return NIL;
            }
            return tzparent[Node];
        }
        // Find root node on tree
        function Root(Tree,tzparent)
        {
            if (!EmptyTree(Tree,tzparent))
                return 0;
            else
                return NIL;
        }
        // Find left children of node
        function LeftMostChild(Node,Tree,tzparent)
        {
            var i;
            var found;
            if (Node <0)
                return NIL;
            i=Node+1;
            found=0;
            while ((i<=Tree.length-1) && !found)
                if (tzparent[i]==Node)
                    found=1;
                else i=i+1;
            if (found)
                return i;
            else
                return NIL;
        }
        // Find right children of node
        function RightSibling(Node,Tree,tzparent)
        {
            var i,parent;
            var found;
            if (Node <0)
                return NIL;
            parent=tzparent[Node];
            i=Node+1;
            found=0;
            while ((i<=Tree.length-1) && !found)
                if (tzparent[i]==parent)
                    found=1;
                else i=i+1;
            if (found)
                return i;
            else
                return NIL;
        }
        // Browse Tree
        function PreOrder(Node,Tree,tzparent,newElement,childCount)
        {
            var i;
            createNewTree(Node,Tree,tzparent,newElement,childCount);
            i=LeftMostChild(Node,Tree,tzparent);

            //if(i == NIL) {
            //    createNewTree(i,Tree,tzparent,newElement,childCount);
            //}
            while (i!=NIL) {
                //createNewTree(i,Tree,tzparent,newElement,childCount);
                PreOrder(i,Tree,tzparent,newElement,childCount);
                i=RightSibling(i,Tree,tzparent);
            }
        }

        function createNewTree(Node,Tree,tzparent,newElement,childCount){

            if(Tree[Node]) {
                var $newHtml,
                    $count  = 0,
                    $element   = $(Tree[Node]),
                    $newElement,
                    $guid=guid();

                if($element.attr('data-element-item-count')){
                    $count  = parseInt($element.attr('data-element-item-count'));
                }
            //:not([data-aria-control=\\[modelid\\]\\[\\/modelid\\]])
                if(newElement.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').length){
                    $newElement = newElement.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]');
                }

                // Element
                if($element.attr('data-element_id')){
                    //console.log($el.attr('data-element_type'));
                    $newHtml    = $('#tmpl-jscontent-new-element-'+ $element.attr('data-element_id')).clone();

                    if($newHtml){

                        $newHtml    = $newHtml.html();
                        // Get value from form's html
                        var $data2   = $.jvcBuilder.mapper[$element.attr('data-model-id')];

                        // Set value from extrafield for element
                        $newHtml    = $var.jvcBuilder.setValueExtrafield($newHtml,$data2['params']);

                        $newHtml    = $($newHtml);

                        if($element.attr('data-element_type') === 'tz_row'){
                            if($element.hasClass('tz_row-inner')){
                                $newHtml.addClass('tz_row-inner');
                            }
                        }

                        if($element.attr('data-element_type') === 'tz_column'){
                            if($element.find('[data-model-id][data-element_type]').length){
                                $newHtml.removeClass('tz_empty-column');
                            }
                        }

                        $var.jvcBuilder.createDataModelIds($newHtml);

                        if(tzparent[Node] == -1) {
                            $.jvcBuilder.insert_mapper_item($newHtml,'',$var.parent_element_object,$data2);
                            newElement.append($newHtml[0]);
                        }else{
                            if($newElement && $newElement.eq(tzparent[Node]).find('> .element_wrapper').find('.tz_column_container,.tz_row_container').first().length) {
                                $.jvcBuilder.insert_mapper_item($newHtml,'',$newElement.eq(tzparent[Node]),$data2);

                                newElement.find('[data-model-id][data-aria-control],[data-model-id][data-element_type]').eq(tzparent[Node])
                                    .find('> .element_wrapper').find('.tz_column_container,.tz_row_container')
                                    .first()
                                    .removeClass('tz_empty-column').removeClass('tz_empty-container fancybox')
                                    .children(':not([data-model-id])').remove().end()
                                    .append($newHtml[0]);
                            }
                        }
                    }
                }
                else{
                    if($count){

                        var $data   = $.jvcBuilder.mapper[$element.attr('data-model-id')],
                            $id = $var.jvcBuilder.createId($element.parent().find('>[data-model-id]').length);

                        $count.each(function(cindex){
                            var $parent;

                            if(tzparent[Node] != -1 ){
                                $parent = $newElement.eq(tzparent[Node])

                            }else{
                                $parent = $var.parent_element_object;
                            }

                            //if(tzparent[Node] != -1){
                            $newHtml    = $('#template-jscontent-new-element-'+ $parent.attr('data-element_id') + '-item-' + cindex).clone();

                            $newHtml    = $newHtml.html();

                            if($newHtml){
                                // Set value from extrafield for element
                                $newHtml    = $var.jvcBuilder.setValueExtrafield($newHtml,$data['params']);


                                if(tzparent[Node] != -1 ) {
                                    if(cindex != ($count - 1)){
                                        $newHtml    = $newHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid + '-' + cindex);
                                    }else{
                                        $newHtml    = $newHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid);
                                    }
                                    // Set typeid (override [typeid][/typeid] to random string )
                                    $newHtml = $var.jvcBuilder.setIDHtml($newHtml, $element.parent().find('>[data-model-id]').length, $id,false,false,cindex);
                                }

                                $newHtml    = $($newHtml);

                                // Create new model id
                                $var.jvcBuilder.createDataModelIds($newHtml);

                                if(cindex != ($count -1)){
                                    if(tzparent[Node] != -1 ){
                                        if($newElement.eq(tzparent[Node])
                                                .find('[data-model-id][data-aria-control]')
                                                .first().attr('data-aria-control') == '[modelid][/modelid]') {
                                            $newElement.eq(tzparent[Node]).find('[aria-control=' + $newElement.eq(tzparent[Node])
                                                .find('[data-model-id][data-aria-control]')
                                                .first().attr('data-aria-control').replace(/(\[|\/|\])/g, '\\$1') + ']').parent().append($newHtml[0]);

                                            $newElement.eq(tzparent[Node]).find('[aria-control=\\[modelid\\]\\[\\/modelid\\]]').first().remove();
                                        }else {
                                            $newElement.eq(tzparent[Node]).find('[aria-control=' + $newElement.eq(tzparent[Node])
                                                .find('[data-model-id][data-aria-control]')
                                                .first().attr('data-aria-control').replace(/(\[|\/|\])/g, '\\$1') + '-' + cindex + ']').parent().append($newHtml[0]);
                                        }
                                    }
                                }else{
                                    if(tzparent[Node] != -1 ){
                                        $newElement.eq(tzparent[Node]).find('[data-model-id][data-aria-control]').first()
                                            .parents('[data-model-id]').first().parent().append($newHtml[0]);

                                        $.jvcBuilder.insert_mapper_item($newHtml.find('[data-model-id][data-aria-control]').first(),'',$newElement.eq(tzparent[Node]),$data);

                                        if($newElement.eq(tzparent[Node])
                                                .find('[data-model-id][data-aria-control]')
                                                .first().attr('data-aria-control') == '[modelid][/modelid]'){
                                            $newElement.eq(tzparent[Node])
                                                .find('[data-model-id][data-aria-control=\\[modelid\\]\\[\\/modelid\\]]')
                                                .first().parents('[data-model-id]').first().remove();
                                        }
                                    }else{
                                        //$.jvcBuilder.insert_mapper_item($newHtml.find('[data-model-id][data-aria-control]').first(),'',$var.parent_element_object,$data);
                                        newElement.append($newHtml[0]);
                                    }
                                }
                            }
                            //}
                            //else{
                            //
                            //}
                        });
                    }
                }
            }
        }

//        function createNewTree(Node,Tree,tzparent,newElement,childCount){
//            var $element    = $(Tree[Node]);
//            if(Node == -1){
//                $element    = $(Tree[0]);
//            }
//
//            var $data  = '';
//            if(Tree.length > 1){
//                if(Node != -1 && Tree[Node] && $element && $element.length){
//                    var $newHtml,
//                        $newChildElement,
//                        $id = $var.jvcBuilder.createId($element.parent().find('>[data-model-id]').length),
//                        $guid   = guid(),
//                        $count  = 0,
//                        $parent_object  = '';
//
//
//                    if($element.attr('data-element-item-count')){
//                        $count  = parseInt($element.attr('data-element-item-count'));
//                    }
//
//                    if(Node == 1){
//                        var $rootObject = $(Tree[0]);
//                        if($rootObject.attr('data-element_id')){
//                            $newHtml    = $('#tmpl-jscontent-new-element-'+ $rootObject.attr('data-element_id')).clone();
//                        }
//                        if($newHtml){
//                            $newHtml    = $newHtml.html();
//
//                            // Get value from form's html
////                            var $data2   = $var.jvcBuilder.getDataHidden('',$rootObject);
//                            var $data2   = $.jvcBuilder.mapper[$rootObject.attr('data-model-id')];
//
//                            console.log($data2);
//
//                            // Set value from extrafield for element
//                            $newHtml    = $var.jvcBuilder.setValueExtrafield($newHtml,$data2['params']);
//
//                            $newHtml    = $($newHtml);
//
//                            if($rootObject.attr('data-element_type') === 'tz_row'){
//                                if($rootObject.hasClass('tz_row-inner')){
//                                    $newHtml.addClass('tz_row-inner');
//                                }
//                            }
//
//                            $var.jvcBuilder.createDataModelIds($newHtml);
//
//                            $.jvcBuilder.insert_mapper_item($newHtml,'',$var.parent_element_object,$data2);
//
//                            newElement.append($newHtml[0]);
//                        }
//                    }
//
//
//                    //console.log('newEl='+newElement.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').length);
//                    if(newElement.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').length){
//                        $newChildElement    = newElement.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]');
//                    }
//
//                    // Get value from form's html
////                    $data   = $var.jvcBuilder.getDataHidden('',$element,true);
//                    $data   = $.jvcBuilder.mapper[$element.attr('data-model-id')];
//
//                    //console.log('e='+Node);
//                    //console.log('parent='+tzparent[Node]);
//                    //console.log($newChildElement);
//
//                    if($element.attr('data-element_id')){
//
//                        //if($element.attr('data-element_id') == 'column'){
//                        //    console.log($data);
//                        //}
//                        //console.log($.jvcBuilder.mapper[$element.attr('data-model-id')]);
//
//                        $newHtml    = $('#tmpl-jscontent-new-element-'+$element.attr('data-element_id')).clone();
//                        $newHtml    = $newHtml.html();
//
//                        // Set typeid (override [typeid][/typeid] to random string )
//                        $newHtml    = $var.jvcBuilder.setIDHtml($newHtml,$element.parent().find('>[data-model-id]').length,$id);
//
//                        // Set value from extrafield for element
//                        $newHtml    = $var.jvcBuilder.setValueExtrafield($newHtml,$data['params']);
//
//                        $newHtml    = $($newHtml);
//
//                        var $nodeParent;
//                        if($newChildElement){
//                            if($element.attr('data-element_type') === 'tz_row'){
//                                if($element.hasClass('tz_row-inner')){
//                                    $newHtml.addClass('tz_row-inner');
//                                }
//                            }
//                            if($newChildElement[tzparent[Node]]){
//                                $nodeParent = $($newChildElement[tzparent[Node]]);
//                                if($nodeParent.attr('data-element_type') && $nodeParent.attr('data-element_type') == 'tz_column'){
//                                    $nodeParent.removeClass('tz_empty-column');
//                                }
//                            }
//
//                            $var.jvcBuilder.createDataModelIds($newHtml);
//
//                            if($element.attr('data-element_id') == 'column'){
//                                console.log($newHtml);
//                            }
//
//                            $.jvcBuilder.insert_mapper_item($newHtml,'',$nodeParent,$data);
//
//                            if($newChildElement[tzparent[Node]]){
//                                $var.jvcBuilder.removeEmptyColumn($nodeParent);
//
//                                if($nodeParent.find('.element_wrapper').first()
//                                        .find('>.tz_column_container,>.tz_row_container').first().length){
//                                    $nodeParent.find('.element_wrapper').first()
//                                        .find('>.tz_column_container,>.tz_row_container').first().append($newHtml[0]);
//                                }else{
//                                    $nodeParent.find('.element_wrapper').first().append($newHtml[0]);
//                                }
//
//                            }
//                        }else{
//                            var $_newHtml   = $($newHtml[0]);
//                            $var.jvcBuilder.createDataModelIds($_newHtml);
//                            $.jvcBuilder.insert_mapper_item($_newHtml,'',$var.parent_element_object,$data);
//
//
//                            newElement.append($_newHtml);
//                        }
//
//                    }else{
//                        if($element.attr('data-element-item-count')){
//                            var $elementId  = $var.element_id;
//                            if($element.parents('[data-model-id][data-element_type]').first().data('element_id')){
//                                $elementId  = $element.parents('[data-model-id][data-element_type]').first().data('element_id');
//                            }
//
//                            $var.jvcBuilder.createDataModelIds($newHtml);
//
//                            if($count){
//                                $count.each(function(cindex){
//                                    $newHtml    = $('#template-jscontent-new-element-'+ $elementId + '-item-' + cindex).clone();
//                                    $newHtml    = $newHtml.html(),
//                                        $nodeParent;
//
//                                    var  $node_parent;
//                                    if($newChildElement[tzparent[Node]]){
//                                        $nodeParent = $($newChildElement[tzparent[Node]]);
//                                        if($nodeParent.attr('data-aria-control')){
//                                            $node_parent    = $nodeParent.parents('[data-model-id][data-element_type]').first();
//                                        }
//                                        if(!$node_parent){
//                                            $node_parent    = $nodeParent;
//                                        }
//                                    }
//
//                                    if($newHtml){
//                                        // Set typeid (override [typeid][/typeid] to random string )
//                                        $newHtml    = $var.jvcBuilder.setIDHtml($newHtml,$element.parent().find('>[data-model-id]').length,$id);
//
//                                        if(cindex != ($count - 1)){
//                                            $newHtml    = $newHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid + '-' + cindex);
//                                        }else{
//                                            $newHtml    = $newHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid);
//                                        }
////                                        console.log($data);
//
//                                        // Set value from extrafield for element
//                                        $newHtml    = $var.jvcBuilder.setValueExtrafield($newHtml,$data['params']);
//
//                                        if(cindex != ($count - 1)){
//
//                                            var $ariaControl    = '',
//                                                $first,
//                                                $firstParent;
//                                            if($nodeParent && $nodeParent
//                                                    .find('[data-model-id][data-aria-control]')
//                                                    .first().attr('data-aria-control')){
//                                                $ariaControl    = $nodeParent
//                                                    .find('[data-model-id][data-aria-control]')
//                                                    .first().attr('data-aria-control');
//                                            }
//                                            if(!$ariaControl){
//                                                if($nodeParent && $nodeParent.attr('data-aria-control')){
//                                                    $ariaControl    = $nodeParent.attr('data-aria-control');
//                                                }
//                                            }
//                                            if($ariaControl != '[modelid][/modelid]'){
//                                                $ariaControl    += '-'+cindex;
//                                            }else{
//                                                $ariaControl    = tzaddslashes($ariaControl);
//                                            }
//
//                                            if($node_parent && $node_parent.find('[aria-control=' + $ariaControl + ']')) {
//                                                $first = $node_parent.find('[aria-control=' + $ariaControl + ']');
//                                            }
//
//                                            if($first && $first.length){
////                                                $newHtml    = $($newHtml);
////                                                $nodeParent.parents('[data-model-id][data-element_type]').first()
////                                                    .find('[aria-control='+ $ariaControl +']').after($newHtml);
//                                                //$firstParent.append($newHtml);
//                                                $first.after($newHtml);
//
//                                                if($ariaControl == tzaddslashes('[modelid][/modelid]')){
//                                                    $first.remove();
//                                                }
//                                            }
//                                        }
//                                        else{
//                                            if($newHtml.match(/\[type\].*?\[\/type\]/gi)){
//                                                $newHtml = $newHtml.replace(/(\[type\].*?\[\/type\])/gi,$('#tmpl-column-add-new').html());
//                                            }
//
//                                            $newHtml    = $($newHtml);
//
//                                            $var.jvcBuilder.createDataModelIds($newHtml);
//
//                                            $.jvcBuilder.insert_mapper_item($newHtml.find('[data-model-id][data-aria-control],[data-model-id][data-element_type]').first(),'',$nodeParent,$data);
//                                            $var.jvcBuilder.removeEmptyColumn($newHtml);
//
//                                            if($nodeParent){
//                                                if($nodeParent.find('[data-model-id][data-aria-control]')
//                                                        .first().parents('[data-model-id]').first().length){
//                                                    $nodeParent.find('[data-model-id][data-aria-control]')
//                                                        .first().parents('[data-model-id]').first().parent().append($newHtml);
//                                                }else{
//                                                    //$nodeParent.find('[data-model-id]').first().parent().append($newHtml);
//                                                    $nodeParent.parent().after($newHtml);
//                                                    $($newChildElement[tzparent[Node]]).parent().after($newHtml);
//                                                }
//
//                                                if($nodeParent.find('[data-model-id][data-aria-control=\\[modelid\\]\\[\\/modelid\\]]')
//                                                        .first().parents('[data-model-id]').first().length){
//                                                    $nodeParent.find('[aria-control=\\[modelid\\]\\[\\/modelid\\]]').remove();
//                                                    $nodeParent.find('[data-model-id][data-aria-control=\\[modelid\\]\\[\\/modelid\\]]')
//                                                        .first().parents('[data-model-id]').first().remove();
//                                                }
//                                                else{
//                                                    if($nodeParent.attr('data-aria-control') == '[modelid][/modelid]'){
//                                                        $nodeParent.parent().remove();
//                                                    }
//                                                }
//                                            }
//                                        }
//                                    }
//                                });
//                            }
//                        }
//                    }
//                }
//            }else{
//                var $newHtml    = $('#tmpl-jscontent-new-element-'+$(Tree[0]).attr('data-element_id')).clone();
//
//                // Get value from form's html
////                $data   = $var.jvcBuilder.getDataHidden('',$element,true);
//                $data   = $.jvcBuilder.mapper[$element.attr('data-model-id')];
//
//                $newHtml    = $newHtml.html();
//
//                // Set value from extrafield for element
//                $newHtml    = $var.jvcBuilder.setValueExtrafield($newHtml,$data['params']);
//
//                $newHtml    = $($newHtml);
//
//                $.jvcBuilder.createDataModelIds($newHtml);
////                $.jvcBuilder.createInputNameHidden($newHtml,$var.parent_element_object,$data);
//                $.jvcBuilder.insert_mapper_item($newHtml,'',$var.parent_element_object,$data);
//
//                newElement.append($newHtml[0]);
//            }
//        }
        return tzTree($el);
    };
    $.jscontent_htmlTree.defaults ={
        element_id              : '',
        parent_element_object   : '',
        jvcBuilder         : {}
    };

    $.fn.jscontent_htmlTree    = function(options){
        if (options === undefined) options = {};
        if (typeof options === "object") {
            return $.jscontent_htmlTree(this,options);
        }
    };
})(jQuery);