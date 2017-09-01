var F_Log_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(4);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerLogChart'] = 'demoInnerLogChart';
                    M_Init._api['innerLogType'] = 'demoInnerLogType';
                    M_Init._api['innerLogMeta'] = 'demoInnerLogMeta';
                    M_Init._api['innerLogSearch'] = 'demoInnerLogSearch';
                    M_Init._api['innerSearchCsv'] = 'demoInnerSearchCsv';
                    break;
                default:
                    M_Init._api['innerLogChart'] = 'innerLogChart';
                    M_Init._api['innerLogType'] = 'innerLogType';
                    M_Init._api['innerLogMeta'] = 'innerLogMeta';
                    M_Init._api['innerLogSearch'] = 'innerLogSearch';
                    M_Init._api['innerSearchCsv'] = 'innerSearchCsv';
                    break;
            }
            M_Init._gameIdRight = 4;
            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;
            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;
                    for(var i=0;i<M_Init._dataCache['tabCount'];i++){
                        $('#bs_chart_'+i).html('');
                        F_Log_Chart._getChartInfo();
                    }
                }
            });
            M_Init._dataCache['tabCount'] = 0;
            M_Init._dataCache['tags'] = {};
            M_Init._dataCache['tagsList'] = {};
            M_Init._dataCache['searchRank'] = '';

            M_Common._getOrderGame('log','','8-4');
        }
    }
}
var F_Log_Chart = {
    _getChartInfo:function () {
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;
        var domId = 'bs_chart_'+M_Init._dataCache['tabId'];
        var domChart = $('#'+domId);
        var postData = {};
        postData['type'] = M_Init._dataCache['tabName'];
        postData['start_date'] = begin;
        postData['end_date'] = end;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerLogChart'],'get',true,postData,function(){
            domChart.html(B_Pre._loading());
        },function(){
            domChart.html('');
        },function(data,msg){
            if(data){
                var dateArr = B_Date._dateArray(begin,end);
                var chartData = {};
                var fixDate = [];
                var chartDataPre = {x_axis:[],y_axis:[{'name':'数量','data':[]}]};
                $.each(dateArr,function (key,value) {
                    chartDataPre.x_axis.push(value.small);
                    chartDataPre.y_axis[0].data.push(0);
                    fixDate.push(value.big);
                });
                for(var i=0;i<data.length;i++){
                    var index = $.inArray(data[i].data_date,fixDate);
                    if(index > -1){
                        chartDataPre.y_axis[0].data[index] = data[i].log_num;
                    }
                }
                M_Inside_Chart._chartData(40,domId,chartDataPre);
            }
        },function(data,msg,code){
            domChart.html(B_Pre._empty(msg));
        })
    }
}
var F_Log_Tab = {
    _getTab:function () {
        $('#tab_list_li').html('');
        $('#lt_main_area').html('');
        var postData = {};
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerLogType'],'get',true,postData,function (){
            B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        },function () {
            B_Pop._init('close');
        },function(data,msg){
            if(data && data.length >0){
                $('#tab_list_li').html(F_Log_Tab._htmlTab(data));
                M_Inside._tabChoose('log');
                F_Log_Search._getSearchMeta();
                F_Log_Chart._getChartInfo();
            }
        },function(data,msg,code){
            B_Pop._init('msg',{'content':msg});
        })
    },
    _htmlTab:function (data) {
        var str = '';
        var area = '';
        M_Init._dataCache['tabCount'] = data.length;
        for(var i=0;i<data.length;i++){
            M_Init._dataCache['tags'][data[i].table_name] = [];
            M_Init._dataCache['tagsList'][data[i].table_name] = [];
            area += F_Log_Tab._htmlArea(i,data[i].table_desc);
            str += '<li data-i="'+i+'" data-w="'+data[i].table_name+'"';
            if(i==0){
                str += ' class="tg-tab-active"';
                M_Init._dataCache['tabId'] = 0;
                M_Init._dataCache['tabName'] = data[i].table_name;
            }
            str += '>'+data[i].table_desc+'</li>';
        }
        $('#lt_main_area').html(area);
        return str;
    },
    _htmlArea:function (number,name) {
        var str = '<div id="lt_content_'+number+'" class="';
        str += number==0 ? '' : ' b_none';
        str += '">';
        str += '<div class="graph-show-part cs_chart_log" id="bs_chart_'+number+'"></div>';
        str += '<div class="tg-table-wrap"><div class="tg-select-filter"></div>';
        str += '<div class="table-out-wrap"><table class="tg-table table table-bordered"><thead class="boxshadow"></thead><tbody></tbody></table></div>';
        str += '<ul class="tg-page-list" id="bs_page_'+(number+1)+'"></ul>';
        str += '</div></div>';

        return str;
    }
}
var F_Log_Search = {
    _getSearchMeta:function () {
        var domContent = $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-select-filter');
        var postData = {};
        postData['type'] = M_Init._dataCache['tabName'];
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerLogMeta'],'get',true,postData,function () {
                domContent.html(B_Pre._loading());
            },function () {
                domContent.html('');
            },function(data,msg){
                if(data && data.length >0){
                    var str = '';
                    for(var i=0;i<data.length;i++){
                        str += M_Inside._htmlMeta(M_Init._dataCache['tabName'],data[i].search_type,data[i].column_name,data[i].column_desc);
                    }
                    str += '<div><button class="tg-main-btn bs_btn_search">查找</button><button class="tg-assist-btn bs_btn_reset">重置</button></div>';

                    domContent.html(str);

                    M_Inside._dropShow();
                    M_Inside._dropSelected();
                    M_Inside._dropLeave();

                    $('.bs_btn_search').click(function () {
                        F_Log_Search._getDetail(1);
                    })
                    $('.bs_btn_reset').click(function () {
                        M_Inside._resetMeta('log');
                    })

                    $('#bs_btn_down').click(function () {
                        var postData = [];
                        postData.push('type='+M_Init._dataCache['tabName']);
                        postData.push('service_id='+M_Init._gameIdRight);
                        postData.push('game_id='+M_Init._gameId);
                        var condition = '';
                        var searchCondition = M_Inside._getSearchTag();
                        if(searchCondition != ''){
                            condition = postData.join('&')+'&'+searchCondition;
                        }else{
                            condition = postData.join('&');
                        }
                        B_Jump._go('openUrl',B_Port._init(M_Init._api['innerSearchCsv'])+'?'+condition+'&excel_name='+B_Common._encodeUrl('海量日志搜索'));
                    });
                }
                F_Log_Search._getDetail(1);
            },function(data,msg,code){
                domContent.html(B_Pre._empty(msg));
            }
        )
    },
    _getDetail:function (page) {
        B_Page._size = 10;
        var postData = {};
        postData['type'] = M_Init._dataCache['tabName'];
        postData['game_id'] = M_Init._gameId;
        postData['index'] = (page-1)*B_Page._size;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);

        var condition = '';
        var searchCondition = M_Inside._getSearchTag();
        if(searchCondition != ''){
            condition = postData+'&'+searchCondition;
        }else{
            condition = postData;
        }
        var rankCondition = M_Init._dataCache['searchRank'];
        if(rankCondition != ''){
            condition += '&'+rankCondition;
        }
        var domTableList = $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table tbody');
        var domPageList = $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-page-list')
        B_Port._ajax(M_Init._api['innerLogSearch'],'get',true,condition,function () {
                domTableList.html(B_Pre._loading()+'<tr class="empty"></tr>');
            },function () {
                domTableList.html('');
            },function(data,msg){
                if(data.list && data.list.length >0){
                    domTableList.html(F_Log_Search._htmlList(data.list));
                    domPageList.html(B_Page._show({total:data.total,page:page},'number'));
                    B_Page._click(page,function (page) {
                        F_Log_Search._getDetail(page);
                    },(parseInt(M_Init._dataCache['tabId'])+1));

                    M_Dom._trSelected();
                }else{
                    domTableList.html(B_Pre._empty('暂无数据')+'<tr class="empty"></tr>');
                    domPageList.html('');
                }
            },function(data,msg,code){
                domPageList.html('');
                switch(code+''){
                    case '-1004':
                        msg = '参数错误';
                        break;
                }
                domTableList.html(B_Pre._empty(msg)+'<tr class="empty"></tr>');
            }
        )
    },
    _htmlList:function (data) {
        var str = '';
        var tagLength = M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']].length;
        for(var i=0;i<data.length;i++){
            var thStr = '<tr>';
            var tdStr = '<tr>';
            for(var n=0;n<tagLength;n++){
                if(i==0 && $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead').html() == ''){
                    var headName = M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].name;
                    if(M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].type == 'span')headName += '<i data-i="'+M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].key+'" class="tg-icon tg-sort-icon arrow-down"></i>';
                    thStr += '<th>'+headName+'</th>';
                }
                tdStr += '<td>'+data[i].source[M_Init._dataCache["tagsList"][M_Init._dataCache["tabName"]][n].key]+'</td>';
            }

            tdStr += '</tr>';
            str += tdStr;

            if(i==0 && $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead').html() == ''){
                thStr += '</tr>';
                $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead').html(thStr);
                $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead i').each(function (index) {
                    $(this).click(function () {
                        var orderStr = {};
                        orderStr['order_by_field'] = $(this).attr('data-i');
                        if ($(this).hasClass('arrow-down')) {
                            orderStr['order_type'] = 'asc';
                            $('.listContent'+M_Init._dataCache['tabId']+' .table-part thead i').each(function () {
                                $(this).addClass('arrow-down').removeClass('arrow-up');
                            });
                            $(this).removeClass('arrow-down').addClass('arrow-up');
                        } else {
                            orderStr['order_type'] = 'desc';
                            $(this).addClass('arrow-down').removeClass('arrow-up');
                        }
                        M_Init._dataCache['searchRank'] = B_Common._postData(orderStr);
                        F_Log_Search._getDetail(1);
                    });
                });
            }
        }
        return str;
    }
}