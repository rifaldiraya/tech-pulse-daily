import { Breadcrumbs, type Breadcrumb } from "@/components/Breadcrumbs";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: Breadcrumb[];
  meta?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  meta,
}: PageHeaderProps) {
  return (
    <header className="border-b border-hairline bg-subtle">
      <div className="container-page py-9 sm:py-12">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className="mt-5 max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
          {meta ? (
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted">
              {meta}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
