import {Component, OnInit} from '@angular/core';
import * as d3 from "d3";
import {LoadGraphService} from '../services/load-graph.service';


@Component({
    selector: 'app-d3-arc-diagram-viewer',
    templateUrl: './d3-arc-diagram-viewer.component.html',
    styleUrls: ['./d3-arc-diagram-viewer.component.css']
})
export class D3ArcDiagramViewerComponent implements OnInit {
    rawNodes: any[] = [];
    rawLinks: any[] = [];
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

        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const links = this.rawLinks.map(l => ({id: `${l.from}-${l.to}`, source: l.from, target: l.to}));
        const nodes = this.rawNodes.map(l => ({
            id: l.nodeId,
            label: `${l.name}`,
            group: `${l.integrationPatternType}`,
            data: l
        }));

        var degree = d3.rollup(
            links.flatMap(({source, target, id}) => [
                {node: source, id},
                {node: target, id}
            ]),
            (v) => d3.sum(v, ({id}) => id),
            ({node}) => node
        );
        var orders = new Map([
            ["by name", d3.sort(nodes.map((d) => d.id))],
            ["by group", d3.sort(nodes, ({group}) => group, ({id}) => id).map(({id}) => id)],
            //    ["input", nodes.map(({id}) => id)],
            ["by degree", d3.sort(nodes, ({id}) => degree.get(id), ({id}) => id).map(({id}) => id).reverse()]
        ]);
        // Specify the chart’s dimensions.
        const step = 25;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 20;
        const marginLeft = 560;
        const height = (nodes.length - 1) * step + marginTop + marginBottom;
        const y = d3.scalePoint(orders.get("by name"), [marginTop, height - marginBottom]);

        const groupsColor = Array.from(new Set(nodes.map(d => d.group)));

        // A color scale for the nodes and links.
        const color = d3.scaleOrdinal()
            .domain(groupsColor.sort(d3.ascending))
            .range(d3.schemeCategory10)
            .unknown("#8F8F8FC4");

        // A function of a link, that checks that source and target have the same group and returns
        // the group; otherwise null. Used to color the links.
        const groups = new Map(nodes.map(d => [d.id, d.group]));

        d3.select('#d3-arc-diagram-viewer').selectAll("svg").remove();

        const svgLegend = d3.select('#d3-arc-diagram-viewer')
            .append('svg')
            .attr("width", width / 4)
            .attr("height", height)
            .attr("viewBox", [0, 50, width / 4, height])
            .attr("style", "max-width: 25%; height: auto; font: 12px sans-serif; overflow: visible;display: inline;");


        svgLegend.selectAll("mydots")
            .data(groupsColor)
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
            .data(groupsColor)
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


        const svg = d3.select('#d3-arc-diagram-viewer')
            .append('svg')
            .attr("width", width / 4 * 3)
            .attr("height", height)
            .attr("viewBox", [0, 0, width / 4 * 3, height])
            .attr("style", "max-width: 75%; height: auto; font: 10px sans-serif; overflow: scroll;display: inline;");

        // The current position, indexed by id. Will be interpolated.
        const Y = new Map(nodes.map(({id}) => [id, y(id)]));

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

        // Add an arc for each link.
        function arc(d) {
            const y1 = Y.get(d.source);
            const y2 = Y.get(d.target);
            const r = Math.abs(y2 - y1) / 2;
            return `M${marginLeft},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${marginLeft},${y2}`;
        }

        const path = group.insert("g", "*")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke", "#8F8F8FC4")
            .attr("marker-end", "url(#arrow)")
            .attr("d", arc);

        // Add a text label and a dot for each node.
        this.label = group.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("transform", d => `translate(${marginLeft},${Y.get(d.id)})`)
            .call(g => g.append("text")
                .attr("x", -6)
                .attr("dy", "0.32em")
                .attr("fill", d => d3.lab(color(d.group)).darker(2))
                .text(d => d.label))
            .call(g => g.append("circle")
                .attr("r", 5)
                .attr("fill", d => color(d.group)));

        this.labels.attr("pointer-events", "all")
            .on("pointerenter", (event, d) => {
                this.label.classed("hover", n => n.group == d);
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
                        if (l.group == d) {
                            this.classList.toggle("selected");
                        } else {
                            this.classList.remove("selected");
                        }
                    });
            });

        // Add styles for the hover interaction.
        group.append("style").text(`.hover, .selected{ font: italic bold 20px sans-serif; stroke: yellow;}`);

        // Add invisible rects that update the class of the elements on mouseover.
        const rect = this.label.append("rect")
            .attr("fill", "none")
            .attr("width", marginLeft + 40)
            .attr("height", step)
            .attr("x", -marginLeft)
            .attr("y", -step / 2)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("pointerenter", (event, d) => {
                group.classed("hovers", true);
                this.label.classed("primary", n => n === d);
                this.label.classed("secondary", n => links.some(({source, target}) => (
                    n.id === source && d.id == target || n.id === target && d.id === source
                )));
                path.classed("primary", l => l.source === d.id || l.target === d.id).filter(".primary").raise();
            })
            .on("pointerout", () => {
                group.classed("hovers", false);
                this.label.classed("primary", false);
                this.label.classed("secondary", false);
                path.classed("primary", false).order();
            });


        const zoomBehaviours = d3.zoom()
            .scaleExtent([0.05, 3])
            .on('zoom', (d3) => {
                group.attr('transform', d3.transform);
            });

        svg.call(zoomBehaviours);

        // Add styles for the hover interaction.
        group.append("style").text(`
           .hovers text { fill: #aaa; }
           .hovers g.primary text { font-weight: bold; fill: #8F8F8FC4; }
           .hovers g.secondary text { fill: #8F8F8FC4; }
           .hovers path { stroke: #ccc; }
           .hovers path.primary { stroke: #8F8F8FC4; }
         `);
    }

}
