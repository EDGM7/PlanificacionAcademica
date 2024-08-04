describe('Vista de Planificación Académica', () => {
    it('Al iniciar sesion como Profesor se debe ver el calendario', () => {
      cy.visit('/login'); // Visitar la página de inicio de sesión
      cy.get('#email').type('lucas@gmail.com'); // Rellenar el correo
      cy.get('#password').type('1234'); // Rellenar la contraseña
      cy.get('#btn_send').click(); // Hacer clic en el botón de iniciar sesión
  

      cy.url().should('include', '/dashboard'); // Verificar que la URL cambió a /dashboard
      cy.get('#calendar-container').should("be.visible");
  });
  it('Al iniciar sesion con un rol difernete a Profesor NO se debe ver el calendario', () => {
    cy.visit('/login'); // Visitar la página de inicio de sesión
    cy.get('#email').type('rober@gmail.com'); // Rellenar el correo
    cy.get('#password').type('1234'); // Rellenar la contraseña
    cy.get('#btn_send').click(); // Hacer clic en el botón de iniciar sesión


    cy.url().should('include', '/dashboard'); // Verificar que la URL cambió a /dashboard
    cy.get('#calendar-container').should('not.exist');
});
  });