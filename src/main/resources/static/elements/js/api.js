if(window.location.host.toLowerCase().indexOf("thinkinggame.cn")>=0){
    var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write('<div style="display: none">'+unescape("%3Cspan id='cnzz_stat_icon_1259271417'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1259271417' type='text/javascript'%3E%3C/script%3E")+'</div>');
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?807f1c5d79f269ff4780a3018e230b2e";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
}
function doXss(data){
    if(typeof data === "number"){
        return data;
    }else if(typeof data === "string"){
        // 换行是特例
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&lt;br&gt;/ig, "<br>").replace(/&lt;br\/&gt;/ig, "<br/>");
    }else if(data instanceof Array){
        for(var i=0; i<data.length; ++i){
            data[i] = doXss(data[i]);
        }
        return data;
    }else if(data instanceof Object){
        for(var key in data){
            data[key] = doXss(data[key]);
        }
        return data;
    }
}
var CJ_Port = {
    _init:function(type){
        var url = CJ_Common._baseHost()+"rest/";
        switch(type){
            case 'countryDetail':
                return url+'v1/home/content';
                break;
            case 'wxLoginDetail':
                return url+'v1/login/weixin/detail';
                break;
            case 'applyTryForFree':
                return url+'ApplyTryForFreeServlet';
                break;
            case 'captcha':
                return url+'v1/geetest/captcha';
                break;
            case 'sms':
                return url+'v1/login/sms';
                break;
            case 'checkMobile':
                return url+'v1/user/mobile';
                break;
            case 'checkVerifyCode':
                return url+'v1/login/sms/check';
                break;
            case 'register':
                return url+'v1/login/register';
                break;
            case 'login':
                return url+'v1/login/auth';
                break;
            case 'isMobileReg':
                return url+'v1/login/register';
                break;
        }
    },
    _ajax:function(type,postOrGet,sync,data,start,end,success,fail){
        var url = this._init(type);
        $.ajax({
            timeout:30000,
            async:sync,
            type:postOrGet,
            url:url,
            data:data,
            beforeSend:function(){
                start && start();
            },
            complete:function(){},
            error:function(XMLHttpRequest, textStatus, errorThrown){
                end && end();
                fail && fail('','加载失败，请刷新重试');
            },
            success:function(back){
                end && end();
                try{
                    back.return_message = doXss(back.return_message);
                    switch(back.return_code+''){
                        case '0':
                            if (typeof back.data == 'string'){
                                if (back.data != '')
                                    back.data = $.parseJSON(back.data);
                                else
                                    back.data = {};
                            }
                            back.data = doXss(back.data) ;
                            success && success(back.data,back.return_message) ;
                            break;
                        default:
                            fail && fail(back.data,back.return_message,back.return_code);
                            break;
                    }
                }catch(e){
                    console.log(e);
                    fail && fail('','加载失败，请联系管理员');
                }
            }
        });
    }
}
var CJ_Captcha = {
    _getCaptcha:function(dom){
        try{
            var url = CJ_Port._init('captcha');
            $.ajax({
                timeout:30000,
                async:true,
                type:'get',
                url:url,
                data:null,
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    return;
                },
                success:function(config){
                    if(config){
                        window.CJ_CaptchaObj = new window.Geetest({
                            gt : config.gt,
                            challenge : config.challenge,
                            product : 'popup',
                            offline : !config.success
                        });
                        CJ_CaptchaObj.bindOn('#captchaCheck');
                        CJ_CaptchaObj.appendTo('#'+dom);
                    }
                }
            });
        }catch (e){
            return;
        }
    },
    _refreshCaptcha:function(){
        CJ_CaptchaObj && CJ_CaptchaObj.refresh();
    }
}
var CJ_Cookie = {
    _set:function(name,val,expire){
        var d = new Date();
        d.setTime(d.getTime()+(expire*24*3600*1000));
        document.cookie = name+"="+val+";expires="+d.toGMTString()+";path=/";
    },
    _get:function(name){
        var cookies = document.cookie.split(";");
        var cookieValue = null;
        for(var i=0;i<cookies.length;i++){
            var cs = cookies[i].split("=");
            if($.trim(cs[0]) == name){
                cookieValue = cs[1];
                break;
            }
        }
        return cookieValue;
    },
    _del:function(name){
        CJ_Cookie._set(name,'',-1);
    }
};
var CJ_Sms = {
    _buff:{},
    _timeRun:function(){
        if(CJ_Sms._buff.timeDiff <= 0){
            clearInterval(timeGo);
            runInDom.text('获取验证码').attr('disabled',false);
        }else{
            CJ_Sms._buff.timeDiff -= 1
            runInDom.text(CJ_Sms._buff.timeDiff+'秒后重发');
        }
    },
    _timeout:function(dom){
        dom.text('60秒重发').attr('disabled',true);
        CJ_Sms._buff.timeDiff = 60;
        runInDom = dom;
        timeGo = setInterval('CJ_Sms._timeRun()',1000);
    },
    _getVCode:function(type,mobile,btnDom){
        var postData = {mobile_or_email:mobile};
        postData = $.extend(postData, CJ_CaptchaObj.getValidate());
        CJ_Port._ajax('sms','post',true,postData,function(){
            CJ_Sms._timeout(btnDom);
            CJ_Captcha._refreshCaptcha();
        },null,function(data,msg){
            CJ_Pop._open(type,'验证码已发送！请注意查收');
        },function(data,msg,code){
            CJ_Pop._open(type,msg);
        })
    }
}
var CJ_Pop = {
    _open:function(type,msg){
        switch(type){
            case 'mobile':
                $('.r-pop-case').show();
                $('.remind-text').html(msg);
                break;
        }
    },
    _close:function(type){
        switch(type){
            case 'mobile':
                $('.r-pop-case').hide();
                break;
        }
    }
}
var CJ_Common = {
    _pop:function(type,msg){
        switch(type){
            case '':

                break;
        }
    },
    _cdnImgUrl:function(){
        return 'http://image.thinkinggame.cn/img/';
    },
    _baseHost:function(){
        return (window.location.host.indexOf("127.0.0.1")>=0 || window.location.host.indexOf("192.")>=0) ? "http://"+window.location.host+"/web-server/" : "http://"+window.location.host+"/";
    },
    _isMobile:function(data){
        return /^1\d{10}$/.test(data);
    }
}