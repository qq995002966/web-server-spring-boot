requirejs.config({shim:{layer:["jquery"],"store.min":["jquery"],background:{deps:["base"]}},baseUrl:"elements2.0/js/lib",paths:{jquery:"./jquery-1.9.1.min",app:"../app",base:"../app/base",background:"../app/background"}}),require(["jquery","layer","store.min","base","background","app/inside","app/outside"],function(){if(store=require("store.min"),B_Login._checkUpdate(),B_User._isDemoUser())parent.B_Login._openLogin("background");else{var a=B_Common._getUrl("query");a.g?isNaN(a.g)?(parent.B_Pop._init("close"),parent.B_Pop._init("msg",{content:"选择的数据不存在，请刷新页面重试"})):(M_Init._dataCache.update=!0,M_Init._dataCache.gameId=a.g,M_Init._dataCache.gameOldId=a.g,F_Task_Detail._getMail()):F_Task_Detail._htmlInit()}});var F_Task_Detail={_htmlInit:function(){var a=0,t="",e="",i="开发,活动,版本",n=3,_=1;M_Init._dataCache.mailData&&(a=M_Init._dataCache.gameId,t=M_Init._dataCache.mailData.task_name,e=M_Init._dataCache.mailData.email_addr,i=M_Init._dataCache.mailData.lt_warn_class,n=M_Init._dataCache.mailData.warn_level,_=M_Init._dataCache.mailData.status,n>5&&(n=5)),$(".tg-assist-btn").click(function(){parent.B_Pop._init("close")}),$('input[name="email_title"]').val(t),$('input[name="email_addr"]').val(e);var r='<div class="checkbox-wrap">';i=i?i.split(","):[];for(var o=0;o<M_Outside._alarmInit.type.length;o++)r+='<div class="tg-checkbox-btn"><input type="checkbox" id="c'+o+'" name="type"',r+=$.inArray(M_Outside._alarmInit.type[o]+"",i)>-1?" checked ":"",r+='value="'+M_Outside._alarmInit.type[o]+'"><label for="c'+o+'">'+M_Outside._alarmInit.type[o]+"类预警</label></div>";r+="</div>",$(".pop-list li").eq(1).append(r),r="",r+='<div class="tg-selected-drop"><p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span data-i="'+n+'">'+M_Outside._alarmInit.power[n]+"</span></p>",r+='<ul style="display: none;">';for(var o=1;o<M_Outside._alarmInit.power.length;o++)r+='<li><a data-i="'+o+'">'+M_Outside._alarmInit.power[o]+"</a></li>";r+="</ul></div>",$(".tg-selected-drop").html(r),M_Inside._dropShow(),M_Inside._dropSelected(),M_Inside._dropLeave(),$(".dropdown-menu li a").each(function(){$(this).click(function(){$(".dropdown-toggle span").attr("data-t",$(this).attr("data-t")).text($(this).text())})}),$('input[name="status"]').each(function(){$(this).val()==_+""?$(this).attr("checked",!0):$(this).attr("checked",!1)});var s="";M_Init._dataCache.gameId&&(s=B_Game._getGame([M_Init._dataCache.gameId],1),s=s&&s[M_Init._dataCache.gameId]?s[M_Init._dataCache.gameId]:""),s?$("#gameDropChoose").html('<p class="tg-drop-text-part gameDropCurrent"><img src="'+s[0]+'">'+s[1]+"</p>"):B_Game._dropChoose(a,"#gameDropChoose","edit",function(a){M_Init._dataCache.gameId=a}),$(".tg-main-btn").click(function(){F_Task_Detail._workAdd()})},_getMail:function(a){var t={};t.project_id=M_Init._dataCache.gameId,t=B_Common._postData(t),B_Port._ajax("sigmaItWarnMailGet","get",!0,t,null,null,function(a,t){a&&a.task_name?M_Init._dataCache.mailData=a:M_Init._dataCache.mailData="",F_Task_Detail._htmlInit()},null)},_workAdd:function(){var a=$.trim($('input[name="email_title"]').val()),t=$.trim($('input[name="email_addr"]').val()),e=[],i=$.trim($(".tg-selected-drop span").attr("data-i")),n=B_Common._getCheckboxVal("type"),_=B_Common._getRadioVal("status");if(!M_Init._dataCache.gameId||isNaN(M_Init._dataCache.gameId))return B_Pop._init("msg",{content:"请选择产品"}),!1;if(""==n)return B_Pop._init("msg",{content:"请选择预警类型"}),!1;if(""==a)return B_Pop._init("msg",{content:"请填写任务名称"}),!1;if(""==t)return B_Pop._init("msg",{content:"请填写接收邮箱"}),!1;var r=!1;t=t.split(" ");for(var o=0;o<t.length;o++)""!=t[o]&&(B_Common._isMail(t[o])?e.push(t[o]):r=!0);if(r)return B_Pop._init("msg",{content:"请填写合法的接收邮箱"}),!1;e=t.join(" ");var s={};s.email_addr=e,s.task_name=a,s.status=_,s.lt_warn_class=n,s.warn_level=i,s.project_id=M_Init._dataCache.gameId,s.old_id=M_Init._dataCache.gameOldId,s=B_Common._postData(s),B_Port._ajax("sigmaItWarnMailSet","post",!0,s,function(){B_Common._btnTextStatus("disable",$(".tg-main-btn"),{disable:"提交中..."})},function(){B_Common._btnTextStatus("normal",$(".tg-main-btn"),{normal:"确认提交"})},function(a,t){var e="";M_Init._dataCache.update?(e="更新成功",parent.F_Task_Info._getList(1)):(e="添加成功",parent.F_Task_Info._pageRefresh()),parent.B_Pop._init("msg",{content:e}),B_Pop._init("closeFrame")},function(a,t,e){return B_Pop._init("msg",{content:t}),!1})}};