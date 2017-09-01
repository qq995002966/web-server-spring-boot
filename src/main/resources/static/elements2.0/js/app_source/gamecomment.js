var F_GameComment_Entrance = {
    _init:function (keyword) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-6');
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
                if(!M_Init._gameDetailId) {
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
                M_Init._dataCache['source_type_list'] = $_GET.f;
            }
            if($_GET.n){
                M_Init._dataCache['es_field_name'] = B_Common._decodeUrl($_GET.n);
            }
            if($_GET.v){
                M_Init._dataCache['es_field_val'] = B_Common._decodeUrl($_GET.v);
            }
            if($_GET.s){
                M_Init._dataCache['rating_stage_list'] = $_GET.s;
            }
            if($_GET.w && $_GET.wt){
                M_Init._dataCache['sentiment_keywords'] = B_Common._decodeUrl($_GET.w)+'/'+$_GET.wt;
            }
            M_Game._checkGameVisitList('gameComment');
            //M_Game._getGame();
            //F_GameComment_Info._getSource();
        }
    }
}

var F_GameComment_Info = {
    _domInit:function () {
        $('#ct_main_area').html(F_GameComment_Info._htmlCondition());
        M_Outside._searchPop();
        $('#bs_condition_forum li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['source_type_list'] = $(this).attr('data-i');
                    F_GameComment_Info._getInfo();
                }
            });
        });
        $('#bs_condition_emotion li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['rating_stage_list'] = $(this).attr('data-i');
                }else{
                    $(this).removeClass('selected');
                    M_Init._dataCache['rating_stage_list'] = '';
                }
                F_GameComment_Info._getInfo();
            });
        });
        $('#bs_condition_keyword button').click(function () {
            var keyword = $.trim($('#bs_condition_keyword input').val());
            if(M_Init._searchKeyword == '' && keyword == ''){
                B_Pop._init('msg',{'content':'搜索关键词必须填写，请确认！'});
            }else{
                M_Init._searchKeyword = keyword;
                F_GameComment_Info._getInfo();
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
                    F_GameComment_Info._getInfo();
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
                F_GameComment_Info._getInfo();
            }
        });
        F_GameComment_Info._getInfo();
    },
    _getSource:function () {
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('crawlerInfoApps','get',true,postData,null,null,function(data,msg){
                if(data && data.apps_list && data.apps_list.length > 0){
                    M_Init._dataCache['appData'] = data.apps_list;
                    F_GameComment_Info._domInit();
                }else{
                    $('#ct_main_area').html(B_Pre._empty('暂无数据'));
                }
            },null
        )
    },
    _htmlCondition:function () {
        var str = '';
        str += '<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12"><h3 class="part-title">全网评论</h3>';
        str += '<div class="boxshadow">';

        str += '<div class="factor-filter-part">';
        str += '<div>';
        str += '<span>渠道</span>';
        str += '<ul id="bs_condition_forum">';
        str += '<li class="'+(!M_Init._dataCache['source_type_list'] ? "selected" : "")+'" data-i="0"> 全部渠道</li>';
        if(M_Init._dataCache['appData']){
            for(var i=0;i<M_Init._dataCache['appData'].length;i++) {
                var source = B_Game._source(M_Init._dataCache['appData'][i].source_type);
                if(source){
                    str += '<li class="' + ((M_Init._dataCache['source_type_list'] && M_Init._dataCache['source_type_list'] == M_Init._dataCache['appData'][i].source_type) ? "selected" : "") + '" data-i="' + M_Init._dataCache['appData'][i].source_type+ '">' + source.source_desc + '</li>';
                }
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
        str += '<span>情感</span>';
        str += '<ul id="bs_condition_emotion">';
        str += '<li class="'+((M_Init._dataCache['rating_stage_list'] && M_Init._dataCache['rating_stage_list'] == 1) ? "selected" : "")+'" data-i="1">正面评论</li>';
        str += '<li class="'+((M_Init._dataCache['rating_stage_list'] && M_Init._dataCache['rating_stage_list'] == -1) ? "selected" : "")+'" data-i="-1">负面评论</li>';
        str += '</ul>';
        str += '</div>';
        str += '<div class="keyword">';
        str += '<span>关键词</span>';
        str += '<ul id="bs_condition_keyword">';
        str += '<li><input type="text" placeholder="搜索关键词，多个关键词用空格隔开" value="'+(M_Init._searchKeyword || '')+'"></li>';
        str += '<li><button class="tg-main-btn">搜索</button></li>';
        str += '</ul>';
        str += '</div></div>';

        str += '<div class="article-list" id="allComment">';
        str += '<ul class="detail-right">';
        str += '<div class="scroll-wrap" id="lt_forum_list"></div>';
        str += '<ul class="tg-page-list" id="lt_forum_page"></ul>';
        str += '</ul>';
        str += '</div>';

        str += '</div>';
        str += '</div>';

        return str;
    },
    _getInfo:function () {
        M_AppCommentList._postData.data = {};
        M_AppCommentList._postData.type = 'comment';
        M_Init._gameId = M_Init._gameDetailId;
        if(M_Init._dataCache['source_type_list'] && M_Init._dataCache['source_type_list'] != 0)M_AppCommentList._postData.data.source_type_list = M_Init._dataCache['source_type_list'];
        if(M_Init._dataCache['rating_stage_list']){
            switch(M_Init._dataCache['rating_stage_list']+''){
                case '1':
                    M_Init._dataCache['rating_stage_list'] = '好评';
                    break;
                case '-1':
                    M_Init._dataCache['rating_stage_list'] = '差评';
                    break;
            }
            M_AppCommentList._postData.data.rating_stage_list = M_Init._dataCache['rating_stage_list'];
        }
        if(M_Init._dataCache['es_field_name'])M_AppCommentList._postData.data.es_field_name = M_Init._dataCache['es_field_name'];
        if(M_Init._dataCache['es_field_val'])M_AppCommentList._postData.data.es_field_val = M_Init._dataCache['es_field_val'];
        if(M_Init._dataCache['sentiment_keywords'])M_AppCommentList._postData.data.sentiment_keywords = M_Init._dataCache['sentiment_keywords'];
        M_AppCommentList._postData.data.begin = M_Init._dateCache.begin;
        M_AppCommentList._postData.data.end = M_Init._dateCache.end;
        M_AppCommentList._postData.data.order_field = M_Init._dataCache['order_field'] ? M_Init._dataCache['order_field'] : 'publish_time';
        M_AppCommentList._postData.data.order_by = M_Init._dataCache['order_by'] ? M_Init._dataCache['order_by'] : 'desc';
        if(M_Init._searchKeyword)M_AppCommentList._postData.data.word = M_Init._searchKeyword;
        M_AppCommentList._getList(1);
    }
}