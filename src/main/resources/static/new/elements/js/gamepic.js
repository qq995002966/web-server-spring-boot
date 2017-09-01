$(function() {
//check browser
    function get_browser(){
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name:'IE',version:(tem[1]||'')};
        }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return {
            name: M[0],
            version: M[1]
        };
    }
    if (get_browser().name == 'MSIE' && get_browser().version < 10) {
        console.log(get_browser());
        alert('当前浏览器版本过低,有些特效无法展现')
    }



// 操作按钮
   $('.operation .scale-small').on('click',function(){
        $('.rotate-content').removeClass('scalebig').addClass('scale');
    });

    $('.operation .scale-normal').on('click',function(){
        $('.rotate-content').removeClass('scale').removeClass('scalebig');
    });

    $('.operation .scale-big').on('click',function(){
        $('.rotate-content').removeClass('scale').addClass('scalebig');
    });

    // 回归原位
    $('#resetRotateContent').on('click', function () {
      $('.rotate-content').css({
        'top':0,
        'left': 0
      })
    });

// 拖拽
    $('.rotate-content').draggable();
// zoomer调用


});

function menuChoosed(){
    $('.icon-a-list li').on('click',function(){
        $('.icon-a-list li').removeClass('icon-a-list-hover');
        $(this).addClass('icon-a-list-hover');
    });

    $('.sidebar ul .icon').on('click',function(){
        $('.sidebar ul .icon').css('background-position-x','0px');
        $('.sidebar ul .icon span').css('color','#8a8a8a');
        $(this).css('background-position-x','-120px');
        $(this).children('span').css('color','#fff');


    });
    $('.sidebar ul li').each(function(){
        $(this).click(function(){
            var type = $(this).find('span').html();
            var dateType = $(this).attr('data-t');
            var dateId = $(this).attr('data-i');
            if(typeReload != type){
                if(isDemoUser()){
                    openLogin();
                    return;
                }
                typeReload = type;
                switch(type){
                    case '热门':
                        F_Hot._getData();
                        break;
                    case '收藏':
                        F_Collect._getData();
                        break;
                    case '历史':
                        F_History._getData();
                        break;
                    default:
                        if(dateType){
                            switch(dateType){
                                case 't':
                                    F_Type._getData(dateId);
                                    break;
                                case 'p':
                                    F_Plat._getData(dateId);
                                    break;
                            }
                        }
                        break;
                }
            }
        });
    });
}

// 延时弹层
function createLayer(){
    var delayRun;
    $('.rotate-content>div>div').hover(function() {
        $('.option-box').removeClass('show');
        $('.inner-option-box').removeClass('show');
        var _this = $(this);
        var _img = $(this).find('img');
        delayRun = setTimeout(function() {
            _this.find('div').addClass('show');
            _this.find('div .inner-option-box').addClass('inner-show');
            var key = _this.find('div .inner-option-box').attr('data-i');
            if(key){
                F_Tag._getTag(key);
            }
        }, 1000);
    },function(){
        clearTimeout(delayRun);
        $(this).find('div').removeClass('show');
        $(this).find('div .inner-option-box').removeClass('inner-show');
    });
    $('#Dot').hover(function() {
        $(this).find('.option-box').remove();
    });
}

// 圆圈

