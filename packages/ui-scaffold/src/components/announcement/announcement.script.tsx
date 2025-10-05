import { useEffect, useMemo, useState } from "react";
import { UTCDateMini } from "@date-fns/utc";
import { format } from "date-fns";
import { produce } from "immer";
import {
  MaintenanceStatus,
  useLocalStorage,
  useMaintenanceStatus,
  useOrderlyContext,
  useQuery,
  useWS,
} from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import {
  AnnouncementType,
  API,
  EMPTY_LIST,
  WSMessage,
} from "@orderly.network/types";
import { getTimestamp } from "@orderly.network/utils";

const oneDay = 1000 * 60 * 60 * 24;

const maintentanceId = "-1";

export type AnnouncementScriptOptions = {
  hideTips?: boolean;
};

interface AnnouncementStore {
  show?: boolean;
  lastUpdateTime?: number | null;
}

const ORDERLY_ANNOUNCEMENT_KEY = "orderly_announcement";

const getTimeString = (timestamp: number) => {
  const date = format(new UTCDateMini(timestamp), "MMM dd");
  const time = format(new UTCDateMini(timestamp), "h:mm aa");
  return `${time} (UTC) on ${date}`;
};

const sortDataByUpdatedTime = (ori: API.Announcement) => {
  return produce<API.Announcement>(ori, (draft) => {
    if (Array.isArray(draft.rows)) {
      draft.rows.sort((a, b) => {
        if (a.updated_time && b.updated_time) {
          return b.updated_time - a.updated_time;
        }
        return 0;
      });
    }
  });
};

