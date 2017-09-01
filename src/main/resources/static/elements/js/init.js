var G_GameId = G_Game._id();
var G_Collects = [];
var G_Services = null;
function openFaq(){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'常见问题','width':'720px','height':'520px','shift':2,'content':'faq_s.html'},'');
}
function openOpinion(){
    G_Pop._init('close');
    isDemoUser() ? openLogin() : G_Pop._init('open',{'type':2,'scroll':true,'title':'意见反馈','width':'720px','height':'520px','shift':2,'content':'opinion_s.html'},'');
}
function openPlan(gameName){
    G_Pop._init('close');
    if(isDemoUser()){
        openLogin();
    }else{
        var user = G_Login._user.user;
        if(!!user && !!user.mobile && user.mobile != ''){
            if(!gameName)gameName = '';
            G_Pop._init('open',{'type':2,'scroll':true,'title':'改进计划','width':'720px','height':'550px','shift':2,'content':'plan_s.html?n='+gameName},'');
        }else{
            openBind();
        }
    }
}
function openWord(word){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'热词词汇','width':'360px','height':'400px','shift':2,'content':'word_s.html?w='+encodeURIComponent(word)},'');
}
var M_MenuHideTimeOut;
var menuSlider = {
    _init:function(current){
        function setSlider(index,hasCurrent){
            var slider = $('.h_menu .h_slider');
            index >= 0 ? slider.show() : slider.hide();
            var left= 0;
            switch(index+''){
                case '0':
                    left = 242;
                    break;
                case '1':
                    left = 338;
                    break;
                case '2':
                    left = 430;
                    break;
                case '3':
                    left = 525;
                    break;
                case '4':
                    left = 620;
                    break;
            }
            if(hasCurrent){
                slider.css({left:left+'px'});
            }else{
                slider.animate({left:left+'px'},{queue:false});
            }
        }
        setSlider(current,true);
        $('.h_menu ul li').each(function(index){
            $(this).hover(
                function(){
                    setSlider(index);
                    switch(index){
                        case 1:
                            clearTimeout(M_MenuHideTimeOut);
                            arrowPopOpen('light',{'open':$(this).find('.h_light'),'close':$(".h_quick"),'close2':$(".h_service")});
                            if($(".bs_history").html() == '')G_Game._menuHistoryList();
                            G_Game._menuCollectList();
                            if($(".bs_favorite").html() == '')G_Game._menuGuessLikeList();
                            break;
                        case 3:
                            clearTimeout(M_MenuHideTimeOut);
                            arrowPopOpen('service',{'open':$(this).find('.h_service'),'close':$(".h_quick"),'close2':$(".h_light")});
                            if($(".bs_service_inside").html() == '')G_Service._menuList();
                            break;
                    }
                },
                function(){
                    setSlider(current);
                    switch(index){
                        case 1:
                            M_MenuHideTimeOut = setTimeout(function(){
                                $('.h_light').hide();
                            },600);
                        case 3:
                            M_MenuHideTimeOut = setTimeout(function(){
                                $('.h_service').hide();
                            },600);

                    }
                }
            );
            /*
             $(this).click(function(){
             switch(index){
             case 1:
             G_Jump._go('light');

             arrowPopOpen('light',{'open':$(this).find('.h_light'),'close':$(".h_quick")});
             if($(".bs_history").html() == '')G_Game._menuHistoryList();
             G_Game._menuCollectList();
             if($(".bs_favorite").html() == '')G_Game._menuGuessLikeList();

             break;
             }
             });
             */
        });
    }
}
var clickScroll = {
    _init:function(preDom,nextDom,scrollDom,sliderDom,itemWidth,perScrollNumber,perPageCount,onClass){
        var page = 0;
        var itemCount = scrollDom.find("li").length; //总个数
        itemWidth = itemWidth * perScrollNumber;

        if(perPageCount >= itemCount){
            nextDom.removeClass(onClass).unbind();
        }
        if(page == 0){
            preDom.removeClass(onClass).unbind();
        }
        nextDom.click(function(){
            nextClick()
        });
        preDom.click(function(){
            preClick()
        });
        function nextClick(){
            if(!scrollDom.is(":animated")){
                if(itemCount <= perPageCount){
                    return;
                }
                scrollDom.animate({left:'-='+itemWidth},"slow");
                if(sliderDom && sliderDom != '')sliderDom.animate({left:'-='+itemWidth},"slow");
                page++;
                if(((page*perScrollNumber)+perPageCount) == itemCount){
                    nextDom.removeClass(onClass).unbind();
                }
                if(page > 0){
                    preDom.bind("click",function(){
                        preClick()
                    }).addClass(onClass);
                }
            }
        }
        function preClick(){
            if(!scrollDom.is(":animated")){
                if(page == 0){
                    return;
                }
                scrollDom.animate({left:'+='+itemWidth},"slow");
                if(sliderDom && sliderDom != '')sliderDom.animate({left:'+='+itemWidth},"slow");
                page--;
                if(page == 0){
                    preDom.removeClass(onClass).unbind();
                }
                if((page+perPageCount) < itemCount){
                    nextDom.bind("click",function(){
                        nextClick();
                    }).addClass(onClass);
                }

            }
        }
    }
}
function quicker(){
    var w = $(window).width()-1175-110;
    $("#quicker").css({
        right:w/2+"px"
    });
    $("#lightQuicker").css({
        right:w/2+"px"
    });
    $('#quicker span').each(function(index){
        $(this).hover(function(){
            switch(index){
                case 0:
                    $(this).removeClass('q_qq c_img').html('在线<br>客服');
                    break;
                case 1:
                    $(this).removeClass('q_faq c_img').html('常见<br>问题');
                    break;
                case 2:
                    $(this).removeClass('q_plus c_img').html('添加<br>游戏');
                    break;
                case 3:
                    $(this).removeClass('q_msg c_img').html('意见<br>反馈');
                    break;
                case 4:
                    $(this).removeClass('q_qrcode c_img').html('订阅<br>我们');
                    $("#quicker i").show();
                    break;
                case 5:
                    $(this).removeClass('q_top c_img').html('返回<br>顶部');
                    break;
            }
        },function(){
            switch(index){
                case 0:
                    $(this).addClass('q_qq c_img').html('');
                    break;
                case 1:
                    $(this).addClass('q_faq c_img').html('');
                    break;
                case 2:
                    $(this).addClass('q_plus c_img').html('');
                    break;
                case 3:
                    $(this).addClass('q_msg c_img').html('');
                    break;
                case 4:
                    $(this).addClass('q_qrcode c_img').html('');
                    $("#quicker i").hide();
                    break;
                case 5:
                    $(this).addClass('q_top c_img').html('');
                    break;
            }
        });
        $(this).click(function(){
            switch(index){
                case 0:
                    G_Jump._go('open',G_Common._qqUrl());
                    break;
                case 1:
                    openFaq();
                    break;
                case 2:
                    openPlan();
                    break;
                case 3:
                    openOpinion();
                    break;
                case 5:
                    GoToTop();
                    break;
            }
        });
    });
}
function maskShow(dom,maskDom,maskClass,shadeDom){
    dom.each(function(index){
        $(this).hover(
            function(){
                if(maskDom != ''){
                    maskDom.eq(index).addClass(maskClass);
                }
                shadeDom.eq(index).show();
            },
            function(){
                if(maskDom != ''){
                    maskDom.eq(index).removeClass(maskClass);
                }
                shadeDom.eq(index).hide();
            }
        )
    });
}
function tabChoose(dom,domSlider,width,diff,onClass,type,current,contentDom,chartDom){
    switch(type){
        case 'articleTab':
            var lastChoosed = '';
            dom.each(function(index){
                if($(this).hasClass('liOn'))lastChoosed = index;
                $(this).hover(function(){
                    if($(this).attr('data-pop') == 1){
                        $(this).find('ul').show();
                    }
                },function(){
                    if($(this).attr('data-pop') == 1){
                        $(this).find('ul').hide();
                    }
                });
            });
            $('#choose_tab ul li a').each(function(){
                $(this).click(function(){
                    var type = $(this).attr('data-t');
                    var urlQuery = '';
                    switch(type){
                        case 'hot':
                        case 'top':
                            urlQuery = 't='+type;
                            break;
                        case 'main':
                            urlQuery = 't=classify&m='+encodeURIComponent($(this).attr('data-w'));
                            break;
                        case 'sub':
                            urlQuery = 't=classify&m='+encodeURIComponent($(this).attr('data-w'))+'&s='+encodeURIComponent($(this).html());
                            break;
                    }
                    G_Jump._go('base',G_Jump._getUrl('article')+'?'+urlQuery);
                    return;
                });
            });
            break;
        case 'rank':
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    F_List._getData($(this).attr('data-i'));
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                });
            });
            break;
        case 'guideSummary':
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    if(contentDom.eq(index).find('.summary_chart').html() == '')F_General._getThread();
                    contentDom.eq(index).show().siblings('.bs_summary_content').hide();
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                });
            });
            break;
        case 'head':
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    contentDom.eq(index).show().siblings('.h_qkArea').hide();
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                });
            });
            break;
        case 'index':
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    contentDom.eq(index).show().siblings('.p_qkArea').hide();
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                })
            });
            break;
        case 'bbs':
            dom.each(function(index){
                $(this).click(function(){
                    switch(index){
                        case 0:
                            F_Forum._getTitle();
                            break;
                        case 1:
                            F_Forum._getEmotion('pos');
                            break;
                        case 2:
                            F_Forum._getEmotion('neg');
                            break;
                        case 3:
                            F_Forum._getUseless();
                            break;
                        case 4:
                            F_Forum._getKeywords();
                            break;
                        case 5:
                            F_Forum._getTopic();
                            break;
                    }
                    contentDom.eq(index).show().siblings().hide();
                    $(this).addClass(onClass).siblings().removeClass(onClass);
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                })
            });
            break;
        case 'tab':
            dom.each(function(index){
                var arrowDom = current;
                $(this).click(function(){
                    switch(index){
                        case 0:
                            current = 0;
                            break;
                        case 1:
                            current = 2;
                            break;
                        case 2:
                            current = 1;
                            break;
                    }
                    contentDom.eq(index).show().siblings('ul').hide();
                    chartDom.eq(index).show().siblings('div').hide();
                    $(this).addClass(onClass).siblings().removeClass(onClass);
                    F_Insight._activePercent(arrowDom,'tab',current);
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                })
            });
            break;
        case 'percent':
            dom.each(function(index){
                if(current == index){
                    $(this).addClass(onClass).siblings().removeClass(onClass);
                    contentDom.eq(index).show().siblings('ul').hide();
                    chartDom.eq(index).show().siblings('div').hide();
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                }
            });
            break;
        case 'scroll':
            dom.each(function(index){
                $(this).click(function(){
                    var sourceType = $(this).attr('data-t');
                    $('#'+chartDom+sourceType).show().siblings().hide();
                    var left = onClass.css('left');
                    if(left == 'auto'){
                        left = 0;
                    }else{
                        left = parseInt(left);
                    }
                    domSlider.animate({
                        left:((index*width)+diff + left)+'px'
                    },function(){});
                })
            });
            break;
        case 'vertical':
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    domSlider.animate({
                        top:((index*width)+diff)+'px'
                    },function(){});
                })
            });
            break;
        case 'article':
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                    $('.mid .top-content .check-more').attr('data-c',$(this).html());
                    F_Classify._getPort(index,$(this).html());
                })
            });
            break;
        case 'search':
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                    switch(index){
                        case 0:
                            $('#bs_search_game').show();
                            $('#bs_search_article').hide();
                            break;
                        case 1:
                            $('#bs_search_article').show();
                            $('#bs_search_game').hide();
                            if($('#bs_search_article .article-list-header-tip').html() == ''){
                                F_Article._getList(1);
                            }
                            break;
                    }
                })
            });
            break;
        case 'data':
            dom.each(function(index){
                if(current == 0)dom.eq(1).hide();
                if(contentDom){
                    if((index+'' == '0' && contentDom == 1) || (index+'' == '1' && contentDom == 2)){
                        F_Common._tabChange(index,dom,domSlider,onClass,width,diff,current);
                    }
                }
                $(this).click(function(){
                    F_Common._tabChange(index,dom,domSlider,onClass,width,diff,current);
                })
            });
            break;
        default:
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    if(typeof(contentDom) != 'undefined' && contentDom){
                        contentDom.each(function(c_index){
                            if(c_index == index){
                                contentDom.eq(c_index).show();
                            }else{
                                contentDom.eq(c_index).hide();
                            }
                        })
                    }
                    if(typeof(chartDom) != 'undefined' && chartDom){
                        chartDom.each(function(c_index){
                            if(c_index == index){
                                chartDom.eq(c_index).show();
                            }else{
                                chartDom.eq(c_index).hide();
                            }
                        })
                    }
                    if(typeof(domSlider) != 'undefined' && domSlider){
                        domSlider.animate({
                            left:((index*width)+diff)+'px'
                        },function(){});
                    }
                })
            });
            break;
    }
}
function itemChoose(dom,onClass,callback){
    dom.each(function(index){
        $(this).click(function(){
            var domIndex = '';
            $('.lt_fmTsTab ul li').each(function(index){
                if($(this).hasClass(onClass)){
                    domIndex = index;
                }
            });
            if(!$(this).hasClass(onClass)){
                var useClass = '';
                switch(domIndex){
                    case 0:
                        useClass = 'lt_fmTsLnOn';
                        break;
                    case 1:
                        useClass = 'lt_fmTsLnOn2';
                        break;
                    case 2:
                        useClass = 'lt_fmTsLnOn3';
                        break;
                }
                $('.lt_fmTsMdArea ul li').each(function(){
                    $(this).find('.lt_fmTsLnMask').removeClass(useClass);
                });
                $(this).addClass(onClass).siblings().removeClass(onClass);
                if($(this).attr('data-w') != '其它')$(this).find('.lt_fmTsLnMask').addClass(useClass);
                callback && callback($(this).attr('data-w'));
            }
        })
    })
}
var C_Dom = {
    _articleTab:function(type,mainClass){
        var left = 0;
        var str = '';
        str += '<li data-pop="0"'
        if(type == 'top'){
            str += ' class="liOn"';
            left = 0;
        }
        str += '><a data-t="top"><i class="h_qkTb13 c_img"></i>头条</a></li>';

        str += '<li data-pop="0"'
        if(type == 'hot'){
            str += ' class="liOn"';
            left = 1;
        }
        str += '><a data-t="hot"><i class="h_qkTb12 c_img"></i>热门</a></li>';

        str += '<li data-pop="1"';
        if(type == 'classify' && mainClass == '公司'){
            str += ' class="liOn"';
            left = 2;
        }
        str += '><a data-t="main" data-w="公司"><i class="h_qkTb7 c_img"></i>公司<i class="glyphicon glyphicon-triangle-bottom"></i></a>';
        str += '\
            <ul>\
                <li><a data-t="sub" data-w="公司">财务</a></li>\
                <li><a data-t="sub" data-w="公司">纠纷</a></li>\
                <li><a data-t="sub" data-w="公司">要闻</a></li>\
                <li><a data-t="sub" data-w="公司">战略</a></li>\
            </ul>';
        str += '</li>';

        str += '<li data-pop="1"';
        if(type == 'classify' && mainClass == '前沿'){
            str += ' class="liOn"';
            left = 3;
        }
        str += '><a data-t="main" data-w="前沿"><i class="h_qkTb9 c_img"></i>前沿<i class="glyphicon glyphicon-triangle-bottom"></i></a>';
        str += '\
            <ul>\
                <li><a data-t="sub" data-w="前沿">HTML5</a></li>\
                <li><a data-t="sub" data-w="前沿">大数据</a></li>\
                <li><a data-t="sub" data-w="前沿">VR/AR</a></li>\
            </ul>';
        str += '</li>';

        str += '<li data-pop="1"';
        if(type == 'classify' && mainClass == '研发'){
            str += ' class="liOn"';
            left = 4;
        }
        str += '><a data-t="main" data-w="研发"><i class="h_qkTb10 c_img"></i>研发<i class="glyphicon glyphicon-triangle-bottom"></i></a>';
        str += '\
            <ul>\
                <li><a data-t="sub" data-w="研发">运营</a></li>\
                <li><a data-t="sub" data-w="研发">开发</a></li>\
                <li><a data-t="sub" data-w="研发">测试</a></li>\
                <li><a data-t="sub" data-w="研发">设计</a></li>\
                <li><a data-t="sub" data-w="研发">策划</a></li>\
            </ul>';
        str += '</li>';

        str += '<li data-pop="1"';
        if(type == 'classify' && mainClass == '行业'){
            str += ' class="liOn"';
            left = 5;
        }
        str += '><a data-t="main" data-w="行业"><i class="h_qkTb8 c_img"></i>行业<i class="glyphicon glyphicon-triangle-bottom"></i></a>';
        str += '\
            <ul>\
                <li><a data-t="sub" data-w="行业">排行榜</a></li>\
                <li><a data-t="sub" data-w="行业">IP</a></li>\
                <li><a data-t="sub" data-w="行业">动态</a></li>\
                <li><a data-t="sub" data-w="行业">峰会</a></li>\
                <li><a data-t="sub" data-w="行业">报告</a></li>\
            </ul>';
        str += '</li>';

        str += '<li data-pop="0"';
        if(type == 'classify' && mainClass == '电竞'){
            str += ' class="liOn"';
            left = 6;
        }
        str += '><a data-t="main" data-w="电竞"><i class="h_qkTb5 c_img"></i>电竞</a></li>';

        str += '<li data-pop="0"';
        if(type == 'classify' && mainClass == '人物'){
            str += ' class="liOn"';
            left = 7;
        }
        str += '><a data-t="main" data-w="人物"><i class="h_qkTb6 c_img"></i>人物</a></li>';

        str = '<ul class="c_borderB c_relative"><div class="ct_slider" style="left: '+left*95+'px"></div>'+str;
        str += '</ul><div class="clearfix"></div>';

        return str;
    },
    _searchTab:function(data,mainClass){
        var str = '';
        if(!$.isEmptyObject(data)){
            $.each(data,function(key,value){
                var imgClass = '';
                var multi = 0;
                switch(key){
                    case '公司':
                        imgClass = 'h_qkTb7';
                        multi = 1;
                        break;
                    case '前沿':
                        imgClass = 'h_qkTb9';
                        multi = 1;
                        break;
                    case '研发':
                        imgClass = 'h_qkTb10';
                        multi = 1;
                        break;
                    case '行业':
                        imgClass = 'h_qkTb8';
                        multi = 1;
                        break;
                    case '电竞':
                        imgClass = 'h_qkTb5';
                        break;
                    case '人物':
                        imgClass = 'h_qkTb6';
                        break;
                    case '游戏':
                        imgClass = 'h_qkTb4';
                        break;
                    case '其他':
                        imgClass = 'h_qkTb11';
                        break;
                }
                str += '<li';
                if(multi == 1){
                    str += ' data-pop="1"';
                    str += '><a data-t="main" data-b="'+key+'" data-s=""><i class="'+imgClass+' c_img"></i>'+key+'('+value.total_num+')<i class="glyphicon glyphicon-triangle-bottom"></i></a>';
                    str += '<ul>';
                    for(var i=0;i<value.sub_list.length;i++){
                        $.each(value.sub_list[i],function(ikey,ivalue){
                            str += '<li><a data-t="sub"  data-b="'+key+'" data-s="'+ikey+'">'+ikey+'('+ivalue+')</a></li>';
                        });
                    }
                    str += '</ul>';

                }else{
                    str += ' data-pop="0"'
                    str += '><a data-t="top" data-b="'+key+'" data-s=""><i class="'+imgClass+' c_img"></i>'+key+'('+value.total_num+')</a>';
                }
                str += '</li>';
            });
        }
        return str;
    },
    _quicker:function(){
        var str = '\
        <div id="quicker" class="c_bgWhite">\
            <div class="c_relative">\
            <span class="q_qq c_img c_borderB"></span>\
            <span class="q_faq c_img c_borderB"></span>\
            <span class="q_plus c_img c_borderB"></span>\
            <span class="q_msg c_img c_borderB"></span>\
            <span class="q_qrcode c_img c_borderB"></span>\
            <span class="q_top c_img"></span>\
            <i class="c_img"></i>\
            </div>\
        </div>';
        $('body').append(str);
        quicker();
    },
    _header:function(index){
        S_HeadFoot._getHead();
    },
    _footer:function(){
        S_HeadFoot._getFoot();
    }
}

