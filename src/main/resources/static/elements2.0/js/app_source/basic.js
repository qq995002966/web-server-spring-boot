var F_Basic_Entrance = {
    _init:function (unionId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(4);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    $('#gameDropChoose').show();
                    B_Pop._init('close');
                    M_Init._api['playerCluster'] = 'demoPlayerCluster';
                    M_Init._api['playerTag'] = 'demoPlayerTag';
                    M_Init._api['clusterType'] = 'demoClusterType';
                    M_Init._api['innerSearchMeta'] = 'demoInnerSearchMeta';
                    M_Init._api['playerData'] = 'demoPlayerData';
                    M_Init._api['innerSearchCsv'] = 'demoInnerSearchCsv';
                    M_Init._api['searchExcel'] = 'demoSearchExcel';
                    break;
                default:
                    M_Init._api['playerCluster'] = 'playerCluster';
                    M_Init._api['playerTag'] = 'playerTag';
                    M_Init._api['clusterType'] = 'clusterType';
                    M_Init._api['innerSearchMeta'] = 'innerSearchMeta';
                    M_Init._api['playerData'] = 'playerData';
                    M_Init._api['searchExcel'] = 'searchExcel';
                    break;
            }
            $('#headerTop').html('');
            var gameId = '';
            if(unionId){
                unionId = unionId.split('-');
                if(unionId.length == 3){
                    gameId = unionId[0];
                    M_Init._searchKeyword = unionId[1];
                    M_Init._dataCache['columnType'] = unionId[1];
                    M_Init._dataCache['userType'] = unionId[2];
                    var dataUnion = F_Basic_Info._configClassify;
                    for(var i=0;i<dataUnion.length;i++){
                        if(dataUnion[i].id == M_Init._dataCache['userType']){
                            M_Init._dataCache['userTypeName'] = dataUnion[i].name;
                            break;
                        }
                    }
                }
                if(unionId.length == 1){
                    M_Init._gameIdRight = unionId[0];
                }
            }
            M_Common._getOrderGame('basic',gameId,'8-3');
        }
    }
}

