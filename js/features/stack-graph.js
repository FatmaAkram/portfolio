import { $, reduce } from "../utils.js";

/* stack as a force graph */
export default function initStackGraph() {
  var G = {
    Languages: ["TypeScript", "JavaScript", "HTML", "CSS"],
    "Frontend and UI": [
      "React",
      "Redux Toolkit",
      "React Router",
      "Ant Design",
      "Tailwind CSS",
      "Sass",
      "D3.js",
      "PDF.js",
    ],
    Architecture: [
      "single-spa",
      "Module Federation",
      "REST APIs",
      "WebSockets",
    ],
    Testing: ["Jest", "React Testing Library", "Cypress"],
    Monitoring: ["Sentry", "Amplitude"],
    "Backend and DevOps": ["Node.js", "Express.js", "Docker", "Kubernetes"],
    "Design and tooling": [
      "Wireframing",
      "Design systems",
      "Webpack",
      "Vite",
      "Git",
    ],
  };
  var list = $("#stack-list");
  Object.keys(G).forEach(function (h) {
    var d = document.createElement("div");
    d.innerHTML = "<b>" + h + "</b><span>" + G[h].join(", ") + "</span>";
    list.appendChild(d);
  });
  var svgEl = $("#stackg");
  if (typeof d3 === "undefined") {
    svgEl.style.display = "none";
    list.style.display = "grid";
    list.style.gap = "1rem";
    return;
  }
  var W = svgEl.clientWidth,
    H = svgEl.clientHeight;
  if (!W) return;
  var nodes = [{ id: "Fatma", k: "me", r: 10 }],
    links = [];
  Object.keys(G).forEach(function (h) {
    nodes.push({ id: h, k: "hub", r: 6.5 });
    links.push({
      source: "Fatma",
      target: h,
      d: Math.min(W, H) * 0.34,
    });
    G[h].forEach(function (s) {
      nodes.push({ id: s, k: "leaf", r: 3.6 });
      links.push({ source: h, target: s, d: 84 });
    });
  });
  var svg = d3.select(svgEl).attr("viewBox", "0 0 " + W + " " + H);
  var link = svg.append("g").selectAll("line").data(links).join("line");
  var node = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", function (d) {
      return d.k;
    });
  node.append("circle").attr("r", function (d) {
    return d.r;
  });
  node
    .append("text")
    .text(function (d) {
      return d.k === "me" ? "" : d.id;
    })
    .attr("text-anchor", "middle")
    .attr("dy", function (d) {
      return d.r + 13;
    });
  function tick() {
    nodes.forEach(function (d) {
      d.x = Math.max(40, Math.min(W - 40, d.x));
      d.y = Math.max(20, Math.min(H - 30, d.y));
    });
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }
  var sim = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id(function (d) {
          return d.id;
        })
        .distance(function (l) {
          return l.d;
        })
        .strength(0.7),
    )
    .force(
      "charge",
      d3.forceManyBody().strength(function (d) {
        return d.k === "leaf" ? -190 : -520;
      }),
    )
    .force("center", d3.forceCenter(W / 2, H / 2))
    .force(
      "collide",
      d3.forceCollide(function (d) {
        return d.k === "leaf" ? 38 : 56;
      }),
    )
    .force("x", d3.forceX(W / 2).strength(0.03))
    .force("y", d3.forceY(H / 2).strength(0.07))
    .on("tick", tick);
  if (reduce) {
    sim.stop();
    for (var i = 0; i < 300; i++) sim.tick();
    tick();
  }
  node.call(
    d3
      .drag()
      .on("start", function (e, d) {
        if (!e.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function (e, d) {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on("end", function (e, d) {
        if (!e.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }),
  );
  node
    .on("pointerenter", function (e, d) {
      var near = {};
      near[d.id] = 1;
      links.forEach(function (l) {
        if (l.source.id === d.id) near[l.target.id] = 1;
        if (l.target.id === d.id) near[l.source.id] = 1;
      });
      node.classed("dim", function (n) {
        return !near[n.id];
      });
      link.classed("hot", function (l) {
        return l.source.id === d.id || l.target.id === d.id;
      });
    })
    .on("pointerleave", function () {
      node.classed("dim", false);
      link.classed("hot", false);
    });
}
