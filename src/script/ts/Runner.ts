class Runner {
    private client: INecroClient;

    constructor(client: INecroClient) {
        this.client = client;
    }

    public start = () => {
        const config = {
            onLocationUpdate: (location) => {
                console.log("location get");
            }
        }
        this.client.start(config);
    }
}