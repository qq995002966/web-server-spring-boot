$(function(){
    var $_GET = getUrl('query');
    if($_GET.service_id && $_GET.game_id){
        if(!isNaN($_GET.service_id) && !isNaN($_GET.game_id)){
            var url = G_Port._init('innerReport')+'?service_id='+$_GET.service_id+'&game_id='+$_GET.game_id;
            PDFObject.embed(url, "#pdf");
        }
    }else{
        var url = 'http://file.thinkinggame.cn/pdf/report/2016%E4%B8%8A%E5%8D%8A%E5%B9%B4%E6%B8%B8%E6%88%8F%E8%A1%8C%E4%B8%9A%E8%88%86%E6%83%85%E6%8A%A5%E5%91%8A%20%E2%80%94%E2%80%94%E5%A4%A7%E6%95%B0%E6%8D%AE%E4%B8%93%E4%B8%9A%E8%A7%A3%E8%AF%BB.pdf';
        PDFObject.embed(url, "#pdf");
    }
});