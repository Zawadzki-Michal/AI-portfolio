import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    // Identity-only — proves "this is really the site owner" for /admin.
    // The actual GitHub writes the admin panel makes go through a separate
    // server-side token (GITHUB_ADMIN_TOKEN, see lib/github-content.ts),
    // not this OAuth session, so no repo-scoped token ever reaches the
    // client.
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn({ account, profile }) {
      // The GitHub provider exists only to gate /admin to the site owner —
      // reject every other GitHub account outright rather than letting them
      // land on a session that just happens to have isAdmin: false.
      if (account?.provider === "github") {
        return profile?.login === process.env.ADMIN_GITHUB_LOGIN;
      }
      return true;
    },
    jwt({ token, account, profile }) {
      if (account?.provider === "linkedin" && profile?.sub) {
        token.id = profile.sub;
      }
      if (account?.provider === "github") {
        token.id = String(profile?.id ?? "");
        token.isAdmin = profile?.login === process.env.ADMIN_GITHUB_LOGIN;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      session.user.isAdmin = token.isAdmin === true;
      return session;
    },
  },
});
