import React from 'react';
import './LandingPage.css';

function LandingPage({ onGetStarted, onSignIn }) {
  return (
    <div className="lp-root">
      <div className="bg-workspace-container"></div>

      {/* NAV */}
      <nav className="lp-nav">
        <span className="lp-wordmark">Momentum</span>
        <button className="lp-nav-signin" onClick={onSignIn}>Sign in</button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-copy">
          <h1 className="lp-headline">
            Tasks that carry their own momentum
          </h1>
          <p className="lp-subhead">
            Momentum is a task manager built around a simple idea: once something
            is moving, it should stay moving. Capture work, push it through your
            flow, and see exactly how far you've come.
          </p>
          <div className="lp-hero-actions">
            <button className="btn-primary lp-cta-primary" onClick={onGetStarted}>
              Create your workspace
            </button>
            <button className="lp-cta-secondary" onClick={onSignIn}>
              I already have an account
            </button>
          </div>
        </div>

        <div className="lp-hero-visual" aria-hidden="true">
          <div className="lp-orbit-dot lp-orbit-dot-a">📌</div>
          <div className="lp-orbit-dot lp-orbit-dot-b">🎯</div>
          <div className="lp-trail"></div>
          <div className="lp-floating-card">
            <div className="lp-card-row">
              <span className="lp-card-check"></span>
              <span className="lp-card-title">Ship landing page</span>
            </div>
            <div className="lp-card-meta">
              <span className="lp-card-priority">● high</span>
              <span className="lp-card-date">📅 Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* TASK FLOW — a real sequence, so numbering/arrows are earned here */}
      <section className="lp-flow">
        <p className="lp-flow-intro">Every task follows the same path, start to finish.</p>
        <div className="lp-flow-track">
          <div className="lp-flow-step">
            <span className="lp-flow-dot" style={{ background: 'var(--text-muted)' }}></span>
            <span className="lp-flow-label">To Do</span>
          </div>
          <span className="lp-flow-arrow">→</span>
          <div className="lp-flow-step">
            <span className="lp-flow-dot" style={{ background: 'var(--primary)' }}></span>
            <span className="lp-flow-label">In Progress</span>
          </div>
          <span className="lp-flow-arrow">→</span>
          <div className="lp-flow-step">
            <span className="lp-flow-dot" style={{ background: 'var(--success)' }}></span>
            <span className="lp-flow-label">Completed</span>
          </div>
        </div>
      </section>

      {/* FEATURES — divided rows, not a repeated card grid */}
      <section className="lp-features">
        <div className="lp-feature-row">
          <h3 className="lp-feature-title">See your work your way</h3>
          <p className="lp-feature-desc">
            Switch between a list, a kanban board, a calendar, or a timeline —
            the same tasks, viewed however fits what you're doing right now.
          </p>
        </div>
        <div className="lp-feature-row">
          <h3 className="lp-feature-title">Find anything in seconds</h3>
          <p className="lp-feature-desc">
            Search, filter by status or priority, and sort by due date — built
            for the days your list is longer than you'd like.
          </p>
        </div>
        <div className="lp-feature-row">
          <h3 className="lp-feature-title">Stay in the zone</h3>
          <p className="lp-feature-desc">
            A built-in focus timer and a productivity heatmap show you not just
            what got done, but when you actually do your best work.
          </p>
        </div>
        <div className="lp-feature-row">
          <h3 className="lp-feature-title">Your account, protected</h3>
          <p className="lp-feature-desc">
            Passwords are hashed, sessions are token-based, and if you ever get
            locked out, an emailed reset code gets you back in safely.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-final-cta">
        <h2 className="lp-final-headline">Give your work somewhere to go.</h2>
        <button className="btn-primary lp-cta-primary" onClick={onGetStarted}>
          Create your workspace
        </button>
      </section>

      <footer className="lp-footer">
        <span>Momentum — a small, focused task manager.</span>
      </footer>
    </div>
  );
}

export default LandingPage;
