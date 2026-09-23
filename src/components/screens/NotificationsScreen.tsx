import React, { useState } from 'react';
import { ScreenType, Language, AppNotification, ContractItem } from '../../types';

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onSelectContractForESign?: (contract: ContractItem) => void;
  contracts?: ContractItem[];
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onNavigate,
  lang,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll,
  onSelectContractForESign,
  contracts = [],
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'action'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'action') return item.priority === 'urgent' || item.category === 'signature';
    return true;
  });

  const handleAction = (item: AppNotification) => {
    onMarkAsRead(item.id);
    if (item.actionTarget === 'esign') {
      if (item.actionContractId && onSelectContractForESign) {
        const found = contracts.find((c) => c.id === item.actionContractId);
        if (found) {
          onSelectContractForESign(found);
          return;
        }
      }
      onNavigate('esign');
    } else if (item.actionTarget) {
      onNavigate(item.actionTarget);
    }
  };

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'signature':
        return { icon: 'draw', bg: 'bg-[#ffdbd1] text-[#ac2e00]' };
      case 'blockchain':
        return { icon: 'verified', bg: 'bg-emerald-100 text-emerald-800' };
      case 'ai':
        return { icon: 'auto_awesome', bg: 'bg-purple-100 text-purple-800' };
      case 'stamp':
        return { icon: 'account_balance', bg: 'bg-amber-100 text-amber-800' };
      case 'compliance':
        return { icon: 'shield_person', bg: 'bg-blue-100 text-blue-800' };
      default:
        return { icon: 'notifications', bg: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-4 sm:px-5">
      {/* Screen Title & Top Actions */}
      <div className="flex items-center justify-between mt-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#191c1e] tracking-tight">
              {lang === 'EN' ? 'Notifications & Alerts' : 'सूचनाएं एवं अलर्ट'}
            </h1>
            {unreadCount > 0 && (
              <span className="font-mono text-[11px] bg-[#ac2e00] text-white px-2 py-0.5 rounded-full font-bold">
                {unreadCount} {lang === 'EN' ? 'New' : 'नए'}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#5b4139] mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {lang === 'EN'
                ? 'Sovereign Node Event Stream • Mumbai IN-MUM-1'
                : 'संप्रभु नोड इवेंट स्ट्रीम • मुंबई IN-MUM-1'}
            </span>
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-[#ac2e00] hover:bg-[#ffdbd1]/50 px-2.5 py-1.5 rounded-lg border border-[#ac2e00]/20 transition-all flex items-center gap-1"
              title="Mark all as read"
            >
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>{lang === 'EN' ? 'Mark All Read' : 'सभी पढ़ें'}</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-medium text-[#5b4139] hover:bg-[#eceef0] p-1.5 rounded-lg transition-colors"
              title={lang === 'EN' ? 'Clear all alerts' : 'सभी अलर्ट हटाएं'}
            >
              <span className="material-symbols-outlined text-[16px]">clear_all</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-4 p-1 bg-[#f2f4f6] rounded-xl border border-[#e4beb4]/30">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === 'all'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          <span>{lang === 'EN' ? 'All' : 'सभी'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#e0e3e5] text-[#191c1e]">
            {notifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          <span>{lang === 'EN' ? 'Unread' : 'अपठित'}</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#ac2e00] text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setFilter('action')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            filter === 'action'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#5b4139] hover:text-[#191c1e]'
          }`}
        >
          <span>{lang === 'EN' ? 'Action Required' : 'कार्रवाई आवश्यक'}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#e4beb4]/30 text-center flex flex-col items-center justify-center gap-3 shadow-xs my-4">
            <div className="w-14 h-14 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#5b4139]">
              <span className="material-symbols-outlined text-[28px]">notifications_paused</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#191c1e]">
                {filter === 'unread'
                  ? lang === 'EN'
                    ? 'No Unread Notifications'
                    : 'कोई अपठित सूचना नहीं है'
                  : lang === 'EN'
                  ? 'All Caught Up!'
                  : 'सब अद्यतन है!'}
              </h3>
              <p className="text-[12px] text-[#5b4139] mt-1 max-w-sm mx-auto">
                {lang === 'EN'
                  ? 'All contract executions, cryptographic anchors, and AI legal alerts are in sync.'
                  : 'सभी अनुबंध निष्पादन, क्रिप्टोग्राफ़िक एंकर और एआई विधिक अलर्ट समन्वयित हैं।'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contracts')}
              className="mt-2 px-4 py-2 bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] text-[12px] font-bold rounded-xl border border-[#e4beb4]/40 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>{lang === 'EN' ? 'Return to Contracts Vault' : 'अनुबंध वॉल्ट पर लौटें'}</span>
            </button>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const { icon, bg } = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                className={`relative rounded-xl p-4 border transition-all ${
                  item.isRead
                    ? 'bg-white border-[#e4beb4]/30 shadow-2xs opacity-90'
                    : 'bg-white border-[#ac2e00]/40 shadow-xs ring-1 ring-[#ac2e00]/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Category Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[13px] font-bold text-[#191c1e] leading-snug">
                          {lang === 'EN' ? item.titleEn : item.titleHi}
                        </h2>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#ac2e00] shrink-0 animate-pulse"></span>
                        )}
                      </div>

                      {/* Dismiss individual item */}
                      <button
                        type="button"
                        onClick={() => onDismiss(item.id)}
                        className="text-[#5b4139] hover:text-[#191c1e] p-0.5 rounded transition-colors -mt-1 -mr-1"
                        title={lang === 'EN' ? 'Dismiss' : 'हटाएं'}
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    <p className="text-[12px] text-[#5b4139] mt-1 leading-relaxed">
                      {lang === 'EN' ? item.messageEn : item.messageHi}
                    </p>

                    {/* Metadata & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#f2f4f6]">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5b4139]">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>{lang === 'EN' ? item.timestampEn : item.timestampHi}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!item.isRead && (
                          <button
                            type="button"
                            onClick={() => onMarkAsRead(item.id)}
                            className="text-[11px] font-semibold text-[#5b4139] hover:text-[#191c1e] px-2 py-1 rounded hover:bg-[#f2f4f6] transition-colors"
                          >
                            {lang === 'EN' ? 'Mark Read' : 'पढ़ा हुआ चिह्नित करें'}
                          </button>
                        )}

                        {item.actionTarget && (
                          <button
                            type="button"
                            onClick={() => handleAction(item)}
                            className="px-3 py-1 bg-[#191c1e] hover:bg-[#ac2e00] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <span>
                              {lang === 'EN'
                                ? item.actionLabelEn || 'View'
                                : item.actionLabelHi || 'देखें'}
                            </span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Return to Dashboard link at bottom */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => onNavigate('contracts')}
          className="text-[12px] font-bold text-[#ac2e00] hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{lang === 'EN' ? 'Back to Contracts Vault' : 'अनुबंध वॉल्ट पर वापस जाएं'}</span>
        </button>
      </div>
    </div>
  );
};
