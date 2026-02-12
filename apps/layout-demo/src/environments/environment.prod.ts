import { AppConfig } from "../app/core/config/app-config.interface";

export const environment = {
  production: true,
  identityServer: {
    // issuer: 'https://hksofflinetest.egm.gov.tr/identityserver', // Production Identity Server
    issuer: 'https://hksoffline.egm.gov.tr/identityserver', // Production Identity Server
    clientId: 'angular.app',
    redirectUri: `${window.location.origin}/ui/callback`,
    scope: 'openid profile api1 offline_access',
    showDebugInformation: false
  },

  // baseUrl: 'https://hksofflinetest.egm.gov.tr/HKSAPI/api', // Production API URL
  baseUrl: 'https://hksoffline.egm.gov.tr/HKSAPI/api', // Production API URL

  setupUrl: 'https://hksoffline.egm.gov.tr/hksofflinekurulum/publish.htm', // Default API URL

  webSocketUrl: 'ws://localhost:8083', // Default WebSocket URL
  webSocketCameraUrl: 'ws://localhost:8084', // Default Camera WebSocket
  webSocketBarcodeReaderUrl: 'ws://localhost:8085', // Default Barcode Reader WebSocket
  webSocketFingerPrintUrl: 'ws://localhost:8086', // Default Fingerprint WebSocket
  webSocketLocalIpAdresUrl: 'ws://localhost:8087', // Default Local IP WebSocket

  storagebasekey: 'htf-uygulama-salt',
  reconnectInterval: 3000, // 3 seconds
  clientDomain: "localhost:4200",
  subPath: "/ui",
  jwt: {
    securityKey: "ProductionSecurityKeyProductionSecurityKeyProductionSecurityKey", // Production JWT Key
    issuer: "hksapi-prod",
    audience: "offlinehks-prod"
  },
  allowedDomains: [window.location.host],
  disallowedRoutes: [],
  skipWhenExpired: true,
  throwNoTokenError: true,
  idleTimeoutConfig: {
    kapiUser: {
      warningMinutes: 5, // Shorter timeout for production
      timeoutMinutes: 6
    },
    default: {
      warningMinutes: 9,
      timeoutMinutes: 10
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