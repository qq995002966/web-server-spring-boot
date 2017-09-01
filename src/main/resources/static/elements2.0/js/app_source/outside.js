var M_Outside_Chart = {
    _chartData:function (type,dom,data,chartClickId) {
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
        if(data.xFormatDate){
            chartDataPre.xAxisLabel.formatter = function (value, index) {
                var date = new Date(value);
                var texts = [(date.getMonth() + 1), date.getDate()];
                return texts.join('/');
            };
        }
        if(data.gridTop)chartDataPre.gridTop = data.gridTop;
        if(data.color)chartDataPre.color = data.color;
        chartDataPre.legendSelectMode = data.legendSelectMode ? data.legendSelectMode : false;
        if(data.inverse)chartDataPre.yAxis[0].inverse = true;
        if(data.yMin)chartDataPre.yAxis[0].min = 1;
        if(data.yMax)chartDataPre.yAxis[0].max = data.yMax;
        chartDataPre.xType = 'category';
        chartDataPre.tooltip.trigger = 'axis';

        if(!chartDataPre.legendSelectMode && data.tooltip){
            var tooltipStr = '';
            for(var i=0;i<data.tooltip.num;i++){
                if(i==0)tooltipStr += '{b}<br>';
                tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+chartDataPre.color[i]+'"></span>{a'+i+'}: {c'+i+'}'+data.tooltip.unit+'<br />';
            }
            chartDataPre.tooltip.formatter = tooltipStr;
        }
        switch(type){
            case 'map':
                chartDataPre.tooltip = {trigger:'item'};
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                var max = 0;
                var value = 0;
                for(var i=0;i<length;i++){
                    if(data.legendIsShow || length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    for(var n=0;n<dataUnion[i].data.length;n++){
                        value = (parseFloat(dataUnion[i].data[n].value)*100).toFixed(1);
                        dataUnion[i].data[n].value = value;
                        if(parseFloat(max) < parseFloat(value))max = value;
                    }
                    chartDataPre.series.push({
                        name: dataUnion[i].name+'(%)',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle:{
                            normal:{
                                label:{show:false},
                                borderWidth:1,
                                borderColor:'#ffffff'
                            },
                            emphasis:{label:{show:true}}
                        },
                        data:dataUnion[i].data
                    });
                }
                if(length > 1)max *= 2;
                chartDataPre.visualMap = {
                    min: 0,
                    max: max,
                    left: 'right',
                    top: 'bottom',
                    text: ['高(%)','低(%)'],
                    calculable: true,
                    color:['#51c7ef','#91cfe4','#dde7ea']
                }
                break;
            case 'line':
            case 'lineOpacity':
            case 'lineSum':
                chartDataPre.xAxis = data.x_axis;
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                for(var i=0;i<length;i++){
                    if(length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    for(var n=0;n<dataUnion[i].data.length;n++){
                        dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                    }
                    switch(type){
                        case 'line':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'line',
                                data:dataUnion[i].data
                            });
                            break;
                        case 'lineOpacity':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'line',
                                areaStyle: {normal: {opacity:0.05}},
                                data:dataUnion[i].data
                            });
                            break;
                        case 'lineSum':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:dataUnion[i].data
                            });
                            break;
                    }
                }
                break;
            case 'bar':
            case 'barSum':
                chartDataPre.xAxis = data.x_axis;
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                if(length > 1){
                    chartDataPre.tooltip.axisPointerType = 'shadow';
                }
                for(var i=0;i<length;i++){
                    if(data.legendIsShow || length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    for(var n=0;n<dataUnion[i].data.length;n++){
                        dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                    }
                    switch(type){
                        case 'bar':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'bar',
                                data:dataUnion[i].data,
                                barMaxWidth:15,
                                itemStyle:{normal:{barBorderRadius:5}}
                            });
                            break;
                        case 'barSum':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'bar',
                                stack: '总量',
                                data:dataUnion[i].data,
                                barMaxWidth:15
                            });
                            break;
                    }
                }
                if(data.yFormat){
                    chartDataPre.yAxis[0].axisLabel.formatter = '{value}'+data.yFormat;
                }
                break;
            case 'radar':
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
                                        color: '#85B73E'
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
            case 'radar_pop':
                chartDataPre.tooltip = {trigger:'axis'};
                chartDataPre.radar = [
                    {
                        indicator: data.indicator,
                        shape: 'circle',
                        radius: 45,
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
                                        color: '#85B73E'
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
            case 'pie':
                chartDataPre.tooltip = {trigger:'item'};
                chartDataPre.series.push({
                    name:data.name,
                    type:'pie',
                    radius: data.radius,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data.data
                });
                break;
            case 'gauge':
                chartDataPre.tooltip = data.tooltipFormat;
                chartDataPre.series.push({
                    name:data.name,
                    startAngle:data.startAngle ? data.startAngle : 255,
                    endAngle:data.endAngle ? data.endAngle : -45,
                    type:'gauge',
                    radius: data.radius,
                    axisLine: {
                        lineStyle: {
                            color: data.color,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 5
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    pointer:{
                        length:'50%'
                    },
                    itemStyle:{
                        normal:{
                            color:data.pointerColor
                        }
                    },
                    detail:data.detail,
                    data:data.data
                });
                break;
            case 'gauge_pop':
                chartDataPre.tooltip = data.tooltipFormat;
                chartDataPre.series.push({
                    name:data.name,
                    startAngle:data.startAngle ? data.startAngle : 255,
                    endAngle:data.endAngle ? data.endAngle : -45,
                    type:'gauge',
                    radius: data.radius,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            color: data.color,
                            //shadowColor: 'rgba(0, 0, 0, 0.5)',
                            //shadowBlur: 5,
                            width:20
                        }
                    },
                    splitLine: {
                        length:20,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            fontWeight:10,
                            fontSize:10
                        }
                    },
                    pointer:{
                        length:'50%'
                    },
                    itemStyle:{
                        normal:{
                            color:data.pointerColor
                        }
                    },
                    detail:data.detail,
                    data:data.data
                });
                break;
        }
        if(data.legendNotShow){
            chartDataPre.legend = [];
        }
        M_Outside_Chart._drawChart(type,dom,chartDataPre,chartClickId);
    },
    _drawChart:function (type,dom,chartDataPre,chartClickId) {
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
        chartData.grid = {
            left: '30',
            right: '30',
            bottom: 0,
            top: chartDataPre.gridTop ? chartDataPre.gridTop : '6%',
            containLabel: true
        }
        if($.inArray(type,['radar','pie','gauge','gauge_pop','radar_pop','map']) <= -1){
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
        }else{
            switch (type){
                case 'radar':
                case 'radar_pop':
                    chartData.radar = chartDataPre.radar;
                    break;
                case 'map':
                    chartData.visualMap = chartDataPre.visualMap;
                    break;
            }
        }
        chartData.series = chartDataPre.series;
        B_Chart._getEChart('line',dom,chartData,chartClickId);
    }
}
var M_Game = {
    _appGameType:['','游戏','体育','动作游戏','娱乐场游戏','家庭游戏','小游戏','扑克牌游戏','探险游戏','教育游戏','文字游戏','智力游戏','桌面游戏','模拟游戏','策略游戏','街机游戏','角色扮演游戏','赛车游戏','音乐','骰子游戏'],
    _appListType:['','免费','付费','畅销'],
    _appPlatType:['','iPhone','iPad'],
    _gameClassify:['手游','页游','端游','单机'],
    _gameType:['全部','休闲益智','体育','冒险','动作','射击','模拟','竞技游戏','竞速','策略','角色扮演','音乐游戏'],
    _gameInfo:{},
    _gameVisitCache:[],
    _gameVisitColumnCache:[],
    _gameVisitIsChange:false,
    _htmlGameVisitHide:function (columnType) {
        if(!(M_Game._gameVisitCache && M_Game._gameVisitCache.length > 0)){
            M_Game._gameVisitCache = B_Storage._get('gameVisitStorage');
            if(!M_Game._gameVisitCache)M_Game._gameVisitCache = [];
        }
        $('#topGame').attr('data-t',columnType);
        M_Game._formatInfoDetailHead();
    },
    _formatInfoDetailHead:function (type) {
        if(M_Game._gameVisitCache && M_Game._gameVisitCache.length > 0){
            if(type){
                if($('#headerTop').html() == ''){
                    $('#headerTop').removeClass('center-headertop2 default-flytest-ht');
                }else{
                    $('#headerTop').addClass('center-headertop2 default-flytest-ht');
                }
            }else{
                if($('#headerTop').html() == ''){
                    $('#headerTop').removeClass('default-flytest-ht');
                }else{
                    $('#headerTop').addClass('center-headertop2 default-flytest-ht');
                }
            }
            M_Game._htmlVisitInit(type);
        }else{
            $('#topGame').hide();
            $('#headerTop').removeClass('center-headertop2 default-flytest-ht');
            $('#headerTop').show();
        }
        if(!M_Init._headMenuIsShow){
            M_Init._headMenuIsShow = true;
            var url =  B_Common._getUrl('hash');
            if(M_Game._gameVisitCache && M_Game._gameVisitCache.length > 0){
                $('#topGame').hide();
                if($('#headerTop').html() == ''){
                    $('#headerTop').removeClass('default-flytest-ht');
                }else{
                    $('#headerTop').addClass('center-headertop2 default-flytest-ht');
                }
            }else{
                $('#headerTop').hide();
            }
            M_Game._doHeadFly('left');
        }
    },
    _formatGameVisitLength:function () {
        var hasSelected = false;
        var selectNumber = 0;
        $('#topGame .chrome-tabs li').each(function (index) {
            if($(this).hasClass('active')){
                hasSelected = true;
            }
            selectNumber = index;
        })
        selectNumber++;
        var tabWidth = $('#topGame .chrome-tabs').width();
        if(hasSelected){
            tabWidth -= 205;
            selectNumber -= 1;
        }
        tabWidth = tabWidth/selectNumber;

        $('#topGame .chrome-tabs li').each(function () {
            if(!($(this).hasClass('active'))){
                $(this).width(tabWidth);
            }
        })
    },
    _checkGameVisitList:function (type) {
        if(!(M_Game._gameVisitCache && M_Game._gameVisitCache.length > 0)){
            M_Game._gameVisitCache = B_Storage._get('gameVisitStorage');
            if(!M_Game._gameVisitCache)M_Game._gameVisitCache = [];
        }
        if(!M_Init._gameDetailId){
            if(M_Game._gameVisitCache.length > 0){
                M_Init._gameDetailId = M_Game._gameVisitCache[(M_Game._gameVisitCache.length-1)];
            }else{
                M_Init._gameDetailId = B_Game._getDemoProjectId();
            }
        }
        M_Init._gameDetailId = parseInt(M_Init._gameDetailId);
        if(!($.inArray(M_Init._gameDetailId,M_Game._gameVisitCache) > -1)){
            if(M_Game._gameVisitCache.length >= 10){
                M_Game._gameVisitCache.shift();
            }
            M_Game._gameVisitCache.push(M_Init._gameDetailId);
            B_Storage._set('gameVisitStorage',M_Game._gameVisitCache);
        }
        M_Game._gameVisitColumnCache[M_Init._gameDetailId] = type;
        M_Game._getGame();

        M_Game._formatInfoDetailHead(type);

        //M_Game._htmlVisitInit(type);
    },
    _htmlVisitInit:function (type) {
        if($('#topGame').is(":hidden")){
            var str = '';
            str += '\
            <div class="top-scale-menu boxshadow">\
                <div class="title" id="bs_center_click">\
                    <i class="tg-icon tg-side-icon tg-side-icon-18"></i>\
                    <span data-t="outsideCenter">舆情中心</span>\
                    <b class="line-a"></b>\
                    <b class="line-b"></b>\
                </div>\
                <div id="chrome-tabs-demo">\
                    <ul class="nav nav-tabs chrome-tabs" role="tablist"></ul>\
                </div>\
                <div class="tg-top-search tg-search-drop" id="gameDropChooseDetail"></div>\
            </div>';

            $('#topGame').show().html(str);
            $('.maincontent').css('margin-top','70px');
            B_Game._dropChoose(M_Init._gameDetailId,'#gameDropChooseDetail',null,function(gameId){
                if(gameId+'' != M_Init._gameDetailId+''){
                    M_Init._gameDetailId = gameId;
                    var type = 'gameLight';
                    B_Jump._go('base',B_Jump._getUrl(type,{gameId:M_Init._gameDetailId}));
                }
            });

            $('#bs_center_click').click(function () {
                if(!($('#gameDropChooseDetail').is(":hidden"))){
                    var columnType = $('#topGame').attr('data-t');
                    if(!columnType)columnType = 'outsideCenter';
                    setTimeout(function () {
                        B_Jump._go('base',B_Jump._getUrl(columnType));
                    },300);
                }
            });
        }

        M_Game._htmlVisitList(type);
        if(type) {
            M_Game._doGameChange(type);
        }
    },
    _doHeadFly:function (direction) {
        switch (direction){
            case 'left':
                M_HeadFoot._animateToLeft();
                break;
            case 'right':
                M_HeadFoot._animateToRight();
                break;
        }
    },
    _htmlVisitList:function (type) {
        if(type) {
            $('#topGame .title').removeClass('title-selected');
            $('#topGame #chrome-tabs-demo').css('right', '250px');
            $('#gameDropChooseDetail').show();
        }else{
            $('#topGame .title').addClass('title-selected');
            $('#topGame #chrome-tabs-demo').css('right','0px');
            $('#gameDropChooseDetail').hide();
        }
        var dataUnion = M_Game._gameVisitCache;
        var gameInfo = B_Game._getGame(dataUnion,dataUnion.length);
        var str = '';
        for(var i=0;i<dataUnion.length;i++){
            if(gameInfo[dataUnion[i]]){
                str += '<li';
                if(type && dataUnion[i] == M_Init._gameDetailId){
                    str += ' class="active"';
                    $('#gameDropChooseDetail .gameDropCurrent').html('<img src="'+gameInfo[dataUnion[i]][0]+'">'+gameInfo[dataUnion[i]][1]+'<i class="tg-graph tg-triangle-gray-bottom"></i>');
                }
                str += ' data-i="'+dataUnion[i]+'"><img src="'+gameInfo[dataUnion[i]][0]+'" alt="'+gameInfo[dataUnion[i]][1]+'"><a>'+gameInfo[dataUnion[i]][1]+'</a><b>×</b></li>';
            }
        }

        if(M_Game._gameVisitIsChange){
            M_Game._gameVisitIsChange = false;
        }else{
            $('#topGame .chrome-tabs').html(str);
            M_Game._formatGameVisitLength();
        }

        if(!B_Storage._get('CLIENT_WIDTH_2'))B_Storage._set('CLIENT_WIDTH_2',document.body.clientWidth);
        window.addEventListener("resize", function(){
            var client_width = document.body.clientWidth;
            var cache_width = B_Storage._get('CLIENT_WIDTH_2');
            if(client_width != cache_width){
                M_Game._formatGameVisitLength();
                B_Storage._set('CLIENT_WIDTH_2',client_width);
            }
        });
        M_Game._doGameRemove(type);

        $('#topGame .chrome-tabs li').each(function () {
            $(this).click(function () {
                if (!($(this).hasClass('active'))) {
                    B_Pop._init('load',{type:1,time:1,shade:[0.4, '#000000']});
                    if(!($('#gameDropChooseDetail').is(":hidden"))){
                        M_Game._gameVisitIsChange = true;
                    }
                    var width = $(this).css('width');
                    $('#topGame .chrome-tabs .active').css('width',width);
                    $(this).addClass('active').siblings().removeClass('active');
                    M_Init._gameDetailId = $(this).attr('data-i');
                    var columnType = M_Game._gameVisitColumnCache[M_Init._gameDetailId];
                    if (!columnType)columnType = 'gameLight';
                    B_Jump._go('base', B_Jump._getUrl(columnType, {gameId: M_Init._gameDetailId}));
                }
            });
        });
    },
    _doGameRemove:function (type) {
        $('#topGame .chrome-tabs li b').each(function () {
            $(this).unbind('click');
            $(this).click(function () {
                var dataId = $(this).parent('li').attr('data-i');
                dataId = parseInt(dataId);
                var index = $.inArray(dataId,M_Game._gameVisitCache);
                if(index > -1){
                    var newArray = [];
                    for(var i=0;i<M_Game._gameVisitCache.length;i++){
                        if(M_Game._gameVisitCache[i]+'' != dataId+''){
                            newArray.push(M_Game._gameVisitCache[i]);
                        }
                    }
                    M_Game._gameVisitCache = newArray;
                    B_Storage._set('gameVisitStorage',newArray);
                }
                if(M_Game._gameVisitColumnCache[dataId])delete M_Game._gameVisitColumnCache[dataId];
                var length = 0;
                if(type){
                    if($(this).parent('li').hasClass('active')){
                        length = M_Game._gameVisitCache.length;
                        if(length <= 0){
                            $(this).parent('li').remove();
                            $('#headerTop').addClass('default-flytest-ht');
                            B_Jump._go('base',B_Jump._getUrl('outsideCenter'));
                            return;
                        }
                        if(index > (length-1)){
                            index = (length-1);
                        }
                        M_Init._gameDetailId = M_Game._gameVisitCache[index];
                        var columnType = M_Game._gameVisitColumnCache[M_Init._gameDetailId] ? M_Game._gameVisitColumnCache[M_Init._gameDetailId] : 'gameLight';
                        if(!M_Init._gameDetailId){
                            M_Init._gameDetailId = M_Game._gameVisitCache[0];
                        }
                        B_Jump._go('base', B_Jump._getUrl(columnType, {gameId: M_Init._gameDetailId}));
                    }
                }else{
                    length = M_Game._gameVisitCache.length;
                    if(length <= 0){
                        $('#topGame').hide();
                        $('#headerTop').removeClass('default-flytest-ht center-headertop2');
                        $('#headerTop').show();
                    }
                }
                $(this).parent('li').remove();
            });
        });
    },
    _doGameChange:function (type) {
        changeSetTimeOut = '';
        clearTimeout(changeSetTimeOut);
        if(!B_Game._checkAuthGame(M_Init._gameDetailId)){
            B_Login._openProbation('game&gameId='+M_Init._gameDetailId);
            return false;
        }
        changeSetTimeOut = setTimeout(function () {
            switch (type){
                case 'gameSummary':
                    F_GameSummary_Info._domInit();
                    break;
                case 'gameLight':
                    F_GameLight_Info._domInit();
                    break;
                case 'gameSentiment':
                    F_GameSentiment_Info._domInit();
                    break;
                case 'gameForum':
                    F_GameForum_Info._domInit();
                    break;
                case 'gameChannel':
                    F_GameChannel_Info._domInit();
                    break;
                case 'gamePost':
                    F_GamePost_Info._getSource();
                    F_GamePost_Info._getClassify();
                    break;
                case 'gameComment':
                    F_GameComment_Info._getSource();
                    break;
                case 'gameFaceSummary':
                    F_FaceSummary_Info._getInfo();
                    break;
                case 'gameFaceDetail':
                    F_FaceDetail_Info._getUnion(1);
                    break;
                case 'gameFaceCompare':
                    F_FaceCompare_Info._getUnion(2);
                    F_FaceCompare_Info._getUnion(3);
                    break;
                case 'gameTieba':
                    F_GameTieba_Info._domInit();
                    break;
                case 'gameAnalysis':
                    F_GameAnalysis_Info._domInit();
                    break;
                case 'gameAssistant':
                    F_GameAssistant_Info._domInit();
                    break;
            }
        },600);
    },
    _getGame:function () {
        M_Game._gameInfo = B_Game._getGame([M_Init._gameDetailId],1);
        if(!M_Game._gameInfo){
            M_Init._gameDetailId = B_Game._getDemoProjectId();
            M_Game._gameInfo = B_Game._getGame([M_Init._gameDetailId],1);
        }
        M_Game._gameInfo = M_Game._gameInfo[M_Init._gameDetailId];
        if(!M_Game._gameInfo)M_Game._gameInfo = [];
        M_Game._gameInfo[4] = '';
        M_Game._gameInfo[5] = '';
        if(M_Game._gameInfo[3]){
            var GameType = M_Game._gameInfo[3];
            GameType = GameType.split(',');
            if($.inArray('S',GameType) > -1){
                M_Game._gameInfo[3] = 'S';
            }
            M_Game._gameInfo[4] = [];
            var GameTypeName = '';
            for(var i=0;i<GameType.length;i++){
                GameTypeName = B_Game._typeName(GameType[i]);
                if(i==0)M_Game._gameInfo[5] = GameTypeName;
                M_Game._gameInfo[4].push(GameTypeName);
            }
            M_Game._gameInfo[4] = M_Game._gameInfo[4].join(',');
        }
        if(M_Game._gameInfo[3] != 'S'){
            $('#menuNav .nav-sidebar').eq(0).find('li').eq(2).hide();
            $('#menuNav .nav-sidebar').eq(1).find('li').eq(2).hide();
        }else{
            $('#menuNav .nav-sidebar').eq(0).find('li').eq(2).show();
            $('#menuNav .nav-sidebar').eq(1).find('li').eq(2).show();
        }
        /*
        $('#menuNav').prepend('<div class="game-name-show">\
                <div>\
                <img src="'+M_Game._gameInfo[0]+'">\
                <span>'+M_Game._gameInfo[1]+'</span>\
                </div>\
            </div>');
            */
    },
    _chooseGame:function(dom,classifyDom,letterDom){
        var zone = dom;
        zone.html('');
        var letter = S_Game._letter(letterDom);
        var classify = B_Game._classify(classifyDom);
        var games = B_Login._user;
        if(!games.gas_projects){
            return false;
        }
        var games = games.gas_projects;
        var m = {};
        var founded = false;
        function hasLetterOrClassify(source,aim){
            if(source) {
                for (var i = 0; i < source.length; ++i) {
                    if (source[i] != ',' && aim.indexOf(source[i]) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
        for(var i=0; i<games.length; ++i){
            if(hasLetterOrClassify(classify, games[i].game_type) && hasLetterOrClassify(letter, games[i].pinyin)){
                founded = true;
                for(var k=0; k<games[i].pinyin.length; ++k){
                    if(games[i].pinyin[k]==","){
                        continue;
                    }else if(games[i].pinyin[k] in m){
                        m[games[i].pinyin[k]].push(games[i]);
                    }else{
                        m[games[i].pinyin[k]] = [games[i]];
                    }
                }
            }
        }
        var str = '';
        if(founded){
            for(var i=0; i<letter.length; ++i){
                if(letter[i] in m){
                    str += '<dl>';
                    str += '<dt>'+letter[i]+'</dt>';
                    for(var j=0; j<m[letter[i]].length; ++j){
                        var choose = m[letter[i]][j];
                        str += '<dd onclick="M_Outside._redirectLight('+choose.project_id+')">'+choose.project_name+'</dd>';
                    }
                    str += '</dl>';
                }
            }
        }else{
            str = B_Pre._empty('没有找到！');
        }
        zone.find('*').unbind().removeData();
        zone.html(str);
    },
    _menuHotGame:function(index,limit){
        var dom = $('#bs_menu_hot_game');
        var postData = {};
        postData['index'] = index;
        postData['limit'] = limit;
        postData = B_Common._postData(postData);
        B_Port._ajax('recommendGame','get',true,postData,function(){
            dom.html(B_Pre._loading());
            },function(){
            dom.html('');
            },function(data,msg){
                if(data && data.hot_project_list.length > 0){
                    var str = '';
                    var gameId = [];
                    for(var i=0;i<data.hot_project_list.length;i++){
                        gameId.push(data.hot_project_list[i].projcet_id);
                    }
                    var gameInfo = B_Game._getGame(gameId);
                    if(gameInfo){
                        for(var i=0;i<gameId.length;i++){
                            if(gameInfo[gameId[i]]){
                                var key = gameId[i];
                                var value = gameInfo[gameId[i]];
                                var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                                var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                                str += '\
                                    <li onclick="M_Outside._redirectLight('+key+')">\
                                        <img src="'+value[0]+'">\
                                        <div>\
                                        <p title="'+value[1]+'">'+gameName+'</p>\
                                        <span title="'+value[2]+'">'+gameCompany+'</span>\
                                    </div></li>';
                            }
                        }
                    }
                    dom.html(str);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    }
}
var M_Outside = {
    _iconDevice:function (type) {
        type = type.toLowerCase();
        var img = '';
        switch (type){
            case 'pc端':
                img = 'pc';
                break;
            case '移动端':
                img = 'mobile';
                break;
            case 'ios端':
                img = 'ios';
                break;
            case '安卓端':
                img = 'az';
                break;
        }
        return 'elements2.0/img/heitao/icon/'+img+'.png';
    },
    _alarmInit:{'type':['开发','活动','版本'],'typeId':['develop','activity','version'],'power':['白色预警','灰色预警','蓝色预警','黄色预警','橙色预警','红色预警']},
    _openDetail:function (condition) {
        var isIE = function() {
            var browser = B_Common._browser();
            return (browser.name == 'MSIE' && browser.version < 10) ? true : false;
        };
        var dom = $('#bs_open_more');
        dom.show().children('iframe').removeClass('iframe-more-date-hide').attr('src','detail_s.html?'+condition);
        isIE() ?  dom.children('iframe').addClass('iframe-more-date-ie') : dom.children('iframe').addClass('iframe-more-date');
    },
    _searchPop:function () {
        B_Format._arrowOpenClose('input[name="keyword"]','.search-pop-wrap','gameSearch');
        $('.search-pop-wrap .glyphicon-remove').click(function () {
            $('.search-pop-wrap').fadeOut();
        });
        M_Game._chooseGame($("#bs_gameItem"),$("#bs_game .selected"),$("#bs_gameChoose .selected"));

        $('#bs_gameChoose li').click(function(){
            $(this).addClass('selected').siblings().removeClass('selected');
            M_Game._chooseGame($("#bs_gameItem"),$("#bs_game .selected"),$("#bs_gameChoose .selected"));
        });
        $('#bs_game li').click(function(){
            $(this).addClass('selected').siblings().removeClass('selected');
            M_Game._chooseGame($("#bs_gameItem"),$("#bs_game .selected"),$("#bs_gameChoose .selected"));
        });
    },
    _dateDiffInit:function () {
        $('#dc1').html(M_Init._dateCache.begin+' 至 '+M_Init._dateCache.end);
    },
    _keywordSplit:function (query) {
        if(typeof(query) == "string"){
            var urlArray = query.split("&");
            var get = {};
            for(var i in urlArray){
                var j = urlArray[i].split("=");
                get[j[0]] = j[1];
            }
            return get;
        } else {
            return {};
        }
    },
    _doSearch:function () {
        var keyword = $.trim($("input[name='keyword']").val());
        if(keyword == ''){
            //B_Pop._init('msg',{'content':'搜索关键词必须填写，请确认！'});
            B_Jump._go('target','outsideCenter');
        }else{
            M_Outside._redirectCenter(B_Common._encodeUrl(keyword));
        }
    },
    _redirectCenter:function (keyword) {
        B_Jump._go('hash','/outsideCenter/'+keyword);
    },
    _redirectLight:function (gameId) {
        if(B_User._isDemoUser()){
            B_Login._openLogin('l_'+gameId);
        }else{
            if(B_Game._checkAuthGame(gameId)){
                var url = B_Jump._getUrl('gameLight',{gameId:gameId});
                B_Jump._go('base',url);
            }else{
                B_Login._openProbation('game&gameId='+gameId);
            }
        }
    },
    _redirectComments:function (condition) {
        var cond = [];
        if(condition.gameId)cond.push('g='+condition.gameId);
        if(condition.dateBegin)cond.push('b='+condition.dateBegin);
        if(condition.dateEnd)cond.push('e='+condition.dateEnd);
        if(condition.channelId)cond.push('f='+condition.channelId);
        if(condition.ratingStageList)cond.push('s='+condition.ratingStageList);
        if(condition.esFieldName)cond.push('n='+B_Common._encodeUrl(condition.esFieldName));
        if(condition.esFieldVal)cond.push('v='+B_Common._encodeUrl(condition.esFieldVal));
        if(condition.sentimentKeywords && condition.sentimentKeywordsType){
            cond.push('w='+B_Common._encodeUrl(condition.sentimentKeywords));
            cond.push('wt='+condition.sentimentKeywordsType);
        }
        cond = cond.join('&');
        B_Jump._go('hash','/gameComment/'+cond);
    },
    _redirectForum:function (condition) {
        var cond = [];
        if(condition.gameId)cond.push('g='+condition.gameId);
        if(condition.topicId)cond.push('t='+B_Common._encodeUrl(condition.topicId));
        if(condition.dateBegin)cond.push('b='+condition.dateBegin);
        if(condition.dateEnd)cond.push('e='+condition.dateEnd);
        if(condition.classifySentiment)cond.push('s='+condition.classifySentiment);
        if(condition.lighttowerClassify)cond.push('c='+B_Common._encodeUrl(condition.lighttowerClassify));
        if(condition.realTag)cond.push('r='+B_Common._encodeUrl(condition.realTag));
        if(condition.keywords)cond.push('k='+B_Common._encodeUrl(condition.keywords));
        if(condition.sentimentScore)cond.push('o='+B_Common._encodeUrl(condition.sentimentScore));
        if(condition.infoIdList)cond.push('f='+condition.infoIdList);
        cond = cond.join('&');
        B_Jump._go('hash','/gamePost/'+cond);
    },
    _redirectAtlas:function (gameId) {
        B_Jump._go('hash','/outsideAtlas/'+gameId);
    },
    _clickScroll:function(preDom,nextDom,scrollDom,sliderDom,itemWidth,perScrollNumber,perPageCount,onClass){
        var page = 0;
        var itemCount = scrollDom.find("li").length; //总个数
        itemWidth = itemWidth * perScrollNumber;

        if(perPageCount >= itemCount){
            nextDom.removeClass(onClass).unbind();
        }
        if(page == 0){
            preDom.removeClass(onClass).unbind();
        }
        nextDom.click(function(){
            nextClick()
        });
        preDom.click(function(){
            preClick()
        });
        function nextClick(){
            if(!scrollDom.is(":animated")){
                if(itemCount <= perPageCount){
                    return;
                }
                scrollDom.animate({left:'-='+itemWidth},"slow");
                if(sliderDom && sliderDom != '')sliderDom.animate({left:'-='+itemWidth},"slow");
                page++;
                if(((page*perScrollNumber)+perPageCount) == itemCount){
                    nextDom.removeClass(onClass).unbind();
                }
                if(page > 0){
                    preDom.bind("click",function(){
                        preClick()
                    }).addClass(onClass);
                }
            }
        }
        function preClick(){
            if(!scrollDom.is(":animated")){
                if(page == 0){
                    return;
                }
                scrollDom.animate({left:'+='+itemWidth},"slow");
                if(sliderDom && sliderDom != '')sliderDom.animate({left:'+='+itemWidth},"slow");
                page--;
                if(page == 0){
                    preDom.removeClass(onClass).unbind();
                }
                if((page+perPageCount) < itemCount){
                    nextDom.bind("click",function(){
                        nextClick();
                    }).addClass(onClass);
                }

            }
        }
    },
    _domCreate:function(type,dateId,id,name){
        var str = '<div class="tg-table-layout blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12"><h3 class="tip-hover">'+name+'</h3>';
        switch (type){
            case 'analysisChartTableDate':
            case 'analysisChartTableDateTab':
                str += '<div class="tg-selected-drop tg-date-fl">';
                str += '<span>日期</span>';
                str += '<p class="tg-drop-text-part">';
                str += '<i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc' + dateId + '"></span><input id="db' + dateId + '" type="hidden" value=""><input id="de' + dateId + '" type="hidden" value="">';
                str += '</p></div>';
                break;
        }
        str += '<div class="boxshadow tg-table-content">';
        switch(type) {
            case 'analysisChartTableDateTab':
            case 'chartTableDateTab':
                str += '<ul class="tg-tab-change-block channel-narrow-width" id="bs_tab_'+id+'"></ul>';
                break;
        }

        switch(type) {
            case 'chartTableDateTab':
            case 'chartTableDate':
            case 'tableDate':
                str += '<div class="tg-selected-drop tg-date-fl">';
                str += '<span>日期</span>';
                str += '<p class="tg-drop-text-part">';
                str += '<i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc' + dateId + '"></span><input id="db' + dateId + '" type="hidden" value=""><input id="de' + dateId + '" type="hidden" value="">';
                str += '</p></div>';
                break;
        }

        str += '<div id="lt_main_area_'+id+'" class="cs_chart_table">';

        switch(type) {
            case 'analysisChartTableDate':
            case 'analysisChartTableDateTab':
            case 'chartTableDateTab':
            case 'chartTableDate':
                str += '<div class="insidelog-graph " id="bs_chart_' + id + '" style="width: 96%;"></div>';
                str += '<div id="bs_table_'+id+'" class="tg-table-wrap b_none">';
                break;
            default:
                str += '<div id="bs_table_'+id+'" class="tg-table-wrap tg-table-no-padding">';
                break;
        }

        str += '<div class="table-out-wrap no-margin-top" id="bs_table_list_'+id+'"></div>';
        str += '<ul class="tg-page-list" id="bs_page_'+id+'"></ul>';
        str += '</div>';

        str += '<div class="boxshadow tg-table-operation" id="bs_icon_'+id+'">';
        switch(type){
            case 'analysisChartTableDate':
            case 'analysisChartTableDateTab':
            case 'chartTableDateTab':
            case 'chartTableDate':
                str += '<ul class="fl">';
                str += '<li><i class="tg-icon tg-pic-selected" id="bs_icon_chart_'+id+'"></i></li>';
                str += '<li><i class="tg-icon tg-table" id="bs_icon_table_'+id+'"></i></li>';
                str += '</ul>';
                break;
        }

        str += '<ul class="fr">';
        str += '<li>';
        str += '<b>下载数据</b><i class="tg-icon tg-download bs_icon_down" data-i="'+id+'"></i>';
        str += '</li>';
        str += '</ul>';
        str += '</div>';

        str += '</div>';
        str += '</div>';
        str += '</div>';

        return str;
    },
    _tableHtml:function (id,name) {
        var str = '';
        str += '\
            <div id="tgRank" class="tg-table-layout blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                <h3>'+name+'</h3>\
                <div class="boxshadow tg-table-content">\
                    <div class="tg-table-wrap tg-table-no-padding tg-height-hight" id="'+id+'">\
                        <div class="table-out-wrap"></div>\
                        <ul class="tg-page-list" id="lt_forum_page"></ul>\
                    </div>\
                </div>\
            </div>';

        return str;
    },
    _dropHtml:function (id,name,item,icon,selected) {
        var str = '';
        str += '<div class="tg-selected-drop fl '+id+'">';
        str += '<div><i class="tg-icon tg-area-icon '+icon+'"></i>';
        str += '<span>'+name+'</span></div>';
        var begin = 0;
        if(!selected)selected = 0;
        var selectedStr = '';
        var listStr = '';
        for(var i=0;i<item.length;i++){
            if(item[i] != ''){
                if(begin==selected) {
                    selectedStr += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span data-i="' + i + '">' + item[i] + '</span></p>';
                }
                if(begin==0){
                    listStr += '<ul>';
                }
                listStr += '<li><a data-i="'+i+'">'+item[i]+'</a></li>';
                begin++;
            }
        }
        listStr += '</ul></div>';
        return str+selectedStr+listStr;
    },
    _dropKVHtml:function (id,name,item,icon) {
        var str = '';
        str += '<div class="tg-selected-drop fl '+id+'">';
        str += '<div>';
        if(icon)str += '<i class="tg-icon tg-area-icon '+icon+'"></i>';
        str += '<span>'+name+'</span></div>';
        var begin = 0;
        for(var i=0;i<item.length;i++){
            if(item[i] != ''){
                if(begin==0){
                    str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span data-i="'+item[i].key+'">'+item[i].name+'</span></p>';
                    str += '<ul>';
                    begin++;
                }
                str += '<li><a data-i="'+item[i].key+'">'+item[i].name+'</a></li>';
            }
        }
        str += '</ul></div>';
        return str;
    },
    _htmlArrow:function (rank,unit,number) {
        rank = rank ? rank : '-';
        var str = '';
        if(rank > 0){
            if(typeof(number) != 'undefined')str += '<span class="comment-num positive-color">'+number+'</span>';
            str += '<b class="up">↑</b>';
        }else if(rank < 0) {
            if(typeof(number) != 'undefined')str += '<span class="comment-num negative-color">'+number+'</span>';
            str += '<b class="down">↓</b>';
            rank = Math.abs(rank);
        }else{
            if(typeof(number) != 'undefined')str += '<span class="comment-num">'+number+'</span>';
            str += '<b>→</b>';
        }
        if(unit != 'app'){
            str += '<span>'+rank+unit+'</span>';
        }
        return str;
    },
    _dropShow:function(dom){
        dom = dom ? dom : 'tg-selected-drop';
        $("."+dom+" p").unbind('click');
        $("."+dom+" p").click(function() {
            var ul = $(this).parent('.'+dom).children('ul');
            var btnUl = $(this).parent('.'+dom).children('.wrap');
            if(btnUl.length > 0){
                if (btnUl.css("display") == "none") {
                    btnUl.slideDown("fast");
                } else {
                    btnUl.slideUp("fast");
                }
            }else{
                if (ul.css("display") == "none") {
                    ul.slideDown("fast");
                } else {
                    ul.slideUp("fast");
                }
            }
        });
    },
    _dropSelected:function(callback,dom){
        dom = dom ? dom : 'tg-selected-drop';
        $("."+dom+" ul li a").click(function() {
            var txt = $(this).text();
            var key = $(this).attr('data-i');
            var projectId = $(this).attr('data-d');
            var current = $(this).parents('.'+dom).find('p span').attr('data-i');
            $(this).parents('.'+dom).find('p span').html(txt).attr('data-i', key);
            $(this).parents('.'+dom).find('p span').html(txt).attr('data-d', projectId);
            $(this).parents('.'+dom).children('ul').hide();
            if(current != key){
                callback && callback(key,projectId);
            }
        });
    },
    _dropLeave:function (dom) {
        dom = dom ? dom : 'tg-selected-drop';
        $('.'+dom).mouseleave(function(event) {
            $(this).children('ul').hide();
            $(this).children('.wrap').hide();
        });
    }
}