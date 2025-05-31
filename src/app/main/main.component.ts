import {Component, OnInit} from '@angular/core';
import {LoadGraphService} from "../services/load-graph.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    groupsNodes: { [key: string]: any } = new Map([]);

    constructor(protected readonly loadGraphService: LoadGraphService) {
    }

    ngOnInit(): void {
        this.loadGraphService.groupsNodesChangedEvent
            .subscribe((groupsNodes: { [key: string]: any }) => {
                console.log('groupsNodesChangedEvent message from Component loadGraphService');
                this.groupsNodes = groupsNodes;
            });
    }
}
