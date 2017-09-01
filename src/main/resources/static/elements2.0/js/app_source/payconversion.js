var F_PayConversion_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationFirstPay'] = 'demoInnerOperationFirstPay';
                    break;
                default:
                    M_Init._api['innerOperationFirstPay'] = 'innerOperationFirstPay';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('payconversion','','1-4-3');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_PayConversion_Info._getInfo();
                }
            });
        }
    }
}
var F_PayConversion_Info = {
    _init:[
        {'type':'togetherTab','name':'新增付费分析','tab':['首日付费率','首周付费率','首月付费率'],'tips':[{},{'position':'second','content':['首日付费率：在新增当日就进行付费的玩家占当日新增玩家比例','首周付费率：在新增7日内（含当日）进行付费的玩家占当日新增玩家比例','首月付费率：在新增30日内（含当日）进行付费的玩家占当日新增玩家比例']}]},
        {'type':'switchTab','name':'玩家首付周期','tab':['已玩天数','累计游戏时长'],'tips':[{},{'position':'second','content':['所选时期内的新增付费玩家，按照其已玩天数（首付日期-新增日期）进行分布','所选时期内的新增付费玩家，按照其累计进行游戏的时长进行分布']}]},
        {'type':'switchTab','name':'玩家首付等级','tab':[],'tips':[{'position':'first','content':['所选时期内的新增付费玩家，第一次付费时的等级分布']}]},
        {'type':'switchTab','name':'玩家首付金额','tab':[],'tips':[{'position':'first','content':['所选时期内的新增付费玩家，第一次付费时的金额分布']}]},
        {'type':'switchTab','name':'玩家首付充值包类型','tab':[],'tips':[{'position':'first','content':['所选时期内的新增付费玩家，第一次付费时的充值包类型分布']}]}
    ],
    _port:[
        [
            [{'name':'首日付费率','key':'axis_first_pay_rate|y_axis_first_pay_rate_day'}],
            [{'name':'首周付费率','key':'axis_first_pay_rate|y_axis_first_pay_rate_week'}],
            [{'name':'首月付费率','key':'axis_first_pay_rate|y_axis_first_pay_rate_month'}]
        ],
        [
            [{'name':'付费人数','key':'axis_first_pay_total_oltime|y_axis_first_pay_oldays'}],
            [{'name':'付费人数','key':'axis_first_pay_total_oltime|y_axis_first_pay_total_oltime'}]
        ],
        [
            [{'name':'付费人数','key':'axis_first_pay_level|y_axis_first_pay_level'}]
        ],
        [
            [{'name':'付费人数','key':'axis_first_pay_amount|y_axis_first_pay_amount'}]
        ],
        [
            [{'name':'付费人数','key':'axis_first_pay_item|y_axis_first_pay_item'}]
        ]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'),F_PayConversion_Info._init);

        M_Inside._downloadCsv();
        F_PayConversion_Info._getInfo();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_PayConversion_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationFirstPay'],'get',true,postData,function(){
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
                for(var i=0;i<F_PayConversion_Info._init.length;i++){
                    if(F_PayConversion_Info._init[i].tab.length > 0){
                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d<F_PayConversion_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                F_PayConversion_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_PayConversion_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i,F_PayConversion_Info._init[i].type,'payconversion');
                    }else{
                        F_PayConversion_Info._chartHtml(i,'0');
                        M_Inside._chartTableIcon(F_PayConversion_Info._init[i].type,i,'0');
                    }
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
            case '2':
            case '3':
            case '4':
                chartDataPre.tooltip = {'num':1,'unit':'人'};
                tableUnit = '';
                break;
        }
        switch(domBig+''){
            case '0':
                tableData = {'head':['日期'],'body':[]};
                break;
            case '1':
                switch(domSmall+''){
                    case '0':
                        tableData = {'head':['已玩游戏天数'],'body':[]};
                        break;
                    case '1':
                        tableData = {'head':['累计游戏时长'],'body':[]};
                        break;
                }
                break;
            case '2':
                tableData = {'head':['首付等级'],'body':[]};
                break;
            case '3':
                tableData = {'head':['首付金额'],'body':[]};
                break;
            case '4':
                tableData = {'head':['首付充值包类型'],'body':[]};
                break;

        }
        for(var i=0;i<F_PayConversion_Info._port[domBig][domSmall].length;i++){
            var dataKey = F_PayConversion_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_PayConversion_Info._port[domBig][domSmall][i].name;
            switch(domBig+''){
                case '0':
                    chartType = 50;
                    tableData.head.push(dataName);
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis_first_pay_rate;
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]+tableUnit);
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '1':
                    chartType = 20;
                    tableData.head.push(dataName);
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        switch(domSmall+''){
                            case '0':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_first_pay_oldays;
                                break;
                            case '1':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_first_pay_total_oltime;
                                break;
                        }
                        for(var d=0;d<dataUnion.length;d++){

                            chartDataPre.x_axis[d] = chartDataPre.x_axis[d].replace('&gt;',">");
                            chartDataPre.x_axis[d] = chartDataPre.x_axis[d].replace('&lt;',"<");

                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '2':
                    chartType = 40;
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        tableData.head.push(dataName);
                        chartDataPre.x_axis = data[dataKey[0]].x_axis_first_pay_level;
                        for(var d=0;d<dataUnion.length;d++){
                            chartDataPre.x_axis[d] = chartDataPre.x_axis[d]+'级';
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '3':
                    chartType = 20;
                    tableData.head.push(dataName);
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis_first_pay_amount;
                        for(var d=0;d<dataUnion.length;d++){
                            chartDataPre.x_axis[d] = chartDataPre.x_axis[d].replace('&gt;',">");
                            chartDataPre.x_axis[d] = chartDataPre.x_axis[d].replace('&lt;',"<");
                            chartDataPre.x_axis[d] += '元';
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '4':
                    chartType = 20;
                    tableData.head.push(dataName);
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis_first_pay_item;
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
            }
        }

        tableData.name = M_Inside._tableName(F_PayConversion_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(chartType,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}