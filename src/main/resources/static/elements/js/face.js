$(function () {
    G_Login._check();
    U_Dom._menu('1-4-1');
    G_Login._status('user');
    var $_GET = getUrl('query');
    G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('face');
    G_GameId_Compare =  demoProjectId();
    G_Game._setLast(G_GameId,'face');
    U_Service._checkStatus('face');
    U_Common._tabChoose('face',$('.mr_h_tab ul li'),'liOn',$('.tabcontent'),$('.py_choose'));
    $('#changeTagZone1').click(function(){
        F_Common._changeTagOpen(1);
    });
    $('#changeTagZone2').click(function(){
        F_Common._changeTagOpen(2);
    });
    $('#changeTagZone3').click(function(){
        F_Common._changeTagOpen(3);
    });
    $('#changeTagZone4').click(function(){
        F_Common._changeTagOpen(4);
    });
});
var F_Custom = {
    _buff:{data:{}},
    _getInfo:function(index,postData){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        var cacheName = '';
        switch(index+''){
            case '5':
                cacheName = $('#changeTag4').html();
                cacheName += '_'+G_GameId_Compare;
                break;
            default:
                cacheName = $('#changeTag'+index).html();
                break;
        }
        if(F_Custom._buff.data){
            var data = '';
            $.each(F_Custom._buff.data,function(key,value){
                if(value[0] == cacheName){
                    data = value[1];
                }
            })
            if(data != ''){
                F_Common._postDataSave(index);
                F_Tag._setInfo(index,data);
                return false;
            }
        }
        setTimeout(function(){
            G_Port._ajax('faceProfileCustomer','post',true,postData,null,function(){
                G_Pop._init('close');
            },function(data,msg){
                F_Common._postDataSave(index);
                F_Custom._buff.data[index] = [cacheName,data];
                F_Tag._setInfo(index,data);
            },function(data,msg,code){
                G_Pop._init('msg',{content:msg});
            });
        },300);
    }
}
var F_Base = {
    _getName:function(){
        var gameInfo = G_Game._getGame([G_GameId],1);
        if(gameInfo){
            $(".mr_hf_logo img").attr("src",gameInfo[G_GameId][0]);
            $(".mr_hf_logo p").html(gameInfo[G_GameId][1]);
        }
    },
    _getInfo:function(){
        G_Port._ajax('faceProfileGlobal','get',true,'project_id='+G_GameId,function(){
                G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
            },function(){
                G_Pop._init('close');
            },function(data,msg){
                //$('#num_total').html(data.total_num);
                if(data.total_num){
                    $('#str_sex').html(F_Html._htmlGender(data.sex_distri));
                    $('#num_complain').html(data.complain_num);
                    $('#num_high_charm').html(data.high_charm_num);
                    $('#num_high_pay').html(data.high_pay_num);
                    $('#num_trash').html(data.trash_num);
                    $('#num_lost').html(data.lost_num);
                    if(data.total_num > 0)$('#num_complain_percent').html(((data.complain_num/data.total_num)*100).toFixed(1)+'%');
                    F_Html._chartScatter('pycomplain',data.complain_rate_distri);
                    F_Html._chartMap('pymap',$('#pymaplist'),data.province_distri);
                    F_Html._chartPie('influence','callupon',data.influence_distri);
                    F_Html._chartPie('active','dynamic',data.active_distri);
                    F_Html._htmlPie('influence',$('#influencelist'),data.influence_be_replied_distri);
                    F_Html._htmlPie('active',$('#activelist'),data.active_post_distri);
                    F_Html._htmlLine(null,$('#str_interest'),data.interest_distri);
                }else{
                    G_Pop._init('msg',{content:'当前游戏数据源较少'});
                }
            },function(data,msg,code){
                G_Pop._init('msg',{content:msg});
            }
        )
    }
}
var F_Tag = {
    _getCompareName:function(){
        var tagInput2 = $('#changeTag2').html();
        var tagInput3 = $('#changeTag3').html();
        if(tagInput2.length > 6)tagInput2 = tagInput2.substr(0,6)+'.';
        if(tagInput3.length > 6)tagInput3 = tagInput3.substr(0,6)+'.';
        if(tagInput2 == tagInput3){
            tagInput2 += '-左';
            tagInput3 += '-右';
        }
        return [tagInput2,tagInput3];
    },
    _getCompareGameName:function(){
        var gameNameLeft = G_Game._name(G_GameId);
        var gameNameRight = G_Game._name(G_GameId_Compare);
        if(gameNameLeft.length > 6)gameNameLeft = gameNameLeft.substr(0,6)+'.';
        if(gameNameRight.length > 6)gameNameRight = gameNameRight.substr(0,6)+'.';
        if(gameNameLeft == gameNameRight){
            gameNameLeft += '-左';
            gameNameRight += '-右';
        }
        return [gameNameLeft,gameNameRight];
    },
    _getInfo:function(index,gameId){
        if(index+'' == '5' && gameId && gameId != G_GameId_Compare){
            G_GameId_Compare = gameId;
            $('#changeOld5').val('');
        }
        var postData = F_Common._postData(index);
        if(!postData){
            return false;
        }else{
            F_Custom._getInfo(index,postData);
        }
    },
    _setInfo:function(index,data){
        switch(index+''){
            case '1':
                F_Html._htmlList(index,$('#str_attention_forum'),data.attention_forum_distri);
                F_Html._htmlList(index,$('#str_attention_game'),data.attention_game_forum_distri);
                F_Html._htmlLine('link',$('#str_interest2'),data.interest_classify_distri);
                F_Html._chartLine('活跃用户数','chart_hot_value',data.hot_value_distri);
                F_Html._chartLine('主帖发言量','chart_title_num',data.title_num_distri);
                F_Html._chartLine('回复帖发言量','chart_content_num',data.content_num_distri);
                F_Html._chartLine('发言响应量','chart_be_replied',data.be_replied_num_distri);
                F_Html._chartLine('百分比','chart_post_hour',data.post_hour_distri);
                F_Html._chartBar('吧龄分布','chart_tieba_age',data.tieba_age_distri);
                F_Html._chartBar('粉丝魅力','chart_fans_num',data.fans_num_distri);
                $('#str_sex2').html(F_Html._htmlGender(data.sex_distri));
                F_Html._chartMap('pymap2',$('#pymaplist2'),data.province_distri);
                break;
            case '2':
            case '3':
                switch(index+''){
                    case '2':
                        F_Custom._buff.dataLeft = data;
                        break;
                    case '3':
                        F_Custom._buff.dataRight = data;
                        break;
                }
                if(F_Custom._buff.dataLeft && F_Custom._buff.dataRight){
                    var compareName = F_Tag._getCompareName();
                    F_Html._htmlList(2,$('#str_attention_forum_left'),F_Custom._buff.dataLeft.attention_forum_distri);
                    F_Html._htmlList(3,$('#str_attention_forum_right'),F_Custom._buff.dataRight.attention_forum_distri);
                    F_Html._htmlList(2,$('#str_attention_game_left'),F_Custom._buff.dataLeft.attention_game_forum_distri);
                    F_Html._htmlList(3,$('#str_attention_game_right'),F_Custom._buff.dataRight.attention_game_forum_distri);
                    F_Tag._interestingFormat($('#str_interestcompare'),F_Custom._buff.dataLeft.interest_classify_distri,F_Custom._buff.dataRight.interest_classify_distri);
                    F_Tag._genderFormat($('#str_sexcompare'),F_Custom._buff.dataLeft.sex_distri,F_Custom._buff.dataRight.sex_distri);
                    F_Html._chartLine(compareName,'chart_title_num_compare',{left:F_Custom._buff.dataLeft.title_num_distri,right:F_Custom._buff.dataRight.title_num_distri});
                    F_Html._chartLine(compareName,'chart_content_num_compare',{left:F_Custom._buff.dataLeft.content_num_distri,right:F_Custom._buff.dataRight.content_num_distri});
                    F_Html._chartLine(compareName,'chart_be_replied_compare',{left:F_Custom._buff.dataLeft.be_replied_num_distri,right:F_Custom._buff.dataRight.be_replied_num_distri});
                    F_Html._chartLine(compareName,'chart_post_hour_compare',{left:F_Custom._buff.dataLeft.post_hour_distri,right:F_Custom._buff.dataRight.post_hour_distri});
                    F_Html._chartBar(compareName,'chart_tieba_age_compare',{left:F_Custom._buff.dataLeft.tieba_age_distri,right:F_Custom._buff.dataRight.tieba_age_distri});
                    F_Html._chartBar(compareName,'chart_fans_num_compare',{left:F_Custom._buff.dataLeft.fans_num_distri,right:F_Custom._buff.dataRight.fans_num_distri});
                }
                break;
            case '4':
            case '5':
                switch(index+''){
                    case '4':
                        F_Custom._buff.dataGameLeft = data;
                        break;
                    case '5':
                        F_Custom._buff.dataGameRight = data;
                        break;
                }
                if(F_Custom._buff.dataGameLeft && F_Custom._buff.dataGameRight){
                    var compareName = F_Tag._getCompareGameName();
                    F_Html._htmlList(2,$('#game_compare_str_attention_forum_left'),F_Custom._buff.dataGameLeft.attention_forum_distri);
                    F_Html._htmlList(3,$('#game_compare_str_attention_forum_right'),F_Custom._buff.dataGameRight.attention_forum_distri);
                    F_Html._htmlList(2,$('#game_compare_str_attention_game_left'),F_Custom._buff.dataGameLeft.attention_game_forum_distri);
                    F_Html._htmlList(3,$('#game_compare_str_attention_game_right'),F_Custom._buff.dataGameRight.attention_game_forum_distri);
                    F_Tag._interestingFormat($('#game_compare_str_interestcompare'),F_Custom._buff.dataGameLeft.interest_classify_distri,F_Custom._buff.dataGameRight.interest_classify_distri);
                    F_Tag._genderFormat($('#game_compare_str_sexcompare'),F_Custom._buff.dataGameLeft.sex_distri,F_Custom._buff.dataGameRight.sex_distri);
                    F_Html._chartLine(compareName,'game_compare_chart_title_num_compare',{left:F_Custom._buff.dataGameLeft.title_num_distri,right:F_Custom._buff.dataGameRight.title_num_distri});
                    F_Html._chartLine(compareName,'game_compare_chart_content_num_compare',{left:F_Custom._buff.dataGameLeft.content_num_distri,right:F_Custom._buff.dataGameRight.content_num_distri});
                    F_Html._chartLine(compareName,'game_compare_chart_be_replied_compare',{left:F_Custom._buff.dataGameLeft.be_replied_num_distri,right:F_Custom._buff.dataGameRight.be_replied_num_distri});
                    F_Html._chartLine(compareName,'game_compare_chart_post_hour_compare',{left:F_Custom._buff.dataGameLeft.post_hour_distri,right:F_Custom._buff.dataGameRight.post_hour_distri});
                    F_Html._chartBar(compareName,'game_compare_chart_tieba_age_compare',{left:F_Custom._buff.dataGameLeft.tieba_age_distri,right:F_Custom._buff.dataGameRight.tieba_age_distri});
                    F_Html._chartBar(compareName,'game_compare_chart_fans_num_compare',{left:F_Custom._buff.dataGameLeft.fans_num_distri,right:F_Custom._buff.dataGameRight.fans_num_distri});
                }
                break;
        }
        G_Pop._init('close');
    },
    _interestingFormat:function(dom,dataLeft,dataRight){
        var str = '';
        var allData = [];
        var total1 = 0;
        var total2 = 0;
        var percent1 = 0;
        var percent2 = 0;
        var value1 = '';
        var value2 = '';
        var i = 0;
        var interest1 = {};
        var interest2 = {};

        for(var i=0;i<dataLeft.length;i++){
            $.each(dataLeft[i],function(key,value){
                interest1[key] = value;
            })
        }
        for(var i=0;i<dataRight.length;i++){
            $.each(dataRight[i],function(key,value){
                interest2[key] = value;
            })
        }
        $.each(interest1,function(key,value){
            if($.inArray(key,allData) < 0){
                allData.push(key);
            }
            total1 += parseInt(value);
        });
        $.each(interest2,function(key,value){
            if($.inArray(key,allData) < 0){
                allData.push(key);
            }
            total2 += parseInt(value);
        });
        $.each(allData,function(key,value){
            if((typeof(interest1[value]) == "undefined")){
                value1 = 0;
                percent1 = 0.0;
            }else{
                value1 = interest1[value];
                if(total1 == 0){
                    percent1 = 0.0;
                }else{
                    percent1 = ((parseInt(value1)/total1)*100).toFixed(1);
                }
            }
            if((typeof(interest2[value]) == "undefined")){
                value2 = 0;
                percent2 = 0.0;
            }else{
                value2 = interest2[value];
                if(total2 == 0){
                    percent2 = 0.0;
                }else{
                    percent2 = ((parseInt(value2)/total2)*100).toFixed(1);
                }
            }
            str += F_Html._htmlLineCompare(value,percent1,percent2,value1,value2);
            i++;
        });
        dom.html(str);
    },
    _genderFormat:function(dom,dataLeft,dataRight){
        var str = '';
        var sex1 = {};
        var sex2 = {};
        var total1 = 0;
        var total2 = 0;
        var male1 = 0;
        var male2 = 0;
        var female1 = 0;
        var female2 = 0;

        for(var i=0;i<dataLeft.length;i++){
            $.each(dataLeft[i],function(key,value){
                sex1[key] = value;
            })
        }
        for(var i=0;i<dataRight.length;i++){
            $.each(dataRight[i],function(key,value){
                sex2[key] = value;
            })
        }

        $.each(sex1,function(key,value){
            switch(key){
                case '男':
                    male1 = parseInt(value);
                    break;
                case '女':
                    female1 = parseInt(value);
                    break;
            }
        });
        $.each(sex2,function(key,value){
            switch(key){
                case '男':
                    male2 = parseInt(value);
                    break;
                case '女':
                    female2 = parseInt(value);
                    break;
            }
        });
        total1 = male1+female1;
        if(total1 > 0){
            male1 = ((male1/total1)*100).toFixed(0);
            female1 = 100-male1;
        }
        total2 = male2+female2;
        if(total2 > 0){
            male2 = ((male2/total2)*100).toFixed(0);
            female2 = 100-male2;
        }
        str += F_Html._htmlGenderCompare(male1,female1,male2,female2);

        dom.html(str);
    }
}
var F_Html = {
    _htmlLineCompare:function(key,percent1,percent2,value1,value2){
        var color1 = 'py_wdblue';
        var color2 = 'py_wdyellow';
        var str = '';
        str += '<div class="py_word">';
        str += '<div class="py_wdleft py_floatl">'+value1+'<span class="py_colorg"> ('+percent1+'%)</span></div>';
        str += '<div class="py_wdname py_floatl">'+key+'</div>';
        str += '<div class="py_wdright py_floatr"><span class="py_colorg">('+percent2+'%) </span>'+value2+'</div>';
        str += '<div class="py_clear"></div>';
        str += '</div>';
        percent1 = parseFloat(percent1)*2;
        if(percent1 > 100)percent1 = 100;
        percent2 = parseFloat(percent2)*2;
        if(percent2 > 100)percent2 = 100;
        str += '<div class="py_lineleft py_wdline py_floatl">';
        str += '<div class="py_wlleft py_floatl"></div>';
        str += '<span class="'+color1+'" style="width: '+percent1+'%"></span>';
        str += '</div>';
        str += '<div class="py_lineright py_wdline py_floatl">';
        str += '<div class="py_wlleft py_floatl"></div>';
        str += '<span class="'+color2+'" style="width: '+percent2+'%"></span>';
        str += '</div>';
        str += '<div class="py_clear"></div>';

        return str;
    },
    _htmlGenderCompare:function(male1,female1,male2,female2){
        var str = '';
        str += '<i class="py_cphmman ma"></i>';
        str += '<div class="py_hmshow py_floatl">';
        str += '<div class="py_hmline1 py_radiusl py_hmbg1" style="width:'+male1+'%"></div><span style="right:'+(parseInt(male1)+2)+'%">'+male1+'%</span>';
        str += '</div>';
        str += '<div class="py_hmshow py_floatl">';
        str += '<div class="py_hmline2 py_radiusr py_hmbg2" style="width:'+male2+'% "></div><span style="left:'+(parseInt(male2)+2)+'%">'+male2+'%</span>';
        str += '</div>';
        str += '<div class="py_clear"></div>';
        str += '<i class="py_cphmfemale ma"></i>';
        str += '<div class="py_hmshow py_floatl">';
        str += '<div class="py_hmline1 py_radiusl py_hmbg3" style="width:'+female1+'% "></div><span style="right:'+(parseInt(female1)+2)+'%">'+female1+'%</span>';
        str += '</div>';
        str += '<div class="py_hmshow py_floatl">';
        str += '<div class="py_hmline2 py_radiusr py_hmbg4" style="width:'+female2+'% "></div><span style="left:'+(parseInt(female2)+2)+'%">'+female2+'%</span>';
        str += '</div>';
        str += '<div class="py_clear"></div>';

        return str;
    },
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
            left: 0,
            right: 0,
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
                        color:'#C2C2C2',
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
                        color:'#C2C2C2',
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
                                color:'#C2C2C2',
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
                chartData.color = ['#65ABCF','#D9C16B'];
                chartData.legend = {
                    left: 'right',
                    data:[{name:name[0],icon: 'circle'},{name:name[1],icon: 'circle'}]
                }
                chartData.grid = {
                    left: 0,
                    right: 0,
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
                chartDataPre = F_Html._formatCompareData(dom,data);

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
                                color:'#C2C2C2',
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
                                color:'#C2C2C2',
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
        getEChart('line',dom,chartData);
    },
    _chartLine:function(name,dom,data){
        var chartDataPre = {xAxis:[],data:[],data2:[]};
        var chartData = {};
        chartData.tooltip = {trigger:'axis'};
        chartData.grid = {
            left: 0,
            right: 0,
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
                chartData.color = ['#65ABCF','#D9C16B'];
                chartData.legend = {
                    left: 'right',
                    data:[{name:name[0],icon: 'circle'},{name:name[1],icon: 'circle'}]
                }
                chartData.grid = {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: '10%',
                    containLabel: true
                }
                chartDataPre = F_Html._formatCompareData(dom,data);
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
                        color:'#C2C2C2',
                        fontSize : '11px'
                    },
                    formatter: function (value, index) {
                        return G_Date._dateChart(value);
                    }
                }
            }
        ];
        switch(dom){
            case 'chart_post_hour':
            case 'chart_post_hour_compare':
            case 'game_compare_chart_post_hour_compare':
                chartData.xAxis[0].axisLabel.formatter = null;
                break;
        }
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
                        color:'#C2C2C2',
                        fontSize : '11px'
                    }
                }
            }
        ];
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
        getEChart('line',dom,chartData);
    },
    _htmlList:function(index,dom,data){
        var str = '';
        if(data && typeof(data) != "undefined"){
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
                    str += F_Html._htmlListFormat(index,i,key,percent,value);
                });
            }
            dom.html(str);
        }
    },
    _htmlListFormat:function(from,index,name,percent,number){
        var str = '';
        index += 1;
        switch(from+''){
            case '1':
                if(index == 1){
                    str += '<dt class="py_colorg py_tblist10">#</dt><dt class="py_colorg py_tblist50">贴吧</dt><dt class="py_colorg py_tblist40">数量</dt>';
                }
                if(index == 10){
                    str += '<dd class="py_colorg py_rkltbdnone py_tblist10">'+index+'</dd>';
                    str += '<dd class="py_tblist50 py_rkltbdnone">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                    str += '<dd class="py_tblist40 py_rkltbdnone">'+number+'</dd>';
                }else{
                    str += '<dd class="py_colorg py_tblist10">';
                    str +=  index < 4 ? '<span class="py_rankimg py_rank'+index+'"></span>' : index;
                    str += '</dd>';
                    str += '<dd class="py_tblist50">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                    str += '<dd class="py_tblist40">'+number+'</dd>';
                }
                break;
            case '2':
            case '3':
            case '4':
            case '5':
                if(index == 1){
                    str += '<dt class="py_colorg py_cplist10">#</dt><dt class="py_colorg py_cplist60">贴吧</dt><dt class="py_colorg py_cplist30">数量</dt>';
                }
                if(index == 10){
                    str += '<dd class="py_colorg py_rkltbdnone py_cplist10">'+index+'</dd>';
                    str += '<dd class="py_cplist60 py_rkltbdnone">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                    str += '<dd class="py_cplist30 py_rkltbdnone">'+number+'</dd>';
                }else{
                    str += '<dd class="py_colorg py_cplist10';
                    if(index < 4){
                        str += ' py_colorr';
                    }
                    str += '">'+index+'</dd>';
                    str += '<dd class="py_cplist60">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                    str += '<dd class="py_cplist30">'+number+'</dd>';
                }
                break;
        }
        return str;
    },
    _htmlLine:function(type,dom,data){
        var color = ['py_wdblue','py_wdgreen','py_wdyellow','py_wdred','py_wdviolet','py_wdgrape','py_wdpink'];
        if(data && typeof(data) != "undefined"){
            var total = 0;
            var percent = 0;
            var i = 0;
            var str = '';
            for(var d=0;d<data.length;d++){
                $.each(data[d],function(key,value){
                    total += parseInt(value);
                });
            }
            for(var d=0;d<data.length;d++){
                $.each(data[d],function(key,value){
                    percent = total == 0 ? 0.0 : ((parseInt(value)/total)*100).toFixed(1);
                    str += '<div class="py_word"';
                    /*
                    switch(type){
                        case 'link':
                            str += 'onmouseover="U_Dom._tip(this,\'想查看各分类的\',\'link\');"';
                            break;
                    }
                    */
                    str += '>';
                    str += '<div class="py_wname py_floatl">'+key+' <span class="py_colorg"> ('+percent+'%)</span></div>';
                    str += '<div class="py_wnumber py_floatr">'+value+'</div>';
                    str += '<div class="py_clear"></div>';
                    str += '</div>';
                    str += '<div class="py_wdline">';
                    percent = parseFloat(percent)*2;
                    percent =  percent > 100 ? 100 : percent;
                    str += '<span class="'+color[i]+'" style="width: '+percent+'%"></span>';
                    str += '</div>';
                });
                i++;
            }
            dom.html(str);
        }
    },
    _chartScatter:function(dom,data){
        var format = [];
        var mark = {name:'',data:''};
        var max = 0;
        $.each(data,function(key,value){
            value.complain_rate = (parseFloat(value.complain_rate)*100).toFixed(0);
            var arr = [value.rank,value.complain_rate];
            format.push(arr);
            if(parseInt(value.complain_rate) > parseInt(max))max = value.complain_rate;
            if(parseInt(G_GameId) == parseInt(key)){
                value.rank_rate = (parseFloat(value.rank_rate)*100).toFixed(0);
                if(value.rank_rate == 0)value.rank_rate = 1;
                $('#num_active_percent').html(value.rank_rate+'%');
                mark.name = G_Game._name(G_GameId)+'\r\n活跃度前'+value.rank_rate+'%'+'\r\n抱怨'+value.complain_rate+'%';
                mark.data = arr;
            }
        });
        if(max != 0){
            max = (max*2).toFixed(0);
            var number = max%10;
            if(number != 0)max -= number;
            if(max>100 && max<120)max = 120;
        }
        var chartData = {};
        chartData.grid = {
            top: '3%',
            left: '1%',
            right: '5%',
            bottom: '1%',
            containLabel: true
        },
        chartData.tooltip = {
            trigger:'item',
            formatter : function (params){
                return '抱怨程度：'+params.value[1]+'%';
            }
        };
        chartData.legend = null;
        chartData.xAxis = [
            {
                type : 'value',
                scale:true,
                axisLine:{
                    show : false
                },
                axisLabel : {
                    show : false
                },
                splitLine: {
                    show : false
                }
            }
        ],
        chartData.yAxis = [
            {
                max:max,
                type : 'value',
                scale:true,
                axisLine:{
                    show : false
                },
                axisLabel : {
                    formatter: '{value}% '
                }
            }
        ]
        chartData.series = [
            {
                type:'scatter',
                symbolSize:5,
                data: format,
                lineStyle :{
                    color : '#B2D5E8'
                },
                markPoint: {
                    data: [
                        {
                            coord: mark.data,
                            symbol:'pin',
                            symbolSize:120,
                            label: {
                                normal: {
                                    show: true,
                                    formatter: mark.name
                                }
                            }
                        }
                    ]
                }
            }
        ];
        getEChart('scatter',dom,chartData);
    },
    _chartPie:function(type,dom,data){
        if(data && data.length >0){
            var color = '';
            var format = [];
            switch(type){
                case 'influence':
                    format = [{value:0, name:'低号召'},{value:0, name:'中号召'},{value:0, name:'高号召'}];
                    color = ['#DEE2E7','#77BFE5','#5093B7'];
                    break;
                case 'active':
                    format = [{value:0, name:'低活跃'},{value:0, name:'中活跃'},{value:0, name:'高活跃'}];
                    color = ['#DEE2E7','#42C7B7','#1A9385'];
                    break;
            }
            var total = 0;
            for(var i=0;i<data.length;i++){
                $.each(data[i],function(key,value){
                    if(key.indexOf('高') > -1){
                        format[2].value = value;
                    }
                    if(key.indexOf('中') > -1){
                        format[1].value = value;
                    }
                    if(key.indexOf('低') > -1){
                        format[0].value = value;
                    }
                    //format.push({value:value, name:key});
                    total += value;
                })
            }
            if(total > 0){
                for(var i=0;i<format.length;i++){
                    format[i].name += '\r\n('+((format[i].value/total)*100).toFixed(1)+'%)';
                }
            }
            var chartData = {};
            chartData.tooltip = {
                trigger:'item',
                formatter: "{b} {c}<br>点击可查看详情"
            };
            chartData.legend = null;
            chartData.color = color;
            chartData.series = [
                {
                    hoverAnimation :false,
                    type: 'pie',
                    radius : '45%',
                    center: ['50%', '50%'],
                    data:format,
                    labelLine: {
                        normal: {
                            length:15,
                            length2:1
                        }
                    }
                }
            ];
            getEChart('pie',dom,chartData);
        }
    },
    _htmlPie:function(type,dom,data){
        var format = {};
        if(data && data.length >0){
            for(var i=0;i<data.length;i++){
                $.each(data[i],function(key,value){
                    format[key] = value;
                })
            }
        }
        var str = '';
        var info = '';
        var init = [];
        switch(type){
            case 'influence':
                init = F_Common._init.influence;
                str += '<div class="py_piemenu py_icon tab_influence">';
                for(var i=0;i<init.length;i++){
                    str += '<span>';
                    switch(i){
                        case 0:
                            str += '<i class="py_pih_h"></i>';
                            break;
                        case 1:
                            str += '<i class="py_pih_m"></i>';
                            break;
                        case 2:
                            str += '<i class="py_pih_l"></i>';
                            break;
                    }
                    str += init[i]+'</span> ';

                    info += '<div class="py_pidetail py_margt30 py_influence py_influence'+i;
                    info += i==0 ? '' : ' py_hidden' ;
                    info += '">';
                    info += '<p class="py_font20">帖均'+(format[init[i]] ? format[init[i]].toFixed(2) : 0)+'回复</p>';
                    info += '<p class="py_pdlh">'+init[i]+'用户</p>';
                    info += i==0 ? '<p class="py_colorg">他们对舆论导向作用明显</p>' : '';
                    info += '</div>';
                }
                break;
            case 'active':
                init = F_Common._init.active;
                str += '<div class="py_piemenu py_icon tab_active">';
                for(var i=0;i<init.length;i++){
                    str += '<span>';
                    switch(i){
                        case 0:
                            str += '<i class="py_piy_h"></i>';
                            break;
                        case 1:
                            str += '<i class="py_piy_m"></i>';
                            break;
                        case 2:
                            str += '<i class="py_piy_l"></i>';
                            break;
                    }
                    str += init[i]+'</span> ';

                    info += '<div class="py_pidetail py_margt30 py_active py_active'+i;
                    info += i==0 ? '' : ' py_hidden' ;
                    info += '">';
                    info += '<p class="py_font20">月均'+(format[init[i]] ? format[init[i]].toFixed(2) : 0)+'发言</p>';
                    info += '<p class="py_pdlh">'+init[i]+'用户</p>';
                    info += i==0 ? '<p class="py_colorg">他们直接影响游戏人气</p>' : '';
                    info += '</div>';
                }
                break;
        }
        str += '</div>';
        str += info;
        dom.html(str);
        switch(type){
            case 'influence':
                U_Common._tabChoose('base',$('.tab_influence span'),null,$('.py_influence'));
                break;
            case 'active':
                U_Common._tabChoose('base',$('.tab_active span'),null,$('.py_active'));
                break;
        }

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
                        str += F_Html._htmlChart(i,key,number);
                    }
                });
            }
            domList.html(str);
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
            getEChart('map',dom,chartData);
        }
    },
    _htmlChart:function(index,name,percent){
        var str = '';
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
        return str;
    },
    _htmlGender:function(data){
        var str = '';
        if(data && data.length > 0){
            var total = 0;
            var male = 0;
            var female = 0;
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
            }
            str += '<div class="py_rtarea">';
            str += '<div class="py_rtlist py_floatl py_rtboderr">';
            str += '<i class="py_rtimg py_rtmale"></i>';
            str += '<span class="py_margt40" id="sex_male">'+male+'%</span>';
            str += '</div>';
            str += '<div class="py_rtlist py_floatl">';
            str += '<i class="py_rtimg py_rtfemale"></i>';
            str += '<span class="py_margt40" id="sex_female">'+female+'%</span>';
            str += '</div>';
            str += '<div class="py_clear"></div>';
            str += '</div>';
            str += '<div class="py_clear"></div>';
            str += '<div class="py_rtline py_margt40">';
            str += '<div class="py_rtblue py_radiusl" style="width: '+male+'%"></div>';
            str += '</div>';
        }
        return str;
    }
}
var F_Common = {
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
        G_Pop._init('close');
        var choosedValue = $('#changeTag'+dom).html();
        switch(type){
            case 'quick':
                var content = '<div class="py_layer py_radius py_bgff"><div class="py_lyarea"><div class="py_lytitle"><h4>快速标签</h4><b onclick="G_Pop._init(\'close\');">╳</b></div><div class="py_lyfew">';
                $.each(F_Common._tagsHot,function(i,value){
                    content += '<button data-name="'+value[1]+'"';
                    if(choosedValue == value[0])content += ' class="btnhover"';
                    content += '>'+value[0]+'</button>';
                });
                content += '</div><div class="py_clear"></div><div class="py_lycheck"><button class="py_lylinkbtn py_radius" onclick="F_Common._openTags(\'detail\',\''+dom+'\')">展开详细标签</button> <button class="py_lycheckbtn py_radius" onclick="F_Common._checkTags(\'quick\',\''+dom+'\')">确定</button></div></div></div>';
                G_Pop._init('open',{
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
                var content = '<div class="py_layer py_radius py_bgff"><div class="py_lyarea"><div class="py_lytitle"><h4>详细标签</h4><b onclick="G_Pop._init(\'close\');">╳</b></div><div class="py_lymore">';
                var choosedCity = '';
                $.each(F_Common._tagsGroup,function(i,value){
                    content += '<dl';
                    switch(i){
                        default:
                            content += ' class="py_auto"';
                            content += '><dt>'+value[0]+'</dt>';
                            $.each(F_Common._tags[i],function(i2,value2){
                                content += '<dd><input type="checkbox" name="'+value[1]+'" value="'+value2+'"';
                                if(choosedValue.indexOf(value2)>-1)content += ' checked'
                                content += '>　'+value2+'</dd>';
                            });
                            break;
                        case 9:
                            content += '><dt>'+value[0]+'</dt>';
                            content += '<dd><div class="py_select py_radius">';
                            content += '<div class="py_selarea"><span name="'+value[1]+'">不限制</span><i></i></div>';
                            content += '<ul>';
                            content += '<li>不限制</li>';
                            $.each(F_Common._tags[i],function(i2,value2){
                                content += '<li>'+value2+'</li>';
                                if(choosedValue.indexOf(value2)>-1)choosedCity = value2;
                            });
                            content += '</ul>';
                            content += '</div></dd>';
                            break;
                    }
                    content += '</dl>';
                });
                content += '</div><div class="py_clear"></div><div class="py_lycheck"><button class="py_lylinkbtn py_radius" onclick="F_Common._openTags(\'quick\',\''+dom+'\')">返回快捷标签</button> <button class="py_lycheckbtn py_radius" onclick="F_Common._checkTags(\'detail\',\''+dom+'\')">确定</button></div></div></div>';
                G_Pop._init('open',{
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
                $('input').iCheck({
                    checkboxClass: 'icheckbox_flat-aero',
                    radioClass: 'iradio_flat-aero'
                });
                $('input').on('ifChecked', function(event){
                    F_Common._isCheckedTag(event.target.name,event.target.value);
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
                $(this).iCheck('uncheck');
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
                $.each(F_Common._tagsGroup,function(i,value){
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
            G_Pop._init('msg',{content:'您尚未选择任何标签，请选择'});
            return false;
        }else{
            G_Pop._init('close');
            $('#btnChoosed'+dom).val(type);
            $('#changeTag'+dom).html(choosed).attr('title',choosed);
            $('#changePost'+dom).val(posted);

            F_Tag._getInfo(dom);
            switch(dom+''){
                case '4':
                    $('#changeTag5').html(choosed).attr('title',choosed);
                    $('#changePost5').val(posted);
                    setTimeout(function(){
                        F_Tag._getInfo(5);
                    },600);
                    break;
            }
        }
    },
    _changeTagOpen:function(dom){
        var open = $('#btnChoosed'+dom).val();
        F_Common._openTags(open,dom);
    },
    _openDetail:function(val,field,dom){
        GoToTop();
        switch(dom){
            case 1:
                $('#changePost1').val(field+'='+val);
                $('#changeTag1').html(val);
                $('.mr_h_tab li').eq(1).addClass('liOn');
                $('.mr_h_tab li').eq(1).siblings('li').removeClass('liOn');
                F_Tag._getInfo(1);
                break;
            case 3:
                G_Pop._init('close');
                break;
        }
        $('.py_tab').eq(dom).removeClass('py_taboff').addClass('py_tabon').siblings().removeClass('py_tabon').addClass('py_taboff').end();
        $('.tabcontent').eq(dom).show().siblings('.tabcontent').hide();
        $('.py_choose').eq(dom).show().siblings('.py_choose').hide();
    },
    _postData:function(dom){
        var data = {};
        var tagInput = '';
        switch(dom+''){
            case '5':
                tagInput = $('#changeTag4').html();
                data.project_id = G_GameId_Compare;
                break;
            default:
                tagInput = $('#changeTag'+dom).html();
                data.project_id = G_GameId;
                break;
        }
        var tagOld = $('#changeOld'+dom).val();
        if(tagInput == tagOld){
            return false;
        }else{
            var tagPost = $('#changePost'+dom).val();
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
        return data;
    },
    _postDataSave:function(dom){
        var tagInput = '';
        switch(dom+''){
            case '5':
                tagInput = $('#changeTag4').html();
                break;
            default:
                tagInput = $('#changeTag'+dom).html();
                break;
        }
        $('#changeOld'+dom).val(tagInput);
        switch(dom+''){
            case '4':
                tagInput = G_Game._name(G_GameId);
                break;
            case '5':
                tagInput = G_Game._name(G_GameId_Compare);
                break;
        }
        var tagInputSplit = tagInput.length > 6 ? tagInput.substr(0,6)+'.' : tagInput;
        switch(dom+''){
            case '2':
                for(var i=1;i<=4;i++){
                    $('#leftNotice'+i).html(tagInputSplit).attr('title',tagInput);
                }
                break;
            case '3':
                for(var i=1;i<=4;i++){
                    $('#rightNotice'+i).html(tagInputSplit).attr('title',tagInput);
                }
                break;
            case '4':
                for(var i=1;i<=4;i++){
                    $('#gameCompareLeftNotice'+i).html(tagInputSplit).attr('title',tagInput);
                }
                break;
            case '5':
                for(var i=1;i<=4;i++){
                    $('#gameCompareRightNotice'+i).html(tagInputSplit).attr('title',tagInput);
                }
                break;
        }
    }
}
