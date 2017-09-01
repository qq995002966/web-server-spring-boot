$(function(){
    G_Login._check();
    U_Dom._menu('1-4-4');
    G_Login._status('user');
    var $_GET = getUrl('query');
    F_Info._getList();
});
var F_Info = {
    _getList:function(){
        G_Port._ajax('getBookReportList','get',true,null,function(){
                $('.read-online').html(G_Pre._loading());
                $('.buy-now').html(G_Pre._loading());
            },function(){
                $('.read-online').html('');
                $('.buy-now').html('');
            },function(data,msg){
                if(data && data.length > 0){
                    $('.read-online').html(F_Info._htmlInfo(data));
                }else{
                    $('.read-online').html(G_Pre._empty('您暂时没有已完成的报告，<a href="'+G_Jump._getUrl('item')+'?k=10"><span class="c_colorG">查看报告介绍</span></a>'));
                }
            },function(data,msg,code){
                $('.read-online').html(G_Pre._empty(msg));
                $('.buy-now').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlInfo:function(data){
        var str = '';
        if(data && data.length>0){
            var cdnImg = G_Common._cdnImgUrl();
            for(var i=0;i<data.length;i++){
                var content = data[i].item_desc ? data[i].item_desc.split('|') : ['',''];
                str += '<li>';
                str += '<img src="'+cdnImg+data[i].cover_pic+'">';
                str += '<p class="title">'+data[i].report_name+'</p>';
                str += '<p>'+data[i].report_slogan+'</p>';
                str += '<p class="content-report">'+data[i].report_desc+'</p>';
                str += '<button><a target="_blank" href="'+G_Jump._getUrl('reportDetail')+'?report_id='+data[i].book_id+'">在线阅读</a></button>';
                str += '</li>';
            }
            str += '</ul>';
        }
        return str;
    }
}