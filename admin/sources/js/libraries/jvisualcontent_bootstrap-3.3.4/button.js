/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.4'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="jvc_buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('jvc_active')) changed = false
        else $parent.find('.jvc_active').removeClass('jvc_active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('jvc_active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('jvc_active'))
    }

    if (changed) this.$element.toggleClass('jvc_active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.jvc_button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.jvc_button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.jvc_button

  $.fn.jvc_button             = Plugin
  $.fn.jvc_button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.jvc_button.noConflict = function () {
    $.fn.jvc_button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.jvc_button.data-api', '[data-toggle^="jvc_button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('jvc_btn')) $btn = $btn.closest('.jvc_btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.jvc_button.data-api blur.bs.jvc_button.data-api', '[data-toggle^="jvc_button"]', function (e) {
      $(e.target).closest('.jvc_btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
