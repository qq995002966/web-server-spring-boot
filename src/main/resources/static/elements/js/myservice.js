var F_Index = 0;
$(function(){
    G_Login._check();
    C_Dom._header(3);
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();
    var $_GET = getUrl('query');

    if($_GET.t){
        F_Index = $_GET.t;
        console.log(F_Index);
        if($_GET.t+'' != '0'){
            var index = parseInt($_GET.t);
            $('.tab-list').removeClass('tab-selected');
            $('.icon-list').removeClass('icon-selected');
            $('.tab-list').eq(index).addClass('tab-selected');
            $('.tab-list').eq(index).children('.icon-list').addClass('icon-selected');
        }
    }
    F_Info._getList();

    if(!isDemoUser()){
        $('.s_img').html('<img src="elements/img/service/reg_yes.png">');
    }else{
        $('.s_img').html('<a href="'+G_Jump._getUrl('reg')+'"><img src="elements/img/service/reg_no.png"></a>');
    }
    $('.tab-list').each(function(index){
        $(this).click(function(){
            $('.tab-list').removeClass('tab-selected');
            $('.icon-list').removeClass('icon-selected');
            $(this).addClass('tab-selected');
            $(this).children('.icon-list').addClass('icon-selected');

            $('.content-part').eq(index).show().siblings('.content-part').hide();
        });
    });


});

var F_Info = {
    _getList:function(){
        /*
        G_Port._ajax('itemList','get',true,null,function(){
                $('.market-content').html(G_Pre._loading('c_padding30'));
            },function(){
                $('.market-content').html('');
            },function(data,msg){
                if(data.item_map && !G_Common._checkObjectIsEmpty(data.item_map)){
                    $('.market-content').html(F_Info._formatData(data.item_map));
                }else{
                    $('.market-content').html('暂无数据');
                }
            },function(data,msg,code){
                $('.market-content').html(G_Pre._empty(msg));
            }
        )
        */
        if(G_Services && !G_Common._checkObjectIsEmpty(G_Services)){
            $('.market-content').html(G_Services);
        }else{
            G_Service._getData('page');
        }
    },
    _formatData:function(data){
        var content1 = '';
        var content2 = '';
        var content3 = '';
        if(data['游戏外数据服务']){
            content1 = F_Info._htmlItem(data['游戏外数据服务']);
        }
        if(data['游戏内数据服务']){
            content2 = F_Info._htmlItem(data['游戏内数据服务']);
        }
        if(data['深度定制分析报告']){
            content3 = F_Info._htmlItem(data['深度定制分析报告']);
        }
        var str = '<div class="content-part';
        str += F_Index+'' == '0' ? '' : ' c_none';
        str += '">'+content1+'</div>';
        str += '<div class="content-part';
        str += F_Index+'' == '1' ? '' : ' c_none';
        str += '">'+content2+'</div>';
        str += '<div class="content-part';
        str += F_Index+'' == '2' ? '' : ' c_none';
        str += '">'+content3+'</div>';

        return str;
    },
    _htmlItem:function(data){
        var cdnImg = G_Common._cdnImgUrl();
        var str = '<ul class="product">';
        for(var i=0;i<data.length;i++){
            str += '<li class="product-list"><img src="'+cdnImg+data[i]['show_pic']+'" class="c_cursor" onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('item')+'?k='+data[i]['item_id']+'\')" alt="'+data[i]['item_name']+'"></li>';
        }
        str += '</ul>';
        return str;
    },
    _doApply:function(){
        G_Port._ajax('applyTryForFree','get',true,null,function(){
                $('.s_img img').attr('disabled',true);
            },function(){
                $('.s_img img').attr('disabled',false);
            },function(data,msg){
                G_Pop._init('confirm',{title:'提示',btn: ['确定'],skin:'layerCheck-class',content:'您已获得试用资格，请在“个人中心-我的服务”页面进行试用，点击确认将跳转至“我的服务”页面'},function(){
                    G_Jump._go('portrayal');
                });
            },function(data,msg,code){
                G_Pop._init('msg',{content:msg});
            }
        )
    }
}