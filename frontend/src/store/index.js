import { createStore } from 'vuex';

const store = createStore({
  state: {
    role: localStorage.getItem('role') || '',
  },
  getters: {
    isStudent: state => state.role === 'estudiante',
    isProfessorOrAdmin: state => state.role === 'profesor' || state.role === 'administrador',
  },
  mutations: {
    setRole(state, role) {
      state.role = role;
      localStorage.setItem('role', role);
    },
  },
  actions: {
    updateRole({ commit }, role) {
      commit('setRole', role);
    },
  },
});

export default store;
