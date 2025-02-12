
<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import scrollama from "scrollama";
  import data from "$lib/node-links.json";

  let scroller;

  onMount(() => {
    const main = d3.select("main");
    const layer = d3.select("#graph").append("g");
    const width = d3.select("#graph").attr("width");
    const height = d3.select("#graph").attr("height");
    const scrolly = main.select("#scrolly");
    const figure = scrolly.select("figure");
    const article = scrolly.select("article");
    const step = article.selectAll(".step");

    let nodes = data.project_list;
    let accumulator = 0;
    let lastIndex = 0;
    let start = true;
    /**
       * @type {any[]}
       */
    let active_nodes = ["Google_STEP"]
    scroller = scrollama();

    function populateNetwork ()  {
            layer.selectAll("*").remove();
            let links = []; 
            active_nodes.forEach(node => { 
                let node_index = nodes.indexOf(node)
                console.log("Node Index:", node_index, "Node Value:", node);
                // @ts-ignore
                let node_conns = data.projects[node].related
                // make sure the link is created as a map like {source: <> , target: <>}
                Object.keys(node_conns).forEach(node_conn => {
    
                    if (active_nodes.includes(node_conn)) {
                        let link = { 'source': nodes.indexOf(node), 'target': nodes.indexOf(node_conn), 'src_name': node, 'tgt_name': node_conn};
                        links.push(link);
                    }
                })
            }) // END OF SETTING UP THE LINKS AND ACTIVE NODES 


            // turn the active nodes into a map [{id: <>}, {id: <>} ... ]
            // Neeed to do this for the simulator
            let active_nodes_num = active_nodes.map(node => ({ id: nodes.indexOf(node), name: node }));
            d3.forceSimulation()
                // @ts-ignore
                .nodes(active_nodes_num)
                .force("links", d3.forceLink()
                    .links(links)
                    .id(node => node['id']))
                .force("repulse", d3.forceManyBody().strength(-2000)) 
                .force("center", d3.forceCenter(width / 2.0, height / 2.0))
                .on("tick", render);

            function render() { // START OF RENDER FUNCTION

                // triangle arrowhead markers
                // docs : https://observablehq.com/@xianwu/force-directed-graph-network-graph-with-arrowheads-and-lab
                layer.append("defs").append("marker")
                    .attr("id", "arrowhead")
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 15) // Adjust position of the arrow relative to the end of the line
                    .attr("refY", 0)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto") // Ensures the arrowhead rotates with the line
                    .append("path")
                    .attr("d", "M0,-5L10,0L0,5") // Arrowhead shape
                    .attr("fill", "lightgrey");

                // Edges
                let lines = layer.selectAll("line.links").data(links)
                    .join(
                        enter => enter.append("line")
                            .attr("class", "links")
                            .attr("stroke", "lightgrey")
                            .attr("stroke-width", 3)
                            .attr("marker-end", "url(#arrowhead)")
                    )
                    .attr("x1", d => d.source.x).attr("x2", d => d.target.x)
                    .attr("y1", d => d.source.y).attr("y2", d => d.target.y);

                // Nodes
                let circles = layer.selectAll(".node-group")
                    .data(active_nodes_num)
                    .join(
                        enter => {
                            let nodeGroup = enter.append("g")
                                .attr("class", "node-group")

                            // Append the circle to the group
                            nodeGroup.append("circle")
                                .attr("class", "node")
                                // .attr("stroke", d=>console.log(d))
                                .attr("r", 15)
                                .attr("fill", "purple")
                                .on("click", (event, d) => {
                                    active_nodes = active_nodes.filter(node => nodes[d.id] !== node);
                                    populateNetwork(nodes);
                                });


                            // Append the text to the group
                            nodeGroup.append("text")
                                .attr("dx", 10)
                                .attr("dy", 4)  // Vertically center the text relative to the circle
                                .text(d => nodes[d.id])
                                .attr("class", "node-label")
                                .attr("fill", "yellow")
                                .style("font-size", "12px")

                            return nodeGroup;
                        },
                    ) // END OF DATA JOIN
                    .attr("transform", d => `translate(${d.x},${d.y})`);
            } //END OF RENDER FUNCTION
            render();
        } // END OF POPULATE NETWORK

    function handleResize() {
      var stepH = Math.floor(window.innerHeight * 0.75);
      step.style("height", stepH + "px");

      var figureHeight = window.innerHeight / 2;
      var figureMarginTop = (window.innerHeight - figureHeight) / 2;

      figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

      scroller.resize();
    }

    /**
       * @param {{ index: number; }} response
       */
    function handleStepEnter(response) {
      step.classed("is-active", (d, i) => i === response.index);
      

      if (response.index > lastIndex) {
        // Scrolling down → Increase accumulator
        start = false
        accumulator++;
        active_nodes.push(nodes[response.index]); // Add node
        populateNetwork();
      } else if (response.index < lastIndex) {
        start = false
        // Scrolling up → Decrease accumulator
        accumulator = Math.max(0, accumulator - 1);

        // Find and remove the last active node
        let d_node = nodes[lastIndex]; 
        active_nodes = active_nodes.filter(node => node !== d_node); // Correct filtering

        populateNetwork();
  }
  
  lastIndex = response.index; // Update last step index
}

populateNetwork()
    function init() {
      handleResize();

      scroller
        .setup({
          step: "#scrolly article .step",
          offset: 0.33,
          debug: false,
        })
        .onStepEnter(handleStepEnter);
    }

    init();

    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
</script>

<main>
  <section id="scrolly">
    <figure>
  
        <svg id="graph" height="500" width="600" style="background: #1a1a2e; 
           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); 
           border-radius: 8px;">
        </svg>
    </figure>

    <article>
      <div class="step" data-step="1">
        <p>STEP 1</p>
      </div>
      <div class="step" data-step="2">
        <p>STEP 2</p>
      </div>
      <div class="step" data-step="3">
        <p>STEP 3</p>
      </div>
      <div class="step" data-step="4">
        <p>STEP 4</p>
      </div>
    </article>
  </section>
