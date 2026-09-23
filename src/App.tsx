/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, Language, ContractLanguage, ContractItem, ContractClause, AuditHistoryEvent, AppNotification, UserProfile } from './types';
import { INITIAL_CONTRACTS, INITIAL_NOTIFICATIONS, INITIAL_USER_PROFILE } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QuickScreenSelector } from './components/QuickScreenSelector';
import { LandingScreen } from './components/screens/LandingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { TwoFactorScreen } from './components/screens/TwoFactorScreen';
import { ContractsScreen } from './components/screens/ContractsScreen';
import { ESignScreen } from './components/screens/ESignScreen';
import { AICopilotScreen } from './components/screens/AICopilotScreen';
import { VerifyScreen } from './components/screens/VerifyScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { NewAgreementScreen } from './components/screens/NewAgreementScreen';
import { SupportBotModal } from './components/modals/SupportBotModal';
import { LoadingProvider } from './context/LoadingContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [lang, setLang] = useState<Language>('EN');
  const [contractLanguage, setContractLanguage] = useState<ContractLanguage>('en');
  const [isSupportBotOpen, setIsSupportBotOpen] = useState(false);
  const [contracts, setContracts] = useState<ContractItem[]>(INITIAL_CONTRACTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeContractForESign, setActiveContractForESign] = useState<ContractItem | null>(INITIAL_CONTRACTS[0]);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleAddClause = (contractId: string, clause: ContractClause) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          return { ...c, clauses: [...(c.clauses || []), clause] };
        }
        return c;
      })
    );
    setActiveContractForESign(prev => {
      if (prev && prev.id === contractId) {
        return { ...prev, clauses: [...(prev.clauses || []), clause] };
      }
      return prev;
    });
  };

  const handleEditClause = (contractId: string, clauseNumber: string, updatedData: Partial<ContractClause>) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          const updatedClauses = (c.clauses || []).map(cl =>
            cl.clauseNumber === clauseNumber ? { ...cl, ...updatedData } : cl
          );
          return { ...c, clauses: updatedClauses };
        }
        return c;
      })
    );
    setActiveContractForESign(prev => {
      if (prev && prev.id === contractId) {
        const updatedClauses = (prev.clauses || []).map(cl =>
          cl.clauseNumber === clauseNumber ? { ...cl, ...updatedData } : cl
        );
        return { ...prev, clauses: updatedClauses };
      }
      return prev;
    });
  };

  const handleDiscardClause = (contractId: string, clauseNumber: string, reason?: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          const updatedClauses = (c.clauses || []).map(cl =>
            cl.clauseNumber === clauseNumber
              ? {
                  ...cl,
                  discarded: true,
                  discardReason:
                    reason || 'Mutually waived by both signatories under Section 62 Indian Contract Act 1872',
                  updatedAt: new Date().toLocaleTimeString(),
                }
              : cl
          );
          return { ...c, clauses: updatedClauses };
        }
        return c;
      })
    );
    setActiveContractForESign(prev => {
      if (prev && prev.id === contractId) {
        const updatedClauses = (prev.clauses || []).map(cl =>
          cl.clauseNumber === clauseNumber
            ? {
                ...cl,
                discarded: true,
                discardReason:
                  reason || 'Mutually waived by both signatories under Section 62 Indian Contract Act 1872',
                updatedAt: new Date().toLocaleTimeString(),
              }
            : cl
        );
        return { ...prev, clauses: updatedClauses };
      }
      return prev;
    });
  };

  const handleRestoreClause = (contractId: string, clauseNumber: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          const updatedClauses = (c.clauses || []).map(cl =>
            cl.clauseNumber === clauseNumber
              ? { ...cl, discarded: false, discardReason: undefined, updatedAt: new Date().toLocaleTimeString() }
              : cl
          );
          return { ...c, clauses: updatedClauses };
        }
        return c;
      })
    );
    setActiveContractForESign(prev => {
      if (prev && prev.id === contractId) {
        const updatedClauses = (prev.clauses || []).map(cl =>
          cl.clauseNumber === clauseNumber
            ? { ...cl, discarded: false, discardReason: undefined, updatedAt: new Date().toLocaleTimeString() }
            : cl
        );
        return { ...prev, clauses: updatedClauses };
      }
      return prev;
    });
  };

  const handleDeleteClause = (contractId: string, clauseNumber: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          const updatedClauses = (c.clauses || []).filter(cl => cl.clauseNumber !== clauseNumber);
          return { ...c, clauses: updatedClauses };
        }
        return c;
      })
    );
    setActiveContractForESign(prev => {
      if (prev && prev.id === contractId) {
        const updatedClauses = (prev.clauses || []).filter(cl => cl.clauseNumber !== clauseNumber);
        return { ...prev, clauses: updatedClauses };
      }
      return prev;
    });
  };

  const handleUpdateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updated }));
  };

  const handleStoreContractInVault = (contractId: string) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
    const storageDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newCertId = 'CERT-65B-2026-' + Math.floor(10000 + Math.random() * 90000);
    const simulatedTx = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const simulatedBlock = '#63,' + Math.floor(800000 + Math.random() * 200000);

    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          const vaultArchiveId = c.vaultArchiveId || `VAULT-IN-MUM-${c.code}`;
          const existingHistory = c.history || [];

          const newEvents: AuditHistoryEvent[] = [];
          if (c.status !== 'executed') {
            newEvents.push({
              id: `h-exec-${Date.now()}`,
              timestamp,
              titleEn: 'Dual-Party Execution & IT Act Attestation',
              titleHi: 'द्विपक्षीय निष्पादन एवं आईटी अधिनियम साक्ष्य पूर्ण',
              descriptionEn: 'Contract digitally executed via Class 3 DSC and Aadhaar e-Sign OTP gateway.',
              descriptionHi: 'अनुबंध क्लास ३ डीएससी एवं आधार ई-साइन ओटीपी द्वारा निष्पादित।',
              actor: 'PAKT Execution Gateway',
              eventType: 'signature',
            });
            newEvents.push({
              id: `h-anchor-${Date.now() + 1}`,
              timestamp,
              titleEn: 'Polygon PoS L2 Blockchain Anchored',
              titleHi: 'पॉलीगॉन पीओएस L2 ब्लॉकचेन पर एंकरिंग',
              descriptionEn: `Canonical hash anchored at Block ${simulatedBlock} with zero gas sponsorship.`,
              descriptionHi: `कैनोनिकल हैश ब्लॉक ${simulatedBlock} पर सुरक्षित रूप से एंकर हुआ।`,
              actor: 'PAKT Mumbai L2 Relayer',
              eventType: 'hash_anchor',
              txHash: simulatedTx,
              blockNumber: simulatedBlock,
            });
          }

          newEvents.push({
            id: `h-store-${Date.now() + 2}`,
            timestamp,
            titleEn: 'Archived into Permanent Legal Vault',
            titleHi: 'स्थायी विधिक वॉल्ट में सुरक्षित रूप से संग्रहित',
            descriptionEn: `Contract archived in sovereign cold-storage with Section 65B Certificate ${newCertId}.`,
            descriptionHi: `धारा ६५ख प्रमाण पत्र ${newCertId} के साथ वॉल्ट में स्थायी रूप से संग्रहित।`,
            actor: 'PAKT Storage Vault Daemon',
            eventType: 'vault_storage',
            metadata: { vaultId: vaultArchiveId, certId: newCertId },
          });

          return {
            ...c,
            status: 'executed',
            statusLabelEn: 'EXECUTED & VAULT STORED',
            statusLabelHi: 'निष्पादित एवं वॉल्ट में संग्रहित',
            storedInVault: true,
            vaultStorageDate: storageDate,
            vaultArchiveId,
            sec65BCertificateId: c.sec65BCertificateId || newCertId,
            executionDate: c.executionDate || timestamp,
            polygonTx: c.polygonTx || simulatedTx,
            blockNumber: c.blockNumber || simulatedBlock,
            history: [...existingHistory, ...newEvents],
          };
        }
        return c;
      })
    );
  };

  const handleAddHistoryNote = (contractId: string, noteText: string, actor: string = 'Priya Sharma (Custodian)') => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
    const newNoteEvent: AuditHistoryEvent = {
      id: `h-note-${Date.now()}`,
      timestamp,
      titleEn: 'Historical Audit Note Appended',
      titleHi: 'ऐतिहासिक ऑडिट टिप्पणी संलग्न की गई',
      descriptionEn: noteText,
      descriptionHi: noteText,
      actor,
      eventType: 'note',
    };

    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          return {
            ...c,
            history: [...(c.history || []), newNoteEvent],
          };
        }
        return c;
      })
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleLanguage = (targetLang?: Language) => {
    if (targetLang) {
      setLang(targetLang);
    } else {
      setLang(prev => (prev === 'EN' ? 'HI' : 'EN'));
    }
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddContract = (newContract: ContractItem) => {
    setContracts(prev => [newContract, ...prev]);
  };

  const handleOpenInESign = (contract: ContractItem) => {
    setActiveContractForESign(contract);
    setCurrentScreen('esign');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LoadingProvider lang={lang}>
      <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased flex flex-col selection:bg-[#ffdbd1] selection:text-[#3b0a00]">
        {/* Top Application Header (Hidden on welcome splash for full immersion, visible on all other screens) */}
        {currentScreen !== 'landing' && (
          <Header
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            lang={lang}
            onToggleLang={toggleLanguage}
            onOpenNotifications={() => handleNavigate('notifications')}
            onOpenSupportBot={() => setIsSupportBotOpen(true)}
            unreadCount={unreadCount}
          />
        )}

        {/* Screen Quick Selector floating widget for fast testing across all 8 views */}
        <QuickScreenSelector
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          lang={lang}
        />

        {/* Main Screen Container */}
        <main className={`flex-1 flex flex-col ${currentScreen !== 'landing' ? 'pt-16' : ''}`}>
          {currentScreen === 'landing' && (
            <LandingScreen onNavigate={handleNavigate} lang={lang} />
          )}
          {currentScreen === 'login' && (
            <LoginScreen onNavigate={handleNavigate} lang={lang} />
          )}
          {currentScreen === '2fa' && (
            <TwoFactorScreen onNavigate={handleNavigate} lang={lang} />
          )}
          {currentScreen === 'contracts' && (
            <ContractsScreen
              onNavigate={handleNavigate}
              lang={lang}
              contractLanguage={contractLanguage}
              onSelectContractLanguage={setContractLanguage}
              contracts={contracts}
              onSelectContractForESign={handleOpenInESign}
              onOpenSupportBot={() => setIsSupportBotOpen(true)}
              onOpenNewPakt={() => handleNavigate('new-agreement')}
              onAddClause={handleAddClause}
              onEditClause={handleEditClause}
              onDiscardClause={handleDiscardClause}
              onRestoreClause={handleRestoreClause}
              onDeleteClause={handleDeleteClause}
              onStoreContractInVault={handleStoreContractInVault}
              onAddHistoryNote={handleAddHistoryNote}
            />
          )}
          {currentScreen === 'new-agreement' && (
            <NewAgreementScreen
              onNavigate={handleNavigate}
              lang={lang}
              contractLanguage={contractLanguage}
              onSelectContractLanguage={setContractLanguage}
              onCreateContract={(newContract, openInESign) => {
                handleAddContract(newContract);
                if (openInESign) {
                  handleOpenInESign(newContract);
                } else {
                  handleNavigate('contracts');
                }
              }}
            />
          )}
          {currentScreen === 'esign' && (
            <ESignScreen
              onNavigate={handleNavigate}
              lang={lang}
              contractLanguage={contractLanguage}
              onSelectContractLanguage={setContractLanguage}
              contract={activeContractForESign}
              onAddClause={handleAddClause}
              onEditClause={handleEditClause}
              onDiscardClause={handleDiscardClause}
              onRestoreClause={handleRestoreClause}
              onDeleteClause={handleDeleteClause}
            />
          )}
          {currentScreen === 'copilot' && (
            <AICopilotScreen
              onNavigate={handleNavigate}
              lang={lang}
              onOpenNewPakt={() => handleNavigate('new-agreement')}
            />
          )}
          {currentScreen === 'verify' && (
            <VerifyScreen onNavigate={handleNavigate} lang={lang} />
          )}
          {currentScreen === 'settings' && (
            <SettingsScreen
              onNavigate={handleNavigate}
              lang={lang}
              contractLanguage={contractLanguage}
              onSelectContractLanguage={setContractLanguage}
              userProfile={userProfile}
              onUpdateProfile={handleUpdateUserProfile}
            />
          )}
          {currentScreen === 'notifications' && (
            <NotificationsScreen
              onNavigate={handleNavigate}
              lang={lang}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDismiss={handleDismissNotification}
              onClearAll={handleClearAllNotifications}
              onSelectContractForESign={handleOpenInESign}
              contracts={contracts}
            />
          )}
        </main>

        {/* Bottom Sticky Navigation Dock (Shown for app dashboard screens) */}
        {currentScreen !== 'landing' && currentScreen !== 'login' && currentScreen !== '2fa' && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}

        {/* Support Bot Modal */}
        <SupportBotModal
          isOpen={isSupportBotOpen}
          onClose={() => setIsSupportBotOpen(false)}
          lang={lang}
          contractLanguage={contractLanguage}
          onSelectContractLanguage={setContractLanguage}
          onAddContract={handleAddContract}
          onOpenInESign={handleOpenInESign}
        />
      </div>
    </LoadingProvider>
  );
}

