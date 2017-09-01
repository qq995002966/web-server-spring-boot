$(function(){
    G_Login._check();
    C_Dom._header();
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();


    $('.tab-list').on('click',function(){
    	$('.tab-list').removeClass('tab-selected');
    	$('.icon-list').removeClass('icon-selected');
    	$(this).addClass('tab-selected');
    	$(this).children('.icon-list').addClass('icon-selected');
    });

    
});
