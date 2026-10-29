import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Button, Input, Field } from '../components/ui';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@shadighader.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-ink-100">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-ink-200 bg-white p-8 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Shadi Ghader CMS</h1>
          <p className="text-sm text-ink-400">Sign in to manage your website content.</p>
        </div>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-center text-xs text-ink-400">Default: admin@shadighader.com / admin12345</p>
      </form>
    </div>
  );
}
