import { useRef, useState } from 'react'
import './App.css'

const themeStyles = {
  Modern: {
    page: 'bg-slate-950 text-white',
    hero: 'bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white',
    muted: 'text-indigo-100',
    section: 'bg-slate-900',
    card: 'border border-slate-700 bg-slate-900 shadow-xl shadow-black/20',
    skill: 'border border-indigo-400/30 bg-indigo-400/10 text-indigo-200',
    accent: 'text-indigo-300',
    projectGrid: 'grid-cols-1 md:grid-cols-2',
  },
  Minimalist: {
    page: 'bg-gray-50 text-gray-900',
    hero: 'bg-white text-gray-900',
    muted: 'text-gray-500',
    section: 'bg-gray-100',
    card: 'border border-gray-200 bg-white shadow-sm',
    skill: 'border border-gray-200 bg-white text-gray-700',
    accent: 'text-gray-600',
    projectGrid: 'grid-cols-1',
  },
  Creative: {
    page: 'bg-teal-50 text-teal-950',
    hero: 'bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 text-white',
    muted: 'text-teal-50',
    section: 'bg-teal-100',
    card: 'border border-teal-200 bg-white shadow-lg shadow-teal-900/10',
    skill: 'border border-teal-200 bg-teal-100 text-teal-800',
    accent: 'text-teal-700',
    projectGrid: 'grid-cols-1 md:grid-cols-2',
  },
}

function getSafeProjectUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

