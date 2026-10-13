import type { PropsWithChildren, ReactNode } from 'react';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import clsx from 'clsx';
import CloseIcon from '../svgs/CloseIcon';
import styles from './Modal.module.scss';
import type { OpenChangeDetails } from '../controls/InputWithDropdown';

const { Root, Backdrop, Positioner, Content, Title, Description, CloseTrigger } = Dialog;

export type ModalProps = PropsWithChildren<{
  /**
   * Controlled open state
   */
  isOpen: boolean;
  /**
   * Setter to open or close the modal. Place your trigger button(s) anywhere — just call setIsOpen(true).
   */
  setIsOpen?: (open: boolean) => void;
  /**
   * Modal header title
   */
  title?: ReactNode;
  /**
   * Subtitle / description rendered below the title
   */
  description?: ReactNode;
  /**
   * Close when the Escape key is pressed.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Close when clicking outside the dialog.
   * @default true
   */
  closeOnInteractOutside?: boolean;
  /**
   * Only mount dialog content when first opened; unmount it when closed.
   * Prefer this over conditionally rendering Modal itself.
   * @default false
   */
  isLazyMount?: boolean;
  /**
   * Trap focus and prevent interaction with elements outside the dialog.
   * Set to false for non-modal / drawer-style panels.
   * @default true
   */
  isModal?: boolean;
  /**
   * Dialog accessibility role.
   * Use `'alertdialog'` for destructive confirmations — focus moves to the
   * cancel/safe action and clicking outside is automatically disabled.
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog';
  /**
   * Prevent body from scrolling while the dialog is open.
   * @default true
   */
  preventScroll?: boolean;
  /**
   * Element that receives focus when the dialog opens (overrides default auto-focus).
   */
  initialFocusEl?: () => HTMLElement | null;
  /**
   * Element that receives focus when the dialog closes (defaults to the trigger that opened it).
   */
  finalFocusEl?: () => HTMLElement | null;
  /**
   * Show the × close button in the top-right corner of the content panel.
   * @default true
   */
  showCloseButton?: boolean;
  backdropClassName?: string;
  positionerClassName?: string;
  contentClassName?: string;
  /**
   * Called when the Escape key is pressed.
   * Call `e.preventDefault()` to suppress default close.
   */
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  /**
   * Called when an interaction occurs outside the dialog.
   * Call `e.preventDefault()` to suppress default close.
   */
  onInteractOutside?: (e: Event) => void;
  /**
   * Called when the exit animation fully completes (useful for cleanup after close).
   */
  onExitComplete?: () => void;
}>;

/**
 * For the body, you can use elements from:
 *
 * ```ts
 * import { Dialog } from '@ark-ui/react/dialog';
 * ```
 *
 * Such as:
 *
 * ```ts
 * function Body() {
 *  return (
 *    <>
 *      <Dialog.Title />
 *      <Dialog.Description />
 *    </>
 * )
 * ```
 */
export default function Modal(props: ModalProps) {
  const {
    isOpen,
    setIsOpen,
    title,
    description,
    children,
    closeOnEscape = true,
    closeOnInteractOutside = true,
    isLazyMount = false,
    isModal = true,
    role = 'dialog',
    preventScroll = true,
    initialFocusEl,
    finalFocusEl,
    showCloseButton = true,
    backdropClassName,
    positionerClassName,
    contentClassName,
    onEscapeKeyDown,
    onInteractOutside,
    onExitComplete,
  } = props;

  function onOpenChange(e: OpenChangeDetails) {
    setIsOpen?.(e.open);
  }

  return (
    <Root
      open={isOpen}
      onOpenChange={onOpenChange}
      closeOnEscape={closeOnEscape}
      closeOnInteractOutside={closeOnInteractOutside}
      lazyMount={isLazyMount}
      unmountOnExit={isLazyMount}
      modal={isModal}
      role={role}
      preventScroll={preventScroll}
      initialFocusEl={initialFocusEl}
      finalFocusEl={finalFocusEl}
      onEscapeKeyDown={onEscapeKeyDown}
      onInteractOutside={onInteractOutside}
      onExitComplete={onExitComplete}
    >
      <Portal>
        {isModal && <Backdrop className={clsx(styles.backdrop, backdropClassName)} />}

        <Positioner className={clsx(styles.positioner, positionerClassName)}>
          <Content className={clsx(styles.content, contentClassName)}>
            {(title || description) && (
              <div className={styles.header}>
                {title && <Title className={styles.title}>{title}</Title>}
                {description && <Description className={styles.description}>{description}</Description>}
              </div>
            )}

            {children}

            {showCloseButton && (
              <CloseTrigger className={styles.closeTrigger}>
                <CloseIcon />
              </CloseTrigger>
            )}
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
}
