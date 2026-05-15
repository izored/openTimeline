import mysql from "mysql2/promise";

const DATABASE_URL = "mysql://245vtjY41jPk3RQ.root:k4hJ5sSVseJoFUhUZrbSXaRKwuxn7XNe@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19e1cc99-7202-8334-8000-091339302a4a";

async function seed() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // ─── Insert Actors ──────────────────────────────────────────
  await conn.execute(`INSERT INTO actors (name, role) VALUES
    ('Pierre Martin', 'Lawyer'), ('Crédit du Nord', 'Creditor'), ('Jean Dubois', 'Huissier'),
    ('Sophie Bernard', 'Accountant'), ('LocalSoft HR', 'Recruiter'), ('Marc Petit', 'Hiring Manager'),
    ('Marie Chen', 'CTO'), ('Thomas Leroy', 'Engineering Lead'), ('URSSAF', 'Government Agency'),
    ('BNP Paribas', 'Creditor'), ('TechCorp HR', 'Recruiter'), ('David Moreau', 'Tech Lead'),
    ('Claire Lefebvre', 'Notaire'), ('Crédit Mutuel', 'Creditor'), ('Médiateur Lambert', 'Mediator'),
    ('Société Générale', 'Creditor'), ('Tribunal de Commerce', 'Court'), ('Jean Petit', 'HR Manager'),
    ('StartupXYZ', 'Employer'), ('Client Alpha', 'Client'), ('Client Beta', 'Client'),
    ('Client Gamma', 'Client'), ('Client Delta', 'Client'), ('Lucas Girard', 'Subcontractor'),
    ('ING Bank', 'Bank'), ('Self', 'Candidate')`);
  console.log("Actors seeded");

  // ─── Insert Subjects ────────────────────────────────────────
  await conn.execute(`INSERT INTO subjects (slug, name, category, description, status) VALUES
    ('creditor-a', 'Creditor A - Credit du Nord', 'debt', 'Business loan dispute with Credit du Nord. Initial claim €47,000, settled at 60% over 24 months.', 'pending'),
    ('creditor-b', 'Creditor B - Societe Generale', 'debt', 'Credit line dispute with Societe Generale. Claim €18,700, court-approved settlement at 55% over 20 months.', 'resolved'),
    ('creditor-c', 'Creditor C - BNP Paribas', 'debt', 'Credit line dispute with BNP Paribas. Claim €23,500, settled at 65% over 18 months.', 'resolved'),
    ('creditor-d', 'Creditor D - Credit Mutuel', 'debt', 'Loan dispute with Credit Mutuel. Claim €31,000, mediated settlement at 70% over 30 months.', 'resolved'),
    ('bv', 'BV Consulting Business', 'bv', 'Personal consulting BV established May 2023. Provides technical consulting, cloud architecture, and training services.', 'open'),
    ('job', 'Employment Journey', 'job', 'Career progression from unemployed to Lead Engineer at StartupXYZ.', 'resolved'),
    ('legal', 'Legal Proceedings', 'legal', 'All legal actions related to debt recovery, court proceedings, and settlement negotiations.', 'resolved'),
    ('personal', 'Personal Finance Recovery', 'personal', 'Personal financial recovery journey including budgeting, savings, credit repair, and investment.', 'resolved'),
    ('admin', 'Administrative Compliance', 'admin', 'Tax filings, social security, insurance, and other administrative tasks.', 'resolved')`);
  console.log("Subjects seeded");

  // ─── Insert Events ──────────────────────────────────────────
  const eventValues = [
    ["ev-2022-01","Initial consultation with debt lawyer","legal",2022,"2022-01-10","2022-01-10",0,"resolved","First meeting with Maitre Pierre Martin to assess the overall debt situation.",'[{"label":"Consultation Notes","filename":"consultation_2022_01_10.pdf"},{"label":"Action Plan","filename":"action_plan_q1_2022.pdf"}]','["ev-2022-02","ev-2022-04"]'],
    ["ev-2022-02","Creditor A files formal claim","debt",2022,"2022-03-03","2022-03-03",0,"resolved","Creditor A (Credit du Nord) files a formal claim for €47,000 in outstanding business loans.",'[{"label":"Formal Claim Letter","filename":"claim_credit_nord_2022.pdf"}]','["ev-2022-01","ev-2023-01"]'],
    ["ev-2022-03","Appointment with huissier for asset evaluation","legal",2022,"2022-04-18","2022-04-18",0,"resolved","Bailiff evaluates personal and business assets to determine seizure exposure.",'[{"label":"Asset Evaluation Report","filename":"asset_eval_apr_2022.pdf"}]','["ev-2022-01"]'],
    ["ev-2022-04","Debt inventory and prioritization meeting","debt",2022,"2022-05-12","2022-05-12",0,"resolved","Comprehensive review of all outstanding debts totaling €127,000 across five creditors.",'[{"label":"Debt Inventory","filename":"debt_inventory_may_2022.xlsx"}]','["ev-2022-01","ev-2022-02"]'],
    ["ev-2022-05","Personal CV update and skills assessment","personal",2022,"2022-06-01","2022-06-15",0,"resolved","Updated CV with recent project experience and completed online skills assessment.",'[{"label":"Updated CV","filename":"cv_2022_v3.pdf"}]','["ev-2022-06"]'],
    ["ev-2022-06","First job application - Developer at LocalSoft","job",2022,"2022-07-10","2022-08-05",0,"blocked","Applied for Mid-Level Developer position at LocalSoft. Offer withdrawn due to restructuring.",'[{"label":"Application Email","filename":"application_localsoft.pdf"}]','["ev-2022-05","ev-2022-07"]'],
    ["ev-2022-07","Networking event - Tech Community Meetup","personal",2022,"2022-08-20","2022-08-20",0,"resolved","Attended local tech meetup and made three valuable connections in the startup ecosystem.",'[{"label":"Contact List","filename":"networking_aug_2022.txt"}]','["ev-2022-06"]'],
    ["ev-2022-08","Quarterly tax filing - Q2 2022","admin",2022,"2022-09-15","2022-09-15",0,"resolved","Filed quarterly VAT and income tax returns for Q2 2022.",'[{"label":"Q2 Tax Filing","filename":"tax_q2_2022.pdf"}]','["ev-2022-09"]'],
    ["ev-2022-09","Social security contributions catch-up plan","admin",2022,"2022-10-01","2022-12-31",0,"resolved","Negotiated a 6-month catch-up plan for overdue social security contributions. Total arrears: €4,800.",'[{"label":"Payment Plan Agreement","filename":"urssaf_plan_oct_2022.pdf"}]','["ev-2022-08"]'],
    ["ev-2022-10","Creditor C sends formal notice","debt",2022,"2022-11-08","2022-11-08",0,"resolved","Creditor C (BNP Paribas) sends formal notice for €23,500 outstanding credit line.",'[{"label":"Formal Notice","filename":"notice_bnp_nov_2022.pdf"}]','["ev-2022-04","ev-2023-04"]'],
    ["ev-2022-11","Insurance policy review and adjustments","admin",2022,"2022-12-01","2022-12-10",0,"resolved","Reviewed all insurance policies to reduce costs. Annual savings: €1,200.",'[{"label":"Insurance Review","filename":"insurance_review_2022.xlsx"}]','[]'],
    ["ev-2022-12","Year-end financial review","admin",2022,"2022-12-28","2022-12-28",0,"resolved","Comprehensive year-end financial review with accountant. Total debt reduced by 8%.",'[{"label":"Year-End Report","filename":"yearend_2022.pdf"}]','["ev-2022-04"]'],
    ["ev-2023-01","Negotiation meeting with Creditor A","debt",2023,"2023-02-08","2023-02-08",0,"resolved","Three-hour negotiation. Agreed on a 60% settlement over 24 months with suspended interest.",'[{"label":"Settlement Agreement","filename":"settlement_credit_nord_feb_2023.pdf"},{"label":"Payment Schedule","filename":"payment_plan_creditor_a.pdf"}]','["ev-2022-02","ev-2023-02"]'],
    ["ev-2023-02","First payment to Creditor A under new plan","debt",2023,"2023-03-01","2023-03-01",0,"resolved","First monthly payment of €1,175 sent to Creditor A under the negotiated settlement plan.",'[{"label":"Payment Receipt","filename":"payment_mar_2023.pdf"}]','["ev-2023-01"]'],
    ["ev-2023-03","Job application - Senior Developer at TechCorp","job",2023,"2023-03-15","2023-04-20",0,"resolved","Submitted application for Senior Full-Stack Developer position at TechCorp. Offer received: €68K.",'[{"label":"Application","filename":"application_techcorp.pdf"},{"label":"Offer Letter","filename":"offer_techcorp_apr_2023.pdf"}]','["ev-2023-05"]'],
    ["ev-2023-04","Negotiation with Creditor C (BNP Paribas)","debt",2023,"2023-04-12","2023-05-30",0,"resolved","Extended negotiation process with BNP Paribas. Final agreement at 65% settlement over 18 months.",'[{"label":"Settlement Agreement","filename":"settlement_bnp_may_2023.pdf"}]','["ev-2022-10","ev-2023-10"]'],
    ["ev-2023-05","Accepted position at TechCorp","job",2023,"2023-05-01","2023-05-01",0,"resolved","Signed employment contract with TechCorp. Start date: June 1, 2023. Salary: €68K + benefits.",'[{"label":"Employment Contract","filename":"contract_techcorp_may_2023.pdf"}]','["ev-2023-03"]'],
    ["ev-2023-06","BV incorporation paperwork filed","bv",2023,"2023-05-22","2023-06-15",0,"resolved","Filed articles of incorporation for the new consulting BV. BV officially registered on June 15.",'[{"label":"Articles of Incorporation","filename":"bv_articles_may_2023.pdf"},{"label":"Chamber Certificate","filename":"kvk_certificate_jun_2023.pdf"}]','["ev-2023-07"]'],
    ["ev-2023-07","BV bank account opened","bv",2023,"2023-06-20","2023-06-20",0,"resolved","Opened business bank account for the BV at ING.",'[{"label":"Account Confirmation","filename":"bank_account_ing_jun_2023.pdf"}]','["ev-2023-06"]'],
    ["ev-2023-08","Creditor D informal negotiation attempt","debt",2023,"2023-07-15","2023-08-30",0,"blocked","Attempted informal negotiation with Creditor D. They refused any settlement below 90%.",'[{"label":"Negotiation Notes","filename":"negotiation_credit_mutuel_aug_2023.pdf"}]','["ev-2023-13"]'],
    ["ev-2023-09","Personal budget restructuring","personal",2023,"2023-08-01","2023-08-15",0,"resolved","Complete overhaul of personal budget. Cut discretionary spending by 40%.",'[{"label":"Budget Plan","filename":"budget_restructure_aug_2023.xlsx"}]','["ev-2023-05"]'],
    ["ev-2023-10","First payment to Creditor C under settlement","debt",2023,"2023-09-01","2023-09-01",0,"resolved","First monthly payment of €848 to BNP Paribas under the May settlement agreement.",'[{"label":"Payment Receipt","filename":"payment_sep_2023_bnp.pdf"}]','["ev-2023-04"]'],
    ["ev-2023-11","First BV client pitch","bv",2023,"2023-09-20","2023-10-05",0,"resolved","Prepared and delivered first client pitch for BV consulting services.",'[{"label":"Pitch Deck","filename":"pitch_deck_alpha_sep_2023.pdf"},{"label":"Proposal","filename":"proposal_alpha_oct_2023.pdf"}]','["ev-2023-12"]'],
    ["ev-2023-12","BV first consulting contract signed","bv",2023,"2023-10-10","2023-10-10",0,"resolved","Signed first BV consulting contract with Client Alpha. Fee: €6,500. Delivery: 6 weeks.",'[{"label":"Contract","filename":"contract_alpha_oct_2023.pdf"}]','["ev-2023-11"]'],
    ["ev-2023-13","Court summons from Creditor D","legal",2023,"2023-10-25","2023-10-25",0,"resolved","Received court summons from Credit Mutuel for €31,000 claim. Court date set for January 2024.",'[{"label":"Court Summons","filename":"summons_credit_mutuel_oct_2023.pdf"}]','["ev-2023-08"]'],
    ["ev-2023-14","Technical certification - AWS Solutions Architect","job",2023,"2023-11-01","2023-11-20",0,"resolved","Completed and passed AWS Solutions Architect Professional certification. Exam score: 87%.",'[{"label":"Certificate","filename":"aws_cert_nov_2023.pdf"}]','["ev-2023-03"]'],
    ["ev-2023-15","Quarterly tax filing - Q3 2023","admin",2023,"2023-11-15","2023-11-15",0,"resolved","Filed Q3 2023 tax returns including new BV income.",'[{"label":"Q3 Tax Filing","filename":"tax_q3_2023.pdf"}]','["ev-2023-06"]'],
    ["ev-2023-16","Debt repayment progress review","debt",2023,"2023-12-10","2023-12-10",0,"resolved","Year-end review of debt repayment progress. Total debt reduced from €127,000 to €98,000.",'[{"label":"Debt Progress Report","filename":"debt_progress_dec_2023.pdf"}]','["ev-2022-12"]'],
    ["ev-2023-17","BV service offerings finalized","bv",2023,"2023-12-15","2023-12-20",0,"resolved","Finalized BV service offerings: technical consulting, cloud architecture, team training, and code review.",'[{"label":"Service Catalog","filename":"services_bv_dec_2023.pdf"}]','["ev-2023-12"]'],
    ["ev-2023-18","Year-end financial review 2023","admin",2023,"2023-12-28","2023-12-28",0,"resolved","Comprehensive year-end review. Total debt reduced by 23%. BV generated €8,500 in first-quarter revenue.",'[{"label":"Year-End Report 2023","filename":"yearend_2023.pdf"}]','["ev-2023-16"]'],
    ["ev-2024-01","Creditor B escalates to court proceedings","legal",2024,"2024-01-08",null,1,"open","Creditor B (Societe Generale) rejects settlement proposal and files for a titre executoire.",'[{"label":"Court Filing","filename":"filing_sg_jan_2024.pdf"}]','["ev-2024-15"]'],
    ["ev-2024-02","Technical interview at StartupXYZ","job",2024,"2024-02-20","2024-03-01",0,"resolved","Completed three-round interview process at StartupXYZ for Lead Engineer role. Offer: €72K.",'[{"label":"Offer Letter","filename":"offer_startupxyz_mar_2024.pdf"}]','["ev-2024-03"]'],
    ["ev-2024-03","Job transition to StartupXYZ","job",2024,"2024-04-01","2024-04-01",0,"resolved","Left TechCorp, joined StartupXYZ as Lead Engineer. Salary increase: €4K. Equity package: 0.15%.",'[{"label":"New Contract","filename":"contract_startupxyz_apr_2024.pdf"},{"label":"Resignation Letter","filename":"resignation_techcorp.pdf"}]','["ev-2024-02"]'],
    ["ev-2024-04","BV first invoice issued to Client Alpha","bv",2024,"2024-04-03","2024-04-17",0,"resolved","First consulting engagement invoice: €8,500 for strategy project delivered to Client Alpha.",'[{"label":"Invoice #001","filename":"invoice_001_alpha_apr_2024.pdf"},{"label":"Payment Receipt","filename":"payment_alpha_apr_2024.pdf"}]','["ev-2023-12"]'],
    ["ev-2024-05","Court hearing - Creditor D case","legal",2024,"2024-01-25","2024-01-25",0,"resolved","First court hearing for Credit Mutuel case. Judge encouraged mediation. 30-day mediation period granted.",'[{"label":"Hearing Notes","filename":"hearing_jan_2024.pdf"}]','["ev-2023-13"]'],
    ["ev-2024-06","Mediation session with Creditor D","legal",2024,"2024-02-20","2024-03-15",0,"resolved","Court-appointed mediation with Credit Mutuel. Agreement: 70% settlement over 30 months. Monthly: €724.",'[{"label":"Mediation Agreement","filename":"mediation_credit_mutuel_mar_2024.pdf"}]','["ev-2024-05"]'],
    ["ev-2024-07","BV client acquisition - Client Beta","bv",2024,"2024-03-20","2024-04-05",0,"resolved","Acquired second BV client through referral from Client Alpha. Contract value: €12,000 over 3 months.",'[{"label":"Contract","filename":"contract_beta_apr_2024.pdf"}]','["ev-2024-04"]'],
    ["ev-2024-08","Personal emergency fund target reached","personal",2024,"2024-04-15","2024-04-15",0,"resolved","Emergency fund reached target of €5,000. Provides 2-month expense buffer.",'[{"label":"Account Statement","filename":"emergency_fund_apr_2024.pdf"}]','["ev-2023-09"]'],
    ["ev-2024-09","Quarterly tax filing - Q1 2024","admin",2024,"2024-04-20","2024-04-20",0,"resolved","Filed Q1 2024 taxes. BV revenue: €20,500. Personal salary: €18,000.",'[{"label":"Q1 Tax Filing","filename":"tax_q1_2024.pdf"}]','["ev-2024-04","ev-2024-07"]'],
    ["ev-2024-10","Debt consolidation analysis","debt",2024,"2024-05-10","2024-05-25",0,"resolved","Analyzed debt consolidation options with accountant. Decision: keep separate plans for flexibility.",'[{"label":"Consolidation Analysis","filename":"consolidation_analysis_may_2024.xlsx"}]','["ev-2023-16"]'],
    ["ev-2024-11","BV website launch","bv",2024,"2024-05-15","2024-05-15",0,"resolved","Launched BV website with service descriptions, case studies, and contact form. Cost: €1,200.",'[{"label":"Website Screenshot","filename":"website_launch_may_2024.png"}]','["ev-2023-17"]'],
    ["ev-2024-12","Job performance review at StartupXYZ","job",2024,"2024-06-15","2024-06-15",0,"resolved","Six-month performance review. Team productivity increased 25% under new leadership.",'[{"label":"Performance Review","filename":"review_startupxyz_jun_2024.pdf"}]','["ev-2024-03"]'],
    ["ev-2024-13","Court date - Creditor B hearing","legal",2024,"2024-06-20","2024-06-20",0,"pending","Court hearing for Societe Generale case. Judge requested additional financial documentation.",'[{"label":"Hearing Notes","filename":"hearing_sg_jun_2024.pdf"}]','["ev-2024-01"]'],
    ["ev-2024-14","BV networking event attendance","bv",2024,"2024-07-10","2024-07-10",0,"resolved","Attended industry conference and collected 15 qualified leads for BV services.",'[{"label":"Lead List","filename":"leads_conference_jul_2024.xlsx"}]','["ev-2024-11"]'],
    ["ev-2024-15","Second court hearing - Creditor B","legal",2024,"2024-09-15","2024-09-15",0,"resolved","Court approved 55% settlement over 20 months. Monthly payment: €514. Victory.",'[{"label":"Court Ruling","filename":"ruling_sg_sep_2024.pdf"}]','["ev-2024-01","ev-2024-13"]'],
    ["ev-2024-16","BV third client - Client Gamma","bv",2024,"2024-08-20","2024-09-01",0,"resolved","Signed third BV client. Client Gamma needs DevOps consulting. Contract: €7,500 fixed fee.",'[{"label":"Contract","filename":"contract_gamma_sep_2024.pdf"}]','["ev-2024-14"]'],
    ["ev-2024-17","Annual insurance review","admin",2024,"2024-10-01","2024-10-10",0,"resolved","Annual review of all insurance policies. Added professional liability insurance for consulting work.",'[{"label":"Insurance Update","filename":"insurance_review_oct_2024.pdf"}]','["ev-2022-11"]'],
    ["ev-2024-18","Debt milestone - 50% repaid","debt",2024,"2024-11-15","2024-11-15",0,"resolved","Major milestone: 50% of original debt repaid. Remaining balance: €63,500 across four creditors.",'[{"label":"Debt Progress Report","filename":"debt_50pct_nov_2024.pdf"}]','["ev-2023-16"]'],
    ["ev-2024-19","Year-end financial review 2024","admin",2024,"2024-12-28","2024-12-28",0,"resolved","Year-end review shows strong progress. Debt down 50%, BV revenue at €52,000 annually.",'[{"label":"Year-End Report 2024","filename":"yearend_2024.pdf"}]','["ev-2024-18"]'],
    ["ev-2024-20","BV 2025 planning session","bv",2024,"2024-12-20","2024-12-22",0,"resolved","Planned BV strategy for 2025. Target: €75,000 revenue, hire first subcontractor.",'[{"label":"2025 Business Plan","filename":"business_plan_2025.pdf"}]','["ev-2024-19"]'],
    ["ev-2025-01","Court ruling on Creditor B case","legal",2025,"2025-01-15","2025-01-15",0,"resolved","Court confirms September settlement agreement. Monthly payments of €514 for 20 months.",'[{"label":"Final Ruling","filename":"ruling_sg_final_jan_2025.pdf"}]','["ev-2024-15"]'],
    ["ev-2025-02","New contract with Client Delta","bv",2025,"2025-02-01","2025-02-01",1,"open","Six-month consulting contract signed: €4,200/month recurring revenue. First retainer-based client.",'[{"label":"Contract","filename":"contract_delta_feb_2025.pdf"}]','["ev-2024-20"]'],
    ["ev-2025-03","Personal job transition to Lead Engineer","personal",2025,"2025-03-01","2025-03-01",0,"resolved","Promoted to Lead Engineer at StartupXYZ. New salary: €85K + equity. Team expanded to 8 engineers.",'[{"label":"Promotion Letter","filename":"promotion_mar_2025.pdf"}]','["ev-2024-12"]'],
    ["ev-2025-04","BV hires first subcontractor","bv",2025,"2025-03-15","2025-03-20",0,"resolved","Hired first subcontractor for BV - frontend specialist. Contract rate: €450/day.",'[{"label":"Subcontractor Agreement","filename":"subcontractor_lucas_mar_2025.pdf"}]','["ev-2025-02"]'],
    ["ev-2025-05","Q1 2025 tax filing","admin",2025,"2025-04-15","2025-04-15",0,"resolved","Filed Q1 2025 taxes. BV revenue: €18,900. Personal salary: €21,250.",'[{"label":"Q1 Tax Filing","filename":"tax_q1_2025.pdf"}]','["ev-2025-02"]'],
    ["ev-2025-06","Debt milestone - 70% repaid","debt",2025,"2025-04-20","2025-04-20",0,"resolved","70% of original debt now repaid. Remaining balance: €38,100. End in sight.",'[{"label":"Debt Progress Report","filename":"debt_70pct_apr_2025.pdf"}]','["ev-2024-18"]'],
    ["ev-2025-07","BV training workshop pilot","bv",2025,"2025-04-25","2025-04-25",0,"resolved","Delivered first training workshop: Cloud Architecture Best Practices for 12 developers. Fee: €3,500.",'[{"label":"Workshop Materials","filename":"workshop_cloud_apr_2025.pdf"}]','["ev-2025-02"]'],
    ["ev-2025-08","Personal investment account opened","personal",2025,"2025-05-01","2025-05-01",0,"resolved","Opened personal investment account with low-cost index fund strategy. Initial deposit: €2,000.",'[{"label":"Account Opening","filename":"investment_account_may_2025.pdf"}]','["ev-2024-08"]'],
    ["ev-2025-09","Creditor A final payment scheduled","debt",2025,"2025-05-10","2025-05-10",0,"pending","Scheduled final payment to Creditor A. After 27 months, debt fully settled. Last payment: €1,175.",'[{"label":"Final Payment Receipt","filename":"final_payment_creditor_a_may_2025.pdf"}]','["ev-2023-01"]'],
    ["ev-2025-10","BV Q2 client pipeline review","bv",2025,"2025-04-30","2025-04-30",0,"resolved","Q2 pipeline review: 5 qualified prospects, 2 proposals pending. On track for €75K annual revenue.",'[{"label":"Pipeline Report","filename":"pipeline_q2_2025.xlsx"}]','["ev-2024-20"]'],
    ["ev-2025-11","Legal review of all settlement agreements","legal",2025,"2025-03-01","2025-03-10",0,"resolved","Comprehensive legal review of all active settlement agreements. Estimated full debt freedom: March 2027.",'[{"label":"Agreement Review","filename":"agreement_review_mar_2025.pdf"}]','["ev-2025-01"]'],
    ["ev-2025-12","Salary negotiation at StartupXYZ","job",2025,"2025-02-15","2025-02-28",0,"resolved","Negotiated salary increase from €78K to €85K. Also secured additional 5 days PTO.",'[{"label":"Compensation Letter","filename":"compensation_feb_2025.pdf"}]','["ev-2025-03"]'],
    ["ev-2025-13","BV brand refresh","bv",2025,"2025-01-20","2025-02-05",0,"resolved","Completed BV brand refresh with new logo, updated website, and professional marketing materials.",'[{"label":"Brand Guidelines","filename":"brand_guidelines_feb_2025.pdf"}]','["ev-2024-11"]'],
    ["ev-2025-14","Personal credit score recovery","personal",2025,"2025-05-05","2025-05-05",0,"resolved","Credit score improved from 420 to 680 over 3 years. All payment plans current.",'[{"label":"Credit Report","filename":"credit_report_may_2025.pdf"}]','["ev-2023-09"]'],
    ["ev-2025-15","Five-year recovery plan assessment","admin",2025,"2025-05-12","2025-05-12",0,"resolved","Comprehensive assessment of 3.5-year recovery journey. Debt: €127K to €38K. Net worth: positive €45K.",'[{"label":"Recovery Assessment","filename":"recovery_assessment_may_2025.pdf"}]','["ev-2025-06","ev-2025-14"]'],
  ];

  for (const ev of eventValues) {
    await conn.execute(
      `INSERT INTO events (slug, title, category, year, start_date, end_date, ongoing, status, description, evidence, related_slugs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ev
    );
  }
  console.log(`Seeded ${eventValues.length} events`);

  // ─── Link Events to Actors and Subjects ─────────────────────
  const actorNameToId: Record<string, number> = {
    "Pierre Martin": 1, "Crédit du Nord": 2, "Jean Dubois": 3, "Sophie Bernard": 4,
    "LocalSoft HR": 5, "Marc Petit": 6, "Marie Chen": 7, "Thomas Leroy": 8, "URSSAF": 9,
    "BNP Paribas": 10, "TechCorp HR": 11, "David Moreau": 12, "Claire Lefebvre": 13,
    "Crédit Mutuel": 14, "Médiateur Lambert": 15, "Société Générale": 16,
    "Tribunal de Commerce": 17, "Jean Petit": 18, "StartupXYZ": 19, "Client Alpha": 20,
    "Client Beta": 21, "Client Gamma": 22, "Client Delta": 23, "Lucas Girard": 24,
    "ING Bank": 25, "Self": 26,
  };
  const subjectSlugToId: Record<string, number> = {
    "creditor-a": 1, "creditor-b": 2, "creditor-c": 3, "creditor-d": 4,
    "bv": 5, "job": 6, "legal": 7, "personal": 8, "admin": 9,
  };

  // Event link data: [eventSlug, actorNames[], subjectSlugs[]]
  const eventLinks: Array<[string, string[], string[]]> = [
    ["ev-2022-01", ["Pierre Martin"], ["legal"]],
    ["ev-2022-02", ["Crédit du Nord", "Pierre Martin"], ["creditor-a"]],
    ["ev-2022-03", ["Jean Dubois"], ["legal"]],
    ["ev-2022-04", ["Pierre Martin", "Sophie Bernard"], ["creditor-a", "admin"]],
    ["ev-2022-05", ["Self"], ["personal", "job"]],
    ["ev-2022-06", ["LocalSoft HR", "Marc Petit"], ["job"]],
    ["ev-2022-07", ["Self", "Marie Chen", "Thomas Leroy"], ["personal"]],
    ["ev-2022-08", ["Sophie Bernard"], ["admin"]],
    ["ev-2022-09", ["URSSAF", "Sophie Bernard"], ["admin"]],
    ["ev-2022-10", ["BNP Paribas", "Pierre Martin"], ["creditor-c"]],
    ["ev-2022-11", ["Self"], ["admin"]],
    ["ev-2022-12", ["Sophie Bernard", "Pierre Martin"], ["admin"]],
    ["ev-2023-01", ["Crédit du Nord", "Pierre Martin"], ["creditor-a"]],
    ["ev-2023-02", ["Crédit du Nord"], ["creditor-a"]],
    ["ev-2023-03", ["TechCorp HR", "David Moreau"], ["job"]],
    ["ev-2023-04", ["BNP Paribas", "Pierre Martin"], ["creditor-c"]],
    ["ev-2023-05", ["TechCorp"], ["job"]],
    ["ev-2023-06", ["Claire Lefebvre", "Sophie Bernard"], ["bv"]],
    ["ev-2023-07", ["ING Bank"], ["bv"]],
    ["ev-2023-08", ["Crédit Mutuel", "Pierre Martin"], ["creditor-d"]],
    ["ev-2023-09", ["Self"], ["personal"]],
    ["ev-2023-10", ["BNP Paribas"], ["creditor-c"]],
    ["ev-2023-11", ["Client Alpha"], ["bv"]],
    ["ev-2023-12", ["Client Alpha"], ["bv"]],
    ["ev-2023-13", ["Crédit Mutuel", "Pierre Martin", "Tribunal de Commerce"], ["creditor-d", "legal"]],
    ["ev-2023-14", ["Self"], ["job"]],
    ["ev-2023-15", ["Sophie Bernard"], ["admin"]],
    ["ev-2023-16", ["Pierre Martin", "Sophie Bernard"], ["creditor-a", "creditor-b", "creditor-c", "creditor-d"]],
    ["ev-2023-17", ["Self"], ["bv"]],
    ["ev-2023-18", ["Sophie Bernard"], ["admin"]],
    ["ev-2024-01", ["Société Générale", "Tribunal de Commerce"], ["creditor-b", "legal"]],
    ["ev-2024-02", ["Marie Chen", "Jean Petit"], ["job"]],
    ["ev-2024-03", ["StartupXYZ", "TechCorp"], ["job"]],
    ["ev-2024-04", ["Client Alpha"], ["bv"]],
    ["ev-2024-05", ["Tribunal de Commerce", "Pierre Martin", "Crédit Mutuel"], ["creditor-d", "legal"]],
    ["ev-2024-06", ["Médiateur Lambert", "Crédit Mutuel", "Pierre Martin"], ["creditor-d", "legal"]],
    ["ev-2024-07", ["Client Beta", "Client Alpha"], ["bv"]],
    ["ev-2024-08", ["Self"], ["personal"]],
    ["ev-2024-09", ["Sophie Bernard"], ["admin"]],
    ["ev-2024-10", ["Sophie Bernard", "Pierre Martin"], ["debt"]],
    ["ev-2024-11", ["Self"], ["bv"]],
    ["ev-2024-12", ["Marie Chen"], ["job"]],
    ["ev-2024-13", ["Tribunal de Commerce", "Société Générale", "Pierre Martin"], ["creditor-b", "legal"]],
    ["ev-2024-14", ["Self"], ["bv"]],
    ["ev-2024-15", ["Tribunal de Commerce", "Société Générale", "Pierre Martin"], ["creditor-b", "legal"]],
    ["ev-2024-16", ["Client Gamma"], ["bv"]],
    ["ev-2024-17", ["Self"], ["admin"]],
    ["ev-2024-18", ["Pierre Martin", "Sophie Bernard"], ["debt"]],
    ["ev-2024-19", ["Sophie Bernard"], ["admin"]],
    ["ev-2024-20", ["Self"], ["bv"]],
    ["ev-2025-01", ["Tribunal de Commerce", "Pierre Martin"], ["creditor-b", "legal"]],
    ["ev-2025-02", ["Client Delta"], ["bv"]],
    ["ev-2025-03", ["StartupXYZ", "Marie Chen"], ["job", "personal"]],
    ["ev-2025-04", ["Lucas Girard"], ["bv"]],
    ["ev-2025-05", ["Sophie Bernard"], ["admin"]],
    ["ev-2025-06", ["Sophie Bernard"], ["debt"]],
    ["ev-2025-07", ["Client Delta"], ["bv"]],
    ["ev-2025-08", ["Self"], ["personal"]],
    ["ev-2025-09", ["Crédit du Nord"], ["creditor-a"]],
    ["ev-2025-10", ["Self"], ["bv"]],
    ["ev-2025-11", ["Pierre Martin"], ["legal"]],
    ["ev-2025-12", ["Jean Petit", "Marie Chen"], ["job"]],
    ["ev-2025-13", ["Self"], ["bv"]],
    ["ev-2025-14", ["Self"], ["personal"]],
    ["ev-2025-15", ["Sophie Bernard", "Pierre Martin"], ["debt", "personal", "admin"]],
  ];

  // Get event IDs from slugs
  const [eventRows] = await conn.execute("SELECT id, slug FROM events");
  const eventSlugToId: Record<string, number> = {};
  for (const row of eventRows as Array<{ id: number; slug: string }>) {
    eventSlugToId[row.slug] = row.id;
  }

  const eaValues: Array<[number, number]> = [];
  const esValues: Array<[number, number]> = [];

  for (const [slug, actorNames, subjectSlugs] of eventLinks) {
    const eventId = eventSlugToId[slug];
    if (!eventId) continue;
    for (const name of actorNames) {
      const actorId = actorNameToId[name];
      if (actorId) eaValues.push([eventId, actorId]);
    }
    for (const sSlug of subjectSlugs) {
      const subjectId = subjectSlugToId[sSlug];
      if (subjectId) esValues.push([eventId, subjectId]);
    }
  }

  for (const [eventId, actorId] of eaValues) {
    await conn.execute("INSERT INTO event_actors (event_id, actor_id) VALUES (?, ?)", [eventId, actorId]);
  }
  console.log(`Linked ${eaValues.length} event-actor relationships`);

  for (const [eventId, subjectId] of esValues) {
    await conn.execute("INSERT INTO event_subjects (event_id, subject_id) VALUES (?, ?)", [eventId, subjectId]);
  }
  console.log(`Linked ${esValues.length} event-subject relationships`);

  console.log("✅ Database seed complete!");
  await conn.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
