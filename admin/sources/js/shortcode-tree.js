/*------------------------------------------------------------------------

 # JVisualContent Extension

 # ------------------------------------------------------------------------

 # author    DuongTVTemPlaza

 # copyright Copyright (C) 2012 templaza.com. All Rights Reserved.

 # @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL

 # Websites: http://www.templaza.com

 # Technical Support:  Forum - http://templaza.com/Forum

 -------------------------------------------------------------------------*/

;(function($){
    $.jscontent_shortcode_tree   = function(tree,url_root){

        const NIL       = -1;
        var $tzparent    = {},
            $newElement  = {},
            $_newElement = {},
            $shortcode  = '',
            $tree       = {},
            $url_root   = url_root;

        function array_keys(tree){
            var $keys   = {};
            if(tree){
                var $i = 0;
                $.each(tree,function(key,value){
                    $keys[$i]   = key;
                    $i++;
                });
            }
            return $keys;
        }

        function array_search(needle,haystack){
            if(needle && haystack){
                var $key = false;
                $.each(haystack,function(key,value){
                    if(needle == value){
                        $key    = key;
                        return false;
                    }
                });
                return $key;
            }
        }

        function count(array){
            if(array){
                var $i = 0;
                $.each(array,function(){
                    $i++;
                });
                return $i;
            }
        }

        function prepare_attr(params){
            if(params && count(params)){
                var $_params            = {},
                    $n_unix;
                $.extend(true,$_params,params);
                var $default_css_class  = ['background_image','background_color','background_style',
                    'border_top_width','border_bottom_width','border_right_width','border_left_width','border_color'
                    ,'border_style','margin_top','margin_bottom','margin_right','margin_left','padding_top','padding_bottom'
                    ,'padding_right','padding_left'];
                var $default_el_class  = ['el_class','col_lg_offset','col_md_offset','col_sm_offset','col_xs_offset'
                    ,'col_lg_size','col_md_size','col_xs_size','hidden_lg','hidden_md','hidden_sm','hidden_xs'];

                var $params = {};
                $.map($_params,function($param,$key){
                    var $_param = $param;

                    $_param['prepare_params']   = {};
                    $_param['docs']             = {};
                    $_param['docs']['css']      = {};

                    if($param['element_id'] == 'row' || $param['element_id'] == 'column'){
                        var $css_class  = '';
                        var $el_class   = '';

                        if($param['params'] && count($param['params'])){
                            $.each($param['params'],function($name,$value){
                                if($.inArray($name,$default_css_class) != -1 || $.inArray($name,$default_el_class) != -1){
                                    if($value){
                                        if($name == 'background_image'){
                                            var $url        = $value;
                                            if(!$url.match('/http/m')){
                                                $url    = $url_root + $value;
                                            }
                                            $css_class  += $name.replace('_', '-') + ': url(' + $url + '); ';
                                        }else{
                                            if($name == 'background_style') {
                                                if($value == 'cover' || $value == 'contain'){
                                                    $css_class += 'background-size: ' + $value + '; ';
                                                }else{
                                                    if($value == 'repeat' || $value == 'no-repeat') {
                                                        $css_class += 'background-repeat: ' + $value + '; ';
                                                    }
                                                }
                                            }else{
                                                $css_class  += $name.replace('_', '-') + ': ' + $value + '; ';
                                            }
                                        }
                                    }
                                    if($.inArray($name,$default_el_class) != -1){
                                        $el_class += $value+' ';
                                    }
                                }
                                else{
                                    //if($param['element_id'] == 'column' && $name == 'width') {
                                    //    $_param['prepare_params'][$name] = 'col-sm-'+(eval($value) * 12);
                                    //}else{
                                    $_param['prepare_params'][$name] = $value;
                                    //}
                                }
                            });
                        }

                        if($css_class.trim().length){
                            var $date   = new Date(),
                                $unix   = $date.getTime();

                            while($unix == $n_unix){
                                var $date2   = new Date();
                                $unix   = $date2.getTime();
                            }

                            $n_unix = $unix;

                            $_param['prepare_params']['css_class']   = '.tz_custom_css_'+$unix+'{'+$css_class.trim()+'}';
                            $_param['docs']['css']                   = '.tz_custom_css_'+$unix+'{'+$css_class.trim()+'}';
                        }else{
                            $_param['prepare_params']['css_class']   = '';
                        }

                        $_param['prepare_params']['el_class']   = $el_class.trim();
                    }else{
                        $_param['prepare_params']    = $param['params'];
                    }
                    if($_param['prepare_params'] && typeof $_param['prepare_params'] == 'object' && count($_param['prepare_params'])) {
                        var $attr   = '',
                            $editor = '';
                        $.each($_param['prepare_params'],function($name,$value){
                            if($name){
                                if($name != 'editor'){
                                    if($value && typeof $value == 'object'){
                                        $attr   += ' '+$name+'="'+htmlEntities($value.join(' ')).replace(/\"/mg,'&quot;')+'"';
                                    }else{
                                        $attr   += ' '+$name+'="'+htmlEntities($value).replace(/\"/mg,'&quot;')+'"';
                                    }
                                }else{
                                    $editor = stripslashes(html_entity_decode($value.replace(/&nbsp;/mg,'').trim()));
                                }
                            }
                        });
                        if($_param['shortcode'].match(/(\[\w+)(.*?)(\])(.*?)(\[\/\w+\])/m)){
                            //$_param['shortcode'] = $_param['shortcode'].replace(/([\[|\{]\w+)(.*?)([\]|\}].*?[\[|\{]\/\w+[\]|\}])/m,'$1 '+$attr+'$3');
                            $_param['shortcode'] = $_param['shortcode'].replace(/(\[\w+)(.*?)(\])(.*?)(\[\/\w+\])/m,'$1'
                            +$attr+'$3'+$editor+'$5');
                        }
                        if($_param['shortcode'].match(/(\{tz_element)(.*?)(\})(.*?)(\{\/tz_element\})/m)){
                            //$_param['shortcode'] = $_param['shortcode'].replace(/([\[|\{]\w+)(.*?)([\]|\}].*?[\[|\{]\/\w+[\]|\}])/m,'$1 '+$attr+'$3');
                            $_param['shortcode'] = $_param['shortcode'].replace(/(\{tz_element)(.*?)(\})(.*?)(\{\/tz_element\})/m,'$1'
                            +$attr+'$3'+$editor+'$5');
                        }
                    }
                    $params[$key]   = $_param;
                    //return $_param;
                });
                return $_params;
            }
            return params;
        }

        function change_keys_tree(){
            var $_tree  = {};
            var $_keys  = {};
            if($tree){
                $tree = prepare_attr($tree);
                $_keys  = array_keys($tree);

                var $i = 1;
                $.each($tree,function(key,item){
                    var $_item  = $.extend({},item);
                    var $key    = array_search(item['parent_id'],$_keys);
                    if($key && $.isNumeric($key)){
                        $_item['parent_id'] = parseInt($key) + 1;
                        $tzparent[$i] = parseInt($key) + 1;
                    }else{
                        $_item['parent_id'] = NIL + 1;
                        $tzparent[$i] = NIL + 1;
                    }
                    $_tree[$i]  = $_item;
                    $i++;
                });

                if($_tree){
                    $_tree[0]   = {'parent_id' : -1,'shortcode' : ''};
                    $tzparent[0] = NIL;
                    $tree = $_tree;
                }
            }
        }

        // Check empty tree
        function EmptyTree(Tree,tzparent)
        {
            return count(Tree) == 0;
        }
        // Find parent's node on tree
        function Parent(Node,Tree,tzparent)
        {
            if (EmptyTree(Tree,tzparent) || ( Node > count(Tree)-1)){
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
            while ((i<=count(Tree)-1) && !found)
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
            while ((i<=count(Tree)-1) && !found)
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
            i=LeftMostChild(Node,Tree,tzparent);

            while (i!=NIL) {
                PreOrder(i,Tree,tzparent,newElement,childCount);
                i=RightSibling(i,Tree,tzparent);
            }
        }
        // Post Tree
        function postOrder(Node,Tree,tzparent)
        {
            var i;
            i=LeftMostChild(Node,Tree,tzparent);

            while (i!=NIL) {
                postOrder(i,Tree,tzparent);
                i=RightSibling(i,Tree,tzparent);
            }
            // Do some thing
            if($.isNumeric(tzparent[Node]) && tzparent[Node] != -1){

                if($_newElement && !$_newElement[tzparent[Node]]) {
                    $_newElement[tzparent[Node]] = Tree[tzparent[Node]]['shortcode'];
                }
                if($_newElement && $_newElement[tzparent[Node]]){
                    if($_newElement[tzparent[Node]].match(/\[\/\w+\]$|\{\/\w+\}$/m)){
                        if($_newElement[Node]) {
                            $_newElement[tzparent[Node]] = $_newElement[tzparent[Node]].replace(/(\[\/\w+\]$|\{\/\w+\}$)/m,$_newElement[Node]+'$1');
                        }
                        else{
                            if(Tree[Node]){
                                $_newElement[tzparent[Node]] = $_newElement[tzparent[Node]].replace(/(\[\/\w+\]$|\{\/\w+\}$)/m,Tree[Node]['shortcode']+'$1');
                            }
                        }
                    }
                }
                if(tzparent[Node] == 0){
                    if(Tree[Node]['element_id'] == 'readmore'){
                        $shortcode += Tree[Node]['shortcode'];
                        return false;
                    }else{
                        if($_newElement[Node]) {
                            $shortcode += $_newElement[Node];
                        }
                    }
                }
            }
        }

        $tree   = tree;
        change_keys_tree();
        postOrder(Root($tree),$tree,$tzparent);

        return $shortcode;
    };
})(jQuery);