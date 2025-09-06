'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="w-full h-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/60 via-stone-800/50 to-stone-900/70"></div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl font-light mb-4 leading-tight">
                Discover Timeless 
                <span className="block font-serif italic text-stone-200">Elegance</span>
              </h1>
              <p className="text-lg text-stone-200 font-light leading-relaxed max-w-md">
                Authentic antique jewelry with verified provenance and expert authentication since 2008.
              </p>
              <div className="mt-8 flex items-center space-x-4">
                <div className="w-12 h-0.5 bg-stone-300"></div>
                <span className="text-sm text-stone-300 font-light tracking-wider uppercase">
                  Wangmanee Gallery
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-10">
            <motion.h2 
              className="text-3xl font-light text-stone-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('auth.signin.title')}
            </motion.h2>
            <motion.p 
              className="text-stone-600 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('auth.signin.subtitle')}
            </motion.p>
          </div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium text-stone-700"
              >
                {t('auth.signin.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('auth.signin.emailPlaceholder')}
                className="h-12 border-stone-300 focus:border-stone-500 focus:ring-stone-500/20 bg-white text-stone-900 placeholder:text-stone-400 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium text-stone-700"
              >
                {t('auth.signin.password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.signin.passwordPlaceholder')}
                  className="h-12 border-stone-300 focus:border-stone-500 focus:ring-stone-500/20 bg-white text-stone-900 placeholder:text-stone-400 rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div 
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>{t('auth.signin.signingIn')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{t('auth.signin.button')}</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </motion.form>

          {/* Footer */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm text-stone-600">
              {t('auth.signin.noAccount')}{' '}
              <Link 
                href="/auth/signup" 
                className="text-stone-900 hover:text-stone-700 font-medium transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500"
              >
                {t('nav.signup')}
              </Link>
            </p>
          </motion.div>

          {/* Divider with some additional options if needed */}
          <motion.div 
            className="mt-8 pt-8 border-t border-stone-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-xs text-center text-stone-500">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}