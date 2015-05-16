/* ========================================================================
 * Bootstrap: dropdown.js v3.3.4
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.jvc_dropdown-backdrop'
  var toggle   = '[data-toggle="jvc_dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.jvc_dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.4'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.jvc_disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('jvc_open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.jvc_navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="jvc_dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.jvc_dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('jvc_open')
        .trigger('shown.bs.jvc_dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.jvc_disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('jvc_open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('jvc_open')) return

      $parent.trigger(e = $.Event('hide.bs.jvc_dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('jvc_open').trigger('hidden.bs.jvc_dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.jvc_dropdown')

      if (!data) $this.data('bs.jvc_dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.jvc_dropdown

  $.fn.jvc_dropdown             = Plugin
  $.fn.jvc_dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.jvc_dropdown.noConflict = function () {
    $.fn.jvc_dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.jvc_dropdown.data-api', clearMenus)
    .on('click.bs.jvc_dropdown.data-api', '.jvc_dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.jvc_dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.jvc_dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.jvc_dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.jvc_dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);
