describe('Integration Graph UI', () => {
    it('should load and display components list', () => {
        cy.visit('/');
        cy.get('input[placeholder="Search a component..."]').should('exist');
        cy.contains('button', "Load").click();
        cy.wait(100);
        cy.screenshot();
        cy.get('[id="menu"]').children('div[class="dropdown-content"]').children('a').eq(0).click({force: true});
        cy.screenshot();
        cy.get('[id="menu"]').children('div[class="dropdown-content"]').children('a').eq(1).click({force: true});
        cy.screenshot();
        cy.get('[id="menu"]').children('div[class="dropdown-content"]').children('a').eq(2).click({force: true});
        cy.screenshot();
        cy.get('[id="menu"]').children('div[class="dropdown-content"]').children('a').eq(3).click({force: true});
        cy.screenshot();
        cy.get('[id="menu"]').children('div[class="dropdown-content"]').children('a').eq(4).click({force: true});
        cy.screenshot();
    });
});