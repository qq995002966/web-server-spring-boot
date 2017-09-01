require(['frontmain'], function () {
    require(['jquery','jquery.bxslider','layer','base','front','store.min'], function (){
        store = require('store.min');

        var F_Entrance = {
            _init:function () {
                B_Login._check();
                S_HeadFoot._getHead();
                //S_User._freeCheck();
                var controller = B_Common._getUrl('controller');
                switch(controller){
                    case 'acdetail':
                        S_HeadFoot._htmlPaper();
                        break;
                    case '':
                    case 'index':
                        S_HeadFoot._htmlPaper();
                        $('#marquee').bxSlider({
                            mode: 'horizontal', //默认的是水平
                            infiniteLoop: true,
                            displaySlideQty: 1,//显示li的个数
                            moveSlideQty: 1,//移动li的个数
                            captions: false,//自动控制
                            auto: true,
                            controls: false,//隐藏左右按钮
                            pause: 8000,
                            speed: 1000 //速度
                        });
                        F_Work._goApp();
                        F_Work._goDemo();
                        F_Work._goVisit();
                        break;
                    case 'company':
                        $('#aboutusBanner ').show();
                        $('#marquee').bxSlider({
                            mode:'horizontal', //默认的是水平
                            displaySlideQty:1,//显示li的个数
                            moveSlideQty: 1,//移动li的个数
                            captions: true,//自动控制
                            auto: false,
                            controls: true,//隐藏左右按钮
                            speed: 1000, //速度
                            pager: false //是否显示分页
                        });
                        break;
                    case 'join':
                        $('#joinBanner ').show();
                        $('#marquee').bxSlider({
                            mode:'horizontal', //默认的是水平
                            displaySlideQty:1,//显示li的个数
                            moveSlideQty: 1,//移动li的个数
                            captions: false,//自动控制
                            auto: true,
                            controls: false,//隐藏左右按钮
                            speed: 1000, //速度
                        });
                        // 随机背景
                        var max = 3,
                            random = false,
                            delayTime = 800,
                            index = 1;
                        function randomBackground() {
                            if (random) {
                                var randomNum = Math.floor(Math.random() * max) + 1;
                            } else {
                                var randomNum = index;
                            }
                            var bgDom = $('.content.join .change-image'),
                                bg = 'url(http://image.thinkinggame.cn/img/2.0/join/bg-' + randomNum + '.jpg)',
                                textDom = $('.bg-text-change'),
                                text = [{
                                    en: '“They need to find nuggets of truth in data and then explain it to the Business leaders”',
                                    zh: '“他们需要从数据中找到有用的真相，然后解释给领导者。”  ',
                                    name: ' ——Richard Snee '
                                }, {
                                    en: '“Data Scientist = statistician + programmer + coach + storyteller + artist”',
                                    zh: '“数据科学家=统计学家+程序员+讲故事的人+艺术家。“ ',
                                    name: '– Shlomo Aragmon'
                                }, {
                                    en: '“The data scientist was called, only half-jokingly, a caped superhero”',
                                    zh: '“数据科学家曾经被誉为戴着披风的超级英雄（当然只是开个玩笑）”',
                                    name: '– Ben Rooney'
                                }];

                            bgDom.fadeOut(delayTime * 2);

                            setTimeout(function () {
                                setTimeout(function () {
                                    textDom.find('.eng-text').text(text[randomNum - 1].en).next().text(text[randomNum - 1].zh).next().text(text[randomNum - 1].name);
                                }, delayTime);
                                bgDom
                                    .css({
                                        "background-image": bg,
                                        "background-size": "100%"
                                    })
                                    .fadeIn(delayTime * 2);
                            }, delayTime * 2);

                            if (index == max) {
                                index = 1;
                            } else {
                                index = index + 1
                            }
                            setTimeout(randomBackground, delayTime*6);
                        }
                        randomBackground();
                        break;
                    case 'price':
                        S_HeadFoot._htmlPaper();
                        $('.tf-tab-change li').on('click', function() {
                            var contentUrl = $(this).attr('href');
                            $('.tf-tab-change li').removeClass('selected');
                            $(this).addClass('selected');
                            $('.content').css('display', 'none');
                            $(contentUrl).css('display', 'block');
                            $('#unBindTab').unbind();
                        });
                        F_Work._goOpen();
                        F_Work._goDemo();
                        F_Work._goQq();
                        F_Work._goReg();
                        break;
                    case 'operation':
                        F_Work._goApp('operate');
                        F_Work._goDemo();
                        break;
                    case 'datacenter':
                        F_Work._goApp('inside');
                        F_Work._goDemo();
                        break;
                    case 'analysis':
                        F_Work._goOpen();
                        F_Work._goDemo();
                        F_Work._goTab();
                        break;
                    case 'radar':
                        F_Work._goDemo();
                        break;
                    case 'professional':
                        F_Work._goQq();
                        F_Work._goDemo();
                        break;
                    case 'datasolution':
                    case 'analysissolution':
                    case 'popluarsolution':
                        F_Work._goQq();
                        F_Work._goVisit();
                        break;
                }
            }
        }
        var F_Work = {
            _goTab:function () {
                $('.tf-tab-change li').each(function (index) {
                    $(this).click(function () {
                        if(!$(this).hasClass('selected')){
                            $(this).addClass('selected').siblings().removeClass('selected');
                            $('.tf-tab-change-content .content').eq(index).show().siblings().hide();
                        }
                    });
                });
            },
            _goReg:function () {
                $('.bs_reg_app').each(function () {
                    $(this).click(function () {
                        if(B_User._isDemoUser()){
                            B_Jump._go('target','reg');
                        }else{
                            B_Jump._go('target','main');
                        }
                    });
                });
            },
            _goApp:function (type) {
                $('.bs_app_app').each(function () {
                    $(this).click(function () {
                        if(!type)type = $(this).attr('data-t');
                        B_Login._openProbation(type);
                    });
                });
            },
            _goOpen:function () {
                $('.bs_open_app').each(function () {
                    $(this).click(function () {
                        S_User._freeApp();
                    });
                });
            },
            _goVisit:function () {
                $('.bs_visit_app').each(function () {
                        $(this).click(function () {
                            var type = $(this).attr('data-t');
                            B_Jump._go('target',type);
                        });
                })
            },
            _goDemo:function () {
                $('.bs_demo_app').each(function () {
                    $(this).click(function () {
                        var type = $(this).attr('data-t');
                        var isOutside = type.substr(0,7) == 'outside' ? true : false;
                        if(isOutside){
                            switch (type){
                                case 'outsidegameSummary':
                                case 'outsidegameSentiment':
                                case 'outsidegameForum':
                                    type = type.replace('outside','');
                                    break;
                            }
                            if(!(type == 'outsideCenter' || type == 'outsideRankSentiment')  && B_User._isDemoUser()){
                                B_Login._openLogin(type);
                            }else{
                                B_Jump._go('target',type);
                            }
                        }else{
                            B_Jump._go('base',B_Jump._getUrl('demo',{demo:type}));
                        }
                    });
                });
            },
            _goQq:function () {
                $('.bs_qq_app').each(function () {
                    $(this).click(function () {
                       B_Jump._go('openUrl',B_Common._qqUrl());
                    });
                });
            }
        };

        F_Entrance._init();
    });
});