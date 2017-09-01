var F_Helper_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(4);

        if(M_Init._controller != 'demo' && B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            M_Init._operateCondition = {};
            switch(M_Init._controller) {
                case 'demo':
                    M_Init._api['playerKey'] = 'demoPlayerKey';
                    M_Init._api['innerSearchMeta'] = 'demoInnerSearchMeta';
                    break;
                default:
                    M_Init._api['innerSearchMeta'] = 'innerSearchMeta';
                    M_Init._api['playerKey'] = 'playerKey';
                    break;
            }
            M_Operate._searchPop();
            M_Common._getOrderGame('helper','','8-1');
            $('#bs_btn_main_search').click(function () {
                M_Operate._btnSearch('helper');
            });
        }
    }
}

var F_Helper_Info = {
    _getInfo:function () {
        M_Operate._getTag('helper');
        var dom = $('#ct_main_area');
        var summaryStr = '';
        var postData = {};
        postData['game_id'] = M_Init._gameId;
        postData = B_Common._postData(postData);
        B_Port._ajax(M_Init._api['playerKey'],'get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data){
                    summaryStr += F_Helper_Info._htmlInfo(data);
                }
                dom.html(summaryStr+F_Helper_Info._htmlAd());
                $('.bs_qq').each(function () {
                    $(this).click(function () {
                        B_Jump._go('openUrl',B_Common._qqUrl());
                    });
                });
                $('.bs_detail').each(function () {
                    $(this).click(function () {
                        var url = '';
                        var dataId = $(this).attr('data-i');
                        url = B_Jump._getUrl('operateBasic',{'type':dataId});
                        B_Jump._go('base',url);
                    });
                });
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlInfo:function (data) {
        data.active_high_lost_rate = (data.active_high_lost_rate*100).toFixed(0);
        data.active_high_pay_rate = (data.active_high_pay_rate*100).toFixed(0);
        data.lost_paid_rate = (data.lost_paid_rate*100).toFixed(0);
        data.paid_high_lost_rate = (data.paid_high_lost_rate*100).toFixed(0);
        var str = '\
            <div class="row key-player ">\
                <div class="blockpart no-title  col-lg-4 col-md-6 col-sm-6 col-xs-6">\
                    <h3>关键玩家</h3>\
                    <div class="boxshadow ">\
                        <div class="title">\
                            <img src="elements2.0/img/assist/b1.png" alt="">\
                            <div class="des">\
                                <span>活跃玩家</span>\
                                <h3>'+data.active_num+'</h3>\
                                <p>累计玩家中7日内登录过的玩家</p>\
                            </div>\
                        </div>\
                        <ul>\
                            <li>\
                                <span>智能聚类为<b class="text-blue">'+data.active_group+'个</b>玩家群</span><a data-i="active" class="bs_detail">查看聚类结果</a>\
                            </li>\
                            <li>\
                                <span>付费意愿高于50%的玩家占比：<b class="text-blue">'+data.active_high_pay_rate+'%</b></span><a>付费意愿查询</a>\
                                <div class="rate-wrap"><span class="rate-percent yellow1" style="width:'+data.active_high_pay_rate+'%"></span></div>\
                            </li>\
                            <li>\
                                <span>流失风险高于50%的玩家占比：<b class="text-blue">'+data.active_high_lost_rate+'%</b></span><a>流失风险评估</a>\
                                <div class="rate-wrap"><span class="rate-percent blue1" style="width:'+data.active_high_lost_rate+'%"></span></div>\
                            </li>\
                        </ul>\
                    </div>\
                </div>\
                <div class="blockpart no-title  col-lg-4 col-md-6 col-sm-6 col-xs-6">\
                    <div class="boxshadow ">\
                        <div class="title">\
                            <img src="elements2.0/img/assist/b2.png" alt="">\
                            <div class="des">\
                                <span>付费玩家</span>\
                                <h3>'+data.paid_num+'</h3>\
                                <p>累计玩家中曾经付过费的玩家</p>\
                            </div>\
                        </div>\
                        <ul>\
                            <li>\
                                <span>智能聚类为<b class="text-blue">'+data.paid_group+'个</b>玩家群</span><a data-i="paid" class="bs_detail">查看聚类结果</a>\
                            </li>\
                            <li>\
                                <span>流失风险高于50%的玩家占比：<b class="text-blue">'+data.paid_high_lost_rate+'%</b></span><a>流失风险评估</a>\
                                <div class="rate-wrap"><span class="rate-percent blue1" style="width:'+data.paid_high_lost_rate+'%"></span></div>\
                            </li>\
                        </ul>\
                    </div>\
                </div>\
                <div class="blockpart no-title  col-lg-4 col-md-6 col-sm-6 col-xs-6">\
                    <div class="boxshadow ">\
                        <div class="title">\
                            <img src="elements2.0/img/assist/b3.png" alt="">\
                            <div class="des">\
                                <span>流失玩家</span>\
                                <h3>'+data.lost_num+'</h3>\
                                <p>累计玩家中7日未登录的玩家</p>\
                            </div>\
                        </div>\
                        <ul>\
                        <li>\
                            <span>智能聚类为<b class="text-blue">'+data.lost_group+'个</b>玩家群</span><a data-i="lost" class="bs_detail">查看聚类结果</a>\
                        </li>\
                        <li>\
                            <span>已流失的付费玩家占比：<b class="text-blue">'+data.lost_paid_rate+'%</b></span><a>付费意愿查询</a>\
                            <div class="rate-wrap"><span class="rate-percent purple2" style="width:'+data.lost_paid_rate+'%"></span></div>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
        </div>';

        return str;
    },
    _htmlAd:function () {
        var str = '\
            <div class="row  halfscreen-post">\
                <div class="blockpart  col-lg-4 col-md-6 col-sm-12 col-xs-12">\
                    <h3>玩家运营介绍</h3>\
                    <a class="boxshadow post1" href="operation.html">\
                        <img src="elements2.0/img/assist/banner1.jpg">\
                    </a>\
                </div>\
                <div class="blockpart  col-lg-4 col-md-6 col-sm-12 col-xs-12">\
                    <h3>玩家运营方案</h3>\
                    <a class="boxshadow post1 bs_qq">\
                        <img src="elements2.0/img/assist/banner2.jpg">\
                    </a>\
                </div>\
                <div class="blockpart  col-lg-4 col-md-6 col-sm-12 col-xs-12">\
                    <h3>玩家运营案例</h3>\
                    <a class="boxshadow post1 bs_qq">\
                        <img src="elements2.0/img/assist/banner3.jpg">\
                    </a>\
                </div>\
            </div>';

        return str;
    }
}