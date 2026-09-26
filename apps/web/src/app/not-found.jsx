import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <EmptyState
      icon={<SearchX size={36} strokeWidth={1.3} />}
      eyebrow="Page not found"
      title="This page has moved on."
      description="The address may be incorrect, or the page may no longer exist."
      actionHref="/products"
      actionLabel="View products"
    />
  );
}
