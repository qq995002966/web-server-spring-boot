$(function(){
    G_Login._check();
    G_Login._status('user');
    var $_GET = getUrl('query');
    var controller = getUrl('controller');
    switch(controller){
        case 'innerrationality':
            U_Dom._menu('2-5');
            break;
        case 'reporthot':
            U_Dom._menu('4-1-1');
            break;
        case 'reportdeep':
            U_Dom._menu('4-1-2');
            break;
        case 'reportrival':
            U_Dom._menu('4-1-3');
            break;
        case 'reportguide':
            U_Dom._menu('4-1-4');
            break;
    }

    var currentData = U_Service._init[controller];
    F_Info._getList(currentData[2]);
});
var F_Info = {
    _getList:function(itemId){
        G_Port._ajax('getReportItem','get',true,'item_id='+itemId,function(){
                $('.read-online').html(G_Pre._loading());
            },function(){
                $('.read-online').html('');
            },function(data,msg){
                if(data && data.length > 0){
                    $('.read-online').html(F_Info._htmlInfo(data));
                }else{
                    $('.read-online').html(G_Pre._empty('您还没有购买任何报告'));
                }
            },function(data,msg,code){
                $('.read-online').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlInfo:function(data){
        var str = '';
        if(data && data.length>0){
            var cdnImg = G_Common._cdnImgUrl();
            for(var i=0;i<data.length;i++){
                str += '<li>';
                str += '<img src="'+cdnImg+data[i].cover_pic+'">';
                str += '<p class="title">'+data[i].report_name+'</p>';
                str += '<p>'+data[i].report_slogan+'</p>';
                str += '<p class="content-report">'+data[i].report_desc+'</p>';
                str += '<a target="_blank" href="'+G_Jump._getUrl('reportDetail')+'?report_id='+data[i].report_id+'">在线阅读</a>';
                str += '</li>';
            }
            str += '</ul>';
        }
        return str;
    }
}