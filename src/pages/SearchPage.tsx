import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

const allProducts = [
  {
    id: 'prod-1',
    name: 'Gamma 625C',
    price: 9002,
    oldPrice: 10590,
    discount: 15,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/5775337f-7789-48f4-acdf-91d66b106d15.jpg',
    category: 'Динамики',
  },
  {
    id: 'prod-2',
    name: 'Alpine Type-R R-W12D4',
    price: 18500,
    oldPrice: 22000,
    discount: 16,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/2e9b8eee-5010-4686-ab90-248b58173451.jpg',
    category: 'Сабвуферы',
  },
  {
    id: 'prod-3',
    name: 'Pioneer TS-A1370F',
    price: 4990,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/eaadeda8-d024-4f2d-9d73-9a92d6224b64.jpg',
    category: 'Динамики',
  },
  {
    id: 'prod-4',
    name: 'Apocalypse DB-SA252D2',
    price: 12952,
    oldPrice: 16190,
    discount: 20,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/2e9b8eee-5010-4686-ab90-248b58173451.jpg',
    category: 'Сабвуферы',
  },
  {
    id: 'prod-5',
    name: 'JBL GTO629',
    price: 7500,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/eaadeda8-d024-4f2d-9d73-9a92d6224b64.jpg',
    category: 'Динамики',
  },
  {
    id: 'prod-6',
    name: 'Rockford Fosgate P3D4-12',
    price: 15900,
    oldPrice: 18500,
    discount: 14,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/2e9b8eee-5010-4686-ab90-248b58173451.jpg',
    category: 'Сабвуферы',
  },
];

interface SearchPageProps {
  onProductClick?: (id: string) => void;
}

export default function SearchPage({ onProductClick }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  let filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen">
      <section className="bg-secondary/30 py-12">
        <div className="container px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Поиск товаров</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="Сабвуферы">Сабвуферы</SelectItem>
                <SelectItem value="Динамики">Динамики</SelectItem>
                <SelectItem value="Усилители">Усилители</SelectItem>
                <SelectItem value="Магнитолы">Магнитолы</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="container py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Найдено товаров: <span className="text-foreground font-semibold">{filteredProducts.length}</span>
          </p>
          {(searchQuery || category !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setCategory('all');
              }}
            >
              Сбросить фильтры
            </Button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Icon name="SearchX" size={64} className="text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground mb-6">Попробуйте изменить параметры поиска</p>
            <Button onClick={() => {
              setSearchQuery('');
              setCategory('all');
            }}>
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} onProductClick={onProductClick} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}