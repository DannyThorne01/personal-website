<script>
    import Map from "$lib/Map.svelte";
    import LifeSummary from "./LifeSummary.svelte";
</script>

<div class="top-panel">
    <div class="map-section">
        <Map />
    </div>
    <div class="summary-section">
        <LifeSummary />
    </div>
</div>

<style>
    /* Main container for side-by-side layout */
    .top-panel {
      display: flex;
      flex-direction: row; /* Desktop: Map on left, Summary on right */
      justify-content: space-between;
      align-items: stretch;
      gap: 16px;
      width: 100%;
      height: 100vh; 
    }
  
    /* Map section */
    .map-section {
      flex: 2; 
      width: 60%;
      height: 100%;
      display: flex;
      background: #f8fafc;
      border-radius: 12px;
    }
   
    /* LifeSummary section (right side on desktop) */
    .summary-section {
      flex: 1;
      width: 35%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  
    /* RESPONSIVE DESIGN: Mobile View */
    @media (max-width: 768px) {
        .top-panel {
            flex-direction: column; /* Stack Map on top, Summary below */
        }

        .map-section {
            width: 100%;
            min-height: 60vh;
            border-radius: 12px 12px 0 0;
        }
        .summary-section {
            width: 100%;
            border-radius: 0 0 12px 12px;
        }
    }
  </style>
  
