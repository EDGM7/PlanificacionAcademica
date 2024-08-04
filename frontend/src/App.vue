<template>
  <div id="app">
    <nav v-if="!isAuthenticated">
      <router-link to="/">Inicio</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Registro</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      this.isAuthenticated = !!token;
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  color: #2c3e50; /* Azul Medianoche */
}

nav {
  padding: 15px;
  background-color: #2c3e50;
}

nav a {
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  color: #42b983;
  margin: 0 15px;
}

nav a.router-link-exact-active {
  color: #fff;
}
</style>
