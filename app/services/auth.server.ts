import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import bcrypt from "bcrypt";
import { db } from "./db.server";
const authenticator = new Authenticator(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server
    let email = form.get("email"); // or email... etc
    let password = form.get("password");
    // You can validate the inputs however you want
    invariant(typeof email === "string", "email must be a string");
    invariant(email.length > 0, "email must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    // And finally, you can find, or create, the user
    try {
      let user = await findUser(email, password);
      return user;
    } catch (err) {
      return false; // throw the caught error
    }
  })
);

export default authenticator;

async function findUser(email: string, password: string) {
  // Find the user by email
  const user = await db.user.findUnique({ where: { email } });
  // If the user does not exist, throw an error instead of redirecting
  if (!user) {
    throw new Error("Invalid credentials.");
  }

  // Find the password associated with the user
  const storedPassword = await db.password.findFirst({
    where: {
      userId: user.id,
    },
  });

  // If the password does not exist in the database, throw an error
  if (!storedPassword) {
    throw new Error("Invalid credentials.");
  }

  // If the hashed password does not match the one in the database, throw an error
  const isMatch = await bcrypt.compare(password, storedPassword.hash);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  // If everything checks out, return the user
  return user;
}
