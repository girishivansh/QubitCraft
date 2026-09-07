import Logo from './Logo';


export function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <Logo size={48} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">QubitCraft</h1>
        <p className="mt-2 text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
