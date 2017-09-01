$(function () {
    G_Login._check();
    C_Dom._header(3);
    C_Dom._quicker();
    C_Dom._footer();
    G_Login._status('user');
    G_Game._getCollect();

    $('.left>img').hover(function(){
        $(this).next('.hover-bg').css('display','block');
    });

    $('.hover-bg').mouseleave(function(){
        $(this).css('display','none');
    });

    $('.service-content button').each(function(index){
        $(this).click(function(){
            var current = 0;
            switch(index){
                case 0:
                case 1:
                    current = 1;
                    break;
                case 2:
                case 3:
                    current = 2;
                    break;
                case 4:
                case 5:
                    current = 3;
                    break;
                case 6:
                case 7:
                    current = 4;
                    break;
            }
            if(current > 0){
                if($('.service-content button').eq(current).hasClass('enter-into_closed')){
                    F_Service._open(1);
                }else{
                    switch(current){
                        case 1:
                            G_Jump._go('portrayal');
                            break;
                        case 2:
                            G_Jump._go('yuqin');
                            break;
                        case 3:
                            G_Jump._go('chat');
                            break;
                        case 4:
                            G_Jump._go('reci');
                            break;
                    }
                }
            }
        });
    });
    F_Service._getData();
});
var F_Service = {
    _open:function(index){
        G_Port._ajax('serviceOpen','get',true,'service_type='+index,null,null,function(data,msg){
                F_Service._html(index)
            },null
        )
    },
    _getData:function(){
        G_Port._ajax('serviceStatus','get',true,null,null,null,function(data,msg){
                if(data.get && data.get.length>0){
                    for(var i=0;i<data.get.length;i++){
                        F_Service._html(data.get[i].service_type,data.get[i])
                    }
                }
            },null
        )
    },
    _html:function(dom,data){
        if(data && data != ''){
            $('#bs_servcie'+dom+' .remaining').html('<i></i>服务期剩余<b>'+data.remaining_days+'</b>天');
            $('#bs_servcie'+dom+' .trial-icon').show();
            $('#bs_servcie'+dom+' button').removeClass('enter-into_closed').addClass('enter-into_open').text('进入配置页');
        }else{
            $('#bs_servcie'+dom+' .remaining').html('<i></i>服务期剩余<b>30</b>天');
            $('#bs_servcie'+dom+' .trial-icon').show();
            $('#bs_servcie'+dom+' button').removeClass('enter-into_closed').addClass('enter-into_open').text('进入配置页');
        }

    }
}


$(function () {

// 点击弹出层
    $('.product-b').on('click', function(){
        layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              skin: 'yourclass',
              content: $('#popOne')
            });
        });

    $('.product-c').on('click', function(){
        layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              skin: 'yourclass',
              content: $('#popTwo')
            });
        });

    $('.product-d').on('click', function(){
        layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              skin: 'yourclass',
              content: $('#popThree')
            });
        });
// 关闭弹出层
    $('.close-pop-icon').on('click',function(){
        layer.closeAll();
    });

// 轮播图片（舆情）
       $('#popOne .layer-body').mySlider({
          sliders: [
              {image: 'elements/img/service_demo/demo_yuqing_1.png'},
              {image: 'elements/img/service_demo/demo_yuqing_2.png'}
          ],
          delayTime: 500
        });
// 轮播图片（聊天）
       $('#popTwo .layer-body').mySlider({
          sliders: [
              {image: 'elements/img/service_demo/demo_chat_1.png'},
              {image: 'elements/img/service_demo/demo_chat_2.png'},
              {image: 'elements/img/service_demo/demo_chat_3.png'},
              {image: 'elements/img/service_demo/demo_chat_4.png',link: 'http://www.thinkinggame.cn/chatresult.html?info_id=162'}
          ],
          delayTime: 500
        });
// 轮播图片（热词）
       $('#popThree .layer-body').mySlider({
         sliders: [
              {image: 'elements/img/service_demo/demo_ci_1.png'},
              {image: 'elements/img/service_demo/demo_ci_2.png'},
              {image: 'elements/img/service_demo/demo_ci_3.png'}
          ],
          delayTime: 500
        });
});
