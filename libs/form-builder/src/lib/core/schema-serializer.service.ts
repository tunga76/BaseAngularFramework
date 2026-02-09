import { Injectable } from '@angular/core';
import { BuilderFormSchema } from '../models';

@Injectable({
    providedIn: 'root'
})
export class SchemaSerializerService {

    serialize(schema: BuilderFormSchema): string {
        return JSON.stringify(schema, null, 2);
    }

    deserialize(json: string): BuilderFormSchema {
        try {
            const parsed = JSON.parse(json);
            // Validasyon eklenebilir
            return parsed;
        } catch (e) {
            console.error('Invalid JSON schema', e);
            throw e;
        }
    }

    download(schema: BuilderFormSchema) {
        const data = this.serialize(schema);
        const blob = new Blob([data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `form-schema-${schema.id}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