</main>
<style>
  #scrolly {
    width:100%;
    position: relative;
    /* display: -webkit-box;
    display: -ms-flexbox; */
    flex-direction: row;
    display: flex;
    background-color: #f3f3f3;
    padding: 1rem;
  }

  #scrolly>* {
    /* -webkit-box-flex: 1;
    -ms-flex: 1; */
    flex: 1;
  }

  article {
    position: relative;
    padding: 0 1rem;
    max-width: 20rem;
  }

  figure {
    position: -webkit-sticky;
    position: sticky;
    width: 100%;
    margin: 0;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    background-color: #8a8a8a;
    z-index: 0;
  }
  svg#graph {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: block; /* Ensures no extra spacing */
  background: #1a1a2e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

  /* figure p {
    text-align: center;
    padding: 1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    -moz-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 8rem;
    font-weight: 900;
    color: #fff;
  } */

  .step {
    margin: 0 auto 2rem auto;
    background-color: #3b3b3b;
    color: #fff;
  }

  .step:last-child {
    margin-bottom: 0;
  }

  .step.is-active {
    background-color: goldenrod;
    color: #3b3b3b;
  }

  .step p {
    text-align: center;
    padding: 1rem;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
  #scrolly {
    flex-direction: column; /* Stack items vertically */
    align-items: center;
  }

  /* Move SVG to the top */
  figure {
    
    width: 100%;
    height: 300px; /* Adjust height for mobile */
    z-index: 10; /* Ensure SVG stays on top */
  }

  svg#graph {
    width: 100%;
    height: 100%;
  }

  /* Steps Move Below */
  article {
    margin-top: 0; /* Reset margin */
    padding-top: 320px; /* Push steps down below the SVG */
    width: 100%;
    max-width: none;
  }
}
</style>