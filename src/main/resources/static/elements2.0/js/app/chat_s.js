requirejs.config({shim:{layer:["jquery"],"store.min":["jquery"],background:{deps:["base"]}},baseUrl:"elements2.0/js/lib",paths:{jquery:"./jquery-1.9.1.min",app:"../app",base:"../app/base",background:"../app/background"}}),require(["jquery","layer","store.min","dateRange","base","background","app/inside","app/outside"],function(){if(store=require("store.min"),B_Login._checkUpdate(),B_User._isDemoUser())parent.B_Login._openLogin("background");else{M_Init._clean();var e=B_Common._getUrl("query");isNaN(e.i)?(parent.B_Pop._init("close"),parent.B_Pop._init("msg",{content:"选择的数据不存在，请刷新页面重试"})):M_Init._dataCache.infoId=e.i,e.b?M_Init._dataCache.begin=B_Common._decodeUrl(e.b):M_Init._dataCache.begin=M_Init._dateChoose.begin,e.e?M_Init._dataCache.end=B_Common._decodeUrl(e.e):M_Init._dataCache.end=M_Init._dateChoose.end,F_Chat_Date._htmlInit()}});var F_Chat_Date={_quickChoose:function(){$(".tk_fast_choose span").each(function(){$(this).click(function(){var e=$(this).attr("data-t"),t="",a=B_Date._getDiffDate("",0);switch(e+""){case"1":t=B_Date._getDiffDate("",-365);break;case"2":t=B_Date._getDiffDate("",-180);break;case"3":t=B_Date._getDiffDate("",-90);break;case"4":t=B_Date._getDiffDate("",-30);break;case"5":t=B_Date._getDiffDate("",-7);break;case"6":t=B_Date._getDiffDate("",0)}$("#dc1").html(t+" 至 "+a),$("#db1").val(t),$("#de1").val(a)})})},_dateChoose:function(e,t){B_Date._chooseSection({autoCommit:!0,todayValid:!0},1,e,t)},_workUpdate:function(e){B_Port._ajax("talkUpdate","post",!0,e,function(){B_Common._btnTextStatus("disable",$("#btn_replace_confirm"),{disable:"提交中..."})},function(){B_Common._btnTextStatus("normal",$("#btn_replace_confirm"),{normal:"确认"})},function(e,t){parent.F_Chat_Info._pageRefresh(),parent.B_Pop._init("msg",{content:t}),B_Pop._init("closeFrame")},function(e,t,a){B_Pop._init("alert",{content:B_Pre._empty(t)})})},_htmlInit:function(){F_Chat_Date._dateChoose(M_Init._dataCache.begin,M_Init._dataCache.end),F_Chat_Date._quickChoose(),$("#btn_replace_cancel").click(function(){parent.B_Pop._init("close")}),$("#btn_replace_confirm").click(function(){var e=$("#db1").val()+" 00:00:00",t=$("#de1").val()+" 23:59:59",a={};a.info_id=M_Init._dataCache.infoId,a.start_date=e,a.end_date=t,a=B_Common._postData(a),F_Chat_Date._workUpdate(a)})}};