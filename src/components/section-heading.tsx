export function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className="h-1.5 w-16 rounded-full bg-linear-to-r from-brand-purple to-brand-cyan"
      />
      <h2
        id={id}
        className="mt-6 w-fit text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl"
      >
        {children}
      </h2>
    </>
  );
}
