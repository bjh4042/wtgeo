import { useEffect, useRef } from 'react';

/**
 * 공통 모달 동작 훅
 * - ESC 키로 닫기
 * - 배경 스크롤 잠금 (기존 overflow 값을 저장한 뒤 언마운트 시 복원)
 * 여러 팝업이 겹칠 때도 원래 상태로 안전하게 복원됩니다.
 */
export function useModalBehavior(onClose: () => void, enabled: boolean = true) {
  // ESC 로 닫기
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, enabled]);

  // 배경 스크롤 잠금
  useEffect(() => {
    if (!enabled) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [enabled]);

  // 팝업을 열었던 버튼으로 포커스 복귀
  const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const active = document.activeElement;
    triggerRef.current = active instanceof HTMLElement ? active : null;
    return () => {
      const el = triggerRef.current;
      if (el && document.contains(el)) {
        // 렌더 정리 후 복귀
        setTimeout(() => el.focus({ preventScroll: true }), 0);
      }
    };
  }, [enabled]);
}
