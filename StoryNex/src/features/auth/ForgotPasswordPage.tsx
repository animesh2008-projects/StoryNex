import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-surface border border-border p-8 rounded-xl shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading font-bold text-text-primary">
            Reset Password
          </h2>
          <p className="text-xs text-text-secondary">
            Enter your author email to receive a recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-lg bg-status-success/10 border border-status-success/30 text-status-success text-xs space-y-2 text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto" />
            <p className="font-semibold">Reset instructions sent!</p>
            <p className="text-text-muted">
              Check your inbox for instructions to restore access to your story universe.
            </p>
            <div className="pt-2">
              <Link to="/login" className="text-primary hover:underline font-medium">
                Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-strong text-black font-semibold rounded-lg text-sm transition-all"
            >
              Send Recovery Link
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center space-x-1 text-xs text-text-muted hover:text-text-primary">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
