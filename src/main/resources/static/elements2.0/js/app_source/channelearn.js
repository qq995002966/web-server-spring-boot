var  F_ChannelEarn_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationChannelPay'] = 'demoInnerOperationChannelPay';
                    break;
                default:
                    M_Init._api['innerOperationChannelPay'] = 'innerOperationChannelPay';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('channelearn','','1-6-2');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                     F_ChannelEarn_Info._getInfo();
                }
            });

        }
    }
}
var  F_ChannelEarn_Info = {
    _init:[
            {
                'type':'table',
                'name':'收入指标',
                'tab':[],
                'tips':[
                    {
                    'position':'first',
                    'content':'收入：所选时期内该渠道的收入总金额<br>累加付费次数：所选时期内该渠道的每日累加付费次数（不去重）<br>日均付费人数：所选时期内该渠道的每日付费人数均值<br>日均付费率：所选时期内该渠道的每日付费率均值<br>日均ARPU：所选时期内该渠道当天每活跃玩家的人均收入<br>日均ARPPU：所选时期内该渠道当天每付费玩家的人均收入'
                     }
                ]
            },
            {'type':'togetherTab','name':'渠道收入比对','tab':['日收入','日付费次数','日付费人数','日付费率','日ARPU','日ARPPU'],'tips':[{},{'position':'second','content':['所选渠道当天的收入总金额','所选渠道当天的付费总次数','所选渠道当天的付费总人数','所选渠道当天的付费人数占其当天活跃玩家的比例','所选渠道当天每活跃玩家的人均收入','所选渠道当天每付费玩家的人均收入']}]}
        ],
    _port:[
        [
            [{'name':'收入指标','key':'channel_table'}]
        ],
        [
            [{'name':'日收入（元）','key':'channel_compare|y_axis_pay_amount'}],
            [{'name':'日付费次数（次）','key':'channel_compare|y_axis_pay_times'}],
            [{'name':'日付费人数','key':'channel_compare|y_axis_pay_num'}],
            [{'name':'日付费率','key':'channel_compare|y_axis_pay_rate'}],
            [{'name':'日ARPU（元）','key':'channel_compare|y_axis_arpu'}],
            [{'name':'日ARPPU（元）','key':'channel_compare|y_axis_arppu'}]
        ]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'), F_ChannelEarn_Info._init);
        F_ChannelEarn_Info._getInfo();

        M_Inside._downloadCsv();
    },

    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i< F_ChannelEarn_Info._init.length;i++){
            switch(F_ChannelEarn_Info._init['type']){
                case 'table':
                    domChart.push('bs_table_'+i+'_0');
                    break;
                default:
                    domChart.push('bs_chart_'+i+'_0');
                    break;
            }
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationChannelPay'],'get',true,postData,function(){
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
                for(var i=0;i<F_ChannelEarn_Info._init.length;i++){
                    if(F_ChannelEarn_Info._init[i].tab.length > 0){
                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d<F_ChannelEarn_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                F_ChannelEarn_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_ChannelEarn_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i,F_ChannelEarn_Info._init[i].type,'channelearn');
                    }else{
                        F_ChannelEarn_Info._chartHtml(i,'0');
                        M_Inside._chartTableIcon(F_ChannelEarn_Info._init[i].type,i,'0');
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
        var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:false,yFormat:'',legendSelectMode:false};
        var tableUnit = '';
        var tableData = {'head':[],'body':[]};
        var chartType = 50;
        switch(domBig+''){
            case '0':
                tableData = {'head':['渠道名称','总收入(元)','累加付费次数（次）','日均付费人数','日均付费率','日均ARPU(元)','日均ARPPU(元)'],'body':[]};
                break;
            case '1':
                chartDataPre.xFormatDate = true;
                switch(domSmall+''){
                    case'0':
                    case'4':
                    case'5':
                        chartDataPre.yFormat = '元';
                        chartDataPre.tooltip = {'num':1,'unit':'元'};
                        tableUnit = '元';
                        break;
                    case'1':
                        chartDataPre.yFormat = '次';
                        chartDataPre.tooltip = {'num':1,'unit':'次'};
                        tableUnit = '次';
                        break;
                    case'2':
                        chartDataPre.yFormat = '';
                        chartDataPre.tooltip = {'num':1,'unit':''};
                        tableUnit = '';
                        break;
                    case'3':
                        chartDataPre.yFormat = '%';
                        chartDataPre.tooltip = {'num':3,'unit':'%'};
                        tableUnit = '%';
                        break;
                }
                tableData = {'head':['日期'],'body':[]};
                break;
        }
        for(var i=0;i< F_ChannelEarn_Info._port[domBig][domSmall].length;i++){
            var dataKey =  F_ChannelEarn_Info._port[domBig][domSmall][i].key.split('|');
            var dataName =  F_ChannelEarn_Info._port[domBig][domSmall][i].name;
            switch(domBig+''){
                case '0':
                    if (data[dataKey[0]]) {
                        var dataUnion = data[dataKey[0]];
                        for (var d = 0; d < dataUnion.length; d++) {
                            tableData.body[d] = [dataUnion[d].channel_id,dataUnion[d].pay_amount,dataUnion[d].pay_times,dataUnion[d].pay_num,dataUnion[d].pay_rate+'%',dataUnion[d].arpu,dataUnion[d].arppu];
                        }
                    }
                    break;
                default:
                    chartDataPre.legendSelectMode = true;
                    if (data[dataKey[0]][dataKey[1]]) {
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis;
                        var i = 0;
                        $.each(dataUnion,function (channelName,channelValue) {
                            tableData.head.push(channelName+dataName);
                            for(var d = 0; d < channelValue.length; d++) {
                                if (!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                                if (tableUnit != '%') {
                                    tableData.body[d].push(channelValue[d]);
                                } else {
                                    tableData.body[d].push(channelValue[d] + tableUnit);
                                }
                            }
                            chartDataPre.y_axis.push({'name': channelName, 'data': channelValue});
                            i++;
                        });

                        chartDataPre.tooltip.num = i;
                    }
                    break;
            }
        }

        tableData.name = M_Inside._tableName(F_ChannelEarn_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        if((domBig == 1) ) {
            M_Inside_Chart._chartData(chartType, 'bs_chart_' + domBig + '_' + domSmall, chartDataPre);
        }
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}