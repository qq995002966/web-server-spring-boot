$(function(){
    var $_GET = getUrl('query');
    $('input[name="username"]').val(G_Login._pre());
    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-aero',
        radioClass: 'iradio_flat-aero'
    });
    $('.lg_tab span').each(function(index){
        $(this).click(function(){
            $(this).addClass('lg_tabOn').siblings('span').removeClass('lg_tabOn');
            switch(index+''){
                case '0':
                    $('#bs_u_0').show();
                    $('#bs_u_1').hide();
                    break;
                case '1':
                    $('#bs_u_1').show();
                    $('#bs_u_0').hide();
                    break;
            }
        });
    });
    G_Captcha._getCaptcha('div_gt_embed');
    submitBind($('.btn-info'),$('input[name="username"],input[name="userpass"],input[name="usercaptcha"]'));
    $('.btn-info').click(function(){
        var postData = F_Login._checkForm();
        if(!postData)return false;
        var url = '';
        if(G_Common._isInner()){
            if($_GET.from){
                switch($_GET.from){
                    default:
                        var type = $_GET.from.split('_');
                        if(type.length == 2){
                            switch (type[0]){
                                case 'a':
                                    url = 'outside.html#/outsideAtlas/'+type[1];
                                    break;
                                case 'l':
                                    url = 'outside.html#/gameSummary/'+type[1];
                                    break;
                            }
                        }
                        break;
                    case 'service':
                        url = G_Jump._getUrl('main');
                        break;
                    case 'app':
                        url = G_Jump._getUrl('index')+'?f=app';
                        break;
                    case 'background':
                        url = '';
                        break;
                    case 'outsideAlarm':
                    case 'outsideHotWord':
                    case 'outsideAssistant':
                    case 'outsideChat':
                    case 'outsideFaceSummary':
                    case 'insideSummary':
                        url = G_Jump._getUrl($_GET.from);
                        break;
                }
            }
            if(url == ''){
                if(!($_GET.from && $_GET.from == 'background')){
                    url = G_Common._parentUrl();
                    if(url.indexOf('#')>-1){
                        url = url.split('#')[0];
                    }
                }
            }
        }else{
            url = G_Login._loginBackUrl();
        }
        G_Login._in(
            postData,
            function(){
                btnStatus('login','disable',$('.btn-info'));
            },
            function(){
                btnStatus('login','normal',$('.btn-info'));
            },
            url
        );
        return false;
    });
    $('.lg_button').click(function(){
        var mobile = $.trim($('input[name="username"]').val());
        if(F_Login._checkMobile(1,mobile)){
            if(!G_CaptchaObj || !G_CaptchaObj.getValidate()){
                G_Pop._init('msg',{'content':'请滑动验证'});
                return false;
            }else{
                F_Login._existsMobile(mobile);
            }
        }else{
            return false;
        }
    });
    $('.lg_logo').click(function(){
        G_Jump._go('index');
    });
    $('p a').click(function(){
        G_Jump._go('reg');
    });
    $('.lg_check a').click(function(){
        G_Jump._go('find');
    });
    if(G_Common._isInner()){
        G_AD._ad1($('.lg_right'));
        G_Login._backUrl('set',G_Common._parentUrl());
    }else{
        G_Login._backUrl('set');
    }
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
});

var F_Login = {
    _buff:{},
    _checkForm:function(){
        var type = F_Login._getType();
        var userName = $.trim($('input[name="username"]').val());
        var userPass = $.trim($('input[name="userpass"]').val());
        var userCaptcha = $.trim($('input[name="usercaptcha"]').val());
        var userExpire = 0;
        var url = '';
        var postData = {};
        if(!F_Login._checkMobile(type,userName)){
            return false;
        }
        switch(type+''){
            case '0':
                if(userPass == ''){
                    G_Pop._init('msg',{'content':'密码不能为空'});
                    return false;
                }
                postData['password'] = userPass;
                break;
            case '1':
                if(userCaptcha == ''){
                    G_Pop._init('msg',{'content':'短信验证码不能为空'});
                    return false;
                }
                postData['logintype'] = 'verify';
                postData['verify_code'] = userCaptcha;
                break;
        }
        if($('input[name="userexpire"]').prop("checked")==true){
            userExpire = 604800;
        }
        postData['login_name'] = userName;
        postData['maxInactiveInterval'] = userExpire;
        return postData;
    },
    _checkMobile:function(type,userName){
        if(userName == ''){
            G_Pop._init('msg',{'content':'手机号不能为空'});
            return false;
        }
        switch(type+''){
            case '0':
                var offset = 'auto';
                if(G_Common._isInner()){
                    offset = ['190px','50px'];
                }
                if(G_Common._isMail(userName)){
                    G_Pop._init('msg',{'offset':offset,'content':'尊敬的用户，考虑到数据安全性，我们已关闭邮箱登录功能。建议您采用手机号注册登录'});
                    return false;
                }
                if(!(G_Common._isMobile(userName))){
                    G_Pop._init('msg',{'content':'手机号格式错误'});
                    return false;
                }
                break;
            case '1':
                if(!G_Common._isMobile(userName)){
                    G_Pop._init('msg',{'content':'手机号格式错误'});
                    return false;
                }
                break;
        }
        return true;
    },
    _getType:function(){
        var type = 0;
        $('.lg_tab span').each(function(index){
            if($(this).hasClass('lg_tabOn')){
                type = index;
            }
        });
        return type;
    },
    _existsMobile:function(mobile){
        G_Port._ajax('isMobileReg','get',true,'mobile='+mobile,function(){
                $('.lg_button').text('手机验证中').attr('disabled',true);
            },function(){
                $('.lg_button').text('获取验证码').attr('disabled',false);
            },
            function(data, msg){
                if(data.mobile_exist+'' == '0'){
                    G_Pop._init('msg',{'content':'当前手机号码未注册'});
                    return false;
                }else{
                    F_Login._getVCode(mobile);
                }
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _getVCode:function(mobile){
        var postData = {mobile_or_email:mobile};
        postData = $.extend(postData, G_CaptchaObj.getValidate());
        G_Port._ajax('sms','post',true,postData,function(){
            F_Login._timeout();
            G_Captcha._refreshCaptcha();
        },null,function(data,msg){
            G_Pop._init('msg',{'content':'验证码已发送！请注意查收'});
        },function(data,msg,code){
            G_Pop._init('msg',{'content':msg});
        })
    },
    _timeout:function(){
        $('.lg_button').text('60秒后重发').attr('disabled',true);
        F_Login._buff.timeDiff = 60;
        timeGo = setInterval('F_Login._timeRun()',1000);
    },
    _timeRun:function(){
        if(F_Login._buff.timeDiff <= 0){
            clearInterval(timeGo);
            $('.lg_button').text('获取验证码').attr('disabled',false);
        }else{
            F_Login._buff.timeDiff -= 1
            $('.lg_button').text(F_Login._buff.timeDiff+'秒后重发');
        }
    }
}