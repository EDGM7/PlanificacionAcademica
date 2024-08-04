<template>
  <div class="login-container">
    <h1>Inicio de Sesión</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="correo">Correo:</label>
        <input type="email" id='email' v-model="correo" required />
      </div>
      <div class="form-group">
        <label for="contrasena">Contraseña:</label>
        <input type="password" id="password" v-model="contrasena" required />
      </div>
      <button type="submit" class="btn-primary" id='btn_send'>Iniciar Sesión</button>
    </form>
    <div class="links">
      <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
      <router-link to="/forgot-password">¿Olvidaste tu contraseña?</router-link>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      correo: '',
      contrasena: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/auth/login', {
          correo: this.correo,
          contrasena: this.contrasena
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Error al iniciar sesión');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap');

.login-container {
  background-color: #ffffff;
  color: #34495e;
  font-family: 'Open Sans', sans-serif;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 50px auto;
}

h1 {
  color: #2c3e50;
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #34495e;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary {
  background-color: #16a085;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #138d75;
}

.links {
  margin-top: 10px;
}

.links a {
  display: block;
  margin-bottom: 5px;
  color: #16a085;
  font-weight: bold;
  text-decoration: none;
}

.links a:hover {
  color: #138d75;
}
</style>
