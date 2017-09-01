require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        $('.blue-button').click(function () {
            F_Application._doApp();
        });
        $('.gray-button').click(function () {
            parent.B_Pop._init('close');
        });
        var F_Application = {
            _doApp:function () {
                var user_name = $.trim($('input[name="user_name"]').val());
                var user_company = $.trim($('input[name="user_company"]').val());
                var user_duty = $.trim($('input[name="user_duty"]').val());
                var user_phone = $.trim($('input[name="user_phone"]').val());

                if(user_name == ''){
                    B_Pop._init('msg',{content:'姓名必须填写'});
                    return false;
                }
                if(user_company == ''){
                    B_Pop._init('msg',{content:'公司必须填写'});
                    return false;
                }
                if(user_duty == ''){
                    B_Pop._init('msg',{content:'职位必须填写'});
                    return false;
                }
                if(user_phone == ''){
                    B_Pop._init('msg',{content:'手机号必须填写'});
                    return false;
                }
                if(!B_Common._isMobile(user_phone)){
                    B_Pop._init('msg',{content:'手机号格式错误'});
                    return false;
                }
                var dom = $('.blue-button');

                var postData = {};
                postData['user_name'] = user_name;
                postData['user_company'] = user_company;
                postData['user_position'] = user_duty;
                postData['user_phone'] = user_phone;
                postData = B_Common._postData(postData);
                B_Port._ajax('operationJoin','post',true,postData,function(){
                        B_Common._btnTextStatus('disable',dom,{'disable':'报名中..'});
                        B_Common._btnTextStatus('disable',$('.gray-button'),{'disable':'取消报名'});
                    },function(){
                        B_Common._btnTextStatus('normal',dom,{'normal':'确认报名'});
                        B_Common._btnTextStatus('normal',$('.gray-button'),{'normal':'取消报名'});
                    },function(data,msg){
                        parent.B_Pop._init('checkAlert',{content:'恭喜您报名成功！'});
                    },function(data,msg,code){
                        B_Pop._init('msg',{content:msg});
                    }
                )
            }
        }
    });
});