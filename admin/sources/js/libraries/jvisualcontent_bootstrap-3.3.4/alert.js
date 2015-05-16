/* ========================================================================
 * Bootstrap: alert.js v3.3.4
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="jvc_alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.4'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.jvc_alert')
    }

    $parent.trigger(e = $.Event('close.bs.jvc_alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('jvc_in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.jvc_alert').remove()
    }

    $.support.transition && $parent.hasClass('jvc_fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.jvc_alert')

      if (!data) $this.data('bs.jvc_alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.jvc_alert

  $.fn.jvc_alert             = Plugin
  $.fn.jvc_alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.jvc_alert.noConflict = function () {
    $.fn.jvc_alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.jvc_alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
