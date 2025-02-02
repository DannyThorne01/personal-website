<script>
// @ts-nocheck

  import { destinationStore } from '$lib/variablestore';
  import data from '$lib/desc.json'
</script>

<style>
  .life-section {
    max-width: 600px;
    width: 90%;
    margin: 2rem auto;
    padding: 1.5rem;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff, #f3f4f6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #555;
    margin: 0;
  }
</style>

<div class="life-section">
  <h2>Destination</h2>
  <p>{$destinationStore}</p>
  <p>{data[$destinationStore] || "No description available"}</p>
</div>
