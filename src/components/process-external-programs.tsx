import Image from "next/image";
import { externalPrograms } from "@/lib/external-programs";



export function ProcessExternalPrograms({visible = true}: {visible?: boolean}) {
  return <ul id="process-external-programs" className="process-external-programs" aria-label="Внешние программы для интеграции" aria-hidden={!visible}>
    {externalPrograms.map(({name, file, width, height, displayWidth, x, y}) => <li key={file} title={name} data-external-program={file} style={{left: x, top: y, width: displayWidth}}>
      <Image
        data-pointer-surface
        src={`/integrations/logos/${file}`}
        alt={name}
        width={width}
        height={height}
        sizes={`${Math.ceil(displayWidth)}px`}
        unoptimized={file === "design-faeton.png" || file === "easyorder-crm-transparent.png"}
      />
    </li>)}
  </ul>;
}
