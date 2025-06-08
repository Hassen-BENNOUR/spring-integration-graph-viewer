import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

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

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, MainComponent, D3ForceDirectedGraphViewerComponent, D3IndentedTreeViewerComponent, D3TidyTreeViewerComponent,
        D3ArcDiagramViewerComponent, D3ForceDirectedCurvedGraphViewerComponent],
    imports: [BrowserModule,
        ReactiveFormsModule, FormsModule],
    providers: [
        provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {
}