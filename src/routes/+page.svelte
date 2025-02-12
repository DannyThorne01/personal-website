<script lang="ts">
  import NavBar from '$lib/NavBar.svelte';
  import TopPanel from '$lib/TopPanel.svelte';
  import LifeSection from '$lib/LifeSection.svelte';
  import Projects from '$lib/Projects.svelte';
</script>

<!-- Main Page Container -->
<div class="main-page">
  <NavBar />
  <TopPanel />
  <LifeSection  />
  <Projects />
</div>

<style>
  /* Main page container */
  .main-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1600px; /* Prevents overly wide layout */
    margin: 0 auto;
    padding: 2rem 1.5rem; /* Add padding for better spacing */
    box-sizing: border-box;
  }
</style>

