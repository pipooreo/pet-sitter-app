import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectionPool from "@/lib/db";

export const authOptions = {
  providers: [
    // Sitter login
    CredentialsProvider({
      id: "sitter-login",
      name: "Sitter",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await connectionPool.query(
            `SELECT * FROM users WHERE email = $1 AND role = $2`,
            [credentials.email, "sitter"]
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
          console.error("Error in sitter authorize function:", error);
          return null;
        }
      },
    }),

    // Owner/Admin login
    CredentialsProvider({
      id: "owner-login",
      name: "Owner/Admin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await connectionPool.query(
            `SELECT * FROM users WHERE email = $1 AND (role = $2 OR role = $3)`,
            [credentials.email, "owner", "admin"]
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
          console.error("Error in owner/admin authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.role === "sitter") {
        return true; // Allow sign in, redirect will be handled by pages config
      } else if (user.role === "owner") {
        return true;
      } else if (user.role === "admin") {
        return true;
      }
      // If none of the roles match, prevent sign in
      return false;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // This should be the path to your main login page
    error: "/auth/error", // Redirect to an error page if any error occurs
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
