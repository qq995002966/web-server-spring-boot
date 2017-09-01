var F_GameChannel_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-4');
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
                    if(!M_Init._gameDetailId) {
                        M_Init._gameDetailId = M_Init._getGameId('outsideGameDetail');
                    }
                }
            }
            M_Game._checkGameVisitList('gameChannel');
            //M_Game._getGame();
            //F_GameChannel_Info._domInit();
            //M_Outside._searchPop();
        }
    }
}

var F_GameChannel_Info = {
    _chartClick:function (type,value) {
        var data = {};
        data.gameId = M_Init._gameDetailId;
        switch(type){
            case 'gameChannelCount':
                data.dateBegin =  M_Init._dateCache.begin;
                data.dateEnd =  M_Init._dateCache.end;
                if(M_Init._dataCache['channelCount']){
                    var dataUnion = M_Init._dataCache['channelCount'];
                    for(var i=0;i<dataUnion.length;i++){
                        if(dataUnion[i]['source_name'] == M_Init._dataCache['currentChannel'] && dataUnion[i]['rating_name'] == value.name){
                            data.channelId = dataUnion[i].source_type;
                            data.esFieldName = dataUnion[i].es_field_name;
                            data.esFieldVal = dataUnion[i].es_field_val;
                            break;
                        }
                    }
                }
                break;
        }
        M_Outside._redirectComments(data);
    },
    _domInit:function () {
        var str = '';
        str += M_Outside._domCreate('chartTableDateTab',1,'0_0','渠道评分统计');
        str += F_GameChannel_Info._htmlAnalyse();
        $('#ct_main_area').html(str);
        M_Inside._downloadCsv();
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                M_Init._dateCache.begin = begin;
                M_Init._dateCache.end = end;
                F_GameChannel_Info._getCount();
            }
        });
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},2,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin2 || M_Init._dateCache.end2 != end){
                M_Init._dateCache.begin2 = begin;
                M_Init._dateCache.end2 = end;
                F_GameChannel_Info._getEmotion();
            }
        });
    },
    _htmlAnalyse:function () {
        var str = '<div class="blockpart tg-table-layout  col-lg-12 col-md-12 col-sm-12 col-xs-12">';
        str += '<h3>渠道评论情感分析</h3>';
        str += '<div class="boxshadow tg-table-content channel-emotion-analysis">';
        str += '\
        <div id="bs_rank_select">\
            <div class="tg-selected-drop tg-date-fl">\
                <span>日期</span>\
                <p class="tg-drop-text-part">\
                <i class="tg-graph tg-triangle-gray-bottom"></i>\
                <span class="hot-area" id="dc2"></span>\
                <input id="db2" type="hidden" value="">\
                <input id="de2" type="hidden" value="">\
                </p>\
            </div>\
        </div>';
        str += '<div class="wrap" id="bs_analyse_show"></div>';

        str += '</div>';
        str += '</div>';

        return str;
    },
    _searchWord:function (keyword,type) {
        M_Outside._redirectComments({'gameId':M_Init._gameDetailId,'dateBegin':M_Init._dateCache.begin2,'dateEnd':M_Init._dateCache.end2,'sentimentKeywords':keyword,'sentimentKeywordsType':type,'ratingStageList':type});
    },
    _htmlAnalyseShow:function (data) {
        var str = '';
        str += '<div class="fl"><div class="graph-part"><div id="bs_analyse_chart" style="width: 100%; height: 100%"></div></div></div>';
        str += '<div class="fr">';
        str += '<ul class="positive-comment">';
        str += '<li><b></b><span>正面评论</span></li>';
        str += '<i class="tg-icon triangle-shadow"></i>';
        str += '<ul>';
        if(data.pos && data.pos.length > 0){
            for(var i=0;i<data.pos.length;i++){
                str += '<li onclick="F_GameChannel_Info._searchWord(\''+data.pos[i]+'\',1);">'+data.pos[i]+'</li>';
            }
        }
        str += '</ul>';
        str += '</ul>';
        str += '<ul class="negative-comment">';
        str += '<li><b></b><span>负面评论</span></li>';
        str += '<i class="tg-icon triangle-shadow"></i>';
        str += '<ul>';
        if(data.neg && data.neg.length > 0){
            for(var i=0;i<data.neg.length;i++){
                str += '<li onclick="F_GameChannel_Info._searchWord(\''+data.neg[i]+'\',-1);">'+data.neg[i]+'</li>';
            }
        }
        str += '</ul>';
        str += '</ul>';
        str += '</div>';
        return str;
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
            M_Outside_Chart._chartData('bar','bs_chart_'+domId,chartDataPre,'gameChannelCount');
            M_Init._dataCache[domId] = tableData;
            M_Inside._tableHtml(1,domId);
            M_Inside._chartTableIcon('together',0,'0');
        }
    },
    _getCount:function () {
        var domId = '0_0';
        var dom = $('#bs_chart_'+domId);
        var domTable = $('#bs_table_list_'+domId);
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
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
                                    F_GameChannel_Info._chartCount(domId);
                                }
                            });
                        });
                    }
                    F_GameChannel_Info._chartCount(domId);
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getEmotion:function () {
        var dom = $('#bs_analyse_show');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin2;
        postData['end_date'] = M_Init._dateCache.end2;
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
                    dom.html(F_GameChannel_Info._htmlAnalyseShow(word));
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
    }
}