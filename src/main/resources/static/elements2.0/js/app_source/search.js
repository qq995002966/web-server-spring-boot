require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        F_Search_Entrance._init();
    });
});
var F_Search_Entrance = {
    _cache:{},
    _init:function () {
        B_Login._check();
        S_HeadFoot._getHead();
        S_HeadFoot._htmlPaper();
        var $_GET = B_Common._getUrl('query');
        if(!($_GET.k)){
            B_Pop._init('alert',{content:'搜索关键词必须填写,请确认！'});
            return;
        }else{
            F_Search._cache['keyword'] = B_Common._decodeUrl($_GET.k);
            $('.login-part input[name="k"]').val(F_Search._cache['keyword']);
            if($_GET.t){
                F_Search._cache['type'] = $_GET.t;
                switch ($_GET.t){
                    case 'k':
                        break;
                    default:
                        if(!($_GET.d)){
                            B_Pop._init('alert',{content:'搜索关键词必须填写,请确认！'});
                            return;
                        }
                        F_Search._cache['identify'] = B_Common._decodeUrl($_GET.d);
                        break;
                }
                $('#searchresultPart .tab-change li').eq(1).addClass('selected').siblings().removeClass('selected');
                $('#bs_search_game').hide();
                $('#bs_search_article').show();
            }
            F_Search._typeChange();
            F_Search._gameList(1);
            F_Search._cache['classify'] = S_Article._getClassify();
            F_Search._articleList(1,$_GET.t);
        }
    }
}
var F_Search = {
    _cache:{'keyword':'','identify':'','mainClass':'','subClass':'','classifyNumber':'','type':''},
    _typeChange:function () {
        $('#searchresultPart .tab-change li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    switch (index+''){
                        case '0':
                            $('#bs_search_game').show();
                            $('#bs_search_article').hide();
                            break;
                        case '1':
                            $('#bs_search_game').hide();
                            $('#bs_search_article').show();
                            break;
                    }
                }
            });
        });
    },
    _redirect:function (type,id,name) {
        switch(type){
            case 'w':
                B_Jump._go('base',B_Jump._getUrl('search')+'?k='+B_Common._encodeUrl(id));
                break;
            case 'l':
                if(B_User._isDemoUser()){
                    B_Login._openLogin(type+'_'+id);
                }else {
                    if(B_Game._checkAuthGame(id)){
                        var url = B_Jump._getUrl('gameLight',{gameId:id});
                        B_Jump._go('base',url);
                    }else{
                        B_Login._openProbation('game&gameId='+id);
                    }
                }
                break;
        }
    },
    _tabTotalNumber:function (id,number) {
        switch(id+''){
            case '0':
                $('#bs_search_game_total').html(number);
                break;
            case '1':
                $('#bs_search_article_total').html(number);
                break;
        }
        $('#searchresultPart .tab-change li').eq(id).find('b').html(number);
    },
    _gameList:function (page) {
        var dom = $('#bs_search_list');
        var domPageList = $('#bs_search_game_page');
        var domOther = $('#bs_search_other');
        var domTotal = $('#bs_search_game .search-text-show');

        var postData = {};
        postData['keyword'] = F_Search._cache['keyword'];
        postData['index'] = (page-1)*B_Page._size;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);

        B_Port._ajax('projectReputationSearch','get',true,postData,function(){
                dom.html(B_Pre._loading());
                domPageList.html('');
                domOther.html('');
            },function(){
                dom.html('');
            },function(data,msg){
                var isAllEmpty = false;
                if(data && data.project_list && data.project_list.length > 0){
                    F_Search._tabTotalNumber(0,data.total);
                    dom.html(F_Search._htmlGameDetail(data.project_list,data.total));
                    domPageList.html(B_Page._show({total:data.total,page:page},'page'));
                    B_Page._click(page,function (page) {
                        F_Search._gameList(page);
                    },'bs_search_game_page');
                    if(domTotal.html() == ''){
                        domTotal.show().html('<p class="search-text-show">搜索"<b>'+F_Search._cache['keyword']+'</b>"的结果共有"<b>'+data.total+'</b>"个游戏有口碑分析结果</p>');
                    }
                }else{
                    isAllEmpty = true;
                }
                if(data && data.other_list && data.other_list.length > 0){
                    var length = data.other_list.length;
                    if((B_Page._size*page) >= data.total){
                        if(data.total == 0){
                            F_Search._tabTotalNumber(0,length);
                        }
                        domOther.html(F_Search._htmlGameOther(data.other_list,length));
                    }
                    $('.bs_add_game').click(function () {
                        B_Login._openPlan($(this).attr('data-i'));
                    });
                }else{
                    if(isAllEmpty){
                        F_Search._tabTotalNumber(0,0);
                        dom.html(B_Game._searchEmpty(F_Search._cache['keyword']));
                    }
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlGameDetail:function (data,total) {
        var str = '';
        var gameInfo = '';
        var tag = '';
        for(var i=0;i<data.length;i++){
            gameInfo = B_Game._getGame([data[i].project_id]);
            if(gameInfo){
                gameInfo = gameInfo[data[i].project_id];
                str += '<div class="boxshadow"><ul class="game-list"><li>';
                str += '<div class="fl"><img src="'+gameInfo[0]+'" alt="'+gameInfo[1]+'" onclick="F_Search._redirect(\'l\','+data[i].project_id+')">';
                str += '<p onclick="F_Search._redirect(\'l\','+data[i].project_id+')">'+(B_Common._focusKeywords(F_Search._cache['keyword'],gameInfo[1]))+'</p>';
                str += '<span>游戏类型：'+data[i].game_type+'</span>';
                str += '<span>开发商：'+data[i].author+'</span>';
                str += '<span>发行商：'+data[i].distributor+'</span>';
                str += '<span>发行日期：'+data[i].release_date+'</span>';
                str += '<ul class="tg-tab-btn">';
                if(data[i].tag_list){
                    tag = B_Game._tag(data[i].tag_list);
                    for(var d=0;d<data[i].tag_list.length;d++){
                        if(tag[data[i].tag_list[d]]){
                            str += '<li class="tg-tab-btn-normal" onclick="F_Search._redirect(\'w\',\''+tag[data[i].tag_list[d]]+'\');">'+tag[data[i].tag_list[d]]+'</li>';
                        }
                    }
                }
                str += '</ul></div>';
                str += '<ul class="fr">';
                str += '<li><span><b class="color-blue">'+data[i].hot_rank+'</b></span><p>ThinkingGame舆情榜</p></li>';
                str += '<li><span><b class="color-blue">'+data[i].app_rank+'</b></span><p>Appstore畅销榜</p></li>';
                str += '<li><button class="tg-main-btn" onclick="F_Search._redirect(\'l\','+data[i].project_id+')">查看口碑</button></li>';
                str += '</ul>';
            }
            str += '</li></ul></div>';
        }
        return str;
    },
    _htmlGameOther:function (data,total) {
        var str = '';
        str += '<p class="search-text-show">搜索"<b>'+F_Search._cache['keyword']+'</b>"的结果共有"<b>'+total+'</b>"个游戏暂时没有口碑分析结果</p>';
        var gameInfo = '';
        var tag = '';
        for(var i=0;i<data.length;i++){
            gameInfo = B_Game._getGame([data[i].project_id]);
            if(gameInfo){
                gameInfo = gameInfo[data[i].project_id];
                str += '<div class="boxshadow"><ul class="game-list"><li>';
                str += '<div class="fl"><img src="'+data[i].app_img+'" alt="'+data[i].app_name+'">';
                str += '<p>'+B_Common._focusKeywords(F_Search._cache['keyword'],data[i].app_name)+'</p>';
                str += '<span>开发商：'+data[i].app_author+'</span>';
                str += '</div>';
                str += '<ul class="fr">';
                str += '<li><button class="tg-main-btn bs_add_game" data-i="'+data[i].app_name+'">申请增加游戏</button></li>';
                str += '</ul>';
            }
            str += '</li></ul></div>';
        }
        return str;
    },
    _articleHtmlInit:function (type) {
        var leftStr = '';
        switch (type){
            case 't':
            case 'p':
            case 'k':
                leftStr += '<ul class="right" style="margin-left: 0">';
                break;
            default:
                leftStr += '<ul class="left">';
                leftStr += '</ul>';
                leftStr += '<ul class="right"><div class="tab-change b_none"></div>';
                break;
        }
        var str = '<p>搜索"<b>'+F_Search._cache['keyword']+'</b>"的相关的媒体文章<b id="bs_search_article_total"></b>篇</p>';
        str += '<div class="boxshadow content-wrap">';
        str += leftStr;
        str += '<ul id="bs_search_article_list"></ul><ul class="page-list" id="bs_search_article_page"></ul>';
        str += '</ul>';
        str += '</div>';
        return str;
    },
    _articleList:function (page,type) {
        if($('#bs_search_article').html() == '')$('#bs_search_article').html(F_Search._articleHtmlInit(type));
        var postData = {};
        postData['index'] = ((page-1)*B_Page._size);
        postData['limit'] = B_Page._size;
        postData['need_preview'] = 1;
        switch(type){
            case 't':
                postData['topic_id'] = F_Search._cache['identify'];
                postData['data_date_start'] = B_Date._getDiffDate(null,-29);
                postData['data_date_end'] = B_Date._getDiffDate(null,0);
                break;
            case 'p':
                postData['project_id'] = F_Search._cache['identify'];
                break;
            default:
                postData['keyword'] = F_Search._cache['keyword'];
                if(F_Search._cache['mainClass'] != ''){
                    postData['main_class'] = F_Search._cache['mainClass'];
                }
                if(F_Search._cache['subClass'] != ''){
                    postData['sub_class'] = F_Search._cache['subClass'];
                }
                break;
        }
        postData = B_Common._postData(postData);

        var dom = $('#bs_search_article_list');
        var pageDom = $('#bs_search_article_page');

        B_Port._ajax('articleList','get',true,postData,function(){
                dom.html(B_Pre._loading('c_padding30'));
                pageDom.html('');
            },function(){
                dom.html('');
                pageDom.html('');
            },function(data,msg){
                var total = 0;
                if(data.data && data.data.list.length>0){
                    var total = data.data.total;
                    if(!type && $('#bs_search_article .left').html() == ''){
                        F_Search._articleClassifyCount();
                    }
                    F_Search._htmlArticleList(data.data);
                    pageDom.html(B_Page._show({total:total,page:page},'page'));
                    B_Page._click(page,function (page) {
                        F_Search._articleList(page,type);
                    },'bs_search_article_page');
                }else{
                    F_Search._articleClassifyShowOrHide('hide');
                    dom.html(F_Search._articleSearchEmpty(F_Search._cache['keyword']));
                }
                if (F_Search._cache['mainClass'] == '')F_Search._tabTotalNumber(1,total);
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _articleSearchEmpty:function (keywords) {
        var str = '\
            <div class="b_empty">\
              <div class="des">\
                <img src="elements2.0/img/empty.png" alt="">\
                <span>没有找到与"'+keywords+'"相关的文章</span>\
              </div>\
            </div>';
        return str;
    },
    _articleClassifyShowOrHide:function (type) {
          switch (type){
              case 'hide':
                  $('#bs_search_article .left').hide();
                  $('#bs_search_article .right .tab-change').hide();
                  $('#bs_search_article .right').css({'margin-left':0});
                  break;
              case 'show':
                  $('#bs_search_article .left').show();
                  $('#bs_search_article .right .tab-change').hide();
                  $('#bs_search_article .right').css({'margin-left':''});
                  break;
          }
    },
    _articleClassifyCount:function(){
        var postData = {};
        postData['keyword'] = F_Search._cache['keyword'];
        postData = B_Common._postData(postData);
        B_Port._ajax('articleClassifyCount','get',true,postData,null,null,function(data,msg){
            if(data && !B_Common._checkObjectIsEmpty(data)){
                F_Search._articleClassifyShowOrHide('show');
                F_Search._cache['classifyNumber'] = data;
                F_Search._htmlArticleClassifyBig();
            }else{
                F_Search._articleClassifyShowOrHide('hide');
            }
        },function(data,msg,code){
            F_Search._articleClassifyShowOrHide('hide');
        });
    },
    _htmlArticleClassifyBig:function () {
        var menuInit = ['公司','前沿','研发','行业','电竞','人物','游戏','其他'];
        var str = '';
        var param = [];
        if(F_Search._cache['classifyNumber']){
            for(var i=0;i<menuInit.length;i++){
                if(F_Search._cache['classify'][menuInit[i]]){
                    param = F_Search._cache['classify'][menuInit[i]];
                }else{
                    param = F_Search._cache['classify']['其他'];
                }
                if(F_Search._cache['classifyNumber'][menuInit[i]]){
                    str += '<li data-t="'+menuInit[i]+'">';
                    //str += '<i class="'+param['img'].styleClass+' b_img"></i>';
                    str += menuInit[i]+'('+F_Search._cache['classifyNumber'][menuInit[i]].total_num+')</li>';
                }
            }
            var dom = $('#bs_search_article .left');
            dom.html(str);
            dom.find('li').each(function () {
                $(this).click(function () {
                    if(!$(this).hasClass('selected')){
                        $(this).addClass('selected').siblings().removeClass('selected');
                        $(this).siblings('li').find('.triangle-icon').remove();
                        $(this).append('<i class="triangle-icon tf-icon"></i>');
                        F_Search._cache['mainClass'] = $(this).attr('data-t');
                        F_Search._articleList(1,F_Search._cache['type']);
                        F_Search._htmlArticleClassifySmall();
                    }
                });
            });
        }
    },
    _htmlArticleClassifySmall:function () {
        var dom = $('#bs_search_article .right .tab-change');
        if(F_Search._cache['classifyNumber'] && F_Search._cache['mainClass'] && F_Search._cache['classifyNumber'][F_Search._cache['mainClass']] && F_Search._cache['classifyNumber'][F_Search._cache['mainClass']].sub_list){
            var dataUnion = F_Search._cache['classifyNumber'][F_Search._cache['mainClass']].sub_list;
            var str = '<span class="selected" data-t="全部">全部</span>';
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (key,value) {
                    str += '<span data-t="'+key+'">'+key+'('+value+')</span>';
                })
            }
            dom.html(str).show();
            dom.find('span').each(function () {
                $(this).click(function () {
                    if(!$(this).hasClass('selected')){
                        $(this).addClass('selected').siblings().removeClass('selected');
                        var subClass = $(this).attr('data-t');
                        if(subClass == '全部'){
                            F_Search._cache['subClass'] = '';
                        }else{
                            F_Search._cache['subClass'] = subClass;
                        }
                        F_Search._articleList(1,F_Search._cache['type']);
                    }
                });
            });
        }else{
            dom.html('').hide();
        }
    },
    _htmlArticleList:function(data){
        var str = '';
        var param = [];
        var currentClassify = '';
        var dataUnion = data.list;
        for(var i=0;i<dataUnion.length;i++){
            if(!dataUnion[i].source.main_class){
                dataUnion[i].source.main_class = '其他';
            }
            if(F_Search._cache['classify'][dataUnion[i].source.main_class]){
                param = F_Search._cache['classify'][dataUnion[i].source.main_class];
            }else{
                param = F_Search._cache['classify']['其他'];
            }
            str += '<li>';
            str += '<a href="'+S_Article._detailUrl(dataUnion[i].id)+'" target="_blank">';
            str += S_Article._previewImg(dataUnion[i].source.preview_img,dataUnion[i].source.source);
            str += '</a>';
            str += '<div class="des">';
            str += '<h3><a href="'+S_Article._detailUrl(dataUnion[i].id)+'"  target="_blank" title="'+dataUnion[i].source.title+'">'+B_Common._focusKeywords(F_Search._cache['keyword'],dataUnion[i].source.title)+'</a></h3>';
            str += '<p>'+B_Common._focusKeywords(F_Search._cache['keyword'],dataUnion[i].source.content)+'</p>';
            str += '<div>';
            if(param && param.img){
                str += '<i class="'+param.img.styleClass+' b_img"></i>';
            }
            str += '<span>'+dataUnion[i].source.main_class+'</span><span>'+S_Article._getSource(dataUnion[i].source.source)+'</span><span class="date">'+dataUnion[i].source.post_date+'</span></div>';
            str += '</li>';
        }
        setTimeout(function(){
            $('#bs_search_article_list').html(str);
        },200);
    }
}
