var F_Habit_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationHabitUser'] = 'demoInnerOperationHabitUser';
                    break;
                default:
                    M_Init._api['innerOperationHabitUser'] = 'innerOperationHabitUser';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('habit','','1-2-6');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_Habit_Info._getInfo();
                }
            });
        }
    }
}
var F_Habit_Info = {
    _tab:['活跃玩家','新增玩家','付费玩家','潜在付费玩家','潜在流失玩家'],
    _init:[
        {'type':'togetherTab','name':'平均游戏时长与次数','tab':['每日','每周','每月'],'tips':[{},{'position':'second','content':['当日该类用户的人均游戏次数及时长','当自然周该类用户的人均总游戏次数及时长','当自然月该类用户的人均总游戏次数及时长']}]},
        {'type':'togetherTab','name':'每周游戏频次分布','tab':['周游戏天数','周游戏次数'],'tips':[{},{'position':'second','content':['所选时期内，玩家在一个自然周中活跃天数的分布情况','所选时期内，玩家在一个自然周中活跃次数的分布情况']}]},
        {'type':'togetherTab','name':'游戏时长分布','tab':['周游戏时长','单日游戏时长','单次游戏时长'],'tips':[{},{'position':'second','content':['所选时期内，玩家在一个自然周中活跃总时长的分布情况','所选时期内，玩家在一日中活跃总时长的分布情况','所选时期内，玩家在一日中每次玩游戏的时长分布情况']}]},
        {'type':'together','name':'游戏时段分布','tab':[],'tips':[{'position':'first','content':'所选时期内，全天各小时段中全部玩家的分布情况'}]},
        {'type':'together','name':'活跃机型分布','tab':[],'tips':[{'position':'first','content':'所选时期内，全天各小时段中全部玩家的分布情况'}]}
    ],
    _port:[
        [
            [
                [{'name':'游戏次数','key':'user_habit_day|active|login_times'},{'name':'游戏时长','key':'user_habit_day|active|online_time'}],
                [{'name':'游戏次数','key':'user_habit_day|new|login_times'},{'name':'游戏时长','key':'user_habit_day|new|online_time'}],
                [{'name':'游戏次数','key':'user_habit_day|paid|login_times'},{'name':'游戏时长','key':'user_habit_day|paid|online_time'}],
                [{'name':'游戏次数','key':'user_habit_day|potential_pay|login_times'},{'name':'游戏时长','key':'user_habit_day|potential_pay|online_time'}],
                [{'name':'游戏次数','key':'user_habit_day|potential_lost|login_times'},{'name':'游戏时长','key':'user_habit_day|potential_lost|online_time'}]
            ],
            [
                [{'name':'游戏次数','key':'user_habit_week|active|login_times'},{'name':'游戏时长','key':'user_habit_week|active|online_time'}],
                [{'name':'游戏次数','key':'user_habit_week|new|login_times'},{'name':'游戏时长','key':'user_habit_week|new|online_time'}],
                [{'name':'游戏次数','key':'user_habit_week|paid|login_times'},{'name':'游戏时长','key':'user_habit_week|paid|online_time'}],
                [{'name':'游戏次数','key':'user_habit_week|potential_pay|login_times'},{'name':'游戏时长','key':'user_habit_week|potential_pay|online_time'}],
                [{'name':'游戏次数','key':'user_habit_week|potential_lost|login_times'},{'name':'游戏时长','key':'user_habit_week|potential_lost|online_time'}]
            ],
            [
                [{'name':'游戏次数','key':'user_habit_month|active|login_times'},{'name':'游戏时长','key':'user_habit_month|active|online_time'}],
                [{'name':'游戏次数','key':'user_habit_month|new|login_times'},{'name':'游戏时长','key':'user_habit_month|new|online_time'}],
                [{'name':'游戏次数','key':'user_habit_month|paid|login_times'},{'name':'游戏时长','key':'user_habit_month|paid|online_time'}],
                [{'name':'游戏次数','key':'user_habit_month|potential_pay|login_times'},{'name':'游戏时长','key':'user_habit_month|potential_pay|online_time'}],
                [{'name':'游戏次数','key':'user_habit_month|potential_lost|login_times'},{'name':'游戏时长','key':'user_habit_month|potential_lost|online_time'}]
            ]
        ],
        [
            [
                [{'name':'游戏时长','key':'user_habit_freq|login_days_week|active'}],
                [{'name':'游戏时长','key':'user_habit_freq|login_days_week|new'}],
                [{'name':'游戏时长','key':'user_habit_freq|login_days_week|paid'}],
                [{'name':'游戏时长','key':'user_habit_freq|login_days_week|potential_pay'}],
                [{'name':'游戏时长','key':'user_habit_freq|login_days_week|potential_lost'}]
            ],
            [
                [{'name':'游戏次数','key':'user_habit_freq|login_times_week|active'}],
                [{'name':'游戏次数','key':'user_habit_freq|login_times_week|new'}],
                [{'name':'游戏次数','key':'user_habit_freq|login_times_week|paid'}],
                [{'name':'游戏次数','key':'user_habit_freq|login_times_week|potential_pay'}],
                [{'name':'游戏次数','key':'user_habit_freq|login_times_week|potential_lost'}]
            ]
        ],
        [
            [
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_week|active'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_week|new'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_week|paid'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_week|potential_pay'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_week|potential_lost'}]
            ],
            [
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_day|active'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_day|new'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_day|paid'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_day|potential_pay'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_day|potential_lost'}]
            ],
            [
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_once|active'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_once|new'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_once|paid'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_once|potential_pay'}],
                [{'name':'游戏时长','key':'user_habit_oltime|oltime_once|potential_lost'}]
            ]
        ],
        [
            [
                [{'name':'活跃玩家','key':'user_habit_olslot|active'}],
                [{'name':'新增玩家','key':'user_habit_olslot|new'}],
                [{'name':'付费玩家','key':'user_habit_olslot|paid'}],
                [{'name':'潜在付费玩家','key':'user_habit_olslot|potential_pay'}],
                [{'name':'潜在流失玩家','key':'user_habit_olslot|potential_lost'}]
            ]
        ],
        [
            [
                [{'name':'活跃玩家','key':'user_habit_device|active'}],
                [{'name':'新增玩家','key':'user_habit_device|new'}],
                [{'name':'付费玩家','key':'user_habit_device|paid'}],
                [{'name':'潜在付费玩家','key':'user_habit_device|potential_pay'}],
                [{'name':'潜在流失玩家','key':'user_habit_device|potential_lost'}]
            ]
        ]
    ],
    _domInit:function () {
        $('#headerTop .fl').remove();
        //M_Inside._htmlHeadTab(F_Habit_Info._tab,'habit');
        var dataUnion = [];
        var dataChoosed = {};
        for(var i=0;i<F_Habit_Info._tab.length;i++){
            if(i==0)dataChoosed = {id:i,name:F_Habit_Info._tab[i]};
            dataUnion.push({id:i,name:F_Habit_Info._tab[i]});
        }
        var str = M_Inside._dropHtml('bs_drop_user_type','选择分析对象',dataChoosed,dataUnion);
        $('#headerTop').prepend(str);
        M_Inside._dropShow('tg-selected-drop');
        M_Inside._dropSelected(function (select,position) {
            M_Init._dataCache['tabIndex'] = select;
            F_Habit_Info._formatInfo();
        },'tg-selected-drop');
        M_Inside._dropLeave('tg-selected-drop');

        M_Inside._htmlChartTable($('#ct_main_area'),F_Habit_Info._init);
        M_Inside._downloadCsv();
        F_Habit_Info._getInfo();
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_Habit_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationHabitUser'],'get',true,postData,function(){
            for(var i=0;i<domChart.length;i++){
                $('#'+domChart[i]).html(B_Pre._loading());
            }
        },function(){
            for(var i=0;i<domChart.length;i++){
                $('#'+domChart[i]).html('');
            }
        },function(data,msg){
            if(data){
                M_Init._dataCache['tabIndex'] = 0;
                M_Init._dataCache['data'] = data;
                F_Habit_Info._formatInfo();
            }
        },function(data,msg,code){
            for(var i=0;i<domChart.length;i++){
                $('#'+domChart[i]).html(B_Pre._empty(msg));
            }
        })
    },
    _formatInfo:function () {
        for(var i=0;i<F_Habit_Info._init.length;i++){
            if(!M_Init._dataCache['position_'+i])M_Init._dataCache['position_'+i] = 0;
            if(F_Habit_Info._init[i].tab.length > 0){
                for(var d=0;d<F_Habit_Info._init[i].tab.length;d++){
                    if(M_Init._dataCache['position_'+i] == d) {
                        F_Habit_Info._chartHtml(i, d);
                        M_Inside._chartTableIcon(F_Habit_Info._init[i].type, i, d);
                        break;
                    }
                }
                M_Inside._tabChangePerChart(i,F_Habit_Info._init[i].type,'habit');
            }else{
                F_Habit_Info._chartHtml(i, 0);
                M_Inside._chartTableIcon(F_Habit_Info._init[i].type, i, 0);
            }
        }
    },
    _chartHtml:function (domBig,domSmall) {
        if(!M_Init._dataCache['tabIndex'])M_Init._dataCache['tabIndex'] = 0;
        M_Init._dataCache['position_'+domBig] = domSmall;
        var data = M_Init._dataCache['data'];
        var chartDataPre = {x_axis:[],y_axis:[],yFormat:''};
        var tableData = {};
        var chartType = 50;
        var port = '';
        var tableUnit = '';
        switch(domBig+''){
            case '0':
                chartDataPre.xFormatDate = true;
                chartDataPre.yDouble = true;
                chartDataPre.yDoubleLabel = ['次','mins'];
                chartDataPre.tooltip = {'type':'diff','num':2,'unit':['次','mins']};
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                chartDataPre.tooltip = {'type':'simple','num':1,'unit':'人'};
                break;
        }
        switch(domBig+''){
            case '1':
                switch (domSmall+''){
                    case '0':
                        tableData = {'head':['游戏天数','玩家数量(人)','玩家占比'],'body':[]};
                        break;
                    default:
                        tableData = {'head':['游戏频次','玩家数量(人)','玩家占比'],'body':[]};
                        break;
                }

                break;
            case '2':
                tableData = {'head':['游戏时长','玩家数量(人)','玩家占比'],'body':[]};
                break;
            case '3':
                tableData = {'head':['游戏时段分布','玩家数量(人)','玩家占比'],'body':[]};
                break;
            case '4':
                tableData = {'head':['机型','玩家数量(人)','玩家占比'],'body':[]};
                break;
            default:
                tableData = {'head':['日期','游戏次数(次)','游戏时长(mins)'],'body':[]};
                break;
        }
        port = F_Habit_Info._port[domBig][domSmall][M_Init._dataCache['tabIndex']];
        for(var i=0;i<port.length;i++){
            var key = (port[i].key).split('|');
            switch(domBig+''){
                case '0':
                    if(data[key[0]] && data[key[0]][key[1]] && data[key[0]][key[1]][key[2]]){
                        var dataUnion = data[key[0]][key[1]][key[2]];
                        var dataMain = data[key[0]];
                        var y_axis = [];
                        chartDataPre.x_axis = dataMain.x_axis;
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [dataMain.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                        }
                        if(i == 0){
                            chartDataPre.y_axis.push({'type':'bar','name':port[i].name,'data':dataUnion});
                        }else{
                            chartDataPre.y_axis.push({'type':'line','name':port[i].name,'data':dataUnion});
                        }
                    }
                    break;
                case '1':
                case '2':
                    chartType = 20;
                    if(data[key[0]] && data[key[0]][key[1]] && data[key[0]][key[1]][key[2]]){
                        var dataUnion = data[key[0]][key[1]][key[2]];
                        var dataMain = data[key[0]][key[1]];
                        for(var e=0;e<dataMain.distri_classify.length;e++){
                            dataMain.distri_classify[e] = dataMain.distri_classify[e].replace('&gt;',">");
                            dataMain.distri_classify[e] = dataMain.distri_classify[e].replace('&lt;',"<");
                        }

                        if(domBig == 1 && domSmall == 0){
                            var dayYx = [];
                            for(var z=0;z<dataMain.distri_classify.length;z++){
                                dayYx[z] = dataMain.distri_classify[z]+'天';
                            }
                            chartDataPre.x_axis = dayYx;
                            tableUnit = '天';
                        }else {
                            chartDataPre.x_axis = dataMain.distri_classify;
                        }

                        for(var d=0;d<dataUnion.user_num.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [dataMain.distri_classify[d]+tableUnit];
                            tableData.body[d].push(dataUnion.user_num[d]);
                            tableData.body[d].push(dataUnion.user_rate[d]+'%');
                        }
                        chartDataPre.y_axis.push({'name':port[i].name,'data':dataUnion.user_num});
                    }
                    break;
                default:
                    if(domBig == 4){
                        chartType = 20;
                    }else{
                        chartType = 40;
                    }
                    if(data[key[0]] &&data[key[0]][key[1]]){
                        var dataUnion = data[key[0]][key[1]];
                        chartDataPre.x_axis = dataUnion.distri_classify;
                        for(var d=0;d<dataUnion.y_axis.user_num.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [dataUnion.distri_classify[d]];
                            tableData.body[d].push(dataUnion.y_axis.user_num[d]);
                            tableData.body[d].push(dataUnion.y_axis.user_rate[d]+'%');
                        }
                        chartDataPre.y_axis.push({'name':port[i].name,'data':dataUnion.y_axis.user_num});
                    }
                    break;
            }
        }

        tableData.name = M_Inside._tableName(F_Habit_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside_Chart._chartData(chartType,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
        M_Inside._tableHtml(1,domBig+'_'+domSmall);

    }
}