import { useState, useRef } from 'react';
import classes from './auth-form.module.css';

function ResetPasswordForm({ onBackToLogin }) {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const emailRef = useRef();
  const codeRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const email = emailRef.current.value;
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    // Симуляция отправки кода (в реальном проекте здесь будет API запрос)
    setTimeout(() => {
      setSuccess(`Reset code sent to ${email}`);
      setStep(2);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const code = codeRef.current.value;
    
    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit code.');
      setIsLoading(false);
      return;
    }

    // Симуляция проверки кода
    setTimeout(() => {
      setSuccess('Code verified successfully!');
      setStep(3);
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    // Симуляция сброса пароля
    setTimeout(() => {
      setSuccess('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className={classes.auth}>
      <h1>Reset Password</h1>
      <p className={classes.subtitle}>
        {step === 1 && 'Enter your email to receive a reset code'}
        {step === 2 && 'Enter the 6-digit code sent to your email'}
        {step === 3 && 'Create your new password'}
      </p>

      {/* Уведомления */}
      {error && (
        <div className={classes.errorAlert}>
          <span className={classes.alertIcon}>⚠️</span>
          <p>{error}</p>
          <button 
            className={classes.closeAlert} 
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className={classes.successAlert}>
          <span className={classes.alertIcon}>✅</span>
          <p>{success}</p>
          <button 
            className={classes.closeAlert} 
            onClick={() => setSuccess('')}
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={
        step === 1 ? handleSendCode :
        step === 2 ? handleVerifyCode :
        handleResetPassword
      }>
        {step === 1 && (
          <div className={classes.control}>
            <label htmlFor='resetEmail'>
              <span className={classes.labelIcon}>📧</span>
              Your Email
            </label>
            <input 
              type='email' 
              id='resetEmail' 
              required 
              ref={emailRef}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
        )}

        {step === 2 && (
          <div className={classes.control}>
            <label htmlFor='resetCode'>
              <span className={classes.labelIcon}>🔢</span>
              6-Digit Code
            </label>
            <input 
              type='text' 
              id='resetCode' 
              required 
              ref={codeRef}
              placeholder="Enter code (e.g., 123456)"
              maxLength="6"
              pattern="[0-9]*"
              disabled={isLoading}
            />
            <div className={classes.codeHint}>
              <small>Check your email for the reset code</small>
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className={classes.control}>
              <label htmlFor='newPassword'>
                <span className={classes.labelIcon}>🔒</span>
                New Password
              </label>
              <input
                type='password'
                id='newPassword'
                required
                ref={newPasswordRef}
                placeholder="Enter new password"
                disabled={isLoading}
              />
            </div>

            <div className={classes.control}>
              <label htmlFor='confirmNewPassword'>
                <span className={classes.labelIcon}>🔑</span>
                Confirm New Password
              </label>
              <input
                type='password'
                id='confirmNewPassword'
                required
                ref={confirmPasswordRef}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>

            <div className={classes.passwordRequirements}>
              <small>Password requirements:</small>
              <ul>
                <li>At least 6 characters long</li>
                <li>Contains letters and numbers</li>
              </ul>
            </div>
          </>
        )}

        <div className={classes.actions}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className={classes.loadingSpinner}></div>
            ) : (
              step === 1 ? 'Send Reset Code' :
              step === 2 ? 'Verify Code' :
              'Reset Password'
            )}
          </button>

          {step > 1 && (
            <button
              type='button'
              className={classes.toggle}
              onClick={() => setStep(step - 1)}
              disabled={isLoading}
            >
              ← Go Back
            </button>
          )}

          <button
            type='button'
            className={classes.toggle}
            onClick={onBackToLogin}
            disabled={isLoading}
          >
            Back to Login
          </button>
        </div>
      </form>

      <div className={classes.securityNote}>
        <span className={classes.securityIcon}>🔐</span>
        <p>For security reasons, reset codes expire in 15 minutes</p>
      </div>
    </section>
  );
}

export default ResetPasswordForm;