var F_PayOsmosis_Entrance={_init:function(){if(B_Login._checkUpdate(),M_HeadFoot._headShow(1),"demo"!=M_Init._controller&&B_User._isDemoUser())B_Login._openLogin("background");else{switch(M_Init._clean(),M_Init._controller){case"demo":M_Init._api.innerOperationPayRateData="demoInnerOperationPayRateData";break;default:M_Init._api.innerOperationPayRateData="innerOperationPayRateData"}M_Init._dateCache.begin=M_Init._dateChoose.begin,M_Init._dateCache.end=M_Init._dateChoose.end,M_Common._getOrderGame("payosmosis","","1-4-2"),B_Date._chooseSection({autoCommit:!1,todayValid:!1},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(a,e){a==M_Init._dateCache.begin&&M_Init._dateCache.end==e||(M_Init._dateCache.begin=a,M_Init._dateCache.end=e,F_PayOsmosis_Info._getInfo())})}}},F_PayOsmosis_Info={_init:[{type:"togetherTabAvg",name:"付费率",tab:["日付费率","周付费率","月付费率"],tips:[{},{position:"second",content:["当日付费玩家数占当日活跃玩家数的比例","当自然周付费玩家数占当自然周活跃玩家数的比例 ","当自然月付费玩家数占当自然月活跃玩家数的比例"]}]},{type:"togetherTabAvg",name:"ARPU",tab:["日ARPU","月ARPU","日ARPPU","月ARPPU"],tips:[{},{position:"second",content:["当日每活跃玩家的平均收益","当自然月每活跃玩家（去重）的平均收益 ","当日每付费玩家的平均收益","当自然月每付费玩家（去重）的平均收益"]}]},{type:"switchTab",name:"付费渗透与中国地区分布",tab:["日均付费率","日均ARPU","日均ARPPU"],tips:[{},{position:"second",content:["所选时期内，当前地区的每日付费玩家占每日活跃玩家比例均数","所选时期内，当前地区的每日每活跃玩家平均收益均数","所选时期内，当前地区的每日每付费玩家平均收益均数"]}]},{type:"switchTab",name:"付费渗透与全球地区分布",tab:["日均付费率","日均ARPU","日均ARPPU"],tips:[{},{position:"second",content:["所选时期内，当前地区的每日付费玩家占每日活跃玩家比例均数","所选时期内，当前地区的每日每活跃玩家平均收益均数","所选时期内，当前地区的每日每付费玩家平均收益均数"]}]},{type:"switchTab",name:"付费渗透与渠道分布",tab:["日均付费率","日均ARPU","日均ARPPU"],tips:[{},{position:"second",content:["所选时期内，当前渠道的每日付费玩家占每日活跃玩家比例均数","所选时期内，当前渠道的每日每活跃玩家平均收益均数","所选时期内，当前渠道的每日每付费玩家平均收益均数"]}]}],_avg:[[[{label:"AVG：",name:"平均每日付费率",key:"axis_pay_rate|avg_pay_rate_day",unit:"%"}],[{label:"AVG：",name:"平均每周付费率",key:"axis_pay_rate|avg_pay_rate_week",unit:"%"}],[{label:"AVG：",name:"平均每月付费率",key:"axis_pay_rate|avg_pay_rate_month",unit:"%"}]],[[{label:"AVG：",name:"日均ARPU",key:"axis_arpu|avg_arpu_day",unit:"元"}],[{label:"AVG：",name:"月均ARPU",key:"axis_arpu|avg_arpu_month",unit:"元"}],[{label:"AVG：",name:"日均ARPPU",key:"axis_arpu|avg_arppu_day",unit:"元"}],[{label:"AVG：",name:"月均ARPPU",key:"axis_arpu|avg_arppu_month",unit:"元"}]]],_port:[[[{name:"日付费率",key:"axis_pay_rate|y_axis_pay_rate_day"}],[{name:"周付费率",key:"axis_pay_rate|y_axis_pay_rate_week"}],[{name:"月付费率",key:"axis_pay_rate|y_axis_pay_rate_month"}]],[[{name:"日ARPU",key:"axis_arpu|y_axis_arpu_day"}],[{name:"月ARPU",key:"axis_arpu|y_axis_arpu_month"}],[{name:"日ARPPU",key:"axis_arpu|y_axis_arppu_day"}],[{name:"月ARPPU",key:"axis_arpu|y_axis_arppu_month"}]],[[{name:"日均付费率",key:"axis_area|china"}],[{name:"日均ARPU",key:"axis_area|china"}],[{name:"日均ARPPU",key:"axis_area|china"}]],[[{name:"日均付费率",key:"axis_area|global"}],[{name:"日均ARPU",key:"axis_area|global"}],[{name:"日均ARPPU",key:"axis_area|global"}]],[[{name:"日均付费率",key:"axis_channel|y_channe_axis_pay_rate"}],[{name:"日均ARPU",key:"axis_channel|y_channe_axis_arpu"}],[{name:"日均ARPPU",key:"axis_channel|y_channe_axis_arppu"}]]],_domInit:function(){M_Inside._htmlChartTable($("#ct_main_area"),F_PayOsmosis_Info._init),M_Inside._downloadCsv(),F_PayOsmosis_Info._getInfo()},_getInfo:function(){for(var a=M_Init._dateCache.begin,e=M_Init._dateCache.end,_=[],t=0;t<F_PayOsmosis_Info._init.length;t++)_.push("bs_chart_"+t+"_0");var n={};n.start_date=a,n.end_date=e,n.game_id=M_Init._gameId,n=B_Common._postData(n),B_Port._ajax(M_Init._api.innerOperationPayRateData,"get",!0,n,function(){for(var a=0;a<_.length;a++)$("#"+_[a]).html(B_Pre._loading())},function(){for(var a=0;a<_.length;a++)$("#"+_[a]).html("")},function(a,e){if(a){M_Init._dataCache.data=a;for(var _=0;_<F_PayOsmosis_Info._init.length;_++){M_Init._dataCache["position_"+_]||(M_Init._dataCache["position_"+_]=0);for(var t=0;t<F_PayOsmosis_Info._init[_].tab.length;t++)if(M_Init._dataCache["position_"+_]==t){F_PayOsmosis_Info._chartHtml(_,t),M_Inside._chartTableIcon(F_PayOsmosis_Info._init[_].type,_,t);break}M_Inside._tabChangePerChart(_,F_PayOsmosis_Info._init[_].type,"payosmosis")}}},function(a,e,t){for(var n=0;n<_.length;n++)$("#"+_[n]).html(B_Pre._empty(e))})},_chartHtml:function(a,e,_){M_Init._dataCache["position_"+a]=e;var t=M_Init._dataCache.data,n={x_axis:[],y_axis:[],yFormat:""},i={},s=50,o="";switch(a+""){case"0":n.xFormatDate=!0,n.yFormat="%",n.tooltip={num:1,unit:"%"},o="%";break;case"1":n.xFormatDate=!0,n.yFormat="元",n.tooltip={num:1,unit:"元"},o="元";break;case"2":case"3":case"4":switch(e+""){case"0":n.yFormat="%",n.tooltip={num:1,unit:"%"},o="%";break;default:n.yFormat="元",n.tooltip={num:1,unit:"元"},o="元"}}switch(a+""){case"0":i={head:["日期"],body:[]};break;case"1":i={head:["日期"],body:[]};break;case"2":case"3":i={head:["地区"],body:[]};break;case"4":i={head:["渠道"],body:[]}}for(var r=0;r<F_PayOsmosis_Info._port[a][e].length;r++){var y=F_PayOsmosis_Info._port[a][e][r].key.split("|"),p=F_PayOsmosis_Info._port[a][e][r].name;switch(a+""){case"0":if(s=50,i.head.push(p),t[y[0]][y[1]]){var h=t[y[0]][y[1]];switch(e+""){case"0":n.x_axis=t[y[0]].x_axis_pay_rate_day;break;case"1":n.x_axis=t[y[0]].x_axis_pay_rate_week;break;case"2":n.x_axis=t[y[0]].x_axis_pay_rate_month}for(var d=0;d<h.length;d++)i.body[d]||(i.body[d]=[n.x_axis[d]]),i.body[d].push(h[d]+o);n.y_axis.push({name:p,data:h})}break;case"1":if(s=50,i.head.push(p+"("+o+")"),t[y[0]][y[1]]){var h=t[y[0]][y[1]];switch(e+""){case"0":n.x_axis=t[y[0]].x_axis_arpu_day;break;case"1":n.x_axis=t[y[0]].x_axis_arpu_month;break;case"2":n.x_axis=t[y[0]].x_axis_arppu_day;break;case"3":n.x_axis=t[y[0]].x_axis_arppu_month}for(var d=0;d<h.length;d++)i.body[d]||(i.body[d]=[n.x_axis[d]]),i.body[d].push(h[d]);n.y_axis.push({name:p,data:h})}break;case"2":case"3":if(s=20,t[y[0]][y[1]]){var h=t[y[0]][y[1]];switch(e+""){case"0":i.head.push(p);break;default:i.head.push(p+"("+o+")")}for(var c=[],d=0;d<h.length;d++)switch(n.x_axis.push(h[d].area_classify),i.body[d]||(i.body[d]=[n.x_axis[d]]),e+""){case"0":c.push(h[d].user_rate),i.body[d].push(h[d].user_rate+"%");break;case"1":c.push(h[d].arpu),i.body[d].push(h[d].arpu);break;case"2":c.push(h[d].arppu),i.body[d].push(h[d].arppu)}n.y_axis.push({name:p,data:c})}break;case"4":if(s=20,"%"==o?i.head.push(p):i.head.push(p+"("+o+")"),t[y[0]][y[1]]){var h=t[y[0]][y[1]];n.x_axis=t[y[0]].x_channe_axis;for(var d=0;d<h.length;d++)i.body[d]||(i.body[d]=[n.x_axis[d]]),"%"==o?i.body[d].push(h[d]+"%"):i.body[d].push(h[d]);n.y_axis.push({name:p,data:h})}}}if(F_PayOsmosis_Info._avg[a]&&F_PayOsmosis_Info._avg[a][e]){for(var m="",x=F_PayOsmosis_Info._avg[a][e],u=0;u<x.length;u++)x[u].label&&(m+="<span>"+x[u].label+"</span>"),m+="<span>"+x[u].name+"<b>",y=x[u].key.split("|"),t[y[0]]&&t[y[0]][y[1]]&&(m+=t[y[0]][y[1]]),m+=x[u].unit+"</b></span>";M_Inside._avgHtml(a+"_0",m)}i.name=M_Inside._tableName(F_PayOsmosis_Info._init,a,e,M_Init._dateCache.begin,M_Init._dateCache.end),e=0,M_Init._dataCache[a+"_"+e]=i,M_Inside_Chart._chartData(s,"bs_chart_"+a+"_"+e,n),M_Inside._tableHtml(1,a+"_"+e)}};