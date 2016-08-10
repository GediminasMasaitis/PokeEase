$(document).ready(function () {

    $("#menu .close-button").click(function() {
        $(".open-menu").css('transform', 'translateX(0)');
        $(".open-menu").children('i').css('transform', 'rotate(0)');
        $(this).css('transform', 'translateX(-60px)');
        $(this).children('i').css('transform', 'rotate(180deg)');
        $("#menu").delay(300).fadeOut(300);
        $(".open-menu").delay(300).fadeIn(300);
    });

    $(".open-menu").click(function() {
        $(this).css('transform', 'translateX(60px)');
        $(this).children('i').css('transform', 'rotate(180deg)');
        $("#menu .close-button").css('transform', 'translateX(0)');
        $("#menu .close-button").children('i').css('transform', 'rotate(0)');
        $("#menu").delay(300).fadeIn(300);
        $(this).delay(300).fadeOut(300);
    });

});