function createCircle(){
    //中心点横坐标
    var dotLeft = ($(".container").width()-$(".dot").width())/2;
    //中心点纵坐标
    var dotTop = ($(".container").height()-$(".dot").height())/2;
    //起始角度
    var stard = 0;
    //半径
    var radius = 200;
    //每一个BOX对应的角度;
    var avd = 360/$(".box").length;//第1圈(6个)
    var avdd = 360/$(".boxx").length;//第2圈（14）
    var avddd = 360/$(".box-3").length;//第3圈（30）
    var avdddd = 360/$(".box-4").length;//第4圈（38）
    var avddddd = 360/$(".box-5").length;//第5圈（60）
    var avdddddd = 360/$(".box-6").length;//第6圈（60）
    var avddddddd = 360/$(".box-6").length;//第7圈（60）
    var avdddddddd = 360/$(".box-6").length;//第8圈（60）
    //每一个BOX对应的弧度;
    var ahd = avd*Math.PI/180;//第1圈
    var ahhd = avdd*Math.PI/180;//第2圈
    var ahhhd = avddd*Math.PI/180;//第3圈
    var ahhhhd = avdddd*Math.PI/180;//第4圈
    var ahhhhhd = avddddd*Math.PI/180;//第5圈
    var ahhhhhhd = avdddddd*Math.PI/180;//第6圈
    var ahhhhhhhd = avddddddd*Math.PI/180;//第7圈
    var ahhhhhhhhd = avdddddddd*Math.PI/180;//第8圈


    //设置圆的中心点的位置
    $(".dot").css({"left":dotLeft,"top":dotTop});
    // 圆1
    $(".container .box").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahd*index))*radius+dotLeft,
              "top": Math.cos((ahd*index))*radius+dotTop
            });
        });


    // 圆2
        var distance = ($(".container").width()+$(".container-even").width())/2;
        $('.container-even').css({
          "top": -distance
        })
         $(".container-even .boxx").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahhd*index))*350+dotLeft,
              "top": Math.cos((ahhd*index))*350+dotTop
            });
        });


    // 圆3
        var distancee = ($(".container-even").width()+$(".container-even-3").width())/2;
        $('.container-even-3').css({
          "top": -(distancee+distance)
        })
         $(".container-even-3 .box-3").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahhhd*index))*500+dotLeft,
              "top": Math.cos((ahhhd*index))*500+dotTop
            });
        });

    // 圆4
        var distanceee = ($(".container-even-3").width()+$(".container-even-4").width())/2;
        $('.container-even-4').css({
          "top": -(distanceee+distancee+distance)
        })
         $(".container-even-4 .box-4").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahhhhd*index))*650+dotLeft,
              "top": Math.cos((ahhhhd*index))*650+dotTop
            });
        });

    // 圆5
        var distanceeee = ($(".container-even-4").width()+$(".container-even-5").width())/2;
        $('.container-even-5').css({
          "top": -(distanceeee+distanceee+distancee+distance)
        })
         $(".container-even-5 .box-5").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahhhhhd*index))*800+dotLeft,
              "top": Math.cos((ahhhhhd*index))*800+dotTop
            });
        });

    // 圆6
        var distanceeeee = ($(".container-even-5").width()+$(".container-even-6").width())/2;
        $('.container-even-6').css({
          "top": -(distanceeeee+distanceeee+distanceee+distancee+distance)
        })
         $(".container-even-6 .box-6").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahhhhhhd*index))*950+dotLeft,
              "top": Math.cos((ahhhhhhd*index))*950+dotTop
            });
        });

    // 圆7
        var distanceeeeee = ($(".container-even-6").width()+$(".container-even-7").width())/2;
        $('.container-even-7').css({
          "top": -(distanceeeeee+distanceeeee+distanceeee+distanceee+distancee+distance)
        })
         $(".container-even-7 .box-7").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahhhhhhhd*index))*1100+dotLeft,
              "top": Math.cos((ahhhhhhhd*index))*1100+dotTop
            });
        });

       // 圆8
        var distanceeeeeee = ($(".container-even-7").width()+$(".container-even-8").width())/2;
        $('.container-even-8').css({
          "top": -(distanceeeeeee+distanceeeeee+distanceeeee+distanceeee+distanceee+distancee+distance)
        })
         $(".container-even-8 .box-8").each(function(index, element){
            $(this).css({
              "left": Math.sin((ahhhhhhhhd*index))*1250+dotLeft,
              "top": Math.cos((ahhhhhhhhd*index))*1250+dotTop
            });
        });


  };



