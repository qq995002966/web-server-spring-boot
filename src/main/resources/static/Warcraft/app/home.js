// $(function(){ 
// $('#RegisterPart  input').bind({ 
// focus:function(){ 
// $(this).parents('#RegisterPart').addClass('margin-bottom');
// }, 
// blur:function(){ 
// $(this).parents('#RegisterPart').removeClass('margin-bottom');
// } 
// }); 
// })
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
visitFromMobile();
$(function(){
    $('.question-icon').click(function(){
        W_Common._pop('<img class="pop-pic" src="assets/images/pop-pic.png"',[],'question');
    });
})
Zepto(function ($) {

//curtain show delay 2s
  function homeShow() {
    setTimeout(function () {
      $('#Curtain').show()
    }, 2000)
  }

  homeShow();
//contain-animation
  $('.slider-top').addClass('animation');
  $('.slider-bottom').addClass('animation');

//tab change
  $('.tab-change li').on('click',function(){
    var contentUrl = $(this).attr('href');
    $('.tab-change .tab-title').addClass('yellowb')
    $(this).children('.tab-title').removeClass('yellowb');
    $('.tab-content').hide(500);
    $(contentUrl).show(500);
  });

//btn change
  // $('.footer-btn .clause').tap(function () {
  //   $('.footer-btn .start').addClass('yellowb').css('background-position', '0 -4.02rem');
  //   $('.footer-btn .hero').addClass('yellowb').css('background-position', '0 -3rem');
  //   $('.rate-pop.curtain').hide(500);
  // });

// invitation-btn
  // $('.invitation').tap(function () {
  //   var text = $(this).children('.btn-text').text()
  //   $('.pop-case').show(500);
  //   if (text == "发出邀请") {
  //     $('#trueInfor').show(500);
  //   }
  //   else if (text == "确认登记") {
  //     $('#falseInfor').show(500);
  //   }
  // });

//close pop-case
    $('.pop-case').on('click',function(){
        $(this).hide(500);
    });
  // var configSession = true;
  // if(docCookies.hasItem('firstTime')){
  //   // that.homeContentShow = true
  // }else {
  //   docCookies.setItem('firstTime', 'true')
  //   homeShow();
  // }
});

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
function visitFromMobile(){
    var thisOS = navigator.platform;
    var os = new Array("Win","Mac");
    var url = (window.location.host.indexOf("127.0.0.1")>=0 || window.location.host.indexOf("192.")>=0) ? "http://"+window.location.host+"/web-server/" : "http://"+window.location.host+"/"
    for(var i=0;i<os.length;i++){
        if(thisOS.match(os[i])){
            alert('请使用手机访问'+url+'Warcraft/');
            window.location.href = url+'Warcraft.html';
            return false;
            break;
        }
    }
}
var W_Jump = {
    _go:function(type,url){
        switch(type){
            case 'open':
                window.open(url);
                break;
            case 'target':
                top.window.location.href = url;
                break;
        }
    },
    _getUrl:function(type){
        switch(type){
            case 'login':
                return 'login.html';
                break;
            case 'fight':
                return 'startfight.html';
                break;
            case 'register':
                return 'register.html';
                break;
            case 'success':
                return 'success.html';
                break;
        }
    }
};
var W_Port = {
    _init:function(type){
        var url = W_Common._baseHost();
        switch(type){
            case 'combatInfo':
                return url+'MyCombatInfoServlet';
                break;
            case 'dpsRank':
                return url+'UserDpsRankServlet';
                break;
            case 'bindRegister':
                return url+'UserBindRegisterServlet';
                break;
            case 'wowGroup':
                return url+'JoinWowGroupServlet';
                break;
            case 'login':
                return url+'LoginServlet';
                break;
            case 'register':
                return url+'Reg1Servlet';
                break;
            case 'captcha':
                return url+'StartCaptchaServlet';
                break;
            case 'checkMobile':
                return url+'CheckMobileUsedServlet';
                break;
            case 'sms':
                return url+'SendSmsCodeServlet';
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
                        case '-1001':
                        case '-1016':
                            W_Login._out();
                            W_Jump._go('target',W_Jump._getUrl('login'));
                            break
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
var W_Cookie = {
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
        W_Cookie._set(name,'',-1);
    }
};
var W_InviteToken = {
    _cookieName:{invite:'TGINVITE',join:'TGJOIN',share:'TGSHARE'},
    _get:function(type){
        var token = W_Cookie._get(W_InviteToken._cookieName[type]);
        if(token && token != ''){
            return token;
        }else{
            return false;
        }
    },
    _set:function(type,token){
        if(token && token != ''){
            W_Cookie._set(W_InviteToken._cookieName[type],token);
        }
    },
    _del:function(type){
        W_Cookie._del(W_InviteToken._cookieName[type]);
    }
}
var W_Login = {
    _cookieName:'TGWARCRAFT',
    _shareTokenGet:function(){
        return W_InviteToken._get('share') ? W_InviteToken._get('share') : '';
    },
    _bind:function(inviteToken,url){
        setTimeout(function(){
            W_Port._ajax('bindRegister','get',true,'invite_token='+inviteToken,null,null,
                function(data, msg){
                    W_InviteToken._set('share',data.invite_token);
                    if(inviteToken){
                        W_InviteToken._del('invite');
                        W_Jump._go('target',W_Jump._getUrl('success'));
                    }else{
                        if(!url)url = W_Jump._getUrl('fight')+'?token='+data.invite_token;
                        W_Jump._go('target',url);
                    }
                },
                null
            )
        },500)
    },
    _check:function(){
        var username = W_Cookie._get(W_Login._cookieName);
        if(username && username != ''){
            return username;
        }else{
            return false;
        }
    },
    _in:function(data,start,end,url,checkBtn){
        W_Port._ajax('login','post',true,data,start,end,
            function(data, msg){
                W_Cookie._set(W_Login._cookieName,'1');
                var inviteToken = W_InviteToken._get('invite') ? W_InviteToken._get('invite') : '';
                W_Login._bind(inviteToken,url);
                return false;
            },
            function(data, msg, code){
                W_Common._pop(msg,checkBtn);
                return false;
            }
        )
    },
    _out:function(){
        W_Cookie._del(W_Login._cookieName);
    },
    _nick:function(user){
        if(!!user && !!user.data.nick_name){
            user = user.data;
            var nick_name = user.nick_name;
            if(nick_name.indexOf("*")==0){
                // 自动生成的昵称
                if(user.mobile){
                    if(user.mobile.length>=11){
                        nick_name = user.mobile.substr(0,3)+"*****"+user.mobile.substr(8,11);
                    }
                }else if(user.email){
                    var p1 = user.email.split("@")[0];
                    var p2 = user.email.split("@")[1];
                    if(p1.length>1){
                        var p11 = p1[0] ;
                        p11 += '*';
                        p1 = p11;
                    }
                    nick_name = p1+"@"+p2;
                }
            }
            return nick_name;
        }else{
            return '';
        }
    },
    _backUrl:function(type,url){
        var cookieName = 'CLoginBackUrl';
        switch(type){
            case 'set':
                var backUrl = url ? url : W_Common._lastUrl();
                if(backUrl){
                    var isExcepted = false;
                    var excepted = ['register','login','find'];
                    for(var i=0;i<excepted.length;i++){
                        if(backUrl.indexOf(excepted[i]) > -1){
                            isExcepted = true;
                        }
                    }
                    if(!isExcepted)W_Cookie._set(cookieName,backUrl);
                }
                break;
            case 'get':
                var backUrl = W_Cookie._get(cookieName);
                if(backUrl){
                    W_Cookie._del(cookieName);
                    return backUrl;
                }else{
                    return G_Jump._getUrl('light');
                }
                break;
            case 'reg':
                var backUrl = W_Cookie._get(cookieName);
                if(!backUrl)W_Cookie._backUrl('set');
                break;
        }
    }
}
var W_Captcha = {
    _getCaptcha:function(dom){
        try{
            var url = W_Port._init('captcha');
            $.ajax({
                timeout:30000,
                async:true,
                type:'get',
                url:url,
                data:null,
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    return;
                },
                success:function(back){
                    config = $.parseJSON(back);
                    if(config){
                        window.W_CaptchaObj = new window.Geetest({
                            gt : config.gt,
                            challenge : config.challenge,
                            product : 'popup',
                            offline : !config.success
                        });
                        W_CaptchaObj.bindOn('#captchaCheck');
                        W_CaptchaObj.appendTo('#'+dom);
                    }
                }
            });
        }catch (e){
            return;
        }
    },
    _refreshCaptcha:function(){
        W_CaptchaObj && W_CaptchaObj.refresh();
    }
}
var W_Common = {
    _cdnImgUrl:function(){
        return 'http://image.thinkinggame.cn/img/';
    },
    _pop:function(content,btn,title){
        if(!title)title = '信息填写有误';
        var str = '';
        btn = btn.join(' ');
        switch(title){
            case 'question':
                str += '\
               <div class="pop-case">'+content+'\
               </div>';
                break;
            case '联军招募':
                str += '\
               <div class="pop-case">\
                   <div id="longInfor" class="pop-content"><span>'+title+'</span>\
                   <div class="border-p">'+content+'\
                   </div>'+btn+'\
                   </div>\
               </div>';
                break;
            default:
                str += '\
               <div class="pop-case">\
                   <div id="trueInfor" class="pop-content"><span>'+title+'</span>\
                   <div class="border-p">\
                   <p>'+content+'</p>\
                   </div>'+btn+'\
                   </div>\
               </div>';
                break;
        }
        $('#bs_pop').html(str);
        switch(title){
            case '加入成功':
                $('.pop-btn').click(function(){
                    W_Jump._go('target',W_Jump._getUrl('login')+'?t=s');
                });
                break;
            case '联军招募':
                W_Common._popClose('btnOnly');
                break;
            default:
                W_Common._popClose();
                break;
        }
    },
    _popClose:function(type){
        switch(type){
            case 'btnOnly':
                $('.pop-btn').click(function () {
                    $('.pop-case').hide();
                });
                break;
            default:
                $('.pop-case').click(function () {
                    $(this).hide();
                });
                break;
        }
    },
    _lastUrl:function(){
        return document.referrer;
    },
    _isMail:function(data){
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(data);
    },
    _isMobile:function(data){
        return /^1\d{10}$/.test(data);
    },
    _baseHost:function(){
        return (window.location.host.indexOf("127.0.0.1")>=0 || window.location.host.indexOf("192.")>=0) ? "http://"+window.location.host+"/web-server/" : "http://"+window.location.host+"/";
    },
    _appUrl:function(){
        return W_Common._baseHost()+'Warcraft/';
    },
    _getUrl:function(type){
        var fullUrl = window.document.location.href.toString();
        var urlArray = fullUrl.split("?");
        var url = urlArray[0];
        var query = urlArray[1];
        switch(type){
            case 'query':
                if(typeof(query) == "string"){
                    urlArray = query.split("&");
                    var get = {};
                    for(var i in urlArray){
                        var j = urlArray[i].split("=");
                        get[j[0]] = j[1];
                    }
                    return get;
                } else {
                    return {};
                }
                break;
            case 'controller':
                url = url.toLowerCase();
                urlArray = url.split("/");
                var controller = urlArray.pop();
                controller = controller.replace('.html','');
                return controller;
                break;
        }
    }
}