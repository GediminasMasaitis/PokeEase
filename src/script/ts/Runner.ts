class Runner {
    private interface: InterfaceHandler;
    private client: INecroClient;

    constructor(client: INecroClient, interfaceHandler: InterfaceHandler) {
        this.interface = interfaceHandler;
        this.client = client;
    }

    public start = (): void => {
        this.client.start({
            eventHandlers: [this.interface]
        });
    }
}