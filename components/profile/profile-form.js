import { useRef, useState } from 'react';
import classes from './profile-form.module.css';

function ProfileForm(props) {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm(oldPassword, newPassword, confirmPassword) {
    const errors = {};
    
    if (!oldPassword) {
      errors.oldPassword = 'Old password is required';
    }
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (oldPassword && newPassword && oldPassword === newPassword) {
      errors.newPassword = 'New password must be different from old password';
    }
    
    return errors;
  }

  async function submitHandler(event) {
    event.preventDefault();
    
    const enteredOldPassword = oldPasswordRef.current.value;
    const enteredNewPassword = newPasswordRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current.value;

    // Валидация
    const validationErrors = validateForm(
      enteredOldPassword, 
      enteredNewPassword, 
      enteredConfirmPassword
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);

    try {
      await props.onChangePassword({
        oldPassword: enteredOldPassword,
        newPassword: enteredNewPassword
      });
      
      // Очищаем форму после успешной отправки
      oldPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
      confirmPasswordRef.current.value = '';
      
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInputChange() {
    // Очищаем ошибки при изменении полей
    setErrors({});
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.formGroup}>
        <div className={classes.control}>
          <label htmlFor='old-password'>
            <span className={classes.labelIcon}>🔒</span>
            Current Password
          </label>
          <input 
            type='password' 
            id='old-password' 
            ref={oldPasswordRef}
            className={errors.oldPassword ? classes.error : ''}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="Enter your current password"
          />
          {errors.oldPassword && (
            <div className={classes.errorMessage}>
              <span className={classes.errorIcon}>⚠️</span>
              {errors.oldPassword}
            </div>
          )}
        </div>

        <div className={classes.control}>
          <label htmlFor='new-password'>
            <span className={classes.labelIcon}>🆕</span>
            New Password
          </label>
          <input 
            type='password' 
            id='new-password' 
            ref={newPasswordRef}
            className={errors.newPassword ? classes.error : ''}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="Enter your new password"
          />
          {errors.newPassword && (
            <div className={classes.errorMessage}>
              <span className={classes.errorIcon}>⚠️</span>
              {errors.newPassword}
            </div>
          )}
        </div>

        <div className={classes.control}>
          <label htmlFor='confirm-password'>
            <span className={classes.labelIcon}>✅</span>
            Confirm New Password
          </label>
          <input 
            type='password' 
            id='confirm-password' 
            ref={confirmPasswordRef}
            className={errors.confirmPassword ? classes.error : ''}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="Confirm your new password"
          />
          {errors.confirmPassword && (
            <div className={classes.errorMessage}>
              <span className={classes.errorIcon}>⚠️</span>
              {errors.confirmPassword}
            </div>
          )}
        </div>
      </div>

      <div className={classes.passwordStrength}>
        <div className={classes.strengthHeader}>
          <span>Password Strength:</span>
          <span className={classes.strengthIndicator}>Medium</span>
        </div>
        <div className={classes.strengthBar}>
          <div className={`${classes.strengthSegment} ${classes.active}`}></div>
          <div className={`${classes.strengthSegment} ${classes.active}`}></div>
          <div className={classes.strengthSegment}></div>
          <div className={classes.strengthSegment}></div>
        </div>
        <div className={classes.strengthTips}>
          <small>Tip: Use a mix of letters, numbers, and symbols</small>
        </div>
      </div>

      <div className={classes.action}>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={isSubmitting ? classes.loading : ''}
        >
          {isSubmitting ? (
            <>
              <span className={classes.spinner}></span>
              Changing Password...
            </>
          ) : (
            'Change Password'
          )}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;