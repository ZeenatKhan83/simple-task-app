import React, { useState } from 'react';

function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(false); // Default to registration
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
        ? { email: formData.email, password: formData.password }
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

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto 0 auto' }}>
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
          <div style={{ 
            background: '#FEF2F2', 
            border: '1px solid #FCA5A5', 
            color: '#EF4444', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            fontSize: '0.88rem', 
            marginBottom: '20px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Username
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Zeenat"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="zeenatkhan@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '8px' }}>
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