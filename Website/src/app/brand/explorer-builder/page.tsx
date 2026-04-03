import Link from 'next/link';

export default function ExplorerBuilderPage() {
  return (
    <div className="min-h-screen bg-[#07081F] text-white font-[family-name:var(--font-inter)]">
      <header className="border-b border-white/8 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/brand/assets/Momentify-Icon.svg" alt="Momentify" className="h-8" />
          <div>
            <h1 className="text-lg font-medium">Explorer Builder</h1>
            <p className="text-sm text-white/50">Create branded interactive experiences</p>
          </div>
        </div>
        <Link
          href="/brand/explorer-builder/new"
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #00BBA5, #1A56DB)' }}
        >
          Create New Explorer
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-6">
          <Link
            href="/brand/explorer-builder/momentify-default"
            className="group border border-white/8 rounded-xl p-6 hover:border-[#00BBA5]/30 transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src="/brand/assets/Momentify-Icon.svg" alt="" className="h-6" />
              <span className="text-sm font-medium text-[#00BBA5]">Template</span>
            </div>
            <h3 className="font-medium mb-1">Momentify Explorer</h3>
            <p className="text-sm text-white/50 mb-4">Default Momentify-branded explorer with all features enabled.</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded-md bg-white/6 text-white/40">Tablet</span>
              <span className="text-xs px-2 py-1 rounded-md bg-white/6 text-white/40">Kiosk</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
