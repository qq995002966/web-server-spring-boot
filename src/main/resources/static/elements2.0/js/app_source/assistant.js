var F_Assistant_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-1-3');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            if(!B_Game._checkAuthMenu()){
                $('#headerTop').html('');
                M_Game._htmlGameVisitHide('outsideAssistant');
                F_Assistant_Info._domDemo();
            }else{
                M_Game._htmlGameVisitHide('outsideAssistant');
                F_Assistant_Info._domInit();
                F_Assistant_Info._getList(1);
                $('.tg-main-btn').click(function () {
                    F_Assistant_Common._openAdd('','添加');
                });
            }

        }
    }
}
var F_Assistant_Info = {
    _cache:{},
    _domDemo:function () {
        var str = '\
                    <img src="'+B_Common._cdnImgUrl()+'2.0/userlimit/auto.png" alt="" class="adver-bg">\
                    <div class="adver-des">\
                        <h3>及时获取关键词实时舆情数据</h3>\
                        <p>自有创建各类关键词监控任务，通过邮件及时获取用户在全国贴吧、论坛中的反馈信息，大幅提升舆情监控效率，提早获得舆情爆发点。</p>\
                        <button class="tg-main-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Common._qqUrl()+'\')">在线咨询</button>\
                    </div>';

        $('#contentPart').html(str);
    },
    _workUpdate:function(postData){
        B_Port._ajax('assistantUpdate','post',true,postData,function(){
            B_Pop._init('load',{'type':1,'time':10});
        },function(){
            B_Pop._init('close');
        },function(data,msg){
            B_Pop._init('msg',{'content':'状态更新成功'});
            setTimeout(function(){
                B_Pop._init('close');
            },1000);
        },function(data,msg,code){
            B_Pop._init('alert',{content:B_Pre._empty(msg)});
        })
    },
    _workDel:function(id){
        var postData = {};
        postData['id'] = id;
        postData['project_id'] = 0;
        postData = B_Common._postData(postData);
        B_Port._ajax('assistantDel','post',true,postData,function(){
            B_Pop._init('load',{'type':1,'time':10});
        },function(){
            B_Pop._init('close');
        },function(data,msg){
            B_Pop._init('msg',{'content':'删除成功'});
            setTimeout(function(){
                B_Pop._init('close');
                F_Assistant_Info._pageRefresh('del');
            },1000);
        },function(data,msg,code){
            B_Pop._init('alert',{content:B_Pre._empty(msg)});
        })
    },
    _pageRefresh:function(type){
        var page = F_Assistant_Info._cache['page'];
        switch(type){
            case 'del':
                F_Assistant_Info._cache['total'] = F_Assistant_Info._cache['total'] > 0 ? (F_Assistant_Info._cache['total']-1) : 0;
                page = Math.ceil(F_Assistant_Info._cache['total']/B_Page._size);
                page = F_Assistant_Info._cache['page'] <= page ? F_Assistant_Info._cache['page'] : page;
                break;
        }
        F_Assistant_Info._getList(page);
    },
    _getList:function(page){
        F_Assistant_Info._cache['page'] = page;
        var index = (parseInt(page) <= 0) ? 0 : (page-1)*B_Page._size;
        var domItemList = $('#lt_item_list');
        var domForumPage =  $('#lt_forum_page');

        var postData = {};
        postData['index'] = index;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);

        B_Port._ajax('assistantGetQuery','get',true,postData,function(){
                domItemList.html(B_Pre._loading('b_padding30'));
                domForumPage.html('');
            },function(){
                domItemList.html('');
                domForumPage.html('');
            },
            function(data, msg){
                if(data.get && data.get.length > 0){
                    F_Assistant_Info._cache['assistantData'] = data.get;
                    domItemList.html(F_Assistant_Info._htmlList(data.get,index));
                    F_Assistant_Info._cache['total'] = data.user_center_cnt;
                    domForumPage.html(B_Page._show({total:data.user_center_cnt,page:page},'number'));
                    B_Page._click(page,function (page) {
                        F_Assistant_Info._getList(page);
                        B_Jump._top();
                    });
                    $('input[type="checkbox"]').bootstrapSwitch('size','small');
                    $('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state){
                        var gameId = $(this).attr('id');
                        var postData = '';
                        if(F_Assistant_Info._cache['assistantData']){
                            for(var i=0;i<F_Assistant_Info._cache['assistantData'].length;i++){
                                if(F_Assistant_Info._cache['assistantData'][i].id == gameId){
                                    postData = F_Assistant_Info._cache['assistantData'][i];
                                    break;
                                }
                            }
                            if(postData){
                                state ? postData.status = 1 : postData.status = 0;
                                postData = B_Common._postData(postData);
                                F_Assistant_Info._workUpdate(postData);
                            }
                        }
                        if(postData == ''){
                            B_Pop._init('confirm',{skin:'layerCheck-class','content':'数据读取失败',btn:'刷新',title:'提示', closeBtn:0},function(){
                                top.window.location.reload();
                            });
                        }
                    });
                }else{
                    domItemList.html('<div class="b_empty">快去添加新任务吧！</div>');
                }
            },
            function(data, msg, code){
                domItemList.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data,numberBegin){
        var str = '<table class="tg-table table table-bordered"><thead class="boxshadow">\
            <tr>\
            <th>任务监控名称</th>\
            <th>游戏名称</th>\
            <th>监测词汇</th>\
            <th>上次推送时间</th>\
            <th>邮件通知状态</th>\
            <th>操作</th>\
        </tr></thead><tbody>';
        for(var i=0;i<data.length;i++){
            str += '<tr>';
            str += '<td>'+data[i].email_title+'</td>';
            str += '<td class="game-name"><img src="'+B_Game._imgUrl(data[i].project_id)+'"><p>'+data[i].project_name+'</p></td>';
            str += '<td>'+data[i].keywords+'</td>';
            str += '<td>'+(data[i].last_send_time && data[i].last_send_time != ''  ? data[i].last_send_time : '尚未推送')+'</td>';
            str += '<td>'+(data[i].status == 0 ? '<input type="checkbox" id="'+data[i].id+'" />' : '<input id="'+data[i].id+'" type="checkbox" checked />')+'</td>';
            str += '<td><button class="tg-main-btn" onclick="F_Assistant_Common._openAdd('+data[i].id+',\'编辑\')">修改</button><button class="tg-assist-btn" onclick="F_Assistant_Common._delConfirm('+data[i].id+',\''+data[i].email_title+'\')">删除</button>';
            str += '</td></tr>';
        }
        str += '</tbody></table>';
        return str;
    },
    _domInit:function () {
        var str = '';
        str += '\
            <div class="tg-table-layout blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                <h3>监控中的任务</h3>\
                <div class="boxshadow tg-table-content">\
                    <div class="tg-table-wrap tg-table-no-padding tg-height-hight">\
                        <div class="table-out-wrap" id="lt_item_list"></div>\
                        <ul class="tg-page-list" id="lt_forum_page"></ul>\
                    </div>\
                </div>\
            </div>';
        str += '';

        $('#headerTop').html('<span>您可以定制推送消息发送到邮箱，图表化数据可以让您快速了解所关注的关键词，助您发现问题。</span><button class="tg-main-btn">添加任务</button>');
        $('#mainContent').addClass('alert-task-part');
        $('#ct_main_area').html(str);
    }
}

var F_Assistant_Common = {
    _init:{'hour':['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],'week':[['星期一',2],['星期二',3],['星期三',4],['星期四',5],['星期五',6],['星期六',7],['星期日',1]]},
    _openAdd:function(data,work){
        B_Pop._init('close');
        var url = data ? 'outsideassistant_s.html?id='+data : 'outsideassistant_s.html';
        B_Pop._init('open',{'type':2,'scroll':true,'title':work+'舆情助手','width':'850px','height':'610px','shift':2,'content':url},'');

    },
    _delConfirm:function(id,name){
        B_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要删除【'+name+'】监控任务么？',btn:['确认','取消'],title:'操作提示'},function(){
            F_Assistant_Info._workDel(id);
        },function(){
            B_Pop._init('close');
        });
    }
}