<template>
  <div class="user-profile-container my-5">
    <h1 class="mb-4 text-center">Perfil del Usuario</h1>
    <div class="card">
      <div class="card-body">
        <div class="profile-item">
          <strong id="nameLabel">Nombre:</strong> {{ perfil.nombre }}
        </div>
        <div class="profile-item">
          <strong>Correo:</strong> {{ perfil.correo }}
        </div>
        <div class="profile-item">
          <strong>DNI:</strong> {{ perfil.dni }}
        </div>
      </div>
    </div>
    <button class="btn btn-primary mt-4" @click="goToDashboard">Volver al Dashboard</button>

    <div v-if="isAdmin">
      <h1 class="mb-4 text-center">Gestión de Usuarios</h1>
      <button class="btn btn-primary mb-4" @click="mostrarFormulario(true)">Agregar Usuario</button>
      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>DNI</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.correo }}</td>
                <td>{{ usuario.dni }}</td>
                <td>
                  <button class="btn btn-warning" @click="editarUsuario(usuario)">Editar</button>
                  <button class="btn btn-danger" @click="eliminarUsuario(usuario.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="mostrarForm" class="card mt-4">
        <div class="card-body">
          <h2>{{ usuarioEditando.id ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
          <form @submit.prevent="guardarUsuario">
            <fieldset>
              <legend>Información Personal</legend>
              <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" v-model="usuarioEditando.nombre" required>
              </div>
              <div class="form-group">
                <label for="apellido">Apellido:</label>
                <input type="text" v-model="usuarioEditando.apellido" required>
              </div>
              <div class="form-group">
                <label for="dni">DNI:</label>
                <input type="text" v-model="usuarioEditando.dni" required>
              </div>
            </fieldset>
            
            <fieldset>
              <legend>Contacto</legend>
              <div class="form-group">
                <label for="telefono">Teléfono:</label>
                <input type="text" v-model="usuarioEditando.telefono" required>
              </div>
              <div class="form-group">
                <label for="correo">Correo:</label>
                <input type="email" v-model="usuarioEditando.correo" required>
              </div>
              <div class="form-group">
                <label for="tipo_usuario">Tipo de Usuario:</label>
                <select v-model="usuarioEditando.tipo_usuario" required>
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
                <input type="text" v-model="usuarioEditando.usuario" required>
              </div>
              <div class="form-group">
                <label for="contrasena">Contraseña:</label>
                <input type="password" v-model="usuarioEditando.contrasena" required>
              </div>
            </fieldset>

            <button type="submit" class="btn btn-success mt-3">Guardar</button>
            <button type="button" class="btn btn-secondary mt-3" @click="mostrarFormulario(false)">Cancelar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default {
  name: 'UserProfile',
  data() {
    return {
      perfil: {},
      usuarios: [],
      mostrarForm: false,
      isAdmin: false,
      usuarioEditando: {
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        dni: '',
        tipo_usuario: 'estudiante',
        usuario: '',
        contrasena: ''
      }
    };
  },
  async created() {
    await this.validarToken();
    this.fetchPerfil();
    if (this.isAdmin) {
      this.fetchUsuarios();
    }
  },
  methods: {
    useToast,
    validarToken() {
      const role = localStorage.getItem('role');
      this.isAdmin = role === 'administrador';
    },
    async fetchPerfil() {
      try {
        const response = await axios.get('/usuarios/perfil', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.perfil = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        this.useToast().error('Error al obtener el perfil.');
      }
    },
    async fetchUsuarios() {
      try {
        const response = await axios.get('/admin/usuarios', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.usuarios = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.useToast().error('Error al obtener los usuarios.');
      }
    },
    mostrarFormulario(mostrar) {
      this.mostrarForm = mostrar;
      if (!mostrar) {
        this.resetUsuarioEditando();
      }
    },
    resetUsuarioEditando() {
      this.usuarioEditando = {
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
    async guardarUsuario() {
      try {
        if (this.usuarioEditando.id) {
          await axios.put(`/admin/usuarios/${this.usuarioEditando.id}`, this.usuarioEditando, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.useToast().success('Usuario actualizado exitosamente.');
        } else {
          await axios.post('/admin/usuarios', this.usuarioEditando, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.useToast().success('Usuario creado exitosamente.');
        }
        this.fetchUsuarios();
        this.mostrarFormulario(false);
      } catch (error) {
        console.error('Error saving user:', error);
        this.useToast().error('Error al guardar el usuario.');
      }
    },
    editarUsuario(usuario) {
      this.usuarioEditando = { ...usuario };
      this.mostrarFormulario(true);
    },
    async eliminarUsuario(id) {
      try {
        await axios.delete(`/admin/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.useToast().success('Usuario eliminado exitosamente.');
        this.fetchUsuarios();
      } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        this.useToast().error('Error al eliminar el usuario.');
      }
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap');

.user-profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2C3E50; /* Azul Medianoche */
  font-family: 'Montserrat', sans-serif;
}

.card {
  border: none;
  background-color: #f8f9fa; /* Fondo claro */
  margin-bottom: 1rem;
}

.card-body {
  padding: 1.5rem;
}

.profile-item {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-family: 'Open Sans', sans-serif;
  color: #34495E; /* Gris Oscuro */
}

.profile-item strong {
  color: #2C3E50; /* Azul Medianoche */
}

.btn-primary {
  background-color: #16A085; /* Verde */
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  margin-bottom: 20px;
}

.btn-primary:hover {
  background-color: #13856B; /* Verde Oscuro */
}

.btn-warning {
  background-color: #F39C12;
  color: #FFFFFF;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
}

.btn-danger {
  background-color: #E74C3C;
  color: #FFFFFF;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1rem;
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

.btn-success {
  background-color: #28A745;
  color: #FFFFFF;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6C757D;
  color: #FFFFFF;
}

.btn-secondary:hover {
  background-color: #5A6268;
}
</style>
