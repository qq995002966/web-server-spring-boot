$(function() {
    // 缩放
    (function() {
        var $section = $('body');
        // var $section = $(window);
        var $panzoom = $section.find('#Wrapp').panzoom({
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


    // 绘制圆圈
    // 1
    $('#circle-min1').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2,
        size: 200,
        emptyFill: "rgba(0, 0, 0, 0)",
        fill: {
            gradient: ["red", "orange"]
        }
    });
    $('#circle-beyond1').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2 + 0.5,
        size: 200,
        fill: {
            gradient: ["red"]
        }
    });

    // 2
    $('#circle-min2').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.32,
        size: 200,
        emptyFill: "rgba(0, 0, 0, 0)",
        fill: {
            gradient: ["red", "orange"]
        }
    });
    $('#circle-beyond2').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.32 + 0.5,
        size: 200,
        fill: {
            gradient: ["red"]
        }
    });

    // 3
    $('#circle-min3').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2,
        size: 200,
        emptyFill: "rgba(0, 0, 0, 0)",
        fill: {
            gradient: ["red", "orange"]
        }
    });
    $('#circle-beyond3').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2 + 0.5,
        size: 200,
        fill: {
            gradient: ["red"]
        }
    });

    // 4
    $('#circle-min4').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2,
        size: 200,
        emptyFill: "rgba(0, 0, 0, 0)",
        fill: {
            gradient: ["red", "orange"]
        }
    });
    $('#circle-beyond4').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2 + 0.5,
        size: 200,
        fill: {
            gradient: ["red"]
        }
    });

    // 5
    $('#circle-min5').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2,
        size: 200,
        emptyFill: "rgba(0, 0, 0, 0)",
        fill: {
            gradient: ["red", "orange"]
        }
    });
    $('#circle-beyond5').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2 + 0.5,
        size: 200,
        fill: {
            gradient: ["red"]
        }
    });

        // 6
    $('#circle-min6').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2,
        size: 200,
        emptyFill: "rgba(0, 0, 0, 0)",
        fill: {
            gradient: ["red", "orange"]
        }
    });
    $('#circle-beyond6').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2 + 0.5,
        size: 200,
        fill: {
            gradient: ["red"]
        }
    });

        // 7
    $('#circle-min7').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2,
        size: 200,
        emptyFill: "rgba(0, 0, 0, 0)",
        fill: {
            gradient: ["red", "orange"]
        }
    });
    $('#circle-beyond7').circleProgress({
        startAngle: -Math.PI * 0.5,
        value: 0.2 + 0.5,
        size: 200,
        fill: {
            gradient: ["red"]
        }
    });
})
