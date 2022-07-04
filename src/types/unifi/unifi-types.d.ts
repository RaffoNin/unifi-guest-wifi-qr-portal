export type wifiSecurityProtocol = 'WPA' | 'WEP' | 'none';

export interface IWlanSettings {
    _id: string;
    name: string;
    x_passphrase: string;
    security: string;
    hide_ssid: boolean;
}
