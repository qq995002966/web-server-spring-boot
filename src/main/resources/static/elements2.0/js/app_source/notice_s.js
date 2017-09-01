require(['frontmain'], function () {
    require(['jquery','layer','base'], function (){
        var $_GET = B_Common._getUrl('query');
        switch($_GET.t){
            case 'chat':
                $('#chatNotice').show();
                break;
            case 'pay':
                $('#payNotice').show();
                break;
        }
    });
});