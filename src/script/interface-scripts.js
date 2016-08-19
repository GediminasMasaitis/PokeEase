$(document).ready(function () {


    // MENU EVENTS
    $("#menu .close-button").click(function() {
        $("#menu").animate({"left": "-200px"}, 200);
        $(".open-menu").delay(100).animate({"opacity": "1"}, 200);
    });

    $(".open-menu").click(function() {
        $(this).css("opacity", "0");
        $("#menu").delay(0).animate({"left": "0"}, 200);
    });

    $("#menu .item").click(function() {
        var PopupTitle = $(this).attr('id');
        $("#popup").stop().fadeIn(300);
        $("#popup .title span").text($(this).attr('id'));
        $("#popup .title").css('background-color', $(this).css('background-color'));
        $("#popup .content").each(function() {
            $(this).hide();
            if ($(this).attr('data-category') == PopupTitle) {
                $(this).show();
                $("#settings-buttons").show();
            } else {
                $("#settings-buttons").hide();
            }
        });
    });

    $("#popup .overlay, #popup .close-me").click(function() {
        $("#popup").stop().fadeOut(300);
    });

    //$(".content").on("click", ".pokemon", function() {
    //    $("#pokemon-info").fadeIn();
    //    $("#content-wrap").addClass('blurred');
    //});

    $("#pokemon-info").click(function() {
        $(this).stop().fadeOut(300);
        $("#content-wrap").removeClass('blurred');
    });

    $("#pokemon-info .close-button, #pokemon-content .controls div .confirm span").click(function() {
        $("#pokemon-info").stop().fadeOut(300);
        $("#content-wrap").removeClass('blurred');
    });

    $("#pokemon-info #pokemon-content").click(function(e) {
        e.stopPropagation();
    });

    // JOURNAL EVENTS
    $("#journal .event").each(function() {
        $(this).find('.event-type').text($(this).attr('class').split(' ')[1]);
    });

    $("#journal .close-button").click(function() {
        $("#journal").animate({"right": "-300px"}, 200);
        $(".open-journal").delay(100).animate({"opacity": "1"}, 200);
    });

    $(".open-journal").click(function() {
        $(this).css("opacity", "0");
        $("#journal").delay(0).animate({"right": "0"}, 200);
    });

    $("#journal .items .event").click(function() {
        $(this).find('.extended-info').stop().slideToggle(300);
    });

    resizeItemContainer();
    resizePopupMargins();

    //$("#journal .clear-all").click(function() {
    //    var delay = 0;
    //    $($("#journal .items .event").get().reverse()).each(function() {
    //        $(this).delay(delay).slideUp(300);
    //        delay += 50;
    //    });
    //    /* $($("#journal .items .event").get().reverse()).first().children('*').slideUp();
    //    $($("#journal .items .event").get().reverse()).first().slideUp(); */
    //});

    $("#journal .event .dismiss").click(function() {
        $(this).closest(".event").stop().slideUp(300, function() {$(this).remove();});
        /* $(this).parent(".event").animate({opacity: "0", "min-height": "0"}); */
    });

	$('#journal .event').qtip({
		content: {
			/*title: function(event, api) {
				return $(this).find('.info').contents().get(0).nodeValue.trim();
			},*/
			text: function(event, api) {
				var tooltip = $('<div/>');
				var image = $('<img/>', {
					src: $(this).find('img').attr('src'),
					style: 'width: 50px; float: left;'
				})
				$(tooltip).append(image);
				$(tooltip).append('<br/>');
				var title = $('<h3/>', {
					text: $(this).find('.info').contents().get(0).nodeValue.trim(),
					style: 'display: inline-block;'
				})
				$(tooltip).append(title);
				$(tooltip).append('<br/>');
				var stats = $('<span/>', {
					text: $(this).find('.stats').text(),
					style: 'display: inline-block;'
				});
				$(tooltip).append(stats);
				return tooltip;
			}
		},
		position: {
			my: 'right center',
			at: 'center left',
			adjust: {
				x: -18
			}
		},
		style: {
			classes: 'qtip-tipsy qtip-shadow qtip-rounded'
		}
	});

    // FIX A PROBLEM WE HAD WITH DISPLAY:TABLE AND ANIMATING
    // $("#journal .event").wrapInner('<div class="item-container"></div>');

    // SCROLL TO THE BOTTOM OF THE JOURNAL LIST
    $("#journal .items").animate({ scrollTop: $("#journal .items").prop("scrollHeight") - $("#journal .items").height() }, 0);

    // HIDE PROFILE MENU
    $("#profile .hide").click(function() {$("#profile").toggleClass('hidden');});

});

$(window).resize(function() {
    resizeItemContainer();
    resizePopupMargins();
});

