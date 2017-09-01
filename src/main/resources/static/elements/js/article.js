var dateBegin = G_Date._get(-6);
var dateYesterday = G_Date._get(-1);
var dateEnd = G_Date._get(0);
$(function(){
    G_Login._check();
    C_Dom._header(4);
    C_Dom._quicker();
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();
    G_AD._ad2($('.right .top .top_ad'));

    var controller = getUrl('controller');
    var $_GET = getUrl('query');
    switch(controller){
        case 'article':
            var typeArr = ['classify','top','hot','game','topic'];
            if($_GET.t && ($.inArray($_GET.t,typeArr) > -1)){
                var urlQuery = [];
                var title = '';
                var postData = [];
                urlQuery.push('t='+$_GET.t);
                $_GET.t = decodeURIComponent($_GET.t);    //type
                if($_GET.g && !isNaN($_GET.g)){
                    postData.push('project_id='+$_GET.g);
                    urlQuery.push('g='+$_GET.g);    //game_id
                }
                if($_GET.n){
                    $_GET.n = decodeURIComponent($_GET.n);
                    urlQuery.push('n='+encodeURIComponent($_GET.n));    //game_name
                }
                if($_GET.d){
                    postData.push('topic_id='+$_GET.d);
                    urlQuery.push('d='+$_GET.d);    //topic_id
                }
                if($_GET.b){
                    postData.push('data_date_start='+$_GET.b);
                    urlQuery.push('b='+$_GET.b);    //date-begin
                }
                if($_GET.e){
                    postData.push('data_date_end='+$_GET.e);
                    urlQuery.push('e='+$_GET.e);    //date-end
                }
                if($_GET.p){
                    if(isNaN($_GET.p))$_GET.p = 1;
                    postData.push('index='+($_GET.p-1)*G_Page._size);
                }else{
                    $_GET.p = 1;
                }
                if($_GET.m){
                    postData.push('main_class='+$_GET.m);
                    $_GET.m = decodeURIComponent($_GET.m);
                    urlQuery.push('m='+encodeURIComponent($_GET.m));    //main-class
                }
                if($_GET.s){
                    postData.push('sub_class='+$_GET.s);
                    $_GET.s = decodeURIComponent($_GET.s);
                    urlQuery.push('s='+encodeURIComponent($_GET.s));    //sub-class
                }
                var isIcon = true;
                switch($_GET.t){
                    case 'classify':
                        F_Common._formatHtml('classify',$_GET.m);
                        if(!$_GET.m){
                            G_Pop._init('alert',{content:'选择类型错误,请确认！'});
                            return;
                        }
                        title = $_GET.s ? $_GET.m+'-'+$_GET.s : $_GET.m;
                        break;
                    case 'top':
                        F_Common._formatHtml('top');
                        isIcon = false;
                        title = '今日头条';
                        postData.push('data_date_start='+dateYesterday);
                        postData.push('data_date_end='+dateEnd);
                        postData.push('order_by_field=post_date,score');
                        postData.push('order_type=desc,desc');
                        break;
                    case 'hot':
                        F_Common._formatHtml('hot');
                        isIcon = false;
                        title = '最近热门';
                        postData.push('data_date_start='+dateBegin);
                        postData.push('data_date_end='+dateEnd);
                        postData.push('order_by_field=score');
                        postData.push('order_type=desc');
                        break;
                    case 'game':
                        isIcon = false;
                        if(!$_GET.n){
                            G_Pop._init('alert',{content:'选择游戏错误,请确认！'});
                            return;
                        }
                        title = $_GET.n+' 相关报道';
                        break;
                    case 'topic':
                        isIcon = false;
                        if(!$_GET.n || !$_GET.d){
                            G_Pop._init('alert',{content:'选择热点错误,请确认！'});
                            return;
                        }
                        title = $_GET.n+' 相关';
                        break;
                }
                $('.mediarticle-list .title h3').html(title);

                if(postData && postData.length > 0){
                    postData.push('limit='+G_Page._size);
                    postData.push('need_preview=1');
                    F_List._getList(postData,urlQuery,isIcon,$_GET.p);
                }
            }
            setTimeout("F_Hot._getHotToday()",1800);
            break;
        case 'detail':
            if($_GET.t){
                $_GET.t = decodeURIComponent($_GET.t);
                F_Detail._getDetail($_GET.t);
                F_Hot._getRelation($_GET.t);
            }else{
                $('.article-content').html('');
            }
            break;
    }
    setTimeout("F_Hot._getHotRecent()",600);
    setTimeout("F_Classify._getInfo()",1200);
    $('.mid .top-content .check-more').click(function(){
        var classify = $(this).attr('data-c');
        if(classify != ''){
            var url = G_Jump._getUrl('article');
            url += '?t=classify&m='+encodeURIComponent(classify);
            G_Jump._go('article',url);
            return;
        }
    });
    $('.top .top-content .check-more').click(function(){
        var url = G_Jump._getUrl('article');
        url += '?t=top'
        G_Jump._go('article',url);
        return;
    });
    $('.bottom .top-content .check-more').click(function(){
        var classify = $(this).attr('data-c');
        var url = G_Jump._getUrl('article');
        url += '?t=hot';
        G_Jump._go('article',url);
        return;
    });
});
var F_Common = {
    _formatHtml:function(type,mainClass){
        $('#choose_tab').show().html(C_Dom._articleTab(type,mainClass));
        $('.mediarticle-list').css('margin-top','90px');
        $('.mediarticle-list .right .top').css('margin-top','0');
        $('.mediarticle-list .title').hide();
        tabChoose($('#choose_tab>ul>li'),$('.ct_slider'),95,0,'liOn','articleTab');
    }
}
var F_List = {
    _getList:function(postData,queryData,isIcon,page){
        var index = (page-1)*G_Page._size;
        G_Port._ajax('articleList','get',true,postData.join('&')+'&index='+index,function(){
                $('.article-detail-list').html(G_Pre._loading('c_padding30'));
                $('.page-list').html('');
            },function(){
                $('.article-detail-list').html('');
                $('.page-list').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    //$('.article-detail-list').html(F_List._htmlList(data.data,isIcon));
                    F_List._htmlList(data.data,isIcon)
                    $('.page-list').html(G_Page._show({total:data.data.total,page:page},'number'));

                    $('.page-list span').each(function(){
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
                                //jump跳转
                                /*
                                var url = G_Jump._getUrl('article')+'?'+queryData.join('&')+'&p='+page;
                                G_Jump._go('article',url);
                                 */
                                //ajax异步
                                F_List._getList(postData,queryData,isIcon,page);
                                GoToTop();
                            }
                        });
                    });
                }else{
                    $('.article-detail-list').html('<div class="c_empty">暂无数据</div>');
                }
            },function(data,msg,code){
                $('.article-detail-list').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data,isIcon){
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var content = (data.list[i].source.content.length > 150) ? data.list[i].source.content.substr(0,150)+'..' : data.list[i].source.content;
            str += '<li class="detail-content">';
            /*
            if(isIcon){
                var back = G_Article._getMainClass(data.list[i].source.main_class,'img');
                str += '<img src="'+back.img+'" alt="'+data.list[i].source.sub_class+'" style="background: '+back.color+'">';
                str += '<ul class="detail-right">';
            }else{
                str += '<ul class="detail-right detail-right-no-icon">';
            }
            */
            var back = G_Article._getMainClass(data.list[i].source.main_class,'img');
            str += '<a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank" title="'+data.list[i].source.title+'">';
            str += G_Article._previewImg(data.list[i].source.preview_img,data.list[i].source.source);
            str += '</a>';
            str += '<ul class="detail-right">';
            str += '<li>';
            str += '<span class="article-title"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank">'+(data.list[i].source.title)+'</a></span>';
            str += '</li>';
            str += '<li class="detail-infor c_relative"><i class="c_img '+back.position+'"></i> 来自';
            str += '<span class="article-from">'+G_Article._getSource(data.list[i].source.source)+'</span>';
            str += '<span class="article-date">'+data.list[i].source.post_date+'</span>';
            str += '</li>';
            str += '<p>'+content+'<span class="readall"><a class="moreLink" href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank">阅读全文</a></span></p>';
            str += '</ul>';
            str += '</li>';
        }
        setTimeout(function(){
            $('.article-detail-list').html(str);
        },200);
        //return str;
    }
}
var F_Classify = {
    _buff:{},
    _getInfo:function(){
        var classify = G_Article._getClassify();
        var first= '';
        var tab = '';
        var i = 0;
        $.each(classify,function(key,value){
            if(i < 5 && key != '电竞'){
                if(first == '')first = key;
                tab += '<li>'+key+'</li>';
                i++;
            }
        })
        $('.mid .top-content .tab').html(tab);
        $('.mid .top-content .check-more').attr('data-c',first);
        tabChoose($('.mid .top-content .tab li'),$('.tm_slider'),50,5,null,'article');
        F_Classify._getPort(0,first);
    },
    _getPort:function(index,data){
        if(F_Classify._buff['classify'+index]){
            $('#bs_classify').html(F_Classify._htmlList(F_Classify._buff['classify'+index]));
            return;
        }
        G_Port._ajax('articleList','get',true,'main_class='+encodeURIComponent(data)+'&index=0&limit=5',function(){
                $('#bs_classify').html(G_Pre._loading());
            },function(){
                $('#bs_classify').html('');
            },function(data,msg){
                F_Classify._buff['classify'+index] = data.data.list;
                if(data.data && data.data.list.length>0){
                    $('#bs_classify').html(F_Classify._htmlList(data.data.list));
                }
            },function(data,msg,code){
                $('#bs_classify').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            if(i>4)break;
            str += '<li title="'+data[i].source.title+'"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data[i].id)+'" target="_blank"><span class="guidelines-date">'+data[i].source.post_date+'</span><span class="guide-title">'+data[i].source.title+'</span></a></li>';
        }
        return str;
    }
}
var F_Hot = {
    _getRelation:function(data){
        G_Port._ajax('articleRelation','get',true,'title='+encodeURIComponent(data),function(){
                $('#bs_hot_relation').html(G_Pre._loading());
            },function(){
                $('#bs_hot_relation').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#bs_hot_relation').html(F_Classify._htmlList(data.data.list));
                }
            },function(data,msg,code){
                $('#bs_hot_relation').html(G_Pre._empty(msg));
            }
        )
    },
    _getHotToday:function(){
        G_Port._ajax('articleList','get',true,'data_date_start='+dateYesterday+'&data_date_end='+dateEnd+'&order_by_field=post_date,score&order_type=desc,desc&index=0&limit=5',function(){
                $('#bs_hot_today').html(G_Pre._loading());
            },function(){
                $('#bs_hot_today').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#bs_hot_today').html(F_Classify._htmlList(data.data.list));
                }
            },function(data,msg,code){
                $('#bs_hot_today').html(G_Pre._empty(msg));
            }
        )
    },
    _getHotRecent:function(){
        G_Port._ajax('articleList','get',true,'data_date_start='+dateBegin+'&data_date_end='+dateEnd+'&order_by_field=score&order_type=desc&index=0&limit=5',function(){
                $('#bs_hot_recet').html(G_Pre._loading());
            },function(){
                $('#bs_hot_recet').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#bs_hot_recet').html(F_Classify._htmlList(data.data.list));
                }
            },function(data,msg,code){
                $('#bs_hot_recet').html(G_Pre._empty(msg));
            }
        )
    }
}
var F_Detail = {
    _getDetail:function(data){
        G_Port._ajax('articleDetail','get',true,'title='+encodeURIComponent(data),function(){
                $('.article-content').html(G_Pre._loading());
            },function(){
                $('.article-content').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    //$('.article-content').html(F_Detail._htmlDetail(data.data.list[0].source));
                    F_Detail._htmlDetail(data.data.list[0].source)
                }
            },function(data,msg,code){
                $('.article-content').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlDetail:function(data){
        var str = '';
        if(data.image_list && data.image_list.length>0)G_Common._imgBuff(data.image_list);
        var content = htmltUnicodeTagScriptEscape(data.raw_html_content);
        try{
            content = eval("'" + content + "'");
        }catch(e){
            content = unescape(content.replace(/\u/g, "%u"));
        }
        content = htmlspecialchars_decode(content);
        content = htmltTagScriptEscape(content);
        str += '\
            <ul>\
                <h2>'+data.title+'</h2>\
                <li>\
                    <span>'+G_Article._getSource(data.source)+'</span>\
                    <span class="datetime">'+data.post_date+'</span>\
                    <span class="viewSource"><a href="'+(data.url)+'" class="sourceLink" target="_blank">查看原文</a></span>\
                </li>\
                <p>'+content+'</p>\
            </ul>';

        setTimeout(function(){
            $('.article-content').html(str);
        },200);
        //return str;
    }
}
