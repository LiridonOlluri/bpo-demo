export const queryKeys = {
    attendance: {
        all: ['attendance'] as const,
        live: () => [...queryKeys.attendance.all, 'live'] as const,
        byTeam: (teamId: string) => [...queryKeys.attendance.all, 'team', teamId] as const,
        byAgent: (agentId: string) => [...queryKeys.attendance.all, 'agent', agentId] as const,
    },
    workforce: {
        all: ['workforce'] as const,
        erlang: (clientId: string) => [...queryKeys.workforce.all, 'erlang', clientId] as const,
        schedule: (weekId: string) => [...queryKeys.workforce.all, 'schedule', weekId] as const,
        intervals: () => [...queryKeys.workforce.all, 'intervals'] as const,
        shrinkage: () => [...queryKeys.workforce.all, 'shrinkage'] as const,
    },
    performance: {
        all: ['performance'] as const,
        live: () => [...queryKeys.performance.all, 'live'] as const,
        demo: () => [...queryKeys.performance.all, 'demo'] as const,
        fteLoss: (teamId?: string) => [...queryKeys.performance.all, 'fte-loss', teamId] as const,
        fteLossAll: () => [...queryKeys.performance.all, 'fte-loss', 'all'] as const,
    },
    tickets: {
        all: ['tickets'] as const,
        byTeam: (teamId: string) => [...queryKeys.tickets.all, 'team', teamId] as const,
        byId: (id: string) => [...queryKeys.tickets.all, id] as const,
        scorecard: () => [...queryKeys.tickets.all, 'scorecard'] as const,
    },
    leave: {
        all: ['leave'] as const,
        capacity: () => [...queryKeys.leave.all, 'capacity'] as const,
        requests: (status?: string) => [...queryKeys.leave.all, 'requests', status] as const,
        bradford: (teamId?: string) => [...queryKeys.leave.all, 'bradford', teamId] as const,
        balances: (teamId?: string) => [...queryKeys.leave.all, 'balances', teamId] as const,
    },
    payroll: {
        all: ['payroll'] as const,
        summary: (period: string) => [...queryKeys.payroll.all, 'summary', period] as const,
        byAgent: (agentId: string) => [...queryKeys.payroll.all, 'agent', agentId] as const,
    },
    clients: {
        all: ['clients'] as const,
        byId: (id: string) => [...queryKeys.clients.all, id] as const,
        sla: (id: string) => [...queryKeys.clients.all, id, 'sla'] as const,
    },
    agents: {
        all: ['agents'] as const,
        byTeam: (teamId: string) => [...queryKeys.agents.all, 'team', teamId] as const,
        byId: (id: string) => [...queryKeys.agents.all, id] as const,
    },
    executive: {
        all: ['executive'] as const,
        overview: (client: string, period: string) => [...queryKeys.executive.all, 'overview', client, period] as const,
    },
} as const
