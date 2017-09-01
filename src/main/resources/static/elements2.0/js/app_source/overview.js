var F_Overview_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            $('#headerTop').html('');
            switch(M_Init._controller) {
                case 'demo':
                    $('#gameDropChoose').show();
                    B_Pop._init('close');
                    M_Init._api['innerOperationEvaluate'] = 'demoInnerOperationEvaluate';
                    break;
                default:
                    M_Init._api['innerOperationEvaluate'] = 'innerOperationEvaluate';
                    break;
            }
            var $_GET = B_Common._getUrl('query');
            if($_GET.g){
                M_Init._gameId = $_GET.g;
            }
            M_Common._getOrderGame('overview',$_GET.g,'1-1-1');
        }
    }
}

var F_Overview_Info = {
    _htmlInit:function () {
        var str = '';
        str += '\
            <div class="data-kh-quota blockpart col-lg-4 col-md-9 col-sm-12 col-xs-12">\
                <h3 class="part-title">考核指标</h3>\
                <div class="boxshadow" id="bs_index"></div>\
            </div>\
            <div class="data-jd-quota blockpart col-lg-2 col-md-3 col-sm-12 col-xs-12">\
                <h3 class="part-title">阶段性指标</h3>\
                <div class="boxshadow" id="bs_step"></div>\
            </div>\
            <div class="data-intelligent-forecast blockpart col-lg-3 col-md-12 col-sm-12 col-xs-12">\
                <h3 class="part-title">智能预测</h3>\
                <div class="boxshadow" id="bs_intelligent"></div>\
            </div>\
            <div class="data-unusual-watch blockpart col-lg-3 col-md-12 col-sm-12 col-xs-12">\
                <h3 class="part-title">异常数据监测</h3>\
                <div class="boxshadow" id="bs_trouble"></div>\
            </div>\
            <div class="blockpart data-keypoint-quota col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                <h3 class="part-title">关键指标分析</h3>\
                <ul class="tab-change">\
                    <li class="selected">付费金额</li>\
                    <li>活跃人数</li>\
                    <li>新增人数</li>\
                </ul>\
                <div class="boxshadow">\
                    <div id="bs_chart_info"></div>\
                    <div class="graph-part"><div id="bs_chart" style="width:100%;height:100%"></div></div>\
                </div>\
            </div>';

        $('#ct_main_area').html(str);

        $('.data-keypoint-quota ul li').each(function (index) {
            $(this).click(function () {
                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    switch(index+''){
                        case '0':
                            F_Overview_Info._chartData('pay');
                            break;
                        case '1':
                            F_Overview_Info._chartData('active');
                            break;
                        case '2':
                            F_Overview_Info._chartData('additional');
                            break;
                    }
                }
            });
        });
    },
    _htmlStep:function (data) {
        return '\
            <ul>\
                <li>\
                    <span>CAC</span>\
                    <h3>'+data.cac+'</h3>\
                </li>\
                <li>\
                    <span>LTV</span>\
                    <h3>'+data.ltv+'</h3>\
                </li>\
                <li>\
                    <span>ROI</span>\
                    <h3>'+data.roi+'</h3>\
                </li>\
            </ul>';
    },
    _htmlIntelligent:function (data) {
        var potential_lost_rate = 0;
        var pay_rate = 0;
        var potential_pay_rate = 0;
        if(data.potential_lost_rate != '-'){
            potential_lost_rate = data.potential_lost_rate;
        }
        if(data.pay_rate != '-'){
            pay_rate = data.pay_rate;
        }
        if(data.potential_pay_rate != '-'){
            potential_pay_rate = data.potential_pay_rate;
        }
        return '\
            <div>\
                <b>'+data.potential_pay_num+'</b>\
                <span>在未来几日有付费意愿的用户</span>\
                <div class="des">\
                    <span> 昨日活跃用户中，<b class="orange-text">已付费用户</b>占'+data.pay_rate+'%，<b class="yellow-text">有付费意愿用户</b>占'+data.potential_pay_rate+'%</span>\
                </div>\
                <div class="rate-part">\
                    <span class="rate-orange" style="width: '+pay_rate+'%"></span>\
                    <span class="rate-yellow" style="width: '+potential_pay_rate+'%"></span>\
                </div>\
            </div>\
            <div>\
                <b>'+data.potential_lost_num+'</b>\
                <span>在未来几日有流失风险的用户</span>\
                <div class="des">\
                    <span> 昨日活跃用户中，<b class="green-text">有流失风险的用户</b>占'+data.potential_lost_rate+'%<span>\
                </div>\
                <div class="rate-part">\
                    <span class="rate-green1" style="width: '+potential_lost_rate+'%"></span>\
                </div>\
            </div>';
    },
    _htmlTrouble:function (data) {
        var str = '';
        var percent = '';
        str += '\
            <div class="top">\
                <span>监测到<b>'+data.length+'</b>项异常数据</span>\
            </div>\
            <ul>';

        if(data.length >0){
            var tClass = '';
            for(var i=0;i<data.length;i++){
                switch (data[i].trend){
                    case 'down':
                        tClass = '';
                        break;
                    case 'up':
                        tClass = ' class="positive"';
                        break;
                }
                str += '\
                    <li'+tClass+' data-t="'+data[i].link+'">\
                        <i class="circle"></i>\
                        <span>'+data[i].title+' <b>'+data[i].value+'</b></span>\
                        <span><i class="triangle"></i><b>'+data[i].fluctuation+'</b></span>\
                    </li>';
            }
        }
        str += '</ul>';

        return str;
    },
    _urlTrouble:function (link) {
        var url = 'javascript:void(0)';
        var urlParam = '';
        switch (link){
            case '游戏概览-关键指标':
                urlParam = 'insideKeypoint';
                break;
            case '玩家分析-新增玩家':
                urlParam = 'insideAdditional';
                break;
            case '玩家分析-活跃玩家':
                urlParam = 'insideActivity';
                break;
            case '玩家分析-留存玩家':
                urlParam = 'insideSave';
                break;
            case '玩家分析-付费玩家':
                urlParam = 'insidePay';
                break;
            case '玩家分析-流失玩家':
                urlParam = 'insideLost';
                break;
            case '玩家分析-玩家习惯':
                urlParam = 'insideHabit';
                break;
            case '留存分析':
                urlParam = 'insideRetentioncount';
                break;
            case '付费分析-付费数据':
                urlParam = 'insidePayData';
                break;
            case '付费分析-付费渗透':
                urlParam = 'insidePayOsmosis';
                break;
            case '付费分析-付费转化':
                urlParam = 'insidePayConversion';
                break;
            case '付费分析-付费习惯':
                urlParam = 'insidePayHabit';
                break;
            case '流失分析-流失统计':
                urlParam = 'insideLostAnalysis';
                break;
            case '流失分析-流失漏斗':
                urlParam = 'insideLostFunnel';
                break;
            case '渠道分析-质量指标分析':
                urlParam = 'insideChannelQuality';
                break;
            case '渠道分析-收入指标分析':
                urlParam = 'insideChannelEarn';
                break;
        }

        if(urlParam != '')url = B_Jump._getUrl(urlParam);

        return url;
    },
    _getInfo:function () {
        $('#contentPart').removeClass('insidelog-part').addClass('data-ss-part');
        F_Overview_Info._htmlInit();

        var domIndex = $('#bs_index');
        var domStep = $('#bs_step');
        var domIntelligent = $('#bs_intelligent');
        var domTrouble = $('#bs_trouble');
        var domChart = $('#bs_chart');

        var postData = {};
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationEvaluate'],'get',true,postData,function(){
                domIndex.html(B_Pre._loading());
                domStep.html(B_Pre._loading());
                domIntelligent.html(B_Pre._loading());
                domTrouble.html(B_Pre._loading());
                domChart.html(B_Pre._loading());
            },function(){
                domIndex.html('');
                domStep.html('');
                domIntelligent.html('');
                domTrouble.html('');
                domChart.html('');
            },function(data,msg){
                if(data && data.base && !B_Common._checkObjectIsEmpty(data.base)){
                    domIndex.html(F_Overview_Info._htmlIndex(data.base));
                    domStep.html(F_Overview_Info._htmlStep(data.base));
                    domIntelligent.html(F_Overview_Info._htmlIntelligent(data.base));

                    $('#bs_index ul li').each(function (index) {
                        $(this).click(function () {
                            var urlParam = '';
                            switch (index+''){
                                case '0':
                                    urlParam = 'insidePayData';
                                    break;
                                case '1':
                                    urlParam = 'insidePay';
                                    break;
                                case '2':
                                    urlParam = 'insideAdditional';
                                    break;
                                case '3':
                                    urlParam = 'insidePayData';
                                    break;
                                case '4':
                                    urlParam = 'insidePay';
                                    break;
                                case '5':
                                    urlParam = 'insideActivity';
                                    break;
                            }
                            B_Jump._go('base',B_Jump._getUrl(urlParam));
                        });
                    });
                }else{
                    domIndex.html(B_Pre._empty('暂无数据'));
                    domStep.html(B_Pre._empty('暂无数据'));
                    domIntelligent.html(B_Pre._empty('暂无数据'));
                }
                if(data && data.abnormal && data.abnormal.data){
                    domTrouble.html(F_Overview_Info._htmlTrouble(data.abnormal.data));
                    $('#bs_trouble ul li').each(function () {
                        $(this).click(function () {
                            B_Jump._go('base',F_Overview_Info._urlTrouble($(this).attr('data-t')));
                        });
                    });
                }else{
                    domTrouble.html(B_Pre._empty('暂无数据'));
                    domChart.html(B_Pre._empty('暂无数据'));
                }
                if(data && data.analysis && data.analysis.axis_date && data.analysis.axis_date.length > 0){
                    M_Init._dataCache['analysis'] = data.analysis;
                    F_Overview_Info._chartData('pay');
                }
            },function(data,msg,code){
                domIndex.html(B_Pre._empty(msg));
                domStep.html(B_Pre._empty(msg));
                domIntelligent.html(B_Pre._empty(msg));
                domTrouble.html(B_Pre._empty(msg));
                domChart.html(B_Pre._empty(msg));
            }
        )

    },
    _countIndex:function (title,today,trend,rate) {
        var config = {'trend':'','class':''};
        switch (trend){
            case 'up':
                config['trend'] = '&uarr;';
                config['class'] = 'up';
                break;
            case 'down':
                config['trend'] = '&darr;';
                config['class'] = 'down';
                break;
        }
        if(rate != '-')rate += '%';
        return '\
            <li>\
                <p>'+title+'</p>\
                <h3>'+today+'</h3>\
                <span>较前日 </span><b class="'+config['class']+'">'+config['trend']+'</b><b>'+rate+'</b>\
            </li>';
    },
    _htmlIndex:function (data) {
        var str = '<ul>';
        str += F_Overview_Info._countIndex('昨日收入',data.pay_amount,data.pay_amount_trend,data.pay_amount_rate);
        str += F_Overview_Info._countIndex('昨日付费用户数',data.pay_num,data.last_pay_num_trend,data.last_pay_num_rate);
        str += F_Overview_Info._countIndex('昨日新增玩家数',data.newlogin_num,data.last_newlogin_num_trend,data.last_newlogin_num_rate);
        str += F_Overview_Info._countIndex('累计收入',data.total_pay_amount,data.last_total_pay_amount_trend,data.last_total_pay_amount_rate);
        str += F_Overview_Info._countIndex('累计付费用户数',data.total_pay_num,data.last_total_pay_num_trend,data.last_total_pay_num_rate);
        str += F_Overview_Info._countIndex('昨日活跃人数',data.login_num,data.last_login_num_trend,data.last_login_num_rate);
        str += '</ul>';
        return str;
    },
    _chartData:function (type) {
        if(M_Init._dataCache['analysis']){
            var dataUnion = M_Init._dataCache['analysis'];
            var chartData = {'x_axis':M_Init._dataCache['analysis'].axis_date,'y_axis':[]};
            var chartType = 50;
            var info = '';
            var unit = '人';
            switch(type){
                case 'pay':
                    if(dataUnion.axis_pay_amount){
                        chartData.y_axis.push({'name':'付费金额','data':dataUnion.axis_pay_amount});
                    }
                    info = '<span>AVG：</span><span>日均付费金额<b>'+dataUnion.avg_pay_amount+'</b></span> <span>SUM：</span><span>付费金额总数<b>'+dataUnion.sum_pay_amount+'</b></span>';
                    unit = '元';
                    break;
                case 'active':
                    if(dataUnion.axis_login_num){
                        chartData.y_axis.push({'name':'活跃人数','data':dataUnion.axis_login_num});
                    }
                    info = '<span>AVG：</span><span>日均活跃用户<b>'+dataUnion.avg_login_num+'</b></span> <span>SUM：</span><span>活跃用户总数<b>'+dataUnion.sum_login_num+'</b></span>';
                    break;
                case 'additional':
                    if(dataUnion.axis_newlogin_num){
                        chartData.y_axis.push({'name':'新增人数','data':dataUnion.axis_newlogin_num});
                    }
                    info = '<span>AVG：</span><span>日均新增人数<b>'+dataUnion.avg_newlogin_num+'</b></span> <span>SUM：</span><span>新增人数总数<b>'+dataUnion.sum_newlogin_num+'</b></span>';
                    break;
            }
            if(chartData.y_axis.length > 0){
                chartData.xFormatDate = true;
                chartData.yFormat = '';
                $('#bs_chart_info').html(info);
                chartData.tooltip = {'num':chartData.y_axis.length,'unit':unit};
                M_Inside_Chart._chartData(chartType,'bs_chart',chartData);
            }
        }
    }
}