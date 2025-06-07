import {Component, OnInit} from '@angular/core';
import * as d3 from "d3";
import {LoadGraphService} from "../services/load-graph.service";

export class Node {
    id: string;
    name: string;
    children: Node[];
    componentType: string;
    integrationPatternType: string;
    integrationPatternCategory: string;
    data?: any;
}

@Component({
    selector: 'app-d3-indented-tree-viewer',
    templateUrl: './d3-indented-tree-viewer.component.html',
    styleUrls: ['./d3-indented-tree-viewer.component.css']
})
export class D3IndentedTreeViewerComponent implements OnInit {
    rawNodes: any[] = [];
    rawLinks: any[] = [];
    nodes: Node[] = [];
    data: Node[] = [];
    selectedNode: any = null;
    searchTerm = '';

    private labels: any;
    private label: any;

    constructor(private readonly loadGraphService: LoadGraphService) {
    }

    ngOnInit(): void {
        this.loadGraphService.loadEvent
            .subscribe((data: { nodes: any[], links: any[] }) => {
                this.rawNodes = data.nodes || [];
                this.rawLinks = data.links || [];
                this.updateGraph()
            });
        this.loadGraphService.groupsSelectionChangedEvent
            .subscribe((data: { groupsNodes: { [key: string]: any }, isChecked: boolean }) => {
                data.groupsNodes.group.forEach((r) => {
                    this.toggleGroupSelected(r.integrationPatternType, data.isChecked);
                    return r;
                });
            });
        this.loadGraphService.nodesSelectionChangedEvent
            .subscribe((data: { group: string, name: string, checked: boolean }) => {
                this.toggleNodeSelected(data.group, data.name, data.checked);
            });
    }

    private toggleNodeSelected(group: string, name: string, checked: boolean) {
        d3.selectAll(this.label)
            .each(function (node) {
                if (node.data.name == name) {
                    if (checked) {
                        this.classList.add("selected");
                    } else {
                        this.classList.remove("selected");
                    }
                }
            });
    }

    private toggleGroupSelected(group: string, isChecked: boolean) {
        d3.selectAll(this.labels)
            .each(function (nodeType) {
                if (nodeType == group) {
                    if (isChecked) {
                        this.classList.add("selected");
                    } else {
                        this.classList.remove("selected");
                    }
                }
            });
    }

    updateGraph(): void {
        const filtered = this.rawNodes.filter(n => !this.searchTerm || n.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
        this.nodes = filtered.map(n => ({
            id: n.nodeId,
            name: n.name,
            children: new Array<Node>(),
            componentType: n.componentType,
            integrationPatternType: n.integrationPatternType,
            integrationPatternCategory: n.integrationPatternCategory,
            data: n
        }));
        const nodeIds = new Set(this.nodes.map(n => n.id));

        this.data = [];

        this.rawLinks.filter(l => nodeIds.has(l.from) && nodeIds.has(l.to))
            .forEach(l => {
                const parent = this.nodes.find(n => n.id === l.from);
                const child = this.nodes.find(n => n.id === l.to);
                parent.children.push(child);
                this.data.push(parent);
            });
        const nodeData = new Node();
        nodeData.name = "Application";
        nodeData.id = "0";
        nodeData.children = this.data;

        // calculate the dimensions of the chart.
        const width = window.innerWidth || document.body.clientWidth;

        const root = d3.hierarchy(nodeData).eachBefore((i => d => d.index = i++)(0));
        const nodes = root.descendants();

        const groups = Array.from(new Set(this.rawNodes.map(d => d.integrationPatternType)));

        // A color scale for the nodes and links.
        const color = d3.scaleOrdinal()
            .domain(groups.sort(d3.ascending))
            .range(d3.schemeCategory10)
            .unknown("#8F8F8FC4");

        const nodeSize = this.rawLinks.length;
        const height = (nodes.length + 1) * nodeSize;

        d3.select('#d3-indented-tree-viewer').selectAll("svg").remove();

        const svgLegend = d3.select('#d3-indented-tree-viewer')
            .append('svg')
            .attr("width", width / 4)
            .attr("height", height)
            .attr("viewBox", [0, 50, width / 4, height])
            .attr("style", "max-width: 25%; height: auto; font: 12px sans-serif; overflow: scroll;display: inline;");


        svgLegend.selectAll("mydots")
            .data(groups)
            .enter()
            .append("circle")
            .attr("cx", 5)
            .attr("cy", function (d, i) {
                return 100 + i * 25
            }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 5)
            .style("fill", function (d) {
                return color(d)
            });

        this.labels = svgLegend.selectAll("mylabels")
            .data(groups)
            .enter()
            .append("text")
            .attr("x", 12)
            .attr("y", function (d, i) {
                return 100 + i * 25
            }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) {
                return color(d)
            })
            .text(function (d) {
                return d
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");

        const svg = d3.select('#d3-indented-tree-viewer')
            .append('svg')
            .attr("width", width / 4 * 3)
            .attr("height", height)
            .attr("viewBox", [-20, -50, width / 4 * 3, height])
            .attr("style", "max-width: 75%; height: auto; font: 12px sans-serif; overflow: scroll;display: inline;");

        const group = svg.append("g");

        const link = group.append("g")
            .attr("fill", "none")
            .attr("stroke", "#8F8F8FC4")
            .selectAll()
            .data(root.links())
            .join("path")
            .attr("d", d => `
              M${d.source.depth * nodeSize},${d.source.index * nodeSize}
              V${d.target.index * nodeSize}
              h${nodeSize}
            `);

        const node = group.append("g")
            .selectAll()
            .data(nodes)
            .join("g")
            .attr("transform", d => `translate(0,${d.index * nodeSize})`);

        node.append("circle")
            .attr("cx", d => d.depth * nodeSize)
            .attr("r", 5)
            .attr("fill", d => color(d.data.integrationPatternType));

        this.label = node.append("text")
            .attr("dy", "0.32em")
            .attr("x", d => d.depth * nodeSize + 6)
            .attr("fill", d => color(d.data.integrationPatternType))
            .text(d => d.data.name);

        node.append("title")
            .text(d => d.ancestors().reverse().map(d => d.data.name).join("/"));


        this.labels.attr("pointer-events", "all")
            .on("pointerenter", (event, d) => {
                this.label.classed("hover", n => n.data.integrationPatternType == d);
            })
            .on("pointerout", () => {
                this.label.classed("hover", false);
            })
            .on("click", (event, d) => {
                d3.selectAll(this.labels)
                    .each(function (l) {
                        if (l == d) {
                            this.classList.toggle("selected");
                        } else {
                            this.classList.remove("selected");
                        }
                    });
                d3.selectAll(this.label)
                    .each(function (l) {
                        if (l.data.integrationPatternType == d) {
                            this.classList.toggle("selected");
                        } else {
                            this.classList.remove("selected");
                        }
                    });
            });

        // Add styles for the hover interaction.
        group.append("style").text(`.hover, .selected{ font: italic bold 20px sans-serif; stroke: yellow;}`);

        const zoomBehaviours = d3.zoom()
            .scaleExtent([0.05, 3])
            .on('zoom', (d3) => {
                group.attr('transform', d3.transform);
            });

        svg.call(zoomBehaviours);
    }

    onNodeClick(nodeId: string): void {
        const found = this.rawNodes.find(n => n.nodeId === nodeId || n.id === nodeId || n.name === nodeId);
        if (found) {
            this.selectedNode = found;
            this.searchTerm = found.name;
        }
    }
}
