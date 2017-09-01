require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min','app/inside'], function (){
        store = require('store.min');
        F_Information_Entrance._init();
    });
});
var F_Information_Entrance = {
    _init:function (data) {
        S_HeadFoot._getLoginHead('信息完善');
        $('.h-logo').click(function(){
            B_Jump._go('target','index');
        });
        $('#bs_back').click(function () {
            B_Jump._go('base',B_Login._loginBackUrl());
        });
        B_Common._submitBind($('#bs_info_btn'),$('input[name="companyName"],input[name="realName"],input[name="email"]'));

        F_Information._htmlInit();
        F_Information._check();
    }
}
var F_Information = {
    _check:function () {
        $('#bs_info_btn').click(function(){
            var companyName = $.trim($('input[name="companyName"]').val());
            if(companyName == ''){
                B_Pop._init('msg',{'content':'请填写公司名称'});
                return false;
            }
            var realName = $.trim($('input[name="realName"]').val());
            if(realName == ''){
                B_Pop._init('msg',{'content':'请填写真实姓名'});
                return false;
            }
            var company_type = $('#bs_company_type p span').attr('data-i');
            if(company_type == ''){
                B_Pop._init('msg',{'content':'请选择公司类型'});
                return false;
            }
            var job_type = $('#bs_job_type p span').attr('data-i');
            if(job_type == ''){
                B_Pop._init('msg',{'content':'请选择公司职位'});
                return false;
            }
            var email = $.trim($('input[name="email"]').val());
            if(email == ''){
                B_Pop._init('msg',{'content':'请填写电子邮箱'});
                return false;
            }
            if(!B_Common._isMail(email)){
                B_Pop._init('msg',{'content':'电子邮箱格式错误'});
                return false;
            }
            var content = $.trim($('input[name="content"]').val());
            var postData = {};
            postData['email'] = email;
            postData['company_type'] = company_type;
            postData['company_name'] = companyName;
            postData['real_name'] = realName;
            postData['job_type'] = job_type;
            postData['project_names'] = content;
            postData = B_Common._postData(postData);
            B_Port._ajax('identity','post',true,postData,function(){
                    $('#bs_info_btn').html('保存中,请稍等...').attr('disabled',true);
                },function(){
                    $('#bs_info_btn').html('保存').attr('disabled',false);
                },function(data,msg){
                    B_Pop._init('alert',{'content':'保存成功，即将跳转到注册前页面'});
                    setTimeout(function(){
                        return B_Jump._go('base',B_Login._loginBackUrl());
                    },3000)
                },function(data,msg,code){
                    B_Pop._init('msg',{'content':msg});
                }
            )
            return false;
        });
    },
    _htmlInit:function () {
        $('#bs_company_type ul').html(F_Information._htmlSelect(B_User._information.companyArr));
        $('#bs_job_type ul').html(F_Information._htmlSelect(B_User._information.jobArr));

        M_Inside._dropShow();
        M_Inside._dropLeave();
        M_Inside._dropSelected();
    },
    _htmlSelect:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<li><a data-i="'+i+'">'+data[i]+'</a></li>';
        }
        return str;
    }
}
