import { AppConfig } from "../app/core/config/app-config.interface";

export const environment = {
  production: false,
  identityServer: {
    issuer: 'https://localhost:5001', // Development Identity Server
    clientId: 'angular_dev.app',
    redirectUri: `${window.location.origin}/callback`,
    scope: 'openid profile api1 offline_access',
    showDebugInformation: true
  },

  baseUrl: 'https://localhost:7061/api', // Default API URL
  setupUrl: 'https://hksofflinetest.egm.gov.tr/hksofflinekurulum/publish.htm', // Default API URL

  webSocketUrl: 'ws://localhost:8083', // Default WebSocket URL
  webSocketCameraUrl: 'ws://localhost:8084', // Default Camera WebSocket
  webSocketBarcodeReaderUrl: 'ws://localhost:8085', // Default Barcode Reader WebSocket
  webSocketFingerPrintUrl: 'ws://localhost:8086', // Default Fingerprint WebSocket
  webSocketLocalIpAdresUrl: 'ws://localhost:8087', // Default Local IP WebSocket

  storagebasekey: 'htf-uygulama-salt-dev',
  reconnectInterval: 3000, // 3 seconds
  clientDomain: "localhost:4200",
  subPath:"/",
  jwt: {
    securityKey: "DevelopmentSecurityKeyDevelopmentSecurityKey", // Development JWT Key
    issuer: "hksapi-dev",
    audience: "offlinehks-dev"
  },
  allowedDomains: ["localhost:4200", "127.0.0.1:4200"],
  disallowedRoutes: [],
  skipWhenExpired: false, // Development'ta token kontrolü daha sıkı
  throwNoTokenError: false, // Development'ta hata fırlatma
  idleTimeoutConfig: {
    kapiUser: {
      warningMinutes: 15, // Development'ta daha uzun süre
      timeoutMinutes: 20
    },
    default: {
      warningMinutes: 15,
      timeoutMinutes: 20
    }
  },
  appConfig: {
    apiBaseUrl: 'http://localhost:3000/api',
    defaultLanguage: 'en',
    enableDebug: true,
    tokenKey: 'auth_token_dev',
    dialogConfig: {
      width: '400px',
      height: 'auto',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    }
  } as AppConfig
};
