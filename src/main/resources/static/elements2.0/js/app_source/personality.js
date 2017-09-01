var F_Personality_Entrance = {
    _init:function (typeId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);

        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerOperationPage'] = 'demoInnerOperationPage';
                    break;
                default:
                    M_Init._api['innerOperationPage'] = 'innerOperationPage';
                    break;
            }
            if(!typeId){
                M_Common._menuUrlInit();
            }else{
                var type = typeId.toString().split('-');
                M_Init._gameIdRight = type[type.length-1];
            }

            M_Common._getOrderGame('personality','','10-'+typeId);

            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;
                    M_Init._isUseKeywordReset = true;
                    F_Personality_Info._domInit();
                }
            });
            /*
             M_Init._dateCache.begin = 1;
            $('#headerTop').html('');
            var dateChooseHtml = '\
                <div class="tg-date-selected-drop fr">\
                    <div><i class="tg-icon tg-date-icon"></i><span>日期</span></div>\
                    <div class="tg-date-drop">\
                        <p class="tg-drop-text-part">\
                            <i class="tg-graph tg-triangle-gray-bottom"></i><span data-i="1">1周前</span>\
                        </p>\
                        <ul style="display: none;">\
                            <li><a data-i="1">1周前</a></li>\
                            <li><a data-i="2">2周前</a></li>\
                            <li><a data-i="3">3周前</a></li>\
                            <li><a data-i="4">4周前</a></li>\
                            <li><a data-i="5">5周前</a></li>\
                            <li><a data-i="6">6周前</a></li>\
                            <li><a data-i="7">7周前</a></li>\
                        </ul>\
                    </div>\
                 </div>';

            $('#headerTop').append(dateChooseHtml);

            M_Inside._dropShow('tg-date-drop');
            M_Inside._dropSelected(function (select,position) {
                M_Init._dateCache.begin = select;
                M_Init._isUseKeywordReset = true;
                F_Personality_Info._domInit();
            },'tg-date-drop');
            M_Inside._dropLeave('tg-date-drop');
            */
        }
    }
}

