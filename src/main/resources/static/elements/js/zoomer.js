(function ($) {
  $.fn.Zoomer = function (options) {
    var options = $.extend({
      speedView:400,
      speedRemove:400,
      altAnim:true,
      speedTitle:450,
    }, options);
    return this.each(function () {
      var root = $(this);
      root.hover(function () {
        if (root.hasClass('dot')){
          return false
        }
        root.css({'z-index': '110'}).find('b').css('display', 'none');
        root.find('img').css('position','absolute').addClass("hover").stop().animate({
          width: '80px', height: '80px',
          top: '50%', left: '50%',
          marginLeft: '-40px', marginTop: '-40px'
        }, options.speedView);
        if (options.altAnim == true) {
          var a = root.find("img").attr("alt");
          if (a.length != 0) {
            root.prepend('<b class="title">' + a + '</b>');
            root.find('.title').animate({
              marginTop: '35px',
              textIndent: '1',
              position: 'relative',
              left: '50%',
              textAline: 'center',
              marginLeft: '-50px'
            }, options.speedTitle).css({'z-index': '3', 'position': 'absolute', 'float': 'left'})
          }
        }
      }, function () {
        root.css({'z-index': '0'});
        root.find('img').css('position','static').removeClass("hover").stop().animate({
          marginTop: '0', marginLeft: '0', top: '0', left: '0', width: '100%', height: '100%', padding: '0px'
        }, options.speedRemove);
        root.find('b').css('display', 'block');
        root.find('.title').remove()
      });
    });
  }
})(jQuery);