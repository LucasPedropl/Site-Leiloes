import React, { useState, useMemo } from 'react';
import { AuctionItem, ViewState, Bid } from './types';
import { AuctionCard } from './components/AuctionCard';
import { DetailView } from './components/DetailView';
import { Button } from './components/Button';
import { Search, Bell, Menu, Home, Car, Scale, Palette, LayoutGrid } from 'lucide-react';

// Mock Data - Realistic Brazilian Auctions
const INITIAL_ITEMS: AuctionItem[] = [
    {
        id: '1',
        lotNumber: 101,
        title: 'Apartamento Alto Padrão - Jardins/SP',
        description: 'Apartamento residencial com 240m², 4 dormitórios sendo 2 suítes, 3 vagas de garagem. Localização privilegiada na Alameda Lorena. Imóvel desocupado.',
        imageUrl: 'https://images.unsplash.com/photo-1512918760513-0f96bc652d56?auto=format&fit=crop&q=80&w=1000',
        currentBid: 2500000,
        startingBid: 2000000,
        increment: 20000,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
        bids: [
            { id: 'b1', amount: 2100000, bidderName: 'Roberto Almeida', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { id: 'b2', amount: 2500000, bidderName: 'Investimentos Ltda', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
        ],
        category: 'Imóveis',
        location: 'São Paulo, SP',
        status: 'open'
    },
    {
        id: '2',
        lotNumber: 45,
        title: 'Toyota Hilux SRX 4x4 Diesel 2023',
        description: 'Veículo recuperado de financiamento. Baixa quilometragem (15.000km). Estado de conservação excelente. Documentação em dia.',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000',
        currentBid: 180000,
        startingBid: 150000,
        increment: 2000,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 5), 
        bids: [
             { id: 'b3', amount: 165000, bidderName: 'Carlos Silva', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
             { id: 'b4', amount: 180000, bidderName: 'AutoRepasses', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        ],
        category: 'Veículos',
        location: 'Curitiba, PR',
        status: 'open'
    },
    {
        id: '3',
        lotNumber: 12,
        title: 'Relógio Rolex Submariner Date',
        description: 'Relógio original, aço Oystersteel, mostrador preto. Acompanha caixa original e certificado de garantia. Apreensão judicial.',
        imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000',
        currentBid: 45000,
        startingBid: 30000,
        increment: 1000,
        endsAt: new Date(Date.now() + 1000 * 60 * 45), 
        bids: [
             { id: 'b5', amount: 45000, bidderName: 'João P.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        ],
        category: 'Judicial',
        location: 'Rio de Janeiro, RJ',
        status: 'open'
    },
    {
        id: '4',
        lotNumber: 205,
        title: 'Cobertura Duplex - Vila Velha/ES',
        description: 'Imóvel de frente para o mar, 300m², 5 quartos. Necessita de pequenas reformas. Oportunidade para investimento.',
        imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1000',
        currentBid: 1200000,
        startingBid: 900000,
        increment: 10000,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72), 
        bids: [],
        category: 'Imóveis',
        location: 'Vila Velha, ES',
        status: 'open'
    },
    {
        id: '5',
        lotNumber: 88,
        title: 'Lote de Informática (MacBooks e Ipads)',
        description: 'Lote contendo 10 MacBooks Pro M1 e 5 iPads Air. Equipamentos de escritório desativado. Venda no estado.',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000',
        currentBid: 35000,
        startingBid: 15000,
        increment: 500,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 3), 
        bids: [],
        category: 'Judicial',
        location: 'Belo Horizonte, MG',
        status: 'open'
    },
    {
        id: '6',
        lotNumber: 33,
        title: 'Porsche 911 Carrera S 2021',
        description: 'Veículo de luxo, cor cinza, interior vermelho. Apenas 5.000km rodados. Blindado Nível III-A.',
        imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1000',
        currentBid: 850000,
        startingBid: 700000,
        increment: 5000,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24), 
        bids: [],
        category: 'Veículos',
        location: 'São Paulo, SP',
        status: 'open'
    }
];

type CategoryFilter = 'Todos' | 'Imóveis' | 'Veículos' | 'Judicial' | 'Arte';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [items, setItems] = useState<AuctionItem[]>(INITIAL_ITEMS);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemClick = (item: AuctionItem) => {
    setSelectedItem(item);
    setView(ViewState.DETAIL);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedItem(null);
    setView(ViewState.HOME);
  };

  const handlePlaceBid = (amount: number) => {
    if (!selectedItem) return;

    const newBid: Bid = {
        id: Math.random().toString(36).substr(2, 9),
        amount: amount,
        bidderName: 'Você',
        timestamp: new Date()
    };

    const updatedItem = {
        ...selectedItem,
        currentBid: amount,
        bids: [...selectedItem.bids, newBid]
    };

    // Update local state and list state
    setSelectedItem(updatedItem);
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
        const matchesCategory = categoryFilter === 'Todos' || item.category === categoryFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.lotNumber.toString().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });
  }, [items, categoryFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      
      {/* Navbar - Clean & Functional */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div 
                className="text-xl font-bold tracking-tight text-slate-900 cursor-pointer flex items-center gap-1"
                onClick={handleBack}
              >
                Velox<span className="text-gray-400">Leilões</span>
              </div>
              <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
                <button onClick={() => setCategoryFilter('Todos')} className={`${categoryFilter === 'Todos' ? 'text-slate-900' : 'hover:text-slate-900'} transition-colors`}>Lotes</button>
                <a href="#" className="hover:text-slate-900 transition-colors">Vender</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Sobre</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Ajuda</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex items-center relative group">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 group-focus-within:text-slate-900 transition-colors" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar lote, imóvel..." 
                    className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white w-56 transition-all"
                  />
               </div>
               <button className="p-2 text-gray-400 hover:text-slate-900 transition-colors">
                 <Bell className="w-5 h-5" />
               </button>
               <div className="h-4 w-px bg-gray-200 mx-1"></div>
               <div className="flex items-center gap-3">
                 <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Entrar</Button>
                 <Button size="sm">Cadastre-se</Button>
               </div>
               <button className="md:hidden p-2 text-slate-900">
                 <Menu className="w-6 h-6" />
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-[#FAFAFA]">
        {view === ViewState.HOME && (
          <>
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 pt-16 pb-20 mb-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 mb-6 tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Auditório Virtual Aberto
                </span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                  Oportunidades exclusivas, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">transparência total.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-10 leading-relaxed">
                  A plataforma mais segura do Brasil para arrematar imóveis, veículos e bens judiciais. Lances em tempo real com documentação verificada.
                </p>
                <div className="flex justify-center gap-4">
                   <Button size="lg" className="rounded-full px-8 h-12">Ver Lotes em Destaque</Button>
                   <Button variant="outline" size="lg" className="rounded-full px-8 h-12">Como Funciona</Button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { label: 'Todos', icon: LayoutGrid },
                        { label: 'Imóveis', icon: Home },
                        { label: 'Veículos', icon: Car },
                        { label: 'Judicial', icon: Scale },
                        { label: 'Arte', icon: Palette },
                    ].map((cat) => {
                        const Icon = cat.icon;
                        const isActive = categoryFilter === cat.label;
                        return (
                            <button
                                key={cat.label}
                                onClick={() => setCategoryFilter(cat.label as CategoryFilter)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                    ${isActive 
                                        ? 'bg-slate-900 text-white shadow-md' 
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Auctions Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">Leilões em Andamento</h2>
                    <p className="text-sm text-gray-500 mt-1">{filteredItems.length} lotes encontrados</p>
                 </div>
              </div>
              
              {filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <AuctionCard 
                        key={item.id} 
                        item={item} 
                        onClick={handleItemClick} 
                      />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900">Nenhum lote encontrado</h3>
                      <p className="text-gray-500 text-sm mt-1">Tente ajustar seus filtros de busca.</p>
                      <Button 
                        variant="ghost" 
                        onClick={() => { setCategoryFilter('Todos'); setSearchQuery(''); }}
                        className="mt-4"
                      >
                        Limpar filtros
                      </Button>
                  </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-200 bg-white py-16">
               <div className="max-w-7xl mx-auto px-4 text-center">
                  <h3 className="text-lg font-semibold text-slate-900 mb-8">Parceiros Oficiais</h3>
                  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                     <span className="text-lg font-bold text-slate-800 border border-slate-300 px-4 py-2 rounded">Tribunal de Justiça</span>
                     <span className="text-lg font-bold text-slate-800 border border-slate-300 px-4 py-2 rounded">Caixa Econômica</span>
                     <span className="text-lg font-bold text-slate-800 border border-slate-300 px-4 py-2 rounded">Banco do Brasil</span>
                     <span className="text-lg font-bold text-slate-800 border border-slate-300 px-4 py-2 rounded">Detran</span>
                  </div>
               </div>
            </div>
          </>
        )}

        {view === ViewState.DETAIL && selectedItem && (
          <DetailView 
            item={selectedItem} 
            onBack={handleBack} 
            onPlaceBid={handlePlaceBid} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Velox Leilões</h4>
                    <p className="text-gray-500 mb-4">Plataforma oficial de leilões eletrônicos. Segurança jurídica e tecnologia de ponta.</p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Categorias</h4>
                    <ul className="space-y-2 text-gray-500">
                        <li><a href="#" className="hover:text-slate-900">Imóveis Residenciais</a></li>
                        <li><a href="#" className="hover:text-slate-900">Veículos de Luxo</a></li>
                        <li><a href="#" className="hover:text-slate-900">Judicial</a></li>
                        <li><a href="#" className="hover:text-slate-900">Rural</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Institucional</h4>
                    <ul className="space-y-2 text-gray-500">
                        <li><a href="#" className="hover:text-slate-900">Quem Somos</a></li>
                        <li><a href="#" className="hover:text-slate-900">Dúvidas Frequentes</a></li>
                        <li><a href="#" className="hover:text-slate-900">Editais</a></li>
                        <li><a href="#" className="hover:text-slate-900">Contato</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Atendimento</h4>
                    <p className="text-gray-500">Seg a Sex das 9h às 18h</p>
                    <p className="font-medium text-slate-900 mt-2">0800 123 4567</p>
                    <p className="text-gray-500 mt-1">contato@veloxleiloes.com.br</p>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-400 text-xs">
                    © 2024 Velox Leilões Oficiais. Jucesp nº 1234.
                </div>
                <div className="flex gap-4 text-gray-400 text-xs">
                    <a href="#" className="hover:text-slate-900">Termos de Uso</a>
                    <a href="#" className="hover:text-slate-900">Privacidade</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}