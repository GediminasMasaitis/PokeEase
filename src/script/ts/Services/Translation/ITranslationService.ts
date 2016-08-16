interface ITranslationService {
    translation: ITranslation;
    getCurrentLanguage: () => Language;
    setCurrentLanguage: (language: Language) => void;
}