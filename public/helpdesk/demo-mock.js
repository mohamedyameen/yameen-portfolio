/* Demo data layer for the Helpdesk console.
 *
 * The app itself is the real thing — same components, same routes, same design
 * system. Only the backend is replaced: this script installs an XHR/fetch shim
 * before the bundle boots, so every /api/... call the app makes is answered
 * from the fixtures below instead of a server.
 *
 * Nothing in the app knows about this file. Adding a screen to the demo means
 * adding the endpoint it calls to ROUTES — never editing a component.
 *
 * Unmatched endpoints answer 200 with an empty body and log a warning, so a
 * page renders its empty state rather than an error, and the console tells you
 * exactly which fixture is missing.
 */
(function () {
  'use strict';

  const now = Date.now();
  const HOUR = 3600 * 1000;
  const DAY = 24 * HOUR;
  const ago = (ms) => now - ms;

  // ── Fixtures ────────────────────────────────────────────────────────────
  const ORG = 'Northgate Property Group';

  const USER = {
    status: 'completed',
    id: 4021,
    orgUserId: 4021,
    name: 'Mohamed Yameen',
    email: 'mohamed@northgate.example',
    username: 'mohamed@northgate.example',
    mobile: '+44 20 7946 0102',
    phone: '+44 20 7946 0102',
    onboardingStatus: true,
    getStartedStatus: true,
    homeGuideOpen: false,
    homeGuideSteps: {},
    language: 'en',
    organizationName: ORG,
    creditsRemaining: 8240,
    isProduction: true,
    defaultAgentId: 716,
    accountVerified: true,
    isCreditsBreached: false,
    orgId: 331,
  };

  // ── Onboarding demo ─────────────────────────────────────────────────────
  // Booting with `?demo=onboarding` in the URL puts the viewer in front of a
  // fresh, un-onboarded account so the first-run flow can be walked through
  // (App.tsx routes a non-production user with onboardingStatus=false to
  // /onboarding). The flow is driven entirely by the `helpdesk` settings JSON
  // on the user record, which the page re-reads every 5s — so the handlers
  // below just mutate that JSON on a timer, the way the real server's
  // background jobs would.
  const ONBOARDING_DEMO = /(?:^|[?&])demo=onboarding(?:&|$)/.test(location.search);
  const onboarding = {
    status: !ONBOARDING_DEMO,          // user.onboardingStatus
    helpdesk: undefined,               // the settings JSON, as a string
  };
  const setOnboarding = (obj) => { onboarding.helpdesk = JSON.stringify(obj); };
  // What the crawl "finds" for the sample landlord — values drawn from the
  // details form's own option lists so the chips read as recognised, not custom.
  const CRAWL_RESULT = {
    company: ORG,
    segments: ['Commercial', 'Mixed-Use', 'Retail'],
    services: ['HVAC', 'Electrical', 'Plumbing', 'Security', 'Janitorial'],
    tenantTypes: ['Property Manager', 'Staff', 'Contractor'],
    assetTypes: ['HVAC Units', 'Elevators', 'Lighting', 'Parking'],
    regions: ['UK & Europe'],
  };
  const userDetails = () => ({
    ...USER,
    onboardingStatus: onboarding.status,
    isProduction: ONBOARDING_DEMO ? false : USER.isProduction,
    helpdeskOnboarding: onboarding.helpdesk,
    // A fresh account is a trial account: the topbar chip and Home's phone
    // strip read `trialConfig.trialEndTime`, so give it two weeks to run
    // rather than letting an absent config read as "trial ended".
    ...(ONBOARDING_DEMO
      ? {
          // Matches the welcome modal's copy: "7 days of free trial and 2,000
          // free credits".
          trialConfig: JSON.stringify({ trialEndTime: new Date(now + 7 * DAY).toISOString() }),
          creditsRemaining: 2000,
          // A first-time account hasn't seen the welcome yet: Home auto-opens
          // the "Your Helpdesk Is Ready!" modal (→ Verify & call me) and shows
          // the Get Started guide expanded.
          getStartedStatus: false,
          homeGuideOpen: true,
          homeGuideSteps: {},
        }
      : {}),
  });

  const APPLICATION = {
    id: 91,
    name: 'Helpdesk',
    linkName: 'voice-assistant',
    displayName: 'Helpdesk',
  };

  // The same bundle also boots as the Dispatcher Agent when served under
  // /dispatcher-agent (see product.ts): it asks for its own Atom application
  // by linkName, and its credits come from a dispatcher-specific summary.
  const DISPATCHER_APPLICATION = {
    id: 92,
    name: 'Dispatcher',
    linkName: 'dispatcher-agent',
    displayName: 'Dispatcher',
  };

  const PROJECTS = [
    { id: 1, name: 'Northgate Campus', status: 'READY', isDefault: true },
    { id: 2, name: 'Manchester Portfolio', status: 'READY', isDefault: false },
  ];


  // ── Sample data ─────────────────────────────────────────────────────────
  // One fictional customer runs through everything: Northgate Property Group,
  // a landlord with six office towers, whose tenants raise requests by phone,
  // web chat, WhatsApp and email.

  const PORTFOLIO = [
    { id: 91, linkName: 'voice-assistant', displayName: 'Helpdesk',
      description: 'AI helpdesk across voice, chat, email and WhatsApp',
      route: 'voice-assistant', eventSource: 'helpdesk', default: true },
    { id: 92, linkName: 'dispatcher-agent', displayName: 'Dispatcher',
      description: 'Assigns work to the right technician',
      route: 'dispatcher-agent', eventSource: 'dispatch', default: false },
  ];

  const CREDIT_SUMMARY = {
    totalCredits: 25000,
    creditsUsed: 16760,
    creditBalance: 8240,
    totalUsage: 16760,
  };

  const enumVal = (value, displayName) => ({ value, displayName });

  // Tickets — the spine of the demo: each one came out of a conversation.
  const TICKET_SEED = [
    ['Level 12 — no heating (AHU-04)', 'Tenant reports the whole floor is cold since this morning. AHU-04 supply temperature is 16.2 °C against a 22 °C setpoint.',
      'IN_PROGRESS', 'REQUEST', 'EMERGENCY', 'HVAC', 'Tower A · Level 12', 'Jamie Alvarez', 'WEB_CHAT', 2 * HOUR, 'Dan Okafor'],
    ['Lift 3 juddering on descent', 'Caller reports the lift shudders between levels 6 and 4. No entrapment. Kone hold the maintenance contract.',
      'IN_PROGRESS', 'ESCALATION', 'EMERGENCY', 'MAINTENANCE', 'Tower C · Lift 3', 'Owen Castellano', 'PHONE', 4 * HOUR, 'Priya Raman'],
    ['Washroom leak, 4th floor', 'Water pooling under the basin run in the north washroom. Isolated at the service valve.',
      'IN_PROGRESS', 'REQUEST', 'URGENT', 'PLUMBING', 'Tower B · Level 4', 'Sofia Whitfield', 'WHATSAPP', 6 * HOUR, 'Tom Beckett'],
    ['Cleaning missed level 7 again', 'Third time this month. Tenant asking for the cleaning schedule to be confirmed in writing.',
      'CREATED', 'FOLLOW_UP', 'NOT_URGENT', 'CLEANING', 'Tower A · Level 7', 'Marcus Chen', 'EMAIL', 9 * HOUR, null],
    ['Access card not working at the east turnstile', 'New joiner card issued Monday, not opening the east turnstile. Works on the main lobby gate.',
      'RESOLVED', 'REQUEST', 'NOT_URGENT', 'SECURITY_AND_ACCESS', 'Tower A · Lobby', 'Rachel Devlin', 'WEB_CHAT', 26 * HOUR, 'Security desk'],
    ['Blinds jammed in meeting room 3', 'Motorised blind stuck half open, room unusable for afternoon presentations.',
      'RESOLVED', 'REQUEST', 'NOT_URGENT', 'MAINTENANCE', 'Tower F · Level 2', 'Kwame Adeyemi', 'WEB_CHAT', 30 * HOUR, 'Lena Fischer'],
    ['Meeting room too warm all afternoon', 'Room 4.02 runs several degrees above the rest of the floor after lunch.',
      'CLOSED', 'REQUEST', 'NOT_URGENT', 'HVAC', 'Tower F · Level 4', 'Amelia Barnes', 'PHONE', 2 * DAY, 'Dan Okafor'],
    ['Loading bay shutter slow to close', 'Shutter takes about 40 seconds and stalls twice on the way down.',
      'IN_PROGRESS', 'REQUEST', 'URGENT', 'MAINTENANCE', 'Tower B · Loading bay', 'Helena Marsh', 'EMAIL', 3 * DAY, 'Tom Beckett'],
    ['Flickering lights in the north stairwell', 'Two fittings flickering on levels 8 and 9. Reported by the cleaning team.',
      'CREATED', 'REQUEST', 'URGENT', 'ELECTRICAL', 'Tower C · Stairwell N', 'Nadia Ellis', 'WHATSAPP', 5 * HOUR, null],
    ['Visitor parking barrier not raising', 'Barrier stays down with a valid ticket; visitors queueing on the ramp.',
      'IN_PROGRESS', 'ESCALATION', 'EMERGENCY', 'SECURITY_AND_ACCESS', 'Basement · Visitor bay', 'Grace Mbeki', 'PHONE', 1 * HOUR, 'Priya Raman'],
    ['Air quality complaint, level 15', 'Tenant reports stuffiness after 3pm. Suspect fresh-air damper schedule.',
      'CREATED', 'REQUEST', 'NOT_URGENT', 'HVAC', 'Tower A · Level 15', 'Daniel Osei', 'WEB_CHAT', 7 * HOUR, null],
    ['Coffee point tap dripping', 'Constant drip at the level 9 coffee point; tenant has put a jug under it.',
      'RESOLVED', 'REQUEST', 'NOT_URGENT', 'PLUMBING', 'Tower B · Level 9', 'Priya Nowak', 'WHATSAPP', 2 * DAY, 'Tom Beckett'],
  ];

  const CATEGORY_NAMES = {
    HVAC: 'HVAC', PLUMBING: 'Plumbing', ELECTRICAL: 'Electrical',
    MAINTENANCE: 'Maintenance', CLEANING: 'Cleaning',
    SECURITY_AND_ACCESS: 'Security & Access',
  };
  const STATUS_NAMES = {
    CREATED: 'Created', IN_PROGRESS: 'In progress', RESOLVED: 'Resolved',
    CLOSED: 'Closed', REJECTED: 'Rejected',
  };
  const TYPE_NAMES = {
    REQUEST: 'Request', ESCALATION: 'Escalation', HANDOFF: 'Handoff',
    FOLLOW_UP: 'Follow up', SALES_REQUEST: 'Sales request',
  };
  const URGENCY_NAMES = { EMERGENCY: 'Emergency', URGENT: 'Urgent', NOT_URGENT: 'Not urgent' };

  // Skills the dispatch engine matches a technician against. The first two
  // compose the Atom card's one-line reason, and the pair per category is the
  // same wording the seeded reasoning trails extract below, so the card, the
  // chips in Details and the "How Atom decided" steps all name the same trade.
  const CATEGORY_SKILLS = {
    HVAC: ['HVAC', 'Controls'],
    ELECTRICAL: ['Electrical', 'Emergency lighting'],
    PLUMBING: ['Plumbing', 'Leak detection'],
    MAINTENANCE: ['Maintenance', 'Mechanical'],
    CLEANING: ['Cleaning', 'Supervision'],
    SECURITY_AND_ACCESS: ['Access control', 'Barrier systems'],
  };

  const TICKETS = TICKET_SEED.map((t, i) => {
    const [subject, description, status, type, urgency, category, location, requesterName, channel, age, assignee] = t;
    // Home's "Today's tickets" keeps rows created since local midnight. Ages
    // under a day are meant to read as today's inflow, so clamp them into the
    // current day (a minute apart, newest first) rather than letting a viewer
    // just after midnight see an empty list. Older tickets keep their real age.
    const startOfToday = new Date(now).setHours(0, 0, 0, 0);
    const created = age < DAY
      ? Math.min(now - (i + 1) * 1000, Math.max(ago(age), startOfToday + (i + 1) * 60 * 1000))
      : ago(age);
    return {
      id: 4800 + i,
      displayCode: `WO-${4800 + i}`,
      subject,
      description,
      status: enumVal(status, STATUS_NAMES[status]),
      ticketType: enumVal(type, TYPE_NAMES[type]),
      urgency: enumVal(urgency, URGENCY_NAMES[urgency]),
      category: enumVal(category, CATEGORY_NAMES[category]),
      requester: 900 + i,
      requesterName,
      location,
      channel,
      conversationId: 5100 + i,
      sysCreatedTime: created,
      sysModifiedTime: created + 20 * 60 * 1000,
      slaDueTime: status === 'IN_PROGRESS' || status === 'CREATED' ? created + 4 * HOUR : null,
      assignedTo: assignee ? 700 + i : null,
      assignedToName: assignee,
      assignedTime: assignee ? created + 12 * 60 * 1000 : null,
      isAutoAssigned: !!assignee,
      ruleExecuted: true,
      skillsRequired: CATEGORY_SKILLS[category] || [],
      source: 'ticket',
    };
  });

  // Dispatch explainability. The Atom card on a ticket renders only where the
  // record carries real AI data — a ranked shortlist, the policies that ran, or
  // the engine's reasoning trail; TicketDetailPanel gates on exactly that. Two
  // shapes are seeded by seed index, so the difference between a dispatched
  // record and an ordinary one is visible in the same list:
  //   · unassigned + a shortlist  → "Atom recommends … 96% match" with Assign
  //   · auto-assigned + the trail → "Auto-assigned by Atom", reasoning inline
  // The reasoning text follows the policies verbatim — WO-4800's AHU has no
  // live contract, which is the clause in "HVAC — contracted vendor" that falls
  // a ticket through to the in-house team, and a stuck barrier with nobody
  // trapped is explicitly outside life safety.
  const pick = (technicianId, name, score) => ({ technicianId, name, score });
  const DISPATCH_SEED = {
    // Level 12 — no heating. Auto-assigned to the in-house HVAC engineer.
    0: {
      policiesApplied: [{ policyId: 62, policyName: 'HVAC — contracted vendor' }],
      recommendedStaff: [pick(700, 'Dan Okafor', 94), pick(704, 'Cooltech FM', 71), pick(703, 'Lena Fischer', 48)],
      policyFlow: {
        jobAnalysed: 'Whole-floor loss of heating reported against AHU-04, supply temperature 16.2 °C against a 22 °C setpoint. Read as an asset fault, not a comfort complaint.',
        policyMatched: 'HVAC — contracted vendor. Category is HVAC and urgency is Emergency, so the policy applies and its 2-hour response clock is used.',
        requirementsExtracted: 'HVAC and Controls competency, AHU-controls experience, access to the Tower A plant room.',
        candidatesFiltered: 'AHU-04 carries no live maintenance contract, so the policy\'s exclusion routed it to the in-house team rather than to Cooltech FM. Three engineers hold the competency.',
        scoringCalculated: 'Ranked on the policy weighting — Skill 40, Availability 20, Performance 20, Proximity 10, Cost 10. Dan Okafor leads on skill rating and is already in Tower A.',
        assignmentFinalised: 'Assigned to Dan Okafor. Response window 2 hours; the tenant was told the fault is confirmed and an engineer is on the way.',
      },
    },
    // Cleaning missed level 7 — shortlist, nobody assigned yet.
    3: {
      recommendedStaff: [pick(706, 'Aoife Kelleher', 91), pick(703, 'Lena Fischer', 62)],
      policyFlow: {
        jobAnalysed: 'Third missed clean on the same floor this month, with a written confirmation of the schedule requested. Follow-up on a service failure rather than a new fault.',
        policyMatched: 'No specialist policy matched. Ranked on the default weighting — skill first, then availability, then proximity.',
        requirementsExtracted: 'Cleaning supervision, authority to confirm a schedule in writing to a tenant.',
        candidatesFiltered: 'Two people can supervise cleaning; one holds the Northgate cleaning contract for Tower A.',
        scoringCalculated: 'Aoife Kelleher leads on the supervision skill rating and is available now.',
      },
    },
    // Flickering lights, north stairwell — shortlist, nobody assigned yet.
    8: {
      policiesApplied: [{ policyId: 64, policyName: 'Repeat report within 24h' }],
      recommendedStaff: [pick(701, 'Priya Raman', 96), pick(703, 'Lena Fischer', 74), pick(700, 'Dan Okafor', 52)],
      policyFlow: {
        jobAnalysed: 'Two fittings flickering across levels 8 and 9 of the same stairwell. Escape-route lighting, so urgency was raised above a routine lamp change.',
        policyMatched: 'Repeat report within 24h. The second fitting was reported on the same stairwell inside the window, so it was appended here rather than opening a duplicate. Routing itself fell to the default weighting — skill first, then availability, then proximity.',
        requirementsExtracted: 'Electrical competency, working at height in a stairwell, emergency-lighting familiarity.',
        candidatesFiltered: 'One qualified electrician and one general-maintenance engineer with a lighting rating are eligible.',
        scoringCalculated: 'Priya Raman leads on skill by a wide margin; she is on a job in the same tower and due to finish within the hour, so availability costs her little.',
      },
    },
    // Visitor parking barrier — auto-assigned; the trail says why the security
    // specialist was not the pick.
    9: {
      policiesApplied: [{ policyId: 61, policyName: 'Life safety — immediate escalation' }],
      recommendedStaff: [pick(701, 'Priya Raman', 88), pick(705, 'Marek Zielinski', 71), pick(703, 'Lena Fischer', 54)],
      policyFlow: {
        jobAnalysed: 'Barrier not raising on a valid ticket, with vehicles queueing on the ramp. Access-control fault with a live site impact — nobody trapped.',
        policyMatched: 'Life safety — immediate escalation ran first, as it does on every ticket, and was ruled out: it covers entrapment, and there is no person trapped here. Ranked on the default weighting after that.',
        requirementsExtracted: 'Access-control and barrier-mechanism competency, basement bay access.',
        candidatesFiltered: 'The Security & Access specialist is on a rostered break, which the rest-period rule protects, leaving two engineers with barrier experience.',
        scoringCalculated: 'Priya Raman carries the access-control rating and is closest to the basement bay.',
        assignmentFinalised: 'Assigned to Priya Raman. Security desk notified so the ramp can be managed while the barrier is down.',
      },
    },
  };
  Object.entries(DISPATCH_SEED).forEach(([i, extra]) => Object.assign(TICKETS[Number(i)], extra));

  // Trade per technician — the factory takes a trade but does not keep it, and
  // the playground ranks on it. Keyed by id so the fixtures stay untouched.
  const TECH_CATEGORY = {
    700: 'HVAC', 701: 'ELECTRICAL', 702: 'PLUMBING', 703: 'MAINTENANCE',
    704: 'HVAC', 705: 'SECURITY_AND_ACCESS', 706: 'CLEANING',
  };

  const ticketStats = () => {
    const statusCounts = { CREATED: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0, REJECTED: 0 };
    const urgencyCounts = { EMERGENCY: 0, URGENT: 0, NOT_URGENT: 0 };
    TICKETS.forEach((t) => {
      statusCounts[t.status.value] += 1;
      urgencyCounts[t.urgency.value] += 1;
    });
    return { total: TICKETS.length, statusCounts, urgencyCounts };
  };

  // Technicians. The profile modal reads skills (with ratings), certifications,
  // familiar zones, breaks (plotted on the 24h availability bar, so breakTime
  // must parse as "HH:MM AM/PM") and inventory with quantities. The all* string
  // fields take precedence over the arrays where the backend sends both, so
  // they are deliberately left empty here.
  const technician = (id, name, trade, phone, status, contractor, spec) => ({
    id, orgId: 331, technicianId: `TECH-${id}`, name,
    contactPhone: phone,
    contactEmail: `${name.split(' ')[0].toLowerCase()}@${contractor ? 'cooltechfm' : 'northgate'}.example`,
    currentStatus: status, isContractor: contractor,
    skills: spec.skills.map((sk, i) => ({ id: id * 10 + i, technicianId: id, skill: sk[0], rating: sk[1] })),
    certifications: spec.certifications.map((c, i) => ({ id: id * 10 + i, technicianId: id, certification: c })),
    breaks: spec.breaks.map((b, i) => ({ id: id * 10 + i, technicianId: id, breakTime: b })),
    familiarZones: spec.zones.map((z, i) => ({ id: id * 10 + i, technicianId: id, zone: z })),
    inventory: spec.inventory.map((it, i) => ({ id: id * 10 + i, technicianId: id, item: it[0], quantity: it[1] })),
    // The list CARD reads the comma-joined all* strings while the profile modal
    // prefers the arrays — the backend sends both, so both are populated here or
    // the card renders "No skills listed" over a fully-populated profile.
    allSkills: spec.skills.map((sk) => sk[0]).join(', '),
    allCertifications: spec.certifications.join(', '),
    allBreaks: spec.breaks.join(', '),
    allFamiliarZones: spec.zones.join(', '),
    allInventory: spec.inventory.map((it) => it[0]).join(', '),
    sysCreatedBy: null, sysModifiedBy: null, sysCreatedTime: ago(spec.tenure * DAY),
    sysModifiedTime: ago(2 * DAY), sysDeletedBy: null, sysDeletedTime: null, sysDeleted: false,
  });

  const TECHNICIANS = [
    technician(700, 'Dan Okafor', 'HVAC', '+44 7700 900101', 'AVAILABLE', false, {
      tenure: 1400,
      skills: [['HVAC — chilled water', 5], ['AHU controls', 5], ['BMS diagnostics', 4], ['Refrigerant handling', 4], ['Pumps & valves', 3]],
      certifications: ['F-Gas Category I', 'City & Guilds 2079', 'IPAF 3a/3b', 'Asbestos awareness'],
      breaks: ['10:30 AM', '01:00 PM'],
      zones: ['Tower A', 'Tower B', 'Central plant room', 'Basement plant'],
      inventory: [['Refrigerant gauge set', 1], ['Belt set (A/B section)', 6], ['Thermal camera', 1], ['Filter set — AHU', 12]],
    }),
    technician(701, 'Priya Raman', 'Electrical', '+44 7700 900102', 'ON_JOB', false, {
      tenure: 980,
      skills: [['Electrical — LV distribution', 5], ['Emergency lighting', 4], ['Fire alarm panels', 4], ['Access control wiring', 3]],
      certifications: ['18th Edition Wiring Regs', 'City & Guilds 2391 Inspection & Testing', 'First response — site safety', 'IPAF 3a'],
      breaks: ['11:00 AM', '02:30 PM'],
      zones: ['Tower C', 'Tower D', 'Basement · Visitor bay', 'Riser cupboards'],
      inventory: [['Insulation tester', 1], ['LED emergency fittings', 8], ['Cable reel 25m', 2], ['Torque screwdriver set', 1]],
    }),
    technician(702, 'Tom Beckett', 'Plumbing', '+44 7700 900103', 'ON_JOB', false, {
      tenure: 1650,
      skills: [['Plumbing — domestic water', 5], ['Drainage & waste', 4], ['Leak detection', 5], ['Pump replacement', 3]],
      certifications: ['WRAS approved plumber', 'Legionella awareness (L8)', 'Confined space entry', 'Hot works permit'],
      breaks: ['12:30 PM'],
      zones: ['Tower B', 'Tower E', 'Washroom cores', 'Roof tank room'],
      inventory: [['Pipe freezing kit', 1], ['Isolation valve set', 10], ['Wet vacuum', 1], ['Leak detection dye', 4]],
    }),
    technician(703, 'Lena Fischer', 'General maintenance', '+44 7700 900104', 'AVAILABLE', false, {
      tenure: 620,
      skills: [['General maintenance', 4], ['Door & access hardware', 4], ['Blinds & glazing', 3], ['Carpentry', 3]],
      certifications: ['Manual handling', 'Working at height', 'Asbestos awareness'],
      breaks: ['10:00 AM', '01:30 PM', '03:30 PM'],
      zones: ['Tower F', 'Tower A', 'Meeting suites', 'Loading bay'],
      inventory: [['Door closer set', 3], ['Blind motor unit', 2], ['Cordless drill kit', 1], ['Ironmongery box', 1]],
    }),
    technician(704, 'Cooltech FM', 'HVAC', '+44 20 7946 0555', 'AVAILABLE', true, {
      tenure: 2100,
      skills: [['HVAC — contract vendor', 5], ['Chiller overhaul', 5], ['AHU controls', 4], ['Planned maintenance', 5]],
      certifications: ['F-Gas Company Certificate', 'SafeContractor accredited', 'ISO 45001', 'REFCOM Elite'],
      breaks: ['12:00 PM'],
      zones: ['Tower A', 'Tower B', 'Tower C', 'Tower D', 'Central plant room'],
      inventory: [['Contract spares kit', 1], ['Chiller service pack', 2], ['Vacuum pump', 1]],
    }),
    technician(705, 'Marek Zielinski', 'Security & Access', '+44 7700 900105', 'ON_BREAK', false, {
      tenure: 740,
      skills: [['Access control systems', 5], ['CCTV & recording', 4], ['Turnstiles & barriers', 4], ['Intercom systems', 3]],
      certifications: ['SIA licence', 'CCTV operator (public space)', 'GDPR handling — surveillance'],
      breaks: ['11:30 AM', '04:00 PM'],
      zones: ['Tower A · Lobby', 'Basement · Visitor bay', 'All turnstiles', 'Security control room'],
      inventory: [['Access card blanks', 50], ['Reader replacement unit', 2], ['Barrier motor spares', 1]],
    }),
    technician(706, 'Aoife Kelleher', 'Cleaning supervision', '+44 7700 900106', 'AVAILABLE', true, {
      tenure: 430,
      skills: [['Cleaning supervision', 5], ['Periodic deep clean', 4], ['Washroom consumables', 4], ['Waste & recycling', 3]],
      certifications: ['COSHH trained', 'BICSc supervisor', 'Manual handling'],
      breaks: ['09:30 AM', '02:00 PM'],
      zones: ['Tower A', 'Tower B', 'Tower F', 'Common areas'],
      inventory: [['Consumables trolley', 2], ['Floor scrubber', 1], ['Washroom stock pack', 20]],
    }),
  ];

  // ── Conversations (Inbox) ───────────────────────────────────────────────
  // Raw ChannelConversation shape — the shared mapper turns these into the
  // CallLog records the inbox renders.
  const msg = (performer, message, conversationId, minsAgo) => ({
    performer, message, timestamp: ago(minsAgo * 60 * 1000), conversationId,
  });

  const conversation = (id, group, name, phone, email, brief, startMinsAgo, durationSecs, tone, transcript, channel) => {
    const start = ago(startMinsAgo * 60 * 1000);
    const type = group;
    const sub = group === 'CALL' ? { callType: 'INBOUND' }
      : group === 'CHAT' ? { chatType: 'WEB_CHAT' }
      : { emailType: 'INBOUND' };
    return Object.assign({
      id, orgId: 331, type,
      // ChannelType for the surfaces that show a channel glyph.
      displayChannel: channel || (group === 'CALL' ? 'PHONE' : group === 'EMAIL' ? 'EMAIL' : 'WEB_CHAT'),
      status: 'COMPLETED',
      startTime: start,
      endTime: start + durationSecs * 1000,
      summary: brief,
      brief,
      satisfactionLevel: tone,
      tags: '',
      name, phone, email,
      transcription: transcript,
      lastConversation: transcript[transcript.length - 1],
    }, sub);
  };

  const CONVERSATIONS = [
    conversation(5101, 'CHAT', 'Jamie Alvarez', '+44 7700 900311', 'j.alvarez@mertonco.example',
      'Tenant on level 12 reported no heating. Agent matched AHU-04 to an open fault and raised WO-4801.',
      124, 240, 'SATISFIED', [
        msg('USER', "It's freezing on level 12 again", 5101, 126),
        msg('ASSISTANT', "Sorry — that's the second report from level 12 this week. Let me check the unit serving your floor.", 5101, 126),
        msg('ASSISTANT', 'Level 12 is served by AHU-04, which is showing a supply temperature of 16.2 °C against a 22 °C setpoint. That matches the chilled-water valve fault logged on Tuesday.', 5101, 125),
        msg('USER', 'So is someone coming out?', 5101, 125),
        msg('ASSISTANT', "I've raised a work order and linked it to the existing fault so the HVAC contractor sees both together. They're contracted to a two-hour response — I'll message you when they're on site.", 5101, 124),
        msg('USER', 'Thanks, appreciated', 5101, 124),
      ], 'WEB_CHAT'),
    conversation(5102, 'CALL', 'Owen Castellano', '+44 20 7946 0102', null,
      'Caller reported lift 3 juddering between levels 6 and 4. No entrapment. Escalated to Kone under contract.',
      240, 186, 'CONCERNED', [
        msg('ASSISTANT', "Northgate helpdesk, this is Ava. What's happening?", 5102, 244),
        msg('USER', 'Lift 3 in Tower C is juddering on the way down, between six and four.', 5102, 243),
        msg('ASSISTANT', 'Is anyone inside the car right now?', 5102, 243),
        msg('USER', 'No, it stopped at the ground floor and we have taped it off.', 5102, 242),
        msg('ASSISTANT', "Good — that's the right call. Kone hold the lift contract for Tower C, so I'm logging this as an escalation and notifying them now. Please keep it out of service until they confirm.", 5102, 241),
      ]),
    conversation(5103, 'EMAIL', 'Sofia Whitfield', null, 's.whitfield@kestrel.example',
      'Service charge invoice query for March, escalated to a call with the property manager after two rounds.',
      180, 60, 'CALM', [
        msg('USER', "Hello,\n\nCan you explain the increase on our March service charge invoice? It is roughly 14% up on February and nothing has changed on our side.\n\nSofia Whitfield\nKestrel Legal, Tower B", 5103, 1440),
        msg('ASSISTANT', 'Hi Sofia,\n\nThe March invoice carries the annual reconciliation as well as the monthly on-account charge, which is why it reads higher than February. The reconciliation trues up last year’s estimated costs against what was actually spent.\n\nThe split for your suite is in the statement attached to the invoice, under "Reconciliation 2025". Anything account-specific has to come from your property manager — I have copied Helena Marsh in.\n\nAva, Northgate helpdesk', 5103, 1380),
        msg('USER', 'Thanks. I can see the reconciliation line, but the utilities figure is nearly double last year. Is that the standing charge increase you mentioned to another tenant?', 5103, 900),
        msg('ASSISTANT', 'Yes. The site came off its fixed supply contract in April and the standing charge roughly doubled at renewal; utilities are apportioned by floor area, so every suite sees it in proportion.\n\nTwo things that may help: the building’s consumption is actually down 8% year on year, and the landlord is tendering the supply again in the autumn.', 5103, 840),
        msg('USER', 'Understood. Could we have the consumption figures for our floors for the last four quarters?', 5103, 300),
        msg('ASSISTANT', 'I can pull the metered consumption for levels 4 and 5, but the apportioned cost view is the property manager’s to send — she has that on her list for this week.\n\nI have attached the meter readings by quarter in the meantime.', 5103, 240),
        msg('USER', 'That is what I needed, thank you.', 5103, 180),
      ], 'EMAIL'),
    conversation(5104, 'CHAT', 'Marcus Chen', '+44 7700 900412', 'm.chen@aldergrove.example',
      'Cleaning missed level 7 for the third time this month. Agent raised a follow-up and requested the schedule in writing.',
      41, 150, 'FRUSTRATED', [
        msg('USER', 'Our floor was skipped again last night. This is the third time this month.', 5104, 44),
        msg('ASSISTANT', "That shouldn't be happening, and I can see the two earlier reports on level 7.", 5104, 43),
        msg('ASSISTANT', "I've raised this as a follow-up with the cleaning contractor rather than a fresh request, so it goes to the same supervisor with the history attached. I've also asked them to confirm the level 7 schedule in writing to you.", 5104, 42),
        msg('USER', 'Please do, thanks.', 5104, 41),
      ], 'WHATSAPP'),
    conversation(5105, 'CHAT', 'Rachel Devlin', '+44 7700 900518', 'r.devlin@northgate.example',
      'New joiner access card not opening the east turnstile. Answered from the handbook; security desk task, no work order.',
      72, 120, 'SATISFIED', [
        msg('USER', 'A new starter card works on the lobby gate but not the east turnstile.', 5105, 74),
        msg('ASSISTANT', 'The east turnstile is on a separate access group — new joiner cards are added to it by the security desk, usually within a business day of issue.', 5105, 73),
        msg('ASSISTANT', "I've asked the security desk to add the card now rather than waiting for the overnight sync. This one is not a maintenance job, so there is no work order to track — you'll get a confirmation from them directly.", 5105, 72),
      ]),
    conversation(5106, 'CALL', 'Grace Mbeki', '+44 7700 900620', null,
      'Visitor parking barrier not raising with a valid ticket. Escalated — visitors queueing on the ramp.',
      60, 95, 'URGENT', [
        msg('ASSISTANT', "Northgate helpdesk, this is Ava. What's happening?", 5106, 62),
        msg('USER', "The visitor barrier in the basement won't lift and there are four cars backed up the ramp.", 5106, 62),
        msg('ASSISTANT', "Cars on the ramp makes this urgent — I'm raising it as an escalation now and alerting the duty engineer. The front desk can raise the barrier manually from the security panel in the meantime.", 5106, 61),
      ]),

    // ── More calls ─────────────────────────────────────────────────────────
    conversation(5107, 'CALL', 'Farah Haddad', '+44 7700 901367', null,
      'Fire alarm sounding on level 9. Agent matched a panel test in progress but still escalated for verification.',
      95, 142, 'URGENT', [
        msg('ASSISTANT', "Northgate helpdesk, this is Ava. What's happening?", 5107, 97),
        msg('USER', 'The fire alarm is going off on level 9 and nobody has told us anything.', 5107, 97),
        msg('ASSISTANT', 'Are people evacuating, or is it sounding on your floor only?', 5107, 96),
        msg('USER', 'Just our floor, and it stopped after about thirty seconds.', 5107, 96),
        msg('ASSISTANT', "That matches the panel test logged for Tower C this morning, but a 30-second activation still needs verifying — the duty engineer is checking the panel now. If it sounds again and continues, evacuate to the assembly point on Marlowe Street.", 5107, 95),
      ], 'PHONE'),
    conversation(5108, 'CALL', 'Callum Findlay', '+44 7700 901478', null,
      'Car park pass not opening the barrier. Pass had expired at renewal; security desk raised it and processed the renewal.',
      210, 108, 'CONCERNED', [
        msg('ASSISTANT', 'Northgate helpdesk, this is Ava.', 5108, 212),
        msg('USER', "My car park pass isn't opening the barrier and I'm sat on the ramp.", 5108, 211),
        msg('ASSISTANT', 'Your pass expired at the annual renewal on the first. The security desk can extend it on the spot — I have asked them to raise the barrier now and process the renewal while you park.', 5108, 210),
        msg('USER', 'Nobody told me it was expiring.', 5108, 210),
        msg('ASSISTANT', "Renewal notices go to the tenant admin rather than each pass holder, which is why it didn't reach you. I've flagged that with the property manager.", 5108, 209),
      ], 'PHONE'),
    conversation(5109, 'CALL', 'Owen Castellano', '+44 20 7946 0102', null,
      'Contractor arrived for roof works with no permit. Access refused and routed to the facilities manager.',
      330, 96, 'CALM', [
        msg('USER', "I've got two contractors at the desk for roof works with no permit.", 5109, 332),
        msg('ASSISTANT', 'No permit means no access — roof works need a permit to work and RAMS on file before anyone goes up.', 5109, 331),
        msg('ASSISTANT', "I've notified the facilities manager and the contract holder. If the paperwork lands within the hour they can start today; otherwise they rebook.", 5109, 330),
      ], 'PHONE'),
    conversation(5110, 'CALL', 'Ines Ferreira', '+44 7700 901589', null,
      'No hot water in the level 5 washrooms. Matched to the calorifier fault already under repair.',
      480, 130, 'CONCERNED', [
        msg('ASSISTANT', "Northgate helpdesk, this is Ava. What's happening?", 5110, 482),
        msg('USER', 'There is no hot water in any of the washrooms on level 5.', 5110, 482),
        msg('ASSISTANT', 'The calorifier serving levels 4 to 6 has been down since yesterday afternoon — a replacement element is on site this morning.', 5110, 481),
        msg('USER', 'So when will it be back?', 5110, 480),
        msg('ASSISTANT', "The engineer's window runs to midday. I've added your report to the open job so you get the update when it closes, rather than raising a duplicate.", 5110, 480),
      ], 'PHONE'),
    conversation(5111, 'CALL', 'Gareth Powell', '+44 7700 902613', null,
      'Burst pipe in the Tower D riser, water heading for the comms cupboard. Escalated as an emergency.',
      1320, 176, 'URGENT', [
        msg('USER', 'There is water pouring out of the riser cupboard on level 8.', 5111, 1323),
        msg('ASSISTANT', 'Is any of it reaching electrical equipment or a distribution board?', 5111, 1322),
        msg('USER', 'It is running along the floor towards the comms cupboard.', 5111, 1322),
        msg('ASSISTANT', "Treating this as an emergency. Move away from the comms cupboard and don't touch anything electrical — the duty engineer is on the way to isolate the riser, and security is checking the floor below for water coming through.", 5111, 1321),
        msg('ASSISTANT', 'Work order raised and the site manager has been texted.', 5111, 1320),
      ], 'PHONE'),
    conversation(5112, 'CALL', 'Hannah Doyle', '+44 7700 902615', null,
      'Goods lift booking for a Saturday move-in. Handled from the handbook, no work order needed.',
      2600, 88, 'SATISFIED', [
        msg('USER', 'We need the goods lift on Saturday for a move-in.', 5112, 2602),
        msg('ASSISTANT', "Goods lift bookings run 8am to 6pm at weekends and need 48 hours notice, protective matting, and the removal firm's insurance certificate.", 5112, 2601),
        msg('USER', 'That all works. Saturday from nine?', 5112, 2601),
        msg('ASSISTANT', "Booked, 9am to 1pm, Tower B goods lift. I've sent the checklist to your tenant admin and told the security desk to expect them.", 5112, 2600),
      ], 'PHONE'),

    // ── More web chats ─────────────────────────────────────────────────────
    conversation(5113, 'CHAT', 'Anika Sharma', '+44 7700 901923', 'a.sharma@penrose.example',
      'Meeting-room booking after 6pm, and the chargeable extended-HVAC route.',
      18, 96, 'SATISFIED', [
        msg('USER', 'Can we book the level 10 meeting suite after 6pm?', 5113, 19),
        msg('ASSISTANT', 'Yes — the suite is bookable until 9pm on weekdays through the tenant portal. After 6pm add an out-of-hours note so security keeps the floor unlocked.', 5113, 19),
        msg('USER', 'And air conditioning?', 5113, 18),
        msg('ASSISTANT', 'HVAC runs to 7pm as standard. For later, request extended HVAC on the same booking form — chargeable at £45 per hour per floor.', 5113, 18),
      ], 'WEB_CHAT'),
    conversation(5114, 'CHAT', 'Emeka Nwosu', '+44 7700 902610', 'e.nwosu@bellhaus.example',
      'Level 3 running cold. Setpoint raised and a comfort check logged rather than a work order.',
      33, 120, 'CONCERNED', [
        msg('USER', 'Level 3 is freezing again, we are all in coats.', 5114, 35),
        msg('ASSISTANT', 'Level 3 is on FCU zone 3B, set to 21 °C with a supply reading of 19.4 °C — colder than it should be, but not a fault yet.', 5114, 34),
        msg('ASSISTANT', "I've raised the setpoint a degree and asked for a comfort check on the zone this afternoon. If it is still cold tomorrow it becomes a work order rather than an adjustment.", 5114, 33),
      ], 'WEB_CHAT'),
    conversation(5115, 'CHAT', 'Beatriz Salgado', '+44 7700 901701', 'b.salgado@wrenfield.example',
      'Bike store at capacity. Overflow location given and demand logged for the quarterly review.',
      64, 74, 'CALM', [
        msg('USER', 'The bike store in Tower B is full every morning now.', 5115, 65),
        msg('ASSISTANT', 'There is overflow racking in the basement by the loading bay — same access card, level B2, another 40 spaces.', 5115, 65),
        msg('ASSISTANT', "I've logged that the main store is at capacity too; the property manager reviews cycle provision quarterly and that record is what changes it.", 5115, 64),
      ], 'WEB_CHAT'),
    conversation(5116, 'CHAT', 'Julia Stanton', '+44 7700 902619', 'j.stanton@brightmoor.example',
      'Confidential waste disposal, plus a one-off secure collection for an archive clear-out.',
      140, 68, 'SATISFIED', [
        msg('USER', 'Where do we put confidential waste?', 5116, 141),
        msg('ASSISTANT', 'Locked consoles on each floor by the print area, emptied Tuesdays and Fridays, cross-cut shredded with a certificate of destruction.', 5116, 140),
        msg('USER', 'We have three boxes from an archive clear-out — too much for the console.', 5116, 140),
        msg('ASSISTANT', "For that volume I can book a one-off secure collection. It's chargeable and needs a day's notice — shall I raise it?", 5116, 140),
      ], 'WEB_CHAT'),
    conversation(5117, 'CHAT', 'Idris Rahman', '+44 7700 902256', 'i.rahman@kingsmere.example',
      'Suite door not securing. Treated as a security issue and sent straight to the duty engineer.',
      190, 110, 'FRUSTRATED', [
        msg('USER', "Our suite door won't lock — it just swings back open. We can't leave the office like this.", 5117, 192),
        msg('ASSISTANT', 'A door that will not secure is a security issue, so it goes to the duty engineer rather than the normal queue.', 5117, 191),
        msg('ASSISTANT', 'Work order raised, someone will be with you within the hour. If you need to leave before then, security can lock the floor entrance and add your suite to their patrol.', 5117, 190),
        msg('USER', 'Thank you, that helps.', 5117, 190),
      ], 'WEB_CHAT'),
    conversation(5118, 'CHAT', 'Meera Iyer', '+44 7700 902625', 'm.iyer@kestrel.example',
      'Desk chairs requested — outside the building scope, routed to the fit-out contact.',
      420, 62, 'CALM', [
        msg('USER', 'Can we get four more desk chairs for the new starters?', 5118, 421),
        msg('ASSISTANT', 'Furniture inside a demised suite is the tenant\'s own — the building helpdesk covers base build and common areas, so I cannot order chairs for you.', 5118, 420),
        msg('ASSISTANT', 'Your fit-out contact at Penrose Interiors handles that under the existing frame agreement; I have sent you their details.', 5118, 420),
      ], 'WEB_CHAT'),
    conversation(5119, 'CHAT', 'Zahra Nasser', '+44 7700 902650', 'z.nasser@kingsmere.example',
      'Atrium Wi-Fi dropping. Passed to the building IT provider with the access-point reference.',
      760, 90, 'CONCERNED', [
        msg('USER', 'The guest Wi-Fi in the atrium keeps dropping out.', 5119, 762),
        msg('ASSISTANT', 'The atrium runs off access points AP-12 and AP-14, and AP-14 has been flapping since the weekend.', 5119, 761),
        msg('ASSISTANT', 'That sits with the building IT provider rather than maintenance — raised with them, and your report is linked so you get the resolution notice.', 5119, 760),
      ], 'WEB_CHAT'),

    // ── More emails ────────────────────────────────────────────────────────
    conversation(5120, 'EMAIL', 'Tomas Lindqvist', null, 't.lindqvist@nordbrook.example',
      'Breakdown behind the quarterly charge, then a follow-up on how cleaning is apportioned.',
      300, 45, 'CALM', [
        msg('USER', "Please could you send the breakdown behind this quarter's service charge? The figure is up on last quarter and my finance team have asked for the detail.", 5120, 2880),
        msg('ASSISTANT', 'The quarterly charge is apportioned by demised floor area across four heads: maintenance, utilities, security and cleaning. The rise this quarter sits almost entirely in utilities, following the April standing-charge increase.\n\nThe head-level breakdown is attached. The line-by-line detail for your suite comes from the property manager, who I have copied in.', 5120, 2820),
        msg('USER', 'Thanks. On cleaning — we are a 40-desk office on one floor and the charge looks similar to tenants with two floors. How is that split?', 5120, 1500),
        msg('ASSISTANT', 'Cleaning is apportioned by area, not headcount, but common areas are shared equally across occupied floors rather than by area — that is what flattens the difference you are seeing.\n\nIf your suite is being cleaned to a different specification than the base one, that would show separately as extra work. It is not, in your case.', 5120, 1440),
        msg('USER', 'That explains it. One more: is the specification available? Our lease renewal is in September.', 5120, 420),
        msg('ASSISTANT', 'Attached. It is the same specification every suite is cleaned to, and the renewal team will want the variations list alongside it — I have flagged that to your property manager so you get both in one pack.', 5120, 300),
      ], 'EMAIL'),
    conversation(5121, 'EMAIL', 'Clara Winslow', null, 'c.winslow@northgate.example',
      'Fire drill dates for Towers A and B, warden list updated, and the evacuation-chair check chased.',
      620, 40, 'SATISFIED', [
        msg('USER', 'Can you confirm the drill dates for Towers A and B so I can brief the floor wardens?', 5121, 4320),
        msg('ASSISTANT', 'Towers A and B: Thursday 26 March, 10:30. Towers C to F ran theirs in February and are next due in September.\n\nThe warden briefing pack goes out a week ahead, on the 19th. If any floor has new wardens since February, send me their names and I will add them to the distribution.', 5121, 4260),
        msg('USER', 'Three changes: level 7 and level 12 have new wardens, and the level 3 warden has left. Names attached.', 5121, 2880),
        msg('ASSISTANT', 'Updated — the two new wardens are on the distribution and the level 3 record is now vacant, which will show as a gap on the drill report unless someone is appointed before the 26th.\n\nWorth raising with the level 3 tenant this week.', 5121, 2820),
        msg('USER', 'Agreed, I will chase them. Do we still have the evacuation chairs on levels 9 and 15?', 5121, 1200),
        msg('ASSISTANT', 'Yes, both are in place and were serviced in January. The next inspection is due in July, so they will be in date for the drill.\n\nI have added a line to the drill plan to confirm both are checked on the day rather than assumed.', 5121, 1140),
        msg('USER', 'Perfect, thank you.', 5121, 620),
      ], 'EMAIL'),
    conversation(5122, 'EMAIL', 'Victor Almeida', null, 'v.almeida@marchmont.example',
      'Weekend HVAC for an audit — quoted, approved, then extended by an hour after the auditors overran.',
      880, 55, 'SATISFIED', [
        msg('USER', 'We have auditors in this Saturday, 9am to 6pm. Can we have air conditioning on level 11?', 5122, 5760),
        msg('ASSISTANT', 'Yes — weekend HVAC is extended service, chargeable at £45 per hour per floor, so 9am to 6pm on level 11 comes to £405 plus VAT.\n\nProvisionally booked. Your tenant admin needs to approve it by Friday midday, since the plant schedule is set the day before.', 5122, 5700),
        msg('USER', 'Approved — Priya has signed it off. Will the lifts and access work at the weekend too?', 5122, 4300),
        msg('ASSISTANT', 'Lifts run normally at weekends. Access is the part to watch: passes work, but the level 11 floor door is on a weekend lock schedule, so I have asked security to release it from 8:30.\n\nIf your auditors are external, send me their names by Friday and I will have visitor passes ready at the desk.', 5122, 4240),
        msg('USER', 'Four external names attached. Also — they may run past six. What happens then?', 5122, 2100),
        msg('ASSISTANT', 'Passes will be at the desk. HVAC stops at the booked hour and the floor takes about 40 minutes to drift, so a short overrun is comfortable; anything beyond an hour is worth booking now rather than on the day, since nobody is here to extend it.', 5122, 2040),
        msg('USER', 'Add an hour to be safe — 9 to 7.', 5122, 1000),
        msg('ASSISTANT', 'Extended to 19:00, £450 plus VAT. Confirmation sent to Priya, and the security note now says the floor door releases at 8:30 and locks at 19:30.', 5122, 880),
      ], 'EMAIL'),
    conversation(5123, 'EMAIL', 'Ursula Kane', null, 'u.kane@wrenfield.example',
      'Sagging ceiling tile with a photo — void inspected, leak traced to a chilled-water valve, tenant kept informed.',
      1500, 60, 'CALM', [
        msg('USER', 'There is a stained and sagging ceiling tile above the desks on level 6 — photo attached. It has got noticeably worse since Friday.', 5123, 4320),
        msg('ASSISTANT', 'Thanks — the staining pattern suggests a slow leak in the void rather than the tile itself, so I have raised it for a look above as well as a tile swap.\n\nPlease keep the desks beneath it clear until someone attends. Work order raised, standard response.', 5123, 4260),
        msg('USER', 'The engineer came this morning and took the tile out, but nobody told us what he found.', 5123, 2000),
        msg('ASSISTANT', 'He traced it to a weeping chilled-water valve on the level 7 riser, which is why the water was showing a floor below. The valve has been isolated and a replacement is on order.\n\nThe ceiling stays open until the valve is swapped — sorry, that is not tidy, but closing it up and reopening would cost you another disruption.', 5123, 1940),
        msg('USER', 'How long is the part?', 5123, 1700),
        msg('ASSISTANT', 'Two working days. I have put the tile replacement on the same visit so it is one attendance rather than two, and set a reminder to chase the part tomorrow if it has not shipped.', 5123, 1620),
        msg('USER', 'Fine by us. Please confirm when it is booked.', 5123, 1500),
      ], 'EMAIL'),
    conversation(5124, 'EMAIL', 'Patrick Lowry', null, 'p.lowry@ashgrove.example',
      'Saturday furniture delivery — paperwork collected, bay slot booked, lift protection arranged.',
      2200, 50, 'SATISFIED', [
        msg('USER', 'We have a furniture delivery arriving Saturday morning. What do you need from us?', 5124, 7200),
        msg('ASSISTANT', "Three things: the delivery firm's insurance certificate, a vehicle registration for the loading bay, and a named contact who will be on site.\n\nThe bay is bookable in two-hour slots from 8am. Send those over and I will confirm the slot and brief the security desk.", 5124, 7140),
        msg('USER', 'Certificate attached. Vehicle is a 7.5t box van, registration LR71 KWD, and our office manager Dana will be there from 8.', 5124, 5000),
        msg('ASSISTANT', 'Booked, 8am to 10am. One thing the certificate raises: cover is £2m public liability, and the building requires £5m for vehicle access to the bay.\n\nTheir broker can usually issue a one-day extension. Without it they can unload at street level and porter in, which is slower but allowed.', 5124, 4940),
        msg('USER', 'They have sent an updated certificate at £5m — attached.', 5124, 3000),
        msg('ASSISTANT', 'That clears it. Bay confirmed 8–10am, security briefed, and I have booked the goods lift for the same window with protective matting laid.\n\nDana should report to the Tower A security desk on arrival for the loading-bay fob.', 5124, 2900),
        msg('USER', 'Excellent, thank you for sorting the insurance issue.', 5124, 2200),
      ], 'EMAIL'),
    conversation(5125, 'EMAIL', 'Wendy Park', null, 'w.park@calderwood.example',
      'Cleaning specification ahead of a lease renewal, then a costed variation for extra daytime cover.',
      3400, 48, 'CALM', [
        msg('USER', 'Ahead of our renewal, could you send the cleaning specification for our floors?', 5125, 10080),
        msg('ASSISTANT', 'Attached. In summary: daily janitorial and washroom servicing, weekly vacuuming and hard-floor buffing, quarterly internal window cleaning, annual carpet extraction.\n\nAnything beyond that is chargeable extra work through a signed variation.', 5125, 10020),
        msg('USER', 'We would like a daytime cleaner for the washrooms — we are at 90% occupancy now and the afternoons are not holding up. What would that cost?', 5125, 7000),
        msg('ASSISTANT', 'A daytime attendant is the usual answer to that. Two options:\n\n· Four hours a day, 11am to 3pm, covering washrooms and the tea points — £1,240 a month.\n· Two hours a day, 12pm to 2pm, washrooms only — £640 a month.\n\nBoth are variations to the existing contract, so they end with the lease term rather than running on.', 5125, 6900),
        msg('USER', 'The four-hour option, but starting from the renewal date rather than now. Can that be drafted?', 5125, 4000),
        msg('ASSISTANT', 'Drafted and sent to your property manager for the renewal pack, with a start date matched to the new term.\n\nOne note: the cleaning contractor needs six weeks to recruit for a daytime post, so if the renewal signs late the start may slip. I have flagged that on the variation rather than leaving it to be discovered.', 5125, 3500),
        msg('USER', 'Good to know. We will keep an eye on the timing.', 5125, 3400),
      ], 'EMAIL'),
  ];

  const conversationsOf = (group) =>
    CONVERSATIONS.filter((c) => (group ? c.type === group : true));

  // Home insights. `trend` drives the sparklines; the channel splits feed the
  // per-channel breakdown under each stat.
  const trend = (base, n) => Array.from({ length: n }, (_, i) =>
    Math.round(base * (0.72 + 0.3 * Math.sin(i / 1.7) + i * 0.035)));

  const HOME_INSIGHTS = {
    callDetail:  { current: 1284, previous: 1178, trend: trend(150, 12), phone: 962, webCall: 322 },
    chatDetail:  { current: 2106, previous: 1802, trend: trend(240, 12), whatsapp: 498, webChat: 1608 },
    emailDetail: { current: 742,  previous: 766,  trend: trend(88, 12) },
    satisfactionAnalysis: {
      urgent: 6, frustrated: 7, concerned: 16, calm: 43, satisfied: 28,
      toneSummary:
        'Tenants are largely satisfied. Frustration clusters on repeat HVAC reports from Tower A — ' +
        'the agent now links a new report to the open work order instead of raising a duplicate.',
    },
    recentConversation: [...CONVERSATIONS]
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, 8)
      .map((c) => ({
      id: c.id, callId: c.id, name: c.name, time: c.startTime, channelType: c.displayChannel,
    })),
  };

  const INTAKE_SUMMARY = {
    id: 716,
    runnableType: 'AGENT',
    displayName: 'Ava',
    language: 'en-uk',
    languageDisplayName: 'English (UK)',
    greetingMessage: 'professional',
    assistantBehaviour: 'professional-empathetic',
    imageAnalysis: true,
    endOfCallMessage: 'with-ticket-id',
    endConditions: ['ticket-confirmed', 'issue-resolved'],
    isCustomPrompt: false,
    voiceProvider: 'DEEPGRAM',
    voiceIdentifier: 'amelia',
    facilioVoiceIdentifier: 'DEEPGRAM_FEMALE_EN_UK_AMELIA',
    whatsappResponseMessage: 'Thanks — logging that now.',
    whatsappInactiveTimeout: 30,
    emailResponseMessage: 'Thanks for your email. I have raised this with the building team.',
    emailInactiveTimeout: 120,
    conversationExamples: [
      { id: 1, promptQuestion: 'A tenant reports no heating',
        systemAnswer: 'Check the AHU serving that floor for an open fault before raising a new work order. Link the report to the existing one if there is a match.' },
      { id: 2, promptQuestion: 'Someone asks for an access card',
        systemAnswer: 'Walk them through the new-joiner form. Do not raise a work order — this is a security desk task.' },
      { id: 3, promptQuestion: 'A caller reports a person trapped in a lift',
        systemAnswer: 'Stop triage. Escalate to the duty engineer immediately and stay on the line.' },
      { id: 4, promptQuestion: 'A tenant asks about the service charge',
        systemAnswer: 'Answer from the handbook only. Anything account-specific goes to the property manager.' },
    ],
    scopes: ['documentation-only', 'confirm-location', 'no-vendor-eta', 'safety-escalation', 'link-repeat-reports'],
    keyterms: 'AHU, FCU, BMS, chilled water, riser, turnstile, service charge, dilapidations',
    voiceChannelIds: [21], whatsappChannelIds: [31], emailChannelIds: [41], webChatWidgetChannelIds: [51],
  };

  // The Intake page's chip sources. Greeting and Behaviour are the product's
  // real presets; scopes feed the Scope Library modal, which filters items by
  // `categoryId` against the `categories` list below.
  const INTAKE_CONFIG = {
    greetings: [
      { key: 'enthusiastic', label: 'Enthusiastic', icon: { group: 'social', name: 'announcements' },
        text: 'Open with energy — greet the caller warmly, sound pleased to help, and invite them to describe the problem.' },
      { key: 'neutral', label: 'Neutral', icon: { group: 'smart-controls', name: 'medium-speed' },
        text: 'A plain, even greeting: identify the helpdesk, give your name, ask what they need.' },
      { key: 'professional', label: 'Professional', icon: { group: 'modules', name: 'vendor' },
        text: 'Greet the caller courteously and businesslike: name the organisation and the agent, then move straight to the request.' },
      { key: 'direct', label: 'Direct', icon: { group: 'analytics', name: 'insight' },
        text: 'Skip the pleasantries. Identify the helpdesk in one line and ask what has happened.' },
      { key: 'empathetic', label: 'Empathetic', icon: { group: 'social', name: 'heart' },
        text: 'Acknowledge that something has gone wrong before anything else, then ask for the detail you need.' },
      { key: 'calm', label: 'Calm', icon: { group: 'emoji', name: 'happy-level-4' },
        text: 'Steady and unhurried — reassure the caller they have reached the right place and that you will take it from here.' },
      { key: 'crisp', label: 'Crisp', icon: { group: 'action', name: 'flash' },
        text: 'Short and efficient: helpdesk name, agent name, one question. No filler.' },
    ],
    behaviours: [
      { key: 'professional-empathetic', label: 'Professional & Empathetic', icon: { group: 'modules', name: 'vendor' },
        text: 'Businesslike but human. Acknowledge the inconvenience once, then move to action. Explain what happens next in plain language.' },
      { key: 'friendly-casual', label: 'Friendly & Casual', icon: { group: 'social', name: 'announcements' },
        text: 'Conversational and relaxed. Contractions are fine, jargon is not. Keep it light without being flippant about a real problem.' },
      { key: 'formal-precise', label: 'Formal & Precise', icon: { group: 'action', name: 'target' },
        text: 'Formal register, exact wording. Quote the policy or SOP you are working from and avoid approximations.' },
      { key: 'calm-reassuring', label: 'Calm & Reassuring', icon: { group: 'emoji', name: 'happy-level-4' },
        text: 'Unhurried and steady, especially when the caller is stressed. Confirm you have understood before acting, and say what happens next.' },
      { key: 'assertive-efficient', label: 'Assertive & Efficient', icon: { group: 'smart-controls', name: 'high-speed' },
        text: 'Drive the conversation. Ask the one question that unblocks the ticket, confirm, and close. Never more than three sentences at a time.' },
    ],
    scopes: [
      // Guardrails
      { id: 's1', key: 'documentation-only', label: 'Answer from documentation only',
        description: 'Never invent a policy, price or date. If it is not in scope, say so and offer to raise a request.',
        category: 'Guardrails', categoryId: 'guardrails', emoji: '📘',
        text: 'Answer only from Northgate documentation. If the answer is not there, say so plainly and offer to raise a request rather than guessing.' },
      { id: 's2', key: 'safety-escalation', label: 'Escalate safety immediately',
        description: 'Smoke, water near electrics, or a person trapped goes straight to the duty engineer.',
        category: 'Guardrails', categoryId: 'guardrails', emoji: '🚨',
        text: 'Escalate anything involving smoke, gas, water near live electrics, or a person trapped straight to the duty engineer, with no triage questions first.' },
      { id: 's3', key: 'billing-to-manager', label: 'Billing goes to the manager',
        description: 'Account-specific charges are answered by the property manager, not the agent.',
        category: 'Guardrails', categoryId: 'guardrails', emoji: '💷',
        text: 'Answer service-charge questions from the handbook only. Anything account-specific goes to the property manager.' },
      { id: 's4', key: 'no-legal-advice', label: 'No lease or legal interpretation',
        description: 'Lease terms, dilapidations and liability are for the property manager.',
        category: 'Guardrails', categoryId: 'guardrails', emoji: '⚖️',
        text: 'Do not interpret lease terms, liability or dilapidations. Acknowledge the question and route it to the property manager.' },

      // Work orders
      { id: 's5', key: 'confirm-location', label: 'Confirm tower and floor',
        description: 'Every work order needs a location the technician can find.',
        category: 'Work orders', categoryId: 'work-orders', emoji: '📍',
        text: 'Confirm the tower and floor before raising work. If the caller cannot say, ask for the nearest room number or lift lobby.' },
      { id: 's6', key: 'no-vendor-eta', label: 'No third-party ETAs',
        description: 'Give the SLA response window instead of a completion time.',
        category: 'Work orders', categoryId: 'work-orders', emoji: '⏱️',
        text: 'Never quote a completion time for a third-party contractor. Give the contracted response window and say when the next update will come.' },
      { id: 's7', key: 'link-repeat-reports', label: 'Link repeat reports',
        description: 'A second report on the same asset joins the open work order instead of duplicating it.',
        category: 'Work orders', categoryId: 'work-orders', emoji: '🔗',
        text: 'If an open work order already covers the same asset and fault, link the report to it and tell the caller the existing reference rather than raising a duplicate.' },
      { id: 's8', key: 'asset-before-raise', label: 'Name the asset where you can',
        description: 'An asset reference routes the job to the right contract and history.',
        category: 'Work orders', categoryId: 'work-orders', emoji: '🏷️',
        text: 'Where the fault names equipment, look the asset up and attach it to the work order — that is what routes it to the right contract.' },
      { id: 's9', key: 'photo-for-damage', label: 'Ask for a photo on damage',
        description: 'A photo settles severity faster than three questions.',
        category: 'Work orders', categoryId: 'work-orders', emoji: '📷',
        text: 'For visible damage — stains, cracks, spills, broken fittings — ask for one photo before raising. It usually removes the need for a scoping visit.' },

      // Escalation
      { id: 's10', key: 'out-of-hours-routing', label: 'Out-of-hours routing',
        description: 'Overnight, only High and above wake the duty engineer.',
        category: 'Escalation', categoryId: 'escalation', emoji: '🌙',
        text: 'Between 19:00 and 07:00, queue anything below High for the morning and tell the caller when it will be picked up. High and above pages the duty engineer.' },
      { id: 's11', key: 'human-handoff', label: 'Hand off when asked',
        description: 'A request for a person is honoured immediately, not negotiated.',
        category: 'Escalation', categoryId: 'escalation', emoji: '🙋',
        text: 'If the caller asks for a person, hand off without trying to resolve it first. Summarise what you have gathered so they do not repeat themselves.' },
      { id: 's12', key: 'third-report-flag', label: 'Flag the third report',
        description: 'Three reports on one asset in a day stops being a maintenance job.',
        category: 'Escalation', categoryId: 'escalation', emoji: '🔥',
        text: 'Three or more reports on the same asset within 24 hours goes to the facilities manager, whatever the urgency.' },

      // Communication
      { id: 's13', key: 'acknowledge-once', label: 'Acknowledge once, then act',
        description: 'One apology, then the next useful thing.',
        category: 'Communication', categoryId: 'communication', emoji: '💬',
        text: 'Acknowledge the inconvenience once and move to action. Repeated apologies read as stalling.' },
      { id: 's14', key: 'always-give-reference', label: 'Always give the reference',
        description: 'Every raised job ends with its number and what happens next.',
        category: 'Communication', categoryId: 'communication', emoji: '🔖',
        text: 'Close every request that raises work with the reference, the response window, and who will be in touch.' },
      { id: 's15', key: 'plain-language', label: 'Plain language, no jargon',
        description: 'AHU, FCU and BMS mean nothing to a tenant.',
        category: 'Communication', categoryId: 'communication', emoji: '🗣️',
        text: 'Explain in plain language. Use equipment names only when the caller used them first, or when naming the asset helps them.' },

      // Knowledge
      { id: 's16', key: 'handbook-first', label: 'Handbook before improvisation',
        description: 'Building rules come from the tenant handbook, verbatim.',
        category: 'Knowledge', categoryId: 'knowledge', emoji: '📗',
        text: 'For access, parking, waste, deliveries and building hours, answer from the tenant handbook and quote it closely rather than paraphrasing loosely.' },
      { id: 's17', key: 'cite-the-source', label: 'Say where an answer came from',
        description: 'Naming the source makes the answer checkable.',
        category: 'Knowledge', categoryId: 'knowledge', emoji: '📎',
        text: 'When answering from a document, name it — "the tenant handbook says" — so the tenant can check it themselves.' },
    ],
    categories: [
      { id: 'guardrails', label: 'Guardrails', icon: { group: 'webtabs', name: 'safety_plan' } },
      { id: 'work-orders', label: 'Work orders', icon: { group: 'modules', name: 'vendor' } },
      { id: 'escalation', label: 'Escalation', icon: { group: 'action', name: 'flash' } },
      { id: 'communication', label: 'Communication', icon: { group: 'communication', name: 'mail' } },
      { id: 'knowledge', label: 'Knowledge', icon: { group: 'action', name: 'guides' } },
    ],
    voices: [
      { name: 'DEEPGRAM_FEMALE_EN_UK_AMELIA',                 displayName: 'Amelia',      gender: 'female', 
        language: 'en-uk',     provider: 'DEEPGRAM',    voiceId: 'amelia',      description: 'Warm, natural British female voice well suited to support conversations' },
      { name: 'DEEPGRAM_FEMALE_EN_UK_BEATRICE',                 displayName: 'Beatrice',    gender: 'female', 
        language: 'en-uk',     provider: 'DEEPGRAM',    voiceId: 'beatrice',    description: 'Measured, steady female voice with a calm, unhurried delivery' },
      { name: 'DEEPGRAM_FEMALE_EN_UK_IMOGEN',                 displayName: 'Imogen',      gender: 'female', 
        language: 'en-uk',     provider: 'DEEPGRAM',    voiceId: 'imogen',      description: 'Bright, engaging British female voice with an easy conversational flow' },
      { name: 'DEEPGRAM_MALE_EN_UK_CALLUM',                   displayName: 'Callum',      gender: 'male',   
        language: 'en-uk',     provider: 'DEEPGRAM',    voiceId: 'callum',      description: 'Calm, even-toned male voice that holds its pace under pressure' },
      { name: 'DEEPGRAM_MALE_EN_UK_RUPERT',                   displayName: 'Rupert',      gender: 'male',   
        language: 'en-uk',     provider: 'DEEPGRAM',    voiceId: 'rupert',      description: 'Formal, precise British male voice suited to policy and escalation lines' },
      { name: 'DEEPGRAM_MALE_EN_UK_IDRIS',                   displayName: 'Idris',       gender: 'male',   
        language: 'en-uk',     provider: 'DEEPGRAM',    voiceId: 'idris',       description: 'Warm, Reassuring male voice well suited to first-contact calls' },
      { name: 'DEEPGRAM_FEMALE_EN_US_NORA',                 displayName: 'Nora',        gender: 'female', 
        language: 'en-us',     provider: 'DEEPGRAM',    voiceId: 'nora',        description: 'Bright, energetic American female voice with a clear, quick cadence' },
      { name: 'DEEPGRAM_FEMALE_EN_US_HARPER',                 displayName: 'Harper',      gender: 'female', 
        language: 'en-us',     provider: 'DEEPGRAM',    voiceId: 'harper',      description: 'Friendly, natural female voice well suited to everyday support replies' },
      { name: 'DEEPGRAM_FEMALE_EN_US_SLOANE',                 displayName: 'Sloane',      gender: 'female', 
        language: 'en-us',     provider: 'DEEPGRAM',    voiceId: 'sloane',      description: 'Crisp, articulate American female voice with a confident delivery' },
      { name: 'DEEPGRAM_MALE_EN_US_MILES',                   displayName: 'Miles',       gender: 'male',   
        language: 'en-us',     provider: 'DEEPGRAM',    voiceId: 'miles',       description: 'Confident, grounded American male voice with an assured delivery' },
      { name: 'DEEPGRAM_MALE_EN_US_BENNETT',                   displayName: 'Bennett',     gender: 'male',   
        language: 'en-us',     provider: 'DEEPGRAM',    voiceId: 'bennett',     description: 'Calm, soft-spoken male voice with a gentle, unhurried pace' },
      { name: 'DEEPGRAM_MALE_EN_US_COLE',                   displayName: 'Cole',        gender: 'male',   
        language: 'en-us',     provider: 'DEEPGRAM',    voiceId: 'cole',        description: 'Upbeat, engaging American male voice suited to short, quick exchanges' },
      { name: 'DEEPGRAM_FEMALE_EN_AU_MATILDA',                 displayName: 'Matilda',     gender: 'female', 
        language: 'en-au',     provider: 'DEEPGRAM',    voiceId: 'matilda',     description: 'Relaxed, natural Australian female voice with an easy, open delivery' },
      { name: 'DEEPGRAM_FEMALE_EN_AU_SIENNA',                 displayName: 'Sienna',      gender: 'female', 
        language: 'en-au',     provider: 'DEEPGRAM',    voiceId: 'sienna',      description: 'Warm, approachable female voice well suited to empathetic conversations' },
      { name: 'DEEPGRAM_FEMALE_EN_AU_FREYA',                 displayName: 'Freya',       gender: 'female', 
        language: 'en-au',     provider: 'DEEPGRAM',    voiceId: 'freya',       description: 'Clear, bright Australian female voice with a crisp, even cadence' },
      { name: 'DEEPGRAM_MALE_EN_AU_ANGUS',                   displayName: 'Angus',       gender: 'male',   
        language: 'en-au',     provider: 'DEEPGRAM',    voiceId: 'angus',       description: 'Easy-going Australian male voice with a relaxed, conversational flow' },
      { name: 'DEEPGRAM_MALE_EN_AU_BLAKE',                   displayName: 'Blake',       gender: 'male',   
        language: 'en-au',     provider: 'DEEPGRAM',    voiceId: 'blake',       description: 'Steady, even male voice that stays level through long calls' },
      { name: 'DEEPGRAM_MALE_EN_AU_JARRAH',                   displayName: 'Jarrah',      gender: 'male',   
        language: 'en-au',     provider: 'DEEPGRAM',    voiceId: 'jarrah',      description: 'Friendly, warm Australian male voice well suited to first-line support' },
      { name: 'ELEVENLABS_FEMALE_EN_AE_LAYLA',               displayName: 'Layla',       gender: 'female', 
        language: 'en-ae',     provider: 'ELEVENLABS',  voiceId: 'layla',       description: 'Warm, natural English female voice with a soft Gulf cadence' },
      { name: 'ELEVENLABS_FEMALE_EN_AE_NOOR',               displayName: 'Noor',        gender: 'female', 
        language: 'en-ae',     provider: 'ELEVENLABS',  voiceId: 'noor',        description: 'Clear, articulate female voice well suited to instructions and handovers' },
      { name: 'ELEVENLABS_FEMALE_EN_AE_MARIAM',               displayName: 'Mariam',      gender: 'female', 
        language: 'en-ae',     provider: 'ELEVENLABS',  voiceId: 'mariam',      description: 'Measured, composed English female voice with a calm, formal tone' },
      { name: 'ELEVENLABS_MALE_EN_AE_OMAR',                 displayName: 'Omar',        gender: 'male',   
        language: 'en-ae',     provider: 'ELEVENLABS',  voiceId: 'omar',        description: 'Calm, steady English male voice with an unhurried, patient pace' },
      { name: 'ELEVENLABS_MALE_EN_AE_RASHID',                 displayName: 'Rashid',      gender: 'male',   
        language: 'en-ae',     provider: 'ELEVENLABS',  voiceId: 'rashid',      description: 'Confident, assured English male voice well suited to escalation calls' },
      { name: 'ELEVENLABS_MALE_EN_AE_ZAYD',                 displayName: 'Zayd',        gender: 'male',   
        language: 'en-ae',     provider: 'ELEVENLABS',  voiceId: 'zayd',        description: 'Friendly, open male voice with a light, conversational Gulf accent' },
      { name: 'ELEVENLABS_FEMALE_EN_AR_AE_SALMA',            displayName: 'Salma',       gender: 'female', 
        language: 'en-ar-ae',  provider: 'ELEVENLABS',  voiceId: 'salma',       description: 'Warm bilingual female voice that moves cleanly between English and Arabic' },
      { name: 'ELEVENLABS_FEMALE_EN_AR_AE_DANA',            displayName: 'Dana',        gender: 'female', 
        language: 'en-ar-ae',  provider: 'ELEVENLABS',  voiceId: 'dana',        description: 'Clear, bright bilingual female voice well suited to mixed-language calls' },
      { name: 'ELEVENLABS_FEMALE_EN_AR_AE_HESSA',            displayName: 'Hessa',       gender: 'female', 
        language: 'en-ar-ae',  provider: 'ELEVENLABS',  voiceId: 'hessa',       description: 'Calm, gentle bilingual female voice with an unhurried, steady pace' },
      { name: 'ELEVENLABS_MALE_EN_AR_AE_TARIQ',              displayName: 'Tariq',       gender: 'male',   
        language: 'en-ar-ae',  provider: 'ELEVENLABS',  voiceId: 'tariq',       description: 'Measured bilingual male voice that switches between English and Arabic' },
      { name: 'ELEVENLABS_MALE_EN_AR_AE_FAISAL',              displayName: 'Faisal',      gender: 'male',   
        language: 'en-ar-ae',  provider: 'ELEVENLABS',  voiceId: 'faisal',      description: 'Confident, clear bilingual male voice well suited to escalation lines' },
      { name: 'ELEVENLABS_MALE_EN_AR_AE_KHALID',              displayName: 'Khalid',      gender: 'male',   
        language: 'en-ar-ae',  provider: 'ELEVENLABS',  voiceId: 'khalid',      description: 'Warm, natural bilingual male voice with an easy conversational flow' },
      { name: 'ELEVENLABS_FEMALE_AR_EG_NADIA',               displayName: 'Nadia',       gender: 'female', 
        language: 'ar-eg',     provider: 'ELEVENLABS',  voiceId: 'nadia',       description: 'Warm, natural Egyptian Arabic female voice suited to support calls' },
      { name: 'ELEVENLABS_FEMALE_AR_EG_YASMIN',               displayName: 'Yasmin',      gender: 'female', 
        language: 'ar-eg',     provider: 'ELEVENLABS',  voiceId: 'yasmin',      description: 'Bright, engaging Egyptian Arabic female voice with a lively cadence' },
      { name: 'ELEVENLABS_FEMALE_AR_EG_FARIDA',               displayName: 'Farida',      gender: 'female', 
        language: 'ar-eg',     provider: 'ELEVENLABS',  voiceId: 'farida',      description: 'Calm, gentle female voice with a soft, unhurried Egyptian accent' },
      { name: 'ELEVENLABS_MALE_AR_EG_KARIM',                 displayName: 'Karim',       gender: 'male',   
        language: 'ar-eg',     provider: 'ELEVENLABS',  voiceId: 'karim',       description: 'Friendly, open Egyptian Arabic male voice well suited to intake calls' },
      { name: 'ELEVENLABS_MALE_AR_EG_HOSSAM',                 displayName: 'Hossam',      gender: 'male',   
        language: 'ar-eg',     provider: 'ELEVENLABS',  voiceId: 'hossam',      description: 'Measured, composed male voice with a steady, deliberate delivery' },
      { name: 'ELEVENLABS_MALE_AR_EG_SHERIF',                 displayName: 'Sherif',      gender: 'male',   
        language: 'ar-eg',     provider: 'ELEVENLABS',  voiceId: 'sherif',      description: 'Confident, Clear Egyptian Arabic male voice with an assured tone' },
      { name: 'ELEVENLABS_FEMALE_AR_AE_ALIA',               displayName: 'Alia',        gender: 'female', 
        language: 'ar-ae',     provider: 'ELEVENLABS',  voiceId: 'alia',        description: 'Warm, natural Emirati Arabic female voice well suited to support calls' },
      { name: 'ELEVENLABS_FEMALE_AR_AE_SHAMMA',               displayName: 'Shamma',      gender: 'female', 
        language: 'ar-ae',     provider: 'ELEVENLABS',  voiceId: 'shamma',      description: 'Clear, articulate Emirati female voice with a crisp, even delivery' },
      { name: 'ELEVENLABS_FEMALE_AR_AE_MAITHA',               displayName: 'Maitha',      gender: 'female', 
        language: 'ar-ae',     provider: 'ELEVENLABS',  voiceId: 'maitha',      description: 'Gentle, soft-spoken female voice with a patient, unhurried pace' },
      { name: 'ELEVENLABS_MALE_AR_AE_SAEED',                 displayName: 'Saeed',       gender: 'male',   
        language: 'ar-ae',     provider: 'ELEVENLABS',  voiceId: 'saeed',       description: 'Calm, steady Emirati Arabic male voice with an even, level tone' },
      { name: 'ELEVENLABS_MALE_AR_AE_HAMDAN',                 displayName: 'Hamdan',      gender: 'male',   
        language: 'ar-ae',     provider: 'ELEVENLABS',  voiceId: 'hamdan',      description: 'Formal, precise male voice suited to policy and compliance replies' },
      { name: 'ELEVENLABS_MALE_AR_AE_MAJID',                 displayName: 'Majid',       gender: 'male',   
        language: 'ar-ae',     provider: 'ELEVENLABS',  voiceId: 'majid',       description: 'Friendly, warm Emirati Arabic male voice with an open, easy manner' },
      { name: 'ELEVENLABS_FEMALE_AR_SA_REEM',               displayName: 'Reem',        gender: 'female', 
        language: 'ar-sa',     provider: 'ELEVENLABS',  voiceId: 'reem',        description: 'Measured, composed Saudi Arabic female voice with a calm, formal tone' },
      { name: 'ELEVENLABS_FEMALE_AR_SA_LAMIA',               displayName: 'Lamia',       gender: 'female', 
        language: 'ar-sa',     provider: 'ELEVENLABS',  voiceId: 'lamia',       description: 'Warm, approachable female voice well suited to empathetic replies' },
      { name: 'ELEVENLABS_FEMALE_AR_SA_JAWAHER',               displayName: 'Jawaher',     gender: 'female', 
        language: 'ar-sa',     provider: 'ELEVENLABS',  voiceId: 'jawaher',     description: 'Clear, bright Saudi Arabic female voice with a crisp, even cadence' },
      { name: 'ELEVENLABS_MALE_AR_SA_ABDULLAH',                 displayName: 'Abdullah',    gender: 'male',   
        language: 'ar-sa',     provider: 'ELEVENLABS',  voiceId: 'abdullah',    description: 'Formal, authoritative Saudi Arabic male voice with a precise delivery' },
      { name: 'ELEVENLABS_MALE_AR_SA_TURKI',                 displayName: 'Turki',       gender: 'male',   
        language: 'ar-sa',     provider: 'ELEVENLABS',  voiceId: 'turki',       description: 'Calm, grounded male voice that holds a steady pace through long calls' },
      { name: 'ELEVENLABS_MALE_AR_SA_BANDAR',                 displayName: 'Bandar',      gender: 'male',   
        language: 'ar-sa',     provider: 'ELEVENLABS',  voiceId: 'bandar',      description: 'Confident, assured Saudi Arabic male voice suited to escalation lines' },
      { name: 'ELEVENLABS_FEMALE_HI_IN_ADITI',               displayName: 'Aditi',       gender: 'female', 
        language: 'hi-in',     provider: 'ELEVENLABS',  voiceId: 'aditi',       description: 'Warm, natural Hindi female voice well suited to support conversations' },
      { name: 'ELEVENLABS_FEMALE_HI_IN_KAVYA',               displayName: 'Kavya',       gender: 'female', 
        language: 'hi-in',     provider: 'ELEVENLABS',  voiceId: 'kavya',       description: 'Bright, engaging Hindi female voice with an easy conversational flow' },
      { name: 'ELEVENLABS_FEMALE_HI_IN_MEERA',               displayName: 'Meera',       gender: 'female', 
        language: 'hi-in',     provider: 'ELEVENLABS',  voiceId: 'meera',       description: 'Calm, soft-spoken female voice with an unhurried, gentle pace' },
      { name: 'ELEVENLABS_MALE_HI_IN_ROHAN',                 displayName: 'Rohan',       gender: 'male',   
        language: 'hi-in',     provider: 'ELEVENLABS',  voiceId: 'rohan',       description: 'Friendly, open Hindi male voice well suited to first-line support' },
      { name: 'ELEVENLABS_MALE_HI_IN_ARJUN',                 displayName: 'Arjun',       gender: 'male',   
        language: 'hi-in',     provider: 'ELEVENLABS',  voiceId: 'arjun',       description: 'Measured, steady Hindi male voice with a deliberate, even delivery' },
      { name: 'ELEVENLABS_MALE_HI_IN_VIKRAM',                 displayName: 'Vikram',      gender: 'male',   
        language: 'hi-in',     provider: 'ELEVENLABS',  voiceId: 'vikram',      description: 'Confident, clear Hindi male voice well suited to escalation calls' },
      { name: 'ELEVENLABS_FEMALE_TA_IN_ANITHA',               displayName: 'Anitha',      gender: 'female', 
        language: 'ta-in',     provider: 'ELEVENLABS',  voiceId: 'anitha',      description: 'Warm, natural Tamil female voice well suited to support conversations' },
      { name: 'ELEVENLABS_FEMALE_TA_IN_DIVYA',               displayName: 'Divya',       gender: 'female', 
        language: 'ta-in',     provider: 'ELEVENLABS',  voiceId: 'divya',       description: 'Clear, articulate Tamil female voice with a crisp, even cadence' },
      { name: 'ELEVENLABS_FEMALE_TA_IN_KALAIVANI',               displayName: 'Kalaivani',   gender: 'female', 
        language: 'ta-in',     provider: 'ELEVENLABS',  voiceId: 'kalaivani',   description: 'Measured, composed female voice with a calm, deliberate delivery' },
      { name: 'ELEVENLABS_MALE_TA_IN_KARTHIK',                 displayName: 'Karthik',     gender: 'male',   
        language: 'ta-in',     provider: 'ELEVENLABS',  voiceId: 'karthik',     description: 'Calm, steady Tamil male voice with an even, patient tone' },
      { name: 'ELEVENLABS_MALE_TA_IN_SENTHIL',                 displayName: 'Senthil',     gender: 'male',   
        language: 'ta-in',     provider: 'ELEVENLABS',  voiceId: 'senthil',     description: 'Friendly, engaging Tamil male voice with an open, easy manner' },
      { name: 'ELEVENLABS_MALE_TA_IN_VETRI',                 displayName: 'Vetri',       gender: 'male',   
        language: 'ta-in',     provider: 'ELEVENLABS',  voiceId: 'vetri',       description: 'Confident, assured Tamil male voice suited to escalation lines' },
    ],
    endConditions: [
      { key: 'goodbye', label: 'Goodbye',
        text: 'End the conversation when the caller says goodbye or signs off.' },
      { key: 'ticket-confirmed', label: 'Ticket confirmed',
        text: 'End once the ticket is raised and the caller has heard the reference.' },
      { key: 'issue-resolved', label: 'Issue Resolved',
        text: 'End when the question is answered and no work is needed.' },
      { key: 'silence-timeout', label: 'Silence timeout',
        text: 'End after a long silence with no response from the caller.' },
    ],
    closingMessages: [
      { key: 'with-ticket-id', label: 'With Ticket ID',
        text: "That's logged as {{ticketId}}. The building team will pick it up from here." },
      { key: 'simple-goodbye', label: 'Simple Goodbye',
        text: 'Thanks for calling Northgate. Goodbye.' },
      { key: 'email-confirmation', label: 'Email confirmation',
        text: "I've sent a confirmation to your email with the reference and what happens next." },
      { key: 'dispatch-notice', label: 'Dispatch notice',
        text: 'An engineer has been assigned and will attend within the response window.' },
    ],
  };


  // The tenant directory: the people who raise requests (several per letter),
  // Northgate's own staff, and the contractors who answer the work. Every
  // ticket requester and inbox participant resolves to a row here.
  const CONTACTS = [
    { id: '900', name: 'Adrian Cole', phone: '+44 7700 902601', email: 'a.cole@merton.example', sysCreatedTime: ago(64 * DAY) },
    { id: '901', name: 'Aisha Khan', phone: '+44 7700 902602', email: 'a.khan@silverlane.example', sysCreatedTime: ago(31 * DAY) },
    { id: '902', name: 'Amelia Barnes', phone: '+44 7700 901022', email: 'a.barnes@quaystone.example', sysCreatedTime: ago(75 * DAY) },
    { id: '903', name: 'Anika Sharma', phone: '+44 7700 901923', email: 'a.sharma@penrose.example', sysCreatedTime: ago(23 * DAY) },
    { id: '904', name: 'Beatriz Salgado', phone: '+44 7700 901701', email: 'b.salgado@wrenfield.example', sysCreatedTime: ago(34 * DAY) },
    { id: '905', name: 'Ben Okonkwo', phone: '+44 7700 902603', email: 'b.okonkwo@aldergrove.example', sysCreatedTime: ago(58 * DAY) },
    { id: '906', name: 'Bridget Nolan', phone: '+44 7700 902604', email: 'b.nolan@thornbury.example', sysCreatedTime: ago(26 * DAY) },
    { id: '907', name: 'Callum Findlay', phone: '+44 7700 901478', email: 'c.findlay@brightmoor.example', sysCreatedTime: ago(56 * DAY) },
    { id: '908', name: 'Carmen Ruiz', phone: '+44 7700 902605', email: 'c.ruiz@calderwood.example', sysCreatedTime: ago(45 * DAY) },
    { id: '909', name: 'Chris Aitken', phone: '+44 7700 902606', email: 'c.aitken@kestrel.example', sysCreatedTime: ago(19 * DAY) },
    { id: '910', name: 'Clara Winslow', phone: '+44 161 496 0088', email: 'c.winslow@northgate.example', sysCreatedTime: ago(110 * DAY) },
    { id: '911', name: 'Daniel Osei', phone: '+44 7700 900977', email: 'd.osei@harrowfield.example', sysCreatedTime: ago(9 * DAY) },
    { id: '912', name: "Dara O'Connell", phone: '+44 7700 902607', email: 'd.oconnell@nordbrook.example', sysCreatedTime: ago(52 * DAY) },
    { id: '913', name: 'Dominic Hale', phone: '+44 7700 902608', email: 'd.hale@vantage.example', sysCreatedTime: ago(29 * DAY) },
    { id: '914', name: 'Elena Petrova', phone: '+44 7700 902609', email: 'e.petrova@marchmont.example', sysCreatedTime: ago(37 * DAY) },
    { id: '915', name: 'Emeka Nwosu', phone: '+44 7700 902610', email: 'e.nwosu@bellhaus.example', sysCreatedTime: ago(14 * DAY) },
    { id: '916', name: 'Eoin Gallagher', phone: '+44 7700 901812', email: 'e.gallagher@thornbury.example', sysCreatedTime: ago(27 * DAY) },
    { id: '917', name: 'Farah Haddad', phone: '+44 7700 901367', email: 'f.haddad@silverlane.example', sysCreatedTime: ago(67 * DAY) },
    { id: '918', name: 'Felix Braun', phone: '+44 7700 902611', email: 'f.braun@ashgrove.example', sysCreatedTime: ago(48 * DAY) },
    { id: '919', name: 'Fiona Greaves', phone: '+44 7700 902612', email: 'f.greaves@penrose.example', sysCreatedTime: ago(22 * DAY) },
    { id: '920', name: 'Gareth Powell', phone: '+44 7700 902613', email: 'g.powell@stanfield.example', sysCreatedTime: ago(61 * DAY) },
    { id: '921', name: 'Gita Mehra', phone: '+44 7700 902614', email: 'g.mehra@fairweather.example', sysCreatedTime: ago(33 * DAY) },
    { id: '922', name: 'Grace Mbeki', phone: '+44 7700 900620', email: 'g.mbeki@lumenpartners.example', sysCreatedTime: ago(18 * DAY) },
    { id: '923', name: 'Hannah Doyle', phone: '+44 7700 902615', email: 'h.doyle@kingsmere.example', sysCreatedTime: ago(20 * DAY) },
    { id: '924', name: 'Helena Marsh', phone: '+44 20 7946 0110', email: 'h.marsh@northgate.example', sysCreatedTime: ago(160 * DAY) },
    { id: '925', name: 'Hiroshi Tanaka', phone: '+44 7700 901690', email: 'h.tanaka@ashgrove.example', sysCreatedTime: ago(41 * DAY) },
    { id: '926', name: 'Idris Rahman', phone: '+44 7700 902256', email: 'i.rahman@kingsmere.example', sysCreatedTime: ago(7 * DAY) },
    { id: '927', name: 'Ines Ferreira', phone: '+44 7700 901589', email: 'i.ferreira@calderwood.example', sysCreatedTime: ago(49 * DAY) },
    { id: '928', name: 'Isabel Moreno', phone: '+44 7700 902616', email: 'i.moreno@quaystone.example', sysCreatedTime: ago(55 * DAY) },
    { id: '929', name: 'Jamie Alvarez', phone: '+44 7700 900311', email: 'j.alvarez@merton.example', sysCreatedTime: ago(60 * DAY) },
    { id: '930', name: 'Jonas Lindberg', phone: '+44 7700 902618', email: 'j.lindberg@nordbrook.example', sysCreatedTime: ago(25 * DAY) },
    { id: '931', name: 'Josephine Achebe', phone: '+44 7700 902617', email: 'j.achebe@wrenfield.example', sysCreatedTime: ago(39 * DAY) },
    { id: '932', name: 'Julia Stanton', phone: '+44 7700 902619', email: 'j.stanton@brightmoor.example', sysCreatedTime: ago(12 * DAY) },
    { id: '933', name: 'Katarzyna Nowak', phone: '+44 7700 902620', email: 'k.nowak@vantage.example', sysCreatedTime: ago(44 * DAY) },
    { id: '934', name: 'Keir Sutherland', phone: '+44 7700 902621', email: 'k.sutherland@marchmont.example', sysCreatedTime: ago(17 * DAY) },
    { id: '935', name: 'Kwame Adeyemi', phone: '+44 7700 900733', email: 'k.adeyemi@bellhaus.example', sysCreatedTime: ago(21 * DAY) },
    { id: '936', name: 'Leila Karam', phone: '+44 7700 902622', email: 'l.karam@harrowfield.example', sysCreatedTime: ago(53 * DAY) },
    { id: '937', name: 'Liam Prescott', phone: '+44 7700 902623', email: 'l.prescott@aldergrove.example', sysCreatedTime: ago(28 * DAY) },
    { id: '938', name: 'Lucas Moreau', phone: '+44 7700 902034', email: 'l.moreau@fairweather.example', sysCreatedTime: ago(16 * DAY) },
    { id: '939', name: 'Marcus Chen', phone: '+44 7700 900412', email: 'm.chen@aldergrove.example', sysCreatedTime: ago(44 * DAY) },
    { id: '940', name: 'Martina Kovac', phone: '+44 7700 902367', email: 'm.kovac@stanfield.example', sysCreatedTime: ago(5 * DAY) },
    { id: '941', name: 'Mateo Duarte', phone: '+44 7700 902624', email: 'm.duarte@penrose.example', sysCreatedTime: ago(36 * DAY) },
    { id: '942', name: 'Meera Iyer', phone: '+44 7700 902625', email: 'm.iyer@kestrel.example', sysCreatedTime: ago(10 * DAY) },
    { id: '943', name: 'Nadia Ellis', phone: '+44 7700 901144', email: 'n.ellis@elliscleaning.example', sysCreatedTime: ago(38 * DAY) },
    { id: '944', name: 'Niall Brennan', phone: '+44 7700 902626', email: 'n.brennan@thornbury.example', sysCreatedTime: ago(50 * DAY) },
    { id: '945', name: 'Nora Fitzgerald', phone: '+44 7700 902627', email: 'n.fitzgerald@silverlane.example', sysCreatedTime: ago(15 * DAY) },
    { id: '946', name: 'Olga Sorokina', phone: '+44 7700 902628', email: 'o.sorokina@calderwood.example', sysCreatedTime: ago(42 * DAY) },
    { id: '947', name: 'Oliver Trent', phone: '+44 7700 902629', email: 'o.trent@merton.example', sysCreatedTime: ago(24 * DAY) },
    { id: '948', name: 'Owen Castellano', phone: '+44 20 7946 0102', email: 'o.castellano@northgate.example', sysCreatedTime: ago(150 * DAY) },
    { id: '949', name: 'Paloma Vidal', phone: '+44 7700 902630', email: 'p.vidal@marchmont.example', sysCreatedTime: ago(47 * DAY) },
    { id: '950', name: 'Patrick Lowry', phone: '+44 7700 902631', email: 'p.lowry@ashgrove.example', sysCreatedTime: ago(13 * DAY) },
    { id: '951', name: 'Peter Osei-Bonsu', phone: '+44 161 496 0072', email: 'p.oseibonsu@northgate.example', sysCreatedTime: ago(120 * DAY) },
    { id: '952', name: 'Priya Nowak', phone: '+44 7700 900844', email: 'p.nowak@vantage.example', sysCreatedTime: ago(12 * DAY) },
    { id: '953', name: 'Qasim Latif', phone: '+44 7700 902633', email: 'q.latif@brightmoor.example', sysCreatedTime: ago(30 * DAY) },
    { id: '954', name: 'Quentin Marsh', phone: '+44 7700 902632', email: 'q.marsh@kingsmere.example', sysCreatedTime: ago(57 * DAY) },
    { id: '955', name: 'Rachel Devlin', phone: '+44 7700 900518', email: 'r.devlin@northgate.example', sysCreatedTime: ago(30 * DAY) },
    { id: '956', name: 'Ravi Chandran', phone: '+44 7700 902634', email: 'r.chandran@nordbrook.example', sysCreatedTime: ago(35 * DAY) },
    { id: '957', name: 'Rob Whittaker', phone: '+44 7700 902478', email: 'r.whittaker@cooltechfm.example', sysCreatedTime: ago(96 * DAY) },
    { id: '958', name: 'Rosa Iglesias', phone: '+44 7700 902635', email: 'r.iglesias@quaystone.example', sysCreatedTime: ago(11 * DAY) },
    { id: '959', name: 'Samuel Boateng', phone: '+44 7700 902636', email: 's.boateng@stanfield.example', sysCreatedTime: ago(46 * DAY) },
    { id: '960', name: 'Sara Lindqvist', phone: '+44 7700 902637', email: 's.lindqvist@fairweather.example', sysCreatedTime: ago(18 * DAY) },
    { id: '961', name: 'Sinead Doyle', phone: '+44 7700 902589', email: 's.doyle@konelifts.example', sysCreatedTime: ago(84 * DAY) },
    { id: '962', name: 'Sofia Whitfield', phone: '+44 7700 900254', email: 's.whitfield@kestrel.example', sysCreatedTime: ago(52 * DAY) },
    { id: '963', name: 'Tara Ellison', phone: '+44 7700 902638', email: 't.ellison@penrose.example', sysCreatedTime: ago(32 * DAY) },
    { id: '964', name: 'Theo Marchetti', phone: '+44 7700 902639', email: 't.marchetti@bellhaus.example', sysCreatedTime: ago(8 * DAY) },
    { id: '965', name: 'Tomas Lindqvist', phone: '+44 7700 901256', email: 't.lindqvist@nordbrook.example', sysCreatedTime: ago(88 * DAY) },
    { id: '966', name: 'Ursula Kane', phone: '+44 7700 902640', email: 'u.kane@wrenfield.example', sysCreatedTime: ago(59 * DAY) },
    { id: '967', name: 'Uzo Eze', phone: '+44 7700 902641', email: 'u.eze@harrowfield.example', sysCreatedTime: ago(21 * DAY) },
    { id: '968', name: 'Vanessa Croft', phone: '+44 7700 902643', email: 'v.croft@kestrel.example', sysCreatedTime: ago(6 * DAY) },
    { id: '969', name: 'Victor Almeida', phone: '+44 7700 902642', email: 'v.almeida@marchmont.example', sysCreatedTime: ago(43 * DAY) },
    { id: '970', name: 'Wendy Park', phone: '+44 7700 902645', email: 'w.park@calderwood.example', sysCreatedTime: ago(27 * DAY) },
    { id: '971', name: 'William Achterberg', phone: '+44 7700 902644', email: 'w.achterberg@ashgrove.example', sysCreatedTime: ago(54 * DAY) },
    { id: '972', name: 'Xavier Boulanger', phone: '+44 7700 902646', email: 'x.boulanger@merton.example', sysCreatedTime: ago(40 * DAY) },
    { id: '973', name: 'Ximena Rojas', phone: '+44 7700 902647', email: 'x.rojas@silverlane.example', sysCreatedTime: ago(9 * DAY) },
    { id: '974', name: 'Yasmin Farooq', phone: '+44 7700 902648', email: 'y.farooq@thornbury.example', sysCreatedTime: ago(51 * DAY) },
    { id: '975', name: 'Yusuf Demir', phone: '+44 7700 902649', email: 'y.demir@aldergrove.example', sysCreatedTime: ago(23 * DAY) },
    { id: '976', name: 'Zahra Nasser', phone: '+44 7700 902650', email: 'z.nasser@kingsmere.example', sysCreatedTime: ago(4 * DAY) },
    { id: '977', name: 'Zoe Hartley', phone: '+44 7700 902145', email: 'z.hartley@marchmont.example', sysCreatedTime: ago(11 * DAY) },
  ];

  const PHONE_NUMBERS = [
    { id: 11, phoneNumber: '+44 20 7946 0102', displayName: 'Main reception line', provider: 'TWILIO', status: 'ACTIVE' },
    { id: 12, phoneNumber: '+44 20 7946 0187', displayName: 'Out-of-hours emergency', provider: 'TWILIO', status: 'ACTIVE' },
    { id: 13, phoneNumber: '+44 161 496 0044', displayName: 'Manchester campus', provider: 'TWILIO', status: 'ACTIVE' },
  ];

  // The channel-service endpoints return bare arrays of channel-service rows
  // (channelName / agentId / system …), not the {list} envelope the older
  // assistant endpoints use. Web widgets are the exception: {list}.
  const VOICE_CHANNELS = [
    { id: 21, channelName: 'Main reception line', phoneNumberId: 11, agentId: 716,
      phoneNumber: { id: 11, phoneNumber: '+44 20 7946 0102', countryCode: '+44' },
      trafficType: 'INBOUND', system: false, sipUser: null, sipHost: null, selectionState: 'SELECTED' },
    { id: 22, channelName: 'Out-of-hours emergency', phoneNumberId: 12, agentId: 716,
      phoneNumber: { id: 12, phoneNumber: '+44 20 7946 0187', countryCode: '+44' },
      trafficType: 'INBOUND', system: false, sipUser: null, sipHost: null, selectionState: 'SELECTED' },
    { id: 23, channelName: 'Manchester campus', phoneNumberId: 13, agentId: 716,
      phoneNumber: { id: 13, phoneNumber: '+44 161 496 0044', countryCode: '+44' },
      trafficType: 'INBOUND', system: false, sipUser: null, sipHost: null, selectionState: 'SELECTED' },
  ];

  const WHATSAPP_CHANNELS = [
    { id: 31, channelName: 'Northgate tenants', phoneNumber: '+44 7700 900812',
      agentId: 716, system: false, selectionState: 'SELECTED' },
  ];

  const EMAIL_CHANNELS = [
    { id: 41, channelName: 'Tenant support inbox', fromEmail: 'support@northgate.example',
      toEmail: 'support@northgate.example', agentId: 716, dkimId: 5, system: false, selectionState: 'SELECTED' },
  ];

  const WEBWIDGET_CHANNELS = [
    { id: 51, uuid: 'c0ffee21-4f21-4a0b-9f6a-1d2e3f4a5b6c', widgetName: 'Tenant portal',
      widgetType: 'CHAT', position: 'BOTTOM_RIGHT', subText: 'Ask the Northgate helpdesk',
      logoId: 0, themeColor: '#0059D6', voiceIdentifier: 'amelia', selectionState: 'SELECTED' },
    { id: 52, uuid: 'b17e5a90-2c31-4c2e-8a77-9c0f1b2d3e4f', widgetName: 'Public website',
      widgetType: 'CHAT', position: 'BOTTOM_RIGHT', subText: 'Questions about the building?',
      logoId: 0, themeColor: '#0059D6', voiceIdentifier: 'amelia', selectionState: 'UNSELECTED' },
  ];

  const ASSISTANT = {
    id: 716, name: 'Ava', displayName: 'Ava',
    // The agent's provisioned voice number doubles as the helpdesk's trial
    // number — the "Your Helpdesk Is Ready!" welcome surfaces it.
    phoneNumber: '+16292491775',
    description: 'Northgate tenant helpdesk agent',
    greetingMessage: INTAKE_SUMMARY.greetingMessage,
    behaviour: INTAKE_SUMMARY.assistantBehaviour,
    language: 'en-uk', voiceProvider: 'DEEPGRAM', voiceIdentifier: 'amelia',
    status: 'ACTIVE', sysCreatedTime: ago(120 * DAY),
  };

  const TICKET_META = {
    categories: Object.keys(CATEGORY_NAMES).map((k, i) => ({
      id: i + 1, name: k, displayName: CATEGORY_NAMES[k], sequence: i + 1,
    })),
    types: Object.keys(TYPE_NAMES).map((k, i) => ({
      id: i + 1, name: k, displayName: TYPE_NAMES[k], sequence: i + 1,
    })),
    priorities: Object.keys(URGENCY_NAMES).map((k, i) => ({
      id: i + 1, name: k, displayName: URGENCY_NAMES[k], sequence: i + 1,
      color: ['#c93d3d', '#ff6700', '#607796'][i],
    })),
  };

  const COPILOT_THREADS = [
    { id: 81, title: 'Which sites had the most HVAC tickets last month?', flowThreadId: 81 },
    { id: 82, title: 'Summarise frustrated conversations this week', flowThreadId: 82 },
    { id: 83, title: 'How many tickets did the agent close without a human?', flowThreadId: 83 },
  ];


  // ── Org users, credit usage, integrations ───────────────────────────────
  const user = (uid, name, email, phone) => ({
    orgId: 331, uid, ouid: uid, name, email, username: email,
    photoId: 0, timezone: 'Europe/London', language: 'en', phone, mobile: phone,
    street: null, city: 'London', state: null, zip: null, country: 'GB',
  });

  const USERS = [
    user(4021, 'Mohamed Yameen', 'mohamed@northgate.example', '+44 20 7946 0102'),
    user(4022, 'Helena Marsh', 'helena.marsh@northgate.example', '+44 20 7946 0110'),
    user(4023, 'Owen Castellano', 'owen.c@northgate.example', '+44 20 7946 0114'),
    user(4024, 'Aisha Rahman', 'aisha.rahman@northgate.example', '+44 20 7946 0121'),
  ];

  const CREDIT_LOGS = CONVERSATIONS.map((c, i) => ({
    id: c.id,
    callType: c.type === 'CALL' ? 'INBOUND' : c.type,
    callTypeDisplayName: c.type === 'CALL' ? 'Voice' : c.type === 'CHAT' ? 'Web chat' : 'Email',
    callerPhoneNumber: c.phone || c.email || '—',
    startTime: c.startTime,
    endTime: c.endTime,
    cost: [12, 34, 6, 9, 7, 21][i % 6],
    status: 'COMPLETED',
    summary: c.brief,
    satisfactionLevel: c.satisfactionLevel,
  }));



  // Connector logos are the product's own assets (src/assets/images/datasources),
  // copied into public/logos. Resolved relative to this script so the same URL
  // works at the dev server root and under /helpdesk/ in the build.
  const LOGO_BASE = (function () {
    const el = document.querySelector('script[src*="demo-mock.js"]');
    const src = (el && el.getAttribute('src')) || '/demo-mock.js';
    return src.replace(/demo-mock\.js.*$/, 'logos/');
  })();
  const logo = (file) => LOGO_BASE + file;


  // ── Dispatch policies ───────────────────────────────────────────────────
  // A policy is authored in plain language and the builder decomposes it into
  // four stages the detail view renders: trigger conditions, technician
  // filters (grouped), score weightages (summing to 100) and the assumptions
  // it made. The builder conversation that produced it is kept alongside.
  const cond = (id, policyId, condition) => ({ id, orgId: 331, policyId, condition });
  const work = (id, policyId, description) => ({ id, orgId: 331, policyId, description });
  const filt = (id, policyId, groupName, filter) => ({ id, orgId: 331, policyId, groupName, filter });
  const wt = (id, policyId, propertyId, propertyName, weightage) =>
    ({ id, orgId: 331, policyId, propertyId, propertyName, weightage });

  const POLICIES = [
    {
      id: 61, orgId: 331,
      displayName: 'Life safety — immediate escalation',
      description: 'Fire, gas, entrapment or flood goes straight to the duty engineer on shift, with an SMS to the site manager. 15-minute response.',
      policyInstructions: 'Scope\nThis policy covers anything that puts a person at immediate risk anywhere on the Northgate campus, in any tower, at any hour. It runs before every other dispatch policy and is never skipped for contract or budget reasons.\n\nWhat triggers it\n· A fire alarm activation, or any report of smoke or burning smell.\n· A smell of gas, or a gas detection alarm.\n· A person trapped — in a lift, a plant room, a stairwell, or behind a failed access door.\n· Water in contact with live electrics, a distribution board, or a server room.\n· Any report where the caller says someone is hurt or at risk of being hurt.\n\nWhat it does not cover\nA lift that is out of service with nobody inside is a normal maintenance job, not an entrapment. A leak with no electrical risk follows the plumbing route. Loss of heating or cooling is never life safety, however uncomfortable it is — those go to the HVAC policy.\n\nWho it goes to\nAssign to the engineer on the duty rota for the shift that is running now. If that engineer is already attending another P1, take the next name on the rota rather than stacking two emergencies on one person. Only engineers who hold a current first-response certification and can reach the site within fifteen minutes are eligible.\n\nNotifications\nText the site manager for the ticket\'s building as soon as the assignment is made — not email, and not the general facilities inbox. For fire or gas, also notify the security desk so they can meet the responder at the entrance and hold the lift.\n\nResponse clock\nFifteen minutes to acknowledge and be on the way. The clock starts when the ticket is created, not when it is read.\n\nIf nobody is eligible\nDo not leave the ticket unassigned and do not relax the travel-time rule to find a match. Escalate to the facilities manager immediately so a human decides how to cover it — a slow life-safety response is worse than an interrupted manager.\n\nWhat the caller is told\nConfirm that help is on the way, give the response window, and stay in the conversation until the engineer confirms attendance. Never quote a fix time.',
      priority: 'P1', priorityDisplayName: 'Emergency',
      sysCreatedTime: ago(120 * DAY), sysModifiedTime: ago(9 * DAY),
      policyConditions: [
        cond(1, 61, 'Category is Fire, Gas, Entrapment or Flood'),
        cond(2, 61, 'Urgency is Emergency'),
        cond(3, 61, 'Description mentions smoke, gas, trapped, or water near electrics'),
      ],
      technicianFilters: [
        filt(1, 61, 'Availability', 'On the duty rota for the current shift'),
        filt(2, 61, 'Availability', 'Not already on another P1'),
        filt(3, 61, 'Certification', 'Holds a current first-response certification'),
        filt(4, 61, 'Location', 'Can reach the site within 15 minutes'),
      ],
      scoreWeightages: [
        // Ranking runs on the engine's five factors — the breakdown keys its
        // glyphs off these names (skill / proximity / availability /
        // performance / cost), so fixtures use them verbatim.
        wt(1, 61, 1, 'Skill', 25), wt(2, 61, 2, 'Proximity', 45),
        wt(3, 61, 3, 'Availability', 20), wt(4, 61, 4, 'Performance', 10),
        wt(5, 61, 5, 'Cost', 0),
      ],
      policyWorkings: [
        work(1, 61, 'Assumed the duty rota is the source of truth for who is on shift, not the technician status field.'),
        work(2, 61, 'Assumed the site manager for the ticket location should be notified by SMS, not email.'),
        work(3, 61, 'Contract coverage is deliberately ignored — a life-safety call is attended first and reconciled later.'),
      ],
    },
    {
      id: 62, orgId: 331,
      displayName: 'HVAC — contracted vendor',
      description: 'HVAC tickets on an asset with an active contract go to the contract vendor and link to any open fault on the same asset. 2-hour response.',
      policyInstructions: 'Scope\nApplies to HVAC tickets — heating, cooling, ventilation, air quality — raised against an asset that sits under a live maintenance contract. Covers all six towers plus the Manchester campus.\n\nWhat triggers it\n· Category is HVAC, and\n· the ticket names an asset (AHU, FCU, chiller, or fresh-air unit) whose record carries a contract that has not expired, and\n· urgency is Urgent or Emergency.\n\nRouting\nThe job belongs to the vendor holding that asset\'s contract, not to the in-house team. For Towers A–D this is Cooltech FM; the Manchester units sit with Halton Air. Only technicians belonging to the contract vendor are eligible, and they must hold current chilled-water and AHU-controls competency. If the ticket lands outside contracted service hours, hold it for the start of the next covered window unless the urgency is Emergency, in which case the out-of-hours callout clause applies and the ticket is flagged as chargeable.\n\nLinking\nBefore dispatching, check for an open fault on the same asset raised in the last thirty days. If one exists, link this ticket to it so the vendor sees both together and does not send a second engineer to a job already in progress. A linked repeat does not reset the response clock on the original.\n\nResponse clock\nTwo hours to respond, taken from the contract, not from the ticket urgency. The contract also sets the fix window — do not quote it to the tenant as a promise.\n\nExclusions\nAn HVAC asset with no live contract falls through to the in-house team under standard routing. Comfort complaints with no fault behind them (a room a few degrees warm, one person cold on a floor that is otherwise fine) are logged for the next planned visit rather than dispatched.\n\nWhat the tenant is told\nConfirm the fault, name the response window, and say that the contractor has been notified. Never give the contractor\'s own ETA — we do not control it, and a missed contractor slot reads as our failure.',
      priority: 'HIGH', priorityDisplayName: 'Urgent',
      sysCreatedTime: ago(110 * DAY), sysModifiedTime: ago(4 * DAY),
      policyConditions: [
        cond(4, 62, 'Category is HVAC'),
        cond(5, 62, 'Asset has an active maintenance contract'),
        cond(6, 62, 'Urgency is Urgent or Emergency'),
      ],
      technicianFilters: [
        filt(5, 62, 'Vendor', 'Belongs to the vendor holding the asset contract'),
        filt(6, 62, 'Skills', 'HVAC — chilled water and AHU controls'),
        filt(7, 62, 'Availability', 'Within contracted service hours'),
      ],
      scoreWeightages: [
        wt(6, 62, 1, 'Skill', 40), wt(7, 62, 2, 'Proximity', 10),
        wt(8, 62, 3, 'Availability', 20), wt(9, 62, 4, 'Performance', 20),
        wt(10, 62, 5, 'Cost', 10),
      ],
      policyWorkings: [
        work(4, 62, 'Assumed "active contract" means the asset record carries a contract that has not expired.'),
        work(5, 62, 'Assumed an open fault on the same asset within 30 days is the one to link to.'),
        work(6, 62, 'Response window is taken from the contract, not the ticket urgency.'),
      ],
    },
    {
      id: 63, orgId: 331,
      displayName: 'Out of hours',
      description: 'Between 19:00 and 07:00, anything below High queues for the morning; High and above pages the duty engineer.',
      policyInstructions: 'Scope\nGoverns everything raised between 19:00 and 07:00 site time at any site that is not on 24/7 cover. Manchester and Tower F run their own cover arrangements and are excluded.\n\nWhy it exists\nOvernight the campus runs a skeleton team — one duty engineer and a security desk. Waking that engineer for a routine job costs us the next morning\'s productivity and, under the working-time agreement, can put them out of hours for their day shift.\n\nHow tickets are handled\n· Emergency and High: page the night duty rota straight away.\n· Standard and below: hold in the morning queue, released at 07:00 in the order received. Nothing is lost, nothing is silently deferred.\n· Anything matching the life-safety policy ignores this policy entirely — that one runs first.\n\nRest periods\nAn engineer who has taken a callout must have had the minimum rest period before being eligible for another. If that leaves nobody on the rota, escalate to the on-call facilities manager rather than calling out a technician who is over their hours.\n\nRanking\nPosition on the night rota carries the most weight, then travel time from where the engineer actually is at that hour, then how many callouts they have already taken tonight — the third factor exists so one person does not absorb the whole night.\n\nWhat the tenant is told\nSay plainly that it is out of hours, that the request is logged with its reference, and give the time it will be picked up — "first thing tomorrow, from 7am" rather than a vague "soon". If the tenant believes it is urgent and the agent has classified it as routine, offer the escalation route rather than arguing: a person can override the classification.\n\nHandover\nEverything queued overnight appears in the 07:00 handover list with the original timestamp, so the morning team can see what has been waiting and for how long.',
      priority: 'MEDIUM', priorityDisplayName: 'Standard',
      sysCreatedTime: ago(90 * DAY), sysModifiedTime: ago(14 * DAY),
      policyConditions: [
        cond(7, 63, 'Ticket raised between 19:00 and 07:00 site time'),
        cond(8, 63, 'Site is not on 24/7 cover'),
      ],
      technicianFilters: [
        filt(8, 63, 'Availability', 'On the night duty rota'),
        filt(9, 63, 'Availability', 'Has had the minimum rest period since the last callout'),
      ],
      scoreWeightages: [
        wt(11, 63, 1, 'Skill', 10), wt(12, 63, 2, 'Proximity', 30),
        wt(13, 63, 3, 'Availability', 45), wt(14, 63, 4, 'Performance', 15),
        wt(15, 63, 5, 'Cost', 0),
      ],
      policyWorkings: [
        work(7, 63, 'Assumed site time, not server time, decides whether a ticket is out of hours.'),
        work(8, 63, 'Queued tickets are released at 07:00 in the order they arrived.'),
      ],
    },
    {
      id: 64, orgId: 331,
      displayName: 'Repeat report within 24h',
      description: 'Same asset and category with an open ticket: append to the open ticket instead of creating a duplicate, and raise urgency one level.',
      policyInstructions: 'Scope\nStops one fault becoming three tickets. Applies across every channel — a tenant on chat, a colleague on the phone and a cleaner on WhatsApp reporting the same thing are one job, not three.\n\nWhat triggers it\n· An open ticket already exists for the same asset, and\n· the new report is in the same category, and\n· it arrives within twenty-four hours of the open ticket.\n\nWhere no asset is named, match on location instead — the same floor and the same category counts as the same fault.\n\nWhat happens\nAppend the new report to the open ticket as an additional report, recording who raised it, through which channel, and when. Do not create a second ticket, and do not reassign: the technician already on the job stays on it. Raise the urgency by one level, once — a fault reported repeatedly is one the queue has under-rated — and never more than once however many repeats arrive.\n\nWhat it must not do\nNever close the new report as a duplicate without linking it. A silently dropped report is how a tenant concludes the helpdesk ignores them, and it destroys the reporting numbers for that asset. Never merge across categories: a leak and a lighting fault on the same floor are two jobs.\n\nEscalation\nThree or more reports on the same asset within twenty-four hours flags the ticket for the facilities manager, whatever its urgency. At that point it is no longer a maintenance job, it is a job that is not going well.\n\nWhat the tenant is told\nAcknowledge that the issue is already logged, give the existing reference and its current status, and say the additional report has been added. This is the difference between "we know, someone is on it, here is the reference" and what reads as a shrug.',
      priority: 'HIGH', priorityDisplayName: 'Urgent',
      sysCreatedTime: ago(60 * DAY), sysModifiedTime: ago(2 * DAY),
      policyConditions: [
        cond(9, 64, 'An open ticket exists for the same asset'),
        cond(10, 64, 'Same category as the open ticket'),
        cond(11, 64, 'Raised within 24 hours of the open ticket'),
      ],
      technicianFilters: [
        filt(10, 64, 'Assignment', 'Already assigned to the open ticket'),
      ],
      scoreWeightages: [
        wt(16, 64, 1, 'Skill', 20), wt(17, 64, 2, 'Proximity', 10),
        wt(18, 64, 3, 'Availability', 60), wt(19, 64, 4, 'Performance', 10),
        wt(20, 64, 5, 'Cost', 0),
      ],
      policyWorkings: [
        work(9, 64, 'Assumed "same asset" matches on the asset id, falling back to location when no asset is named.'),
        work(10, 64, 'Urgency is raised at most once per ticket, however many repeats come in.'),
      ],
    },
  ];

  // The plain-language exchange that produced each policy — the detail view's
  // left panel replays it, and a follow-up refines the policy.
  const chat = (id, policyId, isUser, conversationText, minsAgo, conversationTitle) => ({
    id, policyId, isUser, conversationText, conversationTitle,
    timestamp: ago(minsAgo * 60 * 1000),
  });

  const POLICY_CONVERSATIONS = {
    61: [
      chat(1, 61, true, 'Anything involving fire, gas, someone trapped in a lift, or water near live electrics has to go straight to whoever is on duty. Text the site manager too. Fifteen minutes to respond.', 43200, 'Life safety escalation'),
      chat(2, 61, false, "Got it. I've set this to run before every other policy, with no contract check in the way.\n\nIt triggers on the Fire, Gas, Entrapment and Flood categories, and on any description mentioning smoke, gas, trapped or water near electrics. Eligible technicians are limited to the duty rota for the current shift, excluding anyone already on a P1, and ranked mainly on travel time.\n\nThe site manager for the ticket's location gets an SMS as soon as it is assigned."),
      chat(3, 61, true, 'What happens if nobody on the rota can get there in fifteen minutes?', 41000),
      chat(4, 61, false, "Then the filter returns no one and the ticket escalates to the facilities manager instead of sitting unassigned — I've kept that as the fallback rather than relaxing the travel-time rule, since a slow life-safety response is worse than a human making the call."),
      chat(5, 61, true, 'Good. Leave it like that.', 40800),
    ],
    62: [
      chat(6, 62, true, 'HVAC jobs on assets under contract should go to the vendor, not our own engineers. And link them to whatever fault is already open on that asset.', 39000, 'HVAC contract routing'),
      chat(7, 62, false, "Done. The policy applies to HVAC tickets where the named asset has a live maintenance contract.\n\nOnly technicians belonging to that contract vendor are eligible, and they are scored on contract coverage, skill match and their history on the asset. If an open fault exists on the same asset within 30 days, the ticket is linked to it rather than raised standalone."),
      chat(8, 62, true, 'Use the contract response window rather than the ticket urgency.', 38500),
      chat(9, 62, false, 'Updated — the SLA clock now comes from the contract. For assets on the Cooltech agreement that is two hours to respond.'),
    ],
    63: [
      chat(10, 63, true, 'Overnight we only have a skeleton team. Between 7pm and 7am, hold anything routine until the morning and only wake the duty engineer for High and above.', 32000, 'Out-of-hours handling'),
      chat(11, 63, false, "Set up. Tickets raised between 19:00 and 07:00 site time at sites without 24/7 cover are queued for 07:00 and released in arrival order; anything at High or Emergency pages the night rota instead.\n\nI've also added a rest-period filter so the same engineer isn't called out repeatedly through one night."),
    ],
    64: [
      chat(12, 64, true, 'People keep reporting the same fault and we end up with three jobs for one problem. Stop the duplicates.', 21000, 'Duplicate suppression'),
      chat(13, 64, false, "Handled. When a ticket arrives for an asset that already has an open ticket in the same category within 24 hours, it is appended to that ticket instead of creating a new one, and the urgency goes up one level.\n\nThe technician already assigned stays assigned — the repeat is evidence the job needs attention, not a reason to reassign it."),
      chat(14, 64, true, 'Does the tenant still get told something?', 20500),
      chat(15, 64, false, 'Yes — the agent replies that the issue is already logged, gives the existing reference and the current status, so it does not read as being ignored.'),
    ],
  };

  // ── Writing a policy from a prompt ──────────────────────────────────────
  // The real builder is an LLM reading the org's staff and policy records. What
  // matters for the demo is that the answer is *structured* and visibly derived
  // from what was typed — the point of the screen is that English becomes
  // conditions, eligibility filters and a weighting you can argue with. So this
  // reads the prompt for the vocabulary the product already models and composes
  // a policy out of it, rather than returning one canned record.
  let nextPolicyId = 65;

  // [regex, condition, eligibility filter, factor the weighting should favour]
  const PROMPT_SIGNALS = [
    [/\bfire|smoke|gas|trapped|entrap|flood|injur/i, 'Description mentions fire, gas, entrapment or flooding',
      ['Certification', 'Holds a current first-response certification'], 'Proximity'],
    [/\bhvac|heating|cooling|chiller|ahu|air quality|ventilation/i, 'Category is HVAC',
      ['Skill', 'Holds AHU-controls and chilled-water competency'], 'Skill'],
    [/\bplumb|leak|water|drain|tap\b/i, 'Category is Plumbing',
      ['Skill', 'Holds a plumbing competency'], 'Skill'],
    [/\belectric|lighting|power|socket|switchboard/i, 'Category is Electrical',
      ['Certification', 'Holds a current electrical certification'], 'Skill'],
    [/\bsecurity|access|barrier|turnstile|card|door/i, 'Category is Security & Access',
      ['Skill', 'Holds an access-control competency'], 'Skill'],
    [/\bclean/i, 'Category is Cleaning', ['Skill', 'Can supervise cleaning'], 'Performance'],
    [/\bout of hours|overnight|night|after hours|weekend|19:00|7 ?pm/i, 'Raised outside covered service hours',
      ['Availability', 'On the night duty rota for the current shift'], 'Availability'],
    [/\bvendor|contract|third.?party|supplier/i, 'The asset carries a live maintenance contract',
      ['Skill', 'Belongs to the vendor holding the contract'], 'Cost'],
    [/\bduplicate|repeat|same fault|already reported/i, 'An open ticket exists for the same asset in the same category',
      ['Availability', 'Already assigned to the open ticket'], 'Performance'],
    [/\bvip|tenant|executive|director|priority tenant/i, 'Requester is on a priority tenant list',
      ['Performance', 'Top quartile on first-time fix'], 'Performance'],
    [/\bnearest|nearby|closest|travel|on ?site|distance/i, 'Ticket location resolves to a site with staff on shift',
      ['Location', 'Can reach the site inside the response window'], 'Proximity'],
    [/\bcheap|cost|budget|in.?house|overtime/i, 'Work can be absorbed by the in-house team',
      ['Cost', 'Not on overtime or a contractor call-out rate'], 'Cost'],
  ];

  const URGENCY_SIGNALS = [
    [/\bemergency|immediately|straight away|critical|p1\b/i, 'P1', 'Emergency'],
    [/\burgent|high priority|asap|within an hour/i, 'HIGH', 'Urgent'],
    [/\blow|routine|whenever|next visit/i, 'LOW', 'Low'],
  ];

  /** Minutes mentioned in the prompt ("within 30 minutes", "2-hour response"). */
  const responseWindow = (prompt) => {
    const mins = prompt.match(/(\d+)\s*(?:-|\s)?\s*min/i);
    if (mins) return `${mins[1]} minutes to respond`;
    const hrs = prompt.match(/(\d+)\s*(?:-|\s)?\s*(?:hour|hr)/i);
    if (hrs) return `${hrs[1]} hours to respond`;
    return null;
  };

  /** A title from the prompt's own words. Policies are written as "<this kind
      of ticket> goes to <these people>"; the name is the subject, so cut at the
      routing verb and drop the leading determiner rather than truncating a
      sentence mid-word. */
  const titleFrom = (prompt) => {
    const first = (prompt.split(/[.\n]/)[0] || 'New policy').trim();
    const subject = first.split(
      /\s+(?:goes? to|should|shall|must|needs? to|gets?|is assigned|are assigned|routes? to|go straight to)\b/i,
    )[0];
    const clean = subject.replace(/^(any|all|every|each|when|if|please|make sure|for)\s+/i, '').trim();
    const short = clean.length > 52 ? `${clean.slice(0, 52).replace(/\s+\S*$/, '')}…` : clean;
    return short.charAt(0).toUpperCase() + short.slice(1);
  };

  const synthesizePolicy = (prompt) => {
    const id = nextPolicyId++;
    const hits = PROMPT_SIGNALS.filter(([re]) => re.test(prompt));
    const urgency = URGENCY_SIGNALS.find(([re]) => re.test(prompt));
    const window = responseWindow(prompt);

    const conditions = hits.map((h) => h[1]);
    if (urgency) conditions.push(`Urgency is ${urgency[2]}`);
    if (conditions.length === 0) conditions.push('Ticket matches the description in this policy');

    const filters = hits.map((h) => h[2]);
    if (window) filters.push(['Location', `Can be on site inside the ${window.replace(' to respond', '')} window`]);
    if (filters.length === 0) filters.push(['Availability', 'Available at the time the ticket is raised']);

    // Weighting: an even split, then the factors the prompt leaned on take the
    // surplus. The five names are the engine's own — the breakdown keys its
    // glyphs off them.
    const FACTORS = ['Skill', 'Proximity', 'Availability', 'Performance', 'Cost'];
    const favoured = hits.map((h) => h[3]);
    const weights = {};
    FACTORS.forEach((f) => { weights[f] = 10; });
    let left = 50;
    FACTORS.forEach((f) => {
      const share = favoured.filter((x) => x === f).length;
      if (!share) return;
      const add = Math.min(left, share * 20);
      weights[f] += add;
      left -= add;
    });
    if (left > 0) weights.Skill += left;

    const instructions = [
      'Scope',
      prompt,
      '',
      'What triggers it',
      ...conditions.map((c) => `· ${c}`),
      '',
      'Who is eligible',
      ...filters.map(([group, f]) => `· ${group}: ${f}`),
      '',
      'Ranking',
      `Ranked on ${FACTORS.map((f) => `${f} ${weights[f]}`).join(', ')}.`,
      window ? `\nResponse clock\n${window[0].toUpperCase()}${window.slice(1)}, measured from when the ticket is created.` : '',
    ].filter(Boolean).join('\n');

    return {
      id, orgId: 331,
      displayName: titleFrom(prompt),
      description: prompt.length > 160 ? `${prompt.slice(0, 157).trimEnd()}…` : prompt,
      policyInstructions: instructions,
      priority: urgency ? urgency[1] : 'MEDIUM',
      priorityDisplayName: urgency ? urgency[2] : 'Standard',
      sysCreatedTime: Date.now(), sysModifiedTime: Date.now(),
      policyConditions: conditions.map((c, i) => cond(id * 10 + i, id, c)),
      technicianFilters: filters.map(([group, f], i) => filt(id * 10 + i, id, group, f)),
      scoreWeightages: FACTORS.map((f, i) => wt(id * 10 + i, id, i + 1, f, weights[f])),
      policyWorkings: [
        work(id * 10, id, `Assumed this policy runs alongside the existing ${POLICIES.length} policies rather than replacing any of them.`),
        window
          ? work(id * 10 + 1, id, `Took "${window}" from the wording and started the clock at ticket creation, not first read.`)
          : work(id * 10 + 1, id, 'No response window was stated, so the org default applies.'),
      ],
    };
  };

  /** The assistant's reply after writing a policy — what it did, in order. */
  const policySummary = (policy) => {
    const conds = policy.policyConditions.map((c) => c.condition.toLowerCase());
    const top = [...policy.scoreWeightages].sort((a, b) => b.weightage - a.weightage)[0];
    return [
      `Done. I've written this as **${policy.displayName}** at ${policy.priorityDisplayName} priority.`,
      '',
      `It triggers when ${conds.join(', and ')}.`,
      '',
      `Eligibility is limited to ${policy.technicianFilters.map((f) => f.filter.toLowerCase()).join('; ')}.`,
      '',
      `Ranking leans on ${top.propertyName} (${top.weightage}) — change any of it below and I'll rewrite the structure.`,
    ].join('\n');
  };

  /** Apply a follow-up prompt to a policy and say what moved. */
  const refinePolicy = (policy, prompt) => {
    const changes = [];
    const urgency = URGENCY_SIGNALS.find(([re]) => re.test(prompt));
    if (urgency) {
      policy.priority = urgency[1];
      policy.priorityDisplayName = urgency[2];
      changes.push(`priority is now ${urgency[2]}`);
    }
    const window = responseWindow(prompt);
    if (window) {
      policy.technicianFilters.push(
        filt(policy.id * 10 + policy.technicianFilters.length, policy.id, 'Location',
          `Can be on site inside the ${window.replace(' to respond', '')} window`),
      );
      changes.push(`the response clock is ${window.replace(' to respond', '')}`);
    }
    PROMPT_SIGNALS.filter(([re]) => re.test(prompt)).forEach(([, condition, [group, f], factor]) => {
      if (!policy.policyConditions.some((c) => c.condition === condition)) {
        policy.policyConditions.push(cond(policy.id * 10 + policy.policyConditions.length, policy.id, condition));
        changes.push(`"${condition.toLowerCase()}" is now a trigger`);
      }
      if (!policy.technicianFilters.some((x) => x.filter === f)) {
        policy.technicianFilters.push(filt(policy.id * 10 + policy.technicianFilters.length, policy.id, group, f));
      }
      const w = policy.scoreWeightages.find((x) => x.propertyName === factor);
      const other = policy.scoreWeightages.find((x) => x.propertyName !== factor && x.weightage >= 10);
      if (w && other) {
        w.weightage += 10;
        other.weightage -= 10;
        changes.push(`${factor} carries more of the ranking`);
      }
    });
    if (changes.length === 0) {
      return "I've noted that against this policy. Nothing in the structure needed to move — the triggers, eligibility and ranking below already cover it.";
    }
    return `Updated — ${changes.join(', ')}. The breakdown below reflects it.`;
  };

  // ── Connected apps, data sources and webhooks ───────────────────────────
  // /api/connectors backs three surfaces: the agent's tools, the webhook rule
  // editor, and the intake call-start tools. Actions come from a second call
  // per connector.
  const CONNECTORS = [
    { id: 'facilio', name: 'Facilio', status: 'connected', custom: false,
      description: 'Unified O&M platform with work orders, assets and facility workflows',
      logoUrl: logo('facilio-logo.svg') },
    { id: 'microsoft-teams', name: 'Microsoft Teams', status: 'connected', custom: false,
      description: 'Channel messages and adaptive cards',
      logoUrl: logo('microsoft-teams.png') },
    { id: 'gmail', name: 'Gmail', status: 'connected', custom: false,
      description: 'Send mail from the helpdesk address',
      logoUrl: logo('gmail.png') },
    { id: 'google-sheets', name: 'Google Sheets', status: 'connected', custom: false,
      description: 'Append rows to a reporting sheet',
      logoUrl: logo('google-sheets.png') },
    { id: 'servicenow', name: 'ServiceNow', status: 'not-connected', custom: false,
      description: 'ITSM incidents and change requests',
      logoUrl: logo('servicenow.png') },
    { id: 'zendesk', name: 'Zendesk', status: 'not-connected', custom: false,
      description: 'Support tickets and macros',
      logoUrl: logo('zendesk.png') },
  ];

  const CONNECTOR_ACTIONS = {
    facilio: [
      { id: 1, connection_id: 1, slug: 'create-work-order', display_name: 'Create work order',
        description: 'Raise a work order against a site and asset.',
        input_schema: { type: 'object', required: ['subject', 'site'], properties: {
          subject: { type: 'string', description: 'Short summary of the fault' },
          site: { type: 'string', description: 'Site the work order belongs to' },
          asset: { type: 'string', description: 'Asset reference, if known' },
          priority: { type: 'string', description: 'Emergency, Urgent or Not urgent' } } } },
      { id: 2, connection_id: 1, slug: 'update-work-order', display_name: 'Update work order',
        description: 'Change status, priority or assignee on an existing work order.',
        input_schema: { type: 'object', required: ['work_order_id'], properties: {
          work_order_id: { type: 'string', description: 'The work order to update' },
          status: { type: 'string', description: 'New status' },
          note: { type: 'string', description: 'Note to append' } } } },
      { id: 3, connection_id: 1, slug: 'lookup-asset', display_name: 'Look up asset',
        description: 'Find an asset and its contract cover by name or location.',
        input_schema: { type: 'object', required: ['query'], properties: {
          query: { type: 'string', description: 'Asset name, code or location' } } } },
    ],
    'microsoft-teams': [
      { id: 4, connection_id: 2, slug: 'post-channel-message', display_name: 'Post channel message',
        description: 'Post an adaptive card into a Teams channel.',
        input_schema: { type: 'object', required: ['team', 'channel', 'text'], properties: {
          team: { type: 'string', description: 'Team name' },
          channel: { type: 'string', description: 'Channel name' },
          text: { type: 'string', description: 'Message body' } } } },
      { id: 5, connection_id: 2, slug: 'send-chat', display_name: 'Send a chat',
        description: 'Direct-message a person in Teams.',
        input_schema: { type: 'object', required: ['to', 'text'], properties: {
          to: { type: 'string', description: 'Recipient email' },
          text: { type: 'string', description: 'Message body' } } } },
    ],
    gmail: [
      { id: 6, connection_id: 3, slug: 'send-email', display_name: 'Send an email',
        description: 'Send mail from the helpdesk address.',
        input_schema: { type: 'object', required: ['to', 'subject', 'body'], properties: {
          to: { type: 'string', description: 'Recipient address' },
          subject: { type: 'string', description: 'Subject line' },
          body: { type: 'string', description: 'Message body' } } } },
    ],
    'google-sheets': [
      { id: 7, connection_id: 4, slug: 'append-row', display_name: 'Append a row',
        description: 'Add a row to the end of a sheet.',
        input_schema: { type: 'object', required: ['spreadsheet', 'sheet', 'values'], properties: {
          spreadsheet: { type: 'string', description: 'Spreadsheet name or id' },
          sheet: { type: 'string', description: 'Tab within the spreadsheet' },
          values: { type: 'string', description: 'Comma-separated cell values' } } } },
    ],
    servicenow: [],
    zendesk: [],
  };

  // Integrations the org has actually connected — merged onto the static
  // connector catalogue so those cards read "connected" and carry a toolAuthId.
  const INTEGRATIONS = [
    { id: 91, orgId: 331, name: 'Facilio', linkName: 'facilio', type: 'FACILIO',
      connected: true, externalId: 'northgate-prod', endpointUrl: 'https://northgate.facilio.com' },
    { id: 92, orgId: 331, name: 'Microsoft Teams', linkName: 'microsoft-teams', type: 'TEAMS',
      connected: true, externalId: 'northgate.onmicrosoft.com', endpointUrl: null },
    { id: 93, orgId: 331, name: 'Gmail', linkName: 'gmail', type: 'GMAIL',
      connected: true, externalId: 'helpdesk@northgate.example', endpointUrl: null },
    { id: 94, orgId: 331, name: 'Google Sheets', linkName: 'google-sheets', type: 'GOOGLE_SHEETS',
      connected: true, externalId: 'northgate-reporting', endpointUrl: null },
  ];

  // Destination catalogue — what a dataset can map INTO. The dataset card's
  // "N of M fields mapped" counts against these totals.
  const DESTINATION_FIELDS = {
    ticket: [
      ['subject', 'Subject'], ['description', 'Description'], ['status', 'Status'],
      ['urgency', 'Urgency'], ['category', 'Category'], ['location', 'Location'],
      ['requesterName', 'Requester'], ['requesterEmail', 'Requester email'],
      ['assetName', 'Asset'], ['slaDueTime', 'SLA due'], ['assignedTo', 'Assigned to'],
      ['channel', 'Channel'], ['createdTime', 'Created time'], ['displayCode', 'Reference'],
    ],
    technician: [
      ['name', 'Name'], ['contactEmail', 'Email'], ['contactPhone', 'Phone'],
      ['skills', 'Skills'], ['certifications', 'Certifications'], ['currentStatus', 'Status'],
      ['familiarZones', 'Territories'], ['isContractor', 'Contractor'],
      ['inventory', 'Inventory'], ['technicianId', 'Technician ID'],
    ],
  };

  const map = (id, dataSourceId, from, to, confidence) => ({
    id, orgId: 331, dataSourceId,
    sourceFieldName: from, destinationFieldName: to,
    type: 'INTEGRATION_TO_LABS', confidence,
  });

  const DATA_SOURCES = [
    { id: 71, orgId: 331, name: 'Work orders → Tickets',
      sourceId: 'workorder', sourceDisplayName: 'Work Order',
      destinationId: 'ticket', destinationDisplayName: 'Tickets',
      toolAuthId: 91, toolAuth: { id: 91, name: 'Facilio', type: 'FACILIO' },
      paused: false, lastSyncedAt: ago(22 * 60 * 1000),
      fieldMappings: [
        map(1, 71, 'subject', 'subject', 99), map(2, 71, 'description', 'description', 98),
        map(3, 71, 'moduleState', 'status', 92), map(4, 71, 'priority', 'urgency', 88),
        map(5, 71, 'category', 'category', 95), map(6, 71, 'space', 'location', 84),
        map(7, 71, 'requester', 'requesterName', 97), map(8, 71, 'requesterEmail', 'requesterEmail', 99),
        map(9, 71, 'resource', 'assetName', 91), map(10, 71, 'dueDate', 'slaDueTime', 76),
        map(11, 71, 'assignedTo', 'assignedTo', 94), map(12, 71, 'sourceType', 'channel', 71),
      ] },
    { id: 72, orgId: 331, name: 'Employees → Technicians',
      sourceId: 'employee', sourceDisplayName: 'Employee',
      destinationId: 'technician', destinationDisplayName: 'Technicians',
      toolAuthId: 91, toolAuth: { id: 91, name: 'Facilio', type: 'FACILIO' },
      paused: false, lastSyncedAt: ago(3 * HOUR),
      fieldMappings: [
        map(13, 72, 'name', 'name', 99), map(14, 72, 'email', 'contactEmail', 99),
        map(15, 72, 'mobile', 'contactPhone', 96), map(16, 72, 'skills', 'skills', 87),
        map(17, 72, 'certifications', 'certifications', 82),
        map(18, 72, 'availabilityStatus', 'currentStatus', 74),
        map(19, 72, 'zones', 'familiarZones', 79),
      ] },
    { id: 73, orgId: 331, name: 'Service requests → Tickets',
      sourceId: 'servicerequest', sourceDisplayName: 'Service Request',
      destinationId: 'ticket', destinationDisplayName: 'Tickets',
      toolAuthId: 91, toolAuth: { id: 91, name: 'Facilio', type: 'FACILIO' },
      paused: true, lastSyncedAt: ago(9 * DAY),
      fieldMappings: [
        map(20, 73, 'title', 'subject', 96), map(21, 73, 'details', 'description', 93),
        map(22, 73, 'state', 'status', 85), map(23, 73, 'severity', 'urgency', 68),
        map(24, 73, 'building', 'location', 81),
      ] },
    { id: 74, orgId: 331, name: 'Vendors → Technicians',
      sourceId: 'vendor', sourceDisplayName: 'Vendor',
      destinationId: 'technician', destinationDisplayName: 'Technicians',
      toolAuthId: 91, toolAuth: { id: 91, name: 'Facilio', type: 'FACILIO' },
      paused: false, lastSyncedAt: ago(30 * HOUR),
      fieldMappings: [
        map(25, 74, 'name', 'name', 99), map(26, 74, 'primaryContactEmail', 'contactEmail', 94),
        map(27, 74, 'primaryContactPhone', 'contactPhone', 92),
        map(28, 74, 'tradeCategories', 'skills', 77), map(29, 74, 'isContractor', 'isContractor', 100),
      ] },
  ];

  const FACILIO_MODULES = [
    { name: 'workorder', displayName: 'Work Order' },
    { name: 'servicerequest', displayName: 'Service Request' },
    { name: 'asset', displayName: 'Asset' },
    { name: 'employee', displayName: 'Employee' },
    { name: 'vendor', displayName: 'Vendor' },
    { name: 'tenant', displayName: 'Tenant' },
    { name: 'site', displayName: 'Site' },
    { name: 'space', displayName: 'Space' },
  ];

  // ── Webhooks ────────────────────────────────────────────────────────────
  // A rule is authored in plain language: trigger module + events, a connected
  // app's action, the parameters the agent resolves, and the exchange that
  // produced it. Runs are the firing history.
  const param = (name, type, required, description, source, field, value) =>
    ({ name, type, required, description, source, field, value });

  const WEBHOOKS = [
    {
      id: 'wh-01',
      name: 'Post emergency tickets to Building ops',
      summary: 'Whenever a ticket is raised at Emergency urgency, this posts the reference, site and description into the Building ops channel in Teams, so the duty team sees it without watching the queue.',
      description: 'Keeps the ops channel aware of P1s in real time.',
      module: 'ticket',
      events: ['ticket.created'],
      connectionId: 'microsoft-teams', connectionName: 'Microsoft Teams',
      connectionLogoUrl: logo('microsoft-teams.png'),
      actionSlug: 'post-channel-message', actionName: 'Post channel message',
      parameters: [
        param('team', 'STRING', true, 'Team name', 'constant', '', 'Northgate Property'),
        param('channel', 'STRING', true, 'Channel name', 'constant', '', 'Building ops'),
        param('text', 'STRING', true, 'Message body', 'field', 'subject', ''),
      ],
      functionName: 'wh_emergency_to_slack', threadId: 9101,
      conversation: [
        { text: 'When an emergency ticket comes in, post it to our Building ops channel in Teams.', isAgent: false },
        { text: 'Done. The rule fires on Ticket created, filters to Emergency urgency, and posts the reference, site and description into Building ops. I have left the message text mapped to the ticket subject — say the word if you want the full description instead.', isAgent: true },
      ],
      status: 'active', createdAt: ago(46 * DAY),
    },
    {
      id: 'wh-02',
      name: 'Email the site manager on dispatch',
      summary: 'When the dispatcher assigns a ticket, this emails the site manager for that building with the technician name and the response window, so the desk is not the one relaying it.',
      description: '',
      module: 'ticket',
      events: ['ticket.dispatched'],
      connectionId: 'gmail', connectionName: 'Gmail', connectionLogoUrl: logo('gmail.png'),
      actionSlug: 'send-email', actionName: 'Send an email',
      parameters: [
        param('to', 'STRING', true, 'Recipient address', 'field', 'siteManagerEmail', ''),
        param('subject', 'STRING', true, 'Subject line', 'agent', '', ''),
        param('body', 'STRING', true, 'Message body', 'agent', '', ''),
      ],
      functionName: 'wh_dispatch_sms', threadId: 9102,
      conversation: [
        { text: 'Email the site manager whenever a job gets assigned, with who is coming and by when.', isAgent: false },
        { text: 'Set up on Ticket dispatched. The address comes from the site record, and I let the agent write the subject and body so they read naturally rather than as a template — it always contains the technician name, the reference and the response window.', isAgent: true },
        { text: 'Keep the subject short — it gets read on a phone.', isAgent: false },
        { text: 'Subject capped at 60 characters, with the reference first.', isAgent: true },
      ],
      status: 'active', createdAt: ago(31 * DAY),
    },
    {
      id: 'wh-03',
      name: 'Raise a Facilio work order for HVAC faults',
      summary: 'HVAC tickets that name an asset are mirrored into Facilio as a work order against that asset, so the maintenance team works out of one system rather than two.',
      description: 'Mirrors HVAC tickets into the CMMS.',
      module: 'ticket',
      events: ['ticket.created', 'ticket.status_changed'],
      connectionId: 'facilio', connectionName: 'Facilio', connectionLogoUrl: logo('facilio-logo.svg'),
      actionSlug: 'create-work-order', actionName: 'Create work order',
      parameters: [
        param('subject', 'STRING', true, 'Short summary of the fault', 'field', 'subject', ''),
        param('site', 'STRING', true, 'Site the work order belongs to', 'field', 'location', ''),
        param('asset', 'STRING', false, 'Asset reference, if known', 'field', 'assetName', ''),
        param('priority', 'STRING', false, 'Emergency, Urgent or Not urgent', 'field', 'urgency', ''),
      ],
      functionName: 'wh_hvac_to_cmms', threadId: 9103,
      conversation: [
        { text: 'Every HVAC ticket with an asset on it should become a work order in Facilio.', isAgent: false },
        { text: 'Built. It fires on creation and on a status change, so a ticket that is re-categorised as HVAC later still lands. Where no asset is named the work order is raised against the site instead of being skipped.', isAgent: true },
      ],
      status: 'active', createdAt: ago(18 * DAY),
    },
    {
      id: 'wh-04',
      name: 'Log poor CSAT to the reporting sheet',
      summary: 'A rating of two stars or below appends the tenant, the ticket reference and a two-line summary to the tenant-experience sheet the property managers review each week.',
      description: '',
      module: 'ticket',
      events: ['ticket.updated'],
      connectionId: 'google-sheets', connectionName: 'Google Sheets',
      connectionLogoUrl: logo('google-sheets.png'),
      actionSlug: 'append-row', actionName: 'Append a row',
      parameters: [
        param('spreadsheet', 'STRING', true, 'Spreadsheet name or id', 'constant', '', 'Tenant experience 2026'),
        param('sheet', 'STRING', true, 'Tab within the spreadsheet', 'constant', '', 'Low ratings'),
        param('values', 'STRING', true, 'Comma-separated cell values', 'agent', '', ''),
      ],
      functionName: 'wh_csat_escalation', threadId: 9104,
      conversation: [
        { text: 'If someone rates us badly, I want it on the tenant experience sheet the property managers review.', isAgent: false },
        { text: 'Rule created for ratings of two or below. Each row carries the date, tenant, ticket reference, rating and a two-line summary, with a link back to the conversation.', isAgent: true },
      ],
      status: 'paused', createdAt: ago(7 * DAY),
    },
  ];

  const WEBHOOK_RUNS = {
    'wh-01': [
      { id: 'run-1', at: ago(1 * HOUR), status: 'succeeded', durationMs: 412, record: 'Ticket #4809',
        inputs: [{ name: 'channel', value: 'Building ops', origin: 'Fixed value' },
                 { name: 'text', value: 'WO-4809 · Visitor parking barrier not raising', origin: 'Tickets › Subject' }],
        response: '{ "ok": true, "messageId": "1757490112481" }' },
      { id: 'run-2', at: ago(4 * HOUR), status: 'succeeded', durationMs: 388, record: 'Ticket #4801',
        inputs: [{ name: 'channel', value: 'Building ops', origin: 'Fixed value' },
                 { name: 'text', value: 'WO-4801 · Lift 3 juddering on descent', origin: 'Tickets › Subject' }],
        response: '{ "ok": true, "messageId": "1757479004117" }' },
      { id: 'run-3', at: ago(2 * DAY), status: 'failed', durationMs: 5031, record: 'Ticket #4788',
        inputs: [{ name: 'channel', value: 'Building ops', origin: 'Fixed value' },
                 { name: 'text', value: 'WO-4788 · Smoke detector fault, level 2', origin: 'Tickets › Subject' }],
        response: '{ "ok": false, "error": "ChannelNotFound: renamed to Building operations" }' },
    ],
    'wh-02': [
      { id: 'run-4', at: ago(2 * HOUR), status: 'succeeded', durationMs: 622, record: 'Ticket #4800',
        inputs: [{ name: 'to', value: 'helena.marsh@northgate.example', origin: 'Sites › Manager email' },
                 { name: 'subject', value: 'WO-4800 assigned — Level 12 heating', origin: 'Agent decided' },
                 { name: 'body', value: 'Dan Okafor is attending WO-4800 (Level 12, no heating). Response window 2 hours.', origin: 'Agent decided' }],
        response: '{ "id": "18f2c0ffee21", "status": "sent" }' },
      { id: 'run-5', at: ago(28 * HOUR), status: 'succeeded', durationMs: 571, record: 'Ticket #4802',
        inputs: [{ name: 'to', value: 'helena.marsh@northgate.example', origin: 'Sites › Manager email' },
                 { name: 'subject', value: 'WO-4802 assigned — washroom leak, level 4', origin: 'Agent decided' },
                 { name: 'body', value: 'Tom Beckett is attending WO-4802 (Tower B, level 4 washroom leak).', origin: 'Agent decided' }],
        response: '{ "id": "18f290ab12cd", "status": "sent" }' },
    ],
    'wh-03': [
      { id: 'run-6', at: ago(2 * HOUR), status: 'succeeded', durationMs: 903, record: 'Ticket #4800',
        inputs: [{ name: 'subject', value: 'Level 12 — no heating (AHU-04)', origin: 'Tickets › Subject' },
                 { name: 'site', value: 'Tower A · Level 12', origin: 'Tickets › Location' },
                 { name: 'asset', value: 'AHU-04', origin: 'Tickets › Asset' },
                 { name: 'priority', value: 'Emergency', origin: 'Tickets › Urgency' }],
        response: '{ "workOrderId": 88214, "status": "created" }' },
    ],
    'wh-04': [],
  };


  // ── Router ──────────────────────────────────────────────────────────────
  // Each entry: [method, RegExp on the path, handler(match, ctx) -> body].
  const ROUTES = [
    ['GET', /^\/api\/user\/details$/, () => userDetails()],
    // A freshly onboarded (non-production) account shows the trial phone strip
    // on Home. It maps over this list, so it must be an array, not {}.
    ['GET', /^\/api\/trial\/users\/list$/, () => []],
    ['GET', /^\/api\/settings\/maxVerifiedNumbers$/, () => ({ value: '3' })],
    // Every onboarding step autosaves the whole session JSON here.
    ['POST', /^\/api\/settings\/addOrUpdate$/, (m, { body }) => {
      if (body && typeof body.helpdesk === 'string') onboarding.helpdesk = body.helpdesk;
      return {};
    }],
    // The crawl: analyzing for a couple of polls, then "Here's What We Found".
    ['POST', /^\/api\/helpdesk\/onboarding\/analyze$/, (m, { body }) => {
      const url = (body && body.url) || 'northgate.example';
      setOnboarding({ step: 1, status: 'analyzing', url });
      setTimeout(() => setOnboarding({ step: 2, url, ...CRAWL_RESULT }), 8000);
      return {};
    }],
    // Agent creation: "creating" for one poll, then the account is onboarded
    // and the page sends the viewer into Ask AI.
    ['POST', /^\/api\/helpdesk\/onboarding\/finalize$/, () => {
      let session = {};
      try { session = JSON.parse(onboarding.helpdesk || '{}'); } catch (e) { /* fresh */ }
      setOnboarding({ ...session, step: 4, status: 'creating' });
      setTimeout(() => { onboarding.status = true; onboarding.helpdesk = undefined; }, 6000);
      return {};
    }],
    ['GET', /^\/api\/user\/orgs$/, () => ({
      list: [{ orgId: 331, name: ORG, domain: 'northgate', sandbox: false }],
    })],
    ['GET', /^\/api\/application\/([^/]+)$/, (m) => ({
      application: m[1] === 'dispatcher-agent' ? DISPATCHER_APPLICATION : APPLICATION,
    })],
    ['GET', /^\/api\/application\/access\/(\d+)$/, (m) => ({
      userApplication: { id: 1, applicationId: Number(m[1]), ouid: USER.orgUserId },
      isSuperUser: true,
    })],
    ['GET', /^\/api\/project\/list$/, () => ({ list: PROJECTS, count: PROJECTS.length })],
    ['GET', /^\/api\/application\/\d+\/app-portfolio$/, () => ({ userApplications: PORTFOLIO })],
    ['GET', /^\/api\/credit-usage\/summary$/, () => (ONBOARDING_DEMO
      ? { ...CREDIT_SUMMARY, totalCredits: 2000, creditsUsed: 0, creditBalance: 2000, totalUsage: 0 }
      : CREDIT_SUMMARY)],
    ['GET', /^\/api\/credit-usage\/dispatch-summary$/, () => CREDIT_SUMMARY],
    ['GET', /^\/api\/intake-agent\/summary$/, () => INTAKE_SUMMARY],
    ['GET', /^\/api\/ticket\/stats$/, () => ticketStats()],
    ['GET', /^\/api\/ticket\/list$/, () => ({ list: TICKETS, count: TICKETS.length })],
    ['GET', /^\/api\/dispatcher\/technicians\/list$/, () => ({
      technicians: TECHNICIANS,
      count: TECHNICIANS.length,
      // The Technicians page reads pagination.totalPages / totalCount directly
      // and throws without them; Home only reads `technicians`.
      pagination: {
        page: 1, perPage: 50, totalCount: TECHNICIANS.length, totalPages: 1,
        hasNextPage: false, hasPreviousPage: false,
      },
    })],
    ['GET', /^\/api\/home\/analytics$/, () => HOME_INSIGHTS],
    ['GET', /^\/api\/home\/fetch$/, () => HOME_INSIGHTS],

    // Tickets module
    ['GET', /^\/api\/ticket-meta\/categories$/, () => TICKET_META.categories],
    ['GET', /^\/api\/ticket-meta\/types$/, () => TICKET_META.types],
    ['GET', /^\/api\/ticket-meta\/priorities$/, () => TICKET_META.priorities],
    ['GET', /^\/api\/ticket\/(\d+)$/, (m) => TICKETS.find((t) => t.id === Number(m[1])) || TICKETS[0]],

    // Inbox — one endpoint, filtered by the callType query the page sends.
    ['GET', /^\/api\/assistant\/channel\/calllogs$/, (m, ctx) => {
      const q = new URL(ctx.url, location.origin).searchParams;
      const kind = (q.get('callType') || '').toUpperCase();
      const group = kind.includes('EMAIL') ? 'EMAIL' : kind.includes('CHAT') ? 'CHAT'
        : kind.includes('CALL') || kind.includes('VOICE') ? 'CALL' : '';
      const list = conversationsOf(group);
      return { list, count: list.length };
    }],
    ['GET', /^\/api\/assistant\/channel\/calllog\/(\d+)$/, (m) =>
      CONVERSATIONS.find((c) => c.id === Number(m[1])) || CONVERSATIONS[0]],
    ['GET', /^\/api\/assistant\/calllogs$/, () => ({ list: conversationsOf('CALL'), count: 2 })],

    // Contacts
    ['GET', /^\/api\/assistant\/contacts$/, () => ({ list: CONTACTS, count: CONTACTS.length })],

    // Intake agent
    ['GET', /^\/api\/intake-agent\/config$/, () => INTAKE_CONFIG],
    ['GET', /^\/api\/assistant\/\d+$/, () => ASSISTANT],
    ['GET', /^\/api\/assistant\/meta$/, () => ({ voices: INTAKE_CONFIG.voices })],
    ['GET', /^\/api\/assistant\/tools\/list$/, () => ({ list: [] })],
    ['GET', /^\/api\/agent\/tools$/, () => ({ list: [] })],
    ['GET', /^\/api\/assistant\/channel\/actionfillers$/, () => ({ list: [] })],
    ['GET', /^\/api\/assistant\/channel\/actionfillers\/audio$/, () => ({ list: [] })],

    // Channels + telephony
    ['GET', /^\/api\/assistant\/channel\/channels\/voice$/, () => VOICE_CHANNELS],
    ['GET', /^\/api\/assistant\/channel\/channels\/whatsapp$/, () => WHATSAPP_CHANNELS],
    ['GET', /^\/api\/assistant\/channel\/channels\/email$/, () => EMAIL_CHANNELS],
    ['GET', /^\/api\/assistant\/channel\/channels\/webwidget$/, () => ({ list: WEBWIDGET_CHANNELS, count: WEBWIDGET_CHANNELS.length })],
    ['GET', /^\/api\/assistant\/channels\/(voice|whatsapp|email)(\/all)?$/, (m) => ({
      list: m[1] === 'voice' ? VOICE_CHANNELS : m[1] === 'whatsapp' ? WHATSAPP_CHANNELS : EMAIL_CHANNELS,
    })],
    ['GET', /^\/api\/assistant\/phonenumbers$/, () => ({ list: PHONE_NUMBERS, count: PHONE_NUMBERS.length })],
    ['GET', /^\/api\/assistant\/channel\/numbers$/, () => ({ list: PHONE_NUMBERS, count: PHONE_NUMBERS.length })],

    // Dispatcher
    ['GET', /^\/api\/dispatcher\/policy-builder\/list$/, () => ({ list: POLICIES, count: POLICIES.length })],
    ['GET', /^\/api\/dispatcher\/policy-builder\/(\d+)$/, (m) =>
      POLICIES.find((p) => p.id === Number(m[1])) || POLICIES[0]],
    ['GET', /^\/api\/dispatcher\/policy-builder\/(\d+)\/conversations$/, (m) =>
      POLICY_CONVERSATIONS[Number(m[1])] || []],
    ['GET', /^\/api\/dispatcher\/technicians\/(\d+)$/, (m) =>
      TECHNICIANS.find((t) => t.id === Number(m[1])) || TECHNICIANS[0]],
    // Job History tab on the technician profile.
    ['GET', /^\/api\/dispatcher\/tickets\/by-assignee\/(\d+)$/, (m) => {
      const id = Number(m[1]);
      const name = (TECHNICIANS.find((t) => t.id === id) || {}).name;
      return { tickets: TICKETS.filter((t) => t.assignedToName === name) };
    }],

    // Dispatcher writes. The real engine is an LLM over the org's own staff and
    // policy records; there is nothing to replay, so these derive their answers
    // from the fixtures instead. Same inputs give the same output, which is what
    // a demo needs — a visitor who tests the same policy twice sees one ranking.

    // The policy playground: run one policy against one ticket, persisting
    // nothing. Trade match against the ticket's category carries the most
    // weight, then live status, then the policy's own factor weighting — a
    // policy leaning on Cost lifts the contractor, one leaning on Availability
    // punishes whoever is mid-job.
    ['POST', /^\/api\/dispatcher\/tickets\/(\d+)\/test-policy$/, (m, { body }) => {
      const ticketId = Number(m[1]);
      const ticket = TICKETS.find((t) => t.id === ticketId) || TICKETS[0];
      const policyId = Number((body && body.policyId) || POLICIES[0].id);
      const policy = POLICIES.find((p) => p.id === policyId) || POLICIES[0];
      const weightOf = (name) => {
        const w = (policy.scoreWeightages || []).find((x) => x.propertyName === name);
        return w ? w.weightage : 20;
      };
      const STATUS_SCORE = { AVAILABLE: 1, ON_JOB: 0.45, ON_BREAK: 0.2 };
      const recommendations = TECHNICIANS.map((tech) => {
        const trade = TECH_CATEGORY[tech.id];
        const skill = trade === (ticket.category && ticket.category.value) ? 1 : 0.35;
        const available = STATUS_SCORE[tech.currentStatus] != null ? STATUS_SCORE[tech.currentStatus] : 0.5;
        const cost = tech.isContractor ? 0.3 : 1;
        // Proximity and performance have no fixture to read from, so they come
        // from the id — stable per technician, and not all the same.
        const proximity = 0.5 + ((tech.id * 7) % 5) / 10;
        const performance = 0.6 + ((tech.id * 3) % 4) / 10;
        const score =
          skill * weightOf('Skill') +
          proximity * weightOf('Proximity') +
          available * weightOf('Availability') +
          performance * weightOf('Performance') +
          cost * weightOf('Cost');
        return {
          id: ticketId * 100 + tech.id, orgId: 331,
          sysCreatedBy: null, sysModifiedBy: null,
          sysCreatedTime: now, sysModifiedTime: now,
          sysDeletedBy: null, sysDeletedTime: null, sysDeleted: false,
          jobId: ticketId, technicianId: tech.id, technician: tech,
          score: Math.round(score * 10) / 10,
        };
      }).sort((a, b) => b.score - a.score);
      return { jobId: ticketId, policyId, success: true, recommendations };
    }],

    // Assign the card's top pick. Writes through to the fixture so the ticket
    // reads as assigned for the rest of the session.
    ['POST', /^\/api\/dispatcher\/tickets\/assign$/, (m, { body }) => {
      const ticketId = Number(body && body.ticketId);
      const technicianId = Number(body && body.technicianId);
      const ticket = TICKETS.find((t) => t.id === ticketId);
      const tech = TECHNICIANS.find((t) => t.id === technicianId);
      if (!ticket || !tech) return { success: false, error: 'Unknown ticket or technician' };
      const assignedTime = Date.now();
      ticket.assignedTo = tech.id;
      ticket.assignedToName = tech.name;
      ticket.assignedTime = assignedTime;
      // Assigned by a person from the card, so this is not an auto-assignment.
      ticket.isAutoAssigned = false;
      return { success: true, jobId: ticketId, technicianId, assignedTime };
    }],

    // Write a policy from a prompt. The engine turns a paragraph of English into
    // conditions, eligibility filters and a factor weighting; the demo composes
    // those from what the prompt mentions, so a visitor gets a structured policy
    // back that reflects what they actually typed.
    ['POST', /^\/api\/dispatcher\/policy-builder\/create$/, (m, { body }) => {
      const prompt = String((body && body.prompt) || '').trim();
      const policy = synthesizePolicy(prompt);
      POLICIES.unshift(policy);
      POLICY_CONVERSATIONS[policy.id] = [
        chat(policy.id * 10, policy.id, true, prompt, 0, policy.displayName),
        chat(policy.id * 10 + 1, policy.id, false, policySummary(policy), 0),
      ];
      return policy;
    }],

    // Refine an existing policy in the same conversation. The reply names what
    // changed rather than restating the policy.
    ['POST', /^\/api\/dispatcher\/policy-builder\/(\d+)\/prompt$/, (m, { body }) => {
      const policyId = Number(m[1]);
      const policy = POLICIES.find((p) => p.id === policyId) || POLICIES[0];
      const prompt = String((body && body.prompt) || '').trim();
      const thread = POLICY_CONVERSATIONS[policyId] || (POLICY_CONVERSATIONS[policyId] = []);
      const nextId = 900 + thread.length;
      thread.push(chat(nextId, policyId, true, prompt, 0));
      const applied = refinePolicy(policy, prompt);
      const reply = chat(nextId + 1, policyId, false, applied, 0);
      thread.push(reply);
      policy.sysModifiedTime = Date.now();
      return { success: true, conversation: reply, policy };
    }],

    // Ask AI
    ['GET', /^\/api\/helpdesk\/copilot\/thread$/, () => COPILOT_THREADS],

    // Integrations / data sources
    ['GET', /^\/api\/connectors$/, () => ({ connectors: CONNECTORS })],
    ['GET', /^\/api\/connectors\/([^/]+)\/actions$/, (m) =>
      ({ actions: CONNECTOR_ACTIONS[decodeURIComponent(m[1])] || [] })],
    ['GET', /^\/api\/webhooks$/, () => ({ webhooks: WEBHOOKS })],
    ['GET', /^\/api\/webhooks\/([\w-]+)\/runs$/, (m) => ({ runs: WEBHOOK_RUNS[m[1]] || [] })],
    ['GET', /^\/api\/webhooks\/([\w-]+)$/, (m) =>
      ({ webhook: WEBHOOKS.find((w) => w.id === m[1]) || WEBHOOKS[0] })],
    ['GET', /^\/api\/product-updates$/, () => ({ list: [] })],

    // Settings — users, credit usage, keys, integrations
    ['GET', /^\/api\/user\/list$/, () => ({ list: USERS, count: USERS.length })],
    ['GET', /^\/api\/credit-usage\/call-logs$/, () => ({
      callLogs: CREDIT_LOGS,
      totalCost: CREDIT_LOGS.reduce((a, b) => a + b.cost, 0),
      period: 'thismonth',
      creditBalance: CREDIT_SUMMARY.creditBalance,
      pagination: { page: 1, perPage: 50, total: CREDIT_LOGS.length, totalPages: 1,
        hasNextPage: false, hasPreviousPage: false },
    })],
    ['GET', /^\/api\/settings\/customWhatsapp$/, () => ({ enabled: false })],
    ['GET', /^\/api\/assistant\/channel\/publickey$/, () => ({
      publicKey: 'pk_live_northgate_4f21c0ffee9a', key: 'pk_live_northgate_4f21c0ffee9a',
    })],
    ['GET', /^\/api\/datasource\/data-sources$/, () => ({ dataSources: DATA_SOURCES, list: DATA_SOURCES, count: DATA_SOURCES.length })],
    ['GET', /^\/api\/datasource\/data-sources\/(\d+)$/, (m) =>
      DATA_SOURCES.find((d) => d.id === Number(m[1])) || DATA_SOURCES[0]],
    ['GET', /^\/api\/datasource\/integration$/, () => ({ items: INTEGRATIONS })],
    ['GET', /^\/api\/datasource\/facilio\/modules$/, () => ({ modules: FACILIO_MODULES, list: FACILIO_MODULES })],
    ['GET', /^\/api\/datasource\/destination\/fields$/, () => ({
      modules: Object.fromEntries(Object.entries(DESTINATION_FIELDS).map(([mod, fields]) => [
        mod, fields.map(([name, displayName], i) => ({ id: i + 1, name, displayName, dataType: 'STRING' })),
      ])),
    })],
  ];

  // Endpoints hit with no fixture, in visit order — read window.__DEMO_MOCK__.missing
  // after clicking through the app to see what still needs sample data.
  const MISSING = [];

  // ── Wire protocol shims ─────────────────────────────────────────────────
  // The product API is what gets faked. /api/me belongs to the Facilio Run
  // platform (it answers with the signed-in viewer) and must pass through.
  const PLATFORM = /\/api\/(me|db|uploads|proxy|llm|sqllab)\b/;
  const isApi = (url) => /\/api\//.test(String(url)) && !PLATFORM.test(String(url));

  const pathOf = (url) => {
    try {
      return new URL(String(url), location.origin).pathname;
    } catch (e) {
      return String(url).split('?')[0];
    }
  };

  function resolve(method, url, body) {
    const path = pathOf(url);
    for (const [verb, pattern, handler] of ROUTES) {
      if (verb !== method) continue;
      const match = pattern.exec(path);
      if (!match) continue;
      try {
        return { status: 200, body: handler(match, { url, body, method }) };
      } catch (err) {
        // A broken fixture must not look like a network outage. Thrown out of
        // send(), it reaches axios with no `response`, which the app reports as
        // connectivity loss and covers with the full-screen "Server is
        // unavailable" page — hiding the actual cause. A 500 keeps the error
        // attached to the request that caused it.
        console.error(`[demo-mock] fixture for ${method} ${path} threw:`, err);
        return { status: 500, body: { message: `demo-mock fixture error: ${err.message}` } };
      }
    }
    const miss = `${method} ${path}`;
    if (!MISSING.includes(miss)) MISSING.push(miss);
    console.warn(`[demo-mock] no fixture for ${miss} — returning {}`);
    return { status: 200, body: {} };
  }

  // axios talks XHR in the browser, so this is the one that matters.
  const RealXHR = window.XMLHttpRequest;
  function MockXHR() {
    const real = new RealXHR();
    let intercepted = false;
    let method = 'GET';
    let url = '';
    const self = this;
    const listeners = {};

    this.readyState = 0;
    this.status = 0;
    this.response = '';
    this.responseText = '';
    this.responseType = '';
    this.timeout = 0;
    this.withCredentials = false;

    this.open = function (m, u) {
      method = String(m || 'GET').toUpperCase();
      url = u;
      intercepted = isApi(u);
      if (!intercepted) return real.open.apply(real, arguments);
      self.readyState = 1;
    };

    this.setRequestHeader = function () {
      if (!intercepted) return real.setRequestHeader.apply(real, arguments);
    };

    this.getAllResponseHeaders = function () {
      return intercepted ? 'content-type: application/json' : real.getAllResponseHeaders();
    };
    this.getResponseHeader = function (name) {
      if (!intercepted) return real.getResponseHeader(name);
      return /content-type/i.test(name) ? 'application/json' : null;
    };

    this.addEventListener = function (type, fn) {
      (listeners[type] = listeners[type] || []).push(fn);
      if (!intercepted) real.addEventListener(type, fn);
    };
    this.removeEventListener = function (type, fn) {
      if (listeners[type]) listeners[type] = listeners[type].filter((f) => f !== fn);
      if (!intercepted) real.removeEventListener(type, fn);
    };

    this.abort = function () {
      if (!intercepted) return real.abort();
      intercepted = 'aborted';
    };

    this.send = function (payload) {
      if (!intercepted) {
        // Mirror the real object's state back onto this facade.
        real.onreadystatechange = function () {
          self.readyState = real.readyState;
          self.status = real.status;
          self.response = real.response;
          self.responseText = real.responseType === '' || real.responseType === 'text' ? real.responseText : '';
          self.responseURL = real.responseURL;
          if (self.onreadystatechange) self.onreadystatechange();
        };
        real.onload = function () { if (self.onload) self.onload(); };
        real.onerror = function () { if (self.onerror) self.onerror(); };
        real.responseType = self.responseType;
        real.timeout = self.timeout;
        real.withCredentials = self.withCredentials;
        return real.send(payload);
      }

      let parsed;
      try { parsed = payload ? JSON.parse(payload) : undefined; } catch (e) { parsed = payload; }
      const { status, body } = resolve(method, url, parsed);
      const text = JSON.stringify(body === undefined ? {} : body);

      // A beat of latency, so shimmers and loading states are actually seen —
      // this is a product demo, and an instant response looks fake.
      setTimeout(function () {
        if (intercepted === 'aborted') return;
        self.readyState = 4;
        self.status = status;
        self.responseURL = String(url);
        self.responseText = text;
        self.response = self.responseType === 'json' ? JSON.parse(text) : text;
        if (self.onreadystatechange) self.onreadystatechange();
        (listeners.load || []).forEach((fn) => fn.call(self, { type: 'load' }));
        (listeners.loadend || []).forEach((fn) => fn.call(self, { type: 'loadend' }));
        if (self.onload) self.onload({ type: 'load' });
        if (self.onloadend) self.onloadend({ type: 'loadend' });
      }, 180 + Math.random() * 220);
    };

    this.upload = real.upload;
  }
  window.XMLHttpRequest = MockXHR;

  // Anything hand-rolled on fetch (the copilot stream, a couple of utils).
  const realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (!isApi(url)) return realFetch(input, init);
    const method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    let parsed;
    try { parsed = init && init.body ? JSON.parse(init.body) : undefined; } catch (e) { parsed = init && init.body; }
    const { status, body } = resolve(method, url, parsed);
    return new Promise((resolvePromise) => {
      setTimeout(() => {
        resolvePromise(new Response(JSON.stringify(body === undefined ? {} : body), {
          status,
          headers: { 'content-type': 'application/json' },
        }));
      }, 200);
    });
  };

  // The console opens a socket for live conversation updates; in the demo it
  // simply never connects rather than retrying against nothing.
  const RealWS = window.WebSocket;
  const APP_SOCKET = /(assistant|channel|voice|call|agent|\/ws\b)/i;
  window.WebSocket = function (url, protocols) {
    // Vite's HMR socket (and anything else that isn't the app's live-call
    // channel) must still work — only the product's own sockets are stubbed,
    // since there is no conversation server behind this demo.
    if (!APP_SOCKET.test(String(url))) return new RealWS(url, protocols);
    console.info('[demo-mock] app WebSocket suppressed:', url);
    return {
      readyState: 3, url: String(url), bufferedAmount: 0,
      send() {}, close() {}, addEventListener() {}, removeEventListener() {},
      onopen: null, onclose: null, onerror: null, onmessage: null,
    };
  };
  window.WebSocket.prototype = RealWS.prototype;
  window.WebSocket.CONNECTING = 0; window.WebSocket.OPEN = 1;
  window.WebSocket.CLOSING = 2; window.WebSocket.CLOSED = 3;

  window.__DEMO_MOCK__ = { ROUTES, USER, APPLICATION, PROJECTS, missing: MISSING };
  console.info('[demo-mock] installed');
})();
