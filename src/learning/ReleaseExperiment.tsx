import { useState } from 'react'
import { Experiment } from './Experiment'
import { evaluateRelease, releaseScenarios, releaseSteps } from './release-simulation'

export default function ReleaseExperiment() {
  const [selected, setSelected] = useState<string>('waiting')
  const scenario = releaseScenarios.find(item => item.id === selected)!
  const result = evaluateRelease(scenario.conditions)
  return <Experiment title="改变一个条件，流程会停在哪里？" onReset={() => setSelected('waiting')} caption="这是浏览器内的教学模拟，不会连接 GitHub、读取密钥或触发部署。假设生产配置、鉴权与上传命令本身正常。">
    <div className="ff-lab-controls ff-release-controls" role="group" aria-label="选择发布情境">
      {releaseScenarios.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}
    </div>
    <div className="ff-lab-stage ff-release-result" aria-live="polite" aria-atomic="true">
      <ol className="ff-release-progress">{releaseSteps.map((step, index) => {
        const status = index < result.step || result.state === 'verified' ? '通过' : index > result.step ? '未到达' : result.state === 'waiting' ? '等待' : '失败'
        return <li key={step} data-status={status}><span>{step}</span><span>{status}</span></li>
      })}</ol>
      <div className="ff-release-answer" data-state={result.state}>
        <h3>模拟结果：{result.title}</h3>
        <p>{result.explanation}</p>
        <p><strong>接下来：</strong>{result.next}</p>
      </div>
    </div>
  </Experiment>
}
