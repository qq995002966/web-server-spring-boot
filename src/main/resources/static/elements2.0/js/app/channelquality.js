var F_ChannelQuality_Entrance={_init:function(){if(B_Login._checkUpdate(),M_HeadFoot._headShow(1),"demo"!=M_Init._controller&&B_User._isDemoUser())B_Login._openLogin("background");else{switch(M_Init._clean(),M_Init._controller){case"demo":M_Init._api.innerChannelQuality="demoInnerChannelQuality";break;default:M_Init._api.innerChannelQuality="innerChannelQuality"}M_Init._dateCache.begin=M_Init._dateChoose.begin,M_Init._dateCache.end=M_Init._dateChoose.end,M_Common._getOrderGame("channelquality","","1-6-1"),B_Date._chooseSection({autoCommit:!1,todayValid:!1},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(n,a){n==M_Init._dateCache.begin&&M_Init._dateCache.end==a||(M_Init._dateCache.begin=n,M_Init._dateCache.end=a,F_ChannelQuality_Info._getInfo())})}}},F_ChannelQuality_Info={_init:[{type:"table",name:"质量指标",tab:[],tips:[{position:"first",content:"新增玩家数：所选时期内该渠道的新增玩家总数<br>渠道比重：所选时期内该渠道的新增玩家数占全部渠道新增玩家数的比例<br>次日留存率均值：所选时期内该渠道的新增玩家次日留存率均值<br>7日留存率均值：所选时期内该渠道的新增玩家在新增第7日留存率均值<br>30日留存率均值：所选时期内该渠道的新增玩家在新增第30日留存率均值<br>平均日活数：所选时期内该渠道的每日活跃玩家均数<br>首周付费比例：所选时期内该渠道的新增用户中首周就进行付费的玩家占该期间内全部新增玩家的比例"}]},{type:"togetherTab",name:"渠道留存比对",tab:["日新增玩家数","次日留存率","7日留存率","30日留存率","日活跃数"],tips:[{},{position:"second",content:["所选渠道当天的新增玩家数","次日留存率：所选渠道在当天的次日留存比例","7日留存率：所选渠道在当天的7日留存比例","30日留存率：所选渠道在当天的30日留存比例","所选渠道当天的活跃玩家数"]}]}],_port:[[[{name:"质量指标",key:"channel_table"}]],[[{name:"日新增玩家数",key:"channel_compare|y_axis_newlogin"}],[{name:"次日留存率",key:"channel_compare|y_axis_retention_rate_1d"}],[{name:"7日留存率",key:"channel_compare|y_axis_retention_rate_7d"}],[{name:"30日留存率",key:"channel_compare|y_axis_retention_rate_30d"}],[{name:"日活跃数",key:"channel_compare|y_axis_login"}]]],_domInit:function(){M_Inside._htmlChartTable($("#ct_main_area"),F_ChannelQuality_Info._init),F_ChannelQuality_Info._getInfo(),M_Inside._downloadCsv()},_getInfo:function(){for(var n=M_Init._dateCache.begin,a=M_Init._dateCache.end,e=[],t=0;t<F_ChannelQuality_Info._init.length;t++)switch(F_ChannelQuality_Info._init.type){case"table":e.push("bs_table_"+t+"_0");break;default:e.push("bs_chart_"+t+"_0")}var _={};_.start_date=n,_.end_date=a,_.game_id=M_Init._gameId,_=B_Common._postData(_),B_Port._ajax(M_Init._api.innerChannelQuality,"get",!0,_,function(){for(var n=0;n<e.length;n++)$("#"+e[n]).html(B_Pre._loading())},function(){for(var n=0;n<e.length;n++)$("#"+e[n]).html("")},function(n,a){if(n){M_Init._dataCache.data=n;for(var e=0;e<F_ChannelQuality_Info._init.length;e++)if(F_ChannelQuality_Info._init[e].tab.length>0){M_Init._dataCache["position_"+e]||(M_Init._dataCache["position_"+e]=0);for(var t=0;t<F_ChannelQuality_Info._init[e].tab.length;t++)if(M_Init._dataCache["position_"+e]==t){F_ChannelQuality_Info._chartHtml(e,t),M_Inside._chartTableIcon(F_ChannelQuality_Info._init[e].type,e,t);break}M_Inside._tabChangePerChart(e,F_ChannelQuality_Info._init[e].type,"channelquality")}else F_ChannelQuality_Info._chartHtml(e,"0"),M_Inside._chartTableIcon(F_ChannelQuality_Info._init[e].type,e,"0")}},function(n,a,t){for(var _=0;_<e.length;_++)$("#"+e[_]).html(B_Pre._empty(a))})},_chartHtml:function(n,a){M_Init._dataCache["position_"+n]=a;var e=M_Init._dataCache.data,t={x_axis:[],y_axis:[],xFormatDate:!1,yFormat:"",legendSelectMode:!1},_={head:[],body:[]},i=50,o="";switch(n+""){case"0":_={head:["渠道名称","新增玩家数","渠道比重","次日留存率均值","7日留存率均值","30日留存率均值","平均日活数","首周付费比例"],body:[]};break;case"1":switch(o="",_={head:["日期"],body:[]},t.xFormatDate=!0,a+""){case"0":case"4":t.yFormat="",t.tooltip={num:1,unit:""},o="人";break;case"1":case"2":case"3":t.yFormat="%",t.tooltip={num:1,unit:"%"},o="%"}}for(var l=0;l<F_ChannelQuality_Info._port[n][a].length;l++){var h=F_ChannelQuality_Info._port[n][a][l].key.split("|"),r=F_ChannelQuality_Info._port[n][a][l].name;switch(n+""){case"0":if(e[h[0]])for(var d=e[h[0]],c=0;c<d.length;c++)_.body[c]=[d[c].channel_id,d[c].newlogin_num,d[c].newlogin_rate+"%",d[c].retention_rate_1d+"%",d[c].retention_rate_7d+"%",d[c].retention_rate_30d+"%",d[c].login_num,d[c].first_week_pay_rate+"%"];break;default:if(t.legendSelectMode=!0,e[h[0]][h[1]]){var d=e[h[0]][h[1]];t.x_axis=e[h[0]].x_axis;var l=0;$.each(d,function(n,a){_.head.push(n+r);for(var e=0;e<a.length;e++)_.body[e]||(_.body[e]=[t.x_axis[e]]),"%"!=o?_.body[e].push(a[e]):_.body[e].push(a[e]+o);t.y_axis.push({name:n,data:a}),l++}),t.tooltip.num=l}}}_.name=M_Inside._tableName(F_ChannelQuality_Info._init,n,a,M_Init._dateCache.begin,M_Init._dateCache.end),a=0,M_Init._dataCache[n+"_"+a]=_,1==n&&M_Inside_Chart._chartData(i,"bs_chart_"+n+"_"+a,t),M_Inside._tableHtml(1,n+"_"+a)}};