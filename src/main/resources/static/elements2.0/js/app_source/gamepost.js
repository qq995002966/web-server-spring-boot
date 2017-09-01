var F_GamePost_Entrance = {
    _init:function (keyword) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-5');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            M_Init._clean();
            var $_GET = '';
            if(keyword){
                $_GET = M_Outside._keywordSplit(keyword);
            }else{
                $_GET = B_Common._getUrl('query');
            }
            if($_GET.g){
                M_Init._gameDetailId = $_GET.g;
                B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
            }else{
                if(!M_Init._gameDetailId){
                    M_Init._gameDetailId = M_Init._getGameId('outsideGameDetail');
                }
            }
            if($_GET.k){
                M_Init._searchKeyword = B_Common._decodeUrl($_GET.k);
            }
            if($_GET.b && $_GET.e){
                $_GET.b = B_Common._decodeUrl($_GET.b);
                $_GET.e = B_Common._decodeUrl($_GET.e);
                M_Init._dateCache.dateType = 'diff';
                M_Init._dateCache.begin = $_GET.b;
                M_Init._dateCache.end = $_GET.e;

                var dateSplit = ($_GET.b).split(' ');
                if(dateSplit.length > 1){
                    M_Init._dateCache.beginShow = dateSplit[0];
                }else{
                    M_Init._dateCache.beginShow = M_Init._dateCache.begin;
                }
                var dateSplit = ($_GET.e).split(' ');
                if(dateSplit.length > 1){
                    M_Init._dateCache.endShow = dateSplit[0];
                }else{
                    M_Init._dateCache.endShow = M_Init._dateCache.end;
                }

            }else{
                M_Init._dateCache.dateType = -30;
                M_Init._dateCache.begin = B_Date._getDiffDate(null,-29);
                M_Init._dateCache.end = B_Date._getDiffDate(null,0);
                M_Init._dateCache.beginShow = M_Init._dateCache.begin;
                M_Init._dateCache.endShow = M_Init._dateCache.end;
            }
            M_Outside._dateDiffInit();

            if($_GET.f){
                M_Init._dataCache['info_id_list'] = $_GET.f;
            }
            if($_GET.c){
                M_Init._dataCache['lighttower_classify'] = $_GET.c;
            }
            if($_GET.t){
                M_Init._dataCache['topic_id'] = $_GET.t;
            }
            if($_GET.s){
                M_Init._dataCache['classify_sentiment'] = $_GET.s;
            }
            if($_GET.r){
                M_Init._dataCache['real_tag'] = $_GET.r;
            }
            if($_GET.o){
                M_Init._dataCache['sentiment_score'] = $_GET.o;
            }

            M_Game._checkGameVisitList('gamePost');
            //M_Game._getGame();
            //F_GamePost_Info._getSource();
            //F_GamePost_Info._getClassify();
        }
    }
}

