$(function(){
    // 左侧tab
    $('.personal-content .personal-tabs li').each(function(index){
        $(this).click(function(){
            if(!$(this).hasClass('personal-tab-selected')){
                switch(index){
                    case 0:
                        G_Jump._go('user');
                        break;
                    case 1:
                        G_Jump._go('identity');
                        break;
                    case 2:
                        G_Jump._go('password');
                        break;
                }
            }

        });
    });
});
function dropShow(){
    // 下拉菜单
    $("#dropDown p").click(function(){
        var ul = $(this).parent('#dropDown').children('ul');
        if(ul.css("display")=="none"){
            ul.slideDown("fast");
        }else{
            ul.slideUp("fast");
        }
    });
}
function dropSelected(){
    $("#dropDown ul li a").click(function(){
        var txt = $(this).text();
        var key = $(this).attr('data-i');
        $(this).parents('#dropDown').find('p').html(txt).attr('data-i',key);
        $(this).parents('#dropDown').children('ul').hide();
    });
}