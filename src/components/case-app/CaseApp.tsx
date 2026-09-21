'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { readCookie, writeCookie } from '@/lib/cookies';
import {
  createSpinProfile,
  spinProgress,
  stopFraction,
} from '@/lib/case-mechanics';
import { foods, type Food, type CategoryType } from '@/lib/foods';
import { copy, foodName, type Language } from '@/lib/i18n';
import { useLocalSpinCount } from '@/hooks/use-local-spin-count';
import { usePreferences } from '@/hooks/use-preferences';
import { useAudioEngine } from '@/hooks/use-audio-engine';
import { personalFoods, personalSelector } from '@/lib/personal-pool';
import { CaseAudio } from '@/lib/case-audio';
import { DEFAULT_BARK, getRandomBark } from '@/data/barkLines';
import type { BarkLine } from '@/types';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GameProvider, useGame } from '@/context/GameContext';
import { addMealToHistory, saveMealToFirebase } from '@/lib/history-storage';
import { GlobalCounter } from '@/components/global-counter/GlobalCounter';
import {
  incrementGlobalMealCount,
  subscribeToGlobalStats,
} from '@/lib/global-stats';

// Modular Subcomponents
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { CaptainAvatar } from '@/components/captain/CaptainAvatar';
import { SpinReel } from '@/components/spin-reel/SpinReel';
import { ControlBar } from '@/components/control-bar/ControlBar';
import { InventoryGrid } from '@/components/inventory/InventoryGrid';
import { WinnerModal } from '@/components/winner-modal/WinnerModal';
import { IntroStory } from '@/components/intro-story/IntroStory';
import { AuthModal } from '@/components/auth/AuthModal';
import { CategoryTabs } from '@/components/category-tabs/CategoryTabs';
import { LunchTicket } from '@/components/lunch-ticket/LunchTicket';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface CaseAppProps {
  initialLanguage?: Language;
  initialIntroSeen?: boolean;
}

