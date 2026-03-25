'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Switch } from '@/components/atoms/Switch'
import { Slider } from '@/components/atoms/Slider'
import { FormField } from '@/components/molecules/FormField'
import { Badge } from '@/components/atoms/Badge'
import { useErlang } from '@/hooks/useErlang'
import { ErlangResultPanel } from '@/components/organisms/ErlangResultPanel'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

const SHRINKAGE_CATEGORIES = [
    { key: 'breaks', label: 'Breaks', default: 8 },
    { key: 'training', label: 'Training', default: 5 },
    { key: 'coaching', label: 'Coaching', default: 3 },
    { key: 'meetings', label: 'Meetings', default: 2 },
    { key: 'absence', label: 'Absence', default: 5 },
    { key: 'tardiness', label: 'Tardiness', default: 2 },
    { key: 'systemDowntime', label: 'System Downtime', default: 1 },
    { key: 'other', label: 'Other', default: 2 },
] as const

const shrinkageCategorySchema = z.object({
    active: z.boolean(),
    percentage: z.number().min(0).max(100),
})

const schema = z.object({
    clientName: z.string().min(1, 'Client name is required'),
    industry: z.string().min(1, 'Industry is required'),
    channel: z.string().min(1, 'Channel is required'),
    billingModel: z.string().min(1, 'Billing model is required'),
    slaPercentage: z.number().min(0).max(100),
    slaSeconds: z.number().min(1),
    ahtTarget: z.number().min(1),
    acwTarget: z.number().min(0),
    dailyVolume: z.number().min(1),
    peakHours: z.number().min(1).max(24),
    occupancyTarget: z.number().min(0).max(100),
    occupancyCap: z.number().min(0).max(100),
    shrinkageCategories: z.record(z.string(), shrinkageCategorySchema),
})

type FormValues = z.infer<typeof schema>

const STEPS = ['Basic Info', 'SLA & Targets', 'Shrinkage Config', 'Staffing Review'] as const

interface ClientSetupWizardProps {
    onSubmit?: (data: FormValues) => void
}

