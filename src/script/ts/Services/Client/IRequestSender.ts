interface IRequestSender {
    sendPokemonListRequest();
    sendEggsListRequest();
    sendInventoryListRequest();
    sendPlayerStatsRequest();
    sendGetPokemonSettingsRequest();
    sendTransferPokemonRequest(pokemonId: number);
    sendEvolvePokemonRequest(pokemonId: number);
    currentBotFamily: BotFamily;
}