interface IPokemonMenuControllerConfig {
    translationController: ITranslationService;
    requestSender: IRequestSender;
    pokemonMenuElement: JQuery;
    pokemonDetailsElement: JQuery;
    pokemonLoadingSpinner: JQuery;
}