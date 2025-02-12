<script>
// @ts-nocheck

  import { destinationStore } from '$lib/variablestore';
  import data from '$lib/desc.json'
</script>

<style>
  /* Container for the entire gallery */
  .container {
    width: 80%;
    margin: 1rem auto; 
  }

  /* Use CSS grid to create a masonry layout */
  .gallery {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 5vw);
    grid-gap: 1.5rem; 
  }

  /* Ensure images cover their block fully */
  .gallery__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block; 
  }

  /* Positioning for each gallery item */
  .gallery__item--1 {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
    border-radius: 50px;
  }

  .gallery__item--2 {
    grid-column: 3 / span 2;
    grid-row: 1 / span 2;
    border-radius: 16px;
  }

  .gallery__item--3 {
    grid-column: 5 / span 4;
    grid-row: 1 / span 5;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff, #f3f4f6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

  .gallery__item--4 {
    grid-column: 1 / span 4;
    grid-row: 3 / span 3;
    border-radius: 16px;
  }

  .gallery__item--5 {
    grid-column: 1 / span 4;
    grid-row: 6 / span 3;
    border-radius: 16px;
  }

  .gallery__item--6 {
    grid-column: 5 / span 4;
    grid-row: 6 / span 3;
    border-radius: 16px;
  }
</style>

<div class="container">
  <div class="gallery">
    <figure class="gallery__item gallery__item--1">
      <img src="https://i.pinimg.com/736x/73/2b/db/732bdbf7098a62691f3c28abc895b8fd.jpg" alt="Gallery image 1" class="gallery__img">
    </figure>
    <figure class="gallery__item gallery__item--2">
      <img src="https://i.pinimg.com/736x/8c/df/18/8cdf186422551f88c0f17b14fe46fef0.jpg" alt="Gallery image 2" class="gallery__img">
    </figure>
    <figure class="gallery__item gallery__item--3">
      <div class="life-section">
        <p>{$destinationStore}</p>
        <p>{data[$destinationStore] || "No description available"}</p>
      </div>
    </figure>
    <figure class="gallery__item gallery__item--4">
      <img src="https://i.pinimg.com/736x/02/02/cc/0202cc0103d45b9855580efb25ae8e1f.jpg" alt="Gallery image 4" class="gallery__img">
    </figure>
    <figure class="gallery__item gallery__item--5">
      <img src="https://i.pinimg.com/736x/a4/c4/1b/a4c41beb542fa3ea39884aa5a8ddfbb0.jpg" alt="Gallery image 5" class="gallery__img">
    </figure>
    <figure class="gallery__item gallery__item--6">
      <img src="https://i.pinimg.com/736x/42/b4/e1/42b4e13fb3f6a70264b8b4bb4fce1e4e.jpg" alt="Gallery image 6" class="gallery__img">
    </figure>
  </div>
</div>