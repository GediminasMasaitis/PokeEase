interface IRequestSender {
    sendGetConfigRequest();
    sendPokemonListRequest();
    sendEggsListRequest();
    sendInventoryListRequest();
    sendPlayerStatsRequest();
    sendGetPokemonSettingsRequest();
    sendTransferPokemonRequest(pokemonId: string);
    sendEvolvePokemonRequest(pokemonId: string);
    sendHumanSnipePokemonRemoveRequest(pokemonId: string);
    sendHumanSnipePokemonSnipeRequest(pokemonId: string);
    sendHumanSnipPokemonListUpdateRequest();
    currentBotFamily: BotFamily;
}