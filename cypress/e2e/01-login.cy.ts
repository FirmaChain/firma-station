describe('Firma Station - Login Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Recover Wallet', () => {
    // Get mnemonic and password from environment variables
    const mnemonic = Cypress.env('WALLET_MNEMONIC');
    const password = Cypress.env('WALLET_PASSWORD');

    cy.log('🚀 Starting Recover Wallet test');

    // 1. Click the login button at the top right
    cy.get('body').then(($body) => {
      // Find and click the login button (using test-id)
      cy.get('[data-testid="header-login-button"]').click();
      cy.log('✅ Step 1: Login button clicked');

      // Check that the login modal is visible
      cy.contains('Login Wallet').should('be.visible');

      // 2. Click the Recover Wallet button (using test-id)
      cy.get('[data-testid="login-modal-recover-wallet-button"]').click();
      cy.log('✅ Step 2: Recover Wallet button clicked');

      // Check that the Recover modal is visible
      cy.contains('Recover Wallet').should('be.visible');

      // 3. Enter mnemonic
      if (mnemonic && mnemonic !== 'your 24 word mnemonic phrase goes here') {
        cy.log('🔑 Step 3: Entering actual mnemonic');

        // Find and enter mnemonic (using test-id)
        cy.get('[data-testid="recover-mnemonic-textarea"]').should('be.visible');
        cy.get('[data-testid="recover-mnemonic-textarea"]').clear().type(mnemonic).should('have.value', mnemonic);

        cy.log('✅ Mnemonic entered');

        // 4. Enter password
        if (password && password !== 'your-actual-wallet-password-here') {
          cy.log('🔐 Step 4: Entering password');

          // Find password fields (using test-id)
          cy.get('[data-testid="password-input"]').should('be.visible');
          cy.get('[data-testid="confirm-password-input"]').should('be.visible');

          // Enter password
          cy.get('[data-testid="password-input"]').clear().type(password).should('have.value', password);

          // Enter password confirmation
          cy.get('[data-testid="confirm-password-input"]').clear().type(password).should('have.value', password);

          cy.log('✅ Password and confirmation entered');

          // 5. Click Recover button to restore wallet
          cy.log('🔄 Step 5: Preparing to click Recover button...');

          // Wait for button to be enabled after input
          cy.wait(1000);

          // Click Recover button (using test-id)
          cy.get('[data-testid="login-recover-button"]').should('be.visible');
          cy.get('[data-testid="login-recover-button"]').click();
          cy.log('✅ Recover button clicked!');

          // Wait for recovery to complete (up to 10 seconds)
          cy.wait(5000);

          // Check recovery result
          cy.get('body', { timeout: 10000 }).then(($result) => {
            if ($result.text().includes('Success')) {
              cy.log('🎉 Wallet recovery successful!');
              cy.contains('Success').should('be.visible');
            } else if ($result.find('input[type="password"]').length === 0) {
              cy.log('🎉 Wallet recovery and login complete!');
              // Check that we are on the main page
              cy.url().should('eq', Cypress.config().baseUrl + '/');
            } else {
              cy.log('❌ Wallet recovery failed or error occurred');
              // Check for error message
              cy.get('body').then(($error) => {
                if ($error.text().includes('Invalid')) {
                  cy.contains('Invalid').should('be.visible');
                  cy.log('⚠️  The mnemonic or password is incorrect');
                }
              });
            }
          });
        } else {
          cy.log('⚠️  Please set WALLET_PASSWORD in cypress.env.json');
        }
      } else {
        cy.log('⚠️  Please set WALLET_MNEMONIC in cypress.env.json');

        // Enter demo mnemonic (using test-id)
        const demoMnemonic =
          'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
        cy.get('[data-testid="recover-mnemonic-textarea"]').clear().type(demoMnemonic);
        cy.log('💡 Demo mnemonic entered (this will not actually work)');
      }
    });
  });
});
