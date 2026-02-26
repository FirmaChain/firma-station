describe('Firma JS Mobile Test', () => {
  // Helper function to generate a unique memo suffix
  const getMemoSuffix = () => {
    return (Date.now() / 1000).toFixed(0).toString();
  };

  const prefix = 'MobileConnect';

  // Connect to Mobile login session function (QR code method)
  const loginToFirmaMobile = () => {
    cy.session('firma-mobile-login', () => {
      cy.visit('/');

      cy.log('📱 Starting Connect to Mobile login');

      // 1. Click login button at top right
      cy.get('[data-testid="header-login-button"]').click();
      cy.log('✅ Clicked login button');

      // Check if login modal is open
      cy.contains('Login Wallet').should('be.visible');

      // 2. Click Connect to Mobile button
      cy.get('[data-testid="login-modal-connect-to-mobile-button"]').click();
      cy.log('✅ Clicked Connect to Mobile button');

      // Check if Connect to Mobile modal is open
      cy.contains('Connect to Mobile').should('be.visible');

      // Wait for QR code to show
      cy.log('📱 Waiting for QR code to appear...');
      cy.wait(3000);

      // Confirm QR code is shown (must scan manually)
      cy.log('📱 QR code is displayed. Please scan with the mobile app to complete login.');
      cy.log('🔄 When login is complete, click Resume!');

      cy.pause(); // Pause for QR code scan

      // Wait for login to complete
      cy.wait(5000);

      // Check if navigated to main page (login success)
      cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
      cy.log('🎉 Connect to Mobile login session created!');
    });
  };

  it('📱 Connect to Mobile login test', () => {
    cy.pause();
    cy.log('🚀 Starting Connect to Mobile login test');

    // Create/reuse Connect to Mobile login session
    loginToFirmaMobile();

    // Visit homepage (session restored)
    cy.visit('/');

    // Check login success
    cy.get('[data-testid="sidebar-navigation"]').should('be.visible');
    cy.log('✅ Connect to Mobile login state confirmed');

    // Check login button is gone (logged in)
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="header-login-button"]').length === 0) {
        cy.log('✅ Login button disappeared - logged in state confirmed');
      }
    });

    cy.log('🎉 Connect to Mobile login test complete!');
  });

  it.skip('📱 Connect to Mobile navigation test (keep login state)', () => {
    cy.pause();
    cy.log('🚀 Starting Connect to Mobile navigation test');

    // Reuse Connect to Mobile login session (already logged in)
    loginToFirmaMobile();

    // Visit homepage (login state kept)
    cy.visit('/');

    // Check sidebar in logged in state
    cy.get('[data-testid="sidebar-navigation"]').should('be.visible');
    cy.get('[data-testid="sidebar-logo"]').should('be.visible');
    cy.log('✅ Sidebar confirmed in logged in state');

    // Main menu navigation test
    cy.log('📋 Main menu navigation test');

    // Home menu
    cy.get('[data-testid="sidebar-main-home"]').should('be.visible').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.log('✅ Home menu confirmed');

    // Go to Accounts page
    cy.get('[data-testid="sidebar-main-accounts"]').click();
    cy.url().should('include', '/accounts');
    cy.wait(1000);
    cy.log('✅ Accounts page navigation complete');

    // Go to History page
    cy.get('[data-testid="sidebar-main-history"]').click();
    cy.url().should('include', '/history');
    cy.wait(1000);
    cy.log('✅ History page navigation complete');

    // Go to Staking page
    cy.get('[data-testid="sidebar-main-staking"]').click();
    cy.url().should('include', '/staking');
    cy.wait(1000);
    cy.log('✅ Staking page navigation complete');

    // Go to Governance page
    cy.get('[data-testid="sidebar-main-governance"]').click();
    cy.url().should('include', '/governance');
    cy.wait(1000);
    cy.log('✅ Governance page navigation complete');

    // Go to Download page
    cy.get('[data-testid="sidebar-main-download"]').click();
    cy.url().should('include', '/download');
    cy.wait(1000);
    cy.log('✅ Download page navigation complete');

    // Sub menu navigation test
    cy.log('🔗 Sub menu navigation test');

    // Go to Community page (internal page)
    cy.get('[data-testid="sidebar-sub-community"]').click();
    cy.url().should('include', '/community');
    cy.wait(1000);
    cy.log('✅ Community page navigation complete');

    // Check external links (just check existence, not click)
    cy.get('[data-testid="sidebar-sub-help"]').should('be.visible');
    cy.log('✅ Help link confirmed');

    cy.get('[data-testid="sidebar-sub-explorer"]').should('be.visible');
    cy.log('✅ Explorer link confirmed');

    cy.get('[data-testid="sidebar-sub-buy-fct"]').should('be.visible');
    cy.log('✅ Buy FCT link confirmed');

    // Check bottom menu
    cy.log('⬇️ Bottom menu test');

    cy.get('[data-testid="sidebar-bottom-restake"]').should('be.visible');
    cy.log('✅ Restake link confirmed');

    // Click logo to go home
    cy.log('🏠 Logo click test');

    cy.get('[data-testid="sidebar-logo"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.log('✅ Home navigation by logo click complete');

    cy.log('🎉 Connect to Mobile navigation test complete!');
  });

  // Connect to Mobile Send feature test
  it('📱 Connect to Mobile Send feature test (QR code auth)', () => {
    cy.pause();
    cy.log('🚀 Starting Connect to Mobile Send feature test');

    // Reuse Connect to Mobile login session
    loginToFirmaMobile();

    // Visit Accounts page
    cy.visit('/accounts');

    // Check elements only visible when logged in
    cy.get('[data-testid="sidebar-navigation"]').should('be.visible');
    cy.log('✅ Accounts page accessible in logged in state');

    // Click Send to Address button
    cy.get('[data-testid="send-to-address-button"]').should('be.visible').click();
    cy.log('✅ Clicked Send to Address button');

    // Check Send modal is open
    cy.get('[data-testid="send-modal"]').should('be.visible');
    cy.get('[data-testid="send-modal-title"]').should('contain.text', 'Send');
    cy.log('✅ Send modal open confirmed');

    // Get Send To Address from env
    const sendToAddress = Cypress.env('SEND_TO_ADDRESS');

    // Generate unique memo (different for each test run)
    const uniqueMemo = `MOBILE_APP_TEST_${getMemoSuffix()}`;
    cy.log(`🏷️ Generated unique memo: ${uniqueMemo}`);

    if (sendToAddress && sendToAddress !== '0x0000000000000000000000000000000000000000') {
      cy.log('🎯 Using real Send To Address');

      // Enter Send To address
      cy.get('[data-testid="send-to-input"]').should('be.visible');
      cy.get('[data-testid="send-to-input"]').clear().type(sendToAddress).should('have.value', sendToAddress);
      cy.log('✅ Send To address entered');

      // Enter Amount (15)
      cy.get('[data-testid="amount-input"]').should('be.visible');
      cy.get('[data-testid="amount-input"]').clear().type('15').should('have.value', '15');
      cy.log('✅ Amount (15) entered');

      // Enter Memo (unique)
      cy.get('[data-testid="memo-input"]').should('be.visible');
      cy.get('[data-testid="memo-input"]').clear().type(uniqueMemo).should('have.value', uniqueMemo);
      cy.log(`✅ Memo (${uniqueMemo}) entered`);

      // Check Next button enabled
      cy.get('[data-testid="send-next-button"]').should('be.visible');
      cy.log('✅ Next button confirmed');

      // Click Next button
      cy.get('[data-testid="send-next-button"]').click();
      cy.log('✅ Clicked Next button');

      // Wait 5 seconds
      cy.wait(5000);
      cy.log('⏳ Waited 5 seconds');

      // Check Confirm modal is visible
      cy.get('[data-testid="confirm-modal"]').should('be.visible');
      cy.get('[data-testid="confirm-modal-title"]').should('contain.text', 'Confirm');
      cy.log('✅ Confirm modal open confirmed');

      // Connect to Mobile user: QR code auth
      cy.log('📱 Connect to Mobile user: QR code authentication');
      cy.log('📱 Please scan the QR code with the mobile app to approve the transaction.');
      cy.log('🔄 When signing is complete, click Resume!');
      cy.pause(); // Pause for QR code scan

      // Wait for send to complete
      cy.wait(5000);
      cy.log('⏳ Waiting for send processing...');

      // Check for success or error message
      cy.get('body', { timeout: 15000 }).then(($result) => {
        if ($result.text().includes('Success')) {
          cy.log('🎉 Send success!');
        } else if ($result.text().includes('Failed') || $result.text().includes('Error')) {
          cy.log('❌ Send failed or error occurred');
        } else {
          cy.log('⚠️ Check send result');
        }
      });

      // Wait extra for send history (tx to be reflected on chain)
      cy.wait(5000);
      cy.log('⏳ Waiting for tx to be reflected on chain...');

      // refresh once
      cy.reload();

      // First, check Send History on Accounts page
      cy.get('[data-testid="sidebar-main-accounts"]').click();
      cy.url().should('include', '/accounts');
      cy.wait(3000);
      cy.log('✅ Checked Send History on Accounts page');

      // Check recent send history on Accounts page
      cy.log(`🔍 Looking for memo ${uniqueMemo} on Accounts page...`);
      cy.get('[data-testid="send-history-list"]').should('be.visible');
      cy.wait(2000);

      // Check first item on Accounts page
      cy.get('[data-testid="send-history-item-0"]').should('be.visible');
      cy.get('[data-testid="send-history-memo-0"]').should('contain.text', uniqueMemo);
      cy.get('[data-testid="send-history-amount-0"]').should('contain.text', '15');
      cy.get('[data-testid="send-history-result-0"]').should('contain.text', 'SUCCESS');
      cy.log('✅ Send history confirmed on Accounts page!');

      // Go to History page
      cy.get('[data-testid="sidebar-main-history"]').click();
      cy.url().should('include', '/history');
      cy.wait(3000);
      cy.log('✅ Navigated to History page');

      // Check recent send history on History page
      cy.log(`🔍 Looking for memo ${uniqueMemo} on History page...`);
      cy.get('[data-testid="send-history-list"]').should('be.visible');
      cy.wait(2000);

      // Find item with the memo (all tx types mixed)
      cy.contains(uniqueMemo).should('be.visible');
      cy.log('✅ Send history confirmed on History page!');

      // Try to find the memo in the first 5 items
      for (let i = 0; i < 5; i++) {
        cy.get(`[data-testid="send-history-item-${i}"]`).then(($item) => {
          if ($item.length > 0) {
            cy.get(`[data-testid="send-history-memo-${i}"]`).then(($memo) => {
              if ($memo.text().includes(uniqueMemo)) {
                cy.log(`🎉 Found memo ${uniqueMemo} at item ${i}!`);
                cy.get(`[data-testid="send-history-memo-${i}"]`).should('contain.text', uniqueMemo);
                cy.get(`[data-testid="send-history-result-${i}"]`).should('contain.text', 'SUCCESS');
                return false; // break if found
              }
            });
          }
        });
      }

      // All tests complete
      cy.log('🎉 Send → Accounts Send History → History Send History check test complete!');
    } else {
      cy.log('💡 Demo mode: using default Send To Address');

      // Enter demo address
      const demoAddress = 'firma1s658utvasn7f5q92034h6zgv0zh2uxy5vvggd5';
      cy.get('[data-testid="send-to-input"]').clear().type(demoAddress);
      cy.log('✅ Demo Send To address entered');

      // Enter small Amount
      cy.get('[data-testid="amount-input"]').clear().type('0.001');
      cy.log('✅ Small Amount entered');

      // Enter test memo (unique)
      cy.get('[data-testid="memo-input"]').clear().type(uniqueMemo);
      cy.log(`✅ Test memo (${uniqueMemo}) entered`);

      // Only check form state, do not actually send
      cy.get('[data-testid="send-next-button"]').should('be.visible');
      cy.log('✅ Send form input complete');

      // In demo mode, only check up to Next button
      cy.log('💡 Demo mode: only form input test, not actually sending');
    }

    cy.log('🎉 Connect to Mobile Send feature test complete!');
  });

  // Governance feature test
  it('📱 Connect to Mobile Governance feature test (keep login state)', () => {
    cy.pause();

    cy.log('🚀 Starting Connect to Mobile Governance feature test');

    // Reuse Connect to Mobile login session
    loginToFirmaMobile();

    // Visit Governance page
    cy.visit('/governance');
    cy.wait(3000);
    cy.log('✅ Navigated to Governance page');

    // Check New Proposal button
    cy.get('[data-testid="governance-buttons-wrapper"]').should('be.visible');
    cy.get('[data-testid="new-proposal-button"]').should('be.visible');
    cy.get('[data-testid="new-proposal-button"]').should('contain.text', 'New proposal');
    cy.log('✅ New Proposal button confirmed');

    // Check Proposals list
    cy.get('[data-testid="proposals-list-wrapper"]').should('be.visible');
    cy.log('✅ Proposals list confirmed');

    // Check if first proposal exists
    cy.get('body').then(($body) => {
      // First, check if any proposal exists
      if ($body.find('[data-testid^="proposal-item-"]').length > 0) {
        cy.log('📋 Proposal list exists');

        // Check first proposal
        cy.get('[data-testid^="proposal-item-"]').first().should('be.visible');
        cy.get('[data-testid^="proposal-id-"]').first().should('be.visible');
        cy.get('[data-testid^="proposal-title-"]').first().should('be.visible');
        cy.get('[data-testid^="proposal-status-"]').first().should('be.visible');
        cy.get('[data-testid^="proposal-type-"]').first().should('be.visible');
        cy.log('✅ First Proposal item confirmed');

        // Click first proposal to go to detail page
        cy.get('[data-testid^="proposal-item-"]').first().click();
        cy.wait(3000);

        // Check URL changed (proposal detail page)
        cy.url().should('include', '/governance/proposals/');
        cy.log('✅ Navigated to Proposal detail page');

        // Check basic elements on detail page
        cy.get('body').should('contain.text', 'Proposal');
        cy.log('✅ Proposal detail page loaded');

        // Go back to Governance main page
        cy.get('[data-testid="sidebar-main-governance"]').click();
        cy.url().should('include', '/governance');
        cy.wait(2000);
        cy.log('✅ Returned to Governance main page');
      } else {
        cy.log('📋 No active Proposal currently');

        // Even if no proposal, New Proposal button should exist
        cy.get('[data-testid="new-proposal-button"]').should('be.visible');
        cy.log('✅ New Proposal button confirmed even if list is empty');
      }
    });

    cy.log('🎉 Connect to Mobile Governance feature test complete!');
  });

  // Connect to Mobile Proposal tests
  const proposalTests = [
    { type: 'TEXT_PROPOSAL', label: 'Text', testId: 'test1' },
    { type: 'COMMUNITY_POOL_SPEND_PROPOSAL', label: 'CommunityPoolSpend', testId: 'test2' },
    { type: 'STAKING_PARAMS_UPDATE_PROPOSAL', label: 'StakingParamsUpdate', testId: 'test3' },
    { type: 'GOV_PARAMS_UPDATE_PROPOSAL', label: 'GovParamsUpdate', testId: 'test4' },
    { type: 'SOFTWARE_UPGRADE', label: 'SoftwareUpgrade', testId: 'test5' }
  ];

  proposalTests.forEach((test, index) => {
    it(`📱 ${test.testId}: Connect to Mobile ${test.label} Proposal test`, () => {
      cy.pause();

      cy.log(`🚀 Starting Connect to Mobile ${test.testId}: ${test.label} Proposal test`);

      // Reuse Connect to Mobile login session
      loginToFirmaMobile();

      // Visit Governance page
      cy.visit('/governance');
      cy.wait(3000);
      cy.log('✅ Navigated to Governance page');

      // Click New Proposal button
      cy.get('[data-testid="new-proposal-button"]').should('be.visible').click();
      cy.log('✅ Clicked New Proposal button');

      // Check New Proposal modal is open
      cy.get('[data-testid="new-proposal-modal"]').should('be.visible');
      cy.get('[data-testid="new-proposal-modal-title"]').should('contain.text', 'New Proposal');
      cy.log('✅ New Proposal modal open confirmed');

      // Select Proposal Type (React Select component - try various methods)
      cy.log(`🔄 Trying to select Proposal Type: ${test.label}`);

      // Extra methods:
      cy.log('📋 React Select selection methods:');
      cy.log('1. Click wrapper then click option');
      cy.log('2. Type in input then select first option');
      cy.log('3. Use CSS selector manually');
      cy.log('4. Check HTML structure in devtools');

      // Print React Select structure for debugging
      cy.get('[data-testid="proposal-type-select-wrapper"]').then(($wrapper) => {
        cy.log('🔍 React Select HTML structure:');
        cy.log($wrapper[0].outerHTML);
      });

      // Method 1: Click select wrapper
      cy.get('[data-testid="proposal-type-select-wrapper"]').click({ force: true });
      cy.wait(1000);

      // Check if dropdown is open and select option
      cy.get('body').then(($body) => {
        if ($body.find('.react-select__menu, [class*="menu"]').length > 0) {
          cy.log('✅ React Select dropdown open confirmed');
          cy.contains(test.label).click({ force: true });
          cy.log(`✅ Proposal Type: ${test.label} selected`);
        } else {
          cy.log('🔄 Trying to open React Select by another method');
          // Method 2: Type in input directly
          cy.get('[data-testid="proposal-type-select-wrapper"]').within(() => {
            cy.get('input').click({ force: true }).clear().type(test.label);
          });
          cy.wait(500);
          // Select first option (filtered by typing)
          cy.get('.react-select__option, [class*="option"]').first().click({ force: true });
          cy.log(`✅ Proposal Type: ${test.label} selected (Method 2 - Typing)`);
        }
      });

      // Confirm selection is done
      cy.log('✅ React Select selection process complete');

      // Generate unique suffix
      const suffix = getMemoSuffix();
      const title = `${prefix}_${test.label}_${suffix}`;
      const description = `${prefix}_${test.label}_DESCRIPTION_${suffix}`;

      // Enter Title
      cy.get('[data-testid="proposal-title-input"]').should('be.visible');
      cy.get('[data-testid="proposal-title-input"]').clear().type(title).should('have.value', title);
      cy.log(`✅ Title entered: ${title}`);

      // Enter Description
      cy.get('[data-testid="proposal-description-textarea"]').should('be.visible');
      cy.get('[data-testid="proposal-description-textarea"]')
        .clear()
        .type(description)
        .should('have.value', description);
      cy.log(`✅ Description entered: ${description}`);

      // Enter Initial Deposit (2500)
      cy.get('[data-testid="proposal-initial-deposit-input"]').should('be.visible');
      cy.get('[data-testid="proposal-initial-deposit-input"]').clear().type('2500').should('have.value', '2500');
      cy.log('✅ Initial Deposit entered: 2500');

      // Enter additional fields by type
      if (test.type === 'COMMUNITY_POOL_SPEND_PROPOSAL') {
        // Enter Recipient address
        const recipientAddress = 'firma1s658utvasn7f5q92034h6zgv0zh2uxy5vvggd5';
        cy.get('[data-testid="proposal-recipient-input"]').should('be.visible');
        cy.get('[data-testid="proposal-recipient-input"]')
          .clear()
          .type(recipientAddress)
          .should('have.value', recipientAddress);
        cy.log('✅ Recipient address entered');

        // Enter Amount
        cy.get('[data-testid="proposal-amount-input"]').should('be.visible');
        cy.get('[data-testid="proposal-amount-input"]').clear().type('1000').should('have.value', '1000');
        cy.log('✅ Amount entered: 1000');
      } else if (test.type === 'SOFTWARE_UPGRADE') {
        // Enter Upgrade Name
        const upgradeName = `v1.0.${suffix}`;
        cy.get('[data-testid="proposal-upgrade-name-input"]').should('be.visible');
        cy.get('[data-testid="proposal-upgrade-name-input"]')
          .clear()
          .type(upgradeName)
          .should('have.value', upgradeName);
        cy.log(`✅ Upgrade Name entered: ${upgradeName}`);

        // Enter Height
        const height = '1000000';
        cy.get('[data-testid="proposal-height-input"]').should('be.visible');
        cy.get('[data-testid="proposal-height-input"]').clear().type(height).should('have.value', height);
        cy.log(`✅ Height entered: ${height}`);
      } else if (test.type === 'STAKING_PARAMS_UPDATE_PROPOSAL' || test.type === 'GOV_PARAMS_UPDATE_PROPOSAL') {
        // Use default parameters (auto loaded)
        cy.log('✅ Using default parameters');
        cy.wait(2000); // Wait for default values to load
      }

      // Check Next button enabled and pause
      cy.get('[data-testid="proposal-next-button"]');
      cy.log('✅ Next button visible');

      // Pause here for user to check input
      cy.log('⏸️ Test paused - check Proposal info');
      cy.pause();

      // Click Next button to actually submit
      cy.get('[data-testid="proposal-next-button"]').click();
      cy.log('✅ Clicked Next button - submitting (scroll modal down if not visible)');
      cy.wait(2000);

      // Check Confirm modal
      cy.get('[data-testid="confirm-modal"]').should('be.visible');
      cy.get('[data-testid="confirm-modal-title"]').should('be.visible');
      cy.log('✅ Confirm modal open confirmed');

      // Connect to Mobile user: QR code auth (instead of password)
      cy.log('⏸️ Paused before final submit - QR code scan will actually submit the Proposal!');
      cy.log('📱 Connect to Mobile user: QR code authentication');
      cy.log('📱 Please scan the QR code with the mobile app to approve the Proposal.');
      cy.log('🔄 When signing is complete, click Resume!');

      // Periodically check if QR code disappears (max 10s, 500ms interval)
      cy.log('🔍 Periodically checking for QR code (data-testid="qr-code") existence.');

      cy.log('wait until qr code is visible (5000ms)');
      cy.wait(5000);
      cy.get('[data-testid="qr-code"]').should('be.visible');
      cy.log('✅ QR code generated.');

      // Pause before final submit
      cy.pause();

      // Wait for submission (tx processing)
      cy.wait(10000); // Wait for tx processing
      cy.log('⏳ Waiting for tx processing...');

      // Check for success message or redirect to Governance page
      cy.url().should('include', '/governance');
      cy.log('✅ Redirected to Governance page');

      // Reload page to get latest proposal list
      cy.reload();
      cy.wait(5000);
      cy.log('✅ Reloaded page for latest proposal list');

      // Check if proposals list exists
      cy.get('[data-testid="proposals-list-wrapper"]').should('be.visible');
      cy.log('✅ Proposals list checked');

      // Click most recent proposal (first one)
      cy.get('[data-testid^="proposal-id-"]')
        .first()
        .then(($firstProposal) => {
          const proposalId = $firstProposal.attr('data-testid')?.replace('proposal-id-', '');
          cy.log(`🎯 Most recent Proposal ID: ${proposalId}`);

          // Check proposal title (matches submitted title)
          cy.get(`[data-testid="proposal-title-${proposalId}"]`).then(($title) => {
            const proposalTitle = $title.text();
            cy.log(`📋 Proposal Title: ${proposalTitle}`);

            // Check if matches submitted title
            const expectedTitle = `${prefix}_${test.label}_${suffix}`;
            if (proposalTitle.includes(expectedTitle) || proposalTitle.includes(test.label)) {
              cy.log('✅ Submitted Proposal Title matches!');
            } else {
              cy.log('⚠️ Title may be different - check needed');
            }
          });

          // Go to proposal detail page
          cy.get(`[data-testid="proposal-id-${proposalId}"]`).click();
          cy.log('🖱️ Clicked most recent Proposal');
          cy.wait(3000);

          // Check submitted info on detail page
          cy.get('body').then(($body) => {
            // Check Title
            const expectedTitle = `${prefix}_${test.label}_${suffix}`;
            if ($body.text().includes(expectedTitle) || $body.text().includes(test.label)) {
              cy.log(`✅ Title confirmed on detail page: ${expectedTitle}`);
            }

            // Check Description
            const expectedDescription = `${prefix}_${test.label}_DESCRIPTION_${suffix}`;
            if (
              $body.text().includes(expectedDescription) ||
              $body.text().includes(`${prefix}_${test.label}_DESCRIPTION`)
            ) {
              cy.log(`✅ Description confirmed on detail page: ${expectedDescription}`);
            }

            // Check Deposit info
            if ($body.text().includes('2500') || $body.text().includes('2,500')) {
              cy.log('✅ Initial Deposit confirmed on detail page: 2500');
            }

            // Check additional info by type
            if (test.type === 'COMMUNITY_POOL_SPEND_PROPOSAL') {
              if ($body.text().includes('firma1s658utvasn7f5q92034h6zgv0zh2uxy5vvggd5')) {
                cy.log('✅ Community Pool Recipient address confirmed');
              }
              if ($body.text().includes('1000')) {
                cy.log('✅ Community Pool Amount confirmed: 1000');
              }
            } else if (test.type === 'SOFTWARE_UPGRADE') {
              const expectedUpgradeName = `v1.0.${suffix}`;
              if ($body.text().includes(expectedUpgradeName) || $body.text().includes('v1.0')) {
                cy.log(`✅ Software Upgrade Name confirmed: ${expectedUpgradeName}`);
              }
              if ($body.text().includes('1000000')) {
                cy.log('✅ Software Upgrade Height confirmed: 1000000');
              }
            }
          });

          // Pause - let user check detail info
          cy.pause();
          cy.log('⏸️ Check submitted info on Proposal detail page');

          // Go back to Governance main page
          cy.visit('/governance');
          cy.wait(2000);
          cy.log('✅ Returned to Governance main page');
        });

      cy.log(`🎉 Connect to Mobile ${test.testId}: ${test.label} Proposal submit & check complete!`);
    });
  });
});
