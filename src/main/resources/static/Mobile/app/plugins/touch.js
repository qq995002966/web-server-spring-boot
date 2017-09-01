$(function () {
  $.fn.touch = function (opts, upCB, downCB, leftCB, rightCB) {
    var touch = this,
      opts = $.extend({
        up: false,
        down: false,
        right: false,
        left: false
      }, opts);

    touch.isTouchDevice = function () {
      var supportsTouch = false;
      if ('ontouchstart' in window) {
        //iOS & android
        supportsTouch = true;
      } else if (window.navigator.msPointerEnabled) {
        //Win8
        supportsTouch = true;
      }
      return supportsTouch;
    };
    return this.each(function () {
      if ($(this).length == 0) {
        return
      }
      var root = $(this);
      var fixAndroidTouch = function (e) {
        if (navigator.userAgent.match(/Android/i)) {
          e.preventDefault();
          console.log(e.preventDefault());
        }
      };
      root.bind('touchstart', function (e) {
        fixAndroidTouch(e);
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
      });
      root.bind('touchend', function (e) {
        fixAndroidTouch(e);
        endX = e.originalEvent.changedTouches[0].pageX;
        endY = e.originalEvent.changedTouches[0].pageY;
        if (endX - startX > 0 && opts.right) {
          rightCB();
        }
        if (endX - startX < 0 && opts.left) {
          leftCB()
        }
        if (endY - startY > 0 && opts.down) {
          downCB();
        }
        if (endY - startY < 0 && opts.up) {
          upCB();
        }
      })
    })
  }
});