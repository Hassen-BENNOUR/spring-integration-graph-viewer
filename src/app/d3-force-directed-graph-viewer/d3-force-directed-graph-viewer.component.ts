import {Component, OnInit} from '@angular/core';
import * as d3 from "d3";
import {LoadGraphService} from "../services/load-graph.service";


@Component({
    selector: 'app-d3-force-directed-graph-viewer',
    templateUrl: './d3-force-directed-graph-viewer.component.html',
    styleUrls: ['./d3-force-directed-graph-viewer.component.css']
})
export class D3ForceDirectedGraphViewerComponent implements OnInit {
    rawNodes: any[] = [];
    rawLinks: any[] = [];
    nodes: any[] = [];
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
                if (node.label == name) {
                    if (checked) {
                        this.classList.add("selected");
                    } else {
                        this.classList.remove("selected");
                    }
                }
            });
    }

    private toggleGroupSelected(type: string, isChecked: boolean) {
        d3.selectAll(this.labels)
            .each(function (nodeType) {
                if (nodeType == type) {
                    if (isChecked) {
                        this.classList.add("selected");
                    } else {
                        this.classList.remove("selected");
                    }
                }
            });
    }

    updateGraph(): void {
        // calculate the dimensions of the chart.
        const width = window.innerWidth || document.body.clientWidth;
        const height = window.innerHeight || document.body.clientHeight;

        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const links = this.rawLinks.map(l => ({id: `${l.from}-${l.to}`, source: l.from, target: l.to}));
        const filtered = this.rawNodes.filter(n => !this.searchTerm || n.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
        const nodes = filtered.map(l => ({
            id: l.nodeId ?? l.id,
            label: `${l.name}`,
            type: l.integrationPatternType,
            data: l
        }));
        this.nodes = nodes;

        // Specify the color scale.
        const types = Array.from(new Set(nodes.map(d => d.type)));
        const color = d3.scaleOrdinal()
            .domain(types.sort(d3.ascending))
            .range(d3.schemeCategory10)
            .unknown("#8F8F8FC4");

        // Create a simulation with several forces.
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => 150))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked)
        ;

        d3.select('#d3-force-directed-graph-viewer').selectAll("svg").remove();

        const svgLegend = d3.select('#d3-force-directed-graph-viewer')
            .append('svg')
            .attr("width", width / 4)
            .attr("height", height)
            .attr("viewBox", [0, 50, width / 4, height])
            .attr("style", "max-width: 25%; height: auto; font: 12px sans-serif; overflow: scroll;display: inline;");

        svgLegend.selectAll("mydots")
            .data(types)
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
            .data(types)
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

        // Create the SVG container.
        const svg = d3.select('#d3-force-directed-graph-viewer')
            .append('svg')
            .attr("width", width / 4 * 3)
            .attr("height", height)
            .attr("viewBox", [width / 4, 0, width, height])
            .attr("style", "max-width: 75%; height: auto; font: 12px sans-serif; overflow: scroll;display: inline;");

        const group = svg.append("g");

        // Per-type markers, as they don't inherit styles.
        group.append("defs")
            .append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -0.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("fill", "#8F8F8FC4")
            .attr("d", "M0,-5L10,0L0,5");

        // Add a line for each link, and a circle for each node.
        const link = group.append("g")
            .attr("stroke", "#8F8F8FC4")
            .attr("stroke-opacity", 0.6)
            .selectAll()
            .data(links)
            .join("line")
            .attr("stroke-width", 1.5)
            .attr("color", "#8F8F8FC4")
            .attr("marker-end", "url(#arrow)");

        const node = group.append("g")
            .attr("fill", "currentColor")
            .selectAll(".node")
            .data(nodes)
            .join("g")
            .attr('class', 'node');

        node.append('circle')
            .attr("r", 5)
            .attr("fill", d => color(d.type));

        this.label = node.append("text")
            .text(function (d) {
                return d.data.name;
            })
            .attr("fill", d => color(d.type))
            .attr("dy", "0.32em")
            .attr('x', 6)
            .attr('y', 3);


        this.labels.attr("pointer-events", "all")
            .on("pointerenter", (event, d) => {
                this.label.classed("hover", n => n.type == d);
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
                        if (l.type == d) {
                            this.classList.toggle("selected");
                        } else {
                            this.classList.remove("selected");
                        }
                    });
            });

        // Add styles for the hover interaction.
        group.append("style").text(`.hover, .selected{ font: italic bold 20px sans-serif; stroke: yellow;}`);

        // Add a drag behavior.
        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        const zoomBehaviours = d3.zoom()
            .scaleExtent([0.05, 3])
            .on('zoom', (d3) => {
                group.attr('transform', d3.transform);
            });

        svg.call(zoomBehaviours);

        // Set the position attributes of links and nodes each time the simulation ticks.
        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        }

        // Reheat the simulation when drag starts, and fix the subject position.
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        // Update the subject (dragged node) position during drag.
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        // Restore the target alpha so the simulation cools after dragging ends.
        // Unfix the subject position now that it’s no longer being dragged.
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
    }

    onNodeClick(nodeId: string): void {
        const found = this.rawNodes.find(n => n.nodeId === nodeId || n.id === nodeId || n.name === nodeId);
        if (found) {
            this.selectedNode = found;
            this.searchTerm = found.name;
        }
    }
}
