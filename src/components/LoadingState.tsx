function SkeletonRow({ delay }: { delay: number }) {
  return (
    <div
      className="flex items-center px-4 py-3 border-b border-slate-800 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 w-55">
        <div className="w-8 h-8 rounded-full bg-slate-700" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 bg-slate-700 rounded" />
          <div className="h-2.5 w-16 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="w-62.5 px-2"><div className="h-3.5 w-40 bg-slate-700 rounded" /></div>
      <div className="w-37.5 px-2"><div className="h-5 w-20 bg-slate-700 rounded-full" /></div>
      <div className="w-17.5 flex justify-center"><div className="h-3.5 w-8 bg-slate-700 rounded" /></div>
      <div className="w-30 px-2"><div className="h-3.5 w-16 bg-slate-700 rounded" /></div>
      <div className="w-32.5 px-2"><div className="h-1.5 w-full bg-slate-700 rounded-full" /></div>
      <div className="w-22.5 flex justify-center"><div className="h-5 w-14 bg-slate-700 rounded-full" /></div>
      <div className="flex-1 px-2"><div className="h-3.5 w-20 bg-slate-700 rounded" /></div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="w-full max-w-400 mx-auto px-6">
      <div className="mb-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-slate-800" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-800 rounded" />
            <div className="h-3.5 w-72 bg-slate-800/50 rounded" />
          </div>
        </div>
        <div className="h-10 w-full bg-slate-800 rounded-lg mb-3" />
        <div className="flex gap-3">
          <div className="h-9 w-36 bg-slate-800 rounded-lg" />
          <div className="h-9 w-28 bg-slate-800 rounded-lg" />
          <div className="h-9 w-24 bg-slate-800 rounded-lg" />
        </div>
      </div>

      <div className="border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center px-4 py-3 bg-slate-800/80 border-b border-slate-700">
          {['w-[220px]', 'w-[250px]', 'w-[150px]', 'w-[70px]', 'w-[120px]', 'w-[130px]', 'w-[90px]', 'flex-1'].map((w, i) => (
            <div key={i} className={`${w} px-2`}>
              <div className="h-3 w-12 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
        {Array.from({ length: 12 }, (_, i) => (
          <SkeletonRow key={i} delay={i * 50} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-6 gap-3">
        <div className="relative">
          <div className="w-5 h-5 border-2 border-slate-700 rounded-full" />
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <p className="text-sm text-slate-500">Loading users...</p>
      </div>
    </div>
  );
}
