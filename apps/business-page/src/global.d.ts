declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}

declare namespace Gtag {
  type ControlParams = {
    groups?: string;
  };

  type EventParams = {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: unknown;
  };

  type ConfigParams = {
    page_title?: string;
    page_path?: string;
    page_location?: string;
    [key: string]: unknown;
  };

  interface Gtag {
    (command: 'config', targetId: string, config?: ConfigParams): void;
    (command: 'set', config: ControlParams): void;
    (command: 'event', eventName: string, params?: EventParams): void;
  }
}

export {};
