var F_Player_Entrance = {
    _init:function (condition) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(4);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            if(M_Init._operateFrom && M_Init._operateFrom == 'helper'){
                M_Init._operateFrom = '';
            }else{
                M_Init._operateCondition = {};
            }
            var conditionSplit = '';
            var gameId = '';
            if(condition){
                condition = B_Common._decodeUrl(condition);
                conditionSplit = condition.split('|');
                if(conditionSplit.length == 4){
                    gameId = conditionSplit[0];
                    M_Init._dataCache['condition_type'] = conditionSplit[1];
                    M_Init._dataCache['condition_style'] = conditionSplit[2];
                    M_Init._dataCache['condition_reason'] = conditionSplit[3];
                }
            }
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['playerGroupTag'] = 'demoPlayerGroupTag';
                    M_Init._api['playerGroupSearch'] = 'demoPlayerGroupSearch';
                    M_Init._api['innerSearchMeta'] = 'demoInnerSearchMeta';
                    M_Init._api['playerData'] = 'demoPlayerData';
                    M_Init._api['searchExcel'] = 'demoSearchExcel';
                    break;
                default:
                    M_Init._api['playerGroupTag'] = 'playerGroupTag';
                    M_Init._api['playerGroupSearch'] = 'playerGroupSearch';
                    M_Init._api['innerSearchMeta'] = 'innerSearchMeta';
                    M_Init._api['playerData'] = 'playerData';
                    M_Init._api['searchExcel'] = 'searchExcel';
                    break;
            }
            M_Operate._searchPop();
            M_Common._getOrderGame('player',gameId,'8-2');
            $('#bs_btn_main_search').click(function () {
                M_Operate._btnSearch('player');
            });
        }
    }
}

