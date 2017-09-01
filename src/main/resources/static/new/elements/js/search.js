var keywords = null;
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
        keywords = decodeURIComponent($_GET.k);
        F_Game._getList(1);
    }
    tabChoose($('.article-tab .tabs li'),$('.ts_slider'),100,0,null,'search');
});
var F_Game = {
    _buff:{},
    _getList:function(page){
        $('#bs_search_game .article-detail-list').html(G_Pre._loading('c_padding30'));
        $('#bs_search_game .page-list').html('');
        var games = !!(F_Game._buff.game) ? F_Game._buff.game : G_Game._search(keywords);
        var total = 0;
        if(games && games.length > 0){
            total = games.length;
            var begin = (page-1)*G_Page._size;
            var i=1;
            var str = '';
            for(begin;begin<total;begin++){
                if(i > G_Page._size)break;
                str += F_Game._htmlList(games[begin]);
                i++;
            }
            $('#bs_search_game .article-detail-list').html(str);
            F_Page._init('game',{total:total},page);
        }else{
            $('#bs_search_game .article-detail-list').html(G_Pre._empty('未找到相关数据'));
        }
        $('#bs_search_game .article-list-header-tip').html('<li class="result-num">为您找到<span>'+total+'</span>个相关结果</li><li class="article-list-tip-name"><span>'+keywords+'</span>_相关游戏</li>');
    },
    _htmlList:function(data){
        var str = '';
        str += '\
            <li class="detail-content">\
                <img src="'+G_Game._imgUrl(data.project_id)+'" alt="'+data.project_name+'" onclick="G_Jump._url(\'light\','+data.project_id+')" class="c_cursor">\
                <ul class="detail-right">\
                    <li>\
                        <span class="game-title c_cursor" onclick="G_Jump._url(\'light\','+data.project_id+')">'+data.project_name+'</span>\
                        <i class="c_img "></i>\
                        <span class="check-gamepic"><a onclick="G_Jump._url(\'atlas\','+data.project_id+')">查看游戏图谱></a></span>\
                    </li>\
                    <li class="detail-infor">\
                        <b>开发商：</b><span class="article-publisher">'+data.author+'</span>\
                    </li>\
                    <li class="detail-infor">\
                        <b>游戏类型：</b><span class="article-game-style">'+G_Game._type(data.game_type)+'</span>\
                    </li>\
                </ul>\
            </li>';

        return str;
    }
}
var F_Article = {
    _getList:function(page){
        G_Port._ajax('articleList','get',true,'keyword='+encodeURIComponent(keywords)+'&index='+((page-1)*G_Page._size)+'&limit='+G_Page._size+'&need_preview=1',function(){
                $('#bs_search_article .article-detail-list').html(G_Pre._loading('c_padding30'));
                $('#bs_search_article .page-list').html('');
            },function(){
                $('#bs_search_article .article-detail-list').html('');
                $('#bs_search_article .page-list').html('');
            },function(data,msg){
                var total = 0;
                if(data.data && data.data.list.length>0){
                    var total = data.data.total;
                    $('#bs_search_article .article-detail-list').html(F_Article._htmlList(data.data));
                    F_Page._init('article',{total:total},page);
                }
                $('#bs_search_article .article-list-header-tip').html('<li class="result-num">为您找到<span>'+total+'</span>个相关结果</li><li class="article-list-tip-name"><span>'+keywords+'</span>_相关文章</li>');
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
            var back = G_Article._getMainClass(data.list[i].source.sub_class,'img');
            str += '<img src="'+back.img+'" alt="'+data.list[i].source.sub_class+'" style="background: '+back.color+'">';
            str += '<ul class="detail-right">';
            str += '<li>';
            str += '<span class="article-title"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank">'+(data.list[i].source.title)+'</a></span>';
            str += '</li>';
            str += '<li class="detail-infor">来自';
            str += '<span class="article-from">'+G_Article._getSource(data.list[i].source.source)+'</span>';
            str += '<span class="article-readall"><a href="'+(data.list[i].source.url)+'" target="_blank">查看原文</a></span>';
            str += '<span class="article-date">'+data.list[i].source.post_date+'</span>';
            str += '</li>';
            str += '<p>'+content+'<span class="readall"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank">阅读全文</a></span></p>';
            str += '</ul>';
            str += '</li>';
        }
        return str;
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
                            F_Article._getList(page);
                            break;
                    }
                    GoToTop();
                }
            });
        })
    }
}