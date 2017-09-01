var G_GameId = G_Game._id();
var G_Collects = [];
function arrowPopOpen(type,dom){
    if(dom.close && !dom.close.is(":hidden"))dom.close.fadeOut('quick');
    if(dom.open.is(":hidden"))dom.open.fadeIn('slow');
}
function arrowPopClickClose(dom){
    dom.unbind("hover").hover(function(){
        $('body').unbind('mousedown');
    }, function() {
        $('body').bind('mousedown', function () {
            dom.hide();
        });
    });
}
function openLogin(){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'欢迎登录','width':'360px','height':'370px','shift':2,'content':'login_s.html'},'');
}
function openFaq(){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'常见问题','width':'720px','height':'520px','shift':2,'content':'faq_s.html'},'');
}
function openOpinion(){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'意见反馈','width':'720px','height':'520px','shift':2,'content':'opinion_s.html'},'');
}
function openPlan(){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'改进计划','width':'720px','height':'550px','shift':2,'content':'plan_s.html'},'');
}
function openWord(word){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'热词词汇','width':'360px','height':'400px','shift':2,'content':'word_s.html?w='+encodeURIComponent(word)},'');
}
var menuSlider = {
    _init:function(current){
        function setSlider(index,hasCurrent){
            var slider = $('.h_menu .h_slider');
            index >= 0 ? slider.show() : slider.hide();
            var left=25+index*120;
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
                },
                function(){
                    setSlider(current);
                }
            );
            $(this).click(function(){
                switch(index){
                    case 1:
                        arrowPopOpen('light',{'open':$(this).find('.h_light'),'close':$(".h_quick")});
                        if($(".bs_history").html() == '')G_Game._menuHistoryList();
                        G_Game._menuCollectList();
                        if($(".bs_favorite").html() == '')G_Game._menuGuessLikeList();
                        break;
                }
            });
        });
    }
}
var clickScroll = {
    _init:function(preDom,nextDom,scrollDom,sliderDom,itemWidth,perScrollNumber,perPageCount,onClass){
        var page = 0;
        var width = itemWidth * perScrollNumber;
        var itemCount = scrollDom.find("li").length; //总个数

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
                sliderDom.animate({left:'-='+itemWidth},"slow");
                page++;
                if((page+perPageCount) == itemCount){
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
                sliderDom.animate({left:'+='+itemWidth},"slow");
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
    var w = $(window).width()-1170-160;
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
                    $(this).removeClass('q_faq c_img').html('常见<br>问题');
                    break;
                case 1:
                    $(this).removeClass('q_plus c_img').html('改进<br>计划');
                    break;
                case 2:
                    $(this).removeClass('q_msg c_img').html('意见<br>反馈');
                    break;
                case 3:
                    $(this).removeClass('q_top c_img').html('返回<br>顶部');
                    break;
            }
        },function(){
            switch(index){
                case 0:
                    $(this).addClass('q_faq c_img').html('');
                    break;
                case 1:
                    $(this).addClass('q_plus c_img').html('');
                    break;
                case 2:
                    $(this).addClass('q_msg c_img').html('');
                    break;
                case 3:
                    $(this).addClass('q_top c_img').html('');
                    break;
            }
        });
        $(this).click(function(){
            switch(index){
                case 0:
                    openFaq();
                    break;
                case 1:
                    isDemoUser() ? openLogin() : openPlan();
                    break;
                case 2:
                    openOpinion();
                    break;
                case 3:
                    GoToTop();
                    break;
            }
        });
    });
}
function GoToTop(){
    $("body,html").animate({
        'scrollTop':0
    },500);
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
var dataChoose = {
    _single:function(config,dom,start,end,callback){
        new pickerDateRange('dc'+dom, {
            autoCommit : config.autoCommit,
            isTodayValid : config.todayValid,
            startDate : start,
            endDate : end,
            isSingleDay : true,
            success : (function(s,e,dr){
                return function(obj) {
                    s.val(obj.startDate);
                    e.val(obj.endDate);
                    callback && callback(obj.startDate,obj.endDate);
                }
            })($("#db"+dom),$("#de"+dom),$("#dc"+dom))
        });
    },
    _section:function(config,dom,start,end,callback){
        new pickerDateRange('dc'+dom, {
            autoCommit : config.autoCommit,
            isTodayValid : config.todayValid,
            startDate : start,
            endDate : end,
            theme : 'ta',
            defaultText : ' 至 ',
            success : (function(s,e,dr){
                return function(obj) {
                    s.val(obj.startDate);
                    e.val(obj.endDate);
                    callback && callback(obj.startDate,obj.endDate);
                }
            })($("#db"+dom),$("#de"+dom),$("#dc"+dom))
        });
    }
}
function tabChoose(dom,domSlider,width,diff,onClass,type,current,contentDom,chartDom){
    switch(type){
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
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    var float = index;
                    if(index == 2 && current == 0)float = 1;
                    domSlider.animate({
                        left:((float*width)+diff)+'px'
                    },function(){});
                    for(var i=0;i<=2;i++){
                        if(i == index){
                            $('#data-lm'+(i+1)).show();
                            $('#data-lc'+(i+1)).show();
                        }else{
                            $('#data-lm'+(i+1)).hide();
                            $('#data-lc'+(i+1)).hide();
                        }
                    }
                    switch(index+''){
                        case '1':
                            if($('#data-lc2 .dc-list-content').html() == ''){
                                F_Apps._getInfo(1);
                            }
                            break;
                        case '2':
                            if($('#data-lc3 .article-list').html() == ''){
                                F_Article._getInfo(1);
                            }
                            break;
                    }
                })
            });
            break;
        default:
            dom.each(function(index){
                $(this).click(function(){
                    if(typeof(onClass) != 'undefined'){
                        $(this).addClass(onClass).siblings().removeClass(onClass);
                    }
                    domSlider.animate({
                        left:((index*width)+diff)+'px'
                    },function(){});
                })
            });
            break;
    }
}
function itemChoose(dom,onClass,callback){
    dom.each(function(index){
        $(this).click(function(){
            if(!$(this).hasClass(onClass)){
                $(this).addClass(onClass).siblings().removeClass(onClass);
                callback && callback($(this).attr('data-w'));
            }
        })
    })
}
function wordCloudShow(dom,words,callback,extraclass){
    var ratio = [];
    for(var i=0; i<words.length; ++i){
        ratio.push(words[i].total_num / words[0].total_num * 1.5);
    }
    new WordCloud(dom, words, callback, extraclass, null, null, null, ratio);
}
var C_Dom = {
    _quicker:function(){
        var str = '\
        <div id="quicker" class="c_bgWhite">\
            <span class="q_faq c_img c_borderB"></span>\
            <span class="q_plus c_img c_borderB"></span>\
            <span class="q_msg c_img c_borderB"></span>\
            <span class="q_top c_img"></span>\
        </div>';
        $('body').append(str);
        quicker();
    },
    _header:function(index){
        var menu_light_pop = '\
            <div class="h_pop h_light c_bgWhite c_boderRadius c_hidden">\
                <div class="c_padding20 h_area  c_itemList">\
                    <div class="h_close"><i class="glyphicon glyphicon-remove"></i></div>\
                    <div class="h_ltZone1 c_floatLeft">\
                        <div class="c_paddingLR20">\
                            <div class="h_title c_marginTB10">\
                                <h2><i class="glyphicon glyphicon-time glyphicon "></i> 浏览历史</h2>\
                            </div>\
                            <div class="h_ltList h_ltLtTwo c_marginTop20 bs_history"></div>\
                        </div>\
                    </div>\
                    <div class="h_ltZone1 c_floatLeft">\
                        <div class="c_paddingLR20">\
                            <div class="h_title c_marginTB10">\
                                <h2><i class="glyphicon glyphicon-star-empty"></i> 您的收藏</h2>\
                            </div>\
                            <div class="h_ltList h_ltLtTwo c_marginTop20 bs_collect"></div>\
                        </div>\
                    </div>\
                    <div class="h_ltZone2 c_floatLeft">\
                        <div class="c_paddingLR20">\
                            <div class="h_title c_marginTB10">\
                                <h2><i class="glyphicon glyphicon-heart "></i> 猜你喜欢</h2>\
                            </div>\
                            <div class="h_ltList c_marginTop20 bs_favorite"></div>\
                        </div>\
                    </div>\
                </div>\
            </div>';

        var menu = '<ul>';
        /*
            menu += '<li';
            if(index == 0)menu += ' class="liOn"';

            menu += isDemoUser() ? ' onclick="G_Jump._go(\'light\')">游戏灯塔' : '>游戏灯塔'+menu_light_pop;
            menu += '</li>';

            menu += '<li';
            if(index == 1)menu += ' class="liOn"';
            menu += '>';
            menu += '行业指南</li>';

        */
            menu += '<li';
            if(index == 0)menu += ' class="liOn"';
            menu += ' onclick="G_Jump._go(\'index\')">';
            menu += '首页</li>';

            menu += '<li';
            if(index == 1)menu += ' class="liOn"';

            menu += isDemoUser() ? ' onclick="G_Jump._go(\'light\')">游戏灯塔' : '>游戏灯塔'+menu_light_pop;
            menu += '</li>';

            menu += '<li';
            if(index == 2)menu += ' class="liOn"';
            menu += ' onclick="G_Jump._go(\'atlas\')">';
            menu += '游戏图谱</li>';

            menu += '<li';
            if(index == 3)menu += ' class="liOn"';
            menu += ' onclick="'+(isDemoUser() ?  'openLogin()' : ' G_Jump._go(\'service\')')+'"';
            menu += '>';

            menu += '私人定制</li>';
            menu += '</ul>';

        var str = '\
            <div class="c_maxWidth c_marginAuto h_area">\
                <div class="c_img h_logo c_floatLeft c_cursor"></div>\
                <div class="h_search c_floatLeft c_boderRadius"><form method="get" action="'+G_Jump._getUrl('search')+'">\
                    <input type="text" name="k" placeholder="搜索游戏、文章、元素...">\
                    <button type="submit" class="glyphicon glyphicon-search"></button></form>\
                    <div class="h_pop h_quick c_bgWhite c_boderRadius c_hidden">\
                        <div class="c_padding20 h_area">\
                            <div class="h_close"><i class="glyphicon glyphicon-remove"></i></div>\
                            <div class="h_qkTitle c_borderB">\
                                <div class="qk_slider"></div>\
                                <ul>\
                                    <li class="liOn">游戏类型</li>\
                                    <li>行业媒体</li>\
                                </ul>\
                                <div class="clearfix"></div>\
                            </div>\
                            <div class="h_qkArea c_marginTop20">\
                                <div class="h_qkChoose">\
                                    <div class="qc_slider"></div>\
                                    <ul>\
                                        <li class="liOn">ABC</li>\
                                        <li>DEF</li>\
                                        <li>GHI</li>\
                                        <li>JKL</li>\
                                        <li>MNO</li>\
                                        <li>PQR</li>\
                                        <li>STU</li>\
                                        <li>VW</li>\
                                        <li>XYZ</li>\
                                        <li>0-9</li>\
                                    </ul>\
                                    <div class="clearfix"></div>\
                                </div>\
                                <div class="h_qkTab c_floatLeft">\
                                    <div class="qt_slider"></div>\
                                    <dl class="dlOn" game_type="S">\
                                        <dt class="h_qkTb1 c_img"></dt>\
                                        <dd>手游</dd>\
                                    </dl>\
                                    <dl game_type="Y">\
                                        <dt class="h_qkTb2 c_img"></dt>\
                                        <dd>页游</dd>\
                                    </dl>\
                                    <dl game_type="D">\
                                        <dt class="h_qkTb3 c_img"></dt>\
                                        <dd>端游</dd>\
                                    </dl>\
                                    <dl game_type="W">\
                                        <dt class="h_qkTb4 c_img"></dt>\
                                        <dd>单机 电玩</dd>\
                                    </dl>\
                                </div>\
                                <div class="h_qkItem c_floatLeft c_borderT c_borderL"></div>\
                                <div class="clearfix"></div>\
                            </div>\
                            <div class="h_qkTitle c_borderB c_marginB10">\
                                <h5>热门游戏</h5>\
                            </div>\
                            <div class="h_qkList c_itemList"></div>\
                        </div>\
                    </div>\
                </div>\
                <div class="h_menu c_floatLeft">'+menu+'<div class="h_slider"></div></div>\
                <div class="h_user c_floatRight"></div>\
                <div class="clearfix"></div>\
            </div>';

        $('#header').html(str);
        menuSlider._init(index);
        $('.h_close').click(function(){
            $('.h_pop').fadeOut('slow');
        });
        $('.h_ltList').perfectScrollbar();
        $('.h_qkItem').perfectScrollbar();

        $('input[name="k"]').focus(function(){
            arrowPopOpen('search',{'open':$(".h_quick"),'close':$('.h_light')});
            if($(".h_qkItem").html() == '')G_Game._chooseGame();
            if($(".h_qkList").html() == '')G_Game._menuHotGame(0,6);
        });
        arrowPopClickClose($('.h_pop'));
        tabChoose($('.h_qkTitle ul li'),$('.qk_slider'),80,0,'liOn');
        tabChoose($('.h_qkChoose ul li'),$('.qc_slider'),60,0,'liOn');
        tabChoose($('.h_qkTab dl'),$('.qt_slider'),40,0,'dlOn','vertical');

        $('.h_qkChoose ul li').click(function(){
            G_Game._chooseGame();
        });
        $('.h_qkTab dl').click(function(){
            G_Game._chooseGame();
        });

        $('.h_search form').submit(function(){
            var keywords = $.trim($('input[name="k"]').val());
            if(keywords == ''){
                G_Pop._init('msg',{content:'搜索关键词必须填写,请确认！'});
                return false;
            }else{
                return true;
            }
        });

        $('.h_logo').click(function(){
            G_Jump._go('index');
        });
    },
    _footer:function(){
        var str = '\
            <div class="c_maxWidth c_marginAuto">\
                <p><a href="faq.html">帮助文档</a> <a href="javascript:void(0)">关于我们</a> <a href="javascript:void(0)">加入我们</a> <a href="javascript:void(0)">联系我们</a></p>\
                <span>@THINKING GAME All Rights Reserved.  数数信息科技（上海）有限公司  沪ICP备15030552<span>\
            </div>';

        $('#footer').html(str);
    }
}