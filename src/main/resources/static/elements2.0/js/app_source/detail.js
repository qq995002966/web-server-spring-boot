require(['frontmain'], function () {
    require(['jquery','layer','perfect-scrollbar.jquery.min','base','front','store.min','background','app/outside'], function (){
        store = require('store.min');
        F_GameDetail_Entrance._init();
    });
});
var F_GameDetail_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            var $_GET = '';
            var condition = [];
            $_GET = B_Common._getUrl('query');
            if($_GET.g && !isNaN($_GET.g)){
                var game = B_Game._getGame([$_GET.g],1);
                if(game && game[$_GET.g]){
                    condition.push(game[$_GET.g][1]);
                }else{
                    F_GameDetail_Info._domError();
                    return;
                }
                M_Init._gameId = $_GET.g;
            }else{
                F_GameDetail_Info._domError();
                return;
            }
            if(!($_GET.z && $.inArray($_GET.z,['bbs','channel','suddenly']) > -1)){
                F_GameDetail_Info._domError();
                return;
            }
            if($_GET.s){
                switch ($_GET.s+''){
                    case '-1':
                        condition.push('负面反馈');
                        break;
                    case '0':
                        condition.push('中性反馈');
                        break;
                    case '1':
                        condition.push('正面反馈');
                        break;
                }
                M_Init._dataCache['classify_sentiment'] = $_GET.s;
            }

            if($_GET.ts){
                switch ($_GET.ts+''){
                    case '-1':
                        condition.push('负面情感帖');
                        break;
                    case '0':
                        condition.push('中性帖子');
                        break;
                    case '1':
                        condition.push('正面情感帖');
                        break;
                    case '100':
                        condition.push('全部帖子');
                        break;
                }
                if($_GET.ts+'' != '100'){
                    M_Init._dataCache['classify_sentiment'] = $_GET.ts;
                }
            }

            if($_GET.notitle){
                M_Init._dataCache['only_query_title'] = true;
            }

            if($_GET.w){
                $_GET.w = B_Common._decodeUrl($_GET.w)
                condition.push($_GET.w);
                M_Init._searchKeyword = $_GET.w;
            }
            if($_GET.a){
                $_GET.a = B_Common._decodeUrl($_GET.a);
                var split = ($_GET.a).split('/');
                if(split.length == 2){
                    switch (split[1]+''){
                        case '1':
                            condition.push('正面');
                            break;
                        case '-1':
                            condition.push('负面');
                            break;
                    }
                }
                M_AppCommentList._keywords = split[0];
                condition.push(split[0]);

                M_Init._dataCache['sentiment_keywords'] = $_GET.a;
            }
            if($_GET.f){
                M_Init._dataCache['info_id_list'] = $_GET.f;
            }
            if($_GET.c){
                $_GET.c = B_Common._decodeUrl($_GET.c)
                condition.push($_GET.c);
                M_Init._dataCache['lighttower_classify'] = $_GET.c;
            }
            if($_GET.r){
                $_GET.r = B_Common._decodeUrl($_GET.r);
                M_Init._dataCache['real_tag'] = $_GET.r;
            }
            if($_GET.t){
                $_GET.t = B_Common._decodeUrl($_GET.t)
                condition.push($_GET.t);
                M_Init._dataCache['topic_id'] = $_GET.t;
            }
            if($_GET.o){
                M_Init._dataCache['sentiment_score'] = $_GET.o;
            }
            if($_GET.l){
                M_Init._dataCache['source_type_list'] = $_GET.l;
            }
            if($_GET.n){
                M_Init._dataCache['es_field_name'] = $_GET.n;
            }
            if($_GET.v){
                M_Init._dataCache['es_field_val'] = $_GET.v;
            }
            if($_GET.s_n){
                condition.push(B_Common._decodeUrl($_GET.s_n)+'类问题');
            }
            if($_GET.d){
                $_GET.d = B_Common._decodeUrl($_GET.d)
                condition.push($_GET.d);
                M_Init._dataCache['data_date'] = $_GET.d;
            }
            if($_GET.p){
                $_GET.p = B_Common._decodeUrl($_GET.p)
                M_Init._dataCache['sub_type'] = $_GET.p;
            }
            if($_GET.forum){
                $_GET.forum = B_Common._decodeUrl($_GET.forum);
                condition.push($_GET.forum);
            }
            if($_GET.show){
                $_GET.show = B_Common._decodeUrl($_GET.show);
                condition.push($_GET.show);
            }
            if($_GET.z != 'suddenly'){
                if($_GET.b && $_GET.e){
                    M_Init._dateCache.begin = $_GET.b;
                    M_Init._dateCache.end = $_GET.e;
                }else{
                    M_Init._dateCache.begin = B_Date._getDiffDate(null,-29);
                    M_Init._dateCache.end = B_Date._getDiffDate(null,0);
                }
                condition.push(M_Init._dateCache.begin+' 到 '+M_Init._dateCache.end);
            }

            condition = condition.join(' , ');
            F_GameDetail_Info._domInit($_GET.z,condition);
        }
    }
}

