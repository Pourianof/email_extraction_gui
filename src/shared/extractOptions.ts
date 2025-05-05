export interface ExtractOptions {
  extractSpeed: 'کم' | 'بهینه' | 'متوسط' | 'زیاد' | 'حداکثر';
  isOnlyEmail: boolean;
  isOnlyMainAuthor: boolean;
  authorsCount?: number;
  isGoogleScholar?: boolean;
  extractorType: 'chrowser' | 'puppet';
}
