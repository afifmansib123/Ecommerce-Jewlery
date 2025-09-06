'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, User, Shield } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="w-full h-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200')`
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
                Join Our Exclusive
                <span className="block font-serif italic text-stone-200">Community</span>
              </h1>
              <p className="text-lg text-stone-200 font-light leading-relaxed max-w-md">
                Gain access to rare antique jewelry collections, expert authentication, and personalized recommendations.
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
              {t('auth.signup.title')}
            </motion.h2>
            <motion.p 
              className="text-stone-600 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('auth.signup.subtitle')}
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
                htmlFor="name" 
                className="text-sm font-medium text-stone-700"
              >
                {t('auth.signup.name')}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('auth.signup.fullNamePlaceholder')}
                className="h-12 border-stone-300 focus:border-stone-500 focus:ring-stone-500/20 bg-white text-stone-900 placeholder:text-stone-400 rounded-lg"
              />
            </div>

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
                placeholder={t('auth.signup.emailPlaceholder')}
                className="h-12 border-stone-300 focus:border-stone-500 focus:ring-stone-500/20 bg-white text-stone-900 placeholder:text-stone-400 rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-stone-700">
                {t('auth.signup.accountType')}
              </Label>
              <RadioGroup 
                value={role} 
                onValueChange={(value) => setRole(value as 'user' | 'admin')} 
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-3 border border-stone-300 rounded-lg p-4 hover:border-stone-400 transition-colors">
                  <RadioGroupItem value="user" id="user" />
                  <User size={18} className="text-stone-600" />
                  <Label htmlFor="user" className="text-sm font-medium text-stone-700 cursor-pointer">
                    {t('auth.signup.user')}
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border border-stone-300 rounded-lg p-4 hover:border-stone-400 transition-colors">
                  <RadioGroupItem value="admin" id="admin" />
                  <Shield size={18} className="text-stone-600" />
                  <Label htmlFor="admin" className="text-sm font-medium text-stone-700 cursor-pointer">
                    {t('auth.signup.admin')}
                  </Label>
                </div>
              </RadioGroup>
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
                  placeholder={t('auth.signup.passwordPlaceholder')}
                  minLength={8}
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
              
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('auth.signup.passwordRequirements')}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="confirmPassword" 
                className="text-sm font-medium text-stone-700"
              >
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
                  className="h-12 border-stone-300 focus:border-stone-500 focus:ring-stone-500/20 bg-white text-stone-900 placeholder:text-stone-400 rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  <span>{t('auth.signup.creating')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{t('auth.signup.button')}</span>
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
              {t('auth.signup.hasAccount')}{' '}
              <Link 
                href="/auth/signin" 
                className="text-stone-900 hover:text-stone-700 font-medium transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500"
              >
                {t('nav.signin')}
              </Link>
            </p>
          </motion.div>

          {/* Terms */}
          <motion.div 
            className="mt-8 pt-8 border-t border-stone-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-xs text-center text-stone-500">
              By creating an account, you agree to our terms of service and privacy policy
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}