// Base environment configuration - this serves as the default configuration
// This file will be replaced by environment.developer.ts or environment.prod.ts during build
// 
// Build commands:
// - Development: ng build --configuration=development
// - Production: ng build --configuration=production

// import { AppConfig } from "../app/core/config/app-config.interface";

export const environment = {
  production: true, // Default to development
  identityServer: {
    issuer: 'https://localhost/identityserver', // Default Identity Server
    clientId: 'angular.app',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile api1 offline_access',
    showDebugInformation: true
  },

  baseUrl: 'https://localhost/HKSAPI/api', // Default API URL
  setupUrl: 'https://hksofflinetest.egm.gov.tr/hksofflinekurulum/publish.htm', // Default API URL

  webSocketUrl: 'ws://localhost:8083', // Default WebSocket URL
  webSocketCameraUrl: 'ws://localhost:8084', // Default Camera WebSocket
  webSocketBarcodeReaderUrl: 'ws://localhost:8085', // Default Barcode Reader WebSocket
  webSocketFingerPrintUrl: 'ws://localhost:8086', // Default Fingerprint WebSocket
  webSocketLocalIpAdresUrl: 'ws://localhost:8087', // Default Local IP WebSocket

  storagebasekey: 'htf-uygulama-salt',
  reconnectInterval: 3000, // 3 seconds
  clientDomain: "localhost:4200",
  subPath: "",
  jwt: {
    securityKey: "DefaultSecurityKeyDefaultSecurityKeyDefaultSecurityKey", // Default JWT Key
    issuer: "hksapi",
    audience: "offlinehks"
  },
  allowedDomains: ["localhost:4200"],
  disallowedRoutes: [],
  skipWhenExpired: true,
  throwNoTokenError: true,
  idleTimeoutConfig: {
    kapiUser: {
      warningMinutes: 9,
      timeoutMinutes: 10
    },
    default: {
      warningMinutes: 9,
      timeoutMinutes: 10
    }
  },
  // appConfig: {
  //   apiBaseUrl: 'https://egm1btdyzl11.polnet.intra/HKSAPI/api',
  //   defaultLanguage: 'tr',
  //   enableDebug: true,
  //   tokenKey: 'auth_token_dev',
  //   dialogConfig: {
  //     width: '400px',
  //     height: 'auto',
  //     disableClose: false,
  //     hasBackdrop: true,
  //     backdropClass: 'custom-backdrop'
  //   }
  // } as AppConfig
};