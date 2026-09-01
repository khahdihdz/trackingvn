export default function ErrorState({
  icon,
  title,
  description,
  officialUrl,
}: {
  icon: string;
  title: string;
  description: string;
  officialUrl?: string;
}) {
  return (
    <div className="card space-y-3 text-center" role="alert">
      <p className="text-3xl">{icon}</p>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {officialUrl && (
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-2 inline-flex"
        >
          Tra cứu trên website chính thức
        </a>
      )}
    </div>
  );
}
