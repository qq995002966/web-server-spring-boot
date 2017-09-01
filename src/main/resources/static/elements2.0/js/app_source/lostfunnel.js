var F_LostFunnel_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerLostFunnel'] = 'demoInnerLostFunnel';
                    break;
                default:
                    M_Init._api['innerLostFunnel'] = 'innerLostFunnel';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Common._getOrderGame('lostfunnel','','1-5-2');
            B_Date._chooseSingle({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.begin,function(begin,end){
                if(begin != M_Init._dateCache.begin){
                    M_Init._dateCache.begin = begin;

                     F_LostFunnel_Info._getInfo();
                }
            });
        }
    }
}
var  F_LostFunnel_Info = {
    _init:[
            {
                'type':'togetherTab',
                'name':'流失漏斗',
                'tab':['新增玩家','活跃玩家','付费玩家'],
                'tips':[
                    {},
                    {
                    'position':'second',
                    'content':['所选日期的新增用户，在之后时间区间内的流失分布情况','所选日期的活跃用户，在之后时间区间内的流失分布情况','所选日期的付费用户，在之后时间区间内的流失分布情况']
                     }
                ]
            }
        ],
    _port:[
        [
            [{'name':'留存玩家数','key':'new|y_user_num'},{'name':'玩家留存占比','key':'new|y_user_rate'}],
            [{'name':'留存玩家数','key':'active|y_user_num'},{'name':'玩家留存占比','key':'active|y_user_rate'}],
            [{'name':'留存玩家数','key':'paid|y_user_num'},{'name':'玩家留存占比','key':'paid|y_user_rate'}]
        ]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'), F_LostFunnel_Info._init);
        M_Inside._downloadCsv();
         F_LostFunnel_Info._getInfo();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var domChart = [];
        for(var i=0;i< F_LostFunnel_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['data_date'] = begin;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerLostFunnel'],'get',true,postData,function(){
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
                for(var i=0;i< F_LostFunnel_Info._init.length;i++){
                    if( F_LostFunnel_Info._init[i].tab.length > 0){
                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d< F_LostFunnel_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                 F_LostFunnel_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon( F_LostFunnel_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i, F_LostFunnel_Info._init[i].type,'lostfunnel');
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
        var tableUnit = '%';
        switch(domBig+''){
            case '0':
                chartDataPre.yDouble = true;
                chartDataPre.yDoubleLabel = ['','%'];
                chartDataPre.tooltip = {'type':'diff','num':2,'unit':['人','%']};
                tableData = {'head':['','玩家数量','玩家留存占比','相对留存率'],'body':[]};
                break;
        }

        var port = F_LostFunnel_Info._port[domBig][domSmall];
        for(var i=0;i< port.length;i++){
            var dataKey = port[i].key.split('|');
            var dataName = port[i].name;
            chartType = 50;
            if(data[dataKey[0]] && data[dataKey[0]][dataKey[1]]){
                var dataUnion = data[dataKey[0]][dataKey[1]];
                chartDataPre.x_axis = data[dataKey[0]].x_axis;
                for(var d=0;d<dataUnion.length;d++){
                    if(!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                    switch (i+''){
                        case '0':
                            tableData.body[d].push(dataUnion[d]);
                            break;
                        case '1':
                            tableData.body[d].push(dataUnion[d]+tableUnit);
                            if(d == 0){
                                tableData.body[d].push('-');
                            }else{
                                tableData.body[d].push(data[dataKey[0]].user_rate_span[d-1]+tableUnit);
                            }
                            break;
                    }
                }
                if(i == 0){
                    chartDataPre.y_axis.push({'type':'bar','name':dataName,'data':dataUnion});
                }else{
                    chartDataPre.y_axis.push({'type':'line','name':dataName,'data':dataUnion});
                }
            }
        }

        tableData.name = M_Inside._tableName(F_LostFunnel_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(chartType,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}