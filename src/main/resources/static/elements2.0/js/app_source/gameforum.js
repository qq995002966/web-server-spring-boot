var F_GameForum_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-3');
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

            M_Game._checkGameVisitList('gameForum');
            //M_Game._getGame();
            //F_GameForum_Info._domInit();
            //M_Outside._searchPop();
        }
    }
}

var F_GameForum_Info = {
    _chartClick:function (type,value) {
        var data = {};
        data.gameId = M_Init._gameDetailId;
        switch(type){
            case 'gameForumTotal':
                data.dateBegin = value.date;
                data.dateEnd = value.date;
                if(M_Init._dataCache['gameForumTotalData']){
                    var dataUnion = M_Init._dataCache['gameForumTotalData'];
                    for(var i=0;i<dataUnion.length;i++){
                        if(dataUnion[i][value.type]){
                            data.infoIdList = dataUnion[i][value.type];
                            break;
                        }
                    }
                }
                break;
            case 'gameEmotionRank':
                data.dateBegin = value.date;
                data.dateEnd = value.date;
                switch(value.type){
                    case '正面情感帖数量':
                        data.sentimentScore = '1,2';
                        break;
                    case '负面情感帖数量':
                        data.sentimentScore = '-1,-2';
                        break;
                }
                break;
        }
        M_Outside._redirectForum(data);
    },
    _domInit:function () {
        var str = '';
        str += M_Outside._domCreate('chartTableDate',1,'0_0','论坛帖子总量');
        str += M_Outside._domCreate('chartTableDate',2,'1_0','情感帖走势');
        str += M_Outside._domCreate('tableDate',3,'2_0','论坛帖子质量分析');
        $('#ct_main_area').html(str);

        M_Inside._downloadCsv();

        B_Date._chooseSection({'autoCommit':true,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                M_Init._dateCache.begin = begin;
                M_Init._dateCache.end = end;
                F_GameForum_Info._getTotal();
            }
        });
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},2,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin2 || M_Init._dateCache.end2 != end){
                M_Init._dateCache.begin2 = begin;
                M_Init._dateCache.end2 = end;
                F_GameForum_Info._getTendency();
            }
        });
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},3,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin3 || M_Init._dateCache.end3 != end){
                M_Init._dateCache.begin3 = begin;
                M_Init._dateCache.end3 = end;
                F_GameForum_Info._getQuality();
            }
        });
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
                    M_Outside_Chart._chartData('barSum','bs_chart_'+domId,chartDataPre,'gameForumTotal');
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
    _getTendency:function () {
        var domId = '1_0';
        var dom = $('#bs_chart_'+domId);
        var domTable = $('#bs_table_list_'+domId);
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin2;
        postData['end_date'] = M_Init._dateCache.end2;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('forumAnalyseRate','get',true,postData,function(){
                dom.html(B_Pre._loading());
                domTable.html(B_Pre._loading());
                $('#bs_page_'+domId).html('');
            },function(){
                dom.html('');
                domTable.html('');
            },function(data,msg){
                if(data && data.x_axis){
                    var tableData = {'head':['日期'],'body':[]};
                    var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true,legendSelectMode:true,'color':['#91c356','#e6646d']};
                    chartDataPre.x_axis = data.x_axis;
                    tableData.head.push('正面情感帖数量');
                    for(var i=0;i<data.y_axis_positive.length;i++){
                        if (!tableData.body[i])tableData.body[i] = [chartDataPre.x_axis[i]];
                        tableData.body[i].push(data.y_axis_positive[i]);
                    }
                    chartDataPre.y_axis.push({'name':'正面情感帖数量','data':data.y_axis_positive});
                    tableData.head.push('负面情感帖数量');
                    for(var i=0;i<data.y_axis_negative.length;i++){
                        if (!tableData.body[i])tableData.body[i] = [chartDataPre.x_axis[i]];
                        tableData.body[i].push(data.y_axis_negative[i]);
                    }
                    chartDataPre.y_axis.push({'name':'负面情感帖数量','data':data.y_axis_negative});

                    M_Outside_Chart._chartData('lineOpacity','bs_chart_'+domId,chartDataPre,'gameEmotionRank');
                    tableData.name = '情感帖走势('+M_Init._dateCache.begin2+'至'+M_Init._dateCache.end2+')';
                    M_Init._dataCache[domId] = tableData;
                    M_Inside._tableHtml(1,domId);

                    M_Inside._chartTableIcon('together',1,'0');
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getQuality:function () {
        var domId = '2_0';
        var domTable = $('#bs_table_list_'+domId);
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin3;
        postData['end_date'] = M_Init._dateCache.end3;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('forumQualityAnalyse','get',true,postData,function(){
                domTable.html(B_Pre._loading());
                $('#bs_page_'+domId).html('');
            },function(){
                domTable.html('');
            },function(data,msg){
                if(data && data.useless_distri && data.useless_distri.length > 0){
                    var dataUnion = data.useless_distri;
                    var tableData = {'head':['论坛名称','论坛帖子总量','正面情感帖总量','负面情感帖总量','广告帖占比','灌水帖占比','色情帖占比','脏话帖占比','买卖帖占比','其他帖占比'],'body':[]};
                    for(var i=0;i<dataUnion.length;i++){
                        tableData.body[i] = [dataUnion[i].show_forum_name,dataUnion[i].forum_num.total,dataUnion[i].forum_num.positive,dataUnion[i].forum_num.negative,'-','-','-','-','-','-'];
                        if(dataUnion[i].detail_classify_distri && dataUnion[i].detail_classify_distri.length > 0){
                            var rate = '';
                            for(var d=0;d<dataUnion[i].detail_classify_distri.length;d++){
                                rate = (dataUnion[i].detail_classify_distri[d].useless_rate*100).toFixed(2);
                                switch(dataUnion[i].detail_classify_distri[d].useless_classify){
                                    case '买卖':
                                        tableData.body[i][8] = rate;
                                        break;
                                    case '灌水':
                                        tableData.body[i][5] = rate;
                                        break;
                                    case '色情':
                                        tableData.body[i][6] = rate;
                                        break;
                                    case '脏话':
                                        tableData.body[i][7] = rate;
                                        break;
                                    case '广告':
                                        tableData.body[i][4] = rate;
                                        break;
                                    case '其他':
                                        tableData.body[i][9] = rate;
                                        break;
                                }
                            }
                        }
                    }
                    tableData.name = '论坛帖子质量分析('+M_Init._dateCache.begin3+'至'+M_Init._dateCache.end3+')';
                    M_Init._dataCache[domId] = tableData;
                    M_Inside._tableHtml(1,domId);
                }else{
                    domTable.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
            domTable.html(B_Pre._empty(msg));
            }
        )
    }
}