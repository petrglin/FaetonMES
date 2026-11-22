import Image from "next/image";
import { systemModules } from "@/lib/modules";

export function ModuleTitle({ moduleId, title }: { moduleId: string; title: string }) {
  const systemModule = systemModules.find(({ id }) => id === moduleId);

  return (
    <div className="module-title-row">
      {systemModule && <Image className="module-title-icon" src={systemModule.image} alt="" width={400} height={260} sizes="(max-width: 599px) 88px, 120px" />}
      <h1>{title}</h1>
    </div>
  );
}
