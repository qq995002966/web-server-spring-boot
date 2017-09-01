(function($) {
  $.fn.mySlider = function(opts) {
    console.log('my slider jquery plugin installed');

    // compute %
    function GetPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%");
    }

    // default options
    var opts = $.extend({
      sliders: [],
      delayTime: 200
    },opts);

    return this.each(function () {
      var root = $(this);
      console.log(root);
      console.log(opts.sliders.length);
      // dom
      var dom = {
        tip: '<p><span class="cont-slider">'+ 1 +'</span>/'+ opts.sliders.length +'</p>',
        content: '<div class="slider-box">',
        controllers: '<div class="slider-controllers"><span class="prev-image disable"></span><span class="next-image"></span></div>',
        imageList: '<div class="image-list" style="width:'+ opts.sliders.length +'00%">'
      };
      for(i in opts.sliders){
        console.log(opts.sliders[i].link);
        if (opts.sliders[i].link){
          dom.imageList += '<div class="image-box" style="width:'+ GetPercent(1,opts.sliders.length) +'"><a href="' + opts.sliders[i].link + '" target="_blank"><img src="' + opts.sliders[i].image + '"/></a></div>'
        }else {
          dom.imageList += '<div class="image-box" style="width:'+ GetPercent(1,opts.sliders.length) +'"><img src="' + opts.sliders[i].image + '"/></div>';
        }

      }
      dom = dom.content + dom.imageList + '</div>'+dom.tip + dom.controllers +'</div>';
      root.append(dom);

      // click event
      root.find('.next-image').on('click', function () {
        if(!checkDisable().next) {
          return false
        }
        slider('-');
      });

      root.find('.prev-image').on('click', function () {
        if(!checkDisable().prev){
          return false;
        }
        slider('+');
      });

      function checkDisable() {
        var targetList = root.find('.image-list');
        var targetListLeft = Number(targetList.css('left').slice(0, targetList.css('left').length-2));
        targetListLeft == 0 ? prev = false: prev = true;
        targetListLeft == -(targetList.width() - targetList.width()/opts.sliders.length) ? next = false: next = true;
        return {
          prev: prev,
          next: next
        }

      }
      function slider(add) {
        var targetList = root.find('.image-list');
        var targetListLeft = Number(targetList.css('left').slice(0, targetList.css('left').length-2));
        var boxWidth = Number(add +(targetList.width() / opts.sliders.length));
        targetList.animate({
          left:  targetListLeft + boxWidth
        }, opts.delayTime);
        var newCont = Number(root.find('.cont-slider').text()) + Number(-(add + 1));
        root.find('.cont-slider').text(newCont);
        if(newCont == 1){
          root.find('.next-image').removeClass('disable');
          root.find('.prev-image').addClass('disable');
        }else if(newCont == opts.sliders.length){
          root.find('.prev-image').removeClass('disable');
          root.find('.next-image').addClass('disable');
        }else {
          root.find('.next-image, .prev-image').removeClass('disable');
        }
      }
    })

  };
})(jQuery);