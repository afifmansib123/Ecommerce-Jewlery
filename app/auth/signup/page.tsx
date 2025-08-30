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
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Shield, UserCheck } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-stone-200/25 to-stone-300/15 rounded-full blur-xl"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-br from-stone-300/20 to-stone-400/5 rounded-full blur-2xl"
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-stone-100/35 to-stone-200/15 rounded-full blur-lg"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 12, 0]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
        <motion.div 
          className="absolute top-2/3 left-1/3 w-28 h-28 bg-gradient-to-br from-stone-200/30 to-stone-300/10 rounded-full blur-lg"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
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
          
          <CardHeader className="text-center space-y-6 pb-6 pt-10">
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
                {t('auth.signup.title')}
              </CardTitle>
              <div className="w-20 h-0.5 bg-gradient-to-r from-stone-600 to-stone-700 mx-auto"></div>
              <p className="text-stone-700 text-sm font-light leading-relaxed">
                {t('auth.signup.subtitle')}
              </p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div className="space-y-3" variants={itemVariants}>
                <Label htmlFor="name" className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
                  <User size={16} className="text-stone-600" />
                  {t('auth.signup.name')}
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={t('auth.signup.fullNamePlaceholder')}
                    className="transition-all duration-300 focus:ring-2 focus:ring-stone-500/50 focus:border-stone-500 hover:border-stone-300 border-stone-200 bg-white/90 backdrop-blur-sm text-stone-900 placeholder:text-stone-400 rounded-xl px-4 py-4 text-base pl-12"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                </div>
              </motion.div>

              <motion.div className="space-y-3" variants={itemVariants}>
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
                    placeholder={t('auth.signup.emailPlaceholder')}
                    className="transition-all duration-300 focus:ring-2 focus:ring-stone-500/50 focus:border-stone-500 hover:border-stone-300 border-stone-200 bg-white/90 backdrop-blur-sm text-stone-900 placeholder:text-stone-400 rounded-xl px-4 py-4 text-base pl-12"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                </div>
              </motion.div>

              <motion.div className="space-y-4" variants={itemVariants}>
                <Label htmlFor="role" className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
                  <Shield size={16} className="text-stone-600" />
                  {t('auth.signup.accountType')}
                </Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'user' | 'admin')} className="space-y-3">
                  <motion.div 
                    className="flex items-center space-x-4 p-4 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 transition-all duration-300 cursor-pointer group backdrop-filter backdrop-blur-sm bg-white/80"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem value="user" id="user" className="text-stone-600 border-stone-300" />
                    <UserCheck className="text-stone-500 group-hover:text-stone-600" size={18} />
                    <Label htmlFor="user" className="cursor-pointer font-medium text-stone-800 group-hover:text-stone-900 transition-colors flex-1">
                      {t('auth.signup.user')}
                    </Label>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-4 p-4 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 transition-all duration-300 cursor-pointer group backdrop-filter backdrop-blur-sm bg-white/80"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem value="admin" id="admin" className="text-stone-600 border-stone-300" />
                    <Shield className="text-stone-500 group-hover:text-stone-600" size={18} />
                    <Label htmlFor="admin" className="cursor-pointer font-medium text-stone-800 group-hover:text-stone-900 transition-colors flex-1">
                      {t('auth.signup.admin')}
                    </Label>
                  </motion.div>
                </RadioGroup>
              </motion.div>
              
              <motion.div className="space-y-3" variants={itemVariants}>
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
                    placeholder={t('auth.signup.passwordPlaceholder')}
                    minLength={8}
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
                
                <motion.div 
                  className="bg-gradient-to-br from-stone-50 to-stone-100/60 rounded-xl p-4 border border-stone-200/60 backdrop-filter backdrop-blur-sm bg-white/80 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-stone-500 to-stone-600 relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-stone-500 to-stone-600 rounded-lg flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-xs text-stone-800 font-medium leading-relaxed">
                      {t('auth.signup.passwordRequirements')}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div className="space-y-3" variants={itemVariants}>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
                  <Lock size={16} className="text-stone-600" />
                  {t('auth.signup.confirmPassword')}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                    className="transition-all duration-300 focus:ring-2 focus:ring-stone-500/50 focus:border-stone-500 hover:border-stone-300 border-stone-200 bg-white/90 backdrop-blur-sm text-stone-900 placeholder:text-stone-400 rounded-xl px-4 py-4 text-base pl-12 pr-12"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl text-white font-medium py-4 rounded-xl border-0 text-base relative overflow-hidden" 
                  disabled={loading}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-600 opacity-0 hover:opacity-20 transition-opacity duration-300"
                    whileHover={{ opacity: 0.2 }}
                  />
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="font-light">{t('auth.signup.creating')}</span>
                    </div>
                  ) : (
                    <span className="font-medium tracking-wide relative z-10 flex items-center justify-center gap-2">
                      <Sparkles size={18} />
                      {t('auth.signup.button')}
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div className="mt-8 text-center" variants={itemVariants}>
              <p className="text-sm text-stone-700 font-light">
                {t('auth.signup.hasAccount')}{' '}
                <Link 
                  href="/auth/signin" 
                  className="text-stone-800 hover:text-stone-900 font-medium transition-all duration-300 relative inline-block group"
                >
                  {t('nav.signin')}
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