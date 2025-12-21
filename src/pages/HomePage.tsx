import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const featuredProduct = {
  id: 'featured-1',
  name: 'Apocalypse DB-SA252D2',
  price: 12952,
  oldPrice: 16190,
  discount: 20,
  image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/2e9b8eee-5010-4686-ab90-248b58173451.jpg',
};

const popularProducts = [
  {
    id: 'prod-1',
    name: 'Gamma 625C',
    price: 9002,
    oldPrice: 10590,
    discount: 15,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/5775337f-7789-48f4-acdf-91d66b106d15.jpg',
  },
  {
    id: 'prod-2',
    name: 'Alpine Type-R R-W12D4',
    price: 18500,
    oldPrice: 22000,
    discount: 16,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/2e9b8eee-5010-4686-ab90-248b58173451.jpg',
  },
  {
    id: 'prod-3',
    name: 'Pioneer TS-A1370F',
    price: 4990,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/eaadeda8-d024-4f2d-9d73-9a92d6224b64.jpg',
  },
];

const categories = [
  { name: 'Сабвуферы', icon: 'Speaker', count: 127 },
  { name: 'Динамики', icon: 'Volume2', count: 245 },
  { name: 'Усилители', icon: 'Cpu', count: 89 },
  { name: 'Магнитолы', icon: 'Radio', count: 156 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.3),transparent_50%)]" />
        </div>
        <div className="container relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            СКОРО В ПРОДАЖЕ
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Apocalypse DB455 / DB455 NEO
          </p>
          <Button size="lg" className="text-lg px-8 gap-2">
            Узнать больше
            <Icon name="ArrowRight" size={20} />
          </Button>
        </div>
      </section>

      <section className="container py-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Рекомендованные товары</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <ProductCard {...featuredProduct} />
          </div>
          {popularProducts.slice(0, 2).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <section className="bg-secondary/30 py-16">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Популярные категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="group p-6 rounded-lg bg-card border border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon name={category.icon as any} size={32} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <span className="text-sm text-muted-foreground">{category.count} товаров</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Популярные товары</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}