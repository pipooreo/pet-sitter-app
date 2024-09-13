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
        const rememberMe = credentials.rememberMe === "true" ? true : false;
        console.log("credentailllllllllllll", credentials);
        let user = await authorizeUser(credentials, "owner");
        if (user) {
          user.rememberMe = credentials.rememberMe;
          console.log("user with rememberMe:", user);
          return user;
        }
        user = await authorizeUser(credentials, "admin");
        if (user) {
          user.rememberMe = rememberMe; // Set rememberMe for admin as well
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("user &&&&&&&&&&", user);
        token.id = user.id;
        token.role = user.role;
        token.rememberMe = user.rememberMe;
        console.log("rememememmemememeber", token);
        const now = Math.floor(Date.now() / 1000);
        console.log("toekm --------------", token);
        if (user.role === "sitter") {
          token.expires = now + 30 * 24 * 60 * 60; // 1 month for sitters
        } else {
          token.expires =
            now +
            (token.rememberMe === true ? 7 * 24 * 60 * 60 : 1 * 24 * 60 * 60); // 7 days or 1 days for admin/owner
        }
      }

      const now = Math.floor(Date.now() / 1000);
      if (token.expires < now) {
        return null;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const now = Math.floor(Date.now() / 1000);
        if (now > token.expires) {
          return null;
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
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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
    };
  } catch (error) {
    console.error(`Error in authorize function for ${role}:`, error);
    return null;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
