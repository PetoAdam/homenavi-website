"use client";

import { useState } from "react";
import {
  DEFAULT_ANSWERS,
  getRecommendation,
  renderSetupPlanMarkdown,
  type Connectivity,
  type DeploymentAnswers,
  type ExistingHardware,
  type Expertise,
  type HostingPreference,
  type VoiceNeed,
} from "../../../lib/deployment";
import HardwareArchitectureMap from "./HardwareArchitectureMap";

const STEPS = ["Hosting", "Hardware", "Connectivity", "Voice", "Experience", "Recommendation"];

const HOSTING_OPTIONS: { value: HostingPreference; label: string; detail: string }[] = [
  { value: "tryout", label: "Tryout quickstart", detail: "Run the local Compose stack with simulated adapter data and no home-device configuration." },
  { value: "self-hosted", label: "Local and self-hosted", detail: "Run the core services on hardware you control for local control and fewer cloud dependencies." },
  { value: "hybrid", label: "Hybrid cloud core with SBC adapters", detail: "Run the core in the cloud while an SBC keeps LAN/WAN and radio adapters at home." },
  { value: "homelab", label: "Advanced homelab with Helm", detail: "Use a Kubernetes/Helm deployment when cluster operations are already part of your normal setup." },
];

const HARDWARE_OPTIONS: { value: ExistingHardware; label: string; detail: string }[] = [
  { value: "server", label: "Always-on computer or server", detail: "Use an existing capable local host before considering new hardware." },
  { value: "nas", label: "NAS", detail: "A NAS can be a suitable host when it supports Docker and has adequate storage." },
  { value: "kubernetes", label: "Kubernetes cluster", detail: "Use the Helm path when your cluster, storage, ingress, and operational practices are already in place." },
  { value: "sbc", label: "Small single-board computer", detail: "A capable Pi-class board can suit a small stack after validating storage and image support." },
  { value: "none", label: "No suitable host yet", detail: "The guide will explain what the selected deployment requires; it will not recommend a purchase automatically." },
];

const CONNECTIVITY_OPTIONS: { value: Connectivity; label: string; detail: string }[] = [
  { value: "ip", label: "Wi-Fi or Ethernet integrations", detail: "Network integrations and vendor services that do not need a local radio." },
  { value: "zigbee", label: "Zigbee", detail: "Requires a coordinator and the supported Zigbee2MQTT integration path." },
  { value: "matter-ip", label: "Matter over Wi-Fi or Ethernet", detail: "Matter is an application-layer standard. Homenavi controller and commissioning support is planned, not validated today." },
  { value: "matter-thread", label: "Matter over Thread", detail: "Thread is the network layer. A Thread radio alone is not a Matter controller or commissioning flow." },
  { value: "unsure", label: "Not sure yet", detail: "Start with network integrations or the mock adapter while choosing devices." },
];

const VOICE_OPTIONS: { value: VoiceNeed; label: string; detail: string }[] = [
  { value: "none", label: "No voice assistant", detail: "Keep the first deployment focused on dashboards, devices, and automations." },
  { value: "starter", label: "Voice starter", detail: "Room audio and wake-word hardware are a proof-of-concept path, not an end-to-end supported installer." },
  { value: "hybrid", label: "Voice hybrid", detail: "Use local device control with remote inference where an implementation supports it." },
  { value: "offline", label: "Voice private or offline", detail: "Local speech and LLM workloads increase CPU, memory, storage, and sometimes GPU requirements." },
];

const EXPERTISE_OPTIONS: { value: Expertise; label: string; detail: string }[] = [
  { value: "beginner", label: "Beginner", detail: "Guided steps, verified commands, and clear checkpoints." },
  { value: "intermediate", label: "Intermediate", detail: "Configuration, validation commands, and troubleshooting context." },
  { value: "advanced", label: "Advanced", detail: "Compose or Helm, network topology, secrets, persistence, observability, and rollback planning." },
];

function ChoiceList<T extends string>({ name, value, options, onChange }: { name: string; value: T; options: { value: T; label: string; detail: string }[]; onChange: (value: T) => void }) {
  return (
    <div className="wizard-choice-list" role="radiogroup" aria-label={name}>
      {options.map((option) => (
        <label className={`wizard-choice${value === option.value ? " selected" : ""}`} key={option.value}>
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
          <span><strong>{option.label}</strong><small>{option.detail}</small></span>
        </label>
      ))}
    </div>
  );
}

