import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {D3IndentedTreeViewerComponent} from './d3-indented-tree-viewer.component';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';
import {LoadGraphService} from "../services/load-graph.service";
import {provideHttpClient} from "@angular/common/http";

describe('D3IndentedTreeViewerComponent', () => {
    let component: D3IndentedTreeViewerComponent;
    let fixture: ComponentFixture<D3IndentedTreeViewerComponent>;
    let service: LoadGraphService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [D3IndentedTreeViewerComponent],
            imports: [FormsModule],
            providers: [provideHttpClient(), provideHttpClientTesting(),LoadGraphService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(D3IndentedTreeViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = TestBed.inject(LoadGraphService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(service).toBeTruthy();
    });

    it('should component updateGraph', () => {
        component.rawNodes = service.rawNodes;
        component.rawLinks = service.rawLinks;
        expect(() => component.updateGraph()).not.toThrow();
    });

    it('filters nodes by search term', () => {
        service.updateGraph(service.rawNodes);
        expect(service.rawLinks.length).toBe(38);
        expect(service.rawNodes.length).toBe(48);
        expect(service.groupsNodes.size).toBe(15);
        service.searchTerm = 'gateway';
        service.filter();
        expect(service.groupsNodes.size).toBe(7);
        console.log('groupsNodes::gateway : '+ service.groupsNodes.get('inbound_gateway'));
        expect(service.groupsNodes.get('inbound_gateway').group.length).toBe(11);
        expect(service.groupsNodes.get('inbound_gateway').group[0].name).toBe('outboundAsyncTwoWayMessagingAdapter.sendToRabbit(java.lang.Object,java.lang.Object)');
    });

    it('filters nodes by inexistent search term', () => {
        service.updateGraph(service.rawNodes);
        service.searchTerm = 'newPattern';
        service.filter();
        expect(service.groupsNodes.size).toBe(0);
    });

    it('selects a node by id', () => {
        service.updateGraph(service.rawNodes);
        service.searchTerm = 'inbound_gateway';
        service.filter();
        service.notifygroupsSelectionChanged(service.groupsNodes.get("inbound_gateway"), true);
    });
});