var F_GamePost_Info = {
    _domInit:function () {
        $('#ct_main_area').html(F_GamePost_Info._htmlCondition());
        //M_Outside._searchPop();
        $('#bs_sort_reply').click(function () {
            if(M_Init._dataCache['order_field'] && M_Init._dataCache['order_field'] == 'publish_time'){
                if(M_Init._dataCache['order_by'] == 'desc'){
                    M_Init._dataCache['order_by'] = 'asc';
                }else{
                    M_Init._dataCache['order_by'] = 'desc';
                }
            }else{
                M_Init._dataCache['order_field'] = 'publish_time';
                M_Init._dataCache['order_by'] = 'asc';
            }
            F_GamePost_Info._getInfo();
        });
        $('#bs_condition_forum li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['info_id_list'] = $(this).attr('data-i');
                    F_GamePost_Info._getInfo();
                }
            });
        });
        $('#bs_condition_topic li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['lighttower_classify'] = $(this).attr('data-i');
                }else{
                    $(this).removeClass('selected');
                    M_Init._dataCache['lighttower_classify'] = '';
                }
                F_GamePost_Info._getInfo();
            });
        });
        $('#bs_condition_emotion li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['classify_sentiment'] = $(this).attr('data-i');
                }else{
                    $(this).removeClass('selected');
                    M_Init._dataCache['classify_sentiment'] = '';
                }
                F_GamePost_Info._getInfo();
            });
        });
        $('#bs_condition_keyword button').click(function () {
            var keyword = $.trim($('#bs_condition_keyword input').val());
            if(M_Init._searchKeyword == '' && keyword == ''){
                B_Pop._init('msg',{'content':'搜索关键词必须填写，请确认！'});
            }else{
                M_Init._searchKeyword = keyword;
                F_GamePost_Info._getInfo();
            }
        });
        $('#bs_condition_date li').each(function () {
            $(this).click(function () {
                if($(this).attr('data-i') && !$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['dateType'] = $(this).attr('data-i');
                    switch(M_Init._dataCache['dateType']+''){
                        case '1':
                            M_Init._dateCache.begin = B_Date._getDiffDate(null,0);
                            M_Init._dateCache.end = B_Date._getDiffDate(null,0);
                            break;
                        case '-1':
                            M_Init._dateCache.begin = B_Date._getDiffDate(null,-1);
                            M_Init._dateCache.end = B_Date._getDiffDate(null,-1);
                            break;
                        case '-7':
                            M_Init._dateCache.begin = B_Date._getDiffDate(null,-6);
                            M_Init._dateCache.end = B_Date._getDiffDate(null,0);
                            break;
                        case '-30':
                            M_Init._dateCache.begin = B_Date._getDiffDate(null,-29);
                            M_Init._dateCache.end = B_Date._getDiffDate(null,0);
                            break;
                        case '-90':
                            M_Init._dateCache.begin = B_Date._getDiffDate(null,-89);
                            M_Init._dateCache.end = B_Date._getDiffDate(null,0);
                            break;
                    }
                    M_Outside._dateDiffInit();
                    F_GamePost_Info._getInfo();
                }
            });
        });

        B_Date._chooseSection({'autoCommit':false,'todayValid':true},1,M_Init._dateCache.beginShow,M_Init._dateCache.endShow,function(begin,end){
            if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                M_Init._dateCache.begin = begin;
                M_Init._dateCache.end = end;

                $('#bs_condition_date li').each(function () {
                    if($(this).attr('data-i')){
                        $(this).removeClass('selected')
                    }
                })
                F_GamePost_Info._getInfo();
            }
        });
        F_GamePost_Info._getInfo();
    },
    _getSource:function () {
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('crawlerInfoApps','get',true,postData,null,null,function(data,msg){
                M_Init._dataCache['isGetForumData'] = true;
                if(data && data.forum_info_list && data.forum_info_list.length > 0){
                    M_Init._dataCache['forumData'] = data.forum_info_list;
                }
                if(M_Init._dataCache['isGetClassifyData']){
                    F_GamePost_Info._domInit();
                }
            },null
        )
    },
    _getClassify:function () {
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('forumSearchClassify','get',true,postData,null,null,function(data,msg){
                M_Init._dataCache['isGetClassifyData'] = true;
                if(data && data.length > 0){
                    M_Init._dataCache['classifyData'] = data;
                }
                if(M_Init._dataCache['isGetForumData']){
                    F_GamePost_Info._domInit();
                }
            },null
        )
    },
    _htmlCondition:function () {
        var str = '';
        str += '<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12"><h3 class="part-title">论坛搜索</h3>';
        str += '<div class="boxshadow">';
        str += '<div class="factor-filter-part">';
        str += '<div>';
        str += '<span>论坛</span>';
        str += '<ul id="bs_condition_forum">';
        str += '<li class="'+(!M_Init._dataCache['info_id_list'] ? "selected" : "")+'" data-i="0"> 全部论坛</li>';
        if(M_Init._dataCache['forumData']){
            for(var i=0;i<M_Init._dataCache['forumData'].length;i++){
                str += '<li class="'+((M_Init._dataCache['info_id_list'] && M_Init._dataCache['info_id_list'] == M_Init._dataCache['forumData'][i].info_id) ? "selected" : "")+'" data-i="'+M_Init._dataCache['forumData'][i].info_id+'">'+M_Init._dataCache['forumData'][i].fourm_name+'</li>';
            }
        }
        str += '</ul>';
        str += '</div>';
        str += '<div class="date">';
        str += '<span>日期</span>';
        str += '<ul id="bs_condition_date">';
        str += '<li><div class="tg-selected-drop tg-date-fl"><p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc1"></span><input id="db1" type="hidden" value=""><input id="de1" type="hidden" value=""></p></div></li>';
        str += '<li data-i="1" class="'+(M_Init._dateCache.dateType == 1 ? "selected" : "")+'">今天</li>';
        str += '<li data-i="-1" class="'+(M_Init._dateCache.dateType == -1 ? "selected" : "")+'">昨天</li>';
        str += '<li data-i="-7" class="'+(M_Init._dateCache.dateType == -7 ? "selected" : "")+'">最近一周</li>';
        str += '<li data-i="-30" class="'+(M_Init._dateCache.dateType == -30 ? "selected" : "")+'">最近一个月</li>';
        str += '<li data-i="-90" class="'+(M_Init._dateCache.dateType == -90 ? "selected" : "")+'">最近三个月</li>';
        str += '</ul>';
        str += '</div>';
        str += '<div>';
        str += '<span>主题</span>';
        str += '<ul id="bs_condition_topic">';
        if(M_Init._dataCache['classifyData']){
            for(var i=0;i<M_Init._dataCache['classifyData'].length;i++){
                str += '<li class="'+((M_Init._dataCache['lighttower_classify'] && M_Init._dataCache['lighttower_classify'] == M_Init._dataCache['classifyData'][i]) ? "selected" : "")+'" data-i="'+M_Init._dataCache['classifyData'][i]+'">'+M_Init._dataCache['classifyData'][i]+'</li>';
            }
        }
        str += '</ul>';
        str += '</div>';
        str += '<div>';
        str += '<span>情感</span>';
        str += '<ul id="bs_condition_emotion">';
        str += '<li class="'+((M_Init._dataCache['classify_sentiment'] && M_Init._dataCache['classify_sentiment'] == 1) ? "selected" : "")+'" data-i="1">正面情感帖</li>';
        str += '<li class="'+((M_Init._dataCache['classify_sentiment'] && M_Init._dataCache['classify_sentiment'] == -1) ? "selected" : "")+'" data-i="-1">负面情感帖</li>';
        str += '</ul>';
        str += '</div>';
        str += '<div class="keyword">';
        str += '<span>关键词</span>';
        str += '<ul id="bs_condition_keyword">';
        str += '<li><input type="text" placeholder="搜索关键词，多个关键词用空格隔开" value="'+(M_Init._searchKeyword || '')+'"></li>';
        str += '<li><button class="tg-main-btn">搜索</button></li>';
        str += '</ul>';
        str += '</div></div>';

        str += '<div class="article-list">';
        str += '<div class="top"><i class="tg-icon sort-icon" id="bs_sort_reply"></i><span>按发帖时间排序</span></div>';
        str += '<ul class="left-list boxshadow">';
        str += '<div class="scroll-wrap" id="lt_forum_list"><ul></ul></div>';
        str += '<ul class="tg-page-list" id="lt_forum_page"></ul>';
        str += '</ul>';
        str += '<ul class="detail-right">';
        str += '<div class="scroll-wrap" id="lt_forum_detail"><h5></h5><li class="boxshadow first-floor"></li><li class="boxshadow second-floor"></li></div>';
        str += '</ul>';
        str += '</div>';

        str += '</div>';
        str += '</div>';

        return str;
    },
    _getInfo:function () {
        M_ForumList._postData.data = {};
        M_ForumList._postData.type = 'post';
        M_Init._gameId = M_Init._gameDetailId;
        if(M_Init._dataCache['info_id_list'] && M_Init._dataCache['info_id_list'] != 0)M_ForumList._postData.data.info_id_list = M_Init._dataCache['info_id_list'];
        if(M_Init._dataCache['lighttower_classify'])M_ForumList._postData.data.lighttower_classify = M_Init._dataCache['lighttower_classify'];
        if(M_Init._dataCache['topic_id'])M_ForumList._postData.data.topic_id = M_Init._dataCache['topic_id'];
        if(M_Init._dataCache['classify_sentiment'])M_ForumList._postData.data.classify_sentiment = M_Init._dataCache['classify_sentiment'];
        if(M_Init._dataCache['real_tag'])M_ForumList._postData.data.real_tag = M_Init._dataCache['real_tag'];
        if(M_Init._dataCache['sentiment_score'])M_ForumList._postData.data.sentiment_score = M_Init._dataCache['sentiment_score'];
        M_ForumList._postData.data.begin = M_Init._dateCache.begin;
        M_ForumList._postData.data.end = M_Init._dateCache.end;
        M_ForumList._postData.data.order_field = M_Init._dataCache['order_field'] ? M_Init._dataCache['order_field'] : 'publish_time';
        M_ForumList._postData.data.order_by = M_Init._dataCache['order_by'] ? M_Init._dataCache['order_by'] : 'desc';
        if(M_Init._searchKeyword)M_ForumList._postData.data.word = M_Init._searchKeyword;
        M_ForumList._getList(1);
    }
}