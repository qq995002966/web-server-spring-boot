var F_ServiceId = '';
$(function () {
    G_Login._check();
    G_Login._status('user');
    var $_GET = getUrl('query');
    var controller = getUrl('controller');
    //U_Book._checkStatus(controller);
    var currentData = U_Service._init[controller];
    switch(controller) {
        case 'insidelost':
            U_Dom._menu('2-1');
            G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('insideLost');
            G_Game._setLast(G_GameId,'insideLost');
            F_ServiceId = 1;
            break;
        case 'insidepay':
            U_Dom._menu('2-2');
            G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('insidePay');
            G_Game._setLast(G_GameId,'insidePay');
            F_ServiceId = 2;
            break;
    }
    U_InnderGame._getOrderGame(controller,'<a href="'+G_Jump._getUrl('item')+'?k='+currentData[2]+'" target="_blank"><img src="elements/img/demo/'+controller+'.jpg"></a>');
    $('.mr_h_tab ul li').each(function(index){
        $(this).click(function () {
            switch(index+''){
                case '0':
                    $('#insidelist').show();
                    $('#insidechart').hide();
                    $('#insidepdf').hide();
                    break;
                case '1':
                    $('#insidechart').show();
                    $('#insidelist').hide();
                    $('#insidepdf').hide();
                    if($('.il_active').html() == ''){
                        F_Chart._getData();
                    }
                    break;
                case '2':
                    $('#insidechart').hide();
                    $('#insidelist').hide();
                    $('#insidepdf').show();
                    if($('#iframepdf').attr('src') == ''){
                        $('#iframepdf').attr('src',G_Jump._getUrl('pdf')+'?service_id='+F_ServiceId+'&game_id='+G_GameId);
                    }
                    //G_Jump._go('base',G_Jump._getUrl('pdf')+'?service_id='+F_ServiceId+'&game_id='+G_GameId);
                    break;
            }
            //if(index+'' != '2')$(this).addClass('liOn').siblings('li').removeClass('liOn');
            $(this).addClass('liOn').siblings('li').removeClass('liOn');
        });
        $(this).hover(function () {
            switch(index+''){
                case '1':
                    if($(this).hasClass('liOn')){
                        clearTimeout(optionListTimeout);
                        $('#optionSelect').show();
                    }
                    break;
            }
        },function () {
            switch(index+''){
                case '1':
                    if($(this).hasClass('liOn')){
                        optionListTimeout = setTimeout(function () {
                            $('#optionSelect').hide();
                        },1000);
                    }
                    break;
            }
        });
        $('#optionSelect').hover(function () {
            clearTimeout(optionListTimeout);
        },function () {
            optionListTimeout = setTimeout(function () {
                $('#optionSelect').hide();
            },500);
        });
    });
});
var chartSavedTimeOut;
var F_Chart = {
    _buff:{rank:[]},
    _saveRank:function (rank) {
        G_Port._ajax('innerChartSave','post',true,'service_id='+F_ServiceId+'&game_id='+G_GameId+'&form_id='+rank,null,null,null,null)
    },
    _getSingle:function () {
        G_Port._ajax('innerChart','get',true,'service_id='+F_ServiceId+'&game_id='+G_GameId+'&chart_type=1',function () {
                $('#bs_chart_pie').html(G_Pre._loading());
                $('#bs_chart_line').html(G_Pre._loading());
            },function () {
                $('#bs_chart_pie').html('');
                $('#bs_chart_line').html('');
            },function(data,msg){
                if(data.form && data.form.length>0){
                    var dom = '';
                    for(var i=0;i<data.form.length;i++){
                        switch(data.form[i].form_type+''){
                            case '1':
                                $('.cp-l .title').html(data.form[i].form_name);
                                dom = 'bs_chart_pie';
                                break;
                            default:
                                $('.cp-r .title').html(data.form[i].form_name);
                                dom = 'bs_chart_line';
                                break;
                        }
                        F_Chart._drawChart(data.form[i],dom);
                    }
                }
            },function(data,msg,code){
                $('#bs_chart_pie').html(G_Pre._empty(msg));
                $('#bs_chart_line').html(G_Pre._empty(msg));
            }
        )
    },
    _getData:function () {
        G_Port._ajax('innerChart','get',true,'service_id='+F_ServiceId+'&game_id='+G_GameId,function () {
                $('.il_active').html(G_Pre._loading());
            },function () {
                $('.il_active').html('');
            },function(data,msg){
                F_Chart._buff.chartData = data.form;
                F_Chart._buff.rank = data.order == '' ? [] : data.order.split(',');
                if(data.form && data.form.length>0){
                    var chooseStr = '';
                    var hasRank = false;
                    if(F_Chart._buff.rank.length > 0)hasRank = true;
                    for(var i=0;i<data.form.length;i++){
                        if(!hasRank)F_Chart._buff.rank.push(data.form[i].form_id);
                        chooseStr += '<li class="tg-checkbox-btn"><input name="chooseClassify" type="checkbox" id="ip_'+i+'" value="'+data.form[i].form_id+'"';
                        if($.inArray(data.form[i].form_id+'',F_Chart._buff.rank) > -1 || $.inArray(data.form[i].form_id,F_Chart._buff.rank) > -1)chooseStr += ' checked';
                        chooseStr += '><label for="ip_'+i+'"></label>'+data.form[i].form_name+'</li>';
                    }
                    F_Chart._htmlChoose(chooseStr);
                    $('#optionSelect input').each(function () {
                        $(this).click(function () {
                            F_Chart._chartInit();
                        });
                    });
                    F_Chart._chartInit();
                }
            },function(data,msg,code){
                $('.il_active').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlChoose:function (data) {
        var str = '<p>请勾选需要定位的内容</p>';
        str += data;
        $('#optionSelect').html(str);
    },
    _chartInit:function () {
        var str = '';
        var isSaveRank = false;
        var choosed = checkboxVal('chooseClassify');
        if(choosed != ''){
            choosed = choosed.split(',');
            for(var i=0;i<choosed.length;i++){
                if(!($.inArray(choosed[i]+'',F_Chart._buff.rank) > -1 || $.inArray(choosed[i],F_Chart._buff.rank) > -1)){
                    isSaveRank = true;
                    F_Chart._buff.rank.push(choosed[i]);
                }
            }
            var newRank = [];
            if(choosed.length != F_Chart._buff.rank.length){
                for(var i=0;i<F_Chart._buff.rank.length;i++){
                    if($.inArray(F_Chart._buff.rank[i]+'',choosed) > -1 || $.inArray(F_Chart._buff.rank[i],choosed) > -1){
                        newRank.push(F_Chart._buff.rank[i]);
                    }
                }
                F_Chart._buff.rank = newRank;
                isSaveRank = true;
            }
        }else{
            choosed = [];
        }
        /*
        for(var i=0;i<F_Chart._buff.chartData.length;i++){
            if($.inArray(F_Chart._buff.chartData[i].form_id+'',choosed) > -1) {
                str += F_Chart._htmlChart(F_Chart._buff.chartData[i]);
            }
        }
        */
        var useRank = [];
        for(var r=0;r<F_Chart._buff.rank.length;r++){
            if($.inArray(F_Chart._buff.rank[r]+'',useRank) > -1 || $.inArray(F_Chart._buff.rank[r],useRank) > -1){
                continue;
            }else{
                useRank.push(F_Chart._buff.rank[r]);
            }
            for(var i=0;i<F_Chart._buff.chartData.length;i++) {
                if (F_Chart._buff.chartData[i].form_id+'' == F_Chart._buff.rank[r]+'' && $.inArray(F_Chart._buff.chartData[i].form_id + '', choosed) > -1) {
                    str += F_Chart._htmlChart(F_Chart._buff.chartData[i]);
                }
            }
        }
        if(isSaveRank)F_Chart._setRank(F_Chart._buff.rank);
        $('.il_active').html(str);
        F_Chart._formatGride();
        F_Chart._formatChart(choosed);
    },
    _formatGride:function () {
        $('.gridly').gridly({
            base: 475, // px
            gutter: 10, // px
            columns: 2,
            callbacks: { reordered: function (elements) {
                var rank = [];
                for(var i=0;i<elements.length;i++){
                    rank.push(elements[i].id);
                }
                F_Chart._setRank(rank);
            }}
        });
    },
    _setRank:function (rank) {
        var rank = rank;
        clearTimeout(chartSavedTimeOut);
        chartSavedTimeOut = setTimeout(function(){
            F_Chart._buff.rank = rank;
            rank = rank.join(',');
            F_Chart._saveRank(rank);
        },1000);
    },
    _htmlChart:function (data) {
        var str = '';
        str += '<div class="il_active_area il_border" id="'+data.form_id+'">';
        str += '<div class="c_padding10">';
        str += '<p class="il_title">'+data.form_name+'</p>';
        str += '<div class="il_chart" id="bs_'+data.form_id+'"></div>';
        str += '</div>';
        str += '</div>';
        return str;
    },
    _formatChart:function (choosed) {
        if(F_Chart._buff.chartData && F_Chart._buff.chartData.length > 0){
            for(var i=0;i<F_Chart._buff.chartData.length;i++){
                if($.inArray(F_Chart._buff.chartData[i].form_id+'',choosed) > -1){
                    F_Chart._drawChart(F_Chart._buff.chartData[i]);
                }
            }
        }
    },
    _drawChart:function (data,dom) {
        var chartDataPre = {'tipsTrigger':'item','legend':[],'xAxis':[],'yAxis':[],'series':[],'xType':'category','yType':'value'};
        var dom = dom ? dom : 'bs_'+data.form_id;
        var chartType = 'line';
        switch(data.form_type+''){
            case '1':
                if(data.form_data && data.form_data.length > 0){
                    chartDataPre.series.push({
                        name:data.form_name,
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[]
                    });
                    for(var i=0;i<data.form_data.length;i++){
                        chartDataPre.series[0].data.push({value:data.form_data[i].ratio, name:data.form_data[i].item});
                    }
                }
                break;
            case '2':
                if(data.form_data && data.form_data.length > 0){
                    chartDataPre.xType = 'value';
                    chartDataPre.yType = 'category';
                    var dataUnion = data.form_data;
                    for(var i=0;i<dataUnion.length;i++){
                        chartDataPre.legend.push(dataUnion[i].name);
                        for(var n=0;n<data.form_data[i].data.y_axis.length;n++){
                            dataUnion[i].data.y_axis[n] = parseFloat(dataUnion[i].data.y_axis[n]);
                        }
                        chartDataPre.series.push({
                            name:dataUnion[i].name,
                            type:'bar',
                            data:dataUnion[i].data.y_axis
                        });
                        if(i == 0){
                            chartDataPre.yAxis = dataUnion[i].data.x_axis;
                        }
                    }
                }
                break;
            case '3':
                if(data.form_data && data.form_data.length > 0){
                    chartDataPre.xType = 'category';
                    chartDataPre.yType = 'value';
                    chartDataPre.tipsTrigger = 'axis';
                    chartDataPre.xAxis = data.form_data[0].x_axis;
                    var dataUnion = data.form_data[0].y_axis;
                    for(var i=0;i<dataUnion.length;i++){
                        chartDataPre.legend.push(dataUnion[i].name);
                        for(var n=0;n<dataUnion[i].data.length;n++){
                            dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                        }
                        chartDataPre.series.push({
                            name:dataUnion[i].name,
                            type:'line',
                            data:dataUnion[i].data
                        });
                    };
                    /*
                    var bigLength = 0;
                    var bigXAxis = [];
                    for(var i=0;i<dataUnion.length;i++){
                        if(!dataUnion[i].data.x_axis){
                            dataUnion[i].data.x_axis = dataUnion[i].data.x_axis ? dataUnion[i].data.x_axis :dataUnion[i].data.data_date;
                        }
                        if(dataUnion[i].data.x_axis.length > bigLength){
                            bigXAxis = dataUnion[i].data.x_axis;
                            bigLength = dataUnion[i].data.x_axis.length;
                        }
                    }
                    for(var i=0;i<dataUnion.length;i++){
                        chartDataPre.legend.push(dataUnion[i].name);
                        if(!dataUnion[i].data.y_axis)dataUnion[i].data.y_axis = dataUnion[i].data.ratio;
                        for(var n=0;n<dataUnion[i].data.y_axis.length;n++){
                            dataUnion[i].data.y_axis[n] = parseFloat(dataUnion[i].data.y_axis[n]);
                        }
                        if(dataUnion[i].data.y_axis.length < bigLength){
                            for(var b=dataUnion[i].data.y_axis.length;b<bigLength;b++){
                                dataUnion[i].data.y_axis[b] = '-';
                            }
                        }
                        chartDataPre.series.push({
                            name:dataUnion[i].name,
                            type:'line',
                            data:dataUnion[i].data.y_axis
                        });
                        if(i == 0){
                            chartDataPre.xAxis = bigXAxis;
                        }
                        n++;
                    };
                     */
                }
                break;
            case '4':
                if(data.form_data && data.form_data.length > 0){
                    var dataUnion = data.form_data;
                    for(var i=0;i<dataUnion.length;i++){
                        chartDataPre.legend.push(dataUnion[i].name);
                        for(var n=0;n<dataUnion[i].data.y_axis.length;n++){
                            dataUnion[i].data.y_axis[n] = parseFloat(dataUnion[i].data.y_axis[n]);
                        }
                        chartDataPre.series.push({
                            name:dataUnion[i].name,
                            type:'bar',
                            data:dataUnion[i].data.y_axis
                        });
                        if(i == 0){
                            chartDataPre.xAxis = dataUnion[i].data.x_axis;
                        }
                    };
                }
                break;
            case '5':
                if(data.form_data && data.form_data.length > 0){
                    chartDataPre.xType = 'category';
                    chartDataPre.yType = 'value';
                    chartDataPre.tipsTrigger = 'axis';
                    chartDataPre.xAxis = data.form_data[0].x_axis;
                    var dataUnion = data.form_data[0].y_axis;
                    for(var i=0;i<dataUnion.length;i++){
                        chartDataPre.legend.push(dataUnion[i].name);
                        for(var n=0;n<dataUnion[i].data.length;n++){
                            dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                        }
                        chartDataPre.series.push({
                            name:dataUnion[i].name,
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:dataUnion[i].data
                        });
                    };
                    /*
                    for(var i=0;i<dataUnion.length;i++){
                        chartDataPre.legend.push(dataUnion[i].name);
                        if(!dataUnion[i].data.y_axis)dataUnion[i].data.y_axis = dataUnion[i].data.ratio;
                        for(var n=0;n<dataUnion[i].data.y_axis.length;n++){
                            dataUnion[i].data.y_axis[n] = parseFloat(dataUnion[i].data.y_axis[n]);
                        }
                        chartDataPre.series.push({
                            name:dataUnion[i].name,
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:dataUnion[i].data.y_axis
                        });
                        if(i == 0){
                            chartDataPre.xAxis = dataUnion[i].data.x_axis ? dataUnion[i].data.x_axis : dataUnion[i].data.data_date;
                        }
                    };
                    */
                }
                break;
            case '6':
                var tdStr = '';
                var thStr = '';
                if(data.form_data && data.form_data.length > 0){
                    /*
                    $.each(data.form_data[0],function (key,value) {
                        if(key == 'item'){
                            thStr += '<tr><th></th>';
                            for(var i=0;i<value.length;i++){
                                thStr += '<th>'+value[i]+'</th>';
                            }
                            thStr += '</tr>';
                        }else{
                            tdStr += '<tr><td>'+key+'</td>';
                            for(var i=0;i<value.length;i++){
                                tdStr += '<td>'+value[i]+'</td>';
                            }
                            tdStr += '</tr>';
                        }
                    });
                    */
                    var listItem = [];
                    thStr += '<tr><th></th>';
                    $.each(data.form_data[0],function (key,value) {
                        if(key != 'item'){
                            thStr += '<th>'+key+'</th>';
                            listItem.push(key);
                        }
                    });
                    thStr += '</tr>';
                    var dataUnion = data.form_data[0];
                    for(var i=0;i<dataUnion.item.length;i++){
                        tdStr += '<tr><td>'+dataUnion.item[i]+'</td>';
                        for(var n=0;n<listItem.length;n++){
                            tdStr += '<td>'+dataUnion[listItem[n]][i]+'</td>';
                        }
                        tdStr += '</tr>';
                    }
                    $('#'+dom).html('<div class="bs_table"><table>'+thStr+tdStr+'</table></div>');
                }
                return;
                break;
            case '7':
                if(data.form_data && data.form_data.length > 0){
                    chartDataPre.xType = 'category';
                    chartDataPre.yType = 'value';
                    chartDataPre.tipsTrigger = 'axis';
                    $.each(data.form_data[0],function (key, value) {
                        switch(key){
                            case 'data_date':
                            case 'x_axis':
                                chartDataPre.xAxis = value;
                                break;
                            default:
                                var legendName = key.split(':');
                                chartDataPre.legend.push(legendName[1]);
                                for(var i=0;i<value.length;i++){
                                    value[i] = parseFloat(value[i]);
                                }
                                switch(legendName[0]+''){
                                    case '1':
                                        chartDataPre.series.push({
                                            name:legendName[1],
                                            type:'line',
                                            data:value
                                        });
                                        break;
                                    default:
                                        chartDataPre.series.push({
                                            name:legendName[1],
                                            type:'bar',
                                            data:value
                                        });
                                        break;
                                }
                                break;
                        }
                    })
                }
                break;
        }
        var chartData = {};
        chartData.color = ['#3399cc','#33cc66','#663366','#cc3333','#0033cc','#339933','#333366','#FF9933'];
        chartData.tooltip = {trigger:chartDataPre.tipsTrigger};
        chartData.legend = {
            left:'right',
            data:chartDataPre.legend
        };
        chartData.grid = {
            left: '1%',
            right: '2%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        }
        if(data.form_type+'' != '1'){
            chartData.xAxis = [
                {
                    splitLine : {
                        show:false
                    },
                    type : chartDataPre.xType,
                    data : chartDataPre.xAxis,
                    axisLine:{
                        show : false
                    },
                    axisTick:{
                        show : false
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
                    type : chartDataPre.yType,
                    data : chartDataPre.yAxis,
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
        }
        chartData.series = chartDataPre.series;
        getEChart('line',dom,chartData);
    }
}
var F_Search = {
    _tags:[],
    _tagsList:[],
    _searchRank:'',
    _resetMeta:function () {
        if(F_Search._tags && F_Search._tags.length > 0){
            for(var i=0;i<F_Search._tags.length;i++){
                switch(F_Search._tags[i].type){
                    case 'span':
                        var dom1 = F_Search._tags[i].name+'_min';
                        var dom2 = F_Search._tags[i].name+'_max';
                        $('#'+dom1).val('');
                        $('#'+dom2).val('');
                        break;
                    case 'query':
                        var dom = F_Search._tags[i].name;
                        $('#'+dom).val('');
                        break;
                    case 'enum':
                        var dom = F_Search._tags[i].name;
                        $('#'+dom).html('全部');
                        break;
                }
            }
        }
        F_Search._getDetail(1);
    },
    _getSearchTag:function () {
        var str = [];
        if(F_Search._tags && F_Search._tags.length > 0){
            for(var i=0;i<F_Search._tags.length;i++){
                switch(F_Search._tags[i].type){
                    case 'span':
                        var dom1 = F_Search._tags[i].name+'_min';
                        var dom2 = F_Search._tags[i].name+'_max';
                        var dom1Data = $.trim($('#'+dom1).val());
                        var dom2Data = $.trim($('#'+dom2).val());
                        if(dom1Data != ''){
                            str.push(dom1+'='+G_Common._encodeUrl(dom1Data));
                        }
                        if(dom2Data != ''){
                            str.push(dom2+'='+G_Common._encodeUrl(dom2Data));
                        }
                        break;
                    case 'query':
                        var dom = F_Search._tags[i].name;
                        var domData = $.trim($('#'+dom).val());
                        if(domData != ''){
                            str.push(dom+'='+G_Common._encodeUrl(domData));
                        }
                        break;
                    case 'enum':
                        var dom = F_Search._tags[i].name;
                        var domData = $.trim($('#'+dom).html());
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
        $('.table-part thead i').each(function () {
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
                $('.table-part tbody').html(G_Pre._loading()+'<tr class="empty"></tr>');
            },function () {
                $('.table-part tbody').html('');
            },function(data,msg){
                if(data.list && data.list.length >0){
                    $('.table-part tbody').html(F_Search._htmlList(data.list));
                    $('.page-list').html(G_Page._show({total:data.total,page:page},'simple'));
                    U_Common._tableHover();
                    F_Search._pageGo(page);
                }else{
                    $('.table-part tbody').html(G_Pre._empty('暂无数据')+'<tr class="empty"></tr>');
                    $('.page-list').html('');
                }
            },function(data,msg,code){
                $('.page-list').html('');
                switch(code+''){
                    case '-1004':
                        msg = '参数错误';
                        break;
                }
                $('.table-part tbody').html(G_Pre._empty(msg)+'<tr class="empty"></tr>');
            }
        )
    },
    _pageGo:function(page,postData){
        $('.page-list .prev').click(function(){
            F_Search._pageRequest(parseInt(page)-1);
        });
        $('.page-list .next').click(function(){
            F_Search._pageRequest(parseInt(page)+1);
        });
        $('.page-list button').click(function(){
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
        submitBind($('.page-list button'),$('.page-list input'));
    },
    _pageRequest:function(page){
        var total = $('.page-list button').attr('data-a');
        if(page > 0 && parseInt(page)<=parseInt(total)){
            F_Search._getDetail(page);
        }
    },
    _htmlList:function (data) {
        var str = '';
        var tagLength = F_Search._tagsList.length;
        for(var i=0;i<data.length;i++){
            var thStr = '<tr>';
            var tdStr = '<tr>';
            for(var n=0;n<tagLength;n++){
                if(i==0 && $('.table-part thead').html() == ''){
                    var headName = F_Search._tagsList[n].name;
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
                    if(F_Search._tagsList[n].type == 'span')headName += '<i data-i="'+F_Search._tagsList[n].key+'" class="glyphicon glyphicon-triangle-bottom"></i>';
                    thStr += '<th>'+headName+'</th>';

                }
                tdStr += '<td>'+data[i].source[F_Search._tagsList[n].key]+'</td>';
            }
            /*
            $.each(data[i].source,function (key,value) {
                if(i==0 && $('.table-part thead').html() == ''){
                    var headName = F_Search._tagName[key].name;
                    if(headName){
                        var length = headName.length;
                        if(length > 3){
                            var headNameStr = '';
                            var splitNum = Math.ceil(length/3);
                            for(var n=0;n<splitNum;n++){
                                headNameStr += headName.substr((n*3),3);
                                if(splitNum > n+1)headNameStr += '<br>';
                            }
                            headName = headNameStr;
                        }
                    }
                    if(F_Search._tagName[key].type == 'span')headName += '<i data-i="'+key+'" class="glyphicon glyphicon-triangle-bottom"></i>';
                    thStr += '<th>'+headName+'</th>';
                }
                tdStr += '<td>'+value+'</td>';
            });
            */
            tdStr += '</tr>';
            str += tdStr;

            if(i==0 && $('.table-part thead').html() == ''){
                thStr += '</tr>';
                $('.table-part thead').html(thStr);
                $('.table-part thead i').each(function (index) {
                    $(this).click(function () {
                        var ordreStr = 'order_by_field='+$(this).attr('data-i');
                        if ($(this).hasClass('glyphicon-triangle-bottom')) {
                            ordreStr += '&order_type=asc';
                            $('.table-part thead i').each(function () {
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
    _getSearchMeta:function () {
        G_Port._ajax('innerSearchMeta','get',true,'service_id='+F_ServiceId+'&game_id='+G_GameId,function () {
                $('.choice-part').html(G_Pre._loading());
            },function () {
                $('.choice-part').html('');
            },function(data,msg){
                if(data && data.length >0){
                    var str = '<div class="choice-list"><ul>';
                    for(var i=0;i<data.length;i++){
                        str += F_Search._htmlMeta(data[i].search_type,data[i].column_name,data[i].column_desc);
                    }
                    str += '</ul></div>';
                    str += '<div class="btn-part">\
                            <button id="bs_btn_search">开始定位</button> <button id="bs_btn_reset">重置</button>\
                            </div>';

                    $('.choice-part').html(str);
                    // 鼠标离开隐藏菜单
                    $('.drop-hide').mouseleave(function(event) {
                        $(this).children('ul').hide();
                    });
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
    _htmlMeta:function (data,inputname,title) {
        var dataSplit = data.split(':');
        var str = '';
        F_Search._tagsList.push({key:inputname,name:title,type:dataSplit[0]});
        switch(dataSplit[0]){
            case 'span':
                F_Search._tags.push({'type':dataSplit[0],'name':inputname});
                str += '<li class="select-area"><span>'+title+'</span>';
                str += '<input type="text" id="'+inputname+'_min" class="all-input  area-input"><span class="zhi">至</span><input type="text" id="'+inputname+'_max" class="all-input  area-input">';
                str += '</li>';
                break;
            case 'enum':
                var dataEnum = dataSplit[1] ? dataSplit[1].split(',') : [];
                if(dataEnum.length > 0){
                    F_Search._tags.push({'type':dataSplit[0],'name':inputname});
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
                F_Search._tags.push({'type':dataSplit[0],'name':inputname});
                str += '<li class="text-input"><span>'+title+'</span><input type="text"  id="'+inputname+'" class="all-input name-input "></li>';
                break;
        }
        return str;
    }
}
