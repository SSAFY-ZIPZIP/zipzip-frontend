import { api } from "./index";

export const propertiesApi = {
  getProperties: ({ sido, gugun, dong, page, signal }) => {
    // signal 파라미터 추가
    const searchParams = new URLSearchParams();

    searchParams.append("page", page || 0);
    searchParams.append("size", 1000);

    if (sido) searchParams.append("sido", sido);
    if (gugun) searchParams.append("gugun", gugun);
    if (dong) searchParams.append("dong", dong);

    return api.get(`/v1/properties/list?${searchParams.toString()}`, {
      signal,
    }); // signal 옵션 추가
  },
};
