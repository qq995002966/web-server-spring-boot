$(function () {
    G_Login._check();
    C_Dom._header(3);
    C_Dom._footer();
    G_Login._status('user');
    G_Game._getCollect();

    var controller = getUrl('controller');
    var $_GET = getUrl('query');
    switch(controller){
        case 'market':
            var gameId = $_GET.g;
            var itemId = $_GET.k;
            var chooseId = $_GET.i;
            var security = $_GET.s;
            if(isNaN(gameId) || isNaN(itemId) || isNaN(chooseId)){
                F_Common._confirm('订单错误，请重新下单！',itemId);
                return false;
            }
            F_Market._item.gameId = $_GET.g ? $_GET.g : 0;
            F_Market._item.id = itemId;
            F_Market._item.unit = chooseId;
            F_Market._getItem();
            F_Market._getCoupon();

            $('.mt_coupon button').click(function(){
                $('.mt_coupon_list').hide();
                F_Market._formatCoupon();
            });

            F_Market._checkOrder();

            $('input[name="coupon"]').focus(function(){
                $('.mt_coupon_list').show();
            });
            $('.mt_coupon_title i').click(function(){
                $('.mt_coupon_list').hide();
            });
            break;
        case 'order':
            var orderId = $_GET.k;
            if(orderId == ''){
                F_Common._confirm('订单错误，请重新下单！');
                return false;
            }
            $('.od_pay_type input').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });
            $('input[name="useragree"]').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });
            $('.order_buy_btn').click(function(){
                F_Order._check(orderId);
            });
            $('#bs_agree').click(function(){
                G_Open._notice('《ThinkingGame服务协议》','1050px','600px',G_Jump._getUrl('notices')+'?t=pay')
            });

            F_Order._getInfo('order',orderId);
            break;
        case 'pay':
            var orderId = $_GET.k;
            var type = $_GET.t;
            var channel = '';
            if(orderId == ''){
                F_Common._confirm('订单错误，请重新下单！');
                return false;
            }
            switch(type+''){
                case '1':
                    channel = 'alipay_qr';
                    break;
                case '2':
                    channel = 'wx_pub_qr';
                    break;
            }
            if(channel == ''){
                F_Common._confirm('订单错误，请重新下单！');
                return false;
            }
            F_Order._getInfo('pay',orderId,channel);
            break;
    }
});
var F_Common = {
    _confirm:function(content,itemId){
        G_Pop._init('confirm',{skin:'layerCheck-class',content:content,btn:["重新下单"],title:"提示信息",closeBtn:0},function(){
            var url = itemId ? G_Jump._getUrl('item')+'?k='+itemId : G_Jump._getUrl('index');
            G_Jump._go('base',url);
        });
    },
    _confirmPay:function(content,button){
        G_Pop._init('confirm',{skin:'layerCheck-class',content:content,btn:[button],title:"提示信息",closeBtn:0},function(){
            G_Jump._go('base',G_Jump._getUrl('account'));
        });
    }
}
var F_Market = {
    _buff:{},
    _item:{'scope':0,'price':0,'unitType':0,'unit':0,'total':0,'cutOff':0,'id':0,'gameId':'','coupon':''},
    _isChooseGame:function(){
        switch(F_Market._item.scope+''){
            case '0':
                $('#bs_mt_game').html('<div class="mt_game_notice">该服务所有游戏均可使用</div>');
                break;
            default:
                var gameName = '';
                if(F_Market._item.gameId != 0){
                    gameName = G_Game._name(F_Market._item.gameId);
                }
                gameName=='' ?  G_Game._dropChoose(null,$('#bs_game_choose'),'select') : F_Market._chooseGame(F_Market._item.gameId,gameName,'choosed');;
                break;
        }
    },
    _getCoupon:function(){
        G_Port._ajax('getCoupon','get',true,'item_id='+F_Market._item.id,function(){
            $('.mt_coupon_show').html(G_Pre._loading());
        },function(){
            $('.mt_coupon_show').html('');
        },function(data,msg){
            if(data && data.length > 0){
                $('.mt_coupon_show').html(F_Market._htmlCoupon(data));
                $('.mt_coupon_show table tr').each(function(index){
                    $(this).click(function(){
                        if(index > 0){
                            $('input[name="coupon"]').val($(this).attr('data-i'));
                            $('.mt_coupon_list').hide();
                            F_Market._formatCoupon();
                        }
                    });
                });
            }else{
                $('.mt_coupon_show').html('<div class="mt_coupon_notice">暂无优惠券，如有请手动输入。</div>');
            }
        },function(data,msg,code){
            $('.mt_coupon_show').html(msg);
        });
    },
    _htmlCoupon:function(data){
        var str = '<table><tr><th>代金券代码</th><th>代金券金额</th><th>过期时间</th></tr>';
        for(var i=0;i<data.length;i++){
            str += '<tr data-i="'+data[i].coupon_id+'">';
            str += '<td>'+data[i].coupon_id+'</td><td>'+(data[i].coupon_price/100).toFixed(2)+'</td><td>'+data[i].expire_date+'</td>';
            str += '</tr>';
        }
        str += '</table>';
        return str;
    },
    _chooseGame:function(id,name,type){
        var choosed = F_Market._getChoosedGame();
        if($.inArray(id,choosed) > -1){
            G_Pop._init('msg',{content:'当前游戏'+name+'已选择过'});
            return false;
        }else{
            if(choosed.length >= 10){
                G_Pop._init('msg',{content:'每次最多选择10款游戏，请确认'});
                return false;
            }else{
                $('#bs_mt_game').prepend(F_Market._htmlChoose(id,name,type));
                F_Market._formatChoose();
                F_Market._htmlPrice();
            }
        }
    },
    _formatChoose:function(){
        $('.mt_game dl .glyphicon-remove').each(function(){
            $(this).click(function(){
                $(this).parent('dl').remove();
                F_Market._htmlPrice();
            })
        });
    },
    _htmlChoose:function(id,name,type){
        var str = '';
        var delStr = '';
        switch(type){
            case 'choosed':
                break;
            default:
                delStr = '<i class="glyphicon glyphicon-remove c_cursor"></i>';
                break;
        }
        str += '<dl data-i="'+id+'">\
                    <dt><img src="'+G_Game._imgUrl(id)+'"></dt>\
                    <dd>'+name+'</dd>'+delStr+'\
                </dl>';
        return str;
    },
    _getChoosedGame:function(){
        var choosed = [];
        $('.mt_game dl').each(function(){
            choosed.push($(this).attr('data-i'));
        });
        return choosed;
    },
    _formatCoupon:function(){
        var couponNumber = $.trim($('input[name="coupon"]').val());
        if(couponNumber == ''){
            G_Pop._init('msg',{content:'请输入代金券代码'});
            return false;
        }else{
            F_Market._checkCoupon($('.mt_coupon button'),couponNumber);
        }
    },
    _couponPrice:function(){
        var showPrice = (parseFloat(F_Market._item.total) - parseFloat(F_Market._item.cutOff)).toFixed(2);
        if(F_Market._item.total > 0 && showPrice <= 0){
            F_Market._item.coupon = '';
            F_Market._item.cutOff = 0;
            G_Pop._init('msg',{content:'代金券金额不能大于实际支付金额'});
            return false;
        }else{
            F_Market._htmlPrice();
        }
    },
    _checkCoupon:function(dom,data){
        G_Port._ajax('couponCheck','post',true,'coupon_id='+data+'&item_id='+F_Market._item.id,function(){
            btnStatus('coupon','disable',dom);
        },function(){
            btnStatus('coupon','normal',dom);
        },function(data,msg){
            F_Market._item.cutOff = (data.coupon_price/100).toFixed(2);
            F_Market._item.coupon = data.coupon_id;
            F_Market._couponPrice();
        },function(data,msg,code){
            F_Market._item.coupon = '';
            F_Market._item.cutOff = 0;
            F_Market._htmlPrice();
            G_Pop._init('msg',{content:msg});
        });
    },
    _checkOrder:function(){
        $('.order_buy_btn').click(function(){
            var couponId = F_Market._item.coupon;
            var chooseId = F_Market._item.unit;
            var scope = F_Market._item.scope;
            if(!isNaN(chooseId)){
                var choosedGame = '';
                switch(scope+''){
                    case '1':
                        choosedGame = F_Market._getChoosedGame();
                        if(choosedGame.length <= 0){
                            G_Pop._init('msg',{'content':'请选择服务适用的游戏'});
                            return false;
                        }else{
                            choosedGame = choosedGame.join(',');
                        }
                        break;
                }
                var postData = 'order_type=1&item_unit_id='+chooseId+'&project_list='+choosedGame;
                if(couponId != '')postData += '&coupon_id='+couponId;
                F_Market._addOrder(postData);
            }
        });
    },
    _addOrder:function(postData){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        G_Port._ajax('orderAdd','post',true,postData,null,function(){
            G_Pop._init('close');
        },function(data,msg){
            G_Jump._go('base',G_Jump._getUrl('order')+'?k='+data.order_id);
        },function(data,msg,code){
            G_Pop._init('msg',{content:msg});
        });
    },
    _formatPrice:function(){
        var total = '';
        switch(F_Market._item.scope+''){
            case '1':
                var choosed = F_Market._getChoosedGame();
                choosed = choosed.length;
                total = (parseFloat(F_Market._item.price)*choosed).toFixed(2);
                break;
            default:
                total = F_Market._item.price;
                break;
        }
        F_Market._item.total = total;
    },
    _htmlPrice:function(){
        F_Market._formatPrice();
        var cutoff = parseFloat(F_Market._item.cutOff).toFixed(2);
        var price = (parseFloat(F_Market._item.total) - parseFloat(cutoff)).toFixed(2);
        $('.bs_price').html('￥'+F_Market._item.price);
        $('.service_price').html('￥'+F_Market._item.total);
        $('.coupon_price').html('-￥'+cutoff);
        $('.order_price').html('￥'+price);

        cutoff ? $('.mt_list_pirce').html('￥'+cutoff) : $('.mt_list_pirce').html('无');
    },
    _getItem:function(){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        G_Port._ajax('itemShow','get',true,'item_id='+F_Market._item.id,null,function(){
            G_Pop._init('close');
        },function(data,msg){
            if(data.is_on_sale == 0){
                G_Pop._init('alert',{content:'当前商品已暂停销售！'});
                return false;
            }else{
                F_Market._buff.item_unit = data.service_list;
                if(data.service_list.length > 0)F_Market._item.unitType = data.service_list[0].item_unit;
                F_Market._item.scope = data.game_scope;
                F_Market._htmlInfo(data.item_name,data.game_scope);
                var chooseName = F_Market._formatSelect();
                F_Market._isChooseGame();
            }
        },function(data,msg,code){
            G_Pop._init('msg',{content:msg});
        });
    },
    _formatSelect:function(){
        var choose = '';
        if(F_Market._buff.item_unit){
            var choosed = '';
            var choose = '';
            var data = F_Market._buff.item_unit;
            for(var i=0;i<data.length;i++){
                if(data[i].item_unit_id+'' == F_Market._item.unit+''){
                    F_Market._item.unitType = data[i].item_unit;
                    if(data[i].item_unit+'' == '2'){
                        $('.bs_type').html('永久使用');
                        $('.bs_t_game_title').hide();
                        $('.bs_t_game_choose').hide();
                    }
                    F_Market._item.price = (data[i].price/100).toFixed(2);
                   choosed = '<button class="btn btn-default dropdown-toggle bs_unit_choosed" type="button" id="unitChoose" data-toggle="dropdown" aria-expanded="false"><span data-i="'+data[i].item_unit_id+'" data-p="'+data[i].price+'">'+data[i].unit_name+'</span>　<i class="caret"></i></button>';
                }else{
                    choose += '<li><a data-i="'+data[i].item_unit_id+'" data-p="'+data[i].price+'">'+data[i].unit_name+'</a></li>';
                }
            }
        }
        F_Market._htmlPrice();
        if(choose != '')choose = '<ul class="dropdown-menu bs_unit_choose" aria-labelledby="unitChoose">'+choose+'</ul>';
        $('.bs_unit').html('<div class="dropdown">'+choosed+choose+'</div>');

        $('.bs_unit .bs_unit_choose li a').each(function(){
            $(this).click(function(){
                var price = $(this).attr('data-p');
                price = (parseFloat(price)/100).toFixed(2);
                F_Market._item.price = price;
                F_Market._item.unit = $(this).attr('data-i');
                F_Market._formatPrice();
                F_Market._couponPrice();
                F_Market._formatSelect();
            });
        });
    },
    _htmlInfo:function(itemName,chooseType){
        var chooseTypeName = '';
        switch(F_Market._item.unitType+''){
            case '0':
                chooseTypeName = '包年包月';
                break;
            case '3':
                chooseTypeName = '预约';
                break;
            default:
                chooseTypeName = '按次';
                break;
        }
        var str = '';
        str += '\
            <table>\
                <tr>\
                <th class="ser-name">服务名称</th>\
                <th class="pay-style">付费方式</th>\
                <th class="buy-size">购买单位</th>\
                <th class="discount">优惠</th>\
                <th class="money">金额</th>\
            </tr>\
            <tr>\
                <td>'+itemName+'</td>\
                <td class="bs_type">'+chooseTypeName+'</td>\
                <td class="bs_unit"></td>\
                <td class="mt_list_pirce"></td>\
                <td class="c_colorR bs_price"></td>\
                </tr>\
            </table>';
        $('#bs_list').html(str);
    }
}
var F_Order = {
    _check:function(orderId){
        if($('input[name="useragree"]').prop("checked")==false){
            G_Pop._init('msg',{'content':'请勾选并同意《ThinkingData服务协议》'});
            return false;
        }
        var payType = radioVal('type');
        G_Jump._go('open',G_Jump._getUrl('pay')+'?k='+orderId+'&t='+payType);
        G_Pop._init('confirm',{skin:'layerCheck-class',content:"是否支付成功?",btn:["已经支付成功","支付遇到问题"],title:"提示信息"},function(){
            G_Jump._go('base',G_Jump._getUrl('account'));
        },function(){
            G_Pop._init('close');
        });
    },
    _getInfo:function(type,data,channel){
        G_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        G_Port._ajax('orderDetail','get',true,'order_id='+data,null,function(){
            G_Pop._init('close');
        },function(data,msg){
            if(data.order_id){
                data.total_price = (data.total_price/100).toFixed(2);
                data.pay_price = (data.pay_price/100).toFixed(2);
                F_Order._htmlInfo(type,data.order_id,data.total_price,data.pay_price);
                if(type=='pay')F_Pay._getInfo($('.od_code'),data.order_id,channel);
            }else{
                F_Common._confirm('订单不存在，请重新下单！');
            }
        },function(data,msg,code){
            F_Common._confirm(msg);
        });
    },
    _htmlInfo:function(type,orderId,price,pay){
        var str = '';
        var showPrice = (type == 'order') ? price : pay;
        str += '\
                <div class="od_icon c_colorG c_floatLeft"><i class="glyphicon glyphicon-ok "></i></div>\
                    <div class="od_info c_floatLeft">\
                    <span>您的订单已经提交成功，请在24小时内完成支付！</span><br>\
                    订单号：'+orderId+'\
                </div>\
                <div class="od_money c_floatRight c_colorR">￥'+showPrice+'</div>\
                <div class="clearfix"></div>';

        $('#bs_info').html(str);
        if(type == 'order')$('.order_price').html('￥'+pay);
    }
}
var F_Pay = {
    _checkStatus:function(orderId){
        var statusInterval = '';
        statusInterval = setInterval(function(){
            G_Port._ajax('payStatus','get',true,'order_id='+orderId,null,null,function(data,msg){
                switch(data.status+''){
                    case '1':

                        break;
                    case '2':
                        clearInterval(statusInterval);
                        F_Common._confirmPay("支付成功-请在\"个人中心-我的服务\"页面使用服务。",'查看订单');
                        break;
                    default:
                        clearInterval(statusInterval);
                        F_Common._confirmPay("订单已取消",'查看订单');
                        break;
                }
            },function(data,msg,code){
                clearInterval(statusInterval);
                G_Pop._init('alert',{content:'支付失败，请重试'});
            });
        },5000);
    },
    _setCode:function(dom,url){
        dom.qrcode({
            render: "canvas",
            width: 260,
            height:260,
            text: url
        });
    },
    _getInfo:function(dom,orderId,payChannel){
        G_Port._ajax('payAdd','post',true,'pay_channel='+payChannel+'&order_id='+orderId,function(){
            dom.html(G_Pre._loading());
        },function(){
            dom.html('');
        },function(data,msg){
            var url = data.credential[payChannel];
            F_Pay._htmlInfo(dom,payChannel,url);
            F_Pay._checkStatus(orderId);
        },function(data,msg,code){
            dom.html(G_Pre._empty(msg));
        });
    },
    _htmlInfo:function(dom,channel,url){
        var str = '';
        var title = '';
        var notice = '';
        var img = '';
        switch(channel){
            case 'alipay_qr':
                title = '请使用<span class="c_colorB">支付宝</span>扫一扫轻松完成支付';
                notice = '首次请下载手机支付宝';
                img = '<div class="od_img od_phone od_alipay"></div>';
                break;
            case 'wx_pub_qr':
                title = '请使用<span class="c_colorG">微信</span>扫一扫轻松完成支付';
                notice = '首次请下载微信';
                img = '<div class="od_img od_phone od_wechat"></div>';
                break;
        }
        str += '\
                <div class="odLeft">\
                    <div class="od_cd_title c_marginB20">'+title+'</div>\
                    <div class="od_cd_code"></div>\
                    <div class="od_cd_notice c_marginTop20 c_marginB10">'+notice+'</div>\
                    <div class="od_cd_remark">在手机上完成交易后，我们可能需要几分钟的时间来确认支付是否成功，请耐心等待</div>\
                 </div>\
                <div class="odRight">'+img+'</div>\
                <div class="clearfix"></div>';

        dom.html(str);

        F_Pay._setCode($('.od_cd_code'),url);
    }
}