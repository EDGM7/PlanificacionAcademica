<template>
    <div>
      <h1>Restablecer Contraseña</h1>
      <form @submit.prevent="resetPassword">
        <div>
          <label for="nuevaContrasena">Nueva Contraseña:</label>
          <input type="password" v-model="nuevaContrasena" required>
        </div>
        <button type="submit">Restablecer Contraseña</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from '../axios';
  
  export default {
    data() {
      return {
        nuevaContrasena: '',
        token: this.$route.params.token
      };
    },
    methods: {
      async resetPassword() {
        try {
          await axios.post('/auth/reset-password', {
            token: this.token,
            nuevaContrasena: this.nuevaContrasena
          });
          alert('Contraseña restablecida exitosamente');
          this.$router.push('/login');
        } catch (error) {
          console.error('Error resetting password:', error);
          alert('Error al restablecer la contraseña');
        }
      }
    }
  };
  </script>
  