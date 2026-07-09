export type Language = 'pt' | 'en';

export interface TranslationSchema {
  common: {
    inicio: string;
    scrims: string;
    loja: string;
    noticias: string;
    adminPanel: string;
    loginGoogle: string;
    connecting: string;
    logout: string;
    competitor: string;
    copyright: string;
    disclaimer: string;
    madeWith: string;
    backToShop: string;
    close: string;
    whatsappContact: string;
    verifyPayment: string;
  };
  hero: {
    badgeText: string;
    titleMain: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaRegister: string;
    ctaIpadView: string;
    ecosystemLive: string;
    formatDuo: string;
    registered100: string;
    arenaTitle: string;
    arenaSubtitle: string;
    dailyScrimsTime: string;
    formatLabel: string;
    rewardsLabel: string;
    rewardsDetail: string;
    connectionHubTitle: string;
    connectionHubSubtitle: string;
    sponsorsTitle: string;
  };
  scrims: {
    activeRooms: string;
    latestResults: string;
    noRooms: string;
    noResults: string;
    lobbyRevealed: string;
    lobbyHidden: string;
    lobbyId: string;
    password: string;
    slotsAvailable: string;
    slotsFull: string;
    registerButton: string;
    teamLeaderboard: string;
    player: string;
    kills: string;
    points: string;
    mvp: string;
    registerModalTitle: string;
    whatsappLabel: string;
    whatsappPlaceholder: string;
    pubgIdLabel: string;
    pubgIdPlaceholder: string;
    confirmationMsg: string;
    registerSubmit: string;
    registering: string;
    registeredSuccess: string;
    stepsTitle: string;
    step1: string;
    step2: string;
  };
  shop: {
    bestSellerBadge: string;
    lifetimeAccess: string;
    getViaPix: string;
    originalCamera: string;
    originalCameraDesc: string;
    ipadViewCamera: string;
    ipadViewCameraDesc: string;
    recommendedGear: string;
    recommendedGearDesc: string;
    buyInStore: string;
    merchTitle: string;
    merchSubtitle: string;
    selectSize: string;
    stock: string;
    units: string;
    buy: string;
    pixTitle: string;
    subtotal: string;
    addFees: string;
    total: string;
    pixScan: string;
    copy: string;
    copied: string;
    simulateTestPayment: string;
    verifyingTrans: string;
    confirmedTitle: string;
    nextStepsTitle: string;
    digitalStep1: string;
    digitalStep2: string;
    merchStep1: string;
    merchStep2: string;
    whatsappConfirmButton: string;
    noMerch: string;
    noAffiliate: string;
  };
  news: {
    reelsTitle: string;
    reelsSubtitle: string;
    articlesTitle: string;
    articlesSubtitle: string;
    readCompleteAnalysis: string;
    authorBy: string;
    closeVideo: string;
    noArticles: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  pt: {
    common: {
      inicio: "Início",
      scrims: "Scrims & Copas",
      loja: "Loja Gamer",
      noticias: "News & Reels",
      adminPanel: "Painel Admin",
      loginGoogle: "Entrar com Google",
      connecting: "Conectando...",
      logout: "Sair da Conta",
      competitor: "Competidor",
      copyright: "Todos os direitos reservados.",
      disclaimer: "Plataforma e ecossistema oficial competitivo de PUBG Mobile Duo Scrims. Organização independente sem vínculos diretos com a Tencent Games.",
      madeWith: "Feito com",
      backToShop: "Voltar para a Loja",
      close: "Fechar",
      whatsappContact: "Falar no WhatsApp e Receber Código",
      verifyPayment: "Verificando Transação...",
    },
    hero: {
      badgeText: "VOU VIRAR ESSE JOGO SOZINHO.",
      titleMain: "A Elite do PUBG Mobile",
      titleHighlight: "Scrim Duo",
      titleEnd: "está aqui",
      subtitle: "Conquiste salas profissionais diárias, teste seu nível tático contra os melhores, garanta seu acesso premium a ferramentas digitais exclusivas e seja temido nos campos de batalha.",
      ctaRegister: "Registrar Duo na Scrim Diária",
      ctaIpadView: "Conhecer iPad View",
      ecosystemLive: "ECOSSISTEMA FÚRIA DA NOITE ONLINE",
      formatDuo: "FORMATO DUO TPP",
      registered100: "100% REGISTRADO",
      arenaTitle: "CAMPO DE PROVAS FÚRIA DA NOITE",
      arenaSubtitle: "Estruturados com servidores dedicados nas américas, lobbies MD3 customizados e apuração de pontos automatizada via bot.",
      dailyScrimsTime: "22:00 BRT",
      formatLabel: "Formato",
      rewardsLabel: "Premiações",
      rewardsDetail: "70% Pix Pool",
      connectionHubTitle: "Central de Conexão Geral",
      connectionHubSubtitle: "Acesse nossas redes sociais, canais oficiais e grupos de comunicação",
      sponsorsTitle: "SUPORTE COMPETITIVO & MARCAS DE CONFIANÇA",
    },
    scrims: {
      activeRooms: "Salas Ativas",
      latestResults: "Últimos Resultados",
      noRooms: "Nenhum treino/scrim ativo no momento. Fique atento aos comunicados no WhatsApp!",
      noResults: "Nenhuma partida encerrada com ranking disponível ainda.",
      lobbyRevealed: "LOBBY REVELADO",
      lobbyHidden: "Lobby ID e senha serão liberados 15 minutos antes do início.",
      lobbyId: "ID do Lobby",
      password: "Senha",
      slotsAvailable: "slots disponíveis",
      slotsFull: "Lobby Lotado",
      registerButton: "Inscrever Minha Dupla",
      teamLeaderboard: "Placar Geral e Classificação",
      player: "Jogador",
      kills: "Kills",
      points: "Pontos",
      mvp: "Destaque MVP",
      registerModalTitle: "Inscrição de Dupla na Scrim",
      whatsappLabel: "Seu WhatsApp (com DDD)",
      whatsappPlaceholder: "Ex: (11) 99999-9999",
      pubgIdLabel: "Sua ID do PUBG Mobile",
      pubgIdPlaceholder: "Ex: 5123456789",
      confirmationMsg: "A inscrição é instantânea. Lembre-se de realizar o pagamento da taxa via Pix no grupo do WhatsApp para validar sua vaga.",
      registerSubmit: "Inscrição via WhatsApp",
      registering: "Inscrevendo...",
      registeredSuccess: "Inscrição Pré-Confirmada!",
      stepsTitle: "PRÓXIMOS PASSOS:",
      step1: "1. Sua vaga está pré-reservada no sistema temporariamente.",
      step2: "2. Clique no link do WhatsApp abaixo para enviar os dados para a moderação e realizar o Pix para validar a inscrição definitiva.",
    },
    shop: {
      bestSellerBadge: "⭐ MAIS VENDIDO - CONFIGURAÇÃO PROFISSIONAL",
      lifetimeAccess: "Pagamento Único (Sem Mensalidade)",
      getViaPix: "Adquirir via Pix Instantâneo",
      originalCamera: "❌ VISÃO ORIGINAL CELULAR",
      originalCameraDesc: "Câmera cortada nas laterais, campo de visão lateral reduzido.",
      ipadViewCamera: "✅ IPAD VIEW FÚRIA DA NOITE",
      ipadViewCameraDesc: "Bordas periféricas reveladas, sprays 25% mais estáveis no celular.",
      recommendedGear: "Acessórios & Equipamentos Recomendados",
      recommendedGearDesc: "Produtos selecionados a dedo diretamente na Amazon e Mercado Livre para otimizar sua jogabilidade diária",
      buyInStore: "Comprar na Loja",
      merchTitle: "Camisaria & Vestuário Fúria da Noite",
      merchSubtitle: "Vista o manto sagrado do dragão roxo neon. Peças exclusivas e limitadas.",
      selectSize: "Selecione o Tamanho:",
      stock: "Estoque",
      units: "unidades",
      buy: "Comprar",
      pixTitle: "PAGAMENTO VIA PIX SEGURO",
      subtotal: "Subtotal:",
      addFees: "Taxas Adicionais:",
      total: "Total Geral:",
      pixScan: "Escaneie o QR Code ou copie a chave Pix abaixo:",
      copy: "Copiar",
      copied: "Copiado!",
      simulateTestPayment: "Simular Pagamento (Teste)",
      verifyingTrans: "Verificando Transação...",
      confirmedTitle: "Pagamento Confirmado!",
      nextStepsTitle: "📦 PRÓXIMOS PASSOS:",
      digitalStep1: "1. Chave de acesso e arquivo de configuração gerados para o e-mail cadastrado.",
      digitalStep2: "2. Clique no link abaixo para validar sua compra com o administrador e importar os arquivos via WhatsApp.",
      merchStep1: "1. Seu pedido do vestuário tamanho {size} está reservado.",
      merchStep2: "2. Preparamos o pacote para postagem imediata nos correios em até 24 horas úteis.",
      whatsappConfirmButton: "Falar no WhatsApp e Receber Código",
      noMerch: "Moda corporativa Fúria da Noite aguardando liberação de estoque.",
      noAffiliate: "Nenhum acessório afiliado cadastrado no momento.",
    },
    news: {
      reelsTitle: "Melhores Jogadas",
      reelsSubtitle: "REEL DE HIGHLIGHTS & CLUTCHES COMPILADOS",
      articlesTitle: "Análises & Informativos",
      articlesSubtitle: "FEED DE NOTÍCIAS ESPORTS & PATCH NOTES",
      readCompleteAnalysis: "[ LER ANÁLISE COMPLETA ]",
      authorBy: "Por",
      closeVideo: "[ Fechar Vídeo ]",
      noArticles: "Nenhuma novidade listada no painel. Volte em breve!",
    }
  },
  en: {
    common: {
      inicio: "Home",
      scrims: "Scrims & Cups",
      loja: "Gamer Shop",
      noticias: "News & Reels",
      adminPanel: "Admin Panel",
      loginGoogle: "Sign in with Google",
      connecting: "Connecting...",
      logout: "Sign Out",
      competitor: "Competitor",
      copyright: "All rights reserved.",
      disclaimer: "Official competitive platform and ecosystem of PUBG Mobile Duo Scrims. Independent organization with no direct relationship with Tencent Games.",
      madeWith: "Made with",
      backToShop: "Back to Shop",
      close: "Close",
      whatsappContact: "Contact on WhatsApp to Receive Code",
      verifyPayment: "Verifying Transaction...",
    },
    hero: {
      badgeText: "I WILL CLUTCH THIS MATCH ALONE.",
      titleMain: "PUBG Mobile Elite",
      titleHighlight: "Scrim Duo",
      titleEnd: "is here",
      subtitle: "Join daily professional custom lobbies, test your skill limit against the best, secure premium access to exclusive digital tools, and dominate the battlegrounds.",
      ctaRegister: "Register Duo in Daily Scrim",
      ctaIpadView: "Get iPad View",
      ecosystemLive: "FURIA DA NOITE ECOSYSTEM LIVE",
      formatDuo: "TPP DUO FORMAT",
      registered100: "100% SECURED",
      arenaTitle: "FURIA DA NOITE TRAINING GROUND",
      arenaSubtitle: "Built with dedicated low-latency regional servers, customized MD3 lobbies, and fully automated points calculation bots.",
      dailyScrimsTime: "10:00 PM BRT",
      formatLabel: "Format",
      rewardsLabel: "Prize Pool",
      rewardsDetail: "70% Pix Pool",
      connectionHubTitle: "Official Connection Hub",
      connectionHubSubtitle: "Join our official chats, community channels, and social media feeds",
      sponsorsTitle: "COMPETITIVE SUPPORT & LOGISTIC SPONSORS",
    },
    scrims: {
      activeRooms: "Active Lobbies",
      latestResults: "Latest Standings",
      noRooms: "No active training custom lobbies at the moment. Stay tuned on official WhatsApp chat groups!",
      noResults: "No recently closed lobby rankings available yet.",
      lobbyRevealed: "LOBBY REVEALED",
      lobbyHidden: "Lobby ID and Password will release 15 minutes before match starts.",
      lobbyId: "Lobby ID",
      password: "Password",
      slotsAvailable: "slots available",
      slotsFull: "Lobby Full",
      registerButton: "Register Our Duo Team",
      teamLeaderboard: "Leaderboards & Standings",
      player: "Player",
      kills: "Kills",
      points: "Points",
      mvp: "MVP Highlight",
      registerModalTitle: "Register Duo Team",
      whatsappLabel: "Your WhatsApp (with Country Code)",
      whatsappPlaceholder: "Ex: +1 (555) 019-2834",
      pubgIdLabel: "Your PUBG Mobile Character ID",
      pubgIdPlaceholder: "Ex: 5123456789",
      confirmationMsg: "Registration is instant. Be sure to complete the Pix payment on the WhatsApp group to officially validate your duo slot.",
      registerSubmit: "Register via WhatsApp",
      registering: "Registering...",
      registeredSuccess: "Registration Pre-Confirmed!",
      stepsTitle: "NEXT STEPS:",
      step1: "1. Your slot has been temporarily pre-reserved in our database.",
      step2: "2. Tap the WhatsApp link below to send your details to moderators and complete payment for final registration.",
    },
    shop: {
      bestSellerBadge: "⭐ BEST SELLER DIGITAL - PRO SETUP",
      lifetimeAccess: "One-time Payment (No Monthly Fee)",
      getViaPix: "Get instantly via secure Pix",
      originalCamera: "❌ ORIGINAL PHONE CAMERA",
      originalCameraDesc: "Cropped viewport edges, highly restricted lateral field of view.",
      ipadViewCamera: "✅ FURIA DA NOITE IPAD VIEW",
      ipadViewCameraDesc: "Expands lateral field of view, making spray recoil 25% more stable.",
      recommendedGear: "Recommended Gaming Electronics",
      recommendedGearDesc: "Handpicked pro gear directly from top online retailers to maximize your competitive performance",
      buyInStore: "Buy Product",
      merchTitle: "Official apparel & Merch Fúria da Noite",
      merchSubtitle: "Wear the holy dragon coat with purple neon accents. Limited edition pieces.",
      selectSize: "Select Size:",
      stock: "In Stock",
      units: "units",
      buy: "Order Now",
      pixTitle: "SECURE PIX CHECKOUT",
      subtotal: "Subtotal:",
      addFees: "Additional Fees:",
      total: "Grand Total:",
      pixScan: "Scan the QR code or copy the Pix key code string below:",
      copy: "Copy Key",
      copied: "Copied!",
      simulateTestPayment: "Complete Simulated Payment",
      verifyingTrans: "Processing Transaction...",
      confirmedTitle: "Payment Completed!",
      nextStepsTitle: "📦 NEXT STEPS:",
      digitalStep1: "1. License key and custom configurations generated for registered e-mail.",
      digitalStep2: "2. Tap click link below to validate setup with support and import via WhatsApp.",
      merchStep1: "1. Your apparel order size {size} is successfully reserved.",
      merchStep2: "2. We package your items for immediate postal shipment within 24 business hours.",
      whatsappConfirmButton: "Contact support via WhatsApp",
      noMerch: "Fúria da Noite official team clothing pending stock release.",
      noAffiliate: "No recommended accessories cataloged at the moment.",
    },
    news: {
      reelsTitle: "Best Plays & Highlight Reels",
      reelsSubtitle: "SPECTACULAR CLUTCHES & EPIC HIGHLIGHT VIDEOS",
      articlesTitle: "Analysis & Meta Feed",
      articlesSubtitle: "DAILY ESPORTS ANNOUNCEMENTS & UPDATE PATCH NOTES",
      readCompleteAnalysis: "[ READ FULL POST ]",
      authorBy: "By",
      closeVideo: "[ Close Video Player ]",
      noArticles: "No announcements logged on the feed yet. Check back soon!",
    }
  }

  es: {
    nav: {
      home: "Inicio",
      scrims: "Scrims",
      supporters: "Apoiadores",
      reels: "Reels",
      store: "Tienda",
      adminPanel: "Panel Admin",
      loginGoogle: "Entrar con Google",
      connecting: "Conectando...",
      logout: "Salir",
      competitor: "Competidor",
      copyright: "Todos los derechos reservados",
      disclaimer: "Plataforma competitiva. No afiliado a PUBG Corp.",
      madeWith: "Hecho con ❤️ por",
      backToShop: "Volver a la Tienda",
      close: "Cerrar",
      whatsappContact: "Contacto WhatsApp",
      verifyPayment: "Verificar Pago",
    },
    hero: {
      badgeText: "PUBG MOBILE · SCRIM DUO · BRASIL",
      titleMain: "FURIA",
      titleHighlight: "DA",
      titleEnd: "NOITE",
      subtitle: "La plataforma de scrims más competitiva de Brasil. Inscribe tu DUO, ocupa tu asiento en el avión y compite por los mejores premios.",
      ctaRegister: "VER SCRIMS »",
      ctaIpadView: "IPAD VIEW PRO",
      ecosystemLive: "EN VIVO",
      formatDuo: "Formato DUO",
      registered100: "100 registrados",
      arenaTitle: "ARENA DE CAMPEONES",
      arenaSubtitle: "Compite. Domina. Se el mejor.",
      dailyScrimsTime: "SCRIMS DIARIOS 21H",
      formatLabel: "Formato:",
      rewardsLabel: "Premio:",
      rewardsDetail: "R$200 por evento + premios",
      connectionHubTitle: "HUB DE CONEXION",
      connectionHubSubtitle: "Discord + WhatsApp + Streaming",
      sponsorsTitle: "SPONSORS & PARCEIROS",
    },
    scrims: {
      activeRooms: "SALAS ACTIVAS",
      latestResults: "ULTIMOS RESULTADOS",
      noRooms: "Ninguna sala activa en este momento.",
      noResults: "Ningún resultado registrado aún.",
      lobbyRevealed: "Lobby revelado",
      lobbyHidden: "El ID y contraseña del lobby se revelarán 15 minutos antes del inicio.",
      lobbyId: "ID del Lobby",
      addFees: "Cargos Adicionales:",
    },
    news: {
      reelsTitle: "Mejores Jugadas & Highlights",
      reelsSubtitle: "CLUTCHES ESPECTACULARES Y VIDEOS DESTACADOS",
      articlesTitle: "Análisis y Meta",
      articlesSubtitle: "ANUNCIOS DIARIOS DE ESPORTS Y NOTAS DE PARCHE",
      readCompleteAnalysis: "[ LEER POST COMPLETO ]",
      authorBy: "Por",
      closeVideo: "[ Cerrar Reproductor ]",
      noArticles: "No hay anuncios registrados aún. ¡Vuelve pronto!",
    },
  },
};