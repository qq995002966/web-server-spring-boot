var F_Demo_Entrance = {
    _init: function(type) {
        B_Login._checkUpdate();

        var headIndex = 1;
        var column = type.substr(0,7);
        var columnDemoStr = 'demo';
        switch (column){
            case 'operate':
                headIndex = 4;
                columnDemoStr = 'operateDemo';
                break;
        }
        M_HeadFoot._headShow(headIndex);

        if (M_Init._controller != 'demo' && B_User._isDemoUser()) {
            B_Login._openLogin('background');
        } else {
            M_Init._clean();
            $('#headerTop').remove();
            type = type.split('|');
            var classify = type[0];
            var number = type[1] ? type[1] : '';
            var identity = 'd-1-1';
            var url = classify;
            M_Init._dataCache['title'] = '';
            M_Init._dataCache['msg'] = '';
            M_Init._gameIdRight = classify+'.png';

            switch (classify){
                case 'operateHelper':
                    identity = 'd-8-1';
                    M_Init._dataCache['title'] = '快速掌握关键玩家流失风险、付费意愿';
                    M_Init._dataCache['msg'] = '玩家运营助手是关键玩家运营的第一步，在玩家运营助手可以快速查看关键玩家的关键指标变化，在玩家运营助手的引导下进入与指标相关的功能页面，开展关键玩家运营。';
                    break;
                case 'operateBasic':
                    identity = 'd-8-3';
                    url += '/';
                    M_Init._dataCache['title'] = '客观反映玩家的真实特征';
                    M_Init._dataCache['msg'] = '通过玩家个性标签即可了解玩家的性格特征、兴趣爱好及对游戏的理解等情况，提出符合玩家口味的运营方案、让产品优化不再拍脑袋';
                    break;
                case 'operatePlayer':
                    identity = 'd-8-2';
                    M_Init._dataCache['title'] = '精准定位目标玩家 掌握玩家特性';
                    M_Init._dataCache['msg'] = '自定义玩家查询不仅能够快速查询某一玩家的特征，还能通过自定义查询功能，获取某一目标玩家群的ID及玩家特征分布。此外，系统还支持创建玩家追踪任务，持续跟踪目标玩家群的人数变化';
                    break;
                case 'operateLog':
                    identity = 'd-8-4';
                    M_Init._dataCache['title'] = '轻松解读玩家的海量行为日志';
                    M_Init._dataCache['msg'] = '通过玩家产生的海量日志数据进行快速检索，快速精准查询道具、登录登出、购买等日志中的各项关键指标';
                    break;
                case 'operatePay':
                    identity = 'd-8-5';
                    M_Init._dataCache['title'] = '轻松解读玩家的海量行为日志';
                    M_Init._dataCache['msg'] = '通过玩家产生的海量日志数据进行快速检索，快速精准查询道具、登录登出、购买等日志中的各项关键指标';
                    break;
                case 'operateLost':
                    identity = 'd-8-6';
                    M_Init._dataCache['title'] = '轻松解读玩家的海量行为日志';
                    M_Init._dataCache['msg'] = '通过玩家产生的海量日志数据进行快速检索，快速精准查询道具、登录登出、购买等日志中的各项关键指标';
                    break;
                case 'insideSummary':
                    identity = 'd-1-1';
                    M_Init._dataCache['title'] = '全盘掌握游戏运营状态';
                    M_Init._dataCache['msg'] = '快速掌握游戏各项关键运营指标，了解玩家新增、活跃、流失、付费等情况，此外，系统还支持自动监测出现波动的指标，快速定位运营中的问题';
                    break;
                case 'insideAdditional':
                    identity = 'd-1-2';
                    M_Init._dataCache['title'] = '更全面的玩家分析维度';
                    M_Init._dataCache['msg'] = '追踪不同玩家群体的关键数据，深入分析不同玩家群体中的潜在流失玩家、潜在付费玩家构成，协助运营人员更好的掌握游戏当前的真实运营情况';
                    break;
                case 'insideRetentioncount':
                    identity = 'd-1-3';
                    M_Init._dataCache['title'] = '轻松发现延长玩家生命周期的方法';
                    M_Init._dataCache['msg'] = '准确掌握新增玩家次日、7日、30日留存情况，同时支持自定义查询新增玩家、活跃玩家、付费玩家在注册后的每日活跃情况';
                    break;
                case 'insidePayData':
                    identity = 'd-1-4';
                    M_Init._dataCache['title'] = '掌握玩家付费情况及付费潜力';
                    M_Init._dataCache['msg'] = '围绕玩家的付费行为，了解玩家的付费渗透、付费习惯，掌握游戏的收入结构。协助运营人员更好的设计游戏的运营活动，有效提升付费渗透率';
                    break;
                case 'insideLostAnalysis':
                    identity = 'd-1-5';
                    M_Init._dataCache['title'] = '及时获取各类玩家流失状况';
                    M_Init._dataCache['msg'] = '全面监测各类玩家的流失率等关键指标，方便运营人员时刻掌握玩家流失情况';
                    break;
                case 'insideChannelQuality':
                    identity = 'd-1-6';
                    M_Init._dataCache['title'] = '快速分析渠道投资回报率';
                    M_Init._dataCache['msg'] = '针对游戏分发渠道进行多维度数据监测，准确判断各渠道的数量、质量、收入等关键指标';
                    break;
                case 'insidePersonality':
                    identity = number;
                    url += '/'+number;
                    M_Init._gameIdRight = classify+number+'.png';

                    switch (number){
                        case '0-2':
                            M_Init._dataCache['title'] = '改善不合理的关卡有效提升留存';
                            M_Init._dataCache['msg'] = '通过对关卡驻留人数、胜率、首次挑战通过率等指标进行分析，以合理调整关卡难度，减少玩家因挫败或缺乏挑战导致流失';
                            break;
                        case '1-4':
                            M_Init._dataCache['title'] = '掌握玩家游戏进度 延长玩家生命周期';
                            M_Init._dataCache['msg'] = '留意不同关卡及不同活跃天数的玩家特征，发现玩家对游戏内容的疲惫期，改善游戏内容以延长游戏成长期和成熟期';
                            break;
                        case '2-7':
                            M_Init._dataCache['title'] = '细微分析每一项玩法、任务、页面';
                            M_Init._dataCache['msg'] = '深入游戏的每一个场景，分析玩家在每个任务、竞技场中的表现，以及每个页面的到访情况，有效提升玩家的体验';
                            break;
                        case '3-12':
                            M_Init._dataCache['title'] = '掌握提升游戏付费率的关键要素';
                            M_Init._dataCache['msg'] = '分析游戏中的投入产出，掌握经济规律、玩家充值习惯、热销物品及不同等级玩家的消费偏好，才能准确刺激玩家消费';
                            break;
                        case '4-17':
                            M_Init._dataCache['title'] = '了解玩家对不同英雄的喜好度';
                            M_Init._dataCache['msg'] = '通过对比英雄经验分配、出场次数、出场率、PVP组队排名、PVP最高进度，针对玩家的个性偏好优化英雄设计';
                            break;
                        case '5-19':
                            M_Init._dataCache['title'] = '深度分析公会及公会活动';
                            M_Init._dataCache['msg'] = '观察游戏中的公会数、公会参与人数、公会活跃度等，能够更深入分析玩家在游戏中的活跃度，找出玩家中有影响力的公会';
                            break;
                    }
                    break;
            }
            M_Init._searchKeyword = url;
            M_Common._getOrderGame(columnDemoStr,url,identity);
        }
    }
}
var F_Demo_Info = {
    _getInfo:function (from) {
        var str = '';
        str += '\
            <img src="http://image.thinkinggame.cn/img/2.0/demo/'+M_Init._gameIdRight+'" alt="" class="adver-bg">\
            <div class="adver-des">\
                <h3>'+M_Init._dataCache['title']+'</h3>\
                <p>'+M_Init._dataCache['msg']+'</p>\
                <button class="tg-main-btn" onclick="B_Login._openProbation(\''+from+'\');">申请试用</button>\
                <button class="tg-assist-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Jump._getUrl('demo',{'demo':M_Init._searchKeyword})+'\')">查看Demo</button>\
            </div>';
        $('#contentPart').html(str);
    }
}