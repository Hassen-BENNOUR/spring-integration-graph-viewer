import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {D3IndentedTreeViewerComponent} from './d3-indented-tree-viewer/d3-indented-tree-viewer.component';
import {
    D3ForceDirectedGraphViewerComponent
} from './d3-force-directed-graph-viewer/d3-force-directed-graph-viewer.component';
import {D3TidyTreeViewerComponent} from './d3-tidy-tree-viewer/d3-tidy-tree-viewer.component';
import {D3ArcDiagramViewerComponent} from './d3-arc-graph-viewer/d3-arc-diagram-viewer.component';
import {
    D3ForceDirectedCurvedGraphViewerComponent
} from './d3-force-directed-curved-graph-viewer/d3-force-directed-curved-graph-viewer.component';
import 'zone.js';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [AppComponent, MainComponent, D3ForceDirectedGraphViewerComponent, D3IndentedTreeViewerComponent, D3TidyTreeViewerComponent,
        D3ArcDiagramViewerComponent, D3ForceDirectedCurvedGraphViewerComponent],
    imports: [MatFormFieldModule, MatSelectModule, MatInputModule, BrowserModule, BrowserModule, BrowserAnimationsModule,
        ReactiveFormsModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}