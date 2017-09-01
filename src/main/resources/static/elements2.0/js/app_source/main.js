var F_Main_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(0);
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();

            $('#ln_product_adv').attr('href',B_Common._qqUrl());

            F_Main_Info._getInsideGame();
            F_Main_Info._getVisitHistory();
            F_Main_Info._getReport();
            F_Main_Info._getGameList();
        }
    }
}
var F_Main_Info = {
    _getInsideGame:function () {
        var dom = $('#ls_inside_game');
        B_Port._ajax('userServiceProject','get',true,null,function () {
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                dom.html(F_Main_Info._htmlInsideGame(dom,data));
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlInsideGame:function (dom,data) {
        var count = 0;
        var str = '';
        if(data && data.length >0) {
            str += '<ul class="game-list">';
            for (var i = 0; i < data.length; i++) {
                str += '<li onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('insideSummary',{id:data[i].game_id})+'\')">';
                str += '<img src="' + B_Game._imgUrl(data[i].game_id,'inner') + '" alt="' + data[i].game_name + '">';
                str += '<span>' + data[i].game_name + '</span>';
                str += '</li>';
                count++;
            }
            str += '</ul>';

            str = '<div class="border-b">\
                    <span>已开通<b>'+count+'</b>款游戏</span>\
                    <span class="fr"><a href="'+B_Common._qqUrl()+'" target="_blank">开通游戏</a></span>\
                 </div>'+str;
        }else{
            dom.addClass('hover-show');
            str += '\
                <div class="hover-show-content">\
                    <img src="elements2.0/img/homepage/1.png" alt="">\
                    <a class="mask-hover" href="'+B_Jump._getUrl('operateBasic')+'">\
                        <h1>极往知来的智能分析</h1>\
                        <p>充分利用数据挖掘和机器学习的技术，预测玩家的流失概率，计算玩家的付费意愿度。利用聚类算法，依据玩家的行为数据将玩家划分成不同的群体，分析不同群体的玩家特征。极往知来的智能分析，让游戏运营更加高效，更加精准。</p>\
                    </a>\
                </div>';
        }
        return str;

    },
    _getVisitHistory:function () {
        var dom = $('#ls_history_game');
        B_Port._ajax('history','get',true,null,function () {
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                dom.html(F_Main_Info._htmlVisitHistory(dom,data));
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlVisitHistory:function (dom,data) {
        var count = 0;
        var str = '';
        if(data.project_list && data.project_list.length >0) {
            str += '<ul class="game-list">';
            var gameItem = B_Game._getGame( data.project_list);
            for (var i = 0; i < data.project_list.length; i++) {
                if(gameItem[data.project_list[i]]){
                    str += '<li onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('gameLight',{gameId:data.project_list[i]})+'\')">';
                    str += '<img src="' +gameItem[data.project_list[i]][0]+ '" alt="' +gameItem[data.project_list[i]][1]+ '">';
                    str += '<span>' + gameItem[data.project_list[i]][1] + '</span>';
                    str += '</li>';
                    count++;
                }
            }
            str += '</ul>';
            str = '<div class="border-b">\
                    <span>近期浏览<b>'+count+'</b>款游戏</span>\
                    <span class="fr"></span>\
                 </div>'+str;
        }else{
            dom.addClass('hover-show');
            str += '\
                <div class="hover-show-content">\
                    <img src="elements2.0/img/homepage/2.png" alt="">\
                    <a class="mask-hover" href="'+B_Jump._getUrl('outsideCenter')+'">\
                        <h1>知己知彼的舆情分析</h1>\
                        <p>基于自然语言处理技术，结合ThinkingGame游戏语料库等技术，理解过亿玩家反馈的超过10亿条信息。从玩家视角深度分析游戏运营状态，多维度洞察玩家特征，轻松查询上千款热门游戏的玩家反馈、玩家构成、运营效果等。</p>\
                    </a>\
                </div>';
        }
        return str;

    },
    _getReport:function () {
        var dom = $('#ls_report_service');
        B_Port._ajax('getReportList','get',true,null,function () {
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                dom.html(F_Main_Info._htmlReport(dom,data));
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlReport:function (dom,data) {
        var str = '';
        if(data && data.length>0){
            str += '<div class="border-b">';
            str += '<span>已更新<b>'+data.length+'</b>篇报告</span>';
            str += '<span class="fr"><a href="'+B_Jump._getUrl('reportsGeneral')+'">全部报告</a></span></div>';
            data = data[0];
            str += '<ul class="report-list">';
            str += '<li>';
            str += '<img src="'+B_Common._cdnImgUrl()+data.cover_pic+'">';
            str += '<div class="des">';
            str += '<h3>'+data.report_name+'</h3>';
            str += '<p>'+data.report_slogan+'</p>';
            str += '<p class="summary">'+data.report_desc+'</p>';
            str += '<a href="'+B_Jump._getUrl('reportDetail')+'?report_id='+data.report_id+'" class="tg-main-btn" target="_blank">在线阅读</a>';
            str += '</div>';
            str += '</li>';
            str += '</ul>';
        }else{
            dom.addClass('hover-show');
            str += '\
                <div class="hover-show-content">\
                    <img src="elements2.0/img/homepage/3.png" alt="">\
                    <a class="mask-hover" href="'+B_Jump._getUrl('reportsGeneral')+'">\
                        <h1>思以智胜的专业服务</h1>\
                        <p>团队以资深数据挖掘工程师、游戏体验师为核心，提供专业的游戏数据解决方案，有效提升游戏付费渗透率、降低玩家流失率，实时评估游戏运营状态、提升运营效率。</p>\
                    </a>\
                </div>';
        }
        return str;
    },
    _getGameList:function () {
        var dom = $('#lt_game_list');
        B_Port._ajax('userProjectDetail','get',true,null,function () {
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                dom.html(F_Main_Info._htmlGameList(data.data));
                $('.lt_game_list').each(function (index) {
                    $(this).find('.tg-tab-change li').each(function (index2) {
                        $(this).click(function () {
                            $(this).addClass('tg-tab-active').siblings('li').removeClass('tg-tab-active');
                            $('.lt_game_list').eq(index).find('.lt_game_detail').eq(index2).show().siblings('.lt_game_detail').hide();
                        });
                    });
                });
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlGameList:function (data) {
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<div class="blockpart no-title col-lg-3 col-md-6 col-sm-6 col-xs-6 lt_game_list">';
            if(i == 0)str += '<h3>核心数据概览</h3>';
            str += '<div class="boxshadow game-overview">';
            str += '<div><img src="' + B_Game._imgUrl(data[i].game_id,'inner') + '"><b>'+data[i].game_name+'</b></div>';
            str += '<ul class="boxshadow tg-tab-change ">';
            str += '<li class="tg-tab-active tip-hover">运营指标';
            str +='<div class="tip-box-show">';
            str +='<i class="triangle-up"></i>';
            str +='<div class="tip-box-content">当日核心游戏运营指标';
            str +='</div>';
            str +='</div>';
            str += '</li>';
            str += '<li class="tip-hover">舆情指标';
            str +='<div class="tip-box-show">';
            str +='<i class="triangle-up"></i>';
            str +='<div class="tip-box-content">当日贴吧、论坛等渠道活跃玩家的核心舆情指标';
            str +='</div>';
            str +='</div>';
            str += '</li>';
            str += '</ul>';
            str += '<div class="lt_game_detail">';
            str += '<div class="border-b">';
            str += '<span>数据更新至 '+data[i].inner.data_date+'</span>';
            str += '<span class="fr">';
            if(data[i].game_id){
                str += '<a href="'+B_Jump._getUrl('insideSummary',{id:data[i].game_id})+'">查看详情</a>';
            }else{
                str += '<a href="'+B_Jump._getUrl('insideSummary',{id:0})+'">查看详情</a>';
            }
            str += '</span>';
            str += '</div>';
            str += '<div class="scroll-wrap">';
            str += '<table class="table table-condensed">';
            str += '</thead>';
            str += '<tbody>';
            str += '<tr>';

            str += '<tr>';
            str += '<td class="color-a">新玩家数</td>';
            str += '<td class="color-b">'+data[i].inner.newlogin_num+'人</td>';
            if(parseInt(data[i].inner.newlogin_num_span) > 0){
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">'+data[i].inner.newlogin_num_span+'人</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            }else{
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">'+Math.abs(data[i].inner.newlogin_num_span)+'人</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">活跃玩家</td>';
            str += '<td class="color-b">'+data[i].inner.login_num+'人</td>';
            if(parseInt(data[i].inner.login_num_span) > 0){
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">'+data[i].inner.login_num_span+'人</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            }else{
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">'+Math.abs(data[i].inner.login_num_span)+'人</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">付费玩家</td>';
            str += '<td class="color-b">'+data[i].inner.pay_num+'人</td>';
            if(parseInt(data[i].inner.pay_num_span) > 0){
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">'+data[i].inner.pay_num_span+'人</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            }else{
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">'+Math.abs(data[i].inner.pay_num_span)+'人</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">当日收入</td>';
            str += '<td class="color-b">'+data[i].inner.pay_amount+'元</td>';
            if(parseInt(data[i].inner.pay_amount_span) > 0){
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">'+data[i].inner.pay_amount_span+'元</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            }else{
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">'+Math.abs(data[i].inner.pay_amount_span)+'元</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">ARPU</td>';
            str += '<td class="color-b">'+data[i].inner.arpu+'元</td>';
            if(parseInt(data[i].inner.arpu_span) > 0){
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">'+data[i].inner.arpu_span+'元</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            }else{
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">'+Math.abs(data[i].inner.arpu_span)+'元</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">次日留存</td>';
            str += '<td class="color-b">'+data[i].inner.retention_rate+'%</td>';
            if(parseInt(data[i].inner.retention_rate_span) > 0){
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">'+data[i].inner.retention_rate_span+'%</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            }else{
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">'+Math.abs(data[i].inner.retention_rate_span)+'%</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '</tbody>';
            str += '</table>';
            str += '</div>';
            str += '</div>';
            str += '<div class="lt_game_detail b_none">';
            str += '<div class="border-b">';
            str += '<span>数据更新至 '+data[i].lt.data_date+'</span>';
            str += '<span class="fr"><a href="'+B_Jump._getUrl('gameSentiment',{gameId:data[i].project_id})+'">查看详情</a></span>';
            str += '</div>';
            str += '<div class="scroll-wrap">';
            str += '<table class="table table-condensed">';
            str += '</thead>';
            str += '<tbody>';
            str += '<tr>';
            str += '<td class="color-a">帖子总量</td>';
            str += '<td class="color-b">'+data[i].lt.topic_num+'个</td>';
            if(parseInt(data[i].lt.topic_span) > 0){
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">'+data[i].lt.topic_span+'个</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            }else{
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">'+Math.abs(data[i].lt.topic_span)+'个</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">负面反馈</td>';
            str += '<td class="color-b">' + data[i].lt.negative_num + '个</td>';
            if (parseInt(data[i].lt.negative_span) > 0) {
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">' + data[i].lt.negative_span + '个</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            } else {
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">' +Math.abs(data[i].lt.negative_span)+ '个</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">正面反馈</td>';
            str += '<td class="color-b">' + data[i].lt.positive_num + '个</td>';
            if (parseInt(data[i].lt.positive_span) > 0) {
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">' + data[i].lt.positive_span + '个</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            } else {
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">' +Math.abs(data[i].lt.positive_span)+ '个</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';

            str += '<tr>';
            str += '<td class="color-a">热词指数</td>';
            str += '<td class="color-b">' + data[i].lt.hotword_num + '个</td>';
            if (parseInt(data[i].lt.hotword_span) > 0) {
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">' + data[i].lt.hotword_span + '个</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            } else {
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">' +Math.abs(data[i].lt.hotword_span)+ '个</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';


            str += '<tr>';
            str += '<td class="color-a">话题总数</td>';
            str += '<td class="color-b">' + data[i].lt.topic_num + '个</td>';
            if (parseInt(data[i].lt.topic_span) > 0) {
                str += '<td class="color-c">较昨日增长</td>';
                str += '<td class="color-d">' + data[i].lt.topic_span + '个</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            } else {
                str += '<td class="color-c">较昨日减少</td>';
                str += '<td class="color-d">' +Math.abs(data[i].lt.topic_span)+ '个</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';


            str += '<tr>';
            str += '<td class="color-a">App Store排名</td>';
            str += '<td class="color-b">' + data[i].lt.apps_num + '名</td>';
            if (parseInt(data[i].lt.apps_span) > 0) {
                str += '<td class="color-c">较昨日上升</td>';
                str += '<td class="color-d">' + data[i].lt.apps_span + '名</td>';
                str += '<td><b class="up">&uarr;</b></td>';
            } else {
                str += '<td class="color-c">较昨日下降</td>';
                str += '<td class="color-d">' +Math.abs(data[i].lt.apps_span)+ '名</td>';
                str += '<td><b class="down">&darr;</b></td>';
            }
            str += '</tr>';


            str += '</tbody>';
            str += '</table>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
        }
        var hasGame = true;
        if(str == '')hasGame = false;
        str += '<div class="blockpart  no-title  col-lg-3 col-md-6 col-sm-6 col-xs-6">';
        if(!hasGame)str += '<h3>核心数据概览</h3>';
        str += '<div class="boxshadow game-overview add-new">';
        str += '<h5>添加智能分析服务</h5>';
        str += '<p>您可以接入游戏日志，从而获取更加智能的游戏运营分析服务</p>';
        str += '<a class="tg-assist-btn" onclick="B_Login._openProbation(\'operate\')">申请接入</a>';
        str += '<h5>添加运营指标服务</h5>';
        str += '<p>您可以接入游戏日志，从而掌握精准的游戏运营指标</p>';
        str += '<a class="tg-assist-btn" onclick="B_Login._openProbation(\'inside\')">申请接入</a>';
        str += '</div>';
        str += '</div>';
        return str;
    }
}