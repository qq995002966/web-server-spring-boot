var F_OperatePayLost_Entrance = {
    _init:function (type) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(4);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['playerDistribution'] = 'demoPlayerDistribution';
                    M_Init._api['playerDistributionClassify'] = 'demoPlayerDistributionClassify';
                    M_Init._api['searchExcel'] = 'demoSearchExcel';
                    break;
                default:
                    M_Init._api['playerDistribution'] = 'playerDistribution';
                    M_Init._api['playerDistributionClassify'] = 'playerDistributionClassify';
                    M_Init._api['searchExcel'] = 'searchExcel';
                    break;
            }
            M_Init._dataCache['type'] = type;
            switch (type){
                case 'paid':
                    M_Init._dataCache['classA'] = '';
                    M_Init._dataCache['classB'] = '';
                    M_Init._dataCache['classCenter'] = '';
                    M_Init._dataCache['classAN'] = '#ed7a38';
                    M_Init._dataCache['classBN'] = '#e53c2e';
                    M_Init._dataCache['classRateBg'] = '';
                    M_Init._dataCache['classFont'] = '';
                    M_Common._getOrderGame('operatePay','','8-5');
                    break;
                case 'lost':
                    M_Init._dataCache['classA'] = 'shan-a-purple';
                    M_Init._dataCache['classB'] = 'shan-b-purple';
                    M_Init._dataCache['classAN'] = '#584AA6';
                    M_Init._dataCache['classBN'] = '#826BA8';
                    M_Init._dataCache['classCenter'] = 'center-circle-purple';
                    M_Init._dataCache['classRateBg'] = 'rate-purple'
                    M_Init._dataCache['classFont'] = 'infor-purple';
                    M_Common._getOrderGame('operateLost','','8-6');
                    break;
            }
        }
    }
}

