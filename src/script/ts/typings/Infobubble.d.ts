declare class InfoBubble {
    constructor (options?: InfoBubbleOptions);
    close(): void;
    isOpen(): boolean;
    open(map: google.maps.Map, marker: google.maps.Marker) : void;
    getPosition(): google.maps.LatLng;
}

interface InfoBubbleOptions {
    map?: google.maps.Map;
    content?: string;
    position?: google.maps.LatLng;
    hideCloseButton?: boolean;
    arrowPosition?: number;
    arrowSize?: number;
    arrowStyle?: number;
    backgroundColor?: string;
    backgroundClassName?: string;
    borderColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    disableAnimation?: boolean;
    disableAutoPan?: boolean;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    padding?: number;
    shadowStyle?: number;
}