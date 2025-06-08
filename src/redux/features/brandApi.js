import { API_URL } from "@/url_helper";
import { apiSlice } from "../api/apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    getActiveBrands: builder.query({
      query: () => `${API_URL}/bank/list`
    }),
  }),
});

export const {
 useGetActiveBrandsQuery
} = brandApi;
