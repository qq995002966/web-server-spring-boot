$(function(){
    G_Login._check();
    C_Dom._header(-1);
    C_Dom._quicker();
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();

    $('.help-container .help-tabs ul li').on('click',function(){
        $('.help-container .help-tabs ul li').removeClass('help-tab-selected');
        $(this).addClass('help-tab-selected');
    });
});
function Go1(){
    $(".help-tab-content").animate({
        'scrollTop':0
    },500);
}

function Go2(){
    $(".help-tab-content").animate({
        'scrollTop':960
    },500);
}

function Go3(){
    $(".help-tab-content").animate({
        'scrollTop':1320
    },500);
}