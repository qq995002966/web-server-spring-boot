$(function () {
  $('.slider-about').slider({
    delayTime: 1000,
    showMiddleControllers: false
  });

  $('.mfooter-float .close-float').on('click', function () {
    $(this).parents('.mfooter-float').fadeOut(500);
  });
});



$(function(){
    if(isLogin()){
        $('.hadlogin').show();
        $('.button-wrap').hide();
    }else{
        $('.button-wrap').show();
        $('.hadlogin').hide();
    }
})
function isLogin(){
    var cookies = document.cookie.split(";");
    var cookieValue = '';
    for(var i=0;i<cookies.length;i++){
        var cs = cookies[i].split("=");
        if($.trim(cs[0]) == 'MobileLoginInit'){
            cookieValue = cs[1];
            break;
        }
    }
    return cookieValue != '' ? true : false;
}