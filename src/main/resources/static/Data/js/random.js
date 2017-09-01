// $(function(){
//  setTimeout(function () {
//         $(".l-point-a").show();
//     }, 6000);
//    $('.l-point-a').delay(6000).hide(0);
// });
var CJ_BUFF = '';
var CJ_INDEX = 0;
var CJ_TOTAL = 0;
var CJ_BEGIN = 0;
var CJ_NUMBER = 0;
var CJ_SWITCH = 0;
//var CJ_COUNT = 0;
//var CJ_PAGE = 0;
$(function(){
    CJ_Info._getInfo();
     window.setInterval(function(){
        CJ_Info._getInfo();
     },60000);
    $('.logo img').click(function(){
        window.location.href = CJ_Common._baseHost();
    });
})
var CJ_Info = {
    _getInfo:function(){
        CJ_Port._ajax('countryDetail','get',false,null,null,null,function(data,msg){
            if(data && data.content_list.length > 0){
                CJ_BUFF = data.content_list;
                CJ_BEGIN = data.total_post;
                CJ_TOTAL = data.content_list.length;
                CJ_INDEX = 0;
                //CJ_PAGE += 1;
                if(CJ_SWITCH == 0){
                    CJ_Tips._tipsOne();
                    CJ_Tips._tipsTwo();
                    CJ_Tips._tipsThree();
                    CJ_Tips._tipsFour();
                    CJ_Tips._tipsFive();
                    CJ_Tips._tipsSix();
                    CJ_Tips._tipsSeven();
                    CJ_Tips._tipsEight();
                    CJ_Tips._tipsNine();
                    CJ_Tips._tipsA();
                    CJ_Tips._tipsB();
                    CJ_Tips._tipsC();
                    CJ_Tips._tipsD();
                    CJ_Tips._tipsE();
                    CJ_Tips._tipsF();
                    CJ_Tips._tipsG();
                    CJ_Tips._tipsH();
                    CJ_Tips._tipsI();
                    CJ_Tips._tipsJ();
                    CJ_Tips._tipsK();
                    CJ_NUMBER = CJ_BEGIN+2000000;
                    CJ_Number._rotate();
                }
                CJ_SWITCH = 1;
            }
        },null);
    }
}
var CJ_Number = {
  _rotate:function(){
      $('.dataStatistics').dataStatistics({
          min: CJ_BEGIN, //起始数
          max: CJ_NUMBER, //终止数
          time: 86400000, //总时间
          len: 8 //几位数字（根据前面添加<div class="digit_set"></div>）
      });
  }
}
var CJ_Tips = {
    _tipsOne:function(){
        window.setInterval(showalertLA, 20401);
    },
    _tipsTwo:function(){
        window.setInterval(showalertLB, 24409);
    },
    _tipsThree:function(){
        window.setInterval(showalertLC, 18419);
    },
    _tipsFour:function(){
        window.setInterval(showalertLD, 20421);
    },
    _tipsFive:function(){
        window.setInterval(showalertRA, 12431);
    },
    _tipsSix:function(){
        window.setInterval(showalertRB, 12433);
    },
    _tipsSeven:function(){
        window.setInterval(showalertRC, 16439);
    },
    _tipsEight:function(){
        window.setInterval(showalertRD, 8443);
    },
    _tipsNine:function(){
        window.setInterval(showalertRE, 14449);
    },
    _tipsA:function(){
        window.setInterval(showalertRC1, 3457);
    },
    _tipsB:function(){
        window.setInterval(showalertRC2, 2461);
    },
    _tipsC:function(){
        window.setInterval(showalertRC3, 4463);
    },
    _tipsD:function(){
        window.setInterval(showalertRC4, 13983);
    },
    _tipsE:function(){
        window.setInterval(showalertRC5, 5479);
    },
    _tipsF:function(){
        window.setInterval(showalertRC6, 10487);
    },
    _tipsG:function(){
        window.setInterval(showalertRC7, 6491);
    },
    _tipsH:function(){
        window.setInterval(showalertRC8, 7499);
    },
    _tipsI:function(){
        window.setInterval(showalertRC9, 8503);
    },
    _tipsJ:function(){
        window.setInterval(showalertRC10, 12997);
    },
    _tipsK:function(){
        window.setInterval(showalertRC11, 11521);
    },
    _getData:function(dom){
        var data = CJ_BUFF[CJ_INDEX];
        CJ_INDEX += 1;
        //if(CJ_PAGE == 1){
        //   CJ_COUNT += 1;
        //    console.log(CJ_COUNT);
        //}
        if(CJ_INDEX >= CJ_TOTAL)CJ_INDEX = 0;
        dom.find('p').html(data.post_time+' 来自 '+data.source);
        var content = data.content && data.content != '' ? data.content : '&nbsp';
        dom.find('span').html(content);
        if(data.image && data.image != '')dom.find('.per-icon').attr('src',CJ_Common._cdnImgUrl()+data.image);
    },
    _removeData:function(dom){
        dom.find('p').html('');
        dom.find('span').html('');
        dom.find('.per-icon').attr('src','');
    }
}
function showalertLA() {
    CJ_Tips._getData($(".l-point-a"));
   $(".l-point-a").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".l-point-a"));
        $(".l-point-a").fadeOut("slow");
    }, 5500);
}
function showalertLB() {
    CJ_Tips._getData($(".l-point-b"));
    $(".l-point-b").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".l-point-b"));
        $(".l-point-b").fadeOut("slow");
    }, 6000);
}
function showalertLC() {
    CJ_Tips._getData($(".l-point-c"));
    $(".l-point-c").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".l-point-c"));
        $(".l-point-c").fadeOut("slow");
    }, 4500);
}
function showalertLD() {
    CJ_Tips._getData($(".l-point-d"));
    $(".l-point-d").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".l-point-d"));
        $(".l-point-d").fadeOut("slow");
    }, 5000);
}
//右半部分
function showalertRA() {
    CJ_Tips._getData($(".r-point-a"));
    $(".r-point-a").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".r-point-a"));
        $(".r-point-a").fadeOut("slow");
    }, 3000);
}
function showalertRB() {
    CJ_Tips._getData($(".r-point-b"));
    $(".r-point-b").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".r-point-b"));
        $(".r-point-b").fadeOut("slow");
    }, 3000);
}
function showalertRC() {
    CJ_Tips._getData($(".cc"));
    $(".cc").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".cc"));
        $(".r-point-c").fadeOut("slow");
    }, 4000);
}
function showalertRD() {
    CJ_Tips._getData($(".r-point-d"));
    $(".r-point-d").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".r-point-d"));
        $(".r-point-d").fadeOut("slow");
    }, 2000);
}
function showalertRE() {
    CJ_Tips._getData($(".r-point-e"));
    $(".r-point-e").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".r-point-e"));
        $(".r-point-e").fadeOut("slow");
    }, 3500);
}
function showalertRC1() {
    CJ_Tips._getData($(".c1"));
    $(".c1").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c1"));
        $(".c1").fadeOut("slow");
    }, 900);
}
function showalertRC2() {
    CJ_Tips._getData($(".c2"));
    $(".c2").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c2"));
        $(".c2").fadeOut("slow");
    }, 800);
}
function showalertRC3() {
    CJ_Tips._getData($(".c3"));
    $(".c3").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c3"));
        $(".c3").fadeOut("slow");
    }, 1000);
}
function showalertRC4() {
    CJ_Tips._getData($(".c4"));
    $(".c4").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c4"));
        $(".c4").fadeOut("slow");
    }, 2000);
}
function showalertRC5() {
    CJ_Tips._getData($(".c5"));
    $(".c5").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c5"));
        $(".c5").fadeOut("slow");
    }, 1100);
}
function showalertRC6() {
    CJ_Tips._getData($(".c6"));
    $(".c6").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c6"));
        $(".c6").fadeOut("slow");
    }, 900);
}
function showalertRC7() {
    CJ_Tips._getData($(".c7"));
    $(".c7").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c7"));
        $(".c7").fadeOut("slow");
    }, 2000);
}
function showalertRC8() {
    CJ_Tips._getData($(".c8"));
    $(".c8").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c8"));
        $(".c8").fadeOut("slow");
    }, 2000);
}
function showalertRC9() {
    CJ_Tips._getData($(".c9"));
    $(".c9").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c9"));
        $(".c9").fadeOut("slow");
    }, 900);
}
function showalertRC10() {
    CJ_Tips._getData($(".c10"));
    $(".c10").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c10"));
        $(".c10").fadeOut("slow");
    }, 1100);
}
function showalertRC11() {
    CJ_Tips._getData($(".c11"));
    $(".c11").fadeIn("slow");
    window.setTimeout(function() {
        CJ_Tips._removeData($(".c11"));
        $(".c11").fadeOut("slow");
    }, 1000);
}
