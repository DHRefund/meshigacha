'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Utensils,
  MapPin,
  ShoppingBag,
  History as HistoryIcon,
  Sparkles,
  DollarSign,
  Award,
  Database,
  Search,
  PieChart,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  fetchMealHistoryFromFirebase,
  deleteMealFromFirebase,
  clearMealHistory,
  type HistoryEntry,
} from '@/lib/history-storage';
import { FoodImage } from '@/components/food-image/FoodImage';
import { rarityColors } from '@/components/food-card/FoodCard';
import { copy, foodName, foodSubtitle, foodQuip, priceLabel, type Language } from '@/lib/i18n';
import type { Food, CategoryType } from '@/lib/foods';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Header } from '@/components/header/Header';

function HistoryPageContent() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loadingDb, setLoadingDb] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguage] = useState<Language>('ja');
  const [sound, setSound] = useState<boolean>(true);

  const loadHistory = async () => {
    setLoadingDb(true);
    const userId = user?.uid;
    const data = await fetchMealHistoryFromFirebase(userId);
    setHistory(data);
    setLoadingDb(false);
    setMounted(true);
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoadingDb(true);
      const userId = user?.uid;
      const data = await fetchMealHistoryFromFirebase(userId);
      if (isMounted) {
        setHistory(data);
        setLoadingDb(false);
        setMounted(true);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleClearAll = async () => {
    if (
      window.confirm(
        '履歴に保存されているすべての食事データを削除してもよろしいですか？',
      )
    ) {
      for (const item of history) {
        await deleteMealFromFirebase(item.id);
      }
      clearMealHistory();
      setHistory([]);
    }
  };

  const handleRemoveOne = async (id: string) => {
    await deleteMealFromFirebase(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchCategory =
        filterCategory === 'all' || item.category === filterCategory;
      
      const dummyFood: Food = {
        name: item.name,
        sub: item.sub,
        price: item.price,
        rarity: item.rarity,
        image: item.image ?? 0,
        category: (item.category as CategoryType) || 'main',
        quip: item.quip ?? '',
      };
      const nameJa = foodName(dummyFood, 'ja');
      const subJa = foodSubtitle(dummyFood, 'ja');

      const matchSearch =
        !searchQuery.trim() ||
        nameJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [history, filterCategory, searchQuery]);

  const groupedHistory = useMemo(() => {
    const groups: { dateLabel: string; items: HistoryEntry[]; daySpent: number }[] = [];
    const groupMap = new Map<string, HistoryEntry[]>();

    for (const item of filteredHistory) {
      const d = new Date(item.confirmedAt);
      const dateLabel = d.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      });

      if (!groupMap.has(dateLabel)) {
        groupMap.set(dateLabel, []);
      }
      groupMap.get(dateLabel)!.push(item);
    }

    groupMap.forEach((items, dateLabel) => {
      const daySpent = items.reduce((sum, item) => sum + item.price, 0);
      groups.push({ dateLabel, items, daySpent });
    });

    return groups;
  }, [filteredHistory]);

  const stats = useMemo(() => {
    const totalCount = history.length;
    const totalSpent = history.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = totalCount > 0 ? Math.round(totalSpent / totalCount) : 0;
    
    const latestItem = history[0];
    const latestMeal = latestItem
      ? foodName(
          {
            name: latestItem.name,
            sub: latestItem.sub,
            price: latestItem.price,
            rarity: latestItem.rarity,
            image: latestItem.image ?? 0,
            category: (latestItem.category as CategoryType) || 'main',
            quip: latestItem.quip ?? '',
          },
          'ja',
        )
      : 'なし';

    // Find most frequent item
    const freqMap: Record<string, number> = {};
    for (const h of history) {
      const nameJa = foodName(
        {
          name: h.name,
          sub: h.sub,
          price: h.price,
          rarity: h.rarity,
          image: h.image ?? 0,
          category: (h.category as CategoryType) || 'main',
          quip: h.quip ?? '',
        },
        'ja',
      );
      freqMap[nameJa] = (freqMap[nameJa] || 0) + 1;
    }
    let topMealName = 'なし';
    let topCount = 0;
    for (const [name, count] of Object.entries(freqMap)) {
      if (count > topCount) {
        topCount = count;
        topMealName = name;
      }
    }

    return { totalCount, totalSpent, avgPrice, latestMeal, topMealName, topCount };
  }, [history]);

  if (!mounted || loadingDb) {
    return (
      <div className="min-h-screen bg-[#101113] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-amber-400 font-mono">
          <Database className="animate-bounce text-amber-400" size={36} />
          <span className="text-sm font-semibold tracking-wide">開封履歴を同期中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101113] text-[#f3f3ef] site-shell pb-24">
      {/* Standard Global Site Header */}
      <Header
        language={language}
        sound={sound}
        spinning={false}
        globalCount={0}
        onChangeLanguage={setLanguage}
        onToggleSound={() => setSound(!sound)}
      />

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* History Route Control Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#253545]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
              <HistoryIcon size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider text-white uppercase m-0 leading-tight">
                キャプテンの食事履歴
              </h1>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <Database size={12} className="text-amber-400" />
                リアルタイム同期 · Firebase & ローカルストレージ
              </span>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 font-bold text-xs border border-rose-700/50 transition-all hover:scale-105 self-end sm:self-auto"
            >
              <Trash2 size={14} />
              <span>履歴を消去</span>
            </button>
          )}
        </div>


        {/* Analytics Statistics Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">

          {/* 1. Total Meals */}
          <div className="p-5 rounded-xl bg-[#17222c]/90 border border-[#273645] shadow-lg flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Utensils size={24} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                確定済み合計
              </span>
              <span className="text-2xl font-black text-white">
                {stats.totalCount}{' '}
                <span className="text-sm font-normal text-amber-400">食</span>
              </span>
            </div>
          </div>

          {/* 2. Total Budget Spent */}
          <div className="p-5 rounded-xl bg-[#17222c]/90 border border-[#273645] shadow-lg flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                推定総支出
              </span>
              <span className="text-2xl font-black text-white">
                {new Intl.NumberFormat('ja-JP').format(stats.totalSpent)}{' '}
                <span className="text-sm font-normal text-emerald-400">円</span>
              </span>
            </div>
          </div>

          {/* 3. Average Price per Meal */}
          <div className="p-5 rounded-xl bg-[#17222c]/90 border border-[#273645] shadow-lg flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <PieChart size={24} />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                1食平均価格
              </span>
              <span className="text-2xl font-black text-white">
                約{new Intl.NumberFormat('ja-JP').format(stats.avgPrice)}{' '}
                <span className="text-sm font-normal text-sky-400">円</span>
              </span>
            </div>
          </div>

          {/* 4. Latest Meal */}
          <div className="p-5 rounded-xl bg-[#17222c]/90 border border-[#273645] shadow-lg flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Award size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                直前に選んだ料理
              </span>
              <span className="text-base font-bold text-amber-300 truncate block">
                {stats.latestMeal}
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        {history.length > 0 && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: '⚡ すべて' },
                { id: 'main', label: '🍱 主食・定食' },
                { id: 'drinks', label: '🍵 ドリンク' },
                { id: 'snacks', label: '🍡 スナック' },
                { id: 'pub', label: '🍺 居酒屋' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    filterCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-[#18232d] text-slate-400 hover:bg-[#22303e] border border-[#273645]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="履歴内を検索…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#18232d] border border-[#273645] text-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500/60 transition-colors placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-[#16212b]/80 border border-[#273645] rounded-2xl p-8 max-w-lg mx-auto shadow-2xl backdrop-blur-md">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <Database size={40} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {history.length === 0
                ? '食事履歴がまだありません'
                : '該当する料理が見つかりませんでした'}
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
              {history.length === 0
                ? 'ガチャを回して「🎯 このメニューに決定」ボタンを押すと、ここに履歴が保存されます！'
                : '検索キーワードを変えるか、カテゴリタブを切り替えてみてください。'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles size={16} />
              <span>今すぐガチャを回す</span>
            </Link>
          </div>
        ) : (
          /* History Items Grouped By Date */
          <div className="space-y-10">
            {groupedHistory.map(({ dateLabel, items, daySpent }) => (
              <div key={dateLabel} className="space-y-4">
                {/* Date Section Divider Header */}
                <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-[#253545]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Calendar size={16} />
                    </div>
                    <h2 className="text-sm md:text-base font-extrabold text-slate-100 tracking-wide m-0">
                      {dateLabel}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#1b2733] border border-[#2b3c4c] text-[11px] font-bold text-amber-400">
                      {items.length} 食
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-400 font-mono">
                    本日合計: <span className="text-amber-300 font-bold">{new Intl.NumberFormat('ja-JP').format(daySpent)} 円</span>
                  </div>
                </div>

                {/* Day Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((item) => {
                    const dummyFood: Food = {
                      name: item.name,
                      sub: item.sub,
                      price: item.price,
                      rarity: item.rarity,
                      image: item.image ?? 0,
                      category: (item.category as CategoryType) || 'main',
                      imageUrl: item.imageUrl,
                      quip: item.quip ?? '',
                    };

                    const rarityColor = rarityColors[item.rarity] || '#a0a0a0';
                    const rarityName = copy.ja.tiers[item.rarity] || '定番';
                    const formattedTime = new Date(item.confirmedAt).toLocaleTimeString(
                      'ja-JP',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    );

                    return (
                      <div
                        key={item.id}
                        className="group relative rounded-xl bg-[#16212b]/90 border border-[#273645] hover:border-amber-500/50 p-4 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                      >
                        {/* Top Rarity Accent Glow Line */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1"
                          style={{ backgroundColor: rarityColor }}
                        />

                        <div>
                          {/* Timestamp & Trash action */}
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pt-1">
                            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                              <Clock size={13} className="text-amber-400 shrink-0" />
                              {formattedTime}
                            </span>

                            <button
                              onClick={() => handleRemoveOne(item.id)}
                              className="opacity-50 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1 rounded transition-all hover:bg-rose-950/40"
                              title="この記録を削除"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Image & Title Section */}
                          <div className="flex gap-4 items-center mb-3">
                            <div
                              className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border shadow-inner relative"
                              style={{ borderColor: `${rarityColor}60` }}
                            >
                              <FoodImage food={dummyFood} language="ja" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <span
                                className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border mb-1"
                                style={{
                                  color: rarityColor,
                                  borderColor: `${rarityColor}40`,
                                  backgroundColor: `${rarityColor}15`,
                                }}
                              >
                                {rarityName}
                              </span>
                              <h3 className="text-base font-bold text-white leading-tight truncate">
                                {foodName(dummyFood, 'ja')}
                              </h3>
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {foodSubtitle(dummyFood, 'ja')}
                              </p>
                              <span className="text-sm font-black text-amber-400 mt-1 block">
                                {priceLabel(item.price, 'ja', true)}
                              </span>
                            </div>
                          </div>

                          {/* Quip quote if present */}
                          {foodQuip(dummyFood, 'ja') && (
                            <div className="mb-3 px-3 py-1.5 rounded-lg bg-[#101720]/80 border border-slate-700/50 text-[11px] italic text-amber-200/90 truncate">
                              “{foodQuip(dummyFood, 'ja')}”
                            </div>
                          )}
                        </div>

                        {/* Order & Location Actions */}
                        <div className="pt-3 border-t border-[#23313f] flex items-center justify-between gap-2 text-xs">
                          <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(
                              foodName(dummyFood, 'ja') + ' 近くの店舗',
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-[#1e2b36] hover:bg-[#283847] text-slate-300 hover:text-white font-semibold border border-[#2a3a49] transition-colors"
                          >
                            <MapPin size={13} className="text-rose-400" />
                            <span>お店を探す</span>
                          </a>

                          <a
                            href={`https://food.grab.com/vn/vi/restaurants?${new URLSearchParams(
                              {
                                search: foodName(dummyFood, 'ja'),
                                'support-deeplink': 'true',
                                searchParameter: foodName(dummyFood, 'ja'),
                              },
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 font-semibold border border-emerald-700/50 transition-colors"
                          >
                            <ShoppingBag size={13} className="text-emerald-400" />
                            <span>出前検索</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


export default function HistoryPage() {
  return (
    <AuthProvider>
      <HistoryPageContent />
    </AuthProvider>
  );
}
