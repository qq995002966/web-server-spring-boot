$(function() {
  var delayDom = $('.platform-section1 .bottom-text'),
    delayTime = 200;
  delayDom.css('display', 'none');
  setTimeout(function() {
    delayDom.fadeIn('slow');
  }, delayTime);
  

//  tab change
  $('.tab-change-list li').on('click',function(){
    var contentUrl = $(this).attr('href');
    $('.tab-content-man').css('display','none');
    $('.tab-change-list li').removeClass('man-selected');
    $(this).addClass('man-selected');
    $(contentUrl).fadeIn(500);
  });
});
