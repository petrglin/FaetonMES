import type { Metadata } from "next";

export const metadata: Metadata = { title: "Виртуальная фабрика — FaetonMES" };

export default function Page() {
  return (
    <main className="virtual-factory-page" aria-label="Виртуальная фабрика">
      <h1 className="sr-only">Виртуальная фабрика</h1>
      <iframe
        className="virtual-factory-frame"
        src="/factory-demo/factory-demo.html?embedded=1"
        title="Виртуальная мебельная фабрика FaetonMES"
        allow="fullscreen"
        allowFullScreen
      />
    </main>
  );
}
