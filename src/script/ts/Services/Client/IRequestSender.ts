interface IRequestSender {
    sendPokemonListRequest();
    sendEggsListRequest();
    sendInventoryListRequest();
    sendPlayerStatsRequest();
    sendGetPokemonSettingsRequest();
    sendTransferPokemonRequest(pokemonId: string);
    sendEvolvePokemonRequest(pokemonId: string);
    sendHumanSnipPokemonRemoveRequest(pokemonId: string);
    sendHumanSnipPokemonSnipeRequest(pokemonId: string);
    sendHumanSnipPokemonListUpdateRequest()
    currentBotFamily: BotFamily;
}