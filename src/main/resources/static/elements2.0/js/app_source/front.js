var S_Chart = {
    _chartData:function (type,dom,data,chartClickId) {
        var chartDataPre = {
            'xSplitLine':false,
            'xBoundaryGap':true,
            'color':['#3daae3','#2ed383','#8b5c9b','#f3d049','#476cd0','#3fa553','#524a89','#ec644c'],
            'tooltip':{'trigger':'item'},
            'legend':[],
            'legendSelectMode':false,
            'xAxis':[],
            'yAxis':[
                {
                    splitLine : {
                        lineStyle:{
                            color:'#EEEEEE'
                        }
                    },
                    type : 'value',
                    axisLine:{
                        show : false
                    },
                    axisTick:{
                        show : false
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#333333',
                            fontSize : '11px'
                        }
                    },
                    data:[]
                }
            ],
            'series':[],
            'xType':'category',
            'xAxisLabel':{
                textStyle:{
                    color:'#333333',
                    fontSize : '11px'
                }
            }
        };
        if(data.xFormatDate){
            chartDataPre.xAxisLabel.formatter = function (value, index) {
                var date = new Date(value);
                var texts = [(date.getMonth() + 1), date.getDate()];
                return texts.join('/');
            };
        }
        if(data.xSplitLine)chartDataPre.xSplitLine = data.xSplitLine;
        if(data.color)chartDataPre.color = data.color;
        chartDataPre.legendSelectMode = data.legendSelectMode ? data.legendSelectMode : false;
        if(data.inverse)chartDataPre.yAxis[0].inverse = true;
        if(data.yMin)chartDataPre.yAxis[0].min = data.yMin;
        if(data.yMax)chartDataPre.yAxis[0].max = data.yMax;
        chartDataPre.xType = 'category';
        chartDataPre.tooltip.trigger = 'axis';

        if(!chartDataPre.legendSelectMode && data.tooltip){
            var tooltipStr = '{b}<br />';
            for(var i=0;i<data.tooltip.num;i++){
                tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+chartDataPre.color[i]+'"></span>{a'+i+'}: {c'+i+'}'+data.tooltip.unit+'<br />';
            }
            chartDataPre.tooltip.formatter = tooltipStr;
        }
        switch(type){
            case 'scatterType':
                chartDataPre.xAxis = [
                    {
                        gridIndex: 0,
                        min: 0,
                        max: data.xMax,
                        axisLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            show:false
                        }
                    }
                ];
                chartDataPre.yAxis = [
                    {
                        gridIndex: 0,
                        min: 0,
                        max: 100,
                        axisLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            show:false
                        }
                    }
                ];
                chartDataPre.series = [
                    {
                        name: data.data.name,
                        type: 'scatter',
                        data: data.data.data
                    }
                ];
                chartDataPre.tooltip = {
                    show: false,
                    trigger:'item',
                    formatter: function (params) {
                        return '';
                    }
                };
                break;
            case 'scatter':
                chartDataPre.xBoundaryGap = false;
                chartDataPre.tooltip = {
                    trigger: 'item',
                    formatter: function (params) {
                        if(params.value){
                            var xName = F_Industry_Common._cache['typeClassify'][params.value[0]];
                            return F_Industry_Common._cache['typePlat'][params.value[1]]+'('+xName+')：'+params.value[2]+'%';
                        }
                    }
                };
                chartDataPre.xAxis = data.x_axis;
                chartDataPre.yAxis[0].type = 'category';
                chartDataPre.yAxis[0].data = data.y_name;
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                for(var i=0;i<length;i++){
                    if(length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    switch(type){
                        case 'scatter':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'scatter',
                                symbolSize: function (val) {
                                    return val[2] * 2;
                                },
                                data:dataUnion[i].data,
                            });
                            break;
                    }
                }
                if(data.yFormat){
                    chartDataPre.yAxis[0].axisLabel.formatter = '{value}'+data.yFormat;
                }
                break;
            case 'line':
            case 'lineActive':
                chartDataPre.xAxis = data.x_axis;
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                for(var i=0;i<length;i++){
                    if(length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    for(var n=0;n<dataUnion[i].data.length;n++){
                        dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                    }
                    switch(type){
                        case 'line':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'line',
                                data:dataUnion[i].data
                            });
                            break;
                        case 'lineActive':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'line',
                                areaStyle: {normal: {}},
                                data:dataUnion[i].data
                            });
                            break;
                    }
                }
                if(data.yFormat){
                    chartDataPre.yAxis[0].axisLabel.formatter = '{value}'+data.yFormat;
                }
                break;
            case 'bar':
                chartDataPre.xAxis = data.x_axis;
                var dataUnion = data.y_axis;
                var length = dataUnion.length;
                if(length > 1){
                    chartDataPre.tooltip.axisPointerType = 'shadow';
                }
                for(var i=0;i<length;i++){
                    if(length > 1)chartDataPre.legend.push(dataUnion[i].name);
                    for(var n=0;n<dataUnion[i].data.length;n++){
                        dataUnion[i].data[n] = parseFloat(dataUnion[i].data[n]);
                    }
                    switch(type){
                        case 'bar':
                            chartDataPre.series.push({
                                name:dataUnion[i].name,
                                type:'bar',
                                data:dataUnion[i].data,
                                barMaxWidth:15,
                                itemStyle:{normal:{barBorderRadius:5}}
                            });
                            break;
                    }
                }
                if(data.yFormat){
                    chartDataPre.yAxis[0].axisLabel.formatter = '{value}'+data.yFormat;
                }
                break;
            case 'map':
                chartDataPre.tooltip.trigger = 'item';
                chartDataPre.visualMap = {
                    min: 0,
                    max:data.visualMax,
                    left: 'right',
                    top: 'bottom',
                    text: ['高(%)','低(%)'],
                    calculable: true,
                    color:['#51c7ef','#91cfe4','#dde7ea']
                };
                dataUnion = data.y_axis[0];
                chartDataPre.series.push({
                    name:dataUnion.name,
                    type:'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    roam: false,
                    itemStyle:{
                        normal:{
                            label:{show:false},
                            borderWidth:1,
                            borderColor:'#ffffff'
                        },
                        emphasis:{label:{show:true}}
                    },
                    data:dataUnion.data
                });
                chartDataPre.legend = null;
                break;
        }
        S_Chart._drawChart(type,dom,chartDataPre,chartClickId);
    },
    _drawChart:function (type,dom,chartDataPre,chartClickId) {
        var chartData = {};
        var legend = [];
        if(chartDataPre.legend){
            for(var i=0;i<chartDataPre.legend.length;i++){
                legend.push({
                    name: chartDataPre.legend[i],
                    icon: 'roundRect'
                });
            }
            chartData.legend = {
                left:'right',
                data:legend,
                selectedMode:chartDataPre.legendSelectMode
            };
        }
        chartData.color = chartDataPre.color;
        chartData.tooltip = chartDataPre.tooltip;

        chartData.grid = {
            left: '30',
            right: '30',
            bottom: 0,
            top: '6%',
            containLabel: true
        }
        switch(type){
            case 'map':
                chartData.visualMap = chartDataPre.visualMap;
                break;
            default:
                chartData.xAxis = [
                    {
                        splitLine : {
                            show: chartDataPre.xSplitLine,
                            lineStyle:{
                                color:'#EEEEEE'
                            }
                        },
                        boundaryGap : chartDataPre.xBoundaryGap,
                        type: chartDataPre.xType,
                        data: chartDataPre.xAxis,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: chartDataPre.xAxisLabel
                    }
                ];
                chartData.yAxis = chartDataPre.yAxis;
                break;
        }
        chartData.series = chartDataPre.series;
        B_Chart._getEChart(type,dom,chartData,chartClickId);
    }
}
var S_HeadFoot = {
    _htmlPaper:function () {
        var str = '\
            <div class="black-top"></div>\
            <div class="gray-bottom">\
                <ul>\
                    <li>\
                        <a href="sigma.html">\
                            <div class="top-img img-a"></div>\
                            <div class="mask-hover"></div>\
                            <img src="http://image.thinkinggame.cn/img/2.0/footer/sigma.png" alt="">\
                            <div class="des">\
                                <h2>核心技术</h2>\
                                <h3>Sigma底层核心系统</h3>\
                                <p> 为发现"暗数据"而生</p>\
                            </div>\
                        </a>\
                    </li>\
                    <li>\
                        <a href="company.html ">\
                            <div class="top-img img-b"></div>\
                            <div class="mask-hover"></div>\
                            <img src="http://image.thinkinggame.cn/img/2.0/footer/company.png" alt="">\
                            <div class="des">\
                                <h2>关于我们</h2>\
                                <h3>ThinkingData</h3>\
                                <p> 助力企业构造自己的人工智能</p>\
                            </div>\
                        </a>\
                    </li>\
                    <li>\
                        <a onclick="B_Login._openApplication();">\
                            <div class="top-img img-c"></div>\
                            <div class="mask-hover"></div>\
                            <img src="http://image.thinkinggame.cn/img/2.0/footer/huodong.png" alt="">\
                            <div class="des">\
                                <h2>最近活动</h2>\
                                <h3>闭门论剑</h3>\
                                <p> 申请参加</p>\
                            </div>\
                        </a>\
                    </li>\
                </ul>\
            </div>';

        $('#paperPart').html(str);
    },
    _htmlLoginHeader:function (name) {
        return '\
            <div class="tg-header-wrap total-width ">\
                <div class="tg-navbar fl">\
                <i class="h-logo c-img"></i>\
                </div>\
                <div class="L-btn">\
                <span> '+name+'</span>\
                </div>\
            </div>';
    },
    _htmlLoginFooter:function () {
        return '<p>2015-2017 THINKINGGAME.CN 版权所有 <a href="http://www.miitbeian.gov.cn/" target="_blank">沪ICP备 15030552号</a></p>';
    },
    _getLoginHead:function(name){
        $('#headerPart').html(S_HeadFoot._htmlLoginHeader(name));
        $('#LoginFooterPart').html(S_HeadFoot._htmlLoginFooter());

    },
    _htmlHeadProductPop:function () {
        return '\
                <div class="hover-nav-white"></div>\
                <div class="hover-nav-wrap">\
                    <ul class="nav-wrap">\
                        <li class="title">智能运营平台</li>\
                        <li class="nav-list-hover nav-a hover-selected">\
                            <i class="tg-icon-side side-4"></i><a href="javascript:void(0) ">智能分析</a>\
                            <div class=" nav-hover-content">\
                                <p>智能分析</p>\
                                <h4>聚焦关键玩家开展精准营销</h4>\
                                <ul>\
                                    <li>\
                                        <img src="'+B_Common._cdnImgUrl()+'2.0/drop/1.jpg" alt="">\
                                        <p>定位不同玩家特点，设定迎合玩家需求的高效运营方式</p><button onclick="B_Jump._go(\'target\',\'operation\')">了解更多</button>\
                                    </li>\
                                    <li class="fr">\
                                        <img src="'+B_Common._cdnImgUrl()+'2.0/drop/2.jpg" alt="">\
                                        <p> 立即升级到智能运营分析平台</p>\
                                        <button onclick="B_Jump._go(\'target\',\'price\')">申请开通</button>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li class="nav-list-hover nav-b">\
                            <i class="tg-icon-side side-2"></i><a href="javascript:void(0) ">运营指标</a>\
                            <div class=" nav-hover-content">\
                                <p>运营指标</p>\
                                <h4>数据支持决策改善游戏设计</h4>\
                                <ul>\
                                    <li>\
                                    <img src="'+B_Common._cdnImgUrl()+'2.0/drop/3.jpg  " alt="">\
                                    <p>精准统计核心数据，挖掘游戏数据潜在价值，提升游戏运营效率</p>\
                                    <button onclick="B_Jump._go(\'target\',\'analysis\')">了解更多</button>\
                                    </li>\
                                    <li class="fr">\
                                    <img src="'+B_Common._cdnImgUrl()+'2.0/drop/4.jpg" alt="">\
                                    <p>立即升级到智能运营分析平台</p><button onclick="B_Jump._go(\'target\',\'price\')">申请开通</button>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li class="nav-list-hover nav-c">\
                            <i class="tg-icon-side side-3"></i>\
                            <a href="javascript:void(0)">舆情雷达</a>\
                            <div class=" nav-hover-content">\
                                <p>舆情雷达</p>\
                                <h4>洞悉市场反馈提升玩家体验</h4>\
                                <ul>\
                                    <li>\
                                    <img src="'+B_Common._cdnImgUrl()+'2.0/drop/5.jpg" alt="">\
                                    <p>识别过亿玩家反馈内容，定位玩家多维度特征，轻松监测舆情变化</p><button onclick="B_Jump._go(\'target\',\'radar\')">了解更多</button>\
                                    </li>\
                                    <li class="fr">\
                                    <img src="'+B_Common._cdnImgUrl()+'2.0/drop/6.jpg" alt="">\
                                    <p>免费使用舆情雷达</p><button onclick="S_User._goVisit(\'outsideFaceSummary\')">免费使用</a></button>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li class="title">智能运营专业服务</li>\
                        <li class="nav-list-hover nav-d">\
                            <i class="tg-icon-side side-1"></i>\
                            <a href="professional.html ">专业服务</a>\
                            <div class=" nav-hover-content">\
                                <p>专业服务</p>\
                                <h4>人机结合的专业服务助您建立更好的游戏业务</h4>\
                                <ul>\
                                    <li>\
                                        <img src="'+B_Common._cdnImgUrl()+'2.0/drop/7.jpg" alt="">\
                                        <p> 数据应用支持</p>\
                                        <a href="item.html?k=13">数值合理性评估</a>\
                                    </li>\
                                    <li>\
                                        <img src="'+B_Common._cdnImgUrl()+'2.0/drop/8.jpg" alt="">\
                                        <p> 智能运营方案</p>\
                                        <a href="item.html?k=9">付费点优化方案</a>\
                                        <a href="item.html?k=8">玩家流失原因分析</a>\
                                    </li>\
                                    <li>\
                                        <img src=" '+B_Common._cdnImgUrl()+'2.0/drop/9.jpg" alt="">\
                                        <p> 游戏战略咨询</p>\
                                        <a href="item.html?k=10">热门游戏解读报告</a>\
                                        <a href="item.html?k=15">竞品游戏深度分析</a>\
                                        <a href="item.html?k=14">细分市场调研</a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li class="title">核心系统</li>\
                        <li class="nav-list-hover nav-e">\
                            <i class="tg-icon-side side-5"></i>\
                            <a href="javascript:void(0)">Sigma<b class="tm-text">TM</b>系统</a>\
                                <div class=" nav-hover-content">\
                                <p>Sigma<b class="tm-text">TM</b>系统</p>\
                                <h4>为发现数据内在的关联而生</h4>\
                                <ul>\
                                    <li>\
                                        <img src="'+B_Common._cdnImgUrl()+'2.0/drop/10.jpg" alt="">\
                                        <p>Sigma通过机器学习、数据挖掘和自然语言处理等人工智能技术，帮助游戏企业发现潜在的核心玩家，以及隐藏性的关联，为玩家提供更个性化的游戏体验</p>\
                                        <button onclick="B_Jump._go(\'target\',\'sigma\')">了解更多</button>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>\
                    </ul>\
                </div>';

    },
    _htmlHead:function (index) {
        var menuStr = '';
        menuStr += '<div class="tg-navbar fl"><i class="h-logo c-img"></i>';
        menuStr += '<ul class="b_relative">';
        menuStr += '<li class="product-hover-nav" style="cursor: default;"';
        menuStr += '>产品介绍</li>';
        menuStr += '<li id="bs_head_m_light" onclick="B_Jump._go(\'target\',\'price\')"';
        menuStr += '>产品定价</li>';
        // menuStr += '<li onclick="B_Jump._go(\'target\',\'guide\')"';
        // menuStr += '>行业指南</li>';
        // menuStr += '<li id="bs_head_m_service" onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('article')+'?t=classify&m=研发\')"';
        // menuStr += '>每日干货</li>';
        menuStr += '<li class="about-nav" style="cursor: default;"';
        menuStr += '>行业洞察';
        menuStr += '<div id="SubNav">';
        menuStr += '<p><a onclick="B_Jump._go(\'target\',\'guide\')">行业分析</a></p>';
        menuStr += '<p><a onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('article')+'?t=classify&m='+B_Common._encodeUrl('研发')+'\')">媒体透视</a></p>';
        menuStr += '<p><a onclick="B_Jump._go(\'target\',\'atlas\')">游戏图谱</a></p>';
        menuStr += '</div>'
        menuStr += '</li>';
        menuStr += '<li class="about-nav" style="cursor: default;"';
        menuStr += '>关于我们';
        menuStr += '<div id="SubNav">';
        menuStr += '<p><a onclick="B_Jump._go(\'target\',\'company\')">公司介绍</a></p>';
        menuStr += '<p><a onclick="B_Jump._go(\'target\',\'join\')">加入我们</a></p>';
        menuStr += '<p><a onclick="B_Jump._go(\'target\',\'partner\')">合作伙伴</a></p>';
        menuStr += '</div>'
        menuStr += '</li>';
        menuStr += '</ul>';
        menuStr += '</div>';

        return menuStr;
    },
    _getHead:function () {
        var str = '\
            <div class="header-wrap total-width">\
                <div class="tf-navbar fl">\
                    <a href="index.html"><i class="h-logo c-img"></i></a>\
                    <ul>\
                        <li><span>产品</span>\
                            <div class="navbar-list"><i class="border-top"></i>\
                                <ul>\
                                    <li><a href="'+B_Jump._getUrl('operation')+'">用户决策中心</a></li>\
                                    <li><a href="'+B_Jump._getUrl('datacenter')+'">智能运营平台</a></li>\
                                    <li><a href="'+B_Jump._getUrl('radar')+'">市场口碑监测</a></li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li class="solving"><span>解决方案</span>\
                            <div class="navbar-list"><i class="border-top"></i>\
                                <ul>\
                                    <li><a href="'+B_Jump._getUrl('analysissolution')+'">精细化运营解决方案</a></li>\
                                    <li><a href="'+B_Jump._getUrl('popluarsolution')+'">市场用研解决方案</a></li>\
                                    <li><a href="'+B_Jump._getUrl('professional')+'">游戏专项咨询服务</a></li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li><span>数据洞察</span>\
                            <div class="navbar-list"><i class="border-top"></i>\
                                <ul>\
                                    <li><a href="'+B_Jump._getUrl('guide')+'">行业分析</a></li>\
                                    <li><a href="'+B_Jump._getUrl('article')+'">媒体透视</a></li>\
                                    <li><a href="'+B_Jump._getUrl('atlas')+'">游戏图谱</a></li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li><span>关于我们</span>\
                            <div class="navbar-list"><i class="border-top"></i>\
                                <ul>\
                                    <li><a href="'+B_Jump._getUrl('company')+'">公司介绍</a></li>\
                                    <li><a href="'+B_Jump._getUrl('join')+'">加入我们</a></li>\
                                    <li><a href="'+B_Jump._getUrl('partner')+'">合作伙伴</a></li>\
                                </ul>\
                            </div>\
                        </li>\
                    </ul>\
                </div>\
                <div class="login-part fr">\
                    <ul>\
                        <li>\
                            <form method="get" action="'+B_Jump._getUrl('search')+'">\
                                <input type="text" name="k" placeholder="搜索游戏、游戏资讯">\
                                <button type="submit" class="search-icon"></button></form>\
                            </form>\
                        </li>\
                        <li>\
                            <button class="login-btn" id="bs_user_status"></button>\
                        </li>\
                        <li>\
                            <button class="reg-btn">查看DEMO</button>\
                        </li>\
                    </ul>\
                </div>\
            </div>';

        $('#NewheaderPart').html(str);
        S_User._formatStatus();
        this._getFoot();

        $('#NewheaderPart .reg-btn').click(function () {
            //B_Jump._go('base','demo.html#/operateBasic/');
            B_Jump._go('base','redirect.html?site=base&service=demoInner');
        });
        $('#NewheaderPart form').submit(function(){
            var keywords = $.trim($('#NewheaderPart input[name="k"]').val());
            if(keywords == ''){
                B_Pop._init('msg',{content:'搜索关键词必须填写,请确认！'});
                return false;
            }else{
                return true;
            }
        });

        $('.h-logo').click(function(){
            B_Jump._go('target','index');
        });
    },
    _getFoot:function(){
        var str = '\
            <div class="wrap">\
                <div class="fl">\
                    <ul>\
                        <li class="title">产品</li>\
                        <li><a href="'+B_Jump._getUrl('operation')+'">用户决策中心</a></li>\
                        <li><a href="'+B_Jump._getUrl('datacenter')+'">智能运营平台</a></li>\
                        <li><a href="'+B_Jump._getUrl('radar')+'">市场口碑监测</a></li>\
                    </ul>\
                    <ul>\
                        <li class="title">解决方案</li>\
                        <li><a href="'+B_Jump._getUrl('analysissolution')+'">精细化运营解决方案</a></li>\
                        <li><a href="'+B_Jump._getUrl('popluarsolution')+'">市场用研解决方案</a></li>\
                        <li><a href="'+B_Jump._getUrl('professional')+'">游戏专项咨询服务</a></li>\
                    </ul>\
                    <ul>\
                        <li class="title">数据洞察</li>\
                        <li><a href="'+B_Jump._getUrl('guide')+'">行业分析</a></li>\
                        <li><a href="'+B_Jump._getUrl('article')+'">媒体透视</a></li>\
                        <li><a href="'+B_Jump._getUrl('atlas')+'">游戏图谱</a></li>\
                    </ul>\
                    <ul>\
                        <li class="title">关于我们</li>\
                        <li><a href="'+B_Jump._getUrl('company')+'">公司介绍</a></li>\
                        <li><a href="'+B_Jump._getUrl('join')+'">加入我们</a></li>\
                        <li><a href="'+B_Jump._getUrl('partner')+'">合作伙伴</a></li>\
                    </ul>\
                </div>\
                <div class="fr">\
                    <img src="elements2.0/img/f-logo.png" alt="">\
                    <h3>数数信息科技（上海）有限公司</h3>\
                    <div class="code-wrap">\
                        <img src="elements2.0/img/code.jpg" alt="">\
                        <ul>\
                            <li onclick="B_Jump._go(\'openUrl\',\''+B_Common._qqUrl()+'\')"><img src="elements2.0/img/f-service.png" alt="">在线客服</li>\
                            <li><img src="elements2.0/img/f-email.png" alt="">service@thinkingdata.cn</li>\
                            <li><img src="elements2.0/img/f-address.png" alt="">上海市长宁区中山西路999号1203室</li>\
                        </ul>\
                    </div>\
                    <p>2015-2017 THINKINGGAME.CN 版权所有  <a href="http://www.miitbeian.gov.cn/" target="_blank">沪ICP备 15030552号</a></p>\
                </div>\
            </div>';
        $('#NewFooterPart').html(str);
    },
    _productHoverShow:function () {
        $(".hover-nav").hide();
        $(".product-hover-nav").hover(function() {
            $(".hover-nav").show();
        }, function() {
            $(".hover-nav").hide();
        })
        $(".hover-nav").hover(function() {
            $(".hover-nav").show();
        }, function() {
            $(".hover-nav").hide();
        });
        $('#headerPartProductPop .nav-list-hover').each(function (index) {
            $(this).hover(function () {
                $(this).addClass('hover-selected').siblings('.nav-list-hover').removeClass('hover-selected');
                $(this).find('.nav-hover-content').show();
                $(this).siblings('.nav-list-hover').find('.nav-hover-content').hide();
                var dom = $('#headerPartProductPop .tg-icon-side');

                $('#headerPartProductPop .tg-icon-side').each(function (iconIndex) {
                    switch(iconIndex+''){
                        case '0':
                            if(iconIndex == index){
                                $(this).css('background-position','0 -20px');
                            }else{
                                $(this).css('background-position','0 0');
                            }
                            break;
                        case '1':
                            if(iconIndex == index){
                                $(this).css('background-position','-20px -20px');
                            }else{
                                $(this).css('background-position','-20px 0');
                            }
                            break;
                        case '2':
                            if(iconIndex == index){
                                $(this).css('background-position','-40px -20px');
                            }else{
                                $(this).css('background-position','-40px 0');
                            }
                            break;
                        case '3':
                            if(iconIndex == index){
                                $(this).css('background-position','-60px -20px');
                            }else{
                                $(this).css('background-position','-60px 0');
                            }
                            break;
                        case '4':
                            if(iconIndex == index){
                                $(this).css('background-position','-80px -20px');
                            }else{
                                $(this).css('background-position','-80px 0');
                            }
                            break;
                    }
                });
            });
        });
    },
    _productHoverClick:function () {
        $('.tf-tab-change li').on('click', function() {
            var contentUrl = $(this).attr('href');
            $('.tf-tab-change li').removeClass('selected');
            $(this).addClass('selected');
            $('.content').css('display','none');
            $(contentUrl).css('display','block');
        });
    }
};
var S_User = {
    _goVisit:function (type) {
        if(B_User._isDemoUser()){
            B_Login._openLogin(type);
        }else{
            B_Jump._go('target',type);
        }
    },
    _freeCheck:function () {
        var cookie = B_Cookie._get('ApplicationAppInit');
        if(!!cookie && cookie == 1){
            if(!B_User._isDemoUser()){
                S_User._freeApp();
            }
            B_Cookie._del('ApplicationAppInit');
        }
    },
    _freeApp:function () {
        if(B_User._isDemoUser()){
            B_Login._openLogin();
            B_Cookie._set('ApplicationAppInit',1);
        }else{
            B_Port._ajax('userApplicationFree','post',true,null,function(){
                    B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
                },function(){
                    B_Pop._init('close');
                },function(data,msg){
                    B_Pop._init('msg',{content:'恭喜您获得六个月的免费使用特权，可直接在后台使用服务！'});
                },function(data,msg,code){
                    B_Pop._init('msg',{content:msg});
                }
            )
        }
    },
    _formatStatus:function(type){
        var dom = $('#bs_user_status');
        if(!B_User._isDemoUserStrict()){
            dom.text('控制台').click(function(){
                B_Jump._go('open','main');
            });
        }else{
            dom.text('进入控制台').click(function(){
                B_Jump._go('target','login');
            });
            if(type){
                switch(type){
                    case 'user':
                        if(B_User._isDemoUser()){
                            B_Jump._go('target','login');
                        }
                        break;
                }
            }
        }
    }
}
var S_Game = {
    _goRelation:function () {
        $('.bs_relation_app').each(function () {
            $(this).click(function () {
                var type = $(this).attr('data-t');
                if(B_User._isDemoUser()){
                    B_Login._openLogin(type);
                }else{
                    B_Jump._go('target',type);
                }
            });
        });
    },
    _chooseGame:function(dom,classifyDom,letterDom){
        var zone = dom;
        zone.html('');
        var letter = S_Game._letter(letterDom);
        var classify = B_Game._classify(classifyDom);
        var games = B_Login._user;
        if(!games.gas_projects){
            return false;
        }
        var games = games.gas_projects;
        var m = {};
        var founded = false;
        function hasLetterOrClassify(source,aim){
            for(var i=0; i<source.length; ++i){
                if(source[i] != ',' && aim.indexOf(source[i])>=0){
                    return true;
                }
            }
            return false;
        }
        for(var i=0; i<games.length; ++i){
            if(hasLetterOrClassify(classify, games[i].game_type) && hasLetterOrClassify(letter, games[i].pinyin)){
                founded = true;
                for(var k=0; k<games[i].pinyin.length; ++k){
                    if(games[i].pinyin[k]==","){
                        continue;
                    }else if(games[i].pinyin[k] in m){
                        m[games[i].pinyin[k]].push(games[i]);
                    }else{
                        m[games[i].pinyin[k]] = [games[i]];
                    }
                }
            }
        }
        var str = '';
        if(founded){
            for(var i=0; i<letter.length; ++i){
                if(letter[i] in m){
                    str += '<dl>';
                    str += '<dt>'+letter[i]+'</dt>';
                    for(var j=0; j<m[letter[i]].length; ++j){
                        var choose = m[letter[i]][j];
                        str += '<dd onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl("light")+'?g='+choose.project_id+'\')">'+choose.project_name+'</dd>';
                    }
                    str += '</dl><div class="clearfix"></div>';
                }
            }
        }else{
            str = B_Pre._empty('没有找到！');
        }
        zone.find('*').unbind().removeData();
        zone.html(str);
    },
    _letter:function(dom){
        var letter = dom.html();
        return (letter =='0-9') ? '0123456789' : letter;
    },
    _menuHotGame:function(index,limit){
        var postData = {};
        postData['index'] = index;
        postData['limit'] = limit;
        postData = B_Common._postData(postData);
        B_Port._ajax('hotGame','get',true,postData,function(){
                $('.h_qkList').html(B_Pre._loading());
            },function(){
                $('.h_qkList').html('');
            },function(data,msg){
                if(data && data.hot_project_list.length > 0){
                    var str = '';
                    var gameInfo = B_Game._getGame(data.hot_project_list);
                    if(gameInfo){
                        for(var i=0;i<data.hot_project_list.length;i++){
                            if(gameInfo[data.hot_project_list[i]]){
                                var key = data.hot_project_list[i];
                                var value = gameInfo[data.hot_project_list[i]];
                                var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                                var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                                str += '\
                                    <dl onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('light')+'?g='+key+'\')">\
                                        <img src="'+value[0]+'">\
                                        <dt title="'+value[1]+'">'+gameName+'</dt>\
                                        <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                                    </dl>';
                            }
                        }
                    }
                    $('.h_qkList').html(str);
                }
            },function(data,msg,code){
                $('.h_qkList').html(B_Pre._empty(msg));
            }
        )
    },
    _menuHistoryList:function(){
        B_Port._ajax('history','get',true,null,function(){
                $('#bs_history').html(B_Pre._loading());
            },function(){
                $('#bs_history').html('');
            },function(data,msg){
                if(data && data.project_list.length > 0){
                    var str = '';
                    var gameInfo = B_Game._getGame(data.project_list);
                    if(gameInfo){
                        for(var i=0;i<data.project_list.length;i++){
                            if(gameInfo[data.project_list[i]]){
                                var key = data.project_list[i];
                                var value = gameInfo[data.project_list[i]];
                                var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                                var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                                str += '\
                                    <dl onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('light')+'?k='+key+'\')">\
                                        <img src="'+value[0]+'">\
                                        <dt title="'+value[1]+'">'+gameName+'</dt>\
                                        <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                                    </dl>';
                            }
                        }
                    }
                    $('#bs_history').html(str);
                }
            },function(data,msg,code){
                $('#bs_history').html(B_Pre._empty(msg));
            }
        )
    },
    _menuGuessLikeList:function(index,limit){
        var postData = {};
        postData['project_id'] = B_Game._getLast('outsideGameDetail');
        postData = B_Common._postData(postData);
        B_Port._ajax('guessLike','get',true,postData,function(){
                $('#bs_favorite').html(B_Pre._loading());
            },function(){
                $('#bs_favorite').html('');
            },function(data,msg){
                if(data && data.get.length > 0){
                    var str = '';
                    var gameId = [];
                    for(var i=0;i<data.get.length;i++){
                        gameId.push(data.get[i].project_id);
                    }
                    var gameInfo = B_Game._getGame(gameId);
                    if(gameInfo){
                        $.each(gameInfo,function(key,value){
                            var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                            var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                            str += '\
                            <dl onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('light')+'?k='+key+'\')">\
                                <img src="'+value[0]+'">\
                                <dt title="'+value[1]+'">'+gameName+'</dt>\
                                <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                            </dl>';
                        });
                    }
                    $('#bs_favorite').html(str);
                }
            },function(data,msg,code){
                $('#bs_favorite').html(B_Pre._empty(msg));
            }
        )
    },
    _menuCollectList:function(){
        (!!B_Collects && B_Collects.length > 0) ? S_Game._htmlMenuCollectList(B_Collects) : S_Game._getCollect('menu');
    },
    _getCollect:function(type){
        if(B_User._isDemoUser())return;
        B_Port._ajax('collect_all','get',true,null,null,null,function(data,msg){
            B_Collects = (data && data.collection_list) ? data.collection_list : [];
            if(type){
                switch(type){
                    case 'menu':
                        S_Game._htmlMenuCollectList(B_Collects)
                        break;
                }
            }
        },function(data,msg,code){
            B_Collects = [];
        });
    },
    _htmlMenuCollectList:function(data){
        if(data){
            var str = '';
            var gameInfo = B_Game._getGame(data);
            if(gameInfo){
                $.each(gameInfo,function(key,value){
                    var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                    var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                    str += '\
                            <dl onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('light')+'?k='+key+'\')">\
                                <img src="'+value[0]+'">\
                                <dt title="'+value[1]+'">'+gameName+'</dt>\
                                <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                            </dl>';
                });
            }
            $('#bs_collect').html(str);
        }
    }
}
var S_Article = {
    _detailUrl:function (id) {
        return B_Jump._getUrl('detail')+'?t='+B_Common._encodeUrl(id);
    },
    _previewImg:function(img,type){
        if(img && img != ''){
            var previewArr = ['sfw','n178','youxiputao','youxicheng','wankr','n07073','candou','gametanzi'];
            if($.inArray(type,previewArr) > -1 || type.indexOf('公众号') >= 0){
                B_Common._imgBuff([img]);
            }
            return '<img src="'+img+'">';
        }else{
            return '<img src="elements2.0/img/article_no_img.jpg">';
        }
    },
    _init:function(type){
        var data = B_Login._user;
        switch(type){
            case 'classify':
                if(!(data && data.article_classify_dim)){
                    return [];
                }else{
                    return data.article_classify_dim;
                }
                break;
            case 'source':
                if(!(data && data.article_source_dim)){
                    return [];
                }else{
                    return data.article_source_dim;
                }
                break;
        }
    },
    _imgUrl:function(mainClass){
        switch(mainClass){
            case '公司':
                return {img:'elements2.0/img/mediarticle/company.png',color:'#9DBF5E',styleClass:'h_qkTb7',position:'article_icon_company'};
                break;
            case '前沿':
                return {img:'elements2.0/img/mediarticle/front.png',color:'#FDD644',styleClass:'h_qkTb9',position:'article_icon_leading'};
                break;
            case '研发':
                return {img:'elements2.0/img/mediarticle/research.png',color:'#FF895A',styleClass:'h_qkTb10',position:'article_icon_research'};
                break;
            case '行业':
                return {img:'elements2.0/img/mediarticle/indus.png',color:'#A9D443',styleClass:'h_qkTb8',position:'article_icon_industry'};
                break;
            case '电竞':
                return {img:'elements2.0/img/mediarticle/game.png',color:'#ff9800',styleClass:'h_qkTb5',position:'article_icon_game'};
                break;
            case '人物':
                return {img:'elements2.0/img/mediarticle/person.png',color:'#FDB040',styleClass:'h_qkTb6',position:'article_icon_people'};
                break;
            case '游戏':
                return {img:'elements2.0/img/mediarticle/other.png',color:'#FDB040',styleClass:'h_qkTb4',position:'article_icon_other'};
                break;
            default:
                return {img:'elements2.0/img/mediarticle/other.png',color:'#2da5df',styleClass:'h_qkTb11',position:'article_icon_other'};
                break;
        }
    },
    _getClassify:function(){
        var classify = S_Article._init('classify');
        var back = {};
        for(var i=0; i<classify.length; ++i){
            back[classify[i].main_class] = {img:S_Article._imgUrl(classify[i].main_class),sub:classify[i].sub_class_list};
        }
        back['游戏'] = {img:S_Article._imgUrl('游戏'),sub:[]};
        back['其他'] = {img:S_Article._imgUrl('其他'),sub:[]};
        return back;
    },
    _htmlList:function(data){
        var cStr = '';
        var tStr = '';
        $.each(data,function(key,value){
            var url = B_Jump._getUrl('article')+'?t=classify&m='+encodeURIComponent(key);
            cStr += '<dl onclick="B_Jump._go(\'base\',\''+url+'\')"><dt class="'+value.img.styleClass+' b_img"></dt><dd>'+key+'</dd></dl>';
            tStr += '<dl>';
            for(var d=0;d<value.sub.length;d++){
                tStr += '<dd onclick="B_Jump._go(\'base\',\''+url+'&s='+B_Common._encodeUrl(value.sub[d].sub_class)+'\')">'+value.sub[d].sub_class+'</dd>';
            }
            tStr += '</dl>';
        })
        return {main:cStr,sub:tStr}
    },
    _getSource:function(key){
        if(!!key){
            var source = S_Article._init('source');
            for(var i=0;i<source.length;i++){
                if(key == source[i].source){
                    return source[i].source_name;
                }
            }
        }
        return key;
    }
}

