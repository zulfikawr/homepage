export interface AnalyticsEvent {
  id: string;
  path: string;
  country: string;
  referrer: string;
  user_agent: string;
  is_bot: boolean;
  created: string;
}
