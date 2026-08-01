import { expect, test } from "@playwright/test";
import { getPost } from "../requests/posts.api";
import { postSchema } from "../schemas/post.schema";

test.describe("API: GET /posts/:id", () => {
  test("returns a post matching the response contract", async ({ request }) => {
    const response = await getPost(request, 1);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const result = postSchema.safeParse(await response.json());

    expect(result.error?.issues ?? []).toEqual([]);
    expect(result.data?.id).toBe(1);
  });
});
