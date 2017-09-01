require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        var $_GET = B_Common._getUrl('query');
        if($_GET.site && $_GET.service){
            $_GET.site = B_Common._decodeUrl($_GET.site);
            $_GET.service = B_Common._decodeUrl($_GET.service);
            var postData = [];
            var site = $_GET.site;
            var url = '';
            var siteLength = site.length;
            var siteLast = site.substr((siteLength-1),1);
            if(siteLast == '/'){
                site = site.substr(0,(siteLength-1));
            }
            if(site.toLowerCase().indexOf('youzu')>-1){
                site += '/game.html';
            }else{
                site += '/outside.html';
            }
            switch ($_GET.service){
                case 'demoInner':
                    var url = '/operate.html#/operateBasic/';
                    if(B_User._isDemoUser()){
                        B_Login._inDemo(url);
                    }else{
                        B_Jump._go('base',url);
                    }
                    return;
                    break;
                case 'keyword_alert':
                    switch ($_GET.type){
                        case 'forum':
                            url += '#/gamePost/';
                            break;
                        case 'channel':
                            url += '#/gameComment/';
                            break;
                    }
                    if($_GET.project_id){
                        postData.push('g='+$_GET.project_id);
                    }
                    if($_GET.keyword){
                        $_GET.keyword = B_Common._decodeUrl($_GET.keyword);
                        postData.push('k='+B_Common._encodeUrl($_GET.keyword));
                    }
                    if($_GET.data_date_start){
                        $_GET.data_date_start = B_Common._decodeUrl($_GET.data_date_start);
                        postData.push('b='+B_Common._encodeUrl($_GET.data_date_start));
                    }
                    if($_GET.data_date_end){
                        $_GET.data_date_end = B_Common._decodeUrl($_GET.data_date_end);
                        postData.push('e='+B_Common._encodeUrl($_GET.data_date_end));
                    }
                    break;
                case 'emergency_alert':
                    url += '#/gameAssistant/';
                    if($_GET.g){
                        postData.push('g='+$_GET.g);
                    }
                    if($_GET.date){
                        $_GET.date = B_Common._decodeUrl($_GET.date);
                        postData.push('d='+B_Common._encodeUrl($_GET.date));
                    }
                    if($_GET.sub_type){
                        $_GET.sub_type = B_Common._decodeUrl($_GET.sub_type);
                        postData.push('s='+B_Common._encodeUrl($_GET.sub_type));
                    }
                    if($_GET.main_type){
                        $_GET.main_type = B_Common._decodeUrl($_GET.main_type);
                        postData.push('m='+B_Common._encodeUrl($_GET.main_type));
                    }
                    break;
            }
            if(url == ''){
                B_Pop._init('msg',{'content':'参数错误1，请重试'});
                return;
            }
            if(postData && postData.length > 0){
                postData = postData.join('&');
            }else{
                B_Pop._init('msg',{'content':'参数错误2，请重试'});
                return;
            }
            B_Jump._go('base',site+'?'+postData+url);
        }else{
            B_Pop._init('msg',{'content':'参数错误3，请重试'});
            return;
        }
    });
});
