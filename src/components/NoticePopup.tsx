import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import { getNoticeFromCloud } from '@/data/dataManager';

const DISMISSED_KEY = 'geoje-notice-dismissed';

const NoticePopup = () => {
  const [notice, setNotice] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getNoticeFromCloud().then(current => {
      if (!current) return;

      const dismissed = sessionStorage.getItem(DISMISSED_KEY);
      if (dismissed === current) return;

      setNotice(current);
      setTimeout(() => setShow(true), 500);
    });
  }, []);

  const handleClose = () => {
    setShow(false);
    if (notice) sessionStorage.setItem(DISMISSED_KEY, notice);
  };

  if (!notice || !show) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40" onClick={handleClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center">
            <Megaphone size={16} className="text-accent-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">📢 공지사항</h3>
          <button onClick={handleClose} className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{notice}</p>
        <button
          onClick={handleClose}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default NoticePopup;
