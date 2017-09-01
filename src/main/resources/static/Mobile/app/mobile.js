// (function () {
//   var isTouchDevice = function () {
//     var supportsTouch = false;
//     if ('ontouchstart' in window) {
//       //iOS & android
//       supportsTouch = true;
//     } else if (window.navigator.msPointerEnabled) {
//       //Win8
//       supportsTouch = true;
//     }
//     return supportsTouch;
//   };

//   var currentUrl = window.location.href,
//       lastDirIndex = 8 + currentUrl.slice(7, currentUrl.length).indexOf('/'),
//       mobileDir = 'mobile/';
//   if (isTouchDevice()) {
//     if (currentUrl.indexOf(mobileDir) !== -1){
//       return false;
//     }
//     var newUrl =  currentUrl.slice(0, lastDirIndex) + mobileDir + currentUrl.slice(lastDirIndex, currentUrl.length);
//     window.location = newUrl;
//   }else {
//     if (currentUrl.indexOf(mobileDir) == -1){
//       return false;
//     }
//     var newUrl =  currentUrl.replace(mobileDir, '');
//     window.location = newUrl;
//   }
// })();



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