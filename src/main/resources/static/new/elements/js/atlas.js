var gameReload = '';
var typeReload = '';
$(function(){
    G_Login._check();
    C_Dom._header(2);
    C_Dom._quicker();
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();
    F_Menu._htmlType();
    F_Favorite._getData();

    if(isDemoUser())G_GameId = demoProjectId();
    F_Game._getData(G_GameId);
});
var F_Tag = {
    _buff:{},
    _getTag:function(id){
        if(F_Tag._buff[id]){
            F_Html._tag(id,F_Tag._buff[id]);
        }else{
            G_Port._ajax('tagList','get',true,'project_id='+id,null,null,function(data,msg){
                    if(data && data.tag_list){
                        var tag = G_Game._tag(data.tag_list);
                        F_Tag._buff[id] = tag;
                        F_Html._tag(id,tag);
                    }
                },null
            )
        }
    }
}
var F_Html = {
    _tag:function(id,data){
        var str = '';
        if(data){
            $.each(data,function(key,value){
                str += '<li><a href="#">'+value+'</a></li>';
            })
        }
        $('#tag'+id).html(str);
    },
    _rotate:function(data,center){
        var str = '';
        //var dom = 1;
        var dom = 0;
        var i = 1;
        var round = 6;
        var game = G_Game._getGame(data);
        if(game){
            $.each(game,function(key,value){
                if(i < 459){
                    if((i-1)%round == 0){
                        dom += 1;
                        str += '<div class="'+F_Html._circle(dom)+' pause-animation">';
                    }
                    switch(dom){
                        case 1:
                            round = 6;
                            break;
                        case 2:
                            round = 18;
                            break;
                        case 3:
                            round = 38;
                            break;
                        case 4:
                            round = 68;
                            break;
                        case 5:
                            round = 128;
                            break;
                        case 6:
                            round = 198;
                            break;
                        case 7:
                            round = 308;
                            break;
                        case 8:
                            round = 458;
                            break;
                    }
                    if(i == 1)str += F_Html._center(center);
                    str += F_Html._item(key,value,dom);

                    if(i == round || i==center.total){
                        str += '</div>';
                    }
                    i++;
                }
            })
        }
        $('.rotate-content').html(str);
        createCircle();
        createLayer();
        $('.box-8, .box-7, .box-6, .box-5, .box-3, .box-4, .boxx, .box').Zoomer({
            speedView:400,
            speedRemove:400,
            altAnim:true,
            speedTitle:450,
            debug:false
        });
    },
    _center:function(data){
        var str = '\
            <div class="dot" id="Dot">\
                <span class="center-point">\
                    <img src="elements/img/center.png" alt="'+data.name+'">\
                    <b class="game-circle-style">'+data.name+'</b>\
                    <b class="look">点击图标查看图谱</b>\
                    <b class="game-num-circle">'+data.total+'<b>款</b></b>\
                </span>\
            </div>';
        return str;
    },
    _circle:function(dom){
        var useClass = '';
        switch(dom){
            case 1:
                useClass = "container";
                break;
            case 2:
                useClass = "container-even";
                break;
            default:
                useClass = "container-even-"+dom;
                break;
        }
        return useClass;
    },
    _item:function(key,value,dom){
        var str = '';
        var useClass = '';
        var useName = '';
        switch(dom){
            case 1:
                useClass = "box";
                useName = '<b>'+value[1]+'</b>';
                break;
            case 2:
                useClass = "boxx";
                break;
            default:
                useClass = "box-"+dom;
                break;
        }
        str += '\
            <div class="'+useClass+'">\
                <span>\
                    <img src="'+value[0]+'" alt="'+value[1]+'">'+useName+'\
                    <div class="option-box">\
                        <ul class="inner-option-box" data-i="'+key+'">\
                            <li><a onclick="G_Jump._url(\'atlas\','+key+');">查看图谱</a></li>\
                            <li><a onclick="G_Jump._url(\'light\','+key+');">灯塔透视</a></li>\
                            <span class="collect"></span>\
                        </ul>\
                        <ul class="game-style-circle" id="tag'+key+'"></ul>\
                    </div>\
                </span>\
            </div>';
        return str;
    }
}
var F_Game = {
    _buff:{},
    _getData:function(id){
        if(F_Game._buff.gameId && F_Game._buff.gameId == id){
            F_Html._rotate(F_Game._buff.data,F_Game._buff.center);
        }else{
            G_Port._ajax('atlasList','get',true,'project_id='+id,function(){
                    $('.rotate-content').html(G_Pre._loading());
                },function(){
                    $('.rotate-content').html('');
                },function(data,msg){
                    var center = {name:G_Game._name(id),total:data.project_list.length};
                    F_Game._buff.gameId = id;
                    F_Game._buff.data = data.project_list;
                    F_Game._buff.center = center;
                    F_Html._rotate(data.project_list,center);
                },function(data,msg,code){
                    $('.rotate-content').html(G_Pre._empty(msg));
                }
            )
        }
    }
}
var F_Menu = {
    _htmlType:function(){
        var type = G_Game._getType();
        var str = '';
        if(type){
            str += '<p>游戏类型</p>';
            for(var i=0;i<type.length;i++){
                str += '<li data-t="t" data-i="'+type[i].detail_type+'"><span>'+type[i].detail_type_desc+'</span></li>';
            }
            str += '<p>游戏平台</p>';
            str += '<li data-t="p" data-i="S"><span>手游</span></li>';
            str += '<li data-t="p" data-i="Y"><span>页游</span></li>';
            str += '<li data-t="p" data-i="D"><span>端游</span></li>';
            str += '<li data-t="p" data-i="W"><span>单机 电玩</span></li>';
        }
        $('.icon-a-list').html(str);
        menuChoosed();
    }
}
var F_Type = {
    _buff:{},
    _getData:function(id){
        if(F_Type._buff.typeId && F_Type._buff.typeId == id){
            F_Html._rotate(F_Type._buff.data,F_Type._buff.center);
        }else{
            G_Port._ajax('gameFrom','get',true,'detail_type='+id,function(){
                    $('.rotate-content').html(G_Pre._loading());
                },function(){
                    $('.rotate-content').html('');
                },function(data,msg){
                    var center = {name:G_Game._getType(id).detail_type_desc,total:data.project_list.length};
                    F_Type._buff.typeId = id;
                    F_Type._buff.data = data.project_list;
                    F_Type._buff.center = center;
                    F_Html._rotate(data.project_list,center);
                },function(data,msg,code){
                    $('.rotate-content').html(G_Pre._empty(msg));
                }
            )
        }
    }
}
var F_Plat = {
    _buff:{},
    _getData:function(id){
        if(F_Plat._buff.typeId && F_Plat._buff.typeId == id){
            F_Html._rotate(F_Plat._buff.data,F_Plat._buff.center);
        }else{
            G_Port._ajax('gameFrom','get',true,'game_type='+id,function(){
                    $('.rotate-content').html(G_Pre._loading());
                },function(){
                    $('.rotate-content').html('');
                },function(data,msg){
                    var center = {name:G_Game._typeName(id),total:data.project_list.length};
                    F_Plat._buff.typeId = id;
                    F_Plat._buff.data = data.project_list;
                    F_Plat._buff.center = center;
                    F_Html._rotate(data.project_list,center);
                },function(data,msg,code){
                    $('.rotate-content').html(G_Pre._empty(msg));
                }
            )
        }
    }
}
var F_Hot = {
    _buff:{},
    _getData:function(){
        if(F_Hot._buff.data){
            F_Html._rotate(F_Hot._buff.data,F_Hot._buff.center);
        }else{
            G_Port._ajax('hotGame','get',true,'index=0&limit=20',function(){
                    $('.rotate-content').html(G_Pre._loading());
                },function(){
                    $('.rotate-content').html('');
                },function(data,msg){
                    var center = {name:'热门',total:data.hot_project_list.length};
                    F_Hot._buff.data = data.hot_project_list;
                    F_Hot._buff.center = center;
                    F_Html._rotate(data.hot_project_list,center);
                },function(data,msg,code){
                    $('.rotate-content').html(G_Pre._empty(msg));
                }
            )
        }
    }
}
var F_History = {
    _buff:{},
    _getData:function(){
        if(F_History._buff.data){
            F_Html._rotate(F_History._buff.data,F_History._buff.center);
        }else{
            G_Port._ajax('history','get',true,null,function(){
                    $('.rotate-content').html(G_Pre._loading());
                },function(){
                    $('.rotate-content').html('');
                },function(data,msg){
                    var center = {name:'历史',total:data.project_list.length};
                    F_History._buff.data = data.project_list;
                    F_History._buff.center = center;
                    F_Html._rotate(data.project_list,center);
                },function(data,msg,code){
                    $('.rotate-content').html(G_Pre._empty(msg));
                }
            )
        }
    }
}
var F_Collect = {
    _getData:function(){
        var center = {name:'收藏',total:G_Collects.length};
        F_Html._rotate(G_Collects,center);
    }
}
var F_Favorite = {
    _buff:{},
    _getData:function(){
        G_Port._ajax('guessLike','get',true,'project_id='+G_GameId,function(){
                $('#bs_favorit').html(G_Pre._loading());
            },function(){
                $('#bs_favorit').html('');
            },function(data,msg){
                if(data && data.get.length > 0){
                    var str = '';
                    var gameId = [];
                    for(var i=0;i<data.get.length;i++){
                        gameId.push(data.get[i].project_id);
                    }
                    F_Favorite._buff.game = gameId;
                    F_Favorite._dataRank();
                    $('.bottom-right').click(function(){
                        F_Favorite._dataRank();
                    });
                }
            },function(data,msg,code){
                $('#bs_favorit').html(G_Pre._empty(msg));
            }
        )
    },
    _dataRank:function(){
        if(F_Favorite._buff.game){
            var game = G_Game._getGame(F_Favorite._buff.game)
            var total = F_Favorite._buff.game.length;
            if(total > 10){
                var rand = Math.floor(total/10);
                rand = Math.round(Math.random()*rand);
                if(rand == gameReload){
                    if(rand > 0){
                        rand -= 1;
                    }else{
                        rand += 1;
                    }
                }
                gameReload = rand;
                rand = rand*10;
                $('#bs_favorit').html(F_Favorite._html(game,rand));
            }else{
                $('#bs_favorit').html(F_Favorite._html(game,0));
            }
        }
    },
    _html:function(data,begin){
        var str = '';
        var i = 0;
        var b = 0;
        $.each(data,function(key,value){
            if(b>= begin){
                if(i < 10){
                    var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                    var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                    str += '\
                        <li onclick="G_Jump._url(\'light\','+key+')">\
                            <img src="'+value[0]+'" alt="'+value[1]+'">\
                            <span class="game-name">'+gameName+'</span>\
                            <span class="game-company">'+gameCompany+'</span>\
                        </li>';
                }
                i++;
            }
            b++;
        });
        return str;
    }
}