function resizeItemContainer() {
    $("#journal .items").css('height', ($(window).height() - $("#journal .title").height() - $("#journal .clear-all").height()));
}

function resizePopupMargins() {

    var popup = $("#popup .inner-wrap");

    if($(window).width() < 1040) {
        popup.css("width", ($(window).width() - 40));
    } else {
        popup.css("width", "");
    }

    if($(window).height() < 840) {
        popup.css("height", ($(window).height() - 40));
    } else {
        popup.css("height", "");
    }
}


// popup stuff

var pokemonNames = ["MissingNo", "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew", "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat", "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi", "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos", "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip", "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma", "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking", "Misdreavus", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress", "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish", "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid", "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom", "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle", "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Poochyena", "Mightyena", "Zigzagoon", "Linoone", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Taillow", "Swellow", "Wingull", "Pelipper", "Ralts", "Kirlia", "Gardevoir", "Surskit", "Masquerain", "Shroomish", "Breloom", "Slakoth", "Vigoroth", "Slaking", "Nincada", "Ninjask", "Shedinja", "Whismur", "Loudred", "Exploud", "Makuhita", "Hariyama", "Azurill", "Nosepass", "Skitty", "Delcatty", "Sableye", "Mawile", "Aron", "Lairon", "Aggron", "Meditite", "Medicham", "Electrike", "Manectric", "Plusle", "Minun", "Volbeat", "Illumise", "Roselia", "Gulpin", "Swalot", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Numel", "Camerupt", "Torkoal", "Spoink", "Grumpig", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Swablu", "Altaria", "Zangoose", "Seviper", "Lunatone", "Solrock", "Barboach", "Whiscash", "Corphish", "Crawdaunt", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Castform", "Kecleon", "Shuppet", "Banette", "Duskull", "Dusclops", "Tropius", "Chimecho", "Absol", "Wynaut", "Snorunt", "Glalie", "Spheal", "Sealeo", "Walrein", "Clamperl", "Huntail", "Gorebyss", "Relicanth", "Luvdisc", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Budew", "Roserade", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Burmy", "Wormadam", "Mothim", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Mismagius", "Honchkrow", "Glameow", "Purugly", "Chingling", "Stunky", "Skuntank", "Bronzor", "Bronzong", "Bonsly", "Mime Jr.", "Happiny", "Chatot", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Riolu", "Lucario", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Finneon", "Lumineon", "Mantyke", "Snover", "Abomasnow", "Weavile", "Magnezone", "Lickilicky", "Rhyperior", "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "Leafeon", "Glaceon", "Gliscor", "Mamoswine", "Porygon-Z", "Gallade", "Probopass", "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", "Victini", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Oshawott", "Dewott", "Samurott", "Patrat", "Watchog", "Lillipup", "Herdier", "Stoutland", "Purrloin", "Liepard", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Munna", "Musharna", "Pidove", "Tranquill", "Unfezant", "Blitzle", "Zebstrika", "Roggenrola", "Boldore", "Gigalith", "Woobat", "Swoobat", "Drilbur", "Excadrill", "Audino", "Timburr", "Gurdurr", "Conkeldurr", "Tympole", "Palpitoad", "Seismitoad", "Throh", "Sawk", "Sewaddle", "Swadloon", "Leavanny", "Venipede", "Whirlipede", "Scolipede", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Basculin", "Sandile", "Krokorok", "Krookodile", "Darumaka", "Darmanitan", "Maractus", "Dwebble", "Crustle", "Scraggy", "Scrafty", "Sigilyph", "Yamask", "Cofagrigus", "Tirtouga", "Carracosta", "Archen", "Archeops", "Trubbish", "Garbodor", "Zorua", "Zoroark", "Minccino", "Cinccino", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Ducklett", "Swanna", "Vanillite", "Vanillish", "Vanilluxe", "Deerling", "Sawsbuck", "Emolga", "Karrablast", "Escavalier", "Foongus", "Amoonguss", "Frillish", "Jellicent", "Alomomola", "Joltik", "Galvantula", "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Tynamo", "Eelektrik", "Eelektross", "Elgyem", "Beheeyem", "Litwick", "Lampent", "Chandelure", "Axew", "Fraxure", "Haxorus", "Cubchoo", "Beartic", "Cryogonal", "Shelmet", "Accelgor", "Stunfisk", "Mienfoo", "Mienshao", "Druddigon", "Golett", "Golurk", "Pawniard", "Bisharp", "Bouffalant", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Heatmor", "Durant", "Deino", "Zweilous", "Hydreigon", "Larvesta", "Volcarona", "Cobalion", "Terrakion", "Virizion", "Tornadus", "Thundurus", "Reshiram", "Zekrom", "Landorus", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Fletchling", "Fletchinder", "Talonflame", "Scatterbug", "Spewpa", "Vivillon", "Litleo", "Pyroar", "Flabébé", "Floette", "Florges", "Skiddo", "Gogoat", "Pancham", "Pangoro", "Furfrou", "Espurr", "Meowstic", "Honedge", "Doublade", "Aegislash", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff", "Inkay", "Malamar", "Binacle", "Barbaracle", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Helioptile", "Heliolisk", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Sylveon", "Hawlucha", "Dedenne", "Carbink", "Goomy", "Sliggoo", "Goodra", "Klefki", "Phantump", "Trevenant", "Pumpkaboo", "Gourgeist", "Bergmite", "Avalugg", "Noibat", "Noivern", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion"];


$(window).ready(function() {
    //$('.content[data-category="pokemons"]').html('');
    /* var currentRandomPokemon = 0;
    var currentRandomCP = 0;
    var currentRandomIV = 0;
    for (var i = 0; i < 30; i++) {
        currentRandomPokemon = Math.floor(Math.random() * 151) + 1;
        currentRandomCP = Math.floor(Math.random() * 3000) + 10;
        currentRandomIV = ((Math.random() * 100) + 1).toFixed(2);
        $('.content[data-category="pokemons"]').append('<div class="pokemon"><h1 class="name">'+pokemonNames[currentRandomPokemon]+'</h1><div class="image-container"><img src="images/pokemon/' +currentRandomPokemon+ '.png"/></div><h3 class="cp">'+currentRandomCP+'</h3><h3 class="iv">'+currentRandomIV+'</h3></div>');
    }
    */
    //$('.content[data-category="pokemons"]').html('<i class="fa fa-circle-o-notch fa-3x fa-spin"></i>');

    //setInterval(function() {
    //    $("#xp-bubble").remove();
    //    $("#profile .profile-exp").append('<div class="xp-bubble">+50 XP</div>');
    //}, 5000);
});


$(window).ready(function() {
    $('.content[data-category="pokedex"]').html('');
    for (var i = 1; i <= 151; i++) {
        $('.content[data-category="pokedex"]').append('<div class="pokemon"><h1 class="name">'+i+'. '+pokemonNames[i]+'</h1><div class="image-container"><img src="images/pokemon/' +i+ '.png"/></div><h3 class="caught">'+i+'</h3><h3 class="seen">'+i+'</h3></div>');
    }

    addCircleProgress();

});


function addCircleProgress() {
    // $('.content[data-category="eggs"] .egg').each(function() {$(this).append('<div class="circle"></div>');});
    /* $('.content[data-category="eggs"] .circle').circleProgress({
        value: 0.75,
        size: 180,
        thickness: 5,
        reverse: true,
        fill: {
            gradient: ["#b1ffaa", "#64f0d0"]
        },
        emptyFill: 'rgba(0, 0, 0, 0)',
    }); */

    var done, total;

    $('.content[data-category="eggs"] .egg').each(function() {

        done = parseFloat($(this).find('b').text());
        total = parseFloat($(this).find('i').text());

        $(this).children('.circle').circleProgress({
            value: (done / total),
            size: 180,
            thickness: 5,
            startAngle: -Math.PI/2,
            animation: {duration: 1200},
            fill: {
                gradient: ["#b1ffaa", "#64f0d0"]
            },
            emptyFill: 'rgba(0, 0, 0, 0)',
        });
    });
}


$(window).ready(function() {
    var tabNameHolder = "";
    $(".tab-buttons > div").click(function() {

        // get the tab name
        tabNameHolder = $(this).attr('class').split(' ')[0];

        // show the right tab
        $(".tab-pages > div").each(function() {
            $(this).fadeOut(150);
            console.log($(this).attr('id'));
            console.log(tabNameHolder);
            if ($(this).attr('id') == tabNameHolder) {
                $(this).delay(150).fadeIn(150);
            }
        });

        // remove selected class from current tab
        $(".tab-buttons > div").each(function() {
            $(this).removeClass('selected');
        });

        // add selected class to new tab
        $(this).addClass('selected');
    });


    $(".option-toggle").click(function() {
        $(this).toggleClass('active');
    });

    // sendNotification("hello world", "#7db620", "#ffffff", "10000");
});

function sendNotification(text, bgColor, textColor, delay) {

    $("#notification").text(text);

    $("#notification").append("<div class='countdown'></div>");

    $("#notification").css({
        'background-color': bgColor,
        'color': textColor
    });

    $("#notification").animate({'top': '5px'}, 500);

    $("#notification .countdown").animate({'width': '0'}, parseInt(delay), 'linear');

    $("#notification").delay(delay).animate({'top': -($("#notification").outerHeight() + 2)}, 500);
}
