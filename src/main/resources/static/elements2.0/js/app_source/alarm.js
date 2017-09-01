var F_Alarm_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-1-1');
        M_Game._htmlGameVisitHide('outsideAlarm');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            var $_GET = B_Common._getUrl('query');
            if ($_GET.g && !isNaN($_GET.g)) {
                B_Game._setLast($_GET.g, 'outsideAlarm');
                M_Init._gameId = $_GET.g;
                if ($_GET.date && $_GET.sub_type && $_GET.main_type) {
                    M_Init._dataCache['date'] = B_Common._decodeUrl($_GET.date);
                    M_Init._dataCache['sub_type'] = B_Common._decodeUrl($_GET.sub_type);
                    M_Init._dataCache['main_type'] = B_Common._decodeUrl($_GET.main_type);
                }
            }else{
                M_Init._gameId = M_Init._getGameId('outsideAlarm');
            }
            B_Game._dropChoose(M_Init._gameId, '#gameDropChoose', null, function (gameId) {
                if (gameId + '' != M_Init._gameId + '') {
                    B_Game._setLast(gameId, 'outsideAlarm');
                    M_Init._gameId = gameId;
                    F_Alarm_Info._getMail();
                    F_Alarm_Info._getInfo();
                }
            });

            F_Alarm_Info._getMail();
            F_Alarm_Info._getInfo();

            $('.switch-btn span').click(function(){
                F_Alarm_Common._openAdd();
            });
        }
    }
}
var F_Alarm_Info = {
    _cache:{},
    _getFromChartClick:function(date,classify){
        var index = $.inArray(classify,F_Alarm_Common._init.type);
        if(index > -1){
            var classifyId = F_Alarm_Common._init.typeId[index];
            if(M_Init._dataCache['chartData'] && M_Init._dataCache['chartData'][classifyId]){
                var data = M_Init._dataCache['chartData'][classifyId];
                var firstWord = {date:'',word:'',classify:'',level:0};
                for(var i=0;i<data.length;i++){
                    if(date == data[i].data_date){
                        firstWord.date = data[i].data_date;
                        firstWord.word = data[i].sub_type;
                        firstWord.level = data[i].warn_level > 6 ? 6 : Math.ceil(data[i].warn_level);
                        firstWord.classify = classify+'类问题';
                        break;
                    }
                }
                if(firstWord.date != ''){
                    M_ForumList._postData.type = 'suddenly';
                    M_ForumList._postData.classify = firstWord.classify;
                    M_ForumList._postData.level = F_Alarm_Common._init.power[firstWord.level];
                    M_ForumList._postData.data = {data_date:firstWord.date,sub_type:firstWord.word}
                    M_ForumList._getList(1);
                }
            }
        }
    },
    _getMail:function(){
        var postData = {};
        postData['project_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax('sigmaItWarnMailGet','get',true,postData,null,null,function(data,msg){
                if(data && data.task_name){
                    F_Alarm_Info._cache['mailData'] = data;
                }else{
                    F_Alarm_Info._cache['mailData'] = '';
                }
            },null
        )
    },
    _getInfo:function(){
        var postData = {};
        postData['project_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax('sigmaItWarn','get',true,postData,function(){
                B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
            },function(){
                B_Pop._init('close');
            },function(data,msg){
                if(data && data.develop){
                    M_Init._dataCache['chartData'] = data;
                    var chartDataPre = {xAxis:[],series:{},legend:[]};
                    var firstWord = {date:'',word:'',classify:'',level:0};
                    var d = 1;
                    $.each(data,function(key,value){
                        var currentName = '';
                        var index = $.inArray(key,F_Alarm_Common._init.typeId);
                        if(index > -1){
                            currentName = F_Alarm_Common._init.type[index];
                        }
                        chartDataPre.legend.push(currentName);
                        chartDataPre.series[currentName] = [];
                        for(var i=0;i<value.length;i++){
                            if(value[i].warn_level > 0){
                                firstWord.date = value[i].data_date;
                                firstWord.word = value[i].sub_type;
                                firstWord.level = value[i].warn_level > 6 ? 6 : Math.ceil(value[i].warn_level);
                                firstWord.classify = currentName+'类问题';
                            }
                            if(d == 1)chartDataPre.xAxis.push(value[i].data_date);
                            if(value[i].warn_level > 6)value[i].warn_level = 6;
                            chartDataPre.series[currentName].push(value[i].warn_level);
                        }
                        d++;
                    })
                    F_Alarm_Info._chartInfo(chartDataPre);

                    if(M_Init._dataCache['date'] &&  M_Init._dataCache['date'] != ''){
                        firstWord = {date:M_Init._dataCache['date'],word:M_Init._dataCache['sub_type'],classify:M_Init._dataCache['main_type']+'类问题',level:0};
                    }
                    if(firstWord.word == ''){
                        $('#lt_forum_list').html(B_Pre._empty('当前时间段该类问题舆情正常，无需警戒'));
                        $('#lt_forum_detail').html('');
                    }else{
                        M_ForumList._postData.type = 'suddenly';
                        M_ForumList._postData.classify = firstWord.classify;
                        M_ForumList._postData.level = F_Alarm_Common._init.power[firstWord.level];
                        M_ForumList._postData.data = {data_date:firstWord.date,sub_type:firstWord.word}
                        M_ForumList._getList(1);
                    }
                }
            },function(data,msg,code){
                B_Pop._init('msg',{content:msg});
            }
        )
    },
    _chartInfo:function(chartDataPre){
        if(chartDataPre && chartDataPre.xAxis){
            var chartData = {series:[]};
            var i = 1;
            $.each(chartDataPre.series,function(key,value){
                chartData.series.push({
                    lineStyle:{
                        normal:{
                            width:2
                        }
                    },
                    smooth:true,
                    symbol:'roundRect',
                    symbolSize:8,
                    name:key,
                    type:'line',
                    data:value
                });
            });
            chartData.tooltip = {trigger:'axis'};
            chartData.legend = {
                itemGap:15,
                itemWidth:12,
                itemHeight:12,
                top :'bottom',
                align:'left',
                data:chartDataPre.legend,
                textStyle:{
                    fontSize:12
                }
            };
            chartData.grid = {
                left: '2%',
                right: '2%',
                bottom: '8%',
                top: '5%',
                containLabel: true
            };
            chartData.xAxis = [
                {
                    splitLine : {
                        show : false
                    },
                    type : 'category',
                    data : chartDataPre.xAxis,
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
                        },
                        formatter: function (value, index) {
                            return B_Date._hourChart(value);
                        }
                    }
                }
            ];
            chartData.yAxis = [
                {
                    splitLine : {
                        lineStyle:{
                            color:'#EEEEEE'
                        }
                    },
                    name : null,
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
                        },
                        formatter:function(value, index){
                            var yName = index > 0 ? index == 6 ? '高危预警' : F_Alarm_Common._init.power[index] : '';
                            return yName;
                        }
                    },
                    min:0,
                    max:6
                }
            ];
            B_Chart._getEChart('line','bs_suddenly_chart',chartData);
        }
    }
}
var F_Alarm_Common = {
    _init:{'type':['开发','活动','版本'],'typeId':['develop','activity','version'],'power':['白色预警','灰色预警','蓝色预警','黄色预警','橙色预警','红色预警']},
    _openAdd:function(){
        B_Pop._init('close');
        B_Pop._init('open',{'type':2,'scroll':true,'title':'邮件设置','width':'740px','height':'395px','shift':2,'content':'outsidealarm_s.html?g='+M_Init._gameId},'');
    }
}