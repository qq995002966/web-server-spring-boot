var F_Date = '';
var F_SubType = '';
var F_MainType = '';
$(function () {
    G_Login._check();
    var $_GET = getUrl('query');
    if(!G_Common._isInner()){
        U_Dom._menu('1-1-1');
        G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('suddenly');
        if($_GET.date && $_GET.sub_type && $_GET.main_type){
            F_Date = G_Common._decodeUrl($_GET.date);
            F_SubType = G_Common._decodeUrl($_GET.sub_type);
            F_MainType = G_Common._decodeUrl($_GET.main_type);
        }
        G_Game._setLast(G_GameId,'suddenly');
        U_Service._checkStatus('suddenly');
        F_Base._getMail();
        $('.sd_chart_title button').click(function(){
            F_Common._openAdd();
        });
    }else{
        if(!($_GET.g && !isNaN($_GET.g))){
            G_Pop._init('msg',{'content':'选择的数据不存在，请刷新页面重试'});
            return false;
        }else{
            if(parent.F_Base._buff.mailData){
                init_name = parent.F_Base._buff.mailData.task_name;
                init_mail = parent.F_Base._buff.mailData.email_addr;
                init_type = parent.F_Base._buff.mailData.lt_warn_class;
                int_level = parent.F_Base._buff.mailData.warn_level;
                int_status = parent.F_Base._buff.mailData.status;
                if(int_level > 5)int_level = 5;
            }else{
                var init_name = '';
                var init_mail = '';
                var init_keyword = '';
                var init_type = '开发,活动,版本';
                var int_level = 3;
                var int_status = 1;
            }
        }
        $('input[name="email_title"]').val(init_name);
        $('input[name="email_addr"]').val(init_mail);
        $('#bs_choose_type').html(F_Common._formatType(init_type));
        $('#bs_choose_level').html(F_Common._formatLevel(int_level));
        $('.bs_level_choose li a').each(function(){
            $(this).click(function(){
                $('.bs_level span').attr('data-t',$(this).attr('data-t')).text($(this).text());
            });
        });
        $('input[name="status"]').each(function(){
            $(this).val() == int_status+'' ? $(this).attr("checked",true) : $(this).attr("checked",false);
        });
        $('#suddenly_s input').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });

        $('.bs_quit').click(function(){
            parent.G_Pop._init('close');
        });
        $('.btn-info').click(function(){
            var task_name = $.trim($('input[name="email_title"]').val());
            var email_addrs = $.trim($('input[name="email_addr"]').val());
            var email_addr = [];
            var warn_level = $.trim($('.bs_level span').attr('data-t'));
            var lt_warn_class = checkboxVal('type');
            var status = radioVal('status');
            if(lt_warn_class == ''){
                G_Pop._init('msg',{'content':'请选择预警类型'});
                return false;
            }
            if(task_name == ''){
                G_Pop._init('msg',{'content':'请填写任务名称'});
                return false;
            }
            if(email_addrs == ''){
                G_Pop._init('msg',{'content':'请填写接收邮箱'});
                return false;
            }else{
                var hasEmailFalse = false;
                email_addrs = email_addrs.split(' ');
                for(var i=0;i<email_addrs.length;i++){
                    if(email_addrs[i] != ''){
                        G_Common._isMail(email_addrs[i]) ? email_addr.push(email_addrs[i]) : hasEmailFalse=true;
                    }
                }
                if(hasEmailFalse){
                    G_Pop._init('msg',{'content':'请填写合法的接收邮箱'});
                    return false;
                }
            }
            email_addr = email_addrs.join(' ');
            var data = 'email_addr='+email_addr+'&task_name='+task_name+'&status='+status+'&lt_warn_class='+lt_warn_class+'&warn_level='+warn_level+'&project_id='+$_GET.g;
            G_Port._ajax('sigmaItWarnMailSet','post',true,data,function(){
                    btnStatus('post','disable',$('.btn-info'));
                    $('.btn-default').attr('disabled',true);
                },function(){
                    btnStatus('post','normal',$('.btn-info'));
                    $('.btn-default').attr('disabled',false);
                },
                function(data, msg){
                    G_Pop._init('msg',{'content':'设置成功'});
                    parent.F_Base._getMail();
                    setTimeout(function(){
                        parent.G_Pop._init('close');
                    },1000);
                    return false;
                },
                function(data, msg, code){
                    G_Pop._init('msg',{'content':msg});
                    return false;
                }
            )
        });
    }
    G_Login._status('user');
});

