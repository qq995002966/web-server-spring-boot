var F_GameAssistant_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-10');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            M_Init._clean();
            var $_GET = B_Common._getUrl('query');
            if($_GET.g){
                M_Init._gameDetailId = $_GET.g;
                B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
            }else{
                if(gameId){
                    M_Init._gameDetailId = gameId;
                    B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
                }else{
                    if(!M_Init._gameDetailId){
                        M_Init._gameDetailId = M_Init._getGameId('outsideGameDetail');
                    }
                }
            }
            M_Game._checkGameVisitList('gameAssistant');
        }
    }
}
var F_GameAssistant_Info = {
    _chartClick:function (type,value) {
        var data = [];
        switch(type){
            case 'bs_hotword_tread_light':
                data.push('g='+M_Init._gameDetailId);
                data.push('b='+B_Common._encodeUrl(value.date));
                data.push('e='+B_Common._encodeUrl(value.date));
                data.push('w='+B_Common._encodeUrl(value.name));
                data.push('z=bbs');
                break;
            case 'bs_suddenly_chart':
                var index = $.inArray(value.classify,M_Outside._alarmInit.type);
                if(index > -1){
                    var classifyId = M_Outside._alarmInit.typeId[index];
                    if(M_Init._dataCache['alarmData'] && M_Init._dataCache['alarmData'][classifyId]){
                        var dataUnion = M_Init._dataCache['alarmData'][classifyId];
                        for(var i=0;i<dataUnion.length;i++){
                            if(value.date == dataUnion[i].data_date){
                                data.push('g='+M_Init._gameDetailId);
                                data.push('d='+B_Common._encodeUrl(dataUnion[i].data_date));
                                data.push('p='+B_Common._encodeUrl(dataUnion[i].sub_type));
                                data.push('s_n='+B_Common._encodeUrl(value.classify));
                                break;
                            }
                        }
                    }
                }
                if(!(data && data.length > 0)){
                    B_Pop._init('msg',{content:'查询参数错误，请刷新页面重试'});
                    return false;
                }else{
                    data.push('z=suddenly');
                }
                break;
        }
        if(data)data = data.join('&');

        M_Outside._openDetail(data);
    },
    _domInit:function () {
        var str = '';
        str += '<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">';
        str += '<h3>舆情突发问题监测</h3>';
        str += '<div class="boxshadow"><div class="suddenly-graph"><div id="bs_suddenly_chart" style="width: 100%; height: 100%"></div></div></div>';
        str += '</div>';

        str += '<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">';
        str += '<h3 class="part-title">热词走势追踪</h3>';
        str += '<div class="boxshadow">';
        str += '<div class="tg-filter-show">';
        str += '<ul class="hot-filter-list">';
        str += '<p>选择监测日期</p>';
        str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc1"></span><input id="db1" type="hidden" value=""><input id="de1" type="hidden" value=""></p>';
        str += '<p>选择监测热词</p>';
        str += '</ul>';
        str += '<ul class="hotword-graph-show">';
        str += '<div id="bs_hotword_tread_light" class="b_chart"></div>';
        str += '</ul>';
        str += '</div></div>';
        str += '</div>';

        str += '<div class="more" id="bs_open_more">\
                    <iframe src="" frameborder="0" id="IframePart" class="iframe-more-date" height="100%" width="100%" scrolling="no"></iframe>\
                </div>';

        $('#ct_main_area').html(str);

        F_GameAssistant_Info._getAlarmInfo();

        B_Date._chooseSection({'autoCommit':true,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                M_Init._dateCache.begin = begin;
                M_Init._dateCache.end = end;
                F_GameAssistant_Info._getWordInfo();
            }
        });

    },
    _getAlarmInfo:function(){
        var dom = $('#bs_suddenly_chart');
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('sigmaItWarn','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html();
            },function(data,msg){
                if(data && data.develop){
                    M_Init._dataCache['alarmData'] = data;
                    var chartDataPre = {xAxis:[],series:{}};
                    var firstWord = {date:'',word:'',classify:'',level:0};
                    var d = 1;
                    $.each(data,function(key,value){
                        var currentName = '';
                        var index = $.inArray(key,M_Outside._alarmInit.typeId);
                        if(index > -1){
                            currentName = M_Outside._alarmInit.type[index];
                        }
                        chartDataPre.series[currentName] = [];
                        for(var i=0;i<value.length;i++){
                            if(d == 1)chartDataPre.xAxis.push(value[i].data_date);
                            if(value[i].warn_level > 6)value[i].warn_level = 6;
                            chartDataPre.series[currentName].push(value[i].warn_level);
                        }
                        d++;
                    })
                    F_GameAssistant_Info._chartInfo(chartDataPre);

                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _chartInfo:function(chartDataPre){
        if(chartDataPre && chartDataPre.xAxis){
            var chartData = {series:[]};
            var i = 1;
            chartDataPre.legend = [];
            $.each(chartDataPre.series,function(key,value){
                chartDataPre.legend.push({'name':key,'icon':'roundRect'});
                chartData.series.push({
                    lineStyle:{
                        normal:{
                            width:2
                        }
                    },
                    smooth:true,
                    name:key,
                    type:'line',
                    data:value
                });
            });
            chartData.tooltip = {trigger:'axis'};
            chartData.legend = {
                left:'right',
                data:chartDataPre.legend
            };
            chartData.grid = {
                left: '30',
                right: '30',
                bottom: 0,
                top: '6%',
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
                            var yName = index > 0 ? index == 6 ? '高危预警' : M_Outside._alarmInit.power[index] : '';
                            return yName;
                        }
                    },
                    min:0,
                    max:6
                }
            ];
            B_Chart._getEChart('line','bs_suddenly_chart',chartData,'gameAssistantAlarm');
        }
    },
    _getWordInfo:function(){
        var dom = $('#bs_hotword_tread_light');
        var postData = {};
        postData['data_date_start'] = M_Init._dateCache.begin;
        postData['data_date_end'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('hotWordTrend','get',true,postData,function(){
            dom.html(B_Pre._loading());
        },function(){
            dom.html('');
        },function(data,msg){
            if(data){
                var chartDataPre = {word:{},x_axis:[],y_axis:[],xFormatDate:true,legendSelectMode:true};
                var dateArr = B_Date._dateArray(M_Init._dateCache.begin,M_Init._dateCache.end);
                $.each(data,function(key,dataArr){
                    chartDataPre.word[key] = {date:[],number:[]};
                    if(dataArr){
                        for(var i=0;i<dataArr.length;i++){
                            var date = B_Date._dateFormat('base',dataArr[i][0]);
                            chartDataPre.word[key].date.push(date);
                            chartDataPre.word[key].number.push(dataArr[i][1]);
                        }
                    }
                });
                var i = 0;
                var number = [];
                M_Init._dataCache['word'] = [];
                $.each(chartDataPre.word,function(key,dataObj){
                    number = [];
                    M_Init._dataCache['word'].push(key);
                    $.each(dateArr,function(dkey,value){
                        if(i == 0)chartDataPre.x_axis.push(value.big);
                        var index = $.inArray(value.big,dataObj.date);
                        if(index > -1){
                            number.push(dataObj.number[index]);
                        }else{
                            number.push(0);
                        }
                    });
                    chartDataPre.y_axis.push({'name':key,'data':number});
                    i++;
                });

                M_Outside_Chart._chartData('line','bs_hotword_tread_light',chartDataPre);

                if(!M_Init._dataCache['wordHasAppend']){
                    M_Init._dataCache['wordHasAppend'] = true;
                    $('.hot-filter-list').append(F_GameAssistant_Info._htmlWords());
                    F_GameAssistant_Info._btnClickChangeWord();
                }
            }
        },function(data,msg,code){
            dom.html(B_Pre._empty(msg));
        })
    },
    _btnClickChangeWord:function(){
        $('.hot-filter-list .tg-main-btn').click(function(){
            var word = [];
            var lengthCheck = false;
            $('input[name="word"]').each(function(){
                var val = $.trim($(this).val());
                if(val != ''){
                    if(val.length > 6)lengthCheck = true;
                    val = B_Format._blankRemove(val);
                    word.push(val);
                }
            });
            if(lengthCheck){
                B_Pop._init('msg',{'content':'请输入不多于6个字的热词'});
                return false;
            }
            if(word.length == 0){
                B_Pop._init('msg',{'content':'监控热词不能为空'});
                return false;
            }else{
                var isUpdate = false;
                if(M_Init._dataCache['word'].length == word.length){
                    for(var i=0;i<word.length;i++){
                        if(!($.inArray(word[i],M_Init._dataCache['word']) > -1)){
                            isUpdate = true;
                        }
                    }
                }else{
                    isUpdate = true;
                }
                if(isUpdate){
                    var word = word.join(' ');
                    var postData = {};
                    postData['custom_keywords'] = word;
                    postData['project_id'] = M_Init._gameDetailId;
                    postData = B_Common._postData(postData);
                    F_GameAssistant_Info._doWordUpdate(postData);
                }else{
                    B_Pop._init('msg',{'content':'请修改监控热词'});
                    return false;
                }
            }
        });
    },
    _doWordUpdate:function(postData){
        var btnDom = $('.hot-filter-list .tg-main-btn');
        B_Port._ajax('insertCustomKeywords','post',true,postData,function(){
            B_Common._btnTextStatus('disable',btnDom,{'disable':'修改中...'});
        },function(){
            B_Common._btnTextStatus('normal',btnDom,{'normal':'修改'});
        },function(data,msg){
            B_Pop._init('msg',{content:'修改成功'});
            setTimeout(function(){
                F_GameAssistant_Info._getWordInfo();
            },1000)
        },function(data,msg,code){
            B_Pop._init('msg',{content:B_Pre._empty(msg)});
        })
    },
    _htmlWords:function(){
        var str = '';
        for(var i=0;i<5;i++){
            var word = M_Init._dataCache['word'][i] ? M_Init._dataCache['word'][i] : '';
            str += '<li><input class="tg-input" type="text" name="word" placeholder="热词'+(i+1)+'" maxlength="20" value="'+word+'"></li>';
        }
        str += '<li><a class="tg-main-btn">修改</a></li>';
        return str;
    }
}