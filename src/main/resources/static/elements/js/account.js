$(function () {
    G_Login._check();
    var $_GET = getUrl('query');
    if(!G_Common._isInner()){
        U_Dom._menu('3-1');
        F_Order._getList(1);
    }else{
        if($_GET.k == ''){
            G_Pop._init('msg',{'content':'当前订单不存在'});
            return false;
        }
        switch($_GET.t){
            case 'invoice':
                $('#bs_order_number').html($_GET.k);
                $('#invoice_s').show();
                $('#bs_btn .btn-default').click(function(){
                    parent.G_Pop._init('close');
                });
                $('#bs_btn .btn-info').click(function(){
                    var postData = '';
                    var title = $.trim($('input[name="title"]').val());
                    var classify = $('.btn-group span').attr('data-t');
                    var receiver = $.trim($('input[name="receiver"]').val());
                    var phone = $.trim($('input[name="phone"]').val());
                    var address = $.trim($('input[name="address"]').val());
                    var postcode = $.trim($('input[name="postcode"]').val());

                    if(title == ''){
                        G_Pop._init('msg',{content:'请输入发票抬头'});
                        return false;
                    }
                    if(receiver == ''){
                        G_Pop._init('msg',{content:'请输入收件人'});
                        return false;
                    }
                    if(phone == ''){
                        G_Pop._init('msg',{content:'请输入收件人电话'});
                        return false;
                    }
                    if(address == ''){
                        G_Pop._init('msg',{content:'请输入收件地址'});
                        return false;
                    }
                    if(postcode == ''){
                        G_Pop._init('msg',{content:'请输入邮政编码'});
                        return false;
                    }

                    postData = 'order_id='+$_GET.k+'&title='+title+'&name='+receiver+'&phone='+phone+'&content='+classify+'&address='+address+'&postcode='+postcode;
                    F_Order._addInvoice(postData);
                });
                $('.dropdown-menu a').each(function(){
                    $(this).click(function(){
                        var type = $(this).attr('data-t');
                        var name = $(this).text();
                        $('.btn-group span').html(name).attr('data-t',type);
                    });
                });
                break;
            case 'detail':
                $('#detail_s').show();
                F_Order._getDetail($_GET.k);
                break;
            case 'send':
                $('#detail_s').show();
                F_Order._getInvoiceDetail($_GET.k);
                break;
        }
    }
    G_Login._status('user');
});
var F_Order = {
    _cancelConfirm:function(id){
        G_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要取消订单【'+id+'】么？',btn:['确认','取消'],title:'操作提示'},function(){
            F_Order._workCancel(id);
        },function(){
            G_Pop._init('close');
        });
    },
    _workCancel:function(id){
        G_Port._ajax('orderCancel','post',true,'order_id='+id,function(){
            G_Pop._init('load',{'type':1,'time':10});
        },function(){
            G_Pop._init('close');
        },function(data,msg){
            G_Pop._init('msg',{'content':'取消成功'});
            setTimeout(function(){
                top.window.location.reload();
            },1000);
        },function(data,msg,code){
            G_Pop._init('alert',{content:G_Pre._empty(msg)});
        })
    },
    _getDetail:function(orderId){
        G_Port._ajax('orderDetail','get',true,'order_id='+orderId,function(){
            $('#bs_detail').html(G_Pre._loading());
        },function(){
            G_Pop._init('close');
        },function(data,msg){
            if(data.order_id){
                $('#bs_detail').html(F_Order._htmlDetail(data));
            }else{
                $('#bs_detail').html(G_Pre._empty('订单不存在，请确认！'));
            }
        },function(data,msg,code){
            $('#bs_detail').html(G_Pre._empty(msg));
        });
    },
    _getInvoiceDetail:function(orderId){
        G_Port._ajax('invoiceDetail','get',true,'order_id='+orderId,function(){
            $('#bs_detail').html(G_Pre._loading());
        },function(){
            G_Pop._init('close');
        },function(data,msg){
            if(data){
                $('#bs_detail').html(F_Order._htmlInvoiceDetail(orderId,data));
            }else{
                $('#bs_detail').html(G_Pre._empty('发票不存在，请确认！'));
            }
        },function(data,msg,code){
            $('#bs_detail').html(G_Pre._empty(msg));
        });
    },
    _addInvoice:function(postData){
        G_Port._ajax('invoiceAdd','post',true,postData,function(){
            btnStatus('post','disable',$('#bs_btn .btn-info'));
            $('#bs_btn .btn-default').attr('disabled',true);
        },function(){
            btnStatus('post','normal',$('#bs_btn .btn-info'));
            $('#bs_btn .btn-default').attr('disabled',false);
        },function(data,msg){
            $('#bs_btn .btn-info').attr('disabled',false);
            parent.G_Pop._init('msg',{'content':'发票申请已提交，请耐心等待！'});
            setTimeout(function(){
                top.window.location.reload();
            },1000);
        },function(data,msg,code){
            G_Pop._init('msg',{'content':msg});
        });
    },
    _getList:function(page){
        var index = (page-1)*G_Page._size;
        G_Port._ajax('orderList','get',true,'index='+index+'&limit='+G_Page._size,function(){
                $('#bs_list').html(G_Pre._loading('c_padding30'));
                $('.page-list').html('');
            },function(){
                $('#bs_list').html('');
                $('.page-list').html('');
            },
            function(data, msg){
                if(data.order_list && data.order_list.length > 0){
                    $('#bs_list').html(F_Order._htmlList(data.order_list));
                    $('.page-list').html(G_Page._show({total:data.total_num,page:page},'number'));
                    $('.page-list span').each(function(){
                        var isJump = false;
                        $(this).click(function(){
                            if($(this).hasClass('prev')){
                                isJump = true;
                                page = parseInt(page)-1;
                            }else if($(this).hasClass('next')){
                                isJump = true;
                                page = parseInt(page)+1;
                            }else if($(this).hasClass('page-num')){
                                if($(this).html() != '…' && page != $(this).html()){
                                    isJump = true;
                                    page = $(this).html();
                                }
                            }
                            if(isJump){
                                F_Order._getList(page);
                                GoToTop();
                            }
                        });
                    });

                }else{
                    $('#bs_list').html('<div class="c_empty">暂无数据</div>');
                }
            },
            function(data, msg, code){
                $('#bs_list').html(G_Pre._empty(msg));
            }
        )
    },
    _formatStatus:function(status){
        var str = '';
        switch(status+''){
            case '1':
                str = '<span class="c_colorR">待付款</span>';
                break;
            case '2':
                str = '<span class="c_colorG">已支付</span>';
                break;
            case '3':
                str = '<span class="c_lineThrough">已取消</span>';
                break;
        }
        return str
    },
    _formatChannel:function(channel){
        var str = '';
        switch(channel){
            case 'alipay_qr':
                str = '支付宝';
                break;
            case 'wx_pub_qr':
                str = '微信';
                break;
            default:
                str = '-';
                break;
        }
        return str
    },
    _htmlDetail:function(data){
        var str = '';
        var channel = F_Order._formatChannel(data.pay_channel);
        var status = F_Order._formatStatus(data.status);

        data.coupon_price = (data.coupon_price/100).toFixed(2);
        data.total_price = (data.total_price/100).toFixed(2);
        data.pay_price = (data.pay_price/100).toFixed(2);
        str += '\
                <dl>\
                    <dt>产品名称：</dt>\
                    <dd>'+data.item_name+'</dd>\
                </dl>\
                    <dl>\
                    <dt>订单编号：</dt>\
                    <dd>'+data.order_id+'</dd>\
                </dl>\
                <dl>\
                    <dt>优惠编码：</dt>\
                    <dd>'+data.coupon_id+'</dd>\
                </dl>\
                <dl>\
                    <dt>优惠金额：</dt>\
                    <dd>￥'+data.coupon_price+'</dd>\
                </dl>\
                <dl>\
                    <dt>订单金额：</dt>\
                    <dd>￥'+data.total_price+'</dd>\
                </dl>\
                <dl>\
                    <dt>支付金额：</dt>\
                    <dd>￥'+data.pay_price+'</dd>\
                </dl>\
                <dl>\
                    <dt>支付方式：</dt>\
                    <dd>'+channel+'</dd>\
                </dl>\
                <dl>\
                    <dt>订单状态：</dt>\
                    <dd>'+status+'</dd>\
                </dl>\
                <dl>\
                    <dt>创建时间：</dt>\
                    <dd>'+data.create_time+'</dd>\
                </dl>';

        if(data.pay_time && data.pay_time != ''){
            str += '<dl>\
                        <dt>支付时间：</dt>\
                        <dd>'+data.pay_time+'</dd>\
                    </dl>';
        }
        return str;
    },
    _htmlInvoiceDetail:function(orderId,data){
        var str = '';
        str += '\
                <dl>\
                    <dt>订单号：</dt>\
                    <dd>'+orderId+'</dd>\
                </dl>\
                    <dl>\
                    <dt>发票抬头：</dt>\
                    <dd>'+data.title+'</dd>\
                </dl>\
                <dl>\
                    <dt>发票内容：</dt>\
                    <dd>'+data.content+'</dd>\
                </dl>\
                <dl>\
                    <dt>收件人：</dt>\
                    <dd>'+data.name+'</dd>\
                </dl>\
                <dl>\
                    <dt>联系电话：</dt>\
                    <dd>'+data.phone+'</dd>\
                </dl>\
                <dl>\
                    <dt>收件地址：</dt>\
                    <dd>'+data.address+'</dd>\
                </dl>\
                <dl>\
                    <dt>邮政编码：</dt>\
                    <dd>'+data.postcode+'</dd>\
                </dl>\
                <dl>\
                    <dt>创建时间：</dt>\
                    <dd>'+data.create_time+'</dd>\
                </dl>';

        return str;
    },
    _htmlList:function(data,numberBegin){
        var str = '<table>\
            <tr>\
            <th>订单编号</th>\
            <th>产品名称</th>\
            <th>创建时间</th>\
            <th>开通项目</th>\
            <th>支付方式</th>\
            <th>状态</th>\
            <th>金额</th>\
            <th>操作</th>\
        </tr>';
        for(var i=0;i<data.length;i++){
            var work = [];
            var workPay = '<a class="c_cursor" onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('order')+'?k='+data[i].order_id+'\')">马上支付</a>';
            var workCancel = '<a class="c_cursor" onclick="F_Order._cancelConfirm(\''+data[i].order_id+'\')">取消订单</a>';
            var workDetail = '<a class="c_cursor" onclick="F_Pop._open(\'detail\',\''+data[i].order_id+'\')">订单详情</a>';
            var workInvoice = '<a class="c_cursor" onclick="F_Pop._open(\'invoice\',\''+data[i].order_id+'\')">发票申请</a>';
            var workInvoiceDetail = '<a class="c_cursor" onclick="F_Pop._open(\'send\',\''+data[i].order_id+'\')">发票详情</a>';
            var payType = F_Order._formatChannel(data[i].pay_channel);
            var payStatus = F_Order._formatStatus(data[i].status);
            switch(data[i].status+''){
                case '1':
                    work.push(workPay);
                    work.push(workCancel);
                    break;
                case '2':
                    work.push(workDetail);
                    data[i].invoice_id == 0 ? work.push(workInvoice) : work.push(workInvoiceDetail);
                    break;
                case '3':
                    break;
            }
            data[i].pay_price = (data[i].pay_price/100).toFixed(2);
            str += '<tr>';
            str += '<td>'+data[i].order_id+'</td>';
            str += '<td>'+data[i].item_name+'</td>';
            str += '<td>'+data[i].create_time+'</td>';
            str += '<td>'+data[i].unit_name+'</td>';
            str += '<td>'+payType+'</td>';
            str += '<td>'+payStatus+'</td>';
            str += '<td class="c_colorR">￥'+data[i].pay_price+'</td>';
            str += '<td>'+work.join('　');
            str += '</td></tr>';
        }
        str += '</table>';
        return str;
    }
}
var F_Pop = {
    _open:function(type,orderId){
        var title = '';
        var height = '';
        var width = '';
        switch(type){
            case 'detail':
                title = '订单详情';
                height = '500px';
                width = '400px';
                break;
            case 'invoice':
                title = '发票申请';
                height = '500px';
                width = '600px';
                break;
            case 'send':
                title = '发票详情';
                height = '500px';
                width = '400px';
                break;
        }
        G_Pop._init('open',{'type':2,'scroll':true,'title':title,'width':width,'height':height,'shift':2,'content':'account_s.html?t='+type+'&k='+orderId},'');
    }
}