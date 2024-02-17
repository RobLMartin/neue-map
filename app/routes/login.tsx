import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import Logo from "~/components/logo";
import Illustration from "~/assets/Illustration";
import authenticator from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Tennt" },
    { name: "description", content: "Tennt real estate app" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });

  return 200;
};

export async function action({ context, request }: ActionFunctionArgs) {
  console.log("hey");
  return await authenticator.authenticate("form", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    context,
  });
}

export default function Login() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen">
      <div className="hidden md:grid place-content-center md:w-3/5 h-full relative">
        <div className="absolute top-0 left-0 bottom-0 p-4">
          <Logo height={30} width={30} />
        </div>

        <div className="h-screen w-full grid place-content-center">
          <div className="w-[500px] dark:opacity-80">
            <Illustration />
          </div>
        </div>
      </div>
      <div className="px-4 md:w-2/5 w-full h-full flex justify-center items-center bg-neutral-50 dark:bg-neutral-950 shadow-sm">
        <div className="max-w-lg w-full">
          <h1 className="text-4xl font-medium  mb-4">Welcome back</h1>
          <Form method="post" className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-2 font-semibold">
                Email
              </label>
              <input
                id="email"
                className="border rounded w-full py-3 px-3 text-neutral-700 dark:text-neutral-200 leading-tight bg-transparent"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 font-semibold">
                Password
              </label>
              <input
                id="password"
                className="border rounded w-full py-3 px-3 text-neutral-700 dark:text-neutral-200 leading-tight bg-transparent"
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                maxLength={20}
              />
            </div>

            <button className="rounded bg-neutral-950 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-300 text-white dark:text-neutral-950 font-bold py-2 px-4 focus:outline-none focus:shadow-outline mt-4">
              Sign In
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
