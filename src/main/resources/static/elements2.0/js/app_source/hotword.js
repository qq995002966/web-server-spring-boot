var F_Hot_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-1-2');
        M_Game._htmlGameVisitHide('outsideHotWord');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            M_Init._clean();
            M_Init._gameId = M_Init._getGameId('outsideHotWord');
            B_Game._dropChoose(M_Init._gameId,'#gameDropChoose',null,function(gameId){
                if(gameId+'' != M_Init._gameId+''){
                    B_Game._setLast(gameId,'outsideHotWord');
                    M_Init._gameId = gameId;
                    F_Hot_Info._getChartInfo();
                }
            });
            B_Date._chooseSection({'autoCommit':true,'todayValid':false,'minValidDate':M_Init._dateChoose.beginLimit},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;
                    F_Hot_Info._getChartInfo();
                }
            });
        }
    }
}

var F_Hot_Info = {
    _getFromChartClick:function(date,word){
        if(!(date == M_ForumList._postData.data.begin && word == M_ForumList._postData.data.word)){
            M_ForumList._postData.data = {begin:date,end:date,word:word};
            M_ForumList._getList(1);
        }
    },
    _getChartInfo:function(type){
        B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        var begin = M_Init._dateCache.begin;
        var end = M_Init._dateCache.end;

        var postData = {};
        postData['data_date_start'] = begin;
        postData['data_date_end'] = end;
        postData['project_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);

        B_Port._ajax('hotWordTrend','get',true,postData,function(){
            $('#bs_hotwrod_tread').html(B_Pre._loading());
        },function(){
            B_Pop._init('close');
            $('#bs_hotwrod_tread').html('');
        },function(data,msg){
            if(data){
                var dateArr = B_Date._dateArray(begin,end);
                var chartData = {};
                var chartDataPre = {xAxis:[],word:{},series:[],legend:[]};
                var firstWord = {begin:'',end:'',word:''};
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
                var i = 1;
                M_Init._dataCache['word'] = [];
                $.each(chartDataPre.word,function(key,dataObj){
                    M_Init._dataCache['word'].push(key);
                    chartDataPre.legend.push(key);
                    var chartSeries = {
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
                        data:[]
                    };
                    $.each(dateArr,function(dkey,value){
                        if(i == 1)chartDataPre.xAxis.push(value.big);
                        var index = $.inArray(value.big,dataObj.date);
                        if(index > -1){
                            if(firstWord.word == '' && dataObj.number[index] > 0){
                                firstWord.word = key;
                                firstWord.begin = value.big;
                                firstWord.end = value.big;
                            }
                            chartSeries.data.push(dataObj.number[index]);
                        }else{
                            chartSeries.data.push(0);
                        }
                    });
                    chartDataPre.series.push(chartSeries);
                    i++;
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
                    top: '3%',
                    containLabel: true
                };
                chartData.xAxis = [
                    {
                        splitLine : {
                            lineStyle:{
                                color:'#EEEEEE'
                            }
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
                                return B_Date._dateChart(value);
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
                        name : '帖子数',
                        type : 'value',
                        nameLocation : 'middle',
                        nameTextStyle : {
                            color:'#C2C2C2',
                            fontSize : '11px'
                        },
                        nameGap:30,
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
                        }
                    }
                ];
                chartData.series = chartDataPre.series;
                B_Chart._getEChart('line','bs_hotwrod_tread',chartData);

                switch(type){
                    case 'alter':
                        break;
                    default:
                        $('.hot-filter-list').html(F_Hot_Info._htmlWords());
                        F_Hot_Info._btnClickChangeWord();
                        break;
                }

                if(firstWord.word == ''){
                    $('.left-list').html(B_Pre._empty('当前日期暂无数据'));
                }else{
                    M_ForumList._postData.type = 'keyword';
                    M_ForumList._postData.data = firstWord
                    M_ForumList._getList(1);
                }
            }
        },function(data,msg,code){
            $('#bs_hotwrod_tread').html(B_Pre._empty(msg));
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
                    var postData = {};
                    postData['custom_keywords'] = word.join(' ');
                    postData['project_id'] = M_Init._gameId;
                    postData = B_Common._postData(postData);
                    F_Hot_Info._doWordUpdate(postData);
                }else{
                    B_Pop._init('msg',{'content':'请修改监控热词'});
                    return false;
                }
            }
        });
    },
    _doWordUpdate:function(postData){
        B_Port._ajax('insertCustomKeywords','post',true,postData,function(){
            B_Common._btnTextStatus('disable',$('.hot-filter-list .tg-main-btn'),{'disable':'修改中...'});
        },function(){
            B_Common._btnTextStatus('normal',$('.hot-filter-list .tg-main-btn'),{'normal':'修改'});
        },function(data,msg){
            B_Pop._init('msg',{content:'修改成功'});
            setTimeout(function(){
                F_Hot_Info._getChartInfo('alter');
            },1000)
        },function(data,msg,code){
            B_Pop._init('msg',{content:B_Pre._empty(msg)});
        })
    },
    _htmlWords:function(){
        var str = '<p>选择监测热词</p>';
        for(var i=0;i<5;i++){
            var word = M_Init._dataCache['word'][i] ? M_Init._dataCache['word'][i] : '';
            str += '<li><input class="tg-input" type="text" name="word" placeholder="热词'+(i+1)+'" maxlength="20" value="'+word+'"></li>';
        }
        str += '<li><a class="tg-main-btn">修改</a></li>';
        return str;
    }
}