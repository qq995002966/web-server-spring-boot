require(['frontmain'], function () {
    require(['jquery','echarts','china','numbers','layer','base','front','store.min','app/outside'], function (){
        store = require('store.min');
        echarts = require('echarts');

        F_Guide_Entrance._init();
    });
});
var F_Guide_Entrance = {
    _init:function () {
        B_Login._check();
        S_HeadFoot._getHead();
        setInterval('F_Guide_Trend._getTrend("realtime")',60000);
        F_Guide_Trend._getTrend("realtime");
        F_Guide_GameMap._getMap();
        F_Guide_GameMap._getRank('手游');
        F_Guide_Complain._getComplain('手游');
        F_Guide_Type._getType();
        F_Guide_AppStore._getApp();

        S_Game._goRelation();
    }
}
var F_Guide_Common = {
    _cache:{},
    _htmlTabChoose:function (id) {
        var str = '';
        str += '<span class="tab-title">游戏类型</span>';
        str += '<ul class="tf-tab-change-btn '+id+'">';
        str += '<li class="selected">手游</li><li>页游</li><li>端游</li><li>单机</li>';
        str += '</ul>';
        return str;
    },
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
var F_Guide_AppStore = {
    _more:function(name){
        var condition = F_Guide_AppStore._getCondition('more');
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
        B_Port._ajax('industryAppStore','get',true,F_Guide_AppStore._getCondition(),function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.appstore_type_distri){
                    F_Guide_AppStore._chartApp(data.appstore_type_distri);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
        F_Guide_Common._clickChoose('bs_app_type',function (id) {
            F_Guide_AppStore._getApp();
        });
        F_Guide_Common._clickChoose('bs_app_device',function (id) {
            F_Guide_AppStore._getApp();
        });
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
var F_Guide_Type = {
    _getType:function () {
        var dom = $('#bs_type');

        B_Port._ajax('industryTypeDistri','get',true,null,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.type_num_distri){
                    var str= '';
                    str += '<div class="tf-graph-part gamestyle-distribute" id="bs_type_chart"></div>';
                    str += '<div id="bs_type_table"></div>';
                    dom.html(str);
                    F_Guide_Type._htmlTypeList(data.type_num_distri);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlTypeList:function (data) {
        var chartDataPre = {x_axis:[],y_name:[],y_axis:[{'data':[],'name':'占比(%)'}],'legendSelectMode':true,inverse:true,xSplitLine:true};
        var tableData = [];
        var bodyStr = '';
        var headStr = '';
        var dataUnion = data['手游'];
        var x_index = 0;
        var number = 0;
        var type = [['手游','#72C4FF'],['页游','#BFA4F1'],['端游','#FFA6A5'],['单机','#AEDD8C']];
        for(var t=0;t<type.length;t++){
            dataUnion = data[type[t][0]];
            if(dataUnion){
                chartDataPre.y_name.push(type[t][0]);
                tableData[t] = [];
                for(var i=0;i<dataUnion.length;i++){
                    if(t==0){
                        tableData[t][i] = '-';
                        x_index = i;
                        chartDataPre.x_axis.push(dataUnion[i].detail_type);
                    }else{
                        if(i==0){
                            for(var d=0;d<chartDataPre.x_axis.length;d++){
                                tableData[t][d] = '-';
                            }
                        }
                        x_index = $.inArray(dataUnion[i].detail_type,chartDataPre.x_axis);
                    }
                    if(x_index > -1){
                        number = parseInt(dataUnion[i].game_rate*100).toFixed(0);
                        tableData[t][x_index] = number+'%';
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
        headStr += '<thead><th></th>';
        for(var i=0;i<chartDataPre.x_axis.length;i++){
            headStr += '<th><i class="game-type-color'+(i+1)+'"></i>'+chartDataPre.x_axis[i]+'</th>';
        }
        headStr += '</thead>';
        bodyStr += '<tbody>';
        for(var i=0;i<tableData.length;i++){
            bodyStr += '<tr>';
            bodyStr += '<td>'+type[i][0]+'</td>';
            for(var d=0;d<tableData[i].length;d++) {
                bodyStr += '<td>' + tableData[i][d] + '</td>';
            }
            bodyStr += '</tr>';
        }
        bodyStr += '</tbody>';
        $('#bs_type_table').html('<table class="game-style-dis">'+headStr+bodyStr+'</table>');

        F_Guide_Common._cache['typePlat'] = chartDataPre.y_name;
        F_Guide_Common._cache['typeClassify'] = chartDataPre.x_axis;

        S_Chart._chartData('scatter','bs_type_chart',chartDataPre);
    }
}
var F_Guide_Complain = {
    _getComplain:function(type){
        if(F_Guide_Common._cache['complain']){
            F_Guide_Complain._htmlComplainList(F_Guide_Common._cache['complain'][type]);
        }else{
            var dom = $('#bs_complain');
            B_Port._ajax('industryComplain','get',true,null,function(){
                    dom.html(B_Pre._loading());
                },function(){
                    dom.html('');
                },function(data,msg){
                    if(data.negtive_distri_all){
                        F_Guide_Common._cache['complain'] = data.negtive_distri_all;
                        var str= '';
                        str += F_Guide_Common._htmlTabChoose('bs_complain_choose');
                        str += '<div id="bs_complain_choose_list">';
                        str += '<div class="tf-graph-part " id="bs_complain_chart"></div>';
                        str += '<div id="bs_complain_table"></div>';
                        str += '</div>';
                        dom.html(str);
                        F_Guide_Complain._htmlComplainList(data.negtive_distri_all[type]);
                        F_Guide_Common._clickChoose('bs_complain_choose',function (id) {
                            F_Guide_Complain._getComplain(id);
                        });
                    }
                },function(data,msg,code){
                    dom.html(B_Pre._empty(msg));
                }
            )
        }
    },
    _htmlComplainList:function (data) {
        var thead = [];
        var tComplain = [];
        var tNeg = [];
        var theadStr = '';
        var tComplainStr = '';
        var tNegStr = '';
        var complainNumber = 0;
        var negNumber = 0;
        for(var i=0;i<data.length;i++){
            complainNumber = (data[i].complain_rate*100).toFixed(1);
            negNumber = (data[i].negative_post_rate*100).toFixed(1);

            theadStr += '<th><i class="game-type-color'+(i)+'"></i>'+data[i].detail_type+'</th>';
            tComplainStr += '<td>'+complainNumber+'%</td>';
            tNegStr += '<td>'+negNumber+'%</td>';

            thead.push(data[i].detail_type);
            tComplain.push(complainNumber);
            tNeg.push(negNumber);
        }
        var chartDataPre = {
            color:['#F7D960','#F75869'],
            x_axis:thead,
            y_axis:[{'data':tComplain,'name':'抱怨用户'},{'data':tNeg,'name':'负面反馈'}],
            legendSelectMode:false,
            tooltip:{'num':2,'unit':'%'},
            yFormat:'%'
        };

        $('#bs_complain_table').html('<table class="game-style-dis"><thead><th></th>'+theadStr+'</thead><tbody><tr><td>抱怨用户</td>'+tComplainStr+'</tr><tr><td>负面反馈</td>'+tNegStr+'</tr></tbody></table>');

        S_Chart._chartData('bar','bs_complain_chart',chartDataPre);
    }
}
var F_Guide_GameMap = {
    _getMap:function(){
        var dom = $('#bs_chart_map');
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
    _getRank:function (type) {
        if(F_Guide_Common._cache['activityRank']){
            $('#bs_rank_choose_list').html(F_Guide_GameMap._htmlRankList(F_Guide_Common._cache['activityRank'][type]));
        }else{
            var dom = $('#bs_rank_chart');
            B_Port._ajax('industryGameType','get',true,null,function(){
                    dom.html(B_Pre._loading());
                },function(){
                    dom.html('');
                },function(data,msg){
                    if(data.game_type_distri){
                        F_Guide_Common._cache['activityRank'] = data.game_type_distri;
                        var str= '';
                        str += F_Guide_Common._htmlTabChoose('bs_rank_choose');
                        str += '<div id="bs_rank_choose_list">'+F_Guide_GameMap._htmlRankList(data.game_type_distri[type])+'</div>';
                        dom.html(str);
                        F_Guide_Common._clickChoose('bs_rank_choose',function (id) {
                            F_Guide_GameMap._getRank(id);
                        });
                    }
                },function(data,msg,code){
                    dom.html(B_Pre._empty(msg));
                }
            )
        }
    },
    _htmlRankList:function (data) {
        var str = '';
        str += '<table class="game-style"><thead><th>游戏类别</th><th>游戏数占比</th><th>用户占比</th><th>较昨日</th><th>活跃帖子数</th><th>较昨日</th></thead><tbody>';
        for(var i=0;i<data.length;i++){
            str += '<tr>';
            str += '<td>';
            str += '<i class="game-type-color'+(i+1)+'"></i>';
            str += data[i].detail_type+'</td>';
            str += '<td>'+(data[i].game_rate ? (data[i].game_rate*100).toFixed(1) : '0')+'%</td>';
            str += '<td>'+(data[i].user_rate ? (data[i].user_rate*100).toFixed(1) : '0')+'%</td>';
            if(data[i].user_rate_growth){
                if(data[i].user_rate_growth > 0){
                    str += '<td class="color-red">+'+(data[i].user_rate_growth*100).toFixed(1)+'%</td>';
                }else if(data[i].user_rate_growth < 0){
                    str += '<td class="color-green">-'+(Math.abs(data[i].user_rate_growth)*100).toFixed(1)+'%</td>';
                }else{
                    str += '<td>0.0%</td>';
                }
            }else{
                str += '<td>-</td>';
            }
            str += '<td>'+(data[i].post_num ? data[i].post_num : '0')+'</td>';
            if(data[i].post_num_growth){
                if(data[i].post_num_growth > 0){
                    str += '<td class="color-red">+'+(data[i].post_num_growth*100).toFixed(1)+'%</td>';
                }else if(data[i].post_num_growth < 0){
                    str += '<td class="color-green">-'+(Math.abs(data[i].post_num_growth)*100).toFixed(1)+'%</td>';
                }else{
                    str += '<td>0.0%</td>';
                }
            }else{
                str += '<td>-</td>';
            }
            str += '</tr>';
        }
        str += '</tbody></table>';
        return str;
    }
}
var F_Guide_Trend = {
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
                            F_Guide_Trend._getTrend('forum');
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
                                    F_Guide_Trend._getTrend('forum');
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
                                    F_Guide_Trend._getTrend('channel');
                                    break;
                                case '2':
                                    F_Guide_Trend._getTrend('article');
                                    break;
                            }
                            break;
                    }
                }
            });
        });
    },
    _getTrend:function (type) {
        if(type != 'realtime' && F_Guide_Common._cache['trendDay']){
            F_Guide_Trend._formatPublish(type);
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
                                F_Guide_Trend._formatActive(data);
                                break;
                            case 'forum':
                            case 'channel':
                            case 'article':
                                F_Guide_Common._cache['trendDay'] = data.industry_distri_day;
                                F_Guide_Trend._formatPublish(type);
                                break;
                        }
                    }
                    F_Guide_Trend._clickTab();
                },function () {
                    dom.html(B_Pre._empty(msg));
                }
            )
        }
    },
    _formatActive:function (data){
        F_Guide_Common._cache['rand'] = (data.title_distri_realtime && data.title_distri_realtime.length>0) ? data.title_distri_realtime[data.title_distri_realtime.length-1].title_num : 0;
        var totalDiff = parseInt(data.title_num_today_total) - parseInt(F_Guide_Common._cache['rand']);
        F_Guide_Common._cache['number'] = totalDiff < 0 ? F_Guide_Common._cache['rand'] : totalDiff;
        F_Guide_Trend._htmlNumber(data);
        F_Guide_Trend._effectNumber();

        if(data.title_distri_realtime && data.title_distri_realtime.length > 0){
            F_Guide_Common._cache['allDate'] = [];
            F_Guide_Common._cache['allData'] = [];
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
                F_Guide_Common._cache['allDate'].push(dateTime);
                F_Guide_Common._cache['allData'].push(dataUnion[i].title_num);
            }
            chartDataPre.yMax = (maxNumber*1.2).toFixed(0);
            chartDataPre.yMin = (minNumber/1.5).toFixed(0);

            S_Chart._chartData('lineActive','bs_trend_chart',chartDataPre);
        }
    },
    _formatPublish:function (type) {
        if(F_Guide_Common._cache['trendDay']){
            var data = F_Guide_Common._cache['trendDay'];
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
        $('.tf-tab-change-block li').each(function(index){
            var percent = 0;
            var today_a = 0;
            var yesterday_c = 0;
            var yesterday_a = 0;
            switch(index){
                case 0:
                    percent = F_Guide_Trend._formatPercent(data.title_num_today_total,data.title_num_yesterday_basis);
                    yesterday_c = data.title_num_yesterday_basis;
                    yesterday_a = data.title_num_yesterday_total;
                    break;
                case 1:
                    percent = F_Guide_Trend._formatPercent(data.channel_num_today_total,data.channel_num_yesterday_basis);
                    today_a = data.channel_num_today_total;
                    yesterday_c = data.channel_num_yesterday_basis;
                    yesterday_a = data.channel_num_yesterday_total;
                    break;
                case 2:
                    percent = F_Guide_Trend._formatPercent(data.article_num_today_total,data.article_num_yesterday_basis);
                    today_a = data.article_num_today_total;
                    yesterday_c = data.article_num_yesterday_basis;
                    yesterday_a = data.article_num_yesterday_total;
                    break;
            }
            index == 0 ? '' : $(this).find('h4').html(today_a);
            $(this).find('b').html(percent);
            if(parseFloat(percent) > 0){
                $(this).find('b').addClass('color-green');
            }else if(parseFloat(percent) < 0){
                $(this).find('b').addClass('color-red');
            }
            $(this).find('.post-num-compare').html('昨日同比发布数:<b>'+yesterday_c+'</b>');
            $(this).find('.post-num-all').html('昨日全天发布数:<b>'+yesterday_a+'</b>');
        });
    },
    _effectNumber:function () {
        F_Guide_Common._cache['number'] = parseInt(F_Guide_Common._cache['number']);
        F_Guide_Common._cache['rand'] = parseInt(F_Guide_Common._cache['rand']);
        var numberChange = $(".bs_change_number").numberAnimate({num:F_Guide_Common._cache['number'], speed:2000});
        if(F_Guide_Common._cache['rand'] > 0){
            var randNumber = Math.ceil(F_Guide_Common._cache['rand']/2);
            var perRand = Math.floor(randNumber/60);
            var randTotal = F_Guide_Common._cache['rand'] - randNumber;
            var randLast = randTotal;
            setInterval(function(){
                var rand = Math.ceil(Math.random()*randLast);
                randLast -= rand;
                F_Guide_Common._cache['number'] += (perRand + rand);
                numberChange.resetData(F_Guide_Common._cache['number']);
            },5000);
        }
    }
}

