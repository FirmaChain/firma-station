# Security Policy

Firma Station is a non-custodial wallet for the FirmaChain network. It handles
user mnemonics, private keys, and on-chain transactions, so we take security
reports seriously and ask researchers to follow the process below.

## Supported Versions

Security fixes are only backported to the latest minor release line. Older
versions are considered end-of-life — please upgrade.

| Version | Supported |
| ------- | --------- |
| 1.2.x   | ✅        |
| < 1.2   | ❌        |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security reports.**

Use one of these private channels:

1. **GitHub Private Vulnerability Reporting** (preferred):
   <https://github.com/FirmaChain/firma-station/security/advisories/new>
2. **Email**: `contact@firmachain.org`

Please include:

- A description of the issue and its potential impact
- Steps to reproduce or a proof-of-concept
- Affected version(s) and/or commit hash
- Suggested mitigation, if you have one
- Your contact information for follow-up

### What to expect

| Step                                 | Timeline                                      |
| ------------------------------------ | --------------------------------------------- |
| Acknowledgement of receipt           | within **2 business days**                    |
| Initial severity assessment          | within **7 days**                             |
| Fix release / coordinated disclosure | depends on severity; typically **30–90 days** |

We will keep you informed throughout the triage and remediation process, and
credit you in the published advisory if you wish.

## Scope

### In scope

- This repository (`FirmaChain/firma-station`) — the Firma Station web wallet
- Wallet flows: key generation, mnemonic / private key / Ledger recovery,
  transaction signing, fee/gas handling, broadcast
- Persistence and local state (keystore, Redux-persist)
- Build-time supply-chain issues that affect the published bundle
- Anything that can lead to loss of user funds, exposure of keys or mnemonics,
  transaction forgery, or unauthorized actions on behalf of a user

### Out of scope

- FirmaChain core node software — report to its own repository
- Third-party validators, RPC providers, or block explorers
- Social engineering of FirmaChain staff or users
- Issues affecting unsupported versions (see *Supported Versions*)
- Theoretical findings without a demonstrable impact path
- Best-practice / informational findings without a concrete vulnerability
  (style, performance, missing security headers on non-sensitive routes, etc.)

## Safe Harbor

Good-faith research that follows this policy is considered authorized.
We will not pursue or support legal action against researchers who:

- Make a reasonable effort to avoid privacy violations, service disruption,
  or data destruction
- Limit testing to accounts they own, or to dedicated test accounts
- Report the issue privately and allow us a reasonable window to remediate
  before any public disclosure
- Do not exploit the vulnerability beyond what is necessary to demonstrate it

## Coordinated Disclosure

Once a fix is released, we will publish a GitHub Security Advisory and request
a CVE where applicable. We follow coordinated disclosure: please do not
publicly disclose details until a fix is available and users have had a
reasonable window to upgrade.

Thank you for helping keep Firma Station and its users safe.
