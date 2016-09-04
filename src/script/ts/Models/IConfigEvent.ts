interface IConfigEvent extends IEvent {
    AuthJson: string;
    AuthSchemaJson: string;
    ConfigJson: string;
    ConfigSchemaJson: string;
}