import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilderComponent } from '../components/form-builder.component';
import { BuilderStateService } from '../core/builder-state.service';
import { SchemaFactoryService } from '../core/schema-factory.service';

@Component({
  selector: 'platform-sample-builder-usage',
  standalone: true,
  imports: [CommonModule, FormBuilderComponent],
  template: `
    <div class="page-container">
      <platform-form-builder></platform-form-builder>
    </div>
  `,
  styles: [`
    .page-container {
      width: 100vw;
      height: 100vh;
    }
  `]
})
export class SampleBuilderUsageComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private state = inject(BuilderStateService);
  private factory = inject(SchemaFactoryService);

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadFormToBuilder(id);
    }
  }

  private loadFormToBuilder(id: string) {
    this.http.get(`./assets/forms/form-${id}.json`).subscribe({
      next: (engineSchema: any) => {
        const builderSchema = this.factory.fromFormEngineSchema(engineSchema);
        this.state.updateSchema(builderSchema);
      },
      error: (err) => {
        console.error('Error loading form to builder:', err);
      }
    });
  }
}
