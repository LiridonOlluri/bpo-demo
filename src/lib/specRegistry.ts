/**
 * meTru ERP — BPO v1.0 registry excerpts (Part A).
 * Used for demo UI copy and the Indicators catalog.
 */

export const SPEC_VERSION = '1.0 — March 2026'

/** 11 categories, 95 configurable indicators (IDs A1–K7). */
export const INDICATOR_CATEGORIES = [
    {
        id: 'A',
        name: 'Workforce Composition',
        count: 7,
        items: ['A1 Total Headcount', 'A2 FTE Calculation', 'A3 Headcount by Skill/Programme', 'A4 Supervisor-to-Agent Ratio', 'A5 New Hires in Nesting', 'A6 Channel Split', 'A7 Chat Concurrency'],
    },
    {
        id: 'B',
        name: 'Attendance & Time Tracking',
        count: 12,
        items: [
            'B1 Shift Length',
            'B2 Operating Hours/Programme',
            'B3 Paid Breaks (min)',
            'B4 Lunch (paid/unpaid, min)',
            'B5 Grace Period (min)',
            'B6 OT Rate',
            'B7 Night Differential',
            'B8 Max Weekly Hours',
            'B9 Min Rest Between Shifts',
            'B10 Public Holidays',
            'B11 Annual Leave Entitlement',
            'B12 Sick Leave Entitlement',
        ],
    },
    {
        id: 'C',
        name: 'Shrinkage',
        count: 17,
        items: ['C1–C9 Planned categories (minutes; totals as %)', 'C10–C17 Unplanned — Shrinkage Category Builder per programme'],
    },
    {
        id: 'D',
        name: 'Schedule Adherence & Conformance',
        count: 4,
        items: ['D1 Schedule Adherence (85–95%)', 'D2 Schedule Conformance (90–95%)', 'D3 AUX Code Categories', 'D4 Idle/Available Time'],
    },
    {
        id: 'E',
        name: 'Call/Contact Metrics',
        count: 16,
        items: [
            'E1 Call Volume/Interval',
            'E2–E5 Offered, Answered, Abandoned, Blocked',
            'E6–E13 AHT, Talk, Hold, ACW, ASA, Queue, ATA, Longest Wait',
            'E14 Interval Granularity (30 min)',
            'E15 Chat Volume',
            'E16 Chat Concurrency',
        ],
    },
    {
        id: 'F',
        name: 'Service Level & Capacity',
        count: 10,
        items: ['F1 SL Target', 'F2 SL Actual', 'F3 Erlangs', 'F4 Base Staff Required', 'F5 Scheduled Staff Required', 'F6 Occupancy', 'F7 Utilisation', 'F8 Probability of Waiting', 'F9 Max Occupancy Cap', 'F10 Abandonment Target'],
    },
    {
        id: 'G',
        name: 'Forecasting',
        count: 7,
        items: ['G1 Historical Volume', 'G2 Day-of-Week Pattern', 'G3 Intraday Curve', 'G4 Seasonality', 'G5 Trend/Growth Rate', 'G6 Forecast Accuracy Target', 'G7 Campaign Calendar'],
    },
    {
        id: 'H',
        name: 'Agent Productivity',
        count: 8,
        items: ['H1 Calls/Agent/Hour', 'H2 Productive Time %', 'H3 FCR', 'H4 Transfer Rate', 'H5 Escalation Rate', 'H6 Repeat Call Rate', 'H7 Availability Rate', 'H8 Ramp-Up Efficiency'],
    },
    {
        id: 'I',
        name: 'Quality & CX',
        count: 7,
        items: ['I1 QA Score', 'I2 CSAT', 'I3 NPS', 'I4 CES', 'I5 SLA Breach Count', 'I6 SLA Compliance Rate', 'I7 Call Disposition Tags'],
    },
    {
        id: 'J',
        name: 'Financial',
        count: 8,
        items: ['J1 Cost per Call', 'J2 Cost per FTE/Month', 'J3 Revenue per Agent', 'J4 OT Cost', 'J5 Attrition Rate', 'J6 Cost of Attrition', 'J7 Programme Profitability', 'J8 Cost per Contact Trend'],
    },
    {
        id: 'K',
        name: 'HR & Wellbeing',
        count: 7,
        items: ['K1 Burnout Risk', 'K2 Engagement Score', 'K3 Tenure Distribution', 'K4 Internal Mobility', 'K5 Training Hours/Agent/Month', 'K6 Certification Status', 'K7 Bradford Score'],
    },
] as const

export const MODULE_FEATURE_COUNTS = [
    { module: '01 Attendance, Time-Off & Productivity', total: 41, functional: 33, visible: 6, premium: 2 },
    { module: '02 Workforce Forecast & Live Ops', total: 30, functional: 22, visible: 4, premium: 4 },
    { module: '03 HR, Recruiting & Lifecycle', total: 35, functional: 25, visible: 4, premium: 6 },
    { module: '04 Performance, Quality & Coaching', total: 29, functional: 18, visible: 5, premium: 6 },
    { module: '05 Payroll, Incentives & Finance', total: 17, functional: 12, visible: 4, premium: 1 },
    { module: '06 Client Billing & Revenue', total: 16, functional: 7, visible: 6, premium: 3 },
    { module: '07 Client On-Boarding & Contracts', total: 12, functional: 6, visible: 5, premium: 1 },
    { module: '08 Security, Compliance & Risk', total: 17, functional: 8, visible: 8, premium: 1 },
    { module: '09 Knowledge, Training & Certification', total: 17, functional: 9, visible: 4, premium: 4 },
    { module: '10 Insight & AI Co-Pilot', total: 19, functional: 12, visible: 1, premium: 6 },
] as const

export const SMART_LEAVE_STATES = [
    { state: 1, name: 'Normal', summary: '2 leave slots/week. Standard capacity gate.' },
    { state: 2, name: 'Volume drop (15%+)', summary: 'Surplus agents; TL/Ops notified to release extra slots and suggest agents by balance / days since leave.' },
    { state: 3, name: 'Volume recovery', summary: 'Slots restricted; already-approved leave not revoked.' },
] as const

export const FTE_LOSS_ENGINE_CATEGORIES = [
    'AHT overrun',
    'Excessive ACW',
    'Break overruns',
    'Tardiness',
    'Low adherence',
    'Unplanned absence',
] as const
