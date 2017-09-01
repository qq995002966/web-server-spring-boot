var F_Main_Entrance={_init:function(){B_Login._checkUpdate(),M_HeadFoot._headShow(0),B_User._isDemoUser()?B_Login._openLogin("background"):(M_Init._clean(),$("#ln_product_adv").attr("href",B_Common._qqUrl()),F_Main_Info._getInsideGame(),F_Main_Info._getVisitHistory(),F_Main_Info._getReport(),F_Main_Info._getGameList())}},F_Main_Info={_getInsideGame:function(){var t=$("#ls_inside_game");B_Port._ajax("userServiceProject","get",!0,null,function(){t.html(B_Pre._loading())},function(){t.html("")},function(a,s){t.html(F_Main_Info._htmlInsideGame(t,a))},function(a,s,l){t.html(B_Pre._empty(s))})},_htmlInsideGame:function(t,a){var s=0,l="";if(a&&a.length>0){l+='<ul class="game-list">';for(var o=0;o<a.length;o++)l+="<li onclick=\"B_Jump._go('base','"+B_Jump._getUrl("insideSummary",{id:a[o].game_id})+"')\">",l+='<img src="'+B_Game._imgUrl(a[o].game_id,"inner")+'" alt="'+a[o].game_name+'">',l+="<span>"+a[o].game_name+"</span>",l+="</li>",s++;l+="</ul>",l='<div class="border-b">                    <span>已开通<b>'+s+'</b>款游戏</span>                    <span class="fr"><a href="'+B_Common._qqUrl()+'" target="_blank">开通游戏</a></span>                 </div>'+l}else t.addClass("hover-show"),l+='                <div class="hover-show-content">                    <img src="elements2.0/img/homepage/1.png" alt="">                    <a class="mask-hover" href="'+B_Jump._getUrl("operateBasic")+'">                        <h1>极往知来的智能分析</h1>                        <p>充分利用数据挖掘和机器学习的技术，预测玩家的流失概率，计算玩家的付费意愿度。利用聚类算法，依据玩家的行为数据将玩家划分成不同的群体，分析不同群体的玩家特征。极往知来的智能分析，让游戏运营更加高效，更加精准。</p>                    </a>                </div>';return l},_getVisitHistory:function(){var t=$("#ls_history_game");B_Port._ajax("history","get",!0,null,function(){t.html(B_Pre._loading())},function(){t.html("")},function(a,s){t.html(F_Main_Info._htmlVisitHistory(t,a))},function(a,s,l){t.html(B_Pre._empty(s))})},_htmlVisitHistory:function(t,a){var s=0,l="";if(a.project_list&&a.project_list.length>0){l+='<ul class="game-list">';for(var o=B_Game._getGame(a.project_list),r=0;r<a.project_list.length;r++)o[a.project_list[r]]&&(l+="<li onclick=\"B_Jump._go('base','"+B_Jump._getUrl("gameLight",{gameId:a.project_list[r]})+"')\">",l+='<img src="'+o[a.project_list[r]][0]+'" alt="'+o[a.project_list[r]][1]+'">',l+="<span>"+o[a.project_list[r]][1]+"</span>",l+="</li>",s++);l+="</ul>",l='<div class="border-b">                    <span>近期浏览<b>'+s+'</b>款游戏</span>                    <span class="fr"></span>                 </div>'+l}else t.addClass("hover-show"),l+='                <div class="hover-show-content">                    <img src="elements2.0/img/homepage/2.png" alt="">                    <a class="mask-hover" href="'+B_Jump._getUrl("outsideCenter")+'">                        <h1>知己知彼的舆情分析</h1>                        <p>基于自然语言处理技术，结合ThinkingGame游戏语料库等技术，理解过亿玩家反馈的超过10亿条信息。从玩家视角深度分析游戏运营状态，多维度洞察玩家特征，轻松查询上千款热门游戏的玩家反馈、玩家构成、运营效果等。</p>                    </a>                </div>';return l},_getReport:function(){var t=$("#ls_report_service");B_Port._ajax("getReportList","get",!0,null,function(){t.html(B_Pre._loading())},function(){t.html("")},function(a,s){t.html(F_Main_Info._htmlReport(t,a))},function(a,s,l){t.html(B_Pre._empty(s))})},_htmlReport:function(t,a){var s="";return a&&a.length>0?(s+='<div class="border-b">',s+="<span>已更新<b>"+a.length+"</b>篇报告</span>",s+='<span class="fr"><a href="'+B_Jump._getUrl("reportsGeneral")+'">全部报告</a></span></div>',a=a[0],s+='<ul class="report-list">',s+="<li>",s+='<img src="'+B_Common._cdnImgUrl()+a.cover_pic+'">',s+='<div class="des">',s+="<h3>"+a.report_name+"</h3>",s+="<p>"+a.report_slogan+"</p>",s+='<p class="summary">'+a.report_desc+"</p>",s+='<a href="'+B_Jump._getUrl("reportDetail")+"?report_id="+a.report_id+'" class="tg-main-btn" target="_blank">在线阅读</a>',s+="</div>",s+="</li>",s+="</ul>"):(t.addClass("hover-show"),s+='                <div class="hover-show-content">                    <img src="elements2.0/img/homepage/3.png" alt="">                    <a class="mask-hover" href="'+B_Jump._getUrl("reportsGeneral")+'">                        <h1>思以智胜的专业服务</h1>                        <p>团队以资深数据挖掘工程师、游戏体验师为核心，提供专业的游戏数据解决方案，有效提升游戏付费渗透率、降低玩家流失率，实时评估游戏运营状态、提升运营效率。</p>                    </a>                </div>'),s},_getGameList:function(){var t=$("#lt_game_list");B_Port._ajax("userProjectDetail","get",!0,null,function(){t.html(B_Pre._loading())},function(){t.html("")},function(a,s){t.html(F_Main_Info._htmlGameList(a.data)),$(".lt_game_list").each(function(t){$(this).find(".tg-tab-change li").each(function(a){$(this).click(function(){$(this).addClass("tg-tab-active").siblings("li").removeClass("tg-tab-active"),$(".lt_game_list").eq(t).find(".lt_game_detail").eq(a).show().siblings(".lt_game_detail").hide()})})})},function(a,s,l){t.html(B_Pre._empty(s))})},_htmlGameList:function(t){for(var a="",s=0;s<t.length;s++)a+='<div class="blockpart no-title col-lg-3 col-md-6 col-sm-6 col-xs-6 lt_game_list">',0==s&&(a+="<h3>核心数据概览</h3>"),a+='<div class="boxshadow game-overview">',a+='<div><img src="'+B_Game._imgUrl(t[s].game_id,"inner")+'"><b>'+t[s].game_name+"</b></div>",a+='<ul class="boxshadow tg-tab-change ">',a+='<li class="tg-tab-active tip-hover">运营指标',a+='<div class="tip-box-show">',a+='<i class="triangle-up"></i>',a+='<div class="tip-box-content">当日核心游戏运营指标',a+="</div>",a+="</div>",a+="</li>",a+='<li class="tip-hover">舆情指标',a+='<div class="tip-box-show">',a+='<i class="triangle-up"></i>',a+='<div class="tip-box-content">当日贴吧、论坛等渠道活跃玩家的核心舆情指标',a+="</div>",a+="</div>",a+="</li>",a+="</ul>",a+='<div class="lt_game_detail">',a+='<div class="border-b">',a+="<span>数据更新至 "+t[s].inner.data_date+"</span>",a+='<span class="fr">',t[s].game_id?a+='<a href="'+B_Jump._getUrl("insideSummary",{id:t[s].game_id})+'">查看详情</a>':a+='<a href="'+B_Jump._getUrl("insideSummary",{id:0})+'">查看详情</a>',a+="</span>",a+="</div>",a+='<div class="scroll-wrap">',a+='<table class="table table-condensed">',a+="</thead>",a+="<tbody>",a+="<tr>",a+="<tr>",a+='<td class="color-a">新玩家数</td>',a+='<td class="color-b">'+t[s].inner.newlogin_num+"人</td>",parseInt(t[s].inner.newlogin_num_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].inner.newlogin_num_span+"人</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].inner.newlogin_num_span)+"人</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">活跃玩家</td>',a+='<td class="color-b">'+t[s].inner.login_num+"人</td>",parseInt(t[s].inner.login_num_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].inner.login_num_span+"人</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].inner.login_num_span)+"人</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">付费玩家</td>',a+='<td class="color-b">'+t[s].inner.pay_num+"人</td>",parseInt(t[s].inner.pay_num_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].inner.pay_num_span+"人</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].inner.pay_num_span)+"人</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">当日收入</td>',a+='<td class="color-b">'+t[s].inner.pay_amount+"元</td>",parseInt(t[s].inner.pay_amount_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].inner.pay_amount_span+"元</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].inner.pay_amount_span)+"元</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">ARPU</td>',a+='<td class="color-b">'+t[s].inner.arpu+"元</td>",parseInt(t[s].inner.arpu_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].inner.arpu_span+"元</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].inner.arpu_span)+"元</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">次日留存</td>',a+='<td class="color-b">'+t[s].inner.retention_rate+"%</td>",parseInt(t[s].inner.retention_rate_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].inner.retention_rate_span+"%</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].inner.retention_rate_span)+"%</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="</tbody>",a+="</table>",a+="</div>",a+="</div>",a+='<div class="lt_game_detail b_none">',a+='<div class="border-b">',a+="<span>数据更新至 "+t[s].lt.data_date+"</span>",a+='<span class="fr"><a href="'+B_Jump._getUrl("gameSentiment",{gameId:t[s].project_id})+'">查看详情</a></span>',a+="</div>",a+='<div class="scroll-wrap">',a+='<table class="table table-condensed">',a+="</thead>",a+="<tbody>",a+="<tr>",a+='<td class="color-a">帖子总量</td>',a+='<td class="color-b">'+t[s].lt.topic_num+"个</td>",parseInt(t[s].lt.topic_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].lt.topic_span+"个</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].lt.topic_span)+"个</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">负面反馈</td>',a+='<td class="color-b">'+t[s].lt.negative_num+"个</td>",parseInt(t[s].lt.negative_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].lt.negative_span+"个</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].lt.negative_span)+"个</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">正面反馈</td>',a+='<td class="color-b">'+t[s].lt.positive_num+"个</td>",parseInt(t[s].lt.positive_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].lt.positive_span+"个</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].lt.positive_span)+"个</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">热词指数</td>',a+='<td class="color-b">'+t[s].lt.hotword_num+"个</td>",parseInt(t[s].lt.hotword_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].lt.hotword_span+"个</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].lt.hotword_span)+"个</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">话题总数</td>',a+='<td class="color-b">'+t[s].lt.topic_num+"个</td>",parseInt(t[s].lt.topic_span)>0?(a+='<td class="color-c">较昨日增长</td>',a+='<td class="color-d">'+t[s].lt.topic_span+"个</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日减少</td>',a+='<td class="color-d">'+Math.abs(t[s].lt.topic_span)+"个</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="<tr>",a+='<td class="color-a">App Store排名</td>',a+='<td class="color-b">'+t[s].lt.apps_num+"名</td>",parseInt(t[s].lt.apps_span)>0?(a+='<td class="color-c">较昨日上升</td>',a+='<td class="color-d">'+t[s].lt.apps_span+"名</td>",a+='<td><b class="up">&uarr;</b></td>'):(a+='<td class="color-c">较昨日下降</td>',a+='<td class="color-d">'+Math.abs(t[s].lt.apps_span)+"名</td>",a+='<td><b class="down">&darr;</b></td>'),a+="</tr>",a+="</tbody>",a+="</table>",a+="</div>",a+="</div>",a+="</div>",a+="</div>";var l=!0;return""==a&&(l=!1),a+='<div class="blockpart  no-title  col-lg-3 col-md-6 col-sm-6 col-xs-6">',l||(a+="<h3>核心数据概览</h3>"),a+='<div class="boxshadow game-overview add-new">',a+="<h5>添加智能分析服务</h5>",a+="<p>您可以接入游戏日志，从而获取更加智能的游戏运营分析服务</p>",a+='<a class="tg-assist-btn" onclick="B_Login._openProbation(\'operate\')">申请接入</a>',a+="<h5>添加运营指标服务</h5>",a+="<p>您可以接入游戏日志，从而掌握精准的游戏运营指标</p>",a+='<a class="tg-assist-btn" onclick="B_Login._openProbation(\'inside\')">申请接入</a>',a+="</div>",a+="</div>"}};