import {
  test as base,
  expect,
  request,
  APIRequestContext,
} from "@playwright/test";

type TestFixtures = {
  apiContext: APIRequestContext;
  totalElements: number;
};

const test = base.extend<TestFixtures>({
  apiContext: async ({}, use) => {
    const context = await request.newContext({
      baseURL: "https://jsonplaceholder.typicode.com",
    });
    await use(context);
    await context.dispose();
  },
});

const payLoad = {
  userId: 10,
  id: 101,
  title: "serdal",
  body: "I am trying to create new one",
};

export { test, expect, request, APIRequestContext, payLoad };
