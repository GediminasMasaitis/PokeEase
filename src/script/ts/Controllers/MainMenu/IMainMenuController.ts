interface IMainMenuController {
    updateProfileData(profile: IProfileEvent): void;
    setPokemonCount(pokemonCount: number): void;
    setItemCount(itemCount: number);
    setEggCount(eggCount: number);
    setSnipePokemonCount(pokemonCount: number): void;
}