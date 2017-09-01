var F_ReportsItem_Entrance = {
    _init:function (id) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(3);
        F_ReportsItem_Info._cache['name'] = M_Dom._menuList('专业服务',id);
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            id = id.split('_');
            id = id[1];
            F_ReportsItem_Info._getList(id);
        }
    }
}
var F_ReportsItem_Info = {
    _cache:{'name':''},
    _htmlTitle:function (id,type,reportId) {
        var str = '';
        var iconNumber = '';
        var remark = '';
        var demo = {'title':'','content':'','img':id+'.png'};
        switch(id+''){
            case '1':
                iconNumber = 1;
                remark = '精准定位易导致玩家流失的关键因素及原因分析';
                demo['title'] = '玩家流失原因分析';
                demo['content'] = '玩家流失原因分析是通过深度学习等人工智能技术对已流失玩家的历史行为，训练出流失模型，进而计算出活跃玩家的流失概率及流失点分布。<br>数据分析师团队借助以上分析结果，结合游戏实际体验进一步解读影响玩家流失的关键点。帮助游戏项目组挽留高流失风险的活跃玩家，制定已流失玩家的召回方案。';
                break;
            case '2':
                iconNumber = 2;
                remark = '挖掘提升玩家付费的付费点、付费方式';
                demo['title'] = '付费点优化方案';
                demo['content'] = '付费点优化方案是通过深度学习等人工智能技术对已付费玩家的历史行为，训练出付费模型，进而计算出不同玩家的付费意愿及付费点。<br>数据分析师团队借助以上分析结果，结合游戏实际体验进一步解读影响玩家付费的关键点。帮助游戏项目组进行精准营销，从而提高游戏的付费渗透率。';
                break;
            case '3':
                iconNumber = 3;
                remark = '快速定位潜在的游戏数值问题，提出数值平衡性设定建议';
                demo['title'] = '系统数值合理性评估';
                demo['content'] = '传统的测试阶段，需要大量玩家完成尽可能多的关卡任务以获得最准确的测试效果。<br>在人工智能技术帮助下，通过玩家行为大数据构建游戏数值模型，找到不平衡点。比如经济体系的数值平衡性，成长体系的数值稳定性，战斗体系的数值平衡性等。合理调优后，可以有效降低因数值不合理性造成的玩家无力感，挽回流失玩家。';
                break;
            case '4':
                iconNumber = 4;
                remark = '分析目标游戏的优缺点，加强对目标游戏玩家的群体认识';
                demo['title'] = '产品广告投放指南';
                demo['content'] = '产品广告投放指南是对某一款游戏的所有玩家历史反馈数据进行深度剖析，旨在通过玩家反馈的真实数据分析出产品的优点和缺点，用于指导游戏项目组在立项阶段，分析标的产品的优缺点，加强对标的产品的玩家群体认识。';
                break;
            case '5':
                iconNumber = 6;
                remark = '剖析细分市场利润增长空间及有效的市场切入点';
                demo['title'] = '游戏立项深度分析报告';
                demo['content'] = '游戏立项深度分析报告为游戏项目组提供竞品游戏的深度分析，解读竞品游戏优缺点及玩家构成。<br>全面剖析玩家对竞品游戏的口碑评价，了解竞品游戏的优缺点、玩家活跃度、玩家付费意愿、流失风险、玩家构成等关键因素，知己知彼百战不殆。';
                break;
            case '6':
                iconNumber = 5;
                remark = '解读玩家反馈的优缺点及玩家构成等各项关键指标';
                demo['title'] = '细分市场调研服务';
                demo['content'] = '细分市场调研服务为游戏项目组提供立项阶段市场分析，剖析市场利润空间及有效的切入点。<br>ThinkingGame提供的细分市场调研服务能够汇聚过亿玩家基本属性和舆情数据，快速掌握目标市场的竞争格局、利润空间、玩家类型、玩家分布等关键信息。';
                break;
            case '7':
                iconNumber = 7;
                remark = '解读游戏行业现状，预测行业趋势，锁定玩家热点';
                demo['title'] = '游戏行业分析报告';
                demo['content'] = '汇聚千款热门游戏动态，从过亿玩家、主流游戏媒体角度，分析当前游戏行业特点，洞察新的市场增长点，剖析年度精品游戏案例。';
                break;
            case '8':
                iconNumber = 8;
                remark = '透过分析结果可以发现人工方式难以归纳的玩家群体特征';
                demo['title'] = '玩家群体构成和特征分析';
                demo['content'] = '玩家群体构成和特征分析是利用聚类算法，分析玩家的活动参与度、消费、玩法参与、社交、能力评估六个方面20项指标，帮助游戏项目组更全面了解玩家特征，定位出能够提升付费、降低流失风险的关键玩家。<br>透过分析结果可以发现人工方式难以归纳的玩家群体特征。';
                break;
            case '9':
                iconNumber = 9;
                remark = '帮助游戏项目组立项解读，充分掌握泛娱乐IP的相关信息';
                demo['title'] = '泛娱乐IP深度解读报告';
                demo['content'] = '泛娱乐IP深度解读报告是利用平台内玩家的海量舆情数据，解读游戏玩家在动漫、影视、音乐、文学等其他领域中的共同喜好、共同价值观。<br>帮助游戏项目组立项解读，充分掌握泛娱乐IP的相关信息。';
                break;
        }
        switch (type){
            case 'demo':
                var demoBtn = '';
                /*
                if(reportId){
                    demoBtn = '<button class="tg-assist-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Jump._getUrl('reportDetail')+'?report_id='+reportId+'\')">查看Demo</button>';
                }*/
                str += '\
                    <div class="report-b report-item">\
                        <span class="report-banner"></span>\
                    </div>\
                    <img src="'+B_Common._cdnImgUrl()+'2.0/reports/'+demo['img']+'" alt="" class="adver-bg">\
                    <div class="adver-des">\
                        <h3>'+demo['title']+'</h3>\
                        <p>'+demo['content']+'</p>\
                        <button class="tg-main-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Common._qqUrl()+'\')">在线咨询</button> '+demoBtn+'\
                    </div>';
                $('#contentPart').html(str);
                break;
            default:
                /*
                str += '\
                    <i class="tg-icon tg-report-icon tg-report-icon-'+iconNumber+'"></i>\
                    <div class="des">\
                        <h3>'+F_ReportsItem_Info._cache['name']+'</h3>\
                        <p>'+remark+'</p>\
                    </div>';
                $('.report-top').html(str);
                */
                break;
        }
    },
    _getList:function (itemId) {
        var domItemList = $('#contentPart');
        var postData = {};
        postData['classify_id'] = itemId;
        postData = B_Common._postData(postData);
        B_Port._ajax('getReportItem','get',true,postData,function(){
                domItemList.html(B_Pre._loading('b_padding30'));
            },function(){
                domItemList.html('');
            },function(data,msg){
                if(data){
                    switch(data.type){
                        case 'demo':
                            var reportId = '';
                            if(data.data && data.data.length > 0){
                                reportId = data.data[0].report_id;
                            }
                            $('#headerTop').hide();
                            F_ReportsItem_Info._htmlTitle(itemId,'demo',reportId);
                            break;
                        default:
                            F_ReportsItem_Info._htmlTitle(itemId);
                            domItemList.html(F_ReportsItem_Info._htmlList(data.data));
                            break;
                    }
                }else{
                    domItemList.html(B_Pre._empty('您还没有购买任何报告'));
                }

            },function(data,msg,code){
                domItemList.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlList:function (data) {
        var str = '';
        if(data && data.length>0){
            var cdnImg = B_Common._cdnImgUrl();
            for(var i=0;i<data.length;i++){
                str += '<div class="blockpart col-lg-4 col-md-6 col-sm-6 col-xs-6">';
                str += '<h3>'+data[i].report_name+'</h3>';
                str += '<div class="boxshadow "><ul class="report-list">';
                str += '<li>';
                str += '<img src="'+cdnImg+data[i].cover_pic+'">';
                str += '<div class="des-wrap">';
                str += '<p>'+data[i].report_slogan+'</p>';
                str += '<p class="report-summary">'+data[i].report_desc+'</p>';
                str += '<button class="tg-main-btn" onclick="B_Jump._go(\'openUrl\',\''+B_Jump._getUrl('reportDetail')+'?report_id='+data[i].report_id+'\')">在线阅读</button>';
                str += '</div></li></ul></div></div>';
            }
        }
        return str;
    }
}
