// ✅ Extend globalThis to include Buffer
declare global {
  interface Global {
    Buffer: typeof Buffer;
  }

  interface Window {
    Buffer: typeof Buffer;
    show_9079498?: (options?: any) => Promise<void>;
    openADJsSDK?: OpenADJsSDK;
  }

  // ✅ Updated OpenADJsSDK to include correct methods
  interface OpenADJsSDK {
    // ✅ This is the correct init function (not inside bridge)
    init: (params: {
      adParams: {
        version?: string;
        TG?: boolean;
      };
      adInfo: {
        zoneId: number;
        publisherId: number;
        eventId?: number;
      };
      userInfo: {
        userId?: string;
        firstName?: string;
        lastName?: string;
        userName?: string;
        walletType?: string;
        walletAddress?: string;
      };
    }) => Promise<{ code: number; msg: string }>;

    bridge: {
      get: (params: {
        adInfo: { zoneId: number; publisherId: number };
        adParams?: { version?: string; TG?: boolean };
      }) => Promise<{ code: number; msg: string; data?: any }>;

      click: (adInfo: { zoneId: number; publisherId: number }) => void;

      log: (adInfo: {
        zoneId: number;
        publisherId: number;
      }) => Promise<{ code: number; msg: string }>; // ✅ Added log method
    };

    // ✅ Correct placement for getRender under "interactive"
    interactive: {
      init: (params: {
        adParams: { version?: string; TG?: boolean };
        adInfo: { zoneId: number; publisherId: number; eventId?: number };
        userInfo: {
          userId?: string;
          firstName?: string;
          lastName?: string;
          userName?: string;
          walletType?: string;
          walletAddress?: string;
        };
      }) => Promise<{ code: number; msg: string }>;

      getRender: (params: {
        adInfo: { zoneId: number; publisherId: number };
        cb: {
          adResourceLoad?: (e: boolean) => void;
          adOpening?: (e: boolean) => void;
          adOpened?: (e: string) => void;
          adTaskFinished?: (e: string) => void;
          adClosing?: (e: string) => void;
          adClosed?: (e: string) => void;
          adClick?: (e: boolean) => void;
        };
      }) => void;
    };
  }
}

export {};
