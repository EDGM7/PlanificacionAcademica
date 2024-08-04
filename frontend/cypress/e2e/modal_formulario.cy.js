describe('Completar un formulario y enviar sus datos', () => {
    it('Debería llenar el formulario de login y luego asegurarse de estar en el dashboard', () => {
      cy.visit('/login'); // Visitar la página de inicio de sesión
      cy.get('#email').type('lucas@gmail.com'); // Rellenar el correo
      cy.get('#password').type('1234'); // Rellenar la contraseña
      cy.get('#btn_send').click(); // Hacer clic en el botón de iniciar sesión
  
      cy.url().should('include', '/dashboard'); // Verificar que la URL cambió a /dashboard
      cy.get('#title-page').contains('Bienvenido al Dashboard'); // Navegar a la vista de planificación
    });
});