requirejs.config({shim:{layer:["jquery"],"store.min":["jquery"],background:{deps:["base"]}},baseUrl:"elements2.0/js/lib",paths:{jquery:"./jquery-1.9.1.min",app:"../app",base:"../app/base",background:"../app/background"}}),require(["jquery","layer","store.min","base","background"],function(){store=require("store.min"),B_Login._checkUpdate();var e=B_Common._getUrl("query");if(!e.d&&B_User._isDemoUser())parent.B_Login._openLogin("background");else{if(!e.k||isNaN(e.g))return parent.B_Pop._init("close"),parent.B_Pop._init("msg",{content:"选择的数据不存在，请刷新页面重试"}),!1;var r="innerUserDetail";e.d&&(r="demoInnerUserDetail");var n=$(".property-content"),t={};t.data_id=B_Common._decodeUrl(e.k),t.game_id=e.g,t=B_Common._postData(t),B_Port._ajax(r,"get",!0,t,function(){n.html(B_Pre._loading())},function(){n.html("")},function(e,r){if(e.groupTitle&&e.groupTitle.length>0){for(var t="",o=0;o<e.groupTitle.length;o++)t+='<div class="pro-content">',t+="<h1>"+e.groupTitle[o]+"</h1>",t+="<ul>",t+="<li>",$.each(e.data[e.groupTitle[o]],function(e,r){t+="<span>"+e+"：<b>"+r+"</b></span>"}),t+="</li></ul></div>";n.html(t)}},function(e,r,t){n.html(B_Pre._empty(r))})}});