export function ClientSetupWizard({ onSubmit }: ClientSetupWizardProps) {
    const [step, setStep] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const router = useRouter()

    const defaultShrinkage = Object.fromEntries(
        SHRINKAGE_CATEGORIES.map((c) => [c.key, { active: true, percentage: c.default }])
    )

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as Resolver<FormValues>,
        defaultValues: {
            clientName: '',
            industry: '',
            channel: 'voice',
            billingModel: 'per_fte',
            slaPercentage: 80,
            slaSeconds: 20,
            ahtTarget: 300,
            acwTarget: 30,
            dailyVolume: 500,
            peakHours: 8,
            occupancyTarget: 85,
            occupancyCap: 90,
            shrinkageCategories: defaultShrinkage,
        },
    })

    const watched = watch()

    const shrinkageValues = Object.values(watched.shrinkageCategories ?? {}) as { active: boolean; percentage: number }[]
    const totalShrinkage = shrinkageValues
        .filter((c) => c.active)
        .reduce((sum, c) => sum + c.percentage, 0)

    const { input: erlangInput, output: erlangOutput } = useErlang({
        callsPerInterval: Math.round((watched.dailyVolume || 500) / ((watched.peakHours || 8) * 2)),
        ahtSeconds: watched.ahtTarget || 300,
        intervalMinutes: 30,
        serviceLevelTarget: (watched.slaPercentage || 80) / 100,
        serviceLevelSeconds: watched.slaSeconds || 20,
        shrinkagePercent: totalShrinkage / 100,
        maxOccupancy: (watched.occupancyCap || 90) / 100,
    })

    const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
    const back = () => setStep((s) => Math.max(s - 1, 0))

    const doSubmit = (data: FormValues) => {
        // Store in localStorage for demo persistence (no DB needed)
        try {
            const existing = JSON.parse(localStorage.getItem('bpo-demo-clients') ?? '[]')
            const newClient = {
                id: `client-${Date.now()}`,
                name: data.clientName,
                industry: data.industry,
                channel: data.channel,
                billingModel: data.billingModel,
                agentsAssigned: erlangOutput.scheduledStaffRequired,
                slaTarget: { percentage: data.slaPercentage, seconds: data.slaSeconds },
                ahtTarget: data.ahtTarget,
                acwTarget: data.acwTarget,
                dailyVolume: data.dailyVolume,
                peakHours: Array.from({ length: data.peakHours }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`),
                occupancyTarget: data.occupancyTarget,
                occupancyCap: data.occupancyCap,
                totalShrinkage: totalShrinkage,
                requiredCertifications: [],
                operatingHours: { start: '07:00', end: '00:00' },
                createdAt: new Date().toISOString(),
            }
            existing.push(newClient)
            localStorage.setItem('bpo-demo-clients', JSON.stringify(existing))
        } catch {
            // localStorage not available — still show success
        }
        onSubmit?.(data)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <Card className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle2 size={48} className="text-status-green" />
                <h2 className="text-xl font-semibold">Client Created Successfully</h2>
                <p className="text-sm text-brand-gray max-w-md">
                    <span className="font-medium text-foreground">{watched.clientName}</span> has been set up with Erlang C staffing of{' '}
                    <Badge variant="green">{erlangOutput.scheduledStaffRequired} agents</Badge> (incl. {totalShrinkage.toFixed(0)}% shrinkage).
                </p>
                <div className="flex gap-3 mt-2">
                    <Button variant="secondary" onClick={() => { setStep(0); setSubmitted(false) }}>
                        Create Another
                    </Button>
                    <Button onClick={() => router.push('/clients')}>
                        Go to Clients
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <form onSubmit={handleSubmit(doSubmit)}>
            <Card className="space-y-6">
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                    {STEPS.map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${i <= step
                                    ? 'bg-brand-green text-white'
                                    : 'bg-surface-muted text-brand-gray'
                                    }`}
                            >
                                {i + 1}
                            </div>
                            <span className={`hidden text-xs sm:inline ${i <= step ? 'font-medium' : 'text-brand-gray'}`}>
                                {label}
                            </span>
                            {i < STEPS.length - 1 && <div className="h-px w-6 bg-surface-border" />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Basic Info */}
                {step === 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Client Name" error={errors.clientName?.message} required>
                            <Input {...register('clientName')} error={!!errors.clientName} placeholder="Acme Corp" />
                        </FormField>
                        <FormField label="Industry" error={errors.industry?.message} required>
                            <Input {...register('industry')} error={!!errors.industry} placeholder="Financial Services" />
                        </FormField>
                        <FormField label="Channel" error={errors.channel?.message} required>
                            <Select
                                {...register('channel')}
                                options={[
                                    { value: 'voice', label: 'Voice' },
                                    { value: 'chat', label: 'Chat' },
                                    { value: 'email', label: 'Email' },
                                    { value: 'blended', label: 'Blended' },
                                ]}
                            />
                        </FormField>
                        <FormField label="Billing Model" error={errors.billingModel?.message} required>
                            <Select
                                {...register('billingModel')}
                                options={[
                                    { value: 'per_fte', label: 'Per FTE' },
                                    { value: 'per_transaction', label: 'Per Transaction' },
                                    { value: 'fixed', label: 'Fixed Fee' },
                                    { value: 'outcome', label: 'Outcome-based' },
                                ]}
                            />
                        </FormField>
                    </div>
                )}

                {/* Step 2: SLA & Targets */}
                {step === 1 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="SLA %" error={errors.slaPercentage?.message} required>
                            <Input type="number" {...register('slaPercentage', { valueAsNumber: true })} error={!!errors.slaPercentage} />
                        </FormField>
                        <FormField label="SLA Seconds" error={errors.slaSeconds?.message} required>
                            <Input type="number" {...register('slaSeconds', { valueAsNumber: true })} error={!!errors.slaSeconds} />
                        </FormField>
                        <FormField label="AHT Target (sec)" error={errors.ahtTarget?.message} required>
                            <Input type="number" {...register('ahtTarget', { valueAsNumber: true })} error={!!errors.ahtTarget} />
                        </FormField>
                        <FormField label="ACW Target (sec)" error={errors.acwTarget?.message} required>
                            <Input type="number" {...register('acwTarget', { valueAsNumber: true })} error={!!errors.acwTarget} />
                        </FormField>
                        <FormField label="Daily Volume" error={errors.dailyVolume?.message} required>
                            <Input type="number" {...register('dailyVolume', { valueAsNumber: true })} error={!!errors.dailyVolume} />
                        </FormField>
                        <FormField label="Peak Hours" error={errors.peakHours?.message} required>
                            <Input type="number" {...register('peakHours', { valueAsNumber: true })} error={!!errors.peakHours} />
                        </FormField>
                        <FormField label="Occupancy Target %" error={errors.occupancyTarget?.message} required>
                            <Input type="number" {...register('occupancyTarget', { valueAsNumber: true })} error={!!errors.occupancyTarget} />
                        </FormField>
                        <FormField label="Occupancy Cap %" error={errors.occupancyCap?.message} required>
                            <Input type="number" {...register('occupancyCap', { valueAsNumber: true })} error={!!errors.occupancyCap} />
                        </FormField>
                    </div>
                )}

                {/* Step 3: Shrinkage Config */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Shrinkage Categories</h3>
                            <span className="text-xs text-brand-gray">Total: {totalShrinkage.toFixed(1)}%</span>
                        </div>
                        {SHRINKAGE_CATEGORIES.map((cat) => (
                            <div key={cat.key} className="flex items-center gap-4">
                                <Controller
                                    control={control}
                                    name={`shrinkageCategories.${cat.key}.active`}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value ?? false}
                                            onChange={field.onChange}
                                            label={cat.label}
                                        />
                                    )}
                                />
                                <div className="flex-1">
                                    <Controller
                                        control={control}
                                        name={`shrinkageCategories.${cat.key}.percentage`}
                                        render={({ field }) => (
                                            <Slider
                                                min={0}
                                                max={30}
                                                step={0.5}
                                                value={field.value}
                                                onChange={(e) => field.onChange(Number((e.target as HTMLInputElement).value))}
                                                displayValue={`${field.value}%`}
                                                disabled={!(watched.shrinkageCategories?.[cat.key] as { active: boolean } | undefined)?.active}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 4: Staffing Review */}
                {step === 3 && (
                    <ErlangResultPanel input={erlangInput} output={erlangOutput} />
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={back} disabled={step === 0}>
                        <ChevronLeft size={14} />
                        Back
                    </Button>
                    {step < STEPS.length - 1 ? (
                        <Button type="button" onClick={next}>
                            Next
                            <ChevronRight size={14} />
                        </Button>
                    ) : (
                        <Button type="submit">Create Client</Button>
                    )}
                </div>
            </Card>
        </form>
    )
}
