var F_Pay_Entrance = {
    _init: function() {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if (M_Init._controller != 'demo' && B_User._isDemoUser()) {
            B_Login._openLogin('background');
        } else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationPayUser'] = 'demoInnerOperationPayUser';
                    break;
                default:
                    M_Init._api['innerOperationPayUser'] = 'innerOperationPayUser';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('pay','','1-2-4');
            B_Date._chooseSection({ 'autoCommit': false, 'todayValid': false }, 1, M_Init._dateChoose.begin, M_Init._dateChoose.end, function(begin, end) {
                if (begin != M_Init._dateCache.begin || M_Init._dateCache.end != end) {
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_Pay_Info._getInfo();
                }
            });
        }
    }
}
var F_Pay_Info = {
    _init: [
        { 'type': 'togetherTabAvg', 'name': '付费玩家概览', 'tab': ['首次付费数', '当日付费玩家数', '潜在付费玩家数'], 'tips': [{}, { 'position': 'second', 'content': ['首日付费玩家数：当日为新增日，且在新增日就进行付费的玩家数<br>首次付费玩家数：当日付费且是历史以来第一次付费的玩家数', '首次付费玩家数：当日付费且是历史以来第一次付费的玩家数<br>再次付费玩家数：当日付费且不是首次付费的玩家数<br>当日付费玩家数：当日付费的玩家总数', '潜在付费玩家：之后7日（不含当日）玩家付费的意愿强度>0.5的玩家数。付费意愿的取值范围为0~1，非常强烈的意愿为1<br>付费玩家总数：当日付费的玩家总数'] }] },
        { 'type': 'switchTab', 'name': '已玩天数分布', 'tab': ['付费玩家', '潜在付费玩家'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内有付费行为的玩家玩游戏的实际天数进行分布', '之后7日（不含当日）玩家付费的意愿强度>0.5的玩家已经玩游戏的实际天数分布。付费意愿的取值范围为0~1，非常强烈的意愿为1'] }] },
        { 'type': 'switchTab', 'name': '等级分布', 'tab': ['付费玩家', '潜在付费玩家'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内有付费行为的玩家目前的等级进行分布', '之后7日（不含当日）玩家付费的意愿强度>0.5的玩家的等级分布。付费意愿的取值范围为0~1，非常强烈的意愿为1'] }] },
        { 'type': 'switchTab', 'name': '当日游戏时长分布', 'tab': ['付费玩家', '潜在付费玩家'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内有付费行为的玩家的付费当日游戏时长分布', '之后7日（不含当日）玩家付费的意愿强度>0.5的玩家的当日游戏时长分布。付费意愿的取值范围为0~1，非常强烈的意愿为1'] }] },
        { 'type': 'switchTab', 'name': '中国地区分布', 'tab': ['付费玩家', '潜在付费玩家'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内有付费行为的玩家的地区分布', '之后7日（不含当日）玩家付费的意愿强度>0.5的玩家的地区分布。付费意愿的取值范围为0~1，非常强烈的意愿为1'] }] },
        { 'type': 'switchTab', 'name': '全球地区分布', 'tab': ['付费玩家', '潜在付费玩家'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内有付费行为的玩家的地区分布', '之后7日（不含当日）玩家付费的意愿强度>0.5的玩家的地区分布。付费意愿的取值范围为0~1，非常强烈的意愿为1'] }] },
        { 'type': 'switch', 'name': '付费玩家流失倾向分析', 'tab': [], 'tips': [{ 'position': 'first', 'content': '付费玩家中可能流失的人数：当日付费的玩家中，之后7日（不含当日）不再登录概率大于50%的玩家数' }] }
    ],
    _avg: [
        [
            [{ 'label': 'AVG：', 'name': '平均每日首次付费玩家数', 'key': 'avg_first_pay_user', 'unit': '' }],
            [{ 'label': 'AVG：', 'name': '平均每日付费玩家数', 'key': 'avg_pay_user', 'unit': '' }],
            [{ 'label': 'AVG：', 'name': '平均每日有付费倾向的玩家数', 'key': 'avg_potential_pay', 'unit': '' }]
        ]
    ],
    _port: [
        [
            [{ 'name': '首日付费玩家数', 'key': 'y_axis_first_day_pay' }, { 'name': '首次付费玩家数', 'key': 'y_axis_first_pay' }],
            [{ 'name': '首次付费玩家数', 'key': 'y_axis_first_pay' }, { 'name': '再次付费玩家数', 'key': 'y_axis_pay_again' }, { 'name': '当日付费玩家数', 'key': 'y_axis_pay' }],
            [{ 'name': '潜在付费用户', 'key': 'y_axis_potential_pay' }, { 'name': '当日付费玩家数', 'key': 'y_axis_pay' }]
        ],
        [
            [{ 'name': '已付费', 'key': 'pay_user_oldays_distri|paid' }],
            [{ 'name': '潜在付费', 'key': 'pay_user_oldays_distri|potential_pay' }]
        ],
        [
            [{ 'name': '已付费', 'key': 'pay_user_level_distri|paid' }],
            [{ 'name': '潜在付费', 'key': 'pay_user_level_distri|potential_pay' }]
        ],
        [
            [{ 'name': '已付费', 'key': 'pay_user_oltime_distri|paid' }],
            [{ 'name': '潜在付费', 'key': 'pay_user_oltime_distri|potential_pay' }]
        ],
        [
            [{ 'name': '已付费', 'key': 'pay_user_area_distri|paid|china' }],
            [{ 'name': '潜在付费', 'key': 'pay_user_area_distri|potential|china' }]
        ],
        [
            [{ 'name': '已付费', 'key': 'pay_user_area_distri|paid|global' }],
            [{ 'name': '潜在付费', 'key': 'pay_user_area_distri|potential|global' }]
        ],
        [
            [{ 'name': '可能流失的付费玩家', 'key': 'pay_user_potential_lost_distri' }]
        ]
    ],
    _domInit: function() {
        M_Inside._htmlChartTable($('#ct_main_area'), F_Pay_Info._init);

        M_Inside._downloadCsv();
        F_Pay_Info._getInfo();
    },
    _getInfo: function() {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for (var i = 0; i < F_Pay_Info._init.length; i++) {
            domChart.push('bs_chart_' + i + '_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationPayUser'], 'get', true, postData, function() {
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
                for (var i = 0; i < F_Pay_Info._init.length; i++) {
                    if (F_Pay_Info._init[i].tab.length > 0) {
                        if (!M_Init._dataCache['position_' + i]) M_Init._dataCache['position_' + i] = 0;
                        for (var d = 0; d < F_Pay_Info._init[i].tab.length; d++) {
                            if (M_Init._dataCache['position_' + i] == d) {
                                F_Pay_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_Pay_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i, F_Pay_Info._init[i].type, 'pay');
                    } else {
                        F_Pay_Info._chartHtml(i, 0);
                        M_Inside._chartTableIcon(F_Pay_Info._init[i].type, i, 0);
                    }
                }
            }
        }, function(data, msg, code) {
            for (var i = 0; i < domChart.length; i++) {
                $('#' + domChart[i]).html(B_Pre._empty(msg));
            }
        })
    },
    _chartHtml: function(domBig, domSmall, type) {
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
                chartDataPre.tooltip = { 'num': 2, 'unit': '人' };
                tableUnit = '人';
                switch (domSmall + '') {
                    case '1':
                        chartDataPre.tooltip = { 'num': 3, 'unit': '人' };
                        break;
                }

                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                chartDataPre.tooltip = { 'num': 1, 'unit': '人' };
                break;
            case '6':
                chartDataPre.xFormatDate = true;
                chartDataPre.yFormat = '';
                chartDataPre.tooltip = { 'num': 1, 'unit': '人' };
                tableUnit = '人';
                break;
                break;
        }

        switch (domBig + '') {
            case '1':
                tableData = { 'head': ['已玩天数', F_Pay_Info._port[domBig][domSmall][0].name + '(人)', '玩家占比'], 'body': [] };
                break;
            case '2':
                tableData = { 'head': ['玩家等级分布', F_Pay_Info._port[domBig][domSmall][0].name + '(人)', '玩家占比'], 'body': [] };
                break;
            case '3':
                tableData = { 'head': ['人均活跃时长', F_Pay_Info._port[domBig][domSmall][0].name + '(人)', '玩家占比'], 'body': [] };
                break;
            case '4':
            case '5':
                tableData = { 'head': ['地区', F_Pay_Info._port[domBig][domSmall][0].name + '(人)', '玩家占比'], 'body': [] };
                break;
            case '6':
                tableData = { 'head': ['日期', F_Pay_Info._port[domBig][domSmall][0].name + '(人)', '玩家占比'], 'body': [] };
                break;
            default:
                tableData = { 'head': ['日期'], 'body': [] };
                break;
        }
        for (var i = 0; i < F_Pay_Info._port[domBig][domSmall].length; i++) {
            var dataKey = F_Pay_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_Pay_Info._port[domBig][domSmall][i].name;
            if ((domBig == 1)) {
                chartType = 20;
                if (data[dataKey[0]][dataKey[1]]) {
                    var dataUnion = data[dataKey[0]][dataKey[1]];
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
                if (data[dataKey[0]][dataKey[1]]) {
                    var dataUnion = data[dataKey[0]][dataKey[1]];
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
                if (data[dataKey[0]][dataKey[1]]) {
                    var dataUnion = data[dataKey[0]][dataKey[1]];
                    var y_axis = [];
                    for (var d = 0; d < dataUnion.length; d++) {
                        dataUnion[d].oltime_classify = dataUnion[d].oltime_classify.replace('&gt;', ">");
                        dataUnion[d].oltime_classify = dataUnion[d].oltime_classify.replace('&lt;', "<");
                        chartDataPre.x_axis.push(dataUnion[d].oltime_classify);
                        y_axis.push(dataUnion[d].user_num);
                        if (!tableData.body[d]) tableData.body[d] = [dataUnion[d].oltime_classify];
                        tableData.body[d].push(dataUnion[d].user_num);
                        tableData.body[d].push(dataUnion[d].user_rate + '%');
                    }
                    chartDataPre.y_axis.push({ 'name': dataName, 'data': y_axis });
                }
            } else if (domBig == 4 || domBig == 5) {

                chartType = 20;
                if (data[dataKey[0]][dataKey[1]][dataKey[2]]) {
                    var dataUnion = data[dataKey[0]][dataKey[1]][dataKey[2]];
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
            } else if (domBig == 6) {
                if (data[dataKey[0]]) {
                    var dataUnion = data[dataKey[0]];
                    var y_axis = [];
                    for (var d = 0; d < dataUnion.length; d++) {
                        chartDataPre.x_axis.push(dataUnion[d].data_date);
                        y_axis.push(dataUnion[d].potential_lost_num);
                        if (!tableData.body[d]) tableData.body[d] = [dataUnion[d].data_date];
                        tableData.body[d].push(dataUnion[d].potential_lost_num);
                        tableData.body[d].push(dataUnion[d].potential_lost_rate + '%');
                    }
                    chartDataPre.y_axis.push({ 'name': dataName, 'data': y_axis });
                }
            } else {
                chartType = 50;
                chartDataPre.x_axis = data.x_axis;
                if (tableUnit != '%') {
                    tableData.head.push(F_Pay_Info._port[domBig][domSmall][i].name + '(' + tableUnit + ')');
                } else {
                    tableData.head.push(F_Pay_Info._port[domBig][domSmall][i].name);
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
            }
        }
        if (F_Pay_Info._avg[domBig] && F_Pay_Info._avg[domBig][domSmall]) {
            var avgData = '';
            var avgConfig = F_Pay_Info._avg[domBig][domSmall];
            for (var a = 0; a < avgConfig.length; a++) {
                if (avgConfig[a].label) avgData += '<span>' + avgConfig[a].label + '</span>';
                avgData += '<span>' + avgConfig[a].name + '<b>';
                dataKey = avgConfig[a].key.split('|');
                if (data[dataKey[0]]) {
                    avgData += data[dataKey[0]];
                }
                avgData += avgConfig[a].unit + '</b></span>';
            }

            M_Inside._avgHtml(domBig + '_0', avgData);
        }

        tableData.name = M_Inside._tableName(F_Pay_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig + '_' + domSmall] = tableData;
        M_Inside_Chart._chartData(chartType, 'bs_chart_' + domBig + '_' + domSmall, chartDataPre);
        M_Inside._tableHtml(1, domBig + '_' + domSmall);
    }
}
