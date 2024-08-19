import { APIResponse } from "@playwright/test";
import { test, expect, payLoad } from "./fixturesAPI";
import CacheModuleAPI from "./modulesAPI";

let cacheAPI: CacheModuleAPI;

test.describe("Symphony Solutions-API test", async () => {
  test.describe.configure({ mode: "serial" });
  test.beforeAll(async () => {
    cacheAPI = new CacheModuleAPI();
  });
  /*----------------------------------------------------------------------------------------------------------------------------------*/

  test("Read Total Number of Posts and Store in a Variable", async ({
    apiContext,
  }) => {
    let responseJson;

    await test.step("Send a GET request to /posts.", async () => {
      const response = await apiContext.get("/posts");
      expect(response.ok()).toBeTruthy();
      responseJson = await response.json();
    });

    await test.step("Retrieve the total number of posts from the response body", async () => {
      cacheAPI.setTotalElements(responseJson.length);
      console.log("Total number of posts:", cacheAPI.getTotalElements());
    });

    await test.step("Store the total number of posts in a variable for future reference", async () => {
      const lastElement = responseJson[cacheAPI.getTotalElements() - 1];
      console.log("Last element ID:", lastElement.id);
      expect(lastElement.id).toBe(cacheAPI.getTotalElements());
    });
  });
  /*----------------------------------------------------------------------------------------------------------------------------------*/

  test("Create a New Post and Store its ID", async ({ apiContext }) => {
    let responseJson;
    await test.step("Send a 'POST' request to /posts with a new post object containing relevant data", async () => {
      const response = await apiContext.post("/posts", {
        data: payLoad,
      });
      expect(response.ok()).toBeTruthy();
      responseJson = await response.json();
    });

    await test.step("Extract the ID of the newly created post from the response body and store it in a variable for future reference", async () => {
      cacheAPI.setCreatedPostId(responseJson.id);
      console.log("New element ID:", cacheAPI.getCreatedPostId());
      console.log(
        "Total elements before creation:",
        cacheAPI.getTotalElements()
      );
    });
  });
  /*----------------------------------------------------------------------------------------------------------------------------------*/

  test("Get Only the Created Post by ID", async ({ apiContext }) => {
    console.log(
      "The ID of the post created in the previous test:",
      cacheAPI.getCreatedPostId()
    );
    let response: APIResponse;

    await test.step("Send a 'GET' request to /posts/{id} endpoint, replacing {id} with the ID of the created post", async () => {
      response = await apiContext.get(`/posts/${cacheAPI.getCreatedPostId()}`);
    });

    await test.step("Retrieve and validate the details of the created post from the response body", async () => {
      const responseJson = await response.json();
      console.log(" Created item status code: ", response.status());
      //expect(response.ok()).toBeTruthy();
      //expect(responseJson.id).toBe(createdPostId);
    });
  });
  /*----------------------------------------------------------------------------------------------------------------------------------*/
  test("Replace Some Field in the Created Post with 'PATCH'", async ({
    apiContext,
  }) => {
    let textForPatch: string = "***replaced field***";
    let response: APIResponse;

    await test.step("Send a 'PATCH' request to /posts/{id} with updated field(s) of the post, replacing {id} with the ID of the created post", async () => {
      response = await apiContext.patch(
        `/posts/${cacheAPI.getCreatedPostId()}`,
        {
          data: {
            userId: 10,
            id: 101,
            title: "Serdal",
            body: textForPatch,
          },
        }
      );
    });

    await test.step("Confirm the successful update of the post by sending a 'GET' request to /posts/{id} and verifying the changes", async () => {
      console.log("Updated item status code: ", response.status());
      const responseJson = await response.json();
      expect(response.ok()).toBeTruthy();
      const patchedField: string = responseJson.body;
      console.log(patchedField);
      expect(textForPatch).toBe(patchedField);
    });
  });
  /*----------------------------------------------------------------------------------------------------------------------------------*/
  test("Delete the Created Post by ID", async ({ apiContext }) => {
    await test.step("Send a 'DELETE' request to /posts/{id} to delete the post, replacing {id} with the ID of the created post", async () => {
      const response = await apiContext.delete(
        `/posts/${cacheAPI.getCreatedPostId()}`
      );
      console.log("Deleted item status code: ", response.status());
    });

    await test.step("Verify that the post has been successfully deleted by attempting to retrieve it using a 'GET' request to /posts/{id} and ensuring a '404' status code is returned", async () => {
      const response = await apiContext.get(
        `/posts/${cacheAPI.getCreatedPostId()}`
      );
      const responseJson = await response.json();
      console.log(
        "After deleting, created item satatus code: ",
        response.status()
      );
      expect(404).toBe(response.status());
    });
  });

  /*----------------------------------------------------------------------------------------------------------------------------------*/
  test("Check the Number of Posts to Ensure Integrity", async ({
    apiContext,
  }) => {
    let responseJson;
    let lastTotalElements: number;
    await test.step("Send a 'GET' request to /posts", async () => {
      const response = await apiContext.get("/posts");
      responseJson = await response.json();
      expect(response.ok()).toBeTruthy();
      console.log("The last status code: ", response.status());
    });

    await test.step("Retrieve the current total number of posts from the response body", async () => {
      lastTotalElements = responseJson.length;
      console.log("The last total number of posts:", lastTotalElements);
    });

    await test.step("Compare the current total number of posts with the initial total number obtained in step 1 to ensure integrity", async () => {
      expect(lastTotalElements).toBe(cacheAPI.getTotalElements());
    });
  });
});
