'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success(t('toast.signInSuccess'));
      router.push('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific error cases
      if (error.message.includes('UserNotConfirmedException')) {
        toast.error(t('toast.verifyEmail'));
        router.push(`/auth/confirm?email=${encodeURIComponent(email)}`);
      } else if (error.message.includes('NotAuthorizedException')) {
        toast.error(t('toast.invalidCredentials'));
      } else if (error.message.includes('UserNotFoundException')) {
        toast.error(t('toast.userNotFound'));
      } else {
        toast.error(error.message || t('toast.signInFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-stone-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <style jsx>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes golden-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.1); }
          50% { box-shadow: 0 0 40px rgba(217, 119, 6, 0.2); }
        }
        .float-animation {
          animation: subtle-float 6s ease-in-out infinite;
        }
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(217, 119, 6, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: golden-shimmer 3s infinite;
        }
        .glow-effect {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(217, 119, 6, 0.1);
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-amber-300/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-amber-300/15 to-amber-400/5 rounded-full blur-2xl float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-amber-100/30 to-amber-200/10 rounded-full blur-lg float-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <Card className="glass-effect shadow-2xl border-amber-100/50 glow-effect animate-in fade-in-0 slide-in-from-bottom-4 duration-700 overflow-hidden">
          {/* Decorative header border */}
          <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 shimmer-effect"></div>
          
          <CardHeader className="text-center space-y-4 pb-8 pt-8">
            {/* Logo/Brand element */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg float-animation">
              <div className="text-2xl font-serif italic text-white">g</div>
            </div>
            
            <CardTitle className="text-3xl font-light bg-gradient-to-r from-amber-800 to-amber-900 bg-clip-text text-transparent">
              {t('auth.signin.title')}
            </CardTitle>
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto"></div>
            <p className="text-amber-700 text-sm font-light leading-relaxed">{t('auth.signin.subtitle')}</p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-amber-800 tracking-wide">
                  {t('auth.signin.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.signin.emailPlaceholder')}
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-300 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-900 placeholder:text-amber-400 rounded-lg px-4 py-3"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-amber-800 tracking-wide">
                  {t('auth.signin.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.signin.passwordPlaceholder')}
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-300 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-900 placeholder:text-amber-400 rounded-lg px-4 py-3"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl text-white font-medium py-3 rounded-lg border-0" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="font-light">{t('auth.signin.signingIn')}</span>
                  </div>
                ) : (
                  <span className="font-medium tracking-wide">{t('auth.signin.button')}</span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-amber-700 font-light">
                {t('auth.signin.noAccount')}{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-amber-800 hover:text-amber-900 font-medium transition-all duration-300 hover:underline decoration-2 decoration-amber-600 underline-offset-4 relative inline-block"
                >
                  {t('nav.signup')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform scale-x-0 transition-transform duration-300 hover:scale-x-100"></span>
                </Link>
              </p>
            </div>

            {/* Demo credentials info */}
            <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50 glass-effect animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600 shimmer-effect"></div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center float-animation">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-semibold mb-3 tracking-wide">{t('auth.signin.demoAccount')}</p>
                  <div className="text-xs text-amber-700 space-y-2 font-light leading-relaxed">
                    <p className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 flex-shrink-0"></span>
                      {t('auth.signin.demoDesc1')}
                    </p>
                    <p className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 flex-shrink-0"></span>
                      {t('auth.signin.demoDesc2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}