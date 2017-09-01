var F_InfoId = '';
var wordCloudObj = '';
$(function () {
    G_Login._check();
    var $_GET = getUrl('query');
    F_InfoId = $_GET.id;
    if(isNaN($_GET.id)){
        G_Pop._init('msg',{'content':'选择的数据不存在'});
        return false;
    }
    if(!G_Common._isInner()){
        U_Dom._menu('1-4-2');
        F_Base._getInfo();
        F_Base._getWords();
        F_Base._getEmotion();
        F_Words._getInfo();
        F_Topic._getInfo();
        F_User._getInfo();
        $('.tk_rt_topic_more span').click(function(){
            if($('.tk_rt_topic_list').is(":hidden")){
                $(this).html('收起所有话题 <i class="glyphicon glyphicon-menu-up"></i>');
                $('.tk_rt_topic_list').slideDown("fast");
            }else{
                $(this).html('查看所有话题 <i class="glyphicon glyphicon-menu-down"></i>');
                $('.tk_rt_topic_list').slideUp("fast");
            }
        });
        $('.mr_h_tab ul li').each(function(index){
            $(this).click(function(){
                switch(index+''){
                    case '0':
                        G_Jump._go('base',G_Jump._getUrl('chat'));
                        break;
                }
            });
        });
    }else{
        var postData = [];
        switch($_GET.t){
            case 'detail':
                if(!$_GET.w || isNaN($_GET.s)){
                    G_Pop._init('msg',{'content':'查看的数据不存在'});
                    return false;
                }
                $_GET.w = decodeURIComponent($_GET.w);
                postData.push('keywords='+$_GET.w);
                postData.push('source_type='+$_GET.s);
                F_User._getDetail($('#bs_detail'),1,postData.join('&'),$_GET.w);

                $('#bs_detail').show();
                break;
            case 'user':
                if(isNaN($_GET.s) || !$_GET.a || !$_GET.q){
                    G_Pop._init('msg',{'content':'查看的数据不存在'});
                    return false;
                }
                $_GET.a = decodeURIComponent($_GET.a);
                $_GET.q = decodeURIComponent($_GET.q);

                postData.push('qq_id='+$_GET.q);
                postData.push('author='+$_GET.a);
                postData.push('source_type='+$_GET.s);
                F_User._getDetail($('#bs_user .tk_rts_list'),1,postData.join('&'));
                var keywords = '';
                if($_GET.r){
                    keywords = decodeURIComponent($_GET.r);
                    keywords = keywords.split(' ');
                    keywords = keywords.join('<br>');
                }
                $('.tk_rt_topic_man_keyword_list').html('发言关键词：<br>'+keywords);
                $('#bs_user').show();
                break;
            case 'topic':
                if(isNaN($_GET.s) || !$_GET.w){
                    G_Pop._init('msg',{'content':'查看的数据不存在'});
                    return false;
                }
                $_GET.w = decodeURIComponent($_GET.w);
                F_User._getSession($_GET.w,$_GET.s);
                $('#bs_topic').show();
                break;
        }
    }
    G_Login._status('user');
});
var F_Base = {
    _getWords:function(){
        G_Port._ajax('talkDetailTopic','get',true,'info_id='+F_InfoId,function(){
                $('#bs_emotion_word').html(G_Pre._loading());
            },function(){
                $('#bs_emotion_word').html('');
            },function(data,msg){
                if(data.get && data.get.length > 0){
                    var wordObj = F_Base._formatWord(data.get);
                    wordCloudShow($('#bs_emotion_word'),wordObj.word,null,wordObj.color);
                    $('#bs_emotion_word a').each(function(){
                        $(this).click(function(){
                            var word = $(this).html();
                            F_Common._openDetail('detail',{word:word});
                            wordCloudObj.resume();
                        });
                    });
                }
            },function(data,msg,code){
                $('#bs_emotion_word').html(G_Pre._empty(msg));
            }
        )
    },
    _getEmotion:function(){
        G_Port._ajax('talkEmotion','get',true,'info_id='+F_InfoId,function(){
                $('#bs_emotion_percent').html(G_Pre._loading());
            },function(){
                $('#bs_emotion_percent').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    var chartDataPre = {legend:['正面','负面'],data:[{value:0, name:'正面'},{value:0, name:'负面'}]};
                    for(var i=0;i<data.get.length;i++){
                        if(data.get[i].attitude_score > 0){
                            chartDataPre.data[0] = {value:data.get[i].post_num, name:'正面'};
                        }
                        if(data.get[i].attitude_score < 0){
                            chartDataPre.data[1] = {value:data.get[i].post_num, name:'负面'};
                        }
                    }
                    F_Base._chartEmotion(chartDataPre);
                }else{
                    $('#bs_emotion_percent').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_emotion_percent').html(G_Pre._empty(msg));
            }
        )
    },
    _chartEmotion:function(data){
        var chartData = {};
        chartData.tooltip = {trigger:'item',formatter:'{b}:{c}'};
        chartData.legend = {
            itemWidth:12,
            itemHeight:12,
            left :'center',
            top :'bottom',
            data:data.legend,
            textStyle:{
                fontSize:12
            }
        };
        chartData.color = ['#679F37','#E88B80'];
        chartData.grid = {
            containLabel: true
        }
        chartData.series = [
            {
                type:'pie',
                hoverAnimation:false,
                center: ['50%', '40%'],
                radius: ['30%', '80%'],
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:data.data
            }
        ];
        getEChart('pie','bs_emotion_percent',chartData);
    },
    _getInfo:function(){
        G_Port._ajax('talkInfo','get',true,'info_id_list='+F_InfoId+'&index=0&limit=1',function(){
                $('.tk_rt_info').html(G_Pre._loading());
            },function(){
                $('.tk_rt_info').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    $('.tk_rt_info').html(F_Base._htmlInfo(data.get[0]));
                }else{
                    $('.tk_rt_info').html('暂无数据');
                }
            },function(data,msg,code){
                $('.tk_rt_info').html(G_Pre._empty(msg));
            }
        )
    },
    _formatWord:function(data){
        var wordObj = {word:[],color:[]};
        for(var i=0;i<data.length;i++){
            wordObj.word.push(data[i]['keyword']);
            switch(data[i]['senti_type']){
                case 'pos':
                    wordObj.color.push('lt_fmPlWPos');
                    break;
                case 'neg':
                    wordObj.color.push('lt_fmPlWNeg');
                    break;
            }
        }
        return wordObj;
    },
    _htmlInfo:function(data){
        var str = '';
        str += '<div class="tk_rt_name c_floatLeft c_hidden c_relative"><i class="c_img"></i> 聊天记录“<span class="c_colorB">'+decodeURIComponent(data.file_name)+'</span>”分析结果如下：</div>\
            <div class="tk_rt_time c_floatRight">时间范围：'+(data.start_date ? data.start_date.replace('.0','') : '')+'~'+(data.end_date ? data.end_date.replace('.0',''):'')+'</div>\
        <div class="clearfix"></div>';
        return str;
    }
}
var F_Words = {
    _getInfo:function(){
        G_Port._ajax('talkKeywords','get',true,'info_id='+F_InfoId,function(){
                $('#bs_keywords').html(G_Pre._loading());
            },function(){
                $('#bs_keywords').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    F_Words._chartBar(data.get);
                }else{
                    $('#bs_keywords').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_keywords').html(G_Pre._empty(msg));
            }
        )
    },
    _chartBar:function(data){
        var chartData = {};
        var chartDataPre = {'xAxis':[],'data':[]};
        for(var i=0;i<data.length;i++){
            chartDataPre.xAxis.push(data[i].keyword);
            chartDataPre.data.push(data[i].num);
        }
        chartData.tooltip = {trigger:'axis'};
        chartData.legend = {};
        chartData.grid = {
            left: '2%',
            right: '2%',
            bottom: '12%',
            top: '5%',
            containLabel: true
        }
        chartData.dataZoom = [
            {
                show: true,
                start: 0,
                end: 6,
                zoomLock: true
            }
        ];
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
                nameLocation : 'middle',
                nameTextStyle : {
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
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
        chartData.series = [
            {
                barMaxWidth:30,
                type: 'bar',
                name: '热度',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: chartDataPre.data
            }
        ];
        getEChart('keywords','bs_keywords',chartData);
    }
}
var F_Topic = {
    _buff:{},
    _formatTopic:function(word){
        if(F_Topic._buff.TopicData){
            var data = F_Topic._buff.TopicData;
            var topicId = '';
            for(var i=0;i<data.length;i++){
                if(data[i].topic_keywords == word){
                    topicId = data[i].topic_id;
                    break;
                }
            }
            if(topicId != ''){
                F_Common._openDetail('topic',{word:topicId,title:word});
            }
        }
    },
    _getInfo:function(){
        G_Port._ajax('talkTopic','get',true,'info_id='+F_InfoId,function(){
                $('#bs_topic').html(G_Pre._loading());
            },function(){
                $('#bs_topic').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    F_Topic._buff.TopicData = data.get;
                    $('.tk_rt_topic_more').show();
                    F_Topic._chartTopic(data.get);
                    F_Topic._htmlWordList(data.get);
                }else{
                    $('.tk_rt_topic_more').hide();
                    $('#bs_topic').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_topic').html(G_Pre._empty(msg));
            }
        )
    },
    _chartTopic:function(data){
        var chartData = {};
        var chartDataPre = {'data':[]};
        for(var i=0;i<data.length;i++){
            if(i>=10)break;
            chartDataPre.data.push({name: data[i].topic_keywords,path: data[i].topic_id,value: data[i].post_num});
        }
        chartData.tooltip = {trigger:'item'};
        chartData.legend = {};
        chartData.series = [
            {
                roam:false,
                breadcrumb:{
                  show:false
                },
                nodeClick:false,
                type:'treemap',
                visibleMin: 300,
                label: {
                    show: true,
                    formatter: '{b}'
                },
                data: chartDataPre.data
            }
        ];
        getEChart('line','bs_topic',chartData);
    },
    _htmlWordList:function(data){
        var str = '';
        str += '<table>\
                    <tr>\
                    <th>编号</th>\
                    <th>话题摘要</th>\
                    <th>聊天片段数量</th>\
                    <th>聊天记录数</th>\
                    <th>参与人数</th>\
                </tr>';

        var d=1;
        for(var i=0;i<data.length;i++){
            if(d>10)break;
            if(data[i].topic_keywords && data[i].topic_keywords != ''){
                str += '<tr data-w="'+data[i].topic_keywords+'">\
                            <td>'+d+'</td>\
                            <td>'+data[i].topic_keywords+'</td>\
                            <td>'+data[i].session_num+'</td>\
                            <td>'+data[i].post_num+'</td>\
                            <td>'+data[i].user_num+'</td>\
                        </tr>';
                d++;
            }

        }
        str += '</table>';

        $('.tk_rt_topic_list').html(str);

        $('.tk_rt_topic_list table tr').each(function(){
            $(this).click(function(){
                var keyword = $(this).attr('data-w');
                if(keyword != ''){
                    F_Topic._formatTopic(keyword);
                }
            })
        });
    }
}
var F_User ={
    _buff:{},
    _getSession:function(topicId,sourceType){
        G_Port._ajax('talkTopic','get',true,'index=0&limit=5&topic_id='+topicId+'&info_id='+F_InfoId,function(){
                $('#bs_topic_list').html(G_Pre._loading());
            },function(){
                $('#bs_topic_list').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    var str = '<ul>';
                    var sessionId = '';
                    for(var i=0;i<data.get.length;i++){
                        if(i==0)sessionId = data.get[i].session_id;
                        str += F_User._htmlSession(data.get[i],i,sourceType);
                    }
                    str += '</ul>';
                    $('#bs_topic_list').html(str);
                    if(sessionId != ''){
                        F_User._getSessionDetail(topicId,sessionId,sourceType);
                    }
                    $('#bs_topic li').each(function(index){
                        $(this).click(function(){
                            if(!$(this).hasClass('tk_rts_border')){
                                $(this).addClass('tk_rts_border').siblings().removeClass('tk_rts_border');
                                $(this).siblings('li').find('.tk_rts_lt_cal').removeClass('tk_rts_lt_cal_on').addClass('tk_rts_lt_cal_off');
                                $(this).find('.tk_rts_lt_cal').addClass('tk_rts_lt_cal_on').removeClass('tk_rts_lt_cal_off');
                                var sessionId = $(this).attr('data-s');
                                var topicId = $(this).attr('data-w');
                                var sourceType = $(this).attr('data-t');
                                F_User._getSessionDetail(topicId,sessionId,sourceType);
                            }
                        });
                    });

                }else{
                    $('#bs_topic_list').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_topic_list').html(G_Pre._empty(msg));
            }
        )
    },
    _getSessionDetail:function(topicId,sessionId,sourceType){
        var postData = 'topic_id='+topicId+'&session_id='+sessionId+'&source_type='+sourceType
        F_User._getDetail($('#bs_topic_detail'),1,postData,null,'topic');
    },
    _htmlSession:function(data,index,sourceType){
        var str = '';
        switch(index+''){
            case '0':
                str += '<li class="tk_rts_border" data-w="'+data.topic_id+'" data-s="'+data.session_id+'" data-t="'+sourceType+'"><div class="tk_rts_lt_cal tk_top_img tk_rts_lt_cal_on">';
                break;
            default:
                str += '<li data-w="'+data.topic_id+'" data-s="'+data.session_id+'" data-t="'+sourceType+'"><div class="tk_rts_lt_cal tk_top_img tk_rts_lt_cal_off">';
                break;
        }
        str += '会话'+(index+1)+'</div><div class="tk_rts_lt_info"><span title="'+data.session_summary+'">'+data.session_summary+'</span>';
        str += '共'+data.user_num+'人参与，产生'+data.post_num+'条聊天记录</div></li>';
        return str;
    },
    _getInfo:function(){
        G_Port._ajax('talkUser','get',true,'info_id='+F_InfoId,function(){
                $('#bs_user').html(G_Pre._loading());
            },function(){
                $('#bs_user').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    F_User._buff.userData = data.get;
                    $('#bs_user').html(F_User._htmlUserList(data.get));
                }else{
                    $('#bs_user').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_user').html(G_Pre._empty(msg));
            }
        )
    },
    _getDetail:function(dom,page,postData,keyword,type){
        var index = (page-1)*G_Page._size;
        G_Port._ajax('talkQueryPost','get',true,postData+'&info_id='+F_InfoId+'&index='+index+'&limit='+G_Page._size,function(){
                page==1 ? dom.html(G_Pre._loading()) : dom.find('.tk_rt_topic_man_more span').unbind('click').html('加载中...');
            },function(){
                if(page==1)dom.html('');
            },function(data,msg){
                if(data.data.list && data.data.list.length > 0){
                    var isEnd = page*G_Page._size >= data.data.total ? true : false;
                    dom.find('.tk_rt_topic_man_more').remove();
                    switch(type){
                        case 'topic':
                            dom.append(F_User._htmlTopic(data.data.list,isEnd));
                            break;
                        default:
                            dom.append(F_User._htmlDetail(data.data.list,isEnd,keyword));
                            break;
                    }
                    if(isEnd){
                        dom.find('.tk_rt_topic_man_more span').unbind('click');
                    }else{
                        dom.find('.tk_rt_topic_man_more span').bind('click',function(){
                            F_User._getDetail(dom,(page+1),postData,keyword,type);
                        }).addClass('c_cursor');
                    }
                }else{
                    if(page==1)dom.html('暂无数据');
                }
            },function(data,msg,code){
                if(page==1)dom.html(G_Pre._empty(msg));
            }
        )
    },
    _htmlTopic:function(data,isEnd){
        var str = '';
        for(var i=0;i<data.length;i++){
            if(i%2 == 0){
                str += '<dl>\
                        <dt>【'+data[i].source.qq_id+'】 '+data[i].source.author+'   '+data[i].source.publish_time+'</dt>\
                        <dd>\
                            <i class="tk_top_img c_floatLeft mg_right"></i>\
                            <span class="c_floatLeft"><div class="ar_left tk_top_img"></div>'+data[i].source.content+'</span>\
                            <div class="clearfix"></div>\
                        </dd>\
                     </dl>';
            }else{
                str += '<dl>\
                        <dt style="text-align: right">【'+data[i].source.qq_id+'】 '+data[i].source.author+'   '+data[i].source.publish_time+'</dt>\
                        <dd>\
                            <i class="tk_top_img c_floatRight mg_left"></i>\
                            <span class="c_floatRight"><div class="ar_right tk_top_img"></div>'+data[i].source.content+'</span>\
                            <div class="clearfix"></div>\
                        </dd>\
                    </dl>';
            }
        }
        str += isEnd ? '<div class="tk_rt_topic_man_more"><span>已显示全部</span></div>' : '<div class="tk_rt_topic_man_more"><span>点击查看更多</span></div>';
        return str;
    },
    _htmlDetail:function(data,isEnd,keyword){
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<dl>\
                        <dt>'+data[i].source.publish_time+'</dt>\
                        <dd>'+G_Common._focusKeywords(keyword,data[i].source.content)+'</dd>\
                    </dl>';
        }
        str += isEnd ? '<div class="tk_rt_topic_man_more"><span>已显示全部</span></div>' : '<div class="tk_rt_topic_man_more"><span>点击查看更多</span></div>';
        return str;
    },
    _htmlUserList:function(data){
        var str = '';
        var postData = '';
        for(var i=0;i<data.length;i++){
            if(i>=10)break;
            switch(i){
                case 0:
                    postData = 'qq_id='+data[i].qq_id+'&author='+data[i].author+'&source_type=10';
                    str += F_User._htmlUserFirst(data[i]);
                    break;
                case 1:
                    str += '<div class="tk_rt_topic_man_list"><ul>';
                    str += F_User._htmlUserLeft(i,data[i]);
                    break;
                default:
                    str += F_User._htmlUserLeft(i,data[i]);
                    break;
            }
        }
        if(str != '' && data.length > 1)str += '</ul></div><div class="clearfix"></div>';
        $('#bs_user').html(str);
        if(postData != ''){
            F_User._getDetail($('.tk_rt_topic_man_detail'),1,postData);
            $('.tk_rt_topic_man_list .tk_rt_detail').each(function(index){
                $(this).click(function(){
                    if(F_User._buff.userData[(index+1)]){
                        var detailData = F_User._buff.userData[(index+1)];
                        F_Common._openDetail('user',{qq:detailData.qq_id,author:detailData.author,relation:detailData.top_keywords});
                    }
                });
            });
        }
    },
    _htmlUserFirst:function(data){
        var str = '';
        if(data.top_keywords){
            data.top_keywords = data.top_keywords.split(' ');
            data.top_keywords = data.top_keywords.join('<br>');
        }
        str += '\
            <div class="tk_rt_topic_man_top">\
                <div class="tk_top_img tk_rt_topic_man_top_info c_relative c_floatLeft">\
                    <div class="tk_rt_number">TOP1</div>\
                    <div class="tk_rt_user">\
                        昵称：'+data.author+'<br>\
                        QQ号：'+data.qq_id+'<br>\
                        聊天条数：共'+data.post_num+'条<br>\
                    </div>\
                </div>\
                <div class="tk_rt_topic_man_top_list c_floatLeft">\
                    <div class="tk_rt_topic_man_detail tk_rt_topic_man_detail_width c_floatLeft"></div>\
                    <div class="tk_rt_topic_man_keyword c_floatRight c_relative">\
                        <div class="tk_top_img tk_rt_topic_man_arrow"></div>\
                        <div class="tk_rt_topic_man_keyword_list">\
                        发言关键词：<br>'+data.top_keywords+'\
                        </div>\
                    </div>\
                </div>\
                <div class="clearfix"></div>\
            </div>';

        return str;
    },
    _htmlUserLeft:function(index,data){
        var str = '';
        str += index%3 == 0 ? '<li class="liNoMargin">' : '<li>';
        str += '\
                <div class="tk_rt_number">TOP'+(index+1)+'</div>\
                <div class="tk_rt_user">\
                    昵称： '+data.author+'<br>\
                    QQ号：'+data.qq_id+'\
                </div>\
                <div class="tk_rt_detail c_cursor"><i class="glyphicon glyphicon-list-alt"></i> 查看聊天内容（共 <span class="c_colorR">'+data.post_num+'</span>  条）</div>\
            </li>';
        return str;
    }
}
var F_Common = {
    _openDetail:function(type,data){
        G_Pop._init('close');
        var width = 0;
        var height = 0;
        var queryData =[];
        queryData.push('id='+F_InfoId);
        queryData.push('s=10');
        queryData.push('t='+type);
        if(data.word)queryData.push('w='+encodeURIComponent(data.word));
        if(data.qq)queryData.push('q='+encodeURIComponent(data.qq));
        if(data.author)queryData.push('a='+encodeURIComponent(data.author));
        if(data.relation)queryData.push('r='+encodeURIComponent(data.relation));

        var url = 'talkresult_s.html?'+queryData.join('&');
        var title = '';
        switch(type){
            case 'detail':
                title = '关键词“'+data.word+'”的聊天记录';
                width = '600px';
                height = '550px';
                break;
            case 'topic':
                title = '“'+data.title+'”的相关的聊天会话';
                width = '1130px';
                height = '570px';
                break;
            case 'user':
                title = '聊天者“'+data.author+'（'+data.qq+'）”的聊天记录';
                width = '800px';
                height = '550px';
                break;
        }
        G_Pop._init('open',{'type':2,'scroll':true,'title':title,'width':width,'height':height,'shift':2,'content':url},'');
    }
}