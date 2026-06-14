import { ScrimRoom, ProductItem, NewsPost } from '../types';

export const STARTER_SCRIMS: ScrimRoom[] = [
  {
    scrimId: 'scrim-248',
    title: 'Scrim Diária Elite Duo #248',
    dateTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
    format: 'DUO / TPP / MD3 (Erangel, Miramar, Sanhok)',
    price: 10.00,
    totalSlots: 25,
    availableSlots: 6,
    lobbyId: '829104',
    lobbyPassword: 'furia',
    status: 'upcoming',
    createdAt: new Date().toISOString()
  },
  {
    scrimId: 'scrim-249',
    title: 'Copa Fúria da Noite Duo Pro #15',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    format: 'DUO / TPP / MD5 (Erangel, Miramar, Sanhok, Vikendi)',
    price: 15.00,
    totalSlots: 25,
    availableSlots: 22,
    lobbyId: '109384',
    lobbyPassword: 'night',
    status: 'upcoming',
    createdAt: new Date().toISOString()
  },
  {
    scrimId: 'scrim-247',
    title: 'Warmup Geral Scrim Duo #247',
    dateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    format: 'DUO / TPP / MD3',
    price: 8.00,
    totalSlots: 25,
    availableSlots: 0,
    lobbyId: '381944',
    lobbyPassword: 'furia',
    status: 'finished',
    createdAt: new Date().toISOString(),
    leaderboard: [
      { placement: 1, teamName: 'FÚRIA | Dragon', player1: 'FN_Scylla', player2: 'FN_Apocalypse', kills: 14, points: 29, mvp: true },
      { placement: 2, teamName: 'Alpha Esports', player1: 'α_GamerX', player2: 'α_Vortex', kills: 9, points: 21, mvp: false },
      { placement: 3, teamName: 'Viper Strike Duo', player1: 'VP_Venom', player2: 'VP_Fang', kills: 8, points: 16, mvp: false },
      { placement: 4, teamName: 'Ghost Scuttlers', player1: 'GHS_Spectre', player2: 'GHS_Wraith', kills: 4, points: 12, mvp: false },
      { placement: 5, teamName: 'Nocturnal Scrims', player1: 'Noc_Shadow', player2: 'Noc_Shade', kills: 6, points: 11, mvp: false }
    ]
  }
];

export const STARTER_PRODUCTS: ProductItem[] = [
  {
    productId: 'prod-ipadview',
    name: 'Perspectiva iPad View (PUBG Mobile Config)',
    description: 'Obtenha a perspectiva estendida ultra fluída dos iPads diretamente no seu Celular Android ou iOS! Configuração limpa elaborada profissionalmente que expande as bordas laterais do campo de visão (FOV), proporcionando alta vantagem competitiva e detecção rápida de oponentes em Scrims. 100% seguro de ban, sem softwares externos.',
    price: 49.90,
    type: 'digital',
    features: [
      'Visibilidade periférica avançada (FOV 110)',
      'Totalmente nativo (Ajuste por arquivos de configuração PUBG)',
      '100% livre de banimento (Seguro contra detecção Tencent)',
      'Compatível com qualquer Celular (Android e iPhones)',
      'Suporte prioritário via WhatsApp',
      'Instalação passo-a-passo em menos de 5 minutos'
    ],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    visible: true,
    createdAt: new Date().toISOString()
  },
  {
    productId: 'prod-aff-triggers',
    name: 'Gatilhos Triggers L1 R1 Gamer Metálicos',
    description: 'Melhore seus comandos PUBG Mobile de 2 para 4 dedos instantaneamente com estes gatilhos mecânicos super eficientes. Clipe anatômico antiderrapante de alumínio com altíssima condutividade mecânica.',
    price: 34.90,
    type: 'affiliate',
    features: [
      'Material em liga metálica e ABS resistente',
      'Resposta tátil mecânica de alta precisão (sem delay)',
      'Ajuste universal para qualquer smartphone',
      'Não arranha ou danifica a tela'
    ],
    link: 'https://www.mercadolivre.com.br',
    image: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    visible: true,
    createdAt: new Date().toISOString()
  },
  {
    productId: 'prod-aff-cooler',
    name: 'Cooler Gamer Resfriador Magnético RGB',
    description: 'Evite travamentos térmicos e quedas de FPS brutais nas suas Scrims Duo de PUBG Mobile. Resfria seu celular em até 15°C em poucos segundos com pastilha termoelétrica integrada de excelente rendimento.',
    price: 89.90,
    type: 'affiliate',
    features: [
      'Tecnologia de resfriamento semicondutora ativa',
      'Acoplador magnético + clipe adaptador',
      'Iluminação neon RGB dinâmica',
      'Funcionamento ultra silencioso (não afeta o microfone)'
    ],
    link: 'https://www.amazon.com',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    visible: true,
    createdAt: new Date().toISOString()
  },
  {
    productId: 'prod-merch-jersey',
    name: 'Jersey Oficial Fúria da Noite 2026',
    description: 'Vista a pele do dragão! Camiseta oficial esports Fúria da Noite com tecido de malha Dry-Tech super esportivo, absorção total contra suor para maratonas PUBG Duo, estampas em sublimação de alta resolução com dragão roxo e cinza em degrade neon.',
    price: 119.90,
    type: 'merch',
    features: [
      'Tecido micro dry 100% esportivo de alta elasticidade',
      'Estampa digital premium em degradê neon roxo exclusivo',
      'Nome e Número personalizáveis opcionalmente',
      'Modelagem fit unissex atlética'
    ],
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80',
    sizes: ['P', 'M', 'G', 'GG'],
    inventory: 45,
    visible: true,
    createdAt: new Date().toISOString()
  },
  {
    productId: 'prod-merch-hoodie',
    name: 'Moletom Cyberpunk Dragão Roxa',
    description: 'Moletom canguru elegante com estampa estilizada cyberpunk e capuz ajustável. Forro duplo macio de algodão premium 3 cabos de grande aquecimento e conforto para o gamer moderno.',
    price: 189.90,
    type: 'merch',
    features: [
      'Algodão 3 cabos flanelado de altíssima costura',
      'Capuz forrado anatômico com cordões ajustáveis roxo neon',
      'Bolso canguru frontal e punhos de elastano'
    ],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
    sizes: ['P', 'M', 'G', 'GG'],
    inventory: 12,
    visible: true,
    createdAt: new Date().toISOString()
  }
];

