require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min'], function (){
        store = require('store.min');
        B_Login._check();
        S_HeadFoot._getHead();
        S_User._freeCheck();
    });
});