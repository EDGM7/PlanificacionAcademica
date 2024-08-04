<template>
  <div class="reset-password-container">
    <h1>Restablecer Contraseña</h1>
    <form @submit.prevent="resetPassword" class="reset-form">
      <div class="form-group">
        <label for="correo">Correo:</label>
        <input type="email" v-model="correo" required class="form-control">
      </div>
      <div class="form-group">
        <label for="nuevaContrasena">Nueva Contraseña:</label>
        <input type="password" v-model="nuevaContrasena" required class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Restablecer Contraseña</button>
    </form>
    <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      correo: '',
      nuevaContrasena: '',
      message: '',
      error: ''
    };
  },
  methods: {
    async resetPassword() {
      try {
        const response = await axios.post('/auth/forgot-password', {
          correo: this.correo,
          nuevaContrasena: this.nuevaContrasena
        });
        this.message = response.data.message;
        this.error = '';
        this.$router.push('/login');
      } catch (error) {
        this.error = error.response.data.error || 'Error al restablecer la contraseña';
        this.message = '';
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap');

.reset-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-family: 'Montserrat', sans-serif;
  color: #2C3E50;
  margin-bottom: 20px;
}

.reset-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-family: 'Open Sans', sans-serif;
  color: #34495E;
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #BDC3C7;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif;
}

.btn-primary {
  background-color: #16A085;
  color: #FFFFFF;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
}

.btn-primary:hover {
  background-color: #13856B;
}

.alert {
  padding: 10px;
  margin-top: 20px;
  border-radius: 4px;
}

.alert-success {
  background-color: #DFF0D8;
  color: #3C763D;
}

.alert-danger {
  background-color: #F2DEDE;
  color: #A94442;
}
</style>
