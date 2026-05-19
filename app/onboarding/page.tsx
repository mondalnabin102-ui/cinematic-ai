'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const steps = [
  {
    id: 'pacing',
    question: 'How should your videos feel?',
    options: [
      { value: 'slow', label: 'Slow & Contemplative', desc: 'Long shots, breathing room, philosophical' },
      { value: 'moderate', label: 'Balanced & Flowing', desc: 'Steady rhythm, clear progression' },
      { value: 'fast', label: 'Dynamic & Intense', desc: 'Quick cuts, high energy, urgent' },
    ]
  },
  {
    id: 'tone',
    question: 'What is your creative tone?',
    options: [
      { value: 'philosophical', label: 'Philosophical', desc: 'Deep ideas, reflective narration' },
      { value: 'documentary', label: 'Documentary', desc: 'Factual, journalistic, structured' },
      { value: 'cinematic', label: 'Cinematic Essay', desc: 'Emotional, visual, poetic' },
    ]
  },
  {
    id: 'density',
    question: 'How visually rich should scenes be?',
    options: [
      { value: 'minimal', label: 'Minimal', desc: 'Clean, sparse, focused' },
      { value: 'moderate', label: 'Moderate', desc: 'Balanced visual information' },
      { value: 'rich', label: 'Rich', desc: 'Layered, detailed, complex' },
    ]
  },
  {
    id: 'emotion',
    question: 'What emotional range do you explore?',
    options: [
      { value: 'dark', label: 'Dark & Heavy', desc: 'Tension, melancholy, weight' },
      { value: 'balanced', label: 'Light & Dark', desc: 'Full emotional spectrum' },
      { value: 'hopeful', label: 'Hopeful & Expansive', desc: 'Wonder, curiosity, optimism' },
    ]
  }
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const current = steps[step]

  const select = (value: string) => {
    setSelections(prev => ({ ...prev, [current.id]: value }))
  }

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          motion_philosophy: selections.pacing,
          tone: selections.tone,
          density_preference: selections.density,
          emotional_range: selections.emotion,
          onboarding_complete: true
        })
      }
      setSaving(false)
      setDone(true)
    }
  }

  if (done) return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '16px' }}>You are ready.</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Directo has learned your creative profile.</p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
          {steps.map((s, i) => (
            <div key={s.id} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= step ? '#fff' : '#333' }} />
          ))}
        </div>

        <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>Step {step + 1} of {steps.length}</p>
        <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '600', marginBottom: '32px' }}>{current.question}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {current.options.map(opt => (
            <div
              key={opt.value}
              onClick={() => select(opt.value)}
              style={{
                padding: '20px',
                border: `1px solid ${selections[current.id] === opt.value ? '#fff' : '#333'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                background: selections[current.id] === opt.value ? '#1a1a1a' : 'transparent',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>{opt.label}</div>
              <div style={{ color: '#666', fontSize: '13px' }}>{opt.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={next}
          disabled={!selections[current.id] || saving}
          style={{
            width: '100%',
            padding: '14px',
            background: selections[current.id] ? '#fff' : '#222',
            color: selections[current.id] ? '#000' : '#555',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: selections[current.id] ? 'pointer' : 'not-allowed'
          }}
        >
          {saving ? 'Saving...' : step < steps.length - 1 ? 'Continue' : 'Complete Setup'}
        </button>

      </div>
    </main>
  )
}