requirejs.config({
    shim: {
        'layer': ['jquery'],
        'store.min': ['jquery'],
        'background':{
            deps:['base']
        }
    },
    baseUrl: 'elements2.0/js/lib',
    paths: {
        'jquery' : './jquery-1.9.1.min',
        'app': '../app',
        'base': '../app/base',
        'background': '../app/background'
    }
});
require(['jquery','layer','store.min','base','background'], function(){
    store = require('store.min');
    B_Login._checkUpdate();
    var $_GET = B_Common._getUrl('query');
    if(!$_GET.d && B_User._isDemoUser()){
        parent.B_Login._openLogin('background');
    }else{
        if(!($_GET.k && !isNaN($_GET.g))){
            parent.B_Pop._init('close');
            parent.B_Pop._init('msg',{'content':'选择的数据不存在，请刷新页面重试'});
            return false;
        }else{
            var portUrl = 'innerUserDetail';
            if($_GET.d){
                portUrl  = 'demoInnerUserDetail';
            }
            var domList = $('.property-content');

            var postData = {};
            postData['data_id'] = B_Common._decodeUrl($_GET.k);
            postData['game_id'] = $_GET.g;
            postData = B_Common._postData(postData);

            B_Port._ajax(portUrl,'get',true,postData,function () {
                    domList.html(B_Pre._loading());
                },function () {
                    domList.html('');
                },function(data,msg){
                    if(data.groupTitle && data.groupTitle.length > 0){
                        var str = '';
                        for(var i=0;i<data.groupTitle.length;i++){
                            str += '<div class="pro-content">';
                            str += '<h1>'+data.groupTitle[i]+'</h1>';
                            str += '<ul>';
                            str += '<li>';
                            $.each(data.data[data.groupTitle[i]],function (key,value) {
                                str += '<span>'+key+'：<b>'+value+'</b></span>';
                            });
                            str += '</li></ul></div>';
                        }
                        domList.html(str);
                    }
                },function(data,msg,code){
                    domList.html(B_Pre._empty(msg));
                }
            );
        }
    }
});


