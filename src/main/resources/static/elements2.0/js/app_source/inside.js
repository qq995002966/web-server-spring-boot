var M_Inside_Chart = {
    _chartPage:function (page,dom) {
        M_Inside_Chart._chartData(20,dom,M_Init._dataCache[dom],page);
    },
    _chartData:function (type,dom,data,page) {
        var chartDataPre = {
            'color':['#3daae3','#2ed383','#8b5c9b','#f3d049','#476cd0','#3fa553','#524a89','#ec644c'],
            'tooltip':{'trigger':'item'},
            'legend':[],
            'legendSelectMode':false,
            'xAxis':[],
            'yAxis':[
                {
                    splitLine : {
                        lineStyle:{
                            color:'#EEEEEE'
                        }
                    },
                    type : 'value',
                    axisLine:{
                        show : false
                    },
                    axisTick:{
                        show : false
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#333333',
                            fontSize : '11px'
                        }
                    },
                    data:[]
                }
            ],
            'series':[],
            'xType':'category',
            'xAxisLabel':{
                textStyle:{
                    color:'#333333',
                    fontSize : '11px'
                }
            }
        };
        switch(type+''){
            case '2':
            case '20':
                chartDataPre.xType = 'value';
                chartDataPre.tooltip.trigger = 'axis';

                if(data.tooltip){
                    var tooltipStr = '';
                    for(var i=0;i<data.tooltip.num;i++){
                        tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+chartDataPre.color[i]+'"></span>{b}: {c'+i+'}'+data.tooltip.unit+'<br />';
                    }
                    chartDataPre.tooltip.formatter = tooltipStr;
                }
                var xAxis = M_Inside_Chart._chartXAxisReplace(data.x_axis);
                var length = data.x_axis.length;
                if(length > 10){
                    M_Init._dataCache[dom] = data;
                    if(!page)page = 1;
                    var begin = B_Page._size*(page-1);
                    xAxis = xAxis.slice(begin,(begin+B_Page._size));
                    $('#'+dom).html('<div class="area-page-list" id="bs_chart_'+dom+'"></div><ul class="tg-page-list" id="bs_page_'+dom+'"></ul>');
                    $('#bs_page_'+dom).html(B_Page._show({total:length,page:page,dom:dom},'simple'));
                    B_Page._click(page,function (page,dom) {
                        M_Inside_Chart._chartPage(page,dom);
                    },dom);
                    dom = 'bs_chart_'+dom;
                }
                chartDataPre.yAxis[0].type = 'category';
                chartDataPre.yAxis[0].data = xAxis;
                chartDataPre.yAxis[0].inverse = true;
                var dataUnion = data.y_axis;
                var itemLength = dataUnion.length;
                if(itemLength > 1){
                    chartDataPre.tooltip.axisPointerType = 'shadow';
                }
                for(var i=0;i<itemLength;i++){
                    if(itemLength > 1)chartDataPre.legend.push(dataUnion[i].name);
                    if(type+'' == '2')chartDataPre.legend.push(dataUnion[i].name);
                    var yData = dataUnion[i].data
                    if(length > 10){
                        yData = yData.slice(begin,(begin+B_Page._size));
                    }
                    for(var n=0;n<yData.length;n++){
                        yData[n] = parseFloat(yData[n]);
                    }
                    chartDataPre.series.push({
                        name:dataUnion[i].name,
                        type:'bar',
                        barMaxWidth:15,
                        data:yData,
                        itemStyle:{normal:{barBorderRadius:5}}
                    });
                };

                if(data.yFormat){
                    chartDataPre.xAxisLabel.formatter = '{value}'+data.yFormat;
                }
                break;
            case '4':
            case '40':
                chartDataPre.yAxis[0].type = 'value';
                chartDataPre.xType = 'category';
                chartDataPre.legendSelectMode = data.legendSelectMode ? data.legendSelectMode : false;

                if(!chartDataPre.legendSelectMode && data.tooltip){
                    var tooltipStr = '';
                    for(var i=0;i<data.tooltip.num;i++){
                        tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+chartDataPre.color[i]+'"></span>{b}: {c'+i+'}'+data.tooltip.unit+'<br />';
                    }
                    chartDataPre.tooltip.formatter = tooltipStr;
                }

                chartDataPre.tooltip.trigger = 'axis';
                chartDataPre.xAxis = M_Inside_Chart._chartXAxisReplace(data.x_axis);
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                if(length > 1){
                    chartDataPre.tooltip.axisPointerType = 'shadow';
                }
                for(var i=0;i<length;i++){
                    if(length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    if(type+'' == '4')chartDataPre.legend.push(dataUnion[i].name);
                    for(var n=0;n<dataUnion[i].data.length;n++){
                        dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                    }
                    chartDataPre.series.push({
                        name:dataUnion[i].name,
                        type:'bar',
                        barMaxWidth:15,
                        data:dataUnion[i].data,
                        itemStyle:{normal:{barBorderRadius:5}}
                    });
                };

                if(data.yFormat){
                    chartDataPre.yAxis[0].axisLabel.formatter = '{value}'+data.yFormat;
                }
                break;
            case '5':
            case '50':
                chartDataPre.xType = 'category';
                chartDataPre.tooltip.trigger = 'axis';
                chartDataPre.legendSelectMode = data.legendSelectMode ? data.legendSelectMode : false;
                if(!chartDataPre.legendSelectMode && data.tooltip){
                    var tooltipStr = '';
                    switch (data.tooltip.type){
                        case 'simple':
                            for(var i=0;i<data.tooltip.num;i++){
                                tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+chartDataPre.color[i]+'"></span>{b}: {c'+i+'}'+data.tooltip.unit+'<br />';
                            }
                            break;
                        case 'diff':
                            tooltipStr = '{b}<br />';
                            for(var i=0;i<data.tooltip.num;i++){
                                tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+chartDataPre.color[i]+'"></span>{a'+i+'}: {c'+i+'}'+data.tooltip.unit[i]+'<br />';
                            }
                            break;
                        default:
                            tooltipStr = '{b}<br />';
                            for(var i=0;i<data.tooltip.num;i++){
                                tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+chartDataPre.color[i]+'"></span>{a'+i+'}: {c'+i+'}'+data.tooltip.unit+'<br />';
                            }
                            break;
                    }

                    chartDataPre.tooltip.formatter = tooltipStr;
                }
                chartDataPre.xAxis = M_Inside_Chart._chartXAxisReplace(data.x_axis);
                if(data.xFormatDate){
                    chartDataPre.xAxisLabel.formatter = function (value, index) {
                            var date = new Date(value);
                            var texts = [(date.getMonth() + 1), date.getDate()];
                            return texts.join('/');
                    };
                }
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                for(var i=0;i<length;i++){
                    if(length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    for(var n=0;n<dataUnion[i].data.length;n++){
                        dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                    }
                    switch(type+''){
                        case '50':
                            if(data.yDouble) {
                                if(dataUnion[i].type == 'bar'){
                                    chartDataPre.series.push({
                                        name: dataUnion[i].name,
                                        type: dataUnion[i].type,
                                        yAxisIndex:i,
                                        barMaxWidth:15,
                                        data: dataUnion[i].data,
                                        itemStyle:{normal:{barBorderRadius:5}}
                                    });
                                }else{
                                    if(data.areaStyle && data.areaStyle == 'no'){
                                        chartDataPre.series.push({
                                            name: dataUnion[i].name,
                                            type: dataUnion[i].type,
                                            yAxisIndex:i,
                                            data: dataUnion[i].data
                                        });
                                    }else{
                                        chartDataPre.series.push({
                                            name: dataUnion[i].name,
                                            type: dataUnion[i].type,
                                            yAxisIndex:i,
                                            areaStyle: {normal: {opacity:0.05}},
                                            data: dataUnion[i].data
                                        });
                                    }
                                }
                            }else{
                                if(data.areaStyle && data.areaStyle == 'no'){
                                    chartDataPre.series.push({
                                        name: dataUnion[i].name,
                                        type: 'line',
                                        data: dataUnion[i].data
                                    });
                                }else{
                                    chartDataPre.series.push({
                                        name: dataUnion[i].name,
                                        type: 'line',
                                        areaStyle: {normal: {opacity:0.05}},
                                        data: dataUnion[i].data
                                    });
                                }
                            }
                            break;
                        default:
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:dataUnion[i].data
                            });
                            break;
                    }
                };
                if(data.yDouble){
                    chartDataPre.yAxis[1] = {
                        splitLine : {
                            lineStyle:{
                                color:'#EEEEEE'
                            }
                        },
                        type : 'value',
                        axisLine:{
                            show : false
                        },
                        axisTick:{
                            show : false
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#333333',
                                fontSize : '11px'
                            }
                        },
                        data:[]
                    };
                    chartDataPre.yAxis[1].splitLine = {show:false}
                    chartDataPre.yAxis[0].axisLabel.formatter = '{value}'+ data.yDoubleLabel[0];
                    chartDataPre.yAxis[1].axisLabel.formatter = '{value}'+ data.yDoubleLabel[1];

                }else{
                    if(data.yFormat){
                        chartDataPre.yAxis[0].axisLabel.formatter = '{value}'+data.yFormat;
                    }
                }
                break;
            case '60':
                if(data.color)chartDataPre.color = data.color;
                chartDataPre.tooltip = {trigger:'axis'};
                chartDataPre.radar = [
                    {
                        indicator: data.indicator,
                        shape: 'circle',
                        radius: 100,
                        splitArea: {
                            areaStyle: {
                                color: ['#ffffff','#ffffff']
                            }
                        },
                        splitNumber: 2
                    }
                ];
                chartDataPre.series = [
                    {
                        type: 'radar',
                        tooltip: null,
                        data:[]
                    }
                ];
                var i = 0;
                $.each(data.data,function (name,item) {
                    chartDataPre.legend.push(name);
                    switch(i){
                        case 0:
                            chartDataPre.series[0].data.push({
                                value: item,
                                name: name,
                                symbolSize: 0,
                                areaStyle: {
                                    normal: {
                                        color: chartDataPre.color[0],
                                        opacity:0.8
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 2,
                                        color:chartDataPre.color[1],
                                        opacity:0.4
                                    }
                                }
                            });
                            break;
                        default:
                            chartDataPre.series[0].data.push({
                                value: item,
                                name: name,
                                symbolSize: 0,
                                areaStyle: {
                                    normal: {
                                        color: chartDataPre.color[0]
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 0
                                    }
                                }
                            });
                            break;
                    }
                    i++
                });
                if(i<2)chartDataPre.legend = [];
                break;
        }
        M_Inside_Chart._drawChart(type,dom,chartDataPre);
    },
    _chartXAxisReplace:function (x_axis) {
        for(var i=0;i<x_axis.length;i++){
            x_axis[i] =  x_axis[i] .replace('&gt;',">");
            x_axis[i] =  x_axis[i] .replace('&lt;',"<");
        }
        return x_axis;
    },
    _drawChart:function (type,dom,chartDataPre) {
        var chartData = {};
        var legend = [];
        if(chartDataPre.legend){
            for(var i=0;i<chartDataPre.legend.length;i++){
                legend.push({
                    name: chartDataPre.legend[i],
                    icon: 'roundRect'
                });
            }
        }
        chartData.color = chartDataPre.color;
        chartData.tooltip = chartDataPre.tooltip;
        chartData.legend = {
            left:'right',
            data:legend,
            selectedMode:chartDataPre.legendSelectMode
        };
        switch(type+''){
            case '20':
                chartData.grid = {
                    left: '30',
                    right: '30',
                    bottom: 0,
                    top: '2%',
                    containLabel: true
                }
                break;
            case '60':
                chartData.radar = chartDataPre.radar;
                break;
            default:
                chartData.grid = {
                    left: '30',
                    right: '30',
                    bottom: 0,
                    top: '10%',
                    containLabel: true
                }
                break;
        }
        if(type+'' != '1' && type+'' != '60'){
            chartData.xAxis = [
                {
                    splitLine : {
                        lineStyle:{
                            color:'#EEEEEE'
                        }
                    },
                    type: chartDataPre.xType,
                    data: chartDataPre.xAxis,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: chartDataPre.xAxisLabel
                }
            ];
            chartData.yAxis = chartDataPre.yAxis;
        }
        chartData.series = chartDataPre.series;

        B_Chart._getEChart('line',dom,chartData);
    }

}
var M_Operate = {
    _searchPop:function () {
        B_Format._arrowOpenClose('#bs_btn_self','.auto-search-pop','operateSearch');
    },
    _getTag:function (type){
        var domTag = '';
        switch (type){
            case 'helper':
            case 'player':
                domTag = $('.auto-search-pop');
                break;
            default:
                domTag = $('#bs_content_tag');
                break;
        }
        var postData = {};
        postData['service_id'] = 3;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerSearchMeta'],'get',true,postData,function () {
                domTag.html('');
            },function () {},function(data,msg){
                if(data && data.length >0) {
                    switch (type){
                        case 'helper':
                        case 'player':
                            M_Operate._htmlSearch(data[0],type);
                            break;
                    }
                    switch (type){
                        case 'helper':
                            break;
                        case 'player':
                            for(var i=0;i<data[0].groupTitle.length;i++){
                                if(data[0].groupTitle[i] != ''){
                                    M_Init._dataCache['tabName'] = data[0].groupTitle[i];
                                    break;
                                }
                            }
                            M_Init._dataCache['tagsData'] = data;
                            F_Player_Info._getCharacterTag();
                            break;
                        default:
                            M_Operate._formatTag(domTag,data);
                            break;
                    }
                }
            },function(data,msg,code){
                domTag.html(B_Pre._empty(msg));
            }
        )
    },
    _formatTag:function (domTag,data) {
        M_Init._dataCache['tagsList'] = {};
        var isHasPrimary = (data[0].primary && data[0].primary.length > 0) ? true : false;
        $.each(data[0].group,function (key,value) {
            if(isHasPrimary) {
                M_Init._dataCache['tagsList'][key] = data[0].primary.concat(value);
            }else{
                M_Init._dataCache['tagsList'][key] = value;
            }
        });
        domTag.html(M_Operate._htmlTag(data[0].groupTitle));
        M_Operate._getDetail(1);
        domTag.find('span').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['tabName'] = $(this).html();
                    $('#bs_content_list .tg-table thead').html('');
                    M_Operate._getDetail(1);
                }
            });
        });
    },
    _btnSearch:function(type){
        switch (type){
            case 'helper':
                M_Operate._getSearchTag();
                M_Init._operateFrom = 'helper';
                B_Jump._go('base',B_Jump._getUrl('operatePlayer'));
                break;
            case 'player':
                $('#bs_number').html('0');
                $('.auto-search-pop').hide();
                $('#bs_main_content').html('');
                F_Player_Info._getCharacterTag();
                break;
        }
    },
    _htmlSearch:function (data,type) {
        var str = '';
        M_Init._dataCache['tagsList'] = {};
        M_Init._dataCache['tags'] = {};
        if(M_Init._operateCondition['keyword']){
            $('input[name="k"]').val(M_Init._operateCondition['keyword']);
        }
        var hasDrop = false;
        var dataSplit = [];
        for(var d=0;d<data.groupTitle.length;d++){
            if(data.groupTitle[d]){
                M_Init._dataCache['tags'][data.groupTitle[d]] = [];
                M_Init._dataCache['tagsList'][data.groupTitle[d]] = [];
                str += '<div class="wrap" id="bs_condition_'+d+'">';
                str += '<div class="side-tab-change"><span>'+data.groupTitle[d]+'<b class="bs_condition_sh" data-i="'+d+'">更多<i class="right-triangle"></i></b></span></div>';
                str += '<ul class="select-factor">';

                for(var i=0;i<data['group'][data.groupTitle[d]].length;i++){
                    str += '<li class="select-list">';
                    var searchItemVal = data['group'][data.groupTitle[d]][i];
                    if(!hasDrop){
                        dataSplit = searchItemVal.search_type.split(':');
                        if(dataSplit[0] == 'enum'){
                            hasDrop = true;
                        }
                    }
                    str += M_Operate._htmlMeta(data.groupTitle[d],searchItemVal.search_type,searchItemVal.column_name,searchItemVal.column_desc,searchItemVal.max_value,searchItemVal.min_value);
                    str += '</li>';
                }

                str += '</ul>';
                str += '</div>';
            }
        }
        str += '<div class="wrap btn-union">\
                    <div class="side-tab-change"></div>\
                    <ul class="select-factor">\
                        <li><a class="tg-main-btn" id="bs_search_condition_confirm">确认</a></li>\
                        <li><a class="tg-assist-btn" onclick="M_Operate._resetMeta();">重置</a></li>\
                    </ul>\
                </div>';

        $('.auto-search-pop').html(str);

        if(hasDrop){
            M_Inside._dropShow();
            M_Inside._dropSelected();
            M_Inside._dropLeave();
        }

        $('#bs_search_condition_confirm').click(function () {
            M_Operate._btnSearch(type);
        });
        $('.bs_condition_sh').each(function () {
            $(this).click(function () {
                var identity = $(this).attr('data-i');
                if($(this).find('i').hasClass('right-triangle')){
                    $(this).find('i').removeClass('right-triangle');
                    $(this).find('i').addClass('bottom-triangle');
                    $('#bs_condition_'+identity).css('height','auto');
                }else{
                    $(this).find('i').removeClass('bottom-triangle');
                    $(this).find('i').addClass('right-triangle');
                    $('#bs_condition_'+identity).css('height','100px');
                }
            });
        });
    },
    _htmlTag:function (data) {
        var str = '';
        str += '<b>玩家属性</b>';
        for(var i=0;i<data.length;i++){
            if(data[i] != ''){
                if(!M_Init._dataCache['tabName']){
                    M_Init._dataCache['tabName'] = data[i];
                }
                str += '<span';
                if(M_Init._dataCache['tabName'] == data[i]){
                    str += ' class="selected"';
                }
                str += '>'+data[i]+'</span>';
            }
        }
        return str;
    },
    _download:function () {
        $('#bs_btn_down').click(function () {
            var postData = [];
            if(M_Init._dataCache['condition_type'] && M_Init._dataCache['condition_style'] && M_Init._dataCache['condition_reason']){
                switch (M_Init._dataCache['condition_type']){
                    case 'paid':
                        postData.push('s_pay_style='+B_Common._encodeUrl(M_Init._dataCache['condition_style']));
                        postData.push('s_pay_reason='+B_Common._encodeUrl(M_Init._dataCache['condition_reason']));
                        break;
                    case 'lost':
                        postData.push('s_lost_style='+B_Common._encodeUrl(M_Init._dataCache['condition_style']));
                        postData.push('s_lost_reason='+B_Common._encodeUrl(M_Init._dataCache['condition_reason']));
                        break;
                }
            }
            if(M_Init._dataCache['userType'])postData.push('user_type='+M_Init._dataCache['userType']);
            if(M_Init._dataCache['columnType'])postData.push('column_type='+M_Init._dataCache['columnType']);
            postData.push('service_id=3');
            postData.push('game_id='+M_Init._gameId);
            postData.push('type='+B_Common._encodeUrl(M_Init._dataCache['tabName']));
            var condition = '';
            var searchCondition = M_Operate._getSearchTag();
            if(searchCondition != ''){
                condition = postData.join('&')+'&'+searchCondition;
            }else{
                condition = postData.join('&');
            }
            B_Jump._go('openUrl',B_Port._init(M_Init._api['searchExcel'])+'?'+condition+'&excel_name='+B_Common._encodeUrl('玩家属性查询'));
        });
    },
    _getDetail:function (page,type) {
        if(M_Init._dataCache['tabName'] == ''){
            B_Pop._init('msg',{content:'标签选择失败，请刷新页面重试！'});
            return false;
        }
        var postData = {};
        B_Page._size = 10;
        if(M_Init._dataCache['condition_type'] && M_Init._dataCache['condition_style'] && M_Init._dataCache['condition_reason']){
            switch (M_Init._dataCache['condition_type']){
                case 'paid':
                    postData['s_pay_style'] = M_Init._dataCache['condition_style'];
                    postData['s_pay_reason'] = M_Init._dataCache['condition_reason'];
                    break;
                case 'lost':
                    postData['s_lost_style'] = M_Init._dataCache['condition_style'];
                    postData['s_lost_reason'] = M_Init._dataCache['condition_reason'];
                    break;
            }
        }
        postData['type'] = M_Init._dataCache['tabName'];
        postData['service_id'] = 3;
        postData['game_id'] = M_Init._gameId;
        postData['index'] = (page-1)*B_Page._size;
        if(M_Init._dataCache['userType']){
            postData['user_type'] = M_Init._dataCache['userType'];
        }
        if(M_Init._dataCache['columnType']){
            postData['column_type'] = M_Init._dataCache['columnType'];
        }
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);
        var condition = '';
        var searchCondition = M_Operate._getSearchTag();
        if(searchCondition != ''){
            condition = postData+'&'+searchCondition;
        }else{
            condition = postData;
        }
        var rankCondition = M_Init._dataCache['searchRank'];
        if(rankCondition && rankCondition != ''){
            condition += '&'+rankCondition;
        }
        var domTableList = $('#bs_content_list .tg-table tbody');
        var domPageList = $('#bs_content_list .tg-page-list');
        B_Port._ajax(M_Init._api['playerData'],'get',true,condition,function () {
                domTableList.html(B_Pre._loading()+'<tr class="empty"></tr>');
            },function () {
                domTableList.html('');
            },function(data,msg){
                if(data.list && data.list.length >0){
                    domTableList.html(M_Operate._htmlList(data.list));
                    $('#bs_number').html(data.total);
                    domPageList.html(B_Page._show({total:data.total,page:page},'number'));
                    B_Page._click(page,function (page) {
                        M_Operate._getDetail(page);
                    });
                    M_Dom._trSelected();
                }else{
                    $('#bs_number').html('0');
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
    _getSearchDetail:function(key,isDemo){
        var demo = '';
        if(M_Init._controller == 'demo')demo = '&d=1';
        B_Pop._init('open',{'type':2,'scroll':false,'title':'用户详情','width':'1050px','height':'550px','shift':2,'content':'insidesattribute_s.html?k='+key+'&g='+M_Init._gameId+demo},'');
    },
    _htmlList:function (data) {
        var str = '';
        var tagLength = M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']].length;
        for(var i=0;i<data.length;i++){
            var thStr = '<tr>';
            var tdStr = '<tr>';
            for(var n=0;n<tagLength;n++){
                if(i==0 && $('#bs_content_list .tg-table thead').html() == ''){
                    var headName = M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].column_desc;
                    if(M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].search_type == 'span')headName += '<i data-i="'+M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].column_name+'" class="tg-icon tg-sort-icon arrow-down"></i>';
                    thStr += '<th>'+headName+'</th>';
                }
                tdStr += '<td>'+data[i].source[M_Init._dataCache["tagsList"][M_Init._dataCache["tabName"]][n].column_name]+'</td>';
            }
            tdStr += '<td><button class="tg-main-btn" onclick="M_Operate._getSearchDetail(\''+data[i].id+'\')">查看详情</button></td>';
            tdStr += '</tr>';
            str += tdStr;

            if(i==0 && $('#bs_content_list .tg-table thead').html() == ''){
                thStr += '<th>操作</th></tr>';
                $('#bs_content_list .tg-table thead').html(thStr);
                $('#bs_content_list .tg-table thead i').each(function (index) {
                    $(this).click(function () {
                        var ordreStr = {};
                        ordreStr['order_by_field'] = $(this).attr('data-i');
                        if ($(this).hasClass('arrow-down')) {
                            ordreStr['order_type'] = 'asc';
                            $(this).removeClass('arrow-down').addClass('arrow-up');
                        } else {
                            ordreStr['order_type'] = 'desc';
                            $(this).addClass('arrow-down').removeClass('arrow-up');
                        }
                        M_Init._dataCache['searchRank'] = B_Common._postData(ordreStr);
                        M_Operate._getDetail(1);
                    });
                });
            }
        }
        return str;
    },
    _getSearchTag:function (type) {
        var str = {};
        var userTagCondition = {};
        var userTagShowList = [];
        var userTagShowMap = {};
        var keyword = $.trim($('input[name="k"]').val());
        if(keyword != ''){
            str['keyword'] = keyword;
        }
        userTagCondition['keyword'] = keyword;
        if(M_Init._dataCache['tags']){
            $.each(M_Init._dataCache['tags'],function (key,value) {
                for(var i=0;i<value.length;i++){
                    switch(value[i].type){
                        case 'span':
                            var dom1 = value[i].name+'_min';
                            var dom2 = value[i].name+'_max';
                            var dom1Data = $.trim($('#'+dom1).val());
                            var dom2Data = $.trim($('#'+dom2).val());
                            userTagCondition[dom1] = dom1Data;
                            userTagCondition[dom2] = dom2Data;
                            if(dom1Data != ''){
                                str[dom1] = dom1Data;
                                userTagShowList.push(value[i].name);
                                userTagShowMap[value[i].name] = {'desc':value[i].desc,'value':dom1Data+'-','type':value[i].type};
                            }
                            if(dom2Data != ''){
                                str[dom2] = dom2Data;
                                if(dom1Data != ''){
                                    userTagShowMap[value[i].name].value += dom2Data;
                                }else{
                                    userTagShowList.push(value[i].name);
                                    userTagShowMap[value[i].name] = {'desc':value[i].desc,'value':'-'+dom2Data,'type':value[i].type};
                                }
                            }
                            break;
                        case 'query':
                            var dom = value[i].name;
                            var domData = $.trim($('#'+dom).val());
                            userTagCondition[dom] = domData;
                            if(domData != ''){
                                str[dom] = domData;
                                userTagShowList.push(value[i].name);
                                userTagShowMap[value[i].name] = {'desc':value[i].desc,'value':domData,'type':value[i].type};
                            }
                            break;
                        case 'enum':
                            var dom = value[i].name;
                            var domData = $.trim($('#'+dom).html());
                            if(domData != '' &&　domData != '全部'){
                                str[dom] = domData;
                                userTagCondition[dom] = domData;
                                userTagShowList.push(value[i].name);
                                userTagShowMap[value[i].name] = {'desc':value[i].desc,'value':domData,'type':value[i].type};

                            }else{
                                userTagCondition[dom] = '';
                            }
                            break;
                    }
                }
            })
        }
        M_Init._operateCondition = userTagCondition;
        if(type && type == 'character'){
            M_Init._dataCache['userTagShowMap'] = userTagShowMap;
            M_Operate._htmlConditionShow(userTagShowList);
            if(userTagShowList.length > 0){
                $('.tg-header-slider').show();
            }else{
                $('.tg-header-slider').hide();
            }
        }
        if(str && !B_Common._checkObjectIsEmpty(str)){
            return B_Common._postData(str);
        }else{
            return '';
        }
    },
    _htmlConditionShow:function (data) {
        if(M_Init._dataCache['userTagShowMap'] && data){
            var dataMap = M_Init._dataCache['userTagShowMap'];
            var str = '';
            for(var i=0;i<data.length;i++){
                if(dataMap[data[i]]){
                    str += '<li data-i="'+data[i]+'">'+dataMap[data[i]]['desc']+'<b>'+dataMap[data[i]]['value']+'</b><i>x</i></li>';
                }
            }
            $('#bs_scroll_content_1').html(str);
            if(str != ''){
                M_Common._scroll();
            }
            var ConditionRefreshTimeOut = '';
            $('#bs_scroll_main i').each(function () {
                $(this).click(function () {
                    $(this).parent('li').remove();
                    var dom = '';
                    var dataId = $(this).parent('li').attr('data-i');
                    var dataUnion = M_Init._dataCache['userTagShowMap'];
                    if(dataUnion && dataUnion[dataId]){
                        switch (dataUnion[dataId].type){
                            case 'span':
                                dom = dataId+'_min';
                                $('#'+dom).val('');
                                dom = dataId+'_max';
                                $('#'+dom).val('');
                                break;
                            case 'query':
                                dom = dataId;
                                $('#'+dom).val('');
                                break;
                            case 'enum':
                                dom = dataId;
                                $('#'+dom).html('全部').attr('data-i','')
                                break;
                        }
                        clearTimeout(ConditionRefreshTimeOut);
                        ConditionRefreshTimeOut = setTimeout(function () {
                            M_Operate._btnSearch('player');
                        },800);
                    }
                });
            });
        }else{
            $('#bs_condition_list').html('');
        }
    },
    _resetMeta:function () {
        if(M_Init._dataCache['tags']){
            $.each(M_Init._dataCache['tags'],function (key,value) {
                for(var i=0;i<value.length;i++){
                    switch(value[i].type){
                        case 'span':
                            var dom1 = value[i].name+'_min';
                            var dom2 = value[i].name+'_max';
                            $('#'+dom1).val('');
                            $('#'+dom2).val('');
                            break;
                        case 'query':
                            var dom = value[i].name;
                            $('#'+dom).val('')
                            break;
                        case 'enum':
                            var dom = value[i].name;
                            $('#'+dom).html('全部').attr('data-i','')
                            break;
                    }
                }
            })
        }
    },
    _htmlMeta:function (type,data,inputname,title,max,min) {
        var dataSplit = data.split(':');
        var str = '';
        var dom = '';
        M_Init._dataCache['tagsList'][type].push({key:inputname,name:title,type:dataSplit[0]});
        switch(dataSplit[0]){
            case 'span':
                M_Init._dataCache['tags'][type].push({'type':dataSplit[0],'name':inputname,'desc':title});
                if(dataSplit[1]){
                    switch(dataSplit[1]){
                        case 'date':
                            str += '<div>';
                            str += '<span>'+title+'</span>';
                            str += '<input';
                            dom = inputname+'_min';
                            if(M_Init._operateCondition[dom]){
                                str += ' value="'+M_Init._operateCondition[dom]+'"';
                            }
                            str += ' readonly type="text" id="'+dom+'" class="tg-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})" placeholder="'+min+'">';
                            str += '<span class="zhi">至</span>';
                            str += '<input';
                            dom = inputname+'_max';
                            if(M_Init._operateCondition[dom]){
                                str += ' value="'+M_Init._operateCondition[dom]+'"';
                            }
                            str += ' readonly type="text" id="'+dom+'" class="tg-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})" placeholder="'+max+'">';
                            str += '</div>';
                            break;
                        case 'datetime':
                            str += '<div>';
                            str += '<span>'+title+'</span>';
                            str += '<input';
                            dom = inputname+'_min';
                            if(M_Init._operateCondition[dom]){
                                str += ' value="'+M_Init._operateCondition[dom]+'"';
                            }
                            str += ' readonly type="text" id="'+dom+'" class="tg-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})" placeholder="'+min+'">';
                            str += '<span class="zhi">至</span>';
                            str += '<input';
                            dom = inputname+'_max';
                            if(M_Init._operateCondition[dom]){
                                str += ' value="'+M_Init._operateCondition[dom]+'"';
                            }
                            str += ' readonly type="text" id="'+dom+'" class="tg-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})" placeholder="'+max+'">';
                            str += '</div>';
                            break;
                    }
                }else{
                    str += '<div>';
                    str += '<span>'+title+'</span>';
                    str += '<input';
                    dom = inputname+'_min';
                    if(M_Init._operateCondition[dom]){
                        str += ' value="'+M_Init._operateCondition[dom]+'"';
                    }
                    str += ' type="text" id="'+dom+'" class="tg-input" placeholder="'+min+'">';
                    str += '<span class="zhi">至</span>';
                    str += '<input';
                    dom = inputname+'_max';
                    if(M_Init._operateCondition[dom]){
                        str += ' value="'+M_Init._operateCondition[dom]+'"';
                    }
                    str += ' type="text" id="'+dom+'" class="tg-input" placeholder="'+max+'">';
                    str += '</div>';
                }
                break;
            case 'enum':
                var dataEnum = dataSplit[1] ? dataSplit[1].split(',') : [];
                if(dataEnum.length > 0){
                    M_Init._dataCache['tags'][type].push({'type':dataSplit[0],'name':inputname,'desc':title});
                    str += '<div class="tg-selected-drop"><span>'+title+'</span>';
                    if(M_Init._operateCondition[inputname]){
                        str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span id="'+inputname+'" >全部</span></p><ul>';
                        str += '<li><a>'+M_Init._operateCondition[inputname]+'</a></li>';
                    }
                    for(var i=0;i<dataEnum.length;i++){
                        if(i == 0){
                            if(!M_Init._operateCondition[inputname]){
                                str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span id="'+inputname+'" >全部</span></p><ul>';
                            }
                            str += '<li><a>全部</a></li>';
                        }
                        str += '<li><a data-i="'+dataEnum[i]+'">'+dataEnum[i]+'</a></li>';
                    }
                    str += '</ul></div>';
                }
                break;
            case 'query':
                M_Init._dataCache['tags'][type].push({'type':dataSplit[0],'name':inputname});
                str += '<div><span>'+title+'</span>';
                str += '<input';
                if(M_Init._operateCondition[inputname]){
                    str += ' value="'+M_Init._operateCondition[inputname]+'"';
                }
                str += ' type="text"  id="'+inputname+'" class="tg-input"></div>';
                break;
        }
        return str;
    }
}
var M_Inside = {
    _resetMeta:function (type) {
        if(M_Init._dataCache['tags'][M_Init._dataCache['tabName']] && M_Init._dataCache['tags'][M_Init._dataCache['tabName']].length > 0){
            for(var i=0;i<M_Init._dataCache['tags'][M_Init._dataCache['tabName']].length;i++){
                switch(M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].type){
                    case 'span':
                        var dom1 = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name+'_min';
                        var dom2 = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name+'_max';
                        $('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom1).val('');
                        $('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom2).val('');
                        break;
                    case 'query':
                        var dom = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name;
                        $('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom).val('')
                        break;
                    case 'enum':
                        var dom = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name;
                        $('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom).html('全部').attr('data-i','')
                        break;
                }
            }
        }
        switch(type){
            case 'attribute':
                F_Attribute_Search._getDetail(1);
                break;
            case 'log':
                F_Log_Search._getDetail(1);
                break;
        }
    },
    _tabChoose:function (type) {
        $("#tab_list_li li").each(function(index){
            $(this).click(function () {
                $(this).addClass('tg-tab-active').siblings().removeClass('tg-tab-active');

                var dataNumber = $(this).attr('data-i');

                M_Init._dataCache['tabId'] = dataNumber;
                M_Init._dataCache['tabName'] = $(this).attr('data-w');

                $('#lt_content_'+dataNumber).show().siblings().hide();

                switch(type){
                    case 'attribute':
                        if($('#lt_content_'+dataNumber+' .tg-page-list').html() == ''){
                            F_Attribute_Search._getDetail(1);
                        }
                        break;
                    case 'log':
                        if($('#lt_content_'+dataNumber+' .tg-select-filter').html() == ''){
                            F_Log_Search._getSearchMeta();
                        }
                        if($('#lt_content_'+dataNumber+' .graph-show-part').html() == ''){
                            F_Log_Chart._getChartInfo();
                        }
                        break;
                }

            });
        });
    },
    _dropHtml:function (id,title,choosed,data,type) {
        var str = '';
        switch(type){
            default:
                str += '<span class="fl hotword">'+title+'</span>';
                str += '<div class="tg-selected-drop fl" id="'+id+'">';
                str += '<p class="tg-drop-text-part">';
                str += '<i class="tg-graph tg-triangle-gray-bottom"></i><span data-i="'+choosed.id+'">'+choosed.name+'</span>';
                str += '</p>';
                str += '<ul style="display: none">';
                for(var i=0;i<data.length;i++){
                    str += '<li><a data-i="'+data[i].id+'">'+data[i].name+'</a></li>';
                }
                str += '</ul></div>';
                break;
        }
        return str;
    },
    _dropShow:function(dom){
        dom = dom ? dom : 'tg-selected-drop';
        $("."+dom+" p").unbind('click');
        $("."+dom+" p").click(function() {
            var ul = $(this).parent('.'+dom).children('ul');
            if (ul.css("display") == "none") {
                ul.slideDown("fast");
            } else {
                ul.slideUp("fast");
            }
        });
    },
    _dropSelected:function(callback,dom){
        dom = dom ? dom : 'tg-selected-drop';
        $("."+dom+" ul li a").click(function() {
            var txt = $(this).text();
            var key = $(this).attr('data-i');
            var current = $(this).parents('.'+dom).find('p span').attr('data-i');
            var index = $(this).parents('.'+dom).find('p span').attr('data-d');
            $(this).parents('.'+dom).find('p span').html(txt).attr('data-i', key);
            $(this).parents('.'+dom).children('ul').hide();
            if(current != key){
                callback && callback(key,index);
            }
        });
    },
    _dropLeave:function (dom) {
        dom = dom ? dom : 'tg-selected-drop';
        $('.'+dom).mouseleave(function(event) {
            $(this).children('ul').hide();
        });
    },
    _htmlMeta:function (type,data,inputname,title) {
        var dataSplit = data.split(':');
        var str = '';
        M_Init._dataCache['tagsList'][type].push({key:inputname,name:title,type:dataSplit[0]});
        switch(dataSplit[0]){
            case 'span':
                M_Init._dataCache['tags'][type].push({'type':dataSplit[0],'name':inputname});
                if(dataSplit[1]){
                    switch(dataSplit[1]){
                        case 'date':
                            str += '<div>';
                            str += '<span>'+title+'</span>';
                            str += '<input readonly type="text" id="'+inputname+'_min" class="tg-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})"><span class="zhi">至</span><input readonly type="text" id="'+inputname+'_max" class="tg-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})">';
                            str += '</div>';
                            break;
                        case 'datetime':
                            str += '<div>';
                            str += '<span>'+title+'</span>';
                            str += '<input readonly type="text" id="'+inputname+'_min" class="tg-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})"><span class="zhi">至</span><input readonly type="text" id="'+inputname+'_max" class="tg-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})">';
                            str += '</div>';
                            break;
                    }
                }else{
                    str += '<div>';
                    str += '<span>'+title+'</span>';
                    str += '<input type="text" id="'+inputname+'_min" class="tg-input"><span class="zhi">至</span><input type="text" id="'+inputname+'_max" class="tg-input">';
                    str += '</div>';
                }
                break;
            case 'enum':
                var dataEnum = dataSplit[1] ? dataSplit[1].split(',') : [];
                if(dataEnum.length > 0){
                    M_Init._dataCache['tags'][type].push({'type':dataSplit[0],'name':inputname});
                    str += '<div class="tg-selected-drop"><span>'+title+'</span>';
                    for(var i=0;i<dataEnum.length;i++){
                        if(i == 0){
                            str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span id="'+inputname+'" >全部</span></p><ul>';
                            str += '<li><a>全部</a></li>';
                        }
                        str += '<li><a data-i="'+dataEnum[i]+'">'+dataEnum[i]+'</a></li>';
                    }
                    str += '</ul></div>';
                }
                break;
            case 'query':
                M_Init._dataCache['tags'][type].push({'type':dataSplit[0],'name':inputname});
                str += '<div><span>'+title+'</span><input type="text"  id="'+inputname+'" class="tg-input"></div>';
                break;
        }
        return str;
    },
    _getSearchTag:function () {
        var str = {};
        if(M_Init._dataCache['tags'] && M_Init._dataCache['tags'][M_Init._dataCache['tabName']] && M_Init._dataCache['tags'][M_Init._dataCache['tabName']].length > 0){
            for(var i=0;i<M_Init._dataCache['tags'][M_Init._dataCache['tabName']].length;i++){
                switch(M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].type){
                    case 'span':
                        var dom1 = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name+'_min';
                        var dom2 = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name+'_max';
                        var dom1Data = $.trim($('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom1).val());
                        var dom2Data = $.trim($('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom2).val());
                        if(dom1Data != ''){
                            str[dom1] = dom1Data;
                        }
                        if(dom2Data != ''){
                            str[dom2] = dom2Data;
                        }
                        break;
                    case 'query':
                        var dom = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name;
                        var domData = $.trim($('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom).val());
                        if(domData != ''){
                            str[dom] = domData;
                        }
                        break;
                    case 'enum':
                        var dom = M_Init._dataCache['tags'][M_Init._dataCache['tabName']][i].name;
                        var domData = $.trim($('#lt_content_'+M_Init._dataCache['tabId']+' #'+dom).html());
                        if(domData != '' &&　domData != '全部'){
                            str[dom] = domData;
                        }
                        break;
                }
            }
        }
        if(str && !B_Common._checkObjectIsEmpty(str)){
            return B_Common._postData(str);
        }else{
            return '';
        }
    },
    _getSearchRank:function () {
        var str = [];
        $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead i').each(function () {
            $(this).hasClass('arrow-up') ? str.push($(this).attr('data-i')) : '';
        });
        if(str.length > 0){
            return 'order_by_field='+str.join(',');
        }else{
            return '';
        }
    },
    _htmlHeadTab:function(tab,column){
        var str = '<div class="fl"><ul class="tg-tab-btn">';
        for(var i=0;i<tab.length;i++){
            str += '<li class="tg-tab-btn-normal';
            if(i==0)str += ' tg-tab-btn-selected';
            str += '">'+tab[i]+'</li>';
        }
        str += '</ul></div>';
        $('#headerTop').prepend(str);

        $('#headerTop .fl ul li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('tg-tab-btn-selected')){
                    $(this).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
                    switch(column){
                        case 'lostanalysis':
                            M_Init._dataCache['tabIndex'] = index;
                            F_LostAnalysis_Info._formatInfo();
                            break;
                        case 'habit':
                            M_Init._dataCache['tabIndex'] = index;
                            F_Habit_Info._formatInfo();
                            break;
                    }
                }
            });
        });
    },
    _htmlChartTable:function (dom,data) {
        var str = '';
        for(var i=0;i<data.length;i++){
            str += M_Inside._htmlChartTableFormat(i,data[i]);
        }
        dom.html(str);
    },
    _htmlChartTableFormat:function (index,data) {
        var str = '';
        switch(data.type){
            default:
                str += '<div class="tg-table-layout blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">';
                break;
            case 'switch':
            case 'region':
            case 'switchTab':
            case 'regionTab':
                str += '<div class="tg-table-layout tg-table-low-height blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12">';
                break;
        }
        if(data.tips){
            if(data.tips[0] && data.tips[0].position == 'first'){
                str += '<h3 class="tip-hover">';
                str += '\
                <div class="tip-box-show">\
                    <i class="triangle-up"></i>\
                    <div class="tip-box-content">'+data.tips[0].content+'</div>\
                </div>';
            }else{
                str += '<h3>';
            }
        }else{
            str += '<h3>';
        }
        if(M_Init._menuColumnAbnormal[data.name]){
            str += '<i class="alert-point"></i>';
        }
        str += data.name+'</h3><div class="boxshadow tg-table-content">';
        var detail = '';
        var tab = '';
        var avg = '';
        if(data.tab && data.tab.length > 0){
            tab = '<ul class="tg-tab-change-block';
            switch(data.type) {
                case 'regionTab':
                case 'switchTab':
                    tab += ' area-tab-change';
                    break;
            }
            tab += '" id="tab_list_li_'+index+'" data-i="'+index+'">';
            for(var d=0;d<data.tab.length;d++){
                tab += '<li class="';
                if(d == 0)tab += 'tg-tab-block-active';
                if(data.tips[1] && data.tips[1].position == 'second') {
                    tab += ' tip-hover">';
                    tab += '\
                        <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">' + data.tips[1].content[d] + '</div>\
                        </div>';
                }else{
                    tab += '">';
                }
                if(M_Init._menuColumnAbnormal[data.name] && M_Init._menuColumnAbnormal[data.name][data.tab[d]]){
                    tab += '<i class="alert-point"></i>';
                }
                tab += data.tab[d]+'</li>';
            }
            detail += M_Inside._htmlChartTableDom(index+'_0',data.type);
            tab += '</ul>';
        }else{
            detail += M_Inside._htmlChartTableDom(index+'_0',data.type);
        }
        switch(data.type){
            case 'togetherTabAvg':
                avg = '<div class="avg-part" id="bs_avg_'+index+'_0"></div>'
                break;
        }
        str += (tab+avg+detail);
        str += '</div></div></div>';
        return str;

    },
    _htmlChartTableDom:function (index,type,tabSecond) {
        var tableShowHideClass = '';
        var iconTableSelectd = '';
        var regionChoose = '';
        var switchClass = '';
        switch(type){
            case 'togetherTabAvg':
            case 'togetherTab':
            case 'together':
            case 'togetherTab20':
            case 'together20':
                iconTableSelectd = 'tg-table-selected';
                break;
            default:
                switchClass = 'player-graph';
                tableShowHideClass = 'b_none';
                iconTableSelectd = 'tg-table';
                break;
        }
        var str = '';
        var number = index.split('_');
        var strBegin = false;
        if(number.length > 2){
            if(number[1] == 0 && number[2] == 0)strBegin = true;
        }else{
            if(number[1] == 0)strBegin = true;
        }
        switch(type){
            case 'togetherTab20':
            case 'together20':
                str += strBegin ? '<div id="lt_main_area_'+index+'" class="cs_chart_table tg-only-chart">' : '<div class="cs_chart_table tg-only-chart b_none" id="lt_main_area_'+index+'">';
                break;
            default:
                str += strBegin ? '<div id="lt_main_area_'+index+'" class="cs_chart_table">' : '<div class="cs_chart_table b_none" id="lt_main_area_'+index+'">';
                break;
        }

        if(tabSecond)str += tabSecond;
        switch(type){
            case 'table':
            case 'tableColSpan':
            case 'tableColSpan20':
                str += '<div id="bs_table_'+index+'" class="tg-table-wrap';
                str += (type == 'table' || type == 'tableColSpan20') ? ' tg-table-no-padding' : '';
                str += (type == 'tableColSpan20') ? ' tg-table-row-20' : '';
                str += '">';
                str += '\
                            <div class="table-out-wrap no-margin-top" id="bs_table_list_'+index+'"></div>\
                            <ul class="tg-page-list" id="bs_page_'+index+'"></ul>\
                        </div>\
                        <div class="boxshadow tg-table-operation"  id="bs_icon_'+index+'">\
                            <ul class="fr">\
                            <li><b>下载数据</b><i class="tg-icon tg-download bs_icon_down" data-i="'+index+'"></i></li>\
                            </ul>\
                        </div>\
                   </div>';
                break;
            /*
            case 'togetherTab20':
            case 'together20':
                str += regionChoose+'<div class="insidelog-graph '+switchClass+'" id="bs_chart_'+index+'" style="width:96%"></div>';
                str += '</div>';
                break;
                */
            default:
                str += regionChoose+'<div class="insidelog-graph '+switchClass+'" id="bs_chart_'+index+'" style="width:96%"></div>';

                str += '<div class="tg-table-wrap '+tableShowHideClass;
                //str += (type == 'togetherTab20' || type == 'together20') ? ' tg-table-row-20' : '';
                str += '" id="bs_table_'+index+'">';

                str += '\
                        <div class="table-out-wrap" id="bs_table_list_'+index+'"></div>\
                        <ul class="tg-page-list" id="bs_page_'+index+'"></ul>\
                    </div>\
                    <div class="boxshadow tg-table-operation"  id="bs_icon_'+index+'">\
                        <ul class="fl">\
                        <li><i class="tg-icon tg-pic-selected" id="bs_icon_chart_'+index+'"></i></li>\
                        <li><i class="tg-icon '+iconTableSelectd+'" id="bs_icon_table_'+index+'"></i></li>\
                        </ul>\
                        <ul class="fr">\
                        <li><b>下载数据</b><i class="tg-icon tg-download bs_icon_down" data-i="'+index+'"></i></li>\
                        </ul>\
                    </div>';

                str += '</div>';

                break;
        }
        return str
    },
    _avgHtml:function (dom,data) {
        $('#bs_avg_'+dom).html(data);
    },
    _tableName:function (data,domBig,domSmall,dateBegin,dateEnd) {
        var str = 'data';
        if(data && data[domBig]){
            str = data[domBig].name;
            if(data[domBig].tab && data[domBig].tab.length > 0){
                if(data[domBig].tab[domSmall]){
                    str += '-'+data[domBig].tab[domSmall];
                }
            }
            if(dateBegin && dateEnd){
                str += '（'+dateBegin+'至'+dateEnd+'）';
            }else if(dateBegin){
                str += '（'+dateBegin+'周前）';
            }
        }
        return str;
    },
    _tableHtml:function (page,dom,pageSize) {
        if(!M_Init._dataCache['page_'+dom])M_Init._dataCache['page_'+dom] = pageSize ? pageSize : 10;
        B_Page._size = M_Init._dataCache['page_'+dom];
        var length = M_Init._dataCache[dom].body.length;
        var begin = (page-1)*B_Page._size;
        var bodyData = M_Init._dataCache[dom].body.slice(begin,(begin+B_Page._size));
        var str = '<table class="tg-table table table-bordered"><thead class="boxshadow">';
        if(M_Init._dataCache[dom].formatHead){
            str += M_Init._dataCache[dom].formatHead;
        }else{
            if(M_Init._dataCache[dom].colspan){
                str += '<tr><th colspan="2"></th><th colspan="9">'+M_Init._dataCache[dom].colspan+'</th></tr>';
            }
            str += '<tr>';
            for(var i=0;i<M_Init._dataCache[dom].head.length;i++){
                str += '<th>'+M_Init._dataCache[dom].head[i]+'</th>';
            }
            str += '</tr>';
        }
        str += '</thead>';
        str += '<tbody>';
        if(M_Init._dataCache[dom].colspan) {
            var optRate = 1;
            for (var i = 0; i < bodyData.length; i++) {
                str += '<tr>';
                for (var d = 0; d < bodyData[i].length; d++) {
                    if(d>1){
                        if(bodyData[i][d].indexOf("%")>=0){
                            optRate = bodyData[i][d].replace('%','');
                            optRate = parseFloat(optRate);
                            optRate = optRate/100;
                        }else{
                            optRate = bodyData[i][d]/bodyData[i][1];
                        }
                        optRate = optRate.toFixed(2);

                        str += '<td class="td-blue" style="background: rgba(51, 152, 220,'+optRate+')">';
                    }else{
                        str += '<td>';
                    }
                    str += bodyData[i][d] + '</td>';
                }
                str += '</tr>';
            }
        }else{
            for (var i = 0; i < bodyData.length; i++) {
                str += '<tr>';
                for (var d = 0; d < bodyData[i].length; d++) {
                    str += '<td>' + bodyData[i][d] + '</td>';
                }
                str += '</tr>';
            }
        }
        str += '</tbody>';
        str += '</table></div>';

        $('#bs_table_list_'+dom).html(str);
        $('#bs_page_'+dom).html(B_Page._show({total:length,page:page,dom:dom},'number'));

        B_Page._click(page,function (page,dom) {
            M_Inside._tableHtml(page,dom);
        },dom);
    },
    _downloadCsv:function(){
        $('.bs_icon_down').each(function () {
            $(this).click(function () {
                var key = $(this).attr('data-i');
                M_Common._downCsv(M_Init._dataCache[key]);
            });
        });
    },
    _tabChangePerChart:function (i,type,column) {
        switch(type){
            case 'togetherTabAvg':
            case 'togetherTab':
            case 'togetherTab20':
            case 'regionTab':
            case 'switchTab':
                $('#tab_list_li_'+i+' li').each(function (index) {
                    $(this).click(function () {
                        if(!$(this).hasClass('tg-tab-block-active')){
                            $(this).addClass('tg-tab-block-active').siblings().removeClass('tg-tab-block-active');
                            var number = $(this).parent('ul').attr('data-i');
                            M_Inside._tabChangePerChartReset(column,number,index)
                        }
                    });
                });
                break;
        }
    },
    _tabChangePerChartReset:function (column,number,index) {
        switch(column){
            case 'additional':
                F_Additional_Info._chartHtml(number,index);
                break;
            case 'paydata':
                F_PayData_Info._chartHtml(number,index);
                break;
            case 'keypoint':
                F_Keypoint_Info._chartHtml(number,index);
                break;
            case 'activity':
                F_Activity_Info._chartHtml(number,index);
                break;
            case 'save':
                F_Save_Info._chartHtml(number,index);
                break;
            case 'pay':
                F_Pay_Info._chartHtml(number,index);
                break;
            case 'payosmosis':
                F_PayOsmosis_Info._chartHtml(number,index);
                break;
            case 'payconversion':
                F_PayConversion_Info._chartHtml(number,index);
                break;
            case 'payhabit':
                F_PayHabit_Info._chartHtml(number,index);
                break;
            case 'channelearn':
                F_ChannelEarn_Info._chartHtml(number,index);
                break;
            case 'channelquality':
                F_ChannelQuality_Info._chartHtml(number,index);
                break;
            case 'lost':
                F_Lost_Info._chartHtml(number,index);
                break;
            case 'lostAnalysis':
                F_LostAnalysis_Info._chartHtml(number,index);
                break;
            case 'lostfunnel':
                F_LostFunnel_Info._chartHtml(number,index);
                break;
            case 'habit':
                F_Habit_Info._chartHtml(number,index);
                break;
            case 'personality':
                F_Personality_Info._chartHtml(number,index);
                break;
        }
    },
    _chartTableIcon:function (type,big,small) {
        var domId = big+'_'+small;
        switch(type){
            case 'together':
            case 'togetherTab':
            case 'togetherTabAvg':
            case 'togetherTab20':
            case 'together20':
                $('#bs_icon_'+domId+' .fl .tg-icon').each(function (index) {
                    $(this).unbind('click');
                    $(this).click(function () {
                        switch(index+''){
                            case '0':
                                if ($(this).hasClass('tg-pic-selected')) {
                                    if($('#bs_icon_'+domId+' .fl .tg-icon').eq(1).hasClass('tg-table-selected')){
                                        $(this).removeClass('tg-pic-selected').addClass('tg-pic');
                                        $('#bs_chart_' + domId).hide();
                                    }
                                } else {
                                    $(this).addClass('tg-pic-selected').removeClass('tg-pic');
                                    $('#bs_chart_' + domId).show();

                                    M_Inside._chartResize(big,small);
                                }
                                break;
                            case '1':
                                if($(this).hasClass('tg-table-selected')){
                                    if($('#bs_icon_'+domId+' .fl .tg-icon').eq(0).hasClass('tg-pic-selected')){
                                        $(this).removeClass('tg-table-selected').addClass('tg-table');
                                        $('#bs_table_'+domId).hide();
                                    }
                                }else{
                                    $(this).addClass('tg-table-selected').removeClass('tg-table');
                                    $('#bs_table_'+domId).show();
                                }
                                break;
                        }
                    })
                });
                break;
            case 'switch':
            case 'region':
            case 'switchTab':
            case 'regionTab':
                $('#bs_icon_'+domId+' .fl .tg-icon').each(function (index) {
                    $(this).unbind('click');
                    $(this).click(function () {
                        switch(index+''){
                            case '0':
                                if (!$(this).hasClass('tg-pic-selected')) {
                                    $('#bs_icon_table_'+domId).removeClass('tg-table-selected').addClass('tg-table');
                                    $(this).addClass('tg-pic-selected').removeClass('tg-pic');
                                    $('#bs_chart_' + domId).show();
                                    $('#bs_table_' + domId).hide();
                                    M_Inside._chartResize(big,small);
                                }
                                break;
                            case '1':
                                if(!$(this).hasClass('tg-table-selected')){
                                    $('#bs_icon_chart_'+domId).removeClass('tg-pic-selected').addClass('tg-pic');
                                    $(this).addClass('tg-table-selected').removeClass('tg-table');
                                    $('#bs_table_'+domId).show();
                                    $('#bs_chart_' + domId).hide();
                                }
                                break;
                        }
                    })
                });
                break;
        }
    },
    _chartResize:function (big,small) {
        for(var i=0;i<B_Chart._chartBarn.length;i++){
            if(B_Chart._chartBarn[i][0] == ('bs_chart_'+big+'_'+small) || B_Chart._chartBarn[i][0] == ('bs_chart_bs_chart_'+big+'_'+small)){
                B_Chart._chartBarn[i][1].resize();
            }
        }
    }
}