var F_Task_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-1-1');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            if(!B_Game._checkAuthMenu()){
                $('#headerTop').html('');
                M_Game._htmlGameVisitHide('outsideAssistant');
                F_Task_Info._domDemo();
            }else {
                M_Game._htmlGameVisitHide('outsideAssistant');
                F_Task_Info._domInit();
                F_Task_Info._getList(1);
                $('.tg-main-btn').click(function () {
                    F_Task_Common._openAdd('', '添加');
                });
            }
        }
    }
}
var F_Task_Info = {
    _cache:{},
    _domDemo:function () {
        var str = '\
                    <img src="'+B_Common._cdnImgUrl()+'2.0/userlimit/suddenly.png" alt="" class="adver-bg">\
                    <div class="adver-des">\
                        <h3>智能判别突发舆情事件</h3>\
                        <p>突发问题预警能够基于历史舆情数据建立预警模型，当用户反馈信息中一旦出现可能导致舆情事件爆发的内容时，会通过邮件自动报警，从而提前发现各类突发舆情事件。</p>\
                        <button class="tg-main-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Common._qqUrl()+'\')">在线咨询</button>\
                    </div>';

        $('#contentPart').html(str);
    },
    _workUpdate:function(postData){
        B_Port._ajax('sigmaItWarnMailSet','post',true,postData,function(){
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
        postData['project_id'] = id;
        postData = B_Common._postData(postData);
        B_Port._ajax('sigmaItWarnMailGet','post',true,postData,function(){
            B_Pop._init('load',{'type':1,'time':10});
        },function(){
            B_Pop._init('close');
        },function(data,msg){
            B_Pop._init('msg',{'content':'删除成功'});
            setTimeout(function(){
                B_Pop._init('close');
                F_Task_Info._pageRefresh('del');
            },1000);
        },function(data,msg,code){
            B_Pop._init('alert',{content:B_Pre._empty(msg)});
        })
    },
    _pageRefresh:function(type){
        var page = F_Task_Info._cache['page'];
        switch(type){
            case 'del':
                F_Task_Info._cache['total'] = F_Task_Info._cache['total'] > 0 ? (F_Task_Info._cache['total']-1) : 0;
                page = Math.ceil(F_Task_Info._cache['total']/B_Page._size);
                page = F_Task_Info._cache['page'] <= page ? F_Task_Info._cache['page'] : page;
                break;
        }
        F_Task_Info._getList(page);
    },
    _getList:function(page){
        F_Task_Info._cache['page'] = page;
        var index = (parseInt(page) <= 0) ? 0 : (page-1)*B_Page._size;
        var domItemList = $('#lt_item_list');
        var domForumPage =  $('#lt_forum_page');
        var postData = {};
        postData['index'] = index;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);
        B_Port._ajax('sigmaItWarnMailGet','get',true,postData,function(){
                domItemList.html(B_Pre._loading('b_padding30'));
                domForumPage.html('');
            },function(){
                domItemList.html('');
                domForumPage.html('');
            },
            function(data, msg){
                if(data.data && data.data.length > 0){
                    F_Task_Info._cache['taskData'] = data.data;
                    domItemList.html(F_Task_Info._htmlList(data.data,index));
                    $('.bs_task_detail').each(function () {
                        $(this).click(function () {
                            B_Jump._go('base',B_Jump._getUrl('gameAssistant',{'gameId':$(this).attr('data-i')}));
                        });
                    });
                    F_Task_Info._cache['total'] = data.total;
                    domForumPage.html(B_Page._show({total:data.total,page:page},'number'));
                    B_Page._click(page,function (page) {
                        F_Task_Info._getList(page);
                        B_Jump._top();
                    });
                    $('input[type="checkbox"]').bootstrapSwitch('size','small');
                    $('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state){
                        var gameId = $(this).attr('id');
                        var postData = '';
                        if(F_Task_Info._cache['taskData']){
                            for(var i=0;i<F_Task_Info._cache['taskData'].length;i++){
                                if(F_Task_Info._cache['taskData'][i].id == gameId){
                                    postData = F_Task_Info._cache['taskData'][i];
                                    break;
                                }
                            }
                            if(postData){
                                state ? postData.status = 1 : postData.status = 0;
                                postData = B_Common._postData(postData);
                                F_Task_Info._workUpdate(postData);
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
        var project = '';
        var typeArr = [];
        var str = '<table class="tg-table table table-bordered"><thead class="boxshadow">\
            <tr>\
            <th>游戏名称</th>\
            <th class="level">开发问题预警等级</th>\
            <th class="level">活动问题预警等级</th>\
            <th class="level">版本问题预警等级</th>\
            <th>查看</th>\
            <th>邮件通知状态</th>\
            <th>操作</th>\
        </tr></thead><tbody>';
        for(var i=0;i<data.length;i++){
            project = B_Game._getGame([data[i].project_id]);
            if(project && project[data[i].project_id]){
                project = project[data[i].project_id];
                typeArr = (data[i].lt_warn_class).split(',');
                str += '<tr>';
                str += '<td class="game-name"><img src="'+project[0]+'"><p>'+project[1]+'</p></td>';
                str += '<td>'+F_Task_Info._htmlLevel('开发',typeArr,data[i].warn_level)+'</td>';
                str += '<td>'+F_Task_Info._htmlLevel('活动',typeArr,data[i].warn_level)+'</td>';
                str += '<td>'+F_Task_Info._htmlLevel('版本',typeArr,data[i].warn_level)+'</td>';
                str += '<td><div class="btn-union"><a class="tg-main-btn bs_task_detail" data-i="'+data[i].project_id+'">查看详情</a></div></td>';
                str += '<td>'+(data[i].status == 0 ? '<input type="checkbox" id="'+data[i].id+'" />' : '<input id="'+data[i].id+'" type="checkbox" checked />')+'</td>';
                str += '<td><button class="tg-main-btn" onclick="F_Task_Common._openAdd('+data[i].project_id+',\'编辑\')">修改</button><button class="tg-assist-btn" onclick="F_Task_Common._delConfirm('+data[i].project_id+',\''+data[i].task_name+'\')">删除</button>';
                str += '</td></tr>';
            }
        }
        str += '</tbody></table>';
        return str;
    },
    _htmlLevel:function(type,typeArr,level) {
        var className = '';
        var levelName = '';
        var str = '';
        switch (level+''){
            case '1':
                levelName = '灰色';
                className = 'gray-level';
                break;
            case '2':
                levelName = '蓝色';
                className = 'blue-level';
                break;
            case '3':
                levelName = '黄色';
                className = 'yellow-level';
                break;
            case '4':
                levelName = '橙色';
                className = 'orange-level';
                break;
            case '5':
                levelName = '红色';
                className = 'red-level';
                break;
        }
        if($.inArray(type,typeArr) > -1){
            str += '<span>'+levelName+level+'级预警</span>';
            str += '<ul class="level-circle '+className+'">';
            for(var i=0;i<5;i++){
                if(i<level){
                    str += '<li class="selected"></li>';
                }else{
                    str += '<li></li>';
                }
            }
            str += '</ul>';
        }else{
            str += '-';
        }
        return str;
    },
    _domInit:function () {
        var str = '';
        str += '\
            <div class="tg-table-layout blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                <h3>突发问题预警任务</h3>\
                <div class="boxshadow tg-table-content">\
                    <div class="tg-table-wrap tg-table-no-padding tg-height-hight">\
                        <div class="table-out-wrap" id="lt_item_list"></div>\
                        <ul class="tg-page-list" id="lt_forum_page"></ul>\
                    </div>\
                </div>\
            </div>';
        str += '';

        $('#headerTop').html('<span>您可以通过邮件及时获知活动、开发、版本方面的各类游戏突发问题。</span><button class="tg-main-btn">添加任务</button>');
        $('#mainContent').addClass('alert-task-part');
        $('#ct_main_area').html(str);
    }
}

var F_Task_Common = {
    _openAdd:function(data,work){
        B_Pop._init('close');
        var url = data ? 'outsidetask_s.html?g='+data : 'outsidetask_s.html';
        B_Pop._init('open',{'type':2,'scroll':true,'title':work+'预警任务','width':'850px','height':'440px','shift':2,'content':url},'');
    },
    _delConfirm:function(id,name){
        B_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要删除【'+name+'】预警任务么？',btn:['确认','取消'],title:'操作提示'},function(){
            F_Task_Info._workDel(id);
        },function(){
            B_Pop._init('close');
        });
    }
}