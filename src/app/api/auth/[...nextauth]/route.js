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
      },
      async authorize(credentials) {
        const user = await authorizeUser(credentials, "owner");
        if (user) return user;
        return authorizeUser(credentials, "admin");
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      return true;
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
    signIn: (context) => {
      if (context.providerId === "sitter-login") {
        return "/login/sitter";
      }
      return "/login"; // Default login page for user and admin
    },
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
};

async function authorizeUser(credentials, role) {
  console.log(`Authorizing ${role} with credentials:`, credentials);

  try {
    const user = await connectionPool.query(
      `SELECT * FROM users WHERE email = $1 AND role = $2`,
      [credentials.email, role]
    );

    console.log("Query result:", user);

    if (user.rows.length === 0) {
      console.log("No user found");
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.rows[0].password
    );

    console.log("Password validation result:", isValidPassword);

    if (!isValidPassword) {
      console.log("Invalid password");
      return null;
    }

    console.log("Authentication successful");
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
