var dateBegin = G_Date._get(-6);
var dateEnd = G_Date._get(0);
$(function(){
    G_Login._check();
    C_Dom._header(1);
    C_Dom._quicker();
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();

    $('.mediakeyword .percent-table').perfectScrollbar();

    $('.nav-tab-change  span').on('click',function(){
        var contentUrl = $(this).attr('href');
        $('.nav-tab-change  span').removeClass('nav-tab-selected');
        $(this).addClass('nav-tab-selected');
        $('.guide-tab-content').css('display', 'none');
        $(contentUrl).css('display', 'block');
    });
});


