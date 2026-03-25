// Status color thresholds
export const SL_THRESHOLDS = { green: 0.80, amber: 0.70, red: 0 } as const
export const OCCUPANCY_THRESHOLDS = { green: 0.85, amber: 0.88, red: 0.90 } as const
export const FTE_LOSS_THRESHOLDS = { green: 15, amber: 25, red: 30 } as const
export const ADHERENCE_THRESHOLDS = { green: 0.92, amber: 0.85, red: 0.80 } as const

// Bradford Factor thresholds (S² × D)
export const BRADFORD_THRESHOLDS = {
    green: 50,       // 0-50: No action
    amber: 124,      // 51-124: Return-to-work conversation prompt
    red: 399,        // 125-399: Return-to-work interview required
    escalation: 649, // 400-649: Formal review (Ops Manager + HR)
    critical: 650,   // 650+: Formal investigation
} as const

// Colors matching Tailwind theme
export const STATUS_COLORS = {
    green: '#22C55E',
    amber: '#F59E0B',
    red: '#EF4444',
    grey: '#94A3B8',
} as const

export const BRAND_COLORS = {
    green: '#2ECC71',
    greenDim: '#1B854C',
    dark: '#0B1A2B',
    darkLight: '#1B2A3D',
    blue: '#2980B9',
    gray: '#64748B',
    light: '#F0F7F4',
} as const

// Demo baseline — meTru ERP BPO spec v1.0 (100 agents, 10×10 teams, 2 clients)
export const DEMO_DEFAULTS = {
    pollingIntervalMs: 15_000,
    fteLossPollingMs: 30_000,
    agentCount: 100,
    teamLeadCount: 10,
    teamCount: 10,
    agentsPerTeam: 10,
    clientCount: 2,
    operationsManagers: 2,
    accountManagers: 2,
    operatingHoursStart: '07:00',
    operatingHoursEnd: '00:00',
    operatingHours: 17,
    shiftLength: 8,
    costPerAgentMonth: 800,
    currency: 'EUR',
    overtimeRate: 1.5,
    nightDiffPremium: 0.15,
    nightDiffWindow: { start: '22:00', end: '00:00' },
    contractType: '6-month fixed-term',
    paidLeaveEntitlement: 20,
    paidLeaveSlotsPerWeek: 2,
    leaveRequestLeadTimeDays: 5,
    yearEndLeaveTarget: 5,
    gracePeriodMinutes: 5,
    plannedShrinkage: 0.21,
    unplannedShrinkage: 0.09,
    totalShrinkage: 0.30,
    /** 80 voice + 20 chat agents */
    channelSplit: { voice: 80, chat: 20 },
    chatConcurrency: 3,
    /** Leave liability demo (executive) — spec UC-5A */
    leaveLiabilityUnusedDays: 960,
    leaveLiabilityEurValue: 34_906,
    leaveValuePerDayEur: 36.36,
    smartPushSavingsMtdEur: 580,
} as const

// Client configurations — spec: Client A 60 voice; Client B 40 (20 chat + 20 voice)
export const CLIENT_A = {
    id: 'client-a',
    name: 'Client A',
    industry: 'E-commerce',
    channel: 'voice' as const,
    agentsAssigned: 60,
    slaTarget: { percentage: 80, seconds: 20 },
    ahtTarget: 300, // 5 min
    acwTarget: 45,  // 45 sec
    dailyVolume: 1200,
    peakHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '19:00', '20:00', '21:00'],
    occupancyTarget: 80,
    occupancyCap: 88,
    trainingWeeks: 2,
    nestingWeeks: 2,
    trainingGateScore: 80,
    nestingGateQaScore: 75,
    requiredCertifications: ['Product Knowledge', 'CRM'],
    billingModel: 'per-minute' as const,
    operatingHours: { start: '07:00', end: '00:00' },
} as const

export const CLIENT_B = {
    id: 'client-b',
    name: 'Client B',
    industry: 'Tech Support',
    channel: 'chat+voice' as const,
    agentsAssigned: 40,
    voiceAgents: 20,
    chatAgents: 20,
    slaTarget: { percentage: 90, seconds: 60 },
    ahtTarget: 480, // 8 min
    acwTarget: 60,  // 60 sec
    dailyVolume: 900,
    dailyChats: 500,
    dailyCalls: 400,
    chatConcurrency: 3,
    peakHours: ['09:00', '10:00', '11:00', '12:00'],
    occupancyTarget: 75,
    occupancyCap: 85,
    trainingWeeks: 3,
    nestingWeeks: 2,
    trainingGateScore: 85,
    nestingGateQaScore: 80,
    requiredCertifications: ['Technical Troubleshooting', 'Tier 1/2'],
    billingModel: 'per-fte' as const,
    operatingHours: { start: '08:00', end: '00:00' },
} as const

