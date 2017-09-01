$(function(){
// 轮播海报banner
$(function(){
  $('#marquee').bxSlider({
        mode:'horizontal', //默认的是水平
        displaySlideQty:1,//显示li的个数
        moveSlideQty: 1,//移动li的个数  
        captions: false,//自动控制
        auto: true,
        controls: false,//隐藏左右按钮
        speed: 1000, //速度
  });
}); 
// 轮播海报banner
$(function(){
  $('#marqueeA').bxSlider({
        mode:'horizontal', //默认的是水平
        displaySlideQty:1,//显示li的个数
        moveSlideQty: 1,//移动li的个数  
        captions: true,//自动控制
        auto: false,
        controls: true,//隐藏左右按钮
        speed: 1000, //速度
        pager: false //是否显示分页
  });
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
    setTimeout(randomBackground, delayTime*6);
  }
    randomBackground();
});

