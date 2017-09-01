var  F_ChannelQuality_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerChannelQuality'] = 'demoInnerChannelQuality';
                    break;
                default:
                    M_Init._api['innerChannelQuality'] = 'innerChannelQuality';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('channelquality','','1-6-1');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                     F_ChannelQuality_Info._getInfo();
                }
            });

        }
    }
}
var  F_ChannelQuality_Info = {
    _init:[
            {
                'type':'table',
                'name':'质量指标',
                'tab':[],
                'tips':[
                    {
                    'position':'first',
                    'content':'新增玩家数：所选时期内该渠道的新增玩家总数<br>渠道比重：所选时期内该渠道的新增玩家数占全部渠道新增玩家数的比例<br>次日留存率均值：所选时期内该渠道的新增玩家次日留存率均值<br>7日留存率均值：所选时期内该渠道的新增玩家在新增第7日留存率均值<br>30日留存率均值：所选时期内该渠道的新增玩家在新增第30日留存率均值<br>平均日活数：所选时期内该渠道的每日活跃玩家均数<br>首周付费比例：所选时期内该渠道的新增用户中首周就进行付费的玩家占该期间内全部新增玩家的比例'
                     }
                ]
            },
        {'type':'togetherTab','name':'渠道留存比对','tab':['日新增玩家数','次日留存率','7日留存率','30日留存率','日活跃数'],'tips':[{},{'position':'second','content':['所选渠道当天的新增玩家数','次日留存率：所选渠道在当天的次日留存比例','7日留存率：所选渠道在当天的7日留存比例','30日留存率：所选渠道在当天的30日留存比例','所选渠道当天的活跃玩家数']}]}
        ],
    _port:[
        [
            [{'name':'质量指标','key':'channel_table'}]
        ],
        [
            [{'name':'日新增玩家数','key':'channel_compare|y_axis_newlogin'}],
            [{'name':'次日留存率','key':'channel_compare|y_axis_retention_rate_1d'}],
            [{'name':'7日留存率','key':'channel_compare|y_axis_retention_rate_7d'}],
            [{'name':'30日留存率','key':'channel_compare|y_axis_retention_rate_30d'}],
            [{'name':'日活跃数','key':'channel_compare|y_axis_login'}]
        ]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'), F_ChannelQuality_Info._init);
        F_ChannelQuality_Info._getInfo();
        M_Inside._downloadCsv();
    },

    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i< F_ChannelQuality_Info._init.length;i++){
            switch(F_ChannelQuality_Info._init['type']){
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
        B_Port._ajax(M_Init._api['innerChannelQuality'],'get',true,postData,function(){
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
                for(var i=0;i< F_ChannelQuality_Info._init.length;i++){
                    if( F_ChannelQuality_Info._init[i].tab.length > 0){
                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d< F_ChannelQuality_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                 F_ChannelQuality_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon( F_ChannelQuality_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i, F_ChannelQuality_Info._init[i].type,'channelquality');
                    }else{
                         F_ChannelQuality_Info._chartHtml(i,'0');
                        M_Inside._chartTableIcon( F_ChannelQuality_Info._init[i].type,i,'0');
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
        var tableData = {'head':[],'body':[]};
        var chartType = 50;
        var tableUnit = '';
        switch(domBig+''){
            case '0':
                tableData = {'head':['渠道名称','新增玩家数','渠道比重','次日留存率均值','7日留存率均值','30日留存率均值','平均日活数','首周付费比例'],'body':[]};
                break;
            case'1':
                tableUnit = '';
                tableData = {'head':['日期'],'body':[]};
                chartDataPre.xFormatDate = true;
                switch(domSmall+''){
                    case'0':
                    case'4':
                        chartDataPre.yFormat = '';
                        chartDataPre.tooltip = {'num':1,'unit':''};
                        tableUnit = '人';
                    break;
                    case'1':
                    case'2':
                    case'3':
                        chartDataPre.yFormat = '%';
                        chartDataPre.tooltip = {'num':1,'unit':'%'};
                        tableUnit = '%';
                        break;
                }
                break;
        }
        for(var i=0;i< F_ChannelQuality_Info._port[domBig][domSmall].length;i++){
            var dataKey =  F_ChannelQuality_Info._port[domBig][domSmall][i].key.split('|');
            var dataName =  F_ChannelQuality_Info._port[domBig][domSmall][i].name;
            switch(domBig+''){
                case '0':
                    if(data[dataKey[0]]){
                        var dataUnion = data[dataKey[0]];
                        for(var d=0;d<dataUnion.length;d++){
                            tableData.body[d]=[
                                dataUnion[d].channel_id,
                                dataUnion[d].newlogin_num,
                                dataUnion[d].newlogin_rate+'%',
                                dataUnion[d].retention_rate_1d+'%',
                                dataUnion[d].retention_rate_7d+'%',
                                dataUnion[d].retention_rate_30d+'%',
                                dataUnion[d].login_num,
                                dataUnion[d].first_week_pay_rate+'%'];
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

        tableData.name = M_Inside._tableName(F_ChannelQuality_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        if((domBig == 1) ) {
            M_Inside_Chart._chartData(chartType, 'bs_chart_' + domBig + '_' + domSmall, chartDataPre);
        }
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}