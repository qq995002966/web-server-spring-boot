var F_LostAnalysis_Entrance = {
    _init: function() {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if (M_Init._controller != 'demo' && B_User._isDemoUser()) {
            B_Login._openLogin('background');
        } else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerLostAnalysis'] = 'demoInnerLostAnalysis';
                    break;
                default:
                    M_Init._api['innerLostAnalysis'] = 'innerLostAnalysis';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('lostanalysis','', '1-5-1');
            B_Date._chooseSection({ 'autoCommit': false, 'todayValid': false }, 1, M_Init._dateChoose.begin, M_Init._dateChoose.end, function(begin, end) {
                if (begin != M_Init._dateCache.begin || M_Init._dateCache.end != end) {
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_LostAnalysis_Info._getInfo();
                }
            });

        }
    }
}
var F_LostAnalysis_Info = {
    _tab: ['活跃玩家', '付费玩家'],
    _init: [
        { 'type': 'togetherTab', 'name': '每日流失统计', 'tab': ['7日流失率', '14日流失率', '30日流失率'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内，当日登录过游戏但之后连续7日不登录的玩家占当日该类玩家比例', '所选时期内，当日登录过游戏但之后连续14日不登录的玩家占当日该类玩家比例 ', '所选时期内，当日登录过游戏但之后连续30日不登录的玩家占当日该类玩家比例'] }] },
        { 'type': 'togetherTab', 'name': '每日回流统计', 'tab': ['7日回流人数', '14日回流人数', '30日回流人数'], 'tips': [{}, { 'position': 'second', 'content': ['所选时期内，之前连续超过7日不登录，但在当日回归的玩家数', '所选时期内，之前连续超过14日不登录，但在当日回归的玩家数', '所选时期内，之前连续超过30日不登录，但在当日回归的玩家数'] }] }
    ],
    _port: [
        [
            [
                [{ 'name': '7日流失率', 'key': 'axis_lost|y_axis_active_lost_rate_7d' }],
                [{ 'name': '7日流失率', 'key': 'axis_lost|y_axis_paid_lost_rate_7d' }]
            ],
            [
                [{ 'name': '14日流失率', 'key': 'axis_lost|y_axis_active_lost_rate_14d' }],
                [{ 'name': '14日流失率', 'key': 'axis_lost|y_axis_paid_lost_rate_14d' }]
            ],
            [
                [{ 'name': '30日流失率', 'key': 'axis_lost|y_axis_active_lost_rate_30d' }],
                [{ 'name': '30日流失率', 'key': 'axis_lost|y_axis_paid_lost_rate_30d' }]
            ]
        ],
        [
            [
                [{ 'name': '7日回流人数', 'key': 'axis_back|y_axis_active_back_num_7d' }],
                [{ 'name': '7日回流人数', 'key': 'axis_back|y_axis_paid_back_num_7d' }]
            ],
            [
                [{ 'name': '14日回流人数', 'key': 'axis_back|y_axis_active_back_num_14d' }],
                [{ 'name': '14日回流人数', 'key': 'axis_back|y_axis_paid_back_num_14d' }]
            ],
            [
                [{ 'name': '30日回流人数', 'key': 'axis_back|y_axis_active_back_num_30d' }],
                [{ 'name': '30日回流人数', 'key': 'axis_back|y_axis_paid_back_num_30d' }]
            ]
        ]
    ],
    _domInit: function() {
        $('#headerTop .fl').remove();
        //M_Inside._htmlHeadTab(F_LostAnalysis_Info._tab, 'lostanalysis');
        var dataUnion = [];
        var dataChoosed = {};
        for(var i=0;i<F_LostAnalysis_Info._tab.length;i++){
            if(i==0)dataChoosed = {id:i,name:F_LostAnalysis_Info._tab[i]};
            dataUnion.push({id:i,name:F_LostAnalysis_Info._tab[i]});
        }
        var str = M_Inside._dropHtml('bs_drop_user_type','选择分析对象',dataChoosed,dataUnion);
        $('#headerTop').prepend(str);
        M_Inside._dropShow('tg-selected-drop');
        M_Inside._dropSelected(function (select,position) {
            M_Init._dataCache['tabIndex'] = select;
            F_LostAnalysis_Info._formatInfo();
        },'tg-selected-drop');
        M_Inside._dropLeave('tg-selected-drop');

        M_Inside._htmlChartTable($('#ct_main_area'), F_LostAnalysis_Info._init);
        M_Inside._downloadCsv();
        F_LostAnalysis_Info._getInfo();
    },
    _getInfo: function() {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for (var i = 0; i < F_LostAnalysis_Info._init.length; i++) {
            domChart.push('bs_chart_' + i + '_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerLostAnalysis'], 'get', true, postData, function() {
            for (var i = 0; i < domChart.length; i++) {
                $('#' + domChart[i]).html(B_Pre._loading());
            }
        }, function() {
            for (var i = 0; i < domChart.length; i++) {
                $('#' + domChart[i]).html('');
            }
        }, function(data, msg) {
            if (data) {
                M_Init._dataCache['tabIndex'] = 0;
                M_Init._dataCache['data'] = data;
                F_LostAnalysis_Info._formatInfo();
            }
        }, function(data, msg, code) {
            for (var i = 0; i < domChart.length; i++) {
                $('#' + domChart[i]).html(B_Pre._empty(msg));
            }
        })
    },
    _formatInfo: function() {
        for (var i = 0; i < F_LostAnalysis_Info._init.length; i++) {
            if (!M_Init._dataCache['position_' + i]) M_Init._dataCache['position_' + i] = 0;
            for (var d = 0; d < F_LostAnalysis_Info._init[i].tab.length; d++) {
                if (M_Init._dataCache['position_' + i] == d) {
                    F_LostAnalysis_Info._chartHtml(i, d);
                    M_Inside._chartTableIcon(F_LostAnalysis_Info._init[i].type, i, d);
                    break;
                }
            }
            M_Inside._tabChangePerChart(i, F_LostAnalysis_Info._init[i].type, 'lostAnalysis');
        }
    },
    _chartHtml: function(domBig, domSmall) {
        if (!M_Init._dataCache['tabIndex']) M_Init._dataCache['tabIndex'] = 0;
        M_Init._dataCache['position_' + domBig] = domSmall;
        var data = M_Init._dataCache['data'];
        var chartDataPre = { x_axis: [], y_axis: [], yFormat: '' };
        var tableData = {};
        var chartType = 50;
        var tableUnit = '';
        switch (domBig + '') {
            case '0':
                chartDataPre.xFormatDate = true;
                chartDataPre.yFormat = '%';
                chartDataPre.tooltip = { 'num': 1, 'unit': '%' };
                tableUnit = '%';
                break;
            case '1':
                chartDataPre.xFormatDate = true;
                chartDataPre.yFormat = '';
                chartDataPre.tooltip = { 'num': 1, 'unit': '' };
                tableUnit = '';
                break;
        }
        switch (domBig + '') {
            case '0':
                switch (domSmall + '') {
                    case '0':
                        tableData = { 'head': ['日期', '7日流失率'], 'body': [] };
                        break;
                    case '1':
                        tableData = { 'head': ['日期', '14日流失率'], 'body': [] };
                        break;
                    case '2':
                        tableData = { 'head': ['日期', '30日流失率'], 'body': [] };
                        break;
                }
                break;
            case '1':
                switch (domSmall + '') {
                    case '0':
                        tableData = { 'head': ['日期', '7日回流人数'], 'body': [] };
                        break;
                    case '1':
                        tableData = { 'head': ['日期', '14日回流人数'], 'body': [] };
                        break;
                    case '2':
                        tableData = { 'head': ['日期', '30日回流人数'], 'body': [] };
                        break;
                }
                break;
        }

        for (var i = 0; i < F_LostAnalysis_Info._port[domBig][domSmall][M_Init._dataCache['tabIndex']].length; i++) {
            var dataKey = F_LostAnalysis_Info._port[domBig][domSmall][M_Init._dataCache['tabIndex']][i].key.split('|');
            var dataName = F_LostAnalysis_Info._port[domBig][domSmall][M_Init._dataCache['tabIndex']][i].name;

            chartType = 50;
            switch (domBig + '') {
                case '0':
                    if (data[dataKey[0]][dataKey[1]]) {
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis;
                        for (var d = 0; d < dataUnion.length; d++) {
                            if (!tableData.body[d]) tableData.body[d] = [data[dataKey[0]].x_axis[d]];
                            tableData.body[d].push(dataUnion[d] + '%');
                        }
                        chartDataPre.y_axis.push({ 'name': dataName, 'data': dataUnion });
                    }
                    break;
                case '1':
                    if (data[dataKey[0]][dataKey[1]]) {
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis;
                        for (var d = 0; d < dataUnion.length; d++) {
                            if (!tableData.body[d]) tableData.body[d] = [data[dataKey[0]].x_axis[d]];
                            tableData.body[d].push(dataUnion[d] );
                        }
                        chartDataPre.y_axis.push({ 'name': dataName, 'data': dataUnion });
                    }
                    break;                    
            }
        }

        tableData.name = M_Inside._tableName(F_LostAnalysis_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;

        M_Init._dataCache[domBig + '_' + domSmall] = tableData;
        M_Inside_Chart._chartData(chartType, 'bs_chart_' + domBig + '_' + domSmall, chartDataPre);
        M_Inside._tableHtml(1, domBig + '_' + domSmall);
    }
}
