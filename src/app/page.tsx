import { BannerCarousel } from '@/components/banners/BannerCarousel';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { ProductCarousel } from '@/components/carousel/ProductCarousel';
import { Header } from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="animate-fadeIn">
        {/* Carrossel de Banners */}
        <section className="p-4">
          <BannerCarousel />
        </section>

        {/* Categorias Principais */}
        <CategoryGrid categoryIds={['campo', 'society', 'futsal']} />

        {/* Mais Vendidos */}
        <section className="bg-white mt-2">
          <ProductCarousel
            title="Mais vendidos"
            type="bestSeller"
          />
        </section>

        {/* Coleções Especiais */}
        <CategoryGrid 
          title="Coleções Especiais" 
          categoryIds={['brindes', 'acessorios', 'trava-mista']} 
        />

        {/* Banner promocional */}
        <section className="p-4">
          <div className="proboots-banner rounded-lg p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">
              DESPERTE O CRAQUE QUE EXISTE EM VOCÊ COM NOSSAS CHUTEIRAS!
            </h2>
            <p className="text-sm opacity-90 mb-4">
              PARCELE EM ATÉ 5X SEM JUROS
            </p>
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
          </div>
        </section>



        {/* Itens para você */}
        <section className="bg-white mt-2">
          <ProductCarousel
            title="Itens para você"
            type="forYou"
          />
        </section>

        {/* Informações adicionais */}
        <section className="p-4 bg-white mt-2">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Frete Grátis</h3>
            <p className="text-sm text-gray-600">
              Envio rápido e acompanhado com código de rastreio
            </p>
          </div>
        </section>

        {/* Footer simples */}
        <footer className="bg-gray-900 text-white p-6 text-center">
          <h3 className="font-bold mb-4">Proboots</h3>
          <p className="text-sm text-gray-400 mb-4">
            © Proboots - Todos os direitos reservados
          </p>
          <div className="text-xs text-gray-500">
            99.985.306.285
          </div>
        </footer>
      </main>
    </div>
  );
}
