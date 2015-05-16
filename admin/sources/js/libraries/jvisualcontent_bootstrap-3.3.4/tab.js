/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.4'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.jvc_dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('jvc_active')) return

    var $previous = $ul.find('.jvc_active:last a')
    var hideEvent = $.Event('hide.bs.jvc_tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.jvc_tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.jvc_tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.jvc_tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .jvc_active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('jvc_fade')) || !!container.find('> .jvc_fade').length)

    function next() {
      $active
        .removeClass('jvc_active')
        .find('> .jvc_dropdown-menu > .jvc_active')
          .removeClass('jvc_active')
        .end()
        .find('[data-toggle="jvc_tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('jvc_active')
        .find('[data-toggle="jvc_tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('jvc_in')
      } else {
        element.removeClass('jvc_fade')
      }

      if (element.parent('.jvc_dropdown-menu').length) {
        element
          .closest('li.jvc_dropdown')
            .addClass('jvc_active')
          .end()
          .find('[data-toggle="jvc_tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('jvc_in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.jvc_tab')

      if (!data) $this.data('bs.jvc_tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.jvc_tab

  $.fn.jvc_tab             = Plugin
  $.fn.jvc_tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.jvc_tab.noConflict = function () {
    $.fn.jvc_tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.jvc_tab.data-api', '[data-toggle="jvc_tab"]', clickHandler)
    .on('click.bs.jvc_tab.data-api', '[data-toggle="jvc_pill"]', clickHandler)

}(jQuery);
