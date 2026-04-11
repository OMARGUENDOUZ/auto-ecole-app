export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Page introuvable</h1>
        <p className="text-muted-foreground">
          La page demandee n&apos;existe pas ou n&apos;est plus disponible.
        </p>
      </div>
    </div>
  );
}
