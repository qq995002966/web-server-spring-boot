var dateEnd = G_Date._get(-1);
var dateChooseBeginConfine = G_Date._getUnixTimeCurrent('2016-07-01');
$(function(){
    G_Login._check();
    U_Dom._menu('1-3-1');
    var $_GET = getUrl('query');
    G_GameId =  $_GET.g && !isNaN($_GET.g) ? $_GET.g : G_Game._getLast('lost');
    G_Game._setLast(G_GameId,'lost');
    U_Service._checkStatus('lost');
    G_Login._status('user');

    dataChoose._single({'autoCommit':true,'todayValid':false,'minValidDate':dateChooseBeginConfine},1,dateEnd,dateEnd,function(begin,end){
        var beginDate = G_Date._getByDiff(end.toString(),-30);
        $('#dc1').html(beginDate+' 至 '+end);
        if(end != dateEnd){
            dateEnd = end;
            F_Radar._getInfo();
        }
    });
});

var F_Radar = {
    _getDate:function(){
        return $('#db1').val();
    },
    _getInfo:function(){
        var date = F_Radar._getDate();
        G_Port._ajax('getOutflowRadar','get',true,'start_date='+encodeURIComponent(dateEnd)+'&end_date='+encodeURIComponent(dateEnd)+'&project_id='+G_GameId,function(){
                $('.coordinate').html(G_Pre._loading());
            },function(){
                $('.coordinate').html('');
            },function(data,msg){
                $('.coordinate').html(F_Radar._htmlInfo(data.result));
            },function(data,msg,code){
                $('.coordinate').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlInfo:function(data){
        var str = '';
        var gameInfo = G_Game._getGame([G_GameId],1)[G_GameId];
        str += '<div class="circle-img">';
        str += '<img src="'+gameInfo[0]+'" alt="'+gameInfo[1]+'">';
        str += '<span class="center-title">'+gameInfo[1]+'</span></div>';
        if(data && data.length>0){
            str += '<ul class="img-list">';
            for(var i=0;i<data.length;i++){
                if(i>21)break;
                str += '<li  class="img_'+(i+1)+'">';
                str += '<img src="'+data[i].pic_url+'" alt="'+data[i].forum_name+'">';
                str += '<span>'+data[i].forum_name+'</span>';
                str += '</li>';
            }
            str += '</ul>';
        }
        return str;
    }
}

var F_Reason = {
    _buff:{},
    _date:{'list':[],'current':''},
    _getDate:function(){
        return $('#db2').val();
    },
    _formatDateChoose:function(){
        if(F_Reason._date.list && F_Reason._date.list.length > 0){
            var str = '';
            var listStr = '';
            str += '<div class="dropdown">';
            var data = F_Reason._date.list;
            for(var i=0;i<data.length;i++){
                if(data[i] == F_Reason._date.current){
                    str += '<button class="btn btn-default dropdown-toggle bs_date_cho" type="button" id="dateChoose" data-toggle="dropdown" aria-expanded="false"><span>'+data[i]+'</span>　<i class="caret"></i></button>';
                }else{
                    listStr += '<li><a>'+data[i]+'</a></li>';
                }
            }
            if(listStr != '')str += '<ul class="dropdown-menu bs_date_choose" aria-labelledby="typeChoose">'+listStr+'</ul>';
            str += '</div>';
            $('.bs_reason').html(str);

            $('.bs_reason .bs_date_choose li a').each(function(){
                $(this).click(function(){
                    F_Reason._date.current = $(this).text();
                    F_Reason._formatDateChoose();
                    F_Reason._getClassify();
                });
            });
        }
    },
    _getDate:function(){
        G_Port._ajax('getOutflowDate','get',true,'project_id='+G_GameId,function(){
                $('.content-part').html(G_Pre._loading());
            },function(){
                $('.content-part').html('');
            },function(data,msg){
                if(data && data.length>0){
                    F_Reason._date.list = data;
                    F_Reason._date.current = data[0];
                    F_Reason._formatDateChoose();
                    F_Reason._getClassify();
                }else{
                    $('.content-part').html(G_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                switch(code+''){
                    case '-1042':
                        msg = '大数据分析师正在奋力为您解读用户流失原因，首次开通时请您耐心等待约2~3天时间，分析完成后您可在本界面查看结果';
                        break;
                }
                $('.content-part').html(G_Pre._empty(msg));
            }
        )
    },
    _getType:function(){
        var typeName = '';
        $('.tab-change li').each(function(){
            if($(this).hasClass('selected')){
                typeName = $(this).attr('data-w');
            }
        });
        return typeName;
    },
    _getClassify:function(){
        G_Port._ajax('getOutflowSumType','get',true,'data_date='+encodeURIComponent(F_Reason._date.current)+'&project_id='+G_GameId,function(){
                $('.content-part').html(G_Pre._loading());
            },function(){
                $('.content-part').html('');
            },function(data,msg){
                if(data && data.length>0 && data[0].sum_type){
                    $('.content-part').html(F_Reason._htmlMenu(data));
                    U_Common._tabChoose('lost',$('.tab-change li'),'selected',$('#bs_lost_details'));
                    F_Reason._getDetail();
                }else{
                    $('.content-part').html(G_Pre._empty('暂无数据'));
                }
            },function(data,msg,code){
                $('.content-part').html(G_Pre._empty(msg));
            }
        )

    },
    _htmlMenu:function(data){
        var str = '';
        str += '<ul class="tab-change">';
        var subName = '';
        for(var i=0;i<data.length;i++){
            subName = data[i].sum_type.split(':');
            subName = subName[0];
            str += '<li data-w="'+data[i].sum_type+'"';
            str += i==0 ? ' class="selected"' : '';
            str += '>';
            str += '<h4>'+subName+'</h4>';
            str += '<p class="blue-text">'+data[i].total+'</p>';
            str += '</li>';
        }
        str += '</ul><div id="bs_lost_details"></div>';
        return str;
    },
    _getDetail:function(){
        var date = F_Reason._date.current;
        var type = F_Reason._getType();
        if(F_Reason._buff[type]){
            F_Reason._htmlDetail(F_Reason._buff[type]);
        }else{
            G_Port._ajax('getOutflowSumReason','get',true,'sum_type='+G_Common._encodeUrl(type)+'&data_date='+G_Common._encodeUrl(date)+'&project_id='+G_GameId,function(){
                    $('#bs_lost_details').html(G_Pre._loading());
                },function(){
                    $('#bs_lost_details').html('');
                },function(data,msg){
                    F_Reason._buff[type] = data;
                    F_Reason._htmlDetail(data);
                },function(data,msg,code){
                    $('#bs_lost_details').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _htmlDetail:function(data){
        var total = 0;
        var diff = 0;
        var first = 0;
        var percent = 0;
        for(var i=0;i<data.length;i++){
            total += parseInt(data[i].weight);
            if(i==0)first = data[i].weight;
        }
        diff = ((parseInt(first)/parseInt(total))*100);
        diff = (100/diff).toFixed(0);
        var str = '';
        var color = ['color-a','color-b','color-c','color-d','color-e','color-f'];
        str += '<table class="lost-table"><tbody><tr><th>流失原因</th><th >流失概率</th><th>玩家反馈量</th></tr><tr style="height: 10px;"></tr>';
        for(var i=0;i<data.length;i++){
            if(i>5)break;
            if(i==0){
                percent = 100;
            }else{
                percent = ((parseInt(data[i].weight)/total)*100*diff).toFixed(1);
            }
            if(percent > 100)percent = 100;
            str += '<tr class="problem-all">';
            str += '<td>'+data[i].sum_reason+'</td>';
            str += '<td>';
            str += '<div class="percent">';
            str += '<div class="percent-line '+color[i]+'" style="width:'+percent+'%"></div>';
            str += '</div>';
            str += '</td>';
            str += '<td>';
            str += '<i class="glyphicon glyphicon-triangle-right"></i>';
            str += '<b>'+data[i].weight+'</b>';
            str += '</td>';
            str += '</tr>';
            str += '<tr class="problem-list">';
            str += '<td colspan="3">';
            for(var d=0;d<data[i].reason.length;d++){
                str += '<div>'+data[i].reason[d]+'</div>';
            }
            str += '</td></tr>';
        }
        str += '</table>';

        $('#bs_lost_details').html(str);

        $('.problem-all').each(function(index){
            $(this).click(function(){
                if($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                    $(this).find('i').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                    $('.problem-list').eq(index).hide();
                }else{
                    $(this).addClass('selected').siblings('.problem-all').removeClass('selected');
                    $(this).siblings('.problem-all').find('i').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                    $(this).find('i').removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                    $('.problem-list').eq(index).show().siblings('.problem-list').hide();
                }
            });
        });
    }
}