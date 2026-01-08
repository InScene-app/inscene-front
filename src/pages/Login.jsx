import React, { useState } from 'react';
import api, { setAuthToken } from '../api/client';
import { parseJwt } from '../utils/jwt';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await api.post('/auth/login', { email, password });
      const token = result.data?.access_token;
      const user = result.data?.user;
      if (token) {
        setAuthToken(token);
        const payload = parseJwt(token);
        setDecoded(payload || null);
      } else {
        setError('No token returned from server');
      }
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login (test)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
  );
}
