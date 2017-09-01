var date1Begin = '';
var date1End = '';
var order1 = '';
var date1 = '';
var date2Begin = '';
var date2End = '';
var date2 = '';
var date3Begin = '';
var date3End = '';
var date3 = '';
var keywordBuff = '';
$(function(){
    G_Login._check();
    var $_GET = getUrl('query');
    if(!$_GET.t)$_GET.t = 0;
    tabChoose($('.data-content-header .data-search-type ul span'),$('.td_slider'),90,375,'liOn','data',$_GET.t);
    if(isDemoUser())G_GameId = demoProjectId();

    submitBind($('.search .dataicon'));
    $('.search .dataicon').click(function(){
        var keywords = F_Common._getKeywords();
        if(keywords == ''){
            G_Pop._init('msg',{content:'搜索关键词必须填写,请确认！'});
            return false;
        }else{
            if(keywordBuff != keywords){
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
            }
        }
    });
    dataChoose._section({'autoCommit':false,'todayValid':true},1,'','',function(begin,end){
        if(begin !=date1Begin || date1End != end){
            date1 = '';
            F_Common._removeClass(1);
            date1Begin = begin;
            date1End = end;
            F_Forum._getInfo(1);
        }
    });
    dataChoose._section({'autoCommit':false,'todayValid':true},2,'','',function(begin,end){
        if(begin !=date2Begin || date2End != end){
            date2 = '';
            F_Common._removeClass(2);
            date2Begin = begin;
            date2End = end;
            F_Apps._getInfo(1);
        }
    });
    dataChoose._section({'autoCommit':false,'todayValid':true},3,'','',function(begin,end){
        if(begin !=date3Begin || date3End != end){
            date3 = '';
            F_Common._removeClass(3);
            date3Begin = begin;
            date3End = end;
            F_Article._getInfo(1);
        }
    });
    if($('#data-lm1 .data-from').html() == ''){
        F_Source._get();
    }
});
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
        var date = F_Common._date(2);
        var postDate = [];
        if(date){
            if(date.begin)postDate.push('data_date_start='+date.begin);
            if(date.end)postDate.push('data_date_end='+date.end);
        }
        var source = F_Apps._getApp();
        if(source)postDate.push('source_type_list='+source);

        var searchKeyword = F_Common._getKeywords();
        if(searchKeyword)postDate.push('keyword='+encodeURIComponent(searchKeyword));

        if(postDate && postDate.length > 0){
            postDate.push('project_id='+G_GameId);
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
                    if(data.data && data.data.list.length > 0){
                        $('#data-lc2 .dc-list-content').html(F_Apps._htmlInfo(data.data));
                        $('#data-lc2 .page-list').html(G_Page._show({total:data.data.total,page:page},'simple'));
                        F_Common._pageGo(2,page);
                        $('.dc-list-content').perfectScrollbar();
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
                <p>'+data.list[i].source.content+'</p>\
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
            case '最新发布':
                return 'publish_time';
                break;
            case '最多回复':
                return 'reply_num';
                break;
            default:
                return '';
                break;
        }
    },
    _getDetail:function(ikey,tkey,page){
        G_Port._ajax('forumDetail','get',true,'project_id='+G_GameId+'&info_id='+ikey+'&title_id='+tkey+'&index=0&limit=200',function(){
                $('#data-lc1 .data-content-right').html(G_Pre._loading('c_padding30'));
            },function(){
                $('#data-lc1 .data-content-right').html('');
            },function(data,msg){
                if(page == 1){
                    var titleData = F_Forum._getTitle(ikey,tkey);
                    if(titleData){
                        $('#data-lc1 .data-content-right').html(F_Forum._htmlTitle(titleData));
                    }
                }
                $('#data-lc1 .data-content-right').append(F_Forum._htmlDetail(data.data,page));

                $('#data-lc1  .data-content-right').perfectScrollbar();
            },function(data,msg,code){
                $('#data-lc1 .data-content-right').html(G_Pre._empty(msg));
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
        var date = F_Common._date(1);
        var postDate = [];
        if(date){
            if(date.begin)postDate.push('data_date_start='+date.begin);
            if(date.end)postDate.push('data_date_end='+date.end);
        }
        var order = F_Forum._getSort();
        if(order)postDate.push('order_by_field='+order);

        var source = F_Forum._getForum();
        if(source)postDate.push('info_id_list='+source);

        var searchKeyword = F_Common._getKeywords();
        if(searchKeyword)postDate.push('keyword='+encodeURIComponent(searchKeyword));

        if(postDate && postDate.length > 0){
            postDate.push('project_id='+G_GameId);
            postDate.push('order_type=desc');
            postDate.push('index='+(page-1)*G_Page._size);
            postDate.push('limit='+G_Page._size);

            G_Port._ajax('forumSearch','get',true,postDate.join('&'),function(){
                    $('#data-lc1 .data-content-left .list-content').html(G_Pre._loading('c_padding30'));
                    $('#data-lc1 .data-content-left .page-list').html('');
                },function(){
                    $('#data-lc1 .data-content-left .list-content').html('');
                },function(data,msg){
                    if(data.data && data.data.list.length > 0){
                        F_Forum._buff = data.data.list;
                        $('#data-lc1 .data-content-left .list-content').html(F_Forum._htmlInfo(data.data));
                        $('#data-lc1 .page-list').html(G_Page._show({total:data.data.total,page:page},'simple'));
                        F_Common._onFocus(1);
                        F_Common._pageGo(1,page);

                        $('#data-lc1 .data-content-left .list-content').perfectScrollbar();
                    }
                },function(data,msg,code){
                    $('#data-lc1 .data-content-left .list-content').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _htmlInfo:function(data){
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var content = (data.list[i].source.content.length > 60) ? data.list[i].source.content.substr(0,60)+'..' : data.list[i].source.content;
            str += '\
                <ul class="article-list" data-i="'+data.list[i].source.info_id+'" data-t="'+data.list[i].source.title_id+'">\
                    <li>\
                        <span class="article-title">'+data.list[i].source.title+'</span>\
                        <span class="article-date">'+G_Date._dateFormat('short',data.list[i].source.publish_time)+'</span>\
                    </li>\
                    <li class="detail-infor">\
                        <span class="article-author">'+data.list[i].source.author+'</span>\
                        <span class="article-from">'+data.list[i].source.crawler_name+'</span>\
                        <span class="article-reply-num">'+data.list[i].source.reply_num+'</span>回帖数\
                    </li>\
                    <p>'+content+'</p>\
                </ul>';
        }
        return str;
    },
    _htmlTitle:function(data){
        var str = '';
        str += '\
            <li class="title-bar">\
                <span class="title">'+data.title+'</span>\
                <ul class="infor">\
                    <li class="infor-addr"><i></i>采集地址:<span><a href="'+data.from_url+'" target="_blank">'+data.from_url+'</a></span></li>\
                    <li class="infor-reply"><i></i>回复数:<span class="reply-num">'+data.reply_num+'</span></li>\
                    <li class="infor-time"><i></i>发帖时间:<span class="publish-time">'+data.publish_time+'</span></li>\
                </ul>\
            </li>\
            <li class="floor top-one">\
                <img src="elements/img/lz.png">\
                <i class="author-icon"></i>\
                <span class="author">'+data.author+'</span>\
                <i class="time-icon"></i>\
                <span class="reply-time">'+data.publish_time+'</span>\
                <p class="reply-content">'+data.content+'</p>\
            </li>';
        return str;
    },
    _htmlDetail:function(data,page){
        var isEnd = false;
        if((G_Page._size*page) > data.total){
            isEnd = true;
        }
        var str = '';
        for(var i=0;i<data.list.length;i++){
            str += '\
                <li class="floor">\
                    <i class="author-icon"></i>\
                    <span class="author">'+data.list[i].source.author+'</span>\
                    <i class="time-icon"></i>\
                    <span class="reply-time">'+data.list[i].source.publish_time+'</span>\
                    <span class="floor-num">'+(((page-1)*G_Page._size)+i+2)+'楼</span>\
                    <p class="reply-content">'+data.list[i].source.content+'</p>\
                </li>';
        }
        if(isEnd){
            str += '<li class="loading-state"><span>已经显示全部</span></li>';
        }
        return str;
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
        if(searchKeyword)postDate.push('keyword='+encodeURIComponent(searchKeyword));
        if(postDate && postDate.length > 0){
            postDate.push('project_id='+G_GameId);
            postDate.push('need_preview=1');
            postDate.push('index='+(page-1)*G_Page._size);
            postDate.push('limit='+G_Page._size);

            G_Port._ajax('articleList','get',true,postDate.join('&'),function(){
                    $('#data-lc3 .data-content-left .list-content').html(G_Pre._loading('c_padding30'));
                    $('#data-lc3 .data-content-left .page-list').html('');
                },function(){
                    $('#data-lc3 .data-content-left .list-content').html('');
                },function(data,msg){
                    if(data.data && data.data.list.length > 0){
                        $('#data-lc3 .data-content-left .list-content').html(F_Article._htmlInfo(data.data));
                        $('#data-lc3 .page-list').html(G_Page._show({total:data.data.total,page:page},'simple'));
                        F_Common._onFocus(3);
                        F_Common._pageGo(3,page);

                        $('#data-lc3 .data-content-left .list-content').perfectScrollbar();
                    }
                },function(data,msg,code){
                    $('#data-lc3 .data-content-left .list-content').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _getDetail:function(key){
        G_Port._ajax('articleDetail','get',true,'title='+encodeURIComponent(key),function(){
                $('#data-lc3 .data-content-right').html(G_Pre._loading('c_padding30'));
            },function(){
                $('#data-lc3 .data-content-right').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#data-lc3 .data-content-right').html(F_Article._htmlDetail(data.data.list[0].source));
                    $('#data-lc3  .data-content-right').perfectScrollbar();
                }
            },function(data,msg,code){
                $('#data-lc3 .data-content-right').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlInfo:function(data){
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var content = (data.list[i].source.content.length > 60) ? data.list[i].source.content.substr(0,60)+'..' : data.list[i].source.content;
            str += '\
                <ul class="article-list" data-i="'+data.list[i].source.title+'">\
                    <li>\
                        <span class="article-title">'+data.list[i].source.title+'</span>\
                        <span class="article-date">'+G_Date._dateFormat('short',data.list[i].source.post_date)+'</span>\
                    </li>\
                    <li class="detail-infor">\
                        <span class="article-from">'+G_Article._getSource(data.list[i].source.source)+'</span>\
                    </li>\
                    <p>'+content+'</p>\
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
                case '最近2月':
                    back.begin = G_Date._get(-59);
                    back.end = G_Date._get(0);
                    break;
                case '最近3月':
                    back.begin = G_Date._get(-89);
                    back.end = G_Date._get(0);
                    break;
            }
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
                    var ikey = $(this).attr('data-i');
                    var tkey = $(this).attr('data-t');
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
    _pageGo:function(dom,page){
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
                F_Forum._getInfo(1);
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