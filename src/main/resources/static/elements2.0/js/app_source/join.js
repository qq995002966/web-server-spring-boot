requirejs.config({
    shim: {
        'jquery.bxslider': ['jquery'],
        'layer': ['jquery'],
        'store.min': ['jquery'],
        'perfect-scrollbar.jquery.min': ['jquery']
    },
    baseUrl: 'elements2.0/js/lib',
    paths: {
        jquery : './jquery-1.9.1.min',
        app: '../app'
    }
});
require(['jquery','jquery.bxslider','perfect-scrollbar.jquery.min','layer','store.min','app/base','app/front'], function(){
    store = require('store.min');

    $('#joinBanner ').show();

    B_Login._check();
    S_HeadFoot._getHead();

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

});
