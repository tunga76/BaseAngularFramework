# @platform/directives Usage Guide

This library provides core UI directives for the Angular Platform.

## Installation

Add to your `tsconfig.json` paths (if not already there):
```json
"@platform/directives": ["projects/platform-directives/src/public-api.ts"]
```

## Authentication

### *appHasPermission
```html
<button *appHasPermission="'USER_CREATE'">Add User</button>
```

### *appHasRole
```html
<div *appHasRole="['Admin', 'Manager']">Admin Panel</div>
```

## Loading

### [appLoading]
```html
<div [appLoading]="isLoading()">
  <!-- Content -->
</div>
```

### appDisableOnLoading
```html
<button appDisableOnLoading="saveAction" (click)="save()">Save</button>
```

## Interaction

### appDebounceClick
```html
<button appDebounceClick [debounceTime]="300" (debouncedClick)="search()">Search</button>
```

### appConfirm
```html
<button appConfirm="Are you sure?" (confirmed)="delete()">Delete</button>
```

## Forms

### appTrim
```html
<input type="text" appTrim formControlName="username">
```

### appNumericOnly
```html
<input type="text" appNumericOnly formControlName="age">
```

### appUppercase
```html
<input type="text" appUppercase formControlName="countryCode">
```

### appFormError
```html
<input type="email" formControlName="email">
<span class="error" appFormError="email"></span>
```

## Feature Flags

### *appFeatureEnabled
```html
<button *appFeatureEnabled="'beta-feature'">Try Beta</button>
```

## Analytics

### appTrackEvent
```html
<button appTrackEvent="login_button_click" [eventProps]="{ method: 'google' }">Login</button>
```

## Theme

### appThemeClass
```html
<div appThemeClass="card">...</div>
<!-- Applies 'card-light' or 'card-dark' classes -->
```
