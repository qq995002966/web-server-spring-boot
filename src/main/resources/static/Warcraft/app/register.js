$(function(){
    var $_GET = W_Common._getUrl('query');
    if($_GET.token){
        W_InviteToken._set('invite',$_GET.token);
        W_InviteToken._set('join',$_GET.token);
    }
    $('#regBtn').click(function(){
        if(F_Check._checked()){
            var userCode = $.trim($('input[name="usercode"]').val());
            if(userCode == ''){
                W_Common._pop('请输入验证码',F_Common._btnCheck2);
                return false;
            }
            if(userCode.length <4){
                W_Common._pop('验证码错误，请确认',F_Common._btnCheck2);
                return false;
            }
            F_Reg._register();
        }
    });
    $('input[name="username"]').blur(function(){
        var mobile = $.trim($(this).val());
        if(mobile != '' && W_Common._isMobile(mobile)){
            F_Reg._checkMobile(mobile);
        }else{
            $('.sent-word').attr('data-c',0);
        }
    });
    W_Captcha._getCaptcha('div_gt_embed');
    $('#captchaCheck').click(function(){
        if(F_Check._checked()){
            var dataCheck = $(this).attr('data-c');
            switch(dataCheck+''){
                case '0':
                    W_Common._pop('手机号验证失败',F_Common._btnCheck2);
                    return false;
                    break;
                case '2':
                    W_Common._pop('该手机号已被注册',F_Common._btnCheck2);
                    return false;
                    break;
            }
            if(!W_CaptchaObj || !W_CaptchaObj.getValidate()){
                W_Common._pop('请滑动验证',F_Common._btnCheck2);
                return false;
            }else{
                F_Reg._getVCode();
            }
        }
    });
});
var F_Check = {
    _checked:function(){
        var userName = $.trim($('input[name="username"]').val());
        var userPass = $.trim($('input[name="userpass"]').val());
        var passCheck = $.trim($('input[name="passcheck"]').val());
        if(userName == ''){
            W_Common._pop('手机号不能为空',F_Common._btnCheck2);
            return false;
        }
        if(!(W_Common._isMobile(userName))){
            W_Common._pop('手机号格式错误',F_Common._btnCheck2);
            return false;
        }
        if(userPass == ''){
            W_Common._pop('密码不能为空',F_Common._btnCheck2);
            return false;
        }
        if(userPass.length < 6){
            W_Common._pop('密码不能少于6位字符',F_Common._btnCheck2);
            return false;
        }
        if(userPass != passCheck){
            W_Common._pop('两次输入的密码不一致，请确认',F_Common._btnCheck2);
            return false;
        }
        return true;
    }
}
var F_Common = {
    _btnCheck:['<button class="pop-btn startgame"><a href="">开始游戏</a></button>','<button class="pop-btn reinput">重新登记</button>'],
    _btnCheck2:['<button class="pop-btn reinput">确定</button>']
}
var F_Reg = {
    _buff:{},
    _checkMobile:function(mobile){
        W_Port._ajax('checkMobile','get',true,'mobile='+mobile,null,null,
            function(data, msg){
                $('.sent-word').attr('data-c',1);
            },
            function(data, msg, code){
                $('.sent-word').attr('data-c',2);
                W_Common._pop(msg,F_Common._btnCheck2);
                return false;
            }
        )
    },
    _getVCode:function(){
        var postData = {mobile_or_email:$.trim($('input[name="username"]').val())};
        postData = $.extend(postData, W_CaptchaObj.getValidate());
        W_Port._ajax('sms','post',true,postData,function(){
            F_Reg._timeout();
            W_Captcha._refreshCaptcha();
        },null,function(data,msg){
            W_Common._pop('验证码已发送！请注意查收',F_Common._btnCheck2,'提示');
        },function(data,msg,code){
            W_Common._pop(msg,F_Common._btnCheck2);
        })
    },
    _timeout:function(){
        $('.sent-word').text('60秒重发').attr('disabled',true);
        F_Reg._buff.timeDiff = 60;
        timeGo = setInterval('F_Reg._timeRun()',1000);
    },
    _timeRun:function(){
        if(F_Reg._buff.timeDiff <= 0){
            clearInterval(timeGo);
            $('.sent-word').text('发送口令').attr('disabled',false);
        }else{
            F_Reg._buff.timeDiff -= 1
            $('.sent-word').text(F_Reg._buff.timeDiff+'秒重发');
        }
    },
    _register:function(){
        var mobile = $.trim($('input[name="username"]').val());
        var password = $.trim($('input[name="userpass"]').val());
        var postData = {
            mobile_or_email:mobile,
            password:password,
            verify_code:$.trim($('input[name="usercode"]').val())
        };
        W_Port._ajax('register','post',true,postData,function(){
                $('#regBtn').attr('disabled',true);
            },null,
            function(data, msg){
                W_Login._in(
                    {
                        login_name : mobile,
                        password : password,
                        maxInactiveInterval:0
                    },null,function(){
                        $('#regBtn').attr('disabled',false);
                    },W_Jump._getUrl('fight'),F_Common._btnCheck2
                );
                return false;
            },
            function(data, msg, code){
                $('#regBtn').attr('disabled',false);
                W_Common._pop(msg,F_Common._btnCheck2);
                return false;
            }
        )
    }
}