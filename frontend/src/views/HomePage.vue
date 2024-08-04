<template>
  <div class="home-container">
    <h1>Bienvenido al Sistema Académico</h1>
    <p>
      Este sistema está diseñado para facilitar la gestión académica tanto para profesores como para estudiantes. Puedes inscribirte en materias, revisar tu horario y gestionar tu perfil de manera sencilla.
    </p>
    <div class="buttons">
      <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
      <router-link to="/register" class="btn btn-secondary">Registrarse</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap');

.home-container {
  background-color: #FFFFFF;
  color: #34495E;
  font-family: 'Open Sans', sans-serif;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #2C3E50;
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #34495E;
  margin-bottom: 30px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  font-family: 'Montserrat', sans-serif;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: #16A085;
  color: #FFFFFF;
}

.btn-primary:hover,
.btn-primary:active {
  background-color: #138d75;
}

.btn-secondary {
  background-color: #ECF0F1;
  color: #34495E;
}

.btn-secondary:hover,
.btn-secondary:active {
  background-color: #d0d3d4;
}
</style>
