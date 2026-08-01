import type { APIRequestContext } from "@playwright/test";
import { API_ENDPOINTS } from "../../constants";

export function getPost(request: APIRequestContext, id: number) {
  return request.get(`${API_ENDPOINTS.POSTS}/${id}`);
}
