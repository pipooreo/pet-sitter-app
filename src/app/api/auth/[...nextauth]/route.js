import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectionPool from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "sitter-login",
      name: "Sitter",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return authorizeUser(credentials, "sitter");
      },
    }),
    CredentialsProvider({
      id: "owner-admin-login",
      name: "Owner or Admin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        console.log("credentailllllllllllll", credentials);
        let user = await authorizeUser(credentials, "owner");
        if (user) {
          user.rememberMe = credentials.rememberMe;
          console.log("kuyyyyyyyyyyy", user);
          return user;
        }
        return authorizeUser(credentials, "admin");
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user; // Sign in only if the user exists
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("user &&&&&&&&&&", user);
        token.id = user.id;
        token.role = user.role;
        token.rememberMe = user.rememberMe;

        const now = Math.floor(Date.now() / 1000);
        console.log("toekm --------------", token);
        if (user.role === "sitter") {
          token.expires = now + 30 * 24 * 60 * 60; // 1 month for sitters
        } else {
          token.expires =
            now + (token.rememberMe === "true" ? 30 : 1 * 24 * 60 * 620); // 1 day or 20 seconds for admin/owner
        }
      }

      // Remove the token after it expires
      const now = Math.floor(Date.now() / 1000);
      if (token.expires < now) {
        return null; // Expired token
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        if (now > token.expires) {
          return null; // Session should be considered invalid
        }

        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
        session.expires = new Date(token.expires * 1000).toISOString();
      }
      console.log("session JA=============", session);
      return session;
    },
  },
  pages: {
    // signIn: (context) => {
    //   if (context.providerId === "sitter-login") {
    //     console.log("context**************", context);
    //     // return "/login/sitter";
    //   }
    //   // return "/login"; // Default login page for user and admin
    // },
    // error: "/auth/error",
  },
  // debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // Default maxAge set to 30 minutes
    // updateAge: 60 * 60, // Optional: specify interval (in seconds) for rolling sessions
  },
};

async function authorizeUser(credentials, role) {
  console.log(`Authorizing ${role} with credentials:`, credentials);

  try {
    const user = await connectionPool.query(
      `SELECT * FROM users WHERE email = $1 AND role = $2`,
      [credentials.email, role]
    );

    if (user.rows.length === 0) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.rows[0].password
    );

    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      role: user.rows[0].role,
      // No need to return rememberMe for sitter
    };
  } catch (error) {
    console.error(`Error in authorize function for ${role}:`, error);
    return null;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
