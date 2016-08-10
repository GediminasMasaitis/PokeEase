$(document).ready(function () {

    /*
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
    */

    $("#menu .close-button").click(function() {
        $("#menu").animate({"left": "-200px"}, 300);
        $(".open-menu").delay(600).css("opacity", "1");
    });

    $(".open-menu").click(function() {
        $(this).css("opacity", "0");
        $("#menu").delay(300).animate({"left": "0"}, 300);
    });

    $("#menu .item").click(function() {
        $("#popup").fadeIn();
        $("#popup .title span").text($(this).attr('id'));
        $("#popup .title").css('background-color', $(this).css('background-color'));
    });

    $("#popup .overlay").click(function() {
        $("#popup").fadeOut();
    });

    $("#popup .close-me").click(function() {
        $("#popup").fadeOut();
    });

    $("#journey .items").css('height', ($(window).height() - $("#journey .title").height()));

    $("#journey #item").each(function() {
        $(this).children('.event').text($(this).attr('class'));
        $(this).children('.event').css('color', $(this).children('.category').css("background-color"));
    });

});

$(window).resize(function() {
    $("#journey .items").css('height', ($(window).height() - $("#journey .title").height()));
});