export const STARTER_NEWS: NewsPost[] = [
  {
    newsId: 'news-1',
    title: 'Meta de Armas 2026: Análise da M416 vs. AUG - Qual domina o spray de longa distância?',
    excerpt: 'Com as novas regulamentações e reajustes nas taxas de recuo de PUBG Mobile, analisamos detalhadamente qual fuzil de assalto garante vantagem tática em salas Scrim competitivas.',
    content: `Os fuzis de assalto 5.56 continuam dominando os meta-games competitivos do PUBG Mobile Duo, especialmente para sprays de média e média-longa distância com miras 4x ou 6x recolhidas para 3x.\n\n### Comparativo de Recuo\nA **AUG** recebeu um leve ajuste em sua tração horizontal na última atualização, o que a torna a arma de maior dano por segundo (DPS) bruto na categoria 5.5s, porém seu controle no início do spray exige maior arrasto do giroscópio.\n\nJá a icônica **M416** continua sendo a "rainha da estabilidade". Com todos os acessórios (Coronha tática + Compensador + Punho Angular), o recuo permanece praticamente retilíneo, o que facilita o rastreamento em alvos correndo no descampado.\n\n### Recomendação para Duos\n- **Jogador de Linha de Frente (Frontline)**: Use a AUG pela velocidade de destruição de coletes em combates diretos.\n- **Jogador de Suporte (DMR Support)**: Prefira a M416 para dar cobertura tática e estourar veículos de rotação com sprays constantes.`,
    category: 'Analysis',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    author: 'FN_Scorpion',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    newsId: 'news-2',
    title: 'Como Ganhar Vantagem de Canto em PUBG com a Configuração "iPad View"',
    excerpt: 'Muitos jogadores profissionais usam configurações de perspective nativas ocultas para estender seu FOV. Saiba como essa modificação autorizada aumenta seu campo visual em até 25%.',
    content: `Se você já assistiu gameplays de pro-players jogando em Scrims e percebeu que eles conseguem enxergar o chão abaixo e os lados com muito mais clareza, você está vendo o efeito **iPad View**.\n\n### O que é o iPad View?\nO iPad possui uma proporção de tela de 4:3, enquanto a maioria dos celulares possui proporção widescreen (18:9 ou superior). O PUBG Mobile adapta o jogo esticando e limitando a visão vertical do celular para compensar.\n\nAo aplicar o ajuste de arquivos de configuração, o jogo passa a processar de forma nativa a câmera afastada horizontalmente. Nosso digital guide ensina você a configurar esses arquivos locais para habilitar a visualização horizontal estendida (FOV de 110 graus efetivos).\n\n### Vantagens Competitivas nas Scrims:\n1. **Controle de Vertentes**: Veja oponentes pulando janelas laterais antes de aparecerem em sua mira padrão.\n2. **Melhor Alvo Próximo**: O recuo visual das armas parece reduzido devido ao afastamento tático da câmera.\n3. **Câmara Estável no Carro**: Dirija e monitore atiradores nas colinas com 25% mais campo de observação.`,
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    author: 'FN_Founder',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    newsId: 'news-3',
    title: 'Highlight da Noite: Clutch espetacular 1v4 de FN_Scylla no final da MD3 ontem!',
    excerpt: 'Assista a jogada incrível onde Scylla usou granadas perfeitas e rifle M249 para liquidar as últimas duas equipes nas ruínas de Sanhok.',
    content: 'O squad Fúria da Noite provou mais uma vez por que é a elite competitiva do PUBG Mobile Duo. FN_Scylla em uma desvantagem extrema em Sanhok conseguiu usar a topografia das rochas, fumaça estrategicamente posicionada e rastejos silenciosos para surpreender a equipe adversária Alfa Esports. Um belo exemplo de jogabilidade inteligente!',
    category: 'Patch Notes',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embedded
    author: 'FN_Scorpion',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];
