export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-violet-600">
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-white/60">&copy; {year} TaskFlow v1.0.0</p>
      </div>
    </footer>
  );
}
