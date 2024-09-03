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
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        const user = await authorizeUser(credentials, "sitter");
        if (user) {
          user.rememberMe = credentials.rememberMe;
        }
        return user;
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
    async signIn({ user }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rememberMe = user.rememberMe; // Store rememberMe in token
      }

      // Update maxAge if rememberMe is true
      if (token.rememberMe) {
        token.maxAge = 7 * 24 * 60 * 60; // 7 days
      } else {
        token.maxAge = 30 * 60; // 30 minutes
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.maxAge = token.maxAge; // Use maxAge from token
        session.expires = new Date(
          Date.now() + session.maxAge * 1000
        ).toISOString(); // Set expiration dynamically
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
    maxAge: 2 * 60 * 60, // Default to 2hrs
    updateAge: 60 * 60, // Optional: specify interval (in seconds) for rolling sessions
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
      rememberMe: credentials.rememberMe, // Ensure rememberMe is returned
    };
  } catch (error) {
    console.error(`Error in authorize function for ${role}:`, error);
    return null;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
