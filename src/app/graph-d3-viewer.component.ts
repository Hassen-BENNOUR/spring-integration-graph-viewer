import { Component, OnInit,AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from "d3";

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
  selector: 'app-graph-d3-viewer',
  templateUrl: './graph-d3-viewer.component.html',
  styleUrls: ['./graph-d3-viewer.component.css']
})
export class GraphD3ViewerComponent implements OnInit, AfterViewInit  {
  graphURL = 'http://localhost:8083/doc/graph/integration';
  rawNodes: any[] = [];
  rawLinks: any[] = [];
  nodes: Node[] = [];
  data: Node[] = [];
  selectedNode: any = null;
  searchTerm = '';
  chart: Element;

  constructor(private http: HttpClient) {}

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

    this.rawLinks.filter(l => nodeIds.has(l.from) && nodeIds.has(l.to))
      .forEach(l => {
          const parent = this.nodes.find(n => n.id === l.from);
          const child = this.nodes.find(n => n.id === l.to);
          parent.children.push(child);
          this.data.push(parent);
      });
    const nodeData = new Node();
     nodeData.name = "start";
     nodeData.id = "0";
     nodeData.children= this.data;
//     this.chart = this.Tree(nodeData, {
//         label: d => d.name,
//         title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}`, // hover text
//         width: 1152,
//         height: 1152,
//         margin: 100
//     });


     const width = 2000;

      // Compute the tree height; this approach will allow the height of the
      // SVG to scale according to the breadth (width) of the tree layout.
      const root = d3.hierarchy(nodeData);
      const dx = 10;
      const dy = width / (root.height + 1);

      // Create a tree layout.
      const tree = d3.tree().nodeSize([dx, dy]);

      // Sort the tree and apply the layout.
      root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
      tree(root);

      // Compute the extent of the tree. Note that x and y are swapped here
      // because in the tree layout, x is the breadth, but when displayed, the
      // tree extends right rather than down.
      let x0 = Infinity;
      let x1 = -x0;
      root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });

      // Compute the adjusted height of the tree.
      const height = x1 - x0 + dx * 2;

      const svg = d3.select('#graph')
                                 .append('svg')
          .attr("width", width)
          .attr("height", height)
        .call(d3.zoom().on("zoom", function () {
           svg.attr("transform", d3.event.transform)
        }))
        .style("overflow", "scroll")
          .attr("viewBox", [-dy / 3, x0 - dx, width, height])
          .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");

      const link = svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5)
        .selectAll()
          .data(root.links())
          .join("path")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

      const node = svg.append("g")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
        .selectAll()
        .data(root.descendants())
        .join("g")
          .attr("transform", d => `translate(${d.y},${d.x})`);

      node.append("circle")
          .attr("fill", d => d.children ? "#555" : "#999")
          .attr("r", 2.5);

      node.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d.children ? -6 : 6)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .text(d => d.data.name)
          .attr("stroke", "white")
          .attr("paint-order", "stroke");
    }
}
