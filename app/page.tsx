import Link from 'next/link';

const PawIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="6"/>
    <circle cx="20" cy="20" r="4"/>
    <circle cx="40" cy="20" r="4"/>
    <circle cx="14" cy="30" r="3.5"/>
    <circle cx="46" cy="30" r="3.5"/>
    <circle cx="20" cy="40" r="4"/>
    <circle cx="40" cy="40" r="4"/>
  </svg>
);

const BoneIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="10" ry="10"/>
    <ellipse cx="12" cy="28" rx="10" ry="10"/>
    <ellipse cx="88" cy="12" rx="10" ry="10"/>
    <ellipse cx="88" cy="28" rx="10" ry="10"/>
    <rect x="10" y="14" width="80" height="12" rx="6"/>
  </svg>
);

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating paw prints */}
      <div className="absolute top-20 left-10 text-peach/20 float-slow hidden md:block">
        <PawIcon className="w-16 h-16" />
      </div>
      <div className="absolute top-40 right-16 text-peach/15 float-medium hidden md:block">
        <PawIcon className="w-12 h-12" />
      </div>
      <div className="absolute bottom-40 left-20 text-peach/20 float-fast hidden md:block">
        <BoneIcon className="w-20 h-10" />
      </div>
      <div className="absolute top-60 right-8 text-peach/15 float-slow hidden lg:block">
        <PawIcon className="w-10 h-10" />
      </div>
      <div className="absolute bottom-20 right-40 text-peach/20 float-medium hidden lg:block">
        <BoneIcon className="w-16 h-8" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="font-heading text-2xl font-bold text-chocolate">Fureverbook</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-chocolate font-semibold hover:text-coral transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-8 pb-20 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-peach/30 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-semibold text-chocolate/80">🐶 For dog lovers everywhere</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-chocolate leading-tight mb-6">
              Every memory with your best friend,{' '}
              <span className="text-coral">forever</span>.
            </h1>
            <p className="text-lg text-warm-gray mb-8 max-w-lg mx-auto lg:mx-0">
              Create a beautiful memory journal for your dog. Upload photos, make gorgeous collages, 
              and watch your pup's story come alive in a magical timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                Start Your Journal
                <span>→</span>
              </Link>
              <Link href="/signup" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                See Examples
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-peach/30 to-pink/20 rounded-3xl blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&q=80"
              alt="Happy golden retriever"
              className="relative rounded-3xl shadow-warm-lg w-full object-cover"
              style={{ maxHeight: '500px' }}
            />
            {/* Floating memory card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-warm p-4 max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center text-xl">📸</div>
                <div>
                  <p className="font-heading font-semibold text-chocolate text-sm">Memory Added</p>
                  <p className="text-xs text-warm-gray">Just now</p>
                </div>
              </div>
              <p className="text-xs text-warm-gray font-handwritten text-lg">Best day at the park!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-chocolate mb-4">
            Everything you need to celebrate your pup
          </h2>
          <p className="text-warm-gray text-lg max-w-xl mx-auto">
            Simple tools that make preserving your dog's memories feel as joyful as the memories themselves.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '📸',
              title: 'Photo Timeline',
              desc: 'A beautiful living memory book that grows with every upload. Your dog\'s whole life, organized and beautiful.',
              color: 'from-peach/20 to-pink/20',
            },
            {
              icon: '🎨',
              title: 'AI Art Studio',
              desc: 'See your pup in watercolor, Pixar style, oil paintings, and more. Magical transformations in seconds.',
              color: 'from-mint/20 to-peach/20',
            },
            {
              icon: '🖼️',
              title: 'Collage Maker',
              desc: 'Create gorgeous photo collages mixing old and new. Choose from heart, grid, and paw print layouts.',
              color: 'from-pink/20 to-mint/20',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-card p-8 card-hover"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl font-semibold text-chocolate mb-3">{feature.title}</h3>
              <p className="text-warm-gray leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emotional section */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-peach/30 via-pink/20 to-coral/10 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-6 left-10 text-chocolate/10">
            <PawIcon className="w-20 h-20" />
          </div>
          <div className="absolute bottom-6 right-10 text-chocolate/10">
            <BoneIcon className="w-24 h-12" />
          </div>
          <div className="relative z-10">
            <p className="font-handwritten text-3xl md:text-4xl text-chocolate mb-4">
              "Dogs come into our lives to teach us about love, depart to teach us about loss. 
              Our memory journal ensures the love never leaves."
            </p>
            <p className="text-warm-gray">— Every dog parent, everywhere</p>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-chocolate mb-4">
            A few happy memories
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
            'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80',
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80',
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80',
            'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&q=80',
            'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400&q=80',
            'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&q=80',
            'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&q=80',
          ].map((src, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 || i === 5 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img src={src} alt={`Dog memory ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: i === 0 || i === 5 ? '300px' : '150px' }} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-chocolate mb-6">
          Start preserving the memories today
        </h2>
        <p className="text-warm-gray text-lg mb-8 max-w-lg mx-auto">
          Free to start. Your dog's story deserves to be told beautifully.
        </p>
        <Link href="/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
          Create Your Dog's Journal
          <span className="text-xl">🐾</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 max-w-6xl mx-auto border-t border-peach/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-heading font-semibold text-chocolate">Fureverbook</span>
          </div>
          <p className="text-warm-gray text-sm">
            Made with 💛 for dog lovers everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
