$(function(){
    G_Login._check();
    C_Dom._header(-1);
    C_Dom._footer();
    G_Login._status('user');
    G_Game._getCollect();
    var user = G_Login._user.user;
    if(!(!!user && !!user.mobile && user.mobile != '')){
        openBind();
    }
    F_Identity._getInfo();
});

var F_Identity = {
    _redo:function(){
        $('.tips .btn-info').click(function(){
            var data = {};
            data.companyType = F_Identity._htmlSelect(F_Identity._init.companyArr);
            data.jobType = F_Identity._htmlSelect(F_Identity._init.jobArr);
            $('#idenTity').html(F_Identity._htmlInput(data));
            dropShow();
            dropSelected();
            F_Identity._post();
        });
    },
    _post:function(){
        submitBind($('.save-btn button'),$('input[name="companyName"],input[name="realName"],input[name="email"]'));
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
            var email = $.trim($('input[name="email"]').val());
            if(email == ''){
                G_Pop._init('msg',{'content':'请填写邮箱'});
                return false;
            }
            if(!(G_Common._isMail(email))){
                G_Pop._init('msg',{'content':'邮箱格式错误，请确认'});
                return false;
            }
            var content = $('textarea[name="content"]').val();

            G_Port._ajax('identity','post',true,'email='+email+'&company_type='+company_type+'&company_name='+companyName+'&real_name='+realName+'&job_type='+job_type+'&project_names='+content,function(){
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
    },
    _init:{companyArr:['游戏研发','渠道','发行/运营','外包','投资','第三方服务','广告商','IP授权方','游戏媒体','其他'],jobArr:['公司高管','游戏制作人','游戏运营','市场人员','商务人员','游戏策划','开发工程师','游戏测试','美术/UI/动画','音乐/音效','行政/人力','投资','销售','客服','其他']},
    _getInfo:function(){
        var companyArr = F_Identity._init.companyArr;
        var jobArr = F_Identity._init.jobArr;
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
                        <li><button type="button" class="btn btn-info">重新认证</button></li>\
                    </ul>\
                </div>';
        }else if(status == 0){
            var data = {};
            data.companyType = F_Identity._htmlSelect(companyArr);
            data.jobType = F_Identity._htmlSelect(jobArr);
            str += F_Identity._htmlInput(data);
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
            str = F_Identity._htmlChecked({companyType:companyArr[person.company_type],companyName:person.company_name,realName:person.real_name,jobType:jobArr[person.job_type],product:person.project_names,email:person.email});
        }
        $('#idenTity').html(str);
        if(status == 0){
            dropShow();
            dropSelected();
            F_Identity._post();
        }else if(status < 0){
            F_Identity._redo();
        }
    },
    _htmlInput:function(data){
        var str = '';
        str += '\
            <ul>\
                <li>\
                    <span>公司类型:</span>\
                    <div id="selectWrap">\
                        <div id="dropDown" class="bs_company">\
                            <p data-i="">请选择公司类型</p>\
                            <i class="drop-icon"></i>'+data.companyType+'\
                        </div>\
                    </div>\
                </li>\
                <li>\
                <span>公司名称:</span>\
                    <input type="text" name="companyName" placeholder="请输入" class="search-input">\
                </li>\
                <li>\
                    <span>真实姓名:</span>\
                    <input type="text" name="realName" placeholder="请输入" class="search-input">\
                </li>\
                <li>\
                    <span>工作职能:</span>\
                    <div id="selectWrap">\
                        <div id="dropDown" class="bs_job">\
                            <p data-i="">请选择工作职能</p>\
                            <i class="drop-icon"></i>'+data.jobType+'\
                        </div>\
                    </div>\
                </li>\
                <li>\
                <span>邮箱:</span>\
                    <input type="text" name="email" placeholder="请输入" class="search-input">\
                </li>\
                <li style="height: 170px;">\
                    <span>公司产品:</span>\
                    <textarea name="content" placeholder="请输入贵公司开发或者运营的游戏"></textarea>\
                </li>\
            </ul>\
            <div class="save-btn submit">\
                <button type="" >确认提交</button>\
            </div>';
        return str;
    },
    _htmlChecked:function(data){
        var str = '';
        var email = '未设置';
        if(data.email){
            var emailArr = data.email.split('@');
            email = emailArr[0].substr(0,1)+new Array( emailArr[0].length ).join('*')+'@'+emailArr[1];
        }
        str += '\
            <ul>\
                <li>\
                    <span>公司类型:</span>\
                    <b>'+data.companyType+'</b>\
                </li>\
                <li>\
                    <span>公司名称:</span>\
                    <b>'+data.companyName+'</b>\
                </li>\
                <li>\
                    <span>真实姓名:</span>\
                    <b>'+data.realName+'</b>\
                </li>\
                <li>\
                    <span>工作职能:</span>\
                    <b>'+data.jobType+'</b>\
                </li>\
                <li>\
                    <span>邮箱:</span>\
                    <b>'+email+'</b>\
                </li>\
                <li style="height: 170px;">\
                    <span>公司产品:</span>\
                    <b>'+data.product+'</b>\
                </li>\
            </ul>';
        return str;
    },
    _htmlSelect:function(data){
        var str = '<ul>';
        for(var i=0;i<data.length;i++){
            str += '<li><a href="#" data-i="'+i+'">'+data[i]+'</a></li>';
        }
        str += '</ul>';
        return str;
    }
}