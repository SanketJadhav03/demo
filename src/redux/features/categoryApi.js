import { API_URL } from "@/url_helper";
import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "https://shofy-backend-dlt.vercel.app/api/category/add",
        method: "POST",
        body: data,
      }),
    }),
    getShowCategory: builder.query({
      query: () => `${API_URL}/category/list`
    }),
    getProductTypeCategory: builder.query({
      query: (type) => `${API_URL}/category/list`
    }),
  }),
});

export const {
 useAddCategoryMutation,
 useGetProductTypeCategoryQuery,
 useGetShowCategoryQuery,
} = categoryApi;
