var F_Alarm_Entrance={_init:function(){if(B_Login._checkUpdate(),M_HeadFoot._headShow(2),M_Dom._menuList("舆情分析","3-1-1"),M_Game._htmlGameVisitHide("outsideAlarm"),B_User._isDemoUser())B_Login._openLogin("background");else{M_Init._clean();var t=B_Common._getUrl("query");t.g&&!isNaN(t.g)?(B_Game._setLast(t.g,"outsideAlarm"),M_Init._gameId=t.g,t.date&&t.sub_type&&t.main_type&&(M_Init._dataCache.date=B_Common._decodeUrl(t.date),M_Init._dataCache.sub_type=B_Common._decodeUrl(t.sub_type),M_Init._dataCache.main_type=B_Common._decodeUrl(t.main_type))):M_Init._gameId=M_Init._getGameId("outsideAlarm"),B_Game._dropChoose(M_Init._gameId,"#gameDropChoose",null,function(t){t+""!=M_Init._gameId+""&&(B_Game._setLast(t,"outsideAlarm"),M_Init._gameId=t,F_Alarm_Info._getMail(),F_Alarm_Info._getInfo())}),F_Alarm_Info._getMail(),F_Alarm_Info._getInfo(),$(".switch-btn span").click(function(){F_Alarm_Common._openAdd()})}}},F_Alarm_Info={_cache:{},_getFromChartClick:function(t,a){var e=$.inArray(a,F_Alarm_Common._init.type);if(e>-1){var _=F_Alarm_Common._init.typeId[e];if(M_Init._dataCache.chartData&&M_Init._dataCache.chartData[_]){for(var i=M_Init._dataCache.chartData[_],o={date:"",word:"",classify:"",level:0},n=0;n<i.length;n++)if(t==i[n].data_date){o.date=i[n].data_date,o.word=i[n].sub_type,o.level=i[n].warn_level>6?6:Math.ceil(i[n].warn_level),o.classify=a+"类问题";break}""!=o.date&&(M_ForumList._postData.type="suddenly",M_ForumList._postData.classify=o.classify,M_ForumList._postData.level=F_Alarm_Common._init.power[o.level],M_ForumList._postData.data={data_date:o.date,sub_type:o.word},M_ForumList._getList(1))}}},_getMail:function(){var t={};t.project_id=M_Init._gameId,t=B_Common._postData(t),B_Port._ajax("sigmaItWarnMailGet","get",!0,t,null,null,function(t,a){t&&t.task_name?F_Alarm_Info._cache.mailData=t:F_Alarm_Info._cache.mailData=""},null)},_getInfo:function(){var t={};t.project_id=M_Init._gameId,t=B_Common._postData(t),B_Port._ajax("sigmaItWarn","get",!0,t,function(){B_Pop._init("load",{type:1,time:60,shade:[.6,"#000000"]})},function(){B_Pop._init("close")},function(t,a){if(t&&t.develop){M_Init._dataCache.chartData=t;var e={xAxis:[],series:{},legend:[]},_={date:"",word:"",classify:"",level:0},i=1;$.each(t,function(t,a){var o="",n=$.inArray(t,F_Alarm_Common._init.typeId);n>-1&&(o=F_Alarm_Common._init.type[n]),e.legend.push(o),e.series[o]=[];for(var l=0;l<a.length;l++)a[l].warn_level>0&&(_.date=a[l].data_date,_.word=a[l].sub_type,_.level=a[l].warn_level>6?6:Math.ceil(a[l].warn_level),_.classify=o+"类问题"),1==i&&e.xAxis.push(a[l].data_date),a[l].warn_level>6&&(a[l].warn_level=6),e.series[o].push(a[l].warn_level);i++}),F_Alarm_Info._chartInfo(e),M_Init._dataCache.date&&""!=M_Init._dataCache.date&&(_={date:M_Init._dataCache.date,word:M_Init._dataCache.sub_type,classify:M_Init._dataCache.main_type+"类问题",level:0}),""==_.word?($("#lt_forum_list").html(B_Pre._empty("当前时间段该类问题舆情正常，无需警戒")),$("#lt_forum_detail").html("")):(M_ForumList._postData.type="suddenly",M_ForumList._postData.classify=_.classify,M_ForumList._postData.level=F_Alarm_Common._init.power[_.level],M_ForumList._postData.data={data_date:_.date,sub_type:_.word},M_ForumList._getList(1))}},function(t,a,e){B_Pop._init("msg",{content:a})})},_chartInfo:function(t){if(t&&t.xAxis){var a={series:[]};$.each(t.series,function(t,e){a.series.push({lineStyle:{normal:{width:2}},smooth:!0,symbol:"roundRect",symbolSize:8,name:t,type:"line",data:e})}),a.tooltip={trigger:"axis"},a.legend={itemGap:15,itemWidth:12,itemHeight:12,top:"bottom",align:"left",data:t.legend,textStyle:{fontSize:12}},a.grid={left:"2%",right:"2%",bottom:"8%",top:"5%",containLabel:!0},a.xAxis=[{splitLine:{show:!1},type:"category",data:t.xAxis,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{textStyle:{color:"#333333",fontSize:"11px"},formatter:function(t,a){return B_Date._hourChart(t)}}}],a.yAxis=[{splitLine:{lineStyle:{color:"#EEEEEE"}},name:null,type:"value",axisLine:{show:!1},axisTick:{show:!1},axisLabel:{textStyle:{color:"#333333",fontSize:"11px"},formatter:function(t,a){var e=a>0?6==a?"高危预警":F_Alarm_Common._init.power[a]:"";return e}},min:0,max:6}],B_Chart._getEChart("line","bs_suddenly_chart",a)}}},F_Alarm_Common={_init:{type:["开发","活动","版本"],typeId:["develop","activity","version"],power:["白色预警","灰色预警","蓝色预警","黄色预警","橙色预警","红色预警"]},_openAdd:function(){B_Pop._init("close"),B_Pop._init("open",{type:2,scroll:!0,title:"邮件设置",width:"740px",height:"395px",shift:2,content:"outsidealarm_s.html?g="+M_Init._gameId},"")}};