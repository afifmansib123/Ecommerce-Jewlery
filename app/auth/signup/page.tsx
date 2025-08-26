'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('toast.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      toast.error(t('toast.passwordTooShort'));
      return;
    }

    // Basic password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast.error(t('toast.passwordWeak'));
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email, password, name, role);
      
      if (result.needsConfirmation) {
        toast.success(t('toast.accountCreated'));
        // Pass both email and username to confirmation page
        router.push(`/auth/confirm?email=${encodeURIComponent(email)}&username=${encodeURIComponent(result.username)}`);
      } else {
        toast.success(t('toast.accountSuccess'));
        router.push('/');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || t('toast.createAccountFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-stone-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <style jsx>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes golden-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 25px rgba(217, 119, 6, 0.15); }
          50% { box-shadow: 0 0 45px rgba(217, 119, 6, 0.25); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .float-animation {
          animation: subtle-float 8s ease-in-out infinite;
        }
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(217, 119, 6, 0.15),
            transparent
          );
          background-size: 200% 100%;
          animation: golden-shimmer 3s infinite;
        }
        .glow-effect {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .sparkle-effect {
          animation: sparkle 2s ease-in-out infinite;
        }
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(217, 119, 6, 0.15);
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-40 h-40 bg-gradient-to-br from-amber-200/25 to-amber-300/15 rounded-full blur-xl float-animation"></div>
        <div className="absolute bottom-16 right-8 w-56 h-56 bg-gradient-to-br from-amber-300/20 to-amber-400/10 rounded-full blur-2xl float-animation" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-amber-100/35 to-amber-200/15 rounded-full blur-lg float-animation" style={{animationDelay: '6s'}}></div>
        <div className="absolute top-2/3 left-1/3 w-28 h-28 bg-gradient-to-br from-amber-200/30 to-amber-300/10 rounded-full blur-lg float-animation" style={{animationDelay: '1s'}}></div>
        
        {/* Sparkle elements */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-amber-400 rounded-full sparkle-effect"></div>
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-amber-500 rounded-full sparkle-effect" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/5 w-2.5 h-2.5 bg-amber-300 rounded-full sparkle-effect" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <Card className="glass-effect shadow-2xl border-amber-100/60 glow-effect animate-in fade-in-0 slide-in-from-bottom-4 duration-700 overflow-hidden">
          {/* Decorative header border */}
          <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 shimmer-effect"></div>
          
          <CardHeader className="text-center space-y-4 pb-6 pt-8">
            {/* Logo/Brand element */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg float-animation relative">
              <div className="text-2xl font-serif italic text-white">g</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-300 rounded-full sparkle-effect"></div>
            </div>
            
            <CardTitle className="text-3xl font-light bg-gradient-to-r from-amber-800 to-amber-900 bg-clip-text text-transparent">
              {t('auth.signup.title')}
            </CardTitle>
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto"></div>
            <p className="text-amber-700 text-sm font-light leading-relaxed">{t('auth.signup.subtitle')}</p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-amber-800 tracking-wide">
                  {t('auth.signup.name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('auth.signup.fullNamePlaceholder')}
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-300 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-900 placeholder:text-amber-400 rounded-lg px-4 py-3"
                />
              </div>

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
                  placeholder={t('auth.signup.emailPlaceholder')}
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-300 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-900 placeholder:text-amber-400 rounded-lg px-4 py-3"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="role" className="text-sm font-medium text-amber-800 tracking-wide">
                  {t('auth.signup.accountType')}
                </Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'user' | 'admin')} className="space-y-3">
                  <div className="flex items-center space-x-4 p-4 rounded-xl border border-amber-200 hover:border-amber-300 hover:bg-amber-50/60 transition-all duration-300 cursor-pointer group glass-effect">
                    <RadioGroupItem value="user" id="user" className="text-amber-600 border-amber-300" />
                    <Label htmlFor="user" className="cursor-pointer font-medium text-amber-800 group-hover:text-amber-900 transition-colors flex-1">
                      {t('auth.signup.user')}
                    </Label>
                    <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity sparkle-effect"></div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl border border-amber-200 hover:border-amber-300 hover:bg-amber-50/60 transition-all duration-300 cursor-pointer group glass-effect">
                    <RadioGroupItem value="admin" id="admin" className="text-amber-600 border-amber-300" />
                    <Label htmlFor="admin" className="cursor-pointer font-medium text-amber-800 group-hover:text-amber-900 transition-colors flex-1">
                      {t('auth.signup.admin')}
                    </Label>
                    <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity sparkle-effect"></div>
                  </div>
                </RadioGroup>
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
                  placeholder={t('auth.signup.passwordPlaceholder')}
                  minLength={8}
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-300 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-900 placeholder:text-amber-400 rounded-lg px-4 py-3"
                />
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-xl p-4 border border-amber-200/60 glass-effect relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 shimmer-effect"></div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      {t('auth.signup.passwordRequirements')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-amber-800 tracking-wide">
                  {t('auth.signup.confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                  className="transition-all duration-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-300 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-900 placeholder:text-amber-400 rounded-lg px-4 py-3"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl text-white font-medium py-3 rounded-lg border-0 mt-6 relative overflow-hidden" 
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                {loading ? (
                  <div className="flex items-center justify-center space-x-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="font-light">{t('auth.signup.creating')}</span>
                  </div>
                ) : (
                  <span className="font-medium tracking-wide relative z-10">{t('auth.signup.button')}</span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-amber-700 font-light">
                {t('auth.signup.hasAccount')}{' '}
                <Link 
                  href="/auth/signin" 
                  className="text-amber-800 hover:text-amber-900 font-medium transition-all duration-300 hover:underline decoration-2 decoration-amber-600 underline-offset-4 relative inline-block"
                >
                  {t('nav.signin')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform scale-x-0 transition-transform duration-300 hover:scale-x-100"></span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}