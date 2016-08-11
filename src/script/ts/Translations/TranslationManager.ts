class TranslationManager implements ITranslationManager {
    private currentLanguage: Language;

    public translation: ITranslation;

    constructor(language: Language = Language.English) {
        this.setCurrentLanguage(language);
    }

    public getCurrentLanguage = (): Language => this.currentLanguage;
    public setCurrentLanguage = (language: Language) => {
        this.currentLanguage = language;
        switch (language) {
            case Language.English:
                this.translation = new EnglishTranslation();
            break;
            default:
                throw "Unknown language";
        }
    }
}