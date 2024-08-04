describe('Vista de Planificación Académica', () => {
  it('Debería navegar a la pagina del perfil y verificar datos despues de consultar la API', () => {
    cy.visit('/login'); // Visitar la página de inicio de sesión
    cy.get('#email').type('lucas@gmail.com'); // Rellenar el correo
    cy.get('#password').type('1234'); // Rellenar la contraseña
    cy.get('#btn_send').click(); // Hacer clic en el botón de iniciar sesión


    cy.url().should('include', '/dashboard'); // Verificar que la URL cambió a /dashboard
    cy.get('.nav-link').contains('Usuarios').click(); // Navegar a la vista de Perfil

    // Verificar que ya hay data despues de ser obtenida de la API
    cy.get('#nameLabel').invoke('text').should('not.be.empty');
  });
});