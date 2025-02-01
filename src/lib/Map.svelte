<script lang="ts">
  import { onMount } from 'svelte';
  import { scaleQuantile } from 'd3-scale';
  import { Deck } from '@deck.gl/core';
  import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
  import maplibregl from 'maplibre-gl';

  const COUNTRIES = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

  let map: any = null;
  let deck: any = null;
  let mapContainer: HTMLElement;
  let deckCanvas: HTMLElement;

  export const inFlowColors = [
    [255, 255, 204], [199, 233, 180], [127, 205, 187], 
    [65, 182, 196], [29, 145, 192], [34, 94, 168], [12, 44, 132]
  ];
  
  export const outFlowColors = [
    [255, 255, 178], [254, 217, 118], [254, 178, 76], 
    [253, 141, 60], [252, 78, 42], [227, 26, 28], [177, 0, 38]
  ];

  onMount(() => {
    const arcs = [
      { source: { latitude: 6.8013, longitude: -58.1551 }, target: { latitude: 40.7128, longitude: -74.006 }, value: 300, quantile: 0 },
      { source: { latitude: 40.7128, longitude: -74.006 }, target: { latitude: 42.443, longitude: -76.5019 }, value: 100, quantile: 0 },
      { source: { latitude: 42.443, longitude: -76.5019 }, target: { latitude: 32.7767, longitude: -96.797 }, value: 150, quantile: 0 },
      { source: { latitude: 42.443, longitude: -76.5019 }, target: { latitude: 42.3601, longitude: -71.0589 }, value: 200, quantile: 0 },
      { source: { latitude: 42.443, longitude: -76.5019 }, target: { latitude: 37.7749, longitude: -122.4194 }, value: 200, quantile: 0 },
      { source: { latitude: 37.7749, longitude: -122.4194 }, target: { latitude: 37.8651, longitude: -119.5383 }, value: 200, quantile: 0 }
    ];

    // Set quantile for each arc
    const scale = scaleQuantile()
      .domain(arcs.map(a => Math.abs(a.value)))
      .range(inFlowColors.map((c, i) => i));

    arcs.forEach(a => {
      a.quantile = scale(Math.abs(a.value));
    });

    const INITIAL_VIEW_STATE = {
      latitude: 37.7749,
      longitude: -98,
      zoom: 3,
      bearing: 0,
      pitch: 30
    };

    // Initialize MapLibre
    map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      pitch: INITIAL_VIEW_STATE.pitch,
      bearing: INITIAL_VIEW_STATE.bearing,
      interactive: false // Deck.gl handles interactions
    });

    // Create an ArcLayer for the static arcs
    const arcLayer = new ArcLayer({
      id: 'arc-layer',
      data: arcs,
      getSourcePosition: d => [d.source.longitude, d.source.latitude],
      getTargetPosition: d => [d.target.longitude, d.target.latitude],
      getSourceColor: d => (d.value > 0 ? inFlowColors : outFlowColors)[d.quantile],
      getTargetColor: d => (d.value > 0 ? outFlowColors : inFlowColors)[d.quantile],
      getWidth: 4,
      opacity: 0.8
    });

  
    deck = new Deck({
      canvas: deckCanvas,
      width: '100%',
      height: '100%',
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      layers: [arcLayer],
      onViewStateChange: ({ viewState }) => {
        map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch
        });
      }
    });



   
    const chosenArc = arcs[4];
    let progress = 0; // progress between 0 (source) and 1 (target)
    const speed = 0.001; // adjust this value to change animation speed

    function animate() {
      progress += speed;
      if (progress > 1) {
        progress = 0; // restart animation once it reaches the target
      }

      // Simple linear interpolation of coordinates
      const currentLongitude = chosenArc.source.longitude +
        progress * (chosenArc.target.longitude - chosenArc.source.longitude);
      const currentLatitude = chosenArc.source.latitude +
        progress * (chosenArc.target.latitude - chosenArc.source.latitude);

      // Create a ScatterplotLayer for the moving dot
      const movingDotLayer = new ScatterplotLayer({
        id: 'moving-dot',
        data: [{ position: [currentLongitude, currentLatitude] }],
        getPosition: d => d.position,
        // Use pixel radii to keep the dot size consistent across zoom levels
        radiusMinPixels: 5,
        radiusMaxPixels: 10,
        getFillColor: [255, 0, 0]
      });

      // Update deck.gl with both the arcLayer and the new moving dot layer
      deck.setProps({
        layers: [arcLayer, movingDotLayer]
      });

      requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();
  });
</script>

<!-- Container for the MapLibre & Deck.gl Layers -->
<div class="deck-container">
  <div class="map-container" bind:this={mapContainer}></div>
  <canvas class="deck-canvas" bind:this={deckCanvas}></canvas>
</div>

<style>
  .deck-container {
    width: 70%;
    height: 600px;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .map-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #e5e9ec;
    overflow: hidden;
  }

  .deck-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto; /* Allow MapLibre interactions */
  }
</style>


