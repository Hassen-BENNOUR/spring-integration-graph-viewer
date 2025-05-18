import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {D3TidyTreeViewerComponent} from './d3-tidy-tree-viewer.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';

describe('D3TidyTreeViewerComponent', () => {
    let component: D3TidyTreeViewerComponent;
    let fixture: ComponentFixture<D3TidyTreeViewerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [D3TidyTreeViewerComponent],
            imports: [HttpClientTestingModule, FormsModule, NgxGraphModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(D3TidyTreeViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('filters nodes by search term', () => {
        component.rawNodes = [
            {id: '1', name: 'filterA'},
            {id: '2', name: 'routerB'}
        ];
        component.searchTerm = 'filter';
        component.updateGraph();
        expect(component.nodes.length).toBe(1);
        expect(component.nodes[0].label).toBe('filterA');
    });

    it('selects a node by id', () => {
        component.rawNodes = [
            {id: '1', name: 'filterA'},
            {id: '2', name: 'routerB'}
        ];
        component.onNodeClick('2');
        expect(component.selectedNode.name).toBe('routerB');
    });
});
