requirejs.config({
    shim: {
        'jquery.bxslider': ['jquery'],
        'layer': ['jquery'],
        'store.min': ['jquery'],
        'numbers': ['jquery'],
        'china': {
            deps:['echarts']
        },
        'front':{
            deps:['base']
        },
        'background':{
            deps:['base']
        },
        'jquery.panzoom':{
            deps:['jquery']
        }
    },
    baseUrl: 'elements2.0/js/lib',
    paths: {
        'jquery' : './jquery-1.9.1.min',
        'app': '../app_source',
        'echarts':'./echarts.min',
        'china':'./china',
        'numbers':'./numbers',
        'base': '../app_source/base',
        'front': '../app_source/front',
        'background': '../app_source/background',
        'perfect-scrollbar.jquery.min': './perfect-scrollbar.jquery.min',
        'perfectScrollbar': './perfect-scrollbar.min'
    },
    urlArgs: "bust=2.6.2.3"
});



