<template>
  <div class="register-container">
    <h1>Registro de Usuario</h1>
    <form @submit.prevent="register">
      <fieldset>
        <legend>Información Personal</legend>
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="nombre" required>
        </div>
        <div class="form-group">
          <label for="apellido">Apellido:</label>
          <input type="text" v-model="apellido" required>
        </div>
        <div class="form-group">
          <label for="dni">DNI:</label>
          <input type="text" v-model="dni" required>
        </div>
      </fieldset>
      
      <fieldset>
        <legend>Contacto</legend>
        <div class="form-group">
          <label for="telefono">Teléfono:</label>
          <input type="text" v-model="telefono" required>
        </div>
        <div class="form-group">
          <label for="correo">Correo:</label>
          <input type="email" v-model="correo" required>
        </div>
        <div class="form-group">
          <label for="tipo_usuario">Tipo de Usuario:</label>
          <select v-model="tipo_usuario" required>
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>Datos para Inicio de Sesión</legend>
        <div class="form-group">
          <label for="usuario">Usuario:</label>
          <input type="text" v-model="usuario" required>
        </div>
        <div class="form-group">
          <label for="contrasena">Contraseña:</label>
          <input type="password" v-model="contrasena" required>
        </div>
      </fieldset>

      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>

<script>
import axios from '../axios';
import { useToast } from 'vue-toastification';

export default {
  name: "RegistroUsuario",
  data() {
    return {
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      dni: '',
      tipo_usuario: 'estudiante',
      usuario: '',
      contrasena: ''
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async register() {
      if (!this.nombre || !this.apellido || !this.correo || !this.telefono || !this.dni || !this.usuario || !this.contrasena) {
        this.toast.error('Por favor, complete todos los campos.');
        return;
      }

      try {
        // Realiza la solicitud HTTP
        await axios.post('/auth/register', {
          nombre: this.nombre,
          apellido: this.apellido,
          correo: this.correo,
          telefono: this.telefono,
          dni: this.dni,
          tipo_usuario: this.tipo_usuario,
          usuario: this.usuario,
          contrasena: this.contrasena
        });

        // Muestra el mensaje de éxito
        this.toast.success('Usuario registrado exitosamente');
        
        // Reinicia los campos del formulario
        this.nombre = '';
        this.apellido = '';
        this.correo = '';
        this.telefono = '';
        this.dni = '';
        this.tipo_usuario = 'estudiante';
        this.usuario = '';
        this.contrasena = '';

        // Redirige al usuario a la página de inicio de sesión
        this.$router.push('/login');
      } catch (error) {
        // Muestra el mensaje de error
        console.error('Error registering user:', error.response ? error.response.data : error.message);
        this.toast.error('Error al registrar el usuario');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap');

.register-container {
  background-color: #FFFFFF;
  color: #34495E;
  font-family: 'Open Sans', sans-serif;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 50px auto;
}

h1 {
  color: #2C3E50;
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

fieldset {
  border: 1px solid #ECF0F1;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 10px;
}

legend {
  font-size: 18px;
  font-family: 'Montserrat', sans-serif;
  color: #2C3E50;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #34495E;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ECF0F1;
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
  background-color: #16A085;
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #138D75;
}
</style>
