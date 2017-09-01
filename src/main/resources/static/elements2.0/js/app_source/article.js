require(['frontmain'], function () {
    require(['jquery','layer','perfect-scrollbar.jquery.min','base','front','store.min','app/outside'], function (){
        store = require('store.min');
        F_Article_Entrance._init();
    });
});
var F_Article_Entrance = {
    _init:function () {
        B_Login._check();
        S_HeadFoot._getHead();
        S_HeadFoot._htmlPaper();
        var controller = B_Common._getUrl('controller');
        var $_GET = B_Common._getUrl('query');
        switch(controller){
            case 'article':
                F_Article_List._init($_GET);
                B_AD._ad('ad_1');
                B_AD._ad('ad_2');
                break;
            case 'detail':
                F_Article_Detail._init($_GET);
                break;
        }
    }
}
var F_Article_Detail = {
    _init:function ($_GET) {
        if($_GET.t){
            $_GET.t = B_Common._decodeUrl($_GET.t);
            F_Detail_Info._getData($_GET.t);
            F_Article_Info._getData('recent',1,6);
            F_Detail_Relation._getData($_GET.t);
            F_Article_Common._cache['selectedClassifyBig'] = '人物';
            F_Article_Info._getData('recommend_classify',1,6);
            F_Detail_Relation._clickTab();
        }else{
            $('#bs_detail').html('');
        }
    }
}
var F_Detail_Info = {
    _htmlDetail:function (data) {
        var str = '';
        if(data.image_list && data.image_list.length>0)B_Common._imgBuff(data.image_list);
        var content = B_Common._htmlUnicodeTagScriptEscape(data.raw_html_content);
        try{
            content = eval("'" + content + "'");
        }catch(e){
            content = unescape(content.replace(/\u/g, "%u"));
        }
        content = B_Common._htmlspecialchars_decode(content);
        content = B_Common._htmlTagScriptEscape(content);

        str += '<div class="title">';
        str += '<h3>'+data.title+'</h3>';
        str += '<span>'+S_Article._getSource(data.source)+'</span>';
        str += '<span>'+data.post_date+'</span>';
        str += '<a href="'+(data.url)+'" target="_blank">查看原文</a>';
        str += '</div>';
        str += content;

        setTimeout(function(){
            $('#bs_detail').html(str);
        },200);
    },
    _getData:function (id) {
        var dom = $('#bs_detail');
        var postData = {};
        postData['title'] = id;
        postData = B_Common._postData(postData);
        B_Port._ajax('articleDetail','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.data && data.data.list){
                    F_Detail_Info._htmlDetail(data.data.list[0].source)
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    }
}
var F_Article_List = {
    _init:function ($_GET) {
        if(!$_GET.t)$_GET.t = 'top';
        F_Article_Common._cache = {'condition':[]};
        var listType = '';
        switch($_GET.t){
            case 'topic':
                $('.daily-news .left').hide();
                $('.daily-news .right').css({'margin-left':0});
                if($_GET.n){
                    $('#bs_title').html(B_Common._decodeUrl($_GET.n));
                }
                if($_GET.d){
                    F_Article_Common._cache['condition']['topic_id'] = $_GET.d;
                }
                if($_GET.b){
                    F_Article_Common._cache['condition']['data_date_start'] = $_GET.b;
                }
                if($_GET.e){
                    F_Article_Common._cache['condition']['data_date_end'] = $_GET.e;
                }
                listType = 'list_topic';
                break;
            case 'classify':
                if($_GET.m){
                    $_GET.m = B_Common._decodeUrl($_GET.m);
                    F_Article_Common._cache['selectedClassifyBig'] = $_GET.m;
                    if($_GET.s){
                        $_GET.s = B_Common._decodeUrl($_GET.s);
                        F_Article_Common._cache['selectedClassifySmall'] = $_GET.s;
                    }
                }
                listType = 'list_classify';
                break;
            case 'top':
                F_Article_Common._cache['selectedClassifyBig'] = '头条';
                listType = 'list_top';
                break;
            case 'hot':
                F_Article_Common._cache['selectedClassifyBig'] = '热门';
                listType = 'list_recent';
                break;
        }
        F_Article_Info._getData(listType,1,20);

        F_Article_Common._cache['classify'] = S_Article._getClassify();
        F_Article_Common._htmlMenuFirst();

        F_Article_trend._getData();
        F_Article_Info._getData('top',1,9);
        F_Article_Keypoint._getData();
        F_Article_HotWord._getData();
        setTimeout(function () {
            F_Article_Info._getData('recent',1,6);
        },300);
    }
}
var F_Article_Common = {
    _cache:{'condition':{}},
    _htmlMenuFirst:function () {
        var menuInit = ['头条','热门','公司','前沿','研发','行业','电竞','人物'];
        var dataUnion = F_Article_Common._cache['classify'];
        var str = '';
        var useClass = '';
        var hasSub = false;
        if(!F_Article_Common._cache['selectedClassifyBig'])F_Article_Common._cache['selectedClassifyBig'] = '头条';
        for(var i=0;i<menuInit.length;i++){
            switch(menuInit[i]){
                case '头条':
                    useClass = 'h_qkTb13';
                    break;
                case '热门':
                    useClass = 'h_qkTb12';
                    break;
                default:
                    useClass = dataUnion[menuInit[i]] ? dataUnion[menuInit[i]]['img'].styleClass : '';
                    break;
            }
            str += '<li data-i="'+menuInit[i]+'"';
            if(F_Article_Common._cache['selectedClassifyBig'] && F_Article_Common._cache['selectedClassifyBig'] == menuInit[i]){
                str += ' class="selected"><i class="'+useClass+' b_img"></i>'+menuInit[i]+'<i class="triangle-icon tf-icon"></i></li>';
                F_Article_Common._htmlMenuSecond(menuInit[i]);
            }else{
                str += '"><i class="'+useClass+' b_img"></i>'+menuInit[i]+'</li>';
            }
        }
        $('.daily-news .left').html(str);

        F_Article_Common._clickBig();
    },
    _htmlMenuSecond:function (big) {
        var dataUnion = F_Article_Common._cache['classify'];
        var dom = $('.daily-news .right .tab-change');
        if(dataUnion[big] && dataUnion[big]['sub'] && dataUnion[big]['sub'].length > 1){
            dataUnion = dataUnion[big]['sub'];
            var str = '';
            var hasSelected = false;
            for(var i=0;i<dataUnion.length;i++){
                if(F_Article_Common._cache['selectedClassifySmall'] && F_Article_Common._cache['selectedClassifySmall'] == dataUnion[i].sub_class){
                    hasSelected = true;
                    str += '<span class="selected">'+dataUnion[i].sub_class+'</span>';
                }else{
                    str += '<span>'+dataUnion[i].sub_class+'</span>';
                }
            }
            if(hasSelected){
                str = '<span>全部</span>'+str;
            }else{
                str = '<span class="selected">全部</span>'+str;
            }
            dom.html(str);
            F_Article_Common._clickSmall();
            dom.show();
        }else{
            dom.hide();
        }
    },
    _clickBig:function () {
        $('.daily-news .left li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    $(this).siblings('li').find('.triangle-icon').remove();
                    $(this).append('<i class="triangle-icon tf-icon"></i>');

                    var classify = $(this).attr('data-i');
                    F_Article_Common._htmlMenuSecond(classify);
                    F_Article_Common._cache['selectedClassifyBig'] = classify;
                    F_Article_Common._cache['selectedClassifySmall'] = '';
                    switch(classify){
                        case '头条':
                            F_Article_Info._getData('list_top',1,20);
                            break;
                        case '热门':
                            F_Article_Info._getData('list_recent',1,20);
                            break;
                        default:
                            F_Article_Common._cache['selectedClassifyBig'] = classify;
                            F_Article_Info._getData('list_classify',1,20);
                            break;
                    }
                }
            });
        });
    },
    _clickSmall:function () {
        $('.daily-news .right .tab-change span').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('span').removeClass('selected');
                    switch(index+''){
                        case '0':
                            F_Article_Common._cache['selectedClassifySmall'] = '';
                            break;
                        default:
                            F_Article_Common._cache['selectedClassifySmall'] = $(this).html();
                            break;
                    }
                    F_Article_Info._getData('list_classify',1,20);
                }
            });
        });
    },
    _clickMore:function () {
        $('#bs_article_more').click(function () {
            var page = $(this).attr('data-p');
            var type = $(this).attr('data-t');
            page = parseInt(page)+1;
            $(this).attr('data-p',page);
            F_Article_Info._getData(type,page,20,true);
        });
    }
}
var F_Article_Info = {
    _getCondition:function (from,page,limit,data) {
        var postData = {};
        limit = limit || B_Page._size;
        switch (from){
            case 'top':
            case 'list_top':
                postData['data_date_start'] = B_Date._getDiffDate(null,-1);
                postData['data_date_end'] = B_Date._getDiffDate(null,0);
                postData['order_by_field'] = 'post_date,score';
                postData['order_type'] = 'desc,desc';
                postData['need_preview'] = '1';
                postData['index'] = (page-1)*limit;
                postData['limit'] = limit;
                break;
            case 'recent':
            case 'list_recent':
                postData['data_date_start'] = B_Date._getDiffDate(null,-7);
                postData['data_date_end'] = B_Date._getDiffDate(null,0);
                postData['order_by_field'] = 'score';
                postData['order_type'] = 'desc';
                postData['need_preview'] = '1';
                postData['index'] = (page-1)*limit;
                postData['limit'] = limit;
                break;
            case 'relation':
                postData['ignore_bad'] = '1';
                postData['title_only'] = '1';
                postData['need_preview'] = '1';
                postData['keyword'] = data.keyword;
                postData['index'] = (page-1)*limit;
                postData['limit'] = limit;
                break;
            case 'list_classify':
            case 'recommend_classify':
                postData['main_class'] = F_Article_Common._cache['selectedClassifyBig'];
                if(F_Article_Common._cache['selectedClassifySmall']){
                    postData['sub_class'] = F_Article_Common._cache['selectedClassifySmall'];
                }
                postData['need_preview'] = '1';
                postData['index'] = (page-1)*limit;
                postData['limit'] = limit;
                break;
            default:
                if(F_Article_Common._cache['condition']){
                    postData = F_Article_Common._cache['condition'];
                }
                postData['need_preview'] = '1';
                postData['index'] = (page-1)*limit;
                postData['limit'] = limit;
                break;
        }
        return B_Common._postData(postData)
    },
    _htmlTop:function (data) {
        var param = [];
        var str = '<ul>';
        for(var i=0;i<data.length;i++){
            if(!data[i].source.main_class){
                data[i].source.main_class = '其他';
            }
            if(F_Article_Common._cache['classify'][data[i].source.main_class]){
                param = F_Article_Common._cache['classify'][data[i].source.main_class];
            }else{
                param = F_Article_Common._cache['classify']['其他'];
            }
            str += '<li>';
            str += '<a href="'+S_Article._detailUrl(data[i].id)+'" target="_blank">';
            str += S_Article._previewImg(data[i].source.preview_img,data[i].source.source);
            str += '</a>';
            str += '<div class="des">';
            str += '<p><a href="'+S_Article._detailUrl(data[i].id)+'" target="_blank" title="'+(data[i].source.title)+'">'+(data[i].source.title)+'</a></p>';
            str += '<i class="tf-article-type-icon b_img '+param.img.styleClass+'"></i>';
            str += '<span>'+data[i].source.main_class+'</span>';
            str += '<span>'+S_Article._getSource(data[i].source.source)+'</span>';
            str += '<span>'+data[i].source.post_date+'</span>';
            str += '</div>';
            str += '</li>';
        }
        str += '</ul>';
        return str;
    },
    _htmlRelation:function (data) {
        if(data.length > 0){
            var param = [];
            var str = '<ul class="list">';
            for(var i=0;i<data.length;i++){
                if(!data[i].source.main_class){
                    data[i].source.main_class = '其他';
                }
                if(F_Article_Common._cache['classify'][data[i].source.main_class]){
                    param = F_Article_Common._cache['classify'][data[i].source.main_class];
                }else{
                    param = F_Article_Common._cache['classify']['其他'];
                }
                str += '<li>';
                str += '<p><a href="'+S_Article._detailUrl(data[i].id)+'" target="_blank" title="'+(data[i].source.title)+'">'+(data[i].source.title)+'</a></p>';
                str += '<div>';
                str += '<i class="b_img '+param.img.styleClass+'"></i>';
                str += '<span>'+data[i].source.main_class+'</span>';
                str += '<span>'+S_Article._getSource(data[i].source.source)+'</span>';
                str += '<span class="date">'+data[i].source.post_date+'</span>';
                str += '</div>';
                str += '</li>';
            }
            str += '</ul>';
        }else{
            str += B_Pre._empty('暂无数据');
        }

        return str;
    },
    _htmlRecent:function (data) {
        var str = '';
        if(data.length > 0){
            str += '<ul class="list">';
            for(var i=0;i<data.length;i++){
                if(i > 5)break;
                str += '<li>';
                str += '<a href="'+S_Article._detailUrl(data[i].id)+'" target="_blank">';
                str += S_Article._previewImg(data[i].source.preview_img,data[i].source.source);
                str += '</a>';
                str += '<p><a href="'+S_Article._detailUrl(data[i].id)+'" target="_blank" title="'+(data[i].source.title)+'">'+(data[i].source.title)+'</a></p>';
                str += '</li>';
            }
            str += '</ul>';
        }else{
            str += B_Pre._empty('暂无数据');
        }
        return str;
    },
    _htmlList:function (type,page,limit,data) {
        var str = '';
        if(data.total){
            var param = [];
            var dataUnion = data.list;
            for(var i=0;i<dataUnion.length;i++){
                if(!dataUnion[i].source.main_class){
                    dataUnion[i].source.main_class = '其他';
                }
                if(F_Article_Common._cache['classify'][dataUnion[i].source.main_class]){
                    param = F_Article_Common._cache['classify'][dataUnion[i].source.main_class];
                }else{
                    param = F_Article_Common._cache['classify']['其他'];
                }
                str += '<li>';
                str += '<a href="'+S_Article._detailUrl(dataUnion[i].id)+'" target="_blank">';
                str += S_Article._previewImg(dataUnion[i].source.preview_img,dataUnion[i].source.source);
                str += '</a>';
                str += '<div class="des">';
                str += '<h3><a href="'+S_Article._detailUrl(dataUnion[i].id)+'" target="_blank" title="'+(dataUnion[i].source.title)+'">'+(dataUnion[i].source.title)+'</a></h3>';
                str += '<p>'+(dataUnion[i].source.content)+'</p>';
                str += '<div>';
                if(param && param.img){
                    str += '<i class="'+param.img.styleClass+' b_img"></i>';
                }
                str += '<span>'+dataUnion[i].source.main_class+'</span>';
                str += '<span>'+S_Article._getSource(dataUnion[i].source.source)+'</span>';
                str += '<span class="date">'+dataUnion[i].source.post_date+'</span>';
                str += '</div>';
                str += '</div>';
                str += '</li>';
            }
            if(parseInt(data.total) > (((page-1)*limit)+limit)){
                str += '<span class="show-all-remind" data-t="'+type+'" data-p="'+page+'" id="bs_article_more" style="cursor: pointer">点击查看更多</span>';
            }else{
                str += '<span class="show-all-remind">已经是全部文章</span>';
            }
        }else{
            str = B_Pre._empty('暂无数据');
        }
        return str;
    },
    _htmlRecommend:function (data) {
        var str = '';
        for(var i=0;i<data.length;i++){
            if(i > 5)break;
            str += '<li>';
            str += '<a href="'+S_Article._detailUrl(data[i].id)+'" target="_blank" title="'+(data[i].source.title)+'">'+(data[i].source.title)+'</a>';
            str += '</li>';
        }
        return str;
    },
    _getData:function (type,page,limit,data) {
        var dom = '';
        var isClean = true;
        switch (type) {
            case 'top':
                dom = $('#bs_top_list');
                break;
            case 'recent':
                dom = $('#bs_recent_list');
                break;
            case 'relation':
                dom = $('#bs_relation_list');
                break;
            case 'list_recent':
            case 'list_top':
            case 'list_topic':
            case 'list_classify':
                isClean = data ? false : true;
                dom = $('#bs_article_list');
                break;
            case 'recommend_classify':
                dom = $('#bs_recommend_list');
                break;
        }
        var condition = F_Article_Info._getCondition(type,page,limit,data);
        B_Port._ajax('articleList','get',true,condition,function(){
                if(isClean){
                    dom.html(B_Pre._loading());
                }else{
                    $('#bs_article_more').unbind('click').html('加载中...');
                }
            },function(){
                if(isClean){
                    dom.html('');
                }else{
                    $('#bs_article_more').remove();
                }
            },function(data,msg){
                if(data.data && data.data.list){
                    switch (type) {
                        case 'top':
                            dom.html(F_Article_Info._htmlTop(data.data.list));
                            M_Outside._clickScroll($('#bs_top_choose .pre-icon'),$('#bs_top_choose .next-icon'),$('#bs_top_list ul'),'',232,3,3,'selected-btn');
                            break;
                        case 'recent':
                            dom.html(F_Article_Info._htmlRecent(data.data.list));
                            break;
                        case 'relation':
                            dom.html(F_Article_Info._htmlRelation(data.data.list));
                            dom.perfectScrollbar();
                            break;
                        case 'list_recent':
                        case 'list_top':
                        case 'list_topic':
                        case 'list_classify':
                            dom.append(F_Article_Info._htmlList(type,page,limit,data.data));
                            F_Article_Common._clickMore();
                            break;
                        case 'recommend_classify':
                            dom.append(F_Article_Info._htmlRecommend(data.data.list));
                            break;
                    }
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    }
}
var F_Article_Keypoint = {
    _clickChoose:function () {
        $('#bs_keypoint span').each(function () {
            $(this).click(function () {
                var id = $(this).attr('data-i');
                var name = $(this).html();
                B_Jump._go('openUrl',B_Jump._getUrl('search')+'?t=t&d='+B_Common._encodeUrl(id)+'&k='+B_Common._encodeUrl(name));
            });
        });
    },
    _getData:function () {
        var dom = $('#bs_keypoint');

        var postData = {};
        postData['data_date_start'] = B_Date._getDiffDate(null,-30);
        postData['data_date_end'] = B_Date._getDiffDate(null,0);
        postData = B_Common._postData(postData);
        B_Port._ajax('industryArticleTopic','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.article_topic_distri){
                    dom.html(F_Article_Keypoint._htmlList(data.article_topic_distri));
                    //dom.perfectScrollbar();
                    F_Article_Keypoint._clickChoose();
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlList:function (data) {
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<span data-i="'+data[i].topic_id+'">'+data[i].topic_keywords+'</span>';
        }
        return str;
    }
}
var F_Article_HotWord = {
    _getData:function () {
        var dom = $('.hot-word-rank');
        var domRelation = $('.relation-word-rank');
            B_Port._ajax('industryArticleHotWords','get',true,null,function(){
                dom.html(B_Pre._loading());
                domRelation.html(B_Pre._loading());
            },function(){
                dom.html('');
                domRelation.html('');
            },function(data,msg){
                if(data && data.article_hot_word_distri){
                    F_Article_Common._cache['hotWord'] = data.article_hot_word_distri;
                    var total = 0;
                    var length = data.article_hot_word_distri.length;
                    for(var i=0;i<length;i++){
                        total += parseInt(data.article_hot_word_distri[i].hot_score);
                    }
                    dom.html(F_Article_HotWord._htmlTableList(data.article_hot_word_distri,total));
                    $('#bs_keypoint_scroll').perfectScrollbar();

                    F_Article_HotWord._htmlRelationChoose(0,length);
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
                domRelation.html(B_Pre._empty(msg));
            }
        )
    },
    _clickRelation:function () {
        var dom = $('#bs_relation_rank');
        $('#bs_relation_next').click(function () {
            var index = dom.attr('data-i');
            var all = dom.attr('data-a');
            index = parseInt(index);
            all = parseInt(all);
            if(index < all){
                F_Article_HotWord._htmlRelationChoose(index,all);
                dom.attr('data-i',(index+1));
                dom.html('Top'+(index+1));
            }

        });
        $('#bs_relation_pre').click(function () {
            var index = dom.attr('data-i');
            var all = dom.attr('data-a');
            index = parseInt(index);
            all = parseInt(all);
            if(index > 1){
                F_Article_HotWord._htmlRelationChoose((index-2),all);
                dom.attr('data-i',(index-1));
                dom.html('Top'+(index-1));
            }
        });
    },
    _htmlRelationChoose:function (index,all) {
        if(parseInt(all) > 10)all = 10;
        var str = '';
        if(F_Article_Common._cache['hotWord'] && F_Article_Common._cache['hotWord'][index]){
            var dataUnion = F_Article_Common._cache['hotWord'][index];
            str += '<div class="control">';
            str += '<i class="tf-icon control-icon prev-icon" id="bs_relation_pre"></i>';
            str += '<span class="rank" id="bs_relation_rank" data-i="'+(index+1)+'" data-a="'+all+'">Top'+(index+1)+'</span>';
            str += '<i class="tf-icon control-icon next-icon" id="bs_relation_next"></i>';
            str += '<span class="name">'+dataUnion['keyword']+'</span>';
            str += '</div>';
            str += '<div class="re-hotword">';
            for(var i=0;i<dataUnion.related_word_list.length;i++){
                if(i>=10)break;
                str += '<span>'+dataUnion.related_word_list[i]+'</span>';
            }
            str += '</div>';
            str += '<div id="bs_relation_list" style="position: relative;height: 340px; overflow: hidden;"></div>';

            $('.relation-word-rank').html(str);

            F_Article_HotWord._clickRelation();
            F_Article_Info._getData('relation',1,50,{keyword:dataUnion['keyword']});
        }
    },
    _htmlTableList:function (data,total) {
        var str = '<table><thead><th>排名</th><th>媒体热词</th><th>热词指数</th></thead></table>';
        str += '<div class="table-overflow-wrap" id="bs_keypoint_scroll" style="position: relative;"><table><tbody>';
        var percent = 0;
        for(var i=0;i<data.length;i++){
            percent = ((parseInt(data[i].hot_score)/parseInt(total))*100).toFixed(1);
            percent *= 10;
            percent = percent>100 ? 100 : percent;
            str += '<tr onclick="B_Jump._go(\'openUrl\',\''+B_Jump._getUrl('search')+'?t=k&k='+B_Common._encodeUrl(data[i].keyword)+'\')">';
            str += '<td>'+(i+1)+'</td>';
            str += '<td class="word">'+data[i].keyword+'</td>';
            str += '<td class="rate"><div class="rate-wrap"><span class="rate-percent" style="width: '+percent+'%"></span></div></td>';
            str += '</tr>';
        }
        str += '<tbody></table></div>';
        return str;
    }
}
var F_Article_trend = {
    _getData:function () {
        var postData = {};
        postData['scope'] = 'realtime';
        postData = B_Common._postData(postData);
        B_Port._ajax('industryGeneral','get',true,postData,null,null,function(data,msg){
                if(data){
                    $('#bs_today_count').html(data.title_num_today_total);
                    $('#bs_channel_count').html(data.channel_num_today_total);
                    $('#bs_article_count').html(data.article_num_today_total);
                }
            },null
        )
    }
}
var F_Detail_Relation = {
    _clickTab:function () {
        $('#bs_tab_classify li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings('li').removeClass('selected');
                    F_Article_Common._cache['selectedClassifyBig'] = $(this).html();
                    F_Article_Info._getData('recommend_classify',1,6);
                }
            });
        });
    },
    _getData:function (id) {
        var dom = $('#bs_relation_detail_list');
        var postData = {};
        postData['title'] = id;
        postData = B_Common._postData(postData);
        B_Port._ajax('articleRelation','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.data && data.data.list){
                    dom.html(F_Article_Info._htmlRecent(data.data.list));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    }
}
