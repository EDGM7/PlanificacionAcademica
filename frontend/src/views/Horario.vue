<template>
  <div class="container-fluid my-5">
    <h1 class="mb-4 text-center">Horario</h1>
    <div class="button-group mb-3">
      <button class="btn btn-secondary" @click="exportHorario">Exportar Horario</button>
      <button v-if="isAdminOrProfessor" class="btn btn-secondary" @click="generateReport('inscripciones')">Exportar Reporte de Inscripciones</button>
      <button v-if="isAdminOrProfessor" class="btn btn-secondary" @click="generateReport('uso')">Exportar Reporte de Uso</button> 
      <button class="btn btn-primary" @click="goToDashboard">Volver al Dashboard</button>
    </div>
    <table class="materias-table mx-auto">
      <thead>
        <tr>
          <th>Materia</th>
          <th>Día</th>
          <th>Hora Inicio</th>
          <th>Hora Fin</th>
          <th v-if="!isProfessor">Fecha de Inscripción</th>
          <th>Profesor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clase in horario" :key="clase.horario_id">
          <td>{{ clase.materia_nombre }}</td>
          <td>{{ clase.dia }}</td>
          <td>{{ clase.hora_inicio }}</td>
          <td>{{ clase.hora_fin }}</td>
          <td v-if="!isProfessor">{{ formatFecha(clase.fecha_inscripcion) }}</td>
          <td>{{ clase.profesor_nombre }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from '../axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'UserSchedule',
  data() {
    return {
      horario: [],
      role: localStorage.getItem('role') || 'estudiante',
      errorMessage: ''
    };
  },
  computed: {
    isAdminOrProfessor() {
      const role = localStorage.getItem('role');
      return role === 'administrador' || role === 'profesor';
    },
    isProfessor() {
      return localStorage.getItem('role') === 'profesor';
    }
  },
  created() {
    this.fetchHorario();
  },
  methods: {
    async fetchHorario() {
      const toast = useToast();
      try {
        const endpoint = '/usuarios/horario';
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.horario = response.data.map(clase => ({
          horario_id: clase.horario_id,
          materia_id: clase.materia_id,
          materia_nombre: clase.materia_nombre,
          dia: clase.dia || 'N/A',
          hora_inicio: clase.hora_inicio || 'N/A',
          hora_fin: clase.hora_fin || 'N/A',
          fecha_inscripcion: clase.fecha_inscripcion || 'N/A',
          profesor_nombre: clase.profesor_nombre || 'N/A'
        }));
      } catch (error) {
        this.errorMessage = 'Error al cargar el horario. Inténtalo de nuevo más tarde.';
        toast.error('Error al cargar el horario. Inténtalo de nuevo más tarde.');
      }
    },
    formatFecha(fecha) {
      if (!fecha || fecha === 'N/A') return 'N/A';
      const date = new Date(fecha);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    },
    async exportHorario() {
      const toast = useToast();
      try {
        const response = await axios.post('/reports/generate-report', { reportType: 'horario' }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `horario-report.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Horario exportado exitosamente');
      } catch (error) {
        toast.error('Error al exportar el horario');
      }
    },

    async generateReport(reportType) {
      const toast = useToast();
      try {
        const response = await axios.post('/reports/generate-report', { reportType }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType}-report.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Reporte de ${reportType} exportado exitosamente`);
      } catch (error) {
        console.error('Error al exportar el reporte:', error); // Log para diagnóstico
        toast.error('Error al exportar el reporte');
      }
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

.btn-secondary {
  background-color: #34495E;
  color: #FFFFFF;
}

.btn-secondary:hover {
  background-color: #2C3E50;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

@media (max-width: 768px) {
  .materias-table {
    width: 100%;
  }
}
</style>
