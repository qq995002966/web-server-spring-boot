var gameReload = '';
$(function() {
    G_Login._check();
    C_Dom._header(2);
    C_Dom._footer();
    G_Login._status('light');
    G_Game._getCollect();
    F_Favorite._getData();

    var $_GET = getUrl('query');
    if ($_GET.g) {
        G_GameId = $_GET.g;
    } else {
        $('.sidebar .icon-b').css('background-position-x', '-120px');
        $('.sidebar .icon-b span').css('color', '#ffffff');
        G_GameId = demoProjectId();
    }
    F_Game._getData();
});
var F_Game = {
    _goLight:function (gameId) {
        if(isDemoUser()){
            openLogin();
        }else{
            G_Jump._go('base','outside.html#/gameSummary/'+gameId);
        }
    },
    _buff: {},
    _search:function (keywords) {
        G_Jump._go('open', G_Jump._getUrl('search')+'?k='+G_Common._encodeUrl(keywords));
    },
    _getData: function() {
        if (F_Game._buff.data && F_Game._buff.tag) {
            F_Game._htmlFormat(F_Game._buff.data,F_Game._buff.tag);
        } else {
            G_Port._ajax('atlasProjectGraphList', 'get', true, 'project_id=' + G_GameId, function() {
                $('#canvas').html(G_Pre._loading());
            }, function() {
                $('#canvas').html('');
            }, function(data, msg) {
                if (data && !G_Common._checkObjectIsEmpty(data)) {
                    F_Game._buff.data = data.child;
                    F_Game._buff.tag = data.tag_list;
                    F_Game._htmlFormat(data.child,data.tag_list);
                }
            }, function(data, msg, code) {
                $('#canvas').html(G_Pre._empty(msg));
            })
        }
    },
    _htmlFormat: function(data,tag) {
        var dataUnion = [];
        $.each(data, function(key, value) {
            var list = { 'tag_list': value.tag_list, 'gameId': value.project_id, 'text': G_Game._name(value.project_id), 'ralationship': value.relation_name, 'image': G_Game._imgUrl(value.project_id), 'child': [] };
            if (value.relate_project && value.relate_project.length > 0) {
                for (var i = 0; i < value.relate_project.length; i++) {
                    list.child.push({ 'tag_list': value.relate_project[i].tag_list, 'gameId': value.relate_project[i].project_id, 'text': G_Game._name(value.relate_project[i].project_id), 'ralationship': value.relate_project[i].relation_name, 'image': G_Game._imgUrl(value.relate_project[i].project_id),'child':[] });
                    if(value.relate_project[i].relate_project && value.relate_project[i].relate_project.length > 0){
                        for (var s = 0; s < value.relate_project[i].relate_project.length; s++) {
                            if(s>1)break;
                            list.child[i]['child'].push({
                                'tag_list': value.relate_project[i].relate_project[s].tag_list,
                                'gameId': value.relate_project[i].relate_project[s].project_id,
                                'text': G_Game._name(value.relate_project[i].relate_project[s].project_id),
                                'ralationship': value.relate_project[i].relate_project[s].relation_name,
                                'image': G_Game._imgUrl(value.relate_project[i].relate_project[s].project_id)
                            });
                        }
                    }
                }
            }
            dataUnion.push(list);
        });
        F_Game._htmlCenter(tag);
        F_Game._htmlDraw(dataUnion);

           // 第一圈游戏间关系鼠标悬停效果
    $('.relationship-text').hover(function() {
        $('.ball-scale-multiple').css('opacity', '0')
        $(this).next('.ball-scale-multiple').css('opacity', '1')
        $(this).addClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').addClass('line-change-color')
    })

    $('.relationship-text').mouseleave(function() {
        $('.ball-scale-multiple').css('opacity', '0')
        $(this).removeClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').removeClass('line-change-color')
    })

    // 第二圈游戏间关系鼠标悬停效果
    $('.child2-rt').hover(function() {
        $('.child2-ball').css('opacity', '0')
        $(this).next('.child2-ball').css('opacity', '1')
        $(this).addClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').addClass('line-change-color')
    })

    $('.child2-rt').mouseleave(function() {
        $('.child2-ball').css('opacity', '0')
        $(this).removeClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').removeClass('line-change-color')
    })

    // 第三圈游戏间关系鼠标悬停效果
    $('.child3-rt').hover(function() {
        $('.child3-ball').css('opacity', '0')
        $(this).next('.child3-ball').css('opacity', '1')
        $(this).addClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').addClass('line-change-color')
    })

    $('.child3-rt').mouseleave(function() {
        $('.child3-ball').css('opacity', '0')
        $(this).removeClass('animated pulse relationship-text-hover')
        $(this).next().next('.line').removeClass('line-change-color')
    })

    // 鼠标悬停显示第二圈
    $('.child-pic').hover(function() {
        if ($(this).parent().hasClass('child2')){
            var textClass = 'child-2-' + $(this).parents('.child1').attr('class').slice(25) + $(this).parent().attr('class').slice(25)
        } else {
            var textClass = $(this).parent().attr('class').slice(17)
        }
        $('.' +　textClass+ 'text').css('display', 'block')
        $(this).parent().children('.line, .arc').css({
            transition: 'all  0.8s ease-in-out',
            display: 'block'
        })
    })
        // $('#canvas').pep();
    },
    _htmlCenter: function(tag) {
        var str = '';
        var tagStr = F_Game._htmlTag(G_GameId, tag);
        str += '<div class="pop" data-i="' + G_GameId + '">';
        str += '<ul class="inner-circle">';
        str += '<li><a onclick="G_Jump._url(\'atlas\',' + G_GameId + ');">' + '查看图谱' + '</a></li>';
        str += '<li><a onclick="F_Game._goLight(' + G_GameId + ');">' + '灯塔透视' + '</a></li>';
        str += '</ul>';
        str += '<ul class="style-list" id="tag' + G_GameId + '">' + tagStr;
        str += '</ul>';
        str += '</div>';

        $('#canvas').append('<div id="center" class="arc"><b class="img-title">' + G_Game._name(G_GameId) + '</b><img src="' + G_Game._imgUrl(G_GameId) + '">'+str+'</div>');
        var center = $('#center');
        arc(center, getWindowSize().width / 2, getWindowSize().height / 2, config.center.radius);
        var tagcdig = Math.PI * 2 / $('#center .circle-tag').length;
        $('#center .circle-tag').each(function(index, element) {
            $(this).css({
                position: 'absolute',
                left: Math.sin((tagcdig * index)) * 83 + 85,
                top: Math.cos((tagcdig * index)) * 83 + 85
            })
        });
    },
    _htmlDraw: function(data) {
        var ox = getWindowSize().width / 2
        var oy = getWindowSize().height / 2
        var d = Math.PI * 2 / data.length
        var r = config.child.distance + config.center.radius
        for (var i = 0; i < data.length; i++) {
            var x = ox + Math.sin(i * d) * r;
            var tx = ox + Math.sin(i * d) * r / 2;
            var y = oy + Math.cos(i * d) * r;
            var ty = oy + Math.cos(i * d) * r / 2;

            var str = F_Game._htmlGame(1, { 'tag': data[i].tag_list, 'one': i, 'two': '', 'image': data[i].image, 'title': data[i].text, 'gameId': data[i].gameId });
            $(str).appendTo('#canvas');
            var tagdig = Math.PI * 2 / $('.child-1-' + i + '  .circle-tag').length;
            $('.child-1-' + i + '  .circle-tag').each(function(index, element) {
                $(this).css({
                    position: 'absolute',
                    left: Math.sin((tagdig * index)) * 80 + 85,
                    top: Math.cos((tagdig * index)) * 80 + 85
                })
            });

            $('#canvas').append('<p class="relationship-text" style="top:' + ty + 'px;left:' + tx + 'px" onclick="F_Game._search(\''+data[i].ralationship+'\')">' + data[i].ralationship + '</p>') // 关系添加
            $('#canvas').append('<div class="ball-scale-multiple" style="top:' + (oy + Math.cos(i * d) * (r - 80) / 2) + 'px;left:' + (ox + Math.sin(i * d) * (r - 80) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加
            arc($('.child-1-' + i), x, y, config.child.radius)
            line(ox, oy, x, y)

            // 第二圈开始
            if (data[i].child) {
                var childR = config.child.child.distance
                for (var c = 0; c < data[i].child.length; c++) {
                    // var childD = Math.PI * 2 / data.length * (i - 1) + Math.PI * 1.5 / data.length * c
                    var childD = Math.PI * 2 / data.length * (i - 0.8) + Math.PI * 1.3 / data.length * c
                    var childX = x + Math.sin(childD) * childR
                    var childTX = x + Math.sin(childD) * childR / 2
                    var childY = y + Math.cos(childD) * childR
                    var childTY = y + Math.cos(childD) * childR / 2
                    var tagdigg = Math.PI * 2 / $('.child-1-' + i + '>.child-2-' + c + '  .circle-tag').length // 每一个li对应的角度
                    $('.child-2-' + c + '  .circle-tag').each(function(index, element) {
                        $(this).css({
                            position: 'absolute',
                            left: Math.sin((tagdigg * index)) * 80 + 85,
                            top: Math.cos((tagdigg * index)) * 80 + 85
                        })
                    })

                    var str2 = F_Game._htmlGame(2, { 'tag': data[i].child[c].tag_list, 'one': i, 'two': c, 'image': data[i].child[c].image, 'title': data[i].child[c].text, 'gameId': data[i].child[c].gameId });
                    $(str2).appendTo('.child-1-' + i);
                    var tagdigg = Math.PI * 2 / $('.child-1-' + i + '>.child-2-' + c + '  .circle-tag').length; // 每一个li对应的角度
                    $('.child-1-' + i + '>.child-2-' + c + '  .circle-tag').each(function(index, element) {
                        $(this).css({
                            position: 'absolute',
                            left: Math.sin((tagdigg * index)) * 80 + 85,
                            top: Math.cos((tagdigg * index)) * 80 + 85
                        })
                    })

                    // arc($('.child-1-' + i + '>.child-2-' + c), childX, childY, config.child.child.radius)
                    // line(x, y, childX, childY, $('.child-1-' + i))
                    arc($('.child-1-' + i + '>.child-2-' + c), childX + 32 - x, childY + 32 - y, config.child.child.radius)
                    line(36, 36, childX - x + 36, childY - y + 36, $('.child-1-' + i))
                    $('#canvas').append('<p class="child2-rt child-1-' + i + 'text" style="top:' + childTY + 'px;left:' + childTX + 'px" onclick="F_Game._search(\''+data[i].child[c].ralationship+'\')">' + data[i].child[c].ralationship + '</p>') // 关系添加
                    $('#canvas').append('<div class="ball-scale-multiple child2-ball" style="top:' + (y + Math.cos(childD) * (childR + 60) / 2) + 'px;left:' + (x + Math.sin(childD) * (childR + 60) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加

                    // 第三圈开始
                    if (data[i].child[c].child) {
                        var childRR = config.child.child.child.distance
                        for (var cc = 0; cc < data[i].child[c].child.length; cc++) {
                            var childDD = Math.PI * 2 / data.length * (i - 1.3) + Math.PI * 1 / data.length * (c)+Math.PI/4/data[i].child[c].child.length*(cc+0.8);
                            var childDDD = Math.PI * 2 / data.length * (i - 1.15) + Math.PI * 1 / data.length * (c)+Math.PI/5.66/data[i].child[c].child.length*(cc+0.8);
                            var childXX = Math.sin(childDD) * childRR
                            var childTTX =childTX+ Math.sin(childDD) * (childRR+250) / 2
                            var childYY = Math.cos(childDD) * childRR
                            var childTTY = childTY+Math.cos(childDD) * (childRR +250)/ 2
                            // dom添加
                            var str3 = F_Game._htmlGame(3, { 'tag': data[i].child[c].child[cc].tag_list, 'one': i, 'two': cc, 'image': data[i].child[c].child[cc].image, 'title': data[i].child[c].child[cc].text, 'gameId': data[i].child[c].child[cc].gameId });
                            $(str3).appendTo('.child-1-' + i + '> .child-2-' + c);

                            var tagdigg3 = Math.PI * 2 / $('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc + '  .circle-tag').length // 每一个li对应的角度
                            $('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc + '  .circle-tag').each(function (index, element) {
                                $(this).css({
                                    position: 'absolute',
                                    left: Math.sin((tagdigg3 * index)) * 80 + 85,
                                    top: Math.cos((tagdigg3 * index)) * 80 + 85
                                })
                            })

                            arc($('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc), childXX + 32, childYY + 32, config.child.child.child.radius)
                            line(36, 36, childXX + 36, childYY + 36, $('.child-1-' + i + '> .child-2-' + c))
                            $('#canvas').append('<p onclick="F_Game._search(\''+data[i].child[c].child[cc].ralationship+'\')" class="child3-rt child-2-'+ i + c + 'text" style="top:' +  (y + (Math.cos(childD) +Math.cos(childDDD)) * (childRR +150) / 2)  + 'px;left:' + (x + (Math.sin(childD)+Math.sin(childDDD)) * (childRR+150) / 2) + 'px">' + data[i].child[c].child[cc].ralationship + '</p>') // 关系添加
                            $('#canvas').append('<div class="ball-scale-multiple child3-ball" style="top:' + (y + (Math.cos(childD) +Math.cos(childDDD)) * (childRR +180) / 2) + 'px;left:' + (x + (Math.sin(childD)+Math.sin(childDDD)) * (childRR+180) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加
                        }
                    }
                }
            }
        }
    },
    _htmlGame: function(cycle, data) {
        var str = ''
        switch (cycle + '') {
            case '1':
                str += '<div class="arc child child1 child-1-' + data.one + '">';
                str += '<span class="game-pic child-pic">';
                break;
            case '2':
                str += '<div class="arc child child2 child-2-' + data.two + '">';
                str += '<span class="game-pic child2-pic child-pic">';
                break;
            case '3':
                str += '<div class="arc child child3 child-3-' + data.two + '">';
                str += '<span class="game-pic child3-pic child-pic">';
                break;
        }
        var tagStr = F_Game._htmlTag(data.gameId, data.tag);

        str += '<img src="' + data.image + '" />';
        str += '</span>';
        str += '<div class="pop" data-c="' + cycle + '" data-o="' + data.one + '" data-t="' + data.two + '" data-i="' + data.gameId + '">';
        str += '<ul class="inner-circle">';
        str += '<li><a onclick="G_Jump._url(\'atlas\',' + data.gameId + ');">' + '查看图谱' + '</a></li>';
        str += '<li><a onclick="F_Game._goLight(' + data.gameId + ');">' + '灯塔透视' + '</a></li>';
        str += '</ul>';
        str += '<ul class="style-list" id="tag' + data.gameId + '">' + tagStr;
        str += '</ul>';
        str += '</div>';
        str += '<b class="img-title">' + data.title + '</b>';
        str += '</div>';

        return str;
    },
    _htmlTag: function(id, data) {
        var str = '';
        if(data && data.length>0){
            for(var i=0;i<data.length;i++){
                data[i] = parseInt(data[i]);
            }
        }
        var tag = G_Game._tag(data);
        var collectClass = G_Game._checkCollect(parseInt(id)) ? 'collectOn' : 'collectOff';
        str += '<li id="gmCollect' + id + '" class="circle-tag c_img collect ' + collectClass + '" onclick="G_Game._setCollect(' + id + ',\'gmCollect' + id + '\',\'collect\')"></li>';
        if (tag) {
            $.each(tag, function(key, value) {
                str += '<li class="circle-tag"><a onclick="F_Game._search(\''+value+'\')">' + value + '</a></li>';
            })
        }
        return str;
    }
}

var F_Favorite = {
    _buff: {},
    _getData: function() {
        G_Port._ajax('guessLike', 'get', true, 'project_id=' + G_GameId, function() {
            $('#bs_favorit').html(G_Pre._loading());
        }, function() {
            $('#bs_favorit').html('');
        }, function(data, msg) {
            if (data && data.get.length > 0) {
                var str = '';
                var gameId = [];
                for (var i = 0; i < data.get.length; i++) {
                    gameId.push(data.get[i].project_id);
                }
                F_Favorite._buff.game = gameId;
                F_Favorite._dataRank();
                $('.bottom-right').click(function() {
                    F_Favorite._dataRank();
                });
            }
        }, function(data, msg, code) {
            $('#bs_favorit').html(G_Pre._empty(msg));
        })
    },
    _dataRank: function() {
        if (F_Favorite._buff.game) {
            var game = G_Game._getGame(F_Favorite._buff.game)
            var total = F_Favorite._buff.game.length;
            if (total > 10) {
                var rand = (total % 10 == 0) ? (total / 10) - 1 : Math.floor(total / 10);
                rand = Math.round(Math.random() * rand);
                if (rand == gameReload) {
                    if (rand > 0) {
                        rand -= 1;
                    } else {
                        rand += 1;
                    }
                }
                gameReload = rand;
                rand = rand * 10;
                $('#bs_favorit').html(F_Favorite._html(game, rand));
            } else {
                $('#bs_favorit').html(F_Favorite._html(game, 0));
            }
        }
        maskShow($('.bottompart ul li'), $('.bottompart ul li'), 'liOn', $('.bottompart .lt_shade'));
    },
    _html: function(data, begin) {
        var str = '';
        var i = 0;
        var b = 0;
        $.each(data, function(key, value) {
            if (b >= begin) {
                if (i < 10) {
                    var gameName = (value[1].length > 15) ? value[1].substr(0, 15) + '.' : value[1];
                    var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0, 15) + '.' : value[2]) : '';
                    var collectClass = 'lt_gmCtOff';
                    if (G_Game._checkCollect(parseInt(key))) collectClass = 'lt_gmCtOn';
                    str += '\
                        <li>\
                            <img src="' + value[0] + '" alt="' + value[1] + '">\
                            <span class="game-name">' + gameName + '</span>\
                            <span class="game-company">' + gameCompany + '</span>\
                            <div class="lt_shade" style="display: none;">\
                                <div id="forum_gmCollect' + key + '" onclick="G_Game._setCollect(' + key + ',\'forum_gmCollect' + key + '\',\'lt_gmCt\')" class="lt_gmCollect c_img ' + collectClass + '"></div>\
                                <a onclick="F_Game._goLight(' + key + ')">查看灯塔&gt;</a>\
                                <a onclick="G_Jump._url(\'atlas\',' + key + ')">查看图谱&gt;</a>\
                            </div>\
                        </li>';
                }
                i++;
            }
            b++;
        });
        return str;
    }
}