var S_Service = {
    _getData:function(){
        B_Port._ajax('itemList','get',true,null,function(){
                $('#bs_service_inside').html(B_Pre._loading('c_padding30'));
                $('#bs_service_outside').html(B_Pre._loading('c_padding30'));
                $('#bs_service_report').html(B_Pre._loading('c_padding30'));
            },function(){
                $('#bs_service_inside').html('');
                $('#bs_service_outside').html('');
                $('#bs_service_report').html('');
            },function(data,msg){
                if(data.item_map && !B_Common._checkObjectIsEmpty(data.item_map)){
                    if(data.item_map['游戏外数据服务']){
                        $('#bs_service_outside').html(S_Service._htmlItem(data.item_map['游戏外数据服务']));
                    }
                    if(data.item_map['游戏内数据服务']){
                        $('#bs_service_inside').html(S_Service._htmlItem(data.item_map['游戏内数据服务']));
                    }
                    if(data.item_map['深度定制分析报告']){
                        $('#bs_service_report').html(S_Service._htmlItem(data.item_map['深度定制分析报告']));
                    }
                }
            },function(data,msg,code){
                $('.bs_service_inside').html(B_Pre._empty(msg));
                $('.bs_service_outside').html(B_Pre._empty(msg));
                $('.bs_service_report').html(B_Pre._empty(msg));
            }
        )
    },
    _htmlItem:function(data){
        var  str = '';
        for(var i=0;i<data.length;i++){
            if(i>5)break;
            str += '<dl onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('item')+'?k='+data[i]['item_id']+'\')"><dt>'+data[i]['item_name']+'</dt><dd>'+data[i]['item_slogan']+'</dd></dl>';
        }
        return str;
    }
}
