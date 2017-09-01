$(function () {
  // scroll show
  $.fn.scrollShow = function (opts) {
    var opts = $.extend({
        delayTime: 3000,
        scrollElement: ''
      }, opts),
      root = $(this);
    root.css('opacity', '0');
    return this.each(function () {
      function check() {
        var thisButtomTop = parseInt($(opts.scrollElement).height()) + parseInt($(opts.scrollElement).scrollTop());
        var thisTop = parseInt($(opts.scrollElement).scrollTop()); //屏幕顶部距离最顶部的高度
        var PictureTop = parseInt(root.offset().top);
        if(PictureTop >= thisTop && PictureTop <= thisButtomTop) {
          return true
        }else {
          return false
        }
      }
      if (check()){
        root.css('opacity', '1');
      }
      $(opts.scrollElement).bind("scroll", function(){
        root.each(function () {
          if (check()){
            root.animate({
              'opacity': '1'
            },opts.delayTime);
          }
        });
      })
    })
  }
});