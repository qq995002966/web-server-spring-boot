var F_Center_Entrance={_init:function(l){if(B_Login._checkUpdate(),M_HeadFoot._headShow(2),M_Dom._menuList("舆情分析","3-3"),M_Game._htmlGameVisitHide("outsideCenter"),B_User._isDemoUser())"demo"==M_Init._controller?($("#bs_game_search_area").prepend("<h3>ThinkingGame为您挖掘数千款游戏的亿万玩家反馈</h3>").removeClass("low-height-search").show(),F_Center_Info._notice()):B_Login._openLogin("background");else{M_Init._clean(),$("#bs_game_search_area").show();var s=B_Common._getUrl("query");s.k?M_Init._searchKeyword=B_Common._decodeUrl(s.k):l&&(M_Init._searchKeyword=B_Common._decodeUrl(l)),$("#bs_game_search_area").prepend("<h3>ThinkingGame为您挖掘数千款游戏的亿万玩家反馈</h3>").removeClass("low-height-search"),M_Outside._searchPop(),$("#headerTop").removeClass("center-headertop2"),F_Center_Info._domInit()}}},F_Center_Info={_notice:function(){B_Pop._init("open",{shift:2,closeBtn:!1,title:!1,content:F_Center_Info._htmlNotice()}),$("#ct_main_area").html(F_Center_Info._htmlFake()),$("#bs_pop_login").click(function(){B_Jump._go("target","login")}),$("#bs_pop_reg").click(function(){B_Jump._go("target","reg")}),$("#gameDropChoose").hide(),$(".layui-layer-shade").css("top","70px")},_htmlNotice:function(){var l="";return l+='            <div class="pop-wrapp">                <div class="page-pop">                <div class="left">                <h3><b>免费</b>使用舆情雷达</h3>                <span>注册后即可洞察千款游戏口碑 过亿玩家舆情</span>                <ul>                    <li><img src="elements2.0/img/pagepop/t.png"><p>解读产品口碑</p><span>从海量舆情中提炼用户焦点和游戏口碑</span></li>                    <li><img src="elements2.0/img/pagepop/m.png"><p>挖掘玩家偏好</p><span>多维度追踪热门游戏、竞品游戏玩家特征</span></li>                    <li><img src="elements2.0/img/pagepop/b.png"><p>建立舆情监控站</p><span>关键舆情监测、突发舆情事件智能报警</span></li>                    <li><button class="tg-main-btn" id="bs_pop_login">开始使用</button><button class="tg-assist-btn" id="bs_pop_reg">免费注册</button></li>                </ul>                </div>                    <img src="elements2.0/img/pagepop/cp.png">                </div>            </div>'},_htmlFake:function(){return'<div class="blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12  widthLarge fourPercent"><h3>已开通的游戏</h3><div class="boxshadow  yuqing-center yu-my-game"><ul class="game-list" id="bs_mine_game"><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/143.png"><p>崩坏学园2</p><span>MiHoYo</span></div><ul class="fr"><li><span><b class="color-blue">11</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 11</b>名</p></div><b>→</b><p>舆情榜排名</p></li><li><span><b class="color-blue">941</b>份</span><div class="boxshadow hover-show"><p>前日<b> 888</b>份</p></div><b class="up">↑</b><p>昨日反馈总量</p></li><li><span><b class="color-green">17</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 15</b>份</p></div><b class="up">↑</b><p>正面反馈情况</p></li><li><span><b class="color-red">172</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 129</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/298.png"><p>穿越火线手游</p><span>Smilegate、腾讯</span></div><ul class="fr"><li><span><b class="color-blue">2</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 2</b>名</p></div><b>→</b><p>舆情榜排名</p></li><li><span><b class="color-blue">7803</b>份</span><div class="boxshadow hover-show"><p>前日<b> 8888</b>份</p></div><b class="down">↓</b><p>昨日反馈总量</p></li><li><span><b class="color-green">373</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 385</b>份</p></div><b class="down">↓</b><p>正面反馈情况</p></li><li><span><b class="color-red">1892</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 2381</b>份</p></div><b class="down">↓</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/516.png"><p>丧尸之战</p><span>龙创悦动网络科技</span></div><ul class="fr"><li><span><b class="color-blue">151</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 192</b>名</p></div><b class="up">↑</b><p>舆情榜排名</p></li><li><span><b class="color-blue">54</b>份</span><div class="boxshadow hover-show"><p>前日<b> 24</b>份</p></div><b class="up">↑</b><p>昨日反馈总量</p></li><li><span><b class="color-green">1</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 0</b>份</p></div><b class="up">↑</b><p>正面反馈情况</p></li><li><span><b class="color-red">13</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 2</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/669.png"><p>植物大战僵尸系列</p><span>PopCap Games</span></div><ul class="fr"><li><span><b class="color-blue">10</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 7</b>名</p></div><b class="down">↓</b><p>舆情榜排名</p></li><li><span><b class="color-blue">216</b>份</span><div class="boxshadow hover-show"><p>前日<b> 248</b>份</p></div><b class="down">↓</b><p>昨日反馈总量</p></li><li><span><b class="color-green">4</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 8</b>份</p></div><b class="down">↓</b><p>正面反馈情况</p></li><li><span><b class="color-red">40</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 38</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/767.png"><p>死亡扳机2</p><span>Madfinger Games</span></div><ul class="fr"><li><span><b class="color-blue">95</b>名</span><div class="boxshadow hover-show"><p>昨日<b> 99</b>名</p></div><b class="up">↑</b><p>舆情榜排名</p></li><li><span><b class="color-blue">14</b>份</span><div class="boxshadow hover-show"><p>前日<b> 13</b>份</p></div><b class="up">↑</b><p>昨日反馈总量</p></li><li><span><b class="color-green">4</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 0</b>份</p></div><b class="up">↑</b><p>正面反馈情况</p></li><li><span><b class="color-red">4</b>份</span><div class="boxshadow hover-show"><p>昨日<b> 1</b>份</p></div><b class="up">↑</b><p>负面反馈情况</p></li></ul></li></ul></div></div><div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent"><h3>热门游戏</h3><div class="boxshadow yuqing-center yu-my-game yu-hot-game"><ul class="game-list" id="bs_hot_game"><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/197.png"><p>雷霆战机</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">射击</li><li class="tg-tab-btn-normal">卷轴</li><li class="tg-tab-btn-normal">飞行射击</li></ul></div><ul class="fr"><li><span><b class="color-blue">17</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/546.png"><p>怪物猎人X</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">角色扮演</li><li class="tg-tab-btn-normal">ARPG</li><li class="tg-tab-btn-normal">探索</li><li class="tg-tab-btn-normal">平台</li><li class="tg-tab-btn-normal">奇幻</li></ul></div><ul class="fr"><li><span><b class="color-blue">5</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/132.png"><p>奇迹暖暖</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">模拟</li><li class="tg-tab-btn-normal">养成</li><li class="tg-tab-btn-normal">休闲</li></ul></div><ul class="fr"><li><span><b class="color-blue">9</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/146.png"><p>我的世界</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">冒险</li><li class="tg-tab-btn-normal">建造</li><li class="tg-tab-btn-normal">沙盒</li><li class="tg-tab-btn-normal">生存</li><li class="tg-tab-btn-normal">平台</li><li class="tg-tab-btn-normal">像素</li></ul></div><ul class="fr"><li><span><b class="color-blue">3</b>名</span><p>舆情榜排名</p></li></ul></li><li><div class="fl"><img src="http://image.thinkinggame.cn/img/project/595.png"><p>球球大作战</p><ul class="tg-tab-btn"><li class="tg-tab-btn-normal">竞技游戏</li><li class="tg-tab-btn-normal">休闲</li><li class="tg-tab-btn-normal">社区</li></ul></div><ul class="fr"><li><span><b class="color-blue">5</b>名</span><p>舆情榜排名</p></li></ul></li></ul></div></div> <div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent"><h3>近期浏览的游戏</h3><div class="boxshadow  yuqing-center yu-recent-game"><ul class="left" id="bs_recent_game"><li><img src="http://image.thinkinggame.cn/img/project/767.png"><p>死亡扳机2</p><span>Madfinger Games</span></li><li><img src="http://image.thinkinggame.cn/img/project/298.png" ><p>穿越火线手游</p><span>Smilegate、腾讯</span></li><li><img src="http://image.thinkinggame.cn/img/project/143.png"><p>崩坏学园2</p><span>MiHoYo</span></li><li><img src="http://image.thinkinggame.cn/img/project/516.png"><p>丧尸之战</p><span>龙创悦动网络科技</span></li><li><img src="http://image.thinkinggame.cn/img/project/329.png" alt="轩辕传奇2"><p>轩辕传奇2</p><span>腾讯北极光</span></li><li><img src="http://image.thinkinggame.cn/img/project/669.png"><p>植物大战僵尸系列</p><span>PopCap Games</span></li><li><img src="http://image.thinkinggame.cn/img/project/1224.png"><p>狼人杀</p><span>上海假面</span></li><li><img src="http://image.thinkinggame.cn/img/project/96.png"><p>剑网3</p><span>西山居</span></li><li><img src="http://image.thinkinggame.cn/img/project/134.png"><p>王者荣耀</p><span>腾讯天美</span></li><li><img src="http://image.thinkinggame.cn/img/project/1217.png"><p>王牌NBA</p><span>腾讯</span></li></ul></div></div>'},_domInit:function(){M_Init._searchKeyword?($("#ct_main_area").html(F_Center_Info._htmlSearch()),$("input[name='keyword']").val(M_Init._searchKeyword),F_Center_Info._getSearch(1)):($("#ct_main_area").html(F_Center_Info._htmlCenter()),F_Center_Info._getCollect(),F_Center_Info._getHot(),F_Center_Info._getRecent())},_htmlSearchDetail:function(l,s){var a="";a+='<p class="yu-search-title">搜索"<b>'+M_Init._searchKeyword+'</b>"的结果共有"<b>'+s+'</b>"个游戏有口碑分析结果</p>';for(var i="",t="",e=0;e<l.length;e++){if(i=B_Game._getGame([l[e].project_id])){if(i=i[l[e].project_id],a+='<div class="boxshadow  yuqing-search-result  yu-my-game"><ul class="game-list"><li>',a+='<div class="fl"><img src="'+i[0]+'" alt="'+i[1]+'" onclick="M_Outside._redirectLight('+l[e].project_id+')">',a+='<p onclick="M_Outside._redirectLight('+l[e].project_id+')">'+B_Common._focusKeywords(M_Init._searchKeyword,i[1])+"</p>",a+="<span>游戏类型："+l[e].game_type+"</span>",a+="<span>开发商："+l[e].author+"</span>",a+="<span>发行商："+l[e].distributor+"</span>",a+="<span>发行日期："+l[e].release_date+"</span>",a+='<ul class="tg-tab-btn">',l[e].tag_list){t=B_Game._tag(l[e].tag_list);for(var n=0;n<l[e].tag_list.length;n++)t[l[e].tag_list[n]]&&(a+='<li class="tg-tab-btn-normal" onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(t[l[e].tag_list[n]])+"');\">"+t[l[e].tag_list[n]]+"</li>")}a+="</ul></div>",a+='<ul class="fr">',a+='<li><span><b class="color-blue">'+l[e].hot_rank+"</b></span><p>ThinkingGame舆情榜</p></li>",a+='<li><span><b class="color-blue">'+l[e].app_rank+"</b></span><p>Appstore畅销榜</p></li>",a+='<li><button class="tg-main-btn" onclick="M_Outside._redirectLight('+l[e].project_id+')">查看口碑</button>\x3c!--button class="tg-assist-btn" onclick="M_Outside._redirectAtlas('+l[e].project_id+')">游戏图谱</button--\x3e</li>',a+="</ul>"}a+="</li></ul></div>"}return a},_htmlSearchOther:function(l,s){var a="";a+='<p class="yu-search-title">搜索"<b>'+M_Init._searchKeyword+'</b>"的结果共有"<b>'+s+'</b>"个游戏暂时没有口碑分析结果</p>';for(var i="",t=0;t<l.length;t++)i=B_Game._getGame([l[t].project_id]),i&&(i=i[l[t].project_id],a+='<div class="boxshadow  yuqing-search-result  yu-my-game"><ul class="game-list"><li>',a+='<div class="fl"><img src="'+l[t].app_img+'" alt="'+l[t].app_name+'">',a+="<p>"+B_Common._focusKeywords(M_Init._searchKeyword,l[t].app_name)+"</p>",a+="<span>开发商："+l[t].app_author+"</span>",a+="</div>",a+='<ul class="fr">',a+='<li><button class="tg-main-btn bs_add_game" data-i="'+l[t].app_name+'">申请增加游戏</button></li>',a+="</ul>"),a+="</li></ul></div>";return a},_htmlSearch:function(){var l="";return l+='<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">',l+='<div id="bs_search_list"></div>',l+='<ul class="tg-page-list" id="lt_forum_page"></ul>',l+='<div id="bs_search_other"></div>',l+="</div>"},_getSearch:function(l){var s=$("#bs_search_list"),a=$("#lt_forum_page"),i=$("#bs_search_other"),t={};t.keyword=M_Init._searchKeyword,t.index=(l-1)*B_Page._size,t.mobile=B_Page._size,t=B_Common._postData(t),B_Port._ajax("reputationSearch","get",!0,t,function(){s.html(B_Pre._loading()),a.html(""),i.html("")},function(){s.html("")},function(t,e){var n=!1;if(t&&t.project_list&&t.project_list.length>0?(s.html(F_Center_Info._htmlSearchDetail(t.project_list,t.total)),a.html(B_Page._show({total:t.total,page:l},"number")),B_Page._click(l,function(l){F_Center_Info._getSearch(l)})):n=!0,t&&t.other_list&&t.other_list.length>0){var o=t.other_list.length;B_Page._size*l>=t.total&&i.html(F_Center_Info._htmlSearchOther(t.other_list,o)),$(".bs_add_game").click(function(){B_Login._openPlan($(this).attr("data-i"))})}else n&&s.html(B_Game._searchEmpty(M_Init._searchKeyword))},function(l,a,i){s.html(B_Pre._empty(a))})},_htmlArrow:function(l,s,a){var i="";switch(l){case"compare":i+=s>a?'<b class="down">↓</b>':s<a?'<b class="up">↑</b>':"<b>→</b>";break;case"number":i+=s>0?'<b class="up">↑</b>':s<0?'<b class="down">↓</b>':"<b>→</b>"}return i},_htmlCollect:function(l,s){for(var a="",i="",t=0;t<l.length;t++)s[l[t].project_id]&&(i=s[l[t].project_id],a+="<li>",a+='<div class="fl">',a+='<img src="'+i[0]+'" alt="'+i[1]+'" onclick="M_Outside._redirectLight('+l[t].project_id+')"><p onclick="M_Outside._redirectLight('+l[t].project_id+')">'+i[1]+"</p><span>"+i[2]+"</span>",a+="</div>",a+='<ul class="fr">',a+="<li>",a+='<span><b class="color-blue">'+l[t].rank+"</b>名</span>",a+='<div class="boxshadow hover-show"><p>昨日<b> '+(parseInt(l[t].rank)+parseInt(l[t].rank_span))+"</b>名</p></div>",a+=this._htmlArrow("compare",l[t].rank,parseInt(l[t].rank)+parseInt(l[t].rank_span)),a+="<p>舆情榜排名</p>",a+="</li>",a+="<li>",a+='<span><b class="color-blue">'+l[t].total+"</b>份</span>",a+='<div class="boxshadow hover-show"><p>前日<b> '+l[t].total_old+"</b>份</p></div>",a+=this._htmlArrow("number",l[t].total_rate),a+="<p>昨日反馈总量</p>",a+="</li>",a+="<li>",a+='<span><b class="color-green">'+l[t].positive+"</b>份</span>",a+='<div class="boxshadow hover-show"><p>昨日<b> '+l[t].positive_old+"</b>份</p></div>",a+=this._htmlArrow("number",l[t].positive_rate),a+="<p>正面反馈情况</p>",a+="</li>",a+="<li>",a+='<span><b class="color-red">'+l[t].negative+"</b>份</span>",a+='<div class="boxshadow hover-show"><p>昨日<b> '+l[t].negative_old+"</b>份</p></div>",a+=this._htmlArrow("number",l[t].negative_rate),a+="<p>负面反馈情况</p>",a+="</li>",a+="</ul>",a+="</li>");return a},_htmlHot:function(l,s){for(var a="",i="",t="",e=1,n=0;n<l.length&&!(e>5);n++)if(s[l[n].projcet_id]){if(i=s[l[n].projcet_id],a+="<li>",a+='<div class="fl"><img src="'+i[0]+'" alt="'+i[1]+'" onclick="M_Outside._redirectLight('+l[n].projcet_id+')"><p  onclick="M_Outside._redirectLight('+l[n].projcet_id+')">'+i[1]+"</p>",a+='<ul class="tg-tab-btn">',l[n].tags){t=B_Game._tag(l[n].tags);for(var o=0;o<l[n].tags.length;o++)t[l[n].tags[o]]&&(a+='<li class="tg-tab-btn-normal" onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(t[l[n].tags[o]])+"');\">"+t[l[n].tags[o]]+"</li>")}a+="</ul></div>",a+='<ul class="fr">',a+="<li>",a+='<span><b class="color-blue">'+l[n].rank+"</b>名</span>",a+="<p>舆情榜排名</p>",a+="</li></ul>",a+="</li>",e++}return a},_htmlCenter:function(){var l="";return l+='<div class="blockpart  col-lg-6 col-md-12 col-sm-12 col-xs-12  widthLarge fourPercent">',l+="<h3>开通的游戏</h3>",l+='<div class="boxshadow  yuqing-center yu-my-game">',l+='<ul class="game-list" id="bs_mine_game"></ul>',l+="</div>",l+="</div>",l+='<div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent">',l+="<h3>热门游戏</h3>",l+='<div class="boxshadow yuqing-center yu-my-game yu-hot-game">',l+='<ul class="game-list" id="bs_hot_game"></ul>',l+="</div>",l+="</div>",l+=' <div class="blockpart  col-lg-3 col-md-12 col-sm-12 col-xs-12 widthMid smallFullscrenn threePercent">',l+="<h3>近期浏览的游戏</h3>",l+='<div class="boxshadow  yuqing-center yu-recent-game">',l+='<ul class="left" id="bs_recent_game"></ul>',l+="</div>",l+="</div>"},_getCollect:function(){var l=$("#bs_mine_game");B_Port._ajax("reputationCollect","get",!0,null,function(){l.html(B_Pre._loading())},function(){l.html("")},function(s,a){if(s&&s.collection_list&&s.collection_list.length>0){for(var i=s.collection_list.length,t=s.collection_list,e=[],n=0;n<i;n++)e.push(t[n].project_id);var o=B_Game._getGame(e,i);l.html(F_Center_Info._htmlCollect(t,o))}else l.html(B_Pre._empty('<p style="margin-bottom: 20px; margin-top: 50px;">搜索游戏后，您可以将关注的游戏添加至关注的游戏</p><img src="elements2.0/img/empy-add.png" />'))},function(s,a,i){l.html(B_Pre._empty(a))})},_getHot:function(){var l=$("#bs_hot_game"),s={};s.index=0,s.limit=5,s=B_Common._postData(s),B_Port._ajax("reputationHot","get",!0,s,function(){l.html(B_Pre._loading())},function(){l.html("")},function(s,a){if(s&&s.hot_project_list&&s.hot_project_list.length>0){for(var i=s.hot_project_list.length,t=s.hot_project_list,e=[],n=0;n<i;n++)e.push(t[n].projcet_id);var o=B_Game._getGame(e,i);l.html(F_Center_Info._htmlHot(t,o))}else l.html(B_Pre._empty("暂无数据"))},function(s,a,i){l.html(B_Pre._empty(a))})},_getRecent:function(){var l=$("#bs_recent_game");B_Port._ajax("history","get",!0,null,function(){l.html(B_Pre._loading())},function(){l.html("")},function(s,a){if(s&&s.project_list&&s.project_list.length>0){for(var i=s.project_list.length,t=s.project_list,e=B_Game._getGame(t,i),n="",o=1,c=0;c<i&&!(o>10);c++)e[t[c]]&&(n+='<li><img src="'+e[t[c]][0]+'" alt="'+e[t[c]][1]+'"  onclick="M_Outside._redirectLight('+t[c]+')"><p  onclick="M_Outside._redirectLight('+t[c]+')">'+e[t[c]][1]+"</p><span>"+e[t[c]][2]+"</span></li>",o++);l.html(n)}else l.html(B_Pre._empty("暂无数据"))},function(s,a,i){l.html(B_Pre._empty(a))})}};