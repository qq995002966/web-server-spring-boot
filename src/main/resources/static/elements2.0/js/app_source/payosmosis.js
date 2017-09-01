var F_PayOsmosis_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationPayRateData'] = 'demoInnerOperationPayRateData';
                    break;
                default:
                    M_Init._api['innerOperationPayRateData'] = 'innerOperationPayRateData';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('payosmosis','','1-4-2');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_PayOsmosis_Info._getInfo();
                }
            });

        }
    }
}
var F_PayOsmosis_Info = {
    _init:[
        {'type':'togetherTabAvg','name':'付费率','tab':['日付费率','周付费率','月付费率'],'tips':[{},{'position':'second','content':['当日付费玩家数占当日活跃玩家数的比例','当自然周付费玩家数占当自然周活跃玩家数的比例 ','当自然月付费玩家数占当自然月活跃玩家数的比例']}]},
        {'type':'togetherTabAvg','name':'ARPU','tab':['日ARPU','月ARPU','日ARPPU','月ARPPU'],'tips':[{},{'position':'second','content':['当日每活跃玩家的平均收益','当自然月每活跃玩家（去重）的平均收益 ','当日每付费玩家的平均收益','当自然月每付费玩家（去重）的平均收益']}]},
        {'type':'switchTab','name':'付费渗透与中国地区分布','tab':['日均付费率','日均ARPU','日均ARPPU'],'tips':[{},{'position':'second','content':['所选时期内，当前地区的每日付费玩家占每日活跃玩家比例均数','所选时期内，当前地区的每日每活跃玩家平均收益均数','所选时期内，当前地区的每日每付费玩家平均收益均数']}]},
        {'type':'switchTab','name':'付费渗透与全球地区分布','tab':['日均付费率','日均ARPU','日均ARPPU'],'tips':[{},{'position':'second','content':['所选时期内，当前地区的每日付费玩家占每日活跃玩家比例均数','所选时期内，当前地区的每日每活跃玩家平均收益均数','所选时期内，当前地区的每日每付费玩家平均收益均数']}]},
        {'type':'switchTab','name':'付费渗透与渠道分布','tab':['日均付费率','日均ARPU','日均ARPPU'],'tips':[{},{'position':'second','content':['所选时期内，当前渠道的每日付费玩家占每日活跃玩家比例均数','所选时期内，当前渠道的每日每活跃玩家平均收益均数','所选时期内，当前渠道的每日每付费玩家平均收益均数']}]}
    ],
    _avg:[
        [
            [{'label':'AVG：','name':'平均每日付费率','key':'axis_pay_rate|avg_pay_rate_day','unit':'%'}],
            [{'label':'AVG：','name':'平均每周付费率','key':'axis_pay_rate|avg_pay_rate_week','unit':'%'}],
            [{'label':'AVG：','name':'平均每月付费率','key':'axis_pay_rate|avg_pay_rate_month','unit':'%'}]
        ],
        [
            [{'label':'AVG：','name':'日均ARPU','key':'axis_arpu|avg_arpu_day','unit':'元'}],
            [{'label':'AVG：','name':'月均ARPU','key':'axis_arpu|avg_arpu_month','unit':'元'}],
            [{'label':'AVG：','name':'日均ARPPU','key':'axis_arpu|avg_arppu_day','unit':'元'}],
            [{'label':'AVG：','name':'月均ARPPU','key':'axis_arpu|avg_arppu_month','unit':'元'}]
        ]
    ],
    _port:[
        [
            [{'name':'日付费率','key':'axis_pay_rate|y_axis_pay_rate_day'}],
            [{'name':'周付费率','key':'axis_pay_rate|y_axis_pay_rate_week'}],
            [{'name':'月付费率','key':'axis_pay_rate|y_axis_pay_rate_month'}]
        ],
        [
            [{'name':'日ARPU','key':'axis_arpu|y_axis_arpu_day'}],
            [{'name':'月ARPU','key':'axis_arpu|y_axis_arpu_month'}],
            [{'name':'日ARPPU','key':'axis_arpu|y_axis_arppu_day'}],
            [{'name':'月ARPPU','key':'axis_arpu|y_axis_arppu_month'}]
        ],
        [
            [{'name':'日均付费率','key':'axis_area|china'}],
            [{'name':'日均ARPU','key':'axis_area|china'}],
            [{'name':'日均ARPPU','key':'axis_area|china'}]
        ],
        [
            [{'name':'日均付费率','key':'axis_area|global'}],
            [{'name':'日均ARPU','key':'axis_area|global'}],
            [{'name':'日均ARPPU','key':'axis_area|global'}]
        ],
        [
            [{'name':'日均付费率','key':'axis_channel|y_channe_axis_pay_rate'}],
            [{'name':'日均ARPU','key':'axis_channel|y_channe_axis_arpu'}],
            [{'name':'日均ARPPU','key':'axis_channel|y_channe_axis_arppu'}]
        ]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'),F_PayOsmosis_Info._init);

        M_Inside._downloadCsv();
        F_PayOsmosis_Info._getInfo();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_PayOsmosis_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationPayRateData'],'get',true,postData,function(){
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
                for(var i=0;i<F_PayOsmosis_Info._init.length;i++){
                    if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                    for(var d=0;d<F_PayOsmosis_Info._init[i].tab.length;d++){
                        if(M_Init._dataCache['position_'+i] == d) {
                            F_PayOsmosis_Info._chartHtml(i, d);
                            M_Inside._chartTableIcon(F_PayOsmosis_Info._init[i].type, i, d);
                            break;
                        }
                    }
                    M_Inside._tabChangePerChart(i,F_PayOsmosis_Info._init[i].type,'payosmosis');
                }
            }
        },function(data,msg,code){
            for(var i=0;i<domChart.length;i++){
                $('#'+domChart[i]).html(B_Pre._empty(msg));
            }
        })
    },
    _chartHtml:function (domBig,domSmall,type) {
        M_Init._dataCache['position_'+domBig] = domSmall;
        var data = M_Init._dataCache['data'];
        var chartDataPre = {x_axis:[],y_axis:[],yFormat:''};
        var tableData = {};
        var chartType = 50;
        var tableUnit = '';
        switch(domBig+''){
            case '0':
                chartDataPre.xFormatDate = true;
                chartDataPre.yFormat = '%';
                chartDataPre.tooltip = {'num':1,'unit':'%'};
                tableUnit = '%';
                break;
            case '1':
                chartDataPre.xFormatDate = true;
                chartDataPre.yFormat = '元';
                chartDataPre.tooltip = {'num':1,'unit':'元'};
                tableUnit = '元';
                break;
            case '2':
            case '3':
            case '4':
                switch(domSmall+''){
                    case '0':
                        chartDataPre.yFormat = '%';
                        chartDataPre.tooltip = {'num':1,'unit':'%'};
                        tableUnit = '%';
                        break;
                    default:
                        chartDataPre.yFormat = '元';
                        chartDataPre.tooltip = {'num':1,'unit':'元'};
                        tableUnit = '元';
                        break;
                }
                break;
        }
        switch(domBig+''){
            case '0':
                tableData = {'head':['日期'],'body':[]};
                break;
            case '1':
                tableData = {'head':['日期'],'body':[]};
                break;
            case '2':
            case '3':
                tableData = {'head':['地区'],'body':[]};
                break;
            case '4':
                tableData = {'head':['渠道'],'body':[]};
                break;

        }
        for(var i=0;i<F_PayOsmosis_Info._port[domBig][domSmall].length;i++){
            var dataKey = F_PayOsmosis_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_PayOsmosis_Info._port[domBig][domSmall][i].name;
            switch(domBig+''){
                case '0':
                    chartType = 50;
                    tableData.head.push(dataName);
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        switch(domSmall+''){
                            case '0':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_pay_rate_day;
                                break;
                            case '1':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_pay_rate_week;
                                break;
                            case '2':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_pay_rate_month;
                                break;
                        }
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]+tableUnit);
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;

                case '1':
                    chartType = 50;
                    tableData.head.push(dataName+'('+tableUnit+')');
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        switch(domSmall+''){
                            case '0':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_arpu_day;
                                break;
                            case '1':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_arpu_month;
                                break;
                            case '2':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_arppu_day;
                                break;
                            case '3':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_arppu_month;
                                break;
                        }
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '2':
                case '3':
                    chartType = 20;
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        switch (domSmall+''){
                            case '0':
                                //tableData.head.push('玩家人数(人)');
                                tableData.head.push(dataName);
                                break;
                            default:
                                tableData.head.push(dataName+'('+tableUnit+')');
                                break;
                        }
                        var y_axis = [];
                        for(var d=0;d<dataUnion.length;d++){
                            chartDataPre.x_axis.push(dataUnion[d].area_classify);
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            switch(domSmall+''){
                                case '0':
                                    y_axis.push(dataUnion[d].user_rate);
                                    //tableData.body[d].push(dataUnion[d].user_num);
                                    tableData.body[d].push(dataUnion[d].user_rate+'%');
                                    break;
                                case '1':
                                    y_axis.push(dataUnion[d].arpu);
                                    tableData.body[d].push(dataUnion[d].arpu);
                                    break;
                                case '2':
                                    y_axis.push(dataUnion[d].arppu);
                                    tableData.body[d].push(dataUnion[d].arppu);
                                    break;
                            }
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':y_axis});
                    }
                    break;
                case '4':
                    chartType = 20;
                    if(tableUnit == '%'){
                        tableData.head.push(dataName);
                    }else{
                        tableData.head.push(dataName+'('+tableUnit+')');
                    }
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_channe_axis;
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            if(tableUnit == '%'){
                                tableData.body[d].push(dataUnion[d]+'%');
                            }else{
                                tableData.body[d].push(dataUnion[d]);
                            }
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
            }
        }

        if(F_PayOsmosis_Info._avg[domBig] && F_PayOsmosis_Info._avg[domBig][domSmall]){
            var avgData = '';
            var avgConfig = F_PayOsmosis_Info._avg[domBig][domSmall];
            for(var a=0;a<avgConfig.length;a++){
                if(avgConfig[a].label)avgData += '<span>'+avgConfig[a].label+'</span>';
                avgData += '<span>' + avgConfig[a].name + '<b>';
                dataKey = avgConfig[a].key.split('|');
                if (data[dataKey[0]] && data[dataKey[0]][dataKey[1]]) {
                    avgData += data[dataKey[0]][dataKey[1]];
                }
                avgData += avgConfig[a].unit + '</b></span>';
            }

            M_Inside._avgHtml(domBig+'_0',avgData);
        }
        tableData.name = M_Inside._tableName(F_PayOsmosis_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(chartType,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}