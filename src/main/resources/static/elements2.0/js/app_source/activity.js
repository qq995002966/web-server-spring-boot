var F_Activity_Entrance = {
    _init: function() {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if (M_Init._controller != 'demo' && B_User._isDemoUser()) {
            B_Login._openLogin('background');
        } else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationActiveUser'] = 'demoInnerOperationActiveUser';
                    break;
                default:
                    M_Init._api['innerOperationActiveUser'] = 'innerOperationActiveUser';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('activity','', '1-2-2');
            B_Date._chooseSection({ 'autoCommit': false, 'todayValid': false }, 1, M_Init._dateChoose.begin, M_Init._dateChoose.end, function(begin, end) {
                if (begin != M_Init._dateCache.begin || M_Init._dateCache.end != end) {
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_Activity_Info._getInfo();
                }
            });
        }
    }
}
var F_Activity_Info = {
    _init: [{
            'type': 'togetherTabAvg',
            'name': '活跃度指标',
            'tab': ['DAU', 'WAU', 'MAU'],
            'tips': [
                {}, { 'position': 'second', 'content': ['当日开启过游戏的玩家人数', '当日最近一周（含当日向前推7日）开启过游戏的玩家人数', '当日最近一月（含当日向前推30日）开启过游戏的玩家人数'] }
            ]
        },
        { 'type': 'switch', 'name': '已玩天数分布', 'tab': [], 'tips': [{ 'position': 'first', 'content': '所选时期的活跃玩家的活跃日期减新增日期的日数差（即其已进行游戏的天数）的分布情况' }] },
        { 'type': 'switch', 'name': '等级分布', 'tab': [], 'tips': [{ 'position': 'first', 'content': '所选时期每日活跃玩家的等级分布情况' }] },
        { 'type': 'regionTab', 'name': '地区分布', 'tab': ['中国地区', '全球地区'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期活跃玩家的地区分布情况', '所选时期活跃玩家的地区分布情况'] }] }
    ],
    _avg: [
        [
            [{ 'label': 'AVG：', 'name': '平均每日活跃用户数量', 'key': 'avg_dau', 'unit': '' }],
            [{ 'label': 'AVG：', 'name': '平均每周活跃用户数量', 'key': 'avg_wau', 'unit': '' }],
            [{ 'label': 'AVG：', 'name': '平均每月活跃用户数量', 'key': 'avg_mau', 'unit': '' }]
        ]
    ],
    _port: [
        [
            [{ 'name': 'DAU', 'key': 'y_axis_dau' }],
            [{ 'name': 'WAU', 'key': 'y_axis_wau' }],
            [{ 'name': 'MAU', 'key': 'y_axis_mau' }]
        ],
        [
            [{ 'name': '已玩天数', 'key': 'login_user_oldays_distri' }]
        ],
        [
            [{ 'name': '玩家等级分布', 'key': 'login_user_level_distri' }]
        ],
        [
            [{ 'name': '国内地区分布', 'key': 'area_distri|china' }],
            [{ 'name': '国际地区分布', 'key': 'area_distri|global' }]
        ]
    ],
    _domInit: function() {
        M_Inside._htmlChartTable($('#ct_main_area'), F_Activity_Info._init);

        M_Inside._downloadCsv();
        F_Activity_Info._getInfo();
    },
    _getInfo: function() {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for (var i = 0; i < F_Activity_Info._init.length; i++) {
            domChart.push('bs_chart_' + i + '_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationActiveUser'], 'get', true, postData, function() {
            for (var i = 0; i < domChart.length; i++) {
                $('#' + domChart[i]).html(B_Pre._loading());
            }
        }, function() {
            for (var i = 0; i < domChart.length; i++) {
                $('#' + domChart[i]).html('');
            }
        }, function(data, msg) {
            if (data) {
                M_Init._dataCache['data'] = data;
                for (var i = 0; i < F_Activity_Info._init.length; i++) {
                    if (F_Activity_Info._init[i].tab.length > 0) {
                        if (!M_Init._dataCache['position_' + i]) M_Init._dataCache['position_' + i] = 0;
                        for (var d = 0; d < F_Activity_Info._init[i].tab.length; d++) {
                            if (M_Init._dataCache['position_' + i] == d) {
                                F_Activity_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_Activity_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i, F_Activity_Info._init[i].type, 'activity');
                    } else {
                        F_Activity_Info._chartHtml(i, '0', 'china');
                        M_Inside._chartTableIcon(F_Activity_Info._init[i].type, i, '0');
                    }

                }
            }
        }, function(data, msg, code) {
            for (var i = 0; i < domChart.length; i++) {
                $('#' + domChart[i]).html(B_Pre._empty(msg));
            }
        })
    },
    _chartHtml: function(domBig, domSmall) {
        M_Init._dataCache['position_' + domBig] = domSmall;
        var data = M_Init._dataCache['data'];
        var chartDataPre = { x_axis: [], y_axis: [], yFormat: '' };
        var tableData = {};
        var chartType = 50;
        var tableUnit = '';
        switch (domBig + '') {
            case '0':
                chartDataPre.xFormatDate = true;
                chartDataPre.yFormat = '';
                chartDataPre.tooltip = { 'num': 1, 'unit': '人' };
                tableUnit = '人';
                break;
            case '1':
            case '2':
            case '3':
                chartDataPre.tooltip = { 'num': 1, 'unit': '人' };
                break;
        }

        for (var i = 0; i < F_Activity_Info._port[domBig][domSmall].length; i++) {
            var dataKey = F_Activity_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_Activity_Info._port[domBig][domSmall][i].name;
            if (domBig == 1) {
                chartType = 20;
                tableData = { 'head': ['已玩天数', '活跃玩家(人)', '玩家占比'], 'body': [] };
                if (data[dataKey[0]]) {
                    var dataUnion = data[dataKey[0]];
                    var y_axis = [];
                    for (var d = 0; d < dataUnion.length; d++) {
                        dataUnion[d].oldays_classify = dataUnion[d].oldays_classify.replace('&gt;', ">");
                        dataUnion[d].oldays_classify = dataUnion[d].oldays_classify.replace('&lt;', "<");
                        chartDataPre.x_axis.push(dataUnion[d].oldays_classify);
                        y_axis.push(dataUnion[d].user_num);
                        if (!tableData.body[d]) tableData.body[d] = [dataUnion[d].oldays_classify];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate + '%');
                    }
                    chartDataPre.y_axis.push({ 'name': dataName, 'data': y_axis });
                }
            } else if (domBig == 2) {
                chartType = 40;
                tableData = { 'head': ['等级分布', '活跃玩家(人)', '玩家占比'], 'body': [] };
                if (data[dataKey[0]]) {
                    var dataUnion = data[dataKey[0]];
                    var y_axis = [];
                    for (var d = 0; d < dataUnion.length; d++) {
                        chartDataPre.x_axis.push(dataUnion[d].level + '级');
                        y_axis.push(dataUnion[d].user_num);
                        if (!tableData.body[d]) tableData.body[d] = [dataUnion[d].level + '级'];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate + '%');
                    }
                    chartDataPre.y_axis.push({ 'name': dataName, 'data': y_axis });
                }
            } else if (domBig == 3) {
                chartType = 20;
                tableData = { 'head': ['地区', '新增玩家(人)', '玩家占比'], 'body': [] };
                if (data[dataKey[0]] && data[dataKey[0]][dataKey[1]]) {
                    var dataUnion = data[dataKey[0]][dataKey[1]];
                    var y_axis = [];
                    for (var d = 0; d < dataUnion.length; d++) {
                        chartDataPre.x_axis.push(dataUnion[d].area_classify);
                        y_axis.push(dataUnion[d].user_num);
                        if (!tableData.body[d]) tableData.body[d] = [dataUnion[d].area_classify];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate + '%');
                    }
                    chartDataPre.y_axis.push({ 'name': dataName, 'data': y_axis });
                }
                domSmall = 0;
            } else {
                chartType = 50;
                tableData = { 'head': ['日期'], 'body': [] };
                chartDataPre.x_axis = data.x_axis;
                if (tableUnit != '%') {
                    tableData.head.push(dataName + '(' + tableUnit + ')');
                } else {
                    tableData.head.push(dataName);
                }
                if (data[dataKey[0]]) {
                    var dataUnion = data[dataKey[0]];
                    for (var d = 0; d < dataUnion.length; d++) {
                        if (!tableData.body[d]) tableData.body[d] = [data.x_axis[d]];
                        if (tableUnit != '%') {
                            tableData.body[d].push(dataUnion[d]);
                        } else {
                            tableData.body[d].push(dataUnion[d] + tableUnit);
                        }
                    }
                    chartDataPre.y_axis.push({ 'name': dataName, 'data': dataUnion });
                }
                // domSmall = 0;
            }
        }

        if (F_Activity_Info._avg[domBig] && F_Activity_Info._avg[domBig][domSmall]) {
            var avgData = '';
            var avgConfig = F_Activity_Info._avg[domBig][domSmall];
            for(var a=0;a<avgConfig.length;a++){
                if(avgConfig[a].label)avgData += '<span>'+avgConfig[a].label+'</span>';
                avgData += '<span>' + avgConfig[a].name + '<b>';
                dataKey = avgConfig[a].key.split('|');
                if (data[dataKey[0]] ) {
                    avgData += data[dataKey[0]];
                }
                avgData += avgConfig[a].unit + '</b></span>';
            }

            M_Inside._avgHtml(domBig + '_0', avgData);
        }

        tableData.name = M_Inside._tableName(F_Activity_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig + '_' + domSmall] = tableData;
        M_Inside_Chart._chartData(chartType, 'bs_chart_' + domBig + '_' + domSmall, chartDataPre);
        M_Inside._tableHtml(1, domBig + '_' + domSmall);
    }
}
