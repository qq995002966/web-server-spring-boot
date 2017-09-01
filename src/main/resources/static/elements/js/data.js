var date1Begin = '';
var date1End = '';
var order1 = '';
var date1 = 2;
var date2Begin = '';
var date2End = '';
var date2 = 2;
var date3Begin = '';
var date3End = '';
var date3 = 2;
var keywordBuff = '';
var keywordReset = '';
var postData = [];
var mail_beginDate = '';
var mail_endDate = '';
var isUseKeywordReset = false;
$(function(){
    G_Login._check();
    var $_GET = getUrl('query');
    switch($_GET.f){
        case 'search':
            $('.bs_search_close').show();
            keywordBuff = decodeURIComponent($_GET.w);
            parent.$('#lightQuicker').hide();
            var conditionStr = [];
            var conditionDom = $('.data-list-content_top1');
            switch($_GET.t){
                case 'insightBack':
                case 'insight':
                case 'hotWord':
                case 'emotion':
                case 'useless':
                case 'keywords':
                case 'topic':
                case 'title':
                    if(isNaN($_GET.g) || !$_GET.b || !$_GET.e){
                        parent.G_Pop._init('msg',{'content':'数据错误，请重试'});
                        return false;
                    }
                    G_GameId = $_GET.g;
                    if($_GET.r){
                        keywordBuff = decodeURIComponent($_GET.r);
                        postData.push('real_tag='+$_GET.r);
                    }
                    postData.push('project_id='+$_GET.g);
                    postData.push('data_date_start='+$_GET.b);
                    postData.push('data_date_end='+$_GET.e);

                    switch($_GET.t){
                        case 'insightBack':
                            postData.push('classify_sentiment='+$_GET.c);
                            break;
                        case 'insight':
                            if(!$_GET.r)isUseKeywordReset = true;
                            postData.push('classify_sentiment='+$_GET.c);
                            postData.push('lighttower_classify='+$_GET.w);
                            break;
                        case 'hotWord':
                            postData.push('keywords='+$_GET.w);
                            postData.push('only_query_title=1');
                            break;
                        case 'keywords':
                            postData.push('keywords='+$_GET.w);
                            break;
                        case 'topic':
                            postData.push('topic_id='+$_GET.w);
                            break;
                        case 'emotion':
                            postData.push('sentiment_score='+$_GET.c);
                            break;
                        case 'useless':
                            postData.push('info_id_list='+$_GET.c);
                            postData.push('useless_classify='+$_GET.w);
                            break;
                        case 'title':
                            postData.push('info_id_list='+$_GET.c);
                            break;
                    }
                    F_Search._getForum();
                    break;
                case 'appWord':
                case 'channel':
                    if(isNaN($_GET.g) || !$_GET.b || !$_GET.e){
                        parent.G_Pop._init('msg',{'content':'数据错误，请重试'});
                        return false;
                    }
                    postData.push('project_id='+$_GET.g);
                    postData.push('data_date_start='+$_GET.b);
                    postData.push('data_date_end='+$_GET.e);

                    switch($_GET.t){
                        case 'appWord':
                            postData.push('sentiment_keywords='+$_GET.w);
                            if(keywordBuff)keywordBuff = keywordBuff.split('/')[0];
                            break;
                        case 'channel':
                            postData.push('source_type_list='+$_GET.c);
                            postData.push('es_field_name='+$_GET.r);
                            postData.push('es_field_val='+$_GET.w);
                            break;
                    }
                    F_Search._getApp();

                    conditionDom = $('.data-list-content_top2');
                    break;
            }

            conditionStr.push(G_Game._name($_GET.g));
            switch($_GET.t){
                case 'insightBack':
                case 'insight':
                    switch($_GET.c+''){
                        case '0':
                            conditionStr.push('中性反馈');
                            break;
                        case '1':
                            conditionStr.push('正面反馈');
                            break;
                        case '-1':
                            conditionStr.push('负面反馈');
                            break;
                    }
                    if($_GET.w)conditionStr.push(decodeURIComponent($_GET.w));
                    if($_GET.forum)conditionStr.push(decodeURIComponent($_GET.forum));
                    break;
                case 'hotWord':
                    conditionStr.push(decodeURIComponent($_GET.w));
                    break;
                case 'title':
                    if($_GET.forum)conditionStr.push(decodeURIComponent($_GET.forum));
                    break;
                case 'emotion':
                    switch($_GET.c+''){
                        case '-1,-2':
                            conditionStr.push('负面情感');
                            break;
                        case '1,2':
                            conditionStr.push('正面情感');
                            break;
                    }
                    break;
                case 'keywords':
                case 'topic':
                    conditionStr.push(decodeURIComponent($_GET.w));
                    break;
                case 'channel':
                    conditionStr.push(G_Game._sourceName($_GET.c));
                    if($_GET.forum)conditionStr.push(decodeURIComponent($_GET.forum));
                    break;
                case 'appWord':
                    var conditionWord = decodeURIComponent($_GET.w);
                    if(conditionWord.indexOf('/-1') > -1){
                        conditionStr.push('负面');
                        conditionWord = conditionWord.replace('/-1','');
                    }else{
                        conditionStr.push('正面');
                        conditionWord = conditionWord.replace('/1','');
                    }
                    conditionStr.push(conditionWord);
                    break;
            }

            conditionStr = conditionStr.join(' ， ');
            $('.search_condition').show().html('<b>筛选条件</b>　'+conditionStr+' ， '+$_GET.b+' 到 '+$_GET.e);
            conditionDom.css("top",'80px');
            break;
        default:
            $('.bs_logo').click(function(){
                G_Jump._go('index');
            });
            var mail_dateBegin_format = '';
            var mail_dateEnd_format = '';
            var mail_channel = false;
            if($_GET.project_id && !isNaN($_GET.project_id)){
                var mail_project = G_Game._getGame([$_GET.project_id],1);
                if(mail_project){
                    if(mail_project[$_GET.project_id][3].indexOf('S') > -1){
                        $_GET.t = 1;
                        F_Common._removeClass(2);
                    }
                    if($_GET.type){
                        switch($_GET.type){
                            case 'channel':
                                mail_channel = 2;
                                break;
                            case 'forum':
                                mail_channel = 1;
                                break;
                        }
                    }
                    G_GameId = $_GET.project_id;
                    if($_GET.data_date_start){
                        mail_beginDate = $_GET.data_date_start;
                        $_GET.data_date_start = decodeURIComponent($_GET.data_date_start);
                        mail_dateBegin_format = $_GET.data_date_start.split(' ')[0];
                    }
                    if($_GET.data_date_end){
                        mail_endDate = $_GET.data_date_end;
                        $_GET.data_date_end = decodeURIComponent($_GET.data_date_end);
                        mail_dateEnd_format = $_GET.data_date_end.split(' ')[0];
                    }
                    if($_GET.keyword)$('input[name="data_keywords"]').val(decodeURIComponent($_GET.keyword));
                    F_Common._removeClass(1);
                    F_Common._removeClass(3);
                }
            }else{
                $('.bs_list_close').show();
                if(!isNaN($_GET.g))G_GameId = $_GET.g;
            }
            $('.search').show();
            $('.data-content-header').show();
            if(!$_GET.t)$_GET.t = 0;
            tabChoose($('.data-content-header .data-search-type ul span'),$('.td_slider'),90,443,'liOn','data',$_GET.t,mail_channel);
            $('.search_game_logo').html(F_Common._gameLogo(G_GameId));
            submitBind($('.search .dataicon'),$('input[name=data_keywords]'));
            $('.search .dataicon').click(function(){
                var keywords = F_Common._getKeywords();
                if(keywords == ''){
                    G_Pop._init('msg',{content:'搜索关键词必须填写,请确认！'});
                    return false;
                }else{
                    //if(keywordBuff != keywords){
                    keywordBuff = keywords;
                    $('.data-search-type ul span').each(function(){
                        if($(this).hasClass('liOn')){
                            var type = $(this).attr('data-t');
                            switch(type+''){
                                case '1':
                                    F_Forum._getInfo(1);
                                    break;
                                case '2':
                                    F_Apps._getInfo(1);
                                    break;
                                case '3':
                                    F_Article._getInfo(1);
                                    break;
                            }
                        }
                    });
                    //}
                }
            });
            dataChoose._section({'autoCommit':false,'todayValid':true},1,mail_dateBegin_format,mail_dateEnd_format,function(begin,end){
                if(begin !=date1Begin || date1End != end){
                    mail_beginDate = '';
                    mail_endDate = '';
                    date1 = -1;
                    F_Common._removeClass(1);
                    date1Begin = begin;
                    date1End = end;
                    F_Forum._getInfo(1);
                }
            });
            dataChoose._section({'autoCommit':false,'todayValid':true},2,mail_dateBegin_format,mail_dateEnd_format,function(begin,end){
                if(begin !=date2Begin || date2End != end){
                    mail_beginDate = '';
                    mail_endDate = '';
                    date2 = -1;
                    F_Common._removeClass(2);
                    date2Begin = begin;
                    date2End = end;
                    F_Apps._getInfo(1);
                }
            });
            dataChoose._section({'autoCommit':false,'todayValid':true},3,mail_dateBegin_format,mail_dateEnd_format,function(begin,end){
                if(begin !=date3Begin || date3End != end){
                    date3 = -1;
                    F_Common._removeClass(3);
                    date3Begin = begin;
                    date3End = end;
                    F_Article._getInfo(1);
                }
            });
            if($('#data-lm1 .data-from').html() == ''){
                F_Source._get();
            }
            break;
    }
});
var F_Search = {
    _getForum:function(){
        postData.push('order_by_field=publish_time');
        F_Forum._getInfo(1);
    },
    _getApp:function(){
        $('#data-lc1').hide();
        $('#data-lc2').show();
        F_Apps._getInfo(1);
    }
}
var F_Apps = {
    _tagCheck:function(){
        $('#data-lm2 .data-from input[type="checkbox"]').each(function(index){
            $(this).click(function(){
                F_Apps._getInfo(1);
            });
        });
        $('#data-lm2 .data-time span').each(function(index){
            $(this).click(function(){
                if(date2 != index){
                    date2 = index;
                    date2Begin = '';
                    date2End = '';
                    F_Apps._getInfo(1);
                }
            });
        });
    },
    _getApp:function(){
        var choosed = [];
        $('#data-lm2 .data-from span input').each(function(){
            if($(this).prop("checked")==true){
                choosed.push($(this).val());
            }
        });
        return (choosed ? choosed.join(',') : '');
    },
    _getInfo:function(page){
        var postDate = [];
        if(postData.length == 0){
            var date = F_Common._date(2);
            if(date){
                if(date.begin)postDate.push('data_date_start='+date.begin);
                if(date.end)postDate.push('data_date_end='+date.end);
            }
            var source = F_Apps._getApp();
            if(source)postDate.push('source_type_list='+source);
            var searchKeyword = F_Common._getKeywords();
            if(searchKeyword)postDate.push('keywords='+encodeURIComponent(searchKeyword));
        }else{
            for(var i=0;i<postData.length;i++){
                postDate.push(postData[i]);
            }
        }
        if(postDate && postDate.length > 0){
            var postStr = postDate.join('&');
            if(postStr.indexOf('project_id=')==-1)postDate.push('project_id='+G_GameId);
            postDate.push('order_by_field=publish_time');
            postDate.push('order_type=desc');
            postDate.push('index='+(page-1)*G_Page._size);
            postDate.push('limit='+G_Page._size);

            G_Port._ajax('appDetail','get',true,postDate.join('&'),function(){
                    $('#data-lc2 .dc-list-content').html(G_Pre._loading('c_padding30'));
                    $('#data-lc2 .page-list').html('');
                },function(){
                    $('#data-lc2 .dc-list-content').html('');
                },function(data,msg){
                    var contentDom = $('#data-lc2 .dc-list-content');
                    if(data.data && data.data.list.length > 0){
                        contentDom.html(F_Apps._htmlInfo(data.data));
                        $('#data-lc2 .page-list').html(G_Page._show({total:data.data.total,page:page},'simple'));
                        F_Common._pageGo(2,page);
                        $('.dc-list-content').perfectScrollbar();
                    }else{
                        contentDom.html('<div class="c_empty c_colorR">当前时间段暂无数据</div>');
                    }
                },function(data,msg,code){
                    $('#data-lc2 .dc-list-content').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _htmlInfo:function(data){
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var starStr = '';
            var stars = data.list[i].source.rating_star;
            for(var d=1;d<=5;d++){
                if(d <= stars){
                    starStr += '<b class="glyphicon glyphicon-star c_colorGS"></b>';
                }else{
                    starStr += '<b class="glyphicon glyphicon-star c_colorHS"></b>';
                }
            }
            str += '\
            <li class="floor">\
                <div class="dc-source">\
                <img src="'+G_Game._imgSourceUrl(data.list[i].source.source_type)+'">\
                </div>\
                <div class="dc-list-star">'+starStr+'</div>\
                <p>'+F_Common._focusKeywords(data.list[i].source.content)+'</p>\
                <i class="author-icon"></i>\
                <span>'+data.list[i].source.author+'</span>\
                <i class="time-icon"></i>\
                <span>'+data.list[i].source.publish_time+'</span>\
            </li>';
        }
        return str;
    }
}
var F_Forum = {
    _buff:{},
    _tagCheck:function(){
        $('#data-lm1 .data-from input[type="checkbox"]').each(function(index){
            $(this).click(function(){
                F_Forum._getInfo(1);
            });
        });
        $('#data-lm1 .data-sort span').each(function(index){
            $(this).click(function(){
                if(order1 != index){
                    order1 = index;
                    F_Forum._getInfo(1);
                }
            });
        });
        $('#data-lm1 .data-time span').each(function(index){
            $(this).click(function(){
                if(date1 != index){
                    date1 = index;
                    date1Begin = '';
                    date1End = '';
                    F_Forum._getInfo(1);
                }
            });
        });
    },
    _getForum:function(){
        var choosed = [];
        $('#data-lm1 .data-from span input').each(function(){
            if($(this).prop("checked")==true){
                choosed.push($(this).val());
            }
        });
        return (choosed ? choosed.join(',') : '');
    },
    _getSort:function(){
        var sortName = '';
        $('#data-lm1 .data-sort span').each(function(){
            if($(this).hasClass("data-span-selected")){
                sortName = $(this).html();
            }
        });
        switch(sortName){
            case '按时间排序':
                return 'publish_time';
                break;
            case '按回复量排序':
                return 'reply_num';
                break;
            default:
                return '';
                break;
        }
    },
    _getDetail:function(ikey,tkey,page){
        G_Port._ajax('forumDetail','get',true,'project_id='+G_GameId+'&info_id='+ikey+'&title_id='+tkey+'&index='+(page-1)*G_Page._size+'&limit='+G_Page._size,function(){
                if(page == 1){
                    $('.data-content-right, .data-content-right *').unbind().removeData();
                    $('#data-lc1 .data-content-right').html(G_Pre._loading('c_padding30'));
                }
            },function(){
                if(page == 1)$('#data-lc1 .data-content-right').html('');
            },function(data,msg){
                if(page == 1){
                    var titleData = F_Forum._getTitle(ikey,tkey);
                    if(titleData){
                        $('#data-lc1 .data-content-right').html(F_Forum._htmlTitle(titleData));
                    }
                }
                //$('#data-lc1 .data-content-right').append();
                F_Forum._htmlDetail(data.data,page,ikey,tkey)
                $('#data-lc1 .data-content-right').perfectScrollbar();
            },function(data,msg,code){
                if(page == 1)$('#data-lc1 .data-content-right').html(G_Pre._empty(msg));
            }
        )
    },
    _getTitle:function(infoId,titleId){
        if(F_Forum._buff){
            var data = F_Forum._buff;
            for(var i=0;i<=data.length;i++){
                if(data[i].source.info_id == infoId && data[i].source.title_id == titleId){
                    return data[i].source;
                }
            }
        }
        return '';
    },
    _getInfo:function(page){
        var postDate = [];
        if(postData.length == 0){
            var date = F_Common._date(1);
            if(date){
                if(date.begin)postDate.push('data_date_start='+date.begin);
                if(date.end)postDate.push('data_date_end='+date.end);
            }
            var order = F_Forum._getSort();
            if(order)postDate.push('order_by_field='+order);
            var source = F_Forum._getForum();
            if(source)postDate.push('info_id_list='+source);
            var searchKeyword = F_Common._getKeywords();
            if(searchKeyword)postDate.push('keywords='+encodeURIComponent(searchKeyword));
        }else{
            for(var i=0;i<postData.length;i++){
                postDate.push(postData[i]);
            }
        }
        if(postDate && postDate.length > 0){
            var postStr = postDate.join('&');
            if(postStr.indexOf('project_id=')==-1)postDate.push('project_id='+G_GameId);
            postDate.push('order_type=desc');
            postDate.push('index='+(page-1)*G_Page._size);
            postDate.push('limit='+G_Page._size);
            G_Port._ajax('forumSearch','get',true,postDate.join('&'),function(){
                    $('#data-lc1 .data-content-left,#data-lc1 .data-content-left *').unbind().removeData();
                    $('#data-lc1 .data-content-left .list-content').html(G_Pre._loading('c_padding30'));
                    $('#data-lc1 .data-content-left .page-list').html('');
                },function(){
                    $('#data-lc1 .data-content-left .list-content').html('');
                },function(data,msg){
                    var contentDom = $('#data-lc1 .data-content-left .list-content');
                    if(data.data && data.data.list.length > 0){
                        F_Forum._buff = data.data.list;
                        contentDom.html(F_Forum._htmlInfo(data.data));
                        $('#data-lc1 .page-list').html(G_Page._show({total:data.data.total,page:page},'simple'));
                        F_Common._onFocus(1);
                        F_Common._pageGo(1,page);
                        $('#data-lc1 .data-content-left .list-content').perfectScrollbar();
                    }else{
                        contentDom.html('<div class="c_empty c_colorR">当前时间段暂无数据</div>');
                        $('#data-lc1 .data-content-right').html('');
                    }
                },function(data,msg,code){
                    $('#data-lc1 .data-content-left .list-content').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _htmlInfo:function(data){
        var str = '';
        var imgs = [];
        for(var i=0;i<data.list.length;i++){
            keywordReset = '';
            var hasImg = '';
            if(data.list[i].source.lighttower_tags && data.list[i].source.lighttower_tags != ''){
                var lightTagsArr = data.list[i].source.lighttower_tags.split(',');
                var lightTags = [];
                for(var t=0;t<lightTagsArr.length;t++){
                    lightTagsArr[t] = lightTagsArr[t].split(':');
                    if(lightTagsArr[t][1] && lightTagsArr[t][1] != ''){
                        lightTags.push(lightTagsArr[t][1]);
                    }
                }
                if(lightTags.length > 0)keywordReset = lightTags.join(',');
            }
            if(data.list[i].source.attach_content && data.list[i].source.attach_content.length > 0){
                var attach_content = G_Common._imgDecode(data.list[i].source.attach_content);
                eval("attach_content="+attach_content);
                for(var m=0;m<attach_content.length;m++){
                    imgs.push(attach_content[m].img_url);
                }
                hasImg = '<i class="c_img"></i>';
            }
            var useClass = '';
            if(i==0){
                if($('#data-lc1 .data-content-right').html() == ''){
                    useClass = ' article-list-selected';
                    F_Forum._getDetail(data.list[i].source.info_id,data.list[i].source.title_id,1);
                }
            }
            var content = (data.list[i].source.content.length > 60) ? data.list[i].source.content.substr(0,60)+'..' : data.list[i].source.content;
            str += '\
            <ul class="article-list'+useClass+'" data-i="'+data.list[i].source.info_id+'" data-t="'+data.list[i].source.title_id+'" data-w="'+keywordReset+'">\
                <li>\
                    <span class="article-title">'+hasImg+' '+F_Common._focusKeywords(data.list[i].source.title)+'</span>\
                </li>\
                <li class="detail-infor detail-infor-h1">\
                    <span>作者：'+data.list[i].source.author+'</span>\
                    <span>来源：'+data.list[i].source.crawler_name+'</span>\
                    <span>回复数：'+data.list[i].source.reply_num+'</span>\
                    <span>时间：'+G_Date._dateFormat('mini',data.list[i].source.publish_time)+'</span>\
                </li>\
            </ul>';
        }
        if(imgs.length >0){
            G_Common._imgBuff(imgs);
        }
        return str;
    },
    _htmlTitle:function(data){
        var str = '';
        var img = '';
        if(data.attach_content && data.attach_content.length > 0){
            var attach_content = G_Common._imgDecode(data.attach_content);
            eval("attach_content="+attach_content);
            for(var i=0;i<attach_content.length;i++){
                try{
                    img += '<br><img src="'+decodeURIComponent(attach_content[i].img_url)+'">';
                }catch(e){}
            }
        }
        str += '\
            <li class="title-bar">\
                <span class="title">'+F_Common._focusKeywords(data.title)+'</span>\
                <ul class="infor">\
                    <li class="infor-addr"><i></i>采集地址:<span><a href="'+data.from_url+'" target="_blank">'+data.from_url+'</a></span></li>\
                    <li class="infor-reply"><i></i>回复数:<span class="reply-num">'+data.reply_num+'</span></li>\
                    <li class="infor-time"><i></i>发帖时间:<span class="publish-time">'+data.publish_time+'</span></li>\
                </ul>\
            </li>\
            <li class="floor top-one">\
                <img src="elements/img/lz.png" class="iconImg">\
                <i class="author-icon"></i>\
                <span class="author">'+data.author+'</span>\
                <i class="time-icon"></i>\
                <span class="reply-time">'+data.publish_time+'</span>\
                <p class="reply-content">'+F_Common._focusKeywords(data.content)+img+'</p>\
            </li>';
        return str;
    },
    _htmlDetail:function(data,page,ikey,tkey){
        var isEnd = false;
        if((G_Page._size*page) > data.total){
            isEnd = true;
        }
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var imgs = [];
            var img = '';
            if(data.list[i].source.attach_content && data.list[i].source.attach_content.length > 0){
                var attach_content = G_Common._imgDecode(data.list[i].source.attach_content);
                eval("attach_content="+attach_content);
                for(var m=0;m<attach_content.length;m++){
                    try{
                        imgs.push(attach_content[m].img_url);
                        img += '<br><img src="'+decodeURIComponent(attach_content[m].img_url)+'">';
                    }catch(e){

                    }
                }
            }
            if(imgs.length >0){
                G_Common._imgBuff(imgs);
            }
            str += '\
                <li class="floor">\
                    <i class="author-icon"></i>\
                    <span class="author">'+data.list[i].source.author+'</span>\
                    <i class="time-icon"></i>\
                    <span class="reply-time">'+data.list[i].source.publish_time+'</span>\
                    <span class="floor-num">'+(((page-1)*G_Page._size)+i+2)+'楼</span>\
                    <p class="reply-content">'+F_Common._focusKeywords(data.list[i].source.content)+img+'</p>\
                </li>';
        }
        if(isEnd){
            str += '<li class="loading-state"><span>已经显示全部</span></li>';
        }else{
            str += '<li class="loading-state"><span class="c_cursor" onclick="F_Forum._getMore('+ikey+',\''+tkey+'\','+(page+1)+')">点击加载更多</span></li>';
        }

        setTimeout(function(){
            $('#data-lc1 .data-content-right').append(str);
        },200);
        //return str;
    },
    _getMore:function(ikey,tkey,page){
        $('.loading-state').remove();
        F_Forum._getDetail(ikey,tkey,page);
    }
}
var F_Article = {
    _tagCheck:function(){
        $('#data-lm3 .data-time span').each(function(index){
            $(this).click(function(){
                if(date3 != index){
                    date3 = index;
                    date3Begin = '';
                    date3End = '';
                    F_Article._getInfo(1);
                }
            });
        });
    },
    _getInfo:function(page){
        var date = F_Common._date(3);
        var postDate = [];
        if(date){
            if(date.begin)postDate.push('data_date_start='+date.begin);
            if(date.end)postDate.push('data_date_end='+date.end);
        }
        var searchKeyword = F_Common._getKeywords();
        if(searchKeyword)postDate.push('keywords='+encodeURIComponent(searchKeyword));
        if(postDate && postDate.length > 0){
            var postStr = postDate.join('&');
            if(postStr.indexOf('project_id=')==-1)postDate.push('project_id='+G_GameId);
            postDate.push('need_preview=1');
            postDate.push('index='+(page-1)*G_Page._size);
            postDate.push('limit='+G_Page._size);

            G_Port._ajax('articleList','get',true,postDate.join('&'),function(){
                    $('#data-lc3 .data-content-left,#data-lc3 .data-content-left *').unbind().removeData();
                    $('#data-lc3 .data-content-left .list-content').html(G_Pre._loading('c_padding30'));
                    $('#data-lc3 .data-content-left .page-list').html('');
                },function(){
                    $('#data-lc3 .data-content-left .list-content').html('');
                },function(data,msg){
                    var contentDom = $('#data-lc3 .data-content-left .list-content');
                    if(data.data && data.data.list.length > 0){
                        contentDom.html(F_Article._htmlInfo(data.data));
                        $('#data-lc3 .page-list').html(G_Page._show({total:data.data.total,page:page},'simple'));
                        F_Common._onFocus(3);
                        F_Common._pageGo(3,page);
                        $('#data-lc3 .data-content-left .list-content').perfectScrollbar();
                    }else{
                        contentDom.html('<div class="c_empty c_colorR">当前时间段暂无数据</div>');
                        $('#data-lc3 .data-content-right').html('');
                    }
                },function(data,msg,code){
                    $('#data-lc3 .data-content-left .list-content').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _getDetail:function(key){
        G_Port._ajax('articleDetail','get',true,'title='+encodeURIComponent(key),function(){
                $('.data-content-right, .data-content-right *').unbind().removeData();
                $('#data-lc3 .data-content-right').html(G_Pre._loading('c_padding30'));
            },function(){
                $('#data-lc3 .data-content-right').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#data-lc3 .data-content-right').html(F_Article._htmlDetail(data.data.list[0].source));
                    $('#data-lc3 .data-content-right').perfectScrollbar();
                }
            },function(data,msg,code){
                $('#data-lc3 .data-content-right').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlInfo:function(data){
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var useClass = '';
            if(i==0){
                if($('#data-lc3 .data-content-right').html() == ''){
                    useClass = ' article-list-selected';
                    F_Article._getDetail(data.list[i].id);
                }
            }
            var content = (data.list[i].source.content.length > 60) ? data.list[i].source.content.substr(0,60)+'..' : data.list[i].source.content;
            str += '\
                <ul class="article-list'+useClass+'" data-i="'+data.list[i].id+'">\
                    <li>\
                        <span class="article-title">'+F_Common._focusKeywords(data.list[i].source.title)+'</span>\
                    </li>\
                    <li class="detail-infor">\
                        <span>来源：'+G_Article._getSource(data.list[i].source.source)+'</span>\
                        <span>时间：'+G_Date._dateFormat('short',data.list[i].source.post_date)+'</span>\
                    </li>\
                    <p>'+F_Common._focusKeywords(content)+'</p>\
                </ul>';
        }
        return str;
    },
    _htmlDetail:function(data){
        var content = htmltUnicodeTagScriptEscape(data.raw_html_content);
        content = htmlspecialchars_decode(eval("'" + content + "'"));
        content = htmltTagScriptEscape(content);
        var str = '\
             <li class="title-bar">\
                <span class="title">'+data.title+'</span>\
                <ul>\
                    <li><span>'+G_Article._getSource(data.source)+'</span><span class="datetime">'+data.post_date+'</span></li>\
                </ul>\
            </li>\
            <p>'+content+'</p>';
        return str;
    }
}
var F_Common = {
    _tabChange:function(index,dom,domSlider,onClass,width,diff,current){
        dom.eq(index).addClass(onClass).siblings().removeClass(onClass);
        var float = index;
        if(index == 2 && current == 0)float = 1;
        domSlider.animate({
            left:((float*width)+diff)+'px'
        },function(){});
        for(var i=0;i<=2;i++){
            if(i == index){
                $('#data-lm'+(i+1)).show();
                $('#data-lc'+(i+1)).show();
            }else{
                $('#data-lm'+(i+1)).hide();
                $('#data-lc'+(i+1)).hide();
            }
        }
        switch(index+''){
            case '0':
                if($('#data-lc1 .article-list').html() == ''){
                    F_Forum._getInfo(1);
                }
                break;
            case '1':
                if($('#data-lc2 .dc-list-content').html() == ''){
                    F_Apps._getInfo(1);
                }
                break;
            case '2':
                if($('#data-lc3 .article-list').html() == ''){
                    F_Article._getInfo(1);
                }
                break;
        }
    },
    _gameLogo:function(gameId){
        var gameInfo = G_Game._getGame([gameId],1);
        var str = '';
        if(gameInfo){
            str += '\
            <img src="'+gameInfo[gameId][0]+'">\
            <div class="search_game_info"><span class="c_colorB">'+gameInfo[gameId][1]+'</span><br>数据中心</div>';
        }
        return str;
    },
    _focusKeywords:function(data){
        var keywords = '';
        if(!isUseKeywordReset)keywordReset = '';
        if(keywordReset == ''){
            if(keywordBuff == ''){
                keywords = F_Common._getKeywords();
            }else{
                keywords = keywordBuff;
            }
        }else{
            keywords = keywordReset
        }
        var back = data;
        if(keywords != ''){
            keywords = keywords.toLowerCase();
            keywords = keywords.split(',');
            var index = $.inArray('ss',keywords);
            if(index > -1){
                back = G_Common._focusKeywords('ss',back);
                keywords.splice(index,1);
            }
            for(var i=0;i<keywords.length;i++){
                back = G_Common._focusKeywords(keywords[i],back);
            }
        }
        return back;
    },
    _getKeywords:function(){
        return $.trim($('input[name="data_keywords"]').val());
    },
    _removeClass:function(dom){
        $('#data-lm'+dom+' .data-time span').each(function(){
            $(this).removeClass("data-span-selected")
        });
    },
    _date:function(dom){
        var chooseDate = '';
        var back = {begin:'',end:''};
        if(dom != 3 && mail_beginDate !='' && mail_endDate != ''){
            back.begin = mail_beginDate;
            back.end = mail_endDate;
            return back;
        }
        $('#data-lm'+dom+' .data-time span').each(function(){
            if($(this).hasClass("data-span-selected")){
                chooseDate = $(this).html();
            }
        });
        if(chooseDate == ''){
            back.begin = $('#db'+dom).val();
            back.end = $('#de'+dom).val();
        }else{
            switch(chooseDate){
                case '最近7天':
                    back.begin = G_Date._get(-6);
                    back.end = G_Date._get(0);
                    break;
                case '最近2周':
                    back.begin = G_Date._get(-13);
                    back.end = G_Date._get(0);
                    break;
                case '最近1月':
                    back.begin = G_Date._get(-29);
                    back.end = G_Date._get(0);
                    break;
                case '最近3月':
                    back.begin = G_Date._get(-89);
                    back.end = G_Date._get(0);
                    break;
            }
            $('#dc'+dom).html(back.begin+' 至 '+back.end);
            $('#db'+dom).val(back.begin);
            $('#de'+dom).val(back.end);
        }
        return back;
    },
    _keyword:function(){
        return $.trim($('input["name=data_keywords"]').val());
    },
    _onFocus:function(dom){
        $('#data-lc'+dom+' .article-list').on('click',function(){
            switch(dom){
                case 1:
                    keywordReset = '';
                    var ikey = $(this).attr('data-i');
                    var tkey = $(this).attr('data-t');
                    keywordReset = $(this).attr('data-w');
                    if(ikey && tkey){
                        F_Forum._getDetail(ikey,tkey,1);
                    }
                    break;
                case 3:
                    var key = $(this).attr('data-i');
                    if(key){
                        F_Article._getDetail(key);
                    }
                    break;
            }
            $('#data-lc'+dom+' .article-list').removeClass('article-list-selected');
            $(this).addClass('article-list-selected');
        });
    },
    _pageRequest:function(dom,page){
        var total = $('#data-lc'+dom+' .page-list button').attr('data-a');
        if(page > 0 && parseInt(page)<=parseInt(total)){
            switch(dom){
                case 1:
                    F_Forum._getInfo(page);
                    break;
                case 2:
                    F_Apps._getInfo(page);
                    break;
                case 3:
                    F_Article._getInfo(page);
                    break;
            }
        }
    },
    _pageGo:function(dom,page,postData){
        $('#data-lc'+dom+' .page-list .prev').click(function(){
            F_Common._pageRequest(dom,parseInt(page)-1);
        });
        $('#data-lc'+dom+' .page-list .next').click(function(){
            F_Common._pageRequest(dom,parseInt(page)+1);
        });
        $('#data-lc'+dom+' .page-list button').click(function(){
            var goPage = $.trim($('#data-lc'+dom+' .page-list input').val());
            if(goPage == '' || isNaN(goPage)){
                G_Pop._init('msg',{content:'页码必须为数字,请确认！'});
                return false;
            }
            if(parseInt(goPage) <= 0){
                G_Pop._init('msg',{content:'页码错误,请确认！'});
                return false;
            }
            if(parseInt(goPage) == parseInt(page)){
                return false;
            }
            F_Common._pageRequest(dom,goPage);
        });
        submitBind($('#data-lc'+dom+' .page-list button'),$('#data-lc'+dom+' .page-list input'));
    }
}
var F_Source = {
    _get:function(){
        G_Port._ajax('crawlerAndApp','get',true,'project_id='+G_GameId,null,null,function(data,msg){
                if(data.forum_info_list && data.forum_info_list.length>0){
                    $('#data-lm1 .data-from').html(F_Source._html('forum',data.forum_info_list,'forumCheckbox'));
                }
                if(data.apps_list && data.apps_list.length>0){
                    $('#data-lm2 .data-from').html(F_Source._html('app',data.apps_list,'appCheckbox'));
                }
                paddingTop(1);
                paddingTop(2);
                paddingTop(3);

                if(mail_beginDate == '')F_Forum._getInfo(1);

                F_Forum._tagCheck();
                F_Article._tagCheck();
                F_Apps._tagCheck();
            },null
        )
    },
    _html:function(type,data,checkboxName){
        var str = '<b>筛选:</b>';
        switch(type){
            case 'forum':
                for(var i=0;i<data.length;i++){
                    str += '\
                        <span>\
                            <input id="checkFromB'+i+'" name="'+checkboxName+'" type="checkbox" value="'+data[i].info_id+'"/> '+data[i].fourm_name+'<label for="checkFromB'+i+'"></label>\
                        </span>';
                }
                break;
            case 'app':
                for(var i=0;i<data.length;i++){
                    var source = G_Game._source(data[i].source_type);
                    if(source){
                        str += '\
                        <span>\
                            <input id="checkFromA'+i+'" name="'+checkboxName+'" type="checkbox" value="'+source.source_type+'"/> '+source.source_desc+'<label for="checkFromA'+i+'"></label>\
                        </span>';
                    }
                }
                break;
        }
        return str;
    }
}