type AdSlotProps = {
  variant: "header" | "mid" | "sidebar" | "footer";
  label?: string;
};

const classNames: Record<AdSlotProps["variant"], string> = {
  header: "ad-zone-header",
  mid: "ad-zone-mid",
  sidebar: "ad-zone-sidebar",
  footer: "ad-zone-footer",
};

const defaultLabels: Record<AdSlotProps["variant"], string> = {
  header: "Ad space — header",
  mid: "Ad space — mid-article",
  sidebar: "Ad space — sidebar",
  footer: "Ad space — footer",
};

/**
 * Placeholder ad slot. Swap inner content with Google AdSense / affiliate
 * script tags when monetization is activated.
 */
export default function AdSlot({ variant, label }: AdSlotProps) {
  return (
    <div className={classNames[variant]} data-ad-zone={variant}>
      {label ?? defaultLabels[variant]}
    </div>
  );
}