var F_Player_Info = {
    _cache:{},
    _conditionBase:function () {
        var postData = {};
        if(M_Init._dataCache['condition_type'] && M_Init._dataCache['condition_style'] && M_Init._dataCache['condition_reason']){
            switch (M_Init._dataCache['condition_type']){
                case 'paid':
                    postData['s_pay_style'] = M_Init._dataCache['condition_style'];
                    postData['s_pay_reason'] = M_Init._dataCache['condition_reason'];
                    break;
                case 'lost':
                    postData['s_lost_style'] = M_Init._dataCache['condition_style'];
                    postData['s_lost_reason'] = M_Init._dataCache['condition_reason'];
                    break;
            }
        }
        return B_Common._postData(postData);
    },
    _getCharacterTag:function () {
        var postData2 = F_Player_Info._conditionBase();
        var postData = {};
        postData['game_id'] = M_Init._gameId;
        postData['group'] = M_Init._dataCache['tabName'];
        postData = B_Common._postData(postData);
        if(postData2){
            postData += '&'+postData2;
        }
        var isEmpty = ($('#bs_main_content').html() == '') ? true : false;
        B_Port._ajax(M_Init._api['playerGroupTag'],'get',true,postData,function () {
                if(!isEmpty){
                    $('#bs_character_tab').html('');
                    $('#bs_chart_character').html(B_Pre._loading());
                }else{
                    B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
                }
            },function () {
                if(!isEmpty){
                    $('#bs_chart_character').html('');
                }else{
                    B_Pop._init('close');
                }
            },function(data,msg){
                if(data && data.length >0) {
                    M_Init._dataCache['characterData'] = data;
                    for(var i=0;i<data.length;i++){
                        if(i==0){
                            $.each(data[i],function(key,value){
                                M_Init._dataCache['characterKey'] = key;
                                M_Init._dataCache['characterName'] = value;
                            })
                            break;
                        }
                    }
                    F_Player_Info._getCharacterDetail();
                }else{
                    F_Player_Info._htmlEmpty();
                }
            },function(data,msg,code){
                if(!isEmpty){
                    $('#bs_chart_character').html(B_Pre._empty(msg));
                }else{
                    $('#bs_main_content').html(B_Pre._empty(msg));
                }
            }
        )
    },
    _getCharacterDetail:function () {
        var postData2 = F_Player_Info._conditionBase();
        var postData = {};
        postData['game_id'] = M_Init._gameId;
        postData['group'] = M_Init._dataCache['tabName'];
        postData['column_name'] = M_Init._dataCache['characterKey'];
        postData = B_Common._postData(postData);
        if(postData2 != ''){
            postData = postData+'&'+postData2;
        }
        var condition = '';
        var searchCondition = M_Operate._getSearchTag('character');
        if(searchCondition != ''){
            condition = postData+'&'+searchCondition;
        }else{
            condition = postData;
        }
        var isEmpty = ($('#bs_main_content').html() == '') ? true : false;
        B_Port._ajax(M_Init._api['playerGroupSearch'],'get',true,condition,function () {
                if(!isEmpty){
                    $('#bs_chart_character').html(B_Pre._loading());
                }
            },function () {
                if(!isEmpty){
                    $('#bs_chart_character').html('');
                }
            },function(data,msg){
                if(data && data.x_axis && data.x_axis.length >0) {
                    if($('#bs_main_content').html() == ''){
                        F_Player_Info._htmlInit();
                        M_Operate._formatTag($('#bs_content_tag'),M_Init._dataCache['tagsData']);
                        M_Operate._download();
                    }
                    if($('#bs_character_tab').html() == ''){
                        F_Player_Info._htmlCharacter();
                    }
                    if($.trim($('input[name="k"]').val()) != ''){
                        $('#bs_aim_player').hide();
                    }else{
                        $('#bs_aim_player').show();
                    }
                    var chartDataPre = { x_axis: data.x_axis, y_axis: [{ 'name': '', 'data': data.y_axis }], yFormat: '人',tooltip:{ 'num': 1, 'unit': '人' }};
                    M_Inside_Chart._chartData(40, 'bs_chart_character', chartDataPre);
                }else{
                    F_Player_Info._htmlEmpty();
                }
            },function(data,msg,code){
                if(!isEmpty){
                    $('#bs_chart_character').html(B_Pre._empty(msg));
                }else{
                    $('#bs_main_content').html(B_Pre._empty(msg));
                }
            }
        )
    },
    _htmlCharacter:function () {
        var str = '';
        var dataUnion = M_Init._dataCache['tagsData'][0].groupTitle;
        var iconClass = '';
        for(var i=0;i<dataUnion.length;i++){
            if(dataUnion[i] != ''){
                switch (dataUnion[i]){
                    case '能力评估':
                        iconClass = 'change-color-icon1';
                        break;
                    case '活跃度':
                        iconClass = 'change-color-icon2';
                        break;
                    case '消费':
                        iconClass = 'change-color-icon3';
                        break;
                    case '玩法偏好':
                        iconClass = 'change-color-icon4';
                        break;
                    case '社交属性':
                        iconClass = 'change-color-icon5';
                        break;
                    default:
                        iconClass = 'change-color-icon1';
                        break;
                }
                str += '<li';
                if(dataUnion[i] == M_Init._dataCache['tabName']){
                    str += ' class="selected"';
                }
                str += ' data-i="'+dataUnion[i]+'"><i class="tg-icon '+iconClass+'"></i><p>'+dataUnion[i]+'</p></li>';
            }
        }
        $('.vertical-tab-change').html(str);

        $('.vertical-tab-change li').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['tabName'] = $(this).attr('data-i');
                    F_Player_Info._getCharacterTag();
                }
            });
        });

        var str = '<b>特征分布</b>';
        var dataUnion = M_Init._dataCache['characterData'];
        for(var i=0;i<dataUnion.length;i++){
            $.each(dataUnion[i],function (key,value) {
                str += '<span';
                if(key == M_Init._dataCache['characterKey']){
                    str += ' class="selected"';
                }
                str += ' data-i="'+key+'">'+value+'</span>';
            })
        }
        $('#bs_character_tab').html(str);

        $('#bs_character_tab span').each(function () {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    M_Init._dataCache['characterKey'] = $(this).attr('data-i');
                    M_Init._dataCache['characterName'] = $(this).html();
                    F_Player_Info._getCharacterDetail();
                }
            });
        });
    },
    _htmlEmpty:function () {
        var str = '';
        str += '<div class="b_empty">\
                        <div class="des">\
                        <img src="elements2.0/img/empty.png" alt="">\
                        <span>没有符合条件的玩家</span>\
                        <p>没有符合所设置条件的玩家，请确认设置内容或调整自定义的筛选条件</p>\
                    </div>\
                </div>';

        $('#bs_main_content').html(str);
    },
    _htmlInit:function () {
        var str = '';
        str += '<div class="blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12" id="bs_aim_player">\
                    <h3>目标玩家特征</h3>\
                    <div class="boxshadow target-player-feature">\
                        <div class="wrap">\
                            <div class="fl"><ul class="vertical-tab-change"></ul></div>\
                            <div class="graph-wrap">\
                                <div class="tg-top-word-tab" id="bs_character_tab"></div>\
                                <div class="graph-part" id="bs_chart_character" style="height: 450px; width: 100%;"></div>\
                            </div>\
                        </div>\
                    </div>\
                </div>';

        str += '<div class="blockpart  tg-table-layout col-lg-12 col-md-12 col-sm-12 col-xs-12  ">\
                    <h3>玩家属性表</h3>\
                    <div class="boxshadow tg-table-content ">\
                        <div class="tg-top-word-tab" id="bs_content_tag"></div>\
                        <div class="tg-table-wrap tg-table-no-padding" id="bs_content_list">\
                            <div class="table-out-wrap no-margin-top">\
                                <table class="tg-table table table-bordered">\
                                <thead class="boxshadow"></thead><tbody></tbody></table>\
                            </div>\
                            <ul class="tg-page-list" id="lt_forum_page"></ul>\
                        </div>\
                        <div class="boxshadow tg-table-operation">\
                            <ul class="fr">\
                                <li><b>下载数据</b><i class="tg-icon tg-download" id="bs_btn_down"></i></li>\
                            </ul>\
                        </div>\
                     </div>\
                  </div>';
        $('#bs_main_content').html(str);

    },
    _htmlBase:function () {
        var str = '';
        str += '<div class="tg-header-slider" style="display: none">\
                    <div class="control slider-pre">\
                        <span>符合自定义玩家特征</span>\
                        <i id="bs_scroll_btn_left"><b class="left-triangle"></b></i>\
                    </div>\
                    <div class="slider-content" id="bs_scroll_all">\
                        <div class="slider-wrap" id="bs_scroll_main">\
                            <div id="bs_condition_list" style="position: absolute">\
                                <ul id="bs_scroll_content_1"></ul>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="control slider-next">\
                        <i id="bs_scroll_btn_right"><b class="right-triangle"></b></i>\
                        <span>的玩家共有“<b class="text-blue" id="bs_number"></b>”人</span>\
                    </div>\
                </div>';
        str += '<div id="bs_main_content"></div>';
        $('#ct_main_area').html(str);
    },
    _getInfo:function () {
        F_Player_Info._htmlBase();
        M_Operate._getTag('player');
    }
}