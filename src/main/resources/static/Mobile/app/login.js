$(function() {
    CJ_Captcha._getCaptcha('div_gt_embed');
    $('.backup').click(function(){
        window.location.href = 'index.html';
    });
    F_Login._changeStep();
    $('#btnCheck').click(function(){
        var step = F_Login._getStep();
        switch(step+''){
            case '0':
                F_Login._checkPassword();
                break;
            case '1':
                F_Login._checkCaptcha();
                break
        }
    });
    $('#captchaCheck').click(function(){
        if(!CJ_CaptchaObj || !CJ_CaptchaObj.getValidate()){
            CJ_Pop._open('mobile','请滑动验证');
            return false;
        }else{
            var mobile = $.trim($('input[name="mobile"]').val());
            if(CJ_Common._isMobile(mobile)){
                F_Login._checkMobile(mobile);
            }else{
                CJ_Pop._open('mobile','手机号码错误，请确认');
                return false;
            }
        }
    });
    $('.r-pop-case .confirm-btn').click(function(){
        CJ_Pop._close('mobile');
    });
});
var F_Login = {
    _changeStep:function(){
        $('.tab-progress li').each(function(index){
            $(this).click(function(){
                switch(index+''){
                    case '0':
                        $('#step0').show();
                        $('#step1').hide();
                        break;
                    case '1':
                        $('#step1').show();
                        $('#step0').hide();
                        break;
                }
                $(this).addClass('selected').siblings('li').removeClass('selected');
            });
        });
    },
    _getStep:function(){
        var step = 0;
        $('.tab-progress li').each(function(index){
            if($(this).hasClass('selected')){
                step = index;
            }
        });
        return step;
    },
    _doLogin:function(postData){
        CJ_Port._ajax('login','post',true,postData,function(){
                F_Login._btnText('登录中，请稍等...','disable');
            },function(){
                F_Login._btnText('登录','normal');
            },
            function(data, msg){
                CJ_Cookie._set('MobileLoginInit',1);
                window.location.href = 'index.html';
                return false;
            },
            function(data, msg, code){
                CJ_Pop._open('mobile',msg);
                return false;
            }
        )
    },
    _checkPassword:function(){
        var password = $.trim($('input[name="password"]').val());
        var nick = $.trim($('input[name="nick"]').val());
        if(!CJ_Common._isMobile(nick)){
            CJ_Pop._open('mobile','手机号码错误，请确认');
            return false;
        }
        if(password == ''){
            CJ_Pop._open('mobile','密码必须填写，请确认');
            return false;
        }
        if(password.length < 6){
            CJ_Pop._open('mobile','密码长度不得少于6位字符，请确认');
            return false;
        }
        var postData = {
            login_name:nick,
            password:password,
            maxInactiveInterval:0
        };
        F_Login._doLogin(postData);
    },
    _checkCaptcha:function(){
        var mobile = $.trim($('input[name="mobile"]').val());
        var captcha = $.trim($('input[name="captcha"]').val());
        if(!CJ_Common._isMobile(mobile)){
            CJ_Pop._open('mobile','手机号码错误，请确认');
            return false;
        }
        if(captcha == '' || captcha.length < 4){
            CJ_Pop._open('mobile','验证码错误，请确认');
            return false;
        }
        var postData = {
            login_name:mobile,
            logintype:'verify',
            verify_code:captcha,
            maxInactiveInterval:0
        };
        F_Login._doLogin(postData);
    },
    _checkMobile:function(mobile){
        CJ_Port._ajax('isMobileReg','get',true,'mobile='+mobile,function(){
                $('#captchaCheck').attr('disabled',true).text('手机验证中...');
            },function(){
                $('#captchaCheck').attr('disabled',false).text('获取验证码');
            },
            function(data, msg){
                if(data.mobile_exist+'' == '0'){
                    CJ_Pop._open('mobile','当前手机号码未注册');
                    return false;
                }else{
                    CJ_Sms._getVCode('mobile',mobile,$('#captchaCheck'));
                }
            },
            function(data, msg, code){
                CJ_Pop._open('mobile',msg);
                return false;
            }
        )
    },
    _btnText:function(text,type){
        switch(type){
            case 'disable':
                $('#btnCheck').attr('disabled',true);
                break;
            case 'normal':
                $('#btnCheck').attr('disabled',false);
                break;
        }
        $('#btnCheck').text(text);
    }
}