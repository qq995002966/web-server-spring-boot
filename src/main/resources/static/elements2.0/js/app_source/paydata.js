var F_PayData_Entrance = {
    _init: function() {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if (M_Init._controller != 'demo' && B_User._isDemoUser()) {
            B_Login._openLogin('background');
        } else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerPayData'] = 'demoInnerPayData';
                    break;
                default:
                    M_Init._api['innerPayData'] = 'innerPayData';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('paydata','','1-4-1');
            B_Date._chooseSection({ 'autoCommit': false, 'todayValid': false }, 1, M_Init._dateChoose.begin, M_Init._dateChoose.end, function(begin, end) {
                if (begin != M_Init._dateCache.begin || M_Init._dateCache.end != end) {
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_PayData_Info._getInfo();
                }
            });
        }
    }
}
var F_PayData_Info = {
    _init: [
        { 'type': 'togetherTabAvg', 'name': '付费数据', 'tab': ['付费金额', '付费次数', '付费人数', '潜在付费人数'], 'tips': [{}, { 'position': 'second', 'content': ['当日玩家成功付费的总金额', '当日玩家成功付费的总次数 ', '当日玩家成功付费的总人数', '之后7日（不含当日）玩家付费的意愿强度>0.5的玩家数。付费意愿的取值范围为0~1，非常强烈的意愿为1'] }] },
        { 'type': 'togetherTab', 'name': '付费金额与玩家等级分布', 'tab': ['付费金额', '付费人次'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内，当前等级的成功付费总金额分布', '所选时期内，当前等级的成功付费总次数分布 '] }] },
        { 'type': 'switchTab', 'name': '付费金额与地区分布', 'tab': ['中国地区', '全球地区'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内，当前地区的成功付费总金额分布', '所选时期内，当前地区的成功付费总金额分布'] }] },
        { 'type': 'switch', 'name': '付费金额与渠道分布', 'tab': [], 'tips': [{ 'position': 'first', 'content': '所选时期内，当前渠道的成功付费总金额分布' }] }
    ],
    _avg: [
        [
            [{'label':'AVG：', 'name': '日均付费金额', 'key': 'pay_data|avg_pay_amount','unit':'元' }, {'label':'SUM：', 'name': '付费金额总数', 'key': 'pay_data|sum_pay_amount' ,'unit':'元'}],
            [{ 'label':'AVG：','name': '日均付费次数', 'key': 'pay_data|avg_pay_times','unit':'次' }, { 'label':'SUM：', 'name': '付费总次数', 'key': 'pay_data|sum_pay_times','unit':'次' }],
            [{ 'label':'AVG：','name': '日均付费人数', 'key': 'pay_data|avg_pay_num','unit':'人' }, { 'label':'SUM：', 'name': '付费总人数', 'key': 'pay_data|sum_pay_num' ,'unit':'人'}],
            [{'label':'AVG：', 'name': '日均有付费倾向的玩家数', 'key': 'pay_data|avg_potential_pay_num','unit':'人' }, { 'label':'SUM：', 'name': '有付费倾向的玩家总数', 'key': 'pay_data|sum_potential_pay_num','unit':'人' }]
        ]
    ],
    _port: [
        [
            [{ 'name': '付费金额', 'key': 'pay_data|y_axis_pay_amount' }],
            [{ 'name': '付费次数', 'key': 'pay_data|y_axis_pay_times' }],
            [{ 'name': '付费人数', 'key': 'pay_data|y_axis_pay_num' }],
            [{ 'name': '潜在付费人数', 'key': 'pay_data|y_axis_potential_pay_num' }]
        ],
        [
            [{ 'name': '付费金额', 'key': 'pay_level|y_level_axis_pay_amount' }],
            [{ 'name': '付费人次', 'key': 'pay_level|y_level_axis_pay_times' }]
        ],
        [
            [{ 'name': '中国地区', 'key': 'axis_area|china' }],
            [{ 'name': '全球地区', 'key': 'axis_area|global' }]
        ],
        [
            [{ 'name': '付费金额与渠道分布', 'key': 'axis_channel|y_channel_axis_pay_amount'}]
        ]
    ],
    _domInit: function() {
        M_Inside._htmlChartTable($('#ct_main_area'), F_PayData_Info._init);
        M_Inside._downloadCsv();
        F_PayData_Info._getInfo();
    },
    _getInfo: function() {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for (var i = 0; i < F_PayData_Info._init.length; i++) {
            domChart.push('bs_chart_' + i + '_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerPayData'], 'get', true, postData, function() {
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
                for (var i = 0; i < F_PayData_Info._init.length; i++) {
                    if (F_PayData_Info._init[i].tab.length > 0) {
                        if (!M_Init._dataCache['position_' + i]) M_Init._dataCache['position_' + i] = 0;
                        for (var d = 0; d < F_PayData_Info._init[i].tab.length; d++) {
                            if (M_Init._dataCache['position_' + i] == d) {
                                F_PayData_Info._chartHtml(i, d);
                                M_Inside._chartTableIcon(F_PayData_Info._init[i].type, i, d);
                                break;
                            }
                        }
                        M_Inside._tabChangePerChart(i, F_PayData_Info._init[i].type, 'paydata');
                    } else {
                        F_PayData_Info._chartHtml(i, 0);
                        M_Inside._chartTableIcon(F_PayData_Info._init[i].type, i, 0);
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
                chartDataPre.tooltip = { 'num': 1, 'unit': '' };
                tableUnit = '';
                switch (domSmall + '') {
                    case '0':
                        chartDataPre.tooltip = { 'num': 1, 'unit': '元' };
                        chartDataPre.yFormat = '元';
                        tableUnit = '元';
                        break;
                    case '1':
                        chartDataPre.yFormat = '次';
                        chartDataPre.tooltip = { 'num': 1, 'unit': '次' };
                        tableUnit = '次';
                        break;
                }
                break;
            case '1':
                switch (domSmall + '') {
                    case '0':
                        chartDataPre.yFormat = '元';
                        chartDataPre.tooltip = { 'num': 1, 'unit': '元' };
                        tableUnit = '元';
                        break;
                    case '1':
                        chartDataPre.yFormat = '人次';
                        chartDataPre.tooltip = { 'num': 1, 'unit': '人次' };
                        tableUnit = '人次';
                        break;
                }
                break;
            case '2':
            case '3':
                chartDataPre.tooltip = { 'num': 1, 'unit': '元' };
                break;
        }
        switch (domBig + '') {
            case '0':
                tableData = { 'head': ['日期'], 'body': [] };
                break;
            case '1':
                tableData = { 'head': ['等级'], 'body': [] };
                break;
            case '2':
                tableData = { 'head': ['地区', '付费金额(元)', '百分比'], 'body': [] };
                break;
            case '3':
                tableData = { 'head': ['渠道', '付费金额(元)', '百分比'], 'body': [] };
                break;

        }
        for (var i = 0; i < F_PayData_Info._port[domBig][domSmall].length; i++) {
            var dataKey = F_PayData_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_PayData_Info._port[domBig][domSmall][i].name;
            switch (domBig + '') {
                case '0':
                    chartType = 50;
                    if (tableUnit) {
                        tableData.head.push(dataName + '(' + tableUnit + ')');
                    } else {
                        tableData.head.push(dataName + '');
                    }
                    if (data[dataKey[0]] && data[dataKey[0]][dataKey[1]]) {
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis;
                        for (var d = 0; d < dataUnion.length; d++) {
                            if (!tableData.body[d]) tableData.body[d] = [data[dataKey[0]].x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                        }
                        chartDataPre.y_axis.push({ 'name': dataName, 'data': dataUnion });
                    }
                    break;
                case '1':
                    chartType = 40;
                    if (tableUnit) {
                        tableData.head.push(dataName + '(' + tableUnit + ')');
                    } else {
                        tableData.head.push(dataName + '');
                    }
                    tableData.head.push('百分比');
                    if (data[dataKey[0]] && data[dataKey[0]][dataKey[1]]) {
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        switch (domSmall+''){
                            case '0':
                                for (var d = 0; d < dataUnion.length; d++) {
                                    chartDataPre.x_axis.push(data[dataKey[0]].x_level_axis[d]+'级');
                                    if (!tableData.body[d]) tableData.body[d] = [data[dataKey[0]].x_level_axis[d]+'级'];
                                    tableData.body[d].push(dataUnion[d]);
                                    tableData.body[d].push(data[dataKey[0]].y_level_axis_pay_amount_percentage[d]+'%');
                                }
                                break;
                            case '1':
                                for (var d = 0; d < dataUnion.length; d++) {
                                    chartDataPre.x_axis.push(data[dataKey[0]].x_level_axis[d]+'级');
                                    if (!tableData.body[d]) tableData.body[d] = [data[dataKey[0]].x_level_axis[d]+'级'];
                                    tableData.body[d].push(dataUnion[d]);
                                    tableData.body[d].push(data[dataKey[0]].y_level_axis_pay_times_percentage[d]+'%');
                                }
                                break;
                        }
                        chartDataPre.y_axis.push({ 'name': dataName, 'data': dataUnion });
                    }
                    break;
                case '2':
                    chartType = 20;
                    if (data[dataKey[0]][dataKey[1]]) {
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        var y_axis = [];
                        for (var d = 0; d < dataUnion.length; d++) {
                            chartDataPre.x_axis.push(dataUnion[d].area_classify);
                            y_axis.push(dataUnion[d].pay_amount);
                            if (!tableData.body[d]) tableData.body[d] = [dataUnion[d].area_classify];
                            tableData.body[d].push(dataUnion[d].pay_amount);
                            tableData.body[d].push(dataUnion[d].user_rate + '%');
                        }
                        chartDataPre.y_axis.push({ 'name': dataName, 'data': y_axis });
                    }
                    break;
                case '3':
                    chartType = 20;
                    if (data[dataKey[0]] && data[dataKey[0]][dataKey[1]]) {
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_channel_axis;
                        for (var d = 0; d < dataUnion.length; d++) {
                            if (!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(dataUnion[d]);
                            tableData.body[d].push(data[dataKey[0]].y_channel_axis_pay_amount_percentage[d] + '%');
                        }
                        chartDataPre.y_axis.push({ 'name': dataName, 'data': dataUnion });
                    }
                    break;
            }
        }

        if (F_PayData_Info._avg[domBig] && F_PayData_Info._avg[domBig][domSmall]) {
            var avgData = '';
            var avgConfig = F_PayData_Info._avg[domBig][domSmall];
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
        tableData.name = M_Inside._tableName(F_PayData_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig + '_' + domSmall] = tableData;
        M_Inside_Chart._chartData(chartType, 'bs_chart_' + domBig + '_' + domSmall, chartDataPre);
        M_Inside._tableHtml(1, domBig + '_' + domSmall);

    }
}
