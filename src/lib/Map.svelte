<script lang="ts">
  import { onMount ,createEventDispatcher} from 'svelte';
  import { scaleQuantile } from 'd3-scale';
  import { Deck } from '@deck.gl/core';
  import { ArcLayer, GeoJsonLayer, ScatterplotLayer,IconLayer } from '@deck.gl/layers';
  import maplibregl from 'maplibre-gl';
  import { destinationStore } from '$lib/variablestore';
  import data from '$lib/geometries.json';
  
  export const inFlowColors = [
    [255, 255, 204], [199, 233, 180], [127, 205, 187],
    [65, 182, 196], [29, 145, 192], [34, 94, 168], [12, 44, 132]
  ];

  export const outFlowColors = [
    [255, 255, 178], [254, 217, 118], [254, 178, 76],
    [253, 141, 60], [252, 78, 42], [227, 26, 28], [177, 0, 38]
  ];


  let map: any = null;
  let deck: any = null;
  let mapContainer: HTMLElement;
  let deckCanvas: HTMLElement;
  type Arc = {
    source: { longitude: number; latitude: number; };
    target: { longitude: number; latitude: number; };
  } | null;

  type HoverInfo = {
    x:number;
    y:number;
    object:any
  } | null 

  let hoverInfo: HoverInfo = null;
  

  const arcs = [
      { source: { latitude: 6.8013, longitude: -58.1551 }, target:{ latitude: 42.443, longitude: -76.5019 }, value: 300, quantile: 0, sourceName: "Georgetown, Guyana", targetName: "Ithaca, New York" },
      { source: { latitude: 42.443, longitude: -76.5019 }, target: { latitude: 32.7767, longitude: -96.797 }, value: 300, quantile: 0, sourceName: "Ithaca, New York", targetName:  "Dallas, Texas" },
      { source: { latitude: 42.443, longitude: -76.5019 }, target: { latitude: 42.3601, longitude: -71.0589 }, value: 300, quantile: 0,sourceName: "Ithaca, New York", targetName:  "Boston, MA"},
      { source: { latitude: 42.443, longitude: -76.5019 }, target: { latitude: 37.7749, longitude: -122.4194 }, value: 500, quantile: 0, sourceName: "Ithaca, New York", targetName:  "San Francisco, CA" },
      { source: { latitude: 37.7749, longitude: -122.4194 }, target: { latitude: 37.8651, longitude: -119.5383 }, value: 200, quantile: 0, sourceName: "San Francisco, CA", targetName:  "Yosemite" }
    ];
  const quantileScale = scaleQuantile()
    .domain(arcs.map(a => Math.abs(a.value)))
    .range(inFlowColors.map((c, i) => i));
  arcs.forEach(a => {
    a.quantile = quantileScale(Math.abs(a.value));
  });
  const INITIAL_VIEW_STATE = {
    latitude: 28,
    longitude: -88,
    zoom:3,
    bearing: 0,
    pitch: 30
  };


  onMount(() => {
    let chosenArc: Arc = null;
    let progress = 0;
    const speed = 0.008;

    // Initialize MapLibre
    map = new maplibregl.Map({
  container: mapContainer,
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
  zoom: INITIAL_VIEW_STATE.zoom,
  interactive: true, // Keep interactions on but manually control zoom
  scrollZoom: true // Disable default scroll zoom
});

// // Re-enable zoom only when Ctrl is pressed
// map.scrollZoom.disable();
// window.addEventListener('wheel', (event) => {
//   if (event.ctrlKey) {
//     map.scrollZoom.enable(); // Enable zooming when Ctrl is held
//   } else {
//     map.scrollZoom.disable(); // Disable zooming if Ctrl is not held
//   }
// });
    
    const highlightLayer = new GeoJsonLayer({
            id: 'airports',
            data: data,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 2000,
            getPointRadius: f => 11 - f.properties.scalerank,
            getFillColor: [200, 0, 80, 180],
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onClick: info =>
              // eslint-disable-next-line
              info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
          })
    const arcLayer = new ArcLayer({
      id: 'arc-layer',
      data: arcs,
      pickable: true,
      onHover: (info) => {
        hoverInfo = info && info.object ? {x : info.x, y: info.y, object:info.object} : null;
        deck.setProps({ layers: [arcLayer, iconLayer] });
      },
      onClick: (info, event) => {
        if (info && info.object) {
          chosenArc = info.object;
          progress = 0;
          const destination = `${info.object.sourceName} to ${info.object.targetName}`;
          destinationStore.set(destination);
        }
      },
      getSourcePosition: d => [d.source.longitude, d.source.latitude],
      getTargetPosition: d => [d.target.longitude, d.target.latitude],
      getSourceColor: d => (d.value > 0 ? inFlowColors : outFlowColors)[d.quantile],
      getTargetColor: d => (d.value > 0 ? outFlowColors : inFlowColors)[d.quantile],
      getWidth: 4,
      opacity: 0.8
    });
    const iconLayer = new IconLayer({
      id: 'IconLayer',
      data: arcs,
      getColor: d => [Math.sqrt(d.exits), 140, 0],
      getIcon: d => 'marker',
      getPosition: d => [d.target.longitude, d.target.latitude],
      getSize: 20,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
      pickable: true
    });
    deck = new Deck({
  canvas: deckCanvas,
  width: '100%',
  height: '100%',
  initialViewState: INITIAL_VIEW_STATE,
  controller: {
    scrollZoom: false,
    dragPan: true,
    dragRotate: true,
    doubleClickZoom: true
  },
  layers: [arcLayer, iconLayer],
  onViewStateChange: ({ viewState, interactionState }) => {
    // Prevent zooming out too much
    if (viewState.zoom < INITIAL_VIEW_STATE.zoom) {
      viewState.zoom = INITIAL_VIEW_STATE.zoom;
    }

    // Sync with MapLibre
    map.jumpTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch
    });
  }
});