var F_Personality_Info = {
    _domInit:function () {
        F_Personality_Info._getInfo();
    },
    _getInfo:function () {
        M_Init._dataCache['init'] = [];
        M_Init._dataCache['port'] = [];
        M_Init._dataCache['select'] = [];

        //var date_span = M_Init._dateCache.begin;
        var postData = {};
        postData['menu_id'] = M_Init._gameIdRight;
        postData['start_date'] = M_Init._dateCache.begin ? M_Init._dateCache.begin : M_Init._dateChoose.begin;
        postData['end_date'] = M_Init._dateCache.end ? M_Init._dateCache.end : M_Init._dateChoose.end;
        //postData['date_span'] = date_span;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationPage'], 'get', true, postData, function() {
            B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        }, function() {
            B_Pop._init('close');
        }, function(data, msg) {
            if (data && data.length > 0) {
                for(var i=0;i<data.length;i++){
                    var item = {name:data[i].name,type:'',tab:[],tips:[]};
                    var port = [];
                    var table = {head:[],body:[]};
                    var length = data[i].data.length;

                    for(var d=0;d<data[i].data.length;d++){
                        var portItem = [];
                        switch(data[i].data[d].chart_type+''){
                            case '6':
                                item.type = 'tableColSpan20';
                                if(item.tips.length == 0){
                                    item.tips.push({'position':'first','content':data[i].data[d].chart_explain});
                                }
                                portItem.push({
                                    'chart':data[i].data[d].chart_type,
                                    'x': data[i].data[d].data.item,
                                    'y': data[i].data[d].data.data
                                });
                                break;
                            default:
                                item.type =  length > 1 ? 'togetherTab20' : 'together20';
                                item.tab.push(data[i].data[d].name);
                                if(item.tips.length == 0){
                                    item.tips.push({});
                                    item.tips.push({'position':'second','content':[]});
                                }
                                item.tips[1].content.push(data[i].data[d].chart_explain);

                                var xName = '';
                                switch(data[i].data[d].chart_type+''){
                                    case '8':
                                        if(!M_Init._dataCache['select'][i])M_Init._dataCache['select'][i] = [];
                                        if(!M_Init._dataCache['select'][i][d])M_Init._dataCache['select'][i][d] = [];
                                        $.each(data[i].data[d].data,function (key,value) {
                                            xName = value.x_name ? value.x_name : '-';
                                            M_Init._dataCache['select'][i][d].push({'name':key});
                                            $.each(value,function (key1,value1) {
                                                if(!(key1 == 'x_axis' || key1 == 'x_name')){
                                                    portItem.push({
                                                        'chart':data[i].data[d].chart_type,
                                                        'unit':'',
                                                        'name': key1,
                                                        'y': value1.y_axis,
                                                        'x': value.x_axis,
                                                        'xName': xName,
                                                        'yName': value1.y_name ? value1.y_name : key1,
                                                        'parent':key
                                                    });
                                                }
                                            });
                                        });
                                        break;
                                    default:
                                        xName = data[i].data[d].data.x_name ? data[i].data[d].data.x_name : '-';
                                        if(data[i].data[d].data && data[i].data[d].data.item){
                                            for(var e=0;e<data[i].data[d].data.item.length;e++){
                                                if(data[i].data[d].data[data[i].data[d].data.item[e]].y_name){
                                                    portItem.push({
                                                        'chart':data[i].data[d].chart_type,
                                                        'unit':data[i].data[d].data[data[i].data[d].data.item[e]].y_unit,
                                                        'name': data[i].data[d].data.item[e],
                                                        'y': data[i].data[d].data[data[i].data[d].data.item[e]].y_axis,
                                                        'xName': xName,
                                                        'yName': data[i].data[d].data[data[i].data[d].data.item[e]].y_name,
                                                        'x': data[i].data[d].data.x_axis
                                                    });
                                                }else{
                                                    portItem.push({
                                                        'chart':data[i].data[d].chart_type,
                                                        'unit':data[i].data[d].data[data[i].data[d].data.item[e]].y_unit,
                                                        'name': data[i].data[d].data.item[e],
                                                        'y': data[i].data[d].data[data[i].data[d].data.item[e]].y_axis,
                                                        'xName': xName,
                                                        'yName': '',
                                                        'x': data[i].data[d].data.x_axis
                                                    });
                                                }
                                            }
                                        }
                                        break;
                                }
                                break;
                        }
                        port.push(portItem);
                    }
                    M_Init._dataCache['init'].push(item);
                    M_Init._dataCache['port'].push(port);
                }
                F_Personality_Info._formatData();
            }
        }, function(data, msg, code) {
            B_Pop._init('msg',{content:msg});
        })
    },
    _formatData:function () {
        if($('#ct_main_area').html() == ''){
            M_Inside._htmlChartTable($('#ct_main_area'), M_Init._dataCache['init']);
            M_Inside._downloadCsv();
        }
        var initData = M_Init._dataCache['init'];
        for (var i = 0; i < initData.length; i++) {
            if (initData[i].tab.length > 0) {
                if (!M_Init._dataCache['position_' + i]) M_Init._dataCache['position_' + i] = 0;
                for (var d = 0; d < initData[i].tab.length; d++) {
                    if (M_Init._dataCache['position_' + i] == d) {
                        F_Personality_Info._chartHtml(i, d);
                        M_Inside._chartTableIcon(initData[i].type, i, d);
                        break;
                    }
                }
                M_Inside._tabChangePerChart(i, initData[i].type, 'personality');
            } else {
                F_Personality_Info._chartHtml(i, '0');
                M_Inside._chartTableIcon(initData[i].type, i, '0');
            }
        }
    },
    _chartHtml:function (domBig,domSmall,domSelect) {
        if(M_Init._dataCache['select'] && M_Init._dataCache['select'][domBig]){
            if(M_Init._dataCache['position_'+domBig] != domSmall || M_Init._isUseKeywordReset){
                $("#bs_tab_select_"+domBig).remove();
                M_Init._isUseKeywordReset = false;
            }
            if(M_Init._dataCache['select'][domBig][domSmall]){
                if($("#bs_tab_select_"+domBig).length <= 0){
                    var data = M_Init._dataCache['select'][domBig][domSmall];
                    var selectStr = '<div class="chart-wrap-drop" id="bs_tab_select_'+domBig+'">';
                    var label = '';
                    for(var i=0;i<data.length;i++){
                        var selectItemSplit = data[i].name.split(':');
                        if(i == 0){
                            if(selectItemSplit.length > 1){
                                label = selectItemSplit[1];
                            }
                            selectStr += '<span>'+label+'</span><div class="tg-selected-drop">';
                            selectStr += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span id="tabSelect" data-i="'+data[i].name+'" data-d="'+domBig+'-'+domSmall+'">'+selectItemSplit[0]+'</span></p>';
                            domSelect = data[i].name;
                            selectStr += '<ul style="display: none;">';
                        }
                        selectStr += '<li><a data-i="'+data[i].name+'">'+selectItemSplit[0]+'</a></li>';
                    }
                    selectStr += '</ul></div></div>';

                    $('#lt_main_area_'+domBig+'_0').prepend(selectStr);

                    M_Inside._dropShow();
                    M_Inside._dropSelected(function (select,position) {
                        position = position.split('-');
                        F_Personality_Info._chartHtml(position[0],position[1],select);
                    });
                    M_Inside._dropLeave();
                }
            }
        }

        M_Init._dataCache['position_'+domBig] = domSmall;

        var portData = M_Init._dataCache['port'][domBig][domSmall];
        if(domSelect){
            var portFormatData = [];
            for(var i=0;i < portData.length;i++){
                if(portData[i].parent && portData[i].parent == domSelect){
                    portFormatData.push(portData[i]);
                }
            }
            portData = portFormatData;
        }

        var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:false,yFormat:'',legendSelectMode:false};
        var tableData = {'head':[],'body':[]};
        var chartType = 0;
        var tableUnit = '';

        chartDataPre.tooltip = {'num':0,'unit':[]};

        for(var i=0;i< portData.length;i++){
            switch(portData[i].chart+''){
                case '2':
                case '3':
                case '4':
                case '8':
                    switch(portData[i].chart+''){
                        case '2':
                            chartType = 20;
                            break;
                        case '3':
                            chartType = 50;
                            break;
                        case '4':
                        case '8':
                            chartType = 40;
                            break;
                    }
                    chartDataPre.tooltip.num += 1;
                    chartDataPre.tooltip.unit.push(portData[i].unit);
                    chartDataPre.yFormat = portData[i].unit;
                    chartDataPre.x_axis = portData[i].x;
                    var length = portData[i].y.length;
                    if(length > 1)chartDataPre.legendSelectMode = true;
                    /**/
                    if(tableData.head.length == 0)tableData.head.push(portData[i].xName);
                    tableData.head.push(portData[i].yName);
                    for (var d = 0; d < length; d++) {
                        if (!tableData.body[d])tableData.body[d] = [portData[i].x[d]];
                        if (portData[i].unit != '%') {
                            tableData.body[d].push(portData[i].y[d]);
                        } else {
                            tableData.body[d].push(portData[i].y[d] + '%');
                        }
                    }
                    /**/
                    chartDataPre.y_axis.push({ 'name': portData[i].name, 'data': portData[i].y});
                    break;
                case '6':
                    var xLength = portData[i].x.length;
                    var yLength = portData[i].y.length;
                    var hasRowSpan = false;
                    var xUnit = '';
                    var xUnitSplit = [];
                    var tableHeadData = [];
                    var tableHeadArr = [];
                    var tableParentName = '';
                    var tableChildName = '';
                    var tableHeadStr = '';
                    var tableHeadStr1 = '';
                    var tableHeadStr2 = '';
                    var tableHeadRank = [];

                    for(var f=0; f < xLength; f++){
                        xUnitSplit = portData[i].x[f].toString().split(',');
                        switch(xUnitSplit.length+''){
                            case '1':
                                xUnit = '';
                                tableParentName = xUnitSplit[0];
                                tableChildName = '';
                                break;
                            case '2':
                                xUnit = xUnitSplit[0];
                                tableParentName = xUnitSplit[1];
                                tableChildName = '';
                                break;
                            case '3':
                                hasRowSpan = true;
                                xUnit = xUnitSplit[0];
                                tableParentName = xUnitSplit[2];
                                tableChildName = xUnitSplit[1];
                                break;
                        }
                        if(!tableHeadData[tableParentName]){
                            tableHeadArr.push({'name':tableParentName});
                            tableHeadData[tableParentName] = {'field':'','unit':'','child':[]};
                        }
                        if(tableChildName != ''){
                            tableHeadData[tableParentName].child.push({'field':portData[i].x[f],'unit':xUnit,'name':tableChildName});
                        }else{
                            tableHeadData[tableParentName].field = portData[i].x[f];
                            tableHeadData[tableParentName].unit = xUnit;
                        }
                    }
                    tableHeadStr1 += '<tr>';
                    tableHeadStr2 += hasRowSpan ? '<tr>' : '';
                    for(var e=0; e < tableHeadArr.length; e++){
                        var tableHeadColLength = tableHeadData[tableHeadArr[e]['name']].child.length;
                        if(tableHeadColLength > 0){
                            tableHeadStr1 += '<td colspan="'+tableHeadColLength+'">'+tableHeadArr[e]['name']+'</td>';
                            for(var f=0;f<tableHeadColLength;f++){
                                tableHeadStr2 += '<td>'+tableHeadData[tableHeadArr[e]['name']].child[f].name+'</td>';
                                tableHeadRank.push({'name':tableHeadArr[e]['name']+'-'+tableHeadData[tableHeadArr[e]['name']].child[f].name,'field':tableHeadData[tableHeadArr[e]['name']].child[f].field,'unit':tableHeadData[tableHeadArr[e]['name']].child[f].unit});
                            }
                        }else{
                            tableHeadStr1 += hasRowSpan ? '<td rowspan="2">' : '<th>';
                            tableHeadStr1 += tableHeadArr[e]['name'];
                            tableHeadStr1 += hasRowSpan ? '</td>' : '</th>';
                            tableHeadRank.push({'name':tableHeadArr[e]['name'],'field':tableHeadData[tableHeadArr[e]['name']].field,'unit':tableHeadData[tableHeadArr[e]['name']].unit});
                        }
                    }
                    tableHeadStr2 += '</tr>';
                    tableHeadStr2 += hasRowSpan ? '</tr>' : '';
                    tableData.formatHead = tableHeadStr1+tableHeadStr2;
                    for (var d = 0; d < yLength; d++) {
                        tableData.body[d] = [];
                        for(var e=0; e < tableHeadRank.length; e++){
                            if(d==0)tableData.head.push(tableHeadRank[e].name);
                            if (tableHeadRank[e].unit != '%') {
                                tableData.body[d].push(portData[i].y[d][tableHeadRank[e].field]);
                            } else {
                                tableData.body[d].push(portData[i].y[d][tableHeadRank[e].field] + '%');
                            }
                        }
                    }
                    break;
            }
        }

        tableData.name = M_Inside._tableName(M_Init._dataCache['init'],domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        domSmall = 0;
        var pageSize = 20;
        if(chartType > 0) {
            M_Inside_Chart._chartData(chartType, 'bs_chart_' + domBig + '_' + domSmall, chartDataPre);
            pageSize = 10;
        }else{
            tableData.name = M_Inside._tableName(M_Init._dataCache['init'],domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);
        }

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        M_Inside._tableHtml(1,domBig+'_'+domSmall,pageSize);
        M_Dom._trSelected();
    }
}