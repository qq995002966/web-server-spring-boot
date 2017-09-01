$(function() {
  // slider
  $.fn.slider = function(opts) {

    // default options
    var opts = $.extend({
      delayTime: 200,
      showBottomControllers: true,
      showMiddleControllers: true
    }, opts);

    var name = ['slider-item', 'slider-box', 'prev-image', 'next-image', 'slider-controllers', 'disable', 'bottom-controllers'];

    return this.each(function() {
      if ($(this).length == 0) {
        return false;
      }
      var root = $(this),
        sliderItem = root.children('.' + name[0]),
        slidersLength = root.children('.' + name[0]).length;
      sliderItem.width(1/slidersLength*100 + '%');
      sliderItem.eq(0).addClass('active');

      // dom
      var dom = {
        content: '<div class="' + name[1] + '"></div>',
        controllers: '<span class="' + name[2] + ' ' + name[4] + ' ' + name[5] + ' slider-controllers disable animation-rotate "><div class="l-top"></div><div class="l-bottom"></div></span><span class="' + name[3] + ' ' + name[4] + '"><div class="r-top"></div><div class="r-bottom"></div></span>',
        bottomControllers: '<div class="' + name[6] + '">'
      };


      root
        .css('left', 0)
        .width(slidersLength + '00%')
        .wrap(dom.content);
      var sliderBox = root.parent();
      sliderBox.parent().height(sliderItem.height()).css('position', 'relative');
      if (opts.showMiddleControllers) {
        sliderBox.parent().append(dom.controllers);
        // click event
        sliderBox.parent().find('.next-image').on('click', function() {
          next();
        });

        sliderBox.parent().find('.prev-image').on('click', function() {
          prev();
        });
      }
      if (opts.showBottomControllers) {
        for (var i = 0; i < slidersLength; i++) {
          dom.bottomControllers += '<span></span>'
        }
        sliderBox.append(dom.bottomControllers + '</div>');
        var bottomControllers = sliderBox.find('.' + name[6]).children('span');
        bottomControllers.eq(0).addClass('active');
        bottomControllers.on('click', function() {
          bottomControllers.removeClass('active');
          $(this).addClass('active');
          slider($(this).index());
        });
      }


      var next = function () {
        if (!checkDisable().next) {
          return false
        }
        slider(checkActive() + 1);
      };
      var prev = function () {
        if (!checkDisable().prev) {
          return false;
        }
        slider(checkActive() - 1);
      };

      // touch event
      if ($.fn.touch().isTouchDevice()){
        sliderBox.touch({
          left: true,
          right: true
        }, undefined, undefined, next, prev)
      }

      function checkDisable() {
        var targetList = root;
        if (targetList.is(':animated')) {
          return false;
        }
        var targetListLeft = Number(targetList.css('left').slice(0, targetList.css('left').length - 2)),
          prev, next;
        targetListLeft == 0 ? prev = false : prev = true;
        targetListLeft == -(targetList.width() - targetList.width() / slidersLength) ? next = false : next = true;
        return {
          prev: prev,
          next: next
        }
      }

      function checkActive() {
        for (i = 0; i < slidersLength; i++) {
          if (root.children('.slider-item').eq(i).hasClass('active')) {
            return i;
          }
        }
      }

      function slider(index) {
        var targetList = root;
        var targetListLeft = Number(targetList.css('left').slice(0, targetList.css('left').length - 2));
        var boxWidth = Number(  (index - checkActive()) * (targetList.width() / slidersLength));
        targetList.animate({
          left: targetListLeft - boxWidth
        }, opts.delayTime);
        if (opts.showBottomControllers) {
          bottomControllers.removeClass('active').eq(index).addClass('active');
        }
        sliderItem.removeClass('active').eq(index).addClass('active');
      }
    })
  };


});
