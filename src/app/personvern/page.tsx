import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Scandinavian Living — how we collect, use and protect your data.",
};

export default function PersonvernPage() {
  return (
    <div className="container-content py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
          Legal
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-ink/60">Last updated: June 22, 2026</p>

        <div className="prose prose-neutral mt-8 max-w-none text-ink/80">
          <p>
            Scandinavian Living (&quot;we&quot;, &quot;us&quot;) respects your privacy. This
            policy explains what information we collect when you visit this
            website, how we use it, and the choices you have.
          </p>

          <h2 className="mt-8 font-serif text-xl font-semibold text-ink">
            Information we collect
          </h2>
          <p>
            We collect limited information automatically when you use the
            site, including pages visited, device and browser type, and
            referral source, via analytics tools such as Vercel Analytics.
            If you contact us through our contact form, we collect the name,
            email address and message you provide.
          </p>

          <h2 className="mt-8 font-serif text-xl font-semibold text-ink">
            Cookies
          </h2>
          <p>
            We use cookies to improve your experience, remember your
            preferences and show relevant content and advertising. You can
            accept or decline non-essential cookies via the cookie banner
            shown on your first visit, and you can clear cookies at any time
            through your browser settings.
          </p>

          <h2 className="mt-8 font-serif text-xl font-semibold text-ink">
            Third-party services
          </h2>
          <p>
            We use third-party services that may process data on our behalf
            or independently, including Vercel (hosting and analytics),
            Formspree (contact form submissions), and Pinterest (social
            sharing and, where applicable, content distribution). These
            services have their own privacy policies governing their use of
            your data.
          </p>

          <h2 className="mt-8 font-serif text-xl font-semibold text-ink">
            Affiliate links
          </h2>
          <p>
            Some links on this site are affiliate links. If you make a
            purchase through one of these links, we may earn a commission at
            no extra cost to you.
          </p>

          <h2 className="mt-8 font-serif text-xl font-semibold text-ink">
            Your rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data by contacting us. Depending on your location, you
            may have additional rights under applicable data protection law
            (such as the GDPR).
          </p>

          <h2 className="mt-8 font-serif text-xl font-semibold text-ink">
            Contact
          </h2>
          <p>
            If you have questions about this privacy policy, please reach out
            via our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
