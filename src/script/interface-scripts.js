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
        $(".open-menu").delay(300).animate({"opacity": "1"}, 300);
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

    $("#journey #item").each(function() {
        $(this).children('.event').text($(this).attr('class'));
        $(this).children('.event').css('color', $(this).children('.category').css("background-color"));
    });

    $("#journey .close-button").click(function() {
        $("#journey").animate({"right": "-300px"}, 300);
        $(".open-journey").delay(300).animate({"opacity": "1"}, 300);
    });

    $(".open-journey").click(function() {
        $(this).css("opacity", "0");
        $("#journey").delay(300).animate({"right": "0"}, 300);
    });

    resizeItemContainer();

    $("#journey .clear-all").click(function() {
        var delay = 0;
        $($("#journey .items #item").get().reverse()).each(function() {
            $(this).delay(delay).slideUp(300);
            delay += 50;
        });
        /* $($("#journey .items #item").get().reverse()).first().children('*').slideUp();
        $($("#journey .items #item").get().reverse()).first().slideUp(); */
    });

    $("#journey #item .dismiss").click(function() {
        $(this).closest("#item").slideUp(300);
        /* $(this).parent("#item").animate({opacity: "0", "min-height": "0"}); */
    });

    $("#journey #item").wrapInner('<div class="item-container"></div>');

});

$(window).resize(function() {
    resizeItemContainer();
});

function resizeItemContainer() {
    $("#journey .items").css('height', ($(window).height() - $("#journey .title").height() - $("#journey .clear-all").height()));
}
