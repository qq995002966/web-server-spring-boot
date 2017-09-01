(function($){
	$.fn.Zoomer=function(b){
		var c=$.extend({
			speedView:200,
			speedRemove:400,
			altAnim:false,
			speedTitle:400,
			debug:false
		},b);
		var d=$.extend(c,b);
		function e(s){
			if(typeof console!="undefined"&&typeof console.debug!="undefined"){
				console.log(s)
			}
			else{
				alert(s)}
			}if(d.speedView==undefined||d.speedRemove==undefined||d.altAnim==undefined||d.speedTitle==undefined){
				e('speedView: '+d.speedView);
				e('speedRemove: '+d.speedRemove);
				e('altAnim: '+d.altAnim);
				e('speedTitle: '+d.speedTitle);
				return false
			}if(d.debug==undefined){
				e('speedView: '+d.speedView);
				e('speedRemove: '+d.speedRemove);
				e('altAnim: '+d.altAnim);
				e('speedTitle: '+d.speedTitle);
				return false
			}if(typeof d.speedView!="undefined"||typeof d.speedRemove!="undefined"||typeof d.altAnim!="undefined"||typeof d.speedTitle!="undefined"){
				if(d.debug==true){
					e('speedView: '+d.speedView);
					e('speedRemove: '+d.speedRemove);
					e('altAnim: '+d.altAnim);
					e('speedTitle: '+d.speedTitle)
				}
				// 第一圈
				$(this).hover(function(){
					$(this).find('b').css('display','none');
					$(this).css({'z-index':'110'});
					$(this).find('img').addClass("hover").stop().animate({
						// marginTop:'-25px',marginLeft:'-25px', top:'50%',left:'50%',width:'100px',height:'100px',padding:'15px'
						width:'100px',height:'100px'
						, top:'50%', left: '50%'
						, marginLeft: '-50px',marginTop:'-50px'
					},d.speedView);
					if(d.altAnim==true){
						var a=$(this).find("img").attr("alt");
						// console.log(a);
						if(a.length!=0){
							$(this).prepend('<p class="title">'+a+'</p>');
							$('.title').animate({
								// marginLeft:'-25px',marginTop:'40px',textIndent:'1'
								marginTop:'40px',textIndent:'1',positon:'relative',left: '50%', textAline:'center',marginLeft: '-50px'
							},d.speedTitle).css({'z-index':'3','position':'absolute','float':'left'})
						}
					}
				},function(){
					$(this).css({'z-index':'0'});
					$(this).find('img').removeClass("hover").stop().animate({
						marginTop:'0',marginLeft:'0',top:'0',left:'0',width:'100%',height:'100%',padding:'0px'
					},d.speedRemove);
					$(this).find('b').css('display','block');
					$(this).find('.title').remove()
				});

				// 第二圈
				$('.boxx').hover(function(){
					$(this).find('b').css('display','none');
					$(this).css({'z-index':'110'});
					$(this).find('img').addClass("hover").stop().animate({
						width:'100px',height:'100px', padding: '0px',
						marginTop:'-25px',marginLeft:'-25px'
						,left:'25%',right:'25%'
					},d.speedView);
					if(d.altAnim==true){
						var a=$(this).find("img").attr("alt");
						// console.log(a);
						if(a.length!=0){
							$(this).prepend('<p class="title">'+a+'</p>');
							$('.title').animate({
								marginTop:'30px',textIndent:'1',positon:'relative',left: '50%', textAline:'center',marginLeft: '-50px'
							},d.speedTitle).css({'z-index':'3','position':'absolute','float':'left'})
						}
					}
				},function(){
					$(this).css({'z-index':'0'});
					$(this).find('img').removeClass("hover").stop().animate({
						marginTop:'0',marginLeft:'0',top:'0',left:'0',width:'100%',height:'100%',padding:'0px'
					},d.speedRemove);
					$(this).find('b').css('display','block');
					$(this).find('.title').remove()
				})
			}
	}
})(jQuery);