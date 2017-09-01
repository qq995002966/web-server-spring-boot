$(function() {
    CJ_Captcha._getCaptcha('div_gt_embed');
    $('.backup').click(function(){
        var step = F_Reg._getStep();
        switch(step+''){
            case '0':
                window.location.href = 'index.html';
                break;
            case '1':
                F_Reg._setStep(0);
                break;
            case '2':
                F_Reg._setStep(1);
                break;
        }
    });
    $('#btnCheck').click(function(){
        var step = F_Reg._getStep();
        switch(step+''){
            case '0':
                if(!($('input[type="checkbox"]').prop("checked")==true)){
                    CJ_Pop._open('mobile','请勾选《thinkinggame用户协议》');
                    return false;
                }
                F_Reg._checkMobile();
                break;
            case '1':
                F_Reg._checkCaptcha();
                break;
            case '2':
                F_Reg._checkPassword();
                break
        }
    });
    $('#captchaCheck').click(function(){
        if(!CJ_CaptchaObj || !CJ_CaptchaObj.getValidate()){
            CJ_Pop._open('mobile','请滑动验证');
            return false;
        }else{
            CJ_Sms._getVCode('mobile',$.trim($('input[name="mobile"]').val()),$('#captchaCheck'));
        }
    });
    $('.r-pop-case .confirm-btn').click(function(){
        CJ_Pop._close('mobile');
    });
});
var F_Reg = {
    _setStep:function(number){
        $('.tab-progress li').each(function(index){
            if(number+'' == index){
                $(this).addClass('selected').siblings('li').removeClass('selected');
            }
        });
        switch(number+''){
            case '0':
                $('#step0').show();
                $('#step1').hide();
                $('#step2').hide();
                F_Reg._btnText('提交手机号码','normal');
                break;
            case '1':
                $('#step1').show();
                $('#step0').hide();
                $('#step2').hide();
                F_Reg._btnText('提交验证码','normal');
                break;
            case '2':
                $('#step2').show();
                $('#step1').hide();
                $('#step0').hide();
                F_Reg._btnText('注册','normal');
                break;
        }
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
    _checkPassword:function(){
        var password = $.trim($('input[name="password"]').val());
        var passwordCheck = $.trim($('input[name="passwordCheck"]').val());
        if(password == ''){
            CJ_Pop._open('mobile','密码必须填写，请确认');
            return false;
        }
        if(password.length < 6){
            CJ_Pop._open('mobile','密码长度不得少于6位字符，请确认');
            return false;
        }
        if(password != passwordCheck){
            CJ_Pop._open('mobile','两次输入的密码不一致，请确认');
            return false;
        }
        var mobile = $.trim($('input[name="mobile"]').val());
        var captcha = $.trim($('input[name="captcha"]').val());
        var postData = {
            mobile_or_email:mobile,
            password:password,
            verify_code:captcha
        };
        CJ_Port._ajax('register','post',true,postData,function(){
                F_Reg._btnText('提交中，请稍等...','disable');
            },function(){
                F_Reg._btnText('注册','disable');
            },
            function(data, msg){
                CJ_Pop._open('mobile','注册成功，2秒跳转登录');
                setTimeout(function(){
                    window.location.href = 'login.html';
                },2000);
            },
            function(data, msg, code){
                CJ_Pop._open('mobile',msg);
                return false;
            }
        )
    },
    _checkCaptcha:function(){
        var captcha = $.trim($('input[name="captcha"]').val());
        if(captcha == '' || captcha.length < 4){
            CJ_Pop._open('mobile','验证码错误，请确认');
            return false;
        }else{
            CJ_Port._ajax('checkVerifyCode','get',true,'mobile='+$.trim($('input[name="mobile"]').val())+'&verify_code='+captcha,function(){
                    F_Reg._btnText('提交中，请稍等...','disable');
                },function(){
                    F_Reg._btnText('提交验证码','normal');
                },
                function(data, msg){
                    F_Reg._setStep(2);
                },
                function(data, msg, code){
                    CJ_Pop._open('mobile',msg);
                    return false;
                }
            )
        }
    },
    _checkMobile:function(){
        var mobile = $.trim($('input[name="mobile"]').val());
        if(CJ_Common._isMobile(mobile)){
            CJ_Port._ajax('checkMobile','get',true,'mobile='+mobile,function(){
                    F_Reg._btnText('提交中，请稍等...','disable');
                },function(){
                    F_Reg._btnText('提交手机号码','normal');
                },
                function(data, msg){
                    F_Reg._setStep(1);
                },
                function(data, msg, code){
                    CJ_Pop._open('mobile',msg);
                    return false;
                }
            )
        }else{
            CJ_Pop._open('mobile','手机号码错误，请确认');
            return false;
        }
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