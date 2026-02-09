import { Injectable, computed, signal } from '@angular/core';
import { BuilderField, BuilderFormSchema } from '../models';

export interface BuilderState {
    schema: BuilderFormSchema;
    selectedFieldId: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class BuilderStateService {
    private state = signal<BuilderState>({
        schema: {
            id: crypto.randomUUID(),
            title: 'New Form',
            fields: []
        },
        selectedFieldId: null
    });

    private history: BuilderFormSchema[] = [];
    private historyIndex = -1;

    // Selectors
    readonly schema = computed(() => this.state().schema);
    readonly fields = computed(() => this.state().schema.fields);
    readonly selectedFieldId = computed(() => this.state().selectedFieldId);
    readonly selectedField = computed(() => {
        const id = this.state().selectedFieldId;
        if (!id) return null;
        return this.findFieldById(this.state().schema.fields, id);
    });

    readonly canUndo = computed(() => this.historyIndex > 0);
    readonly canRedo = computed(() => this.historyIndex < this.history.length - 1);

    constructor() {
        this.saveToHistory(this.state().schema);
    }

    // Actions
    selectField(id: string | null) {
        this.state.update(s => ({ ...s, selectedFieldId: id }));
    }

    addField(field: BuilderField, index?: number) {
        const currentSchema = JSON.parse(JSON.stringify(this.state().schema));
        if (index !== undefined) {
            currentSchema.fields.splice(index, 0, field);
        } else {
            currentSchema.fields.push(field);
        }
        this.updateSchema(currentSchema);
        this.selectField(field.id);
    }

    updateField(fieldId: string, updates: Partial<BuilderField>) {
        const currentSchema = JSON.parse(JSON.stringify(this.state().schema));
        this.updateFieldRecursive(currentSchema.fields, fieldId, updates);
        this.updateSchema(currentSchema);
    }

    removeField(fieldId: string) {
        const currentSchema = JSON.parse(JSON.stringify(this.state().schema));
        currentSchema.fields = this.removeFieldRecursive(currentSchema.fields, fieldId);
        this.updateSchema(currentSchema);
        if (this.state().selectedFieldId === fieldId) {
            this.selectField(null);
        }
    }

    reorderFields(fields: BuilderField[]) {
        const currentSchema = { ...this.state().schema, fields };
        this.updateSchema(currentSchema);
    }

    updateSchema(schema: BuilderFormSchema) {
        this.state.update(s => ({ ...s, schema }));
        this.saveToHistory(schema);
    }

    undo() {
        if (this.canUndo()) {
            this.historyIndex--;
            this.state.update(s => ({ ...s, schema: JSON.parse(JSON.stringify(this.history[this.historyIndex])) }));
        }
    }

    redo() {
        if (this.canRedo()) {
            this.historyIndex++;
            this.state.update(s => ({ ...s, schema: JSON.parse(JSON.stringify(this.history[this.historyIndex])) }));
        }
    }

    // Private Helpers
    private saveToHistory(schema: BuilderFormSchema) {
        // Basic history management
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(JSON.parse(JSON.stringify(schema)));
        this.historyIndex++;
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    private findFieldById(fields: BuilderField[], id: string): BuilderField | null {
        for (const field of fields) {
            if (field.id === id) return field;
            if (field.children) {
                const found = this.findFieldById(field.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    private updateFieldRecursive(fields: BuilderField[], id: string, updates: Partial<BuilderField>) {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].id === id) {
                fields[i] = { ...fields[i], ...updates };
                return true;
            }
            if (fields[i].children && this.updateFieldRecursive(fields[i].children!, id, updates)) {
                return true;
            }
        }
        return false;
    }

    private removeFieldRecursive(fields: BuilderField[], id: string): BuilderField[] {
        return fields.filter(f => f.id !== id).map(f => {
            if (f.children) {
                return { ...f, children: this.removeFieldRecursive(f.children, id) };
            }
            return f;
        });
    }
}
