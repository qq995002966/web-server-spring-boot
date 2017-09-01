$(function () {
    var $_GET = getUrl('query');
    console.log($_GET.t);
    switch($_GET.t){
        case 'chat':
            $('#chatNotice').show();
            break;
        case 'pay':
            $('#payNotice').show();
            break;
    }
});