var S_HeadFoot = {
    _htmlHeadProductPop:function () {
        return '\
                <div class="hover-nav-white"></div>\
                <div class="hover-nav-wrap">\
                    <ul class="nav-wrap">\
                        <li class="title">智能运营平台</li>\
                        <li class="nav-list-hover nav-a hover-selected">\
                            <i class="tg-icon-side side-1"></i><a href="javascript:void(0) ">玩家运营</a>\
                            <div class=" nav-hover-content">\
                                <p>玩家运营</p>\
                                <h4>聚焦关键玩家开展精准营销</h4>\
                                <ul>\
                                    <li>\
                                        <img src="'+G_Common._cdnImgUrl()+'2.0/drop/1.jpg" alt="">\
                                        <p>定位不同玩家特点，设定迎合玩家需求的高效运营方式</p><button onclick="G_Jump._go(\'operation\')">了解更多</button>\
                                    </li>\
                                    <li class="fr">\
                                        <img src="'+G_Common._cdnImgUrl()+'2.0/drop/2.jpg" alt="">\
                                        <p> 立即升级到智能运营分析平台</p>\
                                        <button onclick="G_Jump._go(\'price\')">申请开通</button>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li class="nav-list-hover nav-b">\
                            <i class="tg-icon-side side-2"></i><a href="javascript:void(0) ">智能分析</a>\
                            <div class=" nav-hover-content">\
                                <p>智能分析</p>\
                                <h4>数据支持决策改善游戏设计</h4>\
                                <ul>\
                                    <li>\
                                    <img src="'+G_Common._cdnImgUrl()+'2.0/drop/3.jpg  " alt="">\
                                    <p>精准统计核心数据，挖掘游戏数据潜在价值，提升游戏运营效率</p>\
                                    <button onclick="G_Jump._go(\'analysis\')">了解更多</button>\
                                    </li>\
                                    <li class="fr">\
                                    <img src="'+G_Common._cdnImgUrl()+'2.0/drop/4.jpg" alt="">\
                                    <p>立即升级到智能运营分析平台</p><button onclick="G_Jump._go(\'price\')">申请开通</button>\
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
                                    <img src="'+G_Common._cdnImgUrl()+'2.0/drop/5.jpg" alt="">\
                                    <p>识别过亿玩家反馈内容，定位玩家多维度特征，轻松监测舆情变化</p><button onclick="G_Jump._go(\'radar\')">了解更多</button>\
                                    </li>\
                                    <li class="fr">\
                                    <img src="'+G_Common._cdnImgUrl()+'2.0/drop/6.jpg" alt="">\
                                    <p>免费使用舆情雷达</p><button onclick="S_User._goVisit(\'outsideFaceSummary\')">免费使用</button>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>\
                        <li class="title">智能运营专业服务</li>\
                        <li class="nav-list-hover nav-d">\
                            <i class="tg-icon-side side-4"></i>\
                            <a href="professional.html ">专业服务</a>\
                            <div class=" nav-hover-content">\
                                <p>专业服务</p>\
                                <h4>人机结合的专业服务助您建立更好的游戏业务</h4>\
                                <ul>\
                                    <li>\
                                        <img src="'+G_Common._cdnImgUrl()+'2.0/drop/7.jpg" alt="">\
                                        <p> 数据应用支持</p>\
                                        <a href="item.html?k=13">数值合理性评估</a>\
                                    </li>\
                                    <li>\
                                        <img src="'+G_Common._cdnImgUrl()+'2.0/drop/8.jpg" alt="">\
                                        <p> 智能运营方案</p>\
                                        <a href="item.html?k=9">付费点优化方案</a>\
                                        <a href="item.html?k=8">玩家流失原因分析</a>\
                                    </li>\
                                    <li>\
                                        <img src=" '+G_Common._cdnImgUrl()+'2.0/drop/9.jpg" alt="">\
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
                                        <img src="'+G_Common._cdnImgUrl()+'2.0/drop/10.jpg" alt="">\
                                        <p>Sigma通过机器学习、数据挖掘和自然语言处理等人工智能技术，帮助游戏企业发现潜在的核心玩家，以及隐藏性的关联，为玩家提供更个性化的游戏体验</p>\
                                        <button onclick="G_Jump._go(\'sigma\')">了解更多</button>\
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
        menuStr += '<li id="bs_head_m_light" onclick="G_Jump._go(\'price\')"';
        menuStr += '>产品定价</li>';
        // menuStr += '<li onclick="B_Jump._go(\'target\',\'guide\')"';
        // menuStr += '>行业指南</li>';
        // menuStr += '<li id="bs_head_m_service" onclick="B_Jump._go(\'base\',\''+B_Jump._getUrl('article')+'?t=classify&m=研发\')"';
        // menuStr += '>每日干货</li>';
        menuStr += '<li class="about-nav" style="cursor: default;"';
        menuStr += '>行业洞察';
        menuStr += '<div id="SubNav">';
        menuStr += '<p><a id="bs_head_m_service" onclick="G_Jump._go(\'guide\')">行业分析</a></p>';
        menuStr += '<p><a onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('article')+'?t=classify&m='+G_Common._encodeUrl('研发')+'\')">媒体透视</a></p>';
        menuStr += '<p><a onclick="G_Jump._go(\'atlas\')">游戏图谱</a></p>';
        menuStr += '</div>'
        menuStr += '</li>';
        menuStr += '<li class="about-nav" style="cursor: default;"';
        menuStr += '>关于我们';
        menuStr += '<div id="SubNav">';
        menuStr += '<p><a onclick="G_Jump._go(\'company\')">公司介绍</a></p>';
        menuStr += '<p><a onclick="G_Jump._go(\'join\')">加入我们</a></p>';
        menuStr += '<p><a onclick="G_Jump._go(\'partner\')">合作伙伴</a></p>';
        menuStr += '</div>'
        menuStr += '</li>';
        menuStr += '</ul>';
        menuStr += '</div>';

        return menuStr;
    },
    _getHead:function(current){
        var str = '\
            <div class="tg-header-wrap total-width">'+S_HeadFoot._htmlHead()+'\
                <div class="login-part fr"><ul>\
                    <li>\
                        <form method="get" action="'+G_Jump._getUrl('search')+'">\
                            <input type="text"name="k" placeholder="换游戏，看文章、搜元素">\
                            <button type="submit" class="search-icon"></button>\
                        </form>\
                    </li>\
                    <li id="bs_user_status"></li>\
                </ul></div>\
                <div class="login-part fr"></div>\
            </div>';

        $('#headerPart').html(str);
        $('#headerPartProductPop').html(S_HeadFoot._htmlHeadProductPop());

        S_HeadFoot._productHoverShow();
        S_HeadFoot._productHoverClick();
        S_User._formatStatus();
        this._getFoot();

        $('#headerPart form').submit(function(){
            var keywords = $.trim($('#headerPart input[name="k"]').val());
            if(keywords == ''){
                G_Pop._init('msg',{content:'搜索关键词必须填写,请确认！'});
                return false;
            }else{
                return true;
            }
        });

        $('.h-logo').click(function(){
            G_Jump._go('index');
        });
    },
    _getFoot:function(){
        var str = '\
        <div id="FooterPart">\
            <div class="wrap">\
                <div class="fl">\
                    <ul>\
                        <li class="title">产品</li>\
                        <li><a href="operation.html">玩家运营介绍</a></li>\
                        <li><a href="analysis.html">智能分析介绍</a></li>\
                        <li><a href="radar.html">舆情雷达介绍</a></li>\
                        <li><a href="professional.html">专业服务</a></li>\
                        <li><a href="sigma.html">Sigama<b class="tm-text">TM</b>系统</a></li>\
                        <li><a href="price.html">产品定价</a></li>\
                    </ul>\
                    <ul>\
                        <li class="title">行业洞察</li>\
                        <li><a href="javascript:void(0)" style="cursor: default;">最新活动</a></li>\
                        <li><a href="javascript:void(0)" style="cursor: default;">往期活动</a></li>\
                        <li><a href="guide.html">行业分析</a></li>\
                    </ul>\
                    <ul>\
                        <li class="title">关于我们</li>\
                        <li><a href="company.html">公司介绍</a></li>\
                        <li><a href="join.html">加入我们</a></li>\
                        <li><a href="partner.html">合作伙伴</a></li>\
                        <li><a href="javascript:void(0)" style="cursor: default;">媒体报道</a></li>\
                    </ul>\
                </div>\
                <div class="fr">\
                    <img src="elements2.0/img/f-logo.png" alt="">\
                    <h3>数数信息科技（上海）有限公司</h3>\
                    <div class="code-wrap">\
                        <img src="elements2.0/img/code.jpg" alt="">\
                        <ul>\
                            <li onclick="G_Jump._go(\'open\',\''+G_Common._qqUrl()+'\')"><img src="elements2.0/img/f-service.png" alt="">在线客服</li>\
                            <li><img src="elements2.0/img/f-email.png" alt="">service@thinkingdata.cn</li>\
                            <li><img src="elements2.0/img/f-address.png" alt="">上海市长宁区中山西路999号1203室</li>\
                        </ul>\
                    </div>\
                    <p>2015-2017 THINKINGGAME.CN 版权所有  <a href="http://www.miitbeian.gov.cn/" target="_blank">沪ICP备 15030552号</a></p>\
                </div>\
            </div>\
        </div>';
        $('#footerPart').html(str);
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
        if(isDemoUser()){
            openLogin(type);
        }else{
            G_Jump._go('base',G_Jump._getUrl('outsideFaceSummary'));
        }
    },
    _formatStatus:function(type){
        if(!isDemoUser()){
            $('#bs_user_status').html('<button class="login-btn">控制台</button>');
            $('#bs_user_status button').click(function(){
                G_Jump._go('main');
            });
        }else{
            $('#bs_user_status').html('<button class="login-btn">登录</button><button class="reg-btn">注册</button>');

            $('#bs_user_status button').eq(0).click(function(){
                openLogin()
            });
            $('#bs_user_status button').eq(1).click(function(){
                G_Jump._go('reg');
            });

            if(type){
                switch(type){
                    case 'user':
                        if(isDemoUser()){
                            G_Jump._go('login');
                        }
                        break;
                }
            }
        }
    }
}