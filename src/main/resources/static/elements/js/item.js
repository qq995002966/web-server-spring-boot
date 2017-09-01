$(function () {
    G_Login._check();
    C_Dom._header(3);
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();
    var $_GET = getUrl('query');
    if(isNaN($_GET.k)){
        G_Pop._init('alert',{content:'查看的数据不存在！'});
        return false;
    }
    if($_GET.g){
        if(isNaN($_GET.g)){
            G_Pop._init('alert',{content:'查看的数据不存在！'});
            return false;
        }else{
            $('.im_buy_btn').attr('data-g',$_GET.g)
        }
    }
    F_Info._getInfo($_GET.k);
});

var F_Info = {
    _getInfo:function(itemId){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        setTimeout(function(){
            G_Port._ajax('itemShow','get',true,'item_id='+itemId,null,function(){
                G_Pop._init('close');
            },function(data,msg){
                if(data.is_on_sale == 0){
                    G_Pop._init('alert',{content:'当前商品已暂停销售！'});
                    return false;
                }else{
                    F_Info._htmlInfo(itemId,data);
                }
            },function(data,msg,code){
                G_Pop._init('msg',{content:msg});
            });
        },300);
    },
    _htmlInfo:function(itemId,data){
        var cdnImg = G_Common._cdnImgUrl();
        var str = '';
        var classify = '';
        var price = '';
        var itemUnitName = '购买单位';
        var chooseType = '';
        var isSubscribe = false;

        if(data.service_list && data.service_list.length > 0){
            for(var i=0;i<data.service_list.length;i++){
                if(data.service_list[i].item_unit+'' == '3'){
                    isSubscribe = true;
                }
                data.service_list[i].price = (data.service_list[i].price/100).toFixed(2);
                classify += '<button type="button" data-i="'+data.service_list[i].item_unit_id+'" data-t="'+data.service_list[i].item_unit+'" data-p="'+data.service_list[i].price+'" class="btn ';
                switch(i+''){
                    case '0':
                        chooseType = data.service_list[i].unit_name;
                        price = data.service_list[i].price;
                        classify += 'btn-primary';
                        break;
                    default:
                        classify += 'btn-default';
                        break;
                }
                classify += '">'+data.service_list[i].unit_name+'</button>';
            }
        }
        //$('.service-name').html('服务：'+data.item_name);
        //$('.service-time').html(itemUnitName+'：'+chooseType);

        var suitGameName = data.game_scope+'' == 1 ? '单款游戏' : '所有游戏';
        var classifyChooseStr = '';
        if(isSubscribe){
            classifyChooseStr = '<dl class="c_marginB20 c_none">';
            $('.im_buy_btn').html('立即预约');
            //$('.im_price').html('￥'+data.refer_price);
            $('.flowwrap .buy ul').css({'width':'340px','left':'120px'});
            $('.over').css({'width':'150px'});
        }else{
            $('.im_buy_btn').html('立即使用');
            //$('.im_price').html('￥'+price);
            classifyChooseStr = '<dl class="c_marginB20 c_none">';
        }
        classifyChooseStr += '<dt class="dis-block">'+itemUnitName+'</dt><dd class="im_choose">'+classify+'</dd></dl>';
        str += '\
            <img class="project-head-pic" src="'+cdnImg+data.cover_pic+'">\
            <div class="im_info">\
                <div class="im_if_title c_marginB10">'+data.item_name+'</div>\
                <div class="im_if_intro c_marginB20">'+data.item_slogan+'</div>\
                <dl class="range-game">\
                    <dt>适用范围:</dt><dd>'+suitGameName+'</dd>\
                </dl>'+classifyChooseStr+'\
                <dl class="relative-service" id="bs_recommend"></dl>\
            </div>';


        $('#bs_info').html(str);
        F_Info._formatChoose(itemUnitName);
        F_Info._formatBuy(itemId,data.item_name,data.game_scope);
        var image = '<div>';
        if(data.item_pics){
            var images = data.item_pics.split(',');
            for(var i=0;i<images.length;i++){
                image += '<img src="'+cdnImg+images[i]+'">';
            }
        }
        image += '</div>';
        $('#bs_detail').html(image);

        str = '<dt class="dis-block">相关推荐</dt>';
        if(data.recommend_item_list && data.recommend_item_list.length > 0){
            for(var i=0;i<data.recommend_item_list.length;i++){
                if(i>2)break;
                var coverPicBase = data.recommend_item_list[i].cover_pic;
                var coverPicReal = '';
                if(coverPicBase){
                    var coverPath = '';
                    var coverName = '';
                    var coverShuffix = '';
                    var coverPic = coverPicBase.split('/');
                    coverPic = coverPic[(coverPic.length-1)];
                    coverPath = coverPicBase.replace(coverPic,'');
                    coverShuffix = coverPic.split('.');
                    coverName = coverShuffix[0];
                    coverShuffix = coverShuffix[1];
                    coverPicReal = coverPath+coverName+'200.'+coverShuffix;
                }
                var borderClass = 'relative-service-borderRight';
                if(i==2)borderClass = '';
                str += '\
                        <dd data-i="'+data.recommend_item_list[i].item_id+'" class="'+borderClass+'">\
                            <p>'+data.recommend_item_list[i].item_name+'</p>\
                            <img src="'+cdnImg+coverPicReal+'">\
                        </dd>'
            }
            // <p>￥'+data.recommend_item_list[i].refer_price+'</p>\

            $('#bs_recommend').html(str);

            $('#bs_recommend dd').each(function(){
                $(this).click(function(){
                    var itemId = $(this).attr('data-i');
                    if(itemId != ''){
                        G_Jump._go('base',G_Jump._getUrl('item')+'?k='+itemId);
                    }
                });
            });
        }
    },
    _formatChoose:function(typeName){
        $('.im_choose button').each(function(){
            $(this).click(function(){
                if(!$(this).hasClass('btn-primary')){
                    $('.buy ul').show();
                    $(this).removeClass('btn-default').addClass('btn-primary').siblings().removeClass('btn-primary').addClass('btn-default');
                    $('.service-time').html(typeName+'：'+$(this).text());
                    $('.im_price').html('￥'+$(this).attr('data-p'));
                }
            });
        });
    },
    _formatBuy:function(itemId,itemName,gameScope){
        $('.im_buy_btn').click(function(){
            var choName = '';
            var choPrice = '';
            var choNum = '';
            var choType = '';
            $('.im_choose button').each(function(){
                if($(this).hasClass('btn-primary')){
                    choName = $(this).text();
                    choPrice = $(this).attr('data-p');
                    choNum = $(this).attr('data-i');
                    choType = $(this).attr('data-t');
                }
            });
            var url = ''
            switch(choType+'') {
                case '3':
                    break;
                default:
                    switch(choNum+''){
                        case '16':
                        case '17':
                        case '18':
                        case '19':
                            url = 'outsideAlarm';
                            break;
                        case '10':
                        case '11':
                        case '14':
                        case '15':
                            url = 'outsideHotWord';
                            break;
                        case '5':
                        case '6':
                        case '12':
                        case '13':
                            url = 'outsideAssistant';
                            break;
                        case '7':
                        case '8':
                        case '9':
                            url = 'outsideChat';
                            break;
                        default:
                            url = 'outsideFaceSummary';
                            break;
                    }
                    break;
            }
            if(isDemoUser()){
                openLogin(url);
                return false;
            }else{
                if(choPrice != '' && choNum != ''){
                    var gameId = $(this).attr('data-g');
                    if(!gameId)gameId = '0';
                    var rand = G_Security._rand(10000,99999);
                    var salt = G_Security._salt();
                    var number = G_Security._md5(gameId+gameScope+itemId+itemName+choNum+choName+choPrice+salt+rand);

                    switch(choType+''){
                        case '3':
                            url = 'subscribe';
                            G_Jump._go('base',G_Jump._getUrl(url)+'?g='+gameId+'&b='+gameScope+'&k='+itemId+'&r='+rand+'&e='+choType+'&t='+encodeURIComponent(itemName)+'&n='+encodeURIComponent(choName)+'&o='+number+'&p='+choPrice+'&i='+choNum+'&s='+salt);
                            break;
                        default:
                            //url = 'market';
                            G_Jump._go('base',G_Jump._getUrl(url));
                            break;
                    }

                }else{
                    GoToTop();
                    G_Pop._init('msg',{content:'请刷新页面重试'});
                }
            }
        });
    }
}