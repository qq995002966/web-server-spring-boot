require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        F_Reg_Entrance._init();
    });
});
var F_Reg_Entrance = {
    _init:function () {
        B_Login._backUrl('reg');
        B_Captcha._getCaptcha('div_gt_embed');
        S_HeadFoot._getLoginHead('注册');
        F_Reg._check();
        F_Reg._sms();
        $('.h-logo').click(function(){
            B_Jump._go('target','index');
        });
        B_Common._submitBind($('#bs_reg_btn'),$('input[name="usercode"],input[name="username"],input[name="userpass"],input[name="passcheck"]'));

        $('input[name="username"]').blur(function(){
            var mobile = $.trim($(this).val());
            if(mobile != '' && B_Common._isMobile(mobile)){
                F_Reg._checkMobile(mobile);
            }else{
                $('#bs_sms_send').attr('data-c',0);
            }
        });
    }
}
var F_Reg = {
    _checkMobile:function(mobile){
        F_Reg._notice(0,'');
        var postData = {};
        postData['mobile'] = mobile;
        postData = B_Common._postData(postData);
        B_Port._ajax('checkMobile','get',true,postData,null,null,
            function(data, msg){
                $('#bs_sms_send').attr('data-c',1);
            },
            function(data, msg, code){
                $('#bs_sms_send').attr('data-c',2);
                F_Reg._notice(0,'该手机号已被注册');
                return false;
            }
        )
    },
    _check:function(){
        $('#bs_reg_btn').click(function () {
            if(F_Reg._checkForm()){
                var userCode = $.trim($('input[name="usercode"]').val());
                if(userCode == ''){
                    F_Reg._notice(3,'请输入验证码');
                    return false;
                }else{
                    F_Reg._notice(3,'');
                }
                if(userCode.length <4){
                    F_Reg._notice(3,'验证码错误，请确认');
                    return false;
                }else{
                    F_Reg._notice(3,'');
                }
                F_Reg._register();
            }
        });
    },
    _register:function () {
        var mobile = $.trim($('input[name="username"]').val());
        var password = $.trim($('input[name="userpass"]').val());
        var postData = {
            mobile_or_email:mobile,
            password:password,
            verify_code:$.trim($('input[name="usercode"]').val())
        };
        postData = B_Common._postData(postData);
        B_Port._ajax('register','post',true,postData,function(){
                $('#bs_reg_btn').html('注册中,请稍等...').attr('disabled',true);
            },function(){
                $('#bs_reg_btn').html('注册').attr('disabled',false);
            },
            function(data, msg){
                B_Storage._set('login',mobile);
                F_Reg._login(mobile,password);
                return false;
            },
            function(data, msg, code){
                B_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _login:function (mobile,password) {
        var postData = {};
        postData['login_name'] = mobile;
        postData['password'] = password;
        postData['maxInactiveInterval'] = 0;
        B_Login._in(
            postData,
            function(){
                $('#bs_reg_btn').html('登录中,请稍等...').attr('disabled',true);
            },
            function(){
                $('#bs_reg_btn').html('注册').attr('disabled',false);
            },
            B_Jump._getUrl('information')
        );
    },
    _sms:function () {
        $('#bs_sms_send').click(function(){
            if(F_Reg._checkForm()){
                var dataCheck = $(this).attr('data-c');
                switch(dataCheck+''){
                    case '0':
                        F_Reg._notice(0,'手机号验证失败');
                        return false;
                        break;
                    case '2':
                        F_Reg._notice(0,'该手机号已被注册');
                        return false;
                        break;
                }
                if(!B_CaptchaObj || !B_CaptchaObj.getValidate()){
                    F_Reg._notice(3,'请滑动验证');
                    return false;
                }else{
                    F_Reg._notice(3,'');
                }
                B_Captcha._getVCode($.trim($('input[name="username"]').val()));
            }
        });
    },
    _checkForm:function(){
        var userName = $.trim($('input[name="username"]').val());
        var userPass = $.trim($('input[name="userpass"]').val());
        var passCheck = $.trim($('input[name="passcheck"]').val());
        if(userName == ''){
            F_Reg._notice(0,'手机号不能为空');
            return false;
        }else{
            F_Reg._notice(0,'');
        }
        if(!(B_Common._isMobile(userName))){
            F_Reg._notice(0,'手机号格式错误');
            return false;
        }else{
            F_Reg._notice(0,'');
        }
        if(userPass == ''){
            F_Reg._notice(1,'密码不能为空');
            return false;
        }else{
            F_Reg._notice(1,'');
        }
        if(userPass.length < 6){
            F_Reg._notice(1,'密码不能少于6位字符');
            return false;
        }else{
            F_Reg._notice(1,'');
        }
        if(userPass != passCheck){
            F_Reg._notice(2,'再次输入的密码不同');
            return false;
        }else{
            F_Reg._notice(2,'');
        }
        if($('input[name="useragree"]').prop("checked")==false){
            B_Pop._init('msg',{'content':'请勾选并同意《隐私策略及服务条款》'});
            return false;
        }
        return true;
    },
    _notice:function (id,msg) {
        if(msg)B_Pop._init('msg',{'content':msg});
        /*
        if(msg){
            $('.error-text').eq(id).html('<i>!</i>'+msg);
        }else{
            $('.error-text').eq(id).html('');
        }
        */
    }
}
