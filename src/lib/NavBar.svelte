<script>
  // Optional: You can manage the active state of nav links, or use a router for navigation
</script>

<nav class="navbar">
  <div class="logo">
    <a href="/">My GeoTech Profile</a>
  </div>
  <ul class="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #333;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    z-index: 1000; /* Make sure it's on top */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .logo a {
    font-size: 24px;
    color: white;
    text-decoration: none;
    font-weight: bold;
  }

  .nav-links {
    list-style: none;
    display: flex;
    gap: 20px;
  }

  .nav-links li {
    display: inline;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.3s ease;
  }

  .nav-links a:hover {
    color: #50fa7b; 
  }

 
  @media (max-width: 768px) {
    .nav-links {
      flex-direction: column;
      gap: 10px;
    }
  }
</style>
