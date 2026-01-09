import { FormEvent, useState } from 'react';
import api, { setAuthToken } from '../api/client';
import { parseJwt } from '../utils/jwt';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  [key: string]: unknown;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'response' in e) {
        const error = e as { response?: { data?: { message?: string } }; message?: string };
        setError(error?.response?.data?.message || error.message || 'Login failed');
      } else {
        setError('Login failed');
      }
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
