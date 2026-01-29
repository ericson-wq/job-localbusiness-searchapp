// Local Business types for RapidAPI Local Business Data API

export interface LocalBusinessSearchParams {
  query: string;
  lat?: number;
  lng?: number;
  limit?: number;
  region?: string;
  language?: string;
  extract_emails_and_contacts?: boolean;
  fields?: string;
  subtypes?: string;
  business_status?: string;
  verified?: boolean;
  zoom?: string;
}

export interface BusinessPhoto {
  photo_id: string;
  photo_url: string;
  photo_url_large: string;
  video_thumbnail_url: string | null;
  latitude: number;
  longitude: number;
  type: string;
  photo_datetime_utc: string;
  photo_timestamp: number;
}

export interface WorkingHours {
  [day: string]: string[];
}

export interface ReviewsPerRating {
  [rating: string]: number;
}

export interface BusinessAbout {
  summary?: string;
  details?: {
    [key: string]: any;
  };
}

export interface EmailsAndContacts {
  emails?: string[];
  phones?: string[];
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  [key: string]: any;
}

export interface LocalBusiness {
  business_id: string;
  google_id: string;
  place_id: string;
  google_mid?: string;
  phone_number: string | null;
  name: string;
  latitude: number;
  longitude: number;
  full_address: string;
  address?: string;
  review_count: number;
  rating: number;
  timezone?: string;
  opening_status?: string;
  working_hours?: WorkingHours;
  website?: string;
  tld?: string;
  verified: boolean;
  place_link: string;
  cid?: string;
  reviews_link?: string;
  owner_id?: string;
  owner_link?: string;
  owner_name?: string;
  booking_link?: string | null;
  reservations_link?: string | null;
  business_status: string;
  type: string;
  subtypes: string[];
  subtype_gcids?: string[];
  photos_sample?: BusinessPhoto[];
  reviews_per_rating?: ReviewsPerRating;
  photo_count?: number;
  about?: BusinessAbout;
  order_link?: string | null;
  price_level?: string | null;
  district?: string;
  street_address?: string;
  city?: string;
  zipcode?: string;
  state?: string;
  country?: string;
  hotel_price_for_dates?: string;
  share_link?: string;
  emails_and_contacts?: EmailsAndContacts;
  [key: string]: any;
}

export interface LocalBusinessSearchResponse {
  status: string;
  request_id?: string;
  parameters?: {
    query: string;
    language?: string;
    region?: string;
    lat?: number;
    lng?: number;
    zoom?: string;
    limit?: number;
    offset?: number;
    extract_emails_and_contacts?: boolean;
  };
  data: LocalBusiness[];
}

export interface LocalBusinessDisplay {
  business_id: string;
  name: string;
  address: string;
  full_address: string;
  phone_number: string | null;
  rating: number;
  review_count: number;
  type: string;
  subtypes: string[];
  business_status: string;
  website?: string;
  latitude: number;
  longitude: number;
  opening_status?: string;
  working_hours?: WorkingHours;
  verified: boolean;
  place_link: string;
  reviews_link?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  price_level?: string | null;
  photo_count?: number;
  photos_sample?: BusinessPhoto[];
  about?: BusinessAbout;
  emails_and_contacts?: EmailsAndContacts;
  [key: string]: any;
}

/**
 * Converts API response business to display format
 */
export function businessToDisplay(business: LocalBusiness): LocalBusinessDisplay {
  return {
    business_id: business.business_id,
    name: business.name,
    address: business.address || business.street_address || '',
    full_address: business.full_address,
    phone_number: business.phone_number,
    rating: business.rating,
    review_count: business.review_count,
    type: business.type,
    subtypes: business.subtypes || [],
    business_status: business.business_status,
    website: business.website,
    latitude: business.latitude,
    longitude: business.longitude,
    opening_status: business.opening_status,
    working_hours: business.working_hours,
    verified: business.verified,
    place_link: business.place_link,
    reviews_link: business.reviews_link,
    district: business.district,
    city: business.city,
    state: business.state,
    country: business.country,
    zipcode: business.zipcode,
    price_level: business.price_level,
    photo_count: business.photo_count,
    photos_sample: business.photos_sample,
    about: business.about,
    emails_and_contacts: business.emails_and_contacts,
  };
}
