var F_GameLight_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-7');
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
            M_Game._checkGameVisitList('gameLight');
        }
    }
}
var F_GameLight_Info = {
    _domInit:function () {
        var str = '';
        str += '\
            <div class="blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12 widthLarge">\
                <h3>游戏简介</h3>\
                <div class="boxshadow game-summary-2"></div>\
            </div>\
            <div class="blockpart col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid">\
                <h3>游戏口碑评级</h3>\
                <div class="boxshadow game-level-2"><div class="graph-part cursor-default" id="bs_gauge" style="width: 100%; height: 100%"></div><div id="bs_gauge_desc" class="des"></div></div>\
            </div>\
            <div class="blockpart col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid">\
                <h3>游戏舆情状态</h3>\
                <div class="boxshadow  game-yuqing-graph-2"><div class="graph-part" id="bs_radar" style="width: 100%; height: 100%"></div></div>\
            </div>';

        str += M_Outside._domCreate('analysisChartTableDate', 5, '0_0', '论坛帖子总量');

        str +=  '\
            <div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12 ">\
                <h3>论坛反馈分析</h3>\
                <div class="tg-selected-drop tg-date-fl">\
                    <span>日期</span>\
                    <p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc1"></span><input id="db1" type="hidden" value=""><input id="de1" type="hidden" value=""></p>\
                </div>\
                <div class="boxshadow luntan-back-2"></div>\
            </div>\
            <div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                <h3>论坛热词解读</h3>\
                <div class="tg-selected-drop tg-date-fl">\
                    <span>日期</span>\
                    <p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc2"></span><input id="db2" type="hidden" value=""><input id="de2" type="hidden" value=""></p>\
                </div>\
                <div class="boxshadow luntan-hotword-2"></div>\
            </div>\
            <div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                <h3>论坛话题排行榜</h3>\
                <div class="tg-selected-drop tg-date-fl">\
                    <span>日期</span>\
                    <p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc3"></span><input id="db3" type="hidden" value=""><input id="de3" type="hidden" value=""></p>\
                </div>\
                <div class="boxshadow rank-list-2"></div>\
            </div>';

        str += '<div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12 channel-infor">'
        str += '<h3>论坛质量分析</h3>';
        str += '<div id="bs_quality"></div>';
        str += '</div>';

        str += '\
            <div class="more" id="bs_open_more">\
                <iframe src="" frameborder="0" id="IframePart" class="iframe-more-date" height="100%" width="100%" scrolling="no"></iframe>\
            </div>';

        $('#ct_main_area').addClass('channel-comment-part').html(str);

        M_Inside._downloadCsv();

        B_Date._chooseSection({'autoCommit':true,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                M_Init._dateCache.begin = begin;
                M_Init._dateCache.end = end;
                F_GameLight_Info._getEmotion();
            }
        });

        B_Date._chooseSection({'autoCommit':true,'todayValid':false},2,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin2 || M_Init._dateCache.end2 != end){
                M_Init._dateCache.begin2 = begin;
                M_Init._dateCache.end2 = end;
                F_GameLight_Info._getRank();
            }
        });

        B_Date._chooseSection({'autoCommit':true,'todayValid':false},3,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin3 || M_Init._dateCache.end3 != end){
                M_Init._dateCache.begin3 = begin;
                M_Init._dateCache.end3 = end;
                F_GameLight_Info._getTopicPort();
            }
        });

        B_Date._chooseSection({'autoCommit':true,'todayValid':false},5,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin5 || M_Init._dateCache.end5 != end){
                M_Init._dateCache.begin5 = begin;
                M_Init._dateCache.end5 = end;
                F_GameLight_Info._getTotal();
            }
        });

        B_Game._getCollect(function () {
            F_GameLight_Info._getInfo();
        });

        setTimeout(function () {
            F_GameLight_Info._getQuality();
        },300);
    },
    _htmlTopic:function (data) {
        var str = '<ul class="left">';
        var topicArr = [];
        var length = data.length;
        var strSecond = '';
        var strFirst = '';
        var strOther = '';
        for(var i=0;i<length;i++){
            if(i>9)break;
            if(i==0){
                M_Init._dateCache['hot_num_per_diff'] = Math.ceil(100/data[i].hot_num);
                data[i].hot_num = 100;
            }else{
                if(M_Init._dateCache['hot_num_per_diff']){
                    data[i].hot_num *= M_Init._dateCache['hot_num_per_diff'];
                }
            }
            str += '<li>';
            str += '<div>';
            str += '<div class="rate-wrap"><span class="num">'+(i+1)+'</span>';
            str += '<span class="word-slice"><b>'+data[i].topic_id+'</b>';
            /*
            if(data[i].topic_word_list){
                data[i].topic_word_list = $.trim(data[i].topic_word_list);
                if(data[i].topic_word_list){
                    strFirst = '';
                    strSecond = '';
                    strOther = '';
                    topicArr = data[i].topic_word_list.split(' ');
                    for(var d=0;d<topicArr.length;d++){
                        if(d == 0){
                            strFirst = '<b>'+topicArr[d]+'</b>';
                        }else if(d == 1){
                            strSecond = '<b>'+topicArr[d]+'</b>';
                        }else{
                            strOther = '<b>'+topicArr[d]+'</b>';
                        }
                    }
                    str += strSecond+strFirst+strOther;
                }
            }
            */
            str += '</span>';
            str += '<div class="rate-content"><span class="rate" style="width: '+(100-data[i].hot_num)+'%"></span></div></div>';
            str += '</div>';

            str += '\
                    <div>\
                        <ul class="detail" data-t="'+data[i].topic_id+'">\
                            <li><span class="common-color" data-t="'+data[i].topic_id+'" data-c="100">'+data[i].post_num+'</span><p>全部帖子数</p></li>\
                            <li><span class="negtive-color" data-t="'+data[i].topic_id+'" data-c="-1">'+data[i].negative_num+'</span><p>负面情感帖数</p></li>\
                            <li><span class="positive-color" data-t="'+data[i].topic_id+'" data-c="1">'+data[i].positive_num+'</span><p>正面情感帖数</p></li>\
                        </ul>\
                    </div>';

            if(i == 4 && length > 5){
                str += '</ul><ul class="left">';
            }
        }
        str += '</ul>';

        return str;
    },
    _getTopicPort:function () {
        var dom = $('.rank-list-2');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin3;
        postData['end_date'] = M_Init._dateCache.end3;
        postData['project_id'] = M_Init._gameDetailId;
        postData['index'] = 0;
        postData['limit'] = 10;
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackRank','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.topic_distri && data.topic_distri.length > 0){
                    dom.html(F_GameLight_Info._htmlTopic(data.topic_distri));

                    $('.rank-list-2 .detail span').each(function () {
                        $(this).click(function () {
                            F_GameLight_Info._chartClick('rank_list_light',{'topic':$(this).attr('data-t'),'classify_sentiment':$(this).attr('data-c')});
                        });
                    });
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlRank:function (data,total) {
        var str = '';
        str += '<div class="left"><ul>';
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
                    str += '<li class="selected">';
                    M_Init._dateCache['rankWord'] = data[i].word;
                } else {
                    percent *= trendPercent;
                    str += '<li>';
                }
                str += '<span>' + data[i].word + '</span><div class="rate-wrap"><div class="rate" style="width: ' + percent + '%"></div></div></li>';
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
            str += '<li><span>' + otherData.word + '</span><div class="rate-wrap"><div class="rate" style="width: ' + percent + '%"></div></div></li>';
        }
        str += '</ul></div>';
        str += '<div class="right"></div>';

        return str;
    },
    _htmlRankDetail:function () {
        var str = '<div class="top-slider top-slider-center">';
        str += '<div class="control prev-icon fl"><i></i></div>';
        str += '<div class="wrap" id="bs_rank_detail">';
        str += '<ul class="tab-click-change">';
        if(M_Init._dateCache['rankWordDetail'] && M_Init._dateCache['rankWordDetail'][M_Init._dateCache['rankWord']]){
            var wordDetail = M_Init._dateCache['rankWordDetail'][M_Init._dateCache['rankWord']];
            var bgColor = 0;
            for(var i=0;i<wordDetail.length;i++){
                if(bgColor > 10){
                    bgColor = 10;
                }else{
                    bgColor++;
                }
                if(i==0){
                    str += '<li class="selected bg1">';
                    M_Init._dateCache['rankWordCurrent'] = wordDetail[i].keyword;
                }else{
                    str += '<li class="bg'+bgColor+'">';
                }
                str += '<p>'+wordDetail[i].keyword+'</p></li>';
            }
        }
        str += '</ul></div>';
        str += '<div class="control next-icon fr"><i></i></div>';
        str += '</div>';
        str += '<div><div class="graph-part boxshadow"><div id="bs_rank_detail_chart_light" style="width: 100%;height: 100%"></div></div>';

        $('.luntan-hotword-2 .right').html(str);
        $('.tab-click-change').css('left','0');
        //M_Outside._clickScroll($('.luntan-hotword-2 .prev-icon'),$('.luntan-hotword-2 .next-icon'),$('.tab-click-change'),'',110,1,10,'selected-btn');
        var ulWidth = $('.luntan-hotword-2 .right .top-slider .wrap ul li').length*110;
        $('.luntan-hotword-2 .right .top-slider .wrap ul').width(ulWidth);
        F_GameLight_Info._doRankTabChange();
        F_GameLight_Info._getRankChart();
    },
    _getRank:function(){
        var dom = $('.luntan-hotword-2');
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
                        dom.html(F_GameLight_Info._htmlRank(word,total));
                        F_GameLight_Info._doRankWordChange();
                        F_GameLight_Info._htmlRankDetail();
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
        var dom = $('#bs_rank_detail_chart_light');
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
                    var chartDataPre = {color:['#e38b4c'],x_axis:[],y_axis:[],xFormatDate:true};
                    chartDataPre.x_axis = data.x_axis;
                    chartDataPre.y_axis.push({'name':'热力指数','data':data.y_axis});
                    M_Outside_Chart._chartData('lineOpacity','bs_rank_detail_chart_light',chartDataPre);
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _doRankWordChange:function () {
        $('.luntan-hotword-2 .left li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    M_Init._dateCache['rankWord'] = $(this).find('span').html();
                    F_GameLight_Info._htmlRankDetail();
                }
            })
        });
    },
    _doRankTabChange:function () {
        $('#bs_rank_detail li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    M_Init._dateCache['rankWordCurrent'] = $(this).find('p').html();

                    F_GameLight_Info._getRankChart();
                }
            });
        });
    },
    _htmlForumBase:function () {
        var str = '';
        str += '\
        <div class="left">\
            <h5>玩家反馈情况概览</h5>\
            <div class="graph-part"><div id="bs_emotion_light" style="width: 100%; height: 100%"></div></div>\
            <div class="post-num-wrap" id="bs_tendency_left"></div>\
        </div>\
        <div class="mid negative-content" id="bs_tendency_mid"></div>\
        <div class="right" id="bs_tendency_right"></div>';

        return str;
    },
    _htmlForumLeft:function (data) {
        var str = '';
        str += '\
                <div class="graph-part cursor-default"><div id="bs_pie_light" style="width: 100%; height: 100%"></div></div>\
                <ul>\
                    <li class="selected">\
                        <div>\
                            <b class="negtive-color">'+data.neg+'%</b>\
                            <span>共'+data.negNum+'</span>\
                        </div>\
                        <p>论坛负面情感帖</p>\
                    </li>\
                    <li>\
                        <div>\
                            <b class="positive-color">'+data.pos+'%</b>\
                            <span>共'+data.posNum+'</span>\
                        </div>\
                        <p>论坛正面情感帖</p>\
                    </li>\
                    <li>\
                        <div>\
                            <b class="common-color">'+data.neutral+'%</b>\
                            <span>共'+data.neutralNum+'</span>\
                        </div>\
                        <p>论坛中性情感帖</p>\
                    </li>\
                </ul>';

         return str;
    },
    _htmlForumMid:function () {
        var str = '';
        str += '\
            <ul class="tab-change">\
                <li class="red-bg">负面反馈</li>\
                <li>正面反馈</li>\
                <li>中性反馈</li>\
            </ul>\
            <ul class="tab-content boxshadow"></ul>';

        return str;
    },
    _htmlForumRight:function (word) {
        var str = '';
        str += '\
            <div class="t">\
                <h3>"'+word+'"反馈走势</h3>\
                <div class="graph-part"><div id="bs_word_tendency_light" style="width: 100%; height: 100%"></div></div>\
            </div>\
            <div class="b">\
                <h3>"'+word+'"反馈分布</h3>\
                <ul class="circle-union" id="bs_word_distribute_light"></ul>\
            </div>';

        return str;
    },
    _getTendencyPort:function () {
        var domLeft = $('#bs_tendency_left');
        var domMid = $('#bs_tendency_mid');
        var domRight = $('#bs_tendency_right');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackAnalyse','get',true,postData,function(){
                domLeft.html(B_Pre._loading());
            },function(){
                domLeft.html('');
            },function(data,msg){
                if(data && data.feedback_class_distri){
                    var tendency = {'neg':0,'negNum':0,'pos':0,'posNum':0,'neutral':0,'neutralNum':0,'totalNum':0};
                    tendency.neg = data.negative_rate ? (data.negative_rate*100).toFixed(2) : '0';
                    tendency.negNum = data.negative_num ? data.negative_num : '0';
                    tendency.pos = data.positive_rate ? (data.positive_rate*100).toFixed(2) : '0';
                    tendency.posNum = data.positive_num ? data.positive_num : '0';
                    tendency.neutral = data.other_rate ? (data.other_rate*100).toFixed(2) : '0';
                    tendency.neutralNum = data.total_num ? (data.total_num - tendency.negNum - tendency.posNum) : '0';
                    tendency.totalNum = data.total_num ? data.total_num : '0';

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

                    domLeft.html(F_GameLight_Info._htmlForumLeft(tendency));

                    var chartDataPre = {
                        name:'有情感倾向的帖子数',
                        color:['#f78a97','#a8d87f','#84c0e9'],
                        data:[{value:tendency.negNum, name:'论坛负面情感帖', selected:true},{value:tendency.posNum, name:'论坛正面情感帖'},{value:tendency.neutralNum, name:'论坛中性情感帖'}],
                        radius:['0%', '70%']
                    };
                    M_Outside_Chart._chartData('pie','bs_pie_light',chartDataPre);

                    domMid.html(F_GameLight_Info._htmlForumMid());

                    F_GameLight_Info._formatTendencyWord();
                    F_GameLight_Info._doTendencyTabChange('top');
                    F_GameLight_Info._doTendencyTabChange('left');
                }else{
                    domLeft.html(B_Pre._empty('暂无数据'));
                    domMid.html(B_Pre._empty('暂无数据'));
                    domRight.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                domMid.html(B_Pre._empty(msg));
            }
        )
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
                    colorClass = 'negtive-rate';
                    var neg = {'common':[],'game':[]};
                    for(var i=0;i<data.length;i++){
                        neg[data[i].feedback_type].push(data[i]);
                    }
                    neg.common = data;
                    M_Init._dateCache['tendencyNegType'] = M_Init._dateCache['tendencyNegType'] ? M_Init._dateCache['tendencyNegType'] : 'common';
                    if(neg['game'].length > 0){
                        negHasGameOnly = true;
                        str += '<div class="change-btn"><div>';
                        str += M_Init._dateCache['tendencyNegType'] == 'game' ? '<input type="checkbox" id="bs_common_game" checked />' : '<input type="checkbox" id="bs_common_game" />';
                        str += ' </div><span> 仅显示产品相关</span></div>';
                    }
                    data = neg[M_Init._dateCache['tendencyNegType']];
                    break;
                case 'tendencyPos':
                    colorClass = 'positive-rate';
                    break;
                case 'tendencyNeutral':
                    colorClass = 'common-rate';
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
                    str += '<i>'+number+'</i>';
                    str += '<b>'+data[i].lighttower_classify+'</b>';
                    str += '<div class="rate-wrap">';
                    str += '<div class="'+colorClass+'" style="width:'+percent+'%"></div>';
                    str += '</div>';
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
                str += '<i>'+number+'</i>';
                str += '<b>其它</b>';
                str += '<div class="rate-wrap">';
                str += '<div class="'+colorClass+'" style="width:'+percent+'%"></div>';
                str += '</div></li>';
            }

        }
        if(str){
            $('#bs_tendency_mid .tab-content').html(str);

            if(negHasGameOnly){
                $('input[type="checkbox"]').bootstrapSwitch('size','small');
                $('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state){
                    if(state){
                        M_Init._dateCache['tendencyNegType'] = 'game';
                    }else{
                        M_Init._dateCache['tendencyNegType'] = 'common';
                    }
                    F_GameLight_Info._formatTendencyWord();
                });
            }
            F_GameLight_Info._doTendencyWordChange();
            F_GameLight_Info._getTendencyChart();
        }else{
            $('#bs_tendency_mid .tab-content').html(B_Pre._empty('暂无数据'));
            $('#bs_tendency_right').html(B_Pre._empty('暂无数据'));
        }
    },
    _getTendencyChart:function () {
        var dom = $('#bs_tendency_right');
        var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true};
        var yAxis = [];
        var circleColor = '';
        M_Init._dateCache['classify_sentiment'] = 0;
        switch(M_Init._dateCache['tendencyType']){
            case 'tendencyNeg':
                chartDataPre.color = ['#f33f57'];
                M_Init._dateCache['classify_sentiment'] = -1;
                circleColor = 'negtive-circle-union';
                break;
            case 'tendencyPos':
                chartDataPre.color = ['#73bd36'];
                M_Init._dateCache['classify_sentiment'] = 1;
                circleColor = 'positive-circle-union';
                break;
            case 'tendencyNeutral':
                chartDataPre.color = ['#1862c9'];
                M_Init._dateCache['classify_sentiment'] = 0;
                circleColor = 'common-circle-union';
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
        postData['classify_sentiment'] = M_Init._dateCache['classify_sentiment'];
        postData['lighttower_classify'] = M_Init._dateCache['tendencyWord'];
        postData = B_Common._postData(postData);
        B_Port._ajax('feedbackAnalyseDetail','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                dom.html(F_GameLight_Info._htmlForumRight(M_Init._dateCache['tendencyWord']));
                var domTendency = $('#bs_word_tendency_light');
                var domDistribute = $('#bs_word_distribute_light');
                if(data && data.feedback_date_distri && data.feedback_date_distri.length > 0){
                    chartDataPre.x_axis = [];
                    chartDataPre.y_axis = [];
                    yAxis = []
                    for(var i=0;i<data.feedback_date_distri.length;i++){
                        chartDataPre.x_axis.push(data.feedback_date_distri[i].data_date);
                        yAxis.push(data.feedback_date_distri[i].post_num);
                    }
                    chartDataPre.y_axis.push({name:'帖子数',data:yAxis});
                    M_Outside_Chart._chartData('lineOpacity','bs_word_tendency_light',chartDataPre);
                }else{
                    domTendency.html(B_Pre._empty('暂无数据'));
                }
                M_Init._dateCache['feedback_tag_distri'] = [];
                if(data && data.feedback_tag_distri && data.feedback_tag_distri.length > 0){
                    M_Init._dateCache['feedback_tag_distri'] = data.feedback_tag_distri;
                    var str = '';

                    for(var i=0;i<data.feedback_tag_distri.length;i++){
                        str += '<li class="position-'+(i+1)+'" data-s="'+data.feedback_tag_distri[i].show_tag+'" data-r="'+data.feedback_tag_distri[i].real_tag+'"><b>'+((data.feedback_tag_distri[i].tag_rate)*100).toFixed(2)+'%</b><p>'+data.feedback_tag_distri[i].show_tag+'</p></li>';
                        if(i>=6)break;
                    }
                    domDistribute.addClass(circleColor).html(str);

                    domDistribute.find('li').each(function () {
                        $(this).click(function () {
                            F_GameLight_Info._chartClick('bs_word_distribute_light',{'real':$(this).attr('data-r'),'show':$(this).attr('data-s')});
                        });
                    });
                }else{
                    domDistribute.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _doTendencyWordChange:function () {
        $('#bs_tendency_mid .tab-content li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    M_Init._dateCache['tendencyWord'] = $(this).find('b').html();
                    F_GameLight_Info._getTendencyChart();
                }
            })
        });
    },
    _doTendencyTabChange:function (from) {
        switch (from){
            case 'left':
                $('#bs_tendency_left ul li').each(function (index) {
                    $(this).click(function () {
                        if(!$(this).hasClass('selected')){
                            F_GameLight_Info._doTendencyTabChangeWork(from,$(this),index);
                        }
                    });
                });
                break;
            case 'top':
                $('#bs_tendency_mid .tab-change li').each(function (index) {
                    $(this).click(function () {
                        if(!$(this).hasClass('red-bg')){
                            F_GameLight_Info._doTendencyTabChangeWork(from,$(this),index);
                        }
                    });
                });
                break;
        }
    },
    _doTendencyTabChangeWork:function (from,dom,index) {
        switch (from){
            case 'left':
                dom.addClass('selected').siblings('li').removeClass('selected');
                $('#bs_tendency_mid .tab-change li').eq(index).addClass('red-bg').siblings('li').removeClass('red-bg');
                break;
            case 'top':
                dom.addClass('red-bg').siblings('li').removeClass('red-bg');
                $('#bs_tendency_left ul li').eq(index).addClass('selected').siblings('li').removeClass('selected');
                break;
        }

        switch(index+''){
            case '0':
                $('#bs_tendency_mid').removeClass('positive-content common-content').addClass('negative-content');
                M_Init._dateCache['tendencyType'] = 'tendencyNeg';
                break;
            case '1':
                $('#bs_tendency_mid').removeClass('negative-content common-content').addClass('positive-content');
                M_Init._dateCache['tendencyType'] = 'tendencyPos';
                break;
            case '2':
                $('#bs_tendency_mid').removeClass('positive-content negative-content').addClass('common-content');
                M_Init._dateCache['tendencyType'] = 'tendencyNeutral';
                break;
        }
        F_GameLight_Info._formatTendencyWord();
    },
    _chartClick:function (type,value) {
        var data = [];
        data.push('g='+M_Init._gameDetailId);
        switch(type){
            case 'gameForumTotalLight':
                data.push('b='+B_Common._encodeUrl(value.date));
                data.push('e='+B_Common._encodeUrl(value.date));
                data.push('forum='+B_Common._encodeUrl(value.type));
                if(M_Init._dataCache['gameForumTotalData']){
                    var dataUnion = M_Init._dataCache['gameForumTotalData'];
                    for(var i=0;i<dataUnion.length;i++){
                        if(dataUnion[i][value.type]){
                            data.push('f='+dataUnion[i][value.type]);
                            break;
                        }
                    }
                }
                data.push('z=bbs');
                break;
            case 'rank_list_light':
                data.push('b='+B_Common._encodeUrl(M_Init._dateCache.begin3));
                data.push('e='+B_Common._encodeUrl(M_Init._dateCache.end3));
                data.push('ts='+value.classify_sentiment);
                data.push('t='+B_Common._encodeUrl(value.topic));
                data.push('z=bbs');
                break;
            case 'bs_rank_detail_chart_light':
                data.push('b='+B_Common._encodeUrl(value.date));
                data.push('e='+B_Common._encodeUrl(value.date));
                data.push('w='+B_Common._encodeUrl(M_Init._dateCache['rankWordCurrent']));
                data.push('z=bbs');
                break;
            case 'bs_word_distribute_light':
                data.push('b='+B_Common._encodeUrl(M_Init._dateCache.begin));
                data.push('e='+B_Common._encodeUrl(M_Init._dateCache.end));
                data.push('c='+B_Common._encodeUrl(M_Init._dateCache['tendencyWord']));
                data.push('s='+M_Init._dateCache['classify_sentiment']);
                data.push('r='+B_Common._encodeUrl(value.real));
                data.push('show='+B_Common._encodeUrl(value.show));
                data.push('z=bbs');
                break;
            case 'bs_word_tendency_light':
                data.push('b='+B_Common._encodeUrl(value.date));
                data.push('e='+B_Common._encodeUrl(value.date));
                data.push('c='+B_Common._encodeUrl(M_Init._dateCache['tendencyWord']));
                data.push('s='+M_Init._dateCache['classify_sentiment']);
                data.push('z=bbs');
                break;
            case 'bs_emotion_light':
                switch(value.type){
                    case '正面反馈':
                        data.push('s=1');
                        break;
                    case '负面反馈':
                        data.push('s=-1');
                        break;
                }
                data.push('b='+B_Common._encodeUrl(value.date));
                data.push('e='+B_Common._encodeUrl(value.date));
                data.push('z=bbs');
                break;
        }
        if(data)data = data.join('&');
        M_Outside._openDetail(data);
    },
    _getEmotion:function () {
        $('.luntan-back-2').html(F_GameLight_Info._htmlForumBase());
        var emotionTimeOut = '';
        clearTimeout(emotionTimeOut);
        emotionTimeOut = setTimeout(function () {
            F_GameLight_Info._getEmotionPort();
        },600);
        var forumTimeOut = '';
        clearTimeout(forumTimeOut);
        forumTimeOut = setTimeout(function () {
            F_GameLight_Info._getTendencyPort();
        },900);
    },
    _getEmotionPort:function () {
        var dom = $('#bs_emotion_light');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationIntroduceFeedback','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.length>0){
                    var chartDataPre = {color:['#73bd36','#f33f57'],x_axis:[],y_axis:[],xFormatDate:true,yFormat:'',legendSelectMode:true,'gridTop':'10%'};
                    var pos = [];
                    var neg = [];
                    for(var i=0;i<data.length;i++){
                        chartDataPre.x_axis.push(data[i].data_date);
                        pos.push(data[i].positive_num);
                        neg.push(data[i].negative_num);
                    }
                    chartDataPre.y_axis.push({name:'正面反馈',data:pos});
                    chartDataPre.y_axis.push({name:'负面反馈',data:neg});
                    M_Outside_Chart._chartData('lineOpacity','bs_emotion_light',chartDataPre);

                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlBase:function (data) {
        var str = '';
        var btnStr = '';
        var tagStr = '';
        /*
        btnStr = '<button id="bs_add_game" class="';
        if(B_Game._checkCollect(M_Init._gameDetailId)){
            btnStr += 'tg-assist-btn">取消添加';
        }else{
            btnStr += 'tg-main-btn">添加为关注';
        }
        btnStr += '</button>';
        */
        if(data.tag_list){
            var tag = B_Game._tag(data.tag_list);
            for(var i=0;i<data.tag_list.length;i++){
                if(tag[data.tag_list[i]]){
                    tagStr += '<li onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(tag[data.tag_list[i]])+'\');">'+tag[data.tag_list[i]]+'</li>';
                }
            }
        }
        var gameClassify = '';
        if(M_Game._gameInfo[4]){
            gameClassify = M_Game._gameInfo[4].split(',');
            gameClassify = gameClassify[0];
        }
        str += '\
            <div class="top">\
                <img src="'+M_Game._gameInfo[0]+'" alt="'+M_Game._gameInfo[1]+'">\
                <div class="des">\
                    <h3>'+M_Game._gameInfo[1]+'</h3>\
                    <ul>'+tagStr+'</ul>\
                    <p>'+gameClassify+'类舆情量排名：<span>第<b>'+data.hot_rank+'</b>名<span></span></span></p>\
                    <span>开发商：'+M_Game._gameInfo[2]+'</span>\
                    <span>发行商：'+data.distributor+'</span>\
                    <span>发行日期：'+data.release_date+'</span>\
                </div>'+btnStr+'\
            </div>\
            <div class="bottom">\
                <h4>游戏简介</h4>\
                <p>'+data.overview+'</p>\
            </div>';

        return str;
    },
    _getInfo:function () {
        var infoTimeOut = '';
        clearTimeout(infoTimeOut);
        infoTimeOut = setTimeout(function () {
            F_GameLight_Info._getInfoPort();
        },300);
    },
    _getInfoPort:function(){
        var domInfo = $('.game-summary-2');
        var domRadar = $('#bs_radar');
        var domGauge = $('#bs_gauge');
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationIntroduce','get',true,postData,function(){
                domInfo.html(B_Pre._loading());
                domRadar.html(B_Pre._loading());
                domGauge.html(B_Pre._loading());
            },function(){
                domInfo.html('');
                domRadar.html('');
                domGauge.html('');
            },function(data,msg){
                if(data.game_info){
                    domInfo.html(F_GameLight_Info._htmlBase(data.game_info));
                    F_GameLight_Info._chartGauge(data.game_info.opinion_score);
                    if(data.radar_data){
                        F_GameLight_Info._chartRadar(data.radar_data);
                    }
                    $('#bs_add_game').click(function () {
                        if(B_Game._checkCollect(M_Init._gameDetailId)){
                            B_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要取消添加【'+M_Game._gameInfo[1]+'】么？',btn:['确认','取消'],title:'操作提示'},function(){
                                B_Pop._init('close');
                                B_Game._setCollect(M_Init._gameDetailId,'bs_add_game',{'on':['tg-assist-btn','取消添加'],'off':['tg-main-btn','添加游戏']});
                            },function(){
                                B_Pop._init('close');
                            });
                        }else{
                            B_Game._setCollect(M_Init._gameDetailId,'bs_add_game',{'on':['tg-assist-btn','取消添加'],'off':['tg-main-btn','添加游戏']});
                        }
                    });

                }
            },function(data,msg,code){
                domInfo.html(B_Pre._empty(msg));
                domRadar.html(B_Pre._empty(msg));
                domGauge.html(B_Pre._empty(msg));
            }
        )
    },
    _chartGauge:function (data) {
        var chartDataPre = {gridTop:'25%',radius:'80%',detail: {formatter:'{value}'},data:[{value:data}],startAngle:210,endAngle:-30,name:'口碑评级',color:[[0.4, '#5c3a77'], [0.6, '#f7586a'], [0.8, '#f49551'], [0.9, '#f6d75a'], [1, '#33d184']],pointerColor:'#436cbb',tooltipFormat:{formatter: "{a} : {c}"}};
        M_Outside_Chart._chartData('gauge','bs_gauge',chartDataPre);

        var descStr = '';
        data = parseInt(data);
        if(data < 40){
            descStr = '<b class="gray">待提高</b>';
        }else if(data >= 40 && data < 60){
            descStr = '<b class="blue">中等</b>';
        }else if(data >= 60 && data < 80){
            descStr = '<b class="yellow">良好</b>';
        }else if(data >= 80 && data < 90){
            descStr = '<b class="red">优秀</b>';
        }else if(data >= 90){
            descStr = '<b class="purple">卓越</b>';
        }
        $('#bs_gauge_desc').html('<span>该游戏当前的口碑评级为：'+descStr+'</span>');
    },
    _chartRadar:function (data) {
        var radarConfig = {'正向反馈占比':'negative_weight','讨论热度':'post_weight','舆情走势':'stable_weight','有效反馈占比':'useless_weight','活跃人数':'user_weight','畅销排名':'appstore_weight'};
        //var chartDataPre = {indicator:[],data:{'当前游戏':[],'行业平均':[]},legendSelectMode:true,'color':['#3daae3','#2ed383']};
        var chartDataPre = {indicator:[],data:{'当前游戏':[]},legendSelectMode:true,'color':['#3daae3','#2ed383']};
        $.each(radarConfig,function(key,value){
            if(key == '畅销排名'){
                if(data.avg[value]){
                    chartDataPre.indicator.push({text: key, max: 100});
                    //chartDataPre.data['行业平均'].push((data.avg[value] ? ((data.avg[value]*100).toFixed(0)) : 0));
                    chartDataPre.data['当前游戏'].push((data.real[value] ? ((data.real[value]*100).toFixed(0)) : 0));
                }
            }else{
                chartDataPre.indicator.push({text: key, max: 100});
                //chartDataPre.data['行业平均'].push((data.avg[value] ? ((data.avg[value]*100).toFixed(0)) : 0));
                chartDataPre.data['当前游戏'].push((data.real[value] ? ((data.real[value]*100).toFixed(0)) : 0));
            }
        });
        if(chartDataPre.indicator && chartDataPre.indicator.length > 0){
            if($('#bs_radar').length > 0){
                M_Outside_Chart._chartData('radar','bs_radar',chartDataPre);
            }
        }
    },
    _getTotal:function () {
        var domId = '0_0';
        var dom = $('#bs_chart_'+domId);
        var domTable = $('#bs_table_list_'+domId);
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin5;
        postData['end_date'] = M_Init._dateCache.end5;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('forumAnalyse','get',true,postData,function(){
                dom.html(B_Pre._loading());
                domTable.html(B_Pre._loading());
                $('#bs_page_'+domId).html('');
            },function(){
                dom.html('');
                domTable.html('');
            },function(data,msg){
                if(data && data.y_axis){
                    var tableData = {'head':['日期'],'body':[]};
                    var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true,legendSelectMode:true,legendIsShow:true};
                    chartDataPre.x_axis = data.x_axis;
                    $.each(data.y_axis,function (key,value) {
                        tableData.head.push(key);
                        for(var d=0;d<value.length;d++){
                            if (!tableData.body[d])tableData.body[d] = [chartDataPre.x_axis[d]];
                            tableData.body[d].push(value[d]);
                        }
                        chartDataPre.y_axis.push({'name':key,'data':value});
                    })
                    M_Outside_Chart._chartData('barSum','bs_chart_'+domId,chartDataPre,'gameForumTotalLight');
                    tableData.name = '论坛帖子总量('+M_Init._dateCache.begin+'至'+M_Init._dateCache.end+')';
                    M_Init._dataCache[domId] = tableData;
                    M_Init._dataCache['gameForumTotalData'] = data.y_axis_desc;
                    M_Inside._tableHtml(1,domId);

                    M_Inside._chartTableIcon('together',0,'0');
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getQuality:function () {
        var dom = $('#bs_quality');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('forumQualityAnalyse','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.useless_distri && data.useless_distri.length > 0){
                    var dataUnion = data.useless_distri;
                    var dataFormat = [];
                    for(var i=0;i<dataUnion.length;i++){
                        dataFormat[i] = [dataUnion[i].show_forum_name,dataUnion[i].forum_num.total,dataUnion[i].forum_num.positive,dataUnion[i].forum_num.negative,0,0,0,0,0,0];
                        if(dataUnion[i].detail_classify_distri && dataUnion[i].detail_classify_distri.length > 0){
                            var rate = '';
                            for(var d=0;d<dataUnion[i].detail_classify_distri.length;d++){
                                rate = (dataUnion[i].detail_classify_distri[d].useless_rate*100).toFixed(2);
                                switch(dataUnion[i].detail_classify_distri[d].useless_classify){
                                    case '买卖':
                                        dataFormat[i][8] = rate;
                                        break;
                                    case '灌水':
                                        dataFormat[i][5] = rate;
                                        break;
                                    case '色情':
                                        dataFormat[i][6] = rate;
                                        break;
                                    case '脏话':
                                        dataFormat[i][7] = rate;
                                        break;
                                    case '广告':
                                        dataFormat[i][4] = rate;
                                        break;
                                    case '其他':
                                        dataFormat[i][9] = rate;
                                        break;
                                }
                            }
                        }
                    }
                    dom.html(F_GameLight_Info._htmlQuality(dataFormat));
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlQuality:function (data) {
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<div class="boxshadow">';
            str += '<div class="top-part">';
            str += '<p>'+data[i][0]+'</p>';
            str += '</div>';
            str += '<div class="rate-list"><ul>';
            str += '<li><span> 广告帖占比：'+data[i][4]+'%</span><div class="rate"><div class="blue-rate" style="width: '+data[i][4]+'%"></div></div></li>';
            str += '<li><span> 灌水帖占比：'+data[i][5]+'%</span><div class="rate"><div class="green-rate" style="width: '+data[i][5]+'%"></div></div></li>';
            str += '<li><span> 色情帖占比：'+data[i][6]+'%</span><div class="rate"><div class="purple-rate" style="width: '+data[i][6]+'%"></div></div></li>';
            str += '<li><span> 脏话帖占比：'+data[i][7]+'%</span><div class="rate"><div class="yellow-rate" style="width: '+data[i][7]+'%"></div></div></li>';
            str += '<li><span> 买卖帖占比：'+data[i][8]+'%</span><div class="rate"><div class="blue1-rate" style="width: '+data[i][8]+'%"></div></div></li>';
            str += '</ul></div></div>';
        }
        return str;
    }
}