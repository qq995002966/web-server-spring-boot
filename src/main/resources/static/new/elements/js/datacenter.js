$(function(){
    $('.multiselect span').on('click',function(){
        $(this).toggleClass('data-span-selected');
    });

    $('.singleselect span').on('click',function(){
    $(this).parent().find('span').removeClass('data-span-selected');
    $(this).addClass('data-span-selected');
});
  //check browser
function get_browser(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
    }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
    }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
        name: M[0],
        version: M[1]
    };
}

  // 点击数据中心消失
  //   $(this).contents().find("#goBack").on('click',function(){
  //      if (get_browser().name == 'MSIE' && get_browser().version < 10) {
  //         $(".more", window.parent.document).css('display','none');
  //          $("#data", window.parent.document).removeClass('iframe-more-date').removeClass('iframe-more-date-ie').addClass('iframe-more-date-hide');
  //       }else{
  //
  //           $("#data", window.parent.document).removeClass('iframe-more-date').addClass('iframe-more-date-hide');
  //           // $(".more", window.parent.document).css('display','none');
  //       }
  //
  //   });

// 点击收起与展开
  $('.pick-up').on('click',function(){
    var text = $(this).children('b').text();
    if(text=="收起"){
        $('.li-hide').hide(500);
        $(this).children('b').text('展开');
        $(this).children('i').css('background-position', '0 -11px');
        $('.data-list-content').css('top','290px');
     } else {
        $('.li-hide').show(500);
        $(this).children('b').text('收起');
        $(this).children('i').css('background-position', '0 -1px');
        $('.data-list-content').css('top','370px');
    }
    
  });

  $('.dataicon.close-icon').on('click', function () {
      $(window.parent.document).find('.data-center-quicker').click();
  });

  
});


