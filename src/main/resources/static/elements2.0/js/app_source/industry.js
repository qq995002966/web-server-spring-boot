require(['frontmain'], function () {
    require(['jquery','echarts','china','numbers','layer','base','front','store.min','app/outside'], function (){
        store = require('store.min');
        echarts = require('echarts');

        F_Industry_Entrance._init();
    });
});
var F_Industry_Entrance = {
    _init:function () {
        B_Login._check();
        S_HeadFoot._getHead();
        S_HeadFoot._htmlPaper();
        setInterval('F_Industry_Trend._getTrend("realtime")',60000);
        F_Industry_Trend._getTrend("realtime");

        setTimeout(function () {
            F_Industry_GameMap._getMap();
        },200);
        setTimeout(function () {
            F_Industry_GameMap._getContent();
        },400);
        setTimeout(function () {
            F_Industry_Type._getType();
        },600);
        setTimeout(function () {
            F_Industry_Complain._getComplain('手游');
        },800);
        setTimeout(function () {
            F_Industry_AppStore._getApp();
        },1000);

        F_Industry_Common._clickChoose('bs_app_type',function (id) {
            F_Industry_AppStore._getApp();
        });
        F_Industry_Common._clickChoose('bs_app_device',function (id) {
            F_Industry_AppStore._getApp();
        });
    }
}
var F_Industry_Common = {
    _cache:{},
    _clickChoose:function (id,callBack) {
        $('.'+id+' li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    callBack && callBack($(this).html());
                }
            });
        });
    }
}
var F_Industry_AppStore = {
    _more:function(name){
        var condition = F_Industry_AppStore._getCondition('more');
        window.open('rank.html?'+condition+'&c='+B_Common._encodeUrl(name));
    },
    _getCondition:function (from) {
        var device = '';
        var type = '';
        $('.bs_app_type li').each(function () {
            if($(this).hasClass('selected')){
                type = $(this).attr('data-i');
            }
        });
        $('.bs_app_device li').each(function () {
            if($(this).hasClass('selected')){
                device = $(this).attr('data-i');
            }
        });
        var postData = {};
        switch (from){
            case 'more':
                postData['p'] = device;
                postData['t'] = type;
                postData['d'] = B_Date._getDiffDate(null,-1);
                break;
            default:
                postData['device_type'] = device;
                postData['list_type'] = type;
                postData['data_date'] = B_Date._getDiffDate(null,-1);
                break;
        }
        return B_Common._postData(postData);
    },
    _getApp:function () {
        var dom = $('#bs_appStore');
        B_Port._ajax('industryAppStore','get',true,F_Industry_AppStore._getCondition(),function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.appstore_type_distri){
                    F_Industry_AppStore._chartApp(data.appstore_type_distri);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )

    },
    _chartApp:function (data) {
        var chartDataPre = {x_axis:[],y_axis:[{'data':[],'name':'数量'}]};
        var classifyName = '';
        for(var i=0;i<data.length;i++){
            if(M_Game._appGameType[data[i].app_type]){
                classifyName = M_Game._appGameType[data[i].app_type];
                if(classifyName != '小游戏'){
                    classifyName = classifyName.replace('游戏','')
                }
                chartDataPre.x_axis.push(classifyName);
                chartDataPre.y_axis[0].data.push(data[i].app_num);
            }
        }
        S_Chart._chartData('bar','bs_appStore',chartDataPre,'appStoreRank');
    }
}
var F_Industry_Type = {
    _getType:function () {
        var dom = $('#bs_type_chart');
        B_Port._ajax('industryTypeDistri','get',true,null,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.type_num_distri){
                    F_Industry_Type._htmlTypeList(data.type_num_distri);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlTypeList:function (data) {
        var chartDataPre = {x_axis:[],y_name:[],y_axis:[{'data':[],'name':'占比(%)'}],'legendSelectMode':true,inverse:true,xSplitLine:true};
        var dataUnion = '';
        var x_index = 0;
        var number = 0;
        var type = [['手游','#72C4FF'],['页游','#BFA4F1'],['端游','#FFA6A5'],['单机','#AEDD8C']];
        for(var t=0;t<type.length;t++){
            dataUnion = data[type[t][0]];
            if(dataUnion){
                chartDataPre.y_name.push(type[t][0]);
                for(var i=0;i<dataUnion.length;i++){
                    if(t==0){
                        x_index = i;
                        chartDataPre.x_axis.push(dataUnion[i].detail_type);
                    }else{
                        x_index = $.inArray(dataUnion[i].detail_type,chartDataPre.x_axis);
                    }
                    if(x_index > -1){
                        number = parseInt(dataUnion[i].game_rate*100).toFixed(0);
                        chartDataPre.y_axis[0].data.push({
                            value:[x_index,t,number],
                            itemStyle:{
                                normal:{
                                    color:type[t][1]
                                }
                            }
                        });
                    }
                }
            }
        }
        F_Industry_Common._cache['typePlat'] = chartDataPre.y_name;
        F_Industry_Common._cache['typeClassify'] = chartDataPre.x_axis;
        S_Chart._chartData('scatter','bs_type_chart',chartDataPre);
    }
}
var F_Industry_Complain = {
    _htmlComplain:function () {
        var str = '';
        str += '\
            <div class="left">\
                <ul class="tab-change bs_complain_choose">\
                    <li class="selected">手游</li>\
                    <li>页游</li>\
                    <li>端游</li>\
                    <li>单机</li>\
                </ul>\
                <ul class="list bs_complain_list"></ul>\
            </div>\
            <img src="elements2.0/img/y.png" class="y-img">\
            <div class="graph-part cursor-default">\
                <div id="bs_complain_chart" style="width: 100%; height: 100%"></div>\
            </div>\
            <img src="elements2.0/img/x.png" class="x-img">';
        return str;
    },
    _getComplain:function(type){
        if(F_Industry_Common._cache['complain']){
            F_Industry_Complain._htmlComplainList(type,F_Industry_Common._cache['complain'][type]);
        }else{
            var dom = $('#bs_complain');
            B_Port._ajax('industryComplain','get',true,null,function(){
                    dom.html(B_Pre._loading());
                },function(){
                    dom.html('');
                },function(data,msg){
                    if(data.negtive_distri_all){
                        F_Industry_Common._cache['complain'] = data.negtive_distri_all;
                        dom.html(F_Industry_Complain._htmlComplain());
                        F_Industry_Complain._htmlComplainList(type,data.negtive_distri_all[type]);
                        F_Industry_Common._clickChoose('bs_complain_choose',function (id) {
                            F_Industry_Complain._getComplain(id);
                        });
                    }
                },function(data,msg,code){
                    dom.html(B_Pre._empty(msg));
                }
            )
        }
    },
    _htmlComplainList:function (type,data) {
        var complainNumber = 0;
        var complainPercent = 0;
        var str = '';
        var selected = '';
        var selectedData = '';
        for(var i=0;i<data.length;i++){
            complainNumber = (data[i].complain_rate*100).toFixed(1);
            complainPercent = 100-complainNumber;
            selected = i==0 ? ' class="selected"' : '';
            if(i==0){
                selectedData = data[i].detail_type;
            }
            str += '\
            <li data-i="'+data[i].detail_type+'"'+selected+'>\
                <div class="left-part">\
                    <span>'+data[i].detail_type+'</span>\
                    <i>'+complainNumber+'%</i>\
                </div>\
                <div class="rate-wrap">\
                    <div class="rate" style="width: '+complainPercent+'%"></div>\
                </div>\
            </li>';
        }
        $('.bs_complain_list').html(str);

        F_Industry_Complain._chartComplain(type,selectedData);

        $('.bs_complain_list li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    F_Industry_Complain._chartComplain(type,$(this).attr('data-i'));
                }
            });
        });
    },
    _chartComplain:function (type,data) {
        var dom = $('#bs_complain_chart');
        var postData = {};
        postData['platform'] = type;
        postData['detail_type'] = data;
        postData = B_Common._postData(postData);
        B_Port._ajax('industryComplainDetail','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.data && data.data.length > 0){
                    var dataUnion = data.data;
                    var chartDataPre = {data:{'data':[],'name':'抱怨度(%)'},xMax:data.max_index,color:['#ec644c'],xSplitLine:true};
                    for(var i=0;i<dataUnion.length;i++){
                        chartDataPre.data.data.push([dataUnion[i].hot_index,dataUnion[i].complain_rate]);
                    }
                    S_Chart._chartData('scatterType','bs_complain_chart',chartDataPre);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    }
}
var F_Industry_GameMap = {
    _getMap:function(){
        var dom = $('#bs_map_chart');
        B_Port._ajax('industryUserProvince','get',true,null,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.province_distri && data.province_distri.length > 0){
                    var chartDataPre = {x_axis:[],y_axis:[{'data':[],'name':'活跃玩家占比(%)'}],visualMax:0};
                    for(var i=0;i<data.province_distri.length;i++){
                        var number = ((data.province_distri[i].active_rate)*100).toFixed(1);
                        chartDataPre.y_axis[0].data.push({name:data.province_distri[i].province,value:number});
                        if(parseFloat(number) > parseFloat(chartDataPre.visualMax))chartDataPre.visualMax = number;
                    }
                    chartDataPre.visualMax = Math.ceil(chartDataPre.visualMax);
                    S_Chart._chartData('map','bs_map_chart',chartDataPre);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getContent:function () {
        var dom = $('#bs_content_list');
        if(dom.html() == ''){
            F_Industry_GameMap._contentPort(1);
        }else{
            if(F_Industry_Common._cache['contentData'] && F_Industry_Common._cache['contentData'].length > 0){
                dom.find('li').eq(8).remove();
                dom.prepend(F_Industry_GameMap._htmlContent(F_Industry_Common._cache['contentData'][0]));
                F_Industry_Common._cache['contentData'] = (F_Industry_Common._cache['contentData']).slice(1);
                if(F_Industry_Common._cache['contentData'].length < 10){
                    F_Industry_GameMap._contentPort(2);
                }
            }
        }
    },
    _contentPort:function (times) {
        var dom = $('#bs_content_list');
        B_Port._ajax('countryDetail','get',true,null,function(){
                if(times == 1){
                    dom.html(B_Pre._loading());
                }
            },function(){
                if(times == 1){
                    dom.html('');
                }
            },function(data,msg){
                if(data && data.content_list && data.content_list.length > 0){
                    if(times == 1){
                        var length = data.content_list.length;
                        var str= '';
                        for(var i=0;i<length;i++){
                            if(i==9)break;
                            str += F_Industry_GameMap._htmlContent(data.content_list[i]);
                        }
                        dom.html(str);
                        if(length > 9){
                            F_Industry_Common._cache['contentData'] = (data.content_list).slice(9);
                            listInterval = setInterval('F_Industry_GameMap._getContent()',1000);
                        }
                    }else{
                        if(!(data.content_list && data.content_list.length > 15)){
                            clearInterval(listInterval);
                        }else{
                            F_Industry_Common._cache['contentData'] = data.content_list;
                        }
                    }
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlContent:function (data) {
        var str = '';
        str += '\
            <li>\
                <div class="title">\
                <img src="'+B_Common._cdnImgUrl()+(data.image)+'">\
                <div class="des">\
                <span>'+data.source+'</span>\
                <b>'+data.author+'</b>\
                </div>\
                </div>\
                <div class="content">\
                <span>'+data.post_datetime+'</span>\
                <p>'+data.content+'</p>\
                </div>\
            </li>';

        return str;
    }
}
var F_Industry_Trend = {
    _clickTab:function () {
        $('.bs_trend_type li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    switch(index+''){
                        case '0':
                            $('#bs_trend_chart').show();
                            $('#bs_trendDay_chart').hide();
                            break;
                        case '1':
                            $('#bs_trend_chart').hide();
                            $('#bs_trendDay_chart').show();
                            F_Industry_Trend._getTrend('forum');
                            break;
                    }
                }
            })
        });
        $('.bs_trend_tab li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    switch(index+''){
                        case '0':
                            $('.bs_trend_type').show();
                            var type = '';
                            $('.bs_trend_type li').each(function (number) {
                                if($(this).hasClass('selected')){
                                    type = number;
                                }
                            });
                            switch (type+''){
                                case '0':
                                    $('#bs_trend_chart').show();
                                    $('#bs_trendDay_chart').hide();
                                    break;
                                case '1':
                                    $('#bs_trendDay_chart').show();
                                    $('#bs_trend_chart').hide();
                                    F_Industry_Trend._getTrend('forum');
                                    break;
                            }
                            break;
                        case '1':
                        case '2':
                            $('#bs_trendDay_chart').show();
                            $('.bs_trend_type').hide();
                            $('#bs_trend_chart').hide();
                            switch(index+''){
                                case '1':
                                    F_Industry_Trend._getTrend('channel');
                                    break;
                                case '2':
                                    F_Industry_Trend._getTrend('article');
                                    break;
                            }
                            break;
                    }
                }
            });
        });
    },
    _getTrend:function (type) {
        if(type != 'realtime' && F_Industry_Common._cache['trendDay']){
            F_Industry_Trend._formatPublish(type);
        }else{
            var dom = '';
            var condition = '';
            switch(type){
                case 'realtime':
                    dom = $('#bs_trend_chart');
                    condition = 'realtime';
                    break;
                case 'forum':
                case 'channel':
                case 'article':
                    dom = $('#bs_trendDay_chart');
                    condition = 'day';
                    break;
            }
            var postData = {};
            postData['scope'] = condition;
            postData = B_Common._postData(postData);
            B_Port._ajax('industryGeneral','get',true,postData,function () {
                    switch(type) {
                        case 'realtime':
                            break;
                        default:
                            dom.html(B_Pre._loading());
                            break;
                    }
                },function () {
                    dom.html('');
                },function(data,msg){
                    if(data){
                        switch(type){
                            case 'realtime':
                                F_Industry_Trend._formatActive(data);
                                break;
                            case 'forum':
                            case 'channel':
                            case 'article':
                                F_Industry_Common._cache['trendDay'] = data.industry_distri_day;
                                F_Industry_Trend._formatPublish(type);
                                break;
                        }
                    }
                    F_Industry_Trend._clickTab();
                },function () {
                    dom.html(B_Pre._empty(msg));
                }
            )
        }
    },
    _formatActive:function (data){
        F_Industry_Common._cache['rand'] = (data.title_distri_realtime && data.title_distri_realtime.length>0) ? data.title_distri_realtime[data.title_distri_realtime.length-1].title_num : 0;
        var totalDiff = parseInt(data.title_num_today_total) - parseInt(F_Industry_Common._cache['rand']);
        F_Industry_Common._cache['number'] = totalDiff < 0 ? F_Industry_Common._cache['rand'] : totalDiff;
        F_Industry_Trend._htmlNumber(data);
        F_Industry_Trend._effectNumber();

        if(data.title_distri_realtime && data.title_distri_realtime.length > 0){
            F_Industry_Common._cache['allDate'] = [];
            F_Industry_Common._cache['allData'] = [];
            var chartDataPre = {x_axis:[],y_axis:[{'data':[],'name':'发帖数'}],yMax:0,yMin:1000000000};
            var dataUnion = data.title_distri_realtime;
            var maxNumber = 0;
            var minNumber = 1000000000;
            for(var i=0;i<dataUnion.length;i++){
                var dateTime = dataUnion[i].data_time.toString().replace(':00','');
                if(i<30){
                    chartDataPre.x_axis.push(dateTime);
                    chartDataPre.y_axis[0].data.push(dataUnion[i].title_num);
                }
                maxNumber = maxNumber>parseInt(dataUnion[i].title_num) ? maxNumber : dataUnion[i].title_num;
                minNumber = minNumber<parseInt(dataUnion[i].title_num) ? minNumber : dataUnion[i].title_num;
                F_Industry_Common._cache['allDate'].push(dateTime);
                F_Industry_Common._cache['allData'].push(dataUnion[i].title_num);
            }
            chartDataPre.yMax = (maxNumber*1.2).toFixed(0);
            chartDataPre.yMin = (minNumber/1.5).toFixed(0);

            S_Chart._chartData('lineActive','bs_trend_chart',chartDataPre);
        }
    },
    _formatPublish:function (type) {
        if(F_Industry_Common._cache['trendDay']){
            var data = F_Industry_Common._cache['trendDay'];
            var chartDataPre = {x_axis:[],y_axis:[{'data':[],'name':'发布数'}],xFormatDate:true};
            var keyword = '';
            switch(type){
                case 'forum':
                    keyword = 'forum_post_num';
                    break;
                case 'channel':
                    keyword = 'chan_post_num';
                    break;
                case 'article':
                    keyword = 'article_post_num';
                    break;
            }
            var max = 0;
            var number = 0;
            for(var i=0;i<data.length;i++){
                number = parseInt(data[i][keyword])
                if(max < number)max = number;
                chartDataPre.x_axis.push(data[i].data_date);
                chartDataPre.y_axis[0].data.push(number);
            }
            if(type == 'forum')chartDataPre.yMax = max*2;
            S_Chart._chartData('line','bs_trendDay_chart',chartDataPre);
        }
    },
    _formatPercent:function(today,yesterday){
        today = parseInt(today);
        yesterday = parseInt(yesterday);
        var percent = (((today/yesterday)-1)*100).toFixed(2);
        return today>=yesterday ? '+'+percent+'%' : percent+'%';
    },
    _htmlNumber:function(data){
        $('.bs_trend_tab li').each(function(index){
            var percent = 0;
            var today_a = 0;
            var yesterday_c = 0;
            var yesterday_a = 0;
            switch(index){
                case 0:
                    percent = F_Industry_Trend._formatPercent(data.title_num_today_total,data.title_num_yesterday_basis);
                    yesterday_c = data.title_num_yesterday_basis;
                    yesterday_a = data.title_num_yesterday_total;
                    break;
                case 1:
                    percent = F_Industry_Trend._formatPercent(data.channel_num_today_total,data.channel_num_yesterday_basis);
                    today_a = data.channel_num_today_total;
                    yesterday_c = data.channel_num_yesterday_basis;
                    yesterday_a = data.channel_num_yesterday_total;
                    break;
                case 2:
                    percent = F_Industry_Trend._formatPercent(data.article_num_today_total,data.article_num_yesterday_basis);
                    today_a = data.article_num_today_total;
                    yesterday_c = data.article_num_yesterday_basis;
                    yesterday_a = data.article_num_yesterday_total;
                    break;
            }
            index == 0 ? '' : $(this).find('b').html(today_a);
            $(this).find('i').html(percent);
            if(parseFloat(percent) > 0){
                $(this).find('i').addClass('positive');
            }else if(parseFloat(percent) < 0){
                $(this).find('i').addClass('negative');
            }
            $(this).find('.post-num-compare').html('昨日同比发布数:<b>'+yesterday_c+'</b>');
            $(this).find('.post-num-all').html('昨日全天发布数:<b>'+yesterday_a+'</b>');
        });
    },
    _effectNumber:function () {
        F_Industry_Common._cache['number'] = parseInt(F_Industry_Common._cache['number']);
        F_Industry_Common._cache['rand'] = parseInt(F_Industry_Common._cache['rand']);
        var numberChange = $(".bs_change_number").numberAnimate({num:F_Industry_Common._cache['number'], speed:2000});
        $('.mt-number-animate').css('margin-top','0px');
        if(F_Industry_Common._cache['rand'] > 0){
            var randNumber = Math.ceil(F_Industry_Common._cache['rand']/2);
            var perRand = Math.floor(randNumber/60);
            var randTotal = F_Industry_Common._cache['rand'] - randNumber;
            var randLast = randTotal;
            setInterval(function(){
                var rand = Math.ceil(Math.random()*randLast);
                randLast -= rand;
                F_Industry_Common._cache['number'] += (perRand + rand);
                numberChange.resetData(F_Industry_Common._cache['number']);
            },5000);
        }
    }
}

