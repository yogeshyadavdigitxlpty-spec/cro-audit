import { auditContent, AUDIT_TYPES } from '../data/auditConfig';

// The Full Site Audit is a real Contact Form 7 form living on the parent
// WordPress site, not a React form. Since this app itself is embedded in
// WordPress via a cross-origin iframe, we can't reach into the WP page's
// DOM to grab the actual CF7 markup - browsers block that regardless of
// any JS trick. Instead we embed a *second*, nested iframe here pointing
// at a bare WP page that contains only the `[contact-form-7]` shortcode.
// That page should use a blank/no-header-footer template so only the
// form itself renders.
//
// Set this to that WP page's URL. Using an env var (not hardcoded) so it
// can differ between environments without a code change.
const CF7_EMBED_URL = import.meta.env.VITE_CF7_FULL_AUDIT_URL;

export default function FullSiteAuditForm() {
  const content = auditContent[AUDIT_TYPES.full];

  return (
    <>
      <p className="panel__eyebrow">{content.eyebrow}</p>
      <h2 className="panel__heading">
        {content.heading.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < content.heading.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h2>
      <p className="panel__description">{content.description}</p>

      {CF7_EMBED_URL ? (
        <iframe
          src={CF7_EMBED_URL}
          title="Full Site Audit request form"
          className="cf7-embed-frame"
          loading="lazy"
        />
      ) : (
        <p className="field-error" role="alert">
          Full Site Audit form is not configured. Set VITE_CF7_FULL_AUDIT_URL in your environment
          variables to the WordPress page URL containing the Contact Form 7 shortcode.
        </p>
      )}

      <p className="pricing-line">
        {content.pricingLine.prefix}
        <strong>{content.pricingLine.amount}</strong>
        {content.pricingLine.suffix}
      </p>
    </>
  );
}

