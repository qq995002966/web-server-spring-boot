require(['frontmain'], function () {
    require(['jquery', 'layer', 'base', 'front', 'store.min', 'jquery.bxslider', 'particles'], function () {
        store = require('store.min');

        $('#marquee').bxSlider({
            mode: 'horizontal', //默认的是水平
            displaySlideQty: 1,//显示li的个数
            moveSlideQty: 1,//移动li的个数
            captions: false,//自动控制
            auto: true,
            controls: false,//隐藏左右按钮
            speed: 3000, //速度
            pause: 8000
        });

        B_Login._check();
        S_HeadFoot._getHead();
        S_HeadFoot._htmlPaper();
        S_User._freeCheck();

        var max = 3;
        var random = false;
        var delayTime = 800;
        var index = 1;

        function randomBackground() {
            if (random) {
                var randomNum = Math.floor(Math.random() * max) + 1;
            } else {
                var randomNum = index;
            }
            var bgDom = $('.content.join .change-image'),
                bg = 'url(assets/images/join/bg-' + randomNum + '.jpg)',
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
            setTimeout(randomBackground, delayTime * 6);
        }

        randomBackground();

        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 180,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 10,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#fff",
                    "opacity": 0.5,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 0.5,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });


    });
});