var F_GameDetail_Info = {
    _openClose:function () {
        $('#closeArticlePop').click(function () {
            parent.$('#bs_open_more').children('iframe').removeClass('iframe-more-date iframe-more-date-ie').addClass('iframe-more-date-hide');
        });
    },
    _domError:function () {
        var str = '';
        str += '<div id="closeArticlePop">点击关闭</div>';
        $('#contentPart').html(str);
        F_GameDetail_Info._openClose();
    },
    _domInit:function (type,condition) {
        var str = '';
        str += '<div class="blockpart article-pop comment-pop col-lg-12 col-md-12 col-sm-12 col-xs-12">';
        str += '<div class="close-article-pop" id="closeArticlePop">×</div>';
        str += '<h3>筛选条件： '+condition+'</h3>';
        str += '<div class="boxshadow article-pop-content">';
        switch (type){
            case 'bbs':
            case 'suddenly':
                str += F_GameDetail_Info._htmlBbs();
                break;
            case 'channel':
                str += F_GameDetail_Info._htmlChannel();
                break;
        }
        str += '</div>';
        str += '</div>';
        $('#contentPart').html(str);

        F_GameDetail_Info._openClose();

        switch (type){
            case 'suddenly':
                F_GameDetail_Info._getSunddlyInfo();
                break;
            case 'bbs':
                F_GameDetail_Info._getBbsInfo();
                break;
            case 'channel':
                F_GameDetail_Info._getChannelInfo();
                break;
        }

    },
    _htmlBbs:function () {
        var str = '';
        str += '\
            <ul class="article-list">\
                <ul class="left-list boxshadow">\
                    <div class="scroll-wrap" id="lt_forum_list"></div>\
                     <ul class="tg-page-list" id="lt_forum_page"></ul>\
                </ul>\
                <ul class="detail-right"><div class="scroll-wrap" id="lt_forum_detail"></div></ul>\
            </div>';

        return str;
    },
    _htmlChannel:function () {
        var str = '';
        str += '\
            <div class="article-list " id="allComment">\
                <ul class="detail-right">\
                    <div class="scroll-wrap" id="lt_forum_list"></div>\
                    <ul class="tg-page-list" id="lt_forum_page"></ul>\
                </ul>\
            </div>';

        return str;
    },
    _getSunddlyInfo:function () {
        M_ForumList._postData.data = {};
        M_ForumList._postData.type = 'suddenly';
        M_ForumList._postData.data.sub_type = M_Init._dataCache['sub_type'];
        M_ForumList._postData.data.data_date = M_Init._dataCache['data_date'];
        M_ForumList._getList(1);
    },
    _getBbsInfo:function () {
        M_ForumList._postData.data = {};
        M_ForumList._postData.type = 'post';
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
    },
    _getChannelInfo:function () {
        M_AppCommentList._postData.data = {};
        M_AppCommentList._postData.type = 'comment';
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