export default function DeploymentWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DeploymentAnswers>(DEFAULT_ANSWERS);
  const isRecommendation = step === STEPS.length - 1;

  const setAnswer = <K extends keyof DeploymentAnswers>(key: K, value: DeploymentAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };
  const setHosting = (hosting: HostingPreference) => {
    setAnswers((current) => hosting === "tryout"
      ? { ...current, hosting, hardware: "none", connectivity: ["unsure"], voice: "none" }
      : { ...current, hosting });
  };
  const isTryout = answers.hosting === "tryout";
  const toggleConnectivity = (value: Connectivity) => {
    setAnswers((current) => {
      const includes = current.connectivity.includes(value);
      const next = includes ? current.connectivity.filter((item) => item !== value) : [...current.connectivity, value];
      return { ...current, connectivity: next.length ? next : ["unsure"] };
    });
  };
  const restart = () => {
    setAnswers(DEFAULT_ANSWERS);
    setStep(0);
  };

  return (
    <section className="deployment-wizard" aria-labelledby="wizard-title">
      <header className="wizard-header">
        <p className="eyebrow">Interactive setup planner</p>
        <h2 id="wizard-title">Find the deployment that fits the home you run.</h2>
        <p>Answer five practical questions. The recommendation explains its trade-offs and only uses verified Homenavi paths.</p>
      </header>
      <ol className="wizard-progress" aria-label="Deployment wizard progress">
        {STEPS.map((label, index) => <li className={index === step ? "current" : index < step ? "complete" : ""} key={label}><span>{index + 1}</span>{label}</li>)}
      </ol>

      <div className="wizard-panel">
        {step === 0 ? <>
          <h3>Where should the core run?</h3>
          <p>Choose the boundary you want for the Homenavi core. Compose, hybrid, and Helm are standard choices; the tryout uses simulated data only.</p>
          <ChoiceList name="Hosting preference" value={answers.hosting} options={HOSTING_OPTIONS} onChange={setHosting} />
        </> : null}
        {step === 1 ? <>
          {isTryout ? <><h3>No home hardware needed for the tryout.</h3><p>The mock adapter supplies simulated integration data. You only need the computer running Docker Compose.</p></> : <><h3>What hardware is already available?</h3><p>Existing capable hardware comes first. A separate gateway is optional and only useful for radio placement, isolation, or independent availability.</p><ChoiceList name="Existing hardware" value={answers.hardware} options={HARDWARE_OPTIONS} onChange={(value) => setAnswer("hardware", value)} /></>}
        </> : null}
        {step === 2 ? <>
          {isTryout ? <><h3>No device configuration needed for the tryout.</h3><p>The mock adapter is selected automatically. Choose a self-hosted, hybrid, or Helm profile later to plan real integrations.</p></> : <><h3>How will devices connect?</h3><p>Select every protocol that matters. Zigbee uses a coordinator and Zigbee2MQTT; Thread hardware is not by itself a complete Matter installation.</p><div className="wizard-choice-list">
            {CONNECTIVITY_OPTIONS.map((option) => <label className={`wizard-choice${answers.connectivity.includes(option.value) ? " selected" : ""}`} key={option.value}>
              <input type="checkbox" value={option.value} checked={answers.connectivity.includes(option.value)} onChange={() => toggleConnectivity(option.value)} />
              <span><strong>{option.label}</strong><small>{option.detail}</small></span>
            </label>)}
          </div></>}
        </> : null}
        {step === 3 ? <>
          {isTryout ? <><h3>Voice is not part of the tryout.</h3><p>The local mock-adapter path stays focused on exploring the core interface without room hardware or assistant configuration.</p></> : <><h3>What role should voice play?</h3><p>Voice-related choices affect hardware and trust boundaries. They do not automatically install a complete assistant.</p><ChoiceList name="Voice requirements" value={answers.voice} options={VOICE_OPTIONS} onChange={(value) => setAnswer("voice", value)} /></>}
        </> : null}
        {step === 4 ? <>
          <h3>How much deployment detail do you want?</h3>
          <p>Every recommendation includes a working path. This controls how much operational context the guide foregrounds.</p>
          <ChoiceList name="Deployment experience" value={answers.expertise} options={EXPERTISE_OPTIONS} onChange={(value) => setAnswer("expertise", value)} />
        </> : null}
        {isRecommendation ? <Recommendation answers={answers} onEdit={(target) => setStep(target)} /> : null}
      </div>

      <div className="wizard-actions">
        {step > 0 ? <button className="btn secondary" type="button" onClick={() => setStep((current) => current - 1)}>Back</button> : <span />}
        {isRecommendation ? <button className="btn secondary" type="button" onClick={restart}>Start over</button> : <button className="btn primary" type="button" onClick={() => setStep((current) => current + 1)}>Continue</button>}
      </div>
    </section>
  );
}

