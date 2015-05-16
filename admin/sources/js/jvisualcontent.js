;(function($){
    $.jvcBuilder   = function(el,options){
        var $this   = $(el),
            $var    = $.extend({},$.jvcBuilder,options),
            $content_object;

        // Merge mapper object from options to $.jvcBuilder.mapper
        $.jvcBuilder.mapper   = $.extend({},$.jvcBuilder.mapper,$var.mapper);

        $.jvcBuilder.head   = {
            'css'           : {
                'fields': {},
                'shortcodes': {}
            },
            'js'           : {
                'fields': {},
                'shortcodes': {}
            }
        };

        $.jvcBuilder.model.reset();

        $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('destroy')
            .jvc_tooltip({"html": true,"container": "body"});

        /**
         * 1.0 Function libraries
         * -----------------------------------------------------------------------------
         */
        /**
         * 1.1 Remove functions
         * -----------------------------------------------------------------------------
         */

        // Remove class not jvc_col-sm-1 to jvc_col-sm-12
        var removeColClass    = function(column,prefix){
            var $prefix = prefix,
                $class  = null ;
            if(column && column.attr('class')){
                $class  = column.attr('class');
            }
            if(!$prefix){
                $prefix  = 'jvc_col-sm-';
            }
            if($class.length){
                var regex   = '/((' + $prefix + ')[0-9]+)/gi';
                regex   = eval(regex);
                if(regex.exec($class)){
                    column.attr('class',$class.replace(regex,''));
                }
            }
            return column;
        };

        // Reset to empty column
        var resetToEmptyColumn  = function(column){
            //var $colContainer = column.find('> .element_wrapper > .tz_column_container');
            var $colContainer = column.find('> .element_wrapper .tz_column_container').first();
//            if($colContainer.find('> [data-model-id]').length){
            $colContainer.addClass('tz_empty-container fancybox')
                .html('<i class="jvc_fa jvc_fa-plus"></i>');
            column.addClass('tz_empty-column');
//            }
            return column;
        };
        // Remove empty column's data
        $.jvcBuilder.removeEmptyColumn   = function(column){
            var columnContainer = column.find('> .element_wrapper > .tz_column_container');
            if(columnContainer.hasClass('tz_empty-container')){
                columnContainer.removeClass('tz_empty-container fancybox')
                    .removeAttr('data-toggle').removeAttr('data-target').html('');
            }
        };
        // Remove layout item (row or column)
        $.removeLayoutItem    = function(button){
            var $parents    = $(button).parents('[data-model-id]'),
                $item = $parents.first(),
                $message    = false;
            // Check data-element_type is tz_column
            if($item.data('element_type') == 'tz_column'){
                if($item.parents('[data-model-id]').first().data('element_type') == 'tz_row'){
                    // Check coloumn count
                    if($item.parent().find('> [data-model-id][data-element_type=tz_column]').length <= 1){
                        alert('Can not delete last section');
                        return ;
                    }
                }
            }
            //// Check data-element_type is tz_row
            //if($item.data('element_type') == 'tz_row'){
            //    if(!$item.parents('[data-model-id]').length
            //        && $item.parent().find('> [data-model-id][data-element_type]').length < 2){
            //        alert('Can not delete last section');
            //        return ;
            //    }
            //}

            if(!$message){
                $message    = confirm('Press OK to delete section, Cancel to leave');
            }
            if($message){
                var $itemParent = $item.parents('[data-model-id]').first();

                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                    .jvc_tooltip('hide');

                // Remove mapper item
                $.jvcBuilder.remove_mapper_item($item);

                $item.remove();
                if(!$itemParent.find('[data-model-id]').length){
                    resetToEmptyColumn($itemParent);
                }
                $.setActiveLayoutButton();
            }

            return $(button);
        };
        /**
         * 1.2 Get functions
         * -----------------------------------------------------------------------------
         */
        function tzGetColumnMask(cells) {
            var columns = cells.toString().split('_'),
                columns_count = columns.length,
                numbers_sum = 0;
            if(cells.length){
                numbers_sum = cells.replace(/([0-9])/gi,'$1+').replace(/_/gi,'').replace(/\+$/gi,'');
                numbers_sum = eval(numbers_sum);
            }
            if(numbers_sum){
                return columns_count + '' + numbers_sum.toString();
            }
            return 'custom';
        }
        /**
         * 1.3 Create new functions
         * -----------------------------------------------------------------------------
         */
            // Create new data-model-id

            // Create id function
        $.jvcBuilder.createId  = function(count,prefix){
            var d = new Date(),
                $time = d.getTime(),
                $id='';
            if(prefix){
                $id = prefix + '-' + $time + '-' + count + '-' + parseInt($time%count);
            }else{
                $id = $time + '-' + count + '-' + ($time%count);
            }
            return $id;
        };
        function array_unique(nav_array) {
            nav_array = nav_array.sort(function (a, b) { return a*1 - b*1; });
            var ret = [nav_array[0]];
            // Start loop at 1 as element 0 can never be a duplicate
            for (var i = 1; i < nav_array.length; i++) {
                if (nav_array[i-1] !== nav_array[i]) {
                    ret.push(nav_array[i]);
                }
            }
            return ret;
        }

        var $typeids    = {};
        $.jvcBuilder.setIDHtml = function(html,count,id,prefix,parentid,mindex){
            var $id = id;
            if(typeof mindex == 'undefined' || (typeof mindex != 'undefined' && mindex == 0)){
                $typeids    = {};
            }

            if(html){
                var $html   = html;
                var $model  = $.jvcBuilder.model.get_model();
                var $parentids;
                if($model){
                    if(parentid) {
                        $parentids = $.jvcBuilder.mapper[$model.attr('data-model-id')]['parentids'];
                    }
                    if($model.attr('data-aria-control') && $model.attr('data-aria-control').length) {
                        var $parent_model = $model.parents("[data-model-id][data-element_type]").first();
                        $parentids = $.jvcBuilder.mapper[$parent_model.attr('data-model-id')]['parentids'];
                    }
                }

                // Set parent id
                if($html.match(/(\[parentid[0-9+]?\].*?\[\/parentid[0-9+]?\])/mgi)){
                    var $matches    = $html.match(/(\[parentid[0-9+]?\].*?\[\/parentid[0-9+]?\])/mgi);

                        $.each($matches,function(index,value){
                            var regex   = '/'+tzaddslashes(value)+'/gi';
                            regex   = eval(regex);
                            if(regex.exec($html)){
                                $html   = $html.replace(regex,$parentids[value]);
                                if($parentids){
                                    $html   = $html.replace(regex,$parentids[value]);
                                }
                            }
                        });

                }else{
                    if($html.match(/(\[\/parentid[0-9+]?\])/mgi)){
                        var $matches    = $html.match(/(\[\/parentid[0-9+]?\])/mgi);
                        $.each($matches,function(index,value){
                            var regex   = '/'+tzaddslashes(value)+'/gi';
                            regex   = eval(regex);
                            if(regex.exec($html)){
                                if($parentids){
                                    $html   = $html.replace(regex,$parentids[value]);
                                }
                            }
                        });
                    }
                }

                // Set typeid
                if($html.match(/(\[typeid[0-9+]?\].*?\[\/typeid[0-9+]?\])/mgi)){
                    var $matches    = html.match(/(\[typeid[0-9+]?\].*?\[\/typeid[0-9+]?\])/mgi);
                    if($matches.length){
                        $matches.each(function(value,index){
                            var regex   = '/'+tzaddslashes(value)+'/gi';
                            var d = new Date(),
                                $time = d.getTime();
                            regex   = eval(regex);
                            if(regex.exec($html)){
                                $html   = $html.replace(regex,$time +'-'+count+'-' + index);
                            }
                        });
                    }
                    return $html;
                }else{
                    if($html.match(/(\[\/typeid[0-9+]?\])/mgi)){
                        var $matches    = html.match(/(\[\/typeid[0-9+]?\])/mgi);
                        if($matches.length){

                            $matches    = array_unique($matches);
                            $matches.each(function(value,index) {
                                //console.log($typeids[value]);
                                var d = new Date(),
                                    $time = d.getTime();
                                    $time += '-'+count+'-' + index;
                                if(typeof $typeids[value.toString()] == 'undefined') {
                                    $typeids[value.toString()] = $time;
                                }
                                var regex   = '/'+tzaddslashes(value)+'/gi';
                                regex   = eval(regex);
                                if(regex.exec($html)){
                                    $html   = $html.replace(regex,$typeids[value]);
                                }
                            });
                            return $html;
                        }
                    }
                }
            }
            return html;
        };

        $.jvcBuilder.createInputNameHidden = function(newModel,parentModel,data,child){
            var $newModel   = newModel;

            if($newModel.find('input[type=hidden]').length){
                var $name   = 'jform[attrib]';
                if(parentModel && parentModel.find('> input[type=hidden][data-name=tz_name-prefix]').length){
                    $name   = parentModel.find('> input[type=hidden][data-name=tz_name-prefix]').val() + '[children]';
                }
                var $data;

                $name += '[' + $newModel.data('model-id') + ']';
                $newModel.find('> input[type=hidden][name]').each(function(index,value){
                    if($(this).attr('name').match(/(\[\w+(\-)?\w+\])/gi)){
                        var $cInput  = $(this),
                            $attr   = $(value).attr('name'),
                            $match  = $attr.match(/(\[\w+(\-)?\w+\])/gi);
                        if($match.length){
                            $(this).attr('name',function(i,val){
                                if(val.match(/\[\]$/i)){
                                    return val.replace(/^jform\[.*?\]\[\]$/gi,$name + $match[$match.length - 1] + '[]');
                                }
                                return val.replace(/^jform\[.*?\]$/gi,$name + $match[$match.length - 1]);
                            });

                            if(!$(this).attr('name').match(/\[element_type\]$/gi)
                                && !$(this).attr('name').match(/\[typeid\]$/gi)){
                                if(data){
                                    $data   = data[$match[$match.length - 1].replace(/\[/,'').replace(/\]/,'')];

                                    if($data){
                                        if($.isArray($data)){
                                            $data.each(function(val,index){
                                                if(index === 0){
                                                    $cInput.val(val);
                                                }else{
                                                    var $input  = $cInput.clone(true);
                                                    $input.val(val);
                                                    $cInput.after($input);
                                                }
                                            });
                                        }else{
                                            $(this).val(data[$match[$match.length - 1].replace(/\[/,'').replace(/\]/,'')]);
                                        }
                                    }else{
                                        $(this).val('');
                                    }
                                }
                            }
                        }
                    }
                });
                if($newModel.find('>input[type=hidden][data-name=tz_name-prefix]').length){
                    $newModel.find('>input[type=hidden][data-name=tz_name-prefix]').val($name);
                }
                if(parentModel){
                    if($newModel.find('>input[type=hidden][name='+tzaddslashes($name)+'\\[parent\\]]').length){
                        var $parent_model_id    = parentModel.find('> input[type=hidden][data-name=tz_name-prefix]').val();
                        if($parent_model_id){
                            var $match  = $parent_model_id.match(/\[\w+\-\w+\]$/);
                            $newModel.find('>input[type=hidden][name='+tzaddslashes($name)+'\\[parent\\]]').val($match[0].replace(/\[|\]/g,''));
                        }
                    }
                }else{
                    $newModel.find('>input[type=hidden][name='+tzaddslashes($name)+'\\[parent\\]]').val('');
                }

                if(!child && newModel.find('>input[type=hidden][name]').length && newModel.find('>.element_wrapper input[type=hidden][data-name=tz_name-prefix]').length){
                    $.jvcBuilder.createInputNameHidden(newModel.find('>.element_wrapper input[type=hidden][data-name=tz_name-prefix]').first().parent(),$newModel,data);
                }


                return $newModel;
            }
            return null;
        }

        // Get input hidden data
        function getInputHiddenData(model){
            var $model  = model;
            if(!$model){
                if($.layouts.id){
                    $model  = $('[data-model-id='+ $.layouts.id+']');
                }
            }
            if($model && $model.length){
                if(typeof $model != 'object'){
                    $model   = $($model);
                }
                var $inputs = $model.find('[type=hidden][name*=jform]'),
                    $data   = [];
                if($inputs && $inputs.length){
                    $inputs.each(function(index,value){
                        var $inputName  = $(this).attr('name'),
                            $match  = $inputName.match(/\[(\w+)\]$/);
                        if($match && $match.length){
                            var $val    = new Object();
                            $val.name    = $match[$match.length - 1];
                            $val.value  = $(this).val();

                            $data.push($val);
                        }
                    });
                }
                return $data;
            }
            return null;
        }


        /**
         * 1.3 Process functions
         * -----------------------------------------------------------------------------
         */
        // Process cell string
        function tzCellString(cell){
            if(cell){
                cell    = cell.toString();
                cell    = cell.replace(/([0-9])/gi,'$1/').replace(/(\/\_)|(\_)/gi,' + ').replace(/\/$/gi,'').trim();
            }
            return cell;
        }
        // Greatest common divisor function
        function tzGcd( a,b){
            if(b==0) return a;
            else return tzGcd(b,a%b);
        }

        /**
         * 1.4 Set functions
         * -----------------------------------------------------------------------------
         */
        /**
         * 1.4.1 Set active layout button function
         * -----------------------------------------------------------------------------
         */

            // Set active layout button function
        $.setActiveLayoutButton = function(column_layout){
            var layout = column_layout;
            var $model  = $.jvcBuilder.model.get_model();

            if($model){
                if( !column_layout ) {
                    layout =
                        column_layout = $.map($model.find('>.element_wrapper >.tz_row_container > .tz_column'), function(model){
                            var width = $(model).attr('data-width');
                            return !width ? '11' : width.replace(/\//, '').replace(/\s+/,'');
                        }).join('_');
                    if(!layout){
                        layout   = 'custom';
                    }
                }

                $model.find('> .controls .tz_active').removeClass('tz_active');
                var $button = $model.find('> .controls [data-cells-mask=' + tzGetColumnMask(column_layout.toString()) + '][data-cells='+layout+']');
                if($button.length) {
                    $button.addClass('tz_active');
                } else {
                    $model.find('> .controls [data-cells-mask=custom]').addClass('tz_active');
                }
            }else{
                if($this.find('[data-model-id][data-element_type=tz_row]').length){
                    $this.find('[data-model-id][data-element_type=tz_row]').each(function(){
                        layout      = null;
                        var $row    = $(this);

                        layout = $.map($row.find('>.element_wrapper >.tz_row_container > .tz_column'), function(model){
                            var width = $(model).attr('data-width');
                            return !width ? '11' : width.replace(/\//, '').replace(/\s+/,'');
                        }).join('_');
                        if(!layout){
                            layout   = 'custom';
                        }

                        $row.find('> .controls .tz_active').removeClass('tz_active');
                        var $button = $row.find('> .controls [data-cells-mask=' + tzGetColumnMask(layout.toString()) + '][data-cells='+layout+']');
                        if($button.length) {
                            $button.addClass('tz_active');
                        } else {
                            $row.find('> .controls [data-cells-mask=custom]').addClass('tz_active');
                        }
                    });
                }
            }
        };

        // Set layout for column function
        $.setLayoutColumn   = function(column_layout){
            column_layout   = column_layout.toString().trim().replace(/\'|\"|\(|\)|\{|\}|\[|\]|\!|\.|\;|\~/gi,'');

            // Check column_layout is null
            if(!column_layout.toString().trim().length || (column_layout.toString().trim().length
                && !column_layout.toString().trim().match(/(^[0-9]+)\/?|(^span)/gi))){
                alert('Wrong row layout format! Example: 1/2 + 1/2 or span6 + span6.');
                return false;
            }
            var $column_layout  = column_layout,
                $columns =  $.jvcBuilder.model.get_model().find('> .element_wrapper > .tz_row_container > .tz_column');


            // Process column_layout variable
            if($column_layout && $column_layout.toString().match(/_/)){
                $column_layout   = $column_layout.split('_');
            }else{
                $column_layout   = $.makeArray($column_layout.toString());
            }

            // Check column_layout
            if($column_layout.length){
                var $cols   = [1,2,3,4,5,6,7,8,9,10,11,12],
                    colAccept = true;
                $column_layout  = $.map($column_layout,function(col,index){
                    if(!col.toString().trim().match(/span/gi)){
                        var colvar  = eval(col.toString().replace(/([0-9])/gi,'$1\/').replace(/\/$/gi,'')) *12;
                        if($($cols).index(colvar) == -1){
                            colAccept   = false;
                            return;
                        }
                    }else{
                        col = col.replace(/span/gi,'');
                        var colvar = col.replace(/span/gi,'');

                        if($($cols).index(parseInt(colvar)) == -1){
                            colAccept   = false;
                            return;
                        }else{
                            return (col/tzGcd(col,12)) + '' + (12/tzGcd(col,12));
                        }
                    }
                    return col;
                });
            }

            if(!colAccept){
                alert('Wrong row layout format! Example: 1/2 + 1/2 or span6 + span6.');
            }

            // Process set layout for column
            if($columns.length > $column_layout.length){
                var indexNotEmpty    = 0;
                $.each($columns,function(index,obj){
                    var $data   = {};

                    if($column_layout && $column_layout[index]){
                        $data['width']  = $column_layout[index].replace(/([0-9])/gi,'$1/').replace(/\/$/gi,'');
                        $data['element_type']   = 'tz_column';
                        indexNotEmpty   = index;
                        var $colVal = eval($column_layout[index].replace(/([0-9])/i,'$1\/').replace(/\/$/gi,'')) *12;

                        // Remove class jvc_col-sm
                        removeColClass($(this));
                        // Add class jvc_col-sm
                        $(this).addClass('jvc_col-sm-'+$colVal).attr('data-width',$column_layout[index].replace(/([0-9])/gi,'$1/').replace(/\/$/gi,''));
                        $.jvcBuilder.edit_param_mapper_item('width',$(this).attr('data-width'),$(this));
                    }else{
                        if(!$(this).find('>.element_wrapper >.tz_column_container').hasClass('tz_empty-container')){
                            var $prevColumn = $columns.eq(indexNotEmpty);
                            $.jvcBuilder.removeEmptyColumn($prevColumn);
                            $prevColumn.find('>.element_wrapper >.tz_column_container')
                                .append($(this).find('>.element_wrapper >.tz_column_container').html());
                        }
                        $.jvcBuilder.remove_mapper_item($(this));
                        $(this).remove();
                    }
                });
            }else{
                $.each($column_layout,function(index,value){
                    var $data   = {};
                    $data['width']  = value.replace(/([0-9])/gi,'$1/').replace(/\/$/gi,'');
                    $data['element_type']   = 'tz_column';

                    var $colVal = eval(value.replace(/([0-9])/i,'$1\/')) *12;

                    if($columns.eq(index).length){
                        removeColClass($columns.eq(index));
                        $columns.eq(index).addClass('jvc_col-sm-'+$colVal).attr('data-width',value.replace(/([0-9])/gi,'$1/').replace(/\/$/gi,''));
                        $.jvcBuilder.edit_param_mapper_item('width',$columns.eq(index).attr('data-width'),$columns.eq(index));
                    }else{
                        var $newColumn  = $($('#tmpl-jscontent-new-element-column').html()).clone(true);
                        removeColClass($newColumn);
                        $newColumn .addClass('jvc_col-sm-'+$colVal);
                        $newColumn  = $.jvcBuilder.createDataModelIds($newColumn);

                        var $_newColumn = $newColumn.clone(true);
                        $columns.eq($columns.length - 1).parent().append($_newColumn);
                        var $params = {
                            "params" : {
                                "background_color"      : "",
                                "background_image"      : "",
                                "background_style"      : "",
                                "border_color"          : "",
                                "border_style"          : "",
                                "font_color"            : "",
                                "el_class"              : "",
                                "margin_top"            : "",
                                "margin_right"          : "",
                                "margin_bottom"         : "",
                                "margin_left"           : "",
                                "padding_top"           : "",
                                "padding_right"         : "",
                                "padding_bottom"        : "",
                                "padding_left"          : "",
                                "border_top_width"      : "",
                                "border_right_width"    : "",
                                "border_bottom_width"   : "",
                                "border_left_width"     : "",
                                "width"                 : value.replace(/([0-9])/gi,'$1/').replace(/\/$/gi,''),
                                "col_lg_size"           : "",
                                "col_md_size"           : "",
                                "col_xs_size"           : "",
                                "col_lg_offset"         : "",
                                "col_md_offset"         : "",
                                "col_sm_offset"         : "",
                                "col_xs_offset"         : "",
                                "hidden_xs"             : "",
                                "hidden_sm"             : "",
                                "hidden_md"             : "",
                                "hidden_lg"             : ""
                            }
                        };
                        $.jvcBuilder.insert_mapper_item($_newColumn,false,$columns.eq($columns.length - 1).parents('[data-model-id][data-element_type]').first(),$params);
                    }
                });
            }

            $.setActiveLayoutButton($column_layout.join('_'));
        };

        /**
         * 1.4.2 Set value options function
         * -----------------------------------------------------------------------------
         */
        function setDataWAndRToModal(modal,data){

        }
        function setDataToModal(modal,data){
            if(modal.find('input[data-name],input[name],select[data-name],textarea[data-name]').length){
                modal.find('input[data-name],select[data-name],textarea[data-name]').each(function(index,value){
                    var $dataName = $(this).data('name').replace(/\-/gi,'_'),
                        $tagName = $(this).prop('tagName').toLowerCase(),
                        $val = '';

                    if(data['extrafield_data'][$dataName]){
                        $val    = data['extrafield_data'][$dataName];
                    }
                    if(data){
                        if($tagName === 'select'){
                            if($(this).find('option').length){
                                $(this).find('option').each(function(){
                                    if($(this).val() === $val){
                                        $(this).attr('selected','selected');
                                    }else{
                                        $(this).attr('selectedIndex',0);
                                    }
                                });
                            }
                        }else{
                            if($tagName === 'input' && $(this).attr('type') === 'checkbox'){
                                if($(this).val() === $val){
                                    $(this).attr('checked','checked');
                                }else{
                                    $(this).removeAttr('checked');
                                }
                            }else{
                                $(this).val($val);
                                if($dataName === 'border_color' || $dataName === 'background_color'){
                                    var trigger = ["set",$val];
                                    if(!$val.trim().length){
                                        $val  = 'rgba(0,0,0,0)';
                                    }
                                    $('.edit_form_elements [data-extrafield-type=color][data-extrafield-name='+$dataName+']').spectrum('set',$val);
                                }
                            }
                        }
                    }
                });
            }
        }
        function setWidthAndResponsiveToInputHidden(modal,model,selected){
            var $modal  = modal,
                $model  = model;
            if(typeof $modal != 'object'){
                $modal  = $(modal);
            }
            if(typeof $model != 'object'){
                $model  = $('[data-model-id=' + model + ']');
            }
            if($model.data('element_type') === 'tz_column'){
                var $namePrefix = $model.find('>input[type=hidden][data-name=tz_name-prefix]').val()
                        .replace(/\[/gi,'\\[').replace(/\]/gi,'\\]'),
                    $tagsForm  = $modal.find(selected)
                        .find('input[data-name]:not([data-name*=tz_hidden],[data-name=width]),select[data-name]:not([data-name*=tz_hidden],[data-name=width])');

                removeColClass($model,'jvc_col-[a-z]+-offset-|jvc_col-sm-|jvc_col-lg-|jvc_col-md-|jvc_col-xs-');
                var  $colVal = eval($modal.find(selected)
                        .find('select[data-name=width]').val()) *12;
                $model.addClass('jvc_col-sm-'+$colVal);

                if($tagsForm.length){
                    $tagsForm.each(function(index,value){
                        if($(this).val().length){
                            $model.addClass($(this).val());
                        }
                    });
                }
            }

            setGeneralOptionsToInputHidden($modal,$model,selected);
        }
        function setGeneralOptionsToInputHidden(modal,model,selected){
            var $modal  = modal,
                $model  = model;
            if(typeof $modal != 'object'){
                $modal  = $(modal);
            }
            if(typeof $model != 'object'){
                $model  = $('[data-model-id=' + model + ']');
            }
            var $namePrefix = $model.find('>input[type=hidden][data-name=tz_name-prefix]').val()
                    .replace(/\[/gi,'\\[').replace(/\]/gi,'\\]'),
                $tagsForm  = $modal.find(selected)
                    .find('input[data-name],select[data-name],textarea[data-name]');

            if($tagsForm.length){
                $tagsForm.each(function(index,value){
                    if($(this).attr('data-name') && $(this).attr('data-name').length){
                        var $dataName = $(this).attr('data-name')
                                .replace(/\[/gi,'\\[').replace(/\]/gi,'\\]'),
                            $inputName = '>input[type=hidden][name='+ $namePrefix + '\\[' + $dataName + '\\]]'
                            ,$inputNameObj  = $model.find($inputName);
                        if($inputNameObj && $inputNameObj.length){
                            if($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio'){
                                if($(this).attr('checked')){
                                    $inputNameObj.val($(this).val());
                                }else{
                                    $inputNameObj.val('');
                                }
                            }else{
                                $inputNameObj.val($(this).val());
                            }
                        }
                    }
                });
            }
        }
        function setDesignOptionsToInputHidden(modal,model){
            var $modal  = modal,
                $model  = model;
            if(typeof $modal != 'object'){
                $modal  = $(modal);
            }
            if(typeof $model != 'object'){
                $model  = $('[data-model-id=' + model + ']');
            }

            var $inputNamePrefix    = 'name=jform\\[' + $model.data('element_type') + '\\]\\['+ $.layouts.id +'\\]',
                $backgroundColor = $modal.find('[data-name=background_color]').val(),
                $backgroundImage = $modal.find('[data-name=background_image]').val();

//            if($model.data('element_type') == 'tz_column'){
//                $backgroundImage    =  $modal.find('[name=jform\\[background_image_column\\]]').val();
//            }
            if($model.find('>input[type=hidden][data-name=tz_name-prefix]')){
                $inputNamePrefix    = 'name=' + $model.find('>input[type=hidden][data-name=tz_name-prefix]').val();
                $inputNamePrefix    = $inputNamePrefix.replace(/\[/gi,'\\[').replace(/\]/gi,'\\]');
            }

            // Row settings
            $model.find('> ['+ $inputNamePrefix + '\\[font_color\\]]').val($modal.find('[data-name=font-color]').val());
            // Border
            if(!$modal.find('.tz_css-editor').hasClass('tz_simplified')){
                if($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val() || $modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-right-width]').val()
                    || $modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-bottom-width]').val() || $modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-left-width]').val() ){

                    $model.find('> ['+ $inputNamePrefix + '\\[border_top_width\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val());
                    $model.find('> ['+ $inputNamePrefix + '\\[border_right_width\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-right-width]').val());
                    $model.find('> ['+ $inputNamePrefix + '\\[border_bottom_width\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-bottom-width]').val());
                    $model.find('> ['+ $inputNamePrefix + '\\[border_left_width\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-left-width]').val());

                    $model.find('> ['+ $inputNamePrefix + '\\[border_color\\]]').val($modal.find('.tz_css-editor > .tz_settings [data-name=border_color]').val());
                    $model.find('> ['+ $inputNamePrefix + '\\[border_style\\]]').val($modal.find('.tz_css-editor > .tz_settings [data-name=border_style]').val());
                }

                $model.find('> ['+ $inputNamePrefix + '\\[margin_top\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[margin_right\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-right]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[margin_bottom\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-bottom]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[margin_left\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-left]').val());

                $model.find('> ['+ $inputNamePrefix + '\\[padding_top\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[padding_right\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-right]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[padding_bottom\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-bottom]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[padding_left\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-left]').val());
            }else{
                if($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val()){

                    $model.find('> ['+ $inputNamePrefix + '\\[border_right_width\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val());
                    $model.find('> ['+ $inputNamePrefix + '\\[border_bottom_width\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val());
                    $model.find('> ['+ $inputNamePrefix + '\\[border_left_width\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=border-top-width]').val());

                    $model.find('> ['+ $inputNamePrefix + '\\[border_color\\]]').val($modal.find('.tz_css-editor > .tz_settings [data-name=border_color]').val());
                    $model.find('> ['+ $inputNamePrefix + '\\[border_style\\]]').val($modal.find('.tz_css-editor > .tz_settings [data-name=border_style]').val());
                }

                $model.find('> ['+ $inputNamePrefix + '\\[margin_top\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[margin_right\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[margin_bottom\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[margin_left\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=margin-top]').val());


                $model.find('> ['+ $inputNamePrefix + '\\[padding_top\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[padding_right\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[padding_bottom\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());
                $model.find('> ['+ $inputNamePrefix + '\\[padding_left\\]]').val($modal.find('.tz_css-editor > .tz_layout-onion [data-name=padding-top]').val());
            }

            $model.find('> ['+ $inputNamePrefix + '\\[background_color\\]]').val($backgroundColor);
            $model.find('> ['+ $inputNamePrefix + '\\[background_style\\]]').val($modal.find('[data-name=background-style]').val());

            if($backgroundImage && $backgroundImage.trim().length){
                if(!$backgroundImage.match(/^http:\/\//i) && !$backgroundImage.match(/^www\./i)){
                    $backgroundImage    = $var.rootPath + $backgroundImage;
                }
                if($model.data('element_type') == 'tz_row'){
                    var $rowEditClone2   = $model.find('>.controls_row > .tz_row_edit_clone_delete');
                    if($rowEditClone2.find('>.tz_row_image').length){
                        $rowEditClone2.find('>.tz_row_image').attr('style','background-image: url('
                        + $backgroundImage +');');
                    }else{
                        $rowEditClone2.find('>.column_toggle').after('<span title="Row background image" style="background-image: url('
                        + $backgroundImage +');" class="tz_row_image"></span>');
                    }
                }else{
                    var $rowEditClone2   = $model.find('>.tz_controls').first();
                    if($rowEditClone2.find('>.tz_column_image').length){
                        $rowEditClone2.find('>.tz_column_image').attr('style','background-image: url('
                        + $backgroundImage +');');
                    }else{
                        $rowEditClone2.find('.column_add').after('<span title="Column background image" style="background-image: url('
                        + $backgroundImage +');" class="tz_column_image"></span>');
                    }
                }
            }else{
                if($model.data('element_type') == 'tz_row'){
                    $model.find('>.controls_row > .tz_row_edit_clone_delete > .tz_row_image').remove();
                }else{
                    $model.find('>.tz_controls > .tz_column_image').remove();
                }
            }

            if($backgroundColor && $backgroundColor.trim().length){
                if($model.data('element_type') == 'tz_row'){
                    var $rowEditClone   = $model.find('>.controls_row > .tz_row_edit_clone_delete');
                    if($rowEditClone.find('>.tz_row_color').length){
                        $rowEditClone.find('>.tz_row_color').css('background-color',$backgroundColor);
                    }else{
                        $rowEditClone.append('<span data-toggle="jvc_tooltip" title="Row background color" style="background-color: '+
                        $backgroundColor +'" class="tz_row_color"></span>');
                    }
                }else{
                    var $rowEditClone   = $model.find('>.tz_controls').first();
                    if($rowEditClone.find('>.tz_column_color').length){
                        $rowEditClone.find('>.tz_column_color').css('background-color',$backgroundColor);
                    }else{
                        $rowEditClone.prepend('<span data-toggle="jvc_tooltip" title="Column background color" style="background-color: '+
                        $backgroundColor +'" class="tz_column_color"></span>');
                    }
                }
            }else{
                if($model.data('element_type') == 'tz_row'){
                    $model.find('>.controls_row > .tz_row_edit_clone_delete > .tz_row_color').remove();
                }else{
                    $model.find('>.tz_controls > .tz_column_color').remove();
                }
            }

            $model.find('> ['+ $inputNamePrefix + '\\[background_image\\]]').val($backgroundImage);

            return $model;
        };

        $.jvcBuilder.insert_mapper_item    = function(new_model,current_model,parent_model,data,reset_value){
            var $parent     = '',
                $name       = '',
                $element_id = '',
                $params     = '',
                $shortcode  = '',
                $parent_id  = '';
            if(new_model){
                $name   = 'tz_element';
                if(new_model.attr('data-element_type')){
                    $name   = new_model.attr('data-element_type');
                }
            }
            if(current_model){
                $parent = current_model.parents('[data-model-id][data-aria-control],[data-model-id][data-element_type]').first();
                var $current_mapper = {};
                if(current_model.attr('data-element_type')){
                    if(current_model.attr('data-element_type') == 'tz_row'){
                        $parent = current_model;
                    }else {
                        $element_id = $parent.attr('data-element_id');
                    }
                }
                if(current_model.attr('data-aria-control')){
                    $parent         = current_model.parents('[data-model-id][data-element_type]').first();
                    $element_id     = $parent.attr('data-element_id');
                }
                if((!$parent || ($parent && !$parent.length)) && parent_model){
                    $parent = parent_model;
                }
                if($.jvcBuilder.mapper[current_model.attr('data-model-id')]) {
                    $current_mapper = $.jvcBuilder.mapper[current_model.attr('data-model-id')];
                    $name = $current_mapper['name'];
                    $params = $.extend(true,{},$current_mapper['params']);
                    $shortcode = $current_mapper['shortcode'];
                }
            }
            if(parent_model){
                $parent     = parent_model;
            }
            if(new_model.attr('data-element_id')){
                $element_id = new_model.attr('data-element_id');
            }
            if(data){
                if(data['params']) {
                    $params = $.extend(true,{},data['params']);
                }
                if(data['element_id']){
                    $element_id = data['element_id'];
                }
                if(reset_value){
                    if($params){
                        $.each($params,function(key,value){
                            $params[key]    = '';
                        });
                    }
                }
            }else{
                if($parent && $parent.attr('data-element_type') && $parent.attr('data-element_type') == 'tz_row'){
                    $params = {
                        "background_color"      : "",
                        "background_image"      : "",
                        "background_style"      : "",
                        "border_color"          : "",
                        "border_style"          : "",
                        "font_color"            : "",
                        "el_class"              : "",
                        "margin_top"            : "",
                        "margin_right"          : "",
                        "margin_bottom"         : "",
                        "margin_left"           : "",
                        "padding_top"           : "",
                        "padding_right"         : "",
                        "padding_bottom"        : "",
                        "padding_left"          : "",
                        "border_top_width"      : "",
                        "border_right_width"    : "",
                        "border_bottom_width"   : "",
                        "border_left_width"     : "",
                        "width"                 : "1/1",
                        "col_lg_offset"         : "",
                        "col_md_offset"         : "",
                        "col_sm_offset"         : "",
                        "col_xs_offset"         : ""
                    };
                }
            }

            if($name && $name == 'tz_element'){
                $shortcode  = '{tz_element '+ '}{/tz_element}';
            }else{
                $shortcode  = '[' + $name+ ' '+ '][/'+$name+']';
            }

            if($parent && $parent.attr('data-model-id')){
                $parent_id  = $parent.attr('data-model-id');
            }

            $.jvcBuilder.mapper[new_model.attr('data-model-id')]   = {
                id          : new_model.attr('data-model-id'),
                name        : $name,
                element_id  : $element_id,
                parent_id   : $parent_id,
                params      : $params,
                parentids   : {},
                shortcode   : $shortcode
            };
        };

        $.jvcBuilder.edit_param_mapper_item  = function(key,value,model){
            var $model  = model;
            if(!model){
                $model  = $.jvcBuilder.model.get_model();
            }
            if($.jvcBuilder.mapper[$model.attr('data-model-id')]){
                var $mapper_item = $.jvcBuilder.mapper[$model.attr('data-model-id')];
                if(!$mapper_item['params'][key]){
                    $mapper_item['params'][key]   = '';
                }
                $mapper_item['params'][key]   = value;
                $.jvcBuilder.mapper[$model.attr('data-model-id')] = $mapper_item;
            }
        };

        $.jvcBuilder.edit_params_mapper_item  = function(params,model){
            var $model  = model,
                $_params    = params;
            if(!model){
                $model  = $.jvcBuilder.model.get_model();
            }

            if(typeof params == 'object'){
                if(!$_params['params']) {
                    $_params['params'] = params['options'];
                }
                if($.jvcBuilder.mapper[$model.attr('data-model-id')]){
                    var $params = {};
                    //$.each($_params['params'],function(key,value){
                    //    if(key && key.length) {
                    //        $.jvcBuilder.mapper[$model.attr('data-model-id')]['params'][key] = $_params['params'][key].trim();
                    //    }
                    //});

                    var $mparams    = $.jvcBuilder.mapper[$model.attr('data-model-id')]['params'];
                    if(Object.keys($_params['params']).length>= Object.keys($mparams).length) {
                        $.each($_params['params'], function (key, value) {
                            if (key && key.length) {
                                if ($_params['params'][key]) {
                                    $.jvcBuilder.mapper[$model.attr('data-model-id')]['params'][key] = $_params['params'][key].trim();
                                } else {
                                    $.jvcBuilder.mapper[$model.attr('data-model-id')]['params'][key] = '';
                                }
                            }
                        });
                    }else{
                        $.each($mparams, function (key, value) {
                            if (key && key.length) {
                                if ($_params['params'][key]) {
                                    $.jvcBuilder.mapper[$model.attr('data-model-id')]['params'][key] = $_params['params'][key].trim();
                                } else {
                                    $.jvcBuilder.mapper[$model.attr('data-model-id')]['params'][key] = '';
                                }
                            }
                        });
                    }

                    //delete $.jvcBuilder.mapper[$model.attr('data-model-id')]['params'];
                    //$.jvcBuilder.mapper[$model.attr('data-model-id')]['params'] = {};
                    //$.extend(true,$.jvcBuilder.mapper[$model.attr('data-model-id')]['params'],$params);
                }
            }
        };

        $.jvcBuilder.addCss = function($css){
            if($css.length){
                if($('head style').length){
                    $('head style').last().append($css);
                }
            }
        }

        $.jvcBuilder.remove_mapper_item    = function($model_item){
            var $bool   = false,
                $_model_item    = $model_item;
            // Remove mapper item
            if(!$model_item){
                if($.jvcBuilder.model.get('id')){
                    $_model_item    = $.jvcBuilder.model.get_model();
                }
            }
            if($_model_item && $.jvcBuilder.mapper && $.jvcBuilder.mapper[$_model_item.attr('data-model-id')]){
                if($_model_item.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').length){
                    $_model_item.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').each(function(){
                        $bool   = delete $.jvcBuilder.mapper[$(this).attr('data-model-id')];
                    });
                }

                $bool   = delete $.jvcBuilder.mapper[$_model_item.attr('data-model-id')];
            }
            return $.jvcBuilder.mapper;
        };

        $.addShortCodeElementTemp   = function(html){
            var $html   = $('<div></div>').append(html);
            if($html.find('script[id]').length){
                $html.find('script[id]').each(function(){
                    $('head').find('#'+$(this).attr('id')).remove();
                })
            }
            $('head').append(html);
        };


        $.addShortCodeElement   = function(obj,html,shortcode,params,head){
            var $model  = null;
            if($.jvcBuilder.model.id){
                $model  = $.jvcBuilder.model.get_model();
            }

            if($model){
                if($model.length && html.length){
                    var $html   = $(html);
                    if($model.find('>.element_wrapper > .tz_column_container').length) {
                        $model.find('>.element_wrapper > .tz_column_container')
                            .removeClass('tz_empty-container fancybox fancybox.iframe')
                            .removeAttr('data-toggle').removeAttr('data-target')
                            .end().removeClass('tz_empty-column')
                            .find('>.element_wrapper > .tz_column_container >.jvc_fa-plus').remove();
                    }else{
                        if($model.find('>.element_wrapper .tz_column_container').first().find('>.jvc_fa-plus').length){
                            $model.find('>.element_wrapper .tz_column_container').first()
                                .removeClass('tz_empty-container fancybox fancybox.iframe')
                                .removeAttr('data-toggle').removeAttr('data-target')
                                .find('>.jvc_fa-plus').remove();
                        }
                    }

                    if($html.data('element_type') == 'tz_row'){
                        var $parentCount    = 0;
                        if($model.parents('[data-model-id][data-element_type=tz_row]').length){
                            $parentCount   = $model.parents('[data-model-id][data-element_type=tz_row]').length;
                            if($parentCount % 2 == 1){
                                $html.addClass('tz_row-inner');
                            }
                        }
                    }

                    if($.jvcBuilder.model.get('toolbar_position') == 'bottom'){
                        $model.find('>.element_wrapper .tz_column_container').first().append($html);
                        $.jvcBuilder.model.set('toolbar_position','');
                    }else{
                        if($model.find('>.element_wrapper .tz_column_container').length) {
                            $model.find('>.element_wrapper .tz_column_container').first().prepend($html);
                        }else{
                            $model.append($html);
                        }
                    }
                }
            }else{
                $this.find('#tz_no-content-helper_'+$var.name).before(html);
            }

            if(shortcode && (typeof shortcode == 'object' || typeof shortcode == 'array')){
                $.each(shortcode,function(key,val){
                    if( $.jvcBuilder.model.id && val.name != 'tz_element' && val.name != 'tz_column') {
                        val.parent_id = $.jvcBuilder.model.id;
                    }
                    $.jvcBuilder.mapper[key] = val;
                });
            }

            if(head){
                if(Object.keys(head).length){
                    if(head['css']['shortcodes'] && Object.keys(head['css']['shortcodes']).length) {
                        $.each(head['css']['shortcodes'], function (key, value) {
                            $.jvcBuilder.head['css']['shortcodes'][key] = value;
                        });
                    }
                    if(head['css']['fields'] && Object.keys(head['css']['fields']).length) {
                        $.each(head['css']['fields'],function(key,value){
                            $.jvcBuilder.head['css']['fields'][key]  = value;
                        });
                    }
                    if(head['js']['shortcodes'] && Object.keys(head['js']['shortcodes']).length) {
                        $.each(head['js']['shortcodes'],function(key,value){
                            $.jvcBuilder.head['js']['shortcodes'][key]  = value;
                        });
                    }
                }
            }

            var $css    = '',
                $js     = '';
            if($.jvcBuilder.head['css']['fields'] && Object.keys($.jvcBuilder.head['css']['fields']).length){
                $.each($.jvcBuilder.head['css']['fields'],function(key,value){
                    $css    += value;
                });
            }
            if($.jvcBuilder.head['css']['shortcodes'] && Object.keys($.jvcBuilder.head['css']['shortcodes']).length){
                $.each($.jvcBuilder.head['css']['shortcodes'],function(key,value){
                    $css    += value;
                });
            }
            if($.jvcBuilder.head['js']['shortcodes'] && Object.keys($.jvcBuilder.head['js']['shortcodes']).length){
                $.each($.jvcBuilder.head['js']['shortcodes'],function(key,value){
                    $js    += value;
                });
            }
            if($css.length){
                if($('head style[id=jvc_style_'+$var.name+']').length){
                    $('head style[id=jvc_style_'+$var.name+']').empty().append($css);
                }else{
                    $('head').append('<style type="text/css" id="jvc_style_'+$var.name+'">'+$css+'</style>');
                }
            }

            new $.jvcBuilder($this,$var);
        };

        /**
         * 2.0 Events function for layout
         * -----------------------------------------------------------------------------
         */
        /**
         * 2.1 Draggable and sortable
         * -----------------------------------------------------------------------------
         */
            // Modal drag
        $('.tz_shortcode-layout > .tz_modal').draggable({
            handle:'.tz_modal-header',
            start: function(event,ui){
                ui.helper.width(ui.helper.width());
            }
        });

        function tzSortable(method){
            if(method == 'refresh'){
                $('.container-fluid,.tz_row_container, .tz_column_container:not(.tz_empty-container),.tz_column_container').sortable('refresh');
            }else{
                // Row and Column sort
                $('.jscontent_content').sortable({
                    items: '> [data-element_type=tz_column], > [data-element_type=tz_column_inner],> .tz_sortable',
                    handle: '.column_move',
                    tolerance: "pointer",
                    distance:0.5,
                    revert: false,
                    placeholder: "tz-row-state-highlight",
                    start: function(event,ui){
                        $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                            .jvc_tooltip('hide').jvc_tooltip('disable');
                    },
                    stop: function(event,ui){
                        $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                            .jvc_tooltip('enable');
                    }
                }).find('.tz_column_container').sortable({
                    items: '> [data-element_type]',
                    handle: '.column_move, .element-move',
                    connectWith: '.jscontent_content .tz_column_container',
                    forceHelperSize: true,
                    zIndex: 9999,
                    revert: 200,
                    placeholder: "tz-state-highlight"
                    ,start: function(event,ui){

                        $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                            .jvc_tooltip('hide').jvc_tooltip('disable');
                        var $connectWidth   = '.jscontent_content .tz_column_container';
                        if(ui.item.is('[data-element-item-count]') || ui.item.find('[data-element_type][data-element-item-count]').length){
                            //$connectWidth    = '[data-element_type]:not([data-element-item-count]) > .element > .tz_column_container';
                            $connectWidth    = '.jscontent_content [data-element_type]:not([data-element-item-count])>.element_wrapper >.tz_column_container'
                            +',.jscontent_content [data-element_type]:not([data-element-item-count]) .tz_column_container.jscontent_element_container';
                        }
                        ui.item.parents('.tz_column_container').sortable('option','connectWith',$connectWidth);
                        $(this).sortable('refresh');

                        var icons   = ui.item.find('> .tz_controls').children();
                        icons.removeClass('jvc_btn-group jvc_btn-group-xs').addClass('jvc_btn-group-sm')
                            .find('.element-move').removeClass('jvc_btn-sm').removeClass('jvc_btn-xs');
                        $.jvcBuilder.model.modelRemember = ui.item.parents('[data-model-id]').eq(0);
                        ui.item.parents('[data-model-id]').eq(0).find('> .element_wrapper').css('overflow','inherit');
                        ui.placeholder.height(ui.item.height());
                    }
                    ,sort: function(event,ui){
                        var $parent = ui.item.parent();
                        if(!$parent.find('>.tz_sortable:not(.ui-sortable-helper)').length
                            && !$parent.find(ui.placeholder).length
                            && !$parent.find('> .jvc_fa-plus').length){
                            $parent.addClass('tz_sorting-empty-container').prepend('<i class="jvc_fa jvc_fa-plus"></i>');
                        }
                    }
                    ,stop: function(event,ui){
                        var icons   = ui.item.find('> .tz_controls').children();

                        icons.addClass('jvc_btn-group jvc_btn-group-xs').removeClass('jvc_btn-group-sm')
                            .find('.element-move').removeClass('jvc_btn-sm').removeClass('jvc_btn-xs');

                        $.jvcBuilder.model.modelRemember.find('> .element_wrapper').css('overflow','');
                        if($.jvcBuilder.model.modelRemember.attr('data-element_type') == 'tz_column'
                            && !$.jvcBuilder.model.modelRemember.find('[data-model-id]').length){
                            $.jvcBuilder.model.modelRemember.addClass('tz_empty-column');
                        }

                        if(ui.item.parents('[data-model-id]').eq(0).find('[data-model-id]').length){
                            if(ui.item.parents('[data-model-id]').eq(0).attr('data-element_type') == 'tz_column'){
                                ui.item.parents('[data-model-id]').eq(0).removeClass('tz_empty-column');
                            }
                        }

                        var $parent = ui.item.parent();
                        if(!$parent.find('>.tz_sortable').length){
                            $parent.addClass('tz_empty-container fancybox fancybox.iframe')
                                .attr('data-toggle','jvc_modal')
                                .attr('data-target','#tz_add-shortcode')
                                .prepend('<i class="jvc_fa jvc_fa-plus"></i>');
                        }else{
                            $parent.removeClass('tz_empty-container fancybox fancybox.iframe')
                                .removeAttr('data-toggle').removeAttr('data-target')
                                .find('> .jvc_fa.jvc_fa-plus').remove();
                        }
                        var $sortingEmpty  = $('.tz_sorting-empty-container');
                        if($sortingEmpty.find('>.jvc_fa.jvc_fa-plus').length){
                            $sortingEmpty.addClass('tz_empty-container fancybox fancybox.iframe')
                                .attr('data-toggle','jvc_modal')
                                .attr('data-target','#tz_add-shortcode');
                        }
                        $sortingEmpty.removeClass('tz_sorting-empty-container');
                        if(ui.item.data('element_type') == 'tz_row'){
                            var $parentCount    = 0;
                            if(ui.item.parents('[data-model-id][data-element_type=tz_row]').length){
                                $parentCount    = ui.item.parents('[data-model-id][data-element_type=tz_row]').length;
                            }
                            if($parentCount % 2 == 1){
                                ui.item.addClass('tz_row-inner');
                            }else{
                                ui.item.removeClass('tz_row-inner');
                            }
                        }

                        if($.jvcBuilder.mapper && $.jvcBuilder.mapper[ui.item.attr('data-model-id')]) {
                            $.jvcBuilder.mapper[ui.item.attr('data-model-id')]['parent_id'] = ui.item.parents('[data-model-id][data-aria-control],[data-model-id][data-element_type]').first().attr('data-model-id');
                        }

                        $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                            .jvc_tooltip('enable');
                    }
                }).end().find('.tz_row_container').sortable({
                    items: '> .tz_sortable',
                    revert: 200,
                    placeholder: "tz-state-highlight-outer"
                    ,start: function(event,ui){
                        ui.placeholder.width(ui.item.width() - 1).append('<div class="tz-state-highlight"></div>');
                    }
                });

                if($('.jscontent_content').find('[data-model-id][data-aria-control]').length) {
                    $('.jscontent_content').find('[data-model-id][data-aria-control]')
                        .each(function(){
                            $(this).parents('[data-model-id]').first().parent()
                                .sortable({
                                    items: '>[data-model-id]:not([data-element_type])',
                                    forceHelperSize: true,
                                    connectWith: false,
                                    handle: '.tz_element-name',
                                    placeholder: "tz-state-highlight",
                                    tolerance: "pointer",
                                    delay: 150,
                                    revert: 200,
                                    distance: 0.5,
                                    start: function (event, ui) {
                                        $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                                            .jvc_tooltip('hide').jvc_tooltip('disable');

                                        //var $elParentSort   = $('.tz_element-column').parents('[data-model-id]').first().parent();
                                        var $elParentSort = ui.item.parents('.ui-sortable').first();
                                        $elParentSort.addClass('display').sortable('refresh');

                                        if (ui.item.attr('data-model-id') && ui.item.attr('data-element_type')) {
                                            var icons = ui.item.find('> .tz_controls').children();
                                            icons.removeClass('jvc_btn-group jvc_btn-group-xs')
                                                .find('.element-move').removeClass('btn-sm').addClass('btn-md');
                                            $.jvcBuilder.model.modelRemember = ui.item.parents('[data-model-id]').eq(0);
                                            ui.item.parents('[data-model-id]').eq(0).find('> .element_wrapper').css('overflow', 'inherit');
                                            ui.placeholder.height(ui.item.height());
                                        }

                                        //$('.jscontent_content').find('.tz_element-column').parents('[data-model-id]').first().parent()
                                        //    .sortable('refresh');
                                    },
                                    stop: function (event, ui) {
                                        //var $elParentSort   = $('.tz_element-column').parents('[data-model-id]').first().parent();

                                        var $child = ui.item.find('[data-model-id][data-aria-control]').first();
                                        if ($child.attr('data-element-item-count') && $child.attr('data-element-item-count') > 1) {
                                            var $count = parseInt($child.attr('data-element-item-count')) - 1,
                                                $index = (ui.item.parent().find('>[data-model-id]').index(ui.item)),
                                                $parent = ui.item.parents('[data-model-id][data-element_type]').first(),
                                                $aria = $child.attr('data-aria-control');

                                            if ($count) {
                                                $count.each(function (index) {
                                                    var $item = $parent.find('[aria-control=' + $aria + '-' + index + ']').first(),
                                                        $itemParent = $item.parent(),
                                                        $items = $itemParent.children(),
                                                        $itemIndex = $items.index($item);
                                                    if ($index == 0) {
                                                        $itemParent.prepend($item);
                                                    } else {
                                                        if ($index == ($items.length - 1)) {
                                                            $itemParent.append($item);
                                                        } else {
                                                            if ($itemIndex > ($items.length / 2)) {
                                                                $items.eq($index).before($item);
                                                            } else {
                                                                $items.eq($index).after($item);
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }

                                        if (ui.item.attr('data-model-id') && ui.item.attr('data-element_type')) {
                                            var icons = ui.item.find('> .tz_controls').children();
                                            icons.addClass('jvc_btn-group jvc_btn-group-xs')
                                                .find('.element-move').removeClass('jvc_btn-md').addClass('jvc_btn-sm');

                                            var $parent = ui.item.parent();
                                            if (!$parent.find('>.tz_sortable').length) {
                                                $parent.addClass('tz_empty-container fancybox fancybox.iframe')
                                                    .attr('data-toggle', 'jvc_modal')
                                                    .attr('data-target', '#tz_add-shortcode')
                                                    .prepend('<i class="jvc_fa jvc_fa-plus"></i>');
                                            } else {
                                                $parent.removeClass('tz_empty-container fancybox fancybox.iframe')
                                                    .removeAttr('data-toggle').removeAttr('data-target')
                                                    .find('> .jvc_fa.jvc_fa-plus').remove();
                                            }
                                        }


                                        if($.jvcBuilder.mapper && $.jvcBuilder.mapper[ui.item.attr('data-model-id')]) {
                                            $.jvcBuilder.mapper[ui.item.attr('data-model-id')]['parent_id'] = ui.item
                                                .parents('[data-model-id][data-aria-control],[data-model-id][data-element_type]')
                                                .first().attr('data-model-id');
                                        }

                                        ui.item.parents('.ui-sortable').first().removeClass('display');

                                        $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                                            .jvc_tooltip('enable');

                                        $('.jscontent_content').find('.tz_element-column').parents('[data-model-id]').first().parent()
                                            .sortable('refresh');
                                    }
                                });
                        });
                }
            }
        }
        new tzSortable();


        /**
         * 2.2 Toolbar buttons click
         * -----------------------------------------------------------------------------
         */
        /**
         * 2.2.1 Column's and row's toolbar buttons click
         * -----------------------------------------------------------------------------
         */

            // Add column
        //$this.undelegate('[data-slide],[data-slide-to]','click.bs.jvc_carousel.data-api')
        //    .delegate('[data-slide],[data-slide-to]','click.bs.jvc_carousel.data-api',function(){
        //    return false;
        //});
        $this.undelegate('[data-dismiss=jvc_alert]','click.bs.jvc_alert.data-api')
            .delegate('[data-dismiss=jvc_alert]','click.bs.jvc_alert.data-api',function(){
            return false;
        });
        $this.undelegate('[data-model-id][data-element_type=tz_row] > .controls_row .column_toggle','click.bs.jvc_collapse.data-api')
            .delegate('[data-model-id][data-element_type=tz_row] > .controls_row .column_toggle','click.bs.jvc_collapse.data-api',function(e){
                var $this   = $(this);
                var href;
                var $target = $this.attr('data-target')
                    || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
                $target = $($target);
                var $data   = $target.data('bs.jvc_collapse');
                if($data && typeof $data == 'object'){
                    if($data.$element.hasClass('jvc_in')){
                        $this.removeClass('jvc_collapsed').addClass('jvc_collapsed');
                    }
                    else{
                        $this.removeClass('jvc_collapsed');
                    }
                }else{
                    $this.removeClass('jvc_collapsed').addClass('jvc_collapsed');
                }

            });
        $this.undelegate('.column_add,.tz_empty-container','click')
            .delegate('.column_add,.tz_empty-container','click',function(){

                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('destroy')
                    .jvc_tooltip({"html": true,"container": "body"});

                var $model  = $(this).parents('[data-model-id]').first(),
                    $newColumn = $var.createDataModelIds($('#tmpl-jscontent-new-element-column').clone(true).html());

                $.jvcBuilder.model.set('id',$model.attr('data-model-id'));

                // Open collapse if hidden
                if(!$model.find('.jvc_panel-collapse').first().hasClass('jvc_in')) {
                    $model.find('.jvc_panel-collapse').first()
                        .parents('[data-model-id][data-element_type=tz_row]').first()
                        .find('.jvc_panel-collapse').jvc_collapse('show')
                        .end().find('[data-toggle=jvc_collapse]').removeClass('jvc_collapsed');
                }
                // Set current model
                if($(this).parent().hasClass('bottom-controls')){
                    $.jvcBuilder.model.set('toolbar_position','bottom');
                }

                if($(this).parents('[data-model-id]').eq(0).data('element_type') == 'tz_row'){
                    //$newColumn    = $.tzLayoutBuilder.createInputNameHidden($newColumn, $.jvcBuilder.model.get_model() + ']'));

                    // Insert mapper's item
                    $.jvcBuilder.insert_mapper_item($newColumn,false,$model);

                    $model.find('>.element_wrapper >.tz_row_container').append($newColumn);
                    $.setActiveLayoutButton();

                    $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('destroy')
                        .jvc_tooltip({"html": true,"container": "body"});
                }
                if($(this).hasClass('.column_add')) {
                    new $.jvcBuilder($this, $var);
                }
            });

        // Clone row
        $this.undelegate('.column_clone','click')
            .delegate('.column_clone','click',function(){

                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('destroy')
                    .jvc_tooltip({"html": true,"container": "body"});

                var $el = $(this).parents('[data-model-id]').first(),
                    $parent = $('<div></div>').append($el.clone(true));

                var $newHtml    = $($(this).parents('[data-model-id]').first()).jscontent_htmlTree({
                    jvcBuilder         : $.jvcBuilder
                });

                if($newHtml.length){
                    $el.after($($newHtml));
                }

                new $.jvcBuilder($this,$var);

            });

        // Edit row and column
        $this.undelegate('.column_edit','click')
            .delegate('.column_edit','click',function(){
                var $model  = $(this).parents('[data-model-id][data-element_type]').first();

                $.jvcBuilder.model.set('id',$model.attr('data-model-id'));
            });

        // Remove row and column
        $this.undelegate('.column_delete','click')
            .delegate('.column_delete','click',function(){
                $.jvcBuilder.model.set('id',$(this).parents('[data-model-id]').eq(1).data('model-id'));
                $.removeLayoutItem(this);
            });

        // Layout button click function
        $this.undelegate('.tz_control-set-column[data-cells=custom]','click')
            .delegate('.tz_control-set-column[data-cells=custom]','click',function(){
                var $model  = $(this).parents('[data-model-id][data-element_type]').first();

                $.jvcBuilder.model.set('id',$model.data('model-id'));
                $('#tz_row-layout').val(tzCellString($(this).parent().find('.tz_active').data('cells')));
            });
        $this.undelegate('.tz_control-set-column:not([data-cells=custom])','click')
            .delegate('.tz_control-set-column:not([data-cells=custom])','click',function(){
                var $model  = $(this).parents('[data-model-id][data-element_type]').first();
                // Open collapse if hidden
                //if($model.find('[data-toggle=jvc_collapse]').hasClass('jvc_collapsed')) {
                    $model.find('.jvc_panel-collapse').jvc_collapse('show')
                        .end().find('[data-toggle=jvc_collapse]').removeClass('jvc_collapsed');
                //}

                $.jvcBuilder.model.set('id',$model.attr('data-model-id'));
                $.setLayoutColumn($(this).data('cells'));
                $.jvcBuilder.model.reset();
                new $.jvcBuilder($this,$var);
            });
        $('.jscontent_options .tz_layout-btn').die('click')
            .live('click',function(){
                $.setLayoutColumn($(this).data('cells'));
                $.fancybox.close();
            });

        // Update layout in modal click function
        $('#tz_row-layout-update').die('click')
            .live('click',function(){
                if($('#tz_row-layout').val().length){
                    var $columnLayout  = $('#tz_row-layout').val().replace(/\+/gi,'_').replace(/\/|\s/gi,'');
                    if($.setLayoutColumn($columnLayout)) {
                        $.fancybox.close();
                    }else{
                        alert('Wrong row layout format! Example: 1/2 + 1/2 or span6 + span6.');
                        return false;
                    }
                }else{
                    alert('Wrong row layout format! Example: 1/2 + 1/2 or span6 + span6.');
                    return false;
                }
            });

        $this.undelegate('.tz_panel-btn-save','click')
            .delegate('.tz_panel-btn-save','click',function(){
                var $modal    = $(this).parents('.tz_modal').eq(0),
                    $model  = $('[data-model-id=' + $.jvcBuilder.model.id + ']');
                setDesignOptionsToInputHidden($modal,$model);
                setGeneralOptionsToInputHidden($modal,$model,'#tz_edit-form-row-tab-0');
                setWidthAndResponsiveToInputHidden($modal,$model,'#tz_edit-form-column-tab-2');
                $modal.modal('hide');
            });

        $.editExtrafield  = function(data){
            var $model  = $.jvcBuilder.model.get_model(),
                $el     = $model.parents('[data-model-id][data-element_type]').first(),
                $guid   = guid(),
                $elId   = $el.data('element_id'),
                $id = $.jvcBuilder.createId($model.parent().find('>[data-model-id]').length),
                $count  = 0;

            if($model.attr('data-element-item-count')){
                $count  = $model.attr('data-element-item-count');
                $count  = parseInt($count)
            }

            // Get value from form's html
            var $data    = {};
            if(typeof data != 'object'){
                if(data.length){
                    $data = $.parseJSON(data);
                    //$data['typeid'] = $id;
                }
            }else{
                $data   = data;
            }

            if($count){
                // Element item
                if($model.attr('data-aria-control')){
                    //$data['typeid'] = $id;
                    $count.each(function(index){
                        var $tmpl   = $('#template-jscontent-new-element-'+ $elId +'-item-'+index).clone();

                        if($tmpl.length){
                            var $tmplHtml   = $tmpl.html();

                            // Set typeid(override [typeid][/typeid] to random string)
                            $tmplHtml   = $.jvcBuilder.setIDHtml($tmplHtml,$el.parent().find('>[data-model-id]').length,$id,null,null,index);

                            // Set value from extrafield for element
                            $tmplHtml   = $.jvcBuilder.setValueExtrafield($tmplHtml,$data['params']);

                            if(index != ($count - 1)){
                                if($el.find('[aria-control]').length){
                                    if($el.find('[aria-control]').parent().length){
                                        $tmplHtml   = $tmplHtml.replace(/\[modelid\]\[\/modelid\]/gi,$model.attr('data-aria-control') + '-' + index);
                                        var $tmplObj    = $($tmplHtml);
                                        if($tmplObj.attr('data-model-id')) {
                                            $tmplObj   = $var.createDataModelIds($tmplObj,true);
                                        }
                                        $el.find('[aria-control='+$model.attr('data-aria-control')+'-'+index+']').after($tmplObj).remove();
                                        //$el.find('[aria-control='+$model.attr('data-aria-control')+']').eq(index).remove();
                                    }

                                }
                            }else{
                                //var $elLast = $el.find('>.element_wrapper [data-model-id]').first();

                                $tmplHtml   = $tmplHtml.replace(/\[modelid\]\[\/modelid\]/gi,$model.attr('data-aria-control'));
                                var $tmplObj    = $($tmplHtml);
                                $tmplObj   = $.jvcBuilder.createDataModelIds($tmplObj,true);

                                $.jvcBuilder.edit_params_mapper_item($data);

                                if($model.find('>.element_wrapper').children().length){
                                    if($model.find('>.element_wrapper [data-model-id][data-element_type]').length) {
                                        //$.jvcBuilder.removeEmptyColumn($tmplObj.find('.element_wrapper').first().parent());
                                        $tmplObj.find('.element_wrapper').empty().append($model.find('>.element_wrapper').children().clone(true));
                                    }
                                }

                                if($model.attr('data-element_type')){
                                    $model.after($tmplObj);
                                }else{
                                    $model.parents('[data-model-id]').first().after($tmplObj).remove();
                                }
                                //$model.parents('[data-model-id]').first().remove();
                            }
                        }
                    });
                }else{ // Element

                    var $tmpl   = $('#tmpl-jscontent-new-element-'+$model.attr('data-element_id')).clone(true);
                    if($tmpl.length){
                        var $tmplHtml   = $tmpl.html();

                        // Set value from extrafield for element
                        $tmplHtml   = $.jvcBuilder.setValueExtrafield($tmplHtml,$data['params']);

                        var $tmplHtmlObj = $.jvcBuilder.createDataModelIds($tmplHtml,true);

                        $.jvcBuilder.edit_params_mapper_item($data);

                        if($model.find('>.element_wrapper').children().length){
                            if($model.find('>.element_wrapper [data-model-id][data-element_type]').length) {
                                $tmplHtmlObj.removeClass('tz_empty-column');
                                $tmplHtmlObj.find('.element_wrapper').empty().append($model.find('>.element_wrapper').children());
                            }
                        }

                        if($model.attr('data-element_id') == 'column'){
                            $.setActiveLayoutButton();
                        }

                        if($model.find('[data-model-id][data-aria-control]').length){
                            $model.find('[data-model-id][data-aria-control]').each(function(){
                                if($count && $count > 1){
                                    $tmplHtmlObj.find('[aria-control=\\[modelid\\]\\[\\/modelid\\]]')
                                        .first().parent().append($model.find('[aria-control='+$(this).attr('data-aria-control')+'-0]'));
                                }
                                $tmplHtmlObj.find('[data-aria-control]').first().parents('[data-model-id]')
                                    .first().parent().append($(this).parents('[data-model-id]').first());
                            });
                            $tmplHtmlObj.find('[data-aria-control=\\[modelid\\]\\[\\/modelid\\]]')
                                .parents('[data-model-id]').first().remove();
                            $tmplHtmlObj.find('[aria-control=\\[modelid\\]\\[\\/modelid\\]]').first().remove();
                        }

                        $model.after($tmplHtmlObj).remove();
                    }
                }
            }else{
                var $tmpl   = $('#tmpl-jscontent-new-element-'+$model.attr('data-element_id')).clone();
                if($tmpl.length){
                    var $tmplHtml   = $tmpl.html();

                    // Set value from extrafield for element
                    $tmplHtml   = $.jvcBuilder.setValueExtrafield($tmplHtml,$data['params']);

                    var $tmplHtmlObj = $.jvcBuilder.createDataModelIds($tmplHtml,true);

                    if($model.attr('data-element_type') == 'tz_row'){
                        var $row_count = 0;
                        if($model.parents('[data-model-id][data-element_type=tz_row]').length){
                            $row_count  = $model.parents('[data-model-id][data-element_type=tz_row]').length;
                            if($row_count % 2 == 1){
                                $tmplHtmlObj.addClass('tz_row-inner');
                            }
                        }
                    }

                    $.jvcBuilder.edit_params_mapper_item($data);

                    if($model.find('>.element_wrapper').children().length){
                        if($model.find('>.element_wrapper [data-model-id][data-element_type]').length) {
                            $tmplHtmlObj.removeClass('tz_empty-column');
                            $tmplHtmlObj.find('.element_wrapper').empty().append($model.find('>.element_wrapper').children());
                        }
                    }

                    if($model.attr('data-element_id') == 'column'){
                        $.setActiveLayoutButton();
                    }

                    $model.after($tmplHtmlObj).remove();
                }
            }

            new $.jvcBuilder($this,$var);
        };

        $this.undelegate('.tz_element-btn-save','click')
            .delegate('.tz_element-btn-save','click',function(){
                var $modal    = $(this).parents('.tz_modal').eq(0);
//                    $model  = $('[data-model-id='+ $.jvcBuilder.model.id+']'),
//                    $el     = $model.parents('[data-model-id][data-element_type]').first(),
//                    $guid   = guid(),
//                    $elId   = $el.data('element_id'),
//                    $id = $.jvcBuilder.createId($model.parent().find('>[data-model-id]').length),
//                    $count  = 0;
                $modal.find('.tz_modal-body >iframe')
                    .contents().find('form').submit()
                    .end().end().one('load',function(){
                        if($modal.css('display') != 'none'){
                            $modal.modal('hide');
                        }
                    });
//                $modal.modal('hide');

//                if($model.attr('data-element-item-count')){
//                    $count  = $model.attr('data-element-item-count');
//                    $count  = parseInt($count);
//                }
//
//                // Get value from form's html
//                var $data    = $modal.find('.tz_el_extrafields form').serializeArray().reduce(function(obj, item) {
//                    if(obj[item.name.replace(/\[\]/i,'')]){
//                        obj[item.name.replace(/\[\]/i,'')] += " " + item.value;
//                    }else{
//                        obj[item.name.replace(/\[\]/i,'')] = item.value;
//                    }
//                    return obj;
//                }, {});
//                $data['typeid'] = $id;
//
//
//                if($count){
//                    $count.each(function(index){
//                        var $tmpl   = $('#template-jscontent-new-element-'+ $elId +'-item-'+index).clone();
//
//                        if($tmpl.length){
//                            var $tmplHtml   = $tmpl.html();
//
//                            // Set typeid(override [typeid][/typeid] to random string)
//                            $tmplHtml   = $.jvcBuilder.setIDHtml($tmplHtml,$el.parent().find('>[data-model-id]').length,$id);
//
//                            // Set value from extrafield for element
//                            $tmplHtml   = $.jvcBuilder.setValueExtrafield($tmplHtml,$data);
//
//                            if(index != ($count - 1)){
//                                if($el.find('[aria-control*=-'+index+']').length){
//                                    if($el.find('[aria-control*=-'+index+']').parent().length){
//                                        $tmplHtml   = $tmplHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid + '-' + index);
//                                        var $tmplObj    = $($tmplHtml);
//                                        $tmplObj   = $.jvcBuilder.createDataModelIds($tmplObj);
////                                        var $elParent   = $el.find('[aria-control='+$model.attr('data-aria-control')+'-'+index+']').parent();
//                                        $el.find('[aria-control='+$model.attr('data-aria-control')+'-'+index+']').after($tmplObj);
//                                        $el.find('[aria-control*='+$model.attr('data-aria-control')+'-'+index+']').remove();
////                                            $elParent.append($tmplObj);
//                                    }
//
//                                }
//                            }else{
//                                var $elLast = $el.find('>.element_wrapper [data-model-id]').first();
//                                if($elLast.length){
//                                    if($elLast.parent().length){
//                                        $tmplHtml   = $tmplHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid);
//                                        var $tmplObj    = $($tmplHtml);
//                                        $tmplObj   = $.jvcBuilder.createDataModelIds($tmplObj);
//                                        $.jvcBuilder.createInputNameHidden($tmplObj.find('[data-model-id]').last(),
//                                            $el.parents('[data-model-id][data-element_type]').first()
//                                            ,$data);
//                                        if($model.find('>.element_wrapper >.tz_column_container [data-model-id]').length){
//                                            $.jvcBuilder.removeEmptyColumn($tmplObj.find('.element_wrapper').first().parent());
//                                            $tmplObj.find('.element_wrapper').first().find('>.tz_column_container')
//                                                .append($model.find('>.element_wrapper >.tz_column_container').children());
//                                        }
//
//                                        var $elLastParent   = $elLast.parent();
//                                        if($model.attr('data-element_type')){
//                                            $model.after($tmplObj);
//                                        }else{
//                                            $elLast.after($tmplObj);
//                                        }
//                                        $model.parents('[data-model-id]').first().remove();
//                                    }
//                                }
//                            }
//                        }
//                    });
//                }else{
//                    var $tmpl   = $('#tmpl-jscontent-new-element-'+$model.data('element_id')).clone();
//                    if($tmpl.length){
//                        var $tmplHtml   = $tmpl.html();
//
//                        // Set value from extrafield for element
//                        $tmplHtml   = $.jvcBuilder.setValueExtrafield($tmplHtml,$data);
//
//                       var $tmplHtmlObj = $.jvcBuilder.createDataModelIds($tmplHtml);
//                        $.jvcBuilder.createInputNameHidden($tmplHtmlObj,$model,$data);
//                        $model.after($tmplHtmlObj).remove();
//                    }
//                }
//                new $.jvcBuilder($this,$var);
            });

        // Set value from extrafield for html
        $.jvcBuilder.setValueExtrafield = function(html,data){
            if(html){
                var $extrafields    = [];
                //var $date           = new Date();
                //var $parentid       = $date.getTime();

                if(typeof html == 'object'){
                    $extrafields    = html.html().match(/(\{.*?\})/mgi);
                    //if(html.html().match(/(\[\/parentid\])/mgi)){
                    //
                    //}
                }else{
                    $extrafields    = html.match(/(\{.*?\})/mgi);
                    //$parentid       = html.match(/(\[\/parentid\])/mgi);
                }
                if($extrafields && $extrafields.length){
                    $extrafields.each(function(value,exIndex){
                        var regex   = '/('+value.replace(/\{/,'\\{').replace(/\}/,'\\}')+')/gi';
                        regex   = eval(regex);
                        var $data = '';
                        if(data && data[value.replace(/\{/,'').replace(/\}/,'')]){
                            $data = ' '+ data[value.replace(/\{/,'').replace(/\}/,'')]+' ';
                            if(value.replace(/\{/,'').replace(/\}/,'') != 'editor'){
                                $data   = ' '+ html_entity_decode($data.trim())+' ';
                                $data   = stripslashes($data);
                                $data   = $data.replace(/\&nbsp\;/mg,' ');
                            }
                        }
                        if($data){
                            if($.isArray($data)){
                                $data   = $data.join(' ');
                            }
                            $data   = $data.trim();
                            if($data.length){
                                if(typeof html === 'object'){
                                    html.html(html.html().replace(regex,$data));
                                    var _reg    = /(\<img.*?src=[\"|\'](\s+?[^http]+.*?)[\"|\'].*?\/?\>)/g;
                                    if(html.html().match(/(\<img.*?src=[\"|\'])(\s+?[^http]+.*?)([\"|\'].*?\/?\>)/mg)){
                                        html.html(html.html().replace(/(\<img.*?src=[\"|\'])(\s+?)([^http]+.*?)([\"|\'].*?\/?\>)/mg,'$1'+$var.rootPath+'$3'.trim()+'$4'));
                                    }
                                }else{
                                    html   = html.replace(regex,$data);
                                    var _reg    = /(\<img.*?src=[\"|\'](\s+?[^http]+.*?)[\"|\'].*?\/?\>)/g;
                                    if(html.match(/(\<img.*?src=[\"|\'])(\s+)?([^http]+.*?)([\"|\'].*?\/?\>)/mg)){
                                        html    = html.replace(/(\<img.*?src=[\"|\'])(\s+)?([^http]+.*?)([\"|\'].*?\/?\>)/mg,'$1'+$var.rootPath+'$3$4');
                                    }
                                }
                            }
                        }
                    });
                }

                var $html   = html;
                if(typeof $html != 'object'){
                    $html   = $(html);
                }
                if($html.attr('data-element_type') == 'tz_row' || $html.attr('data-element_type') === 'tz_column'){
                    var $backgroundColor    = data['background_color'],
                        $backgroundImage    = data['background_image'];


                    // Create Html background image
                    if($backgroundImage && $backgroundImage.trim().length){
                        if(!$backgroundImage.match(/^http:\/\//i) && !$backgroundImage.match(/^www\./i)){
                            $backgroundImage    = $var.rootPath + $backgroundImage;
                        }
                        if($html.data('element_type') == 'tz_row'){
                            var $rowEditClone2   = $html.find('>.controls_row > .tz_row_edit_clone_delete');

                            if($rowEditClone2.find('>.tz_row_image').length){
                                $rowEditClone2.find('>.tz_row_image').css('background-image',$backgroundImage);
                            }else{
                                $rowEditClone2.append('<span data-toggle="jvc_tooltip" title="Row background image" style="background-image: url('
                                + $backgroundImage +');" class="tz_row_image"></span>');
                            }
                        }else{
                            var $rowEditClone2   = $html.find('>.tz_controls').first();
                            if($rowEditClone2.find('>.tz_column_image').length){
                                $rowEditClone2.find('>.tz_column_image').css('background-image',$backgroundColor);
                            }else{
                                $rowEditClone2.prepend('<span data-toggle="jvc_tooltip" title="Column background image" style="background-image: url('
                                + $backgroundImage +');" class="tz_column_image"></span>');
                            }
                        }
                    }else{
                        if($html.data('element_type') == 'tz_row'){
                            $html.find('>.controls_row > .tz_row_edit_clone_delete > .tz_row_image').remove();
                        }else{
                            $html.find('>.tz_controls > .tz_column_image').remove();
                        }
                    }

                    // Create Html background color
                    if($backgroundColor && $backgroundColor.trim().length){
                        if($html.data('element_type') == 'tz_row'){
                            var $rowEditClone   = $html.find('>.controls_row > .tz_row_edit_clone_delete');
                            if($rowEditClone.find('>.tz_row_color').length){
                                $rowEditClone.find('>.tz_row_color').css('background-color',$backgroundColor);
                            }else{
                                $rowEditClone.find('.column_toggle').after('<span data-toggle="jvc_tooltip" title="Row background color" style="background-color: '+
                                $backgroundColor +'" class="tz_row_color"></span>');
                            }
                        }else{
                            var $rowEditClone   = $html.find('>.tz_controls').first();
                            if($rowEditClone.find('>.tz_column_color').length){
                                $rowEditClone.find('>.tz_column_color').css('background-color',$backgroundColor);
                            }else{
                                $rowEditClone.find('.column_add').before('<span data-toggle="jvc_tooltip" title="Column background color" style="background-color: '+
                                $backgroundColor +'" class="tz_column_color"></span>');
                            }
                        }
                    }else{
                        if($html.data('element_type') == 'tz_row'){
                            $html.find('>.controls_row > .tz_row_edit_clone_delete > .tz_row_color').remove();
                        }else{
                            $html.find('>.tz_controls > .tz_column_color').remove();
                        }
                    }

                    if($html.attr('data-element_type') === 'tz_column'){
                        var $classKeys  = ['tz_col_lg_size','tz_col_md_size','tz_col_xs_size',
                            'tz_lg_offset_size','tz_md_offset_size','tz_sm_offset_size','tz_xs_offset_size'];
                        var $class = $.map(data,function(value,key){
                            if(key === 'width'){
                                var $colVal = eval(value) *12;
                                $html.attr('data-width',value);
                                return 'jvc_col-sm-' + $colVal;
                            }
                            if($.inArray(key,$classKeys) != -1 && value.length){
                                return value;
                            }
                        });
                        $html.addClass($class.join(' '));
                    }

                    if(typeof html === 'object'){
                        html = $html;
                    }else{
                        html    = $html[0];
                    }
                }
            }
            return html;
        }

        // Get data from input hidden
        $.jvcBuilder.getDataHidden = function(typeid,model,bool){
            var $model    = model;
            if($.jvcBuilder.model.id){
                $model   = $('[data-model-id='+ $.jvcBuilder.model.id +']');
            }
            if(model){
                if(typeof model != 'object'){
                    $model    = $(model);
                }else{
                    $model    = model;
                }
            }

            var $data   = {},
                $hiddens    = $model.find('> [type=hidden][name]');

            if($model.find('.tz_element-column[data-model-id]').length && !bool){
                $hiddens    = $model.find('.tz_element-column[data-model-id]').first().find('> [type=hidden][name]');
            }

            $hiddens.each(function(obj,item){
                var $name   = $(this).attr('name'),
                    $match  = $name.match(/\[\w+(\-)?\w+\]/gi);
                $match  = $match[$match.length - 1];
                $match  = $match.replace(/\[/,'').replace(/\]/,'');
                if($name.match(/\[\]$/gi)){
                    if(!$data[$match] || ($data[$match] && !$.isArray($data[$match]))){
                        $data[$match] = new Array();
                    }
                    $data[$match].push($(this).val());
                }else{
                    $data[$match]    = $(this).val();
                }
            });
            if(typeid && $data['typeid']){
                $data['typeid'] = typeid;
            }
            return $data;
        }



        /**
         * 2.2.2 Element's toolbar buttons click
         * -----------------------------------------------------------------------------
         */
            // Add element click function
//        $this.undelegate('.tz_control-btn-add','click')
//            .delegate('.tz_control-btn-add','click',function(){
//
//                var $el = $(this).parents('[data-model-id]').eq(0),
//                    $elItem  = $el.find('[data-model-id]');
//                if($elItem.length){
//                    if($('#tz_shortcode-template-accordion-tab').length){
//                        var $html   = $('#tz_shortcode-template-accordion-tab').clone(true).html();
//                        $html   = $.jvcBuilder.setIDHtml($html,'accordion',$elItem.eq(0).parent().find('>[data-model-id]').length);
//                        $html   = $.jvcBuilder.createDataModelIds($html);
//                        $elItem.eq(0).before($($html));
//                    }
//                }
//            });
        $this.undelegate('#tz_no-content-helper_'+$var.name,'click')
            .delegate('#tz_no-content-helper_'+$var.name,'click',function(){
                $.jvcBuilder.model.set('id','');
        });

        $this.undelegate('.tz_control-btn-prepend','click')
            .delegate('.tz_control-btn-prepend','click',function(){
                $.jvcBuilder.model.set('id',$(this).parents('[data-model-id]').eq(0).data('model-id'));

                var $modal  = $('#tz_add-shortcode');
                $modal.find('.tz_modal-body >iframe').attr('src',function(i,val){
                    if(val.match(/tzaddnew\=true/gi)){
                        return val.replace(/tzaddnew\=true/gi,'');
                    }else{
                        return val;
                    }
                }).one('load',function(){
                    $modal.modal('show');
                });
            });
        // Delete element click function
        $this.undelegate('.tz_control-btn-delete','click')
            .delegate('.tz_control-btn-delete','click',function(){
                var $btn    = $(this),
                    $message = confirm('Press OK to delete section, Cancel to leave'),
                    $el  = $(this).parents('[data-model-id][data-element_type]').first(),
                    $column = $el.parents('[data-model-id]').first();

                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('destroy')
                    .jvc_tooltip({"html": true,"container": "body"});

                if($message){
                    $.jvcBuilder.remove_mapper_item();
                    if(!$btn.parents('[data-model-id]').first().attr('data-element_type')){
                        if($btn.parents('[data-model-id]').eq(1).parent().children().length > 1){
                            if($btn.parents('[data-model-id]').first().attr('data-element-item-count') > 1){
                                parseInt($btn.parents('[data-model-id]').first().attr('data-element-item-count')).each(function(index){
                                    $el.find('[aria-control='+$btn.parents('[data-model-id]').first().attr('data-aria-control')+'-'+index+']').remove();
                                    $btn.parents('[data-model-id]').first().parent().remove();
                                });
                            }else{
                                $.jvcBuilder.remove_mapper_item($btn.parents('[data-model-id]').first());
                                $btn.parents('[data-model-id]').eq(1).remove();
                            }
                        }
                        else{
                            $.jvcBuilder.remove_mapper_item($el);
                            $el.remove();
                        }
                    }else{
                        $.jvcBuilder.remove_mapper_item($el);
                        $el.remove();
                    }
                    if(!$column.find('> .element_wrapper .tz_column_container').first().find('>[data-model-id]').length){
                        $column.addClass('tz_empty-column');
                        resetToEmptyColumn($column);
                    }
                    //if(!$column.find('> .element_wrapper >.tz_column_container >[data-model-id]').length){
                    //    $column.addClass('tz_empty-column');
                    //    resetToEmptyColumn($column);
                    //}

                }
                new $.jvcBuilder($this,$var);
            });

        // Add element click function
        $this.undelegate('.tz_control-btn-prepend','click')
            .delegate('.tz_control-btn-prepend','click',function(){

                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('destroy')
                    .jvc_tooltip({"html": true,"container": "body"});

                var $model  = $(this).parents('[data-model-id]').first();

                $.jvcBuilder.model.set('id',$model.attr('data-model-id'));
            });
        $this.undelegate('.tz_control-btn-add','click')
            .delegate('.tz_control-btn-add','click',function(){
                var $btn    = $(this),
                    $_el    = $btn.parents('[data-model-id]').first().find('[data-model-id][data-aria-control]').first(),
                    $el = $btn.parents('[data-model-id][data-element_type]').first(),
                    $guid   = guid(),
                    $id = $.jvcBuilder.createId($el.parent().find('>[data-model-id]').length);
                $.jvcBuilder.model.set('model',$el);
                if($el.attr('data-element-item-count')){
                    parseInt($el.attr('data-element-item-count')).each(function(index){
                        var $tmpl   = $('#template-jscontent-new-element-'+$el.data('element_id')+'-item-'+index).clone();
                        if($tmpl.length){
                            var $tmplHtml   = $tmpl.html();
                            $tmplHtml   = $.jvcBuilder.setIDHtml($tmplHtml,$el.parent().find('>[data-model-id]').length,$id,false,true,index);

                            if(index != (parseInt($el.attr('data-element-item-count')) - 1)){
                                if($el.find('[aria-control*=-'+index+']').length){
                                    if($el.find('[aria-control*=-'+index+']').parent().length){
                                        $tmplHtml   = $tmplHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid + '-' + index);
                                        var $tmplObj    = $($tmplHtml);
                                        $tmplObj   = $.jvcBuilder.createDataModelIds($tmplObj);
                                        $el.find('[aria-control*=-'+index+']').parent().append($tmplObj);
                                    }

                                }
                            }else{
                                var $elLast = $el.find('>.element_wrapper [data-model-id]').first();
                                if($elLast.length){
                                    if($elLast.parent().length){
                                        $tmplHtml   = $tmplHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid);
                                        var $tmplObj    = $($tmplHtml);
                                        $tmplObj   = $.jvcBuilder.createDataModelIds($tmplObj);
                                        //$.jvcBuilder.createInputNameHidden($tmplObj.find('[data-model-id]').last(),$el);
                                        $.jvcBuilder.insert_mapper_item($tmplObj.find('[data-model-id][data-aria-control]').first(),$_el,'',$.jvcBuilder.mapper[$_el.attr('data-model-id')],true);
                                        $elLast.parent().append($tmplObj);
                                    }
                                }
                            }
                        }
                    });
                    new $.jvcBuilder($this,$var);
                }else{
                    var $model    = $(this).parents('[data-model-id][data-aria-control],[data-model-id][data-element_type]').first();
                    $.jvcBuilder.model.set('id',$model.attr('data-model-id'));
                }
                $.jvcBuilder.model.reset();
            });
        // Edit element click function
        $this.undelegate('.tz_control-btn-edit','click')
            .delegate('.tz_control-btn-edit','click',function(){

                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                    .jvc_tooltip('hide').jvc_tooltip('disable');

                var $model    = $(this).parents('[data-model-id][data-aria-control],[data-model-id][data-element_type]').first();
                $.jvcBuilder.model.set('id',$model.attr('data-model-id'));
            });

        // Clone element click function
        $this.undelegate('.tz_control-btn-clone','click')
            .delegate('.tz_control-btn-clone','click',function(){

                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip")
                    .jvc_tooltip('hide').jvc_tooltip('disable');


                var $el  = $(this).parents('[data-model-id]').first(),
                    $elId = $(this).parents('[data-model-id][data-element_type]').first().data('element_id'),
                    $count  = null,
                    $guid   = guid(),
                    $id = $.jvcBuilder.createId($el.parent().find('>[data-model-id]').length),
                    $i  = 0;

                $.jvcBuilder.model.set('model',$el);

                if($el.attr('data-element-item-count')){
                    $count  = parseInt($el.attr('data-element-item-count'));
                }

                var $data   = $.jvcBuilder.mapper[$el.attr('data-model-id')];

                if($el.attr('data-aria-control') && $el.attr('data-aria-control').length){

                    if($count) {

                        $count.each(function(index) {

                            if(index != ($count - 1)){
                                var $newHtml = $('#template-jscontent-new-element-' + $elId + '-item-' + index).clone(true);

                                if($newHtml.length){
                                    $newHtml = $newHtml.html();

                                    $newHtml    = $newHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid + '-' + index);

                                    // Set value from extrafield for element
                                    $newHtml    = $.jvcBuilder.setValueExtrafield($newHtml,$data['params']);

                                    //// Set typeid (override [typeid][/typeid] to random string )
                                    $newHtml = $.jvcBuilder.setIDHtml($newHtml, $el.parent().find('>[data-model-id]').length, $id,null,null,index);

                                    $el.parents('[data-model-id][data-element_type]').first()
                                        .find('[aria-control='+$el.attr('data-aria-control')+'-'+index+']').first()
                                        .after($newHtml);

                                }
                            }else{
                                var $el2 = $el.parents('[data-model-id]').first(),
                                    $newHtml = $($el2).jscontent_htmlTree({
                                        jvcBuilder: $.jvcBuilder,
                                        parent_element_object: $el2.parents('[data-model-id][data-element_type],[data-model-id][data-aria-control]').first()
                                    });

                                // Set typeid (override [typeid][/typeid] to random string )
                                $newHtml = $.jvcBuilder.setIDHtml($newHtml, $el.parent().find('>[data-model-id]').length, $id,null,null,index);

                                $newHtml    = $newHtml.replace(/\[modelid\]\[\/modelid\]/gi,$guid);

                                $newHtml    = $($newHtml);

                                $.jvcBuilder.insert_mapper_item($newHtml.find('[data-model-id][data-aria-control]').first(),'',$el2.parents('[data-model-id][data-element_type],[data-model-id][data-aria-control]').first(),$data);

                                $el2.after($newHtml[0]);

                            }
                        });
                    }
                }else{
                    var $newHtml    = $($el).jscontent_htmlTree({
                        jvcBuilder         : $.jvcBuilder,
                        parent_element_object   : $el.parents('[data-model-id][data-element_type],[data-model-id][data-aria-control]').first()
                    });

                    // Set parent id
                    if($newHtml.match(/(\[parentid[0-9+]?\].*?\[\/parentid[0-9+]?\])/mgi)){
                        var $matches    = $newHtml.match(/(\[parentid[0-9+]?\].*?\[\/parentid[0-9+]?\])/mgi);

                        $.each($matches,function(index,value){
                            var regex   = '/'+tzaddslashes(value)+'/gi';
                            regex   = eval(regex);
                            if(regex.exec($newHtml)){
                                $newHtml   = $newHtml.replace(regex,uniqid());
                            }
                        });

                    }else{
                        if($newHtml.match(/(\[\/parentid[0-9+]?\])/mgi)){
                            var $matches    = $newHtml.match(/(\[\/parentid[0-9+]?\])/mgi);
                            $.each($matches,function(index,value){
                                var regex   = '/'+tzaddslashes(value)+'/gi';
                                regex   = eval(regex);
                                if(regex.exec($newHtml)){
                                    $newHtml   = $newHtml.replace(regex,uniqid());
                                }
                            });
                        }
                    }

                    $newHtml    = $($newHtml);
                    $el.after($newHtml[0]);
                }

                $.jvcBuilder.model.reset();
                $this.find("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('enable');

                new $.jvcBuilder($this,$var);
            });

        // Clone html in box
        function cloneHtmlInBox(obj){
            // Check children element
            if(obj.find('> [data-model-id][data-element_type]').length){
                var $childElements  = obj.clone(true).find('> [data-model-id][data-element_type]'),
                    $time   = new Date(),
                    $_newHtml   = '',
                    $modelId    = obj.parents('[data-model-id]').eq(0).data('model-id');

                $childElements.each(function(index,value){
                    var $child  = $(this);

                    if($('#tmpl-jscontent-new-element-' + $child.attr('data-element_id')).length){
                        var $id = $.jvcBuilder.createId(obj.parents('[data-model-id]').eq(0).children().length);

                        // Get value from form's html
                        var $data   = $.jvcBuilder.getDataHidden($id,$child),
                            $newHtml = getNewHtml($child,obj.parents('[data-model-id]').eq(0),$id,$data);

                        // Set value from extrafield for element
                        $newHtml   = $.jvcBuilder.setValueExtrafield($newHtml,$data);

                        if($child.find('[data-model-id][data-element_type]').first().parent()
                                .find('> [data-model-id][data-element_type]').length){
                            var $childElements2 = $child.find('[data-model-id][data-element_type]').first().parent().find('>[data-model-id][data-element_type]'),
                                $_newHtml2   = '';
                            $childElements2.each(function(index,value){
                                var $child2 = $(this);

                                if($('#tmpl-jscontent-new-element-' + $child2.attr('data-element_id')).length){

                                    var $id2 = $.jvcBuilder.createId($child.children().length);

                                    // Get value from form's html
                                    var $data2   = $.jvcBuilder.getDataHidden($id2,$child2),
                                        $newHtml2 = getNewHtml($child2,$child,$id2,$data2);

                                    // Set value from extrafield for element
                                    $newHtml2   = $.jvcBuilder.setValueExtrafield($newHtml2,$data2);

                                    if($child2.find('[data-model-id][data-element_type]').first().parent()
                                            .find('> [data-model-id][data-element_type]').length){
                                        var $childElements3 = $child2.find('[data-model-id][data-element_type]').first().parent().find('>[data-model-id][data-element_type]'),
                                            $_newHtml3   = '',
                                            $guid3   = guid();
                                        $childElements3.each(function(){
                                            var $child3 = $(this);

                                            if($('#tmpl-jscontent-new-element-' + $child3.attr('data-element_id')).length){
                                                var $id3 = $.jvcBuilder.createId($child2.children().length);

                                                // Get value from form's html
                                                var $data3   = $.jvcBuilder.getDataHidden($id3,$child3),
                                                    $newHtml3 = getNewHtml($child3,$child2,$id3,$data3);

                                                ///////// Create element's item count ////////////
                                                // Element clone click
                                                var $newElHtml3  = $('#tmpl-jscontent-new-element-' + $child3.data('element_id')).clone(),
                                                    $newElObj3   = $($newHtml3.html()),
                                                    $childEls3    = $child3.find('>.element_wrapper [data-model-id]').first()
                                                        .parent().find('>[data-model-id]'),
                                                    $count3 = 0;

                                                if($child3.attr('data-element-item-count')){
                                                    $count3  = parseInt($child3.attr('data-element-item-count'));
                                                }

                                                if(!$childEls3.length){
                                                    $childEls3   = $child3;
                                                }

                                                // Check children element in current box
                                                if($childEls3.length){
                                                    $childEls3.each(function(childIndex3){
                                                        var $childEl3    = $(this),
                                                            $guid3   = guid(),
                                                            $childId3 = $.jvcBuilder.createId($childEls3.length);

                                                        var $childData3   = $.jvcBuilder.getDataHidden($childId3,$childEl3);

                                                        if($count3){
                                                            $count3.each(function(cIndex){
                                                                var $newElItemObj3  =  $('#template-jscontent-new-element-' + $child3.attr('data-element_id') + '-item-' + cIndex).clone(),
                                                                    $newElItemHtml3  =  '';

                                                                $newElItemObj3   = $.jvcBuilder.createDataModelIds($newElItemObj3);
                                                                $newElItemHtml3  =  $newElItemObj3.html();

                                                                // Set typeid (override [typeid][/typeid] to random string)
                                                                $newElItemHtml3  = $.jvcBuilder.setIDHtml($newElItemHtml3,$childEls3.length,$childId3);

                                                                // Set value from extrafield for element
                                                                $newElItemHtml3    = $.jvcBuilder.setValueExtrafield($newElItemHtml3,$childData3);

                                                                if(cIndex != ($count3 - 1)){
                                                                    $newElItemHtml3  = $newElItemHtml3.replace(/\[modelid\]\[\/modelid\]/gi,$guid3 + '-' + cIndex);
                                                                    if($newElObj3.find('[aria-control=\\[modelid\\]\\[\\/modelid\\]]').length){
                                                                        $newElObj3.find('[aria-control=\\[modelid\\]\\[\\/modelid\\]]').first().parent().append($newElItemHtml3);
                                                                    }
                                                                }else{
                                                                    $newElItemHtml3  = $newElItemHtml3.replace(/\[modelid\]\[\/modelid\]/gi,$guid3);
                                                                    var $newEItemObj3    = $($newElItemHtml3).clone();

                                                                    // Check children element in element item
                                                                    if($childEl3.find('[data-model-id][data-element_type]').length){
                                                                        var $newChildElItem3 = cloneHtmlInBox($childEl3.find('.element_wrapper').first().find('>.tz_column_container'));
                                                                        if($newChildElItem3.length){
                                                                            var $childExtrafields3    = $newChildElItem3.match(/(\{.*?\})/mgi);
                                                                            if($childExtrafields3 && $childExtrafields3.length){
                                                                                $childExtrafields3.each(function(value,exIndex){
                                                                                    var regex   = '/('+value.replace(/\{/,'\\{').replace(/\}/,'\\}')+')/gi';
                                                                                    regex   = eval(regex);
                                                                                    if($data[value.replace(/\{/,'').replace(/\}/,'')]){
                                                                                        $newChildElItem3 = $newChildElItem3.replace(regex,$data[value.replace(/\{/,'').replace(/\}/,'')]);
                                                                                    }
                                                                                });
                                                                            }

                                                                            $.jvcBuilder.removeEmptyColumn($newEItemObj3.find('.element_wrapper').first().parent());
                                                                            $newEItemObj3.find('.element_wrapper').first().find('>.tz_column_container').append($newChildElItem3);
                                                                        }
                                                                    }

                                                                    $newEItemObj3 = $.jvcBuilder.createDataModelIds($newEItemObj3);
                                                                    $.jvcBuilder.createInputNameHidden($newEItemObj3.find('.tz_element-column').first(),$child3.parents('[data-model-id]').first(),$childData3);
                                                                    $newElObj3.find('[data-model-id]').first().parent().append($newEItemObj3);
//
                                                                    if(childIndex3 == ($childEls3.length - 1)){
                                                                        $newElObj3.find('[aria-control=\\[modelid\\]\\[\\/modelid\\]]').remove();
                                                                        $newElObj3.find('[data-model-id]').first().parent().find('>[data-model-id]').first().remove();
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });

                                                    // Append element
                                                    $newHtml3.html($newElObj3.html());
                                                }
                                                /////////////////////////////////////////////////////////////////////



                                                // Set value from extrafield for element
                                                $newHtml3   = $.jvcBuilder.setValueExtrafield($newHtml3,$data3);

                                                if($child3.find('[data-model-id][data-element_type]').first().parent()
                                                        .find('> [data-model-id][data-element_type]').length){
                                                    var $childElements4 = $child3.find('[data-model-id][data-element_type]').first().parent().find('>[data-model-id][data-element_type]'),
                                                        $_newHtml4   = '';
                                                    $childElements4.each(function(){
                                                        var $child4 = $(this);

                                                        if($('#tmpl-jscontent-new-element-' + $child4.attr('data-element_id')).length){
                                                            var $id4 = $.jvcBuilder.createId($child3.children().length);

                                                            // Get value from form's html
                                                            var $data4   = $.jvcBuilder.getDataHidden($id4,$child4),
                                                                $newHtml4 = getNewHtml($child4,$child3,$id4,$data4);

                                                            // Set value from extrafield for element
                                                            $newHtml4   = $.jvcBuilder.setValueExtrafield($newHtml4,$data4);

                                                            if($child4.find('[data-model-id][data-element_type]').first().parent()
                                                                    .find('> [data-model-id][data-element_type]').length){
                                                                var $childElements5 = $child4.find('[data-model-id][data-element_type]').first().parent().find('>[data-model-id][data-element_type]'),
                                                                    $_newHtml5   = '';
                                                                $childElements5.each(function(){
                                                                    var $child5 = $(this);

                                                                    if($('#tmpl-jscontent-new-element-' + $child5.attr('data-element_id')).length){
                                                                        var $id5 = $.jvcBuilder.createId($child4.children().length);

                                                                        // Get value from form's html
                                                                        var $data5   = $.jvcBuilder.getDataHidden($id5,$child5),
                                                                            $newHtml5 = getNewHtml($child5,$child4,$id5,$data5);

                                                                        // Set value from extrafield for element
                                                                        $newHtml5   = $.jvcBuilder.setValueExtrafield($newHtml5,$data5);

                                                                        $_newHtml5   += $newHtml5.html();
                                                                    }
                                                                });

                                                                if($_newHtml5.length){
                                                                    if($newHtml4.find('.element_wrapper').last().find(' > .tz_column_container').length){
                                                                        $.jvcBuilder.removeEmptyColumn($newHtml4.find('.element_wrapper').last().parent());
                                                                        $newHtml4.find('.element_wrapper').last().find(' > .tz_column_container').append($_newHtml5);
                                                                    }else{
                                                                        if($newHtml4.find('.element_wrapper').last().find(' > .tz_row_container').length){
                                                                            $.jvcBuilder.removeEmptyColumn($newHtml4.find('.element_wrapper').last().parent());
                                                                            $newHtml4.find('.element_wrapper').last().find(' > .tz_row_container').append($_newHtml5);
                                                                        }else{
                                                                            $newHtml4.find('.element_wrapper').last().append($_newHtml5);
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                            $_newHtml4   += $newHtml4.html();
                                                        }
                                                    });

                                                    if($_newHtml4.length){
                                                        if($newHtml3.find('.element_wrapper').last().find(' > .tz_column_container').length){
                                                            $.jvcBuilder.removeEmptyColumn($newHtml3.find('.element_wrapper').last().parent());
                                                            $newHtml3.find('.element_wrapper').last().find(' > .tz_column_container').append($_newHtml4);
                                                        }else{
                                                            if($newHtml3.find('.element_wrapper').last().find(' > .tz_row_container').length){
                                                                $.jvcBuilder.removeEmptyColumn($newHtml.find('.element_wrapper').last().parent());
                                                                $newHtml3.find('.element_wrapper').last().find(' > .tz_row_container').append($_newHtml4);
                                                            }else{
                                                                $newHtml3.find('.element_wrapper').last().append($_newHtml4);
                                                            }
                                                        }
                                                    }
                                                }

                                                $_newHtml3   += $newHtml3.html();
                                            }
                                        });

                                        if($_newHtml3.length){
                                            if($newHtml2.find('.element_wrapper').last().find(' > .tz_column_container').length){
                                                $.jvcBuilder.removeEmptyColumn($newHtml2.find('.element_wrapper').last().parent());
                                                $newHtml2.find('.element_wrapper').last().find(' > .tz_column_container').append($_newHtml3);
                                            }else{
                                                if($newHtml2.find('.element_wrapper').last().find(' > .tz_row_container').length){
                                                    $.jvcBuilder.removeEmptyColumn($newHtml2.find('.element_wrapper').last().parent());
                                                    $newHtml2.find('.element_wrapper').last().find(' > .tz_row_container').append($_newHtml3);
                                                }else{
                                                    $newHtml2.find('.element_wrapper').last().append($_newHtml3);
                                                }
                                            }
                                        }
                                    }

                                    if($newHtml2.data('element_type') == 'tz_row'){
                                        var $parentCount    = 0;
                                        if(obj.parents('[data-model-id][data-element_type=tz_row]').length){
                                            $parentCount   = obj.parents('[data-model-id][data-element_type=tz_row]').length;
                                            if($parentCount % 2 == 1){
                                                $newHtml2.addClass('tz_row-inner');
                                            }
                                        }
                                    }

                                    $_newHtml2   += $newHtml2.html();
                                }
                            });

                            if($_newHtml2.length){
                                if($newHtml.find('.element_wrapper').last().find(' > .tz_column_container').length ){
                                    $.jvcBuilder.removeEmptyColumn($newHtml.find('.element_wrapper').last().parent());
                                    $newHtml.find('.element_wrapper').last().find(' > .tz_column_container').append($_newHtml2);
                                }else{
                                    if($newHtml.find('.element_wrapper').last().find(' > .tz_row_container').length){
                                        $.jvcBuilder.removeEmptyColumn($newHtml.find('.element_wrapper').last().parent());
                                        $newHtml.find('.element_wrapper').last().find(' > .tz_row_container').append($_newHtml2);
                                    }else{
                                        $newHtml.find('.element_wrapper').last().append($_newHtml2);
                                    }
                                }
                            }
                        }

                        if($newHtml.data('element_type') == 'tz_row'){
                            var $parentCount    = 0;
                            if(obj.parents('[data-model-id][data-element_type=tz_row]').length){
                                $parentCount   = obj.parents('[data-model-id][data-element_type=tz_row]').length;
                                if($parentCount % 2 == 1){
                                    $newHtml.addClass('tz_row-inner');
                                }
                            }
                        }

                        $_newHtml   += $newHtml.html();
                    }
                });
                return $_newHtml;
            }

        };

        function getNewHtml(child,parentChild,id,data){
            if($('#tmpl-jscontent-new-element-' + child.attr('data-element_id')).length){
                var $childTempObj  = $('#tmpl-jscontent-new-element-' + child.attr('data-element_id')).clone(),
                    $childTempHtml  = $childTempObj.html().trim();

                // Replace [typeid][/typeid] to random string
                if($childTempHtml.match(/(\[typeid[0-9+]?\].*?\[\/typeid[0-9+]?\])/mgi)){
                    var $childTmpHtml = $childTempHtml;
                    if(id){
                        $childTmpHtml   = $.jvcBuilder.setIDHtml($childTempHtml);
                    }else{
                        if(parentChild.length){
                            $childTmpHtml   = $.jvcBuilder.setIDHtml($childTempHtml,parentChild.children().length,id);
                        }else{
                            $childTmpHtml   = $.jvcBuilder.setIDHtml($childTempHtml);
                        }
                    }
                    $childTempHtml  = $childTmpHtml.replace(/\[loop\]/,'').replace(/\[\/loop\]/,'');
                }

                // Replace [type][/type]
                if($childTempHtml.match(/(\[type\].*?\[\/type\])/mgi)){

                    $childTempHtml = $childTempHtml
                        .replace(/(\[type\].*?\[\/type\])/mgi,'<div data-toggle="modal"'
                        +' data-target="#tz_add-shortcode" class="tz_column_container'
                        +' tz_container_for_children tz_empty-container fancybox fancybox.iframe">'
                        +'<i class="jvc_fa jvc_fa-plus"></i>'
                        +'</div>');
                }
                var $childTempHtmlObj   = $('<div></div>').append($childTempHtml);
                if(parentChild && parentChild.length){
                    $.jvcBuilder.createInputNameHidden($childTempHtmlObj.children(),parentChild,data);
                }

                return $childTempHtmlObj;
            }
        }

        // Show modal shortcode type
        $this.undelegate('.tz_empty-container','click')
            .delegate('.tz_empty-container','click',function(){
                $.jvcBuilder.model.set('id',$(this).parents('[data-model-id]').first().attr('data-model-id'));
            });

        $('#jscontent_toolbar_'+$var.name).undelegate('[data-toggle="jvc_tab"]','show.bs.jvc_tab')
            .delegate('[data-toggle="jvc_tab"]','show.bs.jvc_tab', function (e) {
                var $content_obj    = $('#jscontent_content_'+$var.name);
                if($(this).parent().data('button-type') == 'preview'){
                    var $data_obj       = {},
                        $mapper         = $.jvcBuilder.mapper;
                    //$content_object    = $('#jscontent_content_'+$var.name);
                    if($content_obj.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').length){
                        $data_obj={};
                        $content_obj.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').each(function(){
                            $data_obj[$(this).attr('data-model-id')]    = $.jvcBuilder.mapper[$(this).attr('data-model-id')];
                        });

                        $var.defaults.layout_content[$var.name] = $content_obj.children().detach();

                        if($var.ajax_loading_html.length) {
                            $($var.previewer.name).empty().append($var.ajax_loading_html);
                        }

                        var $shortcodes = $.jscontent_shortcode_tree($data_obj, $var.rootPath);

                        $.ajax({
                            type: 'POST',
                            url:  'index.php?option=com_jvisualcontent&view=shortcodes&task=shortcodes.generate',
                            data: {
                                shortcodes  : $shortcodes
                            }
                        }).done(function(data){
                            if(data) {
                                $($var.previewer.name).empty().append(data);
                            }
                        });
                    }
                }else{
                    if($var.defaults.layout_content[$var.name]){
                        $var.defaults.layout_content[$var.name].appendTo($content_obj);
                    }
                    $($var.previewer.name).empty();
                    //$content_object = null;
                    //$("[data-toggle~=\'jvc_popover\']").jvc_popover("destroy");
                    //$("[data-toggle~=\'jvc_tooltip\'],.hasTooltip").jvc_tooltip('destroy')
                    //    .jvc_tooltip({"html": true,"container": "body"});
                }
                new $.jvcBuilder($this,$var);
            });


        document.adminForm.onsubmit = function(){
            var $content_obj    = $('#jscontent_content_'+$var.name),
                $data_obj       = {},
                $mapper         = $.jvcBuilder.mapper;
            if(typeof $var.defaults.layout_content[$var.name] != 'undefined' && $var.defaults.layout_content[$var.name]){
                $content_obj.append($var.defaults.layout_content[$var.name]);
            }
            if($content_obj.length && $content_obj.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').length){
                $content_obj.find('[data-model-id][data-element_type],[data-model-id][data-aria-control]').each(function(){
                    $data_obj[$(this).attr('data-model-id')]    = $mapper[$(this).attr('data-model-id')];
                });
            }
            var $shortcode = $.jscontent_shortcode_tree($data_obj, $var.rootPath);
            if($shortcode.length){
                $("iframe[id*="+$var.name+"]").contents().find("body").empty().focus().html($shortcode);
                $('#'+$var.name).val($shortcode).html($shortcode);
            }else{

                $("iframe[id*="+$var.name+"]").contents().find("body").empty().focus().html('');
                $('#'+$var.name).val($shortcode).html('');
            }
        }

        $.jvcBuilder.prepare_mapper   = function(){
            if($.jvcBuilder.mapper){
                $.jvcBuilder.mapper = $.each($.jvcBuilder.mapper,function(index,param){
                    var $param  = param;
                    if($this.find('[data-model-id='+param['id']+']').length){
                        var $model  = $this.find('[data-model-id='+param['id']+']').first();
                        if($model.parents('[data-model-id][data-aria-control],[data-model-id][data-element_type]').length){
                            $.jvcBuilder.mapper[param['id']]['parent_id'] = $model.parents('[data-model-id][data-aria-control],[data-model-id][data-element_type]')
                                .first().attr('data-model-id');
                        }
                    }
                });
            }
        };

        function prepare_row(){
            if($this.find('[data-model-id][data-element_type=tz_row]').length){
                $this.find('[data-model-id][data-element_type=tz_row]').each(function(){
                    var $row_count  = 0;
                    if($(this).parents('[data-model-id][data-element_type=tz_row]').length){
                        $row_count  = $(this).parents('[data-model-id][data-element_type=tz_row]').length;
                        if($row_count % 2 == 1){
                            $(this).addClass('tz_row-inner');
                        }
                    }
                });
            }
        }
        if($var.once_prepare_mapper) {
            $.jvcBuilder.prepare_mapper();
            prepare_row();
            $.setActiveLayoutButton();
            $var.once_prepare_mapper    = false;
        }
    };
    // Create jvcBuilder object
    $.jvcBuilder.defaults  = { // This is default option of object jvcBuilder
        name                : "",
        rootPath            : "",
        token               : "",
        layout_content      : {},
        once_prepare_mapper : false,
        ajax_loading_html   : '<div id="fadingBarsG"><div id="fadingBarsG_1" class="fadingBarsG"></div>'+
        '<div id="fadingBarsG_2" class="fadingBarsG"></div><div id="fadingBarsG_3" class="fadingBarsG">'+
        '</div><div id="fadingBarsG_4" class="fadingBarsG"></div><div id="fadingBarsG_5" class="fadingBarsG">'+
        '</div><div id="fadingBarsG_6" class="fadingBarsG"></div><div id="fadingBarsG_7" class="fadingBarsG">'+
        '</div><div id="fadingBarsG_8" class="fadingBarsG"></div></div>',
        jInsertEditorText   : function(html){}
    },
        $.jvcBuilder.mapper      = { // This is object to save element's values
            //'key'   : { // key are element's model id
            //    'id'        : '', // id is element's model id
            //    'name'      : '', // element shortcode type
            //    'parent_id' : '', // this is parent element's model id
            //    'params'    : {}, // These are extrafields and value of extrafields
            //    'shortcode' : '' // This is shortcode. Exampled:[tz_row][/tz_row]
            //}
        },
        $.jvcBuilder.get     = function(key){
            if($.jvcBuilder[key]){
                return $.jvcBuilder[key];
            }
            return;
        },
        $.jvcBuilder.model   = { // This is object save current object to process task
            'id'                : ''
            ,'toolbar_position' : ''
            ,'modelRemember'    : '',
            'model'             : '',
            set                 : function(key,value){
                if(key){
                    $.jvcBuilder.model[key]   = value;
                }else{
                    $.jvcBuilder.model['id']  = value;
                }
            },
            get                 : function(key){
                if($.jvcBuilder.model[key]){
                    return $.jvcBuilder.model[key];
                }
                return '';
            },
            get_model   : function(){
                if($.jvcBuilder.model.id){
                    return $('[data-model-id=' + $.jvcBuilder.model.id +']');
                }else{
                    if($.jvcBuilder.model.model){
                        return $.jvcBuilder.model.model;
                    }
                }
                return false;
            },
            // Reset attribute of object layouts
            reset : function(key){
                if(key){
                    $.jvcBuilder.model[key]  = '';
                }else{
                    $.jvcBuilder.model.id    = '';
                }
            }
        },
        $.jvcBuilder.preview_add_html   = function(dir,html){
            var $dir    = dir;
            if(!$.isPlainObject(dir)){
                $dir    = $(dir);
            }
            if($dir.length && html && html.length){
                $dir.html(html);
            }
            return;
        },
        $.jvcBuilder.previewer   = { // This is object to save preview's html
            'model-id'  : {
                'parent_id' : '', // this is parent element's model id
                'html'      : ''
            } // value is html, model-id are element's model id
        },
        $.jvcBuilder.createDataModelIds = function(obj,current_id){

            var $item   = obj,
                $guid    = guid(),
                $cur_guid    = '',
                $str    = '',
                $toggleButton   = '';
            if(typeof $item != 'object'){
                $item   = $(obj).clone(true);
            }

            $item   = $($item);

            if(typeof $item == 'object' && $item.find('.column_toggle') && $item.find('.column_toggle').length){
                $toggleButton   = $item.find('.column_toggle');
            }

            if(current_id){
                $cur_guid   = $.jvcBuilder.model.get('id');
                var $model      = $.jvcBuilder.model.get_model();

                if($model.attr('data-aria-control')){
                    if($item.attr('data-aria-control')){
                        $item.attr('data-model-id',$cur_guid);
                    }else{
                        if($item.find('[data-aria-control]').length){
                            $item.attr('data-model-id',guid());
                            $item.find('[data-aria-control]').first().attr('data-model-id',$cur_guid);
                        }
                    }
                }else{
                    if($item.attr('data-element_type')){
                        $item.attr('data-model-id',$cur_guid);
                    }else{
                        if($item.find('[data-aria-control]').length){
                            var $aria_controls  = $model.find('[data-model-id][data-aria-control]');
                            $item.find('[data-aria-control]').each(function(index){
                                $(this).attr('data-model-id',$aria_controls.eq(index).attr('data-model-id'));
                            });
                        }
                    }
                }
            }else{
                if($item.attr('data-model-id')){
                    $item.attr('data-model-id', $guid);
                }

                if($item.find('[data-model-id]').length){
                    $item.find('[data-model-id]').each(function(){
                        //$(this).attr('data-model-id',guid());
                        //if(!current_id || (current_id && !$(this).attr('data-element_type') && !$(this).attr('data-aria-control'))){
                        //$(this).attr('data-model-id', $cur_guid);
                        //}
                        //else{
                        $(this).attr('data-model-id', guid());
                        //}
                    });
                }
                //else{
                //    if($cur_guid && $item.attr('data-model-id')){
                //        $item.attr('data-model-id', $cur_guid);
                //    }
                //}
            }


            if($toggleButton.length && $toggleButton.attr('data-target')){
                if($toggleButton.attr('data-target').length){
                    if($toggleButton.attr('data-target').match(/\[data-model-id=.*?\]/)){
                        if($cur_guid) {
                            $toggleButton.attr('data-target',
                                $toggleButton.attr('data-target')
                                    .replace(/((\[data-model-id=[\"|\'])(.*?)([\"|\']\]))/, '$2' + $cur_guid + '$4'));
                        }else {
                            $toggleButton.attr('data-target',
                                $toggleButton.attr('data-target')
                                    .replace(/((\[data-model-id=[\"|\'])(.*?)([\"|\']\]))/, '$2' + $guid + '$4'));
                        }
                    }
                }
            }
            return $item;
        };

    $.fn.jvcBuilder    = function(options){
        if (options === undefined) options = {};
        if (typeof options === "object") {
            return new $.jvcBuilder(this,options);
        }
    };


    //$.fn.update = function(){
    //    var newElements = $(this.selector),i;
    //    for(i=0;i<newElements.length;i++){
    //        this[i] = newElements[i];
    //    }
    //    for(;i<this.length;i++){
    //        this[i] = undefined;
    //    }
    //    this.length = newElements.length;
    //    return this;
    //};
})(jQuery);