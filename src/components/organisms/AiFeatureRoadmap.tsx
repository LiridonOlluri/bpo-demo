import { Card } from '@/components/atoms/Card'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'

const AI_FEATURES = [
    { name: 'Predictive Absence', description: 'ML model predicts unplanned absence based on historical patterns and external factors.' },
    { name: 'Auto-Schedule Optimization', description: 'Automatically generates optimal shift patterns based on forecast, preferences, and constraints.' },
    { name: 'Sentiment Analysis', description: 'Real-time customer sentiment scoring using NLP across voice and chat channels.' },
    { name: 'Smart Coaching Recommendations', description: 'AI-driven coaching suggestions based on agent performance gaps and learning paths.' },
    { name: 'Volume Forecasting ML', description: 'Machine learning volume prediction replacing traditional time-series models.' },
    { name: 'Attrition Risk Score', description: 'Early warning system scoring agents likely to resign within 90 days.' },
    { name: 'Real-time Speech Analytics', description: 'Live call analysis for compliance, script adherence, and escalation triggers.' },
    { name: 'Automated QA Scoring', description: 'AI-powered quality assurance scoring removing manual evaluation bottlenecks.' },
]

export function AiFeatureRoadmap() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">AI Feature Roadmap</h2>
                <p className="text-sm text-brand-gray">
                    These features activate with the AI module — no architectural change required.
                </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {AI_FEATURES.map((feature) => (
                    <AiFeatureLock
                        key={feature.name}
                        name={feature.name}
                        description={feature.description}
                    />
                ))}
            </div>
        </div>
    )
}
