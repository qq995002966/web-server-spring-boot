var F_ChatResult_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-1-4');
        M_Game._htmlGameVisitHide('outsideChat');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();

            var $_GET = B_Common._getUrl('query');
            if($_GET.id){
                F_ChatResult_Info._id = $_GET.id;
            }else{
                if(gameId){
                    F_ChatResult_Info._id = gameId;
                }
            }
            if(!(F_ChatResult_Info._id && !isNaN(F_ChatResult_Info._id))){
                B_Pop._init('msg',{'content':'选择的数据不存在'});
                return false;
            }else{
                F_ChatResult_Info._getInfo();
                F_ChatResult_Info._getWords();
                F_ChatResult_Info._getEmotion();
                F_ChatResult_Words._getInfo();
                F_ChatResult_Topic._getInfo();
                F_ChatResult_User._getInfo();
            }
        }
    }
}

var F_ChatResult_Info = {
    _id:'',
    _getInfo:function(){
        var postData = {};
        postData['info_id_list'] = F_ChatResult_Info._id;
        postData['index'] = 0;
        postData['limit'] = 1;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkInfo','get',true,postData,function(){
                $('#bs_info_title').html(B_Pre._loading());
            },function(){
                $('#bs_info_title').html('');
            },function(data,msg){
                $('#bs_info_title').html(F_ChatResult_Info._htmlInfo(data));
            },function(data,msg,code){
                $('#bs_info_title').html(B_Pre._empty(msg));
            }
        )
    },
    _getWords:function(){
        var postData = {};
        postData['info_id'] = F_ChatResult_Info._id;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkDetailTopic','get',true,postData,function(){
                $('#bs_emotion_word').html(B_Pre._loading());
            },function(){
                $('#bs_emotion_word').html('');
            },function(data,msg){
                if(data.get && data.get.length > 0){
                    var wordObj = F_ChatResult_Info._formatWord(data.get);
                    M_Common._wordCloudShow($('#bs_emotion_word'),wordObj.word,null,wordObj.color);
                    $('#bs_emotion_word a').each(function(){
                        $(this).click(function(){
                            var word = $(this).html();
                            F_ChatResult_Common._openDetail('detail',{word:word});
                            wordCloudObj.resume();
                        });
                    });
                }
            },function(data,msg,code){
                $('#bs_emotion_word').html(B_Pre._empty(msg));
            }
        )
    },
    _getEmotion:function(){
        var postData = {};
        postData['info_id'] = F_ChatResult_Info._id;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkEmotion','get',true,postData,function(){
                $('#bs_emotion_percent').html(B_Pre._loading());
            },function(){
                $('#bs_emotion_percent').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    var chartDataPre = {legend:['正面','负面'],data:[{value:0, name:'正面'},{value:0, name:'负面'}]};
                    var htmlData = {'正面':0,'负面':0};
                    for(var i=0;i<data.get.length;i++){
                        if(data.get[i].attitude_score > 0){
                            chartDataPre.data[0].value += data.get[i].post_num;
                        }
                        if(data.get[i].attitude_score < 0){
                            chartDataPre.data[1].value += data.get[i].post_num;
                        }
                    }
                    F_ChatResult_Info._chartEmotion(chartDataPre);
                    F_ChatResult_Info._htmlEmotion(chartDataPre.data[0].value,chartDataPre.data[1].value);
                }else{
                    $('#bs_emotion_percent').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_emotion_percent').html(B_Pre._empty(msg));
            }
        )
    },
    _htmlEmotion:function(pos,neg){
        var str = '';
        var total = pos+neg;
        var percent = ['0%','0%'];
        if(total > 0){
            percent[0] = ((pos/total)*100).toFixed(1)+'%';
            percent[1] = ((neg/total)*100).toFixed(1)+'%';
        }
        str += '<div class="positive">\
            <i class="graph-icon"></i>\
            <span>正面反馈</span>\
            <ul class="fr">\
            <li>\
            <b>'+pos+'</b>\
            <span>正面反馈量</span>\
            </li>\
            <li>\
            <b>'+percent[0]+'</b>\
            <span>占全部反馈的</span>\
            </li>\
            </ul>\
            </div>\
            <div>\
            <i class="graph-icon"></i>\
            <span>负面反馈</span>\
            <ul class="fr">\
            <li>\
            <b>'+neg+'</b>\
            <span>负面反馈量</span>\
            </li>\
            <li>\
            <b>'+percent[1]+'</b>\
            <span>占全部反馈的</span>\
            </li>\
            </ul>\
            </div>';

        $('#lt_emotion_percent').html(str);
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
        chartData.color = ['#2ed383 ','#f7606f'];
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
        B_Chart._getEChart('pie','bs_emotion_percent',chartData);
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
        if(data && data.get && data.get[0]){
            data = data.get[0];
            str += '<span>对文件 "'+B_Common._decodeUrl(data.file_name)+'" 中 '+(data.start_date ? data.start_date.replace('.0','') : '')+' 至 '+(data.end_date ? data.end_date.replace('.0',''):'')+' 期间的聊天分析结果</span>';
        }
        str += '<button onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('outsideChat')+'\')" class="tg-main-btn">返回聊天分析任务</button>';
        return str;
    }
}

