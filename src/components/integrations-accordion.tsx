"use client";

import { Accordion } from "@base-ui/react/accordion";
import { integrations } from "@/lib/integrations";

export function IntegrationsAccordion() {
  return (
    <Accordion.Root className="integrations-list" multiple>
      {integrations.map((item) => (
        <Accordion.Item className="integration-item" value={item.id} key={item.id}>
          <Accordion.Header>
            <Accordion.Trigger className="integration-trigger">
              <span>{item.title}</span>
              <svg className="integration-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 10h14" /><path className="integration-toggle-vertical" d="M10 3v14" />
              </svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="integration-panel"><p>{item.description}</p></Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
