var F_Page = 1;
var F_Total = 0;
$(function () {
    G_Login._check();
    if(!G_Common._isInner()){
        U_Dom._menu('1-2-3');
        U_Service._checkStatus('assistant');
        F_Info._getList(1);
    }else{
        var $_GET = getUrl('query');
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
                G_Pop._init('msg',{'content':'选择的数据不存在，请刷新页面重试'});
                return false;
            }else{
                if(parent.F_Info._buff.assistantData){
                    var init_data = parent.F_Info._buff.assistantData;
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
        $('#bs_send_week').html(F_Common._formatWeek(init_week));
        $('#bs_send_hour').html(F_Common._formatHour(init_hour));
        $('input[name="ignore_empty"]').val(int_ignore);
        $('input[name="status"]').each(function(){
            $(this).val() == int_status+'' ? $(this).attr("checked",true) : $(this).attr("checked",false);
        });
        $('#assistant_s input').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });
        G_Game._dropChoose(init_gameId,$('#bs_choose_game'));
        $('input[name="chooseall"]').on("ifChecked", function(){
            $('input[name="times"]').each(function(){
                $(this).iCheck('check');
            });
        });
        $('input[name="chooseall"]').on("ifUnchecked", function(){
            $('input[name="times"]').each(function(){
                $(this).iCheck('uncheck');
            });
        })
        $('.btn-default').click(function(){
            parent.G_Pop._init('close');
        });
        $('.btn-info').click(function(){
            var projectId = $('#bs_choose_game p').attr('data-i');
            var email_title = $.trim($('input[name="email_title"]').val());
            var email_addrs = $.trim($('input[name="email_addr"]').val());
            var email_addr = [];
            var keywords = $.trim($('input[name="keywords"]').val());
            var email_title = $.trim($('input[name="email_title"]').val());
            var send_day_of_week = checkboxVal('week');
            var send_hour_of_day = checkboxVal('times');
            var ignore_empty = $.trim($('input[name="ignore_empty"]').val());
            var status = radioVal('status');
            if(projectId == ''){
                G_Pop._init('msg',{'content':'请选择产品'});
                return false;
            }
            if(email_title == ''){
                G_Pop._init('msg',{'content':'请填写任务名称'});
                return false;
            }
            if(email_addrs == ''){
                G_Pop._init('msg',{'content':'请填写接收邮箱'});
                return false;
            }else{
                var hasEmailFalse = false;
                email_addrs = email_addrs.split(' ');
                for(var i=0;i<email_addrs.length;i++){
                    if(email_addrs[i] != ''){
                        G_Common._isMail(email_addrs[i]) ? email_addr.push(email_addrs[i]) : hasEmailFalse=true;
                    }
                }
                if(hasEmailFalse){
                    G_Pop._init('msg',{'content':'请填写合法的接收邮箱'});
                    return false;
                }
            }
            if(keywords == ''){
                G_Pop._init('msg',{'content':'请填写关注词汇'});
                return false;
            }
            email_addr = email_addrs.join(' ');
            if(send_day_of_week == ''){
                G_Pop._init('msg',{'content':'请选择发送日期'});
                return false;
            }
            if(send_hour_of_day == ''){
                G_Pop._init('msg',{'content':'请选择推送时间'});
                return false;
            }
            if(ignore_empty == '' || isNaN(ignore_empty)){
                G_Pop._init('msg',{'content':'请填写推送力度'});
                return false;
            }
            if(parseInt(ignore_empty) < 1){
                G_Pop._init('msg',{'content':'推送力度只允许为大于1的数字'});
                return false;
            }
            var data = 'email_addr='+email_addr+'&email_title='+email_title+'&status='+status+'&keywords='+encodeURIComponent(keywords)+'&send_day_of_week='+send_day_of_week+'&send_hour_of_day='+send_hour_of_day+'&ignore_empty='+ignore_empty+'&project_id='+projectId;
            var port = 'assistantAddQuery';
            var notice = '添加成功';
            if($_GET.id){
                notice = '更新成功';
                port = 'assistantUpdate';
                data += '&id='+$_GET.id;
            }
            G_Port._ajax(port,'post',true,data,function(){
                    btnStatus('post','disable',$('.btn-info'));
                    $('.btn-default').attr('disabled',true);
                },function(){
                    btnStatus('post','normal',$('.btn-info'));
                    $('.btn-default').attr('disabled',false);
                },
                function(data, msg){
                    G_Pop._init('msg',{'content':notice});
                    setTimeout(function(){
                        switch(port){
                            case 'assistantAddQuery':
                                top.window.location.reload();
                                break;
                            case 'assistantUpdate':
                                parent.F_Info._pageRefresh();
                                break;
                        }
                        parent.G_Pop._init('close');
                    },1000);
                    return false;
                },
                function(data, msg, code){
                    G_Pop._init('msg',{'content':msg});
                    return false;
                }
            )
        });
    }
    G_Login._status('user');
    $('.m_soWork button').click(function(){
        F_Common._openAdd(null,'添加');
    });
});
var F_Info = {
    _buff:{},
    _workUpdate:function(postData){
        G_Port._ajax('assistantUpdate','post',true,postData,function(){
            G_Pop._init('load',{'type':1,'time':10});
        },function(){
            G_Pop._init('close');
        },function(data,msg){
            G_Pop._init('msg',{'content':'状态更新成功'});
            setTimeout(function(){
                G_Pop._init('close');
                F_Info._pageRefresh();
            },1000);
        },function(data,msg,code){
            G_Pop._init('alert',{content:G_Pre._empty(msg)});
        })
    },
    _workDel:function(id){
        G_Port._ajax('assistantDel','post',true,'id='+id+'&project_id=0',function(){
            G_Pop._init('load',{'type':1,'time':10});
        },function(){
            G_Pop._init('close');
        },function(data,msg){
            G_Pop._init('msg',{'content':'删除成功'});
            setTimeout(function(){
                G_Pop._init('close');
                F_Info._pageRefresh('del');
            },1000);
        },function(data,msg,code){
            G_Pop._init('alert',{content:G_Pre._empty(msg)});
        })
    },
    _pageRefresh:function(type){
        var page = F_Page;
        switch(type){
            case 'del':
                F_Total = F_Total > 0 ? (F_Total-1) : 0;
                page = Math.ceil(F_Total/G_Page._size);
                page = F_Page <= page ? F_Page : page;
                break;
        }
        F_Info._getList(page);
    },
    _getList:function(page){
        F_Page = page;
        var index = (parseInt(page) <= 0) ? 0 : (page-1)*G_Page._size;
        G_Port._ajax('assistantGetQuery','get',true,'index='+index+'&limit='+G_Page._size,function(){
                $('#bs_list').html(G_Pre._loading('c_padding30'));
                $('.page-list').html('');
            },function(){
                $('#bs_list').html('');
                $('.page-list').html('');
            },
            function(data, msg){
                if(data.get && data.get.length > 0){
                    F_Info._buff.assistantData = data.get;
                    $('#bs_list').html(F_Info._htmlList(data.get,index));
                    F_Total = data.user_center_cnt;
                    $('.page-list').html(G_Page._show({total:data.user_center_cnt,page:page},'number'));
                    $('.page-list span').each(function(){
                        var isJump = false;
                        $(this).click(function(){
                            if($(this).hasClass('prev')){
                                isJump = true;
                                page = parseInt(page)-1;
                            }else if($(this).hasClass('next')){
                                isJump = true;
                                page = parseInt(page)+1;
                            }else if($(this).hasClass('page-num')){
                                if($(this).html() != '…' && page != $(this).html()){
                                    isJump = true;
                                    page = $(this).html();
                                }
                            }
                            if(isJump){
                                F_Info._getList(page);
                                GoToTop();
                            }
                        });
                    });
                    $('input[type="checkbox"]').bootstrapSwitch('size','small');
                    $('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state){
                        var gameId = $(this).attr('id');
                        var postData = '';
                        if(F_Info._buff.assistantData){
                            for(var i=0;i<F_Info._buff.assistantData.length;i++){
                                if(F_Info._buff.assistantData[i].id == gameId){
                                    postData = F_Info._buff.assistantData[i];
                                    break;
                                }
                            }
                            if(postData){
                                state ? postData.status = 1 : postData.status = 0;
                                F_Info._workUpdate(postData);
                            }
                        }
                        if(postData == ''){
                            G_Pop._init('confirm',{skin:'layerCheck-class','content':'数据读取失败',btn:'刷新',title:'提示', closeBtn:0},function(){
                                top.window.location.reload();
                            });
                        }
                    });
                }else{
                    $('#bs_list').html('<div class="c_empty">快去添加新任务吧！</div>');
                }
            },
            function(data, msg, code){
                switch(code+''){
                    case '-1017':
                        msg += ' <span class="c_cursor c_colorG" onclick="G_Jump._go(\'open\',\''+G_Jump._getUrl('item')+'?k='+U_Service._init.assistant[1]+'\')">【点击购买】</span>';
                        break;
                }
                $('#bs_list').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data,numberBegin){
        var str = '<table>\
            <tr>\
            <th>任务监控名称</th>\
            <th>游戏名称</th>\
            <th>监测词汇</th>\
            <th>上次推送时间</th>\
            <th>邮件通知状态</th>\
            <th style="width: 120px">操作</th>\
        </tr>';
        for(var i=0;i<data.length;i++){
            str += '<tr>';
            str += '<td>'+data[i].email_title+'</td>';
            str += '<td>'+data[i].project_name+'</td>';
            str += '<td>'+data[i].keywords+'</td>';
            str += '<td>'+(data[i].last_send_time && data[i].last_send_time != ''  ? data[i].last_send_time : '尚未推送')+'</td>';
            //str += '<td>'+(data[i].status == 0 ? '<span class="c_colorR">关闭</span>' : '<span class="c_colorG">开启</span>')+'</td>';
            str += '<td>'+(data[i].status == 0 ? '<input type="checkbox" id="'+data[i].id+'" />' : '<input id="'+data[i].id+'" type="checkbox" checked />')+'</td>';
            str += '<td><i class="glyphicon glyphicon-trash c_cursor" onclick="F_Common._delConfirm('+data[i].id+',\''+data[i].email_title+'\')"></i>　<i class="glyphicon glyphicon-edit c_cursor" onclick="F_Common._openAdd('+data[i].id+',\'编辑\')"></i>';
            str += '</td></tr>';
        }
        str += '</table>';
        return str;
    }
}
var F_Common = {
    _init:{'hour':['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],'week':[['星期一',2],['星期二',3],['星期三',4],['星期四',5],['星期五',6],['星期六',7],['星期日',1]]},
    _openAdd:function(data,work){
        G_Pop._init('close');
        var url = data ? 'assistant_s.html?id='+data : 'assistant_s.html';
        G_Pop._init('open',{'type':2,'scroll':true,'title':work+'舆情助手','width':'850px','height':'580px','shift':2,'content':url},'');
    },
    _delConfirm:function(id,name){
        G_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要删除【'+name+'】监控任务么？',btn:['确认','取消'],title:'操作提示'},function(){
            F_Info._workDel(id);
        },function(){
            G_Pop._init('close');
        });
    },
    _formatHour:function(data){
        var str = '';
        var d = 1;
        data = data ? data.split(','):[];
        for(var i=0;i<F_Common._init.hour.length;i++){
            str += '<input type="checkbox" name="times"';
            str += $.inArray(i+'',data) > -1 ? ' checked ' : '';
            str += 'value="'+i+'"> '+F_Common._init.hour[i];
            str += d%9 == 0 ? '<br>' : '　';
            d++;
        }
        str += '<input type="checkbox" name="chooseall"> 全选/反选';
        return str;
    },
    _formatWeek:function(data){
        var str = '';
        for(var i=0;i<F_Common._init.week.length;i++){
            str += '<input type="checkbox" name="week"';
            if(data.indexOf(F_Common._init.week[i][1]) > -1)str += ' checked ';
            str += 'value="'+F_Common._init.week[i][1]+'"> '+F_Common._init.week[i][0]+'　';
        }
        return str;
    }
}