var F_ChatResult_Words = {
    _getInfo:function(){
        var postData = {};
        postData['info_id'] = F_ChatResult_Info._id;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkKeywords','get',true,postData,function(){
                $('#bs_chatresult_keywords').html(B_Pre._loading());
            },function(){
                $('#bs_chatresult_keywords').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    F_ChatResult_Words._chartBar(data.get);
                }else{
                    $('#bs_chatresult_keywords').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_chatresult_keywords').html(B_Pre._empty(msg));
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
                        color:'#333333',
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
        chartData.color = ['#43abe1'];
        B_Chart._getEChart('keywords','bs_chatresult_keywords',chartData);
    }
}
var F_ChatResult_Topic = {
    _cache:{},
    _formatTopic:function(word){
        if(F_ChatResult_Topic._cache.TopicData){
            var data = F_ChatResult_Topic._cache.TopicData;
            var topicId = '';
            for(var i=0;i<data.length;i++){
                if(data[i].topic_keywords == word){
                    topicId = data[i].topic_id;
                    break;
                }
            }
            if(topicId != ''){
                F_ChatResult_Common._openDetail('topic',{word:topicId,title:word});
            }
        }
    },
    _getInfo:function(){
        var postData = {};
        postData['info_id'] = F_ChatResult_Info._id;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkTopic','get',true,postData,function(){
                $('#bs_chatresult_topic').html(B_Pre._loading());
            },function(){
                $('#bs_chatresult_topic').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    F_ChatResult_Topic._cache.TopicData = data.get;
                    F_ChatResult_Topic._chartTopic(data.get);
                    F_ChatResult_Topic._htmlWordList(data.get);
                }
            },function(data,msg,code){
                $('#bs_chatresult_topic').html(B_Pre._empty(msg));
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
        chartData.color = ['#3daae3','#2ed383','#8b5c9b','#ec644c','#466cd0','#3fa553','#524a89','#eb9831'];
        B_Chart._getEChart('line','bs_chatresult_topic',chartData);
    },
    _htmlWordList:function(data){
        var str = '';
        str += '<table class="tg-table table table-bordered"><thead class="boxshadow">\
                    <tr>\
                    <th>编号</th>\
                    <th>话题摘要</th>\
                    <th>聊天片段数量</th>\
                    <th>聊天记录数</th>\
                    <th>参与人数</th>\
                </tr></thead><tbody>';

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
        str += '</tbody></table>';

        $('#bs_topic_list').html(str);
        $('#bs_topic_list table tr').each(function(){
            $(this).click(function(){
                var keyword = $(this).attr('data-w');
                if(keyword != ''){
                    F_ChatResult_Topic._formatTopic(keyword);
                }
            })
        });
    }
}

