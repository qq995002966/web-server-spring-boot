(function (doc, win) {
    var _root = doc.documentElement,
        resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize',
        resizeCallback = function () {
            var clientWidth = _root.clientWidth,
            // fontSize =   _root.clientWidth/7.5;
                fontSize = 20;
            if (!clientWidth) return;
            if(clientWidth < 640) {
                fontSize = 20 * (clientWidth / 320);
            } else {
                fontSize = 20 * (640 / 320);
            }
            _root.style.fontSize = fontSize + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvent, resizeCallback, false);
    doc.addEventListener('DOMContentLoaded', resizeCallback, false);
})(document, window);


//分享到朋友圈图片
$(function(){
    if(navigator.userAgent.match(/MicroMessenger/i)){
    var weixinShareLogo = 'assets/images/w-pic.jpg';
    $('body').prepend('<div style=" overflow:hidden; width:0px; height:0; margin:0 auto; position:absolute; top:-800px;"><img src="'+ weixinShareLogo +'"></div>')
};
});
