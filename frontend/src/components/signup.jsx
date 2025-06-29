import React, { useContext, useState } from 'react';
import { authStyles as styles } from '../assets/dummystyle';
import { UserContext } from '../context/userContext';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import Input from './input';

const Signup = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError('pleae enter full name');
      return;
    }
    if (!validateEmail(email)) {
      setError('please enter a correct email');
      return;
    }
    if (!password) {
      setError('please enter a password');
      return;
    }
    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'something went wrong. please try again!'
      );
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}> Create Account</h3>
        <p className={styles.signupSubtitle}>
          Join thousands of professionals today
        </p>
      </div>

      {/* form */}
      <form onSubmit={handleSignUp} className={styles.signupForm}>
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          placeholder="Enter your full name"
          type="text"
          label="fullName"
        />
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          placeholder="Enter your email"
          type="email"
          label="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Enter password"
          type="password"
          label="password"
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" className={styles.signupSubmit}>
          CreateAccount
        </button>

        {/* footer */}
        <p className={styles.switchText}>
          Already have an account?{' '}
          <button
            className={styles.signupSwitchButton}
            onClick={() => setCurrentPage('login')}
            type="button">
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
