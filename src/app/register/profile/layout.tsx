// Layout for the multi-step registration form. Each step is its own route
// so that browser back/forward and progress (step indicator) work naturally.
export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
