"use client";

import { Dialog } from "@base-ui/react/dialog";

export function BusinessProcessDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="business-process-link">Бизнес-процесс</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="demo-backdrop" />
        <Dialog.Viewport className="demo-viewport">
          <Dialog.Popup className="demo-popup business-process-popup">
            <Dialog.Close className="demo-close" aria-label="Закрыть бизнес-процесс">×</Dialog.Close>
            <Dialog.Title className="demo-title">Бизнес-процесс</Dialog.Title>
            <Dialog.Description className="demo-intro">
              Инфографика бизнес-процесса будет добавлена позже.
            </Dialog.Description>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
