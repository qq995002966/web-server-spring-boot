var F_OperatePayLost_Entrance={_init:function(a){if(B_Login._checkUpdate(),M_HeadFoot._headShow(4),"demo"!=M_Init._controller&&B_User._isDemoUser())B_Login._openLogin("background");else{switch(M_Init._clean(),M_Init._controller){case"demo":M_Init._api.playerDistribution="demoPlayerDistribution",M_Init._api.playerDistributionClassify="demoPlayerDistributionClassify",M_Init._api.searchExcel="demoSearchExcel";break;default:M_Init._api.playerDistribution="playerDistribution",M_Init._api.playerDistributionClassify="playerDistributionClassify",M_Init._api.searchExcel="searchExcel"}switch(M_Init._dataCache.type=a,a){case"paid":M_Init._dataCache.classA="",M_Init._dataCache.classB="",M_Init._dataCache.classCenter="",M_Init._dataCache.classAN="#ed7a38",M_Init._dataCache.classBN="#e53c2e",M_Init._dataCache.classRateBg="",M_Init._dataCache.classFont="",M_Common._getOrderGame("operatePay","","8-5");break;case"lost":M_Init._dataCache.classA="shan-a-purple",M_Init._dataCache.classB="shan-b-purple",M_Init._dataCache.classAN="#584AA6",M_Init._dataCache.classBN="#826BA8",M_Init._dataCache.classCenter="center-circle-purple",M_Init._dataCache.classRateBg="rate-purple",M_Init._dataCache.classFont="infor-purple",M_Common._getOrderGame("operateLost","","8-6")}}}},F_OperatePayLost_Info={_configInit:{"大R玩家":{img:"dr"},"中R玩家":{img:"zr"},"小R玩家":{img:"xr"},"成长期流失玩家":{img:"czq"},"新手期流失玩家":{img:"xsq"},"中后期流失玩家":{img:"zhq"}},_getInfo:function(){var a=$("#ct_main_area"),t={};t.game_id=M_Init._gameId,t.user_type=M_Init._dataCache.type,t=B_Common._postData(t),B_Port._ajax(M_Init._api.playerDistributionClassify,"get",!0,t,function(){B_Pop._init("load",{type:1,time:60,shade:[.6,"#000000"]})},function(){B_Pop._init("close")},function(a,t){if(a&&a.length>0){var e=[];switch(M_Init._dataCache.type){case"paid":for(var i=0;i<a.length;i++)e.push({id:a[i].classify_name,name:a[i].classify_name+"(消费"+a[i].group_rank+")"});break;case"lost":for(var i=0;i<a.length;i++)e.push({id:a[i].classify_name,name:a[i].classify_name})}F_OperatePayLost_Info._formatClassify(e)}},function(t,e,i){a.html(B_Pre._empty(e))})},_formatClassify:function(a){M_Init._gameIdRight||(M_Init._gameIdRight=a[0].id);var t={};M_Init._dataCache.selectedName="";for(var e=0;e<a.length;e++)if(a[e].id==M_Init._gameIdRight){t=a[e],M_Init._dataCache.classifyName=a[e].id;break}$("#headerTop").html(M_Inside._dropHtml("bs_classify","选择分析对象:",t,a)),F_OperatePayLost_Info._getData(),M_Inside._dropShow("tg-selected-drop"),M_Inside._dropSelected(function(a,t){M_Init._gameIdRight=a,M_Init._dataCache.classifyName=a,M_Init._dataCache.detailName="",F_OperatePayLost_Info._getData()},"tg-selected-drop"),M_Inside._dropLeave("tg-selected-drop")},_getData:function(){var a=$("#ct_main_area"),t={};t.classify_name=M_Init._gameIdRight,t.game_id=M_Init._gameId,t.user_type=M_Init._dataCache.type,t=B_Common._postData(t),B_Port._ajax(M_Init._api.playerDistribution,"get",!0,t,function(){a.html(B_Pre._loading())},function(){a.html("")},function(t,e){t&&t.length>0?(a.html(F_OperatePayLost_Info._htmlBase()),M_Init._dataCache.data=t,F_OperatePayLost_Info._formatData()):(M_Init._dataCache.data="",a.html("暂无数据"))},function(t,e,i){a.html(B_Pre._empty(e))})},_formatData:function(){F_OperatePayLost_Info._htmlCircle(),F_OperatePayLost_Info._doCircle(),F_OperatePayLost_Info._htmlDetail(),$(".bs_circle_detail").each(function(){$(this).click(function(){switch(M_Init._dataCache.type){case"paid":$(this).hasClass("selected-red")||($(".bs_circle_detail").each(function(){$(this).removeClass("selected-red")}),$(this).addClass("selected-red"),M_Init._dataCache.detailName=$(this).attr("data-i"),F_OperatePayLost_Info._htmlDetail());break;case"lost":$(this).hasClass("selected-purple")||($(".bs_circle_detail").each(function(){$(this).removeClass("selected-purple")}),$(this).addClass("selected-purple"),M_Init._dataCache.detailName=$(this).attr("data-i"),F_OperatePayLost_Info._htmlDetail())}})})},_doCircle:function(){$("#circle-min1").circleProgress({startAngle:.5*-Math.PI,value:M_Init._dataCache.percentValue[1],size:172,emptyFill:"rgba(0, 0, 0, 0)",fill:{gradient:[M_Init._dataCache.classAN,M_Init._dataCache.classBN]}}),$("#circle-min2").circleProgress({startAngle:.5*-Math.PI,value:M_Init._dataCache.percentValue[2],size:158,emptyFill:"rgba(0, 0, 0, 0)",fill:{gradient:[M_Init._dataCache.classAN,M_Init._dataCache.classBN]}}),$("#circle-min3").circleProgress({startAngle:.5*-Math.PI,value:M_Init._dataCache.percentValue[3],size:142,emptyFill:"rgba(0, 0, 0, 0)",fill:{gradient:[M_Init._dataCache.classAN,M_Init._dataCache.classBN]}}),$("#circle-min4").circleProgress({startAngle:.5*-Math.PI,value:M_Init._dataCache.percentValue[4],size:115,emptyFill:"rgba(0, 0, 0, 0)",fill:{gradient:[M_Init._dataCache.classAN,M_Init._dataCache.classBN]}}),$("#circle-min5").circleProgress({startAngle:.5*-Math.PI,value:M_Init._dataCache.percentValue[5],size:158,emptyFill:"rgba(0, 0, 0, 0)",fill:{gradient:[M_Init._dataCache.classAN,M_Init._dataCache.classBN]}}),$("#circle-min6").circleProgress({startAngle:.5*-Math.PI,value:M_Init._dataCache.percentValue[6],size:140,emptyFill:"rgba(0, 0, 0, 0)",fill:{gradient:[M_Init._dataCache.classAN,M_Init._dataCache.classBN]}}),$("#circle-min7").circleProgress({startAngle:.5*-Math.PI,value:M_Init._dataCache.percentValue[7],size:105,emptyFill:"rgba(0, 0, 0, 0)",fill:{gradient:[M_Init._dataCache.classAN,M_Init._dataCache.classBN]}})},_htmlBase:function(){var a="";return a+='<div class=" blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12  paydis-graph-part paydis-content"><div class="wrap" id="Wrapp"></div></div>',a+='<div class=" blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12  paydis-content"><div class="paydis-infor-part boxshadow" id="bs_detail"></div></div>'},_htmlCircle:function(){var a=M_Init._dataCache.data,t="";M_Init._dataCache.imgUrl="",F_OperatePayLost_Info._configInit[M_Init._dataCache.classifyName]?M_Init._dataCache.imgUrl="elements2.0/img/operate/"+F_OperatePayLost_Info._configInit[M_Init._dataCache.classifyName].img:M_Init._dataCache.imgUrl="";var e="";switch(M_Init._dataCache.type){case"paid":e='<div class="shan-b '+M_Init._dataCache.classB+'"></div>';break;case"lost":}t+='            <div class="content-center">                <div class="center-circle '+M_Init._dataCache.classCenter+'">                    <img src="'+M_Init._dataCache.imgUrl+'_1.png">                    <p>'+M_Init._dataCache.classifyName+'</p>                </div>                <div class="shanxing1">                    <div class="shan-a '+M_Init._dataCache.classA+'"></div>                    '+e+'                </div>                <div class="shanxing2">                    <div class="shan-a '+M_Init._dataCache.classA+'"></div>                </div>            </div>';var i="",s="",_="";M_Init._dataCache.percentValue={};for(var n=0;n<a.length;n++){switch(n+""){case"0":_="1";break;case"1":_="5";break;case"2":_="2";break;case"3":_="6";break;case"4":_="3";break;case"5":_="7";break;case"6":_="4"}if(M_Init._dataCache.percentValue[_]=a[n].group_user_rate,i=(100*a[n].group_user_rate).toFixed(0),M_Init._dataCache.detailName||0!=n||(M_Init._dataCache.detailName=a[n].group_name),M_Init._dataCache.detailName==a[n].group_name)switch(M_Init._dataCache.type){case"paid":s="selected-red";break;case"lost":s="selected-purple"}else s="";t+='                <div class="content-wrap content'+_+'">                    <div class="bs_circle_detail content '+s+'" data-i="'+a[n].group_name+'">                        <div class="circle-white">                            <div class="wrap1">                                <h3 class="'+M_Init._dataCache.classFont+'">'+i+"%</h3>                                <p>"+a[n].group_name+"</p>                                <p>共"+a[n].group_user_num+'人</p>                            </div>                        </div>                        <div id="circle-min'+_+'"></div>                    </div>                </div>'}$("#Wrapp").html(t)},_htmlDetail:function(){var a=M_Init._dataCache.data,t="",e="",i="",s="";if(a)for(var _=0;_<a.length;_++)if(a[_].group_name==M_Init._dataCache.detailName){s=a[_];break}if(s){var n="",c="";switch(M_Init._dataCache.type){case"paid":M_Init._dataCache.columnElem="s_pay_",M_Init._dataCache.columnName="付费玩家分析",n=(100*s.user_rate).toFixed(0),c=(100*s.potential_user_rate).toFixed(0),e='<li>                                <img src="'+M_Init._dataCache.imgUrl+'_2.png">                                <div class="btn-union">                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(1)">详细属性</a>                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(1)">ID导出</a>                                </div>                            </li>                            <li>                                <h4>注重'+M_Init._dataCache.detailName+"的"+M_Init._dataCache.classifyName+"特点</h4>                                <span>"+s.user_info+"</span>                            </li>                            <li>                                <b>"+n+'%</b><span>消费意愿</span>                                <div class="rate-wrap">                                    <div class="rate" style="width: '+n+'%"></div>                                </div>                            </li>',i='<li>                                <img src="'+M_Init._dataCache.imgUrl+'_4.png">                                <div class="btn-union">                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(2)">详细属性</a>                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(2)">ID导出</a>                                </div>                            </li>                             <li>                                <h4>系统发现<b>'+s.group_user_num+"</b>人 注重"+M_Init._dataCache.detailName+"的<b>潜在"+M_Init._dataCache.classifyName+"</b></h4>                                <span>"+s.potential_user_info+"</span>                            </li>                            <li>                                <b>"+c+'%</b><span>消费意愿</span>                                <div class="rate-wrap">                                    <div class="rate" style="width: '+c+'%"></div>                                </div>                            </li>';break;case"lost":M_Init._dataCache.columnElem="s_lost_",M_Init._dataCache.columnName="流失玩家分析",$("#bs_detail").addClass("lostdis-infor-part"),e='<li>                                <img src="'+M_Init._dataCache.imgUrl+'_2.png">                                <div class="btn-union">                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(1)">详细属性</a>                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(1)">ID导出</a>                                </div>                            </li>                            <li>                                <h4>因'+M_Init._dataCache.detailName+"导致流失的"+M_Init._dataCache.classifyName+"</h4>                                <span>"+s.user_info+"</span>                            </li>",c=(100*s.potential_user_rate).toFixed(0),i='<li>                                <img src="'+M_Init._dataCache.imgUrl+'_4.png">                                <div class="btn-union">                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(2)">详细属性</a>                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(2)">ID导出</a>                                </div>                            </li>                            <li>                                <h4>系统发现<b>'+s.group_user_num+"</b>人 因"+M_Init._dataCache.detailName+" <b>存在流失风险</b>的"+M_Init._dataCache.classifyName.replace("流失","")+"</h4>                                <span>"+s.potential_user_info+'</span>                            </li>                            <li>                                <b class="'+M_Init._dataCache.classFont+'">'+c+'%</b><span>流失风险</span>                                <div class="rate-wrap">                                    <div class="rate rate-purple" style="width: '+c+'%"></div>                                </div>                            </li>'}for(var l="",r="",d="",_=0;_<s.sub_group.length;_++)s.sub_group[_].value&&(d="高于平均",d+=s.sub_group[_].value_rate?s.sub_group[_].value_rate.toFixed(0):"",d+="%",l+='<li>                        <h3 class="'+M_Init._dataCache.classFont+'">'+s.sub_group[_].value+"</h3>                        <p>"+s.sub_group[_].name+"</p>                        <span>"+d+"</span>                    </li>"),s.sub_group[_].potential&&(d="高于平均",d+=s.sub_group[_].potential_rate?s.sub_group[_].potential_rate.toFixed(0):"",d+="%",r+='<li>                    <h3 class="'+M_Init._dataCache.classFont+'">'+s.sub_group[_].potential+"</h3>                    <p>"+s.sub_group[_].name+"</p>                    <span>"+d+"</span>                </li>");t+='            <ul class="infor boxshadow">                '+e+'                <li>                    <ul class="list">                        '+l+'                    </ul>                </li>            </ul>            <ul class="infor ">                '+i+'                <li>                    <ul class="list">                        '+r+"                    </ul>                </li>            </ul>",$("#bs_detail").html(t)}},_redirect:function(a){var t=M_Init._dataCache.classifyName;switch(a+""){case"2":t="潜在"+t}var e=M_Init._gameId+"|"+M_Init._dataCache.type+"|"+t+"|"+M_Init._dataCache.detailName;e=B_Common._encodeUrl(e),B_Jump._go("base",B_Jump._getUrl("operatePlayer",{type:e}))},_download:function(a){var t=M_Init._dataCache.classifyName;switch(a+""){case"2":t="潜在"+t}var e=[];e.push("game_id="+M_Init._gameId),e.push(M_Init._dataCache.columnElem+"style="+B_Common._encodeUrl(t)),e.push(M_Init._dataCache.columnElem+"reason="+B_Common._encodeUrl(M_Init._dataCache.detailName)),e=e.join("&"),B_Jump._go("openUrl",B_Port._init(M_Init._api.searchExcel)+"?"+e+"&excel_name="+B_Common._encodeUrl(M_Init._dataCache.columnName))}};