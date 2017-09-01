var F_PayHabit_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationPayHabit'] = 'demoInnerOperationPayHabit';
                    break;
                default:
                    M_Init._api['innerOperationPayHabit'] = 'innerOperationPayHabit';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('payhabit','','1-4-4');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_PayHabit_Info._getInfo();
                }
            });
        }
    }
}
var F_PayHabit_Info = {
    _init:[
        {'type':'togetherTab','name':'付费频次与额度','tab':['周付费次数','月付费次数','周付费金额','月付费金额'],'tips':[{},{'position':'second','content':['所选时期内有付费的玩家，在每个自然周内的付费次数分布','所选时期内有付费的玩家，在每个自然月内的付费次数分布 ','所选时期内有付费的玩家，在每个自然周内的付费金额分布','所选时期内有付费的玩家，在每个自然月内的付费金额分布']}]},
        {'type':'together','name':'首付时间分布','tab':[],'tips':[{'position':'first','content':['所选时期内，玩家从注册游戏到首次充值的时间间隔的分布']}]},
        {'type':'switchTab','name':'付费方式分布','tab':['付费金额','付费人次'],'tips':[{},{'position':'second','content':['所选时期内，玩家付费时采用的支付手段按付费金额分布','所选时期内，玩家付费时采用的支付手段按付费次数分布']}]},
        {'type':'switchTab','name':'充值包类型分布','tab':['付费金额','付费人次'],'tips':[{},{'position':'second','content':['所选时期内，玩家付费的充值包按累计金额分布','所选时期内，玩家付费的充值包按累计人次分布']}]}
    ],
    _port:[
        [
            [{'name':'付费人数','key':'axis_pay|y_axis_paytimes_week'}],
            [{'name':'付费人数','key':'axis_pay|y_axis_paytimes_month'}],
            [{'name':'付费人数','key':'axis_pay|y_axis_payamount_week'}],
            [{'name':'付费人数','key':'axis_pay|y_axis_payamount_month'}]
        ],
        [
            [{'name':'付费人数','key':'axis_time_elapse|y_axis_time_elapse'}]
        ],
        [
            [{'name':'付费金额','key':'axis_pay_method|y_axis_pay_amount'}],
            [{'name':'付费人次','key':'axis_pay_method|y_axis_pay_times'}]
        ],
        [
            [{'name':'付费金额','key':'axis_pay_item|y_axis_pay_item_amount'}],
            [{'name':'付费人次','key':'axis_pay_item|y_axis_pay_item_times'}]
        ]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'),F_PayHabit_Info._init);

        M_Inside._downloadCsv();
        F_PayHabit_Info._getInfo();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_PayHabit_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationPayHabit'],'get',true,postData,function(){
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
                for(var i=0;i<F_PayHabit_Info._init.length;i++){
                    if(F_PayHabit_Info._init[i].tab.length > 0){
                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d<F_PayHabit_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                F_PayHabit_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_PayHabit_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i,F_PayHabit_Info._init[i].type,'payhabit');
                    }else{
                        F_PayHabit_Info._chartHtml(i,'0');
                        M_Inside._chartTableIcon(F_PayHabit_Info._init[i].type,i,'0');
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
                chartDataPre.tooltip = {'num':1,'unit':'人'};
                switch(domSmall+''){
                    case '0':
                        tableData = {'head':['周付费次数'],'body':[]};
                        break;
                    case '1':
                        tableData = {'head':['月付费次数'],'body':[]};
                        break;
                    case '2':
                        tableData = {'head':['周付费金额'],'body':[]};
                        break;
                    case '3':
                        tableData = {'head':['月付费金额'],'body':[]};
                        break;
                }
                break;
            case '1':
                chartDataPre.tooltip = {'num':1,'unit':'人'};
                tableData = {'head':['首付游戏时间分布'],'body':[]};
                break;
            case '2':
            case '3':
                switch(domSmall+''){
                    case '0':
                        chartDataPre.yFormat = '元';
                        chartDataPre.tooltip = {'num':1,'unit':'元'};
                        tableUnit = '元';
                        tableData = {'head':['付费方式'],'body':[]};
                        break;
                    default:
                        chartDataPre.tooltip = {'num':1,'unit':'人次'};
                        tableUnit = '人次';

                        tableData = {'head':['付费方式'],'body':[]};
                        break;
                }
                break;
        }

        for(var i=0;i<F_PayHabit_Info._port[domBig][domSmall].length;i++){
            var dataKey = F_PayHabit_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_PayHabit_Info._port[domBig][domSmall][i].name;
            switch(domBig+''){
                case '0':
                    chartType = 20;
                    tableData.head.push(dataName);
                    tableData.head.push('百分比');
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        switch(domSmall+''){
                            case '0':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_paytimes_week;
                                break;
                            case '1':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_paytimes_month;
                                break;
                            case '2':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_payamount_week;
                                break;
                            case '3':
                                chartDataPre.x_axis = data[dataKey[0]].x_axis_payamount_month;
                                break;
                        }
                        var xAxis = [];
                        for(var d=0;d<dataUnion.length;d++){
                            var xValue = chartDataPre.x_axis[d];
                            xValue = xValue.replace('&gt;',">");
                            xValue = xValue.replace('&lt;',"<");
                            switch(domSmall+'') {
                                case '2':
                                case '3':
                                    xValue += '元';
                                    break;
                            }
                            xAxis.push(xValue);
                            if(!tableData.body[d])tableData.body[d] = [xValue];

                            tableData.body[d].push(dataUnion[d]);
                            tableData.body[d].push(data[dataKey[0]][dataKey[1]+'_percentage'][d]+'%');
                        }
                        chartDataPre.x_axis = xAxis;
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '1':
                    chartType = 20;
                    tableData.head.push(dataName);
                    tableData.head.push('百分比');
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis_time_elapse;
                        for(var d=0;d<dataUnion.length;d++){

                            chartDataPre.x_axis[d] = chartDataPre.x_axis[d].replace('&gt;',">");
                            chartDataPre.x_axis[d] = chartDataPre.x_axis[d].replace('&lt;',"<");

                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                            tableData.body[d].push(data[dataKey[0]][dataKey[1]+'_percentage'][d]+'%');
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '2':
                    chartType = 20;
                    tableData.head.push(dataName+'('+tableUnit+')');
                    tableData.head.push('百分比');
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis_pay_method;
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                            tableData.body[d].push(data[dataKey[0]][dataKey[1]+'_percentage'][d]+'%');
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '3':
                    chartType = 20;
                    tableData.head.push(dataName+'('+tableUnit+')');
                    tableData.head.push('百分比');
                    if(data[dataKey[0]][dataKey[1]]){
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis_pay_item;
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                            tableData.body[d].push(data[dataKey[0]][dataKey[1]+'_percentage'][d]+'%');
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
            }

        }

        tableData.name = M_Inside._tableName(F_PayHabit_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(chartType,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}