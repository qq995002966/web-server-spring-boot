$(function(){
    G_Login._check();
    G_Login._status('user');
    F_Bind._getMobile();
    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-aero',
        radioClass: 'iradio_flat-aero'
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
            F_Bind._register();
        }
    });
    $('input[name="username"]').blur(function(){
        var mobile = $.trim($(this).val());
        if(mobile != '' && G_Common._isMobile(mobile)){
            F_Bind._checkMobile(mobile);
        }else{
            $('.btn-success').attr('data-c',0);
        }
    });
    $('.btn-success').click(function(){
        if(F_Check._checked()){
            var dataCheck = $(this).attr('data-c');
            switch(dataCheck+''){
                case '0':
                    G_Pop._init('msg',{'content':'手机号验证失败'});
                    return false;
                    break;
            }
            if(!G_CaptchaObj || !G_CaptchaObj.getValidate()){
                G_Pop._init('msg',{'content':'请滑动验证'});
                return false;
            }
            F_Bind._getVCode();
        }
    });
    $('.lg_check a').click(function(){
        G_Jump._go('open','license.html');
    });
    G_Captcha._getCaptcha('div_gt_embed');

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
var F_Bind = {
    _buff:{},
    _checkMobile:function(mobile){
        G_Port._ajax('checkMobile','get',true,'mobile='+mobile,null,null,
            function(data, msg){
                $('.btn-success').attr('data-c',1);
            },
            function(data, msg, code){
                G_Pop._init('confirm',{'content':'该账号已注册，申请与QQ号（微信号）绑定！','btn':['确认绑定','取消']},function(){
                    G_Pop._init('close');
                    $('.btn-success').attr('data-c',1);
                },function(){
                    G_Pop._init('close');
                    parent.G_Pop._init('close');
                });
                $('.layui-layer-dialog').css('left','15px');
                return false;
            }
        )
    },
    _getMobile:function(mobile){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        G_Port._ajax('detailMobile','get',true,null,null,null,
            function(data, msg){
                G_Pop._init('close');
                if(data.mobile && data.mobile != ''){
                    $('input[name="username"]').val(data.mobile);
                    F_Bind._checkMobile(data.mobile);
                }
            },
            function(data, msg, code){
                switch(code+''){
                    case '-1049':
                        G_Pop._init('checkAlert',{'content':msg,'icon':2,'closeBtn':false,title:false},function(){
                            parent.G_Pop._init('close');
                        });
                        break;
                }
                return false;
            }
        )
    },
    _getVCode:function(){
        var postData = {mobile_or_email:$.trim($('input[name="username"]').val())};
        postData = $.extend(postData, G_CaptchaObj.getValidate());
        G_Port._ajax('sms','post',true,postData,function(){
            F_Bind._timeout();
            G_Captcha._refreshCaptcha();
        },null,function(data,msg){
            G_Pop._init('msg',{'content':'验证码已发送！请注意查收'});
        },function(data,msg,code){
            G_Pop._init('msg',{'content':msg});
        })
    },
    _timeout:function(){
        $('.btn-success').text('60秒后重发').attr('disabled',true);
        F_Bind._buff.timeDiff = 60;
        timeGo = setInterval('F_Bind._timeRun()',1000);
    },
    _timeRun:function(){
        if(F_Bind._buff.timeDiff <= 0){
            clearInterval(timeGo);
            $('.btn-success').text('获取验证码').attr('disabled',false);
        }else{
            F_Bind._buff.timeDiff -= 1
            $('.btn-success').text(F_Bind._buff.timeDiff+'秒后重发');
        }
    },
    _register:function(){
        var mobile = $.trim($('input[name="username"]').val());
        var postData = {
            mobile:mobile,
            password:$.trim($('input[name="userpass"]').val()),
            verify_code:$.trim($('input[name="usercode"]').val())
        };
        G_Port._ajax('bindMobile','post',true,postData,function(){
                btnStatus('bind','disable',$('#registerForm .btn-info'));
            },function(){
                btnStatus('bind','normal',$('#registerForm .btn-info'));
            },
            function(data, msg){
                setStatus('out');
                G_Storage._set('login',mobile);
                G_Pop._init('alert',{'content':'已完成手机绑定'});
                setTimeout(function(){
                   G_Jump._go('reload');
                },1000)
                return false;
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    }
}
