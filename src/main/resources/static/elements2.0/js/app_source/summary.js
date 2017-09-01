var F_Summary_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(1);
        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            switch(M_Init._controller) {
                case 'demo':
                    $('#gameDropChoose').show();
                    B_Pop._init('close');
                    M_Init._api['innerOperationBase'] = 'demoInnerOperationBase';
                    break;
                default:
                    M_Init._api['innerOperationBase'] = 'innerOperationBase';
                    break;
            }
            var $_GET = B_Common._getUrl('query');
            if($_GET.g){
                M_Init._gameId = $_GET.g;
            }
            M_Common._getOrderGame('summary',$_GET.g,'1-1-1');

            M_Init._dateCache.begin = M_Init._dateChoose.begin;
            M_Init._dateCache.end = M_Init._dateChoose.end;

            B_Date._chooseSection({'autoCommit':false,'todayValid':false},1,M_Init._dateChoose.begin,M_Init._dateChoose.end,function(begin,end){
                if(begin != M_Init._dateCache.begin || M_Init._dateCache.end != end){
                    M_Init._dateCache.begin = begin;
                    M_Init._dateCache.end = end;
                    F_Summary_Info._getInfo();
                }
            });

            $('#tab_user_chart ul li').each(function (index) {
                $(this).click(function () {
                    if(!$(this).hasClass('tg-tab-block-active')){
                        $(this).addClass('tg-tab-block-active').siblings().removeClass('tg-tab-block-active');
                        switch(index+''){
                            case '0':
                                F_Summary_Info._chartData('activity');
                                break;
                            case '1':
                                F_Summary_Info._chartData('pay');
                                break;
                            case '2':
                                F_Summary_Info._chartData('lost');
                                break;
                        }
                    }
                });
            });
        }
    }
}

