export type wifiSecurityProtocol = 'WPA' | 'WEP' | 'none';

export interface IWlanSettings {
    _id: string;
    name: string;
    enabled: boolean;
    x_passphrase: string;
    security: string;
    hide_ssid: boolean;
}
