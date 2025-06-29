import React, { useContext, useState } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { authStyles as styles } from '../assets/dummystyle';
import Input from './input';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const token = response.data;
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
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>
          Sign in to continue building amazing resumes
        </p>
      </div>

      {/* form */}
      <form className={styles.form} onSubmit={handleLogin}>
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

        <button className={styles.submitButton} type="submit">
          Sign in
        </button>

        <p className={styles.switchText}>
          Dont't have an account{' '}
          <button
            className={styles.switchButton}
            onClick={() => {
              setCurrentPage('signup');
            }}>
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
