var F_Retentioncount_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerRetentionCount'] = 'demoInnerRetentionCount';
                    break;
                default:
                    M_Init._api['innerRetentionCount'] = 'innerRetentionCount';
                    break;
            }
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            M_Common._getOrderGame('retentioncount','','1-3');
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;

                    F_Retentioncount_Info._getInfo();
                }
            });
        }
    }
}
var F_Retentioncount_Info = {
    _init:[
            {'type':'together','name':'新增玩家留存','tab':[],'tips':[{'position':'first','content':'当日新增玩家在次日、7日后、30日后的留存人数占新增玩家的比例'}]},
            {'type':'tableColSpan','name':'自定义留存','tab':[],'tips':[{'position':'first','content':'新增玩家（活跃玩家、付费玩家）在之后第N日（周、月）的留存率（留存人数）'}]}
        ],
    _tab:[
        {'key':'day','name':'每日','tips':''},
        {'key':'week','name':'每周','tips':''},
        {'key':'month','name':'每月','tips':''}
    ],
    _drop:[
        [{'key':'new','name':'新增玩家'},{'key':'active','name':'活跃玩家'},{'key':'paid','name':'付费玩家'}],[{'key':'','name':'留存率'},{'key':'num','name':'留存数'}]
    ],
    _port:[
        [
            [{'name':'次日留存率','key':'game_retention|y_axis_retention_rate_1d'},{'name':'7日留存率','key':'game_retention|y_axis_retention_rate_7d'},{'name':'30日留存率','key':'game_retention|y_axis_retention_rate_30d'}]
        ],
        [
            [{'name':'自定义留存','key':'retention_custom'}]
        ]
    ],
    _domInit:function () {
        M_Inside._htmlChartTable($('#ct_main_area'),F_Retentioncount_Info._init);

        $('#bs_table_1_0').addClass('tableArea-color-change').prepend('<span>玩家样本：所选日期内</span>'+F_Retentioncount_Info._htmlTab()+F_Retentioncount_Info._htmlDrop());

        if(!M_Init._dataCache['SelfDefineSave'])M_Init._dataCache['SelfDefineSave'] = ['day','new',''];

        $('#bs_table_1_0 .tg-tab-btn li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('tg-tab-btn-selected')){
                    $(this).addClass('tg-tab-btn-selected').siblings('li').removeClass('tg-tab-btn-selected');
                    M_Init._dataCache['SelfDefineSave'][0] = $(this).attr('data-i');
                    F_Retentioncount_Info._chartHtml(1,0);
                }
            });
        });
        F_Retentioncount_Info._dropSelect('tg-selected-drop-0',1);
        F_Retentioncount_Info._dropSelect('tg-selected-drop-1',2);

        M_Inside._dropShow();
        M_Inside._dropLeave();

        F_Retentioncount_Info._getInfo();
        M_Inside._downloadCsv();
    },
    _dropSelect:function (selectDom,index) {
        $("#"+selectDom+" ul li a").click(function() {
            var txt = $(this).text();
            var key = $(this).attr('data-i');
            var current = $(this).parents('.tg-selected-drop').find('p span').attr('data-i');
            $(this).parents('.tg-selected-drop').find('p span').html(txt).attr('data-i', key);
            $(this).parents('.tg-selected-drop').children('ul').hide();
            if(current != key){
                M_Init._dataCache['SelfDefineSave'][index] = key;
                F_Retentioncount_Info._chartHtml(1,0);
            }
        });
    },
    _htmlTab:function () {
        var str = '';
        str += '<ul class="tg-tab-btn fl">';
        for(var i=0;i<F_Retentioncount_Info._tab.length;i++){
            str += '<li class="tg-tab-btn-normal tip-hover';
            if(i==0)str += ' tg-tab-btn-selected';
            str += '" data-i="'+F_Retentioncount_Info._tab[i].key+'">'+F_Retentioncount_Info._tab[i].name;
            if(F_Retentioncount_Info._tab[i].tips){
                str += '<div class="tip-box-show">';
                str += '<i class="triangle-up"></i>';
                str += '<div class="tip-box-content">';
                str += F_Retentioncount_Info._tab[i].tips;
                str += '</div>';
                str += '</div>';
            }
            str += '</li>';
        }
        str += '</ul>';

        return str;
    },
    _htmlDrop:function () {
        var str = '';
        for(var i=0;i<F_Retentioncount_Info._drop.length;i++) {
            str += '<div class="tg-selected-drop" id="tg-selected-drop-'+i+'">';
            for (var d = 0; d < F_Retentioncount_Info._drop[i].length; d++) {
                if (d == 0) {
                    str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span data-i="' + F_Retentioncount_Info._drop[i][d].key + '" >' + F_Retentioncount_Info._drop[i][d].name + '</span></p><ul>';
                }
                str += '<li><a data-i="' + F_Retentioncount_Info._drop[i][d].key + '">' + F_Retentioncount_Info._drop[i][d].name + '</a></li>';
            }
            str += '</ul></div>';
        }
        return str;
    },
    _getInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domChart = [];
        for(var i=0;i<F_Retentioncount_Info._init.length;i++){
            domChart.push('bs_chart_'+i+'_0');
        }
        var postData = {};
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerRetentionCount'],'get',true,postData,function(){
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
                for(var i=0;i<F_Retentioncount_Info._init.length;i++){
                    F_Retentioncount_Info._chartHtml(i,'0',data);
                    M_Inside._chartTableIcon(F_Retentioncount_Info._init[i].type,i,'0');
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
        var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true,yFormat:''};
        var tableUnit = '';
        var tableData = {'head':[],'body':[]};
        switch(domBig+''){
            case '0':
                chartDataPre.yFormat = '%';
                chartDataPre.tooltip = {'num':3,'unit':'%'};
                tableUnit = '%';

                tableData = {'head':['日期'],'body':[]};
                break;
        }
        for(var i=0;i<F_Retentioncount_Info._port[domBig][domSmall].length;i++){
            var dataKey = F_Retentioncount_Info._port[domBig][domSmall][i].key.split('|');
            var dataName = F_Retentioncount_Info._port[domBig][domSmall][i].name;

            switch(domBig+''){
                case '0':
                    if(data[dataKey[0]][dataKey[1]]){
                        tableData.head.push(dataName);
                        var dataUnion = data[dataKey[0]][dataKey[1]];
                        chartDataPre.x_axis = data[dataKey[0]].x_axis;
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [data[dataKey[0]].x_axis[d]];
                            if(tableUnit != '%') {
                                tableData.body[d].push(dataUnion[d]);
                            }else{
                                tableData.body[d].push(dataUnion[d] + tableUnit);
                            }
                        }
                        chartDataPre.y_axis.push({'name':dataName,'data':dataUnion});
                    }
                    break;
                case '1':
                    var index = 'retention_custom'+'_'+M_Init._dataCache['SelfDefineSave'][0];
                    if(M_Init._dataCache['SelfDefineSave'][2]){
                        index += '_'+M_Init._dataCache['SelfDefineSave'][2];
                    }
                    if(M_Init._dataCache['SelfDefineSave'][2] != 'num') {
                        tableUnit = '%';
                    }
                    switch(M_Init._dataCache['SelfDefineSave'][0]+''){
                        case 'day':
                            tableData = {'colspan':'第N天后留存玩家','head':['首次使用日期','','1天后','2天后','3天后','4天后','5天后','6天后','7天后','14天后','30天后'],'body':[]};
                            break;
                        case 'week':
                            tableData = {'colspan':'第N周后留存玩家','head':['首次使用日期','','1周后','2周后','3周后','4周后','5周后','6周后','7周后','8周后','9周后'],'body':[]};
                            break;
                        case 'month':
                            tableData = {'colspan':'第N月后留存玩家','head':['首次使用日期','','1月后','2月后','3月后','4月后','5月后','6月后','7月后','8月后','9月后'],'body':[]};
                            break;
                    }
                    switch(M_Init._dataCache['SelfDefineSave'][1]+''){
                        case 'new':
                            tableData.head[1] = '新增玩家数';
                            break;
                        case 'active':
                            tableData.head[1] = '活跃玩家数';
                            break;
                        case 'paid':
                            tableData.head[1] = '付费玩家数';
                            break;
                    }
                    if(data[dataKey[0]] && data[dataKey[0]][index] && data[dataKey[0]][index][M_Init._dataCache['SelfDefineSave'][1]]){
                        var dataUnion = data[dataKey[0]][index][M_Init._dataCache['SelfDefineSave'][1]];
                        for(var d=0;d<dataUnion.length;d++){
                            if(!tableData.body[d])tableData.body[d] = [dataUnion[d]['data_date']];
                            tableData.body[d].push(dataUnion[d].user_num);
                            switch(M_Init._dataCache['SelfDefineSave'][0]+''){
                                case 'day':
                                    tableData.body[d].push(dataUnion[d].rate_1d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_2d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_3d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_4d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_5d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_6d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_7d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_14d+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_30d+tableUnit);
                                    break;
                                case 'week':
                                    tableData.body[d].push(dataUnion[d].rate_1w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_2w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_3w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_4w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_5w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_6w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_7w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_8w+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_9w+tableUnit);
                                    break;
                                case 'month':
                                    tableData.body[d].push(dataUnion[d].rate_1m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_2m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_3m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_4m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_5m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_6m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_7m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_8m+tableUnit);
                                    tableData.body[d].push(dataUnion[d].rate_9m+tableUnit);
                                    break;
                            }
                        }
                    }
                    break;
            }
        }

        tableData.name = M_Inside._tableName(F_Retentioncount_Info._init,domBig,domSmall,M_Init._dateCache.begin,M_Init._dateCache.end);

        M_Init._dataCache[domBig+'_'+domSmall] = tableData;
        switch(domBig+''){
            case '0':
                M_Inside_Chart._chartData(50,'bs_chart_'+domBig+'_'+domSmall,chartDataPre);
                break;
        }
        M_Inside._tableHtml(1,domBig+'_'+domSmall);
    }
}