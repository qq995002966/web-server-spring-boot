$(function(){
    G_Login._backUrl('set');
    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-aero',
        radioClass: 'iradio_flat-aero'
    });
    $('.lg_logo').click(function(){
        G_Jump._go('index');
    });
    var refreshUrl = G_Common._baseHost()+G_Jump._getUrl('refresh');
    refreshUrl = G_Common._encodeUrl(refreshUrl);
    $('.bs_qq').click(function(){
        setStatus('out');
        G_Jump._go('base',G_Port._init('qqLogin')+'?redirect_url='+refreshUrl);
    });
    $('.bs_wx').click(function(){
        setStatus('out');
        G_Jump._go('base',G_Port._init('wxLogin')+'?redirect_url='+refreshUrl);
    });
    submitBind($('#registerForm .btn-info'),$('input[name="usercode"],input[name="username"],input[name="userpass"],input[name="passcheck"]'));
    $('#registerForm .btn-info').click(function(){
        if(F_Check._checked()){
            var userCode = $.trim($('input[name="usercode"]').val());
            if(userCode == ''){
                G_Pop._init('msg',{'content':'请输入验证码'});
                return false;
            }
            if(userCode.length <4){
                G_Pop._init('msg',{'content':'验证码错误，请确认'});
                return false;
            }
            F_Reg._register();
        }
    });
    $('input[name="username"]').blur(function(){
        var mobile = $.trim($(this).val());
        if(mobile != '' && G_Common._isMobile(mobile)){
            F_Reg._checkMobile(mobile);
        }else{
            $('.lg_button').attr('data-c',0);
        }
    });
    $('.lg_button').click(function(){
        if(F_Check._checked()){
            var dataCheck = $(this).attr('data-c');
            switch(dataCheck+''){
                case '0':
                    G_Pop._init('msg',{'content':'手机号验证失败'});
                    return false;
                    break;
                case '2':
                    G_Pop._init('msg',{'content':'该手机号已被注册！'});
                    return false;
                    break;
            }
            if(!G_CaptchaObj || !G_CaptchaObj.getValidate()){
                G_Pop._init('msg',{'content':'请滑动验证'});
                return false;
            }
            F_Reg._getVCode();
        }
    });
    $('p a').click(function(){
        G_Jump._go('login');
    });
    $('.lg_check a').click(function(){
        G_Jump._go('open','license.html');
    });
    G_Captcha._getCaptcha('div_gt_embed');

    G_Login._backUrl('reg');
});
var F_Check = {
    _checked:function(){
        var userName = $.trim($('input[name="username"]').val());
        var userPass = $.trim($('input[name="userpass"]').val());
        var passCheck = $.trim($('input[name="passcheck"]').val());
        if(userName == ''){
            G_Pop._init('msg',{'content':'手机号不能为空'});
            return false;
        }
        if(!(G_Common._isMobile(userName))){
            G_Pop._init('msg',{'content':'手机号格式错误'});
            return false;
        }
        if(userPass == ''){
            G_Pop._init('msg',{'content':'密码不能为空'});
            return false;
        }
        if(userPass.length < 6){
            G_Pop._init('msg',{'content':'密码不能少于6位字符'});
            return false;
        }
        if(userPass != passCheck){
            G_Pop._init('msg',{'content':'两次输入的密码不一致，请确认'});
            return false;
        }
        if($('input[name="useragree"]').prop("checked")==false){
            G_Pop._init('msg',{'content':'请勾选并同意《隐私策略及服务条款》'});
            return false;
        }
        return true;
    }
}
var F_Reg = {
    _buff:{},
    _checkMobile:function(mobile){
        G_Port._ajax('checkMobile','get',true,'mobile='+mobile,null,null,
            function(data, msg){
                $('.lg_button').attr('data-c',1);
            },
            function(data, msg, code){
                $('.lg_button').attr('data-c',2);
                G_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _getVCode:function(){
        var postData = {mobile_or_email:$.trim($('input[name="username"]').val())};
        postData = $.extend(postData, G_CaptchaObj.getValidate());
        G_Port._ajax('sms','post',true,postData,function(){
            F_Reg._timeout();
            G_Captcha._refreshCaptcha();
        },null,function(data,msg){
            G_Pop._init('msg',{'content':'验证码已发送！请注意查收'});
        },function(data,msg,code){
            G_Pop._init('msg',{'content':msg});
        })
    },
    _timeout:function(){
        $('.btn-success').text('60秒后重发').attr('disabled',true);
        F_Reg._buff.timeDiff = 60;
        timeGo = setInterval('F_Reg._timeRun()',1000);
    },
    _timeRun:function(){
        if(F_Reg._buff.timeDiff <= 0){
            clearInterval(timeGo);
            $('.btn-success').text('获取验证码').attr('disabled',false);
        }else{
            F_Reg._buff.timeDiff -= 1
            $('.btn-success').text(F_Reg._buff.timeDiff+'秒后重发');
        }
    },
    _register:function(){
        var mobile = $.trim($('input[name="username"]').val());
        var postData = {
            mobile_or_email:mobile,
            password:$.trim($('input[name="userpass"]').val()),
            verify_code:$.trim($('input[name="usercode"]').val())
        };
        G_Storage._set('login',mobile);
        G_Port._ajax('register','post',true,postData,function(){
                btnStatus('reg','disable',$('#registerForm .btn-info'));
            },function(){
                btnStatus('reg','normal',$('#registerForm .btn-info'));
            },
            function(data, msg){
                setStatus('out');
                G_Pop._init('alert',{'content':'注册成功，即将跳转到登录页'});
                setTimeout(function(){
                    return G_Jump._go('login');
                },3000)
                return false;
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    }
}
