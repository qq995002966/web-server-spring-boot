$(function () {
    G_Login._check();
    C_Dom._header(3);
    C_Dom._footer();
    G_Login._status('user');
    G_Game._getCollect();

    var controller = getUrl('controller');
    var $_GET = getUrl('query');
    switch(controller){
        case 'subscribe':
            var itemId = $_GET.k;
            var chooseId = $_GET.i;
            var scope = $_GET.b;
            if(isNaN(itemId) || isNaN(chooseId) || isNaN(scope)){
                F_Common._confirm('订单错误，请重新下单！',itemId);
                return false;
            }
            F_Subscribe._item.id = itemId;
            F_Subscribe._item.unit = chooseId;
            F_Subscribe._item.scope = scope;
            G_Game._dropChoose(demoProjectId(),$('#bs_game_choose'));
            F_Subscribe._getItem();
            F_Subscribe._checkOrder();
            break;
        case 'subscribeok':
            var orderId = $_GET.k;
            if(orderId == ''){
                F_Common._confirm('订单错误，请重新下单！');
                return false;
            }
            F_Subscribeok._htmlInfo(orderId);
            $('.order_buy_btn').click(function(){
                G_Jump._go('base',G_Jump._getUrl('service'));
            });
            break;
    }
});
var F_Common = {
    _confirm:function(content,itemId){
        G_Pop._init('confirm',{skin:'layerCheck-class',content:content,btn:["重新下单"],title:"提示信息",closeBtn:0},function(){
            var url = itemId ? G_Jump._getUrl('item')+'?k='+itemId : G_Jump._getUrl('index');
            G_Jump._go('base',url);
        });
    }
}
var F_Subscribeok = {
    _htmlInfo:function(orderId){
        var str = '';
        str += '<span>您的预约订单已提交成功，我们将尽快与您取得进一步联系！</span><br>订单号：'+orderId;
        $('.od_info').html(str);
    }
}
var F_Subscribe = {
    _item:{'unitType':0,'unit':0,'id':0,'scope':0},
    _getItem:function(){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        G_Port._ajax('itemShow','get',true,'item_id='+F_Subscribe._item.id,null,function(){
            G_Pop._init('close');
        },function(data,msg){
            if(data && data.service_list.length > 0){
                F_Subscribe._htmlItem(data);
            }else{
                F_Common._confirm('当前商品不存在，请重新下单',F_Subscribe._item.id);
                return false;
            }
        },function(data,msg,code){
            G_Pop._init('msg',{content:msg});
        });
    },
    _htmlItem:function(data){
        if(F_Subscribe._item.scope+'' == data.game_scope+''){
            $('.order_buy_btn').attr('data-s',F_Subscribe._item.scope);
        }
        for(var i=0;i<data.service_list.length;i++){
            if(F_Subscribe._item.unit+'' == data.service_list[i].item_unit_id+''){
                $('.order_buy_btn').attr('data-i',F_Subscribe._item.unit);
            }
        }
        $('#bs_service_name').html(data.item_name);
        $('#bs_service_desc').html(data.item_desc);
        if(data.game_scope+'' != '0'){
            $('#bs_choose_show').show();
        }
    },
    _checkOrder:function(){
        $('.order_buy_btn').click(function(){
            var company_name = $.trim($('input[name="companyName"]').val());
            var company_address = $.trim($('input[name="companyAddress"]').val());
            var contact_name = $.trim($('input[name="people"]').val());
            var contact_type = $.trim($('input[name="phone"]').val());
            if(company_name == ''){
                G_Pop._init('msg',{content:'公司名称必须填写'});
                return false;
            }
            if(company_address == ''){
                G_Pop._init('msg',{content:'公司地址必须填写'});
                return false;
            }
            if(contact_name == ''){
                G_Pop._init('msg',{content:'联系人必须填写'});
                return false;
            }
            if(contact_type == ''){
                G_Pop._init('msg',{content:'联系方式必须填写'});
                return false;
            }

            var chooseId = $(this).attr('data-i');
            var scope = $(this).attr('data-s');
            var choosedGame = '';
            if(scope+'' == '1'){
                choosedGame = $('#gameDropChoose .gameDropCurrent p').attr('data-i');
            }
            if(!isNaN(chooseId)){
                var postData = 'company_name='+G_Common._encodeUrl(company_name)+'&company_address='+G_Common._encodeUrl(company_address)+'&contact_name='+G_Common._encodeUrl(contact_name)+'&contact_type='+G_Common._encodeUrl(contact_type)+'&item_unit_id='+chooseId+'&project_num=1&project_list='+choosedGame;

                F_Subscribe._addOrder(postData);
            }else{
                F_Common._confirm('当前商品不存在，请重新下单',F_Subscribe._item.id);
                return false;
            }
        });
    },
    _addOrder:function(postData){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        G_Port._ajax('createBook','post',true,postData,null,function(){
            G_Pop._init('close');
        },function(data,msg){
            G_Jump._go('base',G_Jump._getUrl('subscribeok')+'?k='+data.book_id);
        },function(data,msg,code){
            G_Pop._init('msg',{content:msg});
        });
    }
}