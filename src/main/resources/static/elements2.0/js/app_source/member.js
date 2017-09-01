var F_Member_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(10000);
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            F_Member_Info._html();
        }
    }
}
var F_Member_Info = {
    _html:function () {
        var user = B_Login._user.user;
        var mobile = (user.mobile && user.mobile.length >= 11) ? user.mobile.substr(0,3)+"*****"+user.mobile.substr(8,11) : ''
        var info = '';
        info += '<li><b>账户昵称：</b>';
        info += '<span id="bs_nick_name">'+user.nick_name+'</span><span class="edit text-blue" id="bs_nick_edit">修改</span>';
        info += '<input type="text" value="'+user.nick_name+'" maxlength="20" id="bs_nick_val" class="b_none"><span class="edit text-blue" id="bs_nick_confirm" style="display: none">确认</span>';
        info += '</li>';
        info += '<li><b>登录账号：</b>';
        info += '<span>';
        if(mobile){
            info += mobile;
        }else{
            info += '未绑定';
        }
        info += '</span>';
        info += '</li>';
        info += '<li><b>账户状态：</b>';
        if(mobile != ''){
            info += ' <span class="text-green">密码保护中</span>';
        }else{
            info += '<span class="text-red">存在安全风险，请设置登录密码</span>';
        }
        info += '</li>';
        $('#bs_user_info').html(info);
        F_Member_Info._clickNick();

        var status = '';
        status += '<li><b>登录密码：</b><span>	安全性高的密码可以使账号更安全。</span>';
        status += '<div class="fr">';
        if(mobile != ''){
            status += '<i class="had-approve text-green">√</i><span>已设置</span><button class="tg-assist-btn" id="bs_pass_edit">修改密码</button>';
        }else{
            status += '<i class="had-fail text-red">!</i><span class="text-red">未设置</span><button class="tg-assist-btn" id="bs_pass_set">设置密码</button>';
        }
        status += '</div></li>';
        status += '<li><b>手机绑定：</b>';
        if(mobile){
            status += '<span>您已绑定了'+mobile+',您的手机可以直接用于登录，找回密码。</span>';
            status += '<div class="fr">';
            status += '<i class="had-approve text-green">√</i><span>已绑定</span>';
        }else{
            status += '<span>您未绑定了手机,您的手机可以直接用于登录，找回密码。</span>';
            status += '<div class="fr">';
            status += '<i class="had-fail text-red">!</i><span class="text-red">未绑定</span><button class="tg-assist-btn" id="bs_mobile_set">绑定手机</button>';
        }
        status += '</div></li>';
        status += '<li><b>绑定QQ：</b>';
        if(user.qq_name){
            status += '<span>您已绑定了QQ号'+user.qq_name+'，您可以使用QQ号快捷登录</span>';
            status += '<div class="fr">';
            status += '<i class="had-approve text-green">√</i><span>已绑定</span>';
        }else{
            status += '<span>您未绑定QQ号，您可以使用QQ号快捷登录</span>';
            status += '<div class="fr">';
            status += '<i class="had-fail text-red">!</i><span class="text-red">未绑定</span><button class="tg-assist-btn" id="bs_qq_set">绑定QQ</button>';
        }
        status += '</div></li>';

        status += '<li><b>绑定微信：</b>';
        if(user.wx_name){
            status += '<span>您已绑定了微信号'+user.wx_name+'，您可以使用微信快捷登录</span>';
            status += '<div class="fr">';
            status += '<i class="had-approve text-green">√</i><span>已绑定</span>';
        }else{
            status += '<span>您未绑定微信号，您可以使用微信快捷登录</span>';
            status += '<div class="fr">';
            status += '<i class="had-fail text-red">!</i><span class="text-red">未绑定</span><button class="tg-assist-btn" id="bs_wechat_set">绑定微信</button>';
        }
        status += '</div></li>';
        $('#bs_user_status').html(status);
        F_Member_Info._clickSet();

        F_Member_Info._htmlStatus(user);

        var refreshUrl = B_Common._baseHost()+B_Jump._getUrl('refresh');
        refreshUrl = B_Common._encodeUrl(refreshUrl+'?bind=1');
        $('#bs_qq_set').click(function(){
            B_Login._setStatus('out');
            B_Jump._go('base',B_Port._init('qqLogin')+'?redirect_url='+refreshUrl);
        });
        $('#bs_wechat_set').click(function(){
            B_Login._setStatus('out');
            B_Jump._go('base',B_Port._init('wxLogin')+'?redirect_url='+refreshUrl);
        });

    },
    _check:function () {
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

        var user = B_Login._user.user;
        if(companyName == user.company_name && company_type == user.company_type && realName == user.real_name && job_type == user.job_type && content == user.project_names){
            $('#bs_user_check').html(F_Member_Info._htmlStatus(user));
            return;
        }
        var dom = $('#bs_check_confirm');

        var postData = {};
        postData['email'] = email;
        postData['company_type'] = company_type;
        postData['company_name'] = companyName;
        postData['real_name'] = realName;
        postData['job_type'] = job_type;
        postData['project_names'] = content;
        postData = B_Common._postData(postData);
        B_Port._ajax('identity','post',true,postData,function(){
                dom.html('保存中,请稍等...').attr('disabled',true);
            },function(){
                dom.html('确认修改').attr('disabled',false);
            },function(data,msg){
                B_Login._setStatus('out');
                B_Pop._init('alert',{'content':'身份认证提交成功!'});
                setTimeout(function(){
                    return B_Jump._go('reload');
                },2000)
            },function(data,msg,code){
                B_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    },
    _htmlStatus:function (user) {
        var str = '';
        var btnMsg = '';
        str += '<div class="top-wrap no-infor">';
        str += '<img src="elements2.0/img/lr/default-pic.jpg" alt="">';
        str += '<ul class="des">';
        if(user.status > 1){
            F_Member_Info._htmlCheck(user,'hasChecked');
            return;
        }else if(user.status == 1){
            str += '<li><p>我们正在处理您的身份认证，请耐心等待</p><p>如有任何疑问，请联系我们。<b>service@thinkingdata.cn</b></p></li>';
        }else if(user.status < 0){
            str += '<li><p>认证失败</p><p>如有任何疑问，请联系我们。<b>service@thinkingdata.cn</b></p></li>';
            btnMsg = '重新认证';
        }else{
            btnMsg = '完善信息';
            str += '<li><p>为了向您提供更完整的服务</p><p>请进一步完善您的基本信息</p></li>';
        }
        if(btnMsg)str += '<button class="tg-main-btn" id="bs_check_btn">'+btnMsg+'</button>';
        $('#bs_user_check').html(str);

        $('#bs_check_btn').click(function () {
            $('#bs_user_check').html(F_Member_Info._htmlCheck(user));
        });
    },
    _htmlCheck:function (user,type) {
        var hasChecked = (type && type == 'hasChecked') ? true : false;
        var str = '';
        str += '<div class="top-wrap"><img src="elements2.0/img/lr/default-pic.jpg" alt="">';
        str += '<ul class="des">';
        str += '<li><b>企业认证状态：</b>';
        if(user.status > 1){
            str += '<i class="had-approve text-green">√</i><span>已认证</span>';
        }else{
            str += '<i class="had-approving text-gray">√</i><span>待认证</span>';
        }
        str += '</li>';
        if(!hasChecked){
            str += '<li><button class="tg-main-btn" id="bs_check_confirm">确认修改</button><button class="tg-assist-btn" id="bs_check_quit">取消修改</button></li>';
        }else{
            //str += '<li><button class="tg-main-btn" id="bs_check_reset">重新认证</button></li>';
        }
        str += '</ul>';
        str += '</div>';
        str += '<div class="infor-content">';
        str += '<ul class="des" id="bs_user_detail">';
        if(!hasChecked) {
            str += '<li><b>公司名称：</b><span><input type="text" placeholder="您当前就职的公司" value="' + user.company_name + '" name="companyName" maxlength="100"></span></li>';
            str += '<li><b>公司类型：</b>';
            str += '<div id="selectWrap"><div id="bs_company_type" class="dropDown tg-selected-drop">';
            if(B_User._information.companyArr[user.company_type]){
                str += '<p><span data-i="'+user.company_type+'">'+B_User._information.companyArr[user.company_type]+'</span><i class="drop-icon"></i></p>';
            }else{
                str += '<p><span data-i="">请选择公司类型</span><i class="drop-icon"></i></p>';
            }
            str += '<ul class="b_none"></ul></div></div></li>';
            str += '<li><b>联系人：</b><span><input type="text" placeholder="请输入您的真实姓名" value="'+user.real_name+'" name="realName" maxlength="50"></span></li>';
            str += '<li><b>电子邮箱：</b><span><input type="text" placeholder="请填写您的邮箱" value="'+user.email+'" name="email" maxlength="100"></span></li>';
            str += '<li><b>公司职位：</b>';
            str += '<div id="selectWrap"><div id="bs_job_type" class="dropDown tg-selected-drop">';
            if(B_User._information.jobArr[user.job_type]){
                str += '<p><span data-i="'+user.job_type+'">'+B_User._information.jobArr[user.job_type]+'</span><i class="drop-icon"></i></p>';
            }else{
                str += '<p><span data-i="">请选择工作职位</span><i class="drop-icon"></i></p>';
            }
            str += '<ul class="b_none"></ul></div></div></li>';
            str += '<li><b>公司产品：</b><span><input type="text" placeholder="请输入贵公司开发或运营的游戏" value="'+user.project_names+'" name="content" maxlength="300"></span></li>';

            $('#bs_user_check').html(str);
            F_Member_Info._htmlDropInit();
            $('#bs_check_confirm').click(function () {
                F_Member_Info._check();
            });
            $('#bs_check_quit').click(function () {
                $('#bs_user_check').html(F_Member_Info._htmlStatus(user));
            });
        }else{
            if(user.company_name){
                str += '<li><b>公司名称：</b><span>' + user.company_name + '</span></li>';
            }else{
                str += '<li><b>公司名称：</b><span>-</span></li>';
            }
            if(B_User._information.companyArr[user.company_type]){
                str += '<li><b>公司类型：</b><span>' + B_User._information.companyArr[user.company_type] + '</span></li>';
            }else{
                str += '<li><b>公司类型：</b><span>-</span></li>';
            }
            if(user.real_name){
                str += '<li><b>联系人：</b><span>' + user.real_name + '</span></li>';
            }else{
                str += '<li><b>联系人：</b><span>-</span></li>';
            }
            if(user.email){
                str += '<li><b>电子邮箱：</b><span>' + user.email + '</span></li>';
            }else{
                str += '<li><b>电子邮箱：</b><span>-</span></li>';
            }
            if(B_User._information.jobArr[user.job_type]){
                str += '<li><b>公司职位：</b><span>' + B_User._information.jobArr[user.job_type] + '</span></li>';
            }else{
                str += '<li><b>公司职位：</b><span>-</span></li>';
            }
            if(user.project_names){
                str += '<li><b>公司产品：</b><span>' + user.project_names + '</span></li>';
            }else{
                str += '<li><b>公司产品：</b><span>-</span></li>';
            }
            $('#bs_user_check').html(str);

            $('#bs_check_reset').click(function () {
                $('#bs_user_check').html(F_Member_Info._htmlCheck(user));
            });
        }
    },
    _clickSet:function () {
        $('#bs_mobile_set').click(function () {
            B_Jump._go('target','bind');
        });
        $('#bs_pass_set').click(function () {
            B_Jump._go('target','bind');
        });
        $('#bs_pass_edit').click(function () {
            B_Jump._go('target','find');
        });
    },
    _clickNick:function () {
        $('#bs_nick_edit').click(function () {
            $('#bs_nick_val').show();
            $('#bs_nick_confirm').show();
            $('#bs_nick_name').hide();
            $('#bs_nick_edit').hide();
        });
        $('#bs_nick_confirm').click(function () {
            var newNick = $.trim($('#bs_nick_val').val());
            if(newNick == ''){
                B_Pop._init('msg',{'content':'请填写昵称，格式为1-20位字符，支持汉字、字母、数字及"-"、"_"组合'});
                return false;
            }
            var oldNick = $('#bs_nick_name').html();
            if(newNick != oldNick){
                $('#bs_nick_name').html(newNick);
                $('#topNav .user-list p').html(newNick);
                F_Member_Info._alterNick(newNick);
            }
            $('#bs_nick_val').hide();
            $('#bs_nick_confirm').hide();
            $('#bs_nick_name').show();
            $('#bs_nick_edit').show();
        });
    },
    _alterNick:function (nick_name) {
        var postData = {};
        postData['nick_name'] = nick_name;
        postData = B_Common._postData(postData);
        B_Port._ajax('userInfo','post',true,postData,null,null,function(data,msg){
            B_Login._setStatus('out');
        },function(data,msg,code){});
    },
    _htmlDropInit:function () {
        $('#bs_company_type ul').html(F_Member_Info._htmlSelect(B_User._information.companyArr));
        $('#bs_job_type ul').html(F_Member_Info._htmlSelect(B_User._information.jobArr));

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