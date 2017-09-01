var F_Keypoint_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationKpi'] = 'demoInnerOperationKpi';
                    break;
                default:
                    M_Init._api['innerOperationKpi'] = 'innerOperationKpi';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('keypoint','','1-1-2');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_Keypoint_Info._getInfo();
                }
            });
        }
    }
}
var F_Keypoint_Info = {
    _init:[
            {'type':'togetherTabAvg','name':'付费渗透率','tab':['日付费率','日ARPU','日ARPPU'],'tips':[
                {},{'position':'second','content':['当日付费玩家数占当日活跃玩家数的比例','当日每活跃玩家的平均收益','当日每付费用户平均收益']}
            ]},
            {'type':'together','name':'玩家留存','tab':[],'tips':[{'position':'first','content':'新增玩家次日留存率：以选择当日的新增玩家为基数，这批玩家在第二天仍有登录记录的比例<br>新增玩家7日留存率：以选择当日的新增玩家为基数，这批玩家在第7日仍有登录记录的比例<br>新增玩家30日留存率：以选择当日的新增玩家为基数，这批玩家在第30日仍有登录记录的比例'}]},
            {'type':'togetherTabAvg','name':'平均游戏时长与次数','tab':['平均游戏次数','平均游戏时长'],'tips':[{},{'position':'second','content':['当日活跃玩家的平均开启游戏次数','当日活跃玩家的平均游戏时长']}]}
        ],
    _avg: [
        [
            [{ 'label': 'AVG：', 'name': '平均每日付费率', 'key': 'avg_pay_rate', 'unit': '%' }],
            [{ 'label': 'AVG：', 'name': '平均每日ARPU', 'key': 'avg_arpu', 'unit': '元' }],
            [{ 'label': 'AVG：', 'name': '平均每日ARPPU', 'key': 'avg_arppu', 'unit': '元' }]
        ],
        [ ],
        [
            [{ 'label': 'AVG：', 'name': '平均每活跃玩家每日游戏', 'key': 'avg_login_times', 'unit': '次,' },{ 'label': '', 'name': '共', 'key': 'sum_online_minutes', 'unit': 'mins' }],
            [{ 'label': 'AVG：', 'name': '平均每活跃玩家每日游戏', 'key': 'avg_login_times', 'unit': '次,' },{ 'label': '', 'name': '共', 'key': 'sum_online_minutes', 'unit': 'mins' }]
        ]
    ],        
    _port:[
        [[{'name':'日付费率','key':'y_axis_pay_rate'}],[{'name':'日ARPU','key':'y_axis_arpu'}],[{'name':'日ARPPU','key':'y_axis_arppu'}]],
        [[{'name':'新增玩家次日留存率','key':'y_axis_retention_rate_1d'},{'name':'新增玩家7日留存率','key':'y_axis_retention_rate_7d'},{'name':'新增玩家30日留存率','key':'y_axis_retention_rate_30d'}]],
        [[{'name':'平均游戏次数','key':'y_axis_avg_login_times'}],[{'name':'平均游戏时长','key':'y_axis_avg_online_minutes'}]]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'),F_Keypoint_Info._init);
        F_Keypoint_Info._getInfo();

        M_Inside._downloadCsv();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_Keypoint_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationKpi'],'get',true,postData,function(){
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
                for(var i=0;i<F_Keypoint_Info._init.length;i++){
                    if(F_Keypoint_Info._init[i].tab.length > 0){
                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d<F_Keypoint_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                F_Keypoint_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_Keypoint_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i,F_Keypoint_Info._init[i].type,'keypoint');
                    }else{
                        F_Keypoint_Info._chartHtml(i,'0');
                        M_Inside._chartTableIcon(F_Keypoint_Info._init[i].type,i,'0');
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
        var chartDataPre = {x_axis:data.x_axis,y_axis:[],xFormatDate:true,yFormat:''};
        var tableUnit = '';
        switch(domBig+''){
            case '0':
                switch(domSmall+''){
                    case '0':
                        chartDataPre.yFormat = '%';
                        chartDataPre.tooltip = {'num':1,'unit':'%'};
                        tableUnit = '%';
                        break;
                    case '1':
                    case '2':
                        chartDataPre.yFormat = '元';
                        chartDataPre.tooltip = {'num':1,'unit':'元'};
                        tableUnit = '元';
                        break;
                }
                break;
            case '1':
                chartDataPre.x_axis = data.x_axis_retention;
                chartDataPre.yFormat = '%';
                chartDataPre.tooltip = {'num':3,'unit':'%'};
                tableUnit = '%';
                break;
            case '2':
                switch(domSmall+''){
                    case '0':
                        chartDataPre.yFormat = '次';
                        chartDataPre.tooltip = {'num':1,'unit':'次'};
                        tableUnit = '次';
                        break;
                    case '1':
                        chartDataPre.yFormat = 'mins';
                        chartDataPre.tooltip = {'num':1,'unit':'mins'};
                        tableUnit = 'mins';
                        break;
                }
                break;
        }
        var tableData = {'head':['日期'],'body':[]};
        for(var i=0;i<F_Keypoint_Info._port[domBig][domSmall].length;i++){
            if(tableUnit != '%'){
                tableData.head.push(F_Keypoint_Info._port[domBig][domSmall][i].name+'('+tableUnit+')');
            }else{
                tableData.head.push(F_Keypoint_Info._port[domBig][domSmall][i].name);
            }
            if(data[F_Keypoint_Info._port[domBig][domSmall][i].key]){
                for(var d=0;d<data[F_Keypoint_Info._port[domBig][domSmall][i].key].length;d++){
                    if(!tableData.body[d])tableData.body[d] = [data.x_axis[d]];
                    if(tableUnit != '%') {
                        tableData.body[d].push(data[F_Keypoint_Info._port[domBig][domSmall][i].key][d]);
                    }else{
                        tableData.body[d].push(data[F_Keypoint_Info._port[domBig][domSmall][i].key][d] + tableUnit);
                    }
                }
                chartDataPre.y_axis.push({'name':F_Keypoint_Info._port[domBig][domSmall][i].name,'data':data[F_Keypoint_Info._port[domBig][domSmall][i].key]});
            }
        }

        if (F_Keypoint_Info._avg[domBig] && F_Keypoint_Info._avg[domBig][domSmall]) {
            var avgData = '';
            var avgConfig = F_Keypoint_Info._avg[domBig][domSmall];
            for(var a=0;a<avgConfig.length;a++){
                if(avgConfig[a].label)avgData += '<span>'+avgConfig[a].label+'</span>';
                avgData += '<span>' + avgConfig[a].name + '<b>';
                dataKey = avgConfig[a].key.split('|');
                if (data[dataKey[0]] && data[dataKey[0]]) {
                    avgData += data[dataKey[0]];
                }
                avgData += avgConfig[a].unit + '</b></span>';
            }

            M_Inside._avgHtml(domBig + '_0', avgData);
        }

        tableData.name = M_Inside._tableName(F_Keypoint_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(50,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}