interface ITranslationManager {
    translation: ITranslation;
    getCurrentLanguage: () => Language;
    setCurrentLanguage: (language: Language) => void;
}