  <template>
    <div class="d-flex">
      <!-- Sidebar -->
      <div class="sidebar bg-dark p-3">
        <h3 class="text-center text-white">Sistema Académico</h3>
        <ul class="nav flex-column">
          <li class="nav-item" v-if="role === 'administrador'">
            <router-link class="nav-link" to="/perfil">
              <i class="bi bi-people"></i> Usuarios
            </router-link>
            <router-link class="nav-link" to="/horario">
              <i class="bi bi-clock"></i> Horario
            </router-link>
            <router-link class="nav-link" to="/planificacion">
              <i class="bi bi-calendar"></i> Planificación y Cronograma
            </router-link>
            <router-link class="nav-link" to="/materias-disponibles">
              <i class="bi bi-book"></i> Materias
            </router-link>
          </li>
          <li class="nav-item" v-if="role === 'profesor'">
            <router-link class="nav-link" to="/perfil">
              <i class="bi bi-people"></i> Usuarios
            </router-link>
            <router-link class="nav-link" to="/materias-disponibles">
              <i class="bi bi-book"></i> Materias
            </router-link>
            <router-link class="nav-link" to="/horario">
              <i class="bi bi-clock"></i> Horario
            </router-link>
            <router-link class="nav-link" to="/planificacion">
              <i class="bi bi-calendar"></i> Planificación y Cronograma
            </router-link>
          </li>
          <li class="nav-item" v-if="role === 'estudiante'">
            <router-link class="nav-link" to="/perfil">
              <i class="bi bi-people"></i> Usuarios
            </router-link>
            <router-link class="nav-link" to="/horario">
              <i class="bi bi-clock"></i> Horario
            </router-link>
            <router-link class="nav-link" to="/materias-disponibles">
              <i class="bi bi-book"></i> Materias
            </router-link>
          </li>
          <li class="nav-item mt-3">
            <button class="nav-link btn btn-link" @click="cerrarSesion">
              <i class="bi bi-box-arrow-right"></i> Salir
            </button>
          </li>
        </ul>
      </div>

      <!-- Main content -->
      <div class="content flex-grow-1 p-3">
        <h1 class="mb-4 text-center" id="title-page">Bienvenido al Dashboard</h1>

        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="card" v-if="role === 'administrador'">
            <div class="card-body">
              <h5 class="card-title">Usuarios Registrados</h5>
              <p class="card-text">{{ usersCount }}</p>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Materias Disponibles</h5>
              <p class="card-text">{{ subjectsCount }}</p>
            </div>
          </div>
          <div class="card" v-if="role === 'estudiante'">
            <div class="card-body">
              <h5 class="card-title">Materias Inscritas</h5>
              <div v-for="(clase, index) in nextClass" :key="index" class="my-2">
                <p class="card-text">
                  Materia: {{ clase.materia_nombre }}<br>
                  Profesor: {{ clase.profesor_nombre }}<br>
                  Día: {{ clase.dia }}<br>
                  Hora: {{ formatTime(clase.hora_inicio) }} - {{ formatTime(clase.hora_fin) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar for Professor -->
        <div v-if="role === 'profesor'" class="calendar-container mt-4" id="calendar-container">
          <vue-cal :events="events" @event-click="handleEventClick" :hide-header="false" default-view="week" :disable="{'6': true, '0': true}" :locale="calendarLocale" />
        </div>

        <router-view></router-view>
      </div>
    </div>
  </template>

  <script>
  import axios from '../axios';
  import { useToast } from 'vue-toastification';
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';

  export default {
    name: 'DashboardPage',
    components: {
      VueCal
    },
    data() {
      return {
        usersCount: 0,
        subjectsCount: 0,
        nextClass: [],
        events: [],
        calendarLocale: {
          weekdays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          years: 'Años',
          year: 'Año',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          today: 'Hoy',
          noEvent: 'No hay eventos',
          allDay: 'Todo el día',
          deleteEvent: 'Eliminar',
          createEvent: 'Crear un evento',
          dateFormat: 'dddd D MMMM YYYY'
        }
      };
    },
    computed: {
      role() {
        return localStorage.getItem('role');
      }
    },
    created() {
      this.fetchDashboardData();
      if (this.role === 'profesor') {
        this.fetchProfessorData();
      }
    },
    methods: {
      
      async cerrarSesion() {
      const toast = useToast();
      try {
        await axios.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        toast.error('Error al cerrar sesión');
      }
    },

      async fetchDashboardData() {
        const toast = useToast();
        try {
          if (this.role === 'administrador') {
            const usersResponse = await axios.get('/users/count', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            this.usersCount = usersResponse.data.count;
          }

          const subjectsResponse = await axios.get('/subjects/count', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.subjectsCount = subjectsResponse.data.count;

          if (this.role === 'estudiante') {
            const nextClassResponse = await axios.get('/classes/next', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            this.nextClass = nextClassResponse.data.nextClass || [];
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast.error('Error al cargar los datos del dashboard');
        }
      },
      async fetchProfessorData() {
        const toast = useToast();
        try {
          const [materiasResponse, planificacionResponse] = await Promise.all([
            axios.get('/profesores/materias', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }),
            axios.get('/profesores/planificacion', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            })
          ]);

          const materiasEvents = materiasResponse.data.map(materia => {
            if (!materia.dia || !materia.hora_inicio || !materia.hora_fin) {
              return null;
            }
            const startDate = this.createDateWithTime(materia.dia, materia.hora_inicio);
            const endDate = this.createDateWithTime(materia.dia, materia.hora_fin);

            return {
              id: materia.id,
              title: `Materia: ${materia.nombre}`,
              start: startDate,
              end: endDate,
              description: materia.descripcion
            };
          }).filter(event => event !== null);

          const planificacionEvents = planificacionResponse.data.map(plan => {
            if (!plan.fecha) {
              return null;
            }
            const startDate = new Date(plan.fecha);
            const endDate = new Date(plan.fecha);
            endDate.setHours(endDate.getHours() + 1); // Agregar 1 hora por defecto

            return {
              id: plan.id,
              title: `Planificación: ${plan.actividad}`,
              start: startDate,
              end: endDate,
              description: plan.descripcion
            };
          }).filter(event => event !== null);

          this.events = [...materiasEvents, ...planificacionEvents];
        } catch (error) {
          console.error('Error fetching professor events:', error);
          toast.error('Error al cargar las actividades del profesor');
        }
      },
      createDateWithTime(day, time) {
        if (!time) {
          return new Date(); // o alguna fecha por defecto
        }
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes, seconds || 0, 0);
        return date;
      },
      formatTime(time) {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
      },
      handleEventClick(event) {
        console.log('Event clicked:', event);
      }
    }
  }
  </script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap');

  .d-flex {
    display: flex;
  }

  .sidebar {
    width: 250px;
    background-color: #2C3E50; /* Azul Medianoche */
    color: #fff;
    height: 100vh;
    padding-top: 1em;
  }

  .sidebar h3 {
    color: #fff;
    font-family: 'Montserrat', sans-serif;
  }

  .content {
    flex-grow: 1;
    padding: 2em;
    background-color: #ECF0F1; /* Gris Claro */
    overflow-y: auto;
  }

  .nav-link {
    color: #adb5bd;
    margin-bottom: 0.5em;
    display: flex;
    align-items: center;
    padding: 0.5em 1em;
    text-decoration: none;
    font-family: 'Open Sans', sans-serif;
  }

  .nav-link i {
    margin-right: 0.5em;
  }

  .nav-link:hover {
    background-color: #495057; /* Gris Oscuro */
    border-radius: 0.25em;
    color: #fff;
  }

  .nav-link.router-link-active {
    background-color: #495057; /* Gris Oscuro */
    border-radius: 0.25em;
    color: #fff;
  }

  h1 {
    color: #2C3E50; /* Azul Medianoche */
    font-family: 'Montserrat', sans-serif;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
  }

  .summary-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    margin-bottom: 2em;
    justify-content: center;
  }

  .card {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    padding: 1em;
    background-color: #FFFFFF;
    border-radius: 0.25em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .card-body {
    padding: 1em;
  }

  .card-title {
    font-family: 'Montserrat', sans-serif;
    color: #2C3E50; /* Azul Medianoche */
  }

  .card-text {
    font-family: 'Open Sans', sans-serif;
    color: #34495E; /* Gris Oscuro */
    font-size: 18px;
    font-weight: bold;
  }

  .calendar-container {
    margin-top: 2em;
    background-color: #FFFFFF;
    border-radius: 0.25em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1em;
  }
  </style>
