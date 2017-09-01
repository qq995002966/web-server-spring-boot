var F_Reports_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(3);
        M_Dom._menuList('专业服务','0');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            F_Reports_Info._getList();
            $('#bs_qq').click(function () {
                B_Jump._go('openUrl',B_Common._qqUrl());
            });
            $('#bs_download').click(function () {});
        }
    }
}
var F_Reports_Info = {
    _getList:function () {
        var domItemList = $('#lt_reports_item')
        B_Port._ajax('getReportList','get',true,null,function(){
                domItemList.html(B_Pre._loading('b_padding30'));
            },function(){
                domItemList.html('');
            },function(data,msg){
                if(data && data.length > 0){
                    domItemList.html(F_Reports_Info._htmlList(data));
                }else{
                    //domItemList.html(B_Pre._empty('您还没有购买任何报告'));
                    $('.report-b').addClass('report-b-noservice');
                    domItemList.html(F_Reports_Info._htmlNoData());
                    domItemList.find('a').each(function () {
                        $(this).click(function () {
                            B_Jump._go('target',$(this).attr('data-t'));
                        });
                    });
                }
            },function(data,msg,code){
                domItemList.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlList:function (data) {
        var str = '<h3>已解读的数据报告</h3><div class="boxshadow report-wrap" >';
        if(data && data.length>0){
            var cdnImg = B_Common._cdnImgUrl();
            for(var i=0;i<data.length;i++){
                str += '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-6"><ul class="report-list">';
                str += '<li>';
                str += '<img src="'+cdnImg+data[i].cover_pic+'">';
                str += '<div class="des-wrap">';
                str += '<h5>'+data[i].report_name+'</h5>';
                str += '<p>'+data[i].report_slogan+'</p>';
                str += '<p class="report-summary">'+data[i].report_desc+'</p>';
                str += '<button class="tg-main-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Jump._getUrl('reportDetail')+'?report_id='+data[i].report_id+'\')">在线阅读</button>';
                str += '</div></li></ul></div>';
            }
        }
        str += '</div>';
        return str;
    },
    _htmlNoData:function () {
        var str = '';
        str += '\
            <div class="blockpart report-no-service  col-lg-4 col-md-6 col-sm-6 col-xs-6">\
                <div class="boxshadow ">\
                    <ul class="report-list">\
                        <li>\
                            <img src="http://image.thinkinggame.cn/img/2.0/home/3-3.png  " alt="">\
                            <div class="des-wrap">\
                                <h3>立项阶段游戏战略咨询</h3>\
                                <p>从过亿玩家、千款热门游戏中洞察玩家分布、竞品特征、行业动向。为游戏公司制定发展战略提供咨询服务</p>\
                                <a data-t="reportsItemHot">产品广告投放指南</a>\
                                <a data-t="reportsItemDeep">游戏立项深度分析报告</a>\
                                <a data-t="reportsItemRival">细分市场调研服务</a>\
                                <a data-t="reportsItemGuide">游戏行业分析报告</a>\
                                <a data-t="reportsItemIp">泛娱乐IP深度解读报告</a>\
                            </div>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
            <div class="blockpart report-no-service  col-lg-4 col-md-6 col-sm-6 col-xs-6">\
                <div class="boxshadow ">\
                    <ul class="report-list">\
                        <li>\
                            <img src="http://image.thinkinggame.cn/img/2.0/home/3-2.png" alt="">\
                            <div class="des-wrap">\
                                <h3>产品调优阶段数值合理性评估</h3>\
                                <p>来自盛大、腾讯、Intel的数据分析师为不同游戏量身定制结合人工智能的运营方案，优化游戏付费点、分析玩家流失原因</p>\
                                <a data-t="reportsItemRationality">系统数值合理性评估</a>\
                                <a data-t="reportsItemLost">玩家流失原因分析</a>\
                                <a data-t="reportsItemPay">付费点优化方案</a>\
                            </div>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
            <div class="blockpart report-no-service  col-lg-4 col-md-6 col-sm-6 col-xs-6">\
                <div class="boxshadow ">\
                    <ul class="report-list">\
                        <li>\
                            <img src="http://image.thinkinggame.cn/img/2.0/home/3-1.png" alt="">\
                            <div class="des-wrap">\
                                <h3>运营阶段智能运营方案</h3>\
                                <p>基于人工智能技术，为游戏在各个生命周期提供玩家精准分析，玩家行为预测和个性化推荐等数据应用支持</p>\
                                <a data-t="reportsItemClustering">玩家群体构成和特征分析</a>\
                            </div>\
                        </li>\
                    </ul>\
                </div>\
            </div>';

        return str;
    }
}
