$(function(){
  $('.article-tab .tabs li').on('click',function(){
       var contentUrl = $(this).attr('href');
        $('.article-tab .tabs li').removeClass('article-active-tab');
        $(this).addClass('article-active-tab');
        $('.result-all').css('display', 'none');
        $(contentUrl).css('display', 'block');
  });
  

});


