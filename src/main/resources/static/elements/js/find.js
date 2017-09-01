$(function(){
    submitBind($('.bs_next'),$('input[name="username"]'));
    $('.bs_next').click(function(){
        var username = $.trim($('input[name="username"]').val());
        if(username == ''){
            G_Pop._init('msg',{'content':'手机号不能为空'});
            return false;
        }else{
            if(G_Common._isMobile(username)){
                F_Find._checkUsername(username);
            }else{
                G_Pop._init('msg',{'content':'手机号格式错误'});
                return false;
            }
        }
    });
    $('.lg_logo').click(function(){
        G_Jump._go('index');
    });
    $('.lg_button').click(function(){
        if(!G_CaptchaObj || !G_CaptchaObj.getValidate()){
            G_Pop._init('msg',{'content':'请滑动验证'});
            return false;
        }else{
            F_Find._getVCode();
        }
    });

    submitBind($('.bs_reset'),$('input[name="usercode"],input[name="userpass"],input[name="passcheck"]'));
    $('.bs_reset').click(function(){
        var userCode = $.trim($('input[name="usercode"]').val());
        if(userCode == ''){
            G_Pop._init('msg',{'content':'请输入验证码'});
            return false;
        }
        if(userCode.length <4){
            G_Pop._init('msg',{'content':'验证码错误，请确认'});
            return false;
        }
        var userId = $.trim($('input[name="userid"]').val());
        var userPass = $.trim($('input[name="userpass"]').val());
        var passCheck = $.trim($('input[name="passcheck"]').val());
        if(userId == ''){
            G_Pop._init('msg',{'content':'获取用户信息失败，请刷新页面重试'});
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
        F_Find._reset();
    });
    G_Captcha._getCaptcha('div_gt_embed');
});

var F_Find = {
    _buff:{},
    _checkUsername:function(username){
        /*
         G_Port._ajax('findUserCheck','post',true,'mobile_or_email='+username,function(){
         btnStatus('check','disable',$('.bs_next'));
         },function(){
         btnStatus('check','normal',$('.bs_next'));
         },
         function(data, msg){
         if(data.get){
         $('.lg_info').eq(1).html('您绑定的手机号码是'+data.get.mobile+'，请验证：');
         $('input[name="userid"]').val(data.get.user_id);
         $('.bs_find_check').hide();
         $('.lg_position').removeClass('lg_position_t1').addClass('lg_position_t2');
         $('.lg_zone').removeClass('lg_zone_h1').addClass('lg_zone_h2');
         $('.bs_find_set').show();
         }
         },
         function(data, msg, code){
         G_Pop._init('msg',{'content':msg});
         return false;
         }
         )
         */
        G_Port._ajax('isMobileReg','get',true,'mobile='+username,function(){
                btnStatus('check','disable',$('.bs_next'));
            },function(){
                btnStatus('check','normal',$('.bs_next'));
            },
            function(data, msg){
                if(data.mobile_exist+'' == '0'){
                    G_Pop._init('msg',{'content':'当前手机号码未注册'});
                    return false;
                }else{
                    $('.lg_info').eq(1).html('您正在为'+username+'重置密码，请验证：');
                    $('input[name="userid"]').val(username);
                    $('.bs_find_check').hide();
                    $('.lg_position').removeClass('lg_position_t1').addClass('lg_position_t2');
                    $('.lg_zone').removeClass('lg_zone_h1').addClass('lg_zone_h2');
                    $('.bs_find_set').show();
                }
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _getVCode:function(){
        var userId = $.trim($('input[name="userid"]').val());
        if(userId == ''){
            G_Pop._init('msg',{'content':'获取用户信息失败，请刷新页面重试'});
            return false;
        }
        var postData = {renew_password:1,verify_type:'mobile',mobile:userId};
        postData = $.extend(postData, G_CaptchaObj.getValidate());
        G_Port._ajax('sms','post',true,postData,function(){
            F_Find._timeout();
            G_Captcha._refreshCaptcha();
        },null,function(data,msg){
            G_Pop._init('msg',{'content':'验证码已发送！请注意查收'});
        },function(data,msg,code){
            G_Pop._init('msg',{'content':msg});
        })
    },
    _timeout:function(){
        $('.btn-success').text('60秒后重发').attr('disabled',true);
        F_Find._buff.timeDiff = 60;
        timeGo = setInterval('F_Find._timeRun()',1000);
    },
    _timeRun:function(){
        if(F_Find._buff.timeDiff <= 0){
            clearInterval(timeGo);
            $('.btn-success').text('获取验证码').attr('disabled',false);
        }else{
            F_Find._buff.timeDiff -= 1
            $('.btn-success').text(F_Find._buff.timeDiff+'秒后重发');
        }
    },
    _reset:function(){
        var postData = {
            mobile:$.trim($('input[name="userid"]').val()),
            password:$.trim($('input[name="userpass"]').val()),
            verify_code:$.trim($('input[name="usercode"]').val())
        };
        G_Port._ajax('resetPass','post',true,postData,function(){
                btnStatus('find','disable',$('.bs_reset'));
            },function(){
                btnStatus('find','normal',$('.bs_reset'));
            },
            function(data, msg){
                setStatus('out');
                G_Pop._init('alert',{'content':'重置成功，即将跳转到登录页'});
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
