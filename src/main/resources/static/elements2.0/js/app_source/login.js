require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        F_Login_Entrance._init();
    });
});
var F_Login_Entrance = {
    _init:function () {
        $('input[name="username"]').val(B_Login._pre());
        B_Captcha._getCaptcha('div_gt_embed');
        B_Common._submitBind($('#bs_login_btn'),$('input[name="username"],input[name="userpass"],input[name="usercaptcha"]'));
        F_Login._check();
        F_Login._sms();
        F_Login._refresh();
        if(B_Common._isInner()){
            B_AD._ad('ad_3','item.html?k=1');
            B_Login._backUrl('set',B_Common._parentUrl());
            F_Login._typeChange('inner');
        }else{
            F_Login._typeChange('page');
            S_HeadFoot._getLoginHead('进入控制台');
            B_Login._backUrl('set');
            $('.h-logo').click(function(){
                B_Jump._go('target','index');
            });
        }
    }
}
var F_Login = {
    _getType:function () {
        var type = '';
        if(B_Common._isInner()){
            $('.lg_tab span').each(function(index){
                if($(this).hasClass('lg_tabOn')){
                    switch (index+''){
                        case '0':
                            type = 'p';
                            break;
                        case '1':
                            type = 'c';
                            break;
                    }
                }
            });
        }else{
            type = $('#bs_type a').attr('data-t');
        }
        return type;
    },
    _refresh:function () {
        var refreshUrl = B_Common._baseHost()+B_Jump._getUrl('refresh');
        refreshUrl = B_Common._encodeUrl(refreshUrl);
        $('.bs_qq').click(function(){
            B_Login._setStatus('out');
            B_Jump._go('base',B_Port._init('qqLogin')+'?redirect_url='+refreshUrl);
        });
        $('.bs_wx').click(function(){
            B_Login._setStatus('out');
            B_Jump._go('base',B_Port._init('wxLogin')+'?redirect_url='+refreshUrl);
        });
    },
    _sms:function () {
        $('#bs_sms_send').click(function(){
            var mobile = $.trim($('input[name="username"]').val());
            if(F_Login._checkMobile('c',mobile)){
                if(!B_CaptchaObj || !B_CaptchaObj.getValidate()){
                    F_Login._notice(2,'请滑动验证');
                    return false;
                }else{
                    F_Login._notice(2,'');
                    F_Login._existsMobile(mobile);
                }
            }else{
                return false;
            }
        });
    },
    _check:function () {
        $('#bs_login_btn').click(function () {
            var postData = F_Login._checkForm();
            if(!postData)return false;
            var url = '';
            if(B_Common._isInner()){
                var $_GET = B_Common._getUrl('query');
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
                                        url = 'outside.html#/gameLight/'+type[1];
                                        break;
                                }
                            }
                            break;
                        case 'service':
                            url = B_Jump._getUrl('main');
                            break;
                        case 'app':
                            url = B_Jump._getUrl('index')+'?f=app';
                            break;
                        case 'background':
                            url = '';
                            break;
                        case 'outsideCenter':
                        case 'outsideAlarm':
                        case 'outsideHotWord':
                        case 'outsideAssistant':
                        case 'outsideChat':
                        case 'outsideFaceSummary':
                        case 'insideSummary':
                        case 'gameSummary':
                        case 'gameSentiment':
                        case 'gameForum':
                            url = B_Jump._getUrl($_GET.from);
                            break;
                    }
                }
                if(url == ''){
                    if(!($_GET.from && $_GET.from == 'background')){
                        url = B_Common._parentUrl();
                        if(url.indexOf('#')>-1){
                            url = url.split('#')[0];
                        }
                    }
                }
            }else{
                //url = B_Login._loginBackUrl();
                url = B_Jump._getUrl('main');
            }
            B_Login._in(
                postData,
                function(){
                    $('#bs_login_btn').html('登录中,请稍等...').attr('disabled',true);
                },
                function(){
                    $('#bs_login_btn').html('登录').attr('disabled',false);
                },
                url
            );
            return false;
        })
    },
    _typeChange:function (type) {
        switch (type){
            case 'inner':
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
                break;
            case 'page':
                $('#bs_type a').click(function () {
                    var type = $(this).attr('data-t');
                    var parent = $('#bs_type label');
                    switch(type){
                        case 'c':
                            $(this).attr('data-t','p');
                            $('.bs_pass').show();
                            $('.bs_code').hide();
                            parent.html('使用验证码登录');
                            break;
                        case 'p':
                            $(this).attr('data-t','c');
                            $('.bs_pass').hide();
                            $('.bs_code').show();
                            parent.html('使用帐号密码登录');
                            break;
                    }
                });
                break;
        }
    },
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
            case 'p':
                if(userPass == ''){
                    F_Login._notice(1,'密码不能为空');
                    return false;
                }else{
                    F_Login._notice(1,'');
                }
                postData['password'] = userPass;
                break;
            case 'c':
                if(userCaptcha == ''){
                    F_Login._notice(2,'短信验证码不能为空');
                    return false;
                }else{
                    F_Login._notice(2,'');
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
    _checkMobile:function(type,userName){
        if(userName == ''){
            F_Login._notice(0,'手机号不能为空');
            return false;
        }else{
            F_Login._notice(0,'');
        }
        switch(type+''){
            case 'p':
                var offset = 'auto';
                if(B_Common._isInner()){
                    offset = ['190px','50px'];
                }
                if(B_Common._isMail(userName)){
                    B_Pop._init('msg',{'offset':offset,'content':'尊敬的用户，考虑到数据安全性，我们已关闭邮箱登录功能。建议您采用手机号注册登录'});
                    return false;
                }
                if(!(B_Common._isMobile(userName))){
                    F_Login._notice(0,'手机号格式错误');
                    return false;
                }else{
                    F_Login._notice(0,'');
                }
                break;
            case 'c':
                if(!B_Common._isMobile(userName)){
                    F_Login._notice(0,'手机号格式错误');
                    return false;
                }else{
                    F_Login._notice(0,'');
                }
                break;
        }
        return true;
    },
    _existsMobile:function(mobile){
        var dom = $('#bs_sms_send');
        var postData = {};
        postData['mobile'] = mobile;
        postData = B_Common._postData(postData);
        B_Port._ajax('register','get',true,postData,function(){
                dom.text('手机验证中').attr('disabled',true);
            },function(){
                dom.text('获取验证码').attr('disabled',false);
            },function(data, msg){
                if(data.mobile_exist+'' == '0'){
                    F_Login._notice(0,'当前手机号码未注册');
                    return false;
                }else{
                    B_Captcha._getVCode(mobile);
                }
            },function(data, msg, code){
                B_Port._init('msg',{'content':msg});
                return false;
            }
        )
    }
}
