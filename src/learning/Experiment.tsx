import { useId, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'

export function Experiment({ title, children, onReset, caption }: { title: string; children: ReactNode; onReset: () => void; caption: string }) {
  const id = useId()
  return <figure className="ff-lab" aria-labelledby={id}>
    <figcaption className="ff-lab-heading" id={id}>
      <span>{title}</span>
      <button type="button" className="ff-reset" onClick={onReset}><RotateCcw size={13} aria-hidden="true" />还原参数</button>
    </figcaption>
    {children}
    <p className="ff-lab-caption">{caption}</p>
  </figure>
}

export function ChoiceGroup<T extends string>({ label, value, options, onChange }: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return <div className="ff-choice" role="group" aria-label={label}>
    <span className="ff-control-label">{label}</span>
    <div className="ff-choice-buttons">{options.map(option =>
      <button type="button" key={option.value} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>
    )}</div>
  </div>
}

export function RangeControl({ label, value, min, max, step = 1, unit = 'px', onChange }: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}) {
  const id = useId()
  return <div className="ff-range">
    <label htmlFor={id}>{label}<output htmlFor={id}>{Number(value.toFixed(1))}{unit}</output></label>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} />
  </div>
}
