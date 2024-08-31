// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import connectionPool from "@/lib/db";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "sitter-login",
//       name: "Sitter",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         console.log("Authorizing with credentials:", credentials);

//         try {
//           const user = await connectionPool.query(
//             `SELECT * FROM users WHERE email = $1 AND role = $2`,
//             [credentials.email, "sitter"]
//           );

//           console.log("User query result:", user.rows);

//           if (user.rows.length === 0) {
//             console.log("No user found");
//             return null;
//           }

//           const isValidPassword = await bcrypt.compare(
//             credentials.password,
//             user.rows[0].password
//           );
//           console.log("Password validation result:", isValidPassword);

//           if (!isValidPassword) {
//             console.log("Invalid password");
//             return null;
//           }

//           console.log("Authentication successful");
//           return {
//             id: user.rows[0].id,
//             name: user.rows[0].name,
//             email: user.rows[0].email,
//             role: user.rows[0].role,
//           };
//         } catch (error) {
//           console.error("Error in authorize function:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       console.log("Sign in callback:", {
//         user,
//         account,
//         profile,
//         email,
//         credentials,
//       });
//       return true;
//     },
//     jwt: async ({ token, user }) => {
//       console.log("JWT callback:", { token, user });
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       console.log("Session callback:", { session, token });
//       if (token) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/loginsitter",
//     signIn: "/login",
//     error: "/auth/error",
//   },
//   debug: process.env.NODE_ENV === "development",
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 60 * 60,
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import connectionPool from "@/lib/db";

// export const authOptions = {
//   providers: [
//     // Sitter login
//     CredentialsProvider({
//       id: "sitter-login",
//       name: "Sitter",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const user = await connectionPool.query(
//             `SELECT * FROM users WHERE email = $1 AND role = $2`,
//             [credentials.email, "sitter"]
//           );

//           if (user.rows.length === 0) {
//             return null;
//           }

//           const isValidPassword = await bcrypt.compare(
//             credentials.password,
//             user.rows[0].password
//           );

//           if (!isValidPassword) {
//             return null;
//           }

//           return {
//             id: user.rows[0].id,
//             name: user.rows[0].name,
//             email: user.rows[0].email,
//             role: user.rows[0].role,
//           };
//         } catch (error) {
//           console.error("Error in sitter authorize function:", error);
//           return null;
//         }
//       },
//     }),

//     // Owner/Admin login
//     CredentialsProvider({
//       id: "owner-login",
//       name: "Owner/Admin",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const user = await connectionPool.query(
//             `SELECT * FROM users WHERE email = $1 AND (role = $2 OR role = $3)`,
//             [credentials.email, "owner", "admin"]
//           );

//           if (user.rows.length === 0) {
//             return null;
//           }

//           const isValidPassword = await bcrypt.compare(
//             credentials.password,
//             user.rows[0].password
//           );

//           if (!isValidPassword) {
//             return null;
//           }

//           return {
//             id: user.rows[0].id,
//             name: user.rows[0].name,
//             email: user.rows[0].email,
//             role: user.rows[0].role,
//           };
//         } catch (error) {
//           console.error("Error in owner/admin authorize function:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       if (user.role === "sitter") {
//         // รีไดเรกต์ไปยังหน้าแดชบอร์ดสำหรับ sitter
//         return "/sitter";
//       } else if (user.role === "owner") {
//         // รีไดเรกต์ไปยังหน้าแดชบอร์ดสำหรับ owner
//         return "/";
//       } else if (user.role === "admin") {
//         // รีไดเรกต์ไปยังหน้าแดชบอร์ดสำหรับ admin
//         return "/admin";
//       }
//       // รีไดเรกต์ไปยังหน้าเข้าสู่ระบบหากไม่ตรงกับเงื่อนไข
//       return "/login";
//     },
//     jwt: async ({ token, user }) => {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       if (token) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//     signIn: "/loginsitter", // Redirect to the login page
//     error: "/auth/error", // Redirect to an error page if any error occurs
//   },
//   debug: process.env.NODE_ENV === "development",
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 60 * 60, // 2 hours
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
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
