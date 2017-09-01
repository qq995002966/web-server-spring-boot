require(['frontmain'], function () {
    require(['jquery','layer','base'], function (){
        var $_GET = B_Common._getUrl('query');
        if(!($_GET.report_id && !isNaN($_GET.report_id))){
            B_Pop._init('alert',{content:'查看的数据不存在,请确认！'});
            return;
        }
        var postData = {};
        postData['report_id'] = $_GET.report_id;
        postData = B_Common._postData(postData);
        B_Port._ajax('readReport','get',true,postData,function () {
            B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        },function () {
            B_Pop._init('close');
        },function(data,msg){
            window.location.href = data.data;
        },function(data,msg,code){
            B_Pop._init('alert',{content:msg});
        });
    });
});