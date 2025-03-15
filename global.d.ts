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
    };

    // ✅ Correct placement for getRender under "interactive"
    interactive: {
      getRender: (params: {
        adInfo: { zoneId: number; publisherId: number };
        cb: {
          adResourceLoad?: (e: boolean) => void; // ✅ Tracks if ad resources are loaded
          adOpening?: (e: boolean) => void; // ✅ Logs when the ad starts opening
          adOpened?: (e: string) => void; // ✅ Logs when the ad is fully opened
          adTaskFinished?: (e: string) => void; // ✅ Logs when an ad task is completed
          adClosing?: (e: string) => void; // ✅ Logs when the ad is closing
          adClosed?: (e: string) => void; // ✅ Logs when the ad is fully closed
          adClick?: (e: boolean) => void; // ✅ Logs when the ad is clicked
        };
      }) => void;
    };
  }
}

export {};
