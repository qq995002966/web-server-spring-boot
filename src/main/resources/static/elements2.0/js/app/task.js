var F_Task_Entrance={_init:function(){B_Login._checkUpdate(),M_HeadFoot._headShow(2),M_Dom._menuList("舆情分析","3-1-1"),B_User._isDemoUser()?B_Login._openLogin("background"):(M_Init._clean(),B_Game._checkAuthMenu()?(M_Game._htmlGameVisitHide("outsideAssistant"),F_Task_Info._domInit(),F_Task_Info._getList(1),$(".tg-main-btn").click(function(){F_Task_Common._openAdd("","添加")})):($("#headerTop").html(""),M_Game._htmlGameVisitHide("outsideAssistant"),F_Task_Info._domDemo()))}},F_Task_Info={_cache:{},_domDemo:function(){var t='                    <img src="'+B_Common._cdnImgUrl()+'2.0/userlimit/suddenly.png" alt="" class="adver-bg">                    <div class="adver-des">                        <h3>智能判别突发舆情事件</h3>                        <p>突发问题预警能够基于历史舆情数据建立预警模型，当用户反馈信息中一旦出现可能导致舆情事件爆发的内容时，会通过邮件自动报警，从而提前发现各类突发舆情事件。</p>                        <button class="tg-main-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Common._qqUrl()+"')\">在线咨询</button>                    </div>";$("#contentPart").html(t)},_workUpdate:function(t){B_Port._ajax("sigmaItWarnMailSet","post",!0,t,function(){B_Pop._init("load",{type:1,time:10})},function(){B_Pop._init("close")},function(t,a){B_Pop._init("msg",{content:"状态更新成功"}),setTimeout(function(){B_Pop._init("close")},1e3)},function(t,a,e){B_Pop._init("alert",{content:B_Pre._empty(a)})})},_workDel:function(t){var a={};a.project_id=t,a=B_Common._postData(a),B_Port._ajax("sigmaItWarnMailGet","post",!0,a,function(){B_Pop._init("load",{type:1,time:10})},function(){B_Pop._init("close")},function(t,a){B_Pop._init("msg",{content:"删除成功"}),setTimeout(function(){B_Pop._init("close"),F_Task_Info._pageRefresh("del")},1e3)},function(t,a,e){B_Pop._init("alert",{content:B_Pre._empty(a)})})},_pageRefresh:function(t){var a=F_Task_Info._cache.page;switch(t){case"del":F_Task_Info._cache.total=F_Task_Info._cache.total>0?F_Task_Info._cache.total-1:0,a=Math.ceil(F_Task_Info._cache.total/B_Page._size),a=F_Task_Info._cache.page<=a?F_Task_Info._cache.page:a}F_Task_Info._getList(a)},_getList:function(t){F_Task_Info._cache.page=t;var a=parseInt(t)<=0?0:(t-1)*B_Page._size,e=$("#lt_item_list"),n=$("#lt_forum_page"),_={};_.index=a,_.limit=B_Page._size,_=B_Common._postData(_),B_Port._ajax("sigmaItWarnMailGet","get",!0,_,function(){e.html(B_Pre._loading("b_padding30")),n.html("")},function(){e.html(""),n.html("")},function(_,o){_.data&&_.data.length>0?(F_Task_Info._cache.taskData=_.data,e.html(F_Task_Info._htmlList(_.data,a)),$(".bs_task_detail").each(function(){$(this).click(function(){B_Jump._go("base",B_Jump._getUrl("gameAssistant",{gameId:$(this).attr("data-i")}))})}),F_Task_Info._cache.total=_.total,n.html(B_Page._show({total:_.total,page:t},"number")),B_Page._click(t,function(t){F_Task_Info._getList(t),B_Jump._top()}),$('input[type="checkbox"]').bootstrapSwitch("size","small"),$('input[type="checkbox"]').on("switchChange.bootstrapSwitch",function(t,a){var e=$(this).attr("id"),n="";if(F_Task_Info._cache.taskData){for(var _=0;_<F_Task_Info._cache.taskData.length;_++)if(F_Task_Info._cache.taskData[_].id==e){n=F_Task_Info._cache.taskData[_];break}n&&(n.status=a?1:0,n=B_Common._postData(n),F_Task_Info._workUpdate(n))}""==n&&B_Pop._init("confirm",{skin:"layerCheck-class",content:"数据读取失败",btn:"刷新",title:"提示",closeBtn:0},function(){top.window.location.reload()})})):e.html('<div class="b_empty">快去添加新任务吧！</div>')},function(t,a,n){e.html(B_Pre._empty(a))})},_htmlList:function(t,a){for(var e="",n=[],_='<table class="tg-table table table-bordered"><thead class="boxshadow">            <tr>            <th>游戏名称</th>            <th class="level">开发问题预警等级</th>            <th class="level">活动问题预警等级</th>            <th class="level">版本问题预警等级</th>            <th>查看</th>            <th>邮件通知状态</th>            <th>操作</th>        </tr></thead><tbody>',o=0;o<t.length;o++)(e=B_Game._getGame([t[o].project_id]))&&e[t[o].project_id]&&(e=e[t[o].project_id],n=t[o].lt_warn_class.split(","),_+="<tr>",_+='<td class="game-name"><img src="'+e[0]+'"><p>'+e[1]+"</p></td>",_+="<td>"+F_Task_Info._htmlLevel("开发",n,t[o].warn_level)+"</td>",_+="<td>"+F_Task_Info._htmlLevel("活动",n,t[o].warn_level)+"</td>",_+="<td>"+F_Task_Info._htmlLevel("版本",n,t[o].warn_level)+"</td>",_+='<td><div class="btn-union"><a class="tg-main-btn bs_task_detail" data-i="'+t[o].project_id+'">查看详情</a></div></td>',_+="<td>"+(0==t[o].status?'<input type="checkbox" id="'+t[o].id+'" />':'<input id="'+t[o].id+'" type="checkbox" checked />')+"</td>",_+='<td><button class="tg-main-btn" onclick="F_Task_Common._openAdd('+t[o].project_id+',\'编辑\')">修改</button><button class="tg-assist-btn" onclick="F_Task_Common._delConfirm('+t[o].project_id+",'"+t[o].task_name+"')\">删除</button>",_+="</td></tr>");return _+="</tbody></table>"},_htmlLevel:function(t,a,e){var n="",_="",o="";switch(e+""){case"1":_="灰色",n="gray-level";break;case"2":_="蓝色",n="blue-level";break;case"3":_="黄色",n="yellow-level";break;case"4":_="橙色",n="orange-level";break;case"5":_="红色",n="red-level"}if($.inArray(t,a)>-1){o+="<span>"+_+e+"级预警</span>",o+='<ul class="level-circle '+n+'">';for(var i=0;i<5;i++)o+=i<e?'<li class="selected"></li>':"<li></li>";o+="</ul>"}else o+="-";return o},_domInit:function(){var t="";t+='            <div class="tg-table-layout blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12">                <h3>突发问题预警任务</h3>                <div class="boxshadow tg-table-content">                    <div class="tg-table-wrap tg-table-no-padding tg-height-hight">                        <div class="table-out-wrap" id="lt_item_list"></div>                        <ul class="tg-page-list" id="lt_forum_page"></ul>                    </div>                </div>            </div>',t+="",$("#headerTop").html('<span>您可以通过邮件及时获知活动、开发、版本方面的各类游戏突发问题。</span><button class="tg-main-btn">添加任务</button>'),$("#mainContent").addClass("alert-task-part"),$("#ct_main_area").html(t)}},F_Task_Common={_openAdd:function(t,a){B_Pop._init("close");var e=t?"outsidetask_s.html?g="+t:"outsidetask_s.html";B_Pop._init("open",{type:2,scroll:!0,title:a+"预警任务",width:"850px",height:"440px",shift:2,content:e},"")},_delConfirm:function(t,a){B_Pop._init("confirm",{skin:"layerCheck-class",content:"确实要删除【"+a+"】预警任务么？",btn:["确认","取消"],title:"操作提示"},function(){F_Task_Info._workDel(t)},function(){B_Pop._init("close")})}};