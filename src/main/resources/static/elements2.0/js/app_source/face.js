var F_Face_Html = {
    _formatCompareData:function(dom,data){
        var chartDataPre = {xAxis:[],data:[],data2:[]};
        var data1 = [];
        var data2 = [];
        if(data.left.length < data.right.length){
            data1 = data.right;
            data2 = data.left;
        }else{
            data1 = data.left;
            data2 = data.right;
        }
        for(var i=0;i<data1.length;i++){
            $.each(data1[i],function(key,value){
                chartDataPre.xAxis.push(key);
                dom == 'chart_post_hour_compare' ? chartDataPre.data.push((value*100).toFixed(2)) : chartDataPre.data.push(value);
                chartDataPre.data2.push(0);
            })
        }
        for(var i=0;i<data2.length;i++){
            $.each(data2[i],function(key,value){
                var index = $.inArray(key,chartDataPre.xAxis);
                if(index > -1){
                    chartDataPre.data2[index] = (dom == 'chart_post_hour_compare' ? (value*100).toFixed(2) : value);
                }
            })
        }
        return chartDataPre;
    },
    _chartBar:function(name,dom,data){
        var chartDataPre = {xAxis:[],data:[],data2:[]};
        var chartData = {};
        chartData.tooltip = {trigger:'item'};
        chartData.legend = {};
        chartData.grid = {
            left: '10',
            right: '40',
            bottom: 0,
            top: '3%',
            containLabel: true
        };
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
                },
                type : 'category',
                data : chartDataPre.xAxis,
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
                }
            }
        ];
        switch(dom){
            case 'chart_tieba_age':
            case 'chart_fans_num':
                var total = 0;
                for(var i=0;i<data.length;i++){
                    for(var key in data[i]){
                        total += parseInt(data[i][key]);
                    }
                }
                for(var i=0;i<data.length;i++){
                    $.each(data[i],function(key,value){
                        chartDataPre.xAxis.push(key);
                        percent = total > 0 ? ((parseInt(value)/total)*100).toFixed(2) : 0;
                        chartDataPre.data.push(percent);
                    })
                }
                chartData.tooltip = {
                    trigger: 'item',
                    formatter : function (params){
                        return params.name+"<br>"+params.value+"%";
                    }
                }
                chartData.yAxis = [
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
                            formatter: '{value}% ',
                            textStyle:{
                                color:'#333333',
                                fontSize : '11px'
                            }
                        }
                    }
                ];
                break;
            case 'chart_tieba_age_compare':
            case 'chart_fans_num_compare':
            case 'game_compare_chart_tieba_age_compare':
            case 'game_compare_chart_fans_num_compare':
                chartData.color = ['#72C4FF','#AEDD8C'];
                chartData.legend = {
                    left: 'right',
                    data:[{name:name[0],icon: 'circle'},{name:name[1],icon: 'circle'}]
                }
                chartData.grid = {
                    left: '10',
                    right: '40',
                    bottom: 0,
                    top: '10%',
                    containLabel: true
                }
                var total1 = 0;
                var total2 = 0;
                for(var i=0;i<data.left.length;i++){
                    for(var key in data.left[i]){
                        total1 += parseInt(data.left[i][key]);
                    }
                }
                for(var i=0;i<data.right.length;i++){
                    for(var key in data.right[i]){
                        total2 += parseInt(data.right[i][key]);
                    }
                }
                var percent = 0;
                for(var i=0;i<data.left.length;i++){
                    percent = 0;
                    for(var key in data.left[i]){
                        percent = ((parseInt(data.left[i][key])/total1)*100).toFixed(2);
                        data.left[i][key] = percent;
                    }
                }
                for(var i=0;i<data.right.length;i++){
                    percent = 0;
                    for(var key in data.right[i]){
                        percent = ((parseInt(data.right[i][key])/total2)*100).toFixed(2);
                        data.right[i][key] = percent;
                    }
                }
                chartDataPre = F_Face_Html._formatCompareData(dom,data);

                chartData.tooltip = {
                    trigger: 'item',
                    formatter : function (params){
                        return params.name+"<br>"+params.value+"%";
                    }
                },
                    chartData.xAxis = [
                        {
                            splitLine : {
                                show:false
                            },
                            type : 'category',
                            data : chartDataPre.xAxis,
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
                                },
                                interval:'0'
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
                        type : 'value',
                        axisLine:{
                            show : false
                        },
                        axisTick:{
                            show : false
                        },
                        axisLabel:{
                            formatter: '{value}% ',
                            textStyle:{
                                color:'#333333',
                                fontSize : '11px'
                            }
                        }
                    }
                ];
                break;
        }
        if(chartDataPre.data2.length > 0){
            chartData.series = [
                {
                    barMaxWidth:30,
                    type: 'bar',
                    name:name[0],
                    data:chartDataPre.data
                },
                {
                    barMaxWidth:30,
                    type: 'bar',
                    name:name[1],
                    data:chartDataPre.data2
                }
            ];
        }else{
            chartData.series = [
                {
                    barMaxWidth:30,
                    type: 'bar',
                    name: '数量',
                    data: chartDataPre.data
                }
            ];
        }
        B_Chart._getEChart('line',dom,chartData);
    },
    _chartLine:function(name,dom,data){
        var chartDataPre = {xAxis:[],data:[],data2:[]};
        var chartData = {};
        chartData.tooltip = {trigger:'axis'};
        chartData.grid = {
            left: '10',
            right: '40',
            bottom: 0,
            top: '3%',
            containLabel: true
        };
        switch(dom){
            case 'chart_hot_value':
            case 'chart_title_num':
            case 'chart_content_num':
            case 'chart_be_replied':
                for(var i=0;i<data.length;i++){
                    $.each(data[i],function(key,value){
                        chartDataPre.xAxis.push(key);
                        chartDataPre.data.push(value);
                    })
                }
                break;
            case 'chart_post_hour':
                for(var i=0;i<data.length;i++){
                    $.each(data[i],function(key,value){
                        chartDataPre.xAxis.push(key);
                        chartDataPre.data.push((value*100).toFixed(2));
                    })
                }
                break;
            case 'chart_title_num_compare':
            case 'chart_content_num_compare':
            case 'chart_be_replied_compare':
            case 'chart_post_hour_compare':
            case 'game_compare_chart_title_num_compare':
            case 'game_compare_chart_content_num_compare':
            case 'game_compare_chart_be_replied_compare':
            case 'game_compare_chart_post_hour_compare':
                chartData.color = ['#72C4FF','#AEDD8C'];
                chartData.legend = {
                    left: 'right',
                    data:[{name:name[0],icon: 'circle'},{name:name[1],icon: 'circle'}]
                }
                chartData.grid = {
                    left: '10',
                    right: '40',
                    bottom: 0,
                    top: '10%',
                    containLabel: true
                }
                chartDataPre = F_Face_Html._formatCompareData(dom,data);
                break;
        }
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
                },
                type : 'category',
                boundaryGap : false,
                data : chartDataPre.xAxis,
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
                    },
                    formatter: function (value, index) {
                        return B_Date._dateChart(value);
                    }
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
                type : 'value',
                nameLocation : 'middle',
                nameTextStyle : {
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
                nameGap:25,
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
                }
            }
        ];
        switch(dom){
            case 'chart_post_hour':
            case 'chart_post_hour_compare':
            case 'game_compare_chart_post_hour_compare':
                chartData.xAxis[0].axisLabel.formatter = null;
                chartData.yAxis[0].axisLabel.formatter = '{value}%';
                break;
        }
        switch(dom){
            case 'chart_post_hour':
                var tooltipStr = '';
                var color = ['#AEDD8C','#72C4FF'];
                tooltipStr += '{b}<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+color[0]+'"></span>{a}: {c}%<br />';
                chartData.tooltip.formatter = tooltipStr;
                break;
            case 'chart_post_hour_compare':
                var tooltipStr = '{b}<br>';
                var color = ['#72C4FF','#AEDD8C'];
                for(var i=0;i<2;i++) {
                    tooltipStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + color[i] + '"></span>{a'+i+'}: {c'+i+'}%<br />';
                }
                chartData.tooltip.formatter = tooltipStr;
                break;
        }
        if(chartDataPre.data2.length > 0){
            chartData.series = [
                {
                    name:name[0],
                    symbol:'roundRect',
                    symbolSize:4,
                    type:'line',
                    data:chartDataPre.data
                },
                {
                    name:name[1],
                    symbol:'roundRect',
                    symbolSize:4,
                    type:'line',
                    data:chartDataPre.data2
                }
            ];
        }else{
            chartData.series = [
                {
                    name:name,
                    symbol:'roundRect',
                    symbolSize:4,
                    type:'line',
                    data:chartDataPre.data
                }
            ];
        }
        B_Chart._getEChart('line',dom,chartData);
    },
    _chartMap:function(dom,domList,data){
        if(data && data.length > 0){
            var provinceData = [];
            var bigNumber = 0;
            var str = '';
            for(var i=0;i<data.length;i++){
                $.each(data[i],function(key,value){
                    var number = (value*100).toFixed(1);
                    provinceData.push({name:key,value:number});
                    if(parseFloat(number) > parseFloat(bigNumber))bigNumber = number;
                    if(i < 5){
                        str += F_Face_Html._htmlChart(i,key,number);
                    }
                });
            }
            $('#'+domList).html(str);
            bigNumber = Math.ceil(bigNumber);
            var chartData = {};
            chartData.tooltip = {trigger:'item'};
            chartData.legend = null;
            chartData.visualMap = {
                min: 0,
                max:bigNumber,
                left: 'right',
                top: 'bottom',
                text: ['高(%)','低(%)'],
                calculable: true,
                color:['#51c7ef','#91cfe4','#dde7ea']
            }
            chartData.series = [
                {
                    name: '地域分布(%)',
                    type: 'map',
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
                    data:provinceData
                }
            ];
            B_Chart._getEChart('map',dom,chartData);
        }
    },
    _htmlList:function(index,dom,data){
        if(data && typeof(data) != "undefined"){
            var str = '<table class="tg-table-face table">';
            str += '<thead>';
            str += '<tr><th>关注贴吧</th><th>玩家占比</th><th>关注人数</th></tr>';
            str += '</thead><tbody>';
            var total = 0;
            var percent = 0;
            for(var i=0;i<data.length;i++){
                $.each(data[i],function(key,value){
                    total += parseInt(value);
                })
            }
            for(var i=0;i<data.length;i++){
                $.each(data[i],function(key,value){
                    if(total > 0)percent = ((parseInt(value)/total)*100).toFixed(1);
                    str += F_Face_Html._htmlListFormat(index,i,key,percent,value);
                });
            }
            str += '</tbody>';
            str += '</table>';
            dom.html(str);
        }
    },
    _htmlListFormat:function(from,index,name,percent,number){
        var str = '';
        str += '<tr><td title="'+name+'"><b>'+(index+1)+'</b>'+name+'</td><td>'+percent+'%</td><td>'+number+'</td></tr>';
        return str;
    },
    _htmlChart:function(index,name,percent){
        var str = '<dl>';
        index += 1;
        if(index == 1){
            str += '<dt class="py_colorg py_mplist20">#</dt><dt class="py_colorg py_mplist40">地域</dt><dt class="py_colorg py_mplist40">占比</dt>';
        }
        if(index == 5){
            str += '<dd class="py_colorg py_rkltbdnone py_mplist20">'+index+'</dd>';
            str += '<dd class="py_mplist40 py_rkltbdnone">'+name+'</dd>';
            str += '<dd class="py_mplist40 py_rkltbdnone">'+percent+'%</dd>';
        }else{
            str += '<dd class="py_colorg py_mplist20">'+index+'</dd>';
            str += '<dd class="py_mplist40">'+name+'</dd>';
            str += '<dd class="py_mplist40">'+percent+'%</dd>';
        }
        str += '</dl>';
        return str;
    },
    _htmlLine:function(dom,data){
        var color = ['line-a','line-b','line-c','line-d','line-e','line-f','line-g'];
        if(data && typeof(data) != "undefined"){
            var total = 0;
            var percent = 0;
            var str = '';
            for(var d=0;d<data.length;d++){
                $.each(data[d],function(key,value){
                    total += parseInt(value);
                });
            }
            for(var d=0;d<data.length;d++){
                $.each(data[d],function(key,value){
                    percent = total == 0 ? 0.0 : ((parseInt(value)/total)*100).toFixed(1);
                    str += '<ul class="contrast-list single-list">';
                    str += '<li class="word-des">'+key+'</li><li class="percent"><span>'+percent+'%</span></li>';
                    str += '<li class="des">共'+value+'人关注</li>';
                    str += '<li class="line">';
                    str += '<div class="line-bg fl">';
                    percent = parseFloat(percent)*2;
                    percent =  percent > 100 ? 100 : percent;
                    str += '<div class="right-percent '+color[d]+'" style="width: '+percent+'%"></div>';
                    str += '</div></li></ul>';
                });
            }
            dom.html(str);
        }
    },
    _htmlGender:function (data) {
        var str = '';
        if(data && data.length > 0){
            var total = 0;
            var male = 0;
            var female = 0;
            var maleHeight = 0;
            var femaleHeight = 0;

            for(var i=0;i<data.length;i++){
                $.each(data[i],function(key,value){
                    switch(key){
                        case '男':
                            male = parseInt(value);
                            break;
                        case '女':
                            female = parseInt(value);
                            break;
                    }
                })
            };
            total = male+female;
            if(total > 0){
                male = ((male/total)*100).toFixed(0);
                female = 100-male;

                maleHeight = 200*(male/100);
                femaleHeight = 200*(female/100);
            }
            str += '<ul>';
            str += '<li class="man">';
            str += '<div class="color" style="height:'+maleHeight+'px"></div>';
            str += '<p>男性玩家</p>';
            str += '<i class="graph-icon"></i>';
            str += '<b>'+male+'%</b>';
            str += '<span>占全部玩家的</span>';
            str += '<li class="woman">';
            str += '<div class="color" style="height:'+femaleHeight+'px"></div>';
            str += '<p>女性玩家</p>';
            str += '<i class="graph-icon"></i>';
            str += '<b>'+female+'%</b>';
            str += '<span>占全部玩家的</span>';
            str += '</li>';
            str += '</ul>';

        }
        return str;
    }

}
var F_Face_Common = {
    _cache:{
        'data':{
            '1':{'refresh':false,'game_id':0,'open':'quick','choose':'全用户','last_choose':'','posted':'','buff':''},
            '2':{'refresh':false,'game_id':0,'open':'quick','choose':'全用户','last_choose':'','posted':'','buff':''},
            '3':{'refresh':false,'game_id':0,'open':'quick','choose':'全用户','last_choose':'','posted':'','buff':''}
        }
    },
    _init:{influence:['高号召','中号召','低号召'],active:['高活跃','中活跃','低活跃']},
    _tagsGroup:[
        ['活跃度','active_class'],
        ['号召力','influence_level'],
        ['关注类目','interest_classify'],
        ['个人魅力','charm_level'],
        ['付费能力','pay_ability'],
        ['发言偏好','post_quality'],
        ['生命周期','game_lifecycle'],
        ['抱怨程度','complain_level'],
        ['吧务','op_type'],
        ['地域','province']
    ],
    _tags:[
        ['高活跃','中活跃','低活跃'],
        ['高号召','中号召','低号召'],
        ['追星','影视','体育','音乐','动漫','文学','科技'],
        ['高魅力','中魅力','低魅力'],
        ['高付费'],
        ['高质用户','普通用户','灌水用户','垃圾用户'],
        ['新手玩家','轻度玩家','重度玩家','流失玩家','回归玩家'],
        ['从不抱怨','经常抱怨','偶尔抱怨'],
        ['吧务'],
        ['广东','江苏','北京','上海','浙江','山东','四川','福建','河南','辽宁','河北','安徽','陕西','湖南','天津','重庆','黑龙江','广西','山西','江西','吉林','云南','贵州','内蒙古','甘肃','新疆','宁夏','海南','台湾','西藏','香港','澳门','青海','湖北']
    ],
    _tagsHot:[
        ['全用户',''],
        ['高活跃','active_class'],
        ['高号召','influence_level'],
        ['高付费','pay_ability'],
        ['高魅力','charm_level'],
        ['经常抱怨','complain_level'],
        ['高质用户','post_quality'],
        ['垃圾用户','post_quality'],
        ['普通用户','post_quality'],
        ['新手玩家','game_lifecycle'],
        ['流失玩家','game_lifecycle'],
        ['重度玩家','game_lifecycle'],
        ['北京','province'],
        ['上海','province'],
        ['江苏','province'],
        ['浙江','province'],
        ['广东','province'],
        ['河南','province'],
        ['河北','province'],
        ['山东','province']
    ],
    _openTags:function(type,dom){
        B_Pop._init('close');
        var choosedValue = F_Face_Common._cache.data[dom].choose;
        switch(type){
            case 'quick':
                var content = '<div class="py_layer b_borderRadius py_bgff"><div class="py_lyarea"><div class="py_lytitle"><h4>快速标签</h4><b onclick="B_Pop._init(\'close\');">╳</b></div><div class="py_lyfew">';
                $.each(F_Face_Common._tagsHot,function(i,value){
                    content += '<button data-name="'+value[1]+'"';
                    if(choosedValue == value[0])content += ' class="btnhover"';
                    content += '>'+value[0]+'</button>';
                });
                content += '</div><div class="clearfix"></div><div class="py_lycheck"><button class="py_lylinkbtn b_borderRadius" onclick="F_Face_Common._openTags(\'detail\',\''+dom+'\')">展开详细标签</button> <button class="py_lycheckbtn b_borderRadius" onclick="F_Face_Common._checkTags(\'quick\',\''+dom+'\')">确定</button></div></div></div>';
                B_Pop._init('open',{
                    type: 1,
                    shift:2,
                    title: false,
                    closeBtn: false,
                    shadeClose: false,
                    area: ['auto', 'auto'],
                    content: content
                });
                $('.py_lyfew button').click(function(){
                    $(this).addClass('btnhover').siblings().removeClass('btnhover').end();
                });
                break;
            case 'detail':
                var content = '<div class="py_layer b_borderRadius py_bgff"><div class="py_lyarea"><div class="py_lytitle"><h4>详细标签</h4><b onclick="B_Pop._init(\'close\');">╳</b></div><div class="py_lymore">';
                var choosedCity = '';
                $.each(F_Face_Common._tagsGroup,function(i,value){
                    content += '<dl';
                    switch(i){
                        default:
                            content += ' class="py_auto"';
                            content += '><dt>'+value[0]+'</dt>';
                            $.each(F_Face_Common._tags[i],function(i2,value2){
                                content += '<dd><input type="checkbox" name="'+value[1]+'" value="'+value2+'"';
                                if(choosedValue.indexOf(value2)>-1)content += ' checked'
                                content += '>　'+value2+'</dd>';
                            });
                            break;
                        case 9:
                            content += '><dt>'+value[0]+'</dt>';
                            content += '<dd><div class="py_select b_borderRadius">';
                            content += '<div class="py_selarea"><span name="'+value[1]+'">不限制</span><i></i></div>';
                            content += '<ul>';
                            content += '<li>不限制</li>';
                            $.each(F_Face_Common._tags[i],function(i2,value2){
                                content += '<li>'+value2+'</li>';
                                if(choosedValue.indexOf(value2)>-1)choosedCity = value2;
                            });
                            content += '</ul>';
                            content += '</div></dd>';
                            break;
                    }
                    content += '</dl>';
                });
                content += '</div><div class="py_clear"></div><div class="py_lycheck"><button class="py_lylinkbtn b_borderRadius" onclick="F_Face_Common._openTags(\'quick\',\''+dom+'\')">返回快捷标签</button> <button class="py_lycheckbtn b_borderRadius" onclick="F_Face_Common._checkTags(\'detail\',\''+dom+'\')">确定</button></div></div></div>';
                B_Pop._init('open',{
                    type: 1,
                    shift:2,
                    title: false,
                    closeBtn: false,
                    shadeClose: false,
                    area: ['auto', 'auto'],
                    content: content
                });
                if(choosedCity != ''){
                    $('.py_selarea span').html(choosedCity);
                }

                $('.py_lymore input[type=checkbox]').each(function(){
                    $(this).click(function () {
                        F_Face_Common._isCheckedTag($(this).attr('name'),$(this).val());
                    });
                });

                $('.py_selarea').click(function(){
                    if($('.py_select ul').is(':visible')){
                        $('.py_select ul').hide();
                    }else{
                        $('.py_select ul').show();
                    }
                });
                $('.py_select ul li').click(function(){
                    var val = $(this).html();
                    $('.py_select span').html(val);
                    $('.py_select ul').hide();
                });
                break;
        }
        return;
    },
    _isCheckedTag:function(name,value){
        $('.py_lymore input[type=checkbox][name="'+name+'"]').each(function(){
            var val = $(this).val();
            if(val != value){
                $(this).prop("checked",false);
            }
        });
    },
    _checkTags:function(type,dom){
        var choosed = '';
        var posted = '';
        switch(type){
            case 'quick':
                $('.py_lyfew button').each(function(){
                    if($(this).hasClass('btnhover')){
                        choosed = $(this).text();
                        posted = $(this).attr('data-name')+'='+$(this).text();
                    }
                });
                break;
            case 'detail':
                var choosedArr = [];
                var postedArr = [];
                var num = 0;
                $.each(F_Face_Common._tagsGroup,function(i,value){
                    switch(i){
                        default:
                            $('.py_lymore input[type=checkbox][name="'+value[1]+'"]').each(function(){
                                if($(this).prop("checked")==true){
                                    choosedArr[num] = $(this).val();
                                    postedArr[num] = value[1]+'='+$(this).val();
                                    num++;
                                }
                            });
                            break;
                        case 9:
                            var val= $('.py_selarea span').html();
                            if(!(val == '不限制' || val == '')){
                                choosedArr[num] = val;
                                postedArr[num] = value[1]+'='+val;
                                num++;
                            }
                            break;
                    }
                });
                if(choosedArr.length > 0){
                    choosed = choosedArr.join(',');
                    posted = postedArr.join(',');
                }
                break;
        }
        if(choosed == ''){
            B_Pop._init('msg',{content:'您尚未选择任何标签，请选择'});
            return false;
        }else{
            B_Pop._init('close');

            $('#changeTagZone'+dom+' span').html(choosed).attr('title',choosed);

            F_Face_Common._cache.data[dom].open = type;
            F_Face_Common._cache.data[dom].choose = choosed;
            F_Face_Common._cache.data[dom].posted = posted;

            switch(dom+''){
                case '1':
                    F_FaceDetail_Info._getUnion(dom);
                    break;
                case '2':
                case '3':
                    F_FaceCompare_Info._getUnion(dom);
                    break;
            }


        }
    },
    _changeTagOpen:function(dom){
        F_Face_Common._openTags(F_Face_Common._cache.data[dom].open,dom);
    },
    _postData:function(dom){
        var data = {};
        var tagInput = '';
        tagInput = F_Face_Common._cache.data[dom].choose;
        switch(dom+''){
            case '3':
                data.project_id = M_Init._gameIdRight;
                break;
            default:
                data.project_id = M_Init._gameDetailId;
                break;
        }
        var tagOld = F_Face_Common._cache.data[dom].last_choose;
        if((data.project_id == F_Face_Common._cache.data[dom].game_id) && (tagOld != '' && tagInput == tagOld)){
            return false;
        }else{
            F_Face_Common._cache.data[dom].last_choose = tagInput;
            F_Face_Common._cache.data[dom].game_id = data.project_id;
            var tagPost = F_Face_Common._cache.data[dom].posted;
            if(tagPost != ''){
                var tagPostArr = [];
                tagPostArr = tagPost.split(",");
                if(tagPostArr.length > 0){
                    $.each(tagPostArr,function(i,value){
                        var tagPostValueArr = [];
                        tagPostValueArr = value.split("=");
                        if(tagPostValueArr.length > 0){
                            if(tagPostValueArr[0] != '')data[tagPostValueArr[0]] = tagPostValueArr[1];
                        }
                    });
                }
            }
        }
        data = B_Common._postData(data);
        return data;
    }
}
