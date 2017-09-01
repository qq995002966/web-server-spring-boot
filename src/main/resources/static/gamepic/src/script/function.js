$(function() {
        (function() {
        var $section = $('#Wrap');
        // var $section = $(window);
        var $panzoom = $section.find('#canvas').panzoom({
            contain: true
        });
        $panzoom.parent().on('mousewheel.focal', function(e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
                increment: 0.1,
                animate: false,
                focal: e
            });
        });
    })();
    // 第一圈游戏间关系鼠标悬停效果
    $('.relationship-text').hover(function() {
        $('.ball-scale-multiple').css('opacity', '0')
        $(this).next('.ball-scale-multiple').css('opacity', '1')
        $(this).addClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').addClass('line-change-color')
    })

    $('.relationship-text').mouseleave(function() {
        $('.ball-scale-multiple').css('opacity', '0')
        $(this).removeClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').removeClass('line-change-color')
    })

    // 第二圈游戏间关系鼠标悬停效果
    $('.child2-rt').hover(function() {
        $('.child2-ball').css('opacity', '0')
        $(this).next('.child2-ball').css('opacity', '1')
        $(this).addClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').addClass('line-change-color')
    })

    $('.child2-rt').mouseleave(function() {
        $('.child2-ball').css('opacity', '0')
        $(this).removeClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').removeClass('line-change-color')
    })

    // 第三圈游戏间关系鼠标悬停效果
    $('.child3-rt').hover(function() {
        $('.child3-ball').css('opacity', '0')
        $(this).next('.child3-ball').css('opacity', '1')
        $(this).addClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').addClass('line-change-color')
    })

    $('.child3-rt').mouseleave(function() {
        $('.child3-ball').css('opacity', '0')
        $(this).removeClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').removeClass('line-change-color')
    })

    // 鼠标悬停显示第二圈
    $('.child-pic').hover(function() {
        if ($(this).parent().hasClass('child2')){
            var textClass = 'child-2-' + $(this).parents('.child1').attr('class').slice(25) + $(this).parent().attr('class').slice(25)
        } else {
            var textClass = $(this).parent().attr('class').slice(17)
        }
        $('.' +　textClass+ 'text').css('display', 'block')
        $(this).parent().children('.line, .arc').css({
            transition: 'all  0.8s ease-in-out',
            display: 'block'
        })
    })
})

