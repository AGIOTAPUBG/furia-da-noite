export type Lang = 'pt' | 'en' | 'es'

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
]

export const t: Record<Lang, Record<string, string>> = {
  pt: {
    // NAV
    nav_home: 'INÍCIO',
    nav_scrims: 'SALAS',
    nav_supporters: 'APOIADORES',
    nav_reels: 'REELS',
    nav_shop: 'LOJA',
    nav_cta: 'SER APOIADOR',
    nav_panel: 'PAINEL',
    nav_login: 'ENTRAR',
  nav_register: 'CRIAR CONTA',
    nav_locked: 'Exclusivo para Apoiadores',

    // HERO
    hero_tag: 'PUBG MOBILE · SALA DUO · BRASIL',
    hero_sub: 'A plataforma de salas mais competitiva do Brasil. Inscreva seu DUO, ocupe seu assento no avião e dispute os melhores prêmios.',
    hero_cta_scrims: 'VER SALAS ✈',
    hero_cta_create: 'CRIAR MINHA SALA',
    hero_stat_scrims: 'Salas realizadas',
    hero_stat_prize: 'Prêmio por evento',
    hero_stat_duos: 'Duos por sala',
    hero_stat_entry: 'Inscrição/DUO',

    // BANNER
    banner_tag: 'PARA DONOS DE CLÃ',
    banner_title: 'CRIE SUA SALA PERSONALIZADA E ',
    banner_title_em: 'GANHE DINHEIRO',
    banner_desc: 'Seja Apoiador FdN por R$35/mês e use nossa plataforma para criar salas personalizadas, cobrar inscrições e receber o lucro direto no seu PIX.',
    banner_cta: 'QUERO SER APOIADOR',

    // REELS
    reels_title: '📸 REELS & EVIDÊNCIAS',
    reels_sub: 'Os melhores momentos da Fúria da Noite. Acompanhe também no Instagram.',
    reels_follow: 'SEGUIR NO INSTAGRAM',
    reels_evidence: 'Evidências dos participantes',
    reels_scrim_art: 'Arte oficial da sala',
    reels_gameplay: 'Gameplay da sala',

    // APOIADORES
    ap_tag: 'PLANO APOIADOR',
    ap_title: 'TORNE-SE UM APOIADOR',
    ap_price: 'R$35',
    ap_per: '/mês',
    ap_cta: '🚀 ASSINAR AGORA',
    ap_pay: 'Pagamento via PIX ou cartão • InfinitePay',

    // PENDENTE
    pend_title: 'ACESSO RESTRITO',
    pend_back: 'Voltar para o início',
    pend_refresh: '🔄 Já paguei — verificar acesso',
    pend_logout: 'Sair',

    // LOJA
    shop_title: '🛒 LOJA',
    shop_soon: 'Em breve — produtos exclusivos da Fúria da Noite.',

    // FOOTER
    footer_rights: 'Todos os direitos reservados.',
    footer_follow: 'Siga-nos',
  },

  en: {
    nav_home: 'HOME',
    nav_scrims: 'ROOMS',
    nav_supporters: 'SUPPORTERS',
    nav_reels: 'REELS',
    nav_shop: 'SHOP',
    nav_cta: 'BE A SUPPORTER',
    nav_panel: 'PANEL',
    nav_login: 'LOGIN',
  nav_register: 'SIGN UP',
    nav_locked: 'Exclusive for Supporters',

    hero_tag: 'PUBG MOBILE · DUO ROOM · BRAZIL',
    hero_sub: 'The most competitive room platform in Brazil. Register your DUO, take your seat on the plane and compete for the best prizes.',
    hero_cta_scrims: 'VIEW ROOMS ✈',
    hero_cta_create: 'CREATE MY ROOM',
    hero_stat_scrims: 'Rooms held',
    hero_stat_prize: 'Prize per event',
    hero_stat_duos: 'Duos per room',
    hero_stat_entry: 'Entry/DUO',

    banner_tag: 'FOR CLAN OWNERS',
    banner_title: 'CREATE YOUR CUSTOM ROOM AND ',
    banner_title_em: 'EARN MONEY',
    banner_desc: 'Become an FdN Supporter for R$35/month and use our platform to create custom rooms, charge entry fees and receive profits directly to your PIX.',
    banner_cta: 'I WANT TO BE A SUPPORTER',

    reels_title: '📸 REELS & EVIDENCE',
    reels_sub: 'The best moments from Fúria da Noite. Follow us on Instagram too.',
    reels_follow: 'FOLLOW ON INSTAGRAM',
    reels_evidence: 'Participant evidence',
    reels_scrim_art: 'Official room artwork',
    reels_gameplay: 'Room gameplay',

    ap_tag: 'SUPPORTER PLAN',
    ap_title: 'BECOME A SUPPORTER',
    ap_price: 'R$35',
    ap_per: '/month',
    ap_cta: '🚀 SUBSCRIBE NOW',
    ap_pay: 'Payment via PIX or card • InfinitePay',

    pend_title: 'RESTRICTED ACCESS',
    pend_back: 'Back to home',
    pend_refresh: '🔄 Already paid — verify access',
    pend_logout: 'Logout',

    shop_title: '🛒 SHOP',
    shop_soon: 'Coming soon — exclusive Fúria da Noite merchandise.',

    footer_rights: 'All rights reserved.',
    footer_follow: 'Follow us',
  },

  es: {
    nav_home: 'INICIO',
    nav_scrims: 'SALAS',
    nav_supporters: 'APOIADORES',
    nav_reels: 'REELS',
    nav_shop: 'TIENDA',
    nav_cta: 'SER APOIADOR',
    nav_panel: 'PANEL',
    nav_login: 'ENTRAR',
  nav_register: 'CREAR CUENTA',
    nav_locked: 'Exclusivo para Apoiadores',

    hero_tag: 'PUBG MOBILE · SALA DÚO · BRASIL',
    hero_sub: 'La plataforma de salas más competitiva de Brasil. Inscribe tu DÚO, ocupa tu asiento en el avión y compite por los mejores premios.',
    hero_cta_scrims: 'VER SALAS ✈',
    hero_cta_create: 'CREAR MI SALA',
    hero_stat_scrims: 'Salas realizadas',
    hero_stat_prize: 'Premio por evento',
    hero_stat_duos: 'Duos por sala',
    hero_stat_entry: 'Inscripción/DÚO',

    banner_tag: 'PARA DUEÑOS DE CLAN',
    banner_title: 'CREA TU SALA PERSONALIZADA Y ',
    banner_title_em: 'GANA DINERO',
    banner_desc: 'Sé Apoiador FdN por R$35/mes y usa nuestra plataforma para crear salas personalizadas, cobrar inscripciones y recibir ganancias directo a tu PIX.',
    banner_cta: 'QUIERO SER APOIADOR',

    reels_title: '📸 REELS & EVIDENCIAS',
    reels_sub: 'Los mejores momentos de Fúria da Noite. Síguenos también en Instagram.',
    reels_follow: 'SEGUIR EN INSTAGRAM',
    reels_evidence: 'Evidencias de participantes',
    reels_scrim_art: 'Arte oficial de la sala',
    reels_gameplay: 'Gameplay de la sala',

    ap_tag: 'PLAN APOIADOR',
    ap_title: 'CONVIÉRTETE EN APOIADOR',
    ap_price: 'R$35',
    ap_per: '/mes',
    ap_cta: '🚀 SUSCRIBIRSE AHORA',
    ap_pay: 'Pago vía PIX o tarjeta • InfinitePay',

    pend_title: 'ACCESO RESTRINGIDO',
    pend_back: 'Volver al inicio',
    pend_refresh: '🔄 Ya pagué — verificar acceso',
    pend_logout: 'Salir',

    shop_title: '🛒 TIENDA',
    shop_soon: 'Próximamente — productos exclusivos de Fúria da Noite.',

    footer_rights: 'Todos los derechos reservados.',
    footer_follow: 'Síguenos',
  },
}

export function useTranslation(lang: Lang) {
  return (key: string): string => t[lang][key] ?? t['pt'][key] ?? key
}
