import {Component, OnInit, AfterViewInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as d3 from "d3";


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {
    graphURL = 'http://localhost:8083/doc/graph/integration';
    rawNodes: any[] = [];
    rawLinks: any[] = [];
    selectedNode: any = null;
    searchTerm = '';

    constructor(private http: HttpClient) {
    }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    loadGraph(): void {
        this.http.get<any>(this.graphURL).subscribe(data => {
            this.rawNodes = data.nodes || [];
            this.rawLinks = data.links || [];
            this.updateGraph();
        });
    }

    updateGraph(): void {
        const filtered = this.rawNodes.filter(n =>
            n.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        // calculate the dimensions of the chart.
        const width = window.innerWidth || document.body.clientWidth;
        const height = window.innerHeight || document.body.clientHeight;


        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const links = this.rawLinks.map(l => ({id: `${l.from}-${l.to}`, source: l.from, target: l.to}));
        const nodes = this.rawNodes.map(l => ({
            id: l.nodeId,
            label: `${l.name}`,
            type: l.integrationPatternType,
            data: l
        }));
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
        this.updateGraph();
    }

    onNodeClick(nodeId: string): void {
        const found = this.rawNodes.find(n => n.nodeId === nodeId || n.name === nodeId);
        if (found) {
            this.selectedNode = found;
            this.searchTerm = found.name;
            this.updateGraph();
        }
    }

    filter(): void {
        this.updateGraph();
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
}
