requirejs.config({
    shim: {
        'layer': ['jquery'],
        'store.min': ['jquery'],
        'background':{
            deps:['base']
        }
    },
    baseUrl: 'elements2.0/js/lib',
    paths: {
        'jquery' : './jquery-1.9.1.min',
        'app': '../app',
        'base': '../app/base',
        'background': '../app/background'
    }
});
require(['jquery','layer','store.min','base','background','app/inside'], function(){
    store = require('store.min');
    B_Login._checkUpdate();
    if(B_User._isDemoUser()){
        parent.B_Login._openLogin('background');
    }else{
        var $_GET = B_Common._getUrl('query');
        if(!($_GET.g && !isNaN($_GET.g))){
            parent.B_Pop._init('close');
            parent.B_Pop._init('msg',{'content':'选择的数据不存在，请刷新页面重试'});
            return false;
        }else{
            var init_name = '';
            var init_mail = '';
            var init_keyword = '';
            var init_type = '开发,活动,版本';
            var int_level = 3;
            var int_status = 1;

            if (parent.F_Alarm_Info._cache['mailData']) {
                init_name = parent.F_Alarm_Info._cache['mailData'].task_name;
                init_mail = parent.F_Alarm_Info._cache['mailData'].email_addr;
                init_type = parent.F_Alarm_Info._cache['mailData'].lt_warn_class;
                int_level = parent.F_Alarm_Info._cache['mailData'].warn_level;
                int_status = parent.F_Alarm_Info._cache['mailData'].status;
                if (int_level > 5)int_level = 5;
            }

            $('.tg-assist-btn').click(function(){
                parent.B_Pop._init('close');
            });

            $('input[name="email_title"]').val(init_name);
            $('input[name="email_addr"]').val(init_mail);

            var str = '<div class="checkbox-wrap">';
            init_type = init_type ? init_type.split(','):[];
            for(var i=0;i<parent.F_Alarm_Common._init.type.length;i++){
                str += '<div class="tg-checkbox-btn"><input type="checkbox" id="c'+i+'" name="type"';
                str += $.inArray(parent.F_Alarm_Common._init.type[i]+'',init_type) > -1 ? ' checked ' : '';
                str += 'value="'+parent.F_Alarm_Common._init.type[i]+'"><label for="c'+i+'">'+parent.F_Alarm_Common._init.type[i]+'类预警</label></div>';
            }
            str += '</div>';
            $('.pop-list li').eq(0).append(str);

            str = '';
            str += '<div class="tg-selected-drop"><p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span data-i="'+int_level+'">'+parent.F_Alarm_Common._init.power[int_level]+'</span></p>';
            str += '<ul style="display: none;">';
            for(var i=1;i<parent.F_Alarm_Common._init.power.length;i++){
                str += '<li><a data-i="'+i+'">'+parent.F_Alarm_Common._init.power[i]+'</a></li>';
            }
            str += '</ul></div>';

            $('.tg-selected-drop').html(str);

            M_Inside._dropShow();
            M_Inside._dropSelected();
            M_Inside._dropLeave();

            $('.dropdown-menu li a').each(function(){
                $(this).click(function(){
                    $('.dropdown-toggle span').attr('data-t',$(this).attr('data-t')).text($(this).text());
                });
            });

            $('input[name="status"]').each(function(){
                $(this).val() == int_status+'' ? $(this).attr("checked",true) : $(this).attr("checked",false);
            });

            $('.tg-main-btn').click(function(){
                var task_name = $.trim($('input[name="email_title"]').val());
                var email_addrs = $.trim($('input[name="email_addr"]').val());
                var email_addr = [];
                var warn_level = $.trim($('.tg-selected-drop span').attr('data-i'));
                var lt_warn_class = B_Common._getCheckboxVal('type');
                var status = B_Common._getRadioVal('status');
                if(lt_warn_class == ''){
                    B_Pop._init('msg',{'content':'请选择预警类型'});
                    return false;
                }
                if(task_name == ''){
                    B_Pop._init('msg',{'content':'请填写任务名称'});
                    return false;
                }
                if(email_addrs == ''){
                    B_Pop._init('msg',{'content':'请填写接收邮箱'});
                    return false;
                }else{
                    var hasEmailFalse = false;
                    email_addrs = email_addrs.split(' ');
                    for(var i=0;i<email_addrs.length;i++){
                        if(email_addrs[i] != ''){
                            B_Common._isMail(email_addrs[i]) ? email_addr.push(email_addrs[i]) : hasEmailFalse=true;
                        }
                    }
                    if(hasEmailFalse){
                        B_Pop._init('msg',{'content':'请填写合法的接收邮箱'});
                        return false;
                    }
                }
                email_addr = email_addrs.join(' ');

                var postData = {};
                postData['email_addr'] = email_addr;
                postData['task_name'] = task_name;
                postData['status'] = status;
                postData['lt_warn_class'] = lt_warn_class;
                postData['warn_level'] = warn_level;
                postData['project_id'] = $_GET.g;
                postData = B_Common._postData(postData);

                B_Port._ajax('sigmaItWarnMailSet','post',true,postData,function(){
                        B_Common._btnTextStatus('disable',$('.tg-main-btn'),{'disable':'提交中...'});
                    },function(){
                        B_Common._btnTextStatus('normal',$('.tg-main-btn'),{'normal':'确认提交'});
                    },
                    function(data, msg){
                        B_Pop._init('msg',{'content':'设置成功'});
                        parent.F_Alarm_Info._getMail();
                        setTimeout(function(){
                            parent.B_Pop._init('close');
                        },1000);
                        return false;
                    },
                    function(data, msg, code){
                        B_Pop._init('msg',{'content':msg});
                        return false;
                    }
                )
            });
        }
    }
});