// Shrinkage configuration (demo baseline)
export const SHRINKAGE_PLANNED = [
    { name: 'Paid Breaks (2 x 15 min)', type: 'planned' as const, scope: 'internal' as const, percentage: 6.3, minutesPerDay: 30, moveable: true },
    { name: 'Lunch Break (unpaid)', type: 'planned' as const, scope: 'internal' as const, percentage: 0, minutesPerDay: 30, moveable: true },
    { name: 'Team Meetings / Huddles', type: 'planned' as const, scope: 'internal' as const, percentage: 2.1, minutesPerDay: 10, moveable: true },
    { name: 'One-on-One Coaching', type: 'planned' as const, scope: 'internal' as const, percentage: 1.6, minutesPerDay: 8, moveable: true },
    { name: 'Training Sessions', type: 'planned' as const, scope: 'internal' as const, percentage: 2.1, minutesPerDay: 10, moveable: true },
    { name: 'QA Calibration / Feedback', type: 'planned' as const, scope: 'internal' as const, percentage: 0.8, minutesPerDay: 4, moveable: true },
    { name: 'Annual Leave / Vacation', type: 'planned' as const, scope: 'external' as const, percentage: 5.0, minutesPerDay: 0, moveable: false },
    { name: 'Public Holidays', type: 'planned' as const, scope: 'external' as const, percentage: 2.1, minutesPerDay: 0, moveable: false },
    { name: 'Planned Leave Buffer', type: 'planned' as const, scope: 'external' as const, percentage: 1.0, minutesPerDay: 0, moveable: false },
] as const

export const SHRINKAGE_UNPLANNED = [
    { name: 'Sick Leave', type: 'unplanned' as const, scope: 'external' as const, percentage: 3.5, moveable: false },
    { name: 'Tardiness / Late Arrivals', type: 'unplanned' as const, scope: 'external' as const, percentage: 1.0, moveable: false },
    { name: 'Early Departures', type: 'unplanned' as const, scope: 'external' as const, percentage: 0.5, moveable: false },
    { name: 'No-Call-No-Show', type: 'unplanned' as const, scope: 'external' as const, percentage: 0.5, moveable: false },
    { name: 'Extended Breaks (overruns)', type: 'unplanned' as const, scope: 'internal' as const, percentage: 1.0, moveable: false },
    { name: 'Unscheduled Personal Time', type: 'unplanned' as const, scope: 'internal' as const, percentage: 1.0, moveable: false },
    { name: 'System Downtime', type: 'unplanned' as const, scope: 'internal' as const, percentage: 1.0, moveable: false },
    { name: 'Special Projects / Back-Office', type: 'unplanned' as const, scope: 'internal' as const, percentage: 0.5, moveable: false },
] as const

// Aux code labels
export const AUX_CODE_LABELS: Record<string, string> = {
    ready: 'Ready',
    'on-call': 'On Call',
    'wrap-up': 'Wrap-Up',
    break: 'Break',
    lunch: 'Lunch',
    meeting: 'Meeting',
    coaching: 'Coaching',
    training: 'Training',
    personal: 'Personal',
    'system-down': 'System Down',
    project: 'Project',
} as const

// Leave types
export const LEAVE_TYPE_LABELS: Record<string, string> = {
    paid: 'Paid Leave',
    unpaid: 'Unpaid Leave',
    sick: 'Sick Leave',
    training: 'Training Leave',
    maternity: 'Maternity Leave',
    bereavement: 'Bereavement Leave',
} as const

// Shift patterns
export const SHIFT_PATTERNS = [
    { name: 'Early', start: '07:00', end: '15:00', type: 'early' as const },
    { name: 'Mid', start: '10:00', end: '18:00', type: 'mid' as const },
    { name: 'Late', start: '16:00', end: '00:00', type: 'late' as const },
] as const

// 10 teams × 10 agents — Teams A–F → Client A; G–J → Client B
export const TEAMS = [
    { id: 'team-a', name: 'Team A', leadName: 'Sarah Chen', leadId: 'tl-001', clientId: 'client-a' as const },
    { id: 'team-b', name: 'Team B', leadName: 'Marcus Jones', leadId: 'tl-002', clientId: 'client-a' as const },
    { id: 'team-c', name: 'Team C', leadName: 'Priya Patel', leadId: 'tl-003', clientId: 'client-a' as const },
    { id: 'team-d', name: 'Team D', leadName: 'James Wilson', leadId: 'tl-004', clientId: 'client-a' as const },
    { id: 'team-e', name: 'Team E', leadName: 'Amara Okafor', leadId: 'tl-005', clientId: 'client-a' as const },
    { id: 'team-f', name: 'Team F', leadName: 'Elena Rossi', leadId: 'tl-006', clientId: 'client-a' as const },
    { id: 'team-g', name: 'Team G', leadName: 'David Okonkwo', leadId: 'tl-007', clientId: 'client-b' as const },
    { id: 'team-h', name: 'Team H', leadName: 'Yuki Tanaka', leadId: 'tl-008', clientId: 'client-b' as const },
    { id: 'team-i', name: 'Team I', leadName: 'Carlos Mendez', leadId: 'tl-009', clientId: 'client-b' as const },
    { id: 'team-j', name: 'Team J', leadName: 'Fatima Al-Nasser', leadId: 'tl-010', clientId: 'client-b' as const },
] as const