var F_Base = {
    _getFromChartClick:function(date,classify){
        var index = $.inArray(classify,F_Common._init.type);
        if(index > -1){
            var classifyId = F_Common._init.typeId[index];
            if(F_Base._buff.chartData && F_Base._buff.chartData[classifyId]){
                var data = F_Base._buff.chartData[classifyId];
                var firstWord = {date:'',word:'',classify:'',level:0};
                for(var i=0;i<data.length;i++){
                    if(date == data[i].data_date){
                        firstWord.date = data[i].data_date;
                        firstWord.word = data[i].sub_type;
                        firstWord.level = data[i].warn_level > 6 ? 6 : Math.ceil(data[i].warn_level);
                        firstWord.classify = classify+'类问题';
                        break;
                    }
                }
                if(firstWord.date != ''){
                    U_List._postData.type = 'suddenly';
                    U_List._postData.classify = firstWord.classify;
                    U_List._postData.level = F_Common._init.power[firstWord.level];
                    U_List._postData.data = {data_date:firstWord.date,sub_type:firstWord.word}
                    U_List._getList(1);
                }
            }
        }
    },
    _getMail:function(){
        G_Port._ajax('sigmaItWarnMailGet','get',true,'project_id='+G_GameId,null,null,function(data,msg){
                if(data && data.task_name){
                    F_Base._buff.mailData = data;
                }
            },null
        )
    },
    _buff:{},
    _getInfo:function(){
        G_Port._ajax('sigmaItWarn','get',true,'project_id='+G_GameId,function(){
                G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
            },function(){
                G_Pop._init('close');
            },function(data,msg){
                if(data && data.develop){
                    F_Base._buff.chartData = data;
                    var chartDataPre = {xAxis:[],series:{},legend:[]};
                    var firstWord = {date:'',word:'',classify:'',level:0};
                    var d = 1;
                    $.each(data,function(key,value){
                        var currentName = '';
                        var index = $.inArray(key,F_Common._init.typeId);
                        if(index > -1){
                            currentName = F_Common._init.type[index];
                        }
                        chartDataPre.legend.push(currentName);
                        chartDataPre.series[currentName] = [];
                        for(var i=0;i<value.length;i++){
                            if(value[i].warn_level > 0){
                                firstWord.date = value[i].data_date;
                                firstWord.word = value[i].sub_type;
                                firstWord.level = value[i].warn_level > 6 ? 6 : Math.ceil(value[i].warn_level);
                                firstWord.classify = currentName+'类问题';
                            }
                            if(d == 1)chartDataPre.xAxis.push(value[i].data_date);
                            if(value[i].warn_level > 6)value[i].warn_level = 6;
                            chartDataPre.series[currentName].push(value[i].warn_level);
                        }
                        d++;
                    })
                    F_Base._chartInfo(chartDataPre);

                    if(F_Date != ''){
                        firstWord = {date:F_Date,word:F_SubType,classify:F_MainType+'类问题',level:0};
                    }
                    if(firstWord.word == ''){
                        $('.data-content-left').html(G_Pre._empty('当前时间段该类问题舆情正常，无需警戒'));
                    }else{
                        U_List._postData.type = 'suddenly';
                        U_List._postData.classify = firstWord.classify;
                        U_List._postData.level = F_Common._init.power[firstWord.level];
                        U_List._postData.data = {data_date:firstWord.date,sub_type:firstWord.word}
                        U_List._getList(1);
                    }
                }
            },function(data,msg,code){
                G_Pop._init('msg',{content:msg});
            }
        )
    },
    _chartInfo:function(chartDataPre){
        if(chartDataPre && chartDataPre.xAxis){
            var chartData = {series:[]};
            var i = 1;
            $.each(chartDataPre.series,function(key,value){
                chartData.series.push({
                    lineStyle:{
                        normal:{
                            width:2
                        }
                    },
                    smooth:true,
                    symbol:'roundRect',
                    symbolSize:8,
                    name:key,
                    type:'line',
                    data:value
                });
            });
            chartData.tooltip = {trigger:'axis'};
            chartData.legend = {
                itemGap:15,
                itemWidth:12,
                itemHeight:12,
                top :'bottom',
                align:'left',
                data:chartDataPre.legend,
                textStyle:{
                    fontSize:12
                }
            };
            chartData.grid = {
                left: '2%',
                right: '2%',
                bottom: '8%',
                top: '5%',
                containLabel: true
            };
            chartData.xAxis = [
                {
                    splitLine : {
                        show : false
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
                        formatter: function (value, index) {
                            return G_Date._hourChart(value);
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
                    name : null,
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
                        },
                        formatter:function(value, index){
                            var yName = index > 0 ? index == 6 ? '高危预警' : F_Common._init.power[index] : '';
                            return yName;
                        }
                    },
                    min:0,
                    max:6
                }
            ];
            getEChart('line','bs_suddenly_chart',chartData);
        }
    }
}

var F_Common = {
    _init:{'type':['开发','活动','版本'],'typeId':['develop','activity','version'],'power':['白色预警','灰色预警','蓝色预警','黄色预警','橙色预警','红色预警']},
    _openAdd:function(){
        G_Pop._init('close');
        G_Pop._init('open',{'type':2,'scroll':true,'title':'邮件设置','width':'630px','height':'430px','shift':2,'content':'suddenly_s.html?g='+G_GameId},'');
    },
    _formatType:function(data){
        var str = '';
        data = data ? data.split(','):[];
        for(var i=0;i<F_Common._init.type.length;i++){
            str += '<input type="checkbox" name="type"';
            str += $.inArray(F_Common._init.type[i]+'',data) > -1 ? ' checked ' : '';
            str += 'value="'+F_Common._init.type[i]+'"> '+F_Common._init.type[i]+'类预警　';
        }
        return str;
    },
    _formatLevel:function(data){
        var str = '<div class="dropdown">';
        str += '<button class="btn btn-default dropdown-toggle bs_level" type="button" id="typeChoose" data-toggle="dropdown" aria-expanded="true"><span data-t="'+data+'">'+F_Common._init.power[data]+'</span>　<i class="caret"></i></button>';
        str += '<ul class="dropdown-menu bs_level_choose" aria-labelledby="typeChoose">';
        for(var i=1;i<F_Common._init.power.length;i++){
            str += '<li><a data-t="'+i+'">'+F_Common._init.power[i]+'</a></li>';
        }
        str += '</ul></div>';
        return str;
    }
}
