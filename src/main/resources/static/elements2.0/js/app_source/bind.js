require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        F_Bind_Entrance._init();
    });
});
var F_Bind_Entrance = {
    _init:function () {
        B_Captcha._getCaptcha('div_gt_embed');
        F_Bind._check();
        F_Bind._sms();
        if(B_Common._isInner()){
            F_Bind._getMobile();
        }else{
            B_Login._check();
            if(B_User._isDemoUser()){
                B_Jump._go('target','login');
            }
            S_HeadFoot._getLoginHead('手机绑定');
            $('.h-logo').click(function(){
                B_Jump._go('target','index');
            });
        }
        B_Common._submitBind($('#bs_bind_btn'),$('input[name="usercode"],input[name="username"],input[name="userpass"],input[name="passcheck"]'));
        $('input[name="username"]').blur(function(){
            var mobile = $.trim($(this).val());
            if(mobile != '' && B_Common._isMobile(mobile)){
                F_Bind._checkMobile(mobile);
            }else{
                $('#bs_sms_send').attr('data-c',0);
            }
        });
    }
}
var F_Bind = {
    _getMobile:function(mobile){
        B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        B_Port._ajax('detailMobile','get',true,null,null,null,
            function(data, msg){
                B_Pop._init('close');
                if(data.mobile && data.mobile != ''){
                    $('input[name="username"]').val(data.mobile);
                    F_Bind._checkMobile(data.mobile);
                }
            },
            function(data, msg, code){
                switch(code+''){
                    case '-1049':
                        B_Pop._init('checkAlert',{'content':msg,'icon':2,'closeBtn':false,title:false},function(){
                            parent.B_Pop._init('close');
                        });
                        break;
                }
                return false;
            }
        )
    },
    _checkMobile:function(mobile){
        if(!B_Common._isInner())F_Bind._notice(0,'');

        var postData = {};
        postData['mobile'] = mobile;
        postData = B_Common._postData(postData);
        B_Port._ajax('checkMobile','get',true,postData,null,null,
            function(data, msg){
                $('#bs_sms_send').attr('data-c',1);
            },
            function(data, msg, code){
                if(B_Common._isInner()){
                    B_Pop._init('confirm',{'content':'该账号已注册，申请与QQ号（微信号）绑定！','btn':['确认绑定','取消']},function(){
                        B_Pop._init('close');
                        $('#bs_sms_send').attr('data-c',1);
                    },function(){
                        B_Pop._init('close');
                        parent.B_Pop._init('close');
                    });
                    $('.layui-layer-dialog').css('left','15px');
                    return false;
                }else{
                    $('#bs_sms_send').attr('data-c',2);
                    B_Pop._init('open',{'content':F_Bind._htmlNotice()});
                    return false;
                }
            }
        )
    },
    _confirm:function (type) {
        switch (type){
            case 'c':
                $('#bs_sms_send').attr('data-c','3');
                break;
            case 'q':
                $('#bs_sms_send').attr('data-c','2');
                break;
        }
        B_Pop._init('close');
    },
    _htmlNotice:function () {
        var user = B_Login._user.user;
        var photo = '';
        if(user.qq_head){
            photo = user.qq_head;
        }else if(user.wx_head){
            photo = user.wx_head;
        }
        var str = '\
            <div class="connection-pop">\
                <div class="connection-content">\
                    <div class="top">\
                        <img src="'+photo+'" alt="">\
                        <i class="change-arrow"></i>\
                        <img src="elements2.0/img/lr/default-pic.jpg" alt="">\
                    </div>\
                    <p>该手机号已注册，是否将QQ号（微信号）与该账号进行绑定</p>\
                    <div class="btn">\
                        <button class="main-btn" onclick="F_Bind._confirm(\'c\')">确认绑定</button>\
                        <button class="assist-btn" onclick="F_Bind._confirm(\'q\')">取消</button>\
                    </div>\
                </div>\
            </div>';

        return str;
    },
    _check:function(){
        $('#bs_bind_btn').click(function () {
            if(F_Bind._checkForm()){
                var userCode = $.trim($('input[name="usercode"]').val());
                if(userCode == ''){
                    F_Bind._notice(3,'请输入验证码');
                    return false;
                }else{
                    F_Bind._notice(3,'');
                }
                if(userCode.length <4){
                    F_Bind._notice(3,'验证码错误，请确认');
                    return false;
                }else{
                    F_Bind._notice(3,'');
                }
                F_Bind._bind();
            }
        });
    },
    _bind:function () {
        var mobile = $.trim($('input[name="username"]').val());
        var password = $.trim($('input[name="userpass"]').val());

        var postData = {};
        postData['mobile'] = mobile;
        postData['password'] = password;
        postData['verify_code'] = $.trim($('input[name="usercode"]').val());
        postData = B_Common._postData(postData);
        B_Port._ajax('bindMobile','post',true,postData,function(){
                $('#bs_bind_btn').html('绑定中,请稍等...').attr('disabled',true);
            },function(){
                $('#bs_bind_btn').html('绑定手机号').attr('disabled',false);
            },
            function(data, msg){
                B_Login._setStatus('out');
                B_Storage._set('login',mobile);
                B_Pop._init('alert',{'content':'已完成手机绑定'});
                if(B_Common._isInner()) {
                    setTimeout(function(){
                        B_Jump._go('reload');
                    },1000)
                }else{
                    setTimeout(function () {
                        B_Jump._go('base', B_Login._loginBackUrl());
                    }, 1000);
                }
                return false;
            },
            function(data, msg, code){
                B_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _sms:function () {
        $('#bs_sms_send').click(function(){
            if(F_Bind._checkForm()){
                var dataCheck = $(this).attr('data-c');
                switch(dataCheck+''){
                    case '0':
                        F_Bind._notice(0,'手机号验证失败');
                        return false;
                        break;
                    case '2':
                        B_Pop._init('open',{'content':F_Bind._htmlNotice()});
                        return false;
                        break;
                }
                if(!B_CaptchaObj || !B_CaptchaObj.getValidate()){
                    F_Bind._notice(3,'请滑动验证');
                    return false;
                }else{
                    F_Bind._notice(3,'');
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
            F_Bind._notice(0,'手机号不能为空');
            return false;
        }else{
            F_Bind._notice(0,'');
        }
        if(!(B_Common._isMobile(userName))){
            F_Bind._notice(0,'手机号格式错误');
            return false;
        }else{
            F_Bind._notice(0,'');
        }
        if(userPass == ''){
            F_Bind._notice(1,'密码不能为空');
            return false;
        }else{
            F_Bind._notice(1,'');
        }
        if(userPass.length < 6){
            F_Bind._notice(1,'密码不能少于6位字符');
            return false;
        }else{
            F_Bind._notice(1,'');
        }
        if(userPass != passCheck){
            F_Bind._notice(2,'再次输入的密码不同');
            return false;
        }else{
            F_Bind._notice(2,'');
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
    }
}
