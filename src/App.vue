<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Pokémon GO - Map</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/">Discord</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Plus</a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><router-link class="dropdown-item" to="/help">Aide</router-link></li>
              <li><router-link class="dropdown-item" to="/about">À propos</router-link></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Bientôt</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view/>
</template>
<style src='./assets/css/styles.css'></style>
