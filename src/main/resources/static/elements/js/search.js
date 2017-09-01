var keywords = null;
var Identify = null;
var mainClass = '';
var subClass = '';
$(function(){
    G_Login._check();
    C_Dom._header(-1);
    C_Dom._quicker();
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();

    var $_GET = getUrl('query');
    if(!($_GET.k)){
        G_Pop._init('alert',{content:'搜索关键词必须填写,请确认！'});
        return;
    }else{
        keywords = G_Common._decodeUrl($_GET.k);
        $('#headerPart input[name="k"]').val(keywords);
        if($_GET.t){
            switch ($_GET.t){
                case 'k':
                    break;
                default:
                    if(!($_GET.d)){
                        G_Pop._init('alert',{content:'搜索关键词必须填写,请确认！'});
                        return;
                    }
                    Identify = G_Common._decodeUrl($_GET.d);
                    break;
            }

            $('.ts_slider').css('left','150px');
            $('#bs_search_game').hide();
            $('#bs_search_article').show();
            $('#choose_tab2').hide();
        }

        F_Game._getList(1);
        F_Article._getList(1,$_GET.t);
    }
    tabChoose($('.article-tab .tabs li'),$('.ts_slider'),150,0,null,'search');
});
var F_Game = {
    _buff:{},
    _getList:function(page){
        G_Port._ajax('projectSearch','get',true,'keyword='+encodeURIComponent(keywords)+'&index='+((page-1)*G_Page._size)+'&limit='+G_Page._size,function(){
                $('#bs_search_game .article-detail-list').html(G_Pre._loading('c_padding30'));
                $('#bs_search_game .page-list').html('');
            },function(){
                $('#bs_search_game .article-detail-list').html('');
                $('#bs_search_game .page-list').html('');
            },function(data,msg){
                var total = 0;
                if(data && data.project_list.length>0){
                    var total = data.total;
                    $('#bs_search_game .article-detail-list').html(F_Game._htmlList(data.project_list));
                    F_Page._init('game',{total:total},page);
                }else{
                    $('#bs_search_game .article-detail-list').html(G_Pre._empty('没找到？<a onclick="openPlan();" class="c_cursor c_colorB">申请添加新游戏</a>'));
                }
                $('.article-tab ul li').eq(0).find('b').html(total);
            },function(data,msg,code){
                $('#bs_search_game .article-detail-list').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            var type = '';
            var channel = '';
            if(data[i].game_type){
                type = data[i].game_type.split('/');
                if(type[1]){
                    type = type[1];
                    type = type.split(',');
                    type = type[0];
                }else{
                    type = data[i].game_type;
                }
            }
            if(data[i].channel_content_num && data[i].channel_content_num > 0){
                channel = '<span>渠道评论：<b class="c_colorGS c_cursor" onclick="F_Game._redirect(\'c\','+data[i].project_id+')">'+data[i].channel_content_num+'</b></span>';
            }
            var tags = G_Game._tag(data[i].tag_list);
            var tag = '';
            if(tags){
                $.each(tags,function(key,value){
                    tag += '<button onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('search')+'?k='+encodeURIComponent(value)+'\')">'+value+'</button> ';
                });
            }
            var typeName = data[i].game_type.replace('休闲益智','益智');
            str += '\
                <li class="detail-content">\
                    <img src="'+G_Game._imgUrl(data[i].project_id)+'" alt="'+data[i].project_name+'">\
                    <ul class="detail-right">\
                        <li class="c_marginB10">\
                            <span class="game-title" >'+G_Common._focusKeywords(keywords,data[i].project_name)+'</span>\
                            <i class="c_img "></i> 第 <strong>'+data[i].hot_rank+'</strong> 名　'+type+'类舆论热度排行\
                        </li>\
                        <li class="search-detail-tag c_marginB10">'+tag+'</li>\
                        <li class="search-detail-infor">\
                            <span title="'+typeName+'">游戏类型：'+typeName+'</span> <span title="'+data[i].author+'">开发商：'+data[i].author+'</span>  <span title="'+data[i].distributor+'">发行商：'+data[i].distributor+'</span>\
                        </li>\
                        <li class="search-detail-infor c_marginB10">\
                            <span>媒体报道：<b class="c_colorGS c_cursor" onclick="F_Game._redirect(\'w\','+data[i].project_id+',\''+data[i].project_name+'\')">'+data[i].article_num+'</b></span> <span>论坛反馈：<b class="c_colorGS c_cursor" onclick="F_Game._redirect(\'f\','+data[i].project_id+')">'+data[i].forum_content_num+'</b></span> '+channel+'\
                        </li>\
                        <li class="search-detail-infor">\
                            <button onclick="F_Game._redirect(\'l\','+data[i].project_id+')" type="button" class="btn btn-success">查看游戏灯塔</button> <button onclick="F_Game._redirect(\'a\','+data[i].project_id+')" type="button" class="btn btn-default button2">查看游戏图谱</button>\
                        </li>\
                    </ul>\
                </li>';
        }
        return str;
    },
    _redirect:function (type,id,name) {
        switch(type){
            case 'w':
                G_Jump._go('base',G_Jump._getUrl('search')+'?t=p&k='+encodeURIComponent(name)+'&d='+id);
                break;
            case 'f':
                if(isDemoUser()){
                    openLogin(type+'_'+id);
                }else {
                    G_Jump._go('base', 'outside.html#/gameForum/' + id);
                }
                break;
            case 'c':
                if(isDemoUser()){
                    openLogin(type+'_'+id);
                }else {
                    G_Jump._go('base', 'outside.html#/gameChannel/' + id);
                }
                break;
            case 'l':
                if(isDemoUser()){
                    openLogin(type+'_'+id);
                }else {
                    G_Jump._go('base', 'outside.html#/gameSummary/' + id);
                }
                break;
            case 'a':
                G_Jump._go('base',G_Jump._getUrl('atlas')+'?g='+id);
                //G_Jump._go('base','outside.html#/outsideAtlas/'+id)
                break;
        }

    }
}
var F_Article = {
    _countClick:function(){
        $('#choose_tab2 ul a').each(function(){
            $(this).click(function(){
                $('#choose_tab2>ul>li').each(function(){
                    $(this).removeClass('liOn');
                });
                mainClass = $(this).attr('data-b');
                subClass = $(this).attr('data-s');
                if(subClass == ''){
                    $(this).parent('li').addClass('liOn');
                }else{
                    $(this).parent().parent().parent().addClass('liOn');
                }
                F_Article._getList(1);
            });
        });
    },
    _getCount:function(){
        $('#choose_tab2').show();
        G_Port._ajax('articleClassifyCount','get',true,'keyword='+encodeURIComponent(keywords),null,null,function(data,msg){
            $('#choose_tab2 ul').html(C_Dom._searchTab(data,mainClass));
            $('#choose_tab2>ul>li').each(function(index){
                if($(this).hasClass('liOn'))lastChoosed = index;
                $(this).hover(function(){
                    if($(this).attr('data-pop') == 1){
                        $(this).find('ul').show();
                    }
                },function(){
                    if($(this).attr('data-pop') == 1){
                        $(this).find('ul').hide();
                    }
                });
            });
            F_Article._countClick();
        },function(data,msg,code){
            $('#choose_tab2').hide();
        });
    },
    _getList:function(page,type){
        var postData = '';
        switch(type){
            case 't':
                postData = 'topic_id='+encodeURIComponent(Identify)+'&index='+((page-1)*G_Page._size)+'&limit='+G_Page._size+'&need_preview=1&data_date_start='+encodeURIComponent(G_Date._get(-29))+'&data_date_end='+encodeURIComponent(G_Date._get(0));
                break;
            case 'p':
                postData = 'project_id='+encodeURIComponent(Identify)+'&index='+((page-1)*G_Page._size)+'&limit='+G_Page._size+'&need_preview=1';
                break;
            default:
                postData = 'keyword='+encodeURIComponent(keywords)+'&index='+((page-1)*G_Page._size)+'&limit='+G_Page._size+'&need_preview=1';
                postData += (mainClass == '') ? '' : '&main_class='+encodeURIComponent(mainClass);
                postData += (subClass == '') ? '' : '&sub_class='+encodeURIComponent(subClass);
                break;
        }
        G_Port._ajax('articleList','get',true,postData,function(){
                $('#bs_search_article .article-detail-list').html(G_Pre._loading('c_padding30'));
                $('#bs_search_article .page-list').html('');
            },function(){
                $('#bs_search_article .article-detail-list').html('');
                $('#bs_search_article .page-list').html('');
            },function(data,msg){
                var total = 0;
                if(data.data && data.data.list.length>0){
                    var total = data.data.total;
                    if(!type){
                        if($('#choose_tab2 ul').html() == '')F_Article._getCount();
                    }
                    //$('#bs_search_article .article-detail-list').html(F_Article._htmlList(data.data));
                    F_Article._htmlList(data.data)
                    F_Page._init('article',{total:total,type:type},page);
                }else{
                    $('#bs_search_article .article-detail-list').html(G_Pre._empty('暂无数据'));
                }
                if (mainClass == '')$('.article-tab ul li').eq(1).find('b').html(total);
                //$('#bs_search_article .article-list-header-tip').html('<li class="result-num">为您找到<span>'+total+'</span>个相关结果</li><li class="article-list-tip-name"><span>'+keywords+'</span>_相关文章</li>');
            },function(data,msg,code){
                $('#bs_search_article .article-detail-list').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data){
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var content = (data.list[i].source.content.length > 150) ? data.list[i].source.content.substr(0,150)+'..' : data.list[i].source.content;
            str += '<li class="detail-content">';
            var back = G_Article._getMainClass(data.list[i].source.main_class,'img');
            str += '<a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank" title="'+data.list[i].source.title+'">';
            str += G_Article._previewImg(data.list[i].source.preview_img,data.list[i].source.source);
            str += '</a>';
            str += '<ul class="detail-right">';
            str += '<li>';
            str += '<span class="article-title"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank">'+(G_Common._focusKeywords(keywords,data.list[i].source.title))+'</a></span>';
            str += '</li>';
            str += '<li class="detail-infor c_relative"><i class="c_img '+back.position+'"></i> 来自';
            str += '<span class="article-from">'+G_Article._getSource(data.list[i].source.source)+'</span>';
            str += '<span class="article-date">'+data.list[i].source.post_date+'</span>';
            str += '</li>';
            str += '<p>'+G_Common._focusKeywords(keywords,content)+'<span class="readall"><a class="moreLink" href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank">阅读全文</a></span></p>';
            str += '</ul>';
            str += '</li>';
        }
        setTimeout(function(){
            $('#bs_search_article .article-detail-list').html(str);
        },200);
        //return str;
    }
}
var F_Page = {
    _init:function(type,data,page){
        var dom = '';
        switch(type){
            case 'game':
                dom = $('#bs_search_game');
                break;
            case 'article':
                dom = $('#bs_search_article');
                break;
        }
        dom.find('.page-list').html(G_Page._show({total:data.total,page:page},'number'));
        dom.find('.page-list span').each(function(){
            var isJump = false;
            $(this).click(function(){
                if($(this).hasClass('prev')){
                    isJump = true;
                    page = parseInt(page)-1;
                }else if($(this).hasClass('next')){
                    isJump = true;
                    page = parseInt(page)+1;
                }else if($(this).hasClass('page-num')){
                    if($(this).html() != '…' && page != $(this).html()){
                        isJump = true;
                        page = $(this).html();
                    }
                }
                if(isJump){
                    switch(type){
                        case 'game':
                            F_Game._getList(page);
                             break;
                        case 'article':
                            F_Article._getList(page,data.type);
                            break;
                    }
                    GoToTop();
                }
            });
        })
    }
}