var F_Lost_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationLostUser'] = 'demoInnerOperationLostUser';
                    break;
                default:
                    M_Init._api['innerOperationLostUser'] = 'innerOperationLostUser';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('lost','','1-2-5');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;
                    F_Lost_Info._getInfo();
                }
            });
        }
    }
}
var F_Lost_Info = {
    _init:[
        {'type':'togetherTabAvg','name':'流失玩家分析','tab':['7日未登录人数','14日未登录人数','30日未登录人数'],'tips':[{},{'position':'second','content':['7日未登录的人数：到当日为止，恰为连续7天（含当日）未登录的玩家人数<br>7日未登录的已付费人数：到当日为止，恰为连续7天（含当日）未登录且有付费历史的玩家人数<br>7日未登录的未付费人数：到当日为止，恰为连续7天（含当日）未登录且没有付费历史的玩家人数','14日未登录的人数：到当日为止，恰为连续14天（含当日）未登录的玩家人数<br>14日未登录的已付费人数：到当日为止，恰为连续14天（含当日）未登录且有付费历史的玩家人数<br>14日未登录的未付费人数：到当日为止，恰为连续14天（含当日）未登录且没有付费历史的玩家人数','30日未登录的人数：到当日为止，恰为连续30天（含当日）未登录的玩家人数<br>30日未登录的已付费人数：到当日为止，恰为连续30天（含当日）未登录且有付费历史的玩家人数<br>30日未登录的未付费人数：到当日为止，恰为连续30天（含当日）未登录且没有付费历史的玩家人数']}]},
        {'type':'switchTab','name':'游戏天数分布','tab':['流失玩家','潜在流失玩家'],'tips':[{},{'position':'second','content':['到当日为止，恰为连续7天（含当日）未登录的玩家在流失前已玩游戏的天数','之前7日（含当日）有登录记录，且之后7日（不含当日）不再登录的概率大于50%的玩家目前的已玩游戏天数']}]},
        {'type':'switchTab','name':'等级分布','tab':['流失玩家','潜在流失玩家'],'tips':[{},{'position':'second','content':['到当日为止，恰为连续7天（含当日）未登录的玩家流失前的等级分布','之前7日（含当日）有登录记录，且之后7日（不含当日）不再登录的概率大于50%的玩家目前的等级分布']}]},
        {'type':'switchTab','name':'付费情况','tab':['流失玩家','潜在流失玩家'],'tips':[{},{'position':'second','content':['到当日为止，恰为连续7天（含当日）未登录的玩家流失前的付费情况','之前7日（含当日）有登录记录，且之后7日（不含当日）不再登录的概率大于50%的玩家目前的付费情况']}]},
        {'type':'regionTab','name':'地区分布','tab':['中国地区','全球地区'],'tips':[{'position':'first','content':'到当日为止，恰为连续7天（含当日）未登录的玩家的地区分布'}]}
    ],
    _avg: [
        [
            [{'label':'AVG：','name': '平均每日7日未登录玩家人数', 'key': 'avg|7d','unit':'' }],
            [{'label':'AVG：', 'name': '平均每日14日未登录玩家人数', 'key': 'avg|14d','unit':'' }],
            [{'label':'AVG：','name': '平均每日30日未登录玩家人数', 'key': 'avg|30d','unit':'' }]
        ]
    ],
    _port:[
        [[{'name':'7日未登录的已付费人数','key':'y_axis|7d|paid'},{'name':'7日未登录的未付费人数','key':'y_axis|7d|unpaid'},{'name':'7日未登录的人数','key':'y_axis|7d|total'}],[{'name':'14日未登录的已付费人数','key':'y_axis|14d|paid'},{'name':'14日未登录的未付费人数','key':'y_axis|14d|unpaid'},{'name':'14日未登录的人数','key':'y_axis|14d|total'}],[{'name':'30日未登录的已付费人数','key':'y_axis|30d|paid'},{'name':'30日未登录的未付费人数','key':'y_axis|30d|unpaid'},{'name':'30日未登录的人数','key':'y_axis|30d|total'}]],
        [[{'name':'流失玩家','key':'lost_user_oldays|lost'}],[{'name':'潜在流失玩家','key':'lost_user_oldays|potential_lost'}]],
        [[{'name':'流失玩家','key':'lost_user_level|lost'}],[{'name':'潜在流失玩家','key':'lost_user_level|potential_lost'}]],
        [[{'name':'流失玩家','key':'lost_user_pay|lost'}],[{'name':'潜在流失玩家','key':'lost_user_pay|potential_lost'}]],
        [[{'name':'国内地区分布','key':'lost_user_area|china'}],[{'name':'国际地区分布','key':'lost_user_area|global'}]]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'),F_Lost_Info._init);

        M_Inside._downloadCsv();
        F_Lost_Info._getInfo();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_Lost_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationLostUser'],'get',true,postData,function(){
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
                for(var i=0;i<F_Lost_Info._init.length;i++){
                    if(F_Lost_Info._init[i].tab.length > 0){

                        if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
                        for(var d=0;d<F_Lost_Info._init[i].tab.length;d++){
                            if(M_Init._dataCache['position_'+i] == d) {
                                F_Lost_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_Lost_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i,F_Lost_Info._init[i].type,'lost');
                    }else{
                        F_Lost_Info._chartHtml(i,0);
                        M_Inside._chartTableIcon(F_Lost_Info._init[i].type,i,0);
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
                chartDataPre.xFormatDate = true;
                chartDataPre.yFormat = '';
                chartDataPre.tooltip = {'num':3,'unit':'人'};
                tableUnit = '人';
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                chartDataPre.tooltip = {'num':1,'unit':'人'};
                break;
        }

        switch(domBig+''){
            case '1':
                tableData = {'head':['已玩天数',F_Lost_Info._port[domBig][domSmall][0].name+'(人)','玩家占比'],'body':[]};
                break;
            case '2':
                tableData = {'head':['玩家等级分布',F_Lost_Info._port[domBig][domSmall][0].name+'(人)','玩家占比'],'body':[]};
                break;
            case '3':
                tableData = {'head':['付费情况',F_Lost_Info._port[domBig][domSmall][0].name+'(人)','玩家占比'],'body':[]};
                break;
            case '4':
                tableData = {'head':['地区',F_Lost_Info._port[domBig][domSmall][0].name+'(人)','玩家占比'],'body':[]};
                break;
            default:
                tableData = {'head':['日期'],'body':[]};
                break;
        }
        for(var i=0;i<F_Lost_Info._port[domBig][domSmall].length;i++){
            var dataKey = F_Lost_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_Lost_Info._port[domBig][domSmall][i].name;
            if((domBig == 1) ){
                chartType = 20;
                if(data[dataKey[0]][dataKey[1]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]];
                    var y_axis = [];
                    for(var d=0;d<dataUnion.length;d++){
                        dataUnion[d].oldays_classify = dataUnion[d].oldays_classify.replace('&gt;',">");
                        dataUnion[d].oldays_classify = dataUnion[d].oldays_classify.replace('&lt;',"<");
                        chartDataPre.x_axis.push(dataUnion[d].oldays_classify);
                        y_axis.push(dataUnion[d].user_num);
                        if(!tableData.body[d])tableData.body[d] = [dataUnion[d].oldays_classify];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate+'%');
                    }
                    chartDataPre.y_axis.push({'name':dataName,'data':y_axis});
                }
            }else if(domBig == 2){
                chartType = 40;
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
            }else if(domBig == 3){
                chartType = 20;
                if(data[dataKey[0]][dataKey[1]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]];
                    var y_axis = [];
                    for(var d=0;d<dataUnion.length;d++){
                        dataUnion[d].pay_amount_classify = dataUnion[d].pay_amount_classify.replace('&gt;',">");
                        dataUnion[d].pay_amount_classify = dataUnion[d].pay_amount_classify.replace('&lt;',"<");
                        chartDataPre.x_axis.push(dataUnion[d].pay_amount_classify);
                        y_axis.push(dataUnion[d].user_num);
                        if(!tableData.body[d])tableData.body[d] = [dataUnion[d].pay_amount_classify];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate+'%');
                    }
                    chartDataPre.y_axis.push({'name':dataName,'data':y_axis});
                }

            }else if(domBig == 4){
                chartType = 20;
                if(data[dataKey[0]][dataKey[1]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]];
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
                if(tableUnit != '%'){
                    tableData.head.push(dataName+'('+tableUnit+')');
                }else{
                    tableData.head.push(dataName);
                }

                if(data[dataKey[0]] && data[dataKey[0]][dataKey[1]] && data[dataKey[0]][dataKey[1]][dataKey[2]]){
                    var dataUnion = data[dataKey[0]][dataKey[1]][dataKey[2]];
                    for(var d=0;d<dataUnion.length;d++){
                        if(!tableData.body[d])tableData.body[d] = [data.x_axis[d]];
                        if(tableUnit != '%') {
                            tableData.body[d].push(dataUnion[d]);
                        }else{
                            tableData.body[d].push(dataUnion[d]+tableUnit);
                        }
                    }
                    chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                }
            }
        }
        if (F_Lost_Info._avg[domBig] && F_Lost_Info._avg[domBig][domSmall]) {
            var avgData = '';
            var avgConfig = F_Lost_Info._avg[domBig][domSmall];
            for(var a=0;a<avgConfig.length;a++){
                if(avgConfig[a].label)avgData += '<span>'+avgConfig[a].label+'</span>';
                avgData += '<span>' + avgConfig[a].name + '<b>';
                dataKey = avgConfig[a].key.split('|');
                if (data[dataKey[0]] && data[dataKey[0]][dataKey[1]]) {
                    avgData += data[dataKey[0]][dataKey[1]];
                }
                avgData += avgConfig[a].unit + '</b></span>';
            }

            M_Inside._avgHtml(domBig + '_0', avgData);
        }

        tableData.name = M_Inside._tableName(F_Lost_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(chartType,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}