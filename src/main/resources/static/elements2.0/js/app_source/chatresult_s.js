requirejs.config({
    shim: {
        'layer': ['jquery'],
        'store.min': ['jquery'],
        'background':{
            deps:['base']
        }
    },
    baseUrl: 'elements2.0/js/lib',
    paths: {
        'jquery' : './jquery-1.9.1.min',
        'app': '../app',
        'base': '../app/base',
        'background': '../app/background'
    }
});
require(['jquery','layer','store.min','base','background','app/outside'], function(){
    store = require('store.min');
    B_Login._checkUpdate();
    if(B_User._isDemoUser()){
        parent.B_Login._openLogin('background');
    }else{
        var postData = {};
        var $_GET = B_Common._getUrl('query');
        if(isNaN($_GET.id)){
            B_Pop._init('msg',{'content':'选择的数据不存在'});
            return false;
        }else{
            M_Init._dataCache['DetailInfoId'] = $_GET.id;
        }
        switch($_GET.t){
            case 'detail':
                if(!$_GET.w || isNaN($_GET.s)){
                    B_Pop._init('msg',{'content':'查看的数据不存在'});
                    return false;
                }
                $_GET.w = B_Common._decodeUrl($_GET.w);
                postData['keywords'] = $_GET.w;
                postData['source_type'] = $_GET.s;
                postData = B_Common._postData(postData);
                F_ChatResult_Info._getDetail($('#bs_detail'),1,postData.join('&'),$_GET.w);
                $('#bs_detail').show();
                break;
            case 'user':
                if(isNaN($_GET.s) || !$_GET.a || !$_GET.q){
                    B_Pop._init('msg',{'content':'查看的数据不存在'});
                    return false;
                }
                $_GET.a = B_Common._decodeUrl($_GET.a);
                $_GET.q = B_Common._decodeUrl($_GET.q);
                postData['qq_id'] = $_GET.q;
                postData['author'] = $_GET.a;
                postData['source_type'] = $_GET.s;
                postData = B_Common._postData(postData);
                F_ChatResult_Info._getDetail($('#bs_user .tk_rts_list'),1,postData.join('&'));
                var keywords = '';
                if($_GET.r){
                    keywords = B_Common._decodeUrl($_GET.r);
                    keywords = keywords.split(' ');
                    keywords = keywords.join('<br>');
                }
                $('.tk_rt_topic_man_keyword_list').html('发言关键词：<br>'+keywords);
                $('#bs_user').show();
                break;
            case 'topic':
                if(isNaN($_GET.s) || !$_GET.w){
                    B_Pop._init('msg',{'content':'查看的数据不存在'});
                    return false;
                }
                $_GET.w = B_Common._decodeUrl($_GET.w);
                F_ChatResult_Info._getSession($_GET.w,$_GET.s);
                $('#bs_topic').show();
                break;
        }
    }
});
var F_ChatResult_Info = {
    _getDetail:function(dom,page,postData,keyword,type){
        var index = (page-1)*B_Page._size;
        var postData2 = {};
        postData2['info_id'] = M_Init._dataCache['DetailInfoId'];
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
                            dom.append(F_ChatResult_Info._htmlTopic(data.data.list,isEnd));
                            break;
                        default:
                            dom.append(F_ChatResult_Info._htmlDetail(data.data.list,isEnd,keyword));
                            break;
                    }
                    if(isEnd){
                        dom.find('.tk_rt_topic_man_more span').unbind('click');
                    }else{
                        dom.find('.tk_rt_topic_man_more span').bind('click',function(){
                            F_ChatResult_Info._getDetail(dom,(page+1),postData,keyword,type);
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
    _getSession:function(topicId,sourceType){
        var dom = $('#bs_topic_list');
        var postData = {};
        postData['index'] = 0;
        postData['limit'] = 5;
        postData['topic_id'] = topicId;
        postData['info_id'] = M_Init._dataCache['DetailInfoId'];
        postData = B_Common._postData(postData);
        B_Port._ajax('talkTopic','get',true,postData,function(){
                dom.html(B_Pre._loading());
            },function(){
                dom.html('');
            },function(data,msg){
                if(data.get && data.get.length>0){
                    var str = '<ul>';
                    var sessionId = '';
                    for(var i=0;i<data.get.length;i++){
                        if(i==0)sessionId = data.get[i].session_id;
                        str += F_ChatResult_Info._htmlSession(data.get[i],i,sourceType);
                    }
                    str += '</ul>';
                    dom.html(str);
                    if(sessionId != ''){
                        F_ChatResult_Info._getSessionDetail(topicId,sessionId,sourceType);
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
                                F_ChatResult_Info._getSessionDetail(topicId,sessionId,sourceType);
                            }
                        });
                    });

                }else{
                    dom.html('暂无数据');
                }
            },function(data,msg,code){
                dom.html(B_Pre._empty(msg));
            }
        )
    },
    _getSessionDetail:function(topicId,sessionId,sourceType){
        var postData = {};
        postData['topic_id'] = topicId;
        postData['session_id'] = sessionId;
        postData['source_type'] = sourceType;
        postData = B_Common._postData(postData);
        F_ChatResult_Info._getDetail($('#bs_topic_detail'),1,postData,null,'topic');
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
                        <dd>'+B_Common._focusKeywords(keyword,data[i].source.content)+'</dd>\
                    </dl>';
        }
        str += isEnd ? '<div class="tk_rt_topic_man_more"><span>已显示全部</span></div>' : '<div class="tk_rt_topic_man_more"><span>点击查看更多</span></div>';
        return str;
    }
}


