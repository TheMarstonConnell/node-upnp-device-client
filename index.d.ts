import { EventEmitter } from 'events';

declare namespace UPnPDeviceClient {
    interface DeviceDescription {
        deviceType: string;
        friendlyName: string;
        manufacturer: string;
        manufacturerURL: string;
        modelName: string;
        modelNumber: string;
        modelDescription: string;
        UDN: string;
        icons: Icon[];
        services: {
            [serviceId: string]: Service;
        };
    }

    interface Icon {
        mimetype: string;
        width: string;
        height: string;
        depth: string;
        url: string;
    }

    interface Service {
        serviceType: string;
        SCPDURL: string;
        controlURL: string;
        eventSubURL: string;
    }

    interface Argument {
        name: string;
        relatedStateVariable: string;
    }

    interface Action {
        inputs: Argument[];
        outputs: Argument[];
    }

    interface StateVariable {
        dataType: string;
        sendEvents: string;
        allowedValues: string[];
        defaultValue: string;
    }

    interface ServiceDescription {
        actions: {
            [actionName: string]: Action;
        };
        stateVariables: {
            [variableName: string]: StateVariable;
        };
    }

    interface Subscription {
        sid: string;
        url: string;
        timer: NodeJS.Timeout;
        listeners: Array<(event: any) => void>;
    }
}

declare class UPnPDeviceClient extends EventEmitter {
    constructor(url: string);

    url: string;
    deviceDescription: UPnPDeviceClient.DeviceDescription | null;
    serviceDescriptions: {
        [serviceId: string]: UPnPDeviceClient.ServiceDescription;
    };
    server: import('http').Server | null;
    listening: boolean;
    subscriptions: {
        [serviceId: string]: UPnPDeviceClient.Subscription;
    };

    /**
     * Fetches the device description
     */
    getDeviceDescription(callback: (err: Error | null, description?: UPnPDeviceClient.DeviceDescription) => void): void;

    /**
     * Fetches a service description
     * @param serviceId The service ID
     * @param callback
     */
    getServiceDescription(
        serviceId: string,
        callback: (err: Error | null, description?: UPnPDeviceClient.ServiceDescription) => void
    ): void;

    /**
     * Calls an action on a service
     * @param serviceId The service ID
     * @param actionName The action name
     * @param params Action parameters
     * @param callback
     */
    callAction(
        serviceId: string,
        actionName: string,
        params: { [paramName: string]: any },
        callback: (err: Error | null, result?: { [key: string]: string }) => void
    ): void;

    /**
     * Subscribes to service events
     * @param serviceId The service ID
     * @param listener Event listener callback
     */
    subscribe(serviceId: string, listener: (event: any) => void): void;

    /**
     * Unsubscribes from service events
     * @param serviceId The service ID
     * @param listener Event listener callback that was previously subscribed
     */
    unsubscribe(serviceId: string, listener: (event: any) => void): void;

    /**
     * Ensures the eventing server is created and running
     * @private
     */
    ensureEventingServer(callback: () => void): void;

    /**
     * Releases the eventing server if no more subscriptions exist
     * @private
     */
    releaseEventingServer(): void;
}

export = UPnPDeviceClient;