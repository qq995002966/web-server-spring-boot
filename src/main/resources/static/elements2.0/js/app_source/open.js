require(['frontmain'], function () {
    require(['jquery','layer','base','front','app/inside','store.min'], function (){
        store = require('store.min');
        B_Login._checkUpdate();
        var F_Open = {
            _htmlOk:function () {
                var str = '';
                str += '<div class="open_ok_img"></div>';
                str += '<div class="open_ok_text">感谢您申请ThinkingGame智能运营平台产品演示<br>我们将在<span>2个工作日</span>内与您取得进一步联系</div>';
                str += '<div class="open_ok_btn"><button type="button" class="btn btn-info blue-button">返回</button> <button type="button" class="btn btn-default gray-button">在线客服</button></div>';

                $('#open_s').html(str);

                $('.blue-button').click(function () {
                    parent.B_Pop._init('close');
                });
                $('.gray-button').click(function () {
                    B_Jump._go('openUrl',B_Common._qqUrl());
                });
            },
            _htmlInit:function () {
                var user = {'company_type':0,'job_type':0,'company_name':'','real_name':'','email':'','project_names':'','mobile':''};
                if(B_Login._user && B_Login._user.user){
                    var data = B_Login._user.user;
                    user['company_type'] = data.company_type;
                    user['job_type'] = data.job_type;
                    user['company_name'] = data.company_name;
                    user['real_name'] = data.real_name;
                    user['email'] = data.email;
                    user['project_names'] = data.project_names;
                    user['mobile'] = data.mobile;
                }
                var str = '';
                str += '<dl><dt>* 公司名称：</dt><dd><input type="text" name="user_company" placeholder="您当前就职的公司" maxlength="32" value="'+user.company_name+'"></dd></dl>';
                str += '<dl><dt>* 公司类型：</dt><dd>';
                str += '<div id="selectWrap"><div id="bs_company_type" class="dropDown tg-selected-drop">';
                if(B_User._information.companyArr[user.company_type]){
                    str += '<p><span data-i="'+user.company_type+'">'+B_User._information.companyArr[user.company_type]+'</span><i class="drop-icon"></i></p>';
                }else{
                    str += '<p><span data-i="">请选择公司类型</span><i class="drop-icon"></i></p>';
                }
                str += '<ul class="b_none">'+F_Open._htmlSelect(B_User._information.companyArr)+'</ul></div></div>';
                str += '</dd></dl>';
                str += '<dl><dt>* 联系人：</dt><dd><input type="text" name="user_name" placeholder="请输入您的真实姓名" maxlength="16" value="'+user.real_name+'"></dd></dl>';
                str += '<dl><dt>* 手机号码：</dt><dd><input type="text" name="user_phone" placeholder="请填写能联系到您的手机号码" maxlength="11" value="'+user.mobile+'"></dd></dl>';
                str += '<dl><dt>* 公司邮箱：</dt><dd><input type="text" name="user_email" placeholder="请填写您在公司使用的公司邮箱" maxlength="64" value="'+user.email+'"></dd></dl>';
                str += '<dl><dt>* 公司职位：</dt><dd>';
                str += '<div id="selectWrap"><div id="bs_job_type" class="dropDown tg-selected-drop">';
                if(B_User._information.jobArr[user.job_type]){
                    str += '<p><span data-i="'+user.job_type+'">'+B_User._information.jobArr[user.job_type]+'</span><i class="drop-icon"></i></p>';
                }else{
                    str += '<p><span data-i="">请选择公司职位</span><i class="drop-icon"></i></p>';
                }
                str += '<ul class="b_none">'+F_Open._htmlSelect(B_User._information.jobArr)+'</ul></div></div>';
                str += '</dd></dl>';
                str += '<dl><dt>公司产品：</dt><dd><input type="text" name="user_product" placeholder="请输入贵公司开发或运营的游戏" maxlength="150" value="'+user.project_names+'"></dd></dl>';
                str += '<dl><dt>&nbsp;</dt><dd style="margin-left: 120px; margin-top: 20px"><button type="button" class="btn btn-info blue-button">提交申请</button></dd></dl>';

                $('#open_s').html('<div id="bs_open_main">'+str+'</div>');

                M_Inside._dropShow();
                M_Inside._dropLeave();
                M_Inside._dropSelected();

                $('.blue-button').click(function () {
                    F_Open._doApp();
                });
            },
            _doApp:function () {
                var user_name = $.trim($('input[name="user_name"]').val());
                var user_company = $.trim($('input[name="user_company"]').val());
                var user_email = $.trim($('input[name="user_email"]').val());
                var user_phone = $.trim($('input[name="user_phone"]').val());
                var user_product = $.trim($('input[name="user_product"]').val());
                var company_type = $('#bs_company_type p span').attr('data-i');
                var job_type = $('#bs_job_type p span').attr('data-i');

                if(user_company == ''){
                    B_Pop._init('msg',{content:'公司名称必须填写'});
                    return false;
                }
                if(company_type == ''){
                    B_Pop._init('msg',{content:'公司类型必须选择'});
                    return false;
                }
                if(user_name == ''){
                    B_Pop._init('msg',{content:'联系人必须填写'});
                    return false;
                }
                if(user_phone == ''){
                    B_Pop._init('msg',{content:'手机号码必须填写'});
                    return false;
                }
                if(!B_Common._isMobile(user_phone)){
                    B_Pop._init('msg',{content:'手机号格式错误'});
                    return false;
                }
                if(user_email == ''){
                    B_Pop._init('msg',{content:'公司邮箱必须填写'});
                    return false;
                }
                if(!B_Common._isMail(user_email)){
                    B_Pop._init('msg',{content:'公司邮箱式错误'});
                    return false;
                }
                if(job_type == ''){
                    B_Pop._init('msg',{content:'公司职位必须选择'});
                    return false;
                }

                var dom = $('.blue-button');
                var postData = {};
                postData['user_company'] = user_company;
                postData['company_type'] = company_type;
                postData['user_name'] = user_name;
                postData['user_phone'] = user_phone;
                postData['email'] = user_email;
                postData['job_type'] = job_type;
                postData['project_names'] = user_product;
                postData = B_Common._postData(postData);

                B_Port._ajax('operationApply','post',true,postData,function(){
                        B_Common._btnTextStatus('disable',dom,{'disable':'提交中..'});
                        B_Common._btnTextStatus('disable',$('.gray-button'),{'disable':'取消申请'});
                    },function(){
                        B_Common._btnTextStatus('normal',dom,{'normal':'提交申请'});
                        B_Common._btnTextStatus('normal',$('.gray-button'),{'normal':'取消申请'});
                    },function(data,msg){
                        F_Open._htmlOk();
                    },function(data,msg,code){
                        B_Pop._init('msg',{content:msg});
                    }
                )
            },
            _htmlSelect:function(data){
                var str = '';
                for(var i=0;i<data.length;i++){
                    str += '<li><a data-i="'+i+'">'+data[i]+'</a></li>';
                }
                return str;
            }
        }

        F_Open._htmlInit();
    });
});