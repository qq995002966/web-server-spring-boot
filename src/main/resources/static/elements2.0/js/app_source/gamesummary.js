var F_GameSummary_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-1');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            M_Init._clean();
            var $_GET = B_Common._getUrl('query');
            if($_GET.g){
                M_Init._gameDetailId = $_GET.g;
                B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
            }else{
                if(gameId){
                    M_Init._gameDetailId = gameId;
                    B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
                }else{
                    if(!M_Init._gameDetailId){
                        M_Init._gameDetailId = M_Init._getGameId('outsideGameDetail');
                    }
                }
            }
            M_Game._checkGameVisitList('gameSummary');

            //M_Outside._searchPop();
        }
    }
}
var F_GameSummary_Info = {
    _chartClick:function (type,value) {
        var data = {};
        switch(type){
            case 'bs_emotion':
                switch(value.type){
                    case '正面反馈':
                        data.classifySentiment = 1;
                        break;
                    case '负面反馈':
                        data.classifySentiment = -1;
                        break;
                }
                data.dateBegin = value.date;
                data.dateEnd = value.date;
                M_Outside._redirectForum(data);
                break;
        }
    },
    _domInit:function () {
        var str = '';
        str += '<div class="blockpart  col-lg-8 col-md-12 col-sm-12 col-xs-12 widthLarge-b ">';
        str += '<h3>游戏简介</h3>';
        str += '<div class="boxshadow yuqing-search-result yu-my-game game-summary gs-heigh no-pointer">';
        str += '</div></div>';

        str += '<div class="blockpart col-lg-4 col-md-12 col-sm-12 col-xs-12 widthLarge-b">';
        str += '<h3>竞品推荐</h3>';
        str += '<div class="boxshadow yu-my-game game-summary-recommend gs-heigh">';
        str += '</div></div>';

        str += '<div class="blockpart col-lg-8 col-md-12 col-sm-12 col-xs-12 ">';
        str += '<h3>玩家情感概览</h3>';
        str += '<div class="boxshadow gs-height-a">';
        str += '<div class="tg-selected-drop tg-date-fl">';
        str += '<span>日期</span>';
        str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc1"></span><input id="db1" type="hidden" value=""><input id="de1" type="hidden" value=""></p></div>';
        str += '<div id="bs_emotion" style="width: 100%; height: 86%"></div>';
        str += '</div></div>';

        str += '<div class="blockpart  col-lg-4 col-md-12 col-sm-12 col-xs-12  ">';
        str += '<h3>舆情热力图</h3>';
        str += '<div class="boxshadow gs-height-a">';
        str += '<div id="bs_radar" style="width: 100%; height: 100%"></div>';
        str += '</div></div>';

        str += '<div class="blockpart tg-table-layout col-lg-12 col-md-12 col-sm-12 col-xs-12  ">';
        str += '<h3>榜单排名</h3>';
        str += '<div class="boxshadow tg-table-content gs-height-b">';
        str += '<ul class="tg-tab-change-block" id="bs_rank_tab">';
        str += '<li class="tg-tab-block-active">ThinkingGame舆情榜</li>';
        str += '</ul>';
        str += '<div id="bs_rank_select">';
        str += '<div class="tg-selected-drop tg-date-fl">';
        str += '<span>日期</span>';
        str += '<p class="tg-drop-text-part"><i class="tg-graph tg-triangle-gray-bottom"></i><span class="hot-area" id="dc2"></span><input id="db2" type="hidden" value=""><input id="de2" type="hidden" value=""></p></div>';
        str += '</div>';
        str += '<div id="bs_ranklist" style="width: 100%; height: 70%"></div>';
        str += '</div></div>';

        str += '<div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12 channel-infor b_none">';
        str += '<h3>渠道信息</h3>';
        str += '<div id="bs_channel">';
        str += '</div></div>';

        $('#ct_main_area').html(str);
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                M_Init._dateCache.begin = begin;
                M_Init._dateCache.end = end;
                F_GameSummary_Info._getEmotion();
            }
        });
        B_Date._chooseSection({'autoCommit':true,'todayValid':false},2,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
            if(begin != M_Init._dateCache.begin2 || M_Init._dateCache.end2 != end){
                M_Init._dateCache.begin2 = begin;
                M_Init._dateCache.end2 = end;
                F_GameSummary_Info._getRankProperty();
            }
        });

        B_Game._getCollect(function () {
            F_GameSummary_Info._getInfo();
        });
    },
    _getRankProperty:function () {
        if(typeof(M_Init._dataCache['rankTabSelect']) == 'undefined')M_Init._dataCache['rankTabSelect'] = 0;
        if(M_Game._gameInfo[3] == 'S' && !M_Init._dataCache['rankTabHased']){
            var dom = $('#bs_ranklist');
            var postData = {};
            postData['project_id'] = M_Init._gameDetailId;
            postData = B_Common._postData(postData);
            B_Port._ajax('appstoreClassify','get',true,postData,function(){
                    dom.html(B_Pre._loading());
                },function(){
                    dom.html('');
                },function(data,msg){
                    if(data.device_type_dim && data.device_type_dim.length > 0){
                        M_Init._dataCache['rankTabHased'] = true;
                        $('#bs_rank_tab').append('<li>AppStore排行榜</li>');
                        var item = [];
                        M_Init._dataCache['listType'] = data.list_type_dim[0];
                        for(var i=0;i<data.list_type_dim.length;i++){
                            item.push({id:data.list_type_dim[i],name:M_Game._appListType[data.list_type_dim[i]]});
                        }
                        $('#bs_rank_select').prepend(F_GameSummary_Info._htmlRankSelect('bs_rank_select_list','榜单',item));

                        item = [];
                        M_Init._dataCache['gameType'] = data.game_type_dim[0];
                        for(var i=0;i<data.game_type_dim.length;i++){
                            item.push({id:data.game_type_dim[i],name:M_Game._appGameType[data.game_type_dim[i]]});
                        }
                        $('#bs_rank_select').prepend(F_GameSummary_Info._htmlRankSelect('bs_rank_select_type','类型',item));

                        item = [];
                        M_Init._dataCache['deviceType'] = data.device_type_dim[0];
                        for(var i=0;i<data.device_type_dim.length;i++){
                            item.push({id:data.device_type_dim[i],name:M_Game._appPlatType[data.device_type_dim[i]]});
                        }
                        $('#bs_rank_select').prepend(F_GameSummary_Info._htmlRankSelect('bs_rank_select_plat','设备',item));

                        $('#bs_rank_tab li').each(function (index) {
                            $(this).click(function () {
                                if(!$(this).hasClass('tg-tab-block-active')){
                                    $(this).addClass('tg-tab-block-active').siblings().removeClass('tg-tab-block-active');
                                    switch(index+''){
                                        case '0':
                                            M_Init._dataCache['rankTabSelect'] = 0;
                                            $('.bs_rank_select_list').hide();
                                            $('.bs_rank_select_type').hide();
                                            $('.bs_rank_select_plat').hide();
                                            break;
                                        case '1':
                                            M_Init._dataCache['rankTabSelect'] = 1;
                                            $('.bs_rank_select_list').show();
                                            $('.bs_rank_select_type').show();
                                            $('.bs_rank_select_plat').show();
                                            break;
                                    }
                                    F_GameSummary_Info._getRankList();
                                }
                            });
                        });
                        M_Inside._dropShow();
                        M_Inside._dropLeave();
                        M_Inside._dropSelected(function (key) {
                            M_Init._dataCache['listType'] = key;
                            F_GameSummary_Info._getRankList();
                        },'bs_rank_select_list');

                        M_Inside._dropSelected(function (key) {
                            M_Init._dataCache['gameType'] = key;
                            F_GameSummary_Info._getRankList();
                        },'bs_rank_select_type');

                        M_Inside._dropSelected(function (key) {
                            M_Init._dataCache['deviceType'] = key;
                            F_GameSummary_Info._getRankList();
                        },'bs_rank_select_plat');

                        F_GameSummary_Info._getRankList();
                    }else{
                        F_GameSummary_Info._getRankList();
                    }
                },function(data,msg,code){
                    dom.html(B_Pre._empty(msg));
                }
            )
        }else{
            F_GameSummary_Info._getRankList();
        }
    },
    _htmlRankSelect:function (domId,name,data) {
        var str = '<div class="tg-selected-drop tg-date-fl '+domId+'" style="display: none">';
        str += '<span>'+name+'</span>';
        str += '<div class="tg-selected-drop"><p class="tg-drop-text-part">';
        str += '<i class="tg-graph tg-triangle-gray-bottom"></i><span id="tabSelect" data-i="'+data[0].id+'">'+data[0].name+'</span>';
        str += '</p>';
        str += '<ul style="display: none;">';
        for(var i=0;i<data.length;i++){
            str += '<li><a data-i="'+data[i].id+'">'+data[i].name+'</a></li>';
        }
        str += '</ul></div></div>';
        return str;
    },
    _getRankList:function () {
        var dom = $('#bs_ranklist');
        M_Init._dataCache['project'] = M_Init._dataCache['app'] = [];

        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData['app_type'] = (M_Init._dataCache['gameType'] ? M_Init._dataCache['gameType'] : 0);
        postData['list_type'] = (M_Init._dataCache['listType'] ? M_Init._dataCache['listType'] : 0);
        postData['device_type'] = (M_Init._dataCache['deviceType'] ? M_Init._dataCache['deviceType'] : 0);
        postData['start_date'] = M_Init._dateCache.begin2;
        postData['end_date'] = M_Init._dateCache.end2;
        postData = B_Common._postData(postData);

        B_Port._ajax('reputationIntroduceOpinion','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data){
                    M_Init._dataCache['project'] = (data.project_rank && data.project_rank.length > 0) ? data.project_rank : [];
                    M_Init._dataCache['app'] = (data.app_store && data.app_store.length > 0) ? data.app_store : [];

                    F_GameSummary_Info._chartRank();
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _chartRank:function () {
        var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true,yFormat:'',legendSelectMode:false,inverse:true,yMin:1,yMax: 0};
        var data = '';
        switch(M_Init._dataCache['rankTabSelect']+''){
            case '0':
                chartDataPre.y_axis.push({name:'舆情排行榜',data:[]});
                data = M_Init._dataCache['project'];
                break;
            case '1':
                chartDataPre.y_axis.push({name:'AppStore排行榜',data:[]});
                data = M_Init._dataCache['app'];
                break;
        }
        var yAxis = [];
        for(var i=0;i<data.length;i++){
            chartDataPre.x_axis.push(data[i].data_date);
            chartDataPre.yMax = (chartDataPre.yMax > parseInt(data[i].rank)) ? chartDataPre.yMax : parseInt(data[i].rank);
            yAxis.push(data[i].rank);
        }
        chartDataPre.yMax = (chartDataPre.yMax < 5) ? 5 : 0;
        chartDataPre.y_axis[0].data = yAxis;

        M_Outside_Chart._chartData('line','bs_ranklist',chartDataPre);
    },
    _getEmotion:function () {
        var dom = $('#bs_emotion');
        var postData = {};
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationIntroduceFeedback','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.length>0){
                    var chartDataPre = {x_axis:[],y_axis:[],xFormatDate:true,yFormat:'',legendSelectMode:true};
                    var pos = [];
                    var neg = [];
                    for(var i=0;i<data.length;i++){
                        chartDataPre.x_axis.push(data[i].data_date);
                        pos.push(data[i].positive_num);
                        neg.push(data[i].negative_num);
                    }
                    chartDataPre.y_axis.push({name:'正面反馈',data:pos});
                    chartDataPre.y_axis.push({name:'负面反馈',data:neg});
                    M_Outside_Chart._chartData('lineSum','bs_emotion',chartDataPre);

                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getInfo:function () {
        infoTimeOut = '';
        clearTimeout(infoTimeOut);
        infoTimeOut = setTimeout(function () {
            F_GameSummary_Info._getInfoPort();
        },300);
    },
    _getInfoPort:function(){
        var domInfo = $('.game-summary');
        var domCompete = $('.game-summary-recommend');
        var domRadar = $('#bs_radar');
        var domChannel = $('#bs_channel');
        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('reputationIntroduce','get',true,postData,function(){
                domInfo.html(B_Pre._loading());
                domCompete.html(B_Pre._loading());
                domRadar.html(B_Pre._loading());
                domChannel.html(B_Pre._loading());
            },function(){
                domInfo.html('');
                domCompete.html('');
                domRadar.html('');
                domChannel.html('');
            },function(data,msg){
                if(data.game_info){
                    domInfo.html(F_GameSummary_Info._htmlBase(data.game_info));
                    domCompete.html(F_GameSummary_Info._htmlCompete(data.competing_list));
                    if(data.channel_info && data.channel_info.length > 0) {
                        $('.channel-infor').show('');
                        domChannel.html(F_GameSummary_Info._htmlChannel(data.channel_info));
                    }else{
                        $('.channel-infor').remove();
                    }
                    if(data.radar_data){
                        F_GameSummary_Info._chartRadar(data.radar_data);
                    }
                    $('#bs_add_game').click(function () {
                        if(B_Game._checkCollect(M_Init._gameDetailId)){
                            B_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要取消添加【'+M_Game._gameInfo[1]+'】么？',btn:['确认','取消'],title:'操作提示'},function(){
                                B_Pop._init('close');
                                B_Game._setCollect(M_Init._gameDetailId,'bs_add_game',{'on':['tg-assist-btn','取消添加'],'off':['tg-main-btn','添加游戏']});
                            },function(){
                                B_Pop._init('close');
                            });
                        }else{
                            B_Game._setCollect(M_Init._gameDetailId,'bs_add_game',{'on':['tg-assist-btn','取消添加'],'off':['tg-main-btn','添加游戏']});
                        }
                    });
                    $('#bs_atlas_game').click(function () {
                        M_Outside._redirectAtlas(M_Init._gameDetailId);
                    });

                    $('#bs_base_redirect li').each(function (index) {
                        $(this).click(function () {
                            switch(index+''){
                                case '0':
                                    var rank = $(this).attr('data-i');
                                    rank = parseInt(rank);
                                    rank = Math.ceil(rank/B_Page._size);
                                    B_Jump._go('base',B_Jump._getUrl('outsideRankSentiment')+'p='+rank+'&t='+B_Common._encodeUrl(M_Game._gameInfo[5]));
                                    break;
                                case '1':
                                    M_Outside._redirectForum({'gameId':M_Init._gameDetailId});
                                    break;
                                case '2':
                                    M_Outside._redirectForum({'gameId':M_Init._gameDetailId,'classifySentiment':1});
                                    break;
                                case '3':
                                    M_Outside._redirectForum({'gameId':M_Init._gameDetailId,'classifySentiment':-1});
                                    break;
                                case '4':
                                    M_Outside._redirectComments({'gameId':M_Init._gameDetailId});
                                    break;
                                case '5':
                                    M_Outside._redirectComments({'gameId':M_Init._gameDetailId,'ratingStageList':1});
                                    break;
                                case '6':
                                    M_Outside._redirectComments({'gameId':M_Init._gameDetailId,'ratingStageList':-1});
                                    break;
                            }
                        });
                    });
                }
            },function(data,msg,code){
                domInfo.html(B_Pre._empty(msg));
                domCompete.html(B_Pre._empty(msg));
                domRadar.html(B_Pre._empty(msg));
                domChannel.html(B_Pre._empty(msg));
            }
        )
    },
    _chartRadar:function (data) {
        var radarConfig = {'正向反馈占比':'negative_weight','讨论热度':'post_weight','舆论稳定度':'stable_weight','有效反馈占比':'useless_weight','活跃人数':'user_weight','畅销排名':'appstore_weight'};
        //var chartDataPre = {indicator:[],data:{'当前游戏':[],'行业平均':[]},legendSelectMode:true,'color':['#3daae3','#2ed383']};
        var chartDataPre = {indicator:[],data:{'当前游戏':[]},legendSelectMode:true,'color':['#3daae3','#2ed383']};
        $.each(radarConfig,function(key,value){
            if(key == '畅销排名'){
                if(data.avg[value]){
                    chartDataPre.indicator.push({text: key, max: 100});
                    //chartDataPre.data['行业平均'].push((data.avg[value] ? ((data.avg[value]*100).toFixed(0)) : 0));
                    chartDataPre.data['当前游戏'].push((data.real[value] ? ((data.real[value]*100).toFixed(0)) : 0));
                }
            }else{
                chartDataPre.indicator.push({text: key, max: 100});
                //chartDataPre.data['行业平均'].push((data.avg[value] ? ((data.avg[value]*100).toFixed(0)) : 0));
                chartDataPre.data['当前游戏'].push((data.real[value] ? ((data.real[value]*100).toFixed(0)) : 0));
            }
        });
        if(chartDataPre.indicator && chartDataPre.indicator.length > 0){
            if($('#bs_radar').length > 0){
                M_Outside_Chart._chartData('radar','bs_radar',chartDataPre);
            }
        }
    },
    _searchChannel:function (channeId) {
        M_Outside._redirectComments({'gameId':M_Init._gameDetailId,'channelId':channeId});
    },
    _htmlChannel:function (data) {
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<div class="boxshadow"><img src="'+B_Game._imgSourceUrl(data[i].source_type,'small')+'">';
            str += '<ul class="channel-card-list">';
            str += '<li><span>评分</span>';
            str += '<span>'+data[i].rating_value+'</span>';
            str += '</li>';
            str += '<li><span>评价量</span>';
            str += '<span><a onclick="F_GameSummary_Info._searchChannel(\''+data[i].source_type+'\')">'+data[i].rating_count+'</a></span>';
            str += '</li>';
            str += '<li><span>版本号</span>';
            str += '<span>'+data[i].version+'</span>';
            str += '</li>';
            str += '<li><span>下载量</span>';
            str += '<span>'+data[i].download_num+'</span>';
            str += '</li>';
            str += '<li><span>更新时间</span>';
            str += '<span>'+data[i].update_date+'</span>';
            str += '</li>';
            str += '</ul></div>';
        }
        return str;
    },
    _htmlCompete:function (data) {
        var str = '';
        var gameId = [];
        if(data && data.length>0){
            for(var i=0;i<data.length;i++){
                gameId.push(data[i].project_id);
            }
            str += '<ul class="game-list">';
            var compete = B_Game._getGame(gameId,5);
            for(var i=0;i<data.length;i++){
                if(compete[data[i].project_id]){
                    str += '<li><div class="fl">';
                    str += '<img src="'+compete[data[i].project_id][0]+'" alt="'+compete[data[i].project_id][1]+'" onclick="M_Outside._redirectLight('+data[i].project_id+')"><p onclick="M_Outside._redirectLight('+data[i].project_id+')">'+compete[data[i].project_id][1]+'</p>';
                    str += '<ul class="tg-tab-btn">';
                    if(data[i].project_tags){
                        var tag = B_Game._tag(data[i].project_tags);
                        for(var d=0;d<data[i].project_tags.length;d++){
                            if(tag[data[i].project_tags[d]]){
                                str += '<li class="tg-tab-btn-normal" onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(tag[data[i].project_tags[d]])+'\');">'+tag[data[i].project_tags[d]]+'</li>';
                            }
                        }
                    }
                    str += '</div>';
                    str += '<ul class="fr"><li>';
                    str += '<span><b class="color-blue">'+data[i].tg_rank+'</b></span><p>舆情榜排名</p>';
                    str += '</li></ul>';
                    str += '</li>';
                }
            }
            str += '</ul>';
        }
        return str;
    },
    _htmlBase:function (data) {
        var str = '';
        str += '<ul class="game-list">';
        str += '<li><div class="fl">';
        str += '<img src="'+M_Game._gameInfo[0]+'" alt="'+M_Game._gameInfo[1]+'">';
        str += '<p>'+M_Game._gameInfo[1]+'</p>';
        str += '<span>游戏类型：'+M_Game._gameInfo[4]+'</span>';
        str += '<span>开发商：'+M_Game._gameInfo[2]+'</span>';
        str += '<span>发行商：'+data.distributor+'</span>';
        str += '<span>发行日期：'+data.release_date+'</span>';
        str += '<ul class="tg-tab-btn">';
        if(data.tag_list){
            var tag = B_Game._tag(data.tag_list);
            for(var i=0;i<data.tag_list.length;i++){
                if(tag[data.tag_list[i]]){
                    str += '<li class="tg-tab-btn-normal" onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(tag[data.tag_list[i]])+'\');">'+tag[data.tag_list[i]]+'</li>';
                }
            }
        }
        str += '</ul>';
        str += '<div class="operation-btn">';
        if(B_Game._checkCollect(M_Init._gameDetailId)){
            str += '<button class="tg-assist-btn" id="bs_add_game">取消添加</button>';
        }else{
            str += '<button class="tg-main-btn" id="bs_add_game">添加为关注</button>';
        }
        //str += '<button class="tg-assist-btn" id="bs_atlas_game">游戏图谱</button></div>';
        str += '</div>';
        str += '</div></li>';
        str += '<li><h5>基本信息</h5>';
        str += '<p>'+data.overview+'</p></li>';
        str += '<li>';
        str += ' <ul class="tg-tab-change-block" id="bs_base_redirect">';
        str += '<li data-i="'+data.hot_rank+'">';
        str += '<b class="color-1">'+data.hot_rank+'</b><p>ThinkingGame 舆情榜</p><span>较昨日  ';
        data.hot_rank = parseInt(data.hot_rank);
        data.hot_rank_yesterday = parseInt(data.hot_rank_yesterday);
        if(data.hot_rank > data.hot_rank_yesterday){
            str += '<b class="down">↓</b>'+(data.hot_rank_yesterday-data.hot_rank)+'名';
        }else if(data.hot_rank < data.hot_rank_yesterday){
            str += '<b class="up">↑</b>'+(data.hot_rank_yesterday-data.hot_rank)+'名';
        }else{
            str += '<b>→</b>';
        }
        str += '</span>';
        str += '</li>';
        str += '<li>';
        str += '<b class="color-2">'+data.title_num+'</b><p>近30天论坛帖子总量</p>';
        str += this._htmlArrow(data.title_num_growth);
        str += '</li>';
        str += '<li>';
        str += '<b class="color-3">'+data.positive_num+'</b><p>近30天论坛正面情感贴</p>';
        str += this._htmlArrow(data.positive_num_growth);
        str += '</li>';
        str += '<li>';
        str += '<b class="color-4">'+data.negative_num_num+'</b><p>近30天论坛负面情感贴</p>';
        str += this._htmlArrow(data.negative_num_growth);
        str += '</li>';
        if(M_Game._gameInfo[3] == 'S'){
            if(typeof(data.channel_total) != 'undefined'){
                str += '<li>';
                str += '<b class="color-5">'+data.channel_total+'</b><p>近30天渠道评价总览</p>';
                str += this._htmlArrow(data.channel_total_growth);
                str += '</li>';
            }
            if(typeof(data.channel_positive) != 'undefined') {
                str += '<li>';
                str += '<b class="color-6">'+data.channel_positive+'</b><p>近30天渠道正面评论</p>';
                str += this._htmlArrow(data.channel_positive_growth);
                str += '</li>';
            }
            if(typeof(data.channel_negative) != 'undefined') {
                str += '<li>';
                str += '<b class="color-7">'+data.channel_negative+'</b><p>近30天渠道负面评论</p>';
                str += this._htmlArrow(data.channel_negative_growth);
                str += '</li>';
            }
        }
        str += '</ul></li>';
        str += '</ul>';

        return str;
    },
    _htmlArrow:function (data) {
        var str = '<span>较前一周期';
        if(data > 0){
            str += '<b class="up">↑</b>'+data;
        }else if(data < 0){
            data = Math.abs(data);
            str += '<b class="up">↓</b>'+data;
        }else{
            str += '<b class="up">→</b>'+data;
        }
        str += '%</span>';

        return str;
    }
}