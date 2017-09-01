$(function(){
    G_Login._check();
    U_Dom._menu('1-4-3');
    G_Login._status('user');
    var $_GET = getUrl('query');
    var controller = getUrl('controller');
    switch(controller){
        case 'report':
            F_Info._getList();
            break;
        case 'report_s':
            if(!($_GET.report_id && !isNaN($_GET.report_id))){
                G_Pop._init('alert',{content:'查看的数据不存在,请确认！'});
                return;
            }
            //var url = G_Port._init('readReport')+'?report_id='+$_GET.report_id;
            //PDFObject.embed(data, "#pdf");
            G_Port._ajax('readReport','get',true,'report_id='+$_GET.report_id,function () {
                G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
            },function () {
                G_Pop._init('close');
            },function(data,msg){
                window.location.href = data.data;
            },function(data,msg,code){
                G_Pop._init('alert',{content:msg});
            });
            break;
    }
});
var F_Info = {
    _getList:function(){
        G_Port._ajax('getReportList','get',true,null,function(){
                $('.read-online').html(G_Pre._loading());
                $('.buy-now').html(G_Pre._loading());
            },function(){
                $('.read-online').html('');
                $('.buy-now').html('');
            },function(data,msg){
                if(data.data && data.data.length > 0){
                    $('.read-online').html(F_Info._htmlInfo(data.data));
                }else{
                    $('.read-online').html(G_Pre._empty('您还没有购买任何报告'));
                }
                if(data.recommend && data.recommend.length > 0){
                    $('.buy-now').html(F_Info._htmlRecommend(data.recommend));
                }else{
                    $('.buy-now').html(G_Pre._empty('您还没有购买任何报告'));
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
                str += '<p class="title">'+data[i].item_name+'</p>';
                str += '<p>'+content[0]+'</p>';
                str += '<p class="content-report">'+content[1]+'</p>';
                str += '<button><a target="_blank" href="'+G_Jump._getUrl('reportDetail')+'?report_id='+data[i].item_id+'">在线阅读</a></button>';
                str += '</li>';
            }
            str += '</ul>';
        }
        return str;
    },
    _htmlRecommend:function(data){
        var str = '';
        if(data && data.length>0){
            var cdnImg = G_Common._cdnImgUrl();
            for(var i=0;i<data.length;i++){
                var content = data[i].item_desc ? data[i].item_desc.split('|') : ['',''];
                str += '<li>';
                str += '<img src="'+cdnImg+data[i].cover_pic+'">';
                str += '<p class="title">'+data[i].item_name+'</p>';
                str += '<p>'+content[0]+'</p>';
                str += '<p class="content-report">'+content[1]+'</p>';
                str += '<button><a target="_blank" href="'+G_Jump._getUrl('item')+'?k='+data[i].item_id+'">立即购买</a></button>';
                str += '</li>';
            }
            str += '</ul>';
        }
        return str;
    }
}