function Recommendation({ answers, onEdit }: { answers: DeploymentAnswers; onEdit: (step: number) => void }) {
  const recommendation = getRecommendation(answers);
  const downloadPlan = () => {
    const blob = new Blob([renderSetupPlanMarkdown(answers)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "homenavi-setup-plan.md";
    link.click();
    URL.revokeObjectURL(url);
  };
  return <div className="wizard-recommendation">
    <div className="wizard-recommendation-title"><p>Recommended profile</p><h3>{recommendation.profile.name}</h3><span>{recommendation.profile.complexity} complexity</span><button className="wizard-download" type="button" onClick={downloadPlan}>Download setup plan</button></div>
    <p className="wizard-summary">{recommendation.profile.summary}</p>
    <div className="wizard-edit-grid">
      <button type="button" onClick={() => onEdit(0)}>Hosting: {answers.hosting}</button>
      <button type="button" onClick={() => onEdit(1)}>Hardware: {answers.hardware}</button>
      <button type="button" onClick={() => onEdit(2)}>Connectivity: {answers.connectivity.join(", ")}</button>
      <button type="button" onClick={() => onEdit(3)}>Voice: {answers.voice}</button>
      <button type="button" onClick={() => onEdit(4)}>Experience: {answers.expertise}</button>
    </div>
    <div className="wizard-detail-grid">
      <Detail title="Why it fits" items={recommendation.why} />
      <Detail title="Required hardware" items={recommendation.requiredHardware} />
      <Detail title="Optional hardware" items={recommendation.optionalHardware.length ? recommendation.optionalHardware : ["No additional hardware is implied by these answers."]} />
      <Detail title="Services involved" items={recommendation.services} />
    </div>
    {recommendation.hardwareRecommendations.length ? <section className="wizard-hardware" aria-labelledby="hardware-recommendations-title"><div><h4 id="hardware-recommendations-title">Hardware and topology recommendations</h4><p>Only items relevant to your answers are shown. The role explains what each item does; status reflects the current Homenavi implementation.</p></div><div>{recommendation.hardwareRecommendations.map((item) => <a href={item.href} rel={item.href.startsWith("http") ? "external" : undefined} key={item.name}><span>{item.role} · {item.status}</span><strong>{item.name}</strong><small>{item.reason}</small></a>)}</div></section> : null}
    <HardwareArchitectureMap title={recommendation.profile.name} status={`${recommendation.profile.complexity} deployment`} profile={recommendation.profile.id} connectivity={answers.connectivity} voice={answers.voice} />
    <div className="wizard-tradeoffs">
      <Detail title="Advantages" items={recommendation.profile.pros} />
      <Detail title="Trade-offs" items={recommendation.profile.cons} />
    </div>
    {recommendation.limitations.length ? <div className="wizard-limitations"><h4>Known limitations and validation gaps</h4><ul>{recommendation.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    <div className="wizard-walkthrough"><h4>Verified setup walkthrough</h4>{recommendation.walkthrough.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h5>{item.title}</h5><p>{item.purpose}</p>{item.command ? <pre><code>{item.command}</code></pre> : null}<small>Expected: {item.expected}</small><a href={item.link}>Read the detailed guide</a></div></article>)}</div>
    {recommendation.remoteAccess.length ? <section className="wizard-remote-access" aria-labelledby="remote-access-title"><div><h4 id="remote-access-title">Optional remote access</h4><p>Use one of these only after the local deployment works. They supplement Homenavi authentication; they do not replace it.</p></div><div>{recommendation.remoteAccess.map((item) => <a href={item.href} rel="external" key={item.name}><strong>{item.name}</strong><small>{item.detail}</small></a>)}</div></section> : null}
  </div>;
}

function Detail({ title, items }: { title: string; items: string[] }) {
  return <section><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}