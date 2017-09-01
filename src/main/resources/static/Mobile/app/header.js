$(function() {
    $('#visitPc').click(function(){
        window.location.href = '../visitFromPc.html';
    });
  var mediaIcon = ['.media-icon-tab li', '.media-icon-content'];

  $(mediaIcon[0]).on('click', function(e) {
    var contentUrl = $(this).attr('href');
    hideAllMediaIcon();
    $(contentUrl).fadeIn(500);
    $('body').one('touchstart', function(){
      hideAllMediaIcon();
    });

    e.stopPropagation();
  });

  $(mediaIcon[0]).on('click', function (e) {
    e.stopPropagation();
  });

  $(mediaIcon[1]).on('click', function (e) {
    e.stopPropagation();
  });



  var hideAllMediaIcon = function () {
    $('.media-icon-content').css('display', 'none');
  };

  $('.m-navlist li').on('click', function() {
    $('.togglenav').slideUp(500);
    $(this).find('.togglenav').slideDown(500);
  });


  // animate in header menu
  var fullPageNav = $('.full-page-nav'),
    delayTime = 500;
  $('#toggle').on('click', function() {
    $('.header').toggleClass('open');
    if ($('.header.open').length == 1) {
      fullPageNav.parent().fadeIn(delayTime);
      fullPageNav.animate({
        'top': '50%',
        'margin-top': -fullPageNav.height() / 2,
        'margin-bottom': 'auto',
        'opacity': 1
      }, delayTime * 2);
    } else {
      $('.full-page-nav-box').fadeOut(delayTime);
      fullPageNav.animate({
        'margin-top': '100%',
        'opacity': 0
      }, delayTime * 2, function() {
        fullPageNav.css({ 'margin-bottom': '100%', 'top': 'auto' });
      });
    }
  });

  var mouseWheel = 'DOMMouseScroll mousewheel ',
    header = $('.header');

  function handleHeader(event, scrollDom) {
    if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 && scrollDom.scrollTop() < 100) {
      header.removeClass('fixed-header');
    }
    if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
      if (scrollDom.scrollTop() < 100) {
        header.removeClass('fixed-header').fadeIn(delayTime);
        return false;
      }
      header.fadeIn(delayTime).addClass('fixed-header');
    }
    if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
      header.fadeOut(delayTime);
      setTimeout(function() {
        header.removeClass('fixed-header');
      }, delayTime)
    }
  }

  // if ($('.content.home').length == 0 && $('.content.join').length == 0 && $('.content.partners').length == 0) {
  // if ($('.content.home').length == 0 && $('.content.partners').length == 0) {
  if ($('.content.home').length == 0) {
    $(window).on(mouseWheel, function(e) {
      handleHeader(e, $(this));
    });
  } else {
    $('.home-content').on(mouseWheel, function(e) {
      handleHeader(e, $(this));
    });
  }

  var imgdefereds = [];
  $('img').each(function() {
    var dfd = $.Deferred();
    $(this).bind('load', function() {
      dfd.resolve();
    }).bind('error', function() {
      //图片加载错误，加入错误处理
      //  dfd.resolve();
    });
    if (this.complete) setTimeout(function() {
      dfd.resolve();
    }, 1000);
    imgdefereds.push(dfd);
  });
  $.when.apply(null, imgdefereds).done(function() {
    $('.loading').fadeOut();
  });

  var development = false;
  if (development) {
    $('body').append('<div style="position: fixed; bottom: 100px; left: 0;right: 0; color: red; font-size: 50px;z-index: 2000;">' + 'screen width:' + screen.width + '<br/>' + 'screen height:' + screen.height + '<br/>' + 'view port width:' + Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + '<br/>' + 'view port height:' + Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + '</div>');
    var imageCDN = 'http://td2-image.ufile.ucloud.com.cn/';
    $('img').each(function() {
      $(this).attr('src', $(this).attr('src').replace(imageCDN, ''));
    })
  } else {
    // baidu
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "//hm.baidu.com/hm.js?9c3b3343530e42561863fa597611aee3";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  }

});
