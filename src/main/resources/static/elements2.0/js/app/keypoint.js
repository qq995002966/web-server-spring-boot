var F_Keypoint_Entrance={_init:function(){if(B_Login._checkUpdate(),M_HeadFoot._headShow(1),"demo"!=M_Init._controller&&B_User._isDemoUser())B_Login._openLogin("background");else{switch(M_Init._clean(),M_Init._controller){case"demo":M_Init._api.innerOperationKpi="demoInnerOperationKpi";break;default:M_Init._api.innerOperationKpi="innerOperationKpi"}M_Init._dateCache.begin=M_Init._dateChoose.begin,M_Init._dateCache.end=M_Init._dateChoose.end,M_Common._getOrderGame("keypoint","","1-1-2"),B_Date._chooseSection({autoCommit:!1,todayValid:!1},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(e,n){e==M_Init._dateCache.begin&&M_Init._dateCache.end==n||(M_Init._dateCache.begin=e,M_Init._dateCache.end=n,F_Keypoint_Info._getInfo())})}}},F_Keypoint_Info={_init:[{type:"togetherTabAvg",name:"付费渗透率",tab:["日付费率","日ARPU","日ARPPU"],tips:[{},{position:"second",content:["当日付费玩家数占当日活跃玩家数的比例","当日每活跃玩家的平均收益","当日每付费用户平均收益"]}]},{type:"together",name:"玩家留存",tab:[],tips:[{position:"first",content:"新增玩家次日留存率：以选择当日的新增玩家为基数，这批玩家在第二天仍有登录记录的比例<br>新增玩家7日留存率：以选择当日的新增玩家为基数，这批玩家在第7日仍有登录记录的比例<br>新增玩家30日留存率：以选择当日的新增玩家为基数，这批玩家在第30日仍有登录记录的比例"}]},{type:"togetherTabAvg",name:"平均游戏时长与次数",tab:["平均游戏次数","平均游戏时长"],tips:[{},{position:"second",content:["当日活跃玩家的平均开启游戏次数","当日活跃玩家的平均游戏时长"]}]}],_avg:[[[{label:"AVG：",name:"平均每日付费率",key:"avg_pay_rate",unit:"%"}],[{label:"AVG：",name:"平均每日ARPU",key:"avg_arpu",unit:"元"}],[{label:"AVG：",name:"平均每日ARPPU",key:"avg_arppu",unit:"元"}]],[],[[{label:"AVG：",name:"平均每活跃玩家每日游戏",key:"avg_login_times",unit:"次,"},{label:"",name:"共",key:"sum_online_minutes",unit:"mins"}],[{label:"AVG：",name:"平均每活跃玩家每日游戏",key:"avg_login_times",unit:"次,"},{label:"",name:"共",key:"sum_online_minutes",unit:"mins"}]]],_port:[[[{name:"日付费率",key:"y_axis_pay_rate"}],[{name:"日ARPU",key:"y_axis_arpu"}],[{name:"日ARPPU",key:"y_axis_arppu"}]],[[{name:"新增玩家次日留存率",key:"y_axis_retention_rate_1d"},{name:"新增玩家7日留存率",key:"y_axis_retention_rate_7d"},{name:"新增玩家30日留存率",key:"y_axis_retention_rate_30d"}]],[[{name:"平均游戏次数",key:"y_axis_avg_login_times"}],[{name:"平均游戏时长",key:"y_axis_avg_online_minutes"}]]],_domInit:function(){M_Inside._htmlChartTable($("#ct_main_area"),F_Keypoint_Info._init),F_Keypoint_Info._getInfo(),M_Inside._downloadCsv()},_getInfo:function(){for(var e=M_Init._dateCache.begin,n=M_Init._dateCache.end,t=[],_=0;_<F_Keypoint_Info._init.length;_++)t.push("bs_chart_"+_+"_0");var a={};a.start_date=e,a.end_date=n,a.game_id=M_Init._gameId,a=B_Common._postData(a),B_Port._ajax(M_Init._api.innerOperationKpi,"get",!0,a,function(){for(var e=0;e<t.length;e++)$("#"+t[e]).html(B_Pre._loading())},function(){for(var e=0;e<t.length;e++)$("#"+t[e]).html("")},function(e,n){if(e){M_Init._dataCache.data=e;for(var t=0;t<F_Keypoint_Info._init.length;t++)if(F_Keypoint_Info._init[t].tab.length>0){M_Init._dataCache["position_"+t]||(M_Init._dataCache["position_"+t]=0);for(var _=0;_<F_Keypoint_Info._init[t].tab.length;_++)if(M_Init._dataCache["position_"+t]==_){F_Keypoint_Info._chartHtml(t,_),M_Inside._chartTableIcon(F_Keypoint_Info._init[t].type,t,_);break}M_Inside._tabChangePerChart(t,F_Keypoint_Info._init[t].type,"keypoint")}else F_Keypoint_Info._chartHtml(t,"0"),M_Inside._chartTableIcon(F_Keypoint_Info._init[t].type,t,"0")}},function(e,n,_){for(var a=0;a<t.length;a++)$("#"+t[a]).html(B_Pre._empty(n))})},_chartHtml:function(e,n){M_Init._dataCache["position_"+e]=n;var t=M_Init._dataCache.data,_={x_axis:t.x_axis,y_axis:[],xFormatDate:!0,yFormat:""},a="";switch(e+""){case"0":switch(n+""){case"0":_.yFormat="%",_.tooltip={num:1,unit:"%"},a="%";break;case"1":case"2":_.yFormat="元",_.tooltip={num:1,unit:"元"},a="元"}break;case"1":_.x_axis=t.x_axis_retention,_.yFormat="%",_.tooltip={num:3,unit:"%"},a="%";break;case"2":switch(n+""){case"0":_.yFormat="次",_.tooltip={num:1,unit:"次"},a="次";break;case"1":_.yFormat="mins",_.tooltip={num:1,unit:"mins"},a="mins"}}for(var i={head:["日期"],body:[]},o=0;o<F_Keypoint_Info._port[e][n].length;o++)if("%"!=a?i.head.push(F_Keypoint_Info._port[e][n][o].name+"("+a+")"):i.head.push(F_Keypoint_Info._port[e][n][o].name),t[F_Keypoint_Info._port[e][n][o].key]){for(var r=0;r<t[F_Keypoint_Info._port[e][n][o].key].length;r++)i.body[r]||(i.body[r]=[t.x_axis[r]]),"%"!=a?i.body[r].push(t[F_Keypoint_Info._port[e][n][o].key][r]):i.body[r].push(t[F_Keypoint_Info._port[e][n][o].key][r]+a);_.y_axis.push({name:F_Keypoint_Info._port[e][n][o].name,data:t[F_Keypoint_Info._port[e][n][o].key]})}if(F_Keypoint_Info._avg[e]&&F_Keypoint_Info._avg[e][n]){for(var p="",s=F_Keypoint_Info._avg[e][n],y=0;y<s.length;y++)s[y].label&&(p+="<span>"+s[y].label+"</span>"),p+="<span>"+s[y].name+"<b>",dataKey=s[y].key.split("|"),t[dataKey[0]]&&t[dataKey[0]]&&(p+=t[dataKey[0]]),p+=s[y].unit+"</b></span>";M_Inside._avgHtml(e+"_0",p)}i.name=M_Inside._tableName(F_Keypoint_Info._init,e,n,M_Init._dateCache.begin,M_Init._dateCache.end),n=0,M_Init._dataCache[e+"_"+n]=i,M_Inside_Chart._chartData(50,"bs_chart_"+e+"_"+n,_),M_Inside._tableHtml(1,e+"_"+n)}};