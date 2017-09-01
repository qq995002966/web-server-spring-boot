$(function(){
  
	$('.title-tip').on('click',function(){
		$(this).toggleClass('change-class');
		if($(this).hasClass('change-class')){
			$(this).parents('.lt_fmTitle').next('.lt_fmArea').children('.lt_fmNotice').fadeIn();
		}else {
			$(this).parents('.lt_fmTitle').next('.lt_fmArea').children('.lt_fmNotice').fadeOut();
		}
	});


	$('.tip-all').on('click','tip-click',function(){
		$(this).next('#Position').fadeIn();
	});

});


