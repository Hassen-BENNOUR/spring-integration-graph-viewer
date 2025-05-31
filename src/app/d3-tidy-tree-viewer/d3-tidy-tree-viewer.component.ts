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
    selector: 'app-d3-tidy-tree-viewer',
    templateUrl: './d3-tidy-tree-viewer.component.html',
    styleUrls: ['./d3-tidy-tree-viewer.component.css']
})
export class D3TidyTreeViewerComponent implements OnInit {
    rawNodes: any[] = [];
    rawLinks: any[] = [];
    nodes: Node[] = [];
    data: Node[] = [];


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
        this.nodes = this.rawNodes.map(n => ({
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

        let width = window.innerWidth || document.body.clientWidth;

        // Compute the tree height; this approach will allow the height of the
        // SVG to scale according to the breadth (width) of the tree layout.
        const root = d3.hierarchy(nodeData);

        const nodes = root.descendants();

        const groups = Array.from(new Set(this.rawNodes.map(d => d.integrationPatternType)));

        const height = (groups.length + 1) * 30;

        // A color scale for the nodes and links.
        const color = d3.scaleOrdinal()
            .domain(groups.sort(d3.ascending))
            .range(d3.schemeCategory10)
            .unknown("#8F8F8FC4");

        d3.select('#d3-tidy-tree-viewer').selectAll("*").remove();

        const svgLegend = d3.select('#d3-tidy-tree-viewer')
            .append('svg')
            .attr("width", width / 4)
            .attr("height", height)
            .attr("viewBox", [0, 50, width / 4, height])
            .attr("style", "font: 12px sans-serif; overflow: scroll;display: flex;");


        svgLegend.selectAll("mydots")
            .data(groups)
            .enter()
            .append("circle")
            .attr("cx", 5)
            .attr("cy", function (d, i) {
                return 100 + i * 25
            })
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
            })
            .style("fill", function (d) {
                return color(d)
            })
            .text(function (d) {
                return d
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");

        let innerHeight = window.innerHeight || document.body.clientHeight;
        const nodeSize = 5;
        innerHeight = (nodes.length + 1) * nodeSize;
        innerHeight = Math.min(innerHeight, window.innerHeight * 2)

        const svg = d3.select('#d3-tidy-tree-viewer')
            .style("display", "flex")
            .style("align-items", "center")
            .append('svg')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", [width / 4, 0, width * 2, innerHeight * 2])
            .attr("style", "display: flex; align-items: center; font: 12px sans-serif;overflow: scroll;user-select: none;")
        ;

        const dy = width / 4 * 3;

        root.x0 = 0;
        root.y0 = dy / 2;
        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            // if (d.depth) d.children = null;
        });

        const group = svg.append("g")
            .attr("id", "group");

        const gLink = group.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);

        const gNode = group.append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");

        const zoomBehaviours = d3.zoom()
            .scaleExtent([0.05, 10])
            .on('zoom', (event) => group.attr('transform', event.transform));

        svg.call(zoomBehaviours);

        // setTimeout(() => zoomBehaviours.translateTo(svg, 0, 0), 100);

        const update = (source: { altKey: any; y0: any; x0: any; y: any; x: any }, isRoot: boolean) => {
            const duration = source && source.altKey ? 2500 : 250;
            const nodes = root.descendants().reverse();
            const links = root.links();
            const dx = innerHeight;
            const tree = d3.tree().size([dx, dy])
            // Compute the new tree layout.
            tree(root);

            const transition = svg.transition()
                .duration(duration)
                // .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"))
                .tween("resize", window.ResizeObserver ? null : () => () => (svg.y))
            ;

            // Update the nodes…
            const node = gNode.selectAll("g")
                .data(nodes, d => d.id);

            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append("g")
                .attr("transform", `translate(${source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .on("click", (event, d) => {
                    d.children = d.children ? null : d._children;
                    if (event && event.altKey) {
                        d.altKey = event.altKey;
                    }
                    update(d, false);
                    if (event && event.altKey) {
                        setTimeout(() => {
                            zoomToFit();
                        }, duration + 100);
                    }
                });

            const nodeShape = nodeEnter.append("circle")
                .attr("r", 8)
                .attr("fill", d => color(d.data.integrationPatternType))
                .attr("stroke-width", 10);

            const label = nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d._children ? -6 : 6)
                .attr("text-anchor", d => d._children ? "end" : "start")
                .text(d => d.data.name)
                .attr("fill", d => color(d.data.integrationPatternType));

            if (isRoot) {
                this.label = label;
            }

            // Add styles for the hover interaction.
            group.append("style").text(`.hover, .selected{ font: italic bold 20px sans-serif; stroke: yellow;}`);

            // Transition nodes to their new position.
            const nodeUpdate = node.merge(nodeEnter)
                .transition(transition)
                .attr("transform", d => `translate(${d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            const nodeExit = node.exit()
                .transition(transition).remove()
                .attr("transform", d => `translate(${source.y},${source.x})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);

            // Update the links…
            const link = gLink.selectAll("path")
                .data(links, d => d.target.id);

            const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().append("path")
                .attr("d", d => {
                    const o = {y: source.x0, x: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.merge(linkEnter)
                .transition(transition)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit()
                .transition(transition).remove()
                .attr("d", d => {
                    const o = {y: source.x, x: source.y};
                    return diagonal({source: o, target: o});
                });

            // Stash the old positions for transition.
            root.eachBefore(d => {
                d.y0 = d.x;
                d.x0 = d.y;
            });
        }

        function zoomToFit() {
            let bounds = group.node().getBBox();
            let parent = group.node().parentElement;
            let fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
                fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
            let width = bounds.width,
                height = bounds.height;
            let midX = bounds.x + width / 2,
                midY = bounds.y + height / 2;
            if (width == 0 || height == 0) return; // nothing to fit

            let scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);

            const translate = [
                parent.viewBox.baseVal.x + fullWidth / 2 - scale * midX,
                parent.viewBox.baseVal.y + fullHeight / 2 - scale * midY
            ];

            const transform = d3.zoomIdentity
                .translate(translate[0], translate[1])
                .scale(scale);

            group
                .transition()
                .duration(500)
                .call(zoomBehaviours.transform, transform);
        }

        update(root, true);

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

        setTimeout(() => zoomToFit(), 1000);
    }
}
