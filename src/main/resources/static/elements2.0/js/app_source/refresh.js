require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        F_Refresh_Entrance._init();
    });
});
var F_Refresh_Entrance = {
    _init:function () {
        var url = B_Login._loginBackUrl();
        if(url.indexOf('Mobile/') > -1){
            B_Cookie._set('MobileLoginInit',1);
            B_Jump._go('base',url);
        }else{
            B_Login._setStatus('out');
            var $_GET = B_Common._getUrl('query');
            if($_GET.bind){
                if($_GET.msg){
                    switch ($_GET.msg){
                        case '-1051':
                            B_Pop._init('confirm',{'content':'当前绑定的QQ号码已绑定其他账号，确认绑定？',btn:['确认','取消'],title:'操作提示'},function () {
                                F_Refresh_Entrance._bind('qq');
                            },function () {
                                B_Jump._go('target','member');
                            });
                            break;
                        case '-1052':
                            B_Pop._init('confirm',{'content':'当前绑定的微信已绑定其他账号，确认绑定？',btn:['确认','取消'],title:'操作提示'},function () {
                                F_Refresh_Entrance._bind('wx');
                            },function () {
                                B_Jump._go('target','member');
                            });
                            break;
                    }
                }else{
                    B_Jump._go('target','member');
                }
            }else{
                B_Login._checkUpdate(function(data){
                    F_Refresh_Entrance._check(data,url)
                },function(data){
                    F_Refresh_Entrance._check(data,url)
                });
            }
        }
    },
    _check:function (data,url) {
        if(data && data.user && data.user.mobile && data.user.mobile.length>=11){
            //B_Jump._go('base',url);
            B_Jump._go('target','member');
        }else{
            B_Jump._go('target','bind');
        }
    },
    _bind:function (type) {
        B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        var postData = {};
        postData['type'] = type;
        postData = B_Common._postData(postData);
        B_Port._ajax('thirdpartyBind','get',true,postData,null,null,function(data,msg){
                B_Jump._go('target','member');
            },function(data,msg,code){
                B_Pop._init('msg',{'content':msg});
            }
        )
    }
}
