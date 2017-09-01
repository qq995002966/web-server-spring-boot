var dateChooseBeginConfine = G_Date._getUinxTime(-90);
var dateBegin = G_Date._get(-30);
var dateEnd = G_Date._get(-1);
var date1Begin = '';
var date1End = '';
var date2Begin = '';
var date2End = '';
var date3Begin = '';
var date3End = '';
var date4Begin = '';
var date4End = '';
var date5Begin = '';
var date5End = ''
var date6Begin = '';
var date6End = '';
var wordCloudObj = '';
$(function(){
    G_Login._check();

    C_Dom._header(1);
    C_Dom._quicker();
    C_Dom._footer();

    G_Login._status('light');
    G_Game._getCollect();

    var $_GET = getUrl('query');
    if($_GET.g)G_GameId = $_GET.g.split('#')[0];
    //if(isDemoUser())G_GameId = demoProjectId();

    $('.lt_fmNotice i').click(function(){
        $('.title-tip').removeClass('change-class');
        $('.lt_fmNotice').fadeOut("slow");
    });
    F_Info._getGame();
    F_Info._getRadar();
    F_Info._getArticle();
    dataChoose._section({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},1,dateBegin,dateEnd,function(begin,end){
        if(begin !=date1Begin || date1End != end){
            date1Begin = begin;
            date1End = end;
            F_Insight._getInfo();
        }
    });
    dataChoose._section({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},2,dateBegin,dateEnd,function(begin,end){
        if(begin !=date2Begin || date2End != end){
            date2Begin = begin;
            date2End = end;
            F_HotWordTrend._getTrend();
        }
    });
    dataChoose._section({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},3,dateBegin,dateEnd,function(begin,end){
        if(begin !=date3Begin || date3End != end){
            date3Begin = begin;
            date3End = end;
            F_Forum._getBase();
        }
    });

    F_Pop._dataCenter();

    $('.title-tip').on('click',function(){
        $(this).toggleClass('change-class');
        if($(this).hasClass('change-class')){
            $(this).parents('.lt_fmTitle').next('.lt_fmArea').children('.lt_fmNotice').fadeIn();
        }else {
            $(this).parents('.lt_fmTitle').next('.lt_fmArea').children('.lt_fmNotice').fadeOut();
        }
    });
});
function tips(dom){
    $('#Position'+dom).is(':visible') ?  $('#Position'+dom).fadeOut() :  $('#Position'+dom).fadeIn();
}
var F_Word ={
    _buff:{},
    _getDateBegin:function(){
        return $('#db5').val();
    },
    _getDateEnd:function(){
        return $('#de5').val();
    },
    _getData:function(){
        var begin = F_Word._getDateBegin();
        var end = F_Word._getDateEnd();

        G_Port._ajax('appWord','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
            $('.lt_qdpl').html(G_Pre._loading());
            $('.lt_fmPlWord').html(G_Pre._loading());
        },function(){
            $('.lt_qdpl').html('');
            $('.lt_fmPlWord').html('');
        },function(data,msg){
            var dateArr = G_Date._dateArr(begin,end);
            var chartData = {};
            var chartDataPre = {'xAxis':[],'date':[],'pos':[],'neg':[]};
            $.each(dateArr,function(key,value){
                chartDataPre.xAxis.push(value);
                chartDataPre.date.push(value);
                chartDataPre.pos.push(0);
                chartDataPre.neg.push(0);
            });
            if(data.senti_date_distri && data.senti_date_distri.length > 0){
                for(var i=0;i<data.senti_date_distri.length;i++){
                    var index = $.inArray(data.senti_date_distri[i].data_date,chartDataPre.date);
                    if(index > -1){
                        chartDataPre.pos[index] = data.senti_date_distri[i].pos_num;
                        chartDataPre.neg[index] = -(data.senti_date_distri[i].neg_num);
                    }
                }
            }
            chartData.tooltip = {trigger:'item'};
            chartData.legend = {
                top:'bottom',
                itemGap:12,
                itemWidth:12,
                itemHeight:12,
                left :'center',
                align:'left',
                data:[ '正面','负面'],
                textStyle:{
                    fontSize:12
                }
            };
            chartData.grid = {
                left: '5%',
                right: '5%',
                bottom: '8%',
                top: '3%',
                containLabel: true
            }
            chartData.xAxis = [
                {
                    splitLine : {
                        show:false
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
                    name : '热词数',
                    type : 'value',
                    nameLocation : 'middle',
                    nameTextStyle : {
                        color:'#C2C2C2',
                        fontSize : '11px'
                    },
                    nameGap:25,
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
            chartData.series = [
                {
                    barMaxWidth:30,
                    name: '正面',
                    type: 'bar',
                    stack: '总量',
                    data:chartDataPre.pos,
                    itemStyle:{
                        normal:{
                            color:'#85B161'
                        }
                    }
                },
                {
                    barMaxWidth:30,
                    name: '负面',
                    type: 'bar',
                    stack: '总量',
                    data:chartDataPre.neg,
                    itemStyle:{
                        normal:{
                            color:'#E88B80'
                        }
                    }
                }
            ];
            getEChart('line','bs_qdpl',chartData);
            if(data.senti_word_distri && data.senti_word_distri.length > 0){
                var wordObj = F_Word._formatWord((data.senti_word_distri));
                wordCloudShow($('.lt_fmPl .lt_fmPlWord'),wordObj.word,null,wordObj.color);
                F_Pop._detail('appWord');
            }
        },function(data,msg,code){
            $('.lt_qdpl').html(G_Pre._empty(msg));
            $('.lt_fmPlWord').html(G_Pre._empty(msg));
        })
    },
    _getDayDate:function(type,date){
        var senti_type = '';
        switch(type){
            case '正面':
                senti_type = 'pos';
                break;
            case '负面':
                senti_type = 'neg';
                break;
        }
        G_Port._ajax('appWordDay','get',true,'data_date='+date+'&senti_type='+senti_type+'&project_id='+G_GameId,function(){
            $('.lt_fmPlWord').html(G_Pre._loading());
        },function(){
            $('.lt_fmPlWord').html('');
        },function(data,msg){
            if(data.day_word_distri && data.day_word_distri.length > 0){
                F_Word._buff.currentDay = date;
                wordCloudShow($('.lt_fmPl .lt_fmPlWord'),F_Word._formatWordDay((data.day_word_distri)),null,null);
                switch(type){
                    case '正面':
                        $('.lt_fmPl .lt_fmPlWord a').each(function(){
                            $(this).addClass('lt_fmPlWPos').attr('data-t',1);
                        });
                        break;
                    case '负面':
                        $('.lt_fmPl .lt_fmPlWord a').each(function(){
                            $(this).addClass('lt_fmPlWNeg').attr('data-t',-1);
                        });
                        break;
                }
                F_Pop._detail('appWord');
            }
        },function(data,msg,code){
            $('.lt_fmPlWord').html(G_Pre._empty(msg));
        })
    },
    _formatWord:function(data){
        var wordObj = {word:[],color:[]};
        for(var i=0;i<data.length;i++){
            wordObj.word.push(data[i]['keyword']);
            switch(data[i]['senti_type']){
                case 'pos':
                    wordObj.color.push('lt_fmPlWPos');
                    break;
                case 'neg':
                    wordObj.color.push('lt_fmPlWNeg');
                    break;
            }
        }
        return wordObj;
    },
    _formatWordDay:function(data){
        var word = [];
        for(var i=0;i<data.length;i++){
            word.push(data[i]['keyword']);
        }
        return word;
    }
};
var F_Rank ={
    _gameType:['','游戏','体育','动作游戏','娱乐场游戏','家庭游戏','小游戏','扑克牌游戏','探险游戏','教育游戏','文字游戏','智力游戏','桌面游戏','模拟游戏','策略游戏','街机游戏','角色扮演游戏','赛车游戏','音乐','骰子游戏'],
    _listType:['','免费','付费','畅销'],
    _platType:['','iPhone','iPad'],
    _init:function(){
        G_Port._ajax('appStoreClassify','get',true,'project_id='+G_GameId,function(){
                $('.bs_fmCx').html(G_Pre._loading());
            },function(){
                $('.bs_fmCx').html('');
            },function(data,msg){
                if(data.game_type_dim && data.game_type_dim.length>0){
                    $('.bs_apps_rank').show();
                    var typeHtml = F_Rank._htmlGameType(data.game_type_dim);
                    var listHtml = F_Rank._htmlListType(data.list_type_dim);
                    var platHtml = F_Rank._htmlPlatType(data.device_type_dim);
                    $('.bs_fmCx').html(F_Rank._htmlShow(typeHtml,listHtml,platHtml));

                    dataChoose._section({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},6,dateBegin,dateEnd,function(begin,end){
                        if(begin !=date6Begin || date6End != end){
                            date6Begin = begin;
                            date6End = end;
                            F_Rank._getInfo();
                        }
                    });

                    F_Rank._chooseType();
                    F_Rank._chooseClassify();
                    F_Rank._choosePlat();
                }
            },function(data,msg,code){
                $('.bs_fmCx').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlShow:function(typeHtml,listHtml,platHtml){
        var str = '';
        str += '\
            <div class="lt_fmCxLeft c_floatLeft">\
                <div class="lt_fmCxChoose c_marginB10 c_borderB">\
                <div class="lt_fmCxChName">类型</div>'+typeHtml+'\
                <div class="lt_fmCxChName">榜单类型</div>\
                <div class="btn-group bs_app_classify" data-toggle="buttons">'+listHtml+'</div>\
                <div class="lt_fmCxChName">平台</div>\
                <div class="btn-group bs_app_plat" data-toggle="buttons">'+platHtml+'</div>\
                </div>\
                <div class="lt_cxph" id="bs_cxph"></div>\
            </div>\
            <div class="lt_fmCxRight c_floatRight c_border">\
                <div class="c_padding20" style="padding-bottom: 0">\
                    <div class="lt_title">\
                        <h2>同类游戏排行榜</h2>\
                    </div>\
                </div>\
                <div class="lt_fmCxList" style="height: 340px"></div>\
            </div>\
           <div class="clearfix"></div>';
        return str;
    },
    _htmlGameType:function(data){
        var str = '';
        str += '<div class="dropdown">';
        for(var i=0;i<data.length;i++){
            if(i==0){
                str += '<button class="btn btn-default dropdown-toggle bs_app_type c_relative" type="button" id="typeChoose" data-toggle="dropdown"><span data-t="'+data[i]+'">'+F_Rank._gameType[data[i]]+'</span>　<i class="caret"></i></button>';
                str += '<ul class="dropdown-menu bs_app_type_choose" aria-labelledby="typeChoose">';
            }
            str += '<li><a data-t="'+data[i]+'">'+F_Rank._gameType[data[i]]+'</a></li>';
        }
        str += '</ul></div>';
        return str;
    },
    _htmlListType:function(data){
        var str = '';
        for(var i=(data.length-1);i>=0;i--){
            if(i==(data.length-1)){
                str += '<label class="btn btn-default active" data-t="'+data[i]+'">';
                str += '<input type="radio" name="bs_list" value="'+data[i]+'" checked>'+F_Rank._listType[data[i]];
                str += '</label>';
            }else{
                str += '<label class="btn btn-default" data-t="'+data[i]+'"><input type="radio" name="bs_list" value="'+data[i]+'">'+F_Rank._listType[data[i]]+'</label>';
            }
        }
        return str;
    },
    _htmlPlatType:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            if(i==0){
                str += '<label class="btn btn-default active" data-t="'+data[i]+'">';
                str += '<input type="radio" name="bs_list" value="'+data[i]+'" checked>'+F_Rank._platType[data[i]];
                str += '</label>';
            }else{
                str += '<label class="btn btn-default" data-t="'+data[i]+'"><input type="radio" name="bs_list" value="'+data[i]+'">'+F_Rank._platType[data[i]]+'</label>';
            }
        }
        return str;
    },
    _chooseType:function(){
        $('.bs_app_type_choose li').each(function(){
            $(this).click(function(){
                var currentType = F_Rank._getTypeName();
                var chooseType = $(this).find('a');
                if(currentType != chooseType.html()){
                    $('.bs_app_type span').html(chooseType.html()).attr('data-t',chooseType.attr('data-t'));
                    F_Rank._getInfo();
                }
            });
        });
    },
    _chooseClassify:function(){
        $('.bs_app_classify label').each(function(){
            $(this).click(function(){
                $(this).button('complete');
                if(!$(this).hasClass('active')){
                    F_Rank._getInfo('classify',$(this).attr('data-t'));
                }
            });
        });
    },
    _choosePlat:function(){
        $('.bs_app_plat label').each(function(){
            $(this).click(function(){
                $(this).button('complete');
                if(!$(this).hasClass('active')){
                    F_Rank._getInfo('plat',$(this).attr('data-t'));
                }
            });
        });
    },
    _getDateBegin:function(){
        return $('#db6').val();
    },
    _getDateEnd:function(){
        return $('#de6').val();
    },
    _getType:function(){
        return $('.bs_app_type span').attr('data-t');
    },
    _getTypeName:function(){
        return $('.bs_app_type span').html();
    },
    _getClassify:function(){
        var back = 0;
        $('.bs_app_classify label').each(function(){
            if($(this).hasClass('active')){
                back = $(this).attr('data-t');
            }
        });
        return back;
    },
    _getPlat:function(){
        var back = 0;
        $('.bs_app_plat label').each(function(){
            if($(this).hasClass('active')){
                back = $(this).attr('data-t');
            }
        });
        return back;
    },
    _getInfo:function(type,key){
        var begin = F_Rank._getDateBegin();
        var end = F_Rank._getDateEnd();
        var app_type = F_Rank._getType();
        var list_type = F_Rank._getClassify();
        var device_type = F_Rank._getPlat();
        var app_type_name = F_Rank._getTypeName();
        if(type && key){
            switch(type){
                case 'classify':
                    list_type = key;
                    break;
                case 'plat':
                    device_type = key;
                    break;
            }
        }
        G_Port._ajax('appRank','get',true,'app_type='+encodeURIComponent(app_type)+'&list_type='+list_type+'&device_type='+device_type+'&data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
            $('.lt_cxph').html(G_Pre._loading());
            $('.lt_fmCxList').html(G_Pre._loading());
        },function(){
            $('.lt_cxph').html('');
            $('.lt_fmCxList').html('');
        },function(data,msg){
            var dateArr = G_Date._dateArr(begin,end);
            var chartData = {};
            var chartDataPre = {'xAxis':[],'date':[],'data':[]};
            var chartYMax = 0;
            $.each(dateArr,function(key,value){
                chartDataPre.xAxis.push(key);
                chartDataPre.date.push(value);
                chartDataPre.data.push('-');
            });
            if(data.rank_date_distri && data.rank_date_distri.length>0){
                for(var i=0;i<data.rank_date_distri.length;i++){
                    var index = $.inArray(data.rank_date_distri[i].data_date,chartDataPre.date);
                    if(index > -1){
                        chartDataPre.data[index] = data.rank_date_distri[i].rank;
                    }
                    if(parseInt(chartYMax) < parseInt(data.rank_date_distri[i].rank))chartYMax = data.rank_date_distri[i].rank;
                }
                chartData.tooltip = {trigger:'axis'};
                chartData.legend = {};
                chartData.grid = {
                    left: '5%',
                    right: '5%',
                    bottom: '2%',
                    top: '3%',
                    containLabel: true
                };
                chartData.xAxis = [
                    {
                        splitLine : {
                            show:false
                        },
                        type : 'category',
                        boundaryGap : false,
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
                        inverse:true,
                        min:1,
                        name : '排行',
                        type : 'value',
                        nameLocation : 'middle',
                        nameTextStyle : {
                            color:'#C2C2C2',
                            fontSize : '11px'
                        },
                        nameGap:25,
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
                if(parseInt(chartYMax) < 5)chartData.yAxis[0].max = 5;
                chartData.series = [
                    {
                        symbol:'roundRect',
                        symbolSize:4,
                        name:app_type_name,
                        type:'line',
                        data:chartDataPre.data
                    }
                ];
                getEChart('line','bs_cxph',chartData);
            }else{
                $('#bs_cxph').html('<div class="c_empty">该段时间未上排行榜</div>');
            }

            if(data.top_apps && data.top_apps.length > 0){
                $('.lt_fmCxList').html(F_Rank._htmlRank(data.top_apps));
                maskShow($('.lt_fmCxList ul li'),$('.lt_fmCxList ul li'),'liOn',$('.lt_fmCxList .lt_shade'));
            }
        },function(data,msg,code){
            $('.lt_cxph').html(G_Pre._empty(msg));
            $('.lt_fmCxList').html(G_Pre._empty(msg));
        })
    },
    _htmlRank:function(data){
        var str = '<ul>';
        for(var i=0;i<data.length;i++){
            var rank = data[i].rank < 4 ? '<b class="lt_fmCxLtTop'+data[i].rank+' c_img"></b>' : '<b>'+data[i].rank+'</b>';
            var gameName = (data[i].app_name.length > 15) ? data[i].app_name.substr(0,15)+'.' : data[i].app_name;
            var gameCompany = data[i].app_author ? ((data[i].app_author.length > 15) ? data[i].app_author.substr(0,15)+'.' : data[i].app_author):'';
            var shade = '';
            if(data[i].project_id){
                var collectClass = 'lt_gmCtOff';
                if(G_Game._checkCollect(parseInt(data[i].project_id)))collectClass = 'lt_gmCtOn';
                shade = '\
                        <div id="rank_gmCollect'+data[i].project_id+'" onclick="G_Game._setCollect('+data[i].project_id+',\'rank_gmCollect'+data[i].project_id+'\',\'lt_gmCt\')" class="lt_gmCollect c_img '+collectClass+'"></div>\
                        <a onclick="G_Jump._url(\'light\','+data[i].project_id+')">查看灯塔></a>\
                        <a onclick="G_Jump._url(\'atlas\','+data[i].project_id+')">查看图谱></a>';
            }else{
                shade = '<div class="lt_notin">该游戏暂未收入<br><span onclick="openPlan(\''+G_Common._encodeUrl(gameName)+'\');" class="c_cursor c_colorG">申请添加游戏></span></div>';
            }
            str += '\
                    <li>'+rank+'\
                        <img src="'+data[i].app_img+'">\
                        <p title="'+data[i].app_name+'">'+gameName+'<br><span class="c_colorH" title="'+data[i].app_author+'">'+gameCompany+'</span></p>\
                        <div class="lt_shade">'+shade+'</div>\
                    </li>';
        }
        str += '</ul>';
        return str;
    }
};
var F_Channel = {
    _buff:{},
    _getDateBegin:function(){
        return $('#db4').val();
    },
    _getDateEnd:function(){
        return $('#de4').val();
    },
    _getInfo:function(firstApp,begin,end){
        G_Port._ajax('appChannelInfo','get',true,'project_id='+G_GameId,null,null,function(data,msg){
            if(data.get && data.get.length > 0){
                var liveChannelType = [];
                for(var i=0;i<data.get.length;i++){
                    liveChannelType.push(data.get[i].source_type);
                }
                if(firstApp && firstApp != ''){
                    var first = '';
                    var second = '';
                    var index = '';
                    for(var i=0;i<data.get.length;i++){
                        liveChannelType.push(data.get[i].source_type);
                        if(i == 0)first = data.get[i];
                        if(data.get[i].source_type == firstApp){
                            second = data.get[i];
                            index = i;
                            break;
                        }
                    }
                    if(index != 0){
                        data.get[0] = second;
                        data.get[index] = first;
                    }
                }
                $('.bs_fmQd').html(F_Channel._htmlBase(data.get));
                F_Channel._formatChart(liveChannelType);
                tabChoose($('.lt_fmQdTab ul li .lt_fmQdLogo'),$('.q_slider'),219,5,$('.lt_fmQdScroll'),'scroll','','','bs_yxqd_');
                clickScroll._init($('.lt_fmQdTab .lt_fmQdAwL'),$('.lt_fmQdTab .lt_fmQdAwR'),$('.lt_fmQdTab .lt_fmQdMid ul .lt_fmQdScroll'),$('.q_slider'),219,1,4,'lt_fmQdAwOn');
                showMore();
            }else{
                $('.bs_apps').each(function(){
                    $(this).hide();
                });
            }
        },null)
    },
    _getChart:function(){
        var begin = F_Channel._getDateBegin();
        var end = F_Channel._getDateEnd();
        G_Port._ajax('appChannelChart','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
            $('.bs_fmQd').html(G_Pre._loading());
        },function(){
            $('.bs_fmQd').html('');
        },function(data,msg){
            F_Channel._buff.channel_rating_distri = data.channel_rating_distri;
            var firstApp = '';
            if(data.channel_rating_distri && data.channel_rating_distri.length > 0){
                firstApp = data.channel_rating_distri[0].source_type;
            }
            F_Channel._getInfo(firstApp,begin,end);
        },function(data,msg,code){
            $('.bs_fmQd').html(G_Pre._empty(msg));
        })
    },
    _formatChart:function(liveChannelType){
        if(F_Channel._buff.channel_rating_distri && F_Channel._buff.channel_rating_distri.length > 0){
            var channelPortData = F_Channel._buff.channel_rating_distri;
            var channelData = {};
            for(var i=0;i<channelPortData.length;i++){
                if(channelPortData[i] && ($.inArray(channelPortData[i].source_type,liveChannelType) > -1)){
                    if(!channelData[channelPortData[i].source_type]){
                        channelData[channelPortData[i].source_type] = {};
                        channelData[channelPortData[i].source_type]['name'] = channelPortData[i].source_name;
                        channelData[channelPortData[i].source_type]['xAxis'] = channelPortData[i].rating_names.split(',');
                        channelData[channelPortData[i].source_type]['data'] = [];
                        for(var d=0;d<channelData[channelPortData[i].source_type]['xAxis'].length;d++){
                            channelData[channelPortData[i].source_type]['data'].push(0);
                        }
                    }
                    var index = $.inArray(channelPortData[i].rating_name,channelData[channelPortData[i].source_type]['xAxis']);
                    if(index > -1){
                        channelData[channelPortData[i].source_type]['data'][index] = channelPortData[i].num;
                    }
                }
            }
            if(channelData){
                $.each(channelData,function(key,value){
                    var chartData = {};
                    chartData.title = {
                        show:true,
                        left:'center',
                        text: value.name+'评分统计'
                    };
                    chartData.tooltip = {trigger:'axis'};
                    chartData.legend = {};
                    chartData.grid = {
                        right:'1%',
                        bottom:'1%',
                        containLabel: true
                    }
                    chartData.xAxis = [
                        {
                            splitLine : {
                                show:false
                            },
                            type : 'category',
                            data : value.xAxis,
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
                    chartData.yAxis = [
                        {
                            splitLine : {
                                lineStyle:{
                                    color:'#EEEEEE'
                                }
                            },
                            type : 'value',
                            nameLocation : 'middle',
                            nameTextStyle : {
                                color:'#C2C2C2',
                                fontSize : '11px'
                            },
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
                    chartData.series = [
                        {
                            barMaxWidth:30,
                            type: 'bar',
                            name: '数量',
                            data: value.data
                        }
                    ];
                    $('bs_yxqd_'+key).html('');
                    getEChart('appBar','bs_yxqd_'+key,chartData);
                });
            }
        }
    },
    _htmlBase:function(data){
        var chart = '';
        var str='\
            <div class="lt_fmQdTab c_marginB30">\
                <div class="lt_fmQdArrow c_floatLeft lt_fmQdAwL"><i class="glyphicon glyphicon-chevron-left"></i></div>\
                <div class="lt_fmQdMid">\
                    <ul>\
                        <div class="q_slider"></div>\
                        <div class="lt_fmQdScroll">';
        for(var i=0;i<data.length;i++){
            var pcount = 0;
            str += '<li><div class="lt_fmQdLogo" data-t="'+data[i].source_type+'"><img src="'+G_Game._imgSourceUrl(data[i].source_type,'small')+'"></div>';
            if(data[i].rating_value){
                str += pcount < 3 ? '<p>' : '<p class="c_none">';
                str += '<span>评分</span>';
                if(data.full_rating_value){
                    str += '<b class="c_colorGS">'+data[i].rating_value+'</b> / '+data[i].full_rating_value+' 分';
                }else{
                    var countNumber = parseInt(data[i].rating_value);
                    if(countNumber > 5)countNumber = parseInt(countNumber/2);
                    for(var c=1;c<=countNumber;c++){
                        str += '<i class="glyphicon glyphicon-star c_colorGS"></i>';
                    }
                    for(var r=1;r<=(5-countNumber);r++){
                        str += '<i class="glyphicon glyphicon-star c_colorHS"></i>';
                    }
                    str += data[i].rating_value;
                }
                str += '</p>';
                pcount += 1;
            }
            if(data[i].like_num){
                str += pcount < 3 ? '<p>' : '<p class="c_none">';
                str += '<span>喜欢</span>'+data[i].like_num;
                str += '</p>';
                pcount += 1;
            }
            if(data[i].rating_count){
                str += pcount < 3 ? '<p>' : '<p class="c_none">';
                str += '<span>评价量</span>'+data[i].rating_count;
                str += '</p>';
                pcount += 1;
            }
            if(data[i].hot_level){
                str += pcount < 3 ? '<p>' : '<p class="c_none">';
                str += '<span>热度</span>'+data[i].hot_level;
                str += '</p>';
                pcount += 1;
            }
            if(data[i].download_num){
                str += pcount < 3 ? '<p>' : '<p class="c_none">';
                str += '<span>下载量</span>'+data[i].download_num;
                str += '</p>';
                pcount += 1;
            }
            if(data[i].version){
                str += pcount < 3 ? '<p>' : '<p class="c_none">';
                str += '<span>版本号</span>'+data[i].version;
                str += '</p>';
                pcount += 1;
            }
            if(data[i].update_date){
                str += pcount < 3 ? '<p>' : '<p class="c_none">';
                str += '<span>更新时间</span>'+data[i].update_date;
                str += '</p>';
                pcount += 1;
            }
            if(pcount < 5){
                var diff = 5-pcount;
                for(var t=0;t<diff;t++){
                    str += pcount < 3 ? '<p>' : '<p class="c_none">';
                    str += '&nbsp;</p>';
                    pcount += 1;
                }
            }
            str += '<div class="lt_fmQdMore"><i class="glyphicon glyphicon-chevron-down"></i></div>';
            str += '</li>';
            chart += '<div  id="bs_yxqd_'+data[i].source_type+'" class="lt_yxqd_area';
            if(i>0)chart += ' c_none';
            chart += '">';
            chart += data[i].source_type+'' == '14' ? G_Pre._empty('该平台无玩家评分系统') : G_Pre._empty(G_Game._sourceName(data[i].source_type)+'暂无数据');
            chart += '</div>';
        }
        str += '\
                        </div>\
                    </ul>\
                </div>\
                <div class="lt_fmQdArrow c_floatRight lt_fmQdAwR lt_fmQdAwOn"><i class="glyphicon glyphicon-chevron-right"></i></div>\
                <div class="clearfix"></div>\
            </div>\
            <div class="lt_yxqd">'+chart+'</div>';
        return str;
    }
};
var F_Forum = {
    _buffData:{useless_name:''},
    _getDateBegin:function(){
        return $('#db3').val();
    },
    _getDateEnd:function(){
        return $('#de3').val();
    },
    _getTitle:function(){
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        if(F_Forum._buffData.title && F_Forum._buffData.titleDateBegin == begin && F_Forum._buffData.titleDateEnd == end){
            F_Forum._chartTitle(F_Forum._buffData.title);
            return;
        }
        G_Port._ajax('forumTitle','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
                $('.lt_ltfx').html(G_Pre._loading());
            },function(){
                $('.lt_ltfx').html('');
            },function(data,msg){
                F_Forum._buffData.titleDateBegin = begin;
                F_Forum._buffData.titleDateEnd = end;
                F_Forum._buffData.title = data.get;
                F_Forum._chartTitle(data.get);
            },function(data,msg,code){
                $('.lt_ltfx').html(G_Pre._empty(msg));
            }
        )
    },
    _getEmotion:function(type){
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        if(F_Forum._buffData.emotion && F_Forum._buffData.emotionDateBegin == begin && F_Forum._buffData.emotionDateEnd == end){
            F_Forum._chartEmotion(F_Forum._buffData.emotion,type);
            return;
        }
        G_Port._ajax('forumEmotion','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
                $('.lt_ltfx').html(G_Pre._loading());
            },function(){
                $('.lt_ltfx').html('');
            },function(data,msg){
                F_Forum._buffData.emotionDateBegin = begin;
                F_Forum._buffData.emotionDateEnd = end;
                F_Forum._buffData.emotion = data.get;
                F_Forum._chartEmotion(data.get,type);
            },function(data,msg,code){
                $('.lt_ltfx').html(G_Pre._empty(msg));
            }
        )
    },
    _getUseless:function(type){
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        if(F_Forum._buffData.useless && F_Forum._buffData.uselessDateBegin == begin && F_Forum._buffData.uselessDateEnd == end){
            F_Forum._chartUseless(F_Forum._buffData.useless,type);
            return;
        }
        G_Port._ajax('forumUseless','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
                $('.lt_ltfx').html(G_Pre._loading());
            },function(){
                $('.lt_ltfx').html('');
            },function(data,msg){
                F_Forum._buffData.uselessDateBegin = begin;
                F_Forum._buffData.uselessDateEnd = end;
                F_Forum._buffData.useless = data.useless_distri;
                F_Forum._chartUseless(data.useless_distri,type);
            },function(data,msg,code){
                $('.lt_ltfx').html(G_Pre._empty(msg));
            }
        )
    },
    _getKeywords:function(){
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        if(F_Forum._buffData.keywords && F_Forum._buffData.keywordsDateBegin == begin && F_Forum._buffData.keywordsDateEnd == end){
            F_Forum._chartKeywords(F_Forum._buffData.keywords);
            return;
        }
        G_Port._ajax('forumKeywords','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
                $('.lt_ltfx').html(G_Pre._loading());
            },function(){
                $('.lt_ltfx').html('');
            },function(data,msg){
                F_Forum._buffData.keywordsDateBegin = begin;
                F_Forum._buffData.keywordsDateEnd = end;
                F_Forum._buffData.keywords = data.get;
                F_Forum._chartKeywords(data.get);
            },function(data,msg,code){
                $('.lt_ltfx').html(G_Pre._empty(msg));
            }
        )
    },
    _getTopic:function(){
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        if(F_Forum._buffData.topic && F_Forum._buffData.topicDateBegin == begin && F_Forum._buffData.topicDateEnd == end){
            F_Forum._htmlTopic(F_Forum._buffData.topic);
            return;
        }
        G_Port._ajax('forumTopic','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
                $('.lt_ltfx').html(G_Pre._loading());
            },function(){
                $('.lt_ltfx').html('');
            },function(data,msg){
                F_Forum._buffData.topicDateBegin = begin;
                F_Forum._buffData.topicDateEnd = end;
                F_Forum._buffData.topic = data.topic_distri;
                F_Forum._htmlTopic(data.topic_distri);
            },function(data,msg,code){
                $('.lt_ltfx').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlTopic:function(data){
        if(data.length <= 0){
            $('#bs_ltfx').html(G_Pre._empty('暂无数据'));
            return;
        }
        var str = '';
        var diff = 0;
        str += '<div class="lt_ltfxArrow c_floatLeft c_img"></div> ';
        str += '<div class="lt_ltfxRect c_floatLeft">';
        for(var i=0;i<data.length;i++){
            if(i>14)break;
            diff = parseInt(i/3)+1;
            str += '<div data-w="'+data[i].topic_id+'" class="c_cursor lt_ltfxR'+diff+' lt_ltfxRP'+(i+1)+'">';
            str += data[i].topic_word_list;
            str += '</div>';
        }
        str += '</div><div class="clearfix"></div>';
        $('#bs_ltfx').html(str);
        F_Pop._detail('topic');
    },
    _chartKeywords:function(data){
        if(data.length <= 0){
            $('#bs_ltfx').html(G_Pre._empty('暂无数据'));
            return;
        }
        var chartData = {};
        var chartDataPre = {'xAxis':[],'data':[]};
        for(var i=0;i<data.length;i++){
            chartDataPre.xAxis.push(data[i].keyword);
            chartDataPre.data.push(data[i].cnt);
        }
        chartData.tooltip = {trigger:'axis'};
        chartData.legend = {};
        chartData.grid = {
            left: '2%',
            right: '2%',
            bottom: '12%',
            top: '5%',
            containLabel: true
        }
        chartData.dataZoom = [
            {
                type:'inside',
                show: true,
                start: 0,
                end: 6,
                zoomLock: true
            }
        ];
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
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
                    interval:'0'
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
                type : 'value',
                nameLocation : 'middle',
                nameTextStyle : {
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
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
        chartData.series = [
            {
                barMaxWidth:30,
                type: 'bar',
                name: '热度',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: chartDataPre.data
            }
        ];
        getEChart('keywords','bs_ltfx',chartData);
    },
    _chartUseless:function(data,type){
        if(data.length <= 0){
            $('#bs_ltfx').html(G_Pre._empty('暂无数据'));
            return;
        }
        var chartData = {};
        var isFirst = true;
        var isSplit = false;
        var chartDataPre = {'inside':[],'outside':[],'legend':[]};
        for(var i = 0;i<data.length;i++){
            if(data[i].detail_classify_distri && data[i].detail_classify_distri.length>0){
                if(!type)type = data[i].show_forum_name;

                var inside_number = (data[i].useless_rate*100).toFixed(2);
                var inside_source = '帖子来源 - '+data[i].show_forum_name+' '+inside_number+'%';
                chartDataPre.legend.push(inside_source);
                if(type == data[i].show_forum_name){
                    F_Forum._buffData.useless_name = inside_source;
                    chartDataPre.inside.push(
                        {
                            value:inside_number,
                            name:inside_source,
                            selected:true
                        }
                    );
                }else{
                    chartDataPre.inside.push(
                        {
                            value:inside_number,
                            name:inside_source
                        }
                    );
                }
                if(type == data[i].show_forum_name){
                    for(var d=0;d<data[i].detail_classify_distri.length;d++){
                        var outside_number = (data[i].detail_classify_distri[d].useless_rate*100).toFixed(2);
                        var outside_source = '内容分布 - ('+data[i].show_forum_name+')'+data[i].detail_classify_distri[d].useless_classify+' '+outside_number+'%';
                        chartDataPre.legend.push(outside_source);
                        chartDataPre.outside.push(
                            {
                                value:outside_number,
                                name:outside_source
                            }
                        );
                    }
                }
            }
        }
        chartData.tooltip = {trigger:'item',formatter:'{b}'};
        chartData.legend = {
            top:'10%',
            itemGap:6,
            itemWidth:12,
            itemHeight:12,
            orient: 'vertical',
            left :'right',
            align:'left',
            data:chartDataPre.legend,
            textStyle:{
                fontSize:12
            }
        };
        chartData.grid = {
            containLabel: true
        }
        chartData.xAxis = [];
        chartData.yAxis = [],
        chartData.series = [
            {
                name:'各论坛占比',
                type:'pie',
                hoverAnimation:false,
                selectedMode: 'single',
                center: ['30%', '50%'],
                radius: [0, '40%'],
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:chartDataPre.inside
            },
            {
                type:'pie',
                hoverAnimation:false,
                center: ['30%', '50%'],
                radius: ['60%', '90%'],
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:chartDataPre.outside
            }
        ];
        getEChart('pie','bs_ltfx',chartData);
    },
    _chartTitle:function(data){
        if(data.length <= 0){
            $('#bs_ltfx').html(G_Pre._empty('暂无数据'));
            return;
        }
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        var dateArr = G_Date._dateArr(begin,end);
        var chartData = {};
        var chartDataPre = {'source':[],'format':{},'series':[],'xAxis':[],'date':[]};
        for(var i=0;i<data.length;i++){
            if(data[i]){
                var formatData = {'date':'','number':0};
                formatData.date = data[i].data_date;
                formatData.number = data[i].forum_post_num;
                if(!($.inArray(data[i].forum_name,chartDataPre.source)>-1)){
                    chartDataPre.source.push(data[i].forum_name);
                    chartDataPre.format[data[i].forum_name] = [];
                }
                chartDataPre.format[data[i].forum_name].push(formatData);
            }
        }
        if(chartDataPre.source.length > 0){
            for(var i=0;i<chartDataPre.source.length;i++){
                var sourceName = chartDataPre.source[i];
                var chartSerie = {
                    barMaxWidth:30,
                    name: sourceName,
                    type: 'bar',
                    stack: '总量',
                    data: []
                };
                $.each(dateArr,function(key,value){
                    if(i==0){
                        chartDataPre.xAxis.push(value);
                        chartDataPre.date.push(value);
                    }
                    chartSerie.data.push(0);
                });
                if(chartDataPre.format[sourceName]){
                    for(var d=0;d<chartDataPre.format[sourceName].length;d++){
                        var index = $.inArray(chartDataPre.format[sourceName][d].date,chartDataPre.date);
                        if(index > -1){
                            chartSerie.data[index] = chartDataPre.format[sourceName][d].number;
                        }
                    }
                }
                chartDataPre.series.push(chartSerie);
            }
        }
        chartData.tooltip = {trigger:'axis'};
        chartData.legend = {
            itemGap:5,
            itemWidth:12,
            itemHeight:12,
            top :'bottom',
            align:'left',
            data:chartDataPre.source,
            textStyle:{
                fontSize:12
            }
        };
        chartData.grid = {
            containLabel: true
        }
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
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
                nameGap:50,
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
        getEChart('title','bs_ltfx',chartData);
    },
    _chartEmotion:function(data,type){
        if(data.length <= 0){
            $('#bs_ltfx').html(G_Pre._empty('暂无数据'));
            return;
        }
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        var dateArr = G_Date._dateArr(begin,end);
        var chartData = {};
        var chartDataPre = {'xAxis':[],'date':[],'pos':[],'neg':[],'data':[]};
        $.each(dateArr,function(key,value){
            //chartDataPre.xAxis.push(key);
            chartDataPre.xAxis.push(value);
            chartDataPre.date.push(value);
            chartDataPre.pos.push(0);
            chartDataPre.neg.push(0);
        });
        if(data){
            for(var i=0;i<data.length;i++){
                var index = $.inArray(data[i].data_date,chartDataPre.date);
                if(index > -1){
                    if(data[i].attitude_score< 0){
                        chartDataPre.neg[index] += data[i].post_num;
                    }
                    if(data[i].attitude_score > 0){
                        chartDataPre.pos[index] += data[i].post_num;
                    }
                }
            }
        }
        var color = ['#6FC1E8','#E9F5FB'];
        var name = '';
        var chartType = '';
        switch(type){
            case 'pos':
                chartType = 'emotionPos';
                name = '正面帖数';
                color[0] = '#ACC76E';
                color[1] = '#F2F8EA';
                chartDataPre.data = chartDataPre.pos;
                break;
            case 'neg':
                chartType = 'emotionNeg';
                name = '负面帖数';
                color[0] = '#FABA9F';
                color[1] = '#FFF3EE';
                chartDataPre.data = chartDataPre.neg;
                break;
        }

        chartData.tooltip = {trigger:'axis'};
        chartData.legend = {};
        chartData.grid = {
            left: '5%',
            right: '5%',
            bottom: '2%',
            top: '3%',
            containLabel: true
        }
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
                },
                type : 'category',
                boundaryGap : false,
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
                    show:false
                },
                name : name,
                type : 'value',
                nameLocation : 'middle',
                nameTextStyle : {
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
                nameGap:25,
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
        chartData.series = [
            {
                lineStyle:{
                    normal:{
                        color:color[0],
                        width:2
                    }
                },
                /*
                itemStyle:{
                    normal:{
                        color:color[1]
                    }
                },
                areaStyle: {normal: {}},
                */
                symbol:'roundRect',
                symbolSize:4,
                name:'帖子数',
                type:'line',
                data:chartDataPre.data
            }
        ];

        getEChart(chartType,'bs_ltfx',chartData);
    },
    _getBase:function(){
        var begin = F_Forum._getDateBegin();
        var end = F_Forum._getDateEnd();
        G_Port._ajax('forumCommon','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
            $('.bs_forum').html(G_Pre._loading());
        },function(){
            $('.bs_forum').html('');
        },function(data,msg){
            var baseData = {};
            baseData.title_num = !data.title_num ? 0 : data.title_num;
            baseData.title_num_growth = !data.title_num_growth ? '-' : F_Forum._formatPercent('arrow',data.title_num_growth);
            baseData.title_avg_num = !data.title_avg_num ? 0 : data.title_avg_num;
            baseData.title_avg_num_growth = !data.title_avg_num_growth ? '-' : F_Forum._formatPercent('arrow',data.title_avg_num_growth);
            baseData.title_talent_num = !data.title_talent_num ? 0 : data.title_talent_num;
            baseData.title_talent_num_growth = !data.title_talent_num_growth ? '-' : F_Forum._formatPercent('arrow',data.title_talent_num_growth);

            baseData.positive_rate = !data.positive_rate ? 0 : F_Forum._formatPercent('format',data.positive_rate);
            baseData.positive_rate_growth = !data.positive_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.positive_rate_growth);
            baseData.positive_avg_rate = !data.positive_avg_rate ? 0 : F_Forum._formatPercent('format',data.positive_avg_rate);
            baseData.positive_avg_rate_growth = !data.positive_avg_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.positive_avg_rate_growth);
            baseData.positive_talent_rate = !data.positive_talent_rate ? 0 : F_Forum._formatPercent('format',data.positive_talent_rate);
            baseData.positive_talent_rate_growth = !data.positive_talent_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.positive_talent_rate_growth);

            baseData.negative_rate = !data.negative_rate ? 0 : F_Forum._formatPercent('format',data.negative_rate);
            baseData.negative_rate_growth = !data.negative_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.negative_rate_growth);
            baseData.negative_avg_rate = !data.negative_avg_rate ? 0 : F_Forum._formatPercent('format',data.negative_avg_rate);
            baseData.negative_avg_rate_growth = !data.negative_avg_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.negative_avg_rate_growth);
            baseData.negative_talent_rate = !data.negative_talent_rate ? 0 : F_Forum._formatPercent('format',data.negative_talent_rate);
            baseData.negative_talent_rate_growth = !data.negative_talent_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.negative_talent_rate_growth);

            baseData.useless_rate = !data.useless_rate ? 0 : F_Forum._formatPercent('format',data.useless_rate);
            baseData.useless_rate_growth = !data.useless_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.useless_rate_growth);
            baseData.useless_avg_rate = !data.useless_avg_rate ? 0 : F_Forum._formatPercent('format',data.useless_avg_rate);
            baseData.useless_avg_rate_growth = !data.useless_avg_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.useless_avg_rate_growth);
            baseData.useless_talent_rate = !data.useless_talent_rate ? 0 : F_Forum._formatPercent('format',data.useless_talent_rate);
            baseData.useless_talent_rate_growth = !data.useless_talent_rate_growth ? '-' : F_Forum._formatPercent('arrow',data.useless_talent_rate_growth);

            baseData.hotword_num = !data.hotword_num ? 0 : data.hotword_num;
            baseData.hotword_num_growth = !data.hotword_num_growth ? '-' : F_Forum._formatPercent('arrow',data.hotword_num_growth);
            baseData.hotword_avg_num = !data.hotword_avg_num ? 0 : data.hotword_avg_num;
            baseData.hotword_avg_num_growth = !data.hotword_avg_num_growth ? '-' : F_Forum._formatPercent('arrow',data.hotword_avg_num_growth);
            baseData.hotword_talent_num = !data.hotword_talent_num ? 0 : data.hotword_talent_num;
            baseData.hotword_talent_num_growth = !data.hotword_talent_num_growth ? '-' : F_Forum._formatPercent('arrow',data.hotword_talent_num_growth);

            baseData.topic_num = !data.topic_num ? 0 : data.topic_num;
            baseData.topic_num_growth = !data.topic_num_growth ? '-' : F_Forum._formatPercent('arrow',data.topic_num_growth);
            baseData.topic_avg_num = !data.topic_avg_num ? 0 : data.topic_avg_num;
            baseData.topic_avg_num_growth = !data.topic_avg_num_growth ? '-' : F_Forum._formatPercent('arrow',data.topic_avg_num_growth);
            baseData.topic_talent_num = !data.topic_talent_num ? 0 : data.topic_talent_num;
            baseData.topic_talent_num_growth = !data.topic_talent_num_growth ? '-' : F_Forum._formatPercent('arrow',data.topic_talent_num_growth);

            baseData.game = '';
            if(data.talent_games && data.talent_games.length>0){
                var gameInfo = G_Game._getGame(data.talent_games,4);
                if(gameInfo){
                    $.each(gameInfo,function(key,value){
                        var collectClass = 'lt_gmCtOff';
                        if(G_Game._checkCollect(parseInt(key)))collectClass = 'lt_gmCtOn';
                        var gameName = (value[1].length > 5) ? value[1].substr(0,5)+'.' : value[1];
                        var gameCompany = value[2] ? ((value[2].length > 5) ? value[2].substr(0,5)+'.' : value[2]):'';
                        baseData.game += '\
                        <li>\
                            <img src="'+value[0]+'">\
                            <p title="'+value[1]+'">'+gameName+'<br><span class="c_colorH" title="'+value[2]+'">'+gameCompany+'</span></p>\
                            <div class="lt_shade">\
                                <div id="forum_gmCollect'+key+'" onclick="G_Game._setCollect('+key+',\'forum_gmCollect'+key+'\',\'lt_gmCt\')" class="lt_gmCollect c_img '+collectClass+'"></div>\
                                <a onclick="G_Jump._url(\'light\','+key+')">查看灯塔></a>\
                                <a onclick="G_Jump._url(\'atlas\','+key+')">查看图谱></a>\
                            </div>\
                         </li>';
                    });
                }
            }
            $('.bs_forum').html(F_Forum._htmlBase(baseData));

            maskShow($('.lt_fmBbsList ul li'),'','',$('.lt_fmBbsList .lt_shade'));
            tabChoose($('.lt_fmBbsTab ul li'),$('.b_slider'),185,0,'liOn','bbs',null,$('.bs_bbs_intro .bs_bbs_avg'));

            F_Forum._getTitle();

        },function(data,msg,code){
            $('.bs_forum').html(G_Pre._empty(msg));
        })
    },
    _htmlBase:function(data){
        var str = '';
        str += '\
        <div class="lt_fmBbsTab c_marginB30">\
            <div class="b_slider"></div>\
            <ul>\
                <li class="liOn">\
                    <p>论坛帖子总量</p>\
                    <b>'+data.title_num+'</b>\
                    <div>'+data.title_num_growth+'</div>\
                </li>\
                <li>\
                    <p>正面情感帖占比</p>\
                    <b>'+data.positive_rate+'</b>\
                    <div>'+data.positive_rate_growth+'</div>\
                </li>\
                <li>\
                    <p>负面情感帖占比</p>\
                    <b>'+data.negative_rate+'</b>\
                    <div>'+data.negative_rate_growth+'</div>\
                </li>\
                <li>\
                    <p>无效帖占比</p>\
                    <b>'+data.useless_rate+'</b>\
                    <div>'+data.useless_rate_growth+'</div>\
                </li>\
                <li>\
                    <p>论坛热词指数</p>\
                    <b>'+data.hotword_num+'</b>\
                    <div>'+data.hotword_num_growth+'</div>\
                </li>\
                <li>\
                    <p>热门话题指数</p>\
                    <b>'+data.topic_num+'</b>\
                    <div>'+data.topic_num_growth+'</div>\
                </li>\
            </ul>\
            <div class="clearfix"></div>\
        </div>\
        <div class="lt_ltfx c_floatLeft" id="bs_ltfx"></div>\
        <div class="lt_fmBbsRight c_floatRight c_border c_shadow2">\
            <div class="lt_fmBbsArrow c_img"></div>\
            <div class="c_padding20">\
                <div class="bs_bbs_intro">\
                    <div class="bs_bbs_avg">\
                        <div class="lt_fmBbsPercet c_floatLeft c_marginB30">\
                            <p>同类游戏平均</p>\
                            <b>'+data.title_avg_num+'</b>\
                            <div>'+data.title_avg_num_growth+'</div>\
                        </div>\
                        <div class="lt_fmBbsPercet c_floatRight c_borderL c_marginB30">\
                            <p>同类优秀游戏</p>\
                            <b>'+data.title_talent_num+'</b>\
                            <div>'+data.title_talent_num_growth+'</div>\
                        </div>\
                    </div>\
                    <div class="bs_bbs_avg c_none">\
                        <div class="lt_fmBbsPercet c_floatLeft c_marginB30">\
                            <p>同类游戏平均</p>\
                            <b>'+data.positive_avg_rate+'</b>\
                            <div>'+data.positive_avg_rate_growth+'</div>\
                        </div>\
                        <div class="lt_fmBbsPercet c_floatRight c_borderL c_marginB30">\
                            <p>同类优秀游戏</p>\
                            <b>'+data.positive_talent_rate+'</b>\
                            <div>'+data.positive_talent_rate_growth+'</div>\
                        </div>\
                    </div>\
                    <div class="bs_bbs_avg c_none">\
                        <div class="lt_fmBbsPercet c_floatLeft c_marginB30">\
                            <p>同类游戏平均</p>\
                            <b>'+data.negative_avg_rate+'</b>\
                            <div>'+data.negative_avg_rate_growth+'</div>\
                        </div>\
                        <div class="lt_fmBbsPercet c_floatRight c_borderL c_marginB30">\
                            <p>同类优秀游戏</p>\
                            <b>'+data.negative_talent_rate+'</b>\
                            <div>'+data.negative_talent_rate_growth+'</div>\
                        </div>\
                    </div>\
                    <div class="bs_bbs_avg c_none">\
                        <div class="lt_fmBbsPercet c_floatLeft c_marginB30">\
                            <p>同类游戏平均</p>\
                            <b>'+data.useless_avg_rate+'</b>\
                            <div>'+data.useless_avg_rate_growth+'</div>\
                        </div>\
                        <div class="lt_fmBbsPercet c_floatRight c_borderL c_marginB30">\
                            <p>同类优秀游戏</p>\
                            <b>'+data.useless_talent_rate+'</b>\
                            <div>'+data.useless_talent_rate_growth+'</div>\
                        </div>\
                    </div>\
                    <div class="bs_bbs_avg c_none">\
                        <div class="lt_fmBbsPercet c_floatLeft c_marginB30">\
                            <p>同类游戏平均</p>\
                            <b>'+data.hotword_avg_num+'</b>\
                            <div>'+data.hotword_avg_num_growth+'</div>\
                        </div>\
                        <div class="lt_fmBbsPercet c_floatRight c_borderL c_marginB30">\
                            <p>同类优秀游戏</p>\
                            <b>'+data.hotword_talent_num+'</b>\
                            <div>'+data.hotword_talent_num_growth+'</div>\
                        </div>\
                    </div>\
                    <div class="bs_bbs_avg c_none">\
                        <div class="lt_fmBbsPercet c_floatLeft c_marginB30">\
                            <p>同类游戏平均</p>\
                            <b>'+data.topic_avg_num+'</b>\
                            <div>'+data.topic_avg_num_growth+'</div>\
                        </div>\
                        <div class="lt_fmBbsPercet c_floatRight c_borderL c_marginB30">\
                            <p>同类优秀游戏</p>\
                            <b>'+data.topic_talent_num+'</b>\
                            <div>'+data.topic_talent_num_growth+'</div>\
                        </div>\
                    </div>\
                </div>\
                <div class="clearfix"></div>\
                <div class="lt_title c_marginB10 c_marginTop20">\
                    <h2>同类优秀游戏</h2>\
                </div>\
                <div class="lt_fmBbsList">\
                    <ul>'+data.game+'</ul>\
                </div>\
            </div>\
        </div>\
        <div class="clearfix"></div>';
        return str;
    },
    _formatPercent:function(type,percent){
        percent = (percent*100).toFixed(2);
        switch(type){
            case 'arrow':
                if(percent > 0){
                    percent = '<span class="c_colorR">↑</span>'+percent;
                }else if(percent < 0){
                    percent = '<span class="c_colorG">↓</span>'+percent;
                }else{
                    percent = '-';
                }
                percent = '较前一周期 '+percent;
                break;
        }
        return percent+'%';
    }
}

