var dateBegin = G_Date._get(-6);
var dateYesterday = G_Date._get(-1);
var dateEnd = G_Date._get(0);
$(function(){
    G_Login._check();
    C_Dom._header(-1);
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect()
    G_AD._ad2($('#postPhoto li'));

    $('.search_index_logo2 img').attr('src','elements/img/logo.gif?nocached='+new Date().getTime());
    setTimeout(function(){
        $('.search_index_logo2 img').attr('src','elements/img/logo.jpg');
    },8000);

    $('.search_index_logo2').click(function(){
        G_Jump._go('open','Data/');
    });
    $('#choose_tab').html(C_Dom._articleTab());
    tabChoose($('#choose_tab>ul>li'),$('.ct_slider'),95,0,'liOn','articleTab');

    tabChoose($('.p_qkTitle ul li'),$('.pk_slider'),80,0,'liOn','index',null,$('.p_qkArea'));
    tabChoose($('.p_qkChoose ul li'),$('.pc_slider'),50,0,'liOn');
    tabChoose($('.p_qkTab dl'),$('.pt_slider'),40,0,'dlOn','vertical');

    G_Game._chooseGame($(".bs_gameItem"),$(".bs_game .dlOn"),$(".bs_gameChoose .liOn"));
    $('.bs_gameChoose ul li').click(function(){
        G_Game._chooseGame($(".bs_gameItem"),$(".bs_game .dlOn"),$(".bs_gameChoose .liOn"));
    });
    $('.bs_game dl').click(function(){
        G_Game._chooseGame($(".bs_gameItem"),$(".bs_game .dlOn"),$(".bs_gameChoose .liOn"));
    });

    $('.bs_gameItem').perfectScrollbar();

    var articleType = F_Article._htmlList(G_Article._getClassify());
    if(articleType){
        $('.bs_article').html(articleType.main);
        $('.bs_articleItem').html(articleType.sub);
    }
    $('#search form').submit(function(){
        var keywords = $.trim($('#search input[name="k"]').val());
        if(keywords == ''){
            G_Pop._init('msg',{content:'搜索关键词必须填写,请确认！'});
            return false;
        }else{
            return true;
        }
    });

    $('.menu-container ul li').each(function(index){
        $(this).click(function(){
            switch(index){
                case 0:
                    G_Jump._go('guide');
                    break;
                case 1:
                    G_Jump._go('light');
                    break;
                case 2:
                    G_Jump._go('atlas');
                    break;
                case 3:
                    G_Jump._go('service');
                    break;
            }
        });
    });

    $('.bottom .top-content .check-more').click(function(){
        var classify = $(this).attr('data-c');
        var url = G_Jump._getUrl('article');
        url += '?t=hot';
        G_Jump._go('article',url);
        return;
    });

    $('.mid .top-content .check-more').click(function(){
        G_Jump._go('atlas');
        return;
    });

    F_Login._status();
    setTimeout("F_Article._getHotRecent()",600);
    F_Article._getHotToday();
    F_Game._getRecom();
    F_Game._getHot();

});
var F_Login = {
    _status:function(){
        if(!isDemoUser()){
            $('.index_user').html('\
                <div id="had-login" class="c_floatRight">\
                   <div class="my-service index_h_my_service">我的服务</div>\
                    <span class="user-name c_cursor">'+G_Login._nick('head')+'</span>\
                    <i class="glyphicon glyphicon-triangle-bottom"></i>\
                    <ul class="login-list c_none">\
                        <li>个人中心</li>\
                        <li>退出登录</li>\
                    </ul>\
                </div>');
            $('#had-login .user-name,#had-login .glyphicon-triangle-bottom').click(function(){
                arrowPopOpen('user',{'open':$("#had-login ul")});
            });
            $('.index_h_my_service').click(function () {
                G_Jump._go('open',G_Jump._getUrl('insidepay'));
            });
            arrowPopClickClose($("#had-login ul"));
            $('#had-login ul li').each(function(index){
                $(this).click(function(){
                    switch(index){
                        case 0:
                            G_Jump._go('user');
                            break;
                        case 1:
                            G_Login._out();
                            break;
                    }
                });
            });
        }else{
            $('.index_user').html('<button class="my-service index_h_my_service">我的服务</button><button class="h_login index_h_login">登录</button><button class="h_reg index_h_reg">注册</button>');
            $('.index_h_my_service').click(function(){
                openLogin('service');
            });
            $('.index_h_login').click(function(){
                openLogin();
            });
            $('.index_h_reg').click(function(){
                G_Jump._go('reg');
            });
        }
    }
}
var F_Game = {
    _getRecom:function(){
        G_Port._ajax('indexRecom','get',true,null,function(){
                $('.like').html(G_Pre._loading());
            },function(){
                $('.like').html('');
            },function(data,msg){
                if(data.recommend_project_list && data.recommend_project_list.length>0){
                    var gameInfo = G_Game._getGame(data.recommend_project_list);
                    if(gameInfo){
                        var str = '';
                        $.each(gameInfo,function(key,value){
                            var gameName = (value[1].length > 5) ? value[1].substr(0,5)+'.' : value[1];
                            var gameCompany = value[2] ? ((value[2].length > 5) ? value[2].substr(0,5)+'.' : value[2]):'';
                            str += '\
                                <li class="c_cursor" onclick="G_Jump._url(\'light\','+key+')">\
                                    <img src="'+value[0]+'">\
                                    <span title="'+value[1]+'">'+gameName+'</span>\
                                    <span title="'+value[2]+'" class="c_colorH">'+gameCompany+'</span>\
                                </li>';
                        });
                        $('.like').html(str);
                    }
                }
            },function(data,msg,code){
                $('.like').html(G_Pre._empty(msg));
            }
        )
    },
    _getHot:function(){
        G_Port._ajax('hotGame','get',true,'index=0&limit=10',function(){
                $('.top-list').html(G_Pre._loading());
            },function(){
                $('.top-list').html('');
            },function(data,msg){
                if(data && data.hot_project_list.length > 0){
                    var str = '';
                    var gameInfo = G_Game._getGame(data.hot_project_list);
                    var i = 1;
                    if(gameInfo){
                        for(var d=0;d<data.hot_project_list.length;d++){
                            if(gameInfo[data.hot_project_list[d]]){
                                var key = data.hot_project_list[d];
                                var value = gameInfo[data.hot_project_list[d]];
                                var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                                var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                                var gameRankImg = '';
                                if(i < 4){
                                    gameRankImg = '<b class="lt_fmCxLtTop'+i+' c_img"></b>';
                                }else{
                                    gameRankImg = '<b>'+i+'</b>';
                                }
                                i++;
                                var collectClass = 'lt_gmCtOff';
                                if(G_Game._checkCollect(parseInt(key)))collectClass = 'lt_gmCtOn';
                                str += '\
                                    <li>\
                                        '+gameRankImg+'\
                                        <img src="'+value[0]+'">\
                                        <p title="'+value[1]+'">'+gameName+'<br><span title="'+value[2]+'" class="c_colorH">'+gameCompany+'</span></p>\
                                        <div class="lt_shade">\
                                            <div id="rank_gmCollect'+key+'" onclick="G_Game._setCollect('+key+',\'rank_gmCollect'+key+'\',\'lt_gmCt\')" class="lt_gmCollect c_img '+collectClass+'"></div>\
                                            <a onclick="G_Jump._url(\'light\','+key+')">查看游戏灯塔&gt;</a>\
                                            <a onclick="G_Jump._url(\'atlas\','+key+')">查看游戏图谱&gt;</a>\
                                        </div>\
                                    </li>';
                            }
                        }
                    }
                    $('.top-list').html(str);
                }
            },function(data,msg,code){
                $('.top-list').html(G_Pre._empty(msg));
            }
        )
    }
}
var F_Article = {
    _getHotRecent:function(){
        G_Port._ajax('articleList','get',true,'data_date_start='+dateBegin+'&data_date_end='+dateEnd+'&order_by_field=score&order_type=desc&index=0&limit=5',function(){
                $('#bs_hot_recet').html(G_Pre._loading());
            },function(){
                $('#bs_hot_recet').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#bs_hot_recet').html(F_Article._htmlRecentList(data.data.list));
                }
            },function(data,msg,code){
                $('#bs_hot_recet').html(G_Pre._empty(msg));
            }
        )
    },
    _getHotToday:function(){
        G_Port._ajax('articleList','get',true,'data_date_start='+dateYesterday+'&data_date_end='+dateEnd+'&order_by_field=post_date,score&order_type=desc,desc&index=0&limit=10&need_preview=1',function(){
                $('.article-detail-list').html(G_Pre._loading('c_padding30'));
            },function(){
                $('.article-detail-list').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    F_Article._htmlTodayList(data.data);
                    $('.result-more-btn').show();
                }
            },function(data,msg,code){
                $('.article-detail-list').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlTodayList:function(data){
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
    },
    _htmlRecentList:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            if(i>4)break;
            //var articleTitle = (data[i].source.title.length > 13) ? data[i].source.title.substr(0,13)+'..' : data[i].source.title;
            var articleTitle = data[i].source.title;
            str += '<li title="'+data[i].source.title+'"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data[i].id)+'" target="_blank"><span class="guidelines-date">'+data[i].source.post_date+'</span><span class="guide-title">'+articleTitle+'</span></a></li>';
        }
        return str;
    },
    _htmlList:function(data){
        var cStr = '';
        var tStr = '';
        $.each(data,function(key,value){
            var url = G_Jump._getUrl('article')+'?t=classify&m='+encodeURIComponent(key);
            cStr += '<dl onclick="G_Jump._go(\'base\',\''+url+'\')"><dt class="'+value.img.styleClass+' c_img"></dt><dd>'+key+'</dd></dl>';
            tStr += '<dl>';
            for(var d=0;d<value.sub.length;d++){

                tStr += '<dd onclick="G_Jump._go(\'base\',\''+url+'&s='+encodeURIComponent(value.sub[d].sub_class)+'\')">'+value.sub[d].sub_class+'</dd>';
            }
            tStr += '</dl>';
        })
        return {main:cStr,sub:tStr}
    }
}
