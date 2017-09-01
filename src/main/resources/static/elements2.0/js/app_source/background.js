var M_Init = {
    _api:{},
    _controller:'',
    _gameId:0,
    _gameId2:0,
    _gameDetailId:0,
    _gameIdRight:0,
    _searchKeyword:'',
    _menuColumnAbnormal:{},
    _isUseKeywordReset:false,
    _menuCache:{},
    _menuInitCache:{},
    _menuAbnormalCache:{},
    _menuIsGetCache:[],
    _operateCondition:{},
    _operateFrom:'',
    _headMenuIsShow:false,
    _getGameId:function (section) {
        return B_Game._getLast(section);
    },
    _clean:function(){
        B_Page._size = 10;
        B_Chart._chartBarn = [];
        M_Init._searchKeyword = '';
        M_Init._gameId = 0;
        M_Init._gameIdRight = 0;
        M_Init._menuColumnAbnormal = {};
        M_Init._isUseKeywordReset = false;
        M_Init._dataCache = {};
        M_Init._dateCache = {
            'begin':'',
            'end':'',
            'begin2':'',
            'end2':'',
            'begin3':'',
            'end3':''
        };
    },
    _dataInnerGame:[],
    _dataCache:{},
    _dateCache:{
        'begin':'',
        'end':'',
        'begin2':'',
        'end2':'',
        'begin3':'',
        'end3':''
    },
    _dateChoose:{
        'begin': B_Date._getDiffDate(null,-30),
        'end': B_Date._getDiffDate(null,-1),
        'beginLimit':B_Date._getDiffUnixTime(null,-90)
    }
}
var M_Dom = {
    _trSelected:function(){
        $('.tg-table tr').on('click',function(){
              $('.tg-table tr').removeClass('tr-selected');
              $(this).addClass('tr-selected');
        });
    },
    _menuInit:function () {
        return {
            '智能分析Demo':{
                '运营通用指标': {
                    'd-1-1': ['考核数据', B_Jump._getUrl('insideDemo',{'type':'insideSummary'}), 'tg-side-icon-1'],
                    'd-1-2': ['玩家分析', B_Jump._getUrl('insideDemo',{'type':'insideAdditional'}), 'tg-side-icon-2'],
                    'd-1-3': ['留存分析', B_Jump._getUrl('insideDemo',{'type':'insideRetentioncount'}), 'tg-side-icon-2-1'],
                    'd-1-4': ['付费分析', B_Jump._getUrl('insideDemo',{'type':'insidePayData'}), 'tg-side-icon-2-2'],
                    'd-1-5': ['流失分析', B_Jump._getUrl('insideDemo',{'type':'insideLostAnalysis'}), 'tg-side-icon-2-3'],
                    'd-1-6': ['渠道分析', B_Jump._getUrl('insideDemo',{'type':'insideChannelQuality'}), 'tg-side-icon-2-4']
                },
                '产品定制指标': {
                    '0-2': ['关卡驻留分析', B_Jump._getUrl('insideDemo',{'type':'insidePersonality|0-2'}), 'movement-icon-1'],
                    '1-4': ['成长进度分析', B_Jump._getUrl('insideDemo',{'type':'insidePersonality|1-4'}), 'movement-icon-2'],
                    '2-7': ['核心玩法分析', B_Jump._getUrl('insideDemo',{'type':'insidePersonality|2-7'}), 'movement-icon-3'],
                    '3-12': ['虚拟消费分析', B_Jump._getUrl('insideDemo',{'type':'insidePersonality|3-12'}), 'movement-icon-4'],
                    '4-17': ['英雄分析', B_Jump._getUrl('insideDemo',{'type':'insidePersonality|4-17'}), 'movement-icon-5'],
                    '5-19': ['社交分析', B_Jump._getUrl('insideDemo',{'type':'insidePersonality|5-19'}), 'movement-icon-6']
                }
            },
            '玩家运营Demo':{
                /*
                '-': {
                    'd-8-1': ['玩家运营助手', B_Jump._getUrl('insideDemo',{'type':'operateHelper'}), 'tg-side-icon-3-1']
                },*/
                '玩家群体智能分析': {
                    'd-8-3': ['玩家智能聚类', B_Jump._getUrl('insideDemo',{'type':'operateBasic'}), 'tg-side-icon-3-2'],
                    'd-8-5': ['付费玩家分析', B_Jump._getUrl('insideDemo',{'type':'operatePay'}), 'tg-side-icon-3-5'],
                    'd-8-6': ['流失玩家分析', B_Jump._getUrl('insideDemo',{'type':'operateLost'}), 'tg-side-icon-3-6'],
                    'd-8-2': ['玩家属性分布', B_Jump._getUrl('insideDemo',{'type':'operatePlayer'}), 'tg-side-icon-3']
                   
                },
                '运营日常工具': {
                    'd-8-4': ['玩家行为日志搜索', B_Jump._getUrl('insideDemo',{'type':'operateLog'}), 'tg-side-icon-4']
                }
            },
            '玩家运营':{
                /*
                '-': {
                    '8-1': ['玩家运营助手', B_Jump._getUrl('operateHelper'), 'tg-side-icon-3-1']
                },*/
                '玩家群体智能分析': {
                    '8-3': ['玩家智能聚类', B_Jump._getUrl('operateBasic'), 'tg-side-icon-3-2'],
                    '8-5': ['付费玩家分析', B_Jump._getUrl('operatePay'), 'tg-side-icon-3-5'],
                    '8-6': ['流失玩家分析', B_Jump._getUrl('operateLost'), 'tg-side-icon-3-6'],
                    '8-2': ['玩家属性分布', B_Jump._getUrl('operatePlayer'), 'tg-side-icon-3']
                },
                '运营日常工具': {
                    '8-4': ['玩家行为日志搜索', B_Jump._getUrl('operateLog'), 'tg-side-icon-4']
                }
            },
            '智能分析':{
                '运营通用指标': {
                    '1-1': ['游戏概览', null, 'tg-side-icon-1', {
                        '1-1-1': ['考核数据', B_Jump._getUrl('insideSummary')],
                        '1-1-2': ['关键指标', B_Jump._getUrl('insideKeypoint')]
                    }],
                    '1-2': ['玩家分析', null, 'tg-side-icon-2', {
                        '1-2-1': ['新增玩家', B_Jump._getUrl('insideAdditional')],
                        '1-2-2': ['活跃玩家', B_Jump._getUrl('insideActivity')],
                        '1-2-3': ['留存玩家', B_Jump._getUrl('insideSave')],
                        '1-2-4': ['付费玩家', B_Jump._getUrl('insidePay')],
                        '1-2-5': ['流失玩家', B_Jump._getUrl('insideLost')],
                        '1-2-6': ['玩家习惯', B_Jump._getUrl('insideHabit')]
                    }],
                    '1-3': ['留存分析', B_Jump._getUrl('insideRetentioncount'), 'tg-side-icon-2-1'],
                    '1-4': ['付费分析', null, 'tg-side-icon-2-2', {
                        '1-4-1': ['付费数据', B_Jump._getUrl('insidePayData')],
                        '1-4-2': ['付费渗透', B_Jump._getUrl('insidePayOsmosis')],
                        '1-4-3': ['付费转化', B_Jump._getUrl('insidePayConversion')],
                        '1-4-4': ['付费习惯', B_Jump._getUrl('insidePayHabit')]
                    }],
                    '1-5': ['流失分析', null, 'tg-side-icon-2-3', {
                        '1-5-1': ['流失统计', B_Jump._getUrl('insideLostAnalysis')],
                        '1-5-2': ['流失漏斗', B_Jump._getUrl('insideLostFunnel')]
                    }],
                    '1-6': ['渠道分析', null, 'tg-side-icon-2-4', {
                        '1-6-1': ['质量指标分析', B_Jump._getUrl('insideChannelQuality')],
                        '1-6-2': ['收入指标分析', B_Jump._getUrl('insideChannelEarn')]
                    }]
                }
            },
            '舆情分析': {
                '游戏舆情监控': {
                    '3-3': ['舆情中心', B_Jump._getUrl('outsideCenter'), 'tg-side-icon-18'],
                    '3-4': ['排行榜', null, 'tg-side-icon-19', {
                        '3-4-1': ['舆情量排行榜', B_Jump._getUrl('outsideRankSentiment')],
                        '3-4-2': ['Appstore排行榜', B_Jump._getUrl('outsideRankApp')]
                    }]
                    //'3-5': ['游戏图谱', B_Jump._getUrl('outsideAtlas'), 'tg-side-icon-20']
                },
                '舆情分析工具':{
                    /*
                    '3-2': ['玩家画像', null, 'tg-side-icon-5', {
                        '3-2-1': ['人群概览', B_Jump._getUrl('outsideFaceSummary')],
                        '3-2-2': ['详细指标', B_Jump._getUrl('outsideFaceDetail')],
                        '3-2-3': ['人群对比', B_Jump._getUrl('outsideFaceCompare')]
                    }],
                    '3-1-2': ['热词追踪', B_Jump._getUrl('outsideHotWord'), 'tg-side-icon-6'],
                    */
                    '3-1-4': ['聊天记录分析', B_Jump._getUrl('outsideChat'), 'tg-side-icon-7'],
                    '3-1-3': ['自定义舆情监控', B_Jump._getUrl('outsideAssistant'), 'tg-side-icon-9'],
                    '3-1-1': ['突发问题预警任务管理', B_Jump._getUrl('outsideTask'), 'tg-side-icon-8']
                }
            },
            '专业服务': {
                '游戏战略咨询': {
                    '6-1_4': ['产品广告投放指南',B_Jump._getUrl('reportsItemHot'), 'tg-side-icon-13'],
                    '6-2_5': ['游戏立项深度分析报告', B_Jump._getUrl('reportsItemDeep'), 'tg-side-icon-14'],
                    '6-3_6': ['细分市场调研', B_Jump._getUrl('reportsItemRival'), 'tg-side-icon-15'],
                    '6-4_7': ['游戏行业分析报告', B_Jump._getUrl('reportsItemGuide'), 'tg-side-icon-16'],
                    '6-5_9': ['泛娱乐IP深度解读报告', B_Jump._getUrl('reportsItemIp'), 'tg-side-icon-3-3']
                },
                '产品调优咨询': {
                    '4-1_8': ['玩家群体构成和特征分析',B_Jump._getUrl('reportsItemClustering'), 'tg-side-icon-3-4'],
                    '4-1_1': ['玩家流失原因分析',B_Jump._getUrl('reportsItemLost'), 'tg-side-icon-10'],
                    '4-2_2': ['付费点优化方案', B_Jump._getUrl('reportsItemPay'), 'tg-side-icon-11'],
                    '5-1_3': ['系统数值合理性评估',B_Jump._getUrl('reportsItemRationality'), 'tg-side-icon-12']
                }
            },
            '游戏详情': {
                '游戏口碑分析': {
                    //'7-1': ['游戏简介',B_Jump._getUrl('gameSummary'), 'tg-side-icon-21'],
                    //'7-2': ['舆情解读', B_Jump._getUrl('gameSentiment'), 'tg-side-icon-22'],
                    //'7-3': ['论坛分析', B_Jump._getUrl('gameForum'), 'tg-side-icon-23'],
                    //'7-4': ['渠道分析', B_Jump._getUrl('gameChannel'), 'tg-side-icon-24'],
                    '7-7': ['论坛舆情分析',B_Jump._getUrl('gameLight'), 'tg-side-icon-21'],
                    '7-8': ['渠道舆情分析', B_Jump._getUrl('gameAnalysis'), 'tg-side-icon-23'],
                    '7-9': ['贴吧用户画像', B_Jump._getUrl('gameTieba'), 'tg-side-icon-5'],
                    /*
                    '7-9': ['贴吧用户画像', null, 'tg-side-icon-5', {
                        '7-9-1': ['人群概览', B_Jump._getUrl('gameFaceSummary')],
                        '7-9-2': ['详细指标', B_Jump._getUrl('gameFaceDetail')],
                        '7-9-3': ['人群对比', B_Jump._getUrl('gameFaceCompare')]
                    }],
                    */
                    '7-10': ['游戏舆情助手', B_Jump._getUrl('gameAssistant'), 'tg-side-icon-22']
                },
                '游戏舆情数据库': {
                    '7-5': ['论坛帖搜索', B_Jump._getUrl('gamePost'), 'tg-side-icon-25'],
                    '7-6': ['全渠道评论', B_Jump._getUrl('gameComment'), 'tg-side-icon-26']
                }
            }
        }
    },
    _menuDynamic:function (menuId,type) {
        if($.inArray(M_Init._gameId,M_Init._menuIsGetCache) > -1){
            if(M_Init._menuInitCache && M_Init._menuInitCache[M_Init._gameId]) {
                M_Dom._menuList('智能分析', menuId, M_Init._menuInitCache[M_Init._gameId],type);
            }
        }else{
            var postData = {};
            postData['game_id'] = M_Init._gameId;
            postData = B_Common._postData(postData);
            B_Port._ajax(M_Init._api['innerOperationMenu'],'get',true,postData,function () {
                    B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
                },function () {
                    B_Pop._init('close');
                },function(data,msg){
                    var menuInit = M_Dom._menuInit();
                    if(data.menu && data.menu.length>0){
                        menuInit['智能分析']['产品定制指标'] = {};
                        for(var i=0;i<data.menu.length;i++){
                            menuInit['智能分析']['产品定制指标']['10-'+i] = [data.menu[i].name,null,'movement-icon-'+data.menu[i].ico,{}];
                            if(data.menu[i].child && data.menu[i].child.length > 0){
                                for(var d=0;d<data.menu[i].child.length;d++){
                                    menuInit['智能分析']['产品定制指标']['10-'+i][3]['10-'+i+'-'+data.menu[i].child[d].id] = [data.menu[i].child[d].name, B_Jump._getUrl('insidePersonality',{type:i+'-'+data.menu[i].child[d].id})];
                                }
                            }else{
                                menuInit['智能分析']['产品定制指标']['10-'+i][1] = B_Jump._getUrl('insidePersonality',{type:i+'-'+data.menu[i].id});
                            }
                        }
                    }
                    M_Init._menuInitCache[M_Init._gameId] = menuInit;
                    M_Init._menuAbnormalCache[M_Init._gameId] = data.abnormal ? data.abnormal : {};
                    M_Init._menuIsGetCache.push(M_Init._gameId);
                    M_Dom._menuList('智能分析',menuId,menuInit,type);
                },function(data,msg,code){
                    B_Pop._init('open',{content:msg});
                }
            )
        }
    },
    _menuProcess:function (type) {
        switch(type){
            case 'overview':
                F_Overview_Info._getInfo();
                break;
            case 'operateDemo':
                F_Demo_Info._getInfo('operate');
                break;
            case 'demo':
                F_Demo_Info._getInfo('inside');
                break;
            case 'helper':
                F_Helper_Info._getInfo();
                break;
            case 'basic':
                F_Basic_Info._getInfo();
                break;
            case 'player':
                F_Player_Info._getInfo();
                break;
            case 'summary':
                F_Summary_Info._getInfo();
                break;
            case 'attribute':
                F_Attribute_Search._getSearchMeta();
                break;
            case 'log':
                F_Log_Tab._getTab();
                break;
            case 'operateLost':
            case 'operatePay':
                F_OperatePayLost_Info._getInfo();
                break;
            case 'keypoint':
                F_Keypoint_Info._domInit();
                break;
            case 'additional':
                F_Additional_Info._domInit();
                break;
            case 'activity':
                F_Activity_Info._domInit();
                break;
            case 'save':
                F_Save_Info._domInit();
                break;
            case 'pay':
                F_Pay_Info._domInit();
                break;
            case 'lost':
                F_Lost_Info._domInit();
                break;
            case 'habit':
                F_Habit_Info._domInit();
                break;
            case 'retentioncount':
                F_Retentioncount_Info._domInit();
                break;
            case 'paydata':
                F_PayData_Info._domInit();
                break;
            case 'payosmosis':
                F_PayOsmosis_Info._domInit();
                break;
            case 'payconversion':
                F_PayConversion_Info._domInit();
                break;
            case 'payhabit':
                F_PayHabit_Info._domInit();
                break;
            case 'lostanalysis':
                F_LostAnalysis_Info._domInit();
                break;
            case 'lostfunnel':
                F_LostFunnel_Info._domInit();
                break;
            case 'channelquality':
                F_ChannelQuality_Info._domInit();
                break;
            case 'channelearn':
                F_ChannelEarn_Info._domInit();
                break;
            case 'personality':
                F_Personality_Info._domInit();
                break;
        }
    },
    _menuList:function (key,selected,menuInit,type) {
        var hasNoSelect = true;
        var str = '';
        var menuCurrentName = '';
        var menuConfig = !!menuInit ? menuInit : M_Dom._menuInit();
        if(menuConfig[key]){
            switch(key){
                case '专业服务':
                    hasNoSelect = false;
                    str += '<ul class="nav nav-sidebar">';
                    str += '<li class="sort-title';
                    if(selected == '0'){
                        str += ' active';
                    }
                    str += '"><i class="tg-icon tg-side-icon tg-side-icon-17"></i><a href="'+B_Jump._getUrl('reportsGeneral')+'">全部服务</a></li>';
                    str += '</ul>';
                    break;
            }
            $.each(menuConfig[key],function (menuName,menuValue) {
                str += '<ul class="nav nav-sidebar">';
                str += (menuName != '-') ? '<li class="title">'+menuName+'</li>' : '';
                $.each(menuValue,function (sortId,sortValue) {
                    str += '<li';
                    if(sortValue[3]) {
                        str += ' data-i="'+sortId+'"';
                    }
                    str += ' class="sort-title';
                    if(sortId == selected){
                        str += ' active';
                        menuCurrentName = sortValue[0];
                        hasNoSelect = false;
                        M_Dom._columnAbnormalCache(sortValue[0],'-');
                    }
                    str += '"><i class="tg-icon tg-side-icon';
                    if(sortValue[2]){
                        str += ' '+sortValue[2];
                    }
                    str += '"></i>';
                    /*
                    if(M_Init._menuAbnormalCache[M_Init._gameId] && M_Init._menuAbnormalCache[M_Init._gameId][sortValue[0]]){
                        str += '<b class="remind-num">'+M_Init._menuAbnormalCache[M_Init._gameId][sortValue[0]].num+'</b>';
                    }
                    */
                    if(!!sortValue[1]){
                        str += '<a href="'+sortValue[1]+'">';
                    }else{
                        str += '<a href="javascript:void(0)">';
                    }
                    str += sortValue[0]+'</a>';
                    if(sortValue[3]){
                        var selectedParentOpen = selected.split('-');
                        selectedParentOpen = selectedParentOpen[0]+'-'+selectedParentOpen[1];
                        /*
                        if(M_Init._menuCache[sortValue[0]]){
                            if(M_Init._menuCache[sortValue[0]] == 'open'){
                                hasNoSelect = false;
                                str += '<i class="graph triangle-gray-right"></i>';
                            }else{
                                str += '<i class="graph triangle-gray-left"></i>';
                            }
                            str += '<i class="graph triangle-gray-left"></i>';
                        }else{
                            if(selectedParentOpen == sortId){
                                hasNoSelect = false;
                                M_Init._menuCache[sortValue[0]] = 'open';
                                str += '<i class="graph triangle-gray-right"></i>';
                            }else{
                                str += '<i class="graph triangle-gray-left"></i>';
                            }
                            /*
                            if(sortId == '1-1' || sortId == '3-2'){
                                str += '<i class="graph triangle-gray-right"></i>';
                            }else{
                                str += '<i class="graph triangle-gray-left"></i>';
                            }

                        }
                        */
                        if(selectedParentOpen == sortId){
                            hasNoSelect = false;
                            str += '<i class="graph triangle-gray-right"></i>';
                        }else{
                            str += '<i class="graph triangle-gray-left"></i>';
                        }
                    }
                    str += '</li>';
                    if(sortValue[3]){
                        str += '<ul id="menu_'+sortId+'" ';
                        /*
                        if(M_Init._menuCache[sortValue[0]]){
                            if(M_Init._menuCache[sortValue[0]] == 'open'){
                                str += ' class="side-shadow"';
                            }else{
                                str += ' class="side-shadow b_none"';
                            }
                            str += ' class="side-shadow b_none"';
                        }else{
                            if(selectedParentOpen == sortId){
                                str += ' class="side-shadow"';
                            }else{
                                str += ' class="side-shadow b_none"';
                            }
                            /*
                            if(sortId == '1-1' || sortId == '3-2'){
                                str += ' class="side-shadow"';
                            }else{
                                str += ' class="side-shadow b_none"';
                            }

                        }
                        */
                        if(selectedParentOpen == sortId){
                            str += ' class="side-shadow"';
                        }else{
                            str += ' class="side-shadow b_none"';
                        }

                        str += '>';
                        $.each(sortValue[3],function (itemId,itemValue) {
                            str += '<li';
                            if(itemId == selected){
                                str += ' class="active"';
                                menuCurrentName = itemValue[0];

                                M_Dom._columnAbnormalCache(sortValue[0],itemValue[0]);

                            }
                            str += '><a href="'+itemValue[1]+'">'+itemValue[0]+'</a>';
                            /*
                            if(M_Init._menuAbnormalCache[M_Init._gameId] && M_Init._menuAbnormalCache[M_Init._gameId][sortValue[0]] && M_Init._menuAbnormalCache[M_Init._gameId][sortValue[0]]['data'][itemValue[0]]){
                                str += '<b class="remind-num">'+M_Init._menuAbnormalCache[M_Init._gameId][sortValue[0]]['data'][itemValue[0]].num+'</b>';
                            }
                            */
                            str += '</li>';
                        });
                        str += '</ul>';
                    }
                })
                str += '</ul>';
            });
        }
        if(hasNoSelect){
            M_Common._menuUrlInit(key);
        }

        $('#menuNav').html(str);

        switch(key){
            case '专业服务':
            case '-':
                break;
            default:
                $('.sort-title').each(function (index) {
                    $(this).click(function () {
                        if($(this).find('.graph').length > 0){
                            var menuIndex = $(this).attr('data-i');
                            if($(this).find('.graph').hasClass('triangle-gray-left')){
                                $('#menuNav .graph').each(function () {
                                    $(this).removeClass('triangle-gray-right').addClass('triangle-gray-left');
                                });
                                $('#menuNav ul ul').each(function () {
                                    $(this).hide();
                                });
                                //M_Init._menuCache[$(this).find('a').html()] = 'open';
                                $(this).find('.graph').removeClass('triangle-gray-left').addClass('triangle-gray-right');
                                $('#menu_'+menuIndex).fadeIn();
                            }else{
                                //M_Init._menuCache[$(this).find('a').html()] = 'close';
                                $(this).find('.graph').removeClass('triangle-gray-right').addClass('triangle-gray-left');
                                $('#menu_'+menuIndex).fadeOut();
                            }
                        }
                    })
                });
                break;
        }

        M_Dom._menuProcess(type);

        return menuCurrentName;
    },
    _columnAbnormalCache:function (parent,child) {
        if(M_Init._menuAbnormalCache[M_Init._gameId] && M_Init._menuAbnormalCache[M_Init._gameId][parent] && M_Init._menuAbnormalCache[M_Init._gameId][parent]['data'][child])M_Init._menuColumnAbnormal = M_Init._menuAbnormalCache[M_Init._gameId][parent]['data'][child].data;
    }
};
var M_HeadFoot = {
    _animateOffset:{'offsetLeft':0,'originLeft':0,'originWidth':0,'FLY_DELAY':1000},
    _animateToLeft:function () {
        $('#topNav .control-icon').addClass('pack-up');
        $('#topNav .top-tab-change').removeClass('bg-hover-effect');
        $('#topNav .text-logo').removeClass('default-text-logo zoomLogo').addClass('scaleLogo');
        var navItemBox = $('#topNav .top-tab-selected span');
        if (navItemBox.hasClass('left-nav-item')) {
            return false;
        }
        var navItem = $('#topNav .top-tab-change li');
        // logo 大脑消失
        $('#topNav .test-logo .pic-logo').fadeOut(M_HeadFoot._animateOffset['FLY_DELAY']/2);
        // 整体位移
        navItemBox.addClass('left-nav-item').css({
                position: 'fixed',
                left: M_HeadFoot._animateOffset['offsetLeft'],
                width: 50
            }).animate({
                left: 10
            }, M_HeadFoot._animateOffset['FLY_DELAY'], function() {
                if($('#topGame').length > 0 && $('#topGame #chrome-tabs-demo').length > 0 && $('#topGame #chrome-tabs-demo ul').html() != ''){
                    $('#topGame').fadeIn(M_HeadFoot._animateOffset['FLY_DELAY']);
                }else{
                    $('#headerTop').fadeIn(M_HeadFoot._animateOffset['FLY_DELAY']);
                }
                $('#topNav .control-block').attr('disabled',false);
        });
        // 去除和添加向左位移后的样式
        navItem.removeClass('top-tab-selected');
        navItem.removeClass('left-nav-item');
        navItemBox.parent('li').addClass('top-tab-selected').addClass('flyleft');
    },
    _animateToRight:function () {
        $('#topNav .control-icon').removeClass('pack-up');
        $('#topNav .text-logo').removeClass('default-text-logo');
        $('#topNav .text-logo').removeClass('scaleLogo').addClass('zoomLogo');
        var leftNavItem = $('#topNav .left-nav-item');
        var navItem = $('#topNav .top-tab-change li');
        $('#topNav .top-tab-change').addClass('bg-hover-effect');
        $('#topNav .test-logo .pic-logo').fadeIn(1000);
        leftNavItem.animate({left: M_HeadFoot._animateOffset['originLeft']}, 1000, function() {
            leftNavItem.css({
                    position: 'static',
                    width: M_HeadFoot._animateOffset['originLeft'],
                    left: M_HeadFoot._animateOffset['originWidth']
                }).removeClass('left-nav-item');
            $('#topNav .control-block').attr('disabled',false);
        });
        navItem.removeClass('flyleft');
    },
    _headFlyBase:function (index) {
        $('#topNav .control-block').attr('disabled',true);
        if(index+'' == '2'){
            M_Game._doHeadFly('left');
        }else{
            M_HeadFoot._animateToLeft();
        }
    },
    _headShow:function (index) {
        M_Init._controller = B_Common._getUrl('controller');
        $('#topNav').html(this._htmlHead(index));
        if(index > 0 && index < 10000){
            if(M_Init._headMenuIsShow){
                $('#topNav .control-block i').addClass('pack-up')
                $('#topNav .text-logo').removeClass('zoomLogo').addClass('default-text-logo');
                $('#topNav .text-logo').removeClass('scaleLogo');
            }else{
                if(index+'' != '2')$('#headerTop').removeClass('default-flytest-ht');
            }
            var navSelected = $('#topNav .top-tab-change .top-tab-selected');
            try{
                M_HeadFoot._animateOffset['offsetLeft'] = navSelected.offset().left;
                M_HeadFoot._animateOffset['originLeft'] = M_HeadFoot._animateOffset['offsetLeft'];
                M_HeadFoot._animateOffset['originWidth'] = navSelected.width();
            }catch(e){
                M_HeadFoot._animateOffset['offsetLeft'] = 0;
                M_HeadFoot._animateOffset['originLeft'] = M_HeadFoot._animateOffset['offsetLeft'];
                M_HeadFoot._animateOffset['originWidth'] = 0;
            }
        }

        $('#topNav .control-block').click(function(){
            $(this).attr('disabled',true);
            if($(this).find('i').hasClass('pack-up')){
                if(index+'' != '2'){
                    $('#headerTop').removeClass('default-flytest-ht');
                }
                M_HeadFoot._animateToRight();
                $('#topNav .top-tab-change li').removeClass('default-other');
                $('#topNav .test-logo .text-logo').removeClass('scaleLogo').addClass('zoomLogo');
                setTimeout(function(){
                    $('#topNav .test-logo .text-logo').fadeIn();
                },M_HeadFoot._animateOffset['FLY_DELAY']-200);

                if($('#topGame').length > 0 && !($('#topGame').is(":hidden"))){
                    $('#topGame').fadeOut();
                }else{
                    $('#headerTop').fadeOut();
                }
            }else{
                M_HeadFoot._headFlyBase(index);
            }
        });
        //$('#footNav').html(this._htmlFoot());
        $('#topNav .top-tab-change li').each(function (idNumber) {
            if(idNumber != 0 && $(this).hasClass('top-tab-selected') && !M_Init._headMenuIsShow){
                if(index+'' != '2'){
                    M_Init._headMenuIsShow = true;
                    setTimeout(function(){
                        M_HeadFoot._headFlyBase(index);
                    },800);
                }
            }
            $(this).click(function () {
                if($(this).hasClass('top-tab-selected')){
                    M_HeadFoot._headFlyBase(index);
                }else{
                    switch(idNumber+''){
                        case '0':
                            B_Jump._go('target','main');
                            break;
                        case '1':
                            B_Jump._go('target','operateBasic');
                            break;
                        case '2':
                            B_Jump._go('target','insideSummary');
                            break;
                        case '3':
                            B_Jump._go('target','outsideCenter');
                            break;
                        case '4':
                            B_Jump._go('target','reportsGeneral');
                            break;
                    }
                }
            });
        });
        switch(M_Init._controller){
            case 'demo':
                M_Init._dataInnerGame = [{'game_name': "demo", 'project_id': 952, 'game_id': 0}];
                if(B_User._isDemoUser()){
                    $("#topNav .user-list").html('<p class="no-cursor">guest</p>');
                }else{
                    M_HeadFoot._headClick();
                }
                M_Init._api = {'innerOperationMenu':'demoInnerOperationMenu'};
                break;
            default:
                M_Init._api = {'innerOperationMenu':'innerOperationMenu'};
                M_HeadFoot._headClick();
                break;
        }
    },
    _headClick:function () {
        B_Format._arrowOpenClose("#topNav .user-list p","#topNav .user-list ul");
        B_Format._arrowOpenClose("#topNav .user-list i","#topNav .user-list ul");
        $('#topNav .user-list ul li').each(function(index){
            $(this).click(function(){
                switch(index){
                    case 0:
                        B_Jump._go('target','member');
                        break;
                    case 1:
                        B_Login._out(B_Jump._getUrl('index'));
                        break;
                }
            });
        });
    },
    _htmlHead:function (index) {
        var menuSelected = ['','','','',''];
        var str = '';
        var nickName = B_User._getNick('head');
        var userStr= '';
        userStr += '<div class="user-list"><p>'+nickName+'</p>';
        if(nickName != 'demo'){
            userStr += '<i class="tg-graph tg-triangle-white-bottom"></i><ul class="user-drop-list boxshadow b_none"><li>个人中心</li><li>退出登录</li></ul>';
        }
        userStr += '</div>';
        switch (index+''){
            case '0':
            case '10000':
                menuSelected[index] = ' class="top-tab-selected"';
                str += '\
                    <div class="topbar-logo">\
                        <a href="'+B_Jump._getUrl('index')+'"><i class="tg-logo tg-white-logo"></i></a>\
                    </div>\
                    <ul class="top-tab-change bg-hover-effect">\
                        <li'+menuSelected[0]+'><i class="tg-icon tg-top-icon tg-top-icon-1"></i><b>控制台</b></li>\
                        <li'+menuSelected[4]+'><i class="tg-icon tg-top-icon tg-top-icon-5"></i><b>智能分析</b></li>\
                        <li'+menuSelected[1]+'><i class="tg-icon tg-top-icon tg-top-icon-2"></i><b>运营指标</b></li>\
                        <li'+menuSelected[2]+'><i class="tg-icon tg-top-icon tg-top-icon-3"></i><b>舆情雷达</b></li>\
                        <li'+menuSelected[3]+'><i class="tg-icon tg-top-icon tg-top-icon-4"></i><b>专业服务</b></li>\
                    </ul>';
                break;
            default:
                var bloackSelected = ['','','','',''];
                if(M_Init._headMenuIsShow){
                    bloackSelected[index] = ' class="default-left-item left-nav-item"';
                    menuSelected = ['default-other','default-other','default-other','default-other','default-other'];
                    menuSelected[index] = 'top-tab-selected flyleft';
                    str = '\
                    <div class="test-logo">\
                        <a href="'+B_Jump._getUrl('index')+'">\
                            <img class="pic-logo" src="elements2.0/img/pic.png" style="display: none;">\
                            <img class="text-logo" src="elements2.0/img/text.png">\
                        </a>\
                        <button class="control-block" style="display: inline;"><i class="control-icon"></i></button>\
                    </div>\
                    <ul class="top-tab-change bg-hover-effect">\
                        <li class="'+menuSelected[0]+'"><span'+bloackSelected[0]+'><i class="tg-icon tg-top-icon tg-top-icon-1"></i><b>控制台</b></span></li>\
                        <li class="'+menuSelected[4]+'"><span'+bloackSelected[4]+'><i class="tg-icon tg-top-icon tg-top-icon-5"></i><b>智能分析</b></span></li>\
                        <li class="'+menuSelected[1]+'"><span'+bloackSelected[1]+'><i class="tg-icon tg-top-icon tg-top-icon-2"></i><b>运营指标</b></span></li>\
                        <li class="'+menuSelected[2]+'"><span'+bloackSelected[2]+'><i class="tg-icon tg-top-icon tg-top-icon-3"></i><b>舆情雷达</b></span></li>\
                        <li class="'+menuSelected[3]+'"><span'+bloackSelected[3]+'><i class="tg-icon tg-top-icon tg-top-icon-4"></i><b>专业服务</b></span></li>\
                    </ul>';
                }else{
                    bloackSelected[index] = '';
                    menuSelected[index] = 'top-tab-selected';
                    str = '\
                    <div class="test-logo">\
                        <a href="'+B_Jump._getUrl('index')+'">\
                            <img class="pic-logo" src="elements2.0/img/pic.png" style="display: none;">\
                            <img class="text-logo" src="elements2.0/img/text.png">\
                        </a>\
                        <button class="control-block"><i class="control-icon"></i></button>\
                    </div>\
                    <ul class="top-tab-change bg-hover-effect">\
                        <li class="'+menuSelected[0]+'"><span'+bloackSelected[0]+'><i class="tg-icon tg-top-icon tg-top-icon-1"></i><b>控制台</b></span></li>\
                        <li class="'+menuSelected[4]+'"><span'+bloackSelected[4]+'><i class="tg-icon tg-top-icon tg-top-icon-5"></i><b>智能分析</b></span></li>\
                        <li class="'+menuSelected[1]+'"><span'+bloackSelected[1]+'><i class="tg-icon tg-top-icon tg-top-icon-2"></i><b>运营指标</b></span></li>\
                        <li class="'+menuSelected[2]+'"><span'+bloackSelected[2]+'><i class="tg-icon tg-top-icon tg-top-icon-3"></i><b>舆情雷达</b></span></li>\
                        <li class="'+menuSelected[3]+'"><span'+bloackSelected[3]+'><i class="tg-icon tg-top-icon tg-top-icon-4"></i><b>专业服务</b></span></li>\
                    </ul>';
                }
                break;
        }

        return str+userStr;
    },
    _htmlFoot:function () {
        var str = '\
            <div class="footer-bottom">\
                <i class="tg-logo tg-blue-logo"></i>\
                <p>客服邮箱：service@thinkingdata.cn</p>\
                <span>联系地址：上海市长宁区中山西路999号</span>\
                <span class="fr">2015-2017 THINKINGGAME.CN 版权所有&nbsp;&nbsp;<a href="http://www.miitbeian.gov.cn/" target="_blank">沪ICP备 15030552号</a></span>\
            </div>'

        return str;
    }
}
var M_AppCommentList = {
    _buff:{},
    _postData:{type:'',data:''},
    _keywords:'',
    _focusKeywords:function(data){
        var back = data;
        if(M_AppCommentList._keywords != ''){
            var keywords = M_AppCommentList._keywords;
            keywords = keywords.toLowerCase();
            keywords = keywords.split(',');
            var index = $.inArray('ss',keywords);
            if(index > -1){
                back = B_Common._focusKeywords('ss',back);
                keywords.splice(index,1);
            }
            for(var i=0;i<keywords.length;i++){
                back = B_Common._focusKeywords(keywords[i],back);
            }
        }
        return back;
    },
    _pageRequest:function(page){
        var total = $('#lt_forum_page button').attr('data-a');
        if(page > 0 && parseInt(page)<=parseInt(total)){
            M_AppCommentList._getList(page);
        }
    },
    _conditionList:function(page){
        var postData = {};
        var index = (page-1)*B_Page._size;
        switch(M_AppCommentList._postData.type){
            case 'comment':
                if(M_AppCommentList._postData.data.source_type_list){
                    postData['source_type_list'] = M_AppCommentList._postData.data.source_type_list;
                }
                if(M_AppCommentList._postData.data.rating_stage_list){
                    postData['rating_stage_list'] = M_AppCommentList._postData.data.rating_stage_list;
                }
                if(M_AppCommentList._postData.data.es_field_name){
                    postData['es_field_name'] = M_AppCommentList._postData.data.es_field_name;
                }
                if(M_AppCommentList._postData.data.es_field_val){
                    postData['es_field_val'] = M_AppCommentList._postData.data.es_field_val;
                }
                if(M_AppCommentList._postData.data.sentiment_keywords){
                    postData['sentiment_keywords'] = M_AppCommentList._postData.data.sentiment_keywords;
                }
                if(M_AppCommentList._postData.data.word){
                    postData['keywords'] = M_AppCommentList._postData.data.word;
                    M_AppCommentList._keywords = M_AppCommentList._postData.data.word;
                }
                postData['order_by_field'] = M_AppCommentList._postData.data.order_field;
                postData['order_type'] = M_AppCommentList._postData.data.order_by;
                postData['data_date_start'] = M_AppCommentList._postData.data.begin;
                postData['data_date_end'] = M_AppCommentList._postData.data.end;
                break;
        }
        postData['project_id'] = M_Init._gameId;
        postData['index'] = index;
        postData['limit'] = B_Page._size;

        return B_Common._postData(postData);
    },
    _getList:function(page){
        var port = 'channelComments';
        var postData = M_AppCommentList._conditionList(page);
        var domList = $('#lt_forum_list');
        var domPage = $('#lt_forum_page');
        B_Port._ajax(port,'get',true,postData,function(){
            $('#lt_forum_list,#lt_forum_list *').unbind().removeData();
            domList.html(B_Pre._loading('b_padding30'));
            domPage.html('');
        },function(){
            domList.html('');
        },function(data,msg){
            if(data.data && data.data.list.length > 0){
                domList.html(M_AppCommentList._htmlList(data.data));
                domPage.html(B_Page._show({total:data.data.total,page:page},'simple'));
                B_Page._click(page,function (page) {
                    M_AppCommentList._getList(page);
                });
                domList.perfectScrollbar();
            }else{
                domList.html('<div class="b_empty b_colorR">当前时间段暂无数据</div>');
            }
        },function(data,msg,code){
            domList.html(B_Pre._empty(msg));
        })
    },
    _htmlList:function(data){
        var str = '';
        var dataUnion = '';
        for(var i=0;i<data.list.length;i++){
            dataUnion = data.list[i].source;
            str += '<li class="boxshadow  first-floor"><div>';
            str += '<img src="'+B_Game._imgSourceUrl(dataUnion.source_type,'small')+'" alt="'+dataUnion.source_name+'">';
            str += '<div class="star-level">';
            for(var d=1;d<=5;d++){
                if(d <= dataUnion.rating_star){
                    str += '<i class="tg-icon full-blue-star"></i>';
                }else{
                    str += '<i class="tg-icon full-gray-star"></i>';
                }
            }
            str += '</div>';
            str += '<span><i class="tg-icon tg-tieba-man"></i>'+dataUnion.author+'</span>';
            str += '<span><i class="tg-icon tg-tieba-clock"></i>'+dataUnion.publish_time+'</span>';
            str += '<p>'+M_AppCommentList._focusKeywords(dataUnion.content)+'</p>';
            str += '</div></li>';
        }
        return str;
    }
}
var M_ForumList = {
    _buff:{},
    _postData:{type:'',classify:'',data:''},
    _keywords:'',
    _getFromChartClick:function(date,word){
        if(!(date == M_ForumList._postData.data.begin && word == M_ForumList._postData.data.word)){
            M_ForumList._postData.data = {begin:date,end:date,word:word};
            M_ForumList._getList(1);
        }
    },
    _onFocus:function(){
        var itemDom = $('#lt_forum_list li');
        itemDom.each(function(){
            $(this).click(function(){
                if(!$(this).hasClass('left-list-active')){
                    var ikey = $(this).attr('data-i');
                    var tkey = $(this).attr('data-t');
                    if(M_Init._isUseKeywordReset)M_ForumList._keywords = $(this).attr('data-w');
                    if(ikey && tkey)M_ForumList._getDetail(ikey,tkey,1);
                    $(this).addClass('left-list-active').siblings('li').removeClass('left-list-active');
                }
            });
        });
    },
    _focusKeywords:function(data,lightkeywords){
        var back = data;
        if(M_ForumList._keywords != '' || (lightkeywords && lightkeywords != '')){
            var keywords = (lightkeywords && lightkeywords != '') ? lightkeywords : M_ForumList._keywords;
            keywords = keywords.toLowerCase();
            keywords = keywords.split(',');
            var index = $.inArray('ss',keywords);
            if(index > -1){
                back = B_Common._focusKeywords('ss',back);
                keywords.splice(index,1);
            }
            for(var i=0;i<keywords.length;i++){
                back = B_Common._focusKeywords(keywords[i],back);
            }
        }
        return back;
    },
    _pageRequest:function(page){
        var total = $('#lt_forum_page button').attr('data-a');
        if(page > 0 && parseInt(page)<=parseInt(total)){
            M_ForumList._getList(page);
        }
    },
    _conditionList:function(page){
        var postData = {};
        var index = (page-1)*B_Page._size;
        switch(M_ForumList._postData.type){
            case 'post':
                if(M_ForumList._postData.data.info_id_list){
                    postData['info_id_list'] = M_ForumList._postData.data.info_id_list;
                }
                if(M_ForumList._postData.data.lighttower_classify){
                    postData['lighttower_classify'] = M_ForumList._postData.data.lighttower_classify;
                }
                if(M_ForumList._postData.data.topic_id){
                    postData['topic_id'] = M_ForumList._postData.data.topic_id;
                }
                if(M_ForumList._postData.data.real_tag){
                    postData['real_tag'] = M_ForumList._postData.data.real_tag;
                }
                if(M_ForumList._postData.data.sentiment_score){
                    postData['sentiment_score'] = M_ForumList._postData.data.sentiment_score;
                }
                if(M_ForumList._postData.data.classify_sentiment){
                    if(M_ForumList._postData.data.classify_sentiment == 2){
                        postData['classify_sentiment'] = 0;
                    }else{
                        postData['classify_sentiment'] = M_ForumList._postData.data.classify_sentiment;
                    }
                }
                if(M_ForumList._postData.data.word){
                    postData['keywords'] = M_ForumList._postData.data.word;
                    M_ForumList._keywords = M_ForumList._postData.data.word;
                }
                postData['order_by_field'] = M_ForumList._postData.data.order_field;
                postData['order_type'] = M_ForumList._postData.data.order_by;
                postData['data_date_start'] = M_ForumList._postData.data.begin;
                postData['data_date_end'] = M_ForumList._postData.data.end;
                if(!M_Init._dataCache['only_query_title']){
                    postData['only_query_title'] = 1
                }
                break;
            case 'keyword':
                M_ForumList._keywords = M_ForumList._postData.data.word;
                postData['order_by_field'] = 'publish_time';
                postData['order_type'] = 'desc';
                postData['data_date_start'] = M_ForumList._postData.data.begin;
                postData['data_date_end'] = M_ForumList._postData.data.end;
                postData['keywords'] = M_ForumList._postData.data.word;
                postData['only_query_title'] = 1;
                break;
            case 'suddenly':
                postData['data_date'] = M_ForumList._postData.data.data_date;
                postData['sub_type'] = M_ForumList._postData.data.sub_type;
                break;
        }
        postData['project_id'] = M_Init._gameId;
        postData['index'] = index;
        postData['limit'] = B_Page._size;
        return B_Common._postData(postData);
    },
    _getList:function(page){
        var port = 'forumSearch';
        switch(M_ForumList._postData.type){
            case 'post':
                break;
            case 'suddenly':
                M_Init._isUseKeywordReset = true;
                port = 'sigmaItWarnDetail';
                //$('.article-list .top span').html('反馈所属时间：'+M_ForumList._postData.data.data_date+' <b class="tg-font-blue">所选问题类型：'+M_ForumList._postData.classify+'</b>');
                break;
            default:
                $('.article-list .top span').html('已选：'+M_ForumList._postData.data.begin+' <b class="tg-font-blue">'+M_ForumList._postData.data.word+'</b>');
                break;
        }
        var postData = M_ForumList._conditionList(page);
        var domList = $('#lt_forum_list');
        var domPage = $('#lt_forum_page');
        var domContent = $('#lt_forum_detail');
        B_Port._ajax(port,'get',true,postData,function(){
            $('#lt_forum_list,#lt_forum_list *').unbind().removeData();
            domList.html(B_Pre._loading('b_padding30'));
            domContent.html('');
            domPage.html('');
        },function(){
            domList.html('');
        },function(data,msg){
            if(data.data && data.data.list.length > 0){
                M_Init._dataCache['forum'] = data.data.list;
                domList.html(M_ForumList._htmlList(data.data));
                domPage.html(B_Page._show({total:data.data.total,page:page},'simple'));
                M_ForumList._onFocus();
                B_Page._click(page,function (page) {
                    M_ForumList._getList(page);
                });
                domList.perfectScrollbar();
            }else{
                domList.html('<div class="b_empty b_colorR">当前时间段暂无数据</div>');
                domContent.html('');
            }
        },function(data,msg,code){
            domList.html(B_Pre._empty(msg));
        })
    },
    _getDetail:function(ikey,tkey,page){
        var domContent = $('#lt_forum_detail');
        var postData = {};
        postData['project_id'] = M_Init._gameId;
        postData['info_id'] = ikey;
        postData['title_id'] = tkey;
        postData['index'] = (page-1)*B_Page._size;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);
        B_Port._ajax('forumDetail','get',true,postData,function(){
                if(page == 1){
                    $('#lt_forum_detail, #lt_forum_detail *').unbind().removeData();
                    domContent.html(B_Pre._loading('b_padding30'));
                }else{
                    domContent.find('.loading-state').unbind('click').html('加载中...')
                }
            },function(){
                if(page == 1)domContent.html('');
            },function(data,msg){
                var isEnd = page*B_Page._size >= data.data.total ? true : false;
                domContent.find('.loading-state').remove();
                if(page == 1){
                    var titleData = M_ForumList._getTitle(ikey,tkey);
                    if(titleData){
                        domContent.html(M_ForumList._htmlTitle(titleData));
                    }
                }
                $('#lt_forum_detail .second-floor').append(M_ForumList._htmlDetail(data.data,page,ikey,tkey));
                if(isEnd){
                    domContent.find('.loading-state').unbind('click');
                }else{
                    domContent.find('.loading-state').bind('click',function(){
                        M_ForumList._getDetail(ikey,tkey,page+1)
                    }).addClass('b_cursor');
                }
                domContent.perfectScrollbar();
            },function(data,msg,code){
                if(page == 1)domContent.html(B_Pre._empty(msg));
            }
        )
    },
    _getTitle:function(infoId,titleId){
        if(M_Init._dataCache['forum']){
            var data = M_Init._dataCache['forum'];
            for(var i=0;i<=data.length;i++){
                if(data[i].source.info_id == infoId && data[i].source.title_id == titleId){
                    return data[i].source;
                }
            }
        }
        return '';
    },
    _htmlList:function(data){
        var str = '<ul>';
        var imgs = [];
        for(var i=0;i<data.list.length;i++){
            var hasImg = '';
            var lightTags = '';
            if(data.list[i].source.attach_content && data.list[i].source.attach_content.length > 0){
                var attach_content = B_Common._imgDecode(data.list[i].source.attach_content);
                eval("attach_content="+attach_content);
                for(var m=0;m<attach_content.length;m++){
                    imgs.push(attach_content[m].img_url);
                }
                hasImg = '<i class="tg-icon"></i>';
            }
            if(data.list[i].source.lighttower_tags && data.list[i].source.lighttower_tags != ''){
                var lightTagsArr = data.list[i].source.lighttower_tags.split(',');
                var lightTags = [];
                for(var t=0;t<lightTagsArr.length;t++){
                    lightTagsArr[t] = lightTagsArr[t].split(':');
                    if(lightTagsArr[t][1] && lightTagsArr[t][1] != ''){
                        lightTags.push(lightTagsArr[t][1]);
                    }
                }
                if(lightTags.length > 0)lightTags = lightTags.join(',');
            }
            var useClass = '';
            if(i==0){
                if($('#lt_forum_detail').html() == ''){
                    useClass = 'left-list-active';
                    if(M_Init._isUseKeywordReset)M_ForumList._keywords = lightTags;
                    M_ForumList._getDetail(data.list[i].source.info_id,data.list[i].source.title_id,1);
                }
            }
            var content = (data.list[i].source.content.length > 60) ? data.list[i].source.content.substr(0,60)+'..' : data.list[i].source.content;
            var time = M_Init._isUseKeywordReset ? '问题类型：'+(data.list[i].source.lighttower_class ? data.list[i].source.lighttower_class.replace('/-1',''):'') :'发帖时间：'+B_Date._dateFormat('mini',data.list[i].source.publish_time);
            str += '\
                <li class="'+useClass+'" data-i="'+data.list[i].source.info_id+'" data-t="'+data.list[i].source.title_id+'"  data-w="'+lightTags+'">\
                    <h5>帖子标题：'+hasImg+' '+M_ForumList._focusKeywords(data.list[i].source.title,lightTags)+'</h5>\
                    <p>\
                        <b>玩家昵称：'+data.list[i].source.author+'</b>\
                        <b>数据来源：'+data.list[i].source.crawler_name+'</b>\
                    </p><p>\
                        <b>回帖数量：'+data.list[i].source.reply_num+'</b>\
                        <b>'+time+'</b>\
                    </p>\
                </li>';
        }
        if(imgs.length >0){
            B_Common._imgBuff(imgs);
        }
        str += '</ul>';
        return str;
    },
    _htmlTitle:function(data){
        var str = '';
        var img = '';
        if(data.attach_content && data.attach_content.length > 0){
            var attach_content = B_Common._imgDecode(data.attach_content);
            eval("attach_content="+attach_content);
            for(var i=0;i<attach_content.length;i++){
                try{
                    img += '<br><img src="'+decodeURIComponent(attach_content[i].img_url)+'">';
                }catch(e){}
            }
        }
        str += '\
            <h5>帖子标题：'+M_ForumList._focusKeywords(data.title)+'</h5>\
            <li class="boxshadow first-floor">\
                <ul>\
                    <li><i class="tg-icon tg-tieba-href"></i> 数据源地址：<a href="'+data.from_url+'" target="_blank">'+data.from_url+'</a></span></li>\
                    <li><i class="tg-icon tg-tieba-num"></i> 回帖数：'+data.reply_num+'</li>\
                    <li><i class="tg-icon tg-tieba-clock"></i> 发帖时间:'+data.publish_time+'</li>\
                </ul>\
                <div>\
                    <span><i class="tg-icon tg-tieba-man"></i>'+data.author+'</span>\
                    <span><i class="tg-icon tg-tieba-clock"></i>'+data.publish_time+'</span>\
                    <span class="floor-num">1楼</span>\
                    <p>'+M_ForumList._focusKeywords(data.content)+img+'</p>\
                </div>\
            </li><li class="boxshadow second-floor"></li>';

        return str;
    },
    _htmlDetail:function(data,page,ikey,tkey){
        var isEnd = false;
        if((B_Page._size*page) >= data.total){
            isEnd = true;
        }
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var imgs = [];
            var img = '';
            if(data.list[i].source.attach_content && data.list[i].source.attach_content.length > 0){
                var attach_content = B_Common._imgDecode(data.list[i].source.attach_content);
                eval("attach_content="+attach_content);
                for(var m=0;m<attach_content.length;m++){
                    try{
                        imgs.push(attach_content[m].img_url);
                        img += '<br><img src="'+decodeURIComponent(attach_content[m].img_url)+'">';
                    }catch(e){}
                }
            }
            if(imgs.length >0){
                B_Common._imgBuff(imgs);
            }
            str += '\
                <div>\
                    <span><i class="tg-icon tg-tieba-man"></i>'+data.list[i].source.author+'</span>\
                    <span><i class="tg-icon tg-tieba-clock"></i>'+data.list[i].source.publish_time+'</span>\
                    <span class="floor-num">'+(((page-1)*B_Page._size)+i+2)+'楼</span></dt>\
                    <p>'+M_ForumList._focusKeywords(data.list[i].source.content)+img+'</p>\
                </div>';
        }
        if(isEnd){
            str += '<span class="loading-state show-all">已经显示全部</span>';
        }else{
            str += '<span class="loading-state show-all">点击加载更多</span>';
        }
        return str;
    }
}
var M_Common = {
    _sourceUrl:function (type,data) {
        var str = '';
        switch (type){
            case 'tieba':
                str = '<a href="https://tieba.baidu.com/f?kw='+data+'" target="_blank">'+data+'</a>';
                break;
            case 'weibo':
                data = data.split(',');
                str += '<span title="'+data[0]+'">';
                if(data[1]){
                    str += '<a href="http://weibo.com/u/'+data[1]+'" target="_blank">'+data[0]+'</a>';
                }else{
                    str += data[0];
                }
                str += '</span>';
                break;
            case 'bili':
                data = data.split(',');
                str += '<span title="'+data[0]+'">';
                if(data[1]){
                    str += '<a href="https://space.bilibili.com/'+data[1]+'" target="_blank">'+data[0]+'</a>';
                }else{
                    str += data[0];
                }
                str += '</span>';
                break;
        }
        return str;
    },
    _formatPercent:function (data) {
        var countAll = 0;
        for(var i=0;i<data.length;i++){
            $.each(data[i],function (key,value) {
                countAll += parseInt(value);
            });
        }
        var percent = 0;
        var dataUnion = {};
        for(var i=0;i<data.length;i++){
            $.each(data[i],function (name,value) {
                if(countAll > 0)percent = ((value/countAll)*100).toFixed(2);
                dataUnion[name] = percent;
            })
        }
        return dataUnion;
    },
    _scroll:function () {
        var move = $('#bs_condition_list');
        var warp1 = $('#bs_scroll_content_1');
        var btnLeft = $('#bs_scroll_btn_left');
        var btnRight = $('#bs_scroll_btn_right');

        var time = '';
        var speed = '';
        btnLeft.click(function () {
            speed = 1;
            clearInterval(time);
            time = setInterval(function(){
                M_Common._scrollDom('left',speed)
            },10);
        });
        btnLeft.mouseout(function () {
            clearInterval(time);
        });
        btnRight.click(function () {
            speed = -1;
            clearInterval(time);
            time = setInterval(function(){
                M_Common._scrollDom('right',speed)
            },10);
        });
        btnRight.mouseout(function () {
            clearInterval(time);
        })
    },
    _scrollDom:function (type,speed) {
        var move = $('#bs_condition_list');
        var warp1 = $('#bs_scroll_content_1');
        var moveLeft = parseInt(move.css('left'));
        var warpWidth = parseInt(warp1.innerWidth());
        var mainWidth = parseInt($('#bs_scroll_all').innerWidth());
        if(!moveLeft)moveLeft = 0;

        if(warpWidth <= mainWidth){
            return;
        }
        switch (type){
            case 'left':
                if(moveLeft > 0){
                    return;
                }else{
                    move.css('left',moveLeft+speed+'px');
                }
                break;
            case 'right':
                if((Math.abs(moveLeft)+mainWidth) > warpWidth){
                    return;
                }else{
                    move.css('left',moveLeft+speed+'px');
                }
                break;
        }

    },
    _menuUrlInit:function (key) {
        switch (key){
            case '游戏详情':
                B_Jump._go('target','outsideCenter');
                break;
            case '玩家运营':
                B_Jump._go('target','operateBasic');
                break;
            default:
                B_Jump._go('target','insideSummary');
                break;
        }
    },
    _wordCloudShow:function(dom,words,callback,extraclass){
        var ratio = [];
        for(var i=0; i<words.length; ++i){
            ratio.push(words[i].total_num / words[0].total_num * 1.5);
        }
        wordCloudObj = new WordCloud(dom, words, callback, extraclass, null, null, null, ratio);
    },
    _getOrderGame:function (type,dataId,menuId) {
        if(dataId){
            M_Init._gameId = dataId
        }else{
            switch(type){
                case 'helper':
                case 'log':
                case 'basic':
                case 'player':
                case 'operatePay':
                case 'operateLost':
                    M_Init._gameId = M_Init._getGameId('operateGame');
                    break;
                default:
                    M_Init._gameId = M_Init._getGameId('insideGame');
                    break;
            }
        }
        if(M_Init._dataInnerGame && M_Init._dataInnerGame.length > 0) {
            M_Common._selectGame(type,menuId);
        }else{
            B_Port._ajax('innerGame','get',true,null,function () {
                    B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
                },function () {
                    B_Pop._init('close');
                },function(data,msg){
                    if(data && data.length>0){
                        switch (type){
                            case 'operateDemo':
                            case 'demo':
                                B_Jump._go('hash',dataId);
                                return;
                                break;
                        }
                        M_Init._dataInnerGame = data;
                        if(M_Init._gameId+'' == B_Game._getDemoProjectId()+''){
                            M_Init._gameId = data[0].game_id;
                        }
                        M_Common._selectGame(type,menuId);
                    }else{
                        switch (type){
                            case 'operateDemo':
                                M_Dom._menuList('玩家运营Demo', menuId,null,type);
                                break;
                            case 'demo':
                                M_Dom._menuList('智能分析Demo', menuId,null,type);
                                break;
                            default:
                                var url = B_Common._getUrl('hash');
                                B_Jump._go('hash','insideDemo/'+url)
                                break;
                        }
                    }
                },function(data,msg,code){
                    B_Pop._init('open',{content:msg});
                }
            )
        }
    },
    _getInnerGame:function () {
        var gameUnion = M_Init._dataInnerGame;
        var game = ['',''];
        for(var i=0;i<gameUnion.length;i++){
            if(M_Init._gameId+'' == gameUnion[i].game_id+''){
                game = [B_Game._imgUrl(M_Init._gameId,'inner'),gameUnion[i].game_name];
                break;
            }
        }
        return game;
    },
    _selectGame:function (type,menuId) {
        var hasGame = false;
        var gameUnion = M_Init._dataInnerGame;
        for(var i=0;i<gameUnion.length;i++){
            if(M_Init._gameId+'' == gameUnion[i].game_id+''){
                hasGame = true;
                break;
            }
        }
        if(!hasGame){
            M_Init._gameId = gameUnion[0].game_id;
        }
        B_Game._dropInnerGame(gameUnion,M_Init._gameId,'#gameDropChoose',function (gameId,isReselect) {
            M_Init._gameId = gameId;
            switch (type){
                case 'helper':
                case 'log':
                case 'basic':
                case 'player':
                case 'operatePay':
                case 'operateLost':
                    B_Game._setLast(gameId, 'operateGame');
                    M_Dom._menuList('玩家运营', menuId, M_Init._menuInitCache[M_Init._gameId],type);
                    break;
                default:
                    B_Game._setLast(gameId, 'insideGame');
                    if(isReselect && type == 'personality'){
                        B_Jump._go('target','insideSummary');
                    }
                    M_Dom._menuDynamic(menuId,type);
                    break;
            }
        });
    },
    _createPost:function(url, params){
        var temp = document.createElement("form");
        temp.action = url;
        temp.method = "post";
        temp.style.display = "none";
        temp.target = '_blank';
        for (var x in params) {
            var opt = document.createElement("textarea");
            opt.name = x;
            opt.value = params[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);
        temp.submit();
        return temp;
    },
    _downCsv:function (data) {
        if(data && data.body && data.body.length>0){
            var postData = {tb_head:data.head,tb_body:data.body};
            postData = JSON.stringify(postData);
            var downloadName = '';
            if(data && data.name){
                downloadName = data.name;
                downloadName = downloadName.replace('(','（');
                downloadName = downloadName.replace(')','）');
            }else{
                downloadName = '';
            }
            M_Common._createPost(B_Port._init('serviceDownload'),{'data' :postData,'name':downloadName});

            /*
                var dataString = '';
                var csvContent = '';
                csvContent = data.head.join(",")+ "\n";
                for(var i=0;i<data.body.length;i++){
                    if(i>1000)break;
                    dataString = data.body[i].join(",");
                    csvContent += i < data.body.length ? dataString+ "\n" : dataString;
                }
                if (window.navigator.msSaveOrOpenBlob) {
                    csvContent = "\ufeff"+csvContent;
                    var blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
                        type: "text/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob,'data.csv');
                }else{
                    csvContent = "data:text/csv;charset=utf-8,\ufeff"+encodeURI(csvContent);
                    var link = document.createElement("a");
                    link.setAttribute("href", csvContent);
                    link.setAttribute("download", "data.csv");

                    document.body.appendChild(link);
                    link.click();
                }
            */
        }else{
            B_Pop._init('msg',{'content':'暂无数据'})
        }
    },
    _percent:function (type,data) {
        var dataUnion = [];
        if(data && data.length>0){
            var total = 0;
            switch (type){
                case 'age':
                    for(var i=0;i<data.length;i++){
                        $.each(data[i],function (name,value) {
                            total += parseFloat(value);
                        });
                    }
                    var dataUnion = [];
                    var dataUnionD = {};
                    if(total > 0){
                        for(var i=0;i<data.length;i++){
                            dataUnionD = {};
                            $.each(data[i],function (name,value) {
                                dataUnionD[name] = ((parseFloat(value)/total)*100).toFixed(1);
                                dataUnion.push(dataUnionD);
                            });
                        }
                    }
                    break;
            }
            return dataUnion;
        }else{
            return data;
        }
    }
}
