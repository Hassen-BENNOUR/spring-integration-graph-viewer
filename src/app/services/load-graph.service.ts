import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class LoadGraphService {
    graphURL = 'http://localhost:8083/doc/graph/integration';

    @Output() loadEvent = new EventEmitter<any>();
    @Output() groupsNodesChangedEvent = new EventEmitter<any>();
    @Output() groupsSelectionChangedEvent = new EventEmitter<any>();
    @Output() nodesSelectionChangedEvent = new EventEmitter<any>();

    private data: any;
    private rawNodes: any[] = [];
    private filteredRawNodes: any[] = [];
    private rawLinks: any[] = [];
    private filteredRawLinks: any[] = [];
    private groupsNodes: { [key: string]: any } = new Map([]);
    selectedNode: any = null;
    searchTerm = '';

    constructor(private http: HttpClient) {
    }

    loadGraph(): void {
        this.http.get<any>(this.graphURL).subscribe(data => {
            this.data = data;
            this.rawNodes = data.nodes || [];
            this.rawLinks = data.links || [];
            this.updateGraph(this.rawNodes);
        });
    }

    filter(): void {
        this.filteredRawNodes = this.rawNodes.filter(n =>
            n.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.updateGraph(this.filteredRawNodes);
    }

    private updateGraph(nodes: any[]): void {
        const nodeIds = new Set(nodes.map(n => n.nodeId));
        this.filteredRawLinks = this.rawLinks.filter(l => nodeIds.has(l.from) && nodeIds.has(l.to))
            .map(l => ({id: `${l.from}-${l.to}`, from: l.from, to: l.to, type: l.type}));
        this.groupsNodes = new Map([]);
        nodes.forEach((r) => {
            let groups = this.groupsNodes.get(r.integrationPatternType) || {selected: false, group: []};
            groups.selected = groups.selected == true;
            r.selected = r.selected == true;
            groups.group.push(r);
            this.groupsNodes.set(r.integrationPatternType, groups);
            return r;
        }, Object.create(null));
        this.notifyGroupsNodesChanged(this.groupsNodes);
        this.notifyDataLoaded(nodes, this.filteredRawLinks);
    }

    private notifyGroupsNodesChanged(groupsNodes: { [key: string]: any }) {
        this.groupsNodesChangedEvent.emit(groupsNodes);
    }

    private notifygroupsSelectionChanged(groupsNodes: { [p: string]: any }, isChecked: boolean) {
        this.groupsSelectionChangedEvent.emit({groupsNodes: groupsNodes, isChecked: isChecked});
    }

    private notifyNodesSelectionChanged(group: string, name: string, checked: boolean) {
        this.nodesSelectionChangedEvent.emit({group: group, name: name, checked: checked});
    }

    private notifyDataLoaded(nodes: any[], links: any[]) {
        this.loadEvent.emit({nodes: nodes, links: links});
    }

    groupChange(event: Event, group: string): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        let groups = this.groupsNodes.get(group);
        groups.group.forEach((r) => {
            r.selected = isChecked;
            this.notifyNodesSelectionChanged(group, r.name, isChecked);
            return r;
        });
        this.notifygroupsSelectionChanged(groups, isChecked);
    }

    nodeChange(event: Event, integrationPatternType: any): void {
        let groups = this.groupsNodes.get(integrationPatternType);
        let checkedCount = 0;
        groups.group.forEach((r) => {
            if (r.selected) {
                checkedCount++;
            }
            return r;
        });
        let group = document.getElementById('dropdown-groups-' + integrationPatternType) as HTMLInputElement;
        // TODO use angular Controller's instead
        if (checkedCount === 0) {
            groups.checked = false;
            groups.indeterminate = false;
            group.indeterminate = false;
            group.checked = false;
            this.notifygroupsSelectionChanged(groups, false);
        } else if (checkedCount === groups.group.length) {
            groups.checked = true;
            groups.indeterminate = false;
            group.indeterminate = false;
            group.checked = true;
            this.notifygroupsSelectionChanged(groups, true);
        } else {
            groups.checked = false;
            groups.indeterminate = true;
            group.indeterminate = true;
            group.checked = false;
            this.notifygroupsSelectionChanged(groups, true);
        }
        const node = event.target as HTMLInputElement;
        this.notifyNodesSelectionChanged(integrationPatternType, node.value, node.checked);
    }

    updateIcons(): void {
        var images = document.querySelectorAll('image[eip="true"]');
        images.forEach(function (element) {
            console.log(element.getAttribute('src'));
        });
    }

    resetSelectedNode(): void {
        this.selectedNode = null;
        this.searchTerm = '';
        // this.updateGraph();
    }

    onNodeClick(nodeId: string): void {
        const found = this.rawNodes.find(n => n.nodeId === nodeId || n.name === nodeId);
        if (found) {
            this.selectedNode = found;
            this.searchTerm = found.name;
            // this.updateGraph();
        }
    }

    getImageUrl(componentType: string, integrationPatternType: string): string {
        const cleanName = componentType?.replace(/\s+/g, '') || '';
        if (componentType === "publish-subscribe-channel" || componentType === "fixed-subscriber-channel") {
            return `https://www.enterpriseintegrationpatterns.com/img/PublishSubscribeIcon.gif`;
        }
        if (componentType === "channel") {
            return `https://www.enterpriseintegrationpatterns.com/img/PointToPointIcon.gif`;
        }
        if (componentType === "gateway" || integrationPatternType.endsWith("_gateway")) {
            return `https://www.enterpriseintegrationpatterns.com/img/MessagingGatewayIcon.gif`;
        }
        if (componentType.endsWith("-channel-adapter")) {
            return `https://www.enterpriseintegrationpatterns.com/img/ChannelAdapterIcon.gif`;
        }
        if (componentType.endsWith("-enricher")) {
            return `https://www.enterpriseintegrationpatterns.com/img/DataEnricherIcon.gif`;
        }
        if (componentType === "aggregator") {
            return `https://www.enterpriseintegrationpatterns.com/img/AggregatorIcon.gif`;
        }
        if (componentType === "bridge") {
            return `https://www.enterpriseintegrationpatterns.com/img/MessagingBridge.gif`;
        }
        if (componentType === "filter") {
            return `https://www.enterpriseintegrationpatterns.com/img/MessageFilterIcon.gif`;
        }
        if (componentType === "splitter") {
            return `https://www.enterpriseintegrationpatterns.com/img/SplitterIcon.gif`;
        }
        if (componentType === "transformer") {
            return `https://www.enterpriseintegrationpatterns.com/img/MessageTranslatorIcon.gif`;
        }
        if (integrationPatternType === "service_activator") {
            return `https://www.enterpriseintegrationpatterns.com/img/MessagingAdapterIcon.gif`;
        }
        if (integrationPatternType === "message_channel" || integrationPatternType.endsWith("_channel")) {
            return `https://www.enterpriseintegrationpatterns.com/img/channelIcon.gif`;
        }
        return `https://www.enterpriseintegrationpatterns.com/img/${cleanName}Icon.gif`;
    }

    protected readonly String = String;
}
