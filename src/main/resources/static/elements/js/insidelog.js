var F_ServiceId = '';
var F_TabId = '';
var F_TabName = '';
$(function () {
    G_Login._check();
    G_Login._status('user');
    //U_Book._checkStatus('insidelog');
    U_Dom._menu('2-4');
    var $_GET = getUrl('query');
    G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('insidelog');
    G_Game._setLast(G_GameId,'insidelog');
    F_ServiceId = 4;
    var currentData = U_Service._init['insidelog'];
    U_InnderGame._getOrderGame('insidelog','<a href="'+G_Jump._getUrl('item')+'?k='+currentData[2]+'" target="_blank"><img src="elements/img/demo/insidelog.jpg"></a>');
});

var F_Chart = {
    _getBeginDate:function () {
        return $.trim($('#db'+F_TabId).val());
    },
    _getEndDate:function () {
        return $.trim($('#de'+F_TabId).val());
    },
    _getChartInfo:function () {
        var begin = F_Chart._getBeginDate();
        var end = F_Chart._getEndDate();
        G_Port._ajax('innerLogChart','get',true,'type='+F_TabName+'&start_date='+begin+'&end_date='+end+'&game_id='+G_GameId,function(){
            $('#bs_chart_'+F_TabId).html(G_Pre._loading());
        },function(){
            $('#bs_chart_'+F_TabId).html('');
        },function(data,msg){
            if(data){
                var dateArr = G_Date._dateArr(begin,end,'year');
                var chartData = {};
                var chartDataPre = {xAxis:[],data:[],fix:[]};
                $.each(dateArr,function (key,value) {
                    chartDataPre.xAxis.push(value.small);
                    chartDataPre.data.push(0);
                    chartDataPre.fix.push(value.big);
                });
                for(var i=0;i<data.length;i++){
                    var index = $.inArray(data[i].data_date,chartDataPre.fix);
                    if(index > -1){
                        chartDataPre.data[index] = data[i].log_num;
                    }
                }
                chartData.tooltip = {trigger:'axis'};
                chartData.legend = null;
                chartData.grid = {
                    top:5,
                    left: 2,
                    bottom: 5,
                    right: 15,
                    containLabel: true
                };
                chartData.xAxis = [
                    {
                        splitLine : {
                            show:false
                        },
                        type : 'category',
                        data : chartDataPre.xAxis,
                        axisLine:{
                            show : false
                        },
                        axisTick:{
                            show : false
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#C2C2C2',
                                fontSize : '11px'
                            }
                        }
                    }
                ];
                chartData.yAxis = [
                    {
                        splitLine : {
                            lineStyle:{
                                color:'#EEEEEE'
                            }
                        },
                        type : 'value',
                        nameLocation : 'middle',
                        nameTextStyle : {
                            color:'#C2C2C2',
                            fontSize : '11px'
                        },
                        axisLine:{
                            show : false
                        },
                        axisTick:{
                            show : false
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#C2C2C2',
                                fontSize : '11px'
                            }
                        }
                    }
                ];
                chartData.series = [
                    {
                        barMaxWidth:30,
                        type: 'bar',
                        name: '数量',
                        data: chartDataPre.data
                    }
                ];
                getEChart('line','bs_chart_'+F_TabId,chartData);
            }
        },function(data,msg,code){
            $('#bs_chart_'+F_TabId).html(G_Pre._empty(msg));
        })
    }
}
var F_Tab = {
    _tabDate:{},
    _getTab:function () {
        G_Port._ajax('innerLogType','get',true,'game_id='+G_GameId,function (){
            G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        },function () {
            G_Pop._init('close');
        },function(data,msg){
            if(data && data.length >0){
                $('.mr_h_tab ul').html(F_Tab._htmlTab(data));
                F_Search._getSearchMeta();
                $('.mr_h_tab ul li').click(function () {
                    $(this).addClass('liOn').siblings().removeClass('liOn');
                    F_TabId = $(this).attr('data-i');
                    F_TabName = $(this).attr('data-w');
                    $('.tabContent'+F_TabId).show().siblings('.tabBS').hide();
                    if($('.tabContent'+F_TabId+' .choice-part').html() == ''){
                        F_Search._getSearchMeta();
                    }
                    if($('.tabContent'+F_TabId+' .inside_chart').html() == ''){
                        F_Chart._getChartInfo();
                    }
                });
            }
        },function(data,msg,code){
            G_Pop._init('msg',{'content':msg});
        })
    },
    _htmlTab:function (data) {
        var str = '';
        var area = '';
        for(var i=0;i<data.length;i++){
            F_Search._tags[data[i].table_name] = [];
            F_Search._tagsList[data[i].table_name] = [];
            area += F_Tab._htmlArea(i,data[i].table_desc);
            str += '<li data-i="'+i+'" data-w="'+data[i].table_name+'"';
            if(i==0){
                str += ' class="liOn"';
                F_TabId = 0;
                F_TabName = data[i].table_name;
            }
            str += '>'+data[i].table_desc+'</li>';
        }
        $('#insidelist').html(area);

        var beginDate = G_Date._get(-30);
        var endDate = G_Date._get(-1);
        for(var i=0;i<data.length;i++){
            F_Tab._tabDate[i] = {'begin':beginDate,'end':endDate};
            dataChoose._section({'autoCommit':false,'todayValid':false},i,beginDate,endDate,function(begin,end){
                if(begin != F_Tab._tabDate[F_TabId].begin || end != F_Tab._tabDate[F_TabId].end){
                    F_Tab._tabDate[F_TabId].begin = begin;
                    F_Tab._tabDate[F_TabId].end = end;
                    F_Chart._getChartInfo(begin,end);
                }
            });
            $('#db'+i).val(beginDate);
            $('#de'+i).val(endDate);
            if(i==0)F_Chart._getChartInfo();
        }
        return str;
    },
    _htmlArea:function (number,name) {
        var str = '<div class="tabBS tabContent'+number;
        str += number==0 ? '' : ' c_none';
        str += '">';
        str += '<div class="insidelog-login-watch c_padding20">';
        str += '<div style="padding-bottom: 0">';
        str += '<div class="mr_choose_date">';
        str += '<h3>'+name+'监测</h3>';
        str += '<div class="mr_choose_area">';
        str += '<div class="mr_choose_show">';
        str += '<span id="dc'+number+'"></span>';
        str += '<i class="mr_choose_icon glyphicon glyphicon-calendar"></i>';
        str += '<input id="db'+number+'" type="hidden" value="">';
        str += '<input id="de'+number+'" type="hidden" value="">';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        str += '<div class="inside_chart" id="bs_chart_'+number+'"></div>';
        str += '</div>';
        str += '</div>';
        str += '<div class="inLost-content" id="insidelist"><div class="t-header">';
        str += '<h3>'+name+'搜索</h3>'
        str += '<button class="downloadBtn'+number+'"> <i class="glyphicon glyphicon-save"></i>下载数据</button>';
        str += '</div>';
        str += '<div class="choice-part"></div>';

        str += '<div class="table-part insidelog"><table><thead></thead><tbody></tbody></table></div>';
        str += '<ul class="page-list"></ul></div></div>';
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
        G_Port._ajax('innerLogMeta','get',true,'type='+F_TabName+'&game_id='+G_GameId,function () {
                $('.tabContent'+F_TabId+' .choice-part').html(G_Pre._loading());
            },function () {
                $('.tabContent'+F_TabId+' .choice-part').html('');
            },function(data,msg){
                if(data && data.length >0){
                    var str = '<div class="choice-list"><ul>';
                    for(var i=0;i<data.length;i++){
                        str += F_Search._htmlMeta(data[i].search_type,data[i].column_name,data[i].column_desc);
                    }
                    str += '</ul></div>';
                    str += '<div class="btn-part">\
                            <button id="bs_btn_search">查找</button> <button id="bs_btn_reset">重置</button>\
                            </div>';

                    $('.tabContent'+F_TabId+' .choice-part').html(str);
                    // 鼠标离开隐藏菜单
                    $('.tabContent'+F_TabId+' .drop-hide').mouseleave(function(event) {
                        $(this).children('ul').hide();
                    });
                    F_Search._dropShow();
                    F_Search._dropSelected();

                    $('.tabContent'+F_TabId+' .btn-part #bs_btn_search').click(function () {
                        F_Search._getDetail(1);
                    });

                    $('.tabContent'+F_TabId+' .btn-part #bs_btn_reset').click(function () {
                        F_Search._resetMeta();
                    });

                    $('.downloadBtn'+F_TabId).click(function () {
                        var postData = [];
                        postData.push('type='+F_TabName);
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
                $('.tabContent'+F_TabId+' .choice-part').html(G_Pre._empty(msg));
            }
        )
    },
    _dropShow:function(){
        $('.tabContent'+F_TabId+' #dropDown p').click(function() {
            var ul = $(this).parent('#dropDown').children('ul');
            if (ul.css("display") == "none") {
                ul.slideDown("fast");
            } else {
                ul.slideUp("fast");
            }
        });
    },
    _dropSelected:function(){
        $('.tabContent'+F_TabId+' #dropDown ul li a').click(function() {
            var txt = $(this).text();
            var key = $(this).attr('data-i');
            $(this).parents('#dropDown').find('p').html(txt).attr('data-i', key);
            $(this).parents('#dropDown').children('ul').hide();
        });
    },
    _htmlMeta:function (data,inputname,title) {
        var dataSplit = data.split(':');
        var str = '';
        F_Search._tagsList[F_TabName].push({key:inputname,name:title,type:dataSplit[0]});
        switch(dataSplit[0]){
            case 'span':
                F_Search._tags[F_TabName].push({'type':dataSplit[0],'name':inputname});
                if(dataSplit[1]){
                    str += '<li class="select-area select-time-area"><span>'+title+'</span>';
                    switch(dataSplit[1]){
                        case 'date':
                            str += '<input readonly type="text" id="'+inputname+'_min" class="all-input area-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})"><span class="zhi">至</span><input readonly type="text" id="'+inputname+'_max" class="all-input area-input" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})">';
                            break;
                        case 'datetime':
                            str += '<input readonly type="text" id="'+inputname+'_min" class="all-input area-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})"><span class="zhi">至</span><input readonly type="text" id="'+inputname+'_max" class="all-input  area-input"  onclick="laydate({istime: true, format: \'YYYY-MM-DD hh:mm:ss\'})">';
                            break;
                    }
                }else{
                    str += '<li class="select-area"><span>'+title+'</span>';
                    str += '<input type="text" id="'+inputname+'_min" class="all-input  area-input"><span class="zhi">至</span><input type="text" id="'+inputname+'_max" class="all-input  area-input">';

                }
                str += '</li>';
                break;
            case 'enum':
                var dataEnum = dataSplit[1] ? dataSplit[1].split(',') : [];
                if(dataEnum.length > 0){
                    F_Search._tags[F_TabName].push({'type':dataSplit[0],'name':inputname});
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
                F_Search._tags[F_TabName].push({'type':dataSplit[0],'name':inputname});
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
        $('.tabContent'+F_TabId+' .table-part thead i').each(function () {
            $(this).hasClass('glyphicon-triangle-top') ? str.push($(this).attr('data-i')) : '';
        });
        if(str.length > 0){
            return 'order_by_field='+str.join(',');
        }else{
            return '';
        }
    },
    _getDetail:function (page) {
        var postData = [];
        postData.push('type='+F_TabName);
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

        G_Port._ajax('innerLogSearch','get',true,condition,function () {
                $('.tabContent'+F_TabId+' .table-part tbody').html(G_Pre._loading()+'<tr class="empty"></tr>');
            },function () {
                $('.tabContent'+F_TabId+' .table-part tbody').html('');
            },function(data,msg){
                if(data.list && data.list.length >0){
                    $('.tabContent'+F_TabId+' .table-part tbody').html(F_Search._htmlList(data.list));
                    $('.tabContent'+F_TabId+' .page-list').html(G_Page._show({total:data.total,page:page},'simple'));
                    U_Common._tableHover();
                    F_Search._pageGo(page);
                }else{
                    $('.tabContent'+F_TabId+' .table-part tbody').html(G_Pre._empty('暂无数据')+'<tr class="empty"></tr>');
                    $('.tabContent'+F_TabId+' .page-list').html('');
                }
            },function(data,msg,code){
                $('.tabContent'+F_TabId+' .page-list').html('');
                switch(code+''){
                    case '-1004':
                        msg = '参数错误';
                        break;
                }
                $('.tabContent'+F_TabId+' .table-part tbody').html(G_Pre._empty(msg)+'<tr class="empty"></tr>');
            }
        )
    },
    _pageGo:function(page,postData){
        $('.tabContent'+F_TabId+' .page-list .prev').click(function(){
            F_Search._pageRequest(parseInt(page)-1);
        });
        $('.tabContent'+F_TabId+' .page-list .next').click(function(){
            F_Search._pageRequest(parseInt(page)+1);
        });
        $('.tabContent'+F_TabId+' .page-list button').click(function(){
            var goPage = $.trim($('.tabContent'+F_TabId+' .page-list input').val());
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
        submitBind($('.tabContent'+F_TabId+' .page-list button'),$('.tabContent'+F_TabId+' .page-list input'));
    },
    _pageRequest:function(page){
        var total = $('.tabContent'+F_TabId+' .page-list button').attr('data-a');
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
                if(i==0 && $('.tabContent'+F_TabId+' .table-part thead').html() == ''){
                    var headName = F_Search._tagsList[F_TabName][n].name;
                    if(headName){
                        if(headName != '用户ID'){
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
                    }
                    if(F_Search._tagsList[F_TabName][n].type == 'span')headName += '<i data-i="'+F_Search._tagsList[F_TabName][n].key+'" class="glyphicon glyphicon-triangle-bottom"></i>';
                    thStr += '<th>'+headName+'</th>';

                }
                tdStr += '<td>'+data[i].source[F_Search._tagsList[F_TabName][n].key]+'</td>';
            }

            tdStr += '</tr>';
            str += tdStr;

            if(i==0 && $('.tabContent'+F_TabId+' .table-part thead').html() == ''){
                thStr += '</tr>';
                $('.tabContent'+F_TabId+' .table-part thead').html(thStr);
                $('.tabContent'+F_TabId+' .table-part thead i').each(function (index) {
                    $(this).click(function () {
                        var ordreStr = 'order_by_field='+$(this).attr('data-i');
                        if ($(this).hasClass('glyphicon-triangle-bottom')) {
                            ordreStr += '&order_type=asc';
                            $('.tabContent'+F_TabId+' .table-part thead i').each(function () {
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
    }
}