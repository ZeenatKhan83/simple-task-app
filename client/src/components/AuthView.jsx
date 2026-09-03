import React, { useState } from 'react';
import ForgotPasswordView from './ForgotPasswordView';

function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(false); // Default to registration
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { identifier: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      // Pass token and user details to App.jsx state
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordView onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="fade-in" style={{ maxWidth: '420px', margin: '40px auto 0 auto' }}>
      <div className="card-surface" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚡</div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: '800' }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLogin ? 'Sign in to access your workspace' : 'Start organizing your tasks with Momentum'}
          </p>
        </div>

        {error && (
          <div className="form-message form-message--error" role="alert" aria-live="polite">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label htmlFor="auth-username" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Username
              </label>
              <input
                id="auth-username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="input-field"
                placeholder="e.g. Zeenat"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="zeenatkhan@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="auth-password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              required
              minLength={isLogin ? undefined : 6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--borders)', paddingTop: '20px' }}>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.88rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthView;
