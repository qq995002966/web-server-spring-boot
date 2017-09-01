var dateBegin = G_Date._get(-30);
var dateEnd = G_Date._get(-1);
var dateChooseBeginConfine = G_Date._getUinxTime(-90);
var changeWord = [];
$(function () {
    G_Login._check();
    var $_GET = getUrl('query');
    G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('hotword');
    G_Game._setLast(G_GameId,'hotword');
    U_Dom._menu('1-2-2');
    U_Service._checkStatus('hotword');
    G_Game._dropChoose(G_GameId,$('#bs_game_choose'),'reload');

    dataChoose._section({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},1,dateBegin,dateEnd,function(begin,end){
        if(begin !=dateBegin || dateEnd != end){
            dateBegin = begin;
            dateEnd = end;
            F_Info._getChartInfo();
        }
    });

    G_Login._status('user');
});
var F_Info = {
    _getFromChartClick:function(date,word){
        if(!(date == U_List._postData.data.begin && word == U_List._postData.data.word)){
            U_List._postData.data = {begin:date,end:date,word:word};
            U_List._getList(1);
        }
    },
    _getBeginDate:function(){
        return $.trim($('#db1').val());
    },
    _getEndDate:function(){
        return $.trim($('#de1').val());
    },
    _getChartInfo:function(type){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        var begin = F_Info._getBeginDate();
        var end = F_Info._getEndDate();
        G_Port._ajax('hotWordTrend','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
            $('#bs_hotwrod_tread').html(G_Pre._loading());
        },function(){
            G_Pop._init('close');
            $('#bs_hotwrod_tread').html('');
        },function(data,msg){
            if(data){
                var dateArr = G_Date._dateArr(begin,end);
                var chartData = {};
                var chartDataPre = {xAxis:[],word:{},series:[],legend:[]};
                var firstWord = {begin:'',end:'',word:''};
                $.each(data,function(key,dataArr){
                    chartDataPre.word[key] = {date:[],number:[]};
                    if(dataArr){
                        for(var i=0;i<dataArr.length;i++){
                            var date = G_Date._dateFormat('base',dataArr[i][0]);
                            chartDataPre.word[key].date.push(date);
                            chartDataPre.word[key].number.push(dataArr[i][1]);
                        }
                    }
                });
                var i = 1;
                changeWord = [];
                $.each(chartDataPre.word,function(key,dataObj){
                    changeWord.push(key);
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
                        if(i == 1)chartDataPre.xAxis.push(value);
                        var index = $.inArray(value,dataObj.date);
                        if(index > -1){
                            if(firstWord.word == '' && dataObj.number[index] > 0){
                                firstWord.word = key;
                                firstWord.begin = value;
                                firstWord.end = value;
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
                    left: '5%',
                    right: '2%',
                    bottom: '10%',
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
                                color:'#C2C2C2',
                                fontSize : '11px'
                            },
                            formatter: function (value, index) {
                                return G_Date._dateChart(value);
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
                                color:'#C2C2C2',
                                fontSize : '11px'
                            }
                        }
                    }
                ];
                chartData.series = chartDataPre.series;
                getEChart('line','bs_hotwrod_tread',chartData);
                switch(type){
                    case 'alter':
                        break;
                    default:
                        $('.hw_choose_word').html(F_Info._htmlWords(changeWord));
                        break;
                }
                F_Work._workBtn();

                if(firstWord.word == ''){
                    $('.data-content-left').html(G_Pre._empty('当前日期暂无数据'));
                }else{
                    U_List._postData.type = 'keyword';
                    U_List._postData.data = firstWord
                    U_List._getList(1);
                }
            }
        },function(data,msg,code){
            $('#bs_hotwrod_tread').html(G_Pre._empty(msg));
        })
    },
    _htmlWords:function(data){
        var str = '<ul>';
        for(var i=0;i<5;i++){
            var word = data[i] ? data[i] : '';
            str += '<li><input type="text" name="word" placeholder="热词'+(i+1)+'" maxlength="20" value="'+word+'"></li>';
        }
        str += '<li><button type="button" class="btn btn-info tg-main-btn">修改</button></li></ul>';
        return str;
    }
}
var F_Work = {
    _workBtn:function(){
        $('.btn-info').click(function(){
            var projectId = $('#bs_choose_game p').attr('data-i');
            var word = [];
            var lengthCheck = false;
            $('input[name="word"]').each(function(){
                var val = $.trim($(this).val());
                if(val != ''){
                    if(val.length > 6)lengthCheck = true;
                    val = blankRemove(val);
                    word.push(val);
                }
            });
            if(lengthCheck){
                G_Pop._init('msg',{'content':'请输入不多于6个字的热词'});
                return false;
            }
            if(word.length == 0){
                G_Pop._init('msg',{'content':'监控热词不能为空'});
                return false;
            }else{
                var isUpdate = false;
                if(changeWord.length == word.length){
                    for(var i=0;i<word.length;i++){
                        if(!($.inArray(word[i],changeWord) > -1)){
                            isUpdate = true;
                        }
                    }
                }else{
                    isUpdate = true;
                }
                if(isUpdate){
                    var postData = 'custom_keywords='+word.join(' ')+'&';
                    postData += 'project_id='+G_GameId;
                    F_Work._workUpdate(postData);
                }else{
                    G_Pop._init('msg',{'content':'请修改监控热词'});
                    return false;
                }
            }
        });
    },
    _workUpdate:function(postData){
        G_Port._ajax('insertCustomKeywords','post',true,postData,function(){
            btnStatus('alter','disable',$('.btn-info'));
        },function(){
            btnStatus('alter','normal',$('.btn-info'));
        },function(data,msg){
            G_Pop._init('msg',{content:'修改成功'});
            setTimeout(function(){
                F_Info._getChartInfo('alter');
            },1000)
        },function(data,msg,code){
            G_Pop._init('msg',{content:G_Pre._empty(msg)});
        })
    }
}