var F_ChatResult_User ={
    _cache:{},
    _getSession:function(topicId,sourceType){
        var postData = {};
        postData['index'] = 0;
        postData['limit'] = 5;
        postData['topic_id'] = topicId;
        postData['info_id'] = F_ChatResult_Info._id;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkTopic','get',true,postData,function(){
                $('#bs_chatresult_topic_list').html(B_Pre._loading());
            },function(){
                $('#bs_chatresult_topic_list').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    var str = '<ul>';
                    var sessionId = '';
                    for(var i=0;i<data.get.length;i++){
                        if(i==0)sessionId = data.get[i].session_id;
                        str += F_ChatResult_User._htmlSession(data.get[i],i,sourceType);
                    }
                    str += '</ul>';
                    $('#bs_chatresult_topic_list').html(str);
                    if(sessionId != ''){
                        F_ChatResult_User._getSessionDetail(topicId,sessionId,sourceType);
                    }
                    $('#bs_chatresult_topic li').each(function(index){
                        $(this).click(function(){
                            if(!$(this).hasClass('tk_rts_border')){
                                $(this).addClass('tk_rts_border').siblings().removeClass('tk_rts_border');
                                $(this).siblings('li').find('.tk_rts_lt_cal').removeClass('tk_rts_lt_cal_on').addClass('tk_rts_lt_cal_off');
                                $(this).find('.tk_rts_lt_cal').addClass('tk_rts_lt_cal_on').removeClass('tk_rts_lt_cal_off');
                                var sessionId = $(this).attr('data-s');
                                var topicId = $(this).attr('data-w');
                                var sourceType = $(this).attr('data-t');
                                F_ChatResult_User._getSessionDetail(topicId,sessionId,sourceType);
                            }
                        });
                    });

                }else{
                    $('#bs_chatresult_topic_list').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_chatresult_topic_list').html(B_Pre._empty(msg));
            }
        )
    },
    _getSessionDetail:function(topicId,sessionId,sourceType){
        var postData = {};
        postData['topic_id'] = topicId;
        postData['session_id'] = sessionId;
        postData['source_type'] = sourceType;
        postData = B_Common._postData(postData);
        F_ChatResult_User._getDetail($('#bs_chatresult_topic_detail'),1,postData,null,'topic');
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
        var postData = {};
        postData['info_id'] = F_ChatResult_Info._id;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkUser','get',true,postData,function(){
                $('#bs_user').html(B_Pre._loading());
            },function(){
                $('#bs_user').html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    F_ChatResult_User._cache.userData = data.get;
                    $('#bs_user').html(F_ChatResult_User._htmlUserList(data.get));
                }else{
                    $('#bs_user').html('暂无数据');
                }
            },function(data,msg,code){
                $('#bs_user').html(B_Pre._empty(msg));
            }
        )
    },
    _getDetail:function(dom,page,postData,keyword,type){
        var index = (page-1)*B_Page._size;
        var postData2 = {};
        postData2['info_id'] = F_ChatResult_Info._id;
        postData2['index'] = index;
        postData2['limit'] = B_Page._size;
        postData2 = B_Common._postData(postData2);
        B_Port._ajax('talkQueryPost','get',true,postData+'&'+postData2,function(){
                page==1 ? dom.html(B_Pre._loading()) : dom.find('.tk_rt_topic_man_more span').unbind('click').html('加载中...');
            },function(){
                if(page==1)dom.html('');
            },function(data,msg){
                if(data.data.list && data.data.list.length > 0){
                    var isEnd = page*B_Page._size >= data.data.total ? true : false;
                    dom.find('.tk_rt_topic_man_more').remove();
                    switch(type){
                        case 'topic':
                            dom.append(F_ChatResult_User._htmlTopic(data.data.list,isEnd));
                            break;
                        default:
                            dom.append(F_ChatResult_User._htmlDetail(data.data.list,isEnd,keyword));
                            break;
                    }
                    if(isEnd){
                        dom.find('.tk_rt_topic_man_more span').unbind('click');
                    }else{
                        dom.find('.tk_rt_topic_man_more span').bind('click',function(){
                            F_ChatResult_User._getDetail(dom,(page+1),postData,keyword,type);
                        }).addClass('c_cursor');
                    }
                }else{
                    if(page==1)dom.html('暂无数据');
                }
            },function(data,msg,code){
                if(page==1)dom.html(B_Pre._empty(msg));
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
                            <i class="tk_top_img b_floatLeft mg_right"></i>\
                            <span class="b_floatLeft"><div class="ar_left tk_top_img"></div>'+data[i].source.content+'</span>\
                            <div class="clearfix"></div>\
                        </dd>\
                     </dl>';
            }else{
                str += '<dl>\
                        <dt style="text-align: right">【'+data[i].source.qq_id+'】 '+data[i].source.author+'   '+data[i].source.publish_time+'</dt>\
                        <dd>\
                            <i class="tk_top_img b_floatRight mg_left"></i>\
                            <span class="b_floatRight"><div class="ar_right tk_top_img"></div>'+data[i].source.content+'</span>\
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
                        <dd>'+B_Common._focusKeywords(keyword,data[i].source.content)+'</dd>\
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
                    postData = {};
                    postData['qq_id'] = data[i].qq_id;
                    postData['source_type'] = 10;
                    postData = B_Common._postData(postData);
                    str += F_ChatResult_User._htmlUserFirst(data[i]);
                    break;
                case 1:
                    str += '<div class="tk_rt_topic_man_list"><ul>';
                    str += F_ChatResult_User._htmlUserLeft(i,data[i]);
                    break;
                default:
                    str += F_ChatResult_User._htmlUserLeft(i,data[i]);
                    break;
            }
        }
        if(str != '' && data.length > 1)str += '</ul></div><div class="clearfix"></div>';
        $('#bs_user').html(str);
        if(postData != ''){
            F_ChatResult_User._getDetail($('.tk_rt_topic_man_detail'),1,postData);
            $('.tk_rt_topic_man_list .tk_rt_detail').each(function(index){
                $(this).click(function(){
                    if(F_ChatResult_User._cache.userData[(index+1)]){
                        var detailData = F_ChatResult_User._cache.userData[(index+1)];
                        F_ChatResult_Common._openDetail('user',{qq:detailData.qq_id,author:detailData.author,relation:detailData.top_keywords});
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
                <div class="tk_top_img tk_rt_topic_man_top_info b_relative b_floatLeft">\
                    <div class="tk_rt_number">TOP1</div>\
                    <div class="tk_rt_user">\
                        昵称：'+data.author+'<br>\
                        QQ号：'+data.qq_id+'<br>\
                        聊天条数：共'+data.post_num+'条<br>\
                    </div>\
                </div>\
                <div class="tk_rt_topic_man_top_list b_floatLeft">\
                    <div class="tk_rt_topic_man_detail tk_rt_topic_man_detail_width b_floatLeft"></div>\
                    <div class="tk_rt_topic_man_keyword b_floatRight b_relative">\
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
        str += '<li>';
        str += '\
                <div class="tk_rt_number">TOP'+(index+1)+'</div>\
                <div class="tk_rt_user">\
                    昵称： '+data.author+'<br>\
                    QQ号：'+data.qq_id+'\
                </div>\
                <div class="tk_rt_detail b_cursor"><i class="glyphicon glyphicon-list-alt"></i> 查看聊天内容（共 <span class="b_colorR">'+data.post_num+'</span>  条）</div>\
            </li>';
        return str;
    }
}

var F_ChatResult_Common = {
    _openDetail:function(type,data){
        B_Pop._init('close');
        var width = 0;
        var height = 0;
        var queryData =[];
        queryData.push('id='+F_ChatResult_Info._id);
        queryData.push('s=10');
        queryData.push('t='+type);
        if(data.word)queryData.push('w='+encodeURIComponent(data.word));
        if(data.qq)queryData.push('q='+encodeURIComponent(data.qq));
        if(data.author)queryData.push('a='+encodeURIComponent(data.author));
        if(data.relation)queryData.push('r='+encodeURIComponent(data.relation));

        var url = 'outsidechatresult_s.html?'+queryData.join('&');
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
        B_Pop._init('open',{'type':2,'scroll':false,'title':title,'width':width,'height':height,'shift':2,'content':url},'');
    }
}