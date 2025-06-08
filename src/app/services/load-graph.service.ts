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

    rawNodes: any[] = [];
    private filteredRawNodes: any[] = [];
    rawLinks: any[] = [];
    private filteredRawLinks: any[] = [];
    groupsNodes: { [key: string]: any } = new Map([]);
    selectedNode: any = null;
    searchTerm = '';

    constructor(private http: HttpClient) {
        this.loadDemoGraph();
    }

    loadDemoGraph(): void {
        this.rawNodes = [{"nodeId":1,"componentType":"channel","integrationPatternType":"executor_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","observed":false},{"nodeId":2,"componentType":"null-channel","integrationPatternType":"null_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"receiveCounters":{"successes":0,"failures":0},"name":"nullChannel","observed":false},{"nodeId":3,"componentType":"publish-subscribe-channel","integrationPatternType":"publish_subscribe_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"errorChannel","observed":false},{"nodeId":4,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundChannelAdapterFlow.channel#0","observed":false},{"nodeId":5,"componentType":"channel","inte-grationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundChannelAdapterFlow.channel#1","observed":false},{"nodeId":6,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"AMQP_OUTBOUND_GATEWAY_INPUT_CHANNEL","observed":false},{"nodeId":7,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundGatewayFlow.channel#0","observed":false},{"nodeId":8,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"aggregateParking.input","observed":false},{"nodeId":9,"componentType":"fixed-subscriber-channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"aggregateParkings.channel#0","observed":false},{"nodeId":10,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"aggregateParkings.channel#1","observed":false},{"nodeId":11,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"aggregateParking.output","observed":false},{"nodeId":12,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"getCarResponseConsumerFlow.channel#0","observed":false},{"nodeId":13,"componentType":"fixed-subscriber-channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"getCarResponseConsumerFlow.channel#1","observed":false},{"nodeId":14,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"getCarResponseConsumerFlow.channel#2","observed":false},{"nodeId":15,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"massIndexerConsumer-in-0","observed":false},{"nodeId":16,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"addParking.input","observed":false},{"nodeId":17,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"addParking.output","observed":false},{"nodeId":18,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"checkIsCarAlreadyUsed.input","observed":false},{"nodeId":19,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"splitCars.input","observed":false},{"nodeId":20,"componentType":"channel","integrationPatternType":"message_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"addCarToCache.input","observed":false},{"nodeId":21,"componentType":"publish-subscribe-channel","integrationPatternType":"publish_subscribe_channel","integrationPatternCategory":"messaging_channel","properties":{},"sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"rabbit-2099728098.massIndexerConsumer-in-0.errors","observed":false},{"nodeId":22,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","errors":null,"name":"outboundAsyncTwoWayMessagingAdapter.sendToRabbit(java.lang.Object,java.lang.Object)","observed":false},{"nodeId":23,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"AMQP_OUTBOUND_GATEWAY_INPUT_CHANNEL","errors":null,"name":"outboundMessagingGateway.sendAndReceiveToRabbit(java.lang.Object,java.lang.Object)","observed":false},{"nodeId":24,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","errors":null,"name":"outboundOneWayMessagingAdapter.sendToRabbit(java.lang.Object,java.lang.Object)","observed":false},{"nodeId":25,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","errors":null,"name":"outboundTwoWayMessagingAdapter.sendToRabbit(java.lang.Object,java.lang.Object)","observed":false},{"nodeId":26,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"addParking.input","errors":null,"name":"parkingGateway.getAllParkings(java.lang.String)","observed":false},{"nodeId":27,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"addParking.input","errors":null,"name":"parkingGateway.updateParking(be.hassen.clean_architecture_template.core.model.parkings.Parking)","observed":false},{"nodeId":28,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"addParking.input","errors":null,"name":"parkingGateway.addParking(be.hassen.clean_architecture_template.core.model.parkings.Parking)","observed":false},{"nodeId":29,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","errors":null,"name":"carsMessagingGateway.updateParking(be.hassen.clean_architecture_template.core.model.parkings.Parking)","observed":false},{"nodeId":30,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","errors":null,"name":"carsMessagingGateway.getAllParkings(java.lang.String)","observed":false},{"nodeId":31,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","errors":null,"name":"carsMessagingGateway.getCar(be.hassen.clean_architecture_template.core.model.cars.CarQuery)","observed":false},{"nodeId":32,"componentType":"gateway","integrationPatternType":"inbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"getCarResponseConsumerFlow.channel#0","errors":null,"name":"getCarResponseConsumer.accept(java.lang.Object)","observed":false},{"nodeId":33,"componentType":"logging-channel-adapter","integrationPatternType":"outbound_channel_adapter","integrationPatternCategory":"messaging_endpoint","properties":{},"output":null,"input":"errorChannel","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"errorLogger","observed":false},{"nodeId":34,"componentType":"header-enricher","integrationPatternType":"header_enricher","integrationPatternCategory":"message_transformation","properties":{},"output":"amqpOutboundChannelAdapterFlow.channel#0","input":"AMQP_OUTBOUND_CHANNEL_ADAPTER_INPUT_CHANNEL","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundChannelAdapterFlow.org.springframework.integration.config.ConsumerEndpointFactoryBean#0","observed":false},{"nodeId":35,"componentType":"header-enricher","integrationPatternType":"header_enricher","integrationPatternCategory":"message_transformation","properties":{},"output":"amqpOutboundChannelAdapterFlow.channel#1","input":"amqpOutboundChannelAdapterFlow.channel#0","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundChannelAdapterFlow.org.springframework.integration.config.ConsumerEndpointFactoryBean#1","observed":false},{"nodeId":36,"componentType":"AmqpOutboundServiceConfiguration$$Lambda/0x0000023c01d7ecf8","integrationPatternType":"service_activator","integrationPatternCategory":"messaging_endpoint","properties":{},"output":null,"input":"amqpOutboundChannelAdapterFlow.channel#1","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundChannelAdapterFlow.org.springframework.integration.config.ConsumerEndpointFactoryBean#2","observed":false},{"nodeId":37,"componentType":"header-enricher","integrationPatternType":"header_enricher","integrationPatternCategory":"message_transformation","properties":{},"output":"amqpOutboundGatewayFlow.channel#0","input":"AMQP_OUTBOUND_GATEWAY_INPUT_CHANNEL","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundGatewayFlow.org.springframework.integration.config.ConsumerEndpointFactoryBean#0","observed":false},{"nodeId":38,"componentType":"amqp:outbound-gateway","integrationPatternType":"outbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":null,"input":"amqpOutboundGatewayFlow.channel#0","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"amqpOutboundGatewayFlow.org.springframework.integration.config.ConsumerEndpointFactoryBean#1","observed":false},{"nodeId":39,"componentType":"aggregator","integrationPatternType":"aggregator","integrationPatternCategory":"message_routing","properties":{},"output":"aggregateParkings.channel#1","input":"aggregateParking.input","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"discards":"nullChannel","name":"aggregateParkings.org.springframework.integration.config.ConsumerEndpointFactoryBean#0","observed":false},{"nodeId":40,"componentType":"bridge","integrationPatternType":"bridge","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"aggregateParking.output","input":"aggregateParkings.channel#1","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"aggregateParkings.org.springframework.integration.config.ConsumerEndpointFactoryBean#1","observed":false},{"nodeId":41,"componentType":"message-handler","integrationPatternType":"outbound_gateway","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"getCarResponseConsumerFlow.channel#2","input":"getCarResponseConsumerFlow.channel#0","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"getCarResponseConsumerFlow.org.springframework.integration.config.ConsumerEndpointFactoryBean#0","observed":false},{"nodeId":42,"componentType":"filter","integrationPatternType":"filter","integrationPatternCategory":"message_routing","properties":{},"output":null,"input":"getCarResponseConsumerFlow.channel#2","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"discards":null,"name":"getCarResponseConsumerFlow.org.springframework.integration.config.ConsumerEndpointFactoryBean#1","observed":false},{"nodeId":43,"componentType":"transformer","integrationPatternType":"transformer","integrationPatternCategory":"message_transformation","properties":{},"output":"splitCars.input","input":"addParking.input","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"addParkingPersistenceGateway.addParkingHeader.transformer","observed":false},{"nodeId":44,"componentType":"service-activator","integrationPatternType":"service_activator","integrationPatternCategory":"messaging_endpoint","properties":{},"output":null,"input":"addParking.output","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"addParkingPersistenceGateway.saveParking.serviceActivator","observed":false},{"nodeId":45,"componentType":"service-activator","integrationPatternType":"service_activator","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"addParking.output","input":"aggregateParking.output","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"addParkingPersistenceGateway.checkDuplicatesCars.serviceActivator","observed":false},{"nodeId":46,"componentType":"service-activator","integrationPatternType":"service_activator","integrationPatternCategory":"messaging_endpoint","properties":{},"output":"aggregateParking.input","input":"checkIsCarAlreadyUsed.input","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"addParkingPersistenceGateway.checkIsCarAlreadyUsed.serviceActivator","observed":false},{"nodeId":47,"componentType":"splitter","integrationPatternType":"splitter","integrationPatternCategory":"message_routing","properties":{},"output":"checkIsCarAlreadyUsed.input","input":"splitCars.input","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"discards":null,"name":"addParkingPersistenceGateway.splitCars.splitter","observed":false},{"nodeId":48,"componentType":"service-activator","integrationPatternType":"service_activator","integrationPatternCategory":"messaging_endpoint","properties":{},"output":null,"input":"addCarToCache.input","sendTimers":{"successes":{"count":0,"mean":0.0,"max":0.0},"failures":{"count":0,"mean":0.0,"max":0.0}},"name":"carCachingMessagingGateway.addCarToCache.serviceActivator","observed":false}];
        this.rawLinks = [{"from":22,"to":1,"type":"output"},{"from":23,"to":6,"type":"output"},{"from":24,"to":1,"type":"output"},{"from":25,"to":1,"type":"output"},{"from":26,"to":16,"type":"output"},{"from":27,"to":16,"type":"output"},{"from":28,"to":16,"type":"output"},{"from":29,"to":1,"type":"output"},{"from":30,"to":1,"type":"output"},{"from":31,"to":1,"type":"output"},{"from":32,"to":12,"type":"output"},{"from":3,"to":33,"type":"input"},{"from":1,"to":34,"type":"input"},{"from":34,"to":4,"type":"output"},{"from":4,"to":35,"type":"input"},{"from":35,"to":5,"type":"output"},{"from":5,"to":36,"type":"input"},{"from":6,"to":37,"type":"input"},{"from":37,"to":7,"type":"output"},{"from":7,"to":38,"type":"input"},{"from":8,"to":39,"type":"input"},{"from":39,"to":10,"type":"output"},{"from":39,"to":2,"type":"discard"},{"from":10,"to":40,"type":"input"},{"from":40,"to":11,"type":"output"},{"from":12,"to":41,"type":"input"},{"from":41,"to":14,"type":"output"},{"from":14,"to":42,"type":"input"},{"from":16,"to":43,"type":"input"},{"from":43,"to":19,"type":"output"},{"from":17,"to":44,"type":"input"},{"from":11,"to":45,"type":"input"},{"from":45,"to":17,"type":"output"},{"from":18,"to":46,"type":"input"},{"from":46,"to":8,"type":"output"},{"from":19,"to":47,"type":"input"},{"from":47,"to":18,"type":"output"},{"from":20,"to":48,"type":"input"}];
        this.updateGraph(this.rawNodes);

        // this.http.get<any>(this.graphURL).subscribe(data => {
        //     this.rawNodes = data.nodes || [];
        //     this.rawLinks = data.links || [];
        //     this.updateGraph(this.rawNodes);
        // });
    }

    loadGraph(): void {
        this.http.get<any>(this.graphURL).subscribe(data => {
            this.rawNodes = data.nodes || [];
            this.rawLinks = data.links || [];
            this.updateGraph(this.rawNodes);
        });
    }

    filter(): void {
        this.filteredRawNodes = this.rawNodes.filter(n =>
            n.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
            || n.integrationPatternCategory?.toLowerCase().includes(this.searchTerm.toLowerCase())
            || n.integrationPatternType?.toLowerCase().includes(this.searchTerm.toLowerCase())
            || n.componentType?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.restGroupsNodes(this.filteredRawNodes);
        this.notifyGroupsNodesChanged(this.groupsNodes);
    }

    restGroupsNodes(nodes: any[]): void {
        this.groupsNodes = new Map([]);
        nodes.forEach((r) => {
            let groups = this.groupsNodes.get(r.integrationPatternType) || {selected: false, group: []};
            groups.selected = groups.selected == true;
            r.selected = r.selected == true;
            groups.group.push(r);
            this.groupsNodes.set(r.integrationPatternType, groups);
            return r;
        }, Object.create(null));
    }

    updateGraph(nodes: any[]): void {
        const nodeIds = new Set(nodes.map(n => n.nodeId));
        this.filteredRawLinks = this.rawLinks.filter(l => nodeIds.has(l.from) && nodeIds.has(l.to))
            .map(l => ({id: `${l.from}-${l.to}`, from: l.from, to: l.to, type: l.type}));
        this.restGroupsNodes(nodes);
        this.notifyGroupsNodesChanged(this.groupsNodes);
        this.notifyDataLoaded(nodes, this.filteredRawLinks);
    }

    private notifyGroupsNodesChanged(groupsNodes: { [key: string]: any }) {
        this.groupsNodesChangedEvent.emit(groupsNodes);
    }

    notifygroupsSelectionChanged(groupsNodes: { [p: string]: any }, isChecked: boolean) {
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
