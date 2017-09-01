var F_Attribute_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['innerSearchMeta'] = 'demoInnerSearchMeta';
                    M_Init._api['innerSearch'] = 'demoInnerSearch';
                    break;
                default:
                    M_Init._api['innerSearchMeta'] = 'innerSearchMeta';
                    M_Init._api['innerSearch'] = 'innerSearch';
                    break;
            }
            M_Init._gameIdRight = 3;
            $('#tab_list_li').html('');
            $('#lt_main_area').html('');
            M_Init._dataCache['tags'] = {};
            M_Init._dataCache['tagsList'] = {};
            M_Init._dataCache['searchRank'] = '';

            M_Common._getOrderGame('attribute','','2-1');
        }
    }
}
var F_Attribute_Search = {
    _getSearchMeta:function () {
        $('#tab_list_li').html('');
        $('#lt_main_area').html('');
        var domContent = $('#lt_main_area');

        var postData = {};
        postData['service_id'] = M_Init._gameIdRight;
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);

        B_Port._ajax(M_Init._api['innerSearchMeta'],'get',true,postData,function () {
                domContent.html(B_Pre._loading('b_padding30'));
            },function () {
                domContent.html('');
            },function(data,msg){
                if(data && data.length >0){
                    data = data[0];
                    var tab = '';
                    var str = '';
                    var list = '';

                    for(var d=0;d<data.groupTitle.length;d++){
                        if(d == 0){
                            M_Init._dataCache['tabId'] = 0;
                            M_Init._dataCache['tabName'] = data.groupTitle[d];
                        }
                        M_Init._dataCache['tags'][data.groupTitle[d]] = [];
                        M_Init._dataCache['tagsList'][data.groupTitle[d]] = [];
                        str += '<div class="tg-table-wrap';
                        str += (d == 0 ? '' : ' b_none');
                        str += '" id="lt_content_'+d+'">';
                        str += '<div class="tg-select-filter">';
                        for(var p=0;p<data['primary'].length;p++){
                            str += M_Inside._htmlMeta(data.groupTitle[d],data['primary'][p].search_type,data['primary'][p].column_name,data['primary'][p].column_desc);
                        }
                        for(var i=0;i<data['group'][data.groupTitle[d]].length;i++){
                            var searchItemVal = data['group'][data.groupTitle[d]][i];
                            str += M_Inside._htmlMeta(data.groupTitle[d],searchItemVal.search_type,searchItemVal.column_name,searchItemVal.column_desc);
                        }

                        str += '<div><button class="tg-main-btn bs_btn_search">查找</button><button class="tg-assist-btn bs_btn_reset">重置</button></div>';
                        str += '</div>';

                        str += '<div class="table-out-wrap"><table class="tg-table table table-bordered"><thead class="boxshadow"></thead><tbody></tbody></table></div>';
                        str += '<ul class="tg-page-list" id="bs_page_'+(d+1)+'"></ul>';
                        str += '</div>';

                        tab += '<li data-w="'+data.groupTitle[d]+'" data-i="'+d+'" class="';
                        tab += (d == 0 ? 'tg-tab-active' : '');
                        tab += '">'+data.groupTitle[d]+'</li>';

                    }

                    $('#tab_list_li').html(tab);
                    $('#lt_main_area').html(str);

                    M_Inside._tabChoose('attribute');
                    M_Inside._dropShow();
                    M_Inside._dropSelected();
                    M_Inside._dropLeave();

                    $('.bs_btn_search').click(function () {
                        F_Attribute_Search._getDetail(1);
                    })
                    $('.bs_btn_reset').click(function () {
                        M_Inside._resetMeta('attribute');
                    })

                    $('#bs_btn_down').click(function () {
                        var postData = [];
                        postData.push('service_id='+M_Init._gameIdRight);
                        postData.push('game_id='+M_Init._gameId);
                        var condition = '';
                        var searchCondition = M_Inside._getSearchTag();
                        if(searchCondition != ''){
                            condition = postData.join('&')+'&'+searchCondition;
                        }else{
                            condition = postData.join('&');
                        }
                        B_Jump._go('openUrl',B_Port._init('innerSearchCsv')+'?'+condition+'&excel_name='+B_Common._encodeUrl('玩家属性查询'));
                    });
                }

                F_Attribute_Search._getDetail(1);
            },function(data,msg,code){
                domContent.html(B_Pre._empty(msg));
            }
        )
    },
    _getDetail:function (page) {
        if(M_Init._dataCache['tabName'] == ''){
            B_Pop._init('msg',{content:'标签选择失败，请刷新页面重试！'});
            return false;
        }
        B_Page._size = 10;

        var postData = {};
        postData['type'] = M_Init._dataCache['tabName'];
        postData['service_id'] = M_Init._gameIdRight;
        postData['game_id'] = M_Init._gameId;
        postData['index'] = (page-1)*B_Page._size;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);

        var searchCondition = M_Inside._getSearchTag();
        if(searchCondition != ''){
            postData = postData+'&'+searchCondition;
        }
        var rankCondition = M_Init._dataCache['searchRank'];
        if(rankCondition != ''){
            postData += '&'+rankCondition;
        }

        var domTableList = $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table tbody');
        var domPageList = $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-page-list')
        B_Port._ajax(M_Init._api['innerSearch'],'get',true,postData,function () {
                domTableList.html(B_Pre._loading()+'<tr class="empty"></tr>');
            },function () {
                domTableList.html('');
            },function(data,msg){
                if(data.list && data.list.length >0){
                    domTableList.html(F_Attribute_Search._htmlList(data.list));
                    domPageList.html(B_Page._show({total:data.total,page:page},'number'));
                    B_Page._click(page,function (page) {
                        F_Attribute_Search._getDetail(page);
                    },(parseInt(M_Init._dataCache['tabId'])+1));

                    M_Dom._trSelected();
                }else{
                    domTableList.html(B_Pre._empty('暂无数据')+'<tr class="empty"></tr>');
                    domPageList.html('');
                }
            },function(data,msg,code){
                domPageList.html('');
                switch(code+''){
                    case '-1004':
                        msg = '参数错误';
                        break;
                }
                domTableList.html(B_Pre._empty(msg)+'<tr class="empty"></tr>');
            }
        )
    },
    _htmlList:function (data) {
        var str = '';
        var tagLength = M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']].length;
        for(var i=0;i<data.length;i++){
            var thStr = '<tr>';
            var tdStr = '<tr>';
            for(var n=0;n<tagLength;n++){
                if(i==0 && $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead').html() == ''){
                    var headName = M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].name;
                    if(M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].type == 'span')headName += '<i data-i="'+M_Init._dataCache['tagsList'][M_Init._dataCache['tabName']][n].key+'" class="tg-icon tg-sort-icon arrow-down"></i>';
                    thStr += '<th>'+headName+'</th>';
                }
                tdStr += '<td>'+data[i].source[M_Init._dataCache["tagsList"][M_Init._dataCache["tabName"]][n].key]+'</td>';
            }
            tdStr += '<td><button class="tg-main-btn" onclick="F_Attribute_Search._getSearchDetail(\''+data[i].id+'\')">查看详情</button></td>';
            tdStr += '</tr>';
            str += tdStr;

            if(i==0 && $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead').html() == ''){
                thStr += '<th>操作</th></tr>';
                $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead').html(thStr);
                $('#lt_content_'+M_Init._dataCache['tabId']+' .tg-table thead i').each(function (index) {
                    $(this).click(function () {
                        var ordreStr = 'order_by_field='+B_Common._encodeUrl($(this).attr('data-i'));
                        if ($(this).hasClass('arrow-down')) {
                            ordreStr += '&order_type='+B_Common._encodeUrl('asc');
                            $('.listContent'+M_Init._dataCache['tabId']+' .table-part thead i').each(function () {
                                $(this).addClass('arrow-down').removeClass('arrow-up');
                            });
                            $(this).removeClass('arrow-down').addClass('arrow-up');
                        } else {
                            ordreStr += '&order_type=desc';
                            $(this).addClass('arrow-down').removeClass('arrow-up');
                        }
                        M_Init._dataCache['searchRank'] = ordreStr;
                        F_Attribute_Search._getDetail(1);
                    });
                });
            }
        }
        return str;
    },
    _getSearchDetail:function(key){
        B_Pop._init('open',{'type':2,'scroll':false,'title':'用户详情','width':'1050px','height':'550px','shift':2,'content':'insidesattribute_s.html?k='+key+'&g='+M_Init._gameId},'');
    }
}