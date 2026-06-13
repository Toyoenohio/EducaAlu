export function Skeleton({ className = '', variant = 'text' }) {
  const base = 'animate-pulse bg-surface-container-high rounded'

  const variants = {
    text: `${base} h-4 ${className}`,
    title: `${base} h-6 w-3/4 ${className}`,
    circle: `${base} rounded-full ${className}`,
    card: `${base} rounded-2xl ${className}`,
    'stat-card': `${base} rounded-2xl h-32 ${className}`,
    'table-row': `${base} h-12 ${className}`,
  }

  return <div className={variants[variant] || variants.text} />
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} variant="stat-card" />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-2/3" />
          <Skeleton variant="text" className="w-1/3 h-3" />
        </div>
      </div>
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-2">
      <Skeleton variant="table-row" className="opacity-50" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="table-row" className="opacity-30" />
      ))}
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="card overflow-hidden">
      <Skeleton variant="card" className="h-32 !rounded-none" />
      <div className="flex flex-col items-center -mt-12 px-6 pb-6">
        <Skeleton variant="circle" className="w-24 h-24 border-4 border-surface-container-lowest" />
        <Skeleton variant="title" className="mt-4 w-40 mx-auto" />
        <Skeleton variant="text" className="mt-2 w-20 h-5 mx-auto" />
        <div className="w-full mt-6 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low">
              <Skeleton variant="circle" className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton variant="text" className="w-16 h-3" />
                <Skeleton variant="text" className="w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
