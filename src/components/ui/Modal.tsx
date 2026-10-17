import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
`;

const Heading = styled.h2`
  margin: 0 0 24px;
  font-size: 22px;
`;

const modalStack: symbol[] = [];

const FOCUSABLE_SELECTOR =
  "button:not([disabled]), input:not([disabled]), " +
  "textarea:not([disabled]), select:not([disabled]), " +
  '[tabindex]:not([tabindex="-1"])';

export function Modal({ title, children, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const modalId = Symbol("modal");
    modalStack.push(modalId);

    const previousFocus = document.activeElement;

    const isTopmostModal = () => modalStack[modalStack.length - 1] === modalId;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmostModal()) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );

        if (focusable.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const index = modalStack.indexOf(modalId);

      const wasTopmost = isTopmostModal();

      if (index !== -1) {
        modalStack.splice(index, 1);
      }

      if (wasTopmost && previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, []);

  return createPortal(
    <Overlay
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <Heading>{title}</Heading>
        {children}
      </Dialog>
    </Overlay>,
    document.body,
  );
}
