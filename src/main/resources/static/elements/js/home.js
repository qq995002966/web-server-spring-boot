$(function () {

  // first screen event
  function bindFirstScreenEvent() {
    $('#first-screen-box').on('DOMMouseScroll mousewheel', function (event) {
      if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
        showMoreContent();
      }
    });
  }

  // more content event
  function bindMoreContentEvent() {
    $('#more-content').on( 'DOMMouseScroll mousewheel', function ( event ) {
      if( (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0)  && $(window).scrollTop() == 0) {
        hideMoreContent();
      }
    });
/*
    $(document).scroll(function () {
      if ($(document).height() - $(window).height() == $(window).scrollTop()) {
        loadMore()
      }
    });
    */
  }

  // unbind all event
  function unbindEvent() {
    $('#more-content, #first-screen-box',document).unbind();
  }

  /*输入框焦点*/
  $('.search-input').bind({
    focus: function () {
      if (this.value == this.defaultValue) {
        this.value = "";
      }
      // if (this.value !== this.defaultValue && this.value !== '') {
      //   $(this).next('i').css('background-position', '0 0');
      // } else {
      //   $(this).next('i').css('background-position', '-16px 0');
      // }
    },
    blur: function () {
      if (this.value == "") {
        this.value = this.defaultValue;
      }
    }
  });

    $('.load-more').on('click', function () {
        showMoreContent();
    });

  // hide and show
  function showMoreContent() {
    var height = $(document).height();
    console.log('show more content');
    unbindEvent();
    $('#first-screen-box')
      .animate({
          'top': - height,
          'bottom': height
        },
        500,
        function () {
          $('#first-screen-box').hide()
        });

    $('#more-content')
      .show()
      .animate({
          'position': 'absolute',
          'top': 0
        },
        500,
        function () {
          $('html').css('overflow-y', 'auto');
          $('#header').css('position','fixed');
          bindMoreContentEvent();
        });
  }

  function hideMoreContent() {
    unbindEvent();
    $('#header').css('position','static');
    var height = $(document).height();
    $('#first-screen-box')
      .show()
      .animate({
          'top': 0,
          'bottom': 0
        },
        500);
    $('#more-content')
      .animate({
          'top': height
        },
        500,
        function () {
          $('html').css('overflow-y', 'hidden');
          $('#more-content').hide();
          bindFirstScreenEvent();
        })
  }

  // load more content
  function loadMore() {
    var dom = '<li class="detail-content">' +
      '<img src="elements/img/mediarticle/company.png" alt="" class="company-icon">' +
      '<ul class="detail-right">' +
      '<li>' +
      '<span class="article-title">脑洞漫画 吓得小红帽吓得小红帽吓得小红帽</span>' +
      '</li>' +
      '<li class="detail-infor">' +
      '来自' +
      '<span class="article-from">百度贴吧</span>' +
      '<span class="article-readall"><a href="">查看原文</a></span>' +
      '<span class="article-date">16/4/17</span>' +
      '</li>' +
      '<p>百善孝为先。人之拜父母所赐，一尺五寸长成人，父母养儿含辛茹苦披星戴月，父母呼应勿缓，父母命应勿懒，王祥卧冰为他母，杨香救父手扼虎，孟宗哭竹冬生笋，吴猛代亲饱蚊噬，······当然二十四孝也有它迂腐封建的糟粕，但感人的孝心和孝举却永远是人间正道，值得推崇和学习的，一个不懂孝道不知感恩父母的人，我们又祈求他如何去爱人？就像新闻里最近哪个弑母的学生一样，长大了又何尝不是家庭和社会的悲哀？谨守孝道是一种礼仪，更是做人的根本，发身受之于父母，每个人都应该常怀一颗感恩之心无微不至地侍奉双亲！<span class="readall">阅读全文</span></p>' +
      '</ul>' +
      '</li>';
    $('#loadMore').append(dom);
  }

  function init() {
    var height = $(document).height();
    $('#more-content').css({
      'top': height,
      'position': 'absolute'
    });
    $('#header').css('position','static');
    bindFirstScreenEvent();
    $('.h_ltList, .h_qkItem').perfectScrollbar();
  }

  init();

});
