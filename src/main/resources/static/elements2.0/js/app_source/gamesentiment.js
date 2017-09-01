var F_GameSentiment_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-2');
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
            M_Game._checkGameVisitList('gameSentiment');
            //M_Game._getGame();
            //F_GameSentiment_Info._domInit();
            //M_Outside._searchPop();
        }
    }
}
var F_GameSentiment_Info = {
    _chartClick:function (type,value) {
        var data = {};
        data.gameId = M_Init._gameDetailId;
        switch(type){
            case 'bs_word_tendency':
            case 'bs_word_distribute':
                switch(M_Init._dateCache['tendencyType']){
                    case 'tendencyNeutral':
                        data.classifySentiment = 2;
                        break;
                    case 'tendencyPos':
                        data.classifySentiment = 1;
                        break;
                    default:
                        data.classifySentiment = -1;
                        break;
                }
                data.lighttowerClassify = M_Init._dateCache['tendencyWord'];
                break;
        }
        switch(type){
            case 'bs_word_tendency':
                data.dateBegin = value.date;
                data.dateEnd = value.date;
                break;
            case 'bs_word_distribute':
                data.dateBegin = M_Init._dateCache.begin;
                data.dateEnd = M_Init._dateCache.end;
                if(M_Init._dateCache['feedback_tag_distri']){
                    var dataUnion = M_Init._dateCache['feedback_tag_distri'];
                    for(var i=0;i<dataUnion.length;i++){
                        if(dataUnion[i].show_tag == value.type){
                            data.realTag =dataUnion[i].real_tag;
                            break;
                        }
                    }
                }
                break;
            case 'bs_rank_detail_chart':
                data.dateBegin = value.date;
                data.dateEnd = value.date;
                data.keywords = M_Init._dateCache['rankWordCurrent'];
                break;
        }
        M_Outside._redirectForum(data);
    },
    _domInit:function () {
        var str = '';
        str += '<div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12  ">';
        str += '<h3>玩家反馈分析</h3>';
        str += '<div class="boxshadow  player-response">';
        str += '<div class="tg-selected-drop tg-date-fl"><span>日期</span>';
        str += '<p class="tg-drop-text-part">';
        str += '<i class="tg-graph tg-triangle-gray-bottom"></i>';
        str += '<span class="hot-area" id="dc1"></span>';
        str += '<input id="db1" type="hidden" value="">';
        str += '<input id="de1" type="hidden" value="">';
        str += '</div>';
        str += '<div class="wrap" id="bs_tendency">';
        str += '</div></div></div>';

        str += '<div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12  ">';
        str += '<h3>热词排行榜</h3>';
        str += '<div class="boxshadow  player-response  hotword-rank">';
        str += '<div class="tg-selected-drop tg-date-fl"><span>日期</span>';
        str += '<p class="tg-drop-text-part">';
        str += '<i class="tg-graph tg-triangle-gray-bottom"></i>';
        str += '<span class="hot-area" id="dc2"></span>';
        str += '<input id="db2" type="hidden" value="">';
        str += '<input id="de2" type="hidden" value="">';
        str += '</div>';
        str += '<div class="wrap" id="bs_rank">';
        str += '</div></div></div>';

        str += '<div class="blockpart tg-table-layout col-lg-12 col-md-12 col-sm-12 col-xs-12  ">';
        str += '<h3>玩家话题排行榜</h3>';
        str += '<div class="boxshadow tg-table-content " id="playerTalkRank">';
        str += '<div class="tg-selected-drop tg-date-fl"><span>日期</span>';
        str += '<p class="tg-drop-text-part">';
        str += '<i class="tg-graph tg-triangle-gray-bottom"></i>';
        str += '<span class="hot-area" id="dc3"></span>';
        str += '<input id="db3" type="hidden" value="">';
        str += '<input id="de3" type="hidden" value="">';
        str += '</div>';
        str += '<div class="tg-table-wrap tg-height-hight">';
        str += '<div class="table-out-wrap" id="bs_topic_table"></div><ul class="tg-page-list" id="lt_forum_page"></ul>';
        str += '</div></div></div>';

        $('#ct_main_area').html(str);

        B_Date._chooseSection({'autoCommit':true,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                M_Init._dateCache.begin = begin;
                M_Init._dateCache.end = end;
                F_GameSentiment_Info._getTendency();
            }
        });
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},2,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin2 || M_Init._dateCache.end2 != end){
                M_Init._dateCache.begin2 = begin;
                M_Init._dateCache.end2 = end;
                F_GameSentiment_Info._getRank();
            }
        });
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},3,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin3 || M_Init._dateCache.end3 != end){
                M_Init._dateCache.begin3 = begin;
                M_Init._dateCache.end3 = end;
                F_GameSentiment_Info._getTopic(1);
            }
        });
    },
    _htmlTendencyChart:function (word) {
        var str = '';
        str += '<div>';
        str += '<p>"'+word+'"反馈走势</p>';
        str += '<div class="graph-part" id="bs_word_tendency"></div>';
        str += '</div>';
        str += '<div>';
        str += '<p>"'+word+'"反馈分布</p>';
        str += '<div class="graph-part" id="bs_word_distribute"></div>';
        str += '</div>';
        return str;
    },
    _htmlTendency:function (data) {
        var str = '';
        str += '<div class="fl" id="bs_tendency_word">';
        str += '<ul class="vertical-tab-change">';
        str += '<li class="selected">';
        str += '<b class="color-a">'+data.neg+'%</b>';
        str += '<p>负面反馈占比</p>';
        str += M_Init._dateCache['tendencyType']=='tendencyNeg' ? '<i class="tg-icon triangle-shadow"></i>' : '';
        str += '</li>';
        str += '<li>';
        str += '<b class="color-b">'+data.pos+'%</b>';
        str += '<p>正面反馈占比</p>';
        str += M_Init._dateCache['tendencyType']=='tendencyPos' ? '<i class="tg-icon triangle-shadow"></i>' : '';
        str += '</li>';
        str += '<li>';
        str += '<b class="color-c">'+data.neutral+'%</b>';
        str += '<p>中性反馈占比</p>';
        str += M_Init._dateCache['tendencyType']=='tendencyNeutral' ? '<i class="tg-icon triangle-shadow"></i>' : '';
        str += '</li>';
        str += '</ul>';
        str += '<ul class="problem-list" id="bs_tendency_detail"></ul>'
        str += '</div>';
        str += '<div class="graph-wrap" id="bs_tendency_chart">';
        str += '</div>';
        return str;
    },
    _getTendency:function () {
        var dom = $('#bs_tendency');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackAnalyse','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.feedback_class_distri){
                    var tendency = {'neg':0,'pos':0,'neutral':0};
                    tendency.neg = data.negative_rate ? (data.negative_rate*100).toFixed(2) : '0';
                    tendency.pos = data.positive_rate ? (data.positive_rate*100).toFixed(2) : '0';
                    tendency.neutral = data.other_rate ? (data.other_rate*100).toFixed(2) : '0';
                    M_Init._dateCache['tendencyNeg'] = [];
                    M_Init._dateCache['tendencyPos'] = [];
                    M_Init._dateCache['tendencyNeutral'] = [];
                    $.each(data.feedback_class_distri,function (key,value) {
                        switch(key+''){
                            case '0':
                                M_Init._dateCache['tendencyNeutral'] = value;
                                break;
                            case '-1':
                                M_Init._dateCache['tendencyNeg'] = value;
                                break;
                            case '1':
                                M_Init._dateCache['tendencyPos'] = value;
                                break;
                        }
                    });
                    M_Init._dateCache['tendencyType'] = M_Init._dateCache['tendencyType'] ? M_Init._dateCache['tendencyType'] : 'tendencyNeg';
                    dom.html(F_GameSentiment_Info._htmlTendency(tendency));
                    F_GameSentiment_Info._formatTendencyWord();

                    F_GameSentiment_Info._doTendencyTabChange();
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _doTendencyWordChange:function () {
        $('#bs_tendency_detail li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    $(this).siblings('li').find('i').remove();
                    $(this).append('<i class="tg-icon triangle-shadow"></i>');
                    M_Init._dateCache['tendencyWord'] = $(this).find('span').html();
                    F_GameSentiment_Info._getTendencyChart();
                }
            })
        });
    },
    _doTendencyTabChange:function () {
        $('#bs_tendency_word ul li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    $(this).siblings('li').find('i').remove();
                    $(this).append('<i class="tg-icon triangle-shadow"></i>');
                    switch(index+''){
                        case '0':
                            M_Init._dateCache['tendencyType'] = 'tendencyNeg';
                            break;
                        case '1':
                            M_Init._dateCache['tendencyType'] = 'tendencyPos';
                            break;
                        case '2':
                            M_Init._dateCache['tendencyType'] = 'tendencyNeutral';
                            break;
                    }
                    F_GameSentiment_Info._formatTendencyWord();
                }
            });
        });
    },
    _formatTendencyWord:function () {
        var data = M_Init._dateCache[M_Init._dateCache['tendencyType']];
        var isHasOther = false;
        var str = '';
        if(data && data.length > 0){
            var number = 1;
            var total = 0;
            for(var i=0;i<data.length;i++){
                total += parseInt(data[i].post_num);
            }
            var percent = 0;
            var trendPercent = 0;
            var colorClass = 'rate';
            var negHasGameOnly = false;
            switch(M_Init._dateCache['tendencyType']){
                case 'tendencyNeg':
                    colorClass = 'rate';
                    var neg = {'common':[],'game':[]};
                    for(var i=0;i<data.length;i++){
                        neg[data[i].feedback_type].push(data[i]);
                    }
                    neg.common = data;
                    M_Init._dateCache['tendencyNegType'] = M_Init._dateCache['tendencyNegType'] ? M_Init._dateCache['tendencyNegType'] : 'common';
                    if(neg['game'].length > 0){
                        negHasGameOnly = true;
                        str += '<p>';
                        str += M_Init._dateCache['tendencyNegType'] == 'game' ? '<input type="checkbox" id="bs_common_game" checked />' : '<input type="checkbox" id="bs_common_game" />';
                        str += ' 仅看与产品相关</p>';
                    }
                    data = neg[M_Init._dateCache['tendencyNegType']];
                    break;
                case 'tendencyPos':
                    colorClass = 'rate green-rate';
                    break;
                case 'tendencyNeutral':
                    colorClass = 'rate blue-rate';
                    break;
            }
            for(var i=0;i<data.length;i++){
                if(data[i].lighttower_classify != '其它'){
                    percent = ((parseInt(data[i].post_num)/total)*100).toFixed(0);
                    if(number == 1){
                        M_Init._dateCache['tendencyWord'] = data[i].lighttower_classify;
                        trendPercent = (100/percent).toFixed(0);
                        percent = 100;
                        str += '<li class="selected">';
                    }else{
                        percent *= trendPercent;
                        str += '<li>';
                    }
                    str += '<b>'+number+'</b>';
                    str += '<span>'+data[i].lighttower_classify+'</span>';
                    str += '<div class="koubei-percent-wrap">';
                    str += '<div class="'+colorClass+'" style="width:'+percent+'%"></div>';
                    str += '</div>';
                    str += number == 1 ? '<i class="tg-icon triangle-shadow"></i>' : '';
                    str += '</li>';
                    number++;
                }else{
                    isHasOther = true;
                }
                if(isHasOther){
                    if(number >= 10)break;
                }else{
                    if(number >= 11)break;
                }
            }
            if(isHasOther){
                if(number == 1){
                    M_Init._dateCache['tendencyWord'] = '其它';
                    str += '<li class="selected">';
                }else{
                    str += '<li>';
                }
                str += '<b>'+number+'</b>';
                str += '<span>其它</span>';
                str += '<div class="koubei-percent-wrap">';
                str += '<div class="'+colorClass+'" style="width:'+percent+'%"></div>';
                str += '</div></li>';
            }
            str += '</div>';
        }
        if(str){
            $('#bs_tendency_detail').html(str);

            if(negHasGameOnly){
                $('input[type="checkbox"]').bootstrapSwitch('size','small');
                $('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state){
                    if(state){
                        M_Init._dateCache['tendencyNegType'] = 'game';
                    }else{
                        M_Init._dateCache['tendencyNegType'] = 'common';
                    }
                    F_GameSentiment_Info._formatTendencyWord();
                });
            }
            F_GameSentiment_Info._doTendencyWordChange();
            F_GameSentiment_Info._getTendencyChart();

        }else{
            $('#bs_tendency_detail').html(B_Pre._empty('暂无数据'));
            $('#bs_tendency_chart').html(B_Pre._empty('暂无数据'));
        }

    },
    _getTendencyChart:function () {
        var dom = $('#bs_tendency_chart');
        var classify_sentiment = 0;
        var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true};
        var yAxis = [];
        switch(M_Init._dateCache['tendencyType']){
            case 'tendencyNeg':
                chartDataPre.color = ['#f33f57'];
                classify_sentiment = -1;
                break;
            case 'tendencyPos':
                chartDataPre.color = ['#73bd36'];
                classify_sentiment = 1;
                break;
            case 'tendencyNeutral':
                chartDataPre.color = ['#1862c9'];
                classify_sentiment = 0;
                break;
        }
        if(!M_Init._dateCache['tendencyWord']){
            dom.html(B_Pre._empty('暂无数据'));
            return;
        }
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData['classify_sentiment'] = classify_sentiment;
        postData['lighttower_classify'] = M_Init._dateCache['tendencyWord'];
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackAnalyseDetail','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                dom.html(F_GameSentiment_Info._htmlTendencyChart(M_Init._dateCache['tendencyWord']));
                var domTendency = $('#bs_word_tendency');
                var domDistribute = $('#bs_word_distribute');
                if(data && data.feedback_date_distri && data.feedback_date_distri.length > 0){
                    chartDataPre.x_axis = [];
                    chartDataPre.y_axis = [];
                    yAxis = []
                    for(var i=0;i<data.feedback_date_distri.length;i++){
                        chartDataPre.x_axis.push(data.feedback_date_distri[i].data_date);
                        yAxis.push(data.feedback_date_distri[i].post_num);
                    }
                    chartDataPre.y_axis.push({name:'帖子数',data:yAxis});
                    M_Outside_Chart._chartData('lineOpacity','bs_word_tendency',chartDataPre);
                }else{
                    domTendency.html(B_Pre._empty('暂无数据'));
                }
                M_Init._dateCache['feedback_tag_distri'] = [];
                if(data && data.feedback_tag_distri && data.feedback_tag_distri.length > 0){
                    M_Init._dateCache['feedback_tag_distri'] = data.feedback_tag_distri;
                    chartDataPre.x_axis = [];
                    chartDataPre.y_axis = [];
                    chartDataPre.yFormat = '%';
                    chartDataPre.xFormatDate = false;
                    yAxis = [];
                    for(var i=0;i<data.feedback_tag_distri.length;i++){
                        chartDataPre.x_axis.push(data.feedback_tag_distri[i].show_tag);
                        yAxis.push(((data.feedback_tag_distri[i].tag_rate)*100).toFixed(2));
                    }
                    chartDataPre.tooltip = {'num':1,'unit':'%'};
                    chartDataPre.y_axis.push({name:'占比',data:yAxis});
                    M_Outside_Chart._chartData('bar','bs_word_distribute',chartDataPre);
                }else{
                    domDistribute.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlRank:function (data,total) {
        var str = '';
        str += '<div class="fl"><ul class="problem-list">';
        var percent = 0;
        var number = 1;
        var trendPercent = 0;
        var isHasOther = false;
        var otherData = '';
        for(var i=0;i<data.length;i++){
            if(data[i].word != '其他') {
                percent = ((parseInt(data[i].number) / total) * 100).toFixed(2);
                if (number == 1) {
                    trendPercent = (100/percent).toFixed(0);
                    percent = 100;
                    str += '<li class="selected"><i class="tg-icon triangle-shadow"></i>';
                    M_Init._dateCache['rankWord'] = data[i].word;
                } else {
                    percent *= trendPercent;
                    str += '<li>';
                }
                str += '<b>' +number+ '</b><span class="bs_rank_word_word">' + data[i].word + '</span><span>' + data[i].number + '条反馈</span><div class="koubei-percent-wrap"><div class="rate" style="width: ' + percent + '%"></div></div></li>';
                number++;
            }else{
                otherData = data[i];
                isHasOther = true;
            }
            if(isHasOther){
                if(number >= 10)break;
            }else{
                if(number >= 11)break;
            }
        }
        if(isHasOther){
            str += '<li><b>' +number+ '</b><span class="bs_rank_word_word">' + otherData.word + '</span><span>' + otherData.number + '条反馈</span><div class="koubei-percent-wrap"><div class="rate" style="width: ' + percent + '%"></div></div></li></li>';
        }
        str += '</ul></div>';
        str += '<div class="graph-wrap">';
        str += '<div id="bs_rank_show"></div>';
        str += '</div>';

        return str;
    },
    _htmlRankDetail:function () {
        var str = '';
        str += '<span class="control-icon pre-click"><i class="tg-graph"></i></span>';
        str += '<div id="bs_rank_detail">';
        str += '<ul class="tab-click-change">';
        if(M_Init._dateCache['rankWordDetail'] && M_Init._dateCache['rankWordDetail'][M_Init._dateCache['rankWord']]){
            var wordDetail = M_Init._dateCache['rankWordDetail'][M_Init._dateCache['rankWord']];
            for(var i=0;i<wordDetail.length;i++){
                if(i==0){
                    str += '<li class="selected">';
                    M_Init._dateCache['rankWordCurrent'] = wordDetail[i].keyword;
                }else{
                    str += '<li>';
                }
                str += '<span>'+wordDetail[i].keyword+'</span><p>'+wordDetail[i].cnt+'反馈</p></li>';
            }
        }
        str += '</ul></div>';
        str += '<span class="control-icon next-click"><i class="tg-graph tg-triangle-gray-right"></i></span></div>';
        str += '<div><div class="graph-part boxshadow"><div  id="bs_rank_detail_chart" style="width: 100%;height: 100%"></div></div>';

        $('#bs_rank_show').html(str);
        M_Outside._clickScroll($('#bs_rank_show .pre-click'),$('#bs_rank_show .next-click'),$('.tab-click-change'),'',101,1,10,'selected-btn');
        F_GameSentiment_Info._doRankTabChange();
        F_GameSentiment_Info._getRankChart();
    },
    _getRank:function(){
        var dom = $('#bs_rank');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin2;
        postData['end_date'] = M_Init._dateCache.end2;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackHotwords','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.length > 0){
                    var word = [];
                    var wordCache = {};
                    var length = 0;
                    var total = 0;
                    for(var i=0;i<data.length;i++){
                        if(data[i].keywords){
                            length = data[i].keywords.length;
                            if(length > 0){
                                total += data[i].cnt;
                                word.push({'word':data[i].keyword_classify,'number':data[i].cnt});
                                if(length > 50){
                                    data[i].keywords = data[i].keywords.slice(0,50);
                                }
                                wordCache[data[i].keyword_classify] = data[i].keywords;
                            }
                        }
                    }
                    if(word && word.length > 0){
                        M_Init._dateCache['rankWordDetail'] = wordCache;
                        dom.html(F_GameSentiment_Info._htmlRank(word,total));
                        F_GameSentiment_Info._doRankWordChange();
                        F_GameSentiment_Info._htmlRankDetail();
                    }else{
                        dom.html(B_Pre._empty('暂无数据'));
                    }
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getRankChart:function(){
        var dom = $('#bs_rank_detail_chart');
        var postData = {};
        postData['keyword'] = M_Init._dateCache['rankWordCurrent'];
        postData['start_date'] = M_Init._dateCache.begin2;
        postData['end_date'] = M_Init._dateCache.end2;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackKeywords','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.y_axis && data.y_axis.length > 0){
                    var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true};
                    chartDataPre.x_axis = data.x_axis;
                    chartDataPre.y_axis.push({'name':'帖子数','data':data.y_axis});
                    M_Outside_Chart._chartData('lineOpacity','bs_rank_detail_chart',chartDataPre);
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _doRankWordChange:function () {
        $('#bs_rank .problem-list li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    $(this).siblings('li').find('i').remove();
                    $(this).append('<i class="tg-icon triangle-shadow"></i>');
                    M_Init._dateCache['rankWord'] = $(this).find('.bs_rank_word_word').html();
                    F_GameSentiment_Info._htmlRankDetail();
                }
            })
        });
    },
    _doRankTabChange:function () {
        $('#bs_rank_detail li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    M_Init._dateCache['rankWordCurrent'] = $(this).find('span').html();

                    F_GameSentiment_Info._getRankChart();
                }
            });
        });
    },
    _searchTopic:function (topicId) {
        M_Outside._redirectForum({'gameId':M_Init._gameDetailId,'dateBegin':M_Init._dateCache.begin3,'dateEnd':M_Init._dateCache.end3,'topicId':topicId});
    },
    _htmlTopic:function (data,begin) {
        var str = '';
        str += '<table class="tg-table table table-bordered">';
        str += '<thead class="boxshadow">';
        str += '<tr>';
        str += '<th>排名</th><th class="game-tag">热门话题</th><th class="rate-num">热力指数</th><th>正面情感贴数</th><th>负面情感贴数</th><th>操作</th>';
        str += '<tr>';
        str += '</thead>';
        str += '<tbody>';
        var topicArr = [];
        for(var i=0;i<data.length;i++){
            if(i==0 && begin==0){
                M_Init._dateCache['hot_num_per_diff'] = Math.ceil(100/data[i].hot_num);
                data[i].hot_num = 100;
            }else{
                if(M_Init._dateCache['hot_num_per_diff']){
                    data[i].hot_num *= M_Init._dateCache['hot_num_per_diff'];
                }
            }
            str += '<tr>';
            str += '<td>'+(begin+i+1)+'</td>';
            str += '<td><ul class="tg-tab-btn">';
            if(data[i].topic_word_list){
                data[i].topic_word_list = $.trim(data[i].topic_word_list);
                if(data[i].topic_word_list){
                    topicArr = data[i].topic_word_list.split(' ');
                    for(var d=0;d<topicArr.length;d++){
                        str += '<li class="tg-tab-btn-normal">'+topicArr[d]+'</li>';
                    }
                }
            }
            str +='</ul></td>';
            str += '<td><div class="koubei-percent-wrap"><div class="rate" style="width: '+data[i].hot_num+'%"></div></div><span>'+data[i].post_num+'</span></td>';
            str += '<td>'+data[i].positive_num+'</td>';
            str += '<td>'+data[i].negative_num+'</td>';
            str += '<td><button class="tg-main-btn" onclick="F_GameSentiment_Info._searchTopic(\''+data[i].topic_id+'\')">查看详情</button></td>';
            str += '</tr>';
        }
        str += '</tbody>';
        str += '</table>';

        return str;
    },
    _getTopic:function (page) {
        var dom = $('#bs_topic_table');
        var domPageList = $('#lt_forum_page');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin3;
        postData['end_date'] = M_Init._dateCache.end3;
        postData['project_id'] = M_Init._gameDetailId;
        postData['index'] = (page-1)*B_Page._size;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackRank','get',true,postData,function(){
                dom.html(B_Pre._loading());
                domPageList.html('');
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.topic_distri && data.topic_distri.length > 0){
                    dom.html(F_GameSentiment_Info._htmlTopic(data.topic_distri,(page-1)*B_Page._size));
                    domPageList.html(B_Page._show({total:20,page:page},'number'));
                    B_Page._click(page,function (page) {
                        F_GameSentiment_Info._getTopic(page);
                    });
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    }
}