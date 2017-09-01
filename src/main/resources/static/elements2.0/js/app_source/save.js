var F_Save_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationRetentionUser'] = 'demoInnerOperationRetentionUser';
                    break;
                default:
                    M_Init._api['innerOperationRetentionUser'] = 'innerOperationRetentionUser';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('save','','1-2-3');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_Save_Info._getInfo();
                }
            });
        }
    }
}
var F_Save_Info = {
    _init:[
            {'type':'togetherTab','name':'新增帐户留存','tab':['次日留存','7日留存','30日留存'],'tips':[{},{'position':'second','content':['以昨日的新增玩家为基数，昨日新增玩家在今日仍有登录记录的人数','以6日前的新增玩家为基数，这批新增玩家在今日仍有登录记录的人数','以29日前的新增玩家为基数，这批新增玩家在今日仍有登录记录的人数']}]},
            {'type':'switchTab','name':'当日游戏次数分布','tab':['次日留存','7日留存','30日留存'],'tips':[{},{'position':'second','content':['昨日新增玩家中，今日也有登录的玩家在当日的游戏次数分布','6日前的新增玩家中，今日也有登录的玩家在当日的游戏次数分布','29日前的新增玩家中，今日也有登录的玩家在当日的游戏次数分布']}]},
            {'type':'switchTab','name':'当日游戏时长分布','tab':['次日留存','7日留存','30日留存'],'tips':[{},{'position':'second','content':['昨日新增玩家中，今日也有登录的玩家在当日的游戏时长分布','6日前的新增玩家中，今日也有登录的玩家在当日的游戏时长分布','29日前的新增玩家中，今日也有登录的玩家在当日的游戏时长分布']}]},
            {'type':'switchTab','name':'当日等级分布','tab':['次日留存','7日留存','30日留存'],'tips':[{},{'position':'second','content':['昨日新增玩家中，今日也有登录的玩家在当日的等级分布','6日前的新增玩家中，今日也有登录的玩家在当日的等级分布','29日前的新增玩家中，今日也有登录的玩家在当日的等级分布']}]},
            {'type':'switchTab','name':'中国地区分布','tab':['次日留存','7日留存','30日留存'],'tips':[{},{'position':'second','content':['昨日新增玩家中，今日也有登录的玩家的地区分布','6日前的新增玩家中，今日也有登录的玩家的地区分布','29日前的新增玩家中，今日也有登录的玩家的地区分布']}]},
            {'type':'switchTab','name':'全球地区分布','tab':['次日留存','7日留存','30日留存'],'tips':[{},{'position':'second','content':['昨日新增玩家中，今日也有登录的玩家的地区分布','6日前的新增玩家中，今日也有登录的玩家的地区分布','29日前的新增玩家中，今日也有登录的玩家的地区分布']}]}
        ],
    _port:[
        [[{'name':'次日留存数','key':'y_axis_retention_num_1d'},{'name':'次日留存率','key':'y_axis_retention_rate_1d'}],[{'name':'7日留存数','key':'y_axis_retention_num_7d'},{'name':'7日留存率','key':'y_axis_retention_rate_7d'}],[{'name':'30日留存数','key':'y_axis_retention_num_30d'},{'name':'30日留存率','key':'y_axis_retention_rate_30d'}]],
        [[{'name':'次日留存','key':'logintimes_distri|1d'}],[{'name':'7日留存','key':'logintimes_distri|7d'}],[{'name':'30日留存','key':'logintimes_distri|30d'}]],
        [[{'name':'次日留存','key':'oltime_distri|1d'}],[{'name':'7日留存','key':'oltime_distri|7d'}],[{'name':'30日留存','key':'oltime_distri|30d'}]],
        [[{'name':'次日留存','key':'level_distri|1d'}],[{'name':'7日留存','key':'level_distri|7d'}],[{'name':'30日留存','key':'level_distri|30d'}]],
        [[{'name':'次日留存','key':'area_distri|1d|china'}],[{'name':'7日留存','key':'area_distri|7d|china'}],[{'name':'30日留存','key':'area_distri|30d|china'}]],
        [[{'name':'次日留存','key':'area_distri|1d|global'}],[{'name':'7日留存','key':'area_distri|7d|global'}],[{'name':'30日留存','key':'area_distri|30d|global'}]]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'),F_Save_Info._init);
        M_Inside._downloadCsv();
        F_Save_Info._getInfo();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_Save_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationRetentionUser'],'get',true,postData,function(){
            for(var i=0;i<domChart.length;i++){
                $('#'+domChart[i]).html(B_Pre._loading());
            }
        },function(){
            for(var i=0;i<domChart.length;i++){
                $('#'+domChart[i]).html('');
            }
        },function(data,msg){
            if(data){
                M_Init._dataCache['data'] = data;
                for(var i=0;i<F_Save_Info._init.length;i++){
                    if(F_Save_Info._init[i].tab.length > 0){
                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d<F_Save_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                F_Save_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_Save_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i,F_Save_Info._init[i].type,'save');
                    }
                }
            }
        },function(data,msg,code){
            for(var i=0;i<domChart.length;i++){
                $('#'+domChart[i]).html(B_Pre._empty(msg));
            }
        })
    },
    _chartHtml:function (domBig,domSmall) {
        M_Init._dataCache['position_'+domBig] = domSmall;
        var data = M_Init._dataCache['data'];
        var chartDataPre = {x_axis:[],y_axis:[],yFormat:''};
        var tableData = {};
        var chartType = 50;
        var tableUnit = '';
        switch(domBig+''){
            case '0':
                chartDataPre.xFormatDate = true;
                chartDataPre.yDouble = true;
                chartDataPre.yDoubleLabel = ['','%'];
                chartDataPre.tooltip = {'type':'diff','num':2,'unit':['人','%']};
                tableData = {'head':['日期'],'body':[]};
                tableUnit = '%';
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                chartDataPre.tooltip = {'num':1,'unit':'人'};
                break;
        }
        for(var i=0;i<F_Save_Info._port[domBig][domSmall].length;i++){
            var dataKey = F_Save_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_Save_Info._port[domBig][domSmall][i].name;
            if((domBig == 1) ){
                chartType = 20;
                tableData = {'head':['游戏次数',dataName+'(人)','玩家占比'],'body':[]};
                if(data[dataKey[0]][dataKey[1]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]];
                    var y_axis = [];
                    for(var d=0;d<dataUnion.length;d++){
                        chartDataPre.x_axis.push(dataUnion[d].login_times+'次');
                        y_axis.push(dataUnion[d].user_num);
                        if(!tableData.body[d])tableData.body[d] = [dataUnion[d].login_times+'次'];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate+'%');
                    }
                    chartDataPre.y_axis.push({'name':dataName,'data':y_axis});
                }
            }else if((domBig == 2) ){
                chartType = 20;
                tableData = {'head':['已玩天数',dataName+'(人)','玩家占比'],'body':[]};
                if(data[dataKey[0]][dataKey[1]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]];
                    var y_axis = [];
                    for(var d=0;d<dataUnion.length;d++){
                        chartDataPre.x_axis.push(dataUnion[d].oltime_classify);
                        y_axis.push(dataUnion[d].user_num);
                        if(!tableData.body[d])tableData.body[d] = [dataUnion[d].oltime_classify];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate+'%');
                    }
                    chartDataPre.y_axis.push({'name':dataName,'data':y_axis});
                }
            }else if(domBig == 3){
                chartType = 40;
                tableData = {'head':['玩家等级分布',dataName+'(人)','玩家占比'],'body':[]};
                if(data[dataKey[0]][dataKey[1]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]];
                    var y_axis = [];
                    for(var d=0;d<dataUnion.length;d++){
                        chartDataPre.x_axis.push(dataUnion[d].level+'级');
                        y_axis.push(dataUnion[d].user_num);
                        if(!tableData.body[d])tableData.body[d] = [dataUnion[d].level+'级'];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate+'%');
                    }
                    chartDataPre.y_axis.push({'name':dataName,'data':y_axis});
                }
            }else if(domBig == 4 || domBig == 5){
                chartType = 20;
                tableData = {'head':['地区',dataName+'(人)','玩家占比'],'body':[]};
                if(data[dataKey[0]] && data[dataKey[0]][dataKey[1]] && data[dataKey[0]][dataKey[1]][dataKey[2]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]][dataKey[2]];
                    var y_axis = [];
                    for(var d=0;d<dataUnion.length;d++){
                        chartDataPre.x_axis.push(dataUnion[d].area_classify);
                        y_axis.push(dataUnion[d].user_num);
                        if(!tableData.body[d])tableData.body[d] = [dataUnion[d].area_classify];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate+'%');
                    }
                    chartDataPre.y_axis.push({'name':dataName,'data':y_axis});
                }
            }else{
                chartType = 50;
                chartDataPre.x_axis = data.x_axis;
                if(i+'' == '0'){
                    tableData.head.push(dataName+'(人)');
                }else{
                    tableData.head.push(dataName);
                }
                if(data[dataKey[0]]){
                    var dataUnion = data[dataKey[0]];
                    for(var d=0;d<dataUnion.length;d++){
                        if(!tableData.body[d])tableData.body[d] = [data.x_axis[d]];
                        if(i+'' == '0'){
                            tableData.body[d].push(dataUnion[d]);
                        }else{
                            tableData.body[d].push(dataUnion[d]+tableUnit);
                        }
                    }
                    if(i == 0){
                        chartDataPre.y_axis.push({'type':'bar','name':dataName,'data':dataUnion});
                    }else{
                        chartDataPre.y_axis.push({'type':'line','name':dataName,'data':dataUnion});
                    }
                }
            }
        }

        tableData.name = M_Inside._tableName(F_Save_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(chartType,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}