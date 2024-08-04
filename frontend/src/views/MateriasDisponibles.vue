<template>
  <div class="container-fluid my-5">
    <h1 class="mb-4 text-center">Materias Disponibles</h1>
    <div class="button-group mb-3">
      <button v-if="isProfessorOrAdmin" class="btn btn-success" @click="toggleFormulario">
        {{ isEditing ? 'Editar Materia' : 'Agregar Materia' }}
      </button>
      <button class="btn btn-primary" @click="goToDashboard">Volver al Dashboard</button>
    </div>
    
    <div v-if="mostrarFormulario" class="mt-4">
      <h2>{{ isEditing ? 'Editar Materia' : 'Agregar Materia' }}</h2>
      <form @submit.prevent="isEditing ? actualizarMateria() : crearMateria()">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="nuevaMateria.nombre" required class="form-control">
        </div>
        <div class="form-group">
          <label for="codigo_matricula">Código de Matrícula:</label>
          <input type="text" v-model="nuevaMateria.codigo_matricula" required class="form-control">
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <textarea v-model="nuevaMateria.descripcion" required class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label for="profesor_id">Profesor:</label>
          <select v-model="nuevaMateria.profesor_id" required class="form-control">
            <option v-for="profesor in profesores" :value="profesor.profesor_id" :key="profesor.profesor_id">
              {{ profesor.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="dia">Día:</label>
          <select v-model="nuevoHorario.dia" required class="form-control">
            <option>Lunes</option>
            <option>Martes</option>
            <option>Miércoles</option>
            <option>Jueves</option>
            <option>Viernes</option>
            <option>Sábado</option>
            <option>Domingo</option>
          </select>
        </div>
        <div class="form-group">
          <label for="hora_inicio">Hora Inicio:</label>
          <input type="time" v-model="nuevoHorario.hora_inicio" required class="form-control">
        </div>
        <div class="form-group">
          <label for="hora_fin">Hora Fin:</label>
          <input type="time" v-model="nuevoHorario.hora_fin" required class="form-control">
        </div>
        <button type="submit" class="btn btn-success">{{ isEditing ? 'Actualizar Materia' : 'Agregar Materia' }}</button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancelar</button>
      </form>
    </div>

    <table class="materias-table mx-auto mt-4" v-if="materias.length">
      <thead>
        <tr>
          <th>Materia</th>
          <th>Código de Matrícula</th>
          <th v-if="!isProfessor">Profesor</th>
          <th>Día</th>
          <th>Hora Inicio</th>
          <th>Hora Fin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="materia in materias" :key="materia.id">
          <td>{{ materia.nombre }}</td>
          <td>{{ materia.codigo_matricula }}</td>
          <td v-if="!isProfessor">{{ materia.profesor_nombre }}</td>
          <td>{{ materia.dia }}</td>
          <td>{{ materia.hora_inicio }}</td>
          <td>{{ materia.hora_fin }}</td>
          <td>
            <button v-if="isStudent" :disabled="materia.inscrita" class="btn btn-primary" @click="inscribirMateria(materia)">Inscribir</button>
            <button v-if="isProfessorOrAdmin" class="btn btn-secondary" @click="prepareEditarMateria(materia)">Editar</button>
            <button v-if="isProfessorOrAdmin" class="btn btn-danger" @click="eliminarMateria(materia.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '../axios';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      materias: [],
      nuevaMateria: {
        nombre: '',
        codigo_matricula: '',
        descripcion: '',
        profesor_id: null
      },
      nuevoHorario: {
        dia: '',
        hora_inicio: '',
        hora_fin: ''
      },
      profesores: [],
      isEditing: false,
      editingMateriaId: null,
      mostrarFormulario: false
    };
  },
  computed: {
    isStudent() {
      return localStorage.getItem('role') === 'estudiante';
    },
    isProfessorOrAdmin() {
      const role = localStorage.getItem('role');
      return role === 'profesor' || role === 'administrador';
    },
    isProfessor() {
      return localStorage.getItem('role') === 'profesor';
    }
  },
  created() {
    this.fetchMateriasDisponibles();
    this.fetchProfesores();
  },
  methods: {
    toggleFormulario() {
      this.mostrarFormulario = !this.mostrarFormulario;
      if (!this.mostrarFormulario) {
        this.resetForm();
      }
    },
    async fetchMateriasDisponibles() {
      const toast = useToast();
      try {
        const response = await axios.get('/materias', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.materias = response.data.map(materia => ({
          ...materia,
          inscrita: false
        }));
      } catch (error) {
        toast.error('Error al obtener las materias disponibles');
      }
    },
    async fetchProfesores() {
      const toast = useToast();
      try {
        const response = await axios.get('/usuarios/profesores', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.profesores = response.data;
      } catch (error) {
        toast.error('Error al obtener los profesores');
      }
    },
    async inscribirMateria(materia) {
      const toast = useToast();
      try {
        await axios.post('/usuarios/inscribir-materia', { materia_id: materia.id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Inscripción exitosa');
        materia.inscrita = true;
      } catch (error) {
        toast.error('Error al inscribirse en la materia');
      }
    },
    async crearMateria() {
      const toast = useToast();
      try {
        if (!this.nuevaMateria.profesor_id) {
          toast.error('Por favor, selecciona un profesor válido.');
          return;
        }
        await axios.post('/materias', {
          materia: this.nuevaMateria,
          horario: this.nuevoHorario
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Materia y horario creados exitosamente');
        this.resetForm();
        this.fetchMateriasDisponibles();
      } catch (error) {
        toast.error('Error al crear la materia');
      }
    },
    async actualizarMateria() {
      const toast = useToast();
      try {
        if (!this.nuevaMateria.profesor_id) {
          toast.error('Por favor, selecciona un profesor válido.');
          return;
        }
        await axios.put(`/materias/${this.editingMateriaId}`, {
          materia: this.nuevaMateria,
          horario: this.nuevoHorario
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Materia actualizada exitosamente');
        this.resetForm();
        this.fetchMateriasDisponibles();
      } catch (error) {
        toast.error('Error al actualizar la materia');
      }
    },
    async eliminarMateria(materiaId) {
      const toast = useToast();
      try {
        await axios.delete(`/materias/${materiaId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Materia eliminada exitosamente');
        this.fetchMateriasDisponibles();
      } catch (error) {
        toast.error('Error al eliminar la materia');
      }
    },
    prepareEditarMateria(materia) {
      this.nuevaMateria = { ...materia };
      this.nuevoHorario = {
        dia: materia.dia,
        hora_inicio: materia.hora_inicio,
        hora_fin: materia.hora_fin
      };
      this.editingMateriaId = materia.id;
      this.isEditing = true;
      this.mostrarFormulario = true;
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.nuevaMateria = { nombre: '', codigo_matricula: '', descripcion: '', profesor_id: null };
      this.nuevoHorario = { dia: '', hora_inicio: '', hora_fin: '' };
      this.isEditing = false;
      this.editingMateriaId = null;
      this.mostrarFormulario = false;
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.container-fluid {
  max-width: 100%;
  padding: 20px;
  background-color: #ECF0F1;
  border-radius: 8px;
}

h1 {
  font-size: 32px;
  margin-bottom: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  color: #2C3E50;
}

.materias-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.materias-table th,
.materias-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.materias-table th {
  background-color: #34495E;
  color: white;
  text-align: center;
}

.materias-table td {
  background-color: #FFFFFF;
  text-align: center;
}

.materias-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.materias-table tr:hover {
  background-color: #ddd;
}

.btn-primary {
  background-color: #16A085;
  color: #FFFFFF;
}

.btn-success {
  background-color: #27ae60;
  color: #FFFFFF;
}

.btn-secondary {
  background-color: #34495E;
  color: #FFFFFF;
}

.btn-danger {
  background-color: #E74C3C;
  color: #FFFFFF;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-family: 'Open Sans', sans-serif;
  color: #34495E;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #BDC3C7;
  border-radius: 4px;
}

button[type="submit"] {
  background-color: #16A085;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #13856B;
}

button[type="button"] {
  background-color: #ECF0F1;
  color: #34495E;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button[type="button"]:hover {
  background-color: #BDC3C7;
}

@media (max-width: 768px) {
  .materias-table, .list-group {
    width: 100%;
  }
}
</style>
