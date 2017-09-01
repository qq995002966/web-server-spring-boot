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
            radius: 32,
            borderColor: '#FFFFFF',
            borderWidth: 1,
            distance: 260,
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
