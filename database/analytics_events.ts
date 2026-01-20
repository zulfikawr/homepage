import pb from '@/lib/pocketbase';
import { AnalyticsEvent } from '@/types/analytics';

export async function getAnalyticsEvents(
  callback: (events: AnalyticsEvent[]) => void,
): Promise<() => void> {
  const fetchEvents = async () => {
    try {
      // Fetch events for analysis
      const records = await pb.collection('analytics_events').getFullList({
        sort: '-created',
      });
      console.log('Analytics events fetched:', records.length);
      callback(records as unknown as AnalyticsEvent[]);
    } catch (err) {
      console.error('Analytics fetch error:', err.message);
      callback([]);
    }
  };

  fetchEvents();

  pb.collection('analytics_events').subscribe('*', fetchEvents);

  return () => pb.collection('analytics_events').unsubscribe();
}