// Add event listener to enable zoom only when Ctrl is held
// window.addEventListener('wheel', (event) => {
//   if (event.ctrlKey) {
//     deck.setProps({
//       controller: { scrollZoom: true } // Enable zoom when Ctrl is pressed
//     });
//   } else {
//     deck.setProps({
//       controller: { scrollZoom: false } // Disable zoom otherwise
//     });
//   }
// });

  
  function animate() {
    if (chosenArc) {
      progress += speed;
      if (progress > 1) {
        progress = 0;
        chosenArc = null;   
      } else {
        const currentLongitude = chosenArc.source.longitude +
          progress * (chosenArc.target.longitude - chosenArc.source.longitude);
        const currentLatitude = chosenArc.source.latitude +
          progress * (chosenArc.target.latitude - chosenArc.source.latitude);
        const movingDotLayer = new ScatterplotLayer({
          id: 'moving-dot',
          data: [{ position: [currentLongitude, currentLatitude] }],
          getPosition: d => d.position,
          radiusMinPixels: 5,
          radiusMaxPixels: 10,
          getFillColor: [255, 0, 0]
        });
        deck.setProps({
          layers: [arcLayer, movingDotLayer, iconLayer, highlightLayer]
        });
      }
    } else {
      deck.setProps({
        layers: [arcLayer, iconLayer, highlightLayer]
      });
    }
    requestAnimationFrame(animate);
  }
  animate();
});

</script>


<div class="deck-container">
  <div class="map-container" bind:this={mapContainer}></div>
  <canvas class="deck-canvas" bind:this={deckCanvas}></canvas>
  {#if hoverInfo && hoverInfo.object}
    <div class="tooltip" style="left: {hoverInfo.x}px; top: {hoverInfo.y}px;">
      <div><strong>{hoverInfo.object.sourceName}</strong> TO <strong>{hoverInfo.object.targetName}</strong> </div>
    </div>
  {/if}
</div>

<style>
  .deck-container {
    width: 60%;  /* Smaller width */
    height: 600px; /* Smaller height */
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    margin-left: 5%; 
    margin-top: 0px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .map-container,
  .deck-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .deck-canvas {
    pointer-events: auto; 
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    z-index: 10;
    transform: translate(-50%, -110%);
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
</style>

