var F_ServiceId = '';
var F_TabId = '';
var F_TabName = '';
$(function () {
    G_Login._check();
    G_Login._status('user');
    var $_GET = getUrl('query');
    var controller = getUrl('controller');
    switch(controller) {
        case 'insideattribute':
            //U_Book._checkStatus('insideattribute');
            U_Dom._menu('2-3');
            var $_GET = getUrl('query');
            G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('insideAttribute');
            G_Game._setLast(G_GameId,'insideAttribute');
            F_ServiceId = 3;
            var currentData = U_Service._init['insideattribute'];
            U_InnderGame._getOrderGame('insideattribute','<a href="'+G_Jump._getUrl('item')+'?k='+currentData[2]+'" target="_blank"><img src="elements/img/demo/insideattribute.jpg"></a>');
            break;
        case 'insideattribute_s':
            var dataId = $_GET.k;
            if(dataId){
                F_Detail._getData(dataId);
            }
            break;
    }

});
var F_Detail = {
    _getData:function (id) {
        G_Port._ajax('innerUserDetail','get',true,'data_id='+id+'&game_id='+parent.G_GameId,function () {
                $('.property-content').html(G_Pre._loading());
            },function () {
                $('.property-content').html('');
            },function(data,msg){
                if(data.groupTitle && data.groupTitle.length > 0){
                    $('.property-content').html(F_Detail._htmlData(data.groupTitle,data.data));
                }
            },function(data,msg,code){
                $('.property-content').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlData:function (group,data) {
        var str = '';
        for(var i=0;i<group.length;i++){
            str += '<div class="pro-content">';
            str += '<h1>'+group[i]+'</h1>';
            str += '<ul>';
            str += '<li>';
            $.each(data[group[i]],function (key,value) {
                str += '<span>'+key+'：<b>'+value+'</b></span>';
            });
            str += '</li></ul></div>';
        }
        return str;
    }
}
var F_Search = {
    _tags:{},
    _tagsList:{},
    _searchRank:'',
    _resetMeta:function () {
        if(F_Search._tags[F_TabName] && F_Search._tags[F_TabName].length > 0){
            for(var i=0;i<F_Search._tags[F_TabName].length;i++){
                switch(F_Search._tags[F_TabName][i].type){
                    case 'span':
                        var dom1 = F_Search._tags[F_TabName][i].name+'_min';
                        var dom2 = F_Search._tags[F_TabName][i].name+'_max';
                        $('.tabContent'+F_TabId+' #'+dom1).val('');
                        $('.tabContent'+F_TabId+' #'+dom2).val('');
                        break;
                    case 'query':
                        var dom = F_Search._tags[F_TabName][i].name;
                        $('.tabContent'+F_TabId+' #'+dom).val('')
                        break;
                    case 'enum':
                        var dom = F_Search._tags[F_TabName][i].name;
                        $('.tabContent'+F_TabId+' #'+dom).html('全部')
                        break;
                }
            }
        }
        F_Search._getDetail(1);
    },
    _getSearchMeta:function () {
        G_Port._ajax('innerSearchMeta','get',true,'service_id='+F_ServiceId+'&game_id='+G_GameId,function () {
                $('.choice-part').html(G_Pre._loading());
            },function () {
                $('.choice-part').html('');
            },function(data,msg){
                if(data && data.length >0){
                    data = data[0];
                    var tab = '<ul>';
                    var str = '';
                    var list = '';
                    for(var d=0;d<data.groupTitle.length;d++){
                        if(d == 0){
                            F_TabId = 0;
                            F_TabName = data.groupTitle[d];
                        }
                        F_Search._tags[data.groupTitle[d]] = [];
                        F_Search._tagsList[data.groupTitle[d]] = [];
                        list += '<div class="item-list listContent'+d;
                        list += (d == 0 ? '' : ' c_none');
                        list += '">';
                        list += '<div class="table-part"><table><thead></thead><tbody></tbody></table>';
                        list += '</div><ul class="page-list"></ul></div>';
                        tab += '<li data-w="'+data.groupTitle[d]+'" data-i="'+d+'" class="';
                        tab += (d == 0 ? 'liOn' : '');
                        tab += '">'+data.groupTitle[d]+'</li>';
                        str += '<div class="choice-list tabContent'+d;
                        str += (d == 0 ? '' : ' c_none');
                        str += '"><ul>';
                        for(var p=0;p<data['primary'].length;p++){
                            str += F_Search._htmlMeta(data.groupTitle[d],data['primary'][p].search_type,data['primary'][p].column_name,data['primary'][p].column_desc);
                        }
                        for(var i=0;i<data['group'][data.groupTitle[d]].length;i++){
                            var searchItemVal = data['group'][data.groupTitle[d]][i];
                            str += F_Search._htmlMeta(data.groupTitle[d],searchItemVal.search_type,searchItemVal.column_name,searchItemVal.column_desc);
                        }
                        str += '</ul></div>';
                    }
                    tab += '</ul>';
                    str += '<div class="btn-part">\
                                <button id="bs_btn_search">查找</button> <button id="bs_btn_reset">重置</button>\
                                </div>';

                    $('.choice-tab').html(tab);
                    $('.choice-part').html(str);
                    $('.table-list').html(list);

                    // 鼠标离开隐藏菜单
                    $('.drop-hide').mouseleave(function(event) {
                        $(this).children('ul').hide();
                    });
                    F_Search._tabChoose();
                    F_Search._dropShow();
                    F_Search._dropSelected();

                    $('.btn-part #bs_btn_search').click(function () {
                        F_Search._getDetail(1);
                    });
                    $('.btn-part #bs_btn_reset').click(function () {
                        F_Search._resetMeta();
                    });

                    $('.download-data button').click(function () {
                        var postData = [];
                        postData.push('service_id='+F_ServiceId);
                        postData.push('game_id='+G_GameId);
                        var condition = '';
                        var searchCondition = F_Search._getSearchTag();
                        if(searchCondition != ''){
                            condition = postData.join('&')+'&'+searchCondition;
                        }else{
                            condition = postData.join('&');
                        }
                        G_Jump._go('open',G_Port._init('innerSearchCsv')+'?'+condition);
                    });
                }
                F_Search._getDetail(1);
            },function(data,msg,code){
                $('.choice-part').html(G_Pre._empty(msg));
            }
        )
    },
    _tabChoose:function () {
        $(".choice-tab ul li").each(function(index){
            $(this).click(function () {
                $(this).addClass('liOn').siblings().removeClass('liOn');

                var dataNumber = $(this).attr('data-i');
                F_TabId = dataNumber;
                F_TabName = $(this).attr('data-w');

                $('.tabContent'+dataNumber).show().siblings('.choice-list').hide();
                $('.listContent'+dataNumber).show().siblings('.item-list').hide();
                if($('.listContent'+dataNumber+' .page-list').html() == ''){
                    F_Search._getDetail(1);
                }
            });
        });
    },
    _dropShow:function(){
        $("#dropDown p").click(function() {
            var ul = $(this).parent('#dropDown').children('ul');
            if (ul.css("display") == "none") {
                ul.slideDown("fast");
            } else {
                ul.slideUp("fast");
            }
        });
    },
    _dropSelected:function(){
        $("#dropDown ul li a").click(function() {
            var txt = $(this).text();
            var key = $(this).attr('data-i');
            $(this).parents('#dropDown').find('p').html(txt).attr('data-i', key);
            $(this).parents('#dropDown').children('ul').hide();
        });
    },
    _htmlMeta:function (type,data,inputname,title) {
        var dataSplit = data.split(':');
        var str = '';
        F_Search._tagsList[type].push({key:inputname,name:title,type:dataSplit[0]});
        switch(dataSplit[0]){
            case 'span':
                F_Search._tags[type].push({'type':dataSplit[0],'name':inputname});
                str += '<li class="select-area"><span>'+title+'</span>';
                if(dataSplit[1]){
                    switch(dataSplit[1]){
                        case 'date':
                            str += '<input readonly type="text" id="'+inputname+'_min" class="all-input area-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})"><span class="zhi">至</span><input readonly type="text" id="'+inputname+'_max" class="all-input area-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})">';
                            break;
                        case 'datetime':
                            str += '<input readonly type="text" id="'+inputname+'_min" class="all-input area-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})"><span class="zhi">至</span><input readonly type="text" id="'+inputname+'_max" class="all-input  area-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})">';
                            break;
                    }
                }else{
                    str += '<input type="text" id="'+inputname+'_min" class="all-input  area-input"><span class="zhi">至</span><input type="text" id="'+inputname+'_max" class="all-input  area-input">';

                }
                str += '</li>';
                break;
            case 'enum':
                var dataEnum = dataSplit[1] ? dataSplit[1].split(',') : [];
                if(dataEnum.length > 0){
                    F_Search._tags[type].push({'type':dataSplit[0],'name':inputname});
                    str += '<li class="select-drop"><span>'+title+'</span>';
                    str += '<div id="selectWrap">';
                    str += '<div id="dropDown" class="drop-hide">';
                    for(var i=0;i<dataEnum.length;i++){
                        if(i == 0){
                            str += '<p class="all-input" id="'+inputname+'">全部</p><i class="drop-icon"></i><ul>';
                            str += '<li><a>全部</a></li>';
                        }
                        str += '<li><a data-i="'+dataEnum[i]+'">'+dataEnum[i]+'</a></li>';
                    }
                    str += '</ul></div></div></li>';
                }
                break;
            case 'query':
                F_Search._tags[type].push({'type':dataSplit[0],'name':inputname});
                str += '<li class="text-input"><span>'+title+'</span><input type="text"  id="'+inputname+'" class="all-input name-input "></li>';
                break;
        }
        return str;
    },
    _getSearchTag:function () {
        var str = [];
        if(F_Search._tags[F_TabName] && F_Search._tags[F_TabName].length > 0){
            for(var i=0;i<F_Search._tags[F_TabName].length;i++){
                switch(F_Search._tags[F_TabName][i].type){
                    case 'span':
                        var dom1 = F_Search._tags[F_TabName][i].name+'_min';
                        var dom2 = F_Search._tags[F_TabName][i].name+'_max';
                        var dom1Data = $.trim($('.tabContent'+F_TabId+' #'+dom1).val());
                        var dom2Data = $.trim($('.tabContent'+F_TabId+' #'+dom2).val());
                        if(dom1Data != ''){
                            str.push(dom1+'='+G_Common._encodeUrl(dom1Data));
                        }
                        if(dom2Data != ''){
                            str.push(dom2+'='+G_Common._encodeUrl(dom2Data));
                        }
                        break;
                    case 'query':
                        var dom = F_Search._tags[F_TabName][i].name;
                        var domData = $.trim($('.tabContent'+F_TabId+' #'+dom).val());
                        if(domData != ''){
                            str.push(dom+'='+G_Common._encodeUrl(domData));
                        }
                        break;
                    case 'enum':
                        var dom = F_Search._tags[F_TabName][i].name;
                        var domData = $.trim($('.tabContent'+F_TabId+' #'+dom).html());
                        if(domData != '' &&　domData != '全部'){
                            str.push(dom+'='+G_Common._encodeUrl(domData));
                        }
                        break;
                }
            }
        }
        if(str.length > 0){
            return str.join('&');
        }else{
            return '';
        }
    },
    _getSearchRank:function () {
        var str = [];
        $('.listContent'+F_TabId+' .table-part thead i').each(function () {
            $(this).hasClass('glyphicon-triangle-top') ? str.push($(this).attr('data-i')) : '';
        });
        if(str.length > 0){
            return 'order_by_field='+str.join(',');
        }else{
            return '';
        }
    },
    _getDetail:function (page) {
        if(F_TabName == ''){
            G_Pop._init('msg',{content:'标签选择失败，请刷新页面重试！'});
            return false;
        }
        var postData = [];
        postData.push('type='+G_Common._encodeUrl(F_TabName));
        postData.push('service_id='+F_ServiceId);
        postData.push('game_id='+G_GameId);
        postData.push('index='+(page-1)*G_Page._size);
        postData.push('limit='+G_Page._size);
        var condition = '';
        var searchCondition = F_Search._getSearchTag();
        if(searchCondition != ''){
            condition = postData.join('&')+'&'+searchCondition;
        }else{
            condition = postData.join('&');
        }
        var rankCondition = F_Search._searchRank;
        if(rankCondition != ''){
            condition += '&'+rankCondition;
        }

        G_Port._ajax('innerSearch','get',true,condition,function () {
                $('.listContent'+F_TabId+' .table-part tbody').html(G_Pre._loading()+'<tr class="empty"></tr>');
            },function () {
                $('.listContent'+F_TabId+' .table-part tbody').html('');
            },function(data,msg){
                if(data.list && data.list.length >0){
                    $('.listContent'+F_TabId+' .table-part tbody').html(F_Search._htmlList(data.list));
                    $('.listContent'+F_TabId+' .page-list').html(G_Page._show({total:data.total,page:page},'simple'));
                    U_Common._tableHover();
                    F_Search._pageGo(page);
                }else{
                    $('.listContent'+F_TabId+' .table-part tbody').html(G_Pre._empty('暂无数据')+'<tr class="empty"></tr>');
                    $('.listContent'+F_TabId+' .page-list').html('');
                }
            },function(data,msg,code){
                $('.listContent'+F_TabId+' .page-list').html('');
                switch(code+''){
                    case '-1004':
                        msg = '参数错误';
                        break;
                }
                $('.listContent'+F_TabId+' .table-part tbody').html(G_Pre._empty(msg)+'<tr class="empty"></tr>');
            }
        )
    },
    _pageGo:function(page,postData){
        $('.listContent'+F_TabId+' .page-list .prev').click(function(){
            F_Search._pageRequest(parseInt(page)-1);
        });
        $('.listContent'+F_TabId+' .page-list .next').click(function(){
            F_Search._pageRequest(parseInt(page)+1);
        });
        $('.listContent'+F_TabId+' .page-list button').click(function(){
            var goPage = $.trim($('.page-list input').val());
            if(goPage == '' || isNaN(goPage)){
                G_Pop._init('msg',{content:'页码必须为数字,请确认！'});
                return false;
            }
            if(parseInt(goPage) <= 0){
                G_Pop._init('msg',{content:'页码错误,请确认！'});
                return false;
            }
            if(parseInt(goPage) == parseInt(page)){
                return false;
            }
            F_Search._pageRequest(goPage);
        });
        submitBind($('.listContent'+F_TabId+' .page-list button'),$('.listContent'+F_TabId+' .page-list input'));
    },
    _pageRequest:function(page){
        var total = $('.listContent'+F_TabId+' .page-list button').attr('data-a');
        if(page > 0 && parseInt(page)<=parseInt(total)){
            F_Search._getDetail(page);
        }
    },
    _htmlList:function (data) {
        var str = '';
        var tagLength = F_Search._tagsList[F_TabName].length;
        for(var i=0;i<data.length;i++){
            var thStr = '<tr>';
            var tdStr = '<tr>';
            for(var n=0;n<tagLength;n++){
                if(i==0 && $('.listContent'+F_TabId+' .table-part thead').html() == ''){
                    var headName = F_Search._tagsList[F_TabName][n].name;
                    if(headName){
                        var nameLength = headName.length;
                        if(nameLength > 4){
                            var headNameStr = '';
                            var splitNum = Math.ceil(nameLength/3);
                            for(var p=0;p<splitNum;p++){
                                headNameStr += headName.substr((p*3),3);
                                if(splitNum > p+1)headNameStr += '<br>';
                            }
                            headName = headNameStr;
                        }
                    }
                    if(F_Search._tagsList[F_TabName][n].type == 'span')headName += '<i data-i="'+F_Search._tagsList[F_TabName][n].key+'" class="glyphicon glyphicon-triangle-bottom"></i>';
                    thStr += '<th>'+headName+'</th>';
                }
                tdStr += '<td>'+data[i].source[F_Search._tagsList[F_TabName][n].key]+'</td>';
            }
            tdStr += '<td><a href="javascript:void(0)" onclick="F_Search._getSearchDetail(\''+data[i].id+'\')">查看详情</a></td>';
            tdStr += '</tr>';
            str += tdStr;

            if(i==0 && $('.listContent'+F_TabId+' .table-part thead').html() == ''){
                thStr += '<th>操作</th></tr>';
                $('.listContent'+F_TabId+' .table-part thead').html(thStr);
                $('.listContent'+F_TabId+' .table-part thead i').each(function (index) {
                    $(this).click(function () {
                        var ordreStr = 'order_by_field='+$(this).attr('data-i');
                        if ($(this).hasClass('glyphicon-triangle-bottom')) {
                            ordreStr += '&order_type=asc';
                            $('.listContent'+F_TabId+' .table-part thead i').each(function () {
                                $(this).addClass('glyphicon-triangle-bottom').removeClass('glyphicon-triangle-top');
                            });
                            $(this).removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
                        } else {
                            ordreStr += '&order_type=desc';
                            $(this).addClass('glyphicon-triangle-bottom').removeClass('glyphicon-triangle-top');
                        }
                        F_Search._searchRank = ordreStr;
                        F_Search._getDetail(1);
                    });
                });
            }
        }
        return str;
    },
    _getSearchDetail:function(key){
        G_Pop._init('open',{'type':2,'scroll':true,'title':'用户详情','width':'1050px','height':'550px','shift':2,'content':'insideattribute_s.html?k='+key},'');
    }
}