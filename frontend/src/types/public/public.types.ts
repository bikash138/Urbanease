import { ApiResponse } from "@/lib/api-client";

// Categories

export type PublicCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string;
};

export type PublicCategoryDetail = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string;
  services: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    basePrice: number;
    image: string;
  }[];
};

// Services

export type PublicService = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  basePrice: number;
  image: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
};

export type PublicServiceDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  basePrice: number;
  image: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  providers: {
    id: string;
    customPrice: number | null;
    provider: {
      id: string;
      slug: string;
      bio: string | null;
      experience: number | null;
      profileImage: string | null;
      user: {
        name: string;
        phone: string | null;
      };
    };
  }[];
};

// Providers

export type PublicProvider = {
  id: string;
  slug: string;
  bio: string | null;
  experience: number | null;
  profileImage: string | null;
  user: {
    name: string;
    phone: string | null;
  };
  servicesOffered: {
    id: string;
    customPrice: number | null;
    service: {
      id: string;
      slug: string;
      title: string;
      basePrice: number;
      image: string;
    };
  }[];
};

export type PublicProviderDetail = {
  id: string;
  slug: string;
  bio: string | null;
  experience: number | null;
  profileImage: string | null;
  user: {
    name: string;
    phone: string | null;
  };
  servicesOffered: {
    id: string;
    customPrice: number | null;
    service: {
      id: string;
      slug: string;
      title: string;
      basePrice: number;
      image: string;
    };
  }[];
  reviewsGained: {
    id: string;
    rating: number;
    comment: string | null;
    customer: {
      name: string;
    };
    createdAt: string;
  }[];
};

// Reviews

export type PublicReview = {
  id: string;
  rating: number;
  comment: string | null;
  status: "VISIBLE" | "FLAGGED";
  customer: {
    name: string;
  };
  provider: {
    id: string;
    user: {
      name: string;
    };
  };
  booking: {
    date: string;
    providerService: {
      service: {
        id: string;
        title: string;
      };
    };
  };
  createdAt: string;
};

// Slots

export type SlotLabel = "MORNING" | "AFTERNOON" | "NIGHT";

export type PublicSlot = {
  id: string;
  label: SlotLabel;
  startTime: string;
  endTime: string;
  isActive: boolean;
  serviceId: string;
};

// API Response Types

export type PublicCategoriesResponse = ApiResponse<PublicCategory[]>;
export type PublicCategoryDetailResponse =
  ApiResponse<PublicCategoryDetail | null>;

export type PublicServicesResponse = ApiResponse<PublicService[]>;
export type PublicServiceDetailResponse =
  ApiResponse<PublicServiceDetail | null>;

export type PublicProvidersResponse = ApiResponse<PublicProvider[]>;
export type PublicProviderDetailResponse =
  ApiResponse<PublicProviderDetail | null>;

export type PublicReviewsResponse = ApiResponse<PublicReview[]>;

export type PublicProviderSlotsResponse = ApiResponse<PublicSlot[]>;

export type PublicSearchResult = {
  id: string;
  customPrice: number | null;
  service: {
    id: string;
    slug: string;
    title: string;
    basePrice: number;
    image: string;
  };
  provider: {
    slug: string;
    profileImage: string | null;
    user: { name: string };
  };
};

export type PublicSearchResponse = ApiResponse<PublicSearchResult[]>;
