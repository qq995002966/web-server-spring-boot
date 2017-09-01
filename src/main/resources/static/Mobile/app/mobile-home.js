$(function() {
	// $('.content.mindex').fullPage({
 //    delayTime: 1000,
 //    autoScrollElement: '.home-content'
 //  });

  $('.pop-case button').on('click', function(){
  	$(this).parents('.pop-content').hide();
  });
});


$(function(){
    if(isLogin()){
        $('.hadlogin').show();
        $('.button-wrap').hide();
        $('#bs_register').hide();
    }else{
        $('.button-wrap').show();
        $('.hadlogin').hide();
        $('#bs_register').html('<a href=register.html>免费注册</a>');
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
function applyFree(){
    CJ_Port._ajax('applyTryForFree','get',true,null,function(){
        $('#bs_register a').html('申请中，请稍等...').attr('disabled',true);
    },function(){
        $('#bs_register a').html('申请免费试用').attr('disabled',false);
    },function(data,msg){
    		$('.pop-content').show();
    		$('.pop-case p').html('您已获得30天试用权限,请使用PC登录网站 --> 我的服务界面进行试用');
    },function(data,msg,code){
    		$('.pop-content').show();
        	$('.pop-case p').html(msg);
    })
}
