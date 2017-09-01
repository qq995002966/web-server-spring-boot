requirejs.config({
    shim: {
        'layer': ['jquery'],
        'store.min': ['jquery'],
        'angular-ui-router':{
            deps:['angular']
        },
        'bootstrap':{
            deps:['jquery']
        },
        'bootstrap-switch': {
            deps:['bootstrap']
        },
        'china': {
            deps:['echarts']
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
        'angular': './angular.min',
        'angular-ui-router': './angular-ui-router.min',
        'bootstrap':'./bootstrap.min',
        'bootstrap-switch':'./bootstrap-switch.min',
        'echarts':'./echarts.min',
        'china':'./china',
        'app': '../app_source',
        'base': '../app_source/base',
        'background': '../app_source/background',
        'perfect-scrollbar.jquery.min': './perfect-scrollbar.jquery.min',
        'perfectScrollbar': './perfect-scrollbar.min'
    },
    urlArgs: "bust=2.6.2.3"  //防止读取缓存，调试用
});

require(['app/route','jquery','perfect-scrollbar.jquery.min','echarts','china','bootstrap','bootstrap-switch','layer','base','background','dateRange','store.min'],function(){
    store = require('store.min');
    echarts = require('echarts');
    angular.bootstrap(document, ['backgroundApp']);
});