export function CaseAppContent({ initialLanguage = 'ja', initialIntroSeen = false }: CaseAppProps) {
  const { user } = useAuth();
  const { gameState, startIntro, finishIntro, startSpin, finishSpin, setLimitReached } = useGame();
  const {
    count: localSpins,
    enabled: counterEnabled,
    recordSpin,
    remainingGuestSpins,
    isGuestLimitReached,
  } = useLocalSpinCount();

  const [language, setLanguage] = useState<Language>(initialLanguage);
  const preferences = usePreferences();

  const [budget, setBudget] = useState('800');
  const [custom, setCustom] = useState('800');
  const [veg, setVeg] = useState(false);
  const [category, setCategory] = useState<CategoryType | 'all'>('all');
  const [sound, setSound] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [moving, setMoving] = useState(false);
  const [result, setResult] = useState<Food | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [confirmedDish, setConfirmedDish] = useState<Food | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bark, setBark] = useState<BarkLine>(DEFAULT_BARK);
  const [globalCount, setGlobalCount] = useState<number>(0);

  const [reel, setReel] = useState(() =>
    foods.slice(0, 12).map((food, id) => ({ food, id })),
  );
  const [visibleStart, setVisibleStart] = useState(0);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [cookieError, setCookieError] = useState('');

  const busy = useRef(false);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const position = useRef(-400);
  const frame = useRef(0);
  const audio = useRef<CaseAudio | null>(null);

  // Check intro cookie on mount & select initial bark
  useEffect(() => {
    setBark(getRandomBark('spin_start'));
    try {
      const seenCookie = readCookie<boolean>('intro-seen');
      const seenSession = typeof window !== 'undefined' && sessionStorage.getItem('intro-seen') === 'true';
      if (!seenCookie && !seenSession) {
        startIntro();
        setShowIntro(true);
      } else {
        setShowIntro(false);
        finishIntro();
      }
    } catch {
      finishIntro();
    }
  }, [startIntro, finishIntro]);

  // Subscribe to Live Global Confirmed Meals counter from Firebase DB
  useEffect(() => {
    const unsubscribe = subscribeToGlobalStats((count) => {
      setGlobalCount(count);
    });
    return () => unsubscribe();
  }, []);

  // React to User Auth changes for NPC Bark greeting
  useEffect(() => {
    if (user) {
      const name = user.displayName || user.email?.split('@')[0] || 'Captain';
      setBark({
        id: 'auth_welcome',
        triggerType: 'spin_start',
        emotion: 'happy',
        text: `Báo cáo Captain ${name}! Đã xác thực thành công tài khoản chính thức. Toàn bộ đặc quyền mở hòm KHÔNG GIỚI HẠN đã được kích hoạt!`,
        textJa: `キャプテン ${name}、報告いたします！正規アカウントの認証に成功しました！無限ケース開封の特別権限が全て有効化されました！`,
        textEn: `Report Captain ${name}! Official account authenticated! All UNLIMITED CASE OPENING privileges activated!`,
      });
    }
  }, [user]);

  const handleCompleteIntro = () => {
    setShowIntro(false);
    finishIntro();
    try {
      writeCookie('intro-seen', true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('intro-seen', 'true');
      }
    } catch {}
  };


  const handleConfirmDish = useCallback(
    (food: Food) => {
      setConfirmedDish(food);
      const userId = user?.uid || 'guest';
      const userName =
        user?.displayName || user?.email?.split('@')[0] || 'Captain Guest';

      // Save to Firebase DB (with local fallback)
      saveMealToFirebase(food, userId, userName);

      // Increment live global counter on Firebase DB
      incrementGlobalMealCount();

      try {
        writeCookie('last-choice', {
          name: food.name,
          price: food.price,
          veg: food.veg,
          at: Date.now(),
        });
      } catch { }
      setBark({
        id: 'confirm_meal',
        triggerType: 'spin_start',
        emotion: 'happy',
        text: `Báo cáo Captain! Đã chốt đơn thành công món: "${food.name}". Đã cộng +1 vào tổng số bữa ăn toàn hệ thống!`,
        textJa: `キャプテン、報告です！「${foodName(food, 'ja')}」の選択が完了しました！システム全体の合計カウントに+1されました！`,
        textEn: `Report Captain! Successfully confirmed: "${foodName(food, 'en')}". Added +1 to system global count!`,
      });
    },
    [user],
  );

  // Initialize language & page title (Default: Japanese 'ja')
  useEffect(() => {
    let selected: Language = 'ja';
    try {
      const saved = readCookie<string>('language');
      selected = saved === 'ja' || saved === 'en' || saved === 'vi' ? (saved as Language) : 'ja';
    } catch { }
    setLanguage(selected);
    document.documentElement.lang = selected;
    document.title =
      selected === 'ja'
        ? 'MeshiGacha | 「今日何食べる？」迷ったら、回せ！'
        : selected === 'en'
        ? 'MeshiGacha | What to eat today? When in doubt, SPIN!'
        : 'MeshiGacha | Hôm nay ăn gì? Phân vân thì QUAY NGAY!';
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguage(next);
    document.documentElement.lang = next;
    document.title =
      next === 'ja'
        ? 'MeshiGacha | 「今日何食べる？」迷ったら、回せ！'
        : next === 'en'
        ? 'MeshiGacha | What to eat today? When in doubt, SPIN!'
        : 'MeshiGacha | Hôm nay ăn gì? Phân vân thì QUAY NGAY!';
    try {
      writeCookie('language', next);
    } catch { }
  };

  // Saved preferences
  useEffect(() => {
    const saved = readCookie<Record<string, unknown>>('settings');
    if (saved && typeof saved === 'object') {
      if (
        typeof saved.budget === 'string' &&
        ['500', '800', '1000', '1200', '1500', 'custom'].includes(saved.budget)
      ) {
        setBudget(saved.budget);
      }
      if (
        typeof saved.custom === 'string' &&
        Number(saved.custom) >= 300 &&
        Number(saved.custom) <= 2500
      ) {
        setCustom(saved.custom);
      }
      if (typeof saved.veg === 'boolean') setVeg(saved.veg);
      if (typeof saved.sound === 'boolean') setSound(saved.sound);
    }
    setPreferencesReady(true);
  }, []);

  useEffect(() => {
    if (preferencesReady) {
      try {
        writeCookie('settings', { budget, custom, veg, sound });
        setCookieError('');
      } catch {
        setCookieError(
          language === 'vi'
            ? 'Không thể lưu cookie. Lựa chọn chỉ giữ trong lần mở trang này.'
            : 'Cookies unavailable. Preferences last only for this visit.',
        );
      }
    }
  }, [preferencesReady, budget, custom, veg, sound, language]);

  const target = budget === 'custom' ? Number(custom) : Number(budget);
  const validTarget =
    Number.isInteger(target) && target >= 300 && target <= 2500;

  const population = useMemo(
    () => personalFoods(preferences.profile),
    [preferences.profile],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryType | 'all', number> = {
      all: population.length,
      main: 0,
      drinks: 0,
      snacks: 0,
      pub: 0,
    };
    for (const item of population) {
      const cat = item.category || 'main';
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    }
    return counts;
  }, [population]);

  useEffect(() => {
    const last = readCookie<{
      name?: unknown;
      price?: unknown;
      veg?: unknown;
    }>('last-choice');
    if (last && typeof last === 'object') {
      const match = population.find(
        (f) =>
          f.name === last.name &&
          f.price === last.price &&
          !!f.veg === last.veg,
      );
      if (match) setResult(match);
    }
  }, [population]);

  const eligible = useMemo(
    () =>
      population.filter(
        (f) =>
          (!veg || f.veg) &&
          (category === 'all' ||
            f.category === category ||
            (!f.category && category === 'main')),
      ),
    [population, veg, category],
  );

  const lunchSelector = useMemo(
    () => personalSelector(eligible, validTarget ? target : 800),
    [eligible, target, validTarget],
  );

  const filteredMean = lunchSelector?.expectedPrice ?? 0;

  const { soundEnabled, toggleSound, unlockAudio, playSound } = useAudioEngine(true);

  const attachTrack = useCallback((node: HTMLDivElement | null) => {
    track.current = node;
    if (node)
      node.style.transform = `translate3d(${position.current}px,0,0)`;
  }, []);

  useEffect(() => {
    if (spinning || !eligible.length || !lunchSelector) return;
    setReel((current) =>
      current.map((item) => ({
        ...item,
        food:
          eligible.find(
            (f) =>
              (f.customId ?? f.image) ===
              (item.food.customId ?? item.food.image),
          ) ?? lunchSelector.choose(eligible),
      })),
    );
  }, [eligible, lunchSelector, spinning]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
    },
    [],
  );

  // Spin Open Handler
  function open() {
    // Guest Limit Check (5 spins limit for unauthenticated users)
    if (!user && isGuestLimitReached) {
      setBark({
        id: 'limit_reached',
        triggerType: 'spin_start',
        emotion: 'teasing',
        text: 'Báo cáo Captain! Captain đã dùng hết 5 lượt quay miễn phí rồi ạ! Xin mời Captain đăng nhập tài khoản để mở hòm KHÔNG GIỚI HẠN cùng phi đội nhé!',
        textJa: 'キャプテン、報告です！無料お試し5回分を使い切りました！ログインすると無制限でガチャを楽しめます！',
        textEn: 'Report Captain! You have used all 5 free guest spins! Please sign in to unlock UNLIMITED case openings!',
      });
      setShowAuthModal(true);
      return;
    }

    if (
      busy.current ||
      !validTarget ||
      !eligible.length ||
      !lunchSelector ||
      !track.current ||
      !viewport.current
    )
      return;

    unlockAudio();
    busy.current = true;
    startSpin();
    setBark(getRandomBark('spinning'));
    const winner = lunchSelector.choose(eligible);

    const step = 254;
    const tileWidth = 240;
    const width = viewport.current.clientWidth;
    const start = position.current;
    const center = Math.floor((width / 2 - start) / step);
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const profile = createSpinProfile(Math.random, reducedMotion);
    const spinTarget = center + profile.tiles;
    const end = width / 2 - tileWidth * stopFraction() - spinTarget * step;

    const rightEdge = Math.ceil((width - start) / step) + 1;
    const items = reel.filter(
      (item) =>
        item.id >= center - Math.ceil(width / step) - 2 && item.id <= rightEdge,
    );
    const last = Math.max(...items.map((item) => item.id));
    const recent: Food[] = [];

    for (let id = last + 1; id <= spinTarget + 4; id++) {
      const alternatives = eligible.filter(
        (food) =>
          !recent.includes(food) &&
          (lunchSelector.probabilities.get(food) ?? 0) > 0,
      );
      const food =
        id === spinTarget
          ? winner
          : lunchSelector.choose(alternatives.length ? alternatives : eligible);
      items.push({ id, food });
      recent.push(food);
      if (recent.length > 8) recent.shift();
    }

    flushSync(() => {
      setReel(items);
      setSpinning(true);
      setMoving(true);
      setResult(null);
    });

    playSound('csgo_ui_crate_open');
    const duration = profile.durationMs;
    const started = performance.now();
    let lastCell = Math.floor((start - width / 2) / step);

    const animate = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - started) / duration));
      const next =
        start + (end - start) * spinProgress(progress, profile.friction);
      position.current = next;

      if (track.current)
        track.current.style.transform = `translate3d(${next}px,0,0)`;

      const cell = Math.floor((next - width / 2) / step);
      if (cell !== lastCell) {
        playSound('csgo_ui_crate_item_scroll');
        lastCell = cell;
      }

      if (progress < 1) {
        frame.current = requestAnimationFrame(animate);
        return;
      }

      recordSpin(winner);
      busy.current = false;
      finishSpin();
      setSpinning(false);
      setMoving(false);
      setResult(winner);
      setRevealed(true);

      const triggerType =
        winner.rarity >= 3
          ? 'reveal_legendary'
          : winner.rarity >= 1
            ? 'reveal_rare'
            : 'reveal_common';
      setBark(getRandomBark(triggerType));

      const revealSounds = [
        'item_reveal3_rare',
        'item_reveal4_mythical',
        'item_reveal5_legendary',
        'item_reveal6_ancient',
        'item_reveal6_ancient',
      ] as const;
      playSound(revealSounds[winner.rarity]);
    };

    frame.current = requestAnimationFrame(animate);
  }

  const t = copy[language];
  const activeModalDish = selectedFood || (revealed ? result : null);

  const handleResetFilters = useCallback(() => {
    setVeg(false);
    setCategory('all');
  }, []);

  const handleSideQuestRoll = useCallback(
    (cat: CategoryType) => {
      setRevealed(false);
      setSelectedFood(null);
      setCategory(cat);
      setTimeout(() => {
        open();
      }, 150);
    },
    [open],
  );

  return (
    <div className="site-shell">
      {/* 0. NPC Onboarding Narrative Intro */}
      {showIntro && (
        <IntroStory
          language={language}
          onComplete={handleCompleteIntro}
        />
      )}

      {/* 0.5. Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* 1. Header */}
      <Header
        language={language}
        sound={sound}
        spinning={spinning}
        globalCount={globalCount}
        onChangeLanguage={changeLanguage}
        onToggleSound={() => {
          audio.current?.setMuted(sound);
          setSound(!sound);
        }}
        onShowIntro={() => setShowIntro(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <main>
        {cookieError && (
          <p role="status" className="preferences-message">
            {cookieError}
          </p>
        )}

        <div className="intro">
          <h1>
            {language === 'ja' ? (
              <>
                「今日何食べる？」<em>迷ったら、回せ！</em>
              </>
            ) : language === 'vi' ? (
              <>
                Hôm nay ăn gì? <em>Phân vân thì QUAY NGAY!</em>
              </>
            ) : (
              <>
                What to eat today? <em>When in doubt, SPIN!</em>
              </>
            )}
          </h1>
        </div>


        {/* 1.5. Live NPC Assistant Comment Box */}
        <CaptainAvatar bark={bark} language={language} />

        {/* 1.8. Category Selector Tabs */}
        <CategoryTabs
          selectedCategory={category}
          onSelectCategory={setCategory}
          categoryCounts={categoryCounts}
          language={language}
          disabled={spinning}
        />

        {/* 2. CS2 Panorama Spin Reel */}
        <SpinReel
          language={language}
          moving={moving}
          visibleStart={visibleStart}
          reelItems={reel}
          viewportRef={viewport}
          attachTrackRef={attachTrack}
        />

        {/* 3. Control Bar (Budget, Veg Switch, Open Button) */}
        <ControlBar
          language={language}
          budget={budget}
          custom={custom}
          veg={veg}
          spinning={spinning}
          validTarget={validTarget}
          eligibleCount={eligible.length}
          filteredMean={filteredMean}
          targetPrice={target}
          result={result}
          isGuest={!user}
          remainingGuestSpins={remainingGuestSpins}
          isGuestLimitReached={!user && isGuestLimitReached}
          onBudgetChange={setBudget}
          onCustomChange={setCustom}
          onVegChange={setVeg}
          onOpen={open}
        />

        {/* 4. Inventory Grid Catalog */}
        <InventoryGrid
          eligibleFoods={eligible}
          language={language}
          spinning={spinning}
          onCardClick={(food) => !spinning && setSelectedFood(food)}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* 5. Winner & Dish Detail Modal */}
      <WinnerModal
        result={activeModalDish}
        revealed={revealed || !!selectedFood}
        isSpinResult={revealed && !selectedFood}
        language={language}
        onClose={() => {
          setRevealed(false);
          setSelectedFood(null);
        }}
        onConfirmDish={handleConfirmDish}
        onReroll={() => {
          setRevealed(false);
          setSelectedFood(null);
          setTimeout(() => {
            open();
          }, 120);
        }}
        onSideQuestRoll={handleSideQuestRoll}
      />

      {/* Floating Holographic Lunch Ticket Pass */}
      <LunchTicket
        confirmedDish={confirmedDish}
        language={language}
        onClearTicket={() => setConfirmedDish(null)}
      />

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}

export function CaseApp({ initialLanguage = 'ja', initialIntroSeen = false }: CaseAppProps) {
  return (
    <AuthProvider>
      <GameProvider>
        <CaseAppContent initialLanguage={initialLanguage} initialIntroSeen={initialIntroSeen} />
      </GameProvider>
    </AuthProvider>
  );
}
