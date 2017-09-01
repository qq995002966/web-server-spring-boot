function getEChart(type,dom,data){
    switch(type){
        case 'title':
        case 'emotionPos':
        case 'emotionNeg':
        case 'keywords':
        case 'line':
        case 'pie':
        case 'appBar':
        case 'map':
        case 'scatter':
        case 'activity':
        case 'radar':
            option = {
                color:!data.color ? ['#AEDD8C','#72C4FF', '#FFA6A5', '#BFA4F1', '#FFDE5D','#EE9ABC', '#4ECDC4', '#73D7F7', '#FDB96A', '#F9FF91','#FF9900'] : data.color,
                title: !data.title ? '': data.title,
                tooltip : {
                    formatter:!data.tooltip.formatter ? '': data.tooltip.formatter,
                    trigger: data.tooltip.trigger,
                    backgroundColor:"#ffffff",
                    borderColor:'#E5E5E5',
                    borderWidth:1,
                    padding:5,
                    textStyle:{
                        color:'#A9A9A9',
                        fontSize:'11px'
                    },
                    axisPointer:{
                        lineStyle:{
                            color:'#DBDBDB'
                        }
                    }
                },
                visualMap: !data.visualMap ? '': data.visualMap,
                dataZoom: !data.dataZoom ? '': data.dataZoom,
                radar: !data.radar ? '': data.radar,
                legend: data.legend,
                grid: data.grid,
                xAxis : data.xAxis,
                yAxis : data.yAxis,
                series : data.series
            };
            break;
    }
    var myChart = echarts.init(document.getElementById(dom));
    switch(type){
        case 'activity':
            var used = 29;
            setInterval(function () {
                used = (used > data.allData.length) ? 0 : used+1;
                data.xData.shift();
                data.xDate.shift();
                data.xData.push(data.allData[used]);
                data.xDate.push(data.allDate[used]);
                myChart.setOption({
                    xAxis:[{
                        data: data.xDate
                    }],
                    series: [{
                        data: data.xData
                    }]
                });
            }, 2000);
        case 'appBar':
            myChart.setOption(option);
            myChart.on('click',function (params) {
                if(params.value == 0){
                    G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                }else{
                    F_Pop._detail('channel',{zone:dom,type:params.name});
                }
            });
            break;
        default:
            myChart.setOption(option);
            break;
    }
    switch(dom){
        case 'bs_suddenly_chart':
            myChart.on('click',function (params){
                console.log(params);
                if(params.value == 0){
                    G_Pop._init('msg',{'content':'当前时间段该类问题舆情正常，无需警戒'});
                }else{
                    if(params.name){
                        F_Base._getFromChartClick(params.name,params.seriesName);
                    }
                }
            });
            break;
        case 'bs_hotwrod_tread':
            myChart.on('click',function (params){
                if(params.value == 0){
                    G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                }else{
                    if(params.name){
                        F_Info._getFromChartClick(params.name,params.seriesName);
                    }
                }
            });
            break;
        case 'bs_topic':
            myChart.on('click',function (params){
                if(params.name){
                    F_Topic._formatTopic(params.name);
                }
            });
            break;
        case 'bs_keywords':
            myChart.on('click',function (params){
                if(params.name){
                    F_Common._openDetail('detail',{word:params.name});
                }
            });
            break;
        case 'pymap':
            myChart.on('click', function (params) {
                F_Common._openDetail(params.name,'province',1);
            });
            break;
        case 'callupon':
            myChart.on('click', function (params) {
                var keyword = params.name;
                keyword = keyword.substr(0,3);
                F_Common._openDetail(keyword,'influence_level',1)
            });
            break;
        case 'dynamic':
            myChart.on('click', function (params) {
                var keyword = params.name;
                keyword = keyword.substr(0,3);
                F_Common._openDetail(keyword,'active_class',1);
            });
            break;
        case 'lt_fkqy':
            myChart.on('click',function (params){
                if(params.value == 0){
                    G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                }else{
                    F_Pop._detail('insight-back',{date:params.name,type:params.seriesName});
                }
            });
            break;
        case 'bs_app_sotre':
            myChart.on('click',function (params){
                F_AppStore._more(params.name);
            });
            break;
        case 'bs_ins_article_pie':
            myChart.on('click',function (params) {
                switch(params.seriesIndex){
                    case 0:
                        F_MediaArticle._getData(params.name);
                        break;
                    case 1:
                        var name = params.name;
                        if(name){
                            var main_class = '';
                            var sub_class = '';
                            name = name.split(')');
                            main_class = name[0].substr(1,(name[0].length-1));
                            sub_class = name[1];
                            G_Jump._go('open',G_Jump._getUrl('article')+'?t=classify&m='+encodeURIComponent(main_class)+'&s='+encodeURIComponent(sub_class));
                        }
                        break;
                }
            });
            break;
        case 'lt_wtzs0':
        case 'lt_wtzs1':
        case 'lt_wtzs2':
            myChart.on('click',function (params) {
                if(params.value == 0){
                    G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                }else{
                    F_Pop._detail('insight-line',{date:params.name});
                }
            });
            break;
        case 'lt_wtfb0':
        case 'lt_wtfb1':
        case 'lt_wtfb2':
            myChart.on('click',function (params) {
                F_Pop._detail('insight-bar',{keywords:params.name});
            });
            break;
        case 'lt_rczs':
            myChart.on('click',function (params) {
                if(params.value == 0){
                    G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                }else{
                    F_Pop._detail('hotWord',{keywords:params.seriesName,date:params.name});
                }
            });
            break;
        case 'bs_qdpl':
            var name = '';
            var seriesName = '';
            myChart.on('click',function (params) {
                if(params.name != name || params.seriesName != seriesName){
                    name = params.name;
                    seriesName = params.seriesName;
                    F_Word._getDayDate(params.seriesName,params.name);
                }
            });
            break;
        case 'bs_game_distribute':
            myChart.on('click',function (params) {
                F_Distribute._gameList(params.value[0],params.value[1]);
            });
            break;
        case 'bs_ltfx':
            switch(type){
                case 'title':
                    myChart.on('click',function (params) {
                        if(params.value == 0){
                            G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                        }else{
                            F_Pop._detail('title',{classify:params.seriesName,date:params.name});
                        }
                    });
                    break;
                case 'pie':
                    myChart.on('click',function (params) {
                        switch(params.seriesIndex){
                            case 0:
                                if(F_Forum._buffData.useless_name != params.name){
                                    var type = params.name.replace('帖子来源 - ','');
                                    type = type.split(' ');
                                    type = type[0];
                                    F_Forum._getUseless(type);
                                }
                                break;
                            case 1:
                                /*
                                var legendName = params.name.replace('内容分布 - ','');
                                var index = legendName.indexOf(')');
                                var type = legendName.substr(1,(index-1));
                                var keywords = legendName.substr(index+1,(legendName.length-1));
                                keywords = keywords.split(' ');
                                keywords = keywords[0];
                                F_Pop._detail('useless',{type:type,keywords:keywords});
                                */
                                break;
                        }
                    });
                    break;
                case 'emotionPos':
                    myChart.on('click',function (params) {
                        if(params.value == 0){
                            G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                        }else{
                            F_Pop._detail('emotion',{classify:'1,2',date:params.name});
                        }
                    });
                    break;
                case 'emotionNeg':
                    myChart.on('click',function (params) {
                        if(params.value == 0){
                            G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                        }else{
                            F_Pop._detail('emotion',{classify:'-1,-2',date:params.name});
                        }
                    });
                    break;
                case 'keywords':
                    myChart.on('click',function (params) {
                        if(params.value == 0){
                            G_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                        }else{
                            F_Pop._detail('keywords',{keywords:params.name});
                        }
                    });
                    break;
            }
            break;
    }
}