var F_Summary_Info = {
    _getInfo:function () {

        if(M_Init._menuColumnAbnormal['玩家总览']){
            if(M_Init._menuColumnAbnormal['玩家总览']['活跃玩家']){
                $('#tab_user_chart .tg-tab-change-block li').eq(0).append('<i class="alert-point"></i>');
            }
            if(M_Init._menuColumnAbnormal['玩家总览']['付费玩家']){
                $('#tab_user_chart .tg-tab-change-block li').eq(1).append('<i class="alert-point"></i>');
            }
            if(M_Init._menuColumnAbnormal['玩家总览']['流失玩家']){
                $('#tab_user_chart .tg-tab-change-block li').eq(2).append('<i class="alert-point"></i>');
            }
        }
        
        $('.dataoverview').html('');
        $('#bs_avg').html('');
        $('#bs_chart_summary').html('');
        var domHtml = $('.dataoverview');
        var domChart = $('#bs_chart_summary');

        M_Init._dateCache.begin = M_Init._dateCache.begin ? M_Init._dateCache.begin : M_Init._dateChoose.begin;
        M_Init._dateCache.end = M_Init._dateCache.end ? M_Init._dateCache.end : M_Init._dateChoose.end;

        var postData = {};
        postData['game_id'] = M_Init._gameId;
        postData['start_date'] = M_Init._dateCache.begin;
        postData['end_date'] = M_Init._dateCache.end;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['innerOperationBase'],'get',true,postData,function () {
                domHtml.html(B_Pre._loading('b_padding30'));
                domChart.html(B_Pre._loading('b_padding30'));
            },function () {
                domHtml.html('');
                domChart.html('');
            },function(data,msg){
                domHtml.html(F_Summary_Info._htmlIn(data.base));
                if(data.data.x_axis){
                    M_Init._dataCache['chart'] = data.data;
                    F_Summary_Info._chartData('activity');
                }
            },function (ddata,msg,code) {
                domHtml.html(B_Pre._empty(msg));
                domChart.html(B_Pre._empty(msg));
            }
        )
    },
    _chartData:function (type) {
        if(M_Init._dataCache['chart'].x_axis){
            var chartData = {'x_axis':M_Init._dataCache['chart'].x_axis,'y_axis':[]};
            var chartType = 5;
            switch(type){
                case 'activity':
                    if(M_Init._dataCache['chart'].active_user_new){
                        chartData.y_axis.push({'name':'新玩家','data':M_Init._dataCache['chart'].active_user_new});
                    }
                    if(M_Init._dataCache['chart'].active_user_old){
                        chartData.y_axis.push({'name':'老玩家','data':M_Init._dataCache['chart'].active_user_old});
                    }
                    $('#bs_avg').html('<span>AVG：</span><span>平均每日活跃玩家数<b>'+M_Init._dataCache['chart'].avg_login_num+'</b></span>');
                    break;
                case 'pay':
                    chartType = 50;
                    if(M_Init._dataCache['chart'].pay_user_first){
                        chartData.y_axis.push({'name':'首次付费','data':M_Init._dataCache['chart'].pay_user_first});
                    }
                    if(M_Init._dataCache['chart'].pay_user_second){
                        chartData.y_axis.push({'name':'再次付费','data':M_Init._dataCache['chart'].pay_user_second});
                    }
                    if(M_Init._dataCache['chart'].pay_user_potential){
                        chartData.y_axis.push({'name':'潜在付费','data':M_Init._dataCache['chart'].pay_user_potential});
                    }
                    $('#bs_avg').html('<span>AVG：</span><span>平均每日付费玩家数<b>'+M_Init._dataCache['chart'].avg_pay_num+'</b></span>');
                    break;
                case 'lost':
                    chartType = 50;
                    if(M_Init._dataCache['chart'].lost_user){
                        chartData.y_axis.push({'name':'实际流失','data':M_Init._dataCache['chart'].lost_user});
                    }
                    if(M_Init._dataCache['chart'].lost_user_potential){
                        chartData.y_axis.push({'name':'潜在流失','data':M_Init._dataCache['chart'].lost_user_potential});
                    }
                    $('#bs_avg').html('<span>AVG：</span><span>平均每日实际流失玩家数<b>'+M_Init._dataCache['chart'].avg_login_num+'</b></span>，<span>平均每日有<b>'+M_Init._dataCache['chart'].avg_potential_lost_num+'</b>个玩家有流失倾向</span>');
                    break;
            }
            if(chartData.y_axis.length > 0){
                chartData.xFormatDate = true;
                chartData.yFormat = '';
                chartData.tooltip = {'num':chartData.y_axis.length,'unit':'人'};
                M_Inside_Chart._chartData(chartType,'bs_chart_summary',chartData);
            }
        }
    },
    _htmlIn:function (data) {
        var str = '';
        var additionStr = '';
        var activityStr = '';
        var payStr = '';
        if(data.newlogin_num){
            var number = ['',''];
            var numberClass = '';
            var numberArr = ['','',''];
            if(data.newlogin_num.value) {
                number = data.newlogin_num.value.split('|');
                if (number[0] == '+') {
                    numberClass = '<b class="up">&uarr;</b>';
                } else {
                    numberClass = '<b class="down">&darr;</b>';
                }
                if(data.newlogin_num.avg_newlogin_num_1d){
                    numberArr[0] = data.newlogin_num.avg_newlogin_num_1d;
                }
                if(data.newlogin_num.avg_newlogin_num_7d){
                    numberArr[1] = data.newlogin_num.avg_newlogin_num_7d;
                }
                if(data.newlogin_num.avg_newlogin_num_30d){
                    numberArr[2] = data.newlogin_num.avg_newlogin_num_30d;
                }
            }
            var stayNumber = ['',''];
            var stayNumberClass = '';
            var stayNumberArr = ['','',''];
            if(data.retention_rate.value){
                stayNumber = data.retention_rate.value.split('|');
                if(stayNumber[0] == '+'){
                    stayNumberClass = '<b class="up">&uarr;</b>';
                }else{
                    stayNumberClass = '<b class="down">&darr;</b>';
                }
                if(data.retention_rate.avg_retention_rate_1d){
                    stayNumberArr[0] = data.retention_rate.avg_retention_rate_1d;
                }
                if(data.retention_rate.avg_retention_rate_7d){
                    stayNumberArr[1] = data.retention_rate.avg_retention_rate_7d;
                }
                if(data.retention_rate.avg_retention_rate_30d){
                    stayNumberArr[2] = data.retention_rate.avg_retention_rate_30d;
                }
            }

            additionStr += '\
                <li>\
                    <div class="fl">\
                        <b class="data-blue">'+number[1]+'</b>\
                        <span>今日新增玩家人数'+numberClass+'\
                            <div class="boxshadow hover-show">\
                                <p>昨日<b>'+numberArr[0]+'</b></p>\
                                <p>7日<b>'+numberArr[1]+'</b></p>\
                                <p>30日<b>'+numberArr[2]+'</b></p>\
                            </div>\
                        </span>\
                    </div>\
                   <div>\
                        <h4 class="tip-hover">新增玩家情况\
                            <div class="tip-box-show">\
                                <i class="triangle-up"></i>\
                                <div class="tip-box-content">\
                                    今日新增玩家人数：今日新增加的玩家人数<br>\
                                    次日留存率：昨日新增玩家中，今日再次登录游戏的玩家所占比例\
                                </div>\
                            </div>\
                        </h4>\
                        <span>次日留存率<b>'+stayNumber[1]+'</b>'+stayNumberClass+'\
                            <div class="boxshadow hover-show">\
                                <p>昨日<b>'+stayNumberArr[0]+'%</b></p>\
                                <p>7日<b>'+stayNumberArr[1]+'%</b></p>\
                                <p>30日<b>'+stayNumberArr[2]+'%</b></p>\
                            </div>\
                        </span>\
                        <a href="'+B_Jump._getUrl('insideAdditional')+'" class="fr">查看详情</a>\
                   </div>\
                </li>';
        }


        if(data.login_num){
            var number = ['',''];
            var numberClass = '';
            var numberArr = ['','',''];
            if(data.login_num.value) {
                number = data.login_num.value.split('|');
                if (number[0] == '+') {
                    numberClass = '<b class="up">&uarr;</b>';
                } else {
                    numberClass = '<b class="down">&darr;</b>';
                }
                if(data.login_num.avg_login_num_1d){
                    numberArr[0] = data.login_num.avg_login_num_1d;
                }
                if(data.login_num.avg_login_num_7d){
                    numberArr[1] = data.login_num.avg_login_num_7d;
                }
                if(data.login_num.avg_login_num_30d){
                    numberArr[2] = data.login_num.avg_login_num_30d;
                }
            }
            var timeNumber = ['',''];
            var timeNumberClass = '';
            var timeNumberArr = ['','',''];
            if(data.avg_online_minutes.value){
                timeNumber = data.avg_online_minutes.value.split('|');
                if(timeNumber[0] == '+'){
                    timeNumberClass = '<b class="up">&uarr;</b>';
                }else{
                    timeNumberClass = '<b class="down">&darr;</b>';
                }
                if(data.avg_online_minutes.avg_online_minutes_1d){
                    timeNumberArr[0] = data.avg_online_minutes.avg_online_minutes_1d;
                }
                if(data.avg_online_minutes.avg_online_minutes_7d){
                    timeNumberArr[1] = data.avg_online_minutes.avg_online_minutes_7d;
                }
                if(data.avg_online_minutes.avg_online_minutes_30d){
                    timeNumberArr[2] = data.avg_online_minutes.avg_online_minutes_30d;
                }
            }

            var timesNumber = ['',''];
            var timesNumberClass = '';
            var timesNumberArr = ['','',''];
            if(data.avg_login_times.value){
                timesNumber = data.avg_login_times.value.split('|');
                if(timeNumber[0] == '+'){
                    timesNumberClass = '<b class="up">&uarr;</b>';
                }else{
                    timesNumberClass = '<b class="down">&darr;</b>';
                }
                if(data.avg_login_times.avg_login_times_1d){
                    timesNumberArr[0] = data.avg_login_times.avg_login_times_1d;
                }
                if(data.avg_login_times.avg_login_times_7d){
                    timesNumberArr[1] = data.avg_login_times.avg_login_times_7d;
                }
                if(data.avg_login_times.avg_login_times_30d){
                    timesNumberArr[2] = data.avg_login_times.avg_login_times_30d;
                }
            }

            var lostNumber = ['',''];
            var lostNumberClass = '';
            if(data.potential_lost_num){
                lostNumber = data.potential_lost_num.split('|');
                if(lostNumber[0] == '+'){
                    lostNumberClass = '<b class="up">&uarr;</b>';
                }else{
                    lostNumberClass = '<b class="down">&darr;</b>';
                }
            }

            activityStr += '\
                <li>\
                    <div class="fl">\
                        <b class="data-green">'+number[1]+'</b>\
                        <span>今日活跃玩家人数'+numberClass+'\
                            <div class="boxshadow hover-show">\
                                <p>昨日<b>'+numberArr[0]+'</b></p>\
                                <p>7日<b>'+numberArr[1]+'</b></p>\
                                <p>30日<b>'+numberArr[2]+'</b></p>\
                            </div>\
                        </span>\
                    </div>\
                    <div>\
                        <h4 class="tip-hover">活跃玩家情况\
                            <div class="tip-box-show">\
                                <i class="triangle-up"></i>\
                                <div class="tip-box-content">\
                                    今日活跃玩家人数：今日开启过游戏的玩家人数<br>\
                                    人均游戏时长：今日活跃玩家的人均游戏时长<br>\
                                    平均游戏次数：今日活跃玩家的人均游戏次数<br>\
                                    潜在流失玩家：之前7日（含当日）有登录记录，且之后7日（不含当日）不再登录的概率大于50%的玩家\
                                </div>\
                            </div>\
                        </h4>\
                        <span>人均游戏时长<b>'+timeNumber[1]+'</b>'+timeNumberClass+'\
                        <div class="boxshadow hover-show">\
                            <p>昨日<b>'+timeNumberArr[0]+'</b></p>\
                            <p>7日<b>'+timeNumberArr[1]+'</b></p>\
                            <p>30日<b>'+timeNumberArr[2]+'</b></p>\
                        </div></span>\
                        <span>平均游戏次数<b>'+timesNumber[1]+'次</b>'+timesNumberClass+'\
                        <div class="boxshadow hover-show">\
                            <p>昨日<b>'+timesNumberArr[0]+'次</b></p>\
                            <p>7日<b>'+timesNumberArr[1]+'次</b></p>\
                            <p>30日<b>'+timesNumberArr[2]+'次</b></p>\
                        </div></span>\
                        <span class="cursor-default">现在的活跃玩家中，有<b>'+lostNumber[1]+'</b>个玩家有流失倾向'+lostNumberClass+'</span>\
                        <a href="'+B_Jump._getUrl('insideActivity')+'" class="fr">查看详情</a>\
                    </div>\
                </li>';
        }


        if(data.pay_num){
            var number = ['',''];
            var numberClass = '';
            var numberArr = ['','',''];
            if(data.pay_num.value) {
                number = data.pay_num.value.split('|');
                if (number[0] == '+') {
                    numberClass = '<b class="up">&uarr;</b>';
                } else {
                    numberClass = '<b class="down">&darr;</b>';
                }
                if(data.pay_num.pay_num_1d){
                    numberArr[0] = data.pay_num.pay_num_1d;
                }
                if(data.pay_num.pay_num_7d){
                    numberArr[1] = data.pay_num.pay_num_7d;
                }
                if(data.pay_num.pay_num_30d){
                    numberArr[2] = data.pay_num.pay_num_30d;
                }
            }

            var rateNumber = ['',''];
            var rateNumberClass = '';
            var rateNumberArr = ['','',''];
            if(data.pay_rate.value){
                rateNumber = data.pay_rate.value.split('|');
                if(rateNumber[0] == '+'){
                    rateNumberClass = '<b class="up">&uarr;</b>';
                }else{
                    rateNumberClass = '<b class="down">&darr;</b>';
                }
                if(data.pay_rate.pay_rate_1d){
                    rateNumberArr[0] = data.pay_rate.pay_rate_1d;
                }
                if(data.pay_rate.pay_rate_7d){
                    rateNumberArr[1] = data.pay_rate.pay_rate_7d;
                }
                if(data.pay_rate.pay_rate_30d){
                    rateNumberArr[2] = data.pay_rate.pay_rate_30d;
                }
            }

            var earnNumber = ['',''];
            var earnNumberClass = '';
            var earnNumberArr = ['','',''];
            if(data.arpu.value){
                earnNumber = data.arpu.value.split('|');
                if(earnNumber[0] == '+'){
                    earnNumberClass = '<b class="up">&uarr;</b>';
                }else{
                    earnNumberClass = '<b class="down">&darr;</b>';
                }
                if(data.arpu.arpu_1d){
                    earnNumberArr[0] = data.arpu.arpu_1d;
                }
                if(data.arpu.arpu_7d){
                    earnNumberArr[1] = data.arpu.arpu_7d;
                }
                if(data.arpu.arpu_30d){
                    earnNumberArr[2] = data.arpu.arpu_30d;
                }
            }

            var perhapsNumber = ['',''];
            var perhapsNumberClass = '';
            if(data.potential_pay_num){
                perhapsNumber = data.potential_pay_num.split('|');
                if(perhapsNumber[0] == '+'){
                    perhapsNumberClass = '<b class="up">&uarr;</b>';
                }else{
                    perhapsNumberClass = '<b class="down">&darr;</b>';
                }
            }

            payStr += '\
                <li>\
                    <div class="fl">\
                        <b class="data-red">'+number[1]+'</b>\
                        <span>今日付费玩家人数'+numberClass+'\
                            <div class="boxshadow hover-show">\
                                <p>昨日<b>'+numberArr[0]+'</b></p>\
                                <p>7日<b>'+numberArr[1]+'</b></p>\
                                <p>30日<b>'+numberArr[2]+'</b></p>\
                            </div>\
                        </span>\
                    </div>\
                    <div>\
                        <h4 class="tip-hover">付费玩家情况\
                            <div class="tip-box-show">\
                                <i class="triangle-up"></i>\
                                <div class="tip-box-content">\
                                   今日付费玩家人数：今日有付费记录的玩家总人数<br>\
                                   今日付费率：今日付费玩家占总活跃人数的比例<br>\
                                  平均用户收入（ARPU）：当日每活跃玩家的平均收益<br>\
                                   潜在付费玩家：之后7日（不含当日）玩家付费的意愿强度>0.5的玩家数。付费意愿的取值范围为0~1，非常强烈的意愿为1\
                                </div>\
                            </div>\
                        </h4>\
                        <span>今日付费率<b>'+rateNumber[1]+'</b>'+rateNumberClass+'\
                        <div class="boxshadow hover-show">\
                            <p>昨日<b>'+rateNumberArr[0]+'</b></p>\
                            <p>7日<b>'+rateNumberArr[1]+'</b></p>\
                            <p>30日<b>'+rateNumberArr[2]+'</b></p>\
                        </div>\
                        </span>\
                        <span>平均用户收入<b>'+earnNumber[1]+'</b>'+earnNumberClass+'\
                            <div class="boxshadow hover-show">\
                                <p>昨日<b>'+earnNumberArr[0]+'</b></p>\
                                <p>7日<b>'+earnNumberArr[1]+'</b></p>\
                                <p>30日<b>'+earnNumberArr[2]+'</b></p>\
                            </div>\
                        </span>\
                        <span class="cursor-default">在未付费玩家中，有<b>'+perhapsNumber[1]+'</b>个玩家有付费倾向'+perhapsNumberClass+'</span>\
                        <a href="'+B_Jump._getUrl('insidePay')+'" class="fr">查看详情</a>\
                    </div>\
                </li>';
        }

        str += '<ul class="data-list">'+additionStr+activityStr+payStr+'</ul>';

        return str;
    }
}