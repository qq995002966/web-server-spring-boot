require(["frontmain"],function(){require(["jquery","layer","perfect-scrollbar.jquery.min","base","front","store.min","background","app/outside"],function(){store=require("store.min"),F_GameDetail_Entrance._init()})});var F_GameDetail_Entrance={_init:function(){if(B_Login._checkUpdate(),B_User._isDemoUser())B_Login._openLogin("background");else{var t="",a=[];if(t=B_Common._getUrl("query"),!t.g||isNaN(t.g))return void F_GameDetail_Info._domError();var e=B_Game._getGame([t.g],1);if(!e||!e[t.g])return void F_GameDetail_Info._domError();if(a.push(e[t.g][1]),M_Init._gameId=t.g,!(t.z&&$.inArray(t.z,["bbs","channel","suddenly"])>-1))return void F_GameDetail_Info._domError();if(t.s){switch(t.s+""){case"-1":a.push("负面反馈");break;case"0":a.push("中性反馈");break;case"1":a.push("正面反馈")}M_Init._dataCache.classify_sentiment=t.s}if(t.ts){switch(t.ts+""){case"-1":a.push("负面情感帖");break;case"0":a.push("中性帖子");break;case"1":a.push("正面情感帖");break;case"100":a.push("全部帖子")}t.ts+""!="100"&&(M_Init._dataCache.classify_sentiment=t.ts)}if(t.notitle&&(M_Init._dataCache.only_query_title=!0),t.w&&(t.w=B_Common._decodeUrl(t.w),a.push(t.w),M_Init._searchKeyword=t.w),t.a){t.a=B_Common._decodeUrl(t.a);var _=t.a.split("/");if(2==_.length)switch(_[1]+""){case"1":a.push("正面");break;case"-1":a.push("负面")}M_AppCommentList._keywords=_[0],a.push(_[0]),M_Init._dataCache.sentiment_keywords=t.a}t.f&&(M_Init._dataCache.info_id_list=t.f),t.c&&(t.c=B_Common._decodeUrl(t.c),a.push(t.c),M_Init._dataCache.lighttower_classify=t.c),t.r&&(t.r=B_Common._decodeUrl(t.r),M_Init._dataCache.real_tag=t.r),t.t&&(t.t=B_Common._decodeUrl(t.t),a.push(t.t),M_Init._dataCache.topic_id=t.t),t.o&&(M_Init._dataCache.sentiment_score=t.o),t.l&&(M_Init._dataCache.source_type_list=t.l),t.n&&(M_Init._dataCache.es_field_name=t.n),t.v&&(M_Init._dataCache.es_field_val=t.v),t.s_n&&a.push(B_Common._decodeUrl(t.s_n)+"类问题"),t.d&&(t.d=B_Common._decodeUrl(t.d),a.push(t.d),M_Init._dataCache.data_date=t.d),t.p&&(t.p=B_Common._decodeUrl(t.p),M_Init._dataCache.sub_type=t.p),t.forum&&(t.forum=B_Common._decodeUrl(t.forum),a.push(t.forum)),t.show&&(t.show=B_Common._decodeUrl(t.show),a.push(t.show)),"suddenly"!=t.z&&(t.b&&t.e?(M_Init._dateCache.begin=t.b,M_Init._dateCache.end=t.e):(M_Init._dateCache.begin=B_Date._getDiffDate(null,-29),M_Init._dateCache.end=B_Date._getDiffDate(null,0)),a.push(M_Init._dateCache.begin+" 到 "+M_Init._dateCache.end)),a=a.join(" , "),F_GameDetail_Info._domInit(t.z,a)}}},F_GameDetail_Info={_openClose:function(){$("#closeArticlePop").click(function(){parent.$("#bs_open_more").children("iframe").removeClass("iframe-more-date iframe-more-date-ie").addClass("iframe-more-date-hide")})},_domError:function(){var t="";t+='<div id="closeArticlePop">点击关闭</div>',$("#contentPart").html(t),F_GameDetail_Info._openClose()},_domInit:function(t,a){var e="";switch(e+='<div class="blockpart article-pop comment-pop col-lg-12 col-md-12 col-sm-12 col-xs-12">',e+='<div class="close-article-pop" id="closeArticlePop">×</div>',e+="<h3>筛选条件： "+a+"</h3>",e+='<div class="boxshadow article-pop-content">',t){case"bbs":case"suddenly":e+=F_GameDetail_Info._htmlBbs();break;case"channel":e+=F_GameDetail_Info._htmlChannel()}switch(e+="</div>",e+="</div>",$("#contentPart").html(e),F_GameDetail_Info._openClose(),t){case"suddenly":F_GameDetail_Info._getSunddlyInfo();break;case"bbs":F_GameDetail_Info._getBbsInfo();break;case"channel":F_GameDetail_Info._getChannelInfo()}},_htmlBbs:function(){var t="";return t+='            <ul class="article-list">                <ul class="left-list boxshadow">                    <div class="scroll-wrap" id="lt_forum_list"></div>                     <ul class="tg-page-list" id="lt_forum_page"></ul>                </ul>                <ul class="detail-right"><div class="scroll-wrap" id="lt_forum_detail"></div></ul>            </div>'},_htmlChannel:function(){var t="";return t+='            <div class="article-list " id="allComment">                <ul class="detail-right">                    <div class="scroll-wrap" id="lt_forum_list"></div>                    <ul class="tg-page-list" id="lt_forum_page"></ul>                </ul>            </div>'},_getSunddlyInfo:function(){M_ForumList._postData.data={},M_ForumList._postData.type="suddenly",M_ForumList._postData.data.sub_type=M_Init._dataCache.sub_type,M_ForumList._postData.data.data_date=M_Init._dataCache.data_date,M_ForumList._getList(1)},_getBbsInfo:function(){M_ForumList._postData.data={},M_ForumList._postData.type="post",M_Init._dataCache.info_id_list&&0!=M_Init._dataCache.info_id_list&&(M_ForumList._postData.data.info_id_list=M_Init._dataCache.info_id_list),M_Init._dataCache.lighttower_classify&&(M_ForumList._postData.data.lighttower_classify=M_Init._dataCache.lighttower_classify),M_Init._dataCache.topic_id&&(M_ForumList._postData.data.topic_id=M_Init._dataCache.topic_id),M_Init._dataCache.classify_sentiment&&(M_ForumList._postData.data.classify_sentiment=M_Init._dataCache.classify_sentiment),M_Init._dataCache.real_tag&&(M_ForumList._postData.data.real_tag=M_Init._dataCache.real_tag),M_Init._dataCache.sentiment_score&&(M_ForumList._postData.data.sentiment_score=M_Init._dataCache.sentiment_score),M_ForumList._postData.data.begin=M_Init._dateCache.begin,M_ForumList._postData.data.end=M_Init._dateCache.end,M_ForumList._postData.data.order_field=M_Init._dataCache.order_field?M_Init._dataCache.order_field:"publish_time",M_ForumList._postData.data.order_by=M_Init._dataCache.order_by?M_Init._dataCache.order_by:"desc",M_Init._searchKeyword&&(M_ForumList._postData.data.word=M_Init._searchKeyword),M_ForumList._getList(1)},_getChannelInfo:function(){if(M_AppCommentList._postData.data={},M_AppCommentList._postData.type="comment",M_Init._dataCache.source_type_list&&0!=M_Init._dataCache.source_type_list&&(M_AppCommentList._postData.data.source_type_list=M_Init._dataCache.source_type_list),M_Init._dataCache.rating_stage_list){switch(M_Init._dataCache.rating_stage_list+""){case"1":M_Init._dataCache.rating_stage_list="好评";break;case"-1":M_Init._dataCache.rating_stage_list="差评"}M_AppCommentList._postData.data.rating_stage_list=M_Init._dataCache.rating_stage_list}M_Init._dataCache.es_field_name&&(M_AppCommentList._postData.data.es_field_name=M_Init._dataCache.es_field_name),M_Init._dataCache.es_field_val&&(M_AppCommentList._postData.data.es_field_val=M_Init._dataCache.es_field_val),M_Init._dataCache.sentiment_keywords&&(M_AppCommentList._postData.data.sentiment_keywords=M_Init._dataCache.sentiment_keywords),M_AppCommentList._postData.data.begin=M_Init._dateCache.begin,M_AppCommentList._postData.data.end=M_Init._dateCache.end,M_AppCommentList._postData.data.order_field=M_Init._dataCache.order_field?M_Init._dataCache.order_field:"publish_time",M_AppCommentList._postData.data.order_by=M_Init._dataCache.order_by?M_Init._dataCache.order_by:"desc",M_Init._searchKeyword&&(M_AppCommentList._postData.data.word=M_Init._searchKeyword),M_AppCommentList._getList(1)}};