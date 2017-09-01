$(function(){

	$('.warcraft-part .nav-tab-change span').on('click',function(){
		var contentUrl = $(this).attr("href");
		$('.warcraft-part .nav-tab-change span').removeClass('nav-tab-selected');
		$('.warcraft-part .nav-tab-change span').children('i').removeClass('triganle-icon');
		$(this).addClass('nav-tab-selected');
		$(this).children('i').addClass('triganle-icon')
		$('.warcraft-part  .guide-tab-content').hide();
		$(contentUrl).show();
	});

});


