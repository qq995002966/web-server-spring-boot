require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        F_Find_Entrance._init();
    });
});
var F_Find_Entrance = {
    _init:function () {
        B_Captcha._getCaptcha('div_gt_embed');
        B_Common._submitBind($('#bs_next_btn'),$('input[name="username"]'));
        B_Common._submitBind($('#bs_find_btn'),$('input[name="usercode"],input[name="userpass"],input[name="passcheck"]'));
        F_Find._next();
        F_Find._check();
        F_Find._sms();
        S_HeadFoot._getLoginHead('重置密码');
        $('.h-logo').click(function(){
            B_Jump._go('target','index');
        });
    }
}
var F_Find = {
    _next:function () {
        $('#bs_next_btn').click(function(){
            F_Find._notice(0,'');
            var username = $.trim($('input[name="username"]').val());
            if(username == ''){
                F_Find._notice(0,'手机号不能为空');
                return false;
            }else{
                if(B_Common._isMobile(username)){
                    F_Find._existsMobile(username);
                }else{
                    F_Find._notice(0,'手机号格式错误');
                    return false;
                }
            }
        });
    },
    _sms:function () {
        $('#bs_sms_send').click(function(){
            var mobile = $.trim($('input[name="username"]').val());
            if(!B_CaptchaObj || !B_CaptchaObj.getValidate()){
                F_Find._notice(1,'请滑动验证');
                return false;
            }else{
                F_Find._notice(1,'');
                B_Captcha._getVCode(mobile);
            }
        });
    },
    _check:function () {
        $('#bs_find_btn').click(function () {
            if(F_Find._checkForm()) {
                var postData = {
                    mobile: $.trim($('input[name="username"]').val()),
                    password: $.trim($('input[name="userpass"]').val()),
                    verify_code: $.trim($('input[name="usercode"]').val())
                };
                postData = B_Common._postData(postData);
                B_Port._ajax('resetPass', 'post', true, postData, function () {
                        $('#bs_find_btn').html('重置中,请稍等...').attr('disabled', true);
                    }, function () {
                        $('#bs_find_btn').html('确认重置').attr('disabled', false);
                    },
                    function (data, msg) {
                        B_Pop._init('alert', {'content': '重置成功，即将跳转到登录页'});
                        setTimeout(function () {
                            return B_Jump._go('target', 'login');
                        }, 3000)
                        return false;
                    },
                    function (data, msg, code) {
                        B_Pop._init('msg', {'content': msg});
                        return false;
                    }
                )
            }
        })
    },
    _checkForm:function(){
        var userCode = $.trim($('input[name="usercode"]').val());
        if(userCode == ''){
            F_Find._notice(1,'请输入验证码');
            return false;
        }else{
            F_Find._notice(1,'');
        }
        if(userCode.length <4){
            F_Find._notice(1,'验证码错误，请确认');
            return false;
        }else{
            F_Find._notice(1,'');
        }
        var userName = $.trim($('input[name="username"]').val());
        var userPass = $.trim($('input[name="userpass"]').val());
        var passCheck = $.trim($('input[name="passcheck"]').val());
        if(userName == ''){
            B_Pop._init('msg',{'content':'获取用户信息失败，请刷新页面重试'});
            return false;
        }
        if(userPass == ''){
            F_Find._notice(2,'密码不能为空');
            return false;
        }else{
            F_Find._notice(2,'');
        }
        if(userPass.length < 6){
            F_Find._notice(2,'密码不能少于6位字符');
            return false;
        }else{
            F_Find._notice(2,'');
        }
        if(userPass != passCheck){
            F_Find._notice(3,'再次输入的密码不同');
            return false;
        }else{
            F_Find._notice(3,'');
        }
        return true;
    },
    _notice:function (id,msg) {
        if(msg)B_Pop._init('msg',{'content':msg});
        /*
        if(B_Common._isInner()){
            if(msg)B_Pop._init('msg',{'content':msg});
        }else{
            if(msg){
                $('.error-text').eq(id).html('<i>!</i>'+msg);
            }else{
                $('.error-text').eq(id).html('');
            }
        }
        */
    },
    _existsMobile:function(mobile){
        var dom = $('#bs_sms_send');
        var postData = {};
        postData['mobile'] = mobile;
        postData = B_Common._postData(postData);
        B_Port._ajax('register','get',true,postData,function(){
                $('#bs_next_btn').html('验证中,请稍等...').attr('disabled', true);
            },function(){
                $('#bs_next_btn').html('下一步').attr('disabled', false);
            },function(data, msg){
                if(data.mobile_exist+'' == '0'){
                    F_Find._notice(0,'当前手机号码未注册');
                    return false;
                }else{
                    $('#bs_mobile').html(mobile);
                    $('.first-step').hide();
                    $('.second-step').show();
                }
            },function(data, msg, code){
                B_Port._init('msg',{'content':msg});
                return false;
            }
        )
    }
}
