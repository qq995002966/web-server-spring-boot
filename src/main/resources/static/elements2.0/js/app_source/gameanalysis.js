var F_GameAnalysis_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-8');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            M_Init._clean();
            var $_GET = B_Common._getUrl('query');
            if($_GET.g){
                M_Init._gameDetailId = $_GET.g;
                B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
            }else{
                if(gameId){
                    M_Init._gameDetailId = gameId;
                    B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
                }else{
                    if(!M_Init._gameDetailId){
                        M_Init._gameDetailId = M_Init._getGameId('outsideGameDetail');
                    }
                }
            }
            M_Game._checkGameVisitList('gameAnalysis');

            //M_Outside._searchPop();
        }
    }
}
var F_GameAnalysis_Info = {
    _chartClick:function (type,value) {
        var data = [];
        data.push('g='+M_Init._gameDetailId);
        switch(type){
            case 'bs_analyse_light':
                data.push('b='+B_Common._encodeUrl(M_Init._dateCache.begin));
                data.push('e='+B_Common._encodeUrl(M_Init._dateCache.end));
                data.push('a='+B_Common._encodeUrl(value.keyword));
                data.push('z=channel');
                break;
            case 'gameChannelCountLight':
                data.push('b='+B_Common._encodeUrl(M_Init._dateCache.begin2));
                data.push('e='+B_Common._encodeUrl(M_Init._dateCache.end2));
                if(M_Init._dataCache['channelCount']){
                    var dataUnion = M_Init._dataCache['channelCount'];
                    for(var i=0;i<dataUnion.length;i++){
                        if(dataUnion[i]['source_name'] == M_Init._dataCache['currentChannel'] && dataUnion[i]['rating_name'] == value.date){
                            data.push('forum='+B_Common._encodeUrl(dataUnion[i]['source_name']));
                            data.push('show='+B_Common._encodeUrl(dataUnion[i]['rating_name']));
                            data.push('l='+dataUnion[i].source_type);
                            data.push('n='+dataUnion[i].es_field_name);
                            data.push('v='+dataUnion[i].es_field_val);
                            break;
                        }
                    }
                }
                data.push('z=channel');
                break;
            case 'bs_channel_detail':
                data.push('b='+B_Common._encodeUrl(B_Date._getDiffDate(null,-30)));
                data.push('e='+B_Common._encodeUrl(B_Date._getDiffDate(null,-1)));
                data.push('l='+B_Common._encodeUrl(value.id));
                data.push('forum='+B_Common._encodeUrl(value.name));
                data.push('z=channel');
                break;
        }
        if(data)data = data.join('&');
        M_Outside._openDetail(data);
    },
    _domInit: function () {
        var str = '';
        if(M_Game._gameInfo[3] == 'S'){
            str += M_Outside._domCreate('analysisChartTableDateTab',2,'1_0','渠道评分统计');

            str += '<div class="blockpart tg-table-layout col-lg-12 col-md-12 col-sm-12 col-xs-12">';
            str += '<h3>AppStore排行榜</h3>';
            str += '<div class="tg-selected-drop tg-date-fl">';
            str += '<span>日期</span>';
            str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc3"></span><input id="db3" type="hidden" value=""><input id="de3" type="hidden" value=""></p></div>';
            str += '<div class="boxshadow tg-table-content gs-height-b">';
            str += '<div id="bs_rank_select"></div>';
            str += '<div id="bs_ranklist" style="width: 100%; height: 80%"></div>';
            str += '</div></div>';

            str += '<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12 channel-infor">';
            str += '<h3>渠道信息</h3>';
            str += '<div id="bs_channel">';
            str += '</div></div>';

            str += '\
                <div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12" id="bs_channel_emotion">\
                    <h3>渠道评论情感分析</h3>\
                    <div class="tg-selected-drop tg-date-fl">\
                        <span>日期</span>\
                        <p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc1"></span><input id="db1" type="hidden" value=""><input id="de1" type="hidden" value=""></p>\
                    </div>\
                    <div class="boxshadow channel-emotion-2"></div>\
                </div>';
        }
        str += '<div class="more" id="bs_open_more">';
        str += '<iframe src="" frameborder="0" id="IframePart" class="iframe-more-date" height="100%" width="100%" scrolling="no"></iframe>';
        str += '</div>';

        $('#ct_main_area').addClass('channel-comment-part').html(str);

        M_Inside._downloadCsv();

        if(M_Game._gameInfo[3] == 'S'){
            B_Date._chooseSection({'autoCommit':true,'todayValid':false},2,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin2 || M_Init._dateCache.end2 != end){
                    M_Init._dateCache.begin2 = begin;
                    M_Init._dateCache.end2 = end;
                    F_GameAnalysis_Info._getCount();
                }
            });
            B_Date._chooseSection({'autoCommit':true,'todayValid':false},3,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin3 || M_Init._dateCache.end3 != end){
                    M_Init._dateCache.begin3 = begin;
                    M_Init._dateCache.end3 = end;
                    if($('#bs_rank_select').html() == '') {
                        F_GameAnalysis_Info._getRankProperty();
                    }else{
                        F_GameAnalysis_Info._getRankList();
                    }
                }
            });

            B_Date._chooseSection({'autoCommit':true,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;
                    F_GameAnalysis_Info._getChannelEmotion();
                }
            });

            setTimeout(function () {
                F_GameAnalysis_Info._getChannel()
            },300);
        }
    },
    _getChannelEmotion:function () {
        var dom = $('.channel-emotion-2');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('channelAnalyse','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data){
                    var word = {'neg':[],'pos':[]};
                    if(data.senti_word_distri && data.senti_word_distri.length > 0){
                        for(var i=0;i<data.senti_word_distri.length;i++){
                            if(word[data.senti_word_distri[i].senti_type])word[data.senti_word_distri[i].senti_type].push(data.senti_word_distri[i].keyword);
                        }
                    }
                    dom.html(F_GameAnalysis_Info._htmlChannelEmotionShow(word));
                    $('.channel-emotion-2 .positive-wrap li').each(function () {
                        $(this).click(function () {
                            F_GameAnalysis_Info._chartClick('bs_analyse_light',{'keyword':$(this).html()+'/1'});
                        });
                    });
                    $('.channel-emotion-2 .negative-wrap li').each(function () {
                        $(this).click(function () {
                            F_GameAnalysis_Info._chartClick('bs_analyse_light',{'keyword':$(this).html()+'/-1'});
                        });
                    });
                    if(data.senti_date_distri && data.senti_date_distri.length > 0){
                        var chartDataPre = {color:['#71bc33','#f33f57'],x_axis:[],y_axis:[{'name':'正面评论','data':[]},{'name':'负面评论','data':[]}],xFormatDate:true,legendSelectMode:true};
                        for(var i=0;i<data.senti_date_distri.length;i++){
                            chartDataPre.x_axis.push(data.senti_date_distri[i]['data_date']);
                            chartDataPre.y_axis[0].data.push(data.senti_date_distri[i]['pos_num']);
                            chartDataPre.y_axis[1].data.push(-(data.senti_date_distri[i]['neg_num']));
                        }
                        M_Outside_Chart._chartData('barSum','bs_analyse_chart',chartDataPre);
                    }else{
                        $('#bs_analyse_chart').html(B_Pre._empty('暂无数据'));
                    }
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlChannelEmotionShow:function (data) {
        var str = '';
        str += '<div class="left"><div class="graph-part cursor-default"><div id="bs_analyse_chart" style="width: 100%; height: 100%"></div></div></div>';
        str += '<div class="right">';
        str += '<ul>';
        str += '<li><i class="positive-bg"></i><span>正面评论</span></li>';
        str += '<ul class="positive-wrap">';
        if(data.pos && data.pos.length > 0){
            for(var i=0;i<data.pos.length;i++){
                str += '<li>'+data.pos[i]+'</li>';
            }
        }
        str += '</ul>';
        str += '</ul>';
        str += '<ul>';
        str += '<li><i class="negative-bg"></i><span>负面评论</span></li>';
        str += '<ul class="negative-wrap">';
        if(data.neg && data.neg.length > 0){
            for(var i=0;i<data.neg.length;i++){
                str += '<li>'+data.neg[i]+'</li>';
            }
        }
        str += '</ul>';
        str += '</ul>';
        str += '</div>';
        return str;
    },
    _getChannel:function(){
        var domChannel = $('#bs_channel');
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationIntroduce','get',true,postData,function(){
                domChannel.html(B_Pre._loading());
            },function(){
                domChannel.html('');
            },function(data,msg){
                if(data.game_info){
                    if(data.channel_info && data.channel_info.length > 0) {
                        domChannel.html(F_GameAnalysis_Info._htmlChannel(data.channel_info));
                        
                        $('.bs_channel_detail').each(function () {
                            $(this).click(function () {
                                F_GameAnalysis_Info._chartClick('bs_channel_detail',{'name':$(this).attr('data-n'),'id':$(this).attr('data-i')})
                            });
                        });
                    }else{
                        domChannel.html(B_Pre._empty('暂无数据'));
                    }
                }
            },function(data,msg,code){
                domChannel.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlChannel:function (data) {
        var str = '';
        var source = {};
        for(var i=0;i<data.length;i++){
            source = B_Game._source(data[i].source_type);
            if(source){
                source = source.source_desc;
            }else{
                source = '';
            }
            str += '<div class="boxshadow"><img src="'+B_Game._imgSourceUrl(data[i].source_type,'small')+'">';
            str += '<ul class="channel-card-list">';
            str += '<li><span>评分</span>';
            str += '<span>'+data[i].rating_value+'</span>';
            str += '</li>';
            str += '<li><span>评价量</span>';
            str += '<span><a data-i="'+data[i].source_type+'" data-n="'+source+'" class="bs_channel_detail">'+data[i].rating_count+'</a></span>';
            str += '</li>';
            str += '<li><span>版本号</span>';
            str += '<span>'+data[i].version+'</span>';
            str += '</li>';
            str += '<li><span>下载量</span>';
            str += '<span>'+data[i].download_num+'</span>';
            str += '</li>';
            str += '<li><span>更新时间</span>';
            str += '<span>'+data[i].update_date+'</span>';
            str += '</li>';
            str += '</ul></div>';
        }
        return str;
    },
    _getTotal:function () {
        var domId = '0_0';
        var dom = $('#bs_chart_'+domId);
        var domTable = $('#bs_table_list_'+domId);

        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('forumAnalyse','get',true,postData,function(){
                dom.html(B_Pre._loading());
                domTable.html(B_Pre._loading());
                $('#bs_page_'+domId).html('');
            },function(){
                dom.html('');
                domTable.html('');
            },function(data,msg){
                if(data && data.y_axis){
                    var tableData = {'head':['日期'],'body':[]};
                    var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true,legendSelectMode:true,legendIsShow:true};
                    chartDataPre.x_axis = data.x_axis;
                    $.each(data.y_axis,function (key,value) {
                        tableData.head.push(key);
                        for(var d=0;d<value.length;d++){
                            if (!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(value[d]);
                        }
                        chartDataPre.y_axis.push({'name':key,'data':value});
                    })
                    M_Outside_Chart._chartData('barSum','bs_chart_'+domId,chartDataPre,'gameForumTotalLight');
                    tableData.name = '论坛帖子总量('+M_Init._dateCache.begin+'至'+M_Init._dateCache.end+')';
                    M_Init._dataCache[domId] = tableData;
                    M_Init._dataCache['gameForumTotalData'] = data.y_axis_desc;
                    M_Inside._tableHtml(1,domId);

                    M_Inside._chartTableIcon('together',0,'0');
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getCount:function () {
        var domId = '1_0';
        var dom = $('#bs_chart_'+domId);
        var domTable = $('#bs_table_list_'+domId);
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin2;
        postData['end_date'] = M_Init._dateCache.end2;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('channelCount','get',true,postData,function(){
                dom.html(B_Pre._loading());
                domTable.html(B_Pre._loading());
                $('#bs_page_'+domId).html('');
            },function(){
                dom.html('');
                domTable.html('');
            },function(data,msg){
                if(data && data.channel_rating_distri && data.channel_rating_distri.length > 0){
                    M_Init._dataCache['channelCount'] = data.channel_rating_distri;
                    var tab = [];
                    var chartData ={};
                    var curData = '';
                    var x = [];
                    var index = 0;
                    for(var i=0;i<data.channel_rating_distri.length;i++){
                        curData = data.channel_rating_distri[i];
                        if(!($.inArray(curData.source_name,tab) > -1)){
                            tab.push(curData.source_name);
                        }
                        if(!chartData[curData.source_name]){
                            x = curData.rating_names.split(',');
                            chartData[curData.source_name] = {'x':x,'y':[]};
                            for(var d=0;d<x.length;d++){
                                chartData[curData.source_name].y.push(0);
                            }
                        }
                        index = $.inArray(curData.rating_name,chartData[curData.source_name].x);
                        if(index > -1){
                            chartData[curData.source_name].y[index] = curData.num;
                        }
                    }
                    M_Init._dataCache['countData'] = chartData;

                    if(!M_Init._dataCache['currentChannel']){
                        var str = '';
                        for(var i=0;i<tab.length;i++){
                            if(i==0){
                                M_Init._dataCache['currentChannel'] = tab[i];
                                str += '<li class="tg-tab-block-active">';
                            }else{
                                str += '<li>';
                            }
                            str += tab[i]+'</li>';
                        }
                        $('#bs_tab_'+domId).html(str);
                        $('#bs_tab_'+domId+' li').each(function () {
                            $(this).click(function () {
                                if(!($(this).hasClass('tg-tab-block-active'))){
                                    $(this).addClass('tg-tab-block-active').siblings('li').removeClass('tg-tab-block-active');
                                    M_Init._dataCache['currentChannel'] = $(this).html();
                                    F_GameAnalysis_Info._chartCount(domId);
                                }
                            });
                        });
                    }
                    F_GameAnalysis_Info._chartCount(domId);
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _chartCount:function (domId) {
        var tableData = {'head':['评级','数量'],'body':[]};
        var chartDataPre = {x_axis:[],y_axis:[]};
        if(M_Init._dataCache['countData'] && M_Init._dataCache['countData'][M_Init._dataCache['currentChannel']]){
            var currentData = M_Init._dataCache['countData'][M_Init._dataCache['currentChannel']];
            chartDataPre.x_axis = currentData.x;
            chartDataPre.y_axis.push({name:M_Init._dataCache['currentChannel'],data:currentData.y});
            for(var i=0;i<currentData.y.length;i++){
                if (!tableData.body[i])tableData.body[i] = [chartDataPre.x_axis[i]];
                tableData.body[i].push(currentData.y[i]);
            }
            M_Outside_Chart._chartData('bar','bs_chart_'+domId,chartDataPre,'gameChannelCountLight');
            M_Init._dataCache[domId] = tableData;
            M_Inside._tableHtml(1,domId);
            M_Inside._chartTableIcon('together',1,'0');
        }
    },
    _getRankProperty:function () {
        var dom = $('#bs_ranklist');
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('appstoreClassify','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.device_type_dim && data.device_type_dim.length > 0){
                    if($('#bs_rank_select').html() == ''){
                        var item = [];
                        if($.inArray(3, data.list_type_dim) > -1 || $.inArray('3', data.list_type_dim) > -1){
                            M_Init._dataCache['listType'] = 3;
                            item.push({id:3,name:M_Game._appListType[3]});
                        }else{
                            M_Init._dataCache['listType'] = data.list_type_dim[0];
                        }
                        for(var i=0;i<data.list_type_dim.length;i++){
                            if(data.list_type_dim[i]+'' != '3'){
                                item.push({id:data.list_type_dim[i],name:M_Game._appListType[data.list_type_dim[i]]});
                            }
                        }
                        $('#bs_rank_select').prepend(F_GameAnalysis_Info._htmlRankSelect('bs_rank_select_list','榜单',item));

                        item = [];
                        M_Init._dataCache['gameType'] = data.game_type_dim[0];
                        for(var i=0;i<data.game_type_dim.length;i++){
                            item.push({id:data.game_type_dim[i],name:M_Game._appGameType[data.game_type_dim[i]]});
                        }
                        $('#bs_rank_select').prepend(F_GameAnalysis_Info._htmlRankSelect('bs_rank_select_type','类型',item));

                        item = [];
                        M_Init._dataCache['deviceType'] = data.device_type_dim[0];
                        for(var i=0;i<data.device_type_dim.length;i++){
                            item.push({id:data.device_type_dim[i],name:M_Game._appPlatType[data.device_type_dim[i]]});
                        }
                        $('#bs_rank_select').prepend(F_GameAnalysis_Info._htmlRankSelect('bs_rank_select_plat','设备',item));

                        M_Inside._dropShow();
                        M_Inside._dropLeave();
                        M_Inside._dropSelected(function (key) {
                            M_Init._dataCache['listType'] = key;
                            F_GameAnalysis_Info._getRankList();
                        },'bs_rank_select_list');

                        M_Inside._dropSelected(function (key) {
                            M_Init._dataCache['gameType'] = key;
                            F_GameAnalysis_Info._getRankList();
                        },'bs_rank_select_type');

                        M_Inside._dropSelected(function (key) {
                            M_Init._dataCache['deviceType'] = key;
                            F_GameAnalysis_Info._getRankList();
                        },'bs_rank_select_plat');
                    }
                    F_GameAnalysis_Info._getRankList();
                }else{
                    F_GameAnalysis_Info._getRankList();
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlRankSelect:function (domId,name,data) {
        var str = '<div class="tg-selected-drop tg-date-fl '+domId+'">';
        str += '<span>'+name+'</span>';
        str += '<div class="tg-selected-drop"><p class="tg-drop-text-part">';
        str += '<i class="tg-graph tg-triangle-gray-bottom"></i><span id="tabSelect" data-i="'+data[0].id+'">'+data[0].name+'</span>';
        str += '</p>';
        str += '<ul style="display: none;">';
        for(var i=0;i<data.length;i++){
            str += '<li><a data-i="'+data[i].id+'">'+data[i].name+'</a></li>';
        }
        str += '</ul></div></div>';
        return str;
    },
    _getRankList:function () {
        var dom = $('#bs_ranklist');
        M_Init._dataCache['project'] = M_Init._dataCache['app'] = [];

        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData['app_type'] = (M_Init._dataCache['gameType'] ? M_Init._dataCache['gameType'] : 0);
        postData['list_type'] = (M_Init._dataCache['listType'] ? M_Init._dataCache['listType'] : 0);
        postData['device_type'] = (M_Init._dataCache['deviceType'] ? M_Init._dataCache['deviceType'] : 0);
        postData['start_date'] = M_Init._dateCache.begin3;
        postData['end_date'] = M_Init._dateCache.end3;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationIntroduceOpinion','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data){
                    M_Init._dataCache['project'] = (data.project_rank && data.project_rank.length > 0) ? data.project_rank : [];
                    M_Init._dataCache['app'] = (data.app_store && data.app_store.length > 0) ? data.app_store : [];

                    F_GameAnalysis_Info._chartRank();
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _chartRank:function () {
        var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true,yFormat:'',legendSelectMode:false,inverse:true,yMin:1,yMax: 0};
        var data = '';
        chartDataPre.y_axis.push({name:'AppStore排行榜',data:[]});
        data = M_Init._dataCache['app'];
        var yAxis = [];
        for(var i=0;i<data.length;i++){
            chartDataPre.x_axis.push(data[i].data_date);
            chartDataPre.yMax = (chartDataPre.yMax > parseInt(data[i].rank)) ? chartDataPre.yMax : parseInt(data[i].rank);
            yAxis.push(data[i].rank);
        }
        chartDataPre.yMax = (chartDataPre.yMax < 5) ? 5 : 0;
        chartDataPre.y_axis[0].data = yAxis;

        M_Outside_Chart._chartData('line','bs_ranklist',chartDataPre);
    }
}