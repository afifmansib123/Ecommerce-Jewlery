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
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-stone-200/30 to-stone-300/10 rounded-full blur-xl"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-stone-300/20 to-stone-400/5 rounded-full blur-2xl"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-stone-100/40 to-stone-200/10 rounded-full blur-lg"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <motion.div 
        className="max-w-md w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="backdrop-filter backdrop-blur-20 bg-white/95 shadow-2xl border border-stone-100/50 hover:shadow-stone-200/50 transition-all duration-500 overflow-hidden">
          {/* Decorative header border */}
          <div className="h-1 bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          
          <CardHeader className="text-center space-y-6 pb-8 pt-12">
            {/* Logo/Brand element */}
            <motion.div 
              className="mx-auto w-20 h-20 bg-gradient-to-br from-stone-600 to-stone-700 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <Sparkles className="text-3xl text-white relative z-10" size={28} />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <CardTitle className="text-4xl font-light bg-gradient-to-r from-stone-800 to-stone-900 bg-clip-text text-transparent">
                {t('auth.signin.title')}
              </CardTitle>
              <div className="w-20 h-0.5 bg-gradient-to-r from-stone-600 to-stone-700 mx-auto"></div>
              <p className="text-stone-700 text-sm font-light leading-relaxed">
                {t('auth.signin.subtitle')}
              </p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-8"
              variants={containerVariants}
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <Label htmlFor="email" className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
                  <Mail size={16} className="text-stone-600" />
                  {t('auth.signin.email')}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('auth.signin.emailPlaceholder')}
                    className="transition-all duration-300 focus:ring-2 focus:ring-stone-500/50 focus:border-stone-500 hover:border-stone-300 border-stone-200 bg-white/90 backdrop-blur-sm text-stone-900 placeholder:text-stone-400 rounded-xl px-4 py-4 text-base pl-12"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                </div>
              </motion.div>
              
              <motion.div className="space-y-4" variants={itemVariants}>
                <Label htmlFor="password" className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
                  <Lock size={16} className="text-stone-600" />
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
                    className="transition-all duration-300 focus:ring-2 focus:ring-stone-500/50 focus:border-stone-500 hover:border-stone-300 border-stone-200 bg-white/90 backdrop-blur-sm text-stone-900 placeholder:text-stone-400 rounded-xl px-4 py-4 text-base pl-12 pr-12"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl text-white font-medium py-4 rounded-xl border-0 text-base" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="font-light">{t('auth.signin.signingIn')}</span>
                    </div>
                  ) : (
                    <span className="font-medium tracking-wide flex items-center justify-center gap-2">
                      <Sparkles size={18} />
                      {t('auth.signin.button')}
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div className="mt-8 text-center" variants={itemVariants}>
              <p className="text-sm text-stone-700 font-light">
                {t('auth.signin.noAccount')}{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-stone-800 hover:text-stone-900 font-medium transition-all duration-300 relative inline-block group"
                >
                  {t('nav.signup')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-stone-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </p>
            </motion.div>

          </CardContent>
        </Card>

        {/* Additional decorative elements */}
        <motion.div 
          className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-stone-300 to-stone-400 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-stone-400 to-stone-500 rounded-full opacity-15"
          animate={{ 
            scale: [1, 0.8, 1],
            rotate: [0, -90, -180]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}