var F_HotWordTrend = {
    _getTrend:function(){
        var begin = $('#db2').val();
        var end = $('#de2').val();
        G_Port._ajax('hotWordTrend','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
            $('.lt_rczs').html(G_Pre._loading());
            $('.lt_rcarea button').hide();
        },function(){
            $('.lt_rczs').html('');
        },function(data,msg){
            if(data){
                var dateArr = G_Date._dateArr(begin,end);
                var chartData = {};
                var chartDataPre = {xAxis:[],word:{},series:[],legend:[]};
                var changeWord = [];
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
                    $.each(dateArr,function(key,value){
                        //if(i == 1)chartDataPre.xAxis.push(key);
                        if(i == 1)chartDataPre.xAxis.push(value);
                        var index = $.inArray(value,dataObj.date);
                        if(index > -1){
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
                    right: '5%',
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
                        nameGap:50,
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
                getEChart('line','lt_rczs',chartData);
                if(changeWord)changeWord = changeWord.join(' ');
                $('.lt_rcarea button').show().bind('click',function(){
                    openWord(changeWord);
                });
            }
        },function(data,msg,code){
            $('.lt_rczs').html(G_Pre._empty(msg));
        });
    }
}

var F_Insight = {
    _buff:{feedback_tag_distri:[]},
    _getDateBegin:function(){
        return $('#db1').val();
    },
    _getDateEnd:function(){
        return $('#de1').val();
    },
    _chooseCheckBox:function(type){
        var tag = '';
        switch(type){
            case 'negative':
                $('.lt_fmTsChoose input').on('ifChanged', function(event){
                    tag = F_Insight._chooseChecked(type);
                    if(tag.indexOf(',') > -1)tag = 'all';
                    if(tag != F_Insight._buff.negativeWord){
                        F_Insight._buff.negativeWord = tag;
                        var back = F_Insight._dataNegative(tag);
                        F_Insight._chooseNegative(back,false);
                    }
                });
                break;
        }
    },
    _chooseChecked:function(type){
        var dom;
        var hasChecked = [];
        switch(type){
            case 'negative':
                dom = $('.lt_fmTsChoose input[type="checkbox"]');
                break;
        }
        dom.each(function(){
            if($(this).prop("checked")==true){
                hasChecked.push($(this).attr('data-w'));
            }
        });
        if(hasChecked.length > 1){
            dom.each(function(){
                $(this).iCheck('enable');
            });
        }else{
            dom.each(function(){
                if($(this).prop("checked")==true)$(this).iCheck('disable');
            });
        }
        return hasChecked.length > 0 ? hasChecked.join(',') : false;
    },
    _getInfo:function(){
        var begin = F_Insight._getDateBegin();
        var end = F_Insight._getDateEnd();
        G_Port._ajax('insight','get',true,'data_date_start='+begin+'&data_date_end='+end+'&project_id='+G_GameId,function(){
                $('.lt_fm_fkqx').html(G_Pre._loading());
                $('.bs_fkzb').html(G_Pre._loading());
                $('.lt_fmTsMid').html(G_Pre._loading());
            },function(){
                $('.lt_fm_fkqx').html('');
                $('.bs_fkzb').html('');
                $('.lt_fmTsMid').html('');
            },
            function(data,msg){
                var total_num = !data.total_num ? 0 : data.total_num;
                var positive_num = !data.positive_num ? 0 : data.positive_num;
                var negative_num = !data.negative_num ? 0 : data.negative_num;
                var positive_rate = !data.positive_rate ? 0.00 : (data.positive_rate*100).toFixed(2);
                var negative_rate = !data.negative_rate ? 0.00 : (data.negative_rate*100).toFixed(2);
                var other_rate = !data.other_rate ? 0.00 : (data.other_rate*100).toFixed(2);

                var rate_red = negative_rate > 0 ? Math.ceil(negative_rate/5) : 0;
                if(rate_red == 0 && negative_rate >0)rate_red = 1;
                var rate_green = positive_rate > 0 ? Math.ceil(positive_rate/5) : 0;
                if(rate_green == 0 && positive_rate >0)rate_green = 1;
                var rate_blue = 20 - rate_red - rate_green;
                if(rate_blue <= 0){
                    if(rate_blue < 0){
                        if(rate_red > rate_green){
                            rate_red -= 1;
                        }else{
                            rate_green -= 1;
                        }
                    }
                    if(other_rate > 0){
                        rate_blue = 1;
                        if(rate_red > rate_green){
                            rate_red -= 1;
                        }else{
                            rate_green -= 1;
                        }
                    }
                }
                if(rate_blue == 20 && other_rate == 0)rate_blue = 0;

                var dateArr = G_Date._dateArr(begin,end);
                var chartData = {};
                var chartDataPre = {'xAxis':[],'date':[],'positive':[],'negative':[]};
                $.each(dateArr,function(key,value){
                    chartDataPre.xAxis.push(value);
                    chartDataPre.date.push(value);
                    chartDataPre.positive.push(0);
                    chartDataPre.negative.push(0);
                });
                if(data.feedback_trend){
                    for(var i=0;i<data.feedback_trend.length;i++){
                        var index = $.inArray(data.feedback_trend[i].data_date,chartDataPre.date);
                        if(index > -1){
                            chartDataPre.positive[index] = data.feedback_trend[i].positive_num;
                            chartDataPre.negative[index] = data.feedback_trend[i].negative_num;
                        }
                    }
                }
                chartData.tooltip = {trigger:'axis'};
                chartData.legend = {};
                chartData.grid = {
                    left: '5%',
                    right: '5%',
                    bottom: '2%',
                    top: '3%',
                    containLabel: true
                }
                chartData.xAxis = [
                    {
                        splitLine : {
                            show:false
                        },
                        type : 'category',
                        boundaryGap : false,
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
                            show:false
                        },
                        name : '反馈数',
                        type : 'value',
                        nameLocation : 'middle',
                        nameTextStyle : {
                            color:'#C2C2C2',
                            fontSize : '11px'
                        },
                        nameGap:25,
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
                chartData.series = [
                    {
                        lineStyle:{
                            normal:{
                                color:'#ACC76E',
                                width:1
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#F2F8EA'
                            }
                        },
                        showSymbol:false,
                        name:'正面',
                        type:'line',
                        areaStyle: {normal: {}},
                        data:chartDataPre.positive
                    },
                    {
                        lineStyle:{
                            normal:{
                                color:'#FABA9F',
                                width:1
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#FFF3EE'
                            }
                        },
                        showSymbol:false,
                        name:'负面',
                        type:'line',
                        areaStyle: {normal: {}},
                        data:chartDataPre.negative
                    }
                ];
                $('.lt_fm_fkqx').html(F_Insight._htmlBase('curve',{'total_num':total_num,'positive_num':positive_num,'negative_num':negative_num}));
                getEChart('line','lt_fkqy',chartData);

                $('.bs_fkzb').html(F_Insight._htmlBase('percent',{'red':rate_red,'blue':rate_blue,'green':rate_green,'positive_rate':positive_rate,'other_rate':other_rate,'negative_rate':negative_rate}));

                var word = {'positive_total':0,'positive':{},'other_total':0,'other':{},'positive_hasOther':false,'positive_otherOnly':false,'negative_total':0,'negative':{},'negative_hasOther':false,'negative_otherOnly':false,'negative_hasCommon':false,'negative_hasPrivate':false};
                var wordGet = {};
                if(data.feedback_class_distri){
                    $.each(data.feedback_class_distri,function(key,wordClassify){
                        key = parseInt(key);
                        switch(key){
                            case 0:
                                for(var i=0;i<wordClassify.length;i++){
                                    if(i==0)wordGet.other =  wordClassify[i].lighttower_classify;
                                    word.other_total += wordClassify[i].post_num;
                                    word.other[wordClassify[i].lighttower_classify] = wordClassify[i].post_num;
                                }
                                break;
                            case 1:
                                var d = 0;
                                for(var i=0;i<wordClassify.length;i++){
                                    if(wordClassify[i].lighttower_classify != '其它'){
                                        if(d==0)wordGet.positive =  wordClassify[i].lighttower_classify;;
                                        word.positive_total += wordClassify[i].post_num;
                                        word.positive[wordClassify[i].lighttower_classify] = wordClassify[i].post_num;
                                        d++;
                                    }else{
                                        word.positive_hasOther = true;
                                    }
                                }
                                if(word.positive_hasOther && !wordGet.positive){
                                    wordGet.positive = '其它';
                                    word.positive_otherOnly = true;
                                }
                                break;
                            case -1:
                                F_Insight._buff.negativeData = wordClassify;
                                var back = F_Insight._dataNegative('all');
                                back = F_Insight._chooseNegative(back,true);
                                word.negative_hasPrivate = back.negative_hasPrivate;
                                word.negative_hasCommon = back.negative_hasCommon;
                                word.negative_total = back.negative_total;
                                word.negative = back.negative;
                                word.negative_hasOther = back.negative_hasOther;
                                wordGet.negative = back.firstWord;
                                word.negative_otherOnly = back.negative_otherOnly;
                                word.negative_init = back.negative_init;
                                break;
                        }
                    })
                }
                $('.lt_fmTsMid').html(F_Insight._htmlBase('word',word));

                if(wordGet.negative){
                    $('.lt_fmTsChoose input').iCheck({
                        checkboxClass: 'icheckbox_flat-red',
                        radioClass: 'iradio_flat-red'
                    });
                    F_Insight._chooseCheckBox('negative');
                }

                setTimeout(function(){F_Insight._getRelation(begin,end,wordGet.negative,-1);},300);
                setTimeout(function(){F_Insight._getRelation(begin,end,wordGet.positive,1);},600);
                setTimeout(function(){F_Insight._getRelation(begin,end,wordGet.other,0);},900);

                tabChoose($('.lt_fmTsTab ul li'),$('.t_slider'),100,5,'liOn','tab',$('.lt_fmPercent p'),$('.lt_fmTsMdArea ul'),$('.bs_lt_fm_r'));
                itemChoose($('.lt_fmTsMdArea ul li'),'liOn',function(data){
                    setTimeout(function(){F_Insight._getRelation(begin,end,data);},300);
                });

                F_Insight._activePercent($('.lt_fmPercent p'),'percent','');
                F_Insight._activePercent($('.lt_fmPeople i'),'people','');
            },
            function(data,msg,code){
                $('.lt_fm_fkqx').html(G_Pre._empty(msg));
                $('.bs_fkzb').html(G_Pre._empty(msg));
                $('.lt_fmTsMid').html(G_Pre._empty(msg));
            });
    },
    _chooseNegative:function(back,isInit){
        var keywords = '';
        var begin = F_Insight._getDateBegin();
        var end = F_Insight._getDateEnd();
        var word = {'negative_total':0,'negative':{},'negative_hasOther':false,'negative_otherOnly':false,'negative_hasCommon':false,'negative_hasPrivate':false};
        word.negative_hasPrivate = back.hasPrivate;
        word.negative_hasCommon = back.hasCommon;
        word.negative_total = back.total;
        word.negative = back.words;
        word.negative_hasOther = back.hasOther;
        word.firstWord = back.firstWord;

        if(word.negative_hasOther && !word.firstWord){
            word.firstWord = '其它';
            word.negative_otherOnly = true;
        }
        word.negative_init = isInit;
        if(isInit){
            return word;
        }else{
            $('.lt_fmTsMdArea ul').eq(0).find('li').remove();
            $('.lt_fmTsMdArea ul').eq(0).append(F_Insight._htmlNegative(word,word.negative));
            F_Insight._getRelation(begin,end,word.firstWord,-1);
            itemChoose($('.lt_fmTsMdArea ul li'),'liOn',function(data){
                setTimeout(function(){F_Insight._getRelation(begin,end,data);},300);
            });
        }
    },
    _dataNegative:function(type){
        var back = {firstWord:'',total:0,words:{},hasCommon:false,hasPrivate:false,hasOther:false,hasAll:false};
        var d = 0;
        if(F_Insight._buff.negativeData){
            var wordClassify = F_Insight._buff.negativeData;
            if(wordClassify.length < 12)type = 'allFormat';
            for(var i=0;i<wordClassify.length;i++){
                if(!back.hasPrivate && wordClassify[i].feedback_type == 'game')back.hasPrivate = true;
                if(!back.hasCommon && wordClassify[i].feedback_type == 'common')back.hasCommon = true;
                if(type == wordClassify[i].feedback_type || type == 'all' || type == 'allFormat'){
                    if(wordClassify[i].lighttower_classify != '其它'){
                        if(d==0){
                            back.firstWord =  wordClassify[i].lighttower_classify;
                        }
                        back.total += wordClassify[i].post_num;
                        back.words[wordClassify[i].lighttower_classify] = wordClassify[i].post_num;
                        d++;
                    }else{
                        back.hasOther = true;
                    }
                }
            }
            switch(type){
                case 'allFormat':
                    back.hasPrivate = false;
                    back.hasCommon = false;
                    break;
                case 'game':
                    back.hasOther = false;
                    break;
            }
        }
        return back;
    },
    _chartColor:{red:['#DD4A38','#E36E5F','#EB9389','#F1B6AF','#F7DAD8'],green:['#669F3C','#85B160','#A3C489','#C4D8B3','#E1EAD9'],blue:['#30A5DD','#57B6E4','#81C8EB','#AADAF1','#D4ECF8']},
    _getRelation:function(begin,end,word,classify){
        if(typeof(classify) == 'undefined'){
            classify = 0;
            $('.lt_fmTsTab ul li').each(function(){
                if($(this).hasClass('liOn')){
                    classify = $(this).attr('data-c');
                }
            });
        }
        var index = 0;
        switch(classify+''){
            case  '0':
                index = 2;
                break;
            case '1':
                index = 1;
                break;
            case '-1':
                index = 0;
                break;
        }
        G_Port._ajax('insightRelation','get',true,'data_date_start='+begin+'&data_date_end='+end+'&classify_sentiment='+classify+'&lighttower_classify='+encodeURIComponent(word)+'&project_id='+G_GameId,function(){
            $('#lt_wtzs'+index).html(G_Pre._loading());
            $('#lt_wtfb'+index).html(G_Pre._loading());
        },function(){
            $('#lt_wtzs'+index).html('');
            $('#lt_wtfb'+index).html('');
        },function(data,msg){
            var dateArr = G_Date._dateArr(begin,end);
            var chartData = {};
            var chartDataPre = {'xAxis':[],'date':[],'data':[]};
            var lineColor = '';
            var color = [];
            switch(index){
                case 0:
                    lineColor = '#E05847';
                    color = F_Insight._chartColor.red;
                    break;
                case 1:
                    lineColor = '#669F3C';
                    color = F_Insight._chartColor.green;
                    break;
                case 2:
                    lineColor = '#30A5DD';
                    color = F_Insight._chartColor.blue;
                    break;
            }
            $.each(dateArr,function(key,value){
                chartDataPre.xAxis.push(value);
                chartDataPre.date.push(value);
                chartDataPre.data.push(0);
            });
            if(data.feedback_date_distri){
                for(var i=0;i<data.feedback_date_distri.length;i++){
                    var key = $.inArray(data.feedback_date_distri[i].data_date,chartDataPre.date);
                    if(key > -1){
                        chartDataPre.data[key] = data.feedback_date_distri[i].post_num;
                    }
                }
            }
            chartData.tooltip = {trigger:'axis'};
            chartData.legend = {};
            chartData.grid = {
                left: '5%',
                right: '5%',
                bottom: '2%',
                top: '3%',
                containLabel: true
            }
            chartData.xAxis = [
                {
                    splitLine : {
                        show:false
                    },
                    type : 'category',
                    boundaryGap : false,
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
                        show:false
                    },
                    name : '反馈数',
                    type : 'value',
                    nameLocation : 'middle',
                    nameTextStyle : {
                        color:'#C2C2C2',
                        fontSize : '11px'
                    },
                    nameGap:25,
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
            ],
            chartData.series = [
                {
                    lineStyle:{
                        normal:{
                            color:lineColor,
                            width:1
                        }
                    },
                    showSymbol:false,
                    name:'帖子数',
                    type:'line',
                    data:chartDataPre.data
                }
            ];
            getEChart('line','lt_wtzs'+index,chartData);
            if(data.feedback_tag_distri){
                F_Insight._buff.feedback_tag_distri[index] = data.feedback_tag_distri;
                var chartDataPre2 = {legend:[],data:[]};
                var chartData2 = {};
                for(var i =0;i<data.feedback_tag_distri.length;i++){
                    if(i < 5){
                        var number = (data.feedback_tag_distri[i].tag_rate*100).toFixed(2);
                        var word = data.feedback_tag_distri[i].show_tag+' '+number+'%';
                        chartDataPre2.legend.push(word);
                        chartDataPre2.data.push(
                            {
                                value:number,
                                name:word,
                                itemStyle:{
                                    normal:{
                                        color:color[i]
                                    }
                                }
                            }
                        );
                    }
                }
                chartData2.tooltip = {trigger:'item',formatter:'{b}'};
                chartData2.legend = {
                    show:false,
                    top:'10%',
                    itemGap:6,
                    itemWidth:12,
                    itemHeight:12,
                    orient: 'vertical',
                    left :'right',
                    align:'left',
                    selectedMode:false,
                    data:chartDataPre2.legend,
                    textStyle:{
                        fontSize:12
                    }
                };
                chartData2.grid = {
                    left: '5%',
                    right: '5%',
                    bottom: '2%',
                    top: '3%',
                    containLabel: true
                }
                chartData2.xAxis = [];
                chartData2.yAxis = [],
                chartData2.series = [
                    {
                        type:'pie',
                        hoverAnimation:false,
                        radius: ['30%', '90%'],
                        center: ['30%', '50%'],
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
                        data:chartDataPre2.data
                    }
                ];
                getEChart('line','lt_wtfb'+index,chartData2);
                $('#lt_wtfb'+index).append(F_Insight._htmlChartLegend(chartDataPre2.legend,index));
            }
        },function(data,msg,code){
            $('#lt_wtfb'+index).html(G_Pre._empty(msg));
            $('#lt_wtzs'+index).html(G_Pre._empty(msg));
        });
    },
    _htmlChartLegend:function(data,index){
        var str = '';
        var color = [];
        switch(index){
            case 0:
                color = F_Insight._chartColor.red;
                break;
            case 1:
                color = F_Insight._chartColor.green;
                break;
            case 2:
                color = F_Insight._chartColor.blue;
                break;
        }
        str += '<div class="lt_legend"><ul>';
        for(var i=0;i<data.length;i++){
            str += '<li onclick="F_Pop._detail(\'insight-bar\',{keywords:\''+data[i]+'\'});"><i style="background-color: '+color[i]+'"></i> '+data[i]+'</li>';
        }
        str += '</ul></div>';
        return str;
    },
    _htmlBase:function(type,data){
        var str = '';
        switch(type){
            case 'curve':
                var days = G_Date._dateDiffDays(F_Insight._getDateBegin(),F_Insight._getDateEnd());
                (days && (data.total_num/days).toFixed(0) < 4) ? $('.bs_less_notice').html('玩家反馈量较少，建议在数据中心查看详细帖子') : $('.bs_less_notice').html('');
                str = '<p>在有情感倾向帖子中，负面反馈<b class="c_colorR">'+data.negative_num+'</b>份，正面反馈<b class="c_colorGS">'+data.positive_num+'</b>份。</p>\
                <div class="lt_fkqy" id="lt_fkqy"></div>';
                break;
            case 'percent':
                var people = '';
                for(var i=1;i<=data.red;i++){
                    people += '<i class="lt_fmPRed c_img"></i>';
                }
                for(var i=1;i<=data.blue;i++){
                    people += '<i class="lt_fmPBlue c_img"></i>';
                }
                for(var i=1;i<=data.green;i++){
                    people += '<i class="lt_fmPGreen c_img"></i>';
                }
                str = '\
                <div class="lt_fmPercent c_floatLeft">\
                    <p><i class="lt_fmRed c_img"></i>负面反馈<br>'+data.negative_rate+'%</p>\
                    <p><i class="lt_fmBlue c_img"></i>中性反馈<br>'+data.other_rate+'%</p>\
                    <p><i class="lt_fmGreen c_img"></i>正面反馈<br>'+data.positive_rate+'%</p>\
                </div>\
                <div class="lt_fmPeople c_floatLeft">'+people+'</div>\
                <div class="clearfix"></div>';
                break;
            case 'word':
                var positiveStr = '<ul class="c_none">';
                var negativeStr = '<ul>';
                var otherStr = '<ul class="c_none">';
                $.each(data,function(key,wordArr){
                    switch(key){
                        case 'positive':
                            var i = 1;
                            var percentDiff = 1;
                            var wordOtherLength = 100;
                            var wordTotal = data.positive_hasOther ? 11:12;
                            $.each(wordArr,function(word,value){
                                if(i < wordTotal){
                                    var percent = ((value/data.positive_total)*100).toFixed(1);
                                    positiveStr+= '<li data-w="'+word+'"';
                                    if(i == 1){
                                        positiveStr+= ' class="liOn"';
                                        percentDiff = Math.floor(100/percent);
                                        percent = 100;
                                    }else{
                                        percent = (percent*percentDiff).toFixed(1);
                                    }
                                    wordOtherLength = (percent-0.2);

                                    positiveStr+= '><span>'+i+'</span>'+word+'<div class="lt_fmTsLine"><div class="lt_fmTsLnMask lt_fmTsLnMaskColor2';
                                    if(i == 1)positiveStr+= ' lt_fmTsLnOn2';
                                    positiveStr+= '" style="width: '+percent+'%"></div></div></li>';
                                }
                                i++;
                            });
                            if(data.positive_hasOther){
                                if(wordOtherLength < 0)wordOtherLength = 0;
                                positiveStr += '<li data-w="其它"';
                                if(data.positive_otherOnly)positiveStr += ' class="liOn"';
                                positiveStr += '><span></span>其它<div class="lt_fmTsLine"><div class="lt_fmTsLnMask lt_fmTsLnMaskColor2" style="width: '+wordOtherLength+'%"></div></div></li>';
                            }
                            break;
                        case 'negative':
                            negativeStr += F_Insight._htmlNegative(data,wordArr);
;                           break;
                        case 'other':
                            var i = 1;
                            var percentDiff = 1;
                            var wordOther = '';
                            $.each(wordArr,function(word,value){
                                if(i < 12){
                                    var percent = ((value/data.other_total)*100).toFixed(1);
                                    otherStr+= '<li data-w="'+word+'"';
                                    if(i == 1){
                                        otherStr+= ' class="liOn"';
                                        percentDiff = Math.ceil(100/percent);
                                        percent = 100;
                                    }else{
                                        percent = (percent*percentDiff).toFixed(1);
                                    }
                                    otherStr+= '><span>'+i+'</span>'+word+'<div class="lt_fmTsLine"><div class="lt_fmTsLnMask lt_fmTsLnMaskColor3';
                                    if(i == 1)otherStr+= ' lt_fmTsLnOn3';
                                    otherStr+= '" style="width: '+percent+'%"></div></div></li>';
                                }
                                i++;
                            });
                            break;
                    }
                })
                positiveStr += '</ul>';
                negativeStr += '</ul>';
                otherStr += '</ul>';
                str = '\
                    <div class="lt_fmTsTab">\
                        <ul>\
                            <li class="liOn" data-c="-1">负面反馈</li>\
                            <li data-c="1">正面反馈</li>\
                            <li data-c="0">中性反馈</li>\
                        </ul>\
                        <div class="t_slider"></div>\
                    </div>\
                    <div class="lt_fmTsMdArea c_border"><div class="lt_fmTsMdArrow c_img"></div>'+negativeStr+positiveStr+otherStr+'</div>';
                break;
        }
        return str;
    },
    _htmlNegative:function(data,wordArr){
        var str = '';
        var i = 1;
        var percentDiff = 1;
        var wordOtherLength = 100;
        var wordTotal = data.negative_hasOther ? 11:12;
        if(data.negative_init && data.negative_hasPrivate && data.negative_hasCommon){
            str+= '<div class="lt_fmTsChoose"><label>选择类型：</label>';
            if(data.negative_hasPrivate){
                str+= '　<input data-w="game" type="checkbox" checked>　产品专类';
            }
            if(data.negative_hasCommon){
                str+= '　<input data-w="common" type="checkbox" checked>　通用类型';
            }
            str+= '</div>';
        }
        if(data.negative_hasPrivate && data.negative_hasCommon)wordTotal -= 1;
        $.each(wordArr,function(word,value){
            if(i < wordTotal){
                var percent = ((value/data.negative_total)*100).toFixed(1);
                str+= '<li data-w="'+word+'"';
                if(i == 1){
                    str += ' class="liOn"';
                    percentDiff = Math.ceil(100/percent);
                    percent = 100;
                }else{
                    percent = (percent*percentDiff).toFixed(1);
                }
                wordOtherLength = (percent-0.1);
                str+= '><span>'+i+'</span>'+word+'<div class="lt_fmTsLine"><div class="lt_fmTsLnMask lt_fmTsLnMaskColor';
                if(i == 1)str+= ' lt_fmTsLnOn';
                str+= '" style="width: '+percent+'%"></div></div></li>';
            }
            i++;
        });
        if(data.negative_hasOther){
            if(wordOtherLength < 0)wordOtherLength = 0;
            str += '<li data-w="其它"';
            if(data.negative_otherOnly)str += ' class="liOn"';
            str += '><span></span>其它<div class="lt_fmTsLine"><div class="lt_fmTsLnMask lt_fmTsLnMaskColor" style="width: '+wordOtherLength+'%"></div></div></li>';
        }
        return str;
    },
    _activePercent:function(dom,from,current){
        switch(from){
            case 'percent':
                dom.each(function(index){
                    $(this).click(function(){
                        var current = 0;
                        var top = index*70+320;
                        $('.lt_fmTsMdArrow').css('top',top+'px');
                        switch(index){
                            case 0:
                                current = 0;
                                break;
                            case 1:
                                current = 2;
                                break;
                            case 2:
                                current = 1;
                                break;
                        }
                        tabChoose($('.lt_fmTsTab ul li'),$('.t_slider'),100,5,'liOn','percent',current,$('.lt_fmTsMdArea ul'),$('.bs_lt_fm_r'));
                    })
                });
                break;
            case 'tab':
                var top = current*70+320;
                $('.lt_fmTsMdArrow').css('top',top+'px');
                break;
            case 'people':
                dom.each(function(index){
                    $(this).click(function(){
                        var current = 0;
                        var index = 0;
                        if($(this).hasClass('lt_fmPRed')){
                            current = 0;
                            index = 0;
                        }else if($(this).hasClass('lt_fmPBlue')){
                            current = 2;
                            index = 1;
                        }else{
                            current = 1;
                            index = 2;
                        }
                        var top = index*70+320;
                        $('.lt_fmTsMdArrow').css('top',top+'px');
                        tabChoose($('.lt_fmTsTab ul li'),$('.t_slider'),100,5,'liOn','percent',current,$('.lt_fmTsMdArea ul'),$('.bs_lt_fm_r'));
                    })
                })
                break;
        }
    }
}
var F_Info = {
    _getRadar:function(){
        G_Port._ajax('radar','get',true,'project_id='+G_GameId,function(){
                $('#bs_rander').html(G_Pre._loading());
            },function(){
                $('#bs_rander').html('');
            },function(data,msg){
                if(data){
                    var radarConfig = {'正向反馈占比':'negative_weight','讨论热度':'post_weight','舆论稳定度':'stable_weight','有效反馈占比':'useless_weight','活跃人数':'user_weight','畅销排名':'appstore_weight'};
                    var chartDataPre = {indicator:[],avgData:[],curData:[]};
                    $.each(radarConfig,function(key,value){
                        if(key == '畅销排名'){
                            if(data.avg[value]){
                                chartDataPre.indicator.push({text: key, max: 100});
                                data.avg[value] ? chartDataPre.avgData.push((data.avg[value]*100).toFixed(0)) : chartDataPre.avgData.push(0);
                                data.real[value] ? chartDataPre.curData.push((data.real[value]*100).toFixed(0)) : chartDataPre.curData.push(0);
                            }
                        }else{
                            chartDataPre.indicator.push({text: key, max: 100});
                            data.avg[value] ? chartDataPre.avgData.push((data.avg[value]*100).toFixed(0)) : chartDataPre.avgData.push(0);
                            data.real[value] ? chartDataPre.curData.push((data.real[value]*100).toFixed(0)) : chartDataPre.curData.push(0);
                        }
                    });
                    F_Info._chartRadar(chartDataPre);
                }else{
                    $('#bs_rander').html('<div class="c_empty">暂无数据</div>');
                }
            },function(data,msg,code){
                $('#bs_rander').html(G_Pre._empty(msg));
            })
    },
    _chartRadar:function(chartDataPre){
        var chartData = {};
        chartData.color = ['#72C4FF','#AEDD8C'];
        chartData.tooltip = {trigger:'axis'};
        chartData.legend = null;
        chartData.radar = [
            {
                indicator: chartDataPre.indicator,
                shape: 'circle',
                radius: 75,
                splitArea: {
                    areaStyle: {
                        color: ['#ffffff','#ffffff']
                    }
                },
                splitNumber: 2
            }
        ];
        chartData.series = [
            {
                type: 'radar',
                tooltip: null,
                data: [
                    {
                        value: chartDataPre.avgData,
                        name: '平均值(%)',
                        symbolSize: 0,
                        areaStyle: {
                            normal: {
                                color: '#D0EEF9'
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 2,
                                color:'#D0EEF9'
                            }
                        }
                    },
                    {
                        value: chartDataPre.curData,
                        name: '游戏值(%)',
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
                    }
                ]
            }
        ];
        getEChart('radar','bs_rander',chartData);
    },
    _getGame:function(){
        G_Port._ajax('gameInfo','get',true,'project_id='+G_GameId,function(){
            $('.lt_info').html(G_Pre._loading());
        },function(){
            $('.lt_info').html('');
        },function(data,msg){
            var logo = G_Game._imgUrl(G_GameId);
            var name = G_Game._name(G_GameId);
            var tags = G_Game._tag(data.tag_list);
            var tag = '';
            if(tags){
                $.each(tags,function(key,value){
                    tag += '<button onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('search')+'?k='+encodeURIComponent(value)+'\')">'+value+'</button> ';
                });
            }
            var type = G_Game._type(data.game_type);
            $('.data-center-quicker').attr('data-i',G_GameId);
            //只有手游才显示
            if(data.game_type.indexOf('S') > -1){
                //记录弹出层里的游戏类型
                $('.data-center-quicker').attr('data-t','1');
                dataChoose._section({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},4,dateBegin,dateEnd,function(begin,end){
                    if(begin !=date4Begin || date4End != end){
                        date4Begin = begin;
                        date4End = end;
                        F_Channel._getChart();
                    }
                });
                dataChoose._section({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},5,dateBegin,dateEnd,function(begin,end){
                    if(begin !=date5Begin || date5End != end){
                        date5Begin = begin;
                        date5End = end;
                        F_Word._getData();
                    }
                });
                F_Rank._init();
            }else{
                $('.bs_apps').each(function(){
                    $(this).hide();
                });
            }
            var competings = G_Game._getGame(data.competing_list,8);
            var competing = '';
            if(competings){
                for(var i=0;i<data.competing_list.length;i++){
                    if(i >= 8)break;
                    if(competings[data.competing_list[i]]){
                        var key = data.competing_list[i];
                        var value = competings[data.competing_list[i]];
                        var collectClass = 'lt_gmCtOff';
                        if(G_Game._checkCollect(parseInt(key)))collectClass = 'lt_gmCtOn';
                        var gameName = (value[1].length > 4) ? value[1].substr(0,4)+'.' : value[1];
                        competing += '<li>\
                                <div class="lt_mask"><img src="'+value[0]+'"></div>\
                                <div class="lt_shade">\
                                    <div id="lt_gmCollect'+key+'" onclick="G_Game._setCollect('+key+',\'lt_gmCollect'+key+'\',\'lt_gmCt\')" class="lt_gmCollect c_img '+collectClass+'"></div>\
                                    <a onclick="G_Jump._url(\'light\','+key+')">查看游戏灯塔></a>\
                                    <a onclick="G_Jump._url(\'atlas\','+key+')">查看游戏图谱></a>\
                                </div>\
                                <span title="'+value[1]+'">'+gameName+'</span>\
                            </li>';
                    }
                }
            }
            var rankStr = F_Info._htmlRank(type,data.hot_rank,data.hot_rank_yesterday);
            var infoStr = F_Info._htmlGame(logo,name,tag,type,data.author,data.distributor,data.release_date,data.overview,competing,rankStr);

            $('.lt_info').html(infoStr);
            maskShow($('.lt_game ul li'),$('.lt_mask'),'lt_maskOn',$('.lt_game .lt_shade'));

            var url = G_Jump._getUrl('article');
            url += '?t=game&g='+G_GameId+'&n='+encodeURIComponent(name);
            $('.lt_tlMore a').attr({'href':url,'target':'_blank'});
        },function(data,msg,code){
            $('.lt_info').html(G_Pre._empty(msg));
        });
    },
    _getArticle:function(){
        G_Port._ajax('articleList','get',true,'index=0&limit=5&project_id='+G_GameId,function(){
            $('.bj_article_limit').html(G_Pre._loading());
        },function(){
            $('.bj_article_limit').html('');
        },function(data,msg){
            if(data && data.data.total > 0){
                var articleStr = '';
                $.each(data.data.list,function(key,value){
                    if(!!value.source.title){
                        //var articleTitle = (value.source.title.length > 18) ? value.source.title.substr(0,18)+'..' : value.source.title;
                        var articleTitle = value.source.title;
                        articleStr += '<li title="'+value.source.title+'"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(value.id)+'" target="_blank">'+(value.source.post_date)+'　'+articleTitle+'</a></li>';
                    }
                });
                $('.bj_article_limit').html(articleStr);
            }else{
                $('.bj_article_limit').html('<div class="c_empty">暂无数据</div>');
            }
        },function(data,msg,code){
            $('.bj_article_limit').html(G_Pre._empty(msg));
        });
    },
    _htmlGame:function(logo,name,tag,type,author,distributor,date,overview,competing,rank){
        var collectClass = 'lt_ctOff';
        if(G_Game._checkCollect(G_GameId))collectClass = 'lt_ctOn';
        var developer = [];
        var publisher = [];
        author = author.split('、');
        for(var i=0;i<author.length;i++){
            developer.push('<a href="'+G_Jump._getUrl('search')+'?k='+encodeURIComponent(author[i])+'">'+author[i]+'</a>');
        }
        developer = developer.join('、');
        distributor = distributor.split('、');
        for(var i=0;i<distributor.length;i++){
            publisher.push('<a href="'+G_Jump._getUrl('search')+'?k='+encodeURIComponent(distributor[i])+'">'+distributor[i]+'</a>');
        }
        publisher = publisher.join('、');
        var str = '\
            <div class="lt_fmNotice" id="Position1">\
            <i class="glyphicon glyphicon-remove" onclick="tips(1)"></i>该模块主要包括游戏基本的信息介绍，如开发商及发行商详情、游戏类别、游戏标签、游戏简介、游戏竞品等。您可点击右上角的星号标签，收藏该款游戏。<br>舆论热度排名：ThinkingGame平台通过数据挖掘技术获取玩家在全网21个游戏论坛和11个分发渠道的讨论和评论，根据舆情指数、玩家活跃度等综合因素统计而得到该游戏在同平台的舆论热度的排名。\
            </div>\
            <div class="lt_collect c_img '+collectClass+'" id="bs_collect_m" onclick="G_Game._setCollect('+G_GameId+',\'bs_collect_m\',\'lt_ct\')"></div>\
            <div class="c_padding30">\
                <div class="lt_gameInfo c_floatLeft">\
                <img src="'+logo+'">\
                </div>\
                <dl class="c_floatLeft">\
                    <dt><h1 class="c_floatLeft">'+name+'</h1>　 <i class="glyphicon glyphicon-question-sign c_floatLeft title-tip2" onclick="tips(1)"></i>　<a onclick="G_Jump._url(\'atlas\','+G_GameId+')" class="c_floatLeft">查看游戏图谱></a></dt>\
                    <div class="clearfix"></div>\
                    <dd><span>开发商：</span>'+developer+'</dd>\
                    <dd><span>发行商：</span>'+publisher+'</dd>\
                    <dd><span>游戏类型：</span>'+type+'</dd>\
                    <dd><span>发行日期：</span>'+date+'</dd>\
                    <dd><span>常用标签：</span>'+tag+'</dd>\
                </dl>'+rank+'\
                <div class="clearfix"></div>\
                <div class="lt_title c_marginTB10">\
                    <h2>游戏简介</h2>\
                </div>\
                <div class="lt_content c_hidden">'+overview+'</div>\
                <div class="lt_title c_marginTB10">\
                    <h2>相关游戏</h2>\
                </div>\
                <div class="lt_game">\
                    <ul>'+competing+'</ul>\
                 </div>\
            </div>';
        return str;
    },
    _htmlRank:function(type,todayRank,yesterdayRank){
        type = type.split(',');
        type = type[0];
        var diff = '→持平';
        var useClass = 'lt_rankDown';
        if(todayRank < yesterdayRank){
            diff = '↑'+(yesterdayRank-todayRank)+'名';
            var useClass = 'lt_rankUp';
        }else if(todayRank > yesterdayRank){
            diff = '↓'+(todayRank-yesterdayRank)+'名';
        }
        var str = '\
            <div class="lt_rank" >\
                <div class="c_borderL c_paddingLR20 c_relative" style="padding-bottom: 8px">\
                    <div class="lt_rank_title">'+type+'类舆论热度排名</div>\
                    第 <b>'+todayRank+'</b> 名\
                    <p><span class="'+useClass+'">较前日'+diff+'</span></p>\
                </div>\
            </div>';

        $('.bs_radar_title h2').html(type+'类游戏舆情雷达');
        return str;
    }
}

function showMore(){
    $('.lt_fmQdTab ul li .lt_fmQdMore').each(function(){
        $(this).click(function(){
            if($(this).find('i').hasClass('glyphicon-chevron-down')){
                $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                $(this).parent('li').find('p').each(function(index){
                    switch(index){
                        case 3:
                        case 4:
                            $(this).fadeIn("slow")
                            break;
                    }
                });
            }else{
                $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                $(this).parent('li').find('p').each(function(index){
                    switch(index){
                        case 3:
                        case 4:
                            $(this).fadeOut("slow")
                            break;
                    }
                });
            }
        })
    });
}

var F_Pop = {
    _frame:function(domLayer,domFrame,url,refresh){
        var browser = G_Common._browser();
        var isIE = (browser.name == 'MSIE' && browser.version < 10) ? true : false;
        if(domFrame.hasClass('iframe-more-date-hide')){
            $('#lightQuicker span').eq(0).html('返回游戏灯塔');
            $('body').css('overflow','hidden');
            if(refresh){
                domFrame.attr('src',url);
            }else{
                var src = domFrame.attr('src');
                if(!src)domFrame.attr('src',url);
            }
            domLayer.show();
            isIE ? domFrame.removeClass('iframe-more-date-hide').addClass('iframe-more-date-ie') : domFrame.removeClass('iframe-more-date-hide').addClass('iframe-more-date');
        }else{
            $('#lightQuicker span').eq(0).html('查看数据中心');
            $('body').css('overflow','');
            isIE ? domFrame.removeClass('iframe-more-date-ie', 'iframe-more-date').addClass('iframe-more-date-hide') : domFrame.removeClass('iframe-more-date').addClass('iframe-more-date-hide');
        }
    },
    _dataCenter:function(){
        $('#lightQuicker').on('click',function(isApp){
            F_Pop._frame($('#iframeDataCenter'),$('#iframeDataCenter iframe'),G_Jump._getUrl('data')+'?g='+$(this).attr('data-i')+'&t='+$(this).attr('data-t'),false);
            $('#lightQuicker .arrow').toggleClass('arrow-op');
        });
    },
    _detail:function(type,data){
        switch(type){
            case 'insight-back':
                var classify = 0;
                var date = data.date;
                switch(data.type){
                    case '正面':
                        classify = 1;
                        break;
                    case '负面':
                        classify = -1;
                        break;
                }
                var url = G_Jump._getUrl('data')+'?f=search&t=insightBack&g='+G_GameId+'&c='+classify+'&b='+date+'&e='+date;
                F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                break;
            case 'insight-line':
                var base = F_Pop._getInsightKeyword();
                if(base.keywords == ''){
                    G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                }else{
                    var url = G_Jump._getUrl('data')+'?f=search&t=insight&g='+G_GameId+'&c='+base.classify+'&b='+data.date+'&e='+data.date+'&w='+encodeURIComponent(base.keywords);
                    F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                }
                break;
            case 'insight-bar':
                var date = F_Pop._getDate(1);
                var word = data.keywords;
                var base = F_Pop._getInsightKeyword();
                var tags = '';
                var index = F_Pop._getInsightTab();
                if(word != '' && F_Insight._buff.feedback_tag_distri[index]){
                    word = word.split(' ');
                    word = word[0];
                    var buff = F_Insight._buff.feedback_tag_distri[index];

                    for(var i =0;i<buff.length;i++){
                        if(word == buff[i].show_tag){
                            tags = buff[i].real_tag;
                            break;
                        }
                    }
                    if(base.keywords == '' || tags == ''){
                        G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                    }else{
                        var url = G_Jump._getUrl('data')+'?f=search&t=insight&g='+G_GameId+'&c='+base.classify+'&b='+date.begin+'&e='+date.end+'&w='+encodeURIComponent(base.keywords)+'&r='+encodeURIComponent(tags)+'&forum='+encodeURIComponent(word);
                        F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                    }
                }
                break;
            case 'hotWord':
                var date = data.date;
                var keywords = data.keywords;
                if(keywords == '' || date == ''){
                    G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                }else{
                    var url = G_Jump._getUrl('data')+'?f=search&t=hotWord&g='+G_GameId+'&b='+date+'&e='+date+'&w='+encodeURIComponent(keywords);
                    F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                }
                break;
            case 'title':
                var date = data.date;
                var classify = data.classify;
                if(!(classify == '' || date == '') && F_Forum._buffData.title){
                    var base = F_Forum._buffData.title;
                    var info_list_id = '';
                    for(var i=0;i<base.length;i++){
                        if(base[i].forum_name == classify){
                            info_list_id = base[i].info_id;
                            break;
                        }
                    }
                    if(info_list_id != ''){
                       var url = G_Jump._getUrl('data')+'?f=search&t=title&g='+G_GameId+'&b='+date+'&e='+date+'&c='+info_list_id+'&forum='+encodeURIComponent(classify);
                        F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                    }else{
                        G_Pop._init('msg',{content:'需要查询的数据源不存在,请确认！'});
                    }
                }else{
                    G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                }
                break;
            case 'emotion':
                var date = data.date;
                var classify = data.classify;
                if(classify == '' || date == ''){
                    G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                }else{
                    var url = G_Jump._getUrl('data')+'?f=search&t=emotion&g='+G_GameId+'&b='+date+'&e='+date+'&c='+classify;
                    F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                }
                break;
            case 'useless':
                if(data.keywords != '' && data.type != '' && F_Forum._buffData.useless){
                    var classify = '';
                    var date = F_Pop._getDate(3);
                    var base = F_Forum._buffData.useless;
                    for(var i= 0;i<base.length;i++){
                        if(data.type == base[i].show_forum_name){
                            classify = base[i].info_id_list;
                            break;
                        }
                    }
                    if(classify == ''){
                        G_Pop._init('msg',{content:'需要查询的类型为空,请确认！'});
                    }else{
                        var url = G_Jump._getUrl('data')+'?f=search&t=useless&g='+G_GameId+'&b='+date.begin+'&e='+date.end+'&c='+classify+'&w='+encodeURIComponent(data.keywords);
                        F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                    }
                }else{
                    G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                }
                break;
            case 'keywords':
                var date = F_Pop._getDate(3);
                var keywords = data.keywords;
                if(keywords == ''){
                    G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                }else{
                    var url = G_Jump._getUrl('data')+'?f=search&t=keywords&g='+G_GameId+'&b='+date.begin+'&e='+date.end+'&w='+encodeURIComponent(keywords);
                    F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                }
                break;
            case 'topic':
                $('.lt_ltfxRect div').each(function(){
                    $(this).click(function(){
                        var date = F_Pop._getDate(3);
                        var keywords = $(this).attr('data-w');
                        if(keywords == ''){
                            G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                        }else{
                            var url = G_Jump._getUrl('data')+'?f=search&t=topic&g='+G_GameId+'&b='+date.begin+'&e='+date.end+'&w='+encodeURIComponent(keywords);
                            F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                        }
                    });
                });
                break;
            case 'appWord':
                $('.lt_fmPlWord a').each(function(){
                    $(this).click(function(){
                        var begin = '';
                        var end = '';
                        if(F_Word._buff.currentDay){
                            begin = end = F_Word._buff.currentDay;
                        }else{
                            var date = F_Pop._getDate(5);
                            begin = date.begin;
                            end = date.end;
                        }
                        var keywords = $(this).html();
                        if(keywords == ''){
                            G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                        }else{
                            var url = G_Jump._getUrl('data')+'?f=search&t=appWord&g='+G_GameId+'&b='+begin+'&e='+end+'&w='+encodeURIComponent(keywords+'/'+$(this).attr('data-t'));
                            F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                        }
                    });
                });
                break
            case 'channel':
                var source_type_list = data.zone.replace('bs_yxqd_','');
                var ratingName = data.type;
                if(F_Channel._buff.channel_rating_distri && source_type_list && ratingName){
                    var base = F_Channel._buff.channel_rating_distri;
                    var es_field_name = '';
                    var es_field_val = '';
                    for(var i=0;i<base.length;i++){
                        if(base[i].source_type == source_type_list && base[i].rating_name == ratingName){
                            es_field_name = base[i].es_field_name;
                            es_field_val = base[i].es_field_val;
                            break;
                        }
                    }
                    if(es_field_name != '' && es_field_val != ''){
                        var date = F_Pop._getDate(4);
                        var url = G_Jump._getUrl('data')+'?f=search&t=channel&g='+G_GameId+'&b='+date.begin+'&e='+date.end+'&c='+source_type_list+'&r='+es_field_name+'&w='+encodeURIComponent(es_field_val)+'&forum='+encodeURIComponent(ratingName);
                        F_Pop._frame($('#iframeDataMore'),$('#iframeDataMore iframe'),url,true);
                    }
                }else{
                    G_Pop._init('msg',{content:'需要查询的关键词为空,请确认！'});
                }
                break;
        }
    },
    _getDate:function(dom){
        var begin = $('#db'+dom).val();
        var end = $('#de'+dom).val();
        return {begin:begin,end:end};
    },
    _getInsightKeyword:function(){
        var back = {keywords:'',classify:''};
        $('.lt_fmTsTab ul li').each(function(index){
            if($(this).hasClass('liOn')){
                switch(index){
                    case 0:
                        back.classify = -1;
                        break;
                    case 1:
                        back.classify = 1;
                        break;
                    case 2:
                        back.classify = 0;
                        break;
                }
                $('.lt_fmTsMdArea ul').eq(index).find('li').each(function(){
                    if($(this).hasClass('liOn')){
                        back.keywords = $(this).attr('data-w');
                    }
                });
            }
        });
        return back;
    },
    _getInsightTab:function(){
        var current = '';
        $('.lt_fmTsTab ul li').each(function(index){
            if($(this).hasClass('liOn')){
                current = index;
            }
        });
        return current;
    }
}