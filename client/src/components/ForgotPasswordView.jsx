import React, { useState } from 'react';
import { taskService } from '../services/taskService';

// Two-step flow:
//   Step 1: enter email -> request an OTP be emailed
//   Step 2: enter the OTP + a new password -> reset it
function ForgotPasswordView({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const data = await taskService.forgotPassword(email);
      setInfo(data.message || 'If that email is registered, a reset code has been sent to it.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const data = await taskService.forgotPassword(email);
      setInfo(data.message || 'A new code has been sent.');
    } catch (err) {
      setError(err.message || 'Could not resend the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await taskService.resetPassword(email, otp, newPassword);
      setInfo(data.message || 'Password reset successfully!');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '420px', margin: '40px auto 0 auto' }}>
      <div className="card-surface" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔑</div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '800' }}>
            {step === 3 ? 'Password updated' : 'Reset your password'}
          </h2>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            {step === 1 && "We'll email you a 6-digit code."}
            {step === 2 && `Enter the code sent to ${email}`}
            {step === 3 && 'You can now sign in with your new password.'}
          </p>
        </div>

        {error && (
          <div className="form-message form-message--error" role="alert" aria-live="polite">
            ⚠️ {error}
          </div>
        )}
        {info && !error && (
          <div className="form-message form-message--success" role="status" aria-live="polite">
            ✅ {info}
          </div>
        )}

        {/* STEP 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="fp-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                id="fp-email"
                type="email"
                required
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP + new password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="fp-otp" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                6-digit code
              </label>
              <input
                id="fp-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
                className="input-field"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{ letterSpacing: '4px', fontSize: '1.1rem', textAlign: 'center' }}
              />
            </div>

            <div>
              <label htmlFor="fp-new-password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                New Password
              </label>
              <input
                id="fp-new-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="input-field"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="fp-confirm-password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                id="fp-confirm-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Didn't get a code? Resend
            </button>
          </form>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <button type="button" onClick={onBack} className="btn-primary" style={{ width: '100%' }}>
            Back to Sign In
          </button>
        )}

        {step !== 3 && (
          <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--borders)', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onBack}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordView;
