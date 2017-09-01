$(function () {
  // full page scroll plugin
  $.fn.fullPage = function (opts, cb) {
    // default options
    var opts = $.extend({
      hideGoToIndex: '',
      zindex: 900,
      height: '100%',
      delayTime: 1000,
      autoScrollElement: ''
    }, opts);

    var root = $(this).children('.section'),
      name = ['fullpage-controller', 'bottom-text', 'go-to-content'],
      mouseWheel = 'DOMMouseScroll mousewheel touchmove',
      dom = {
        controller: '<div class="' + name[0] + '">',
        controllerItem: '',
        goToContent: '<div class="go-to-content"></div>'
      };
    $(this).addClass('fullpage');

    // scroll section
    function scroll(currentSectionIndex, direction, num) {
      if (root.is(':animated')) {
        return false;
      }
      var thisSection = root.eq(currentSectionIndex);
      if (direction == 'up') {
        if (currentSectionIndex == root.length - 1) {
          root.unbind();
          return false;
        }
        root.eq(currentSectionIndex + num).removeClass('static-section');
        $('body').css('overflow-y', 'hidden');
        if (currentSectionIndex + num == root.length - 1) {
          $('.header').addClass('fixed-header');
          $('.' + name[0]).css('display', 'none');
          $('body').css('overflow-y', 'auto');
          root.eq(currentSectionIndex + num).addClass('static-section')
          $('body').scrollTop(0);
        }
        toggleToGo(currentSectionIndex + num);
        root.eq(currentSectionIndex + num).css('z-index', opts.zindex - 1);
        activeController(currentSectionIndex + num);
        thisSection.animate({
          'height': 0
        }, opts.delayTime, function () {
          root.eq(currentSectionIndex + num)
            .addClass('active')
            .css('z-index', opts.zindex);
          thisSection
            .removeClass('active')
            .css({
              'z-index': opts.zindex - 2,
              'height': opts.height,
              'top': '-' + opts.height,
              'bottom': opts.height
            });
        });
        thisSection.find('.' + name[1]).animate({
          'bottom': opts.height
        }, opts.delayTime);
      } else {
        if (currentSectionIndex == 0) {
          return false;
        }
        root.eq(currentSectionIndex + num).removeClass('static-section');
        $('body').css('overflow-y', 'hidden');
        thisSection.removeClass('active').css('z-index', opts.zindex - 1);
        toggleToGo(currentSectionIndex - num);
        activeController(currentSectionIndex - num);
        root.eq(currentSectionIndex - num)
          .css({'z-index': opts.zindex, 'background-attachment': 'scroll', 'height': 0, 'top': 0, 'bottom': 0})
          .addClass('active')
          .animate({
            'height': opts.height
          }, opts.delayTime, function () {
            thisSection.css('z-index', opts.zindex - 2)
          });
        root.eq(currentSectionIndex - num)
          .find('.' + name[1])
          .animate({
            'bottom': '100px'
          }, opts.delayTime * 1.5);
      }
    }

    // get current section index
    function getSectionIndex() {
      for (var i = 0; i < root.length; i++) {
        if (root.eq(i).hasClass('active')) {
          return i;
        }
      }
    }

    // controller active
    function activeController(i) {
      $('.' + name[0] + ' span').removeClass('active').eq(i).addClass('active');
    }

    // change one
    var upOne = function () {
      resetBodyScroll();
      scroll(getSectionIndex(), 'up', 1);
    };
    var downOne = function () {
      resetBodyScroll();
      scroll(getSectionIndex(), 'down', 1);
    };

    // mouse wheel event
    function bindSectionMouseWheelEvent() {
      if ($.fn.touch().isTouchDevice()) {
        root.touch({
          up: true,
          down: true
        }, upOne, downOne, undefined, undefined);
      } else {
        root.on(mouseWheel, function (e) {
          if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {
            downOne();
          }
          if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
            upOne();
          }
        });
      }
    }

    // bind home content event
    function bindAutoSrollEvent() {
      var moveToFullScreen = function () {
        upOne();
        $('.header').removeClass('fixed-header');
        $('.' + name[0]).css('display', 'block');
        bindSectionMouseWheelEvent();
      };
      if (opts.autoScrollElement) {
        // $(opts.autoScrollElement).css('overflow-y', 'auto');
        if ($.fn.touch().isTouchDevice()) {
          var touchMove = function () {
            if ($('.about-header').offset().top == 0 ){
              moveToFullScreen();
            }
          };
          $(opts.autoScrollElement).touch({
            down: true
          }, undefined, touchMove, undefined, undefined);
        } else {
          $(opts.autoScrollElement).on(mouseWheel, function (event) {
            if ((event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) && $('body').scrollTop() == 0) {
              moveToFullScreen();
            }
          });
        }
      }
    }

    function bindButtonEvent() {
      // controller event
      $('.' + name[0] + ' span').on('click', function () {
        var index = $(this).index();
        activeController(index);
        if (getSectionIndex() > index) {
          scroll(getSectionIndex(), 'down', getSectionIndex() - index)
        } else if (getSectionIndex() < index) {
          scroll(getSectionIndex(), 'up', index - getSectionIndex())
        } else {
          return false
        }
      });
      // go to content
      $('.go-to-content').on('click', function () {
        $('.' + name[0] + ' span').eq(root.length - 1).click();
        $(this).hide();
      });
    }

    // control go to content show or hide
    function toggleToGo(index) {
      if ($.inArray(index, opts.hideGoToIndex) !== -1) {
        $('.' + name[2]).hide();
      } else {
        $('.' + name[2]).show();
      }
    }
    // reset body scroll bar
    var resetBodyScroll = function (delay) {
      if(delay) {
        setTimeout(function () {
          $('body,html').animate({scrollTop:0}, 0);
        }, delay);
      }else {
        $('body,html').animate({scrollTop:0}, 0);
      }

    };

    // init
    function init() {
      if (root.length == 0) {
        return false;
      }
      $('body').css('overflow', 'hidden');
      resetBodyScroll(500);
      bindAutoSrollEvent();
      // dom
      for (i = 0; i < root.length; i++) {
        root.eq(i).css('z-index', opts.zindex - i);
        dom.controllerItem += '<span></span>';
      }

      dom = dom.controller + dom.controllerItem + '</div>' + dom.goToContent;

      root.parent().after(dom);
      root.eq(0).addClass('active');
      $('.' + name[0] + ' span').eq(0).addClass('active');

      // controller align center
      $('.' + name[0]).css({
        'margin-top': -$('.fullpage-controller').height() / 2,
        'z-index': opts.zindex + 1
      });

      toggleToGo(0);
      bindSectionMouseWheelEvent();
      bindButtonEvent();
      if (cb) {
        cb();
      }
    }

    init();
  };
});
