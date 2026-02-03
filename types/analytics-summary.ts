export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  topRoutes: { path: string; views: number }[];
  countries: { code: string; name: string; count: number }[];
  devices: {
    type: string;
    count: number;
    icon: 'desktop' | 'deviceMobile';
    percentage: number;
  }[];
  referrers: { name: string; count: number }[];
}
