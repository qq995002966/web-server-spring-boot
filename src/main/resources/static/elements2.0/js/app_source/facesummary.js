var F_FaceSummary_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-9-1');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            M_Init._clean();
            var $_GET = B_Common._getUrl('query');
            if($_GET.g){
                M_Init._gameDetailId = $_GET.g;
                B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
            }else{
                if(gameId){
                    M_Init._gameDetailId = gameId;
                    B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
                }else{
                    if(!M_Init._gameDetailId){
                        M_Init._gameDetailId = M_Init._getGameId('outsideGameDetail');
                    }
                }
            }
            M_Game._checkGameVisitList('gameFaceSummary');
        }
    }
}

var F_FaceSummary_Info = {
    _domArea:function () {
        var str = '';
        str += '\
            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">\
                <div class="b_chart" id="bs_map_distribute" style="height: 450px"></div>\
                </div>\
                <div id="areaPart">\
                <div class="py_mplist" id="bs_line_distribute"></div>\
            </div>';
        return str;
    },
    _domDynamic:function () {
        var str = '';
        str += '\
            <div class="graph-show fl" id="bs_pie_dynamic"></div>\
            <ul class="instruct-plant" id="lt_list_dynamic"></ul>';

        return str;
    },
    _domCallupon:function () {
        var str = '';
        str += '\
            <div class="graph-show fl" id="bs_pie_callupon"></div>\
            <ul class="instruct-plant" id="lt_list_callupon"></ul>';
        return str;
    },
    _domComplain:function () {
        var str = '';
        str += '\
            <i class="complaint-s"></i>\
            <div class="b_chart_wrap">\
                <div class="b_chart" id="bs_line_complain"></div>\
            </div>\
            <i class="complaint-h"></i>';
        return str;
    },
    _getInfo:function(){
        var domGender = $('#lt_gender_compare');
        var domArea = $('#bs_face_area');
        var domDynamic = $('#bs_face_dynamic');
        var domCallupon = $('#bs_face_callupon');
        var domComplain = $('#bs_face_complain');
        var domItemList = $('#lt_item_list');

        var postData = {};
        postData['project_id'] = M_Init._gameDetailId;
        postData = B_Common._postData(postData);
        B_Port._ajax('faceProfileGlobal','get',true,postData,function(){
                domGender.html(B_Pre._loading());
                domArea.html(B_Pre._loading());
                domDynamic.html(B_Pre._loading());
                domCallupon.html(B_Pre._loading());
                domItemList.html(B_Pre._loading());
                domComplain.html(B_Pre._loading());
            },function(){
                domGender.html('');
                domArea.html('');
                domDynamic.html('');
                domCallupon.html('');
                domItemList.html('');
                domComplain.html('');
            },function(data,msg){
                if(data.total_num){
                    domGender.html(F_Face_Html._htmlGender(data.sex_distri));
                    $('#num_high_charm').html(data.high_charm_num);
                    $('#num_high_pay').html(data.high_pay_num);
                    $('#num_trash').html(data.trash_num);
                    $('#num_lost').html(data.lost_num);

                    domArea.html(F_FaceSummary_Info._domArea());
                    domDynamic.html(F_FaceSummary_Info._domDynamic());
                    domCallupon.html(F_FaceSummary_Info._domCallupon());
                    domComplain.html(F_FaceSummary_Info._domComplain());

                    F_Face_Html._chartMap('bs_map_distribute','bs_line_distribute',data.province_distri);
                    F_Face_Html._htmlLine(domItemList,data.interest_distri);
                    F_FaceSummary_Info._chartScatter('bs_line_complain',data.complain_rate_distri);
                    F_FaceSummary_Info._chartPie('influence','bs_pie_callupon',data.influence_distri,$('#lt_list_callupon'),data.influence_be_replied_distri);
                    F_FaceSummary_Info._chartPie('active','bs_pie_dynamic',data.active_distri,$('#lt_list_dynamic'),data.active_post_distri);

                }else{
                    domGender.html(B_Pre._empty('暂无数据'));
                    domArea.html(B_Pre._empty('暂无数据'));
                    domDynamic.html(B_Pre._empty('暂无数据'));
                    domCallupon.html(B_Pre._empty('暂无数据'));
                    domItemList.html(B_Pre._empty('暂无数据'));
                    domComplain.html(B_Pre._empty('暂无数据'));

                    B_Pop._init('msg',{content:'当前游戏数据源较少'});
                }
            },function(data,msg,code){
                domGender.html(B_Pre._empty(msg));
                domArea.html(B_Pre._empty(msg));
                domDynamic.html(B_Pre._empty(msg));
                domCallupon.html(B_Pre._empty(msg));
                domItemList.html(B_Pre._empty(msg));
                domComplain.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlPie:function(type,dom,data,percentData){
        var format = {};
        var total = 0;
        var init = F_Face_Common._init[type];
        var str = '';
        if(data && data.length >0){
            for(var i=0;i<data.length;i++){
                $.each(data[i],function(key,value){
                    format[key] = value;
                })
            }
        }
        var number = 0;
        switch(type){
            case 'active':
                for(var i=0;i<init.length;i++){
                    number = (format[init[i]] ? format[init[i]].toFixed(2) : 0);
                    switch(i){
                        case 0:
                            str += F_FaceSummary_Info._htmlPieFormat('月平均发言量','color-d',{'name':'高活跃玩家','desc':'他们直接影响游戏人气'},{'number':number,'percent':percentData[2]});
                            break;
                        case 1:
                            str += F_FaceSummary_Info._htmlPieFormat('月平均发言量','color-e',{'name':'中活跃玩家','desc':'他们是游戏的中流砥柱'},{'number':number,'percent':percentData[1]});
                            break;
                        case 2:
                            str += F_FaceSummary_Info._htmlPieFormat('月平均发言量','color-f',{'name':'低活跃玩家','desc':'他们是游戏的关注者'},{'number':number,'percent':percentData[0]});
                            break;
                    }
                }
                break;
            case 'influence':
                for(var i=0;i<init.length;i++){
                    number = (format[init[i]] ? format[init[i]].toFixed(2) : 0);
                    switch(i){
                        case 0:
                            str += F_FaceSummary_Info._htmlPieFormat('贴均回复数','color-a',{'name':'高号召玩家','desc':'他们对舆论导向作用明显'},{'number':number,'percent':percentData[2]});
                            break;
                        case 1:
                            str += F_FaceSummary_Info._htmlPieFormat('贴均回复数','color-b',{'name':'中号召玩家','desc':'他们是舆论的传播者'},{'number':number,'percent':percentData[1]});
                            break;
                        case 2:
                            str += F_FaceSummary_Info._htmlPieFormat('贴均回复数','color-c',{'name':'低号召玩家','desc':'他们是舆论的响应者'},{'number':number,'percent':percentData[0]});
                            break;
                    }
                }
                break;
        }
        str += '\
            <div class="triangle-border">\
            <i class="triangle-content"></i>\
            <i class="triangle-border-wrap"></i>\
            </div>';
        dom.html(str);

    },
    _htmlPieFormat:function(desc,color,word,data){
        var str = '';
        str += '<li>';
        str += '<div><p>'+word.name+'</p><span>'+word.desc+'</span></div>';
        str += '<div><b class="'+color+'">'+data.number+'</b><span>'+desc+'</span></div>';
        str += '<div><b class="'+color+'">'+data.percent+'</b><span>人数比例</span></div>';
        str += '</li>';
        return str;
    },
    _chartPie:function(type,dom,data,domHtml,dataHtml){
        if(data && data.length >0){
            var color = '';
            var format = [];
            var percentData = ['0%','0%','0%'];
            switch(type){
                case 'influence':
                    format = [{value:0, name:'低号召'},{value:0, name:'中号召'},{value:0, name:'高号召'}];
                    color = ['#1A806E','#429F53','#3ECB82'];
                    break;
                case 'active':
                    format = [{value:0, name:'低活跃'},{value:0, name:'中活跃'},{value:0, name:'高活跃'}];
                    color = ['#EDCF5A','#E19334','#E26148'];
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
                    total += value;
                })
            }
            if(total > 0){
                var percent = 0;
                for(var i=0;i<format.length;i++){
                    percent = ((format[i].value/total)*100).toFixed(1)+'%';
                    percentData[i] = percent;
                    format[i].name += '\r\n('+percent+')';
                }
            }
            var chartData = {};
            chartData.tooltip = {
                trigger:'item',
                formatter: "{b} {c}"
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
            B_Chart._getEChart('pie',dom,chartData);

            F_FaceSummary_Info._htmlPie(type,domHtml,dataHtml,percentData);
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
            if(parseInt(M_Init._gameDetailId) == parseInt(key)){
                value.rank_rate = (parseFloat(value.rank_rate)*100).toFixed(0);
                if(value.rank_rate == 0)value.rank_rate = 1;
                $('#num_active_percent').html(value.rank_rate+'%');
                var gameName = B_Game._getGame([M_Init._gameDetailId],1);
                if(gameName[M_Init._gameDetailId]){
                    mark.name = gameName[M_Init._gameDetailId][1]+'\r\n活跃度前'+value.rank_rate+'%'+'\r\n抱怨'+value.complain_rate+'%';
                }

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
        B_Chart._getEChart('scatter',dom,chartData);
    }

}