var F_OperatePayLost_Info = {
    _configInit:{'大R玩家':{'img':'dr'},'中R玩家':{'img':'zr'},'小R玩家':{'img':'xr'},'成长期流失玩家':{'img':'czq'},'新手期流失玩家':{'img':'xsq'},'中后期流失玩家':{'img':'zhq'}},
    _getInfo:function () {
        var dom = $('#ct_main_area');
        var postData = {};
        postData['game_id'] = M_Init._gameId;
        postData['user_type'] = M_Init._dataCache['type'];
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['playerDistributionClassify'], 'get', true,postData, function() {
            B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        }, function() {
            B_Pop._init('close');
        }, function(data, msg) {
            if (data && data.length > 0) {
                var selectData = [];
                switch (M_Init._dataCache['type']){
                    case 'paid':
                        for(var i=0;i<data.length;i++){
                            selectData.push({'id':data[i].classify_name,'name':data[i].classify_name+'(消费'+data[i].group_rank+')'});
                        }
                        break;
                    case 'lost':
                        for(var i=0;i<data.length;i++){
                            selectData.push({'id':data[i].classify_name,'name':data[i].classify_name});
                        }
                        break;
                }

                F_OperatePayLost_Info._formatClassify(selectData);
            }
        }, function(data, msg, code) {
            dom.html(B_Pre._empty(msg));
        })
    },
    _formatClassify:function (selectData) {
        if(!M_Init._gameIdRight){
            M_Init._gameIdRight = selectData[0].id;
        }
        var selected = {};
        M_Init._dataCache['selectedName'] = '';
        for(var i=0;i<selectData.length;i++){
            if(selectData[i].id == M_Init._gameIdRight){
                selected = selectData[i];
                M_Init._dataCache['classifyName'] = selectData[i].id;
                break;
            }
        }
        $('#headerTop').html(M_Inside._dropHtml('bs_classify','选择分析对象:',selected,selectData));
        F_OperatePayLost_Info._getData();
        M_Inside._dropShow('tg-selected-drop');
        M_Inside._dropSelected(function (select,position) {
            M_Init._gameIdRight = select;
            M_Init._dataCache['classifyName'] = select;
            M_Init._dataCache['detailName'] = '';
            F_OperatePayLost_Info._getData();
        },'tg-selected-drop');
        M_Inside._dropLeave('tg-selected-drop');
    },
    _getData:function () {
        var dom = $('#ct_main_area');
        var postData = {};
        postData['classify_name'] = M_Init._gameIdRight;
        postData['game_id'] = M_Init._gameId;
        postData['user_type'] = M_Init._dataCache['type'];
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['playerDistribution'], 'get', true,postData, function() {
            dom.html(B_Pre._loading());
        }, function() {
            dom.html('');
        }, function(data, msg) {
            if (data && data.length > 0) {
                dom.html(F_OperatePayLost_Info._htmlBase());
                M_Init._dataCache['data'] =  data;
                F_OperatePayLost_Info._formatData();
            }else{
                M_Init._dataCache['data'] = '';
                dom.html('暂无数据');
            }
        }, function(data, msg, code) {
            dom.html(B_Pre._empty(msg));
        })
    },
    _formatData:function () {
        F_OperatePayLost_Info._htmlCircle();
        F_OperatePayLost_Info._doCircle();
        F_OperatePayLost_Info._htmlDetail();
        $('.bs_circle_detail').each(function () {
            $(this).click(function () {
                switch (M_Init._dataCache['type']){
                    case 'paid':
                        if(!$(this).hasClass('selected-red')){
                            $('.bs_circle_detail').each(function () {
                                $(this).removeClass('selected-red');
                            });
                            $(this).addClass('selected-red');
                            M_Init._dataCache['detailName'] = $(this).attr('data-i');
                            F_OperatePayLost_Info._htmlDetail();
                        }
                        break;
                    case 'lost':
                        if(!$(this).hasClass('selected-purple')){
                            $('.bs_circle_detail').each(function () {
                                $(this).removeClass('selected-purple');
                            });
                            $(this).addClass('selected-purple');
                            M_Init._dataCache['detailName'] = $(this).attr('data-i');
                            F_OperatePayLost_Info._htmlDetail()
                        }
                        break;
                }
            });
        });
    },
    _doCircle:function () {
        $('#circle-min1').circleProgress({
            startAngle: -Math.PI * 0.5,
            value: M_Init._dataCache['percentValue']['1'],
            size: 172,
            emptyFill: "rgba(0, 0, 0, 0)",
            fill: {
                gradient: [M_Init._dataCache['classAN'],M_Init._dataCache['classBN']]
            }
        });
        $('#circle-min2').circleProgress({
            startAngle: -Math.PI * 0.5,
            value: M_Init._dataCache['percentValue']['2'],
            size: 158,
            emptyFill: "rgba(0, 0, 0, 0)",
            fill: {
                gradient: [M_Init._dataCache['classAN'], M_Init._dataCache['classBN']]
            }
        });
        $('#circle-min3').circleProgress({
            startAngle: -Math.PI * 0.5,
            value: M_Init._dataCache['percentValue']['3'],
            size: 142,
            emptyFill: "rgba(0, 0, 0, 0)",
            fill: {
                gradient: [M_Init._dataCache['classAN'], M_Init._dataCache['classBN']]
            }
        });
        $('#circle-min4').circleProgress({
            startAngle: -Math.PI * 0.5,
            value: M_Init._dataCache['percentValue']['4'],
            size: 115,
            emptyFill: "rgba(0, 0, 0, 0)",
            fill: {
                gradient: [M_Init._dataCache['classAN'], M_Init._dataCache['classBN']]
            }
        });
        $('#circle-min5').circleProgress({
            startAngle: -Math.PI * 0.5,
            value: M_Init._dataCache['percentValue']['5'],
            size: 158,
            emptyFill: "rgba(0, 0, 0, 0)",
            fill: {
                gradient: [M_Init._dataCache['classAN'], M_Init._dataCache['classBN']]
            }
        });
        $('#circle-min6').circleProgress({
            startAngle: -Math.PI * 0.5,
            value: M_Init._dataCache['percentValue']['6'],
            size: 140,
            emptyFill: "rgba(0, 0, 0, 0)",
            fill: {
                gradient: [M_Init._dataCache['classAN'], M_Init._dataCache['classBN']]
            }
        });
        $('#circle-min7').circleProgress({
            startAngle: -Math.PI * 0.5,
            value: M_Init._dataCache['percentValue']['7'],
            size: 105,
            emptyFill: "rgba(0, 0, 0, 0)",
            fill: {
                gradient: [M_Init._dataCache['classAN'], M_Init._dataCache['classBN']]
            }
        });
    },
    _htmlBase:function () {
        var str = '';
        str += '<div class=" blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12  paydis-graph-part paydis-content"><div class="wrap" id="Wrapp"></div></div>';
        str += '<div class=" blockpart col-lg-6 col-md-12 col-sm-12 col-xs-12  paydis-content"><div class="paydis-infor-part boxshadow" id="bs_detail"></div></div>';

        return str;
    },
    _htmlCircle:function(){
        var data = M_Init._dataCache['data'];
        var str = '';
        M_Init._dataCache['imgUrl'] = '';
        if(F_OperatePayLost_Info._configInit[M_Init._dataCache['classifyName']]){
            M_Init._dataCache['imgUrl'] = 'elements2.0/img/operate/'+F_OperatePayLost_Info._configInit[M_Init._dataCache['classifyName']].img;
        }else{
            M_Init._dataCache['imgUrl'] = '';
        }
        var shan_b = '';
        switch (M_Init._dataCache['type']){
            case 'paid':
                shan_b = '<div class="shan-b '+M_Init._dataCache['classB']+'"></div>';
                break;
            case 'lost':
                break;
        }

        str += '\
            <div class="content-center">\
                <div class="center-circle '+M_Init._dataCache['classCenter']+'">\
                    <img src="'+M_Init._dataCache['imgUrl']+'_1.png">\
                    <p>'+M_Init._dataCache['classifyName']+'</p>\
                </div>\
                <div class="shanxing1">\
                    <div class="shan-a '+M_Init._dataCache['classA']+'"></div>\
                    '+shan_b+'\
                </div>\
                <div class="shanxing2">\
                    <div class="shan-a '+M_Init._dataCache['classA']+'"></div>\
                </div>\
            </div>';

        var percent1 = '';
        var classSelect = '';
        var number= '';
        M_Init._dataCache['percentValue'] = {};
        for(var i=0;i<data.length;i++){
            switch (i+''){
                case '0':
                    number = '1';
                    break;
                case '1':
                    number = '5';
                    break;
                case '2':
                    number = '2';
                    break;
                case '3':
                    number = '6';
                    break;
                case '4':
                    number = '3';
                    break;
                case '5':
                    number = '7';
                    break;
                case '6':
                    number = '4';
                    break;
            }
            M_Init._dataCache['percentValue'][number] = data[i].group_user_rate;
            percent1 = (data[i].group_user_rate*100).toFixed(0);
            if(!M_Init._dataCache['detailName'] && i==0){
                M_Init._dataCache['detailName'] = data[i].group_name;
            }
            if(M_Init._dataCache['detailName'] == data[i].group_name){
                switch (M_Init._dataCache['type']){
                    case 'paid':
                        classSelect = 'selected-red';
                        break;
                    case 'lost':
                        classSelect = 'selected-purple';
                        break;
                }
            }else{
                classSelect = '';
            }

            str += '\
                <div class="content-wrap content'+number+'">\
                    <div class="bs_circle_detail content '+classSelect+'" data-i="'+data[i].group_name+'">\
                        <div class="circle-white">\
                            <div class="wrap1">\
                                <h3 class="'+M_Init._dataCache['classFont']+'">'+percent1+'%</h3>\
                                <p>'+data[i].group_name+'</p>\
                                <p>共'+data[i].group_user_num+'人</p>\
                            </div>\
                        </div>\
                        <div id="circle-min'+number+'"></div>\
                    </div>\
                </div>';
        }

        $('#Wrapp').html(str);
    },
    _htmlDetail:function () {
        var data = M_Init._dataCache['data'];
        var str = '';
        var lineStr1 = '';
        var lineStr2 = '';
        var dataUnion = '';
        if(data){
            for(var i=0;i<data.length;i++){
                if(data[i].group_name == M_Init._dataCache['detailName']){
                    dataUnion = data[i];
                    break;
                }
            }
        }
        if(!dataUnion){
            return;
        }
        var percent1 = '';
        var percent2 = '';
        switch (M_Init._dataCache['type']){
            case 'paid':
                M_Init._dataCache['columnElem'] = 's_pay_';
                M_Init._dataCache['columnName'] = '付费玩家分析';
                percent1 = (dataUnion.user_rate*100).toFixed(0);
                percent2 = (dataUnion.potential_user_rate*100).toFixed(0);
                lineStr1 = '<li>\
                                <img src="'+M_Init._dataCache['imgUrl']+'_2.png">\
                                <div class="btn-union">\
                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(1)">详细属性</a>\
                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(1)">ID导出</a>\
                                </div>\
                            </li>\
                            <li>\
                                <h4>注重'+M_Init._dataCache['detailName']+'的'+M_Init._dataCache['classifyName']+'特点</h4>\
                                <span>'+dataUnion.user_info+'</span>\
                            </li>\
                            <li>\
                                <b>'+percent1+'%</b><span>消费意愿</span>\
                                <div class="rate-wrap">\
                                    <div class="rate" style="width: '+percent1+'%"></div>\
                                </div>\
                            </li>';

                lineStr2 = '<li>\
                                <img src="'+M_Init._dataCache['imgUrl']+'_4.png">\
                                <div class="btn-union">\
                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(2)">详细属性</a>\
                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(2)">ID导出</a>\
                                </div>\
                            </li>\
                             <li>\
                                <h4>系统发现<b>'+dataUnion.group_user_num+'</b>人 注重'+M_Init._dataCache['detailName']+'的<b>潜在'+M_Init._dataCache['classifyName']+'</b></h4>\
                                <span>'+dataUnion.potential_user_info+'</span>\
                            </li>\
                            <li>\
                                <b>'+percent2+'%</b><span>消费意愿</span>\
                                <div class="rate-wrap">\
                                    <div class="rate" style="width: '+percent2+'%"></div>\
                                </div>\
                            </li>';
                break;
            case 'lost':
                M_Init._dataCache['columnElem'] = 's_lost_';
                M_Init._dataCache['columnName'] = '流失玩家分析';
                $('#bs_detail').addClass('lostdis-infor-part');
                lineStr1 = '<li>\
                                <img src="'+M_Init._dataCache['imgUrl']+'_2.png">\
                                <div class="btn-union">\
                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(1)">详细属性</a>\
                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(1)">ID导出</a>\
                                </div>\
                            </li>\
                            <li>\
                                <h4>因'+M_Init._dataCache['detailName']+'导致流失的'+M_Init._dataCache['classifyName']+'</h4>\
                                <span>'+dataUnion.user_info+'</span>\
                            </li>';

                percent2 = (dataUnion.potential_user_rate*100).toFixed(0);
                lineStr2 = '<li>\
                                <img src="'+M_Init._dataCache['imgUrl']+'_4.png">\
                                <div class="btn-union">\
                                    <a class="tg-main-btn" onclick="F_OperatePayLost_Info._redirect(2)">详细属性</a>\
                                    <a class="tg-assist-btn" onclick="F_OperatePayLost_Info._download(2)">ID导出</a>\
                                </div>\
                            </li>\
                            <li>\
                                <h4>系统发现<b>'+dataUnion.group_user_num+'</b>人 因'+M_Init._dataCache['detailName']+' <b>存在流失风险</b>的'+M_Init._dataCache['classifyName'].replace('流失','')+'</h4>\
                                <span>'+dataUnion.potential_user_info+'</span>\
                            </li>\
                            <li>\
                                <b class="'+M_Init._dataCache['classFont']+'">'+percent2+'%</b><span>流失风险</span>\
                                <div class="rate-wrap">\
                                    <div class="rate rate-purple" style="width: '+percent2+'%"></div>\
                                </div>\
                            </li>';
                break;
        }

        var str1 = '';
        var str2 = '';
        var rate = '';
        for(var i=0;i<dataUnion.sub_group.length;i++){
            if(dataUnion.sub_group[i].value){
                rate = '高于平均';
                if(dataUnion.sub_group[i].value_rate){
                    rate += (dataUnion.sub_group[i].value_rate).toFixed(0);
                }else{
                    rate += '';
                }
                rate += '%';

                str1 += '<li>\
                        <h3 class="'+M_Init._dataCache['classFont']+'">'+dataUnion.sub_group[i].value+'</h3>\
                        <p>'+dataUnion.sub_group[i].name+'</p>\
                        <span>'+rate+'</span>\
                    </li>';
            }
            if(dataUnion.sub_group[i].potential){
                rate = '高于平均';
                if(dataUnion.sub_group[i].potential_rate){
                    rate += (dataUnion.sub_group[i].potential_rate).toFixed(0);
                }else{
                    rate += '';
                }
                rate += '%';

                str2 += '<li>\
                    <h3 class="'+M_Init._dataCache['classFont']+'">'+dataUnion.sub_group[i].potential+'</h3>\
                    <p>'+dataUnion.sub_group[i].name+'</p>\
                    <span>'+rate+'</span>\
                </li>';
            }
        }
        str += '\
            <ul class="infor boxshadow">\
                '+lineStr1+'\
                <li>\
                    <ul class="list">\
                        '+str1+'\
                    </ul>\
                </li>\
            </ul>\
            <ul class="infor ">\
                '+lineStr2+'\
                <li>\
                    <ul class="list">\
                        '+str2+'\
                    </ul>\
                </li>\
            </ul>';

        $('#bs_detail').html(str);

    },
    _redirect:function (type) {
        var styleValue = M_Init._dataCache['classifyName'];
        switch (type+''){
            case '2':
                styleValue = '潜在'+styleValue;
                break;
        }
        var condition = M_Init._gameId+'|'+M_Init._dataCache['type']+'|'+styleValue+'|'+M_Init._dataCache['detailName']
        condition = B_Common._encodeUrl(condition);
        B_Jump._go('base',B_Jump._getUrl('operatePlayer',{'type':condition}));
    },
    _download:function (type) {
        var styleValue = M_Init._dataCache['classifyName'];
        switch (type+''){
            case '2':
                styleValue = '潜在'+styleValue;
                break;
        }
        var condition = [];
        condition.push('game_id='+M_Init._gameId);
        condition.push(M_Init._dataCache['columnElem']+'style='+B_Common._encodeUrl(styleValue));
        condition.push(M_Init._dataCache['columnElem']+'reason='+B_Common._encodeUrl(M_Init._dataCache['detailName']));
        condition = condition.join('&');
        B_Jump._go('openUrl',B_Port._init(M_Init._api['searchExcel'])+'?'+condition+'&excel_name='+B_Common._encodeUrl(M_Init._dataCache['columnName']));
    }
}