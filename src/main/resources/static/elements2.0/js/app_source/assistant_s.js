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
require(['jquery','layer','store.min','base','background'], function(){
    store = require('store.min');
    B_Login._checkUpdate();
    if(B_User._isDemoUser()){
        parent.B_Login._openLogin('background');
    }else{
        $('.tg-assist-btn').click(function(){
            parent.B_Pop._init('close');
        });
        var $_GET = B_Common._getUrl('query');
        var init_gameId = null;
        var init_name = '';
        var init_mail = '';
        var init_keyword = '';
        var init_week = '2,3,4,5,6';
        var init_hour = '';
        var int_ignore = 1;
        var int_status = 1;
        if($_GET.id){
            if(isNaN($_GET.id)){
                parent.B_Pop._init('msg',{'content':'选择的数据不存在，请刷新页面重试'});
                B_Pop._init('closeFrame');
                return false;
            }else{
                if(parent.F_Assistant_Info._cache['assistantData']){
                    var init_data = parent.F_Assistant_Info._cache['assistantData'];
                    for(var i=0;i<init_data.length;i++){
                        if($_GET.id == init_data[i].id){
                            init_gameId = init_data[i].project_id;
                            init_name = init_data[i].email_title;
                            init_mail = init_data[i].email_addr;
                            init_keyword = init_data[i].keywords;
                            init_week = init_data[i].send_day_of_week;
                            init_hour = init_data[i].send_hour_of_day;
                            int_ignore = init_data[i].ignore_empty;
                            int_status = init_data[i].status;
                            break;
                        }
                    }
                }
            }
        }

        $('input[name="email_title"]').val(init_name);
        $('input[name="email_addr"]').val(init_mail);
        $('input[name="keywords"]').val(init_keyword);
        $('input[name="ignore_empty"]').val(int_ignore);
        $('input[name="status"]').each(function(){
            $(this).val() == int_status+'' ? $(this).attr("checked",true) : $(this).attr("checked",false);
        });

        var str = '<div class="checkbox-wrap">';
        for(var i=0;i<parent.F_Assistant_Common._init.week.length;i++){
            str += '<div class="tg-checkbox-btn"><input id="x'+i+'" type="checkbox" name="week"';
            if(init_week.indexOf(parent.F_Assistant_Common._init.week[i][1]) > -1)str += ' checked ';
            str += 'value="'+parent.F_Assistant_Common._init.week[i][1]+'"><label for="x'+i+'">'+parent.F_Assistant_Common._init.week[i][0]+'</label></div>';
        }
        str += '</div>';
        $('#ft_send_week').append(str);

        str = '<div class="checkbox-wrap">';
        var d = 1;
        init_hour = init_hour ? init_hour.split(','):[];
        for(var i=0;i<parent.F_Assistant_Common._init.hour.length;i++){
            str += '<div class="tg-checkbox-btn"><input id="t'+i+'" type="checkbox" name="times"';
            str += $.inArray(i+'',init_hour) > -1 ? ' checked ' : '';
            str += 'value="'+i+'"><label for="t'+i+'">'+parent.F_Assistant_Common._init.hour[i]+'</label></div>';
            str += d%7 == 0 ? '<br>' : '　';
            d++;
        }
        str += '<div class="tg-checkbox-btn"><input id="a1" type="checkbox" name="chooseall"><label for="a1">全选/反选</label></div>';
        str += '</div>';
        $('#ft_send_hour').append(str);

        $('input[name="chooseall"]').click(function(){
            if($(this).prop("checked")==true){
                $('input[name="times"]').each(function(){
                    $(this).prop("checked",true);
                });
            }else{
                $('input[name="times"]').each(function(){
                    $(this).prop("checked",false);
                });
            }
        });

        var projectId = init_gameId;
        B_Game._dropChoose(init_gameId, '#gameDropChoose', 'edit',function(gameId) {
            projectId = gameId;
        });
        $('.tg-main-btn').click(function(){
            var email_title = $.trim($('input[name="email_title"]').val());
            var email_addrs = $.trim($('input[name="email_addr"]').val());
            var email_addr = [];
            var keywords = $.trim($('input[name="keywords"]').val());
            var email_title = $.trim($('input[name="email_title"]').val());
            var send_day_of_week = B_Common._getCheckboxVal('week');
            var send_hour_of_day = B_Common._getCheckboxVal('times');
            var ignore_empty = $.trim($('input[name="ignore_empty"]').val());
            var status = B_Common._getRadioVal('status');
            if(!(projectId && !isNaN(projectId))){
                B_Pop._init('msg',{'content':'请选择产品'});
                return false;
            }
            if(email_title == ''){
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
            if(keywords == ''){
                B_Pop._init('msg',{'content':'请填写关注词汇'});
                return false;
            }
            var keywordsArr = [];
            var keywordsSplit = keywords.split(' ');
            for(var i=0;i<keywordsSplit.length;i++){
                if(keywordsSplit[i] != ''){
                    keywordsArr.push(keywordsSplit[i]);
                }
            }
            if(keywordsArr && keywordsArr.length >0 && keywordsArr.length < 11){
                keywords = keywordsArr.join(' ');
            }else{
                B_Pop._init('msg',{'content':'关注词汇最多允许添加10个词汇'});
                return false;
            }
            email_addr = email_addrs.join(' ');
            if(send_day_of_week == ''){
                B_Pop._init('msg',{'content':'请选择发送日期'});
                return false;
            }
            if(send_hour_of_day == ''){
                B_Pop._init('msg',{'content':'请选择推送时间'});
                return false;
            }
            if(ignore_empty == '' || isNaN(ignore_empty)){
                B_Pop._init('msg',{'content':'请填写推送力度'});
                return false;
            }
            if(parseInt(ignore_empty) < 1){
                B_Pop._init('msg',{'content':'推送力度只允许为大于1的数字'});
                return false;
            }

            var postData = {};
            postData['email_addr'] = email_addr;
            postData['email_title'] = email_title;
            postData['status'] = status;
            postData['keywords'] = keywords;
            postData['send_day_of_week'] = send_day_of_week;
            postData['send_hour_of_day'] = send_hour_of_day;
            postData['ignore_empty'] = ignore_empty;
            postData['project_id'] = projectId;

            var port = 'assistantAddQuery';
            var notice = '添加成功';
            if($_GET.id){
                notice = '更新成功';
                port = 'assistantUpdate';
                postData['id'] = $_GET.id;
            }
            postData = B_Common._postData(postData);

            B_Port._ajax(port,'post',true,postData,function(){
                    B_Common._btnTextStatus('disable',$('.tg-main-btn'),{'disable':'提交中...'});
                },function(){
                    B_Common._btnTextStatus('normal',$('.tg-main-btn'),{'normal':'确认提交'});
                },
                function(data, msg){
                    switch(port){
                        case 'assistantAddQuery':
                            parent.F_Assistant_Info._getList(1);
                            break;
                        default:
                            parent.F_Assistant_Info._pageRefresh();
                            break;
                    }
                    parent.B_Pop._init('msg',{'content':notice});
                    B_Pop._init('closeFrame');
                },
                function(data, msg, code){
                    B_Pop._init('msg',{'content':msg});
                    return false;
                }
            )
        });


    }
});


