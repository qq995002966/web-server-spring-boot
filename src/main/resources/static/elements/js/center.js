var G_GameId = G_Game._id();
var G_ServiceStatus = true;
var G_ServerClose = false;
var G_ServiceGames = [];
var isUseKeywordReset = false;
var U_Dom = {
    _contacter:function(){
        var str = '\
        <div id="contacter" class="c_bgWhite">\
            <div class="c_relative">\
            <span class="l_qq c_img c_borderB" style="color: #FFFFFF"></span>\
            <span class="l_qrcode c_img" style="color: #FFFFFF"></span>\
            <i class="c_img"></i>\
            </div>\
        </div>';
        $('body').append(str);
        contacter();
    },
    _menu:function(current){
        var menuInit = {
            '游戏内数据服务':{
                '2-1':['潜在流失玩家定位',G_Jump._getUrl('alarmLost'),'i10'],
                '2-2':['潜在付费玩家定位',G_Jump._getUrl('alarmPayUser'),'i11'],
                '2-3':['玩家属性聚类',G_Jump._getUrl('alarmAttribute'),'i12'],
                '2-4':['海量日志搜索',G_Jump._getUrl('alarmLog'),'i13'],
                '2-5':['数值合理性评估',G_Jump._getUrl('innerRationality'),'i14']
                /*'2-5':['经济平衡性分析',G_Jump._getUrl('alarmEn'),'i5']*/
            },
            '深度定制分析报告':{
                '4-1':['定制报告',null,'i15',{
                    '4-1-1':['热门游戏解读报告',G_Jump._getUrl('reportHot')],
                    '4-1-2':['细分市场深度解读报告',G_Jump._getUrl('reportDeep')],
                    '4-1-3':['竞品游戏综合分析报告',G_Jump._getUrl('reportRival')],
                    '4-1-4':['游戏全行业分析报告',G_Jump._getUrl('reportGuide')]
                }]
            },
            '游戏外数据服务':{
                '1-1':['预警服务',null,'i2',{
                    '1-1-1':['突发问题预警',G_Jump._getUrl('alarmSuddenly')]
                }],
                '1-2':['监控任务',null,'i4',{
                    '1-2-2':['热词定制',G_Jump._getUrl('reci')],
                    '1-2-3':['舆情助手',G_Jump._getUrl('yuqin')]
                }],
                '1-3':['关键事件分析',null,'i3',{
                    '1-3-1':['流失原因分析',G_Jump._getUrl('eventLost')]
                }],
                '1-4':['玩家行为分析',null,'i1',{
                    '1-4-1':['画像追踪',G_Jump._getUrl('portrayal')],
                    '1-4-2':['聊天分析',G_Jump._getUrl('chat')],
                    /*'1-4-3':['玩家画像报告',G_Jump._getUrl('actionReport')],
                    '1-4-4':['定制数据挖掘分析报告',G_Jump._getUrl('actionBespoke')]*/
                }]
                /*'1-5':['游戏行业分析',null,'i6',{
                    '1-5-1':['游戏行业报告',G_Jump._getUrl('tradeReport')]
                }]*/
            },
            '系统设置':{
                '3-1':['账户中心',G_Jump._getUrl('account'),'i7'],
                '3-2':['续费管理',G_Jump._getUrl('renew'),'i8']
                /*'3-3':['客户服务',G_Jump._getUrl('faq'),'i9']*/
            }
        };
        var str = '\
                    <div class="ml_logo u_img"></div>\
                    <div class="ml_info c_relative"><label>'+G_Login._nick('head')+'</label><span>登出</span></div>';
        $.each(menuInit,function(key,value){
            str += '<div class="ml_title">'+key+'</div>';
            $.each(value,function(baseId,base){
                var childStr = '';
                var childChoosed = false;
                str += '<dl data-i="'+baseId+'" class="c_cursor';
                str += (baseId == current) ? ' dlOn' : '';
                if(base[3]){
                    str += '"><dt class="'+base[2]+' u_img"></dt>';
                    if(key == '系统设置'){
                        str += '<dd>';
                    }else{
                        str += '<dd style="color: #CCCCCC">'
                    }
                    str += base[0]+'</dd>';
                    $.each(base[3],function(childId,child){
                        childStr += '<li data-i="'+childId+'" class="c_cursor';
                        if(childId == current){
                            childStr +=  ' liOn';
                            childChoosed = true;
                        }
                        childStr += '" onclick="G_Jump._go(\'base\',\''+child[1]+'\')">'+child[0]+'</li>';
                    })
                    /*
                    if(childChoosed){
                        str += '<i class="glyphicon glyphicon-triangle-bottom"></i></dl>';
                        str += '<ul>';
                    }else{
                        str += '<i class="glyphicon glyphicon-triangle-right"></i></dl>';
                        str += '<ul class="c_none">';
                    }
                    */
                    str += '<i class="glyphicon glyphicon-triangle-bottom"></i></dl>';
                    str += '<ul>';
                    str += childStr+'</ul>';
                }else{
                    str += '" onclick="G_Jump._go(\'base\',\''+base[1]+'\')"><dt class="'+base[2]+' u_img"></dt><dd>'+base[0]+'</dd>';
                    str += '</dl>';
                }
            });
        })
        $('#MLeft').html(str);

        $('#MLeft .ml_info label').click(function(){
            G_Jump._go('user');
        });
        $('#MLeft .ml_info span').click(function(){
            G_Login._out(G_Jump._getUrl('index'));
        });
        $('.ml_logo').click(function(){
            G_Jump._go('index');
        });
        $('#MLeft dl').each(function(index){
            switch(index+''){
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                //case '4':
                    $(this).click(function(){
                        /*
                        if($(this).find('i').hasClass('glyphicon-triangle-right')){
                            $(this).find('i').removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                            $(this).siblings('dl').find('i').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                            $('#MLeft ul').eq(index).fadeIn('slow').siblings('ul').hide();
                        }else{
                            $('#MLeft ul').eq(index).fadeOut('slow');
                            $(this).find('i').addClass('glyphicon-triangle-right').removeClass('glyphicon-triangle-bottom');
                        }
                        */
                        if($(this).find('i').hasClass('glyphicon-triangle-right')){
                            $(this).find('i').removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                            $('#MLeft ul').eq(index-5).fadeIn('slow');
                        }else{
                            $('#MLeft ul').eq(index-5).fadeOut('slow');
                            $(this).find('i').addClass('glyphicon-triangle-right').removeClass('glyphicon-triangle-bottom');
                        }
                    });
                    break;
            }
        });
        U_Dom._contacter();
    },
    _tip:function(dom,content,type){
        switch(type){
            case 'link':
                content += '<br><a href="javascript:void(0);" class="py_colorg" onclick="F_Common._openDetail(\'\',\'\',3)">关注排名</a>？'
                G_Pop._init('tips',{dom:dom,content:'<span class="py_colorb">'+content+'</span>',type:4,color:'#FDF3BF'});
                break;
            default:
                G_Pop._init('tips',{dom:dom,content:content,type:2,color:'#83B935'});
                break;
        }
    }
}
var U_Service = {
    _init:{'face':['画像追踪',1,1],'assistant':['舆情助手',2,2],'talk':['聊天分析',3,3],'hotword':['热词定制',4,4],'suddenly':['突发问题预警',5,5],'lost':['流失分析',6,7],'insidelost':['潜在流失用户定位',7,8],'insidepay':['潜在付费玩家定位',8,9],'insideattribute':['玩家属性聚类',9,11],'insidelog':['海量日志搜索',10,12],'innerrationality':['数值合理性评估',11,13],'reporthot':['热门游戏解读报告',12,10],'reportdeep':['细分市场深度解读报告',13,14],'reportrival':['竞品游戏综合分析报告',14,15],'reportguide':['游戏全行业分析报告',15,16]},
    _name:function(id){
        var back = ['',''];
        $.each(U_Service._init,function(key,value){
            if(value[1]+'' == id+''){
                back = [value[0],value[2]];
            }
        });
        return back;
    },
    _checkStatus:function(current,callback){
        var currentData = U_Service._init[current];
        G_Port._ajax('serviceStatus','get',true,null,null,null,function(data,msg){
                var hasServers = false;
                var status = '';
                var content = '';
                if(data.get && data.get.length>0){
                    for(var i=0;i<data.get.length;i++){
                        if(currentData[1] == data.get[i].service_type){
                            hasServers = true;
                            status = data.get[i].service_status;
                            if(currentData[1] == 3 && data.get[i].remain_times == 0)status = 5;
                            if(data.get[i].project_id+'' != '0' && data.get[i].service_status != 3 && data.get[i].service_status != 4 && data.get[i].service_status != 5)G_ServiceGames.push($.trim(data.get[i].project_id));
                        }
                    }
                }
                if(!hasServers){
                    G_ServiceStatus = false;
                    content = '您尚未开通'+currentData[0]+'服务，请开通！';
                    G_ServerClose = true;
                }else{
                    switch(status+''){
                        case '3':
                        case '4':
                            G_ServerClose = true;
                            content = currentData[0]+'服务已到期，请续费 ！';
                            break;
                        case '5':
                            G_ServerClose = true;
                            /*
                            content = currentData[0]+'服务上传次数已用尽，请购买 ！';
                            U_Service._confirm(currentData[2],content);
                            */
                            break;
                    }
                }
                var useImg = false;
                if(G_ServerClose){
                    U_Service._isBuy(current);
                    switch(current){
                        case 'face':
                            useImg = true;
                            /*
                            G_GameId = (G_GameId == demoProjectId()) ? G_GameId : demoProjectId();
                            U_Service._confirm(currentData[2],content,function(){
                                F_Base._getInfo();
                            });
                            */
                            break;
                        case 'suddenly':
                            useImg = true;
                            /*
                            G_GameId = (G_GameId == demoProjectId()) ? G_GameId : demoProjectId();
                            U_Service._confirm(currentData[2],content,function(){
                                F_Base._getInfo();
                            });
                            */
                            break;
                        case 'lost':
                            useImg = true;
                            /*
                            G_GameId = (G_GameId == demoProjectId()) ? G_GameId : demoProjectId();
                            U_Service._confirm(currentData[2],content,function(){
                                F_Radar._getInfo();
                                F_Reason._getDate();
                            });
                            */
                            break;
                        case 'hotword':
                            useImg = true;
                            /*
                            U_Service._confirm(currentData[2],content,function(){
                                F_Info._getChartInfo();
                            });
                             */
                            break;
                        case 'insidelost':
                        case 'insidepay':
                            useImg = true;
                            break;
                        case 'talk':
                            if(!G_ServiceStatus)useImg = true;
                            break;
                    }
                    if(useImg)$('#MRight').html('<a href="'+G_Jump._getUrl('item')+'?k='+currentData[2]+'" target="_blank"><img src="elements/img/demo/'+current+'.jpg"></a>');
                }else{
                    switch(current){
                        case 'face':
                            F_Base._getInfo();
                            break;
                        case 'suddenly':
                            if(!($.inArray(G_GameId,G_ServiceGames)>-1)){
                                G_GameId = G_ServiceGames[0];
                            }
                            F_Base._getInfo();
                            break;
                        case 'lost':
                            if(!($.inArray(G_GameId,G_ServiceGames)>-1)){
                                G_GameId = G_ServiceGames[0];
                            }
                            F_Radar._getInfo();
                            F_Reason._getDate();
                            break;
                        case 'hotword':
                            F_Info._getChartInfo();
                            break;
                        case 'talk':
                            F_Common._upload('.tk_upload_btn');
                            break;
                    }
                }
                if(!useImg){
                    switch(current){
                        case 'face':
                            G_Game._dropChoose(G_GameId,$('#bs_game_choose'),'reload');
                            G_Game._dropChoose(G_GameId_Compare,$('#bs_game_choose_compare'),'compare');
                            break;
                        case 'suddenly':
                        case 'lost':
                            var games = '';
                            if(G_ServiceGames.length > 0){
                                games = G_ServiceGames;
                                if(!($.inArray(G_GameId,games)>-1)){
                                    G_GameId = games[0];
                                }
                            }else{
                                games = [demoProjectId()];
                            }
                            G_Game._dropBuyGame(games,G_GameId,$('#bs_game_choose'),currentData[2]);
                            break;
                    }
                }
            },null
        )
    },
    _isBuy:function(current){
        switch(current){
            case 'talk':
                F_Common._buy();
                break;
        }
    },
    _confirm:function(id,content,callback){
        G_Pop._init('confirm',{skin:'layerCheck-class',title:'提示',content:content,btn: ['马上购买','查看DEMO']},function(){
            G_Jump._go('base',G_Jump._getUrl('item')+'?k='+id)
        },callback);
    }
}
var U_InnderGame = {
    _getOrderGame:function (column,noGameHtml) {
        G_Port._ajax('innerGame','get',true,'service_id='+F_ServiceId,null,null,function(data,msg){
                if(data && data.length>0){
                    G_Game._dropInnerGame(data,G_GameId,$('#bs_game_choose'));
                    switch(column){
                        case 'insidelost':
                        case 'insidepay':
                            F_Search._getSearchMeta();
                            F_Chart._getSingle();
                            break;
                        case 'insideattribute':
                            F_Search._getSearchMeta();
                            break;
                        case 'insidelog':
                            F_Tab._getTab();
                            break;
                    }
                }else{
                    $('#MRight').html(noGameHtml);
                }
            },function(data,msg,code){
                G_Pop._init('open',{content:msg});
            }
        )
    }
}
var U_Book = {
    _checkStatus:function(current,callback){
        var currentData = U_Service._init[current];
        G_Port._ajax('getBookList','get',true,'item_id='+currentData[2],null,null,function(data,msg){
            if(data && data.length > 0){
                current = current+'_book';
                U_InnderGame._getOrderGame(current,'<a href="'+G_Jump._getUrl('item')+'?k='+currentData[2]+'" target="_blank"><img src="elements/img/demo/'+current+'.jpg"></a>');
            }else{
                $('#MRight').html('<a href="'+G_Jump._getUrl('item')+'?k='+currentData[2]+'" target="_blank"><img src="elements/img/demo/'+current+'.jpg"></a>');
            }
        },null)
    }
}
var U_Common = {
    _tabChoose:function(type,tabDom,tabClass,contentDom,chartDom){
        switch(type){
            case 'face':
                tabDom.each(function(index){
                    $(this).click(function(){
                        switch(index){
                            case 1:
                                F_Tag._getInfo(1);
                                break;
                            case 2:
                                F_Tag._getInfo(2);
                                F_Tag._getInfo(3);
                                break;
                            case 3:
                                F_Tag._getInfo(4);
                                setTimeout(function(){
                                    F_Tag._getInfo(5);
                                },600);
                                break;
                        }
                        $(this).addClass(tabClass).siblings().removeClass(tabClass).end();
                        contentDom.each(function(c_index){
                            if(c_index == index){
                                contentDom.eq(c_index).show();
                            }else{
                                contentDom.eq(c_index).hide();
                            }
                        })
                        chartDom.each(function(c_index){
                            if(c_index == index){
                                chartDom.eq(c_index).show();
                            }else{
                                chartDom.eq(c_index).hide();
                            }
                        })
                    });
                })
                break;
            case 'lost':
                tabDom.each(function(index){
                    $(this).click(function(){
                        $(this).addClass(tabClass).siblings().removeClass(tabClass).end();
                        F_Reason._getDetail();
                    });
                });
                break;
            default:
                tabDom.each(function(index){
                    $(this).click(function(){
                        if(typeof(tabClass) != 'undefined' && tabClass){
                            $(this).addClass(tabClass).siblings().removeClass(tabClass);
                        }
                        if(typeof(contentDom) != 'undefined' && contentDom){
                            contentDom.each(function(c_index){
                                c_index == index ?  contentDom.eq(c_index).show() : contentDom.eq(c_index).hide();
                            })
                        }
                    })
                });
                break;
        }
    },
    _tableHover:function () {
        $('.table-part tbody tr').on('click',function(){
            $('.table-part tbody tr').removeClass('click-color');
            $(this).addClass('click-color');
        });
    }
}
var U_List = {
    _buff:{},
    _postData:{type:'',classify:'',data:''},
    _keywords:'',
    _onFocus:function(){
        var itemDom = $('.data-content-left .data-content-left-list dl');
        itemDom.each(function(){
            if(!$(this).hasClass('dlOn')){
                $(this).hover(function(){
                    $(this).addClass('dlHover');
                },function(){
                    $(this).removeClass('dlHover');
                });
            }
            $(this).click(function(){
                if(!$(this).hasClass('dlOn')){
                    var ikey = $(this).attr('data-i');
                    var tkey = $(this).attr('data-t');
                    if(isUseKeywordReset)U_List._keywords = $(this).attr('data-w');
                    if(ikey && tkey)U_List._getDetail(ikey,tkey,1);
                    $(this).addClass('dlOn').siblings('dl').removeClass('dlOn');
                }
            });
        });
    },
    _focusKeywords:function(data,lightkeywords){
        var back = data;
        if(U_List._keywords != '' || (lightkeywords && lightkeywords != '')){
            var keywords = (lightkeywords && lightkeywords != '') ? lightkeywords : U_List._keywords;
            keywords = keywords.toLowerCase();
            keywords = keywords.split(',');
            var index = $.inArray('ss',keywords);
            if(index > -1){
                back = G_Common._focusKeywords('ss',back);
                keywords.splice(index,1);
            }
            for(var i=0;i<keywords.length;i++){
                back = G_Common._focusKeywords(keywords[i],back);
            }
        }
        return back;
    },
    _pageGo:function(page){
        $('.data-content-left .page-list .prev').click(function(){
            U_List._pageRequest(parseInt(page)-1);
        });
        $('.data-content-left .page-list .next').click(function(){
            U_List._pageRequest(parseInt(page)+1);
        });
        $('.data-content-left .page-list button').click(function(){
            var goPage = $.trim($('.data-content-left .page-list input').val());
            if(goPage == '' || isNaN(goPage)){
                G_Pop._init('msg',{content:'页码必须为数字,请确认！'});
                return false;
            }
            if(parseInt(goPage) <= 0){
                G_Pop._init('msg',{content:'页码错误,请确认！'});
                return false;
            }
            if(parseInt(goPage) == parseInt(page)){
                return false;
            }
            U_List._pageRequest(goPage);
        });
        submitBind($('.data-content-left .page-list button'),$('.data-content-left .page-list input'));
    },
    _pageRequest:function(page){
        var total = $('.data-content-left .page-list button').attr('data-a');
        if(page > 0 && parseInt(page)<=parseInt(total)){
            U_List._getList(page);
        }
    },
    _conditionList:function(page){
        var postData = [];
        var index = (page-1)*G_Page._size;
        switch(U_List._postData.type){
            case 'keyword':
                U_List._keywords = U_List._postData.data.word;
                postData.push('order_by_field=publish_time');
                postData.push('order_type=desc');
                postData.push('project_id='+G_GameId);
                postData.push('data_date_start='+U_List._postData.data.begin);
                postData.push('data_date_end='+U_List._postData.data.end);
                postData.push('keywords='+encodeURIComponent(U_List._postData.data.word));
                postData.push('index='+index);
                postData.push('limit='+G_Page._size);
                postData.push('only_query_title=1');
                break;
            case 'suddenly':
                postData.push('data_date='+encodeURIComponent(U_List._postData.data.data_date));
                postData.push('sub_type='+encodeURIComponent(U_List._postData.data.sub_type));
                postData.push('project_id='+G_GameId);
                postData.push('index='+index);
                postData.push('limit='+G_Page._size);
                break;
        }
        return postData.join('&');
    },
    _getList:function(page){
        var port = 'forumSearch';
        switch(U_List._postData.type){
            case 'suddenly':
                isUseKeywordReset = true;
                port = 'sigmaItWarnDetail';
                $('.search_condition .search_keywords').html('所选问题类型：'+U_List._postData.classify);
                $('.search_condition .search_date').html('反馈所属时间：'+U_List._postData.data.data_date);
                break;
            default:
                $('.search_condition .search_keywords').html('已选关键词：'+U_List._postData.data.word);
                $('.search_condition .search_date').html('日期范围：'+U_List._postData.data.begin+' 到 '+U_List._postData.data.end);
                break;
        }
        var postData = U_List._conditionList(page);
        var domList = $('.data-content-left .data-content-left-list');
        var domPage = $('.data-content-left .page-list');
        var domContent = $('.data-content-right .data-content-right-detail');
        G_Port._ajax(port,'get',true,postData,function(){
            $('.data-content-left .data-content-left-list,.data-content-left .data-content-left-list *').unbind().removeData();
            domList.html(G_Pre._loading('c_padding30'));
            domContent.html('');
            domPage.html('');
        },function(){
            domList.html('');
        },function(data,msg){
            if(data.data && data.data.list.length > 0){
                U_List._buff = data.data.list;
                domList.html(U_List._htmlList(data.data));
                domPage.html(G_Page._show({total:data.data.total,page:page},'simple'));
                U_List._onFocus();
                U_List._pageGo(page);
                domList.perfectScrollbar();
            }else{
                domList.html('<div class="c_empty c_colorR">当前时间段暂无数据</div>');
                domContent.html('');
            }
        },function(data,msg,code){
            domList.html(G_Pre._empty(msg));
        })
    },
    _getDetail:function(ikey,tkey,page){
        var domContent = $('.data-content-right .data-content-right-detail');
        G_Port._ajax('forumDetail','get',true,'project_id='+G_GameId+'&info_id='+ikey+'&title_id='+tkey+'&index='+(page-1)*G_Page._size+'&limit='+G_Page._size,function(){
                if(page == 1){
                    $('.data-content-right, .data-content-right *').unbind().removeData();
                    domContent.html(G_Pre._loading('c_padding30'));
                }
            },function(){
                if(page == 1)domContent.html('');
            },function(data,msg){
                if(page == 1){
                    var titleData = U_List._getTitle(ikey,tkey);
                    if(titleData){
                        domContent.html(U_List._htmlTitle(titleData));
                    }
                }
                $('.data-content-right .data-content-right-detail .data-content-right-list').append(U_List._htmlDetail(data.data,page,ikey,tkey));
                $('.data-content-right').perfectScrollbar();
            },function(data,msg,code){
                if(page == 1)domContent.html(G_Pre._empty(msg));
            }
        )
    },
    _getTitle:function(infoId,titleId){
        if(U_List._buff){
            var data = U_List._buff;
            for(var i=0;i<=data.length;i++){
                if(data[i].source.info_id == infoId && data[i].source.title_id == titleId){
                    return data[i].source;
                }
            }
        }
        return '';
    },
    _htmlList:function(data){
        var str = '';
        var imgs = [];
        for(var i=0;i<data.list.length;i++){
            var hasImg = '';
            var lightTags = '';
            if(data.list[i].source.attach_content && data.list[i].source.attach_content.length > 0){
                var attach_content = G_Common._imgDecode(data.list[i].source.attach_content);
                eval("attach_content="+attach_content);
                for(var m=0;m<attach_content.length;m++){
                    imgs.push(attach_content[m].img_url);
                }
                hasImg = '<i class="c_img"></i>';
            }
            if(data.list[i].source.lighttower_tags && data.list[i].source.lighttower_tags != ''){
                var lightTagsArr = data.list[i].source.lighttower_tags.split(',');
                var lightTags = [];
                for(var t=0;t<lightTagsArr.length;t++){
                    lightTagsArr[t] = lightTagsArr[t].split(':');
                    if(lightTagsArr[t][1] && lightTagsArr[t][1] != ''){
                        lightTags.push(lightTagsArr[t][1]);
                    }
                }
                if(lightTags.length > 0)lightTags = lightTags.join(',');
            }
            var useClass = '';
            if(i==0){
                if($('.data-content-right .data-content-right-detail').html() == ''){
                    useClass = 'dlOn';
                    if(isUseKeywordReset)U_List._keywords = lightTags;
                    U_List._getDetail(data.list[i].source.info_id,data.list[i].source.title_id,1);
                }
            }
            var content = (data.list[i].source.content.length > 60) ? data.list[i].source.content.substr(0,60)+'..' : data.list[i].source.content;
            var time = isUseKeywordReset ? '问题类型：'+(data.list[i].source.lighttower_class ? data.list[i].source.lighttower_class.replace('/-1',''):'') :'时间：'+G_Date._dateFormat('mini',data.list[i].source.publish_time);
            str += '\
                <dl class="'+useClass+'" data-i="'+data.list[i].source.info_id+'" data-t="'+data.list[i].source.title_id+'"  data-w="'+lightTags+'">\
                    <dt>'+hasImg+' '+U_List._focusKeywords(data.list[i].source.title,lightTags)+'</dt>\
                    <dd>\
                        <span>作者：'+data.list[i].source.author+'</span>\
                        <span>来源：'+data.list[i].source.crawler_name+'</span>\
                        <span>回复数：'+data.list[i].source.reply_num+'</span>\
                        <span>'+time+'</span>\
                    </dd>\
                </dl>';
        }
        if(imgs.length >0){
            G_Common._imgBuff(imgs);
        }
        return str;
    },
    _htmlTitle:function(data){
        var str = '';
        var img = '';
        if(data.attach_content && data.attach_content.length > 0){
            var attach_content = G_Common._imgDecode(data.attach_content);
            eval("attach_content="+attach_content);
            for(var i=0;i<attach_content.length;i++){
                try{
                    img += '<br><img src="'+decodeURIComponent(attach_content[i].img_url)+'">';
                }catch(e){}
            }
        }
        str += '\
            <dl class="data-content-right-title">\
                <dt>'+U_List._focusKeywords(data.title)+'</dt>\
                <dd class="c_marginB10">\
                    <p><i class="glyphicon glyphicon-link"></i> 采集地址：<a href="'+data.from_url+'" target="_blank">'+data.from_url+'</a></span></li>\
                    <p><i class="glyphicon glyphicon-edit"></i> 回复数：<span class="reply-num">'+data.reply_num+'</span></li>\
                    <p><i class="glyphicon glyphicon-time"></i> 发帖时间:<span class="publish-time">'+data.publish_time+'</span></li>\
                </dd>\
            </dl>\
            <div class="data-content-right-list">\
                <i class="topOneImg"></i>\
                <dl><dt>\
                <i class="glyphicon glyphicon-user"></i>'+data.author+'　　\
                <i class="glyphicon glyphicon-time"></i>'+data.publish_time+'</dt>\
                <dd>'+U_List._focusKeywords(data.content)+img+'</dd>\
            <dl></div>';

        return str;
    },
    _htmlDetail:function(data,page,ikey,tkey){
        var isEnd = false;
        if((G_Page._size*page) > data.total){
            isEnd = true;
        }
        var str = '';
        for(var i=0;i<data.list.length;i++){
            var imgs = [];
            var img = '';
            if(data.list[i].source.attach_content && data.list[i].source.attach_content.length > 0){
                var attach_content = G_Common._imgDecode(data.list[i].source.attach_content);
                eval("attach_content="+attach_content);
                for(var m=0;m<attach_content.length;m++){
                    try{
                        imgs.push(attach_content[m].img_url);
                        img += '<br><img src="'+decodeURIComponent(attach_content[m].img_url)+'">';
                    }catch(e){}
                }
            }
            if(imgs.length >0){
                G_Common._imgBuff(imgs);
            }
            str += '\
                <dl>\
                    <dt>\
                    <i class="glyphicon glyphicon-user"></i>'+data.list[i].source.author+'　　\
                    <i class="glyphicon glyphicon-time"></i>'+data.list[i].source.publish_time+'\
                    <span class="floor-num">'+(((page-1)*G_Page._size)+i+2)+'楼</span></dt>\
                    <dd>'+U_List._focusKeywords(data.list[i].source.content)+img+'</dd>\
                </dl>';
        }
        if(isEnd){
            str += '<span class="loading-state tg-assist-btn">已经显示全部</span>';
        }else{
            str += '<span class="c_cursor loading-state" onclick="U_List._getMore('+ikey+',\''+tkey+'\','+(page+1)+')">点击加载更多</span>';
        }
        return str;
    },
    _getMore:function(ikey,tkey,page){
        $('.loading-state').remove();
        U_List._getDetail(ikey,tkey,page);
    }
}
function contacter(){
    var w = $(window).width()-1175-90;
    $("#contacter").css({
        right:w/2+"px"
    });
    $('#contacter span').each(function(index){
        $(this).hover(function(){
            switch(index){
                case 0:
                    $(this).removeClass('l_qq c_img').html('在线<br>客服');
                    break;
                case 1:
                    $(this).removeClass('l_qrcode c_img').html('订阅<br>我们');
                    $("#contacter i").show();
                    break;
            }
        },function(){
            switch(index){
                case 0:
                    $(this).addClass('l_qq c_img').html('');
                    break;
                case 1:
                    $(this).addClass('l_qrcode c_img').html('');
                    $("#contacter i").hide();
                    break;
            }
        });
        $(this).click(function(){
            switch(index){
                case 0:
                    G_Jump._go('open',G_Common._qqUrl());
                    break;
            }
        });
    });
}