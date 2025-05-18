describe('Integration Graph UI', () => {
  it('should load and display components list', () => {
    cy.visit('/');
    cy.get('input[placeholder="Rechercher..."]').should('exist');
  });
});
