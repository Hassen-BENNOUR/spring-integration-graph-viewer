import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as d3 from "d3";

@Component({
    selector: 'app-d3-force-directed-curved-graph-viewer',
    templateUrl: './d3-force-directed-curved-graph-viewer.component.html',
    styleUrls: ['./d3-force-directed-curved-graph-viewer.component.css']
})
export class D3ForceDirectedCurvedGraphViewerComponent implements OnInit, AfterViewInit {
    graphURL = 'http://localhost:8083/doc/graph/integration';
    rawNodes: any[] = [];
    rawLinks: any[] = [];
    data: any[] = [];
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

        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const linksData = this.rawLinks.map(l => ({id: `${l.from}-${l.to}`, source: l.from, target: l.to}));
        const nodes = this.rawNodes.map(l => ({
            id: l.nodeId,
            label: `${l.name}`,
            source: l.input,
            target: l.output,
            type: l.integrationPatternType,
            data: l
        }));

//       const width = 928;
//       const height = 600;
        // calculate the dimensions of the chart.
        const width = window.innerWidth || document.body.clientWidth;
        const height = window.innerHeight || document.body.clientHeight;

        const types = Array.from(new Set(nodes.map(d => d.type)));
        const links = linksData.map(d => Object.create(d))

        const color = d3.scaleOrdinal()
            .domain(types.sort(d3.ascending))
            .range(d3.schemeCategory10)
            .unknown("#8F8F8FC4");

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => 150))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        const svgLegend = d3.select('#d3-force-directed-curved-graph-viewer')
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

        const svg = d3.select('#d3-force-directed-curved-graph-viewer')
            .append('svg')
            .attr("width", width / 4 * 3)
            .attr("height", height)
            .attr("viewBox", [-width / 4, -height / 2, width / 4 * 3, height])
            .attr("style", "max-width: 75%; height: auto; font: 12px sans-serif; overflow: scroll;display: inline;");

        const labels = svgLegend.selectAll("mylabels")
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

        const group = svg.append("g");

        // Per-type markers, as they don't inherit styles.
        group.append("defs")
            .selectAll("marker")
            .data(types)
            .join("marker")
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

        const link = group.append("g")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke", "#8F8F8FC4")
            .attr("marker-end", "url(#arrow)");

        const node = group.append("g")
            .attr("fill", "currentColor")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
        ;

        node.append("circle")
            .attr("stroke", "white")
            .attr("fill", d => color(d.type))
            .attr("stroke-width", 1.5)
            .attr("r", 4);

        const label = node.append("text")
            .attr("dy", "0.32em")
            .attr("x", 8)
            .attr("y", 3)
            .text(d => d.label)
            .attr("color", d => color(d.type));

        labels.attr("pointer-events", "all")
            .on("pointerenter", (event, d) => {
                label.classed("hover", n => n.type == d);
            })
            .on("pointerout", () => {
                label.classed("hover", false);
            })
            .on("click", (event, d) => {
                d3.selectAll(labels)
                    .each(function (l) {
                        if (l == d) {
                            this.classList.toggle("selected");
                        } else {
                            this.classList.remove("selected");
                        }
                    });
                d3.selectAll(label)
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

        const zoomBehaviours = d3.zoom()
            // .translateExtent([[0, 0], [width / 4 * 3, height]])
            // .extent([[0, 0], [width / 4 * 3, height]])
            .scaleExtent([0.05, 3])
            .on('zoom', (d3) => {
                group.attr('transform', d3.transform);
            });

        svg.call(zoomBehaviours);

        simulation.on("tick", () => {
            link.attr("d", linkArc);
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });

        function linkArc(d) {
            const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
            return `
            M${d.source.x},${d.source.y}
            A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
          `;
        }

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
}
