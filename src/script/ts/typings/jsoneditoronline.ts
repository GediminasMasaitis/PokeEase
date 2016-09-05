interface JSONEditorOptions {
    schema: Object;
    modes: string[];
}

interface JSONEditor {
    setMode(mode:string);
}