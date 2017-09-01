var F_Center_Entrance = {
    _init:function (keyword) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-3');
        M_Game._htmlGameVisitHide('outsideCenter');
        if(B_User._isDemoUser()){
            if(M_Init._controller == 'demo'){
                $('#bs_game_search_area').prepend('<h3>ThinkingGame为您挖掘数千款游戏的亿万玩家反馈</h3>').removeClass('low-height-search').show();
                F_Center_Info._notice();
            }else{
                B_Login._openLogin('background');
            }
        }else{
            M_Init._clean();
            $('#bs_game_search_area').show();
            var $_GET = B_Common._getUrl('query');
            if($_GET.k){
                M_Init._searchKeyword = B_Common._decodeUrl($_GET.k);
            }else{
                if(keyword){
                    M_Init._searchKeyword = B_Common._decodeUrl(keyword);
                }
            }
            $('#bs_game_search_area').prepend('<h3>ThinkingGame为您挖掘数千款游戏的亿万玩家反馈</h3>').removeClass('low-height-search');
             M_Outside._searchPop();

            $('#headerTop').removeClass('center-headertop2');
            F_Center_Info._domInit();

        }
    }
}

var F_Center_Info = {
    _notice:function () {
        B_Pop._init('open',{'shift':2,'closeBtn':false,'title':false,'content':F_Center_Info._htmlNotice()});
        $('#ct_main_area').html(F_Center_Info._htmlFake());
        $('#bs_pop_login').click(function () {
            B_Jump._go('target','login');
        });
        $('#bs_pop_reg').click(function () {
            B_Jump._go('target','reg');
        });
        $('#gameDropChoose').hide();
        $('.layui-layer-shade').css('top','70px');
    },
    _htmlNotice:function () {
        var str = '';
        str += '\
            <div class="pop-wrapp">\
                <div class="page-pop">\
                <div class="left">\
                <h3><b>免费</b>使用舆情雷达</h3>\
                <span>注册后即可洞察千款游戏口碑 过亿玩家舆情</span>\
                <ul>\
                    <li><img src="elements2.0/img/pagepop/t.png"><p>解读产品口碑</p><span>从海量舆情中提炼用户焦点和游戏口碑</span></li>\
                    <li><img src="elements2.0/img/pagepop/m.png"><p>挖掘玩家偏好</p><span>多维度追踪热门游戏、竞品游戏玩家特征</span></li>\
                    <li><img src="elements2.0/img/pagepop/b.png"><p>建立舆情监控站</p><span>关键舆情监测、突发舆情事件智能报警</span></li>\
                    <li><button class="tg-main-btn" id="bs_pop_login">开始使用</button><button class="tg-assist-btn" id="bs_pop_reg">免费注册</button></li>\
                </ul>\
                </div>\
                    <img src="elements2.0/img/pagepop/cp.png">\
                </div>\
            </div>';

        return str;
    },
    _htmlFake:function () {
        var str = '<div class="blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12  widthLarge fourPercent"><h3>已开通的游戏</h3><div class="boxshadow  yuqing-center yu-my-game"><ul class="game-list" id="bs_mine_game"><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/143.png"><p>崩坏学园2</p><span>MiHoYo</span></div><ul class="fr"><li><span><b class="color-blue">11</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 11</b>名</p></div><b>→</b><p>舆情榜排名</p></li><li><span><b class="color-blue">941</b>份</span><div class="boxshadow hover-show"><p>前日<b> 888</b>份</p></div><b class="up">↑</b><p>昨日反馈总量</p></li><li><span><b class="color-green">17</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 15</b>份</p></div><b class="up">↑</b><p>正面反馈情况</p></li><li><span><b class="color-red">172</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 129</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/298.png"><p>穿越火线手游</p><span>Smilegate、腾讯</span></div><ul class="fr"><li><span><b class="color-blue">2</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 2</b>名</p></div><b>→</b><p>舆情榜排名</p></li><li><span><b class="color-blue">7803</b>份</span><div class="boxshadow hover-show"><p>前日<b> 8888</b>份</p></div><b class="down">↓</b><p>昨日反馈总量</p></li><li><span><b class="color-green">373</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 385</b>份</p></div><b class="down">↓</b><p>正面反馈情况</p></li><li><span><b class="color-red">1892</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 2381</b>份</p></div><b class="down">↓</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/516.png"><p>丧尸之战</p><span>龙创悦动网络科技</span></div><ul class="fr"><li><span><b class="color-blue">151</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 192</b>名</p></div><b class="up">↑</b><p>舆情榜排名</p></li><li><span><b class="color-blue">54</b>份</span><div class="boxshadow hover-show"><p>前日<b> 24</b>份</p></div><b class="up">↑</b><p>昨日反馈总量</p></li><li><span><b class="color-green">1</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 0</b>份</p></div><b class="up">↑</b><p>正面反馈情况</p></li><li><span><b class="color-red">13</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 2</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/669.png"><p>植物大战僵尸系列</p><span>PopCap Games</span></div><ul class="fr"><li><span><b class="color-blue">10</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 7</b>名</p></div><b class="down">↓</b><p>舆情榜排名</p></li><li><span><b class="color-blue">216</b>份</span><div class="boxshadow hover-show"><p>前日<b> 248</b>份</p></div><b class="down">↓</b><p>昨日反馈总量</p></li><li><span><b class="color-green">4</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 8</b>份</p></div><b class="down">↓</b><p>正面反馈情况</p></li><li><span><b class="color-red">40</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 38</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/767.png"><p>死亡扳机2</p><span>Madfinger Games</span></div><ul class="fr"><li><span><b class="color-blue">95</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 99</b>名</p></div><b class="up">↑</b><p>舆情榜排名</p></li><li><span><b class="color-blue">14</b>份</span><div class="boxshadow hover-show"><p>前日<b> 13</b>份</p></div><b class="up">↑</b><p>昨日反馈总量</p></li><li><span><b class="color-green">4</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 0</b>份</p></div><b class="up">↑</b><p>正面反馈情况</p></li><li><span><b class="color-red">4</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 1</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li></ul></div></div><div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent"><h3>热门游戏</h3><div class="boxshadow yuqing-center yu-my-game yu-hot-game"><ul class="game-list" id="bs_hot_game"><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/197.png"><p>雷霆战机</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">射击</li><li class="tg-tab-btn-normal">卷轴</li><li class="tg-tab-btn-normal">飞行射击</li></ul></div><ul class="fr"><li><span><b class="color-blue">17</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/546.png"><p>怪物猎人X</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">角色扮演</li><li class="tg-tab-btn-normal">ARPG</li><li class="tg-tab-btn-normal">探索</li><li class="tg-tab-btn-normal">平台</li><li class="tg-tab-btn-normal">奇幻</li></ul></div><ul class="fr"><li><span><b class="color-blue">5</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/132.png"><p>奇迹暖暖</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">模拟</li><li class="tg-tab-btn-normal">养成</li><li class="tg-tab-btn-normal">休闲</li></ul></div><ul class="fr"><li><span><b class="color-blue">9</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/146.png"><p>我的世界</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">冒险</li><li class="tg-tab-btn-normal">建造</li><li class="tg-tab-btn-normal">沙盒</li><li class="tg-tab-btn-normal">生存</li><li class="tg-tab-btn-normal">平台</li><li class="tg-tab-btn-normal">像素</li></ul></div><ul class="fr"><li><span><b class="color-blue">3</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/595.png"><p>球球大作战</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">竞技游戏</li><li class="tg-tab-btn-normal">休闲</li><li class="tg-tab-btn-normal">社区</li></ul></div><ul class="fr"><li><span><b class="color-blue">5</b>名</span><p>舆情榜排名</p></li></ul></li></ul></div></div> <div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent"><h3>近期浏览的游戏</h3><div class="boxshadow  yuqing-center yu-recent-game"><ul class="left" id="bs_recent_game"><li><img src="http://image.thinkinggame.cn/img/project/767.png"><p>死亡扳机2</p><span>Madfinger Games</span></li><li><img src="http://image.thinkinggame.cn/img/project/298.png" ><p>穿越火线手游</p><span>Smilegate、腾讯</span></li><li><img src="http://image.thinkinggame.cn/img/project/143.png"><p>崩坏学园2</p><span>MiHoYo</span></li><li><img src="http://image.thinkinggame.cn/img/project/516.png"><p>丧尸之战</p><span>龙创悦动网络科技</span></li><li><img src="http://image.thinkinggame.cn/img/project/329.png" alt="轩辕传奇2"><p>轩辕传奇2</p><span>腾讯北极光</span></li><li><img src="http://image.thinkinggame.cn/img/project/669.png"><p>植物大战僵尸系列</p><span>PopCap Games</span></li><li><img src="http://image.thinkinggame.cn/img/project/1224.png"><p>狼人杀</p><span>上海假面</span></li><li><img src="http://image.thinkinggame.cn/img/project/96.png"><p>剑网3</p><span>西山居</span></li><li><img src="http://image.thinkinggame.cn/img/project/134.png"><p>王者荣耀</p><span>腾讯天美</span></li><li><img src="http://image.thinkinggame.cn/img/project/1217.png"><p>王牌NBA</p><span>腾讯</span></li></ul></div></div>';
        return str;
    },
    _domInit:function () {
        if(M_Init._searchKeyword){
            $('#ct_main_area').html(F_Center_Info._htmlSearch());
            $("input[name='keyword']").val(M_Init._searchKeyword);
            F_Center_Info._getSearch(1);
        }else{
            $('#ct_main_area').html(F_Center_Info._htmlCenter());
            F_Center_Info._getCollect();
            F_Center_Info._getHot();
            F_Center_Info._getRecent();
        }
    },
    _htmlSearchDetail:function (data,total) {
        var str = '';
        str += '<p class="yu-search-title">搜索"<b>'+M_Init._searchKeyword+'</b>"的结果共有"<b>'+total+'</b>"个游戏有口碑分析结果</p>';
        var gameInfo = '';
        var tag = '';
        for(var i=0;i<data.length;i++){
            gameInfo = B_Game._getGame([data[i].project_id]);
            if(gameInfo){
                gameInfo = gameInfo[data[i].project_id];
                str += '<div class="boxshadow  yuqing-search-result  yu-my-game"><ul class="game-list"><li>';
                str += '<div class="fl"><img src="'+gameInfo[0]+'" alt="'+gameInfo[1]+'" onclick="M_Outside._redirectLight('+data[i].project_id+')">';
                str += '<p onclick="M_Outside._redirectLight('+data[i].project_id+')">'+B_Common._focusKeywords(M_Init._searchKeyword,gameInfo[1])+'</p>';
                str += '<span>游戏类型：'+data[i].game_type+'</span>';
                str += '<span>开发商：'+data[i].author+'</span>';
                str += '<span>发行商：'+data[i].distributor+'</span>';
                str += '<span>发行日期：'+data[i].release_date+'</span>';
                str += '<ul class="tg-tab-btn">';
                if(data[i].tag_list){
                    tag = B_Game._tag(data[i].tag_list);
                    for(var d=0;d<data[i].tag_list.length;d++){
                        if(tag[data[i].tag_list[d]]){
                            str += '<li class="tg-tab-btn-normal" onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(tag[data[i].tag_list[d]])+'\');">'+tag[data[i].tag_list[d]]+'</li>';
                        }
                    }
                }
                str += '</ul></div>';
                str += '<ul class="fr">';
                str += '<li><span><b class="color-blue">'+data[i].hot_rank+'</b></span><p>ThinkingGame舆情榜</p></li>';
                str += '<li><span><b class="color-blue">'+data[i].app_rank+'</b></span><p>Appstore畅销榜</p></li>';
                str += '<li><button class="tg-main-btn" onclick="M_Outside._redirectLight('+data[i].project_id+')">查看口碑</button><!--button class="tg-assist-btn" onclick="M_Outside._redirectAtlas('+data[i].project_id+')">游戏图谱</button--></li>';
                str += '</ul>';
            }

            str += '</li></ul></div>';
        }
        return str;
    },
    _htmlSearchOther:function (data,total) {
        var str = '';
        str += '<p class="yu-search-title">搜索"<b>'+M_Init._searchKeyword+'</b>"的结果共有"<b>'+total+'</b>"个游戏暂时没有口碑分析结果</p>';
        var gameInfo = '';
        var tag = '';
        for(var i=0;i<data.length;i++){
            gameInfo = B_Game._getGame([data[i].project_id]);
            if(gameInfo){
                gameInfo = gameInfo[data[i].project_id];
                str += '<div class="boxshadow  yuqing-search-result  yu-my-game"><ul class="game-list"><li>';
                str += '<div class="fl"><img src="'+data[i].app_img+'" alt="'+data[i].app_name+'">';
                str += '<p>'+B_Common._focusKeywords(M_Init._searchKeyword,data[i].app_name)+'</p>';
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
    _htmlSearch:function () {
        var str = '';
        str += '<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">';
        str += '<div id="bs_search_list"></div>';
        str += '<ul class="tg-page-list" id="lt_forum_page"></ul>';
        str += '<div id="bs_search_other"></div>';
        str += '</div>';
        return str;
    },
    _getSearch:function (page) {
        var dom = $('#bs_search_list');
        var domPageList = $('#lt_forum_page');
        var domOther = $('#bs_search_other');

        var postData = {};
        postData['keyword'] = M_Init._searchKeyword;
        postData['index'] = (page-1)*B_Page._size;
        postData['mobile'] = B_Page._size;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationSearch','get',true,postData,function(){
                dom.html(B_Pre._loading());
                domPageList.html('');
                domOther.html('');
            },function(){
                dom.html('');
            },function(data,msg){
                var isAllEmpty = false;
                if(data && data.project_list && data.project_list.length > 0){
                    dom.html(F_Center_Info._htmlSearchDetail(data.project_list,data.total));
                    domPageList.html(B_Page._show({total:data.total,page:page},'number'));
                    B_Page._click(page,function (page) {
                        F_Center_Info._getSearch(page);
                    });
                }else{
                    isAllEmpty = true;
                }
                if(data && data.other_list && data.other_list.length > 0){
                    var length = data.other_list.length;
                    if((B_Page._size*page) >= data.total){
                        domOther.html(F_Center_Info._htmlSearchOther(data.other_list,length));
                    }
                    $('.bs_add_game').click(function () {
                        B_Login._openPlan($(this).attr('data-i'));
                    });
                }else{
                    if(isAllEmpty){
                        dom.html(B_Game._searchEmpty(M_Init._searchKeyword));
                    }
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlArrow:function (type,today,yesterday) {
        var str = '';
        switch (type){
            case 'compare':
                if(today > yesterday){
                    str += '<b class="down">↓</b>';
                }else if(today < yesterday){
                    str += '<b class="up">↑</b>';
                }else{
                    str += '<b>→</b>';
                }
                break;
            case 'number':
                if(today>0){
                    str += '<b class="up">↑</b>';
                }else if(today<0){
                    str += '<b class="down">↓</b>';
                }else{
                    str += '<b>→</b>';
                }
                break;
        }

        return str;
    },
    _htmlCollect:function (data,gameInfo) {
        var str = '';
        var game = '';
        for(var i=0;i<data.length;i++){
            if(gameInfo[data[i].project_id]){
                game = gameInfo[data[i].project_id];
                str += '<li>';
                str += '<div class="fl">';
                str += '<img src="'+game[0]+'" alt="'+game[1]+'" onclick="M_Outside._redirectLight('+data[i].project_id+')"><p onclick="M_Outside._redirectLight('+data[i].project_id+')">'+game[1]+'</p><span>'+game[2]+'</span>';
                str += '</div>';
                str += '<ul class="fr">';
                str += '<li>';
                str += '<span><b class="color-blue">'+data[i].rank+'</b>名</span>';
                str += '<div class="boxshadow hover-show"><p>昨日<b> '+(parseInt(data[i].rank) + parseInt(data[i].rank_span))+'</b>名</p></div>';
                str += this._htmlArrow('compare',data[i].rank,(parseInt(data[i].rank) + parseInt(data[i].rank_span)));
                str += '<p>舆情榜排名</p>';
                str += '</li>';
                str += '<li>';
                str += '<span><b class="color-blue">'+data[i].total+'</b>份</span>';
                str += '<div class="boxshadow hover-show"><p>前日<b> '+data[i].total_old+'</b>份</p></div>';
                str += this._htmlArrow('number',data[i].total_rate);
                str += '<p>昨日反馈总量</p>';
                str += '</li>';
                str += '<li>';
                str += '<span><b class="color-green">'+data[i].positive+'</b>份</span>';
                str += '<div class="boxshadow hover-show"><p>昨日<b> '+data[i].positive_old+'</b>份</p></div>';
                str += this._htmlArrow('number',data[i].positive_rate);
                str += '<p>正面反馈情况</p>';
                str += '</li>';
                str += '<li>';
                str += '<span><b class="color-red">'+data[i].negative+'</b>份</span>';
                str += '<div class="boxshadow hover-show"><p>昨日<b> '+data[i].negative_old+'</b>份</p></div>';
                str += this._htmlArrow('number',data[i].negative_rate);
                str += '<p>负面反馈情况</p>';
                str += '</li>';
                str += '</ul>';
                str += '</li>';
            }
        }
        return str;
    },
    _htmlHot:function (data,gameInfo) {
        var str = '';
        var game = '';
        var tag = '';
        var number = 1;
        for(var i=0;i<data.length;i++) {
            if(number > 5)break;
            if (gameInfo[data[i].projcet_id]) {
                game = gameInfo[data[i].projcet_id];
                str += '<li>';
                str += '<div class="fl"><img src="'+game[0]+'" alt="'+game[1]+'" onclick="M_Outside._redirectLight('+data[i].projcet_id+')"><p  onclick="M_Outside._redirectLight('+data[i].projcet_id+')">'+game[1]+'</p>';
                str += '<ul class="tg-tab-btn">';
                if(data[i].tags){
                    tag = B_Game._tag(data[i].tags);
                    for(var d=0;d<data[i].tags.length;d++){
                        if(tag[data[i].tags[d]]){
                            str += '<li class="tg-tab-btn-normal" onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(tag[data[i].tags[d]])+'\');">'+tag[data[i].tags[d]]+'</li>';
                        }
                    }
                }
                str += '</ul></div>';
                str += '<ul class="fr">';
                str += '<li>';
                str += '<span><b class="color-blue">'+data[i].rank+'</b>名</span>';
                str += '<p>舆情榜排名</p>';
                str += '</li></ul>';
                str += '</li>';
                number++;
            }
        }
        return str;
    },
    _htmlCenter:function () {
        var str = '';
        str += '<div class="blockpart  col-lg-6 col-md-12 col-sm-12 col-xs-12  widthLarge fourPercent">';
        str += '<h3>开通的游戏</h3>';
        str += '<div class="boxshadow  yuqing-center yu-my-game">';
        str += '<ul class="game-list" id="bs_mine_game"></ul>';
        str += '</div>';
        str += '</div>';

        str += '<div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent">';
        str += '<h3>热门游戏</h3>';
        str += '<div class="boxshadow yuqing-center yu-my-game yu-hot-game">';
        str += '<ul class="game-list" id="bs_hot_game"></ul>';
        str += '</div>';
        str += '</div>';

        str += ' <div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent">';
        str += '<h3>近期浏览的游戏</h3>';
        str += '<div class="boxshadow  yuqing-center yu-recent-game">';
        str += '<ul class="left" id="bs_recent_game"></ul>';
        str += '</div>';
        str += '</div>';

        return str;
    },
    _getCollect:function () {
        var dom = $('#bs_mine_game');
        B_Port._ajax('reputationCollect','get',true,null,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.collection_list && data.collection_list.length > 0){
                    var length = data.collection_list.length;
                    var dataUnion = data.collection_list;
                    var gameId = [];
                    for(var i=0;i<length;i++){
                        gameId.push(dataUnion[i].project_id);
                    }
                    var gameInfo = B_Game._getGame(gameId,length);
                    dom.html(F_Center_Info._htmlCollect(dataUnion,gameInfo));
                }else{
                    dom.html(B_Pre._empty('<p style="margin-bottom: 20px; margin-top: 50px;">搜索游戏后，您可以将关注的游戏添加至关注的游戏</p><img src="elements2.0/img/empy-add.png" />'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getHot:function () {
        var dom = $('#bs_hot_game');

        var postData = {};
        postData['index'] = 0;
        postData['limit'] = 5;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationHot','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.hot_project_list && data.hot_project_list.length > 0){
                    var length = data.hot_project_list.length;
                    var dataUnion = data.hot_project_list;
                    var gameId = [];
                    for(var i=0;i<length;i++){
                        gameId.push(dataUnion[i].projcet_id);
                    }
                    var gameInfo = B_Game._getGame(gameId,length);

                    dom.html(F_Center_Info._htmlHot(dataUnion,gameInfo));
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getRecent:function () {
        var dom = $('#bs_recent_game');
        B_Port._ajax('history','get',true,null,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.project_list && data.project_list.length > 0){
                    var length = data.project_list.length;
                    var dataUnion = data.project_list;
                    var gameInfo = B_Game._getGame(dataUnion,length);
                    var str = '';
                    var number = 1;
                    for(var i=0;i<length;i++){
                        if(number > 10)break;
                        if(gameInfo[dataUnion[i]]){
                            str += '<li><img src="'+gameInfo[dataUnion[i]][0]+'" alt="'+gameInfo[dataUnion[i]][1]+'"  onclick="M_Outside._redirectLight('+dataUnion[i]+')"><p  onclick="M_Outside._redirectLight('+dataUnion[i]+')">'+gameInfo[dataUnion[i]][1]+'</p><span>'+gameInfo[dataUnion[i]][2]+'</span></li>';
                            number++;
                        }
                    }
                    dom.html(str);
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    }
}