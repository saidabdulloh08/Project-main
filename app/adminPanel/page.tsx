// app/adminPanel/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/lib/context';
import {
  MultiLangContent,
  LanguageKey,
  Comment,
  ServiceItem,
  PortfolioItem,
  AboutItem,
  CommentStatus,
} from '@/lib/types';
import { loadFullContentMap } from '@/lib/context';
import { getComments, updateCommentStatus, deleteComment } from '@/lib/commentState';
import "./page.css"

const ADMIN_LOGIN = 'ICPAdmin';
const ADMIN_PASSWORD = 'adminQwErTy###panel';

export default function AdminPanelPage() {
  const { currentLang, getContent, setContentFromAdmin, isDarkMode } = useAppContext();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [contentDraft, setContentDraft] = useState<MultiLangContent>(loadFullContentMap());
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'comments'>('content');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const langOptions: LanguageKey[] = ['uzb', 'rus', 'eng'];
  const [editingLang, setEditingLang] = useState<LanguageKey>('uzb');
  const [activeContentTab, setActiveContentTab] = useState<'About' | 'Services' | 'Portfolio'>('About');

  // ===== LOGIN =====
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput === ADMIN_LOGIN && passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      loadComments();
    } else {
      setLoginError('Notoʻgʻri login yoki parol.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginInput('');
    setPasswordInput('');
    setLoginError('');
    setSaveMessage('');
  };

  // ===== COMMENTS =====
  const loadComments = useCallback(() => {
    const all = getComments();
    const pendings = all.filter(c => c.status === CommentStatus.PENDING);
    setPendingComments(pendings);
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadComments();
  }, [isAuthenticated, loadComments]);

  const handleCommentAction = (commentId: string, action: 'approve' | 'delete') => {
    try {
      if (action === 'approve') updateCommentStatus(commentId, CommentStatus.APPROVED);
      else if (action === 'delete') deleteComment(commentId);
      setSaveMessage(action === 'approve' ? 'Izoh tasdiqlandi.' : 'Izoh oʻchirildi.');
      loadComments();
    } catch (error) {
      console.error("Comment action failed:", error);
      setSaveMessage('Xato yuz berdi. Konsolni tekshiring.');
    } finally {
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // ===== CONTENT LOGIC =====
  const handleTextChange = (section: 'about' | 'services' | 'portfolio', key: string, value: string) => {
    setContentDraft(prev => ({
      ...prev,
      [editingLang]: {
        ...prev[editingLang],
        [section]: {
          ...prev[editingLang][section],
          [key]: value,
        },
      },
    }));
  };

  const handleItemChange = (section: 'about' | 'services' | 'portfolio', itemIndex: number, key: string, value: string) => {
    setContentDraft(prev => {
      const currentItems = prev[editingLang][section].items;
      const updatedItems = currentItems.map((item, index) =>
        index === itemIndex ? { ...item, [key]: value } : item
      ) as (ServiceItem[] | PortfolioItem[] | AboutItem[]);
      return {
        ...prev,
        [editingLang]: {
          ...prev[editingLang],
          [section]: {
            ...prev[editingLang][section],
            items: updatedItems,
          },
        },
      };
    });
  };

  const handleSave = () => {
    setSaving(true);
    try {
      setContentFromAdmin(contentDraft);
      setSaveMessage('Maʻlumotlar muvaffaqiyatli saqlandi!');
    } catch (error) {
      console.error("Save failed:", error);
      setSaveMessage('Saqlashda xato yuz berdi.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  // ===== RENDER HELPERS =====
  const renderAboutEditor = () => {
    const aboutContent = contentDraft[editingLang].about;
    return (
      <>
        <h3 className="admin-subtitle">About bo'limi</h3>
        <div className="input-group">
          <label>Sarlavha</label>
          <input
            type="text"
            value={aboutContent.heading}
            onChange={(e) => handleTextChange('about', 'heading', e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Matn</label>
          <textarea
            value={aboutContent.text}
            onChange={(e) => handleTextChange('about', 'text', e.target.value)}
            className="input-field"
          />
        </div>
        {aboutContent.items.map((item, index) => (
          <div key={index} className="admin-card mb-3">
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleItemChange('about', index, 'title', e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange('about', index, 'description', e.target.value)}
              className="input-field"
            />
          </div>
        ))}
      </>
    );
  };

  const renderServicesEditor = () => {
    const servicesContent = contentDraft[editingLang].services;
    return (
      <>
        <h3 className="admin-subtitle">Services bo'limi</h3>
        <div className="input-group">
          <label>Sarlavha</label>
          <input
            type="text"
            value={servicesContent.heading}
            onChange={(e) => handleTextChange('services', 'heading', e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Matn</label>
          <textarea
            value={servicesContent.text}
            onChange={(e) => handleTextChange('services', 'text', e.target.value)}
            className="input-field"
          />
        </div>
        {servicesContent.items.map((item, index) => (
          <div key={index} className="admin-card mb-3">
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleItemChange('services', index, 'title', e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange('services', index, 'description', e.target.value)}
              className="input-field"
            />
          </div>
        ))}
      </>
    );
  };

  const renderPortfolioEditor = () => {
    const portfolioContent = contentDraft[editingLang].portfolio;
    return (
      <>
        <h3 className="admin-subtitle">Portfolio bo'limi</h3>
        <div className="input-group">
          <label>Sarlavha</label>
          <input
            type="text"
            value={portfolioContent.heading}
            onChange={(e) => handleTextChange('portfolio', 'heading', e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Matn</label>
          <textarea
            value={portfolioContent.text}
            onChange={(e) => handleTextChange('portfolio', 'text', e.target.value)}
            className="input-field"
          />
        </div>
        {(portfolioContent.items as PortfolioItem[]).map((item, index) => (
          <div key={index} className="admin-card mb-4">
            <p className="font-bold mb-2 text-icp-accent">Loyha #{index + 1}</p>
            <div className="input-group">
              <label>Rasm tanlash</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    handleItemChange('portfolio', index, 'image', reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
                className="input-field"
              />
              {item.image && (
                <button
                  type="button"
                  onClick={() => handleItemChange('portfolio', index, 'image', '')}
                  className="delete-image-btn"
                >
                  Rasmni o‘chirish
                </button>
              )}
            </div>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="preview-image mt-2"
                style={{ maxWidth: '150px', borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
            <div className="input-group">
              <label>Loyiha nomi</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleItemChange('portfolio', index, 'title', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Tag</label>
              <input
                type="text"
                value={item.tag}
                onChange={(e) => handleItemChange('portfolio', index, 'tag', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Tavsif</label>
              <textarea
                value={item.description}
                onChange={(e) => handleItemChange('portfolio', index, 'description', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        ))}
      </>
    );
  };

  // ===== RENDER =====
  if (!isAuthenticated) {
    return (
      <div className={`admin-auth-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="admin-card auth-card">
          <h2 className="admin-title">Admin Panelga Kirish</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Login" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} className="input-field" required />
            <input type="password" placeholder="Parol" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="input-field" required />
            {loginError && <p className="error-message">{loginError}</p>}
            <button type="submit" className="btn-primary mt-4 w-full">Kirish</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="admin-header">
        <h1 className="admin-title">ICP Admin Boshqaruvi</h1>
        <button onClick={handleLogout} className="btn-secondary">Chiqish</button>
      </header>

      <main className="admin-main">
        {saveMessage && <div className="save-message">{saveMessage}</div>}

        <div className="tab-container">
          <button onClick={() => setActiveTab('content')} className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}>Kontent Tahrirlash</button>
          <button onClick={() => setActiveTab('comments')} className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}>Izohlarni Boshqarish ({pendingComments.length})</button>
        </div>

        {activeTab === 'content' && (
          <div className="admin-content-editor">
            <div className="lang-select-wrapper">
              <label>Tahrirlanadigan Til:</label>
              <select value={editingLang} onChange={(e) => setEditingLang(e.target.value as LanguageKey)} className="input-field">
                {langOptions.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="content-tab-container">
              <button onClick={() => setActiveContentTab('About')} className={`content-tab-btn ${activeContentTab === 'About' ? 'active' : ''}`}>Biz Haqimizda</button>
              <button onClick={() => setActiveContentTab('Services')} className={`content-tab-btn ${activeContentTab === 'Services' ? 'active' : ''}`}>Xizmatlar</button>
              <button onClick={() => setActiveContentTab('Portfolio')} className={`content-tab-btn ${activeContentTab === 'Portfolio' ? 'active' : ''}`}>Natijalar</button>
            </div>

            <div className="admin-card editor-card mt-4">
              {activeContentTab === 'About' && renderAboutEditor()}
              {activeContentTab === 'Services' && renderServicesEditor()}
              {activeContentTab === 'Portfolio' && renderPortfolioEditor()}
            </div>

            <button onClick={handleSave} className="btn-primary mt-6" disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Oʻzgarishlarni Saqlash'}</button>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="admin-comments-manager">
            <h2 className="admin-subtitle">Tasdiqlanishni Kutayotgan Izohlar ({pendingComments.length})</h2>
            {pendingComments.length === 0 ? (
              <p className="empty-message">Tasdiqlanishni kutayotgan izohlar mavjud emas.</p>
            ) : (
              <div className="comments-list">
                {pendingComments.map(comment => (
                  <div key={comment.id} className="comment-item admin-card">
                    <div className="comment-details">
                      <p><strong>Foydalanuvchi:</strong> {comment.name}</p>
                      <p><strong>Sana:</strong> {new Date(comment.timestamp).toLocaleString()}</p>
                      <p className="comment-text">"{comment.text}"</p>
                    </div>
                    <div className="comment-actions">
                      <button onClick={() => handleCommentAction(comment.id, 'approve')} className="btn-success">Tasdiqlash</button>
                      <button onClick={() => handleCommentAction(comment.id, 'delete')} className="btn-danger">Oʻchirish</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
