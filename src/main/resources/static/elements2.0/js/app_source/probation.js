require(['frontmain'], function () {
    require(['jquery','layer','echarts','base','front','app/inside','app/outside','store.min'], function (){
        store = require('store.min');
        echarts = require('echarts');
        B_Login._checkUpdate();
        var $_GET = B_Common._getUrl('query');
        var F_Probation = {
            _getData:function (id) {
                var domRadar = $('#bs_radar');
                var domGauge = $('#bs_gauge');
                var postData = {};
                postData['project_id'] = id;
                postData = B_Common._postData(postData);
                B_Port._ajax('reputationIntroduce','get',true,postData,function(){
                        domRadar.html(B_Pre._loading());
                        domGauge.html(B_Pre._loading());
                    },function(){
                        domRadar.html('');
                        domGauge.html('');
                    },function(data,msg){
                        if(data.game_info){
                            F_Probation._chartGauge(data.game_info.opinion_score);
                            if(data.radar_data){
                                F_Probation._chartRadar(data.radar_data);
                            }
                        }
                    },function(data,msg,code){
                        domRadar.html(B_Pre._empty(msg));
                        domGauge.html(B_Pre._empty(msg));
                    }
                )
            },
            _chartGauge:function (data) {
                var chartDataPre = {gridTop:'25%',radius:'75%',detail: {formatter:'{value}'},data:[{value:data}],startAngle:210,endAngle:-30,name:'口碑评级',color:[[0.4, '#5c3a77'], [0.6, '#f7586a'], [0.8, '#f49551'], [0.9, '#f6d75a'], [1, '#33d184']],pointerColor:'#436cbb',tooltipFormat:{formatter: "{a} : {c}"}};
                M_Outside_Chart._chartData('gauge_pop','bs_gauge',chartDataPre);

                var descStr = '';
                var descClass = '';
                var infoStr = '';
                data = parseInt(data);
                if(data < 40){
                    descClass = "gray";
                    descStr = '待提高';
                }else if(data >= 40 && data < 60){
                    descClass = "blue";
                    descStr = '中等';
                }else if(data >= 60 && data < 80){
                    descClass = "yellow";
                    descStr = '良好';
                }else if(data >= 80 && data < 90){
                    descClass = "red";
                    descStr = '优秀';
                }else if(data >= 90){
                    descClass = "purple";
                    descStr = '卓越';
                }
                $('#bs_gauge_desc').addClass(descClass).html(descStr);
                $('#bs_gauge_info').html('该游戏当前的口碑评级为：<b class="'+descClass+'">'+descStr+'</b>');
            },
            _chartRadar:function (data) {
                var radarConfig = {'正向反馈占比':'negative_weight','讨论热度':'post_weight','舆情走势':'stable_weight','有效反馈占比':'useless_weight','活跃人数':'user_weight','畅销排名':'appstore_weight'};
                var chartDataPre = {indicator:[],data:{'当前游戏':[]},legendSelectMode:true,'color':['#3daae3','#2ed383']};
                $.each(radarConfig,function(key,value){
                    if(key == '畅销排名'){
                        if(data.avg[value]){
                            chartDataPre.indicator.push({text: key, max: 100});
                            chartDataPre.data['当前游戏'].push((data.real[value] ? ((data.real[value]*100).toFixed(0)) : 0));
                        }
                    }else{
                        chartDataPre.indicator.push({text: key, max: 100});
                        chartDataPre.data['当前游戏'].push((data.real[value] ? ((data.real[value]*100).toFixed(0)) : 0));
                    }
                });
                if(chartDataPre.indicator && chartDataPre.indicator.length > 0){
                    if($('#bs_radar').length > 0){
                        M_Outside_Chart._chartData('radar_pop','bs_radar',chartDataPre);
                    }
                }
            },
            _htmlOk:function () {
                var str = '';
                str += '<p class="title">申请成功</p><img src="elements2.0/img/probation_app.png">';
                str += '<p>感谢您申请试用ThinkingGame'+$('.left h3').attr('data-i')+'服务</p><p>我们将在<b>2个工作日</b>内与您取得进一步联系</p>';
                str += '<div class="btn-union"><button class="tg-main-btn">返回</button> <button class="tg-assist-btn">在线客服</button></div>';

                $('.right').html(str);

                $('.tg-main-btn').click(function () {
                    parent.B_Pop._init('close');
                });
                $('.tg-assist-btn').click(function () {
                    B_Jump._go('openUrl',B_Common._qqUrl());
                });
            },
            _htmlInit:function () {
                var str = '';
                str += '<div class="page-pop" style="padding: 0"><span class="close-pop" style="font-size:28px; top: -15px;">×</span>';
                switch($_GET.from){
                    case 'game':
                        str += '<div class="left rate-left tg-user-limit-pop">';
                        break;
                    default:
                        str += '<div class="left rate-left">';
                        break;
                }
                str += F_Probation._htmlNotice()+'</div>';
                str += '<div class="right boxshadow">'+F_Probation._htmlInput()+'</div>';
                str += '</div>';

                $('#probation_s').html(str);
                $('.close-pop').click(function () {
                    parent.B_Pop._init('close');
                });
                $('#bs_qq').click(function () {
                    B_Jump._go('openUrl',B_Common._qqUrl());
                });

                M_Inside._dropShow();
                M_Inside._dropLeave();
                M_Inside._dropSelected();

                switch($_GET.from) {
                    case 'game':
                        F_Probation._getData($_GET.gameId);
                        $('#bs_recommend li').each(function () {
                            $(this).click(function () {
                                var url = B_Jump._getUrl('gameLight',{gameId:$(this).attr('data-i')});
                                B_Jump._go('base',url);
                                parent.B_Pop._init('close');
                            });
                        });
                        break;
                }
                $('.tg-main-btn').click(function () {
                    F_Probation._doApp();
                });
                $('.tg-assist-btn').click(function () {
                    parent.B_Pop._init('close');
                });
            },
            _htmlNotice:function () {
                var str = '';
                var type = '';
                if($_GET.from){
                    type = $_GET.from;
                }else{
                    parent.$('#topNav .top-tab-change li').each(function (index) {
                        if($(this).hasClass('top-tab-selected')){
                            switch (index+''){
                                case '1':
                                    type = 'operate';
                                    break;
                                case '2':
                                    type = 'inside';
                                    break;
                            }
                        }
                    });
                }

                switch (type){
                    case 'game':
                        if(!($_GET.gameId && !isNaN($_GET.gameId))){
                            $_GET.gameId = B_Game._getDemoProjectId()
                        }
                        var currentGame = B_Game._getGame([$_GET.gameId],1);
                        if(currentGame && !B_Common._checkObjectIsEmpty(currentGame)){
                            currentGame = currentGame[$_GET.gameId];
                        }else{
                            $_GET.gameId = B_Game._getDemoProjectId();
                            currentGame = B_Game._getGame([$_GET.gameId],1);
                            currentGame = currentGame[$_GET.gameId];
                        }
                        var recommendGame = B_Game._getAuthRecommend();
                        var recommendStr = '';
                        if(recommendGame){
                            $.each(recommendGame,function (key,value) {
                                recommendStr += '<li data-i="'+key+'"><img src="'+value[0]+'" alt="'+value[1]+'"><p>'+value[1]+'</p><span>'+value[2]+'</span></li>';
                            })
                        }
                        str += '\
                        <h3 data-i="游戏舆情雷达"><span>'+currentGame[1]+'</span> 当前口碑评级 <b id="bs_gauge_desc"></b></h3><h3>开通后了解该游戏全网用户反馈</h3>\
                        <div class="graph-wrap">\
                            <div class="graph-part"><div id="bs_gauge" style="width: 100%; height: 100%"></div><span id="bs_gauge_info"></span></div>\
                            <div class="graph-part"><div id="bs_radar" style="width: 100%; height: 100%"></div></div>\
                        </div>\
                        <span>自然语言处理技术为您智能解读海量用户反馈，查看demo游戏</span>\
                        <ul id="bs_recommend">'+recommendStr+'</ul>';
                        break;
                    case 'inside':
                        str += '\
                        <h3 data-i="运营指标">申请试用<b>运营指标服务</b></h3>\
                        <span>运营统计结果毫厘不差 支持定制化产品统计纬度</span>\
                        <ul>\
                            <li><img src="elements2.0/img/pagepop/1.png" alt="">\
                                <p>接入游戏日志</p>\
                                <div class="rate-wrap">\
                                    <div class="rate1"></div>\
                                </div>\
                            </li>\
                            <li><img src="elements2.0/img/pagepop/2.png" alt="">\
                                <p>定制分析纬度</p>\
                                <div class="rate-wrap">\
                                    <div class="rate2"></div>\
                                </div>\
                                </li>\
                            <li><img src="elements2.0/img/pagepop/3.png" alt="">\
                                <p>登录后台 查看结果</p>\
                                <div class="rate-wrap">\
                                    <div class="rate3"></div>\
                                </div>\
                            </li>\
                        </ul>\
                        <p>运营指标分析结果包含：</p>\
                        <span>*新增、活跃、留存、付费、流失玩家关键指标</span>\
                        <span>*留存、付费、流失、渠道关键运营指标</span>\
                        <span>*关卡驻留、成长进度、核心玩法、虚拟消费、英雄、社交定制化指标</span>';
                        break;
                    default:
                        str += '\
                        <h3 data-i="智能分析">申请试用<b>智能分析服务</b></h3>\
                        <span>用智能分析结果支持运营决策 有效提升游戏竞争力</span>\
                        <ul>\
                            <li><img src="elements2.0/img/pagepop/1.png" alt="">\
                                <p>接入游戏日志</p>\
                                <div class="rate-wrap">\
                                    <div class="rate1"></div>\
                                </div>\
                            </li>\
                            <li><img src="elements2.0/img/pagepop/2.png" alt="">\
                                <p>算法模型选参调优</p>\
                                <div class="rate-wrap">\
                                    <div class="rate2"></div>\
                                </div>\
                                </li>\
                            <li><img src="elements2.0/img/pagepop/3.png" alt="">\
                                <p>登录后台 查看结果</p>\
                                <div class="rate-wrap">\
                                    <div class="rate3"></div>\
                                </div>\
                            </li>\
                        </ul>\
                        <p>智能分析结果包含：</p>\
                        <span>*为您揭晓不同玩家群的特征</span>\
                        <span>*智能分析影响玩家付费、流失的因素</span>\
                        <span>*自定义查询玩家群属性分布</span>\
                        <span>*支持海量玩家行为日志搜索</span>';
                        break;
                }
                return str;
            },
            _htmlInput:function () {
                var user = {'company_type':0,'job_type':0,'company_name':'','real_name':'','email':'','mobile':''};
                if(B_Login._user && B_Login._user.user){
                    var data = B_Login._user.user;
                    if(data.nick_name != 'demo'){
                        user['company_type'] = data.company_type;
                        user['job_type'] = data.job_type;
                        user['company_name'] = data.company_name;
                        user['real_name'] = data.real_name;
                        user['email'] = data.email;
                        user['mobile'] = data.mobile;
                    }
                }
                var str = '<p class="title">立即申请开通</p>';
                str += '<ul>';
                str += '<li><p>公司名称：</p><input type="text" name="user_company" placeholder="您当前就职的公司" maxlength="32" value="'+user.company_name+'"></li>';
                str += '<li><p>联系人：</p><input type="text" name="user_name" placeholder="请输入您的真实姓名" maxlength="16" value="'+user.real_name+'"></li>';
                str += '<li><p>公司邮箱：</p><input type="text" name="user_email" placeholder="请填写您在公司使用的公司邮箱" maxlength="64" value="'+user.email+'"></li>';
                str += '</ul><ul>';
                str += '<li><p>公司类型：</p>';
                str += '<div id="selectWrap"><div id="bs_company_type" class="dropDown tg-selected-drop">';
                if(B_User._information.companyArr[user.company_type]){
                    str += '<p><span data-i="'+user.company_type+'">'+B_User._information.companyArr[user.company_type]+'</span><i class="tg-triangle-gray-bottom"></i></p>';
                }else{
                    str += '<p><span data-i="">请选择公司类型</span><i class="drop-icon"></i></p>';
                }
                str += '<ul class="b_none">'+F_Probation._htmlSelect(B_User._information.companyArr)+'</ul></div></div>';
                str += '</li>';

                str += '<li><p>手机号码：</p><input type="text" name="user_phone" placeholder="请填写能联系到您的手机号码" maxlength="11" value="'+user.mobile+'"></li>';

                str += '<li><p>公司职位：</p>';
                str += '<div id="selectWrap"><div id="bs_job_type" class="dropDown tg-selected-drop">';
                if(B_User._information.jobArr[user.job_type]){
                    str += '<p><span data-i="'+user.job_type+'">'+B_User._information.jobArr[user.job_type]+'</span><i class="tg-triangle-gray-bottom"></i></p>';
                }else{
                    str += '<p><span data-i="">请选择公司职位</span><i class="drop-icon"></i></p>';
                }
                str += '<ul class="b_none">'+F_Probation._htmlSelect(B_User._information.jobArr)+'</ul></div></div>';
                str += '</li>';
                str += '</ul>';
                str += '<div class="btn-union"><button class="tg-main-btn">申请开通</button> <button class="tg-assist-btn">继续浏览</button></div>';
                str += '<span>您也可以咨询<b id="bs_qq">在线客服</b>或者服务热线021-60492625，进一步了解申请开通的详细信息。</span>';

                return str;
            },
            _doApp:function () {
                var user_name = $.trim($('input[name="user_name"]').val());
                var user_company = $.trim($('input[name="user_company"]').val());
                var user_email = $.trim($('input[name="user_email"]').val());
                var user_phone = $.trim($('input[name="user_phone"]').val());
                var company_type = $('#bs_company_type p span').attr('data-i');
                var job_type = $('#bs_job_type p span').attr('data-i');
                var apply_product = $('.left h3').attr('data-i');

                if(user_company == ''){
                    B_Pop._init('msg',{content:'公司名称必须填写'});
                    return false;
                }
                if(company_type == ''){
                    B_Pop._init('msg',{content:'公司类型必须选择'});
                    return false;
                }
                if(user_name == ''){
                    B_Pop._init('msg',{content:'联系人必须填写'});
                    return false;
                }
                if(user_phone == ''){
                    B_Pop._init('msg',{content:'手机号码必须填写'});
                    return false;
                }
                if(!B_Common._isMobile(user_phone)){
                    B_Pop._init('msg',{content:'手机号格式错误'});
                    return false;
                }
                if(user_email == ''){
                    B_Pop._init('msg',{content:'公司邮箱必须填写'});
                    return false;
                }
                if(!B_Common._isMail(user_email)){
                    B_Pop._init('msg',{content:'公司邮箱式错误'});
                    return false;
                }
                if(job_type == ''){
                    B_Pop._init('msg',{content:'公司职位必须选择'});
                    return false;
                }
                var dom = $('.blue-button');
                var postData = {};
                postData['user_company'] = user_company;
                postData['company_type'] = company_type;
                postData['user_name'] = user_name;
                postData['user_phone'] = user_phone;
                postData['email'] = user_email;
                postData['job_type'] = job_type;
                postData['apply_product'] = apply_product;
                postData['project_names'] = '';
                postData = B_Common._postData(postData);
                B_Port._ajax('operationApply','post',true,postData,function(){
                        B_Common._btnTextStatus('disable',dom,{'disable':'提交中..'});
                        B_Common._btnTextStatus('disable',$('.tg-assist-btn'),{'disable':'继续浏览'});
                    },function(){
                        B_Common._btnTextStatus('normal',dom,{'normal':'申请开通'});
                        B_Common._btnTextStatus('normal',$('.tg-assist-btn'),{'normal':'继续浏览'});
                    },function(data,msg){
                        F_Probation._htmlOk();
                    },function(data,msg,code){
                        B_Pop._init('msg',{content:msg});
                    }
                )
            },
            _htmlSelect:function(data){
                var str = '';
                for(var i=0;i<data.length;i++){
                    str += '<li><a data-i="'+i+'">'+data[i]+'</a></li>';
                }
                return str;
            }
        }

        F_Probation._htmlInit();
    });
});