var F_Basic_Info = {
    _cache:{},
    _htmlInit:function (type) {
        var str = '';
        switch (type){
            case 'detail':
                str += '<div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12 ">';
                str += '<h3 id="bs_detail_tag_title">'+M_Init._dataCache['columnType']+'类型'+M_Init._dataCache['userTypeName']+'特征描述</h3>';
                str += '<div class="boxshadow player-multi-tags"></div>';
                str += '</div>';
                str += '<div class="blockpart  tg-table-layout col-lg-12 col-md-12 col-sm-12 col-xs-12"><h3 id="bs_column_name">'+M_Init._searchKeyword+'类型'+M_Init._dataCache['userTypeName']+' ID 列表'+'</h3>';
                str += '<div class="boxshadow tg-table-content">';
                str += '<div class="tg-top-word-tab" id="bs_content_tag"></div>';
                str += '<div class="tg-table-wrap tg-table-no-padding" id="bs_content_list"><div class="table-out-wrap no-margin-top">';
                str += '<table class="tg-table table table-bordered"><thead class="boxshadow"></thead><tbody></tbody></table>';
                str += '</div><ul class="tg-page-list" id="lt_forum_page"></ul></div>';
                str += '</div></div>';
                break;
            default:
                str += '<div class="blockpart  col-lg-12 col-md-12 col-sm-12 col-xs-12 ">';
                str += '<h3>玩家特征描述</h3>';
                str += '<div class="boxshadow player-multi-tags"></div>';
                str += '</div>';
                str += '<div class="row all-player-tags col-lg-12 col-md-12 col-sm-12 col-xs-12 "><h3 id="bs_column_name"></h3><div id="bs_radar_list"></div></div>';
                break;
        }
        $('#ct_main_area').html(str);
    },
    _htmlColumnName:function (type) {
        var name = '';
        switch (type){
            case 'detail':
                name = M_Init._searchKeyword+'类型-'+M_Init._dataCache['userTypeName']+' ID 列表';
                $('#bs_detail_tag_title').html(M_Init._searchKeyword+'类型-'+M_Init._dataCache['userTypeName']+'特征描述');
                $('#bs_notice_name').html(M_Init._searchKeyword+'类型-'+M_Init._dataCache['userTypeName']);
                break;
            default:
                var selectData = F_Basic_Info._configClassify;
                for(var i=0;i<selectData.length;i++){
                    if(M_Init._gameIdRight == selectData[i].id){
                        name = selectData[i].name;
                        M_Init._dataCache['userTypeName'] = selectData[i].name;
                        break;
                    }
                }
                name += '群体构成';
                break;
        }

        $('#bs_column_name').html(name);
    },
    _configClassify:[{id:'active',name:'活跃玩家'},{id:'paid',name:'付费玩家'},{id:'lost',name:'流失玩家'}],
    _getInfo:function () {
        if (M_Init._searchKeyword) {
            var dom = $('#ct_main_area');
            F_Basic_Info._htmlInit('detail');

            var postData = {};
            postData['game_id'] = M_Init._gameId;
            postData = B_Common._postData(postData);
            B_Port._ajax(M_Init._api['clusterType'],'get',true,postData,function(){
                    B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
                },function(){
                    B_Pop._init('close');
                },function(data,msg){
                    if(data && data.length > 0){
                        var selectData = [];
                        var isHasSelected = false;
                        var selectedData = {};
                        for(var i=0;i<data.length;i++){
                            selectData.push({id:data[i],name:data[i]+'类型-'+M_Init._dataCache['userTypeName']});
                            if(data[i]+'' == M_Init._searchKeyword){
                                isHasSelected = true;
                                selectedData = {id:data[i],name:data[i]+'类型-'+M_Init._dataCache['userTypeName']}
                            }
                        }
                        if(!isHasSelected){
                            selectedData = {id:data[0],name:data[0]}
                            M_Init._searchKeyword = data[0];
                            F_Basic_Info._htmlColumnName('detail');
                        }
                        var info = '<a class="tg-assist-btn" id="bs_btn_back">返回上一级</a><div class="fr analysis-data-des">\
                                        <span>本次共分析:<b id="bs_number"></b>位<b id="bs_notice_name"> '+M_Init._searchKeyword+'类型-'+M_Init._dataCache['userTypeName']+'</b></span>\
                                        <a class="tg-main-btn" id="bs_btn_down">ID导出</a>\
                                     </div>';

                        $('#headerTop').html(M_Inside._dropHtml('bs_type','选择分析对象:',selectedData,selectData)+info);

                        $('#bs_btn_back').click(function () {
                            var url = B_Jump._getUrl('operateBasic',{type:M_Init._dataCache['userType']});
                            B_Jump._go('base',url);
                        });
                        M_Inside._dropShow('tg-selected-drop');
                        M_Inside._dropSelected(function (select,position) {
                            M_Init._searchKeyword = select;
                            M_Init._dataCache['columnType'] = select;
                            F_Basic_Info._htmlColumnName('detail');
                            F_Basic_Info._getBase();
                            M_Operate._getDetail(1);
                        },'tg-selected-drop');
                        M_Inside._dropLeave('tg-selected-drop');

                        F_Basic_Info._getBase();
                        M_Operate._getTag();
                        M_Operate._download();
                    }else{
                        dom.html(B_Pre._empty('暂无数据'));
                    }
                },function(data,msg,code){
                    dom.html(B_Pre._empty(msg));
                }
            )
        }else{
            var selectData = F_Basic_Info._configClassify;
            if(!M_Init._gameIdRight){
                M_Init._gameIdRight = 'active';
            }
            var selected = {};
            M_Init._dataCache['selectedName'] = '';
            for(var i=0;i<selectData.length;i++){
                if(selectData[i].id == M_Init._gameIdRight){
                    selected = selectData[i];
                    M_Init._dataCache['userTypeName'] = selectData[i].name;
                    break;
                }
            }
            F_Basic_Info._htmlInit();
            F_Basic_Info._htmlColumnName();
            $('#headerTop').html(M_Inside._dropHtml('bs_classify','选择分析对象:',selected,selectData));
            F_Basic_Info._getBase();
            F_Basic_Info._getRadar();
            M_Inside._dropShow('tg-selected-drop');
            M_Inside._dropSelected(function (select,position) {
                M_Init._gameIdRight = select;
                F_Basic_Info._htmlColumnName();
                F_Basic_Info._getBase();
                F_Basic_Info._getRadar();
            },'tg-selected-drop');
            M_Inside._dropLeave('tg-selected-drop');
        }
    },

    _htmlBaseItem:function (useClass,data) {
        var str = '';
        str += '<div class="tg-list">';
        str += '<h4>'+data.name+'</h4>';
        str += '<img src="elements2.0/img/tag/'+useClass['img']+'" alt="">';
        str += '<ul class="column-list">';
        var dataUnion = data.data;
        for(var i=0;i<dataUnion.length;i++){
            str += F_Basic_Info._htmlBaseItemList(useClass['class']+(i+1),dataUnion[i]);
        }
        str += '</ul>';
        str += '<div class="line '+useClass['class']+'1"></div>';
        str += '</div>';
        return str;
    },
    _htmlBaseItemList:function (useClass,data) {
        data.value = (data.value*100).toFixed(0);
        var str = '';
        str += '<li>';
        str += '<div class="rate-wrap">';
        str += '<div class="percent-part '+useClass+'" style="height: '+data.value+'%"></div>';
        str += '</div>';
        if(data.desc){
            str += '<div class="tip-box-show"> <i class="triangle-up"></i>';
            str += '<div class="tip-box-content">'+data.desc+'</div>';
            str += '</div>';
        }
        str += '<div class="des">';
        str += '<p>'+data.name+'</p>';
        str += '<b class="'+useClass+'-text">'+data.value+'</b>';
        str += '</div>';
        str += '</li>';
        return str;
    },
    _htmlBase:function (data) {
        var color = ['blue','green','purple','yellow','red'];
        var str = '';
        var colorIndex = 0;
        var useClass = {'class':'','img':''};
        for(var i=0;i<data.length;i++){
            useClass['class'] = (color.length-1)>=colorIndex ? color[colorIndex] : color[(colorIndex.length-1)];
            colorIndex++;
            if(data[i].data.length == 2){
                useClass['img'] = 'small.jpg';
            }else{
                useClass['img'] = 'big.jpg';
            }
            str += F_Basic_Info._htmlBaseItem(useClass,data[i]);
        }
        return str;
    },
    _getBase:function () {
        var dom = $('.player-multi-tags');
        var postData = {};
        if(M_Init._searchKeyword){
            postData['user_type'] = M_Init._dataCache['userType'];
            postData['cluster_type'] = M_Init._searchKeyword;
        }else{
            postData['user_type'] = M_Init._gameIdRight;
        }
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['playerCluster'],'get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data && data.length>0){
                    dom.html(F_Basic_Info._htmlBase(data));
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getRadar:function () {
        var dom = $('#bs_radar_list');
        var postData = {};
        postData['user_type'] = M_Init._gameIdRight;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['playerTag'],'get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data){
                    var color = [
                        {'name':'blue','value':'#3399dc'},
                        {'name':'green','value':'#2dcd70'},
                        {'name':'purple','value':'#774689'},
                        {'name':'yellow','value':'#f3d049'},
                        {'name':'blue1','value':'#2d55ce'},
                        {'name':'red','value':'#e44d3c'},
                        {'name':'green1','value':'#0f735e'},
                        {'name':'purple1','value':'#431f5e'}
                    ];
                    dom.html(F_Basic_Info._htmlRadar(data,color));
                    F_Basic_Info._chartRadar(color);

                    dom.find('a').each(function () {
                        $(this).click(function () {
                            var type = $(this).attr('data-i');
                            var url = B_Jump._getUrl('operateBasic',{type:M_Init._gameId+'-'+type+'-'+M_Init._gameIdRight});
                            B_Jump._go('base',url);
                        });
                    });
                }else{
                    dom.html(B_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlRadar:function (data,color) {
        var str = '';
        var chartData = {};
        var useColor = '';
        for(var i=0;i<data.length;i++){
            chartData[i] = data[i];
            useColor = color[i] ? color[i].name : color[0].name;
            str += '<div class="blockpart no-title  col-lg-3 col-md-6 col-sm-6 col-xs-6">\
                        <div class="boxshadow border-'+useColor+'">\
                            <div class="top-des">\
                                <p>'+data[i].name+'类型-'+M_Init._dataCache['userTypeName']+'</p>\
                                <b>'+data[i].data.user_num+'人</b>\
                            </div>\
                            <div class="graph-part" id="bs_radar_'+i+'" style="width: 100%;height: 270px"></div>\
                            <a data-i="'+data[i].name+'" class="tg-assist-btn">查看详情</a>\
                        </div>\
                    </div>';
        }
        F_Basic_Info._cache['radar'] = chartData;
        return str;
    },
    _chartRadar:function (color) {
        var radarConfig = {'活跃度':'activity','能力评估':'capability_eva','社交':'social','玩法参与':'gameplay','消费':'consume'};
        var chartDataPre = {};
        var useColor = '';
        var chartName = '';
        if(F_Basic_Info._cache['radar']){
            $.each(F_Basic_Info._cache['radar'],function(key,value){
                key = parseInt(key);
                useColor = color[key] ? color[key].value : color[0].value;
                chartName = value.name+'类型玩家';
                chartDataPre = {indicator:[],data:{},legendSelectMode:true,'color':[useColor,useColor]};
                chartDataPre.data[chartName] = [];
                $.each(radarConfig,function(key1,value1){
                    chartDataPre.indicator.push({text: key1, max: 100});
                    chartDataPre.data[chartName].push((value.data[value1] ? ((value.data[value1]*100).toFixed(0)) : 0));
                });
                M_Inside_Chart._chartData('60','bs_radar_'+key,chartDataPre);
            })
        }
    }
}