const useAnnouncementData = () => {
  const ws = useWS();

  const [announcementStore, setStore] = useLocalStorage<AnnouncementStore>(
    ORDERLY_ANNOUNCEMENT_KEY,
    {},
  );

  const [tips, setTips] = useState<API.Announcement>({});

  const [maintenanceDialogInfo, setMaintenanceDialogInfo] = useState<string>();

  const { startTime, endTime, status, brokerName } = useMaintenanceStatus();

  const { t } = useTranslation();

  const { data: announcements } = useQuery<API.Announcement>(
    `/v2/public/announcement`,
    {
      revalidateOnFocus: false,
      refreshInterval: 60 * 60 * 1000, // refresh every 1 hour
      formatter: (data) => data,
    },
  );

  const getMaintentTipsContent = (
    brokerName: string,
    startDate: string,
    endDate: string,
  ) => t("maintenance.tips.description", { brokerName, startDate, endDate });

  const getMaintentDialogContent = (brokerName: string, endDate: string) =>
    t("maintenance.dialog.description", { brokerName, endDate });

  useEffect(() => {
    const unsubscribe = ws.subscribe("announcement", {
      onMessage(message: WSMessage.Announcement) {
        if (message) {
          setTips((prev) => {
            return produce(prev, (draft) => {
              // Make sure draft.rows is an array
              if (!Array.isArray(draft.rows)) {
                draft.rows = [];
              }
              const idx = draft.rows.findIndex(
                (tip) => tip.announcement_id === message.announcement_id,
              );
              // Filter out old tips with the same id
              if (idx !== -1) {
                draft.rows.splice(idx, 1);
              }
              // Add the latest tip
              draft.rows.push({
                announcement_id: message.announcement_id,
                message: message.message,
                url: message.url,
                i18n: message.i18n,
                type: message.type,
                updated_time: message.updated_time,
              });
            });
          });
          // @ts-ignore
          setStore((prev) => ({ ...prev, show: true }));
        }
      },
      onError(err) {
        if (err instanceof Error) {
          console.error("Error receiving announcement:", err.message);
        }
      },
    });
    return () => {
      unsubscribe?.();
    };
  }, [ws]);

  useEffect(() => {
    if (!announcements?.rows) {
      return;
    }
    const apiTime = announcements.last_updated_time ?? 0;
    const cachedTime = announcementStore.lastUpdateTime ?? 0;
    if (cachedTime < apiTime) {
      setTips((prev) => ({ ...prev, rows: announcements?.rows }));
      setStore({ show: true, lastUpdateTime: apiTime });
    } else {
      setTips((prev) => {
        return produce<API.Announcement>(prev, (draft) => {
          if (announcements?.rows?.length) {
            // If there are announcement rows available, create a Set to store IDs of existing tips
            const existingIds = new Set<string | number>(
              prev.rows?.map((tip) => tip.announcement_id),
            );
            // Find the maintenance tip in previous tips (if any)
            const maintenanceTip = prev.rows?.find(
              (tip) => tip.announcement_id === maintentanceId,
            );
            // Clear the draft’s rows array to refill it
            draft.rows = [];
            announcements.rows.forEach((item) => {
              if (!existingIds.has(item.announcement_id)) {
                // If the item’s ID is not in existingIds, push it into the draft
                draft.rows?.push(item);
              }
            });
            if (maintenanceTip) {
              // If a maintenance tip existed before, unshift it to the front
              draft.rows.unshift(maintenanceTip);
            }
          } else {
            // Find the index of the maintenance tip in draft rows
            const idx = draft.rows?.findIndex(
              (tip) => tip.announcement_id === maintentanceId,
            );
            if (idx !== undefined && idx !== -1) {
              // Remove the maintenance tip from draft rows
              draft.rows?.splice(idx, 1);
            }
          }
        });
      });
    }
  }, [announcements]);

  useEffect(() => {
    const startDate = startTime ? getTimeString(startTime) : "-";
    const endDate = endTime ? getTimeString(endTime) : "-";
    if (status === MaintenanceStatus.Maintenance) {
      setMaintenanceDialogInfo(getMaintentDialogContent(brokerName, endDate));
      return;
    }
    setMaintenanceDialogInfo(undefined);

    if (startTime) {
      if (startTime < getTimestamp() + oneDay) {
        setTips((prev) =>
          produce<API.Announcement>(prev, (draft) => {
            // Make sure draft.rows is an array
            if (!Array.isArray(draft.rows)) {
              draft.rows = [];
            }
            // Rebuild rows: insert the latest maintenance tip first, then put the old non-maintenance ones at the end
            draft.rows = [
              {
                announcement_id: maintentanceId,
                type: AnnouncementType.Maintenance,
                message: getMaintentTipsContent(brokerName, startDate, endDate),
              },
              ...draft.rows.filter(
                (tip) => tip.type !== AnnouncementType.Maintenance,
              ),
            ];
          }),
        );
      }
    } else {
      setTips((prev) => {
        return produce<API.Announcement>(prev, (draft) => {
          const index = draft.rows?.findIndex(
            (tip) => tip.announcement_id === maintentanceId,
          );
          if (index !== undefined && index !== -1) {
            draft.rows?.splice(index, 1);
          }
        });
      });
    }
  }, [startTime, endTime, status, brokerName, t]);

  return {
    tips: sortDataByUpdatedTime(tips),
    maintenanceDialogInfo: maintenanceDialogInfo,
  };
};

export type AnnouncementScriptReturn = ReturnType<typeof useAnnouncementScript>;

export const useAnnouncementScript = (options?: AnnouncementScriptOptions) => {
  const { showAnnouncement, setShowAnnouncement } = useAppContext();
  const { dataAdapter } = useOrderlyContext();

  const { tips, maintenanceDialogInfo } = useAnnouncementData();

  const memoizedTips = useMemo<API.AnnouncementRow[]>(() => {
    if (typeof dataAdapter?.announcementList === "function") {
      return dataAdapter.announcementList(
        tips?.rows ?? (EMPTY_LIST as API.AnnouncementRow[]),
      );
    }
    return tips?.rows ?? (EMPTY_LIST as API.AnnouncementRow[]);
  }, [dataAdapter?.announcementList, tips?.rows]);

  const [announcementStore, setStore] = useLocalStorage<AnnouncementStore>(
    ORDERLY_ANNOUNCEMENT_KEY,
    {},
  );

  const closeTips = () => {
    // @ts-ignore
    setStore((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    const len = memoizedTips.length;
    setShowAnnouncement(
      Boolean(len) && announcementStore.show && !options?.hideTips,
    );
  }, [
    memoizedTips,
    announcementStore.show,
    options?.hideTips,
    setShowAnnouncement,
  ]);

  return {
    maintenanceDialogInfo,
    tips: memoizedTips,
    closeTips: closeTips,
    showAnnouncement: showAnnouncement,
  };
};
