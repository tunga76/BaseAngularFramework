# Environment Configuration

Bu proje farklı ortamlar için ayrı environment dosyaları kullanmaktadır.

## Dosya Yapısı

- `environment.ts` - Base/Default konfigürasyon
- `environment.developer.ts` - Developer/Development ortamı için
- `environment.prod.ts` - Production ortamı için

## Build Komutları

### Developer Ortamı
```bash
ng build --configuration=development
ng serve --configuration=development
```

### Production Ortamı
```bash
ng build --configuration=production
ng serve --configuration=production
```

## Environment Dosyaları

### environment.developer.ts
- `production: false`
- Localhost URL'leri
- Debug bilgileri açık
- Daha uzun timeout süreleri
- Development JWT anahtarları

### environment.prod.ts
- `production: true`
- Production URL'leri
- Debug bilgileri kapalı
- Kısa timeout süreleri
- Production JWT anahtarları

## Angular.json Konfigürasyonu

`angular.json` dosyasında `fileReplacements` konfigürasyonu:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.developer.ts"
  }
]
```

## Environment Service Kullanımı

```typescript
constructor(private environmentService: EnvironmentService) {}

// Environment kontrolü
if (this.environmentService.isDeveloperEnvironment) {
  // Developer ortamı için özel kod
}

if (this.environmentService.isProductionEnvironment) {
  // Production ortamı için özel kod
}

// Mevcut ortam
const currentEnv = this.environmentService.currentEnvironment; // 'development' | 'production' | 'unknown'
```

## Önemli Notlar

1. **URL Güncellemeleri**: Production URL'lerini gerçek domain'lerinizle değiştirin
2. **JWT Anahtarları**: Her ortam için farklı JWT anahtarları kullanın
3. **WebSocket URL'leri**: Production'da `wss://` (secure) kullanın
4. **Debug Bilgileri**: Production'da `showDebugInformation: false` olmalı