function PortfolioPreview({ data, selectedTheme }) {
  const styles = themeStyles[selectedTheme]
  const { personalInfo, skills, projects } = data

  return (
    <main className={`min-h-screen ${styles.page}`}>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <div className={`rounded-3xl p-8 sm:p-14 ${styles.hero}`}>
          <p className={`mb-5 text-xs font-bold uppercase tracking-[0.25em] ${styles.muted}`}>
            Personal portfolio
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            {personalInfo.name || 'Your name'}
          </h1>
          <p className="mt-4 text-xl font-medium sm:text-2xl">
            {personalInfo.title || 'Your professional title'}
          </p>
          {personalInfo.bio && (
            <p className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg ${styles.muted}`}>
              {personalInfo.bio}
            </p>
          )}
        </div>

        {skills.length > 0 && (
          <section className="py-12 sm:py-16">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Skills</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {skills.map((skill, index) => (
                <div
                  className={`rounded-2xl p-4 text-center text-sm font-semibold shadow-sm ${styles.skill}`}
                  key={`${skill}-${index}`}
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className={`rounded-3xl p-6 sm:p-10 ${styles.section}`}>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Selected projects</h2>
            <div className={`mt-6 grid gap-4 ${styles.projectGrid}`}>
              {projects.map((project, index) => {
                const safeUrl = getSafeProjectUrl(project.url)
                return (
                  <article className={`rounded-2xl p-6 ${styles.card}`} key={index}>
                    <h3 className="text-lg font-semibold">
                      {project.title || `Project ${index + 1}`}
                    </h3>
                    {project.description && (
                      <p className={`mt-2 text-sm leading-6 ${styles.muted}`}>
                        {project.description}
                      </p>
                    )}
                    {safeUrl && (
                      <a
                        className={`mt-5 inline-flex text-sm font-semibold underline underline-offset-4 ${styles.accent}`}
                        href={safeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit project <span aria-hidden="true" className="ml-1">↗</span>
                      </a>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}

        <footer className="mt-10 border-t border-current/10 py-6 sm:mt-14">
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${styles.muted}`}>
            Get in touch
          </p>
          {personalInfo.email ? (
            <a className={`mt-2 inline-block font-medium underline underline-offset-4 ${styles.accent}`} href={`mailto:${personalInfo.email}`}>
              {personalInfo.email}
            </a>
          ) : (
            <p className={`mt-2 text-sm ${styles.muted}`}>Add your email in the editor to share your contact details.</p>
          )}
        </footer>
      </div>
    </main>
  )
}

function App() {
  const [data, setData] = useState({
    personalInfo: { name: '', title: '', bio: '', email: '' },
    skills: [],
    projects: [],
  })
  const [selectedTheme, setSelectedTheme] = useState('Modern')
  const [isEditing, setIsEditing] = useState(true)
  const skillInputRef = useRef(null)

  function updatePersonalInfo(event) {
    const { name, value } = event.target
    setData((currentData) => ({
      ...currentData,
      personalInfo: { ...currentData.personalInfo, [name]: value },
    }))
  }

  function addSkill(event) {
    event.preventDefault()
    const input = skillInputRef.current
    const skill = input?.value.trim()
    if (!skill) return

    setData((currentData) => ({
      ...currentData,
      skills: [...currentData.skills, skill],
    }))
    input.value = ''
    input.focus()
  }

  function removeSkill(skillIndex) {
    setData((currentData) => ({
      ...currentData,
      skills: currentData.skills.filter((_, index) => index !== skillIndex),
    }))
  }

  function addProject() {
    setData((currentData) => ({
      ...currentData,
      projects: [...currentData.projects, { title: '', description: '', url: '' }],
    }))
  }

  function updateProject(projectIndex, field, value) {
    setData((currentData) => ({
      ...currentData,
      projects: currentData.projects.map((project, index) =>
        index === projectIndex ? { ...project, [field]: value } : project,
      ),
    }))
  }

  function removeProject(projectIndex) {
    setData((currentData) => ({
      ...currentData,
      projects: currentData.projects.filter((_, index) => index !== projectIndex),
    }))
  }

  if (!isEditing) {
    return (
      <div>
        <PortfolioPreview data={data} selectedTheme={selectedTheme} />
        <button
          className="fixed bottom-5 right-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={() => setIsEditing(true)}
          type="button"
        >
          ← Back to form
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 sm:mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true" />
            PORTFOLIO STUDIO
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Build your portfolio
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Add your details, choose a look, and create a portfolio that feels like you.
          </p>
        </header>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            setIsEditing(false)
          }}
        >
          <section className="editor-card">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Personal information</h2>
                <p className="mt-1 text-sm text-slate-500">Start with the essentials.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="field-label">
                Name
                <input
                  autoComplete="name"
                  className="field-input"
                  name="name"
                  onChange={updatePersonalInfo}
                  placeholder="e.g. Alex Morgan"
                  value={data.personalInfo.name}
                />
              </label>
              <label className="field-label">
                Professional title
                <input
                  className="field-input"
                  name="title"
                  onChange={updatePersonalInfo}
                  placeholder="e.g. Software Engineer"
                  value={data.personalInfo.title}
                />
              </label>
              <label className="field-label sm:col-span-2">
                Short bio
                <textarea
                  className="field-input min-h-28 resize-y"
                  name="bio"
                  onChange={updatePersonalInfo}
                  placeholder="A few lines about what you do and what you care about..."
                  rows="4"
                  value={data.personalInfo.bio}
                />
              </label>
              <label className="field-label sm:col-span-2">
                Contact email
                <input
                  autoComplete="email"
                  className="field-input"
                  name="email"
                  onChange={updatePersonalInfo}
                  placeholder="you@example.com"
                  type="email"
                  value={data.personalInfo.email}
                />
              </label>
            </div>
          </section>

          <section className="editor-card">
            <div className="section-heading">
              <span className="section-number">02</span>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Skills</h2>
                <p className="mt-1 text-sm text-slate-500">Highlight what you do best.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="new-skill">Add a skill</label>
              <input
                className="field-input"
                id="new-skill"
                placeholder="e.g. Product design"
                ref={skillInputRef}
              />
              <button className="secondary-button shrink-0" onClick={addSkill} type="button">
                + Add skill
              </button>
            </div>
            {data.skills.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <li className="skill-chip" key={`${skill}-${index}`}>
                    {skill}
                    <button
                      aria-label={`Remove ${skill}`}
                      className="ml-1 rounded-full px-1 text-slate-400 hover:bg-white hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                      onClick={() => removeSkill(index)}
                      type="button"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Your skills will appear here.</p>
            )}
          </section>

          <section className="editor-card">
            <div className="section-heading">
              <span className="section-number">03</span>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Projects</h2>
                <p className="mt-1 text-sm text-slate-500">Show a few things you’ve made.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {data.projects.map((project, index) => (
                <fieldset className="project-fields" key={index}>
                  <legend className="sr-only">Project {index + 1}</legend>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Project {index + 1}</p>
                    <button
                      className="text-sm font-medium text-rose-600 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                      onClick={() => removeProject(index)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4">
                    <label className="field-label">
                      Title
                      <input
                        className="field-input"
                        onChange={(event) => updateProject(index, 'title', event.target.value)}
                        placeholder="e.g. Travel planner"
                        value={project.title}
                      />
                    </label>
                    <label className="field-label">
                      Description
                      <textarea
                        className="field-input min-h-20 resize-y"
                        onChange={(event) => updateProject(index, 'description', event.target.value)}
                        placeholder="What did you build?"
                        rows="3"
                        value={project.description}
                      />
                    </label>
                    <label className="field-label">
                      Project URL
                      <input
                        className="field-input"
                        onChange={(event) => updateProject(index, 'url', event.target.value)}
                        placeholder="https://example.com"
                        type="url"
                        value={project.url}
                      />
                    </label>
                  </div>
                </fieldset>
              ))}
              <button className="secondary-button w-full" onClick={addProject} type="button">
                + Add a project
              </button>
            </div>
          </section>

          <section className="editor-card">
            <div className="section-heading">
              <span className="section-number">04</span>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Choose your style</h2>
                <p className="mt-1 text-sm text-slate-500">You can change this any time.</p>
              </div>
            </div>
            <label className="field-label mt-6">
              Portfolio theme
              <select
                className="field-input"
                onChange={(event) => setSelectedTheme(event.target.value)}
                value={selectedTheme}
              >
                {Object.keys(themeStyles).map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </label>
          </section>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <p className="self-center text-center text-xs text-slate-500 sm:mr-auto">
              Your changes are ready to preview.
            </p>
            <button className="primary-button" type="submit">
              Generate portfolio <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default App
