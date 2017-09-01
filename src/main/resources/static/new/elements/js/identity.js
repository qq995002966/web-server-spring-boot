$(function(){
    G_Login._check();
    C_Dom._header(-1);
    C_Dom._footer();
    G_Login._status('user');
    G_Game._getCollect();

    F_Identity._getInfo();

    submitBind($('.save-btn button'));
    $('.save-btn button').click(function(){
        var companyName = $.trim($('input[name="companyName"]').val());
        if(companyName == ''){
            G_Pop._init('msg',{'content':'请填写公司名称'});
            return false;
        }
        var realName = $.trim($('input[name="realName"]').val());
        if(realName == ''){
            G_Pop._init('msg',{'content':'请填写真实姓名'});
            return false;
        }
        var company_type = $('.bs_company p').attr('data-i');
        if(company_type == ''){
            G_Pop._init('msg',{'content':'请选择公司类型'});
            return false;
        }
        var job_type = $('.bs_job p').attr('data-i');
        if(job_type == ''){
            G_Pop._init('msg',{'content':'请选择工作职能'});
            return false;
        }
        var content = $('textarea[name="content"]').val();

        G_Port._ajax('identity','post',true,'company_type='+company_type+'&company_name='+companyName+'&real_name='+realName+'&job_type='+job_type+'&project_names='+content,function(){
                btnStatus('post','disable',$('.save-btn button'));
            },function(){
                btnStatus('post','normal',$('.save-btn button'));
            },function(data,msg){
                var data = {'key':['status'],'val':[1]}
                G_User._setData(data);
                G_Pop._init('alert',{'content':'身份认证提交成功！','icon':6});
                F_Identity._getInfo();
            },function(data,msg,code){
                G_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    });

});

var F_Identity = {
    _getInfo:function(){
        var companyArr = ['游戏研发','渠道','发行/运营','外包','投资','第三方服务','广告商','IP授权方','游戏媒体','其他'];
        var jobArr = ['公司高管','游戏制作人','游戏运营','市场人员','商务人员','游戏策划','开发工程师','游戏测试','美术/UI/动画','音乐/音效','行政/人力','投资','销售','客服','其他'];
        var person = G_User._getData();
        var str = '';
        var status = parseInt(person.status);
        if(status < 0){
            str += '\
                <div class="tips">\
                    <ul>\
                        <li><b>**</b>提示信息<b>**</b></li>\
                        <li>认证失败</li>\
                        <li>如有任何疑问，请联系我们。<b>service@thinkingdata.cn</b></li>\
                    </ul>\
                </div>';
        }else if(status == 0){
            $('.bs_company').append(F_Identity._htmlSelect(companyArr));
            $('.bs_job').append(F_Identity._htmlSelect(jobArr));
            $('input[name="companyName"]').val(person.company_name);
            $('input[name="realName"]').val(person.real_name);
            if(person.company_type){
                var companyType = companyArr[person.company_type];
            }else{
                var companyType = '请选择公司类型';
            }
            $('.bs_company p').html(companyType).attr('data-i',person.company_type);

            if(person.job_type){
                var joType = jobArr[person.job_type];
            }else{
                var jobType = '请选择工作职能';
            }
            $('.bs_job p').html(jobType).attr('data-i',person.job_type);

        }else if(status == 1){
            str += '\
                <div class="tips">\
                    <ul>\
                        <li><b>**</b>提示信息<b>**</b></li>\
                        <li>我们正在处理您的身份认证，请耐心等待</li>\
                        <li>如有任何疑问，请联系我们。<b>service@thinkingdata.cn</b></li>\
                    </ul>\
                </div>';
        }else if(status > 1){
            str += '\
                <div class="tips">\
                    <ul>\
                        <li><b>**</b>提示信息<b>**</b></li>\
                        <li>认证成功</li>\
                        <li>如有任何疑问，请联系我们。<b>service@thinkingdata.cn</b></li>\
                    </ul>\
                </div>';
        }
        $('#idenTity').html(str);
    },
    _htmlTag:function(data){

    },
    _htmlSelect:function(data){
        var str = '<ul>';
        for(var i=0;i<data.length;i++){
            str += '<li></li>';
        }
        str += '</ul>';
    }
}