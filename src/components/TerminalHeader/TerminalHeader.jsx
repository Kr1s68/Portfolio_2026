import './TerminalHeader.css'

export default function TerminalHeader() {
  return (
    <div className="terminal-header">
      <div className="terminal-header__dots">
        <span className="terminal-header__dot terminal-header__dot--close" />
        <span className="terminal-header__dot terminal-header__dot--minimize" />
        <span className="terminal-header__dot terminal-header__dot--maximize" />
      </div>
      <div className="terminal-header__title">
        kristiyan@portfolio — bash — 80×24
      </div>
      <div className="terminal-header__spacer" />
    </div>
  )
}
