import Link from "next/link";
import { DemoButton } from "@/components/demo-dialog";
import { TelegramSupportButton } from "@/components/telegram-support-button";

export function DemoActions({ variant = "primary" }: { variant?: "primary" | "footer" }) {
  return (
    <div className={"demo-actions demo-actions-" + variant}>
      {variant === "footer" && <TelegramSupportButton />}
      <DemoButton variant={variant} />
      <Link href="/mini-factory" className={"demo-button mini-factory-button mini-factory-button-" + variant}>
        Виртуальная фабрика
      </Link>
    </div>
  );
}
