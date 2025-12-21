import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
}

const productData: Record<string, any> = {
  'featured-1': {
    id: 'featured-1',
    name: 'Apocalypse DB-SA252D2',
    price: 12952,
    oldPrice: 16190,
    discount: 20,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/2e9b8eee-5010-4686-ab90-248b58173451.jpg',
    description: 'Профессиональный сабвуфер премиум-класса с мощным басом и глубоким звуком. Идеально подходит для автомобильных аудиосистем высокого класса.',
    specs: {
      'Мощность RMS': '1000 Вт',
      'Пиковая мощность': '2000 Вт',
      'Импеданс': '2 Ом',
      'Диаметр': '25 см (10")',
      'Частотный диапазон': '20-500 Гц',
      'Чувствительность': '88 дБ',
    },
    features: [
      'Усиленная конструкция корзины',
      'Двойная катушка',
      'Высокотемпературная обмотка',
      'Защита от перегрева',
      'Система охлаждения',
    ],
    inStock: true,
  },
  'prod-1': {
    id: 'prod-1',
    name: 'Gamma 625C',
    price: 9002,
    oldPrice: 10590,
    discount: 15,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/5775337f-7789-48f4-acdf-91d66b106d15.jpg',
    description: 'Компонентная акустическая система с превосходным качеством звука. Идеальное решение для улучшения звучания в автомобиле.',
    specs: {
      'Мощность RMS': '120 Вт',
      'Пиковая мощность': '240 Вт',
      'Импеданс': '4 Ом',
      'Диаметр': '16.5 см (6.5")',
      'Частотный диапазон': '40-22000 Гц',
      'Чувствительность': '92 дБ',
    },
    features: [
      'Компонентная система',
      'Шелковый твиттер',
      'Качественный кроссовер',
      'Легкая установка',
    ],
    inStock: true,
  },
  'prod-2': {
    id: 'prod-2',
    name: 'Alpine Type-R R-W12D4',
    price: 18500,
    oldPrice: 22000,
    discount: 16,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/2e9b8eee-5010-4686-ab90-248b58173451.jpg',
    description: 'Топовый сабвуфер от Alpine с невероятной мощностью и детализацией звука. Легендарная серия Type-R для истинных ценителей.',
    specs: {
      'Мощность RMS': '1500 Вт',
      'Пиковая мощность': '3000 Вт',
      'Импеданс': '4 Ом',
      'Диаметр': '30 см (12")',
      'Частотный диапазон': '18-500 Гц',
      'Чувствительность': '86 дБ',
    },
    features: [
      'Технология HAMR',
      'Усиленный диффузор',
      'Массивный магнит',
      'Премиум качество сборки',
      'Гарантия производителя 2 года',
    ],
    inStock: true,
  },
  'prod-3': {
    id: 'prod-3',
    name: 'Pioneer TS-A1370F',
    price: 4990,
    image: 'https://cdn.poehali.dev/projects/50057c2f-4a7c-4faf-89e3-fc8fda96e514/files/eaadeda8-d024-4f2d-9d73-9a92d6224b64.jpg',
    description: 'Надежная коаксиальная акустика от Pioneer с отличным соотношением цены и качества.',
    specs: {
      'Мощность RMS': '150 Вт',
      'Пиковая мощность': '300 Вт',
      'Импеданс': '4 Ом',
      'Диаметр': '13 см (5.25")',
      'Частотный диапазон': '32-24000 Гц',
      'Чувствительность': '90 дБ',
    },
    features: [
      'Коаксиальная конструкция',
      'Углеродный диффузор',
      'Простая установка',
      'Надежность Pioneer',
    ],
    inStock: true,
  },
};

export default function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const product = productData[productId];
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
          <Button onClick={onBack}>Вернуться назад</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-secondary/30 py-6">
        <div className="container px-4">
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
            <Icon name="ArrowLeft" size={20} />
            Назад к каталогу
          </Button>
        </div>
      </section>

      <section className="container py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative overflow-hidden rounded-lg bg-secondary">
                {product.discount && (
                  <Badge className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground text-lg font-bold">
                    -{product.discount}%
                  </Badge>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                {product.inStock ? (
                  <Badge variant="outline" className="gap-2 border-primary text-primary">
                    <Icon name="CheckCircle" size={16} />
                    В наличии
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-2 border-destructive text-destructive">
                    <Icon name="XCircle" size={16} />
                    Нет в наличии
                  </Badge>
                )}
              </div>
            </div>

            <div className="border-t border-b py-6">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-bold text-primary">
                  {product.price.toLocaleString()} ₽
                </span>
                {product.oldPrice && (
                  <span className="text-2xl text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString()} ₽
                  </span>
                )}
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Icon name="Minus" size={18} />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Icon name="Plus" size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                  <Icon name="ShoppingCart" size={20} />
                  Добавить в корзину
                </Button>
                <Button variant="outline" size="lg">
                  <Icon name="Heart" size={20} />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="specs">Характеристики</TabsTrigger>
                <TabsTrigger value="features">Особенности</TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="mt-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 border-b border-border last:border-0"
                      >
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <Card className="p-6">
                  <ul className="space-y-3">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="CheckCircle" size={20} className="text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Truck" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Бесплатная доставка</h4>
                  <p className="text-sm text-muted-foreground">
                    При заказе от 10 000 ₽ доставка по России бесплатная. Срок доставки 3-7 дней.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="ShieldCheck" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Гарантия качества</h4>
                  <p className="text-sm text-muted-foreground">
                    Официальная гарантия производителя 1 год. Возврат в течение 14 дней.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
