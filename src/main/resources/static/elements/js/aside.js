$(function () {
    /*输入框焦点
    $('.search-input').bind({
        focus:function(){
            if (this.value == this.defaultValue){
                this.value="";
            }
            if(this.value !== this.defaultValue && this.value !== '') {
                $(this).next('i').css('background-position','0 0');
            }else{
                $(this).next('i').css('background-position','-16px 0');
            }
        },
        blur:function(){
            if (this.value == ""){
                this.value = this.defaultValue;
            }
        }
    });
     */
    // 下拉菜单
    $("#dropDown p").click(function(){
        var ul = $(this).parent('#dropDown').children('ul');
        if(ul.css("display")=="none"){
            ul.slideDown("fast");
        }else{
            ul.slideUp("fast");
        }
    });
    /*
    $("#dropDown ul li a").click(function(){
        var txt = $(this).text();
        $(this).parents('#dropDown').find('p').html(txt);
        $(this).parents('#dropDown').children('ul').hide();
    });
    */
    // 问题展开与闭合
    $('.normal-question .arrow').on('click',function(){
        $(this).toggleClass('arrow-op');
        if($(this).hasClass('arrow-op')){
            $(this).next('p').show(500);
        } else {
            $(this).next('p').hide(500);
        }
    });

    // tab切换
    $('.plan .tab li').on('click',function(){
        var contentUrl = $(this).attr('href');
        $('.plan .tab li').removeClass('tab-selected');
        $('.plan .tab li i').removeClass('triganle-icon');
        $(this).addClass('tab-selected');
        $(this).find('i').addClass('triganle-icon');
        $('.plan .planArea').css('display', 'none');
        $(contentUrl).css('display', 'block');
        if(contentUrl=="#addNewgame"){
            $(this).parents('.tab').next('div').text('* 添加新游戏后，我们需要进行游戏相关信息核对，并进行数据抓取、分析工作，需要2~3天时间,请耐心等待或联系客服。');
        }
        else if(contentUrl=="#addGameword"){
             $(this).parents('.tab').next('div').text('*添加游戏的专有词汇，可以帮助系统更准确，更全面地理解玩家反馈的信息，为您提供更优质的数据分析服务。');
        }
        else if(contentUrl=="#addGamefrom"){
             $(this).parents('.tab').next('div').text('*添加新数据源，我们可以为您关注的游戏产品接入更多论坛分析采样数据源，以提供更精准的分析结果。');
        }
        else {
             $(this).parents('.tab').next('div').text('* 添加新游戏后，我们需要进行游戏相关信息核对，并进行数据抓取、分析工作，需要2~3天时间,请耐心等待或联系客服。');
        }
    });
});