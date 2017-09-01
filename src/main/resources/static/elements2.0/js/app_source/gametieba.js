var F_GameTieba_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-9');
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
            var gameIdRight = B_Storage._get('gameFaceCompareRight');
            if(gameIdRight){
                if(gameIdRight+'' == '0'){
                    M_Init._gameIdRight = '';
                }else{
                    M_Init._gameIdRight = gameIdRight;
                }
            }else{
                M_Init._gameIdRight = '';
            }

            $('#headerTop').html('<span class="fl hotword">对照群体</span><div class="tg-search-drop" id="gameDropChooseRight"></div>');
            B_Game._dropChoose(M_Init._gameIdRight,'#gameDropChooseRight','reset',function(gameIdRight){
                if(gameIdRight+'' != M_Init._gameIdRight+''){
                    B_Game._setLast(gameIdRight, 'gameFaceCompareRight');
                    if(gameIdRight && gameIdRight+'' == '0'){
                        gameIdRight = '';
                        M_Init._dateCache['projectRightData'] = null;
                    }
                    M_Init._gameIdRight = gameIdRight;
                    F_GameTieba_Info._getInfo('right');
                }
            });
            M_Game._checkGameVisitList('gameTieba');
        }
    }
}
var F_GameTieba_Info = {
    _empty:function (msg) {
        msg = msg ? msg : '暂无数据';
        $('#ct_main_area').html('<div class="b_empty">'+msg+'</div>');
    },
    _formatMapData:function () {
        var chartDataPre = {color:['#3eaae2','#2bd184'],y_axis:[],legendNotShow:true};
        if(M_Init._dateCache['projectRightData']){
            var dataUnionL = M_Init._dateCache['projectLeftData'].province_distri;
            var dataUnionR = M_Init._dateCache['projectRightData'].province_distri;
            var dataUnionLP = M_Init._dateCache['projectLeftData'].province_distri_percent;
            var dataUnionRP = M_Init._dateCache['projectRightData'].province_distri_percent;
            chartDataPre.y_axis.push({'name':'贴吧用户','data':[]},{'name':'对比贴吧用户','data':[]});
            for(var i=0;i<dataUnionL.length;i++){
                $.each(dataUnionL[i],function (name,value) {
                    chartDataPre.y_axis[0].data.push({'name':name,'value':(dataUnionLP[name]/100)});
                })
            }
            for(var i=0;i<dataUnionR.length;i++){
                $.each(dataUnionR[i],function (name,value) {
                    chartDataPre.y_axis[1].data.push({'name':name,'value':(dataUnionRP[name]/100)});
                })
            }
        }else{
            var dataUnion = M_Init._dateCache['projectLeftData'].province_distri;
            var dataUnionP = M_Init._dateCache['projectLeftData'].province_distri_percent;
            chartDataPre.y_axis.push({'name':'贴吧用户','data':[]});
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    chartDataPre.y_axis[0].data.push({'name':name,'value':(dataUnionP[name]/100)});
                })
            }
        }
        M_Outside_Chart._chartData('map','bs_map_chart',chartDataPre);
    },
    _htmlMap:function () {
        var str = '';
        str += '\
           <div class="ht-table-signs">'+M_Init._dateCache['iconStr']+'</div>\
           <div id="bs_map_chart" style="width: 98%; height: 100%"></div>';
        $('#bs_map_area').html(str);

        F_GameTieba_Info._formatMapData();

        str = '';
        str += '\
            <div class="ht-table-signs">\
                <div class="fr">\
                    <span>一二三线城市比例</span>\
                    <div class="switch-btn"><input type="checkbox" name="checkbox_country"  /></div>\
                </div>\
            </div>\
            <div id="bs_city_list"></div>';

        $('#bs_map_list').html(str);

        F_GameTieba_Info._htmlDataCity();

        $('input[name="checkbox_country"]').bootstrapSwitch('size','small');
        $('input[name="checkbox_country"]').on('switchChange.bootstrapSwitch', function(event, state){
            if(state){
                F_GameTieba_Info._htmlDataLevel();
            }else{
                F_GameTieba_Info._htmlDataCity();
            }
        });

    },
    _htmlDataCity:function () {
        var str = '';
        if(M_Init._dateCache['projectRightData']){
            str += '<div class="bs_scroll_map">';
            str += '<ul>';
            str += F_GameTieba_Info._formatDataArea('left');
            str += '</ul>';
            str += '</div>';
            str += '<div class="bs_scroll_map">';
            str += '<ul class="green">';
            str += F_GameTieba_Info._formatDataArea('right');
            str += '</ul>';
            str += '</div>';
        }else{
            str += '<div class="ht-full-width bs_scroll_map">';
            str += '<ul>';
            str += F_GameTieba_Info._formatDataArea('left');
            str += '</ul>';
            str += '</div>';
        }
        $('#bs_city_list').removeClass('ht-lr-rate-list ht-rate-list-wrap').addClass('ht-lr-rate-list').html(str);
        $('#bs_city_list .bs_scroll_map').perfectScrollbar();
    },
    _formatDataArea:function (type) {
        var dataUnion = null;
        var dataUnionP = null;
        var str = '';
        var sum = 0;
        switch (type){
            case 'left':
                dataUnion = M_Init._dateCache['projectLeftData'];
                break;
            case 'right':
                dataUnion = M_Init._dateCache['projectRightData'];
                break;
        }
        if(dataUnion && dataUnion.province_distri && dataUnion.province_distri.length > 0){
            dataUnionP = dataUnion.province_distri_percent;
            dataUnion = dataUnion.province_distri;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    str += '<li><span title="'+name+'">'+name+'</span><div class="ht-rate-wrap" title="排名：'+(i+1)+'　占比：'+dataUnionP[name]+'%"><span style="width: '+dataUnionP[name]+'%"></span></div></li>';
                })
                //if(i>=9)break;
            }
        }
        return str;
    },
    _formatDataLevel:function (type) {
        var dataUnionL = null;
        var dataUnionR = null;
        var dataUnionLP = null;
        var dataUnionRP = null;
        var str = '';
        switch (type){
            case 'left':
                dataUnionL = M_Init._dateCache['projectLeftData'];
                break;
            case 'all':
                dataUnionL = M_Init._dateCache['projectLeftData'];
                dataUnionR = M_Init._dateCache['projectRightData'];
                break;
        }
        if(dataUnionL && dataUnionL.city_level_distri && dataUnionL.city_level_distri.length > 0){
            dataUnionLP = dataUnionL.city_level_distri_percent;
            dataUnionL = dataUnionL.city_level_distri;
            if(dataUnionR){
                var dataUnionRReset = {};
                dataUnionRP = dataUnionR.city_level_distri_percent;
                dataUnionR = dataUnionR.city_level_distri;
                for(var i=0;i<dataUnionR.length;i++){
                    $.each(dataUnionR[i],function (name,value) {
                        dataUnionRReset[name] = value;
                    });
                }
                dataUnionR = dataUnionRReset;
            }
            var rightPercent = 0;
            var rightValue = 0;
            for(var i=0;i<dataUnionL.length;i++){
                $.each(dataUnionL[i],function (name,value) {
                    value = (value*100).toFixed(2);
                    if(type == 'all'){
                        if(dataUnionRP && dataUnionRP[name]){
                            rightPercent = dataUnionRP[name];
                        }else{
                            rightPercent = 0;
                        }
                        if(dataUnionR && dataUnionR[name]){
                            rightValue = dataUnionR[name];
                        }else{
                            rightValue = 0;
                        }
                        str += '\
                        <div class="des-top"><span>'+name+'</span></div>\
                        <ul class="ht-rate">\
                            <li class="fl">\
                                <div class="ht-rate-wrap ht-big-height" title="占比'+dataUnionLP[name]+'%">\
                                    <span class="ht-blue-bg" style="width:'+dataUnionLP[name]+'%"></span>\
                                </div>\
                            </li>\
                            <li class="fr">\
                                <div class="ht-rate-wrap ht-big-height" title="占比'+rightPercent+'%">\
                                    <span class="ht-green-bg" style="width:'+rightPercent+'%"></span>\
                                </div>\
                            </li>\
                        </ul>';
                    }else{
                        str += '\
                        <ul class="ht-full-width">\
                            <li><p>'+name+'</p></li>\
                            <li class="ht-rate-wrap ht-big-height" title="占比'+dataUnionLP[name]+'%">\
                                <span class="ht-blue-bg" style="width:'+dataUnionLP[name]+'%"></span>\
                            </li>\
                        </ul>';
                    }
                })
            }
        }

        $('#bs_city_list').removeClass('ht-lr-rate-list ht-rate-list-wrap').addClass('ht-rate-list-wrap').html(str);
    },
    _htmlDataLevel:function () {
        var str = '';
        if(M_Init._dateCache['projectRightData']){
            F_GameTieba_Info._formatDataLevel('all');
        }else{
            F_GameTieba_Info._formatDataLevel('left');
        }
    },
    _htmlGender:function () {
        var womenStr = '';
        var manStr = '';
        var unionStr = '';
        var iconClass = '';
        var lineClass = '';
        var str = '<div class="ht-table-signs">' + M_Init._dateCache['iconStr'] + '</div>';
        var dataLoop = ['男','女'];
        if(M_Init._dateCache['projectRightData']){
            var dataUnionL = M_Init._dateCache['projectLeftData'].sex_distri;
            var dataUnionR = M_Init._dateCache['projectRightData'].sex_distri;
            var dataUnionRRest = {};
            var dataUnionLRest = {};
            var sumRight = 0;
            var sumLeft = 0;
            for(var i=0;i<dataUnionR.length;i++){
                $.each(dataUnionR[i],function (name,value) {
                    dataUnionRRest[name] = value
                    sumRight += parseInt(value);
                })
            }
            for(var i=0;i<dataUnionL.length;i++){
                $.each(dataUnionL[i],function (name,value) {
                    dataUnionLRest[name] = value;
                    sumLeft += parseInt(value);
                })
            }
            dataUnionR = dataUnionRRest;
            dataUnionL = dataUnionLRest;
            var rightPercent = 0;
            var leftPercent = 0;
            for(var i=0;i<dataLoop.length;i++){
                if(sumLeft != 0){
                    if(dataUnionL && dataUnionL[dataLoop[i]]){
                        leftPercent = ((parseFloat(dataUnionL[dataLoop[i]])/sumLeft)*100).toFixed(1);
                    }else{
                        leftPercent = 0;
                    }
                }
                if(sumRight != 0){
                    if(dataUnionR && dataUnionR[dataLoop[i]]){
                        rightPercent = ((parseFloat(dataUnionR[dataLoop[i]])/sumRight)*100).toFixed(1);
                    }else{
                        rightPercent = 0;
                    }
                }
                if(dataLoop[i] == '男'){
                    unionStr = '<ul class="ht-rate ht-border-bottom">';
                    iconClass = 'man-icon';
                }else{
                    unionStr = '<ul class="ht-rate">';
                    iconClass = 'woman-icon';
                }
                unionStr += '\
                        <li class="fl">\
                            <div class="top"><i class="'+iconClass+'"></i><p class="ht-blue-text">'+leftPercent+'%</p><span>'+dataLoop[i]+'性用户占比</span></div>\
                            <div class="ht-rate-wrap ht-big-height">\
                                <span class="ht-blue-bg" style="width: '+leftPercent+'%"></span>\
                            </div>\
                        </li>\
                        <li class="fr">\
                            <div class="top"><i class="green-'+iconClass+'"></i><p class="ht-green-text">'+rightPercent+'%</p><span>'+dataLoop[i]+'性用户占比</span></div>\
                            <div class="ht-rate-wrap ht-big-height">\
                                <span class="ht-green-bg" style="width: '+rightPercent+'%"></span>\
                            </div>\
                        </li>';

                unionStr += '</ul>';

                if(dataLoop[i] == '男'){
                    manStr = unionStr;
                }else{
                    womenStr = unionStr;
                }
            }
        }else {
            var dataUnionRest = {};
            var dataUnion = M_Init._dateCache['projectLeftData'].sex_distri;
            var sum = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    sum += parseInt(value);
                    dataUnionRest[name] = value;
                })
            }
            dataUnion = dataUnionRest;
            var percent = 0;
            for(var i=0;i<dataLoop.length;i++) {
                if(sum != 0){
                    percent = ((parseFloat(dataUnion[dataLoop[i]])/sum)*100).toFixed(1);
                }
                if(dataLoop[i] == '男'){
                    unionStr = '<ul class="ht-rate ht-border-bottom">';
                    lineClass = 'ht-blue-bg';
                    iconClass = 'man-icon';
                } else {
                    unionStr = '<ul class="ht-rate">';
                    lineClass = 'ht-green-bg';
                    iconClass = 'green-woman-icon';
                }
                unionStr += '\
                        <li class="fl ht-full-width">\
                            <div class="top">\
                                <i class="'+iconClass+'"></i>\
                                <p class="ht-blue-text">'+percent+'%</p>\
                                <span>'+dataLoop[i]+'性用户占比</span>\
                            </div>\
                            <div class="ht-rate-wrap ht-big-height">\
                                <span class="'+lineClass+' fl" style="width: '+percent+'%"></span>\
                            </div>\
                        </li>';

                unionStr += '</ul>';
                if(dataLoop[i] == '男'){
                    manStr = unionStr;
                }else{
                    womenStr = unionStr;
                }
            }
        }
        $('#bs_gender_area').html(str+manStr+womenStr);
    },
    _htmlDataItem:function () {
        var str = '';
        if(!M_Init._dateCache['itemHidden'])M_Init._dateCache['itemHidden'] = {};
        var dataUnionH = M_Init._dateCache['itemHidden'];
        if(M_Init._dateCache['projectRightData']){
            var dataUnionL = M_Init._dateCache['projectLeftData'].interest_distri;
            var dataUnionR = M_Init._dateCache['projectRightData'].interest_distri;
            var sumLeft = 0;
            var sumRight = 0;
            var dataUnionRReset = {};

            if(dataUnionR && dataUnionR.length > 0){
                for(var i=0;i<dataUnionR.length;i++){
                    $.each(dataUnionR[i],function (name,value) {
                        if(!dataUnionH[name]){
                            sumRight += parseInt(value);
                        }
                        dataUnionRReset[name] = value;
                    })
                }
                dataUnionR = dataUnionRReset;
            }
            for(var i=0;i<dataUnionL.length;i++){
                $.each(dataUnionL[i],function (name,value) {
                    if(!dataUnionH[name]){
                        sumLeft += parseInt(value);
                    }
                })
            }
            var percentL = 0;
            var percentR = 0;
            var buttonStr = '';
            for(var i=0;i<dataUnionL.length;i++){
                $.each(dataUnionL[i],function (name,value) {
                    if(dataUnionH[name]){
                        buttonStr = '<button class="tg-assist-btn" data-t="'+name+'">取消隐藏</button>';
                        percentL = 0;
                        percentR = 0;
                    }else{
                        if(sumLeft != 0){
                            percentL = ((parseFloat(value)/sumLeft)*100).toFixed(1);
                        }
                        if(sumRight != 0){
                            if(dataUnionR[name]){
                                percentR = ((parseFloat(dataUnionR[name])/sumRight)*100).toFixed(1);
                            }else{
                                percentR = 0;
                            }
                        }
                        buttonStr = '<button class="tg-assist-btn" data-t="'+name+'">隐藏该类</button>';
                    }

                    str += '\
                        <ul>\
                            <li><span>'+name+'</span></li>\
                            <li class="rate-list">\
                                <div class="ht-rate-wrap fl" title="占比：'+percentL+'%">\
                                    <span class="ht-blue-bg fr" style="width: '+percentL+'%"></span>\
                                </div>\
                                <div class="ht-rate-wrap fr" title="占比：'+percentR+'%">\
                                    <span class="ht-green-bg fl" style="width: '+percentR+'%"></span>\
                                </div>\
                            </li>'+buttonStr+'\
                        </ul>';
                })
            }
        }else{
            var dataUnion = M_Init._dateCache['projectLeftData'].interest_distri;
            var sum = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    if(!dataUnionH[name]){
                        sum += parseInt(value);
                    }
                })
            }
            var percent = 0;
            var buttonStr = '';
            for(var i=0;i<dataUnion.length;i++) {
                $.each(dataUnion[i], function (name, value) {
                    if(dataUnionH[name]){
                        buttonStr = '<button class="tg-assist-btn" data-t="'+name+'">取消隐藏</button>';
                        percent = 0;
                    }else{
                        if(sum != 0){
                            percent = ((parseFloat(value)/sum)*100).toFixed(1);
                        }
                        buttonStr = '<button class="tg-assist-btn" data-t="'+name+'">隐藏该类</button>';
                    }
                    str += '\
                        <ul>\
                            <li><p>'+name+'</p></li>\
                            <li class="rate-list">\
                                <div class="ht-rate-wrap fl ht-full-width" title="占比：'+percent+'%">\
                                    <span class="ht-blue-bg" style="width: '+percent+'%"></span>\
                                </div>\
                            </li>'+buttonStr+'\
                        </ul>';
                })
            }
        }
        $('#bs_item_list').html(str);

        $('#bs_item_list button').each(function () {
            $(this).click(function () {
                var type = $(this).text();
                var classify = $(this).attr('data-t');
                if(!M_Init._dateCache['itemHidden'])M_Init._dateCache['itemHidden'] = {};
                if(type == '隐藏该类'){
                    M_Init._dateCache['itemHidden'][classify] = true;
                }else{
                    M_Init._dateCache['itemHidden'][classify] = null;
                }
                F_GameTieba_Info._htmlDataItem();
            });
        });
    },
    _htmlItem:function () {
        var str = '<div class="ht-table-signs ht-border-bottom">' + M_Init._dateCache['iconStr'] + '</div>';
        str += '<div class="ht-focus-list-rate" id="bs_item_list"></div>';
        $('#bs_item').html(str);
        F_GameTieba_Info._htmlDataItem();
    },
    _htmlRank:function () {
        var str = '';
        $('#bs_rank_icon').html(M_Init._dateCache['iconStr']);
        if(!M_Init._dateCache['rankClassifyChoosed'])M_Init._dateCache['rankClassifyChoosed'] = 'attention_global_distri';
        if(M_Init._dateCache['projectRightData']){
            var dataUnion = M_Init._dateCache['projectLeftData'][M_Init._dateCache['rankClassifyChoosed']];
            var sum = 0;
            var percent = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    sum += parseInt(value);
                })
            }
            str += '<div class="bs_scroll_rank">';
            str += '<ul>';
            for(var i=0;i<dataUnion.length;i++){
                //if(i>=10)break;
                $.each(dataUnion[i],function (name,value) {
                    if(sum != 0){
                        percent = ((parseFloat(value)/sum)*100).toFixed(1);
                    }
                    str += '<li><span title="'+name+'">'+M_Common._sourceUrl("tieba",name)+'</span><div class="ht-rate-wrap" title="排名：'+(i+1)+'　占比：'+percent+'%"><span style="width: '+percent+'%"></span></div></li>';
                })
            }
            str += '</ul>';
            str += '</div>';

            dataUnion = M_Init._dateCache['projectRightData'][M_Init._dateCache['rankClassifyChoosed']];
            sum = 0;
            percent = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    sum += parseInt(value);
                })
            }
            str += '<div class="bs_scroll_rank">';
            str += '<ul class="green">';
            for(var i=0;i<dataUnion.length;i++){
                //if(i>=10)break;
                $.each(dataUnion[i],function (name,value) {
                    if(sum != 0){
                        percent = ((parseFloat(value)/sum)*100).toFixed(1);
                    }
                    str += '<li><span title="'+name+'">'+M_Common._sourceUrl("tieba",name)+'</span><div class="ht-rate-wrap" title="排名：'+(i+1)+'　占比：'+percent+'%"><span style="width: '+percent+'%"></span></div></li>';
                })
            }
            str += '</ul>';
            str += '</div>';
        }else{
            var dataUnion = M_Init._dateCache['projectLeftData'][M_Init._dateCache['rankClassifyChoosed']];
            var sum = 0;
            var percent = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    sum += parseInt(value);
                })
            }
            str += '<div class="ht-full-width bs_scroll_rank">';
            str += '<ul>';
            for(var i=0;i<dataUnion.length;i++){
                //if(i>=10)break;
                $.each(dataUnion[i],function (name,value) {
                    if(sum != 0){
                        percent = ((parseFloat(value)/sum)*100).toFixed(1);
                    }
                    str += '<li><span title="'+name+'">'+M_Common._sourceUrl("tieba",name)+'</span><div class="ht-rate-wrap" title="排名：'+(i+1)+'　占比：'+percent+'%"><span style="width: '+percent+'%"></span></div></li>';
                })
            }
            str += '</ul>';
            str += '</div>';
        }

        $('#bs_rank').html(str);
        $('#bs_rank .bs_scroll_rank').perfectScrollbar();
    },
    _htmlKeyword:function () {
        var str = '<div class="ht-table-signs ht-border-bottom">' + M_Init._dateCache['iconStr'] + '</div>';
        str += '<div class="ht-lr-rate-list">';
        if(M_Init._dateCache['projectRightData']){
            var dataUnion = M_Init._dateCache['projectLeftData'].keywords_distri;
            var sum = 0;
            var percent = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    sum += parseInt(value);
                })
            }
            str += '<div class="bs_scroll_keyword">';
            str += '<ul>';
            for(var i=0;i<dataUnion.length;i++){
                //if(i>=10)break;
                $.each(dataUnion[i],function (name,value) {
                    if(sum != 0){
                        percent = ((parseFloat(value)/sum)*100).toFixed(1);
                    }
                    str += '<li><span title="'+name+'">'+name+'</span><div class="ht-rate-wrap" title="排名：'+(i+1)+'　占比：'+percent+'%"><span style="width: '+percent+'%"></span></div></li>';
                })
            }
            str += '</ul>';
            str += '</div>';

            dataUnion = M_Init._dateCache['projectRightData'].keywords_distri;
            sum = 0;
            percent = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    sum += parseInt(value);
                })
            }
            str += '<div class="bs_scroll_keyword">';
            str += '<ul class="green">';
            for(var i=0;i<dataUnion.length;i++){
                //if(i>=10)break;
                $.each(dataUnion[i],function (name,value) {
                    if(sum != 0){
                        percent = ((parseFloat(value)/sum)*100).toFixed(1);
                    }
                    str += '<li><span title="'+name+'">'+name+'</span><div class="ht-rate-wrap" title="排名：'+(i+1)+'　占比：'+percent+'%"><span style="width: '+percent+'%"></span></div></li>';
                })
            }
            str += '</ul>';
            str += '</div>';
        }else{
            var dataUnion = M_Init._dateCache['projectLeftData'].keywords_distri;
            var sum = 0;
            var percent = 0;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    sum += parseInt(value);
                })
            }
            str += '<div class="ht-full-width bs_scroll_keyword">';
            str += '<ul>';
            for(var i=0;i<dataUnion.length;i++){
                //if(i>=10)break;
                $.each(dataUnion[i],function (name,value) {
                    if(sum != 0){
                        percent = ((parseFloat(value)/sum)*100).toFixed(1);
                    }
                    str += '<li><span title="'+name+'">'+name+'</span><div class="ht-rate-wrap" title="排名：'+(i+1)+'　占比：'+percent+'%"><span style="width: '+percent+'%"></span></div></li>';
                })
            }
            str += '</ul>';
            str += '</div>';
        }
        str += '</div>';
        $('#bs_keyword').html(str);
        $('#bs_keyword .bs_scroll_keyword').perfectScrollbar();
    },
    _formatDevice:function (dataUnionL,dataUnionR) {
        var str = '';
        if(M_Init._dateCache['projectRightData']) {
            var dataUnionRReset = {};
            var sumLeft = 0;
            var sumRight = 0;
            for (var i = 0; i < dataUnionR.length; i++) {
                $.each(dataUnionR[i], function (name, value) {
                    sumRight += parseInt(value);
                    dataUnionRReset[name] = value;
                })
            }
            dataUnionR = dataUnionRReset;
            for (var i = 0; i < dataUnionL.length; i++) {
                $.each(dataUnionL[i], function (name, value) {
                    sumLeft += parseInt(value);
                })
            }
            var percentL = 0
            var percentR = 0;
            for (var i = 0; i < dataUnionL.length; i++) {
                $.each(dataUnionL[i], function (name, value) {
                    if (sumLeft != 0) {
                        percentL = ((parseFloat(value) / sumLeft) * 100).toFixed(1)
                    }
                    if (sumRight != 0) {
                        if(dataUnionR[name]){
                            percentR = ((parseFloat(dataUnionR[name]) / sumRight) * 100).toFixed(1)
                        }else{
                            percentR = 0;
                        }
                    }
                    str += '\
                        <div class="des-top"><img src="'+M_Outside._iconDevice(name)+'"><span>' + name + '用户</span></div>\
                        <ul class="ht-rate">\
                            <li class="fl">\
                                <div class="ht-rate-wrap ht-big-height" title="占比：' + percentL + '%">\
                                    <span class="ht-blue-bg" style="width: ' + percentL + '%"></span>\
                                </div>\
                            </li>\
                            <li class="fr">\
                                <div class="ht-rate-wrap ht-big-height" title="占比：' + percentR + '%">\
                                    <span class="ht-green-bg" style="width: ' + percentR + '%"></span>\
                                </div>\
                            </li>\
                        </ul>';
                })
            }
        }else{
            var sum = 0;
            for (var i = 0; i < dataUnionL.length; i++) {
                $.each(dataUnionL[i], function (name, value) {
                    sum += parseInt(value);
                })
            }
            var percent = 0;
            var lineClass = '';
            for (var i = 0; i < dataUnionL.length; i++) {
                if(i == 0){
                    lineClass = 'ht-blue-bg';
                }else{
                    lineClass = 'ht-green-bg';
                }
                $.each(dataUnionL[i], function (name, value) {
                    if (sum != 0) {
                        percent = ((parseFloat(value) / sum) * 100).toFixed(1)
                    }
                    str += '\
                        <div class="des-top"><img src="'+M_Outside._iconDevice(name)+'"><span>' + name + '用户</span></div>\
                        <ul class="ht-rate">\
                            <li class="fl ht-full-width">\
                                <div class="ht-rate-wrap ht-big-height" title="占比：' + percent + '%">\
                                    <span class="'+lineClass+'" style="width: ' + percent + '%"></span>\
                                </div>\
                            </li>\
                        </ul>';
                })
            }
        }
        return str;
    },
    _htmlDevice:function () {
        var str = ''
        if(M_Init._dateCache['projectRightData']){
            str = '<div class="ht-rate-list-wrap">';
            str += '<div class="ht-table-signs ht-border-bottom">' + M_Init._dateCache['iconStr'] + '</div>';
            str += F_GameTieba_Info._formatDevice(M_Init._dateCache['projectLeftData'].client_distri,M_Init._dateCache['projectRightData'].client_distri);
            str += '</div><div class="ht-rate-list-wrap">';
            str += F_GameTieba_Info._formatDevice(M_Init._dateCache['projectLeftData'].mobile_platform_distri,M_Init._dateCache['projectRightData'].mobile_platform_distri);
        }else{
            str = '<div class="ht-rate-list-wrap ht-single-rate">';
            str += '<div class="ht-table-signs ht-border-bottom">' + M_Init._dateCache['iconStr'] + '</div>';
            str += F_GameTieba_Info._formatDevice(M_Init._dateCache['projectLeftData'].client_distri);
            str += '</div><div class="ht-rate-list-wrap ht-single-rate">';
            str += F_GameTieba_Info._formatDevice(M_Init._dateCache['projectLeftData'].mobile_platform_distri);
        }
        str += '</div>';

        $('#bs_device').html(str);
    },
    _formatHour:function () {
        var chartDataPre = {color:['#3eaae2','#2bd184'],x_axis:[],y_axis:[],yFormat:'%',legendNotShow:true,tooltip:{ 'num': 1, 'unit': '%' }};
        if(M_Init._dateCache['projectRightData']){
            chartDataPre.tooltip['num'] = 2;
            chartDataPre.y_axis.push({'name':'贴吧用户',data:[]});
            chartDataPre.y_axis.push({'name':'对比贴吧用户',data:[]});
            var dataUnionL = M_Init._dateCache['projectLeftData'].post_hour_distri;
            var dataUnionR = M_Init._dateCache['projectRightData'].post_hour_distri;
            var dataUnionRReset = {};
            for(var i=0;i<dataUnionR.length;i++){
                $.each(dataUnionR[i],function (name,value) {
                    dataUnionRReset[name] = (value*100).toFixed(1);
                });
            }
            dataUnionR = dataUnionRReset;
            var rightData = 0;
            for(var i=0;i<dataUnionL.length;i++){
                $.each(dataUnionL[i],function (name,value) {
                    if(dataUnionR[name]){
                        rightData = parseFloat(dataUnionR[name]);
                    }else{
                        rightData = 0;
                    }
                    chartDataPre.x_axis.push(name);
                    chartDataPre.y_axis[0].data.push((value*100).toFixed(1));
                    chartDataPre.y_axis[1].data.push(rightData);
                });
            }
        }else{
            chartDataPre.y_axis.push({'name':'贴吧用户',data:[]});
            var dataUnion = M_Init._dateCache['projectLeftData'].post_hour_distri;
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    chartDataPre.x_axis.push(name);
                    chartDataPre.y_axis[0].data.push((value*100).toFixed(1));
                });
            }
        }
        M_Outside_Chart._chartData('line','bs_hour_chart',chartDataPre);
    },
    _htmlHour:function () {
        var str = '<div class="ht-table-signs ht-border-bottom">' + M_Init._dateCache['iconStr'] + '</div>';
        str += '<div class="graph-part cursor-default"><div id="bs_hour_chart" style="width: 100%; height: 100%"></div></div>';

        $('#bs_hour').html(str);
        F_GameTieba_Info._formatHour();

    },
    _formatDistribute:function (showType,type,domId) {
        var chartDataPre = {color: ['#3eaae2', '#2bd184'],x_axis: [],y_axis: [],legendNotShow: true};
        var chartType = '';
        switch (showType) {
            case 'percent':
                chartDataPre['yFormat'] = '%';
                chartDataPre['tooltip'] = {'num': 1, 'unit': '%'};
                chartType = 'bar';
                break;
            default:
                chartDataPre['yFormat'] = '';
                chartDataPre['tooltip'] = null;
                chartType = 'bar';
                break;
        }
        if(M_Init._dateCache['projectRightData']){
            chartDataPre.y_axis.push({'name':'贴吧用户',data:[]});
            chartDataPre.y_axis.push({'name':'对比贴吧用户',data:[]});
            var dataUnionL = [];
            var dataUnionR = [];
            switch (type){
                case 'age':
                    dataUnionL = M_Init._dateCache['projectLeftData'].age_distri;
                    dataUnionR = M_Init._dateCache['projectRightData'].age_distri;
                    break;
                case 'fans':
                    dataUnionL = M_Init._dateCache['projectLeftData'].fans_num_distri;
                    dataUnionR = M_Init._dateCache['projectRightData'].fans_num_distri;
                    break;
            }
            switch (showType){
                case 'percent':
                    chartDataPre.tooltip.num = 2;
                    dataUnionL = M_Common._percent('age',dataUnionL);
                    dataUnionR = M_Common._percent('age',dataUnionR);
                    break;
            }
            var dataUnionRReset = {};
            for(var i=0;i<dataUnionR.length;i++){
                $.each(dataUnionR[i],function (name,value) {
                    dataUnionRReset[name] = parseFloat(value).toFixed(1);
                });
            }
            dataUnionR = dataUnionRReset;
            var rightData = 0;
            for(var i=0;i<dataUnionL.length;i++){
                $.each(dataUnionL[i],function (name,value) {
                    if(dataUnionR[name]){
                        rightData = parseFloat(dataUnionR[name]);
                    }else{
                        rightData = 0;
                    }
                    chartDataPre.x_axis.push(name);
                    chartDataPre.y_axis[0].data.push(parseFloat(value).toFixed(1));
                    chartDataPre.y_axis[1].data.push(rightData);
                });
            }
        }else{
            chartDataPre.y_axis.push({'name':'贴吧用户',data:[]});
            var dataUnion = [];
            switch (type){
                case 'age':
                    dataUnion = M_Init._dateCache['projectLeftData'].age_distri;
                    break;
                case 'fans':
                    dataUnion = M_Init._dateCache['projectLeftData'].fans_num_distri;
                    break;
            }
            switch (showType){
                case 'percent':
                    dataUnion = M_Common._percent('age',dataUnion);
                    break;
            }
            for(var i=0;i<dataUnion.length;i++){
                $.each(dataUnion[i],function (name,value) {
                    chartDataPre.x_axis.push(name);
                    chartDataPre.y_axis[0].data.push(parseFloat(value).toFixed(1));
                });
            }
        }
        M_Outside_Chart._chartData(chartType,domId,chartDataPre);
    },
    _htmlDistribute:function (type) {
        var domId = '';
        var dom = '';
        switch (type){
            case 'age':
                domId = 'bs_distribute_chart';
                dom = $('#bs_distribute');
                break;
            case 'fans':
                domId = 'bs_fans_chart';
                dom = $('#bs_fans');
                break;
        }

        var str = '<div class="ht-table-signs ht-border-bottom">' + M_Init._dateCache['iconStr'];
        str += '<div class="fr">';
        str += '<span>按比例</span>';
        str += '<div class="switch-btn"><input type="checkbox" name="checkbox_'+type+'" data-i="'+type+'Percent" /></div>';
        str += '</div></div>';
        str += '<div class="graph-part cursor-default"><div id="'+domId+'" style="width: 100%; height: 100%"></div></div>';

        dom.html(str);

        F_GameTieba_Info._formatDistribute('number',type,domId);

        $('input[name="checkbox_'+type+'"]').bootstrapSwitch('size', 'small');
        $('input[name="checkbox_'+type+'"]').on('switchChange.bootstrapSwitch', function (event, state) {
            var type = $(this).attr('data-i');
            switch (type) {
                case 'agePercent':
                    if (state) {
                        F_GameTieba_Info._formatDistribute('percent','age','bs_distribute_chart');
                    } else {
                        F_GameTieba_Info._formatDistribute('number','age','bs_distribute_chart');
                    }
                    break;
                case 'fansPercent':
                    if (state) {
                        F_GameTieba_Info._formatDistribute('percent','fans','bs_fans_chart');
                    } else {
                        F_GameTieba_Info._formatDistribute('number','fans','bs_fans_chart');
                    }
                    break;
            }
        });

    },
    _htmlSummary:function () {
        var str = '';
        var game = '';
        var gameName = '';
        if(M_Init._gameDetailId){
            game = B_Game._getGame([M_Init._gameDetailId],1);
            if(game && game[M_Init._gameDetailId])gameName = game[M_Init._gameDetailId][1];
        }
        str += '\
            <div class="blue-part">\
                <span>贴吧用户</span>\
                <div>\
                    <b class="ht-blue-bg"></b>\
                    <p title="'+gameName+'">'+gameName+'</p>\
                    <b>共 '+M_Init._dateCache['projectLeftData']['user_num']+'人</b>\
                </div>\
            </div>';

        if(M_Init._dateCache['projectRightData']) {
            gameName = '';
            game = B_Game._getGame([M_Init._gameIdRight],1);
            if(game && game[M_Init._gameIdRight])gameName = game[M_Init._gameIdRight][1];
            str += '\
                <div class="green-part">\
                    <span>对比贴吧用户</span>\
                    <div>\
                        <b class="ht-green-bg"></b>\
                        <p title="'+gameName+'">'+gameName+'</p>\
                        <b>共 '+M_Init._dateCache['projectRightData']['user_num']+'人</b>\
                    </div>\
                </div>';
        }

        $('#bs_summary').html(str);
    },
    _htmlInit:function () {
        var str = '';
        str += '\
            <div class=" blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                <h3 class="tip-hover">用户概览\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">所选样本的具体贴吧数据来源及样本总量</div>\
                    </div>\
                </h3>\
                <div class="boxshadow ht-filter-list" id="bs_summary"></div>\
             </div>';

        str += '\
            <div class=" blockpart  col-lg-8 col-md-8 col-sm-12 col-xs-12">\
                <h3>地域分布</h3>\
                <div class="boxshadow ht-area-distribute ht-graph-wrapper">\
                    <div class="graph-part cursor-default" id="bs_map_area"></div>\
                    <div class="ht-city-list" id="bs_map_list"></div>\
                </div>\
            </div>';

        str += '\
            <div class=" blockpart col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                <h3>男女比例</h3>\
                <div class="boxshadow ht-people-contrast ht-single-rate" id="bs_gender_area"></div>\
            </div>';

        str += '\
              <div class=" blockpart col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                  <h3 class="tip-hover">关注类目比例分布\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">按照8大类目划分，用户对各大类的关注占比，也可隐藏指定类目</div>\
                    </div>\
                  </h3>\
                  <div class="boxshadow" id="bs_item"></div>\
              </div>';

        var rankClassify = [
                {'key':'attention_global_distri','name':'全部类目'},
                {'key':'attention_sports_distri','name':'体育'},
                {'key':'attention_comic_distri','name':'动漫'},
                {'key':'attention_movie_distri','name':'影视'},
                {'key':'attention_literature_distri','name':'文学'},
                {'key':'attention_tec_distri','name':'科技'},
                {'key':'attention_star_distri','name':'追星'},
                {'key':'attention_music_distri','name':'音乐'},
                {'key':'attention_game_distri','name':'游戏'}
            ];

        str += '\
            <div class=" blockpart  col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                <h3 class="tip-hover">关注贴吧排名\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">按照8大类目划分，用户对各类的具体贴吧关注排名</div>\
                    </div>\
                </h3>\
                <div class="boxshadow">\
                    <div class="ht-table-signs ht-border-bottom">'+M_Outside._dropKVHtml('bs_rank_choose', '贴吧类目', rankClassify)+'\
                        <div id="bs_rank_icon"></div>\
                    </div>\
                    <div class="ht-lr-rate-list" id="bs_rank"></div>\
                </div>\
            </div>';

        str += '\
            <div class=" blockpart col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                <h3 class="tip-hover">关键词排名\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">样本用户的讨论中常用到的关键词</div>\
                    </div>\
                </h3>\
                <div class="boxshadow" id="bs_keyword"></div>\
            </div>';


        str += '\
            <div class=" blockpart  col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                <h3 class="tip-hover">上网设备属性\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">样本用户中，主要的上网设备</div>\
                    </div>\
                </h3>\
                <div class="boxshadow ht-people-contrast" id="bs_device"></div>\
            </div>';

        str += '\
            <div class="blockpart col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                <h3 class="tip-hover">活跃时间段分布\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">样本用户中，分小时的上网比例分布图</div>\
                    </div>\
                </h3>\
                <div class="boxshadow ht-graph-wrapper" id="bs_hour"></div>\
            </div>';

        str += '\
            <div class="blockpart col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                <h3 class="tip-hover">吧龄分布\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">样本用户中，贴吧吧龄的分布情况</div>\
                    </div>\
                </h3>\
                <div class="boxshadow ht-graph-wrapper" id="bs_distribute"></div>\
            </div>';

        str += '\
            <div class="blockpart col-lg-4 col-md-4 col-sm-12 col-xs-12">\
                <h3 class="tip-hover">粉丝魅力分析\
                    <div class="tip-box-show">\
                            <i class="triangle-up"></i>\
                            <div class="tip-box-content">样本用户中，个人粉丝数的分布情况</div>\
                    </div>\
                </h3>\
                <div class="boxshadow ht-graph-wrapper" id="bs_fans"></div>\
            </div>';

        $('#ct_main_area').html(str);
    },
    _domInit:function () {
        $('#contentPart').addClass('ht-backstage').removeClass('insidelog-part');

        F_GameTieba_Info._htmlInit();
        if(M_Init._gameIdRight){
            setTimeout(function () {
                F_GameTieba_Info._getInfo('right')
            },500);
        }
        F_GameTieba_Info._getInfo('left');

        M_Outside._dropShow();
        M_Outside._dropLeave();
        M_Outside._dropSelected(function (key) {
            M_Init._dateCache['rankClassifyChoosed'] = key;
            F_GameTieba_Info._htmlRank();
        },'bs_rank_choose');
    },
    _getInfo:function (dom) {
        var postData = {};
        if($('.b_empty').length > 0){
            F_GameTieba_Info._htmlInit();
        }
        switch (dom){
            case 'left':
                if(M_Init._gameDetailId){
                    postData['project_id'] = M_Init._gameDetailId;
                }else{
                    F_GameTieba_Info._empty();
                    return false;
                }
                break;
            case 'right':
                if(M_Init._gameIdRight){
                    postData['project_id'] = M_Init._gameIdRight;
                }else{
                    F_GameTieba_Info._getData();
                    return false;
                }
                break;
        }
        postData = B_Common._postData(postData);
        B_Port._ajax('profileTiebaProject','get',true,postData,function () {
                B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
            },function () {
                B_Pop._init('close');
            },function(data,msg){
                data['province_distri_percent'] = M_Common._formatPercent(data['province_distri']);
                data['city_level_distri_percent'] = M_Common._formatPercent(data['city_level_distri']);
                switch (dom){
                    case 'left':
                        M_Init._dateCache['projectLeftData'] = data;
                        break;
                    case 'right':
                        M_Init._dateCache['projectRightData'] = data;
                        break;
                }
                F_GameTieba_Info._getData();
            },function (data,msg,code) {
                F_GameTieba_Info._empty(msg);
            }
        )
    },
    _getData:function () {
        var isComplete = false;
        if(M_Init._gameIdRight){
            if(M_Init._dateCache['projectRightData'] && M_Init._dateCache['projectLeftData'])isComplete = true;
        }else{
            if(M_Init._dateCache['projectLeftData'])isComplete = true;
        }
        if(isComplete){
            if(M_Init._gameIdRight){
                M_Init._dateCache['iconStr'] = '<b class="ht-blue-bg"></b><span>贴吧用户</span> <b class="ht-green-bg"></b><span>对比贴吧用户</span>';
            }else{
                M_Init._dateCache['iconStr'] = '<b class="ht-blue-bg"></b><span>贴吧用户</span>';
            }
            F_GameTieba_Info._htmlSummary();
            F_GameTieba_Info._htmlMap();
            F_GameTieba_Info._htmlGender();
            F_GameTieba_Info._htmlItem();
            F_GameTieba_Info._htmlRank();
            F_GameTieba_Info._htmlKeyword();
            F_GameTieba_Info._htmlDevice();
            F_GameTieba_Info._htmlHour();
            F_GameTieba_Info._htmlDistribute('age');
            F_GameTieba_Info._htmlDistribute('fans');
        }
    }
}