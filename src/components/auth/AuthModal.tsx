'use client';

import React, { useState } from 'react';
import type { Language } from '@/lib/i18n';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShieldCheck, LogIn, UserPlus, AlertCircle, X } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  language?: Language;
}

export function AuthModal({ open, onClose, language = 'ja' }: AuthModalProps) {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  function formatFirebaseError(err: unknown): string {
    if (!(err instanceof Error)) {
      return language === 'ja'
        ? '不明なエラーが発生しました。もう一度お試しください！'
        : language === 'vi'
        ? 'Lỗi không xác định. Vui lòng thử lại!'
        : 'Unknown error. Please try again!';
    }
    const msg = err.message || '';
    if (msg.includes('auth/configuration-not-found')) {
      return language === 'ja'
        ? '⚠️ Firebase ConsoleでEmail/Passwordログインが有効になっていません！'
        : '⚠️ Firebase Console chưa bật tính năng Đăng nhập bằng Email/Password!';
    }
    if (msg.includes('auth/email-already-in-use')) {
      return language === 'ja'
        ? 'このメールアドレスは既に登録されています！'
        : 'Email này đã được đăng ký tài khoản trước đó!';
    }
    if (msg.includes('auth/invalid-email')) {
      return language === 'ja'
        ? 'メールアドレスの形式が正しくありません！'
        : 'Địa chỉ Email không đúng định dạng!';
    }
    if (msg.includes('auth/weak-password')) {
      return language === 'ja'
        ? 'パスワードが短すぎます。6文字以上で入力してください！'
        : 'Mật khẩu quá ngắn, vui lòng nhập tối thiểu 6 ký tự!';
    }
    if (
      msg.includes('auth/invalid-credential') ||
      msg.includes('auth/wrong-password') ||
      msg.includes('auth/user-not-found')
    ) {
      return language === 'ja'
        ? 'メールアドレスまたはパスワードが正しくありません！'
        : 'Email hoặc Mật khẩu không chính xác!';
    }
    if (msg.includes('auth/popup-closed-by-user')) {
      return language === 'ja'
        ? 'Googleログインウィンドウが閉じられました。'
        : 'Cửa sổ đăng nhập Google đã đóng trước khi hoàn tất.';
    }
    return msg;
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      handleClose();
    } catch (err: unknown) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(
        language === 'ja'
          ? 'メールアドレスとパスワードを入力してください。'
          : language === 'vi'
          ? 'Vui lòng nhập đầy đủ Email và Mật khẩu.'
          : 'Please enter Email and Password.',
      );
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (tab === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!displayName) {
          setError(
            language === 'ja'
              ? '表示名 (ニックネーム) を入力してください。'
              : language === 'vi'
              ? 'Vui lòng nhập Tên hiển thị (Nickname).'
              : 'Please enter Display Name.',
          );
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
      }
      handleClose();
    } catch (err: unknown) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent showCloseButton={true} className="max-w-md w-full border border-amber-500/50 bg-gradient-to-b from-[#1c2732] to-[#141e27] text-slate-200 shadow-2xl p-5 sm:p-6 rounded-2xl relative">
        {/* Header Title Row */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 pr-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#dfc68122] border border-[#dfc68166] flex items-center justify-center text-[#dfc681] shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wide">
                {language === 'ja' ? 'アカウントシステム' : language === 'vi' ? 'Hệ Thống Tài Khoản' : 'Account System'}
              </DialogTitle>
              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-400/80 tracking-wider">
                Tactical Authentication
              </p>
            </div>
          </div>
        </div>

        {/* 2 Tabs: LOG IN / SIGN UP */}
        <div className="flex border-b border-slate-800 mt-4">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-2 ${
              tab === 'login'
                ? 'border-[#dfc681] text-[#dfc681] bg-[#dfc68110]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn size={14} /> {language === 'ja' ? 'ログイン' : language === 'vi' ? 'Đăng Nhập' : 'Log In'}
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-2 ${
              tab === 'register'
                ? 'border-[#dfc681] text-[#dfc681] bg-[#dfc68110]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus size={14} /> {language === 'ja' ? '新規登録' : language === 'vi' ? 'Đăng Ký' : 'Sign Up'}
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2 p-3 mt-4 rounded bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs">
            <AlertCircle size={16} className="flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
          {tab === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                {language === 'ja' ? '表示名 (ニックネーム)' : language === 'vi' ? 'Tên hiển thị (Nickname)' : 'Display Name'}
              </label>
              <input
                type="text"
                placeholder={language === 'ja' ? '例: Captain Smith' : 'VD: Captain Smith'}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#111922] border border-slate-700/80 focus:border-[#dfc681] rounded px-3 py-2 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              {language === 'ja' ? 'メールアドレス' : 'Email'}
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111922] border border-slate-700/80 focus:border-[#dfc681] rounded px-3 py-2 text-sm text-slate-100 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              {language === 'ja' ? 'パスワード' : language === 'vi' ? 'Mật khẩu' : 'Password'}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111922] border border-slate-700/80 focus:border-[#dfc681] rounded px-3 py-2 text-sm text-slate-100 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded bg-gradient-to-r from-[#5f853e] to-[#6b9545] hover:from-[#6d9648] hover:to-[#7ba951] text-white font-bold text-xs uppercase tracking-wider border border-[#9cb88060] shadow-md transition-all disabled:opacity-50"
          >
            {loading
              ? (language === 'ja' ? '処理中...' : language === 'vi' ? 'Đang xử lý...' : 'Processing...')
              : tab === 'login'
              ? (language === 'ja' ? '今すぐログイン' : language === 'vi' ? 'Đăng Nhập Ngay' : 'Log In Now')
              : (language === 'ja' ? '新規アカウント作成' : language === 'vi' ? 'Tạo Tài Khoản Mới' : 'Create Account')}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-slate-800" />
          <span className="absolute bg-[#17232c] px-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            {language === 'ja' ? 'または' : language === 'vi' ? 'HOẶC' : 'OR'}
          </span>
        </div>

        {/* Google 1-Click Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#1a2530] hover:bg-[#223140] border border-[#2e4054] hover:border-amber-400/60 text-slate-100 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-[0_0_20px_rgba(66,133,244,0.2)] disabled:opacity-50 cursor-pointer group"
        >
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
            />
          </svg>
          <span>
            {language === 'ja'
              ? 'Googleでワンタップログイン'
              : language === 'vi'
              ? 'Đăng nhập nhanh với Google'
              : 'Sign in with Google'}
          </span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
