var config = {
    fontFamily: 'Calibri',
    fps: 60,
    box: 20,
    animationTime: 1000,
    center: {
        radius: 60,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        fill: '#404c58',
        font: {
            text: 'center',
            size: 16,
            color: 'rgb(255,255,255)'
        }
    },
    child: {
        radius: 35,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        fill: '#404c58',
        distance: 240,
        line: {
            color: '#f1f1f1',
            width: 0.5
        },
        font: {
            size: 14,
            color: '#FFFFFF'
        },
        child: {
            radius: 35,
            borderColor: '#FFFFFF',
            borderWidth: 1,
            distance: 240,
            fill: '#404c58',
            line: {
                color: '#f1f1f1',
                width: 0.5
            },
            font: {
                size: 14,
                color: '#FFFFFF'
            },
            child: {
                radius: 28,
                borderColor: '#FFFFFF',
                borderWidth: 1,
                distance: 220,
                fill: '#404c58',
                line: {
                    color: '#f1f1f1',
                    width: 0.5
                },
                font: {
                    size: 14,
                    color: '#FFFFFF'
                }
            }
        }
    }
}

function line(x1, y1, x2, y2, el) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b)

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2

    var x = sx - c / 2,
        y = sy

    var alpha = Math.PI - Math.atan2(-b, a)
    var style = 'width: ' + c + 'px; ' + 'height: 1px; ' + '-moz-transform: rotate(' + alpha + 'rad); ' + '-webkit-transform: rotate(' + alpha + 'rad); ' + '-o-transform: rotate(' + alpha + 'rad); ' + '-ms-transform: rotate(' + alpha + 'rad); '
        // + 'position: fixed; '
        + 'top: ' + y + 'px; ' + 'left: ' + x + 'px; '
    var lineDom = '<div class="line" style="' + style + '"></div>'
    if (el) {
        el.append(lineDom)
    } else {
        $('#canvas').append(lineDom)
    }
}

function arc(e, x, y, r) {
    e.css({
        top: y - r,
        left: x - r,
        height: r * 2,
        width: r * 2
    })
}
var position = {
    center: {
        origin: {
            x: null,
            y: null
        },
        current: {
            x: null,
            y: null
        }
    },
    child: []
}

// var getWindowSize = function () {
//     return {
//         height: window.innerHeight,
//         width: window.innerWidth
//     }
// }

var getWindowSize = function() {
    var div = document.getElementById('canvas')
    return {
        height: div.clientHeight,
        width: div.clientWidth
    }
}

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
})
