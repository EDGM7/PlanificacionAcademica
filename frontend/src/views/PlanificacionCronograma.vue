<template>
  <div class="container my-5">
    <h1 class="mb-4 text-center">Planificación y Cronograma</h1>
    <div class="button-group mb-3">
      <button class="btn btn-primary" @click="goToDashboard">Volver al Dashboard</button>
    </div>
    <form @submit.prevent="isEditing ? actualizarPlanificacion() : guardarPlanificacion()" class="mb-4">
      <div class="mb-3">
        <label for="actividad" class="form-label">Actividad</label>
        <input type="text" class="form-control input-campo" id="actividad" v-model="actividad" required>
      </div>
      <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción</label>
        <textarea class="form-control input-campo" id="descripcion" v-model="descripcion" required></textarea>
      </div>
      <div class="mb-3">
        <label for="fecha" class="form-label">Fecha</label>
        <input type="date" class="form-control input-campo" id="fecha" v-model="fecha" required>
      </div>
      <div class="mb-3">
        <label for="profesor" class="form-label">Profesor</label>
        <select class="form-control input-campo" id="profesor" v-model="profesor_id" required>
          <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
            {{ profesor.nombre }}
          </option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary w-100">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
    </form>

    <h2 class="mt-5 mb-4 text-center">Actividades Planificadas</h2>
    <ul class="list-group">
      <li v-for="plan in planificacion" :key="plan.id" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">{{ plan.actividad }}</h5>
          <p class="mb-1">{{ plan.descripcion }}</p>
          <small class="text-muted">{{ formatFecha(plan.fecha) }}</small>
          <p class="mb-1"><strong>Profesor:</strong> {{ plan.profesor_nombre }}</p>
        </div>
        <div>
          <button class="btn btn-secondary btn-sm me-2" @click="editarPlanificacion(plan)">Editar</button>
          <button class="btn btn-danger btn-sm" @click="eliminarPlanificacion(plan.id)">Eliminar</button>
        </div>
      </li>
    </ul>

    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      actividad: '',
      descripcion: '',
      fecha: '',
      profesor_id: '',
      profesores: [],
      planificacion: [],
      errorMessage: '',
      isEditing: false,
      editingPlanId: null
    };
  },
  created() {
    this.fetchProfesores();
  },
  methods: {
    async fetchPlanificacion() {
      try {
        const response = await axios.get('/profesores/planificacion', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.planificacion = response.data;
      } catch (error) {
        console.error('Error fetching plan:', error);
        this.errorMessage = 'Error al cargar las actividades planificadas.';
      }
    },
    async fetchProfesores() {
      try {
        const response = await axios.get('/usuarios/profesores', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.profesores = response.data;
        this.fetchPlanificacion(); // Llamar de nuevo para actualizar los nombres de los profesores
      } catch (error) {
        console.error('Error fetching professors:', error);
        this.errorMessage = 'Error al cargar los profesores.';
      }
    },
    async guardarPlanificacion() {
      try {
        const nuevaActividad = {
          actividad: this.actividad,
          descripcion: this.descripcion,
          fecha: this.fecha,
          profesor_id: this.profesor_id
        };
        await axios.post('/profesores/planificacion', nuevaActividad, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        await this.fetchPlanificacion();
        this.resetForm();
      } catch (error) {
        console.error('Error saving plan:', error);
        this.errorMessage = 'Error al guardar la actividad. Inténtalo de nuevo.';
      }
    },
    async actualizarPlanificacion() {
      try {
        const actividadActualizada = {
          actividad: this.actividad,
          descripcion: this.descripcion,
          fecha: this.fecha,
          profesor_id: this.profesor_id
        };
        await axios.put(`/profesores/planificacion/${this.editingPlanId}`, actividadActualizada, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        await this.fetchPlanificacion();
        this.resetForm();
      } catch (error) {
        console.error('Error updating plan:', error);
        this.errorMessage = 'Error al actualizar la actividad. Inténtalo de nuevo.';
      }
    },
    async eliminarPlanificacion(planId) {
      try {
        await axios.delete(`/profesores/planificacion/${planId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        await this.fetchPlanificacion();
      } catch (error) {
        console.error('Error deleting plan:', error);
        this.errorMessage = 'Error al eliminar la actividad. Inténtalo de nuevo.';
      }
    },
    editarPlanificacion(plan) {
      this.actividad = plan.actividad;
      this.descripcion = plan.descripcion;
      this.fecha = plan.fecha;
      this.profesor_id = plan.profesor_id;
      this.isEditing = true;
      this.editingPlanId = plan.id;
    },
    resetForm() {
      this.actividad = '';
      this.descripcion = '';
      this.fecha = '';
      this.profesor_id = '';
      this.isEditing = false;
      this.editingPlanId = null;
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    formatFecha(fecha) {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 32px; /* Título Principal */
  margin-bottom: 1.5rem;
  color: #2C3E50; /* Azul Medianoche */
  font-family: 'Montserrat', sans-serif;
}

form .form-label {
  font-weight: bold;
  color: #34495E; /* Gris Oscuro */
  font-family: 'Open Sans', sans-serif;
}

form .form-control {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-family: 'Open Sans', sans-serif;
}

form .btn {
  padding: 0.75rem;
  font-size: 1rem;
  font-family: 'Open Sans', sans-serif;
  background-color: #16A085; /* Turquesa Oscuro */
  color: #FFFFFF;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #FFFFFF;
  border: 1px solid #ced4da;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif;
}

.list-group-item h5 {
  margin: 0;
  font-size: 1.25rem;
  color: #2C3E50; /* Azul Medianoche */
}

.list-group-item p {
  margin: 0.25rem 0;
  font-size: 1rem;
  color: #34495E; /* Gris Oscuro */
  font-family: 'Open Sans', sans-serif;
}

.list-group-item small {
  color: #6c757d;
  font-family: 'Open Sans', sans-serif;
}

.alert {
  margin-top: 1rem;
  background-color: #E74C3C; /* Rojo Intenso */
  color: #FFFFFF;
  font-family: 'Open Sans', sans-serif;
}
.input-campo {
  width: 200px !important; 
  margin-left: 1rem;
}

.mb-3 {
  display: flex;
  justify-content: center;
  margin: auto;
  gap: 2rem;
}
</style>
