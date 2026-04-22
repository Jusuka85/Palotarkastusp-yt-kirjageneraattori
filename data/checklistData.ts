export interface ChecklistCategory {
  name: string;
  subCategories: {
    name: string;
    items?: string[];
  }[];
}

export const checklistData: ChecklistCategory[] = [
  {
    name: 'RAKENNUS JA SEN YMPÄRISTÖ',
    subCategories: [
      {
        name: 'Merkinnät ja opasteet',
        items: [
          'Osoitemerkintä',
          'Kiinteistötekniikan merkinnät ja opasteet',
          'Pelastushenkilöstölle vaarallisten tilojen ja laitteiden merkintä',
          'Luvaton pelastustiemerkintä',
        ],
      },
      {
        name: 'Tilojen turvallinen käyttö',
        items: [
          'Tavaran säilyttäminen',
          'Sähkölaitteiden/-laitteistojen kunto ja käyttö',
          'Tulen käsittely',
          'Tulityöt',
          'Akkujen lataus',
          'Palavat nesteet, kaasut ja kemikaalit',
          'Muut havaitut onnettomuusriskit',
        ],
      },
      {
        name: 'Pelastustie',
        items: [
          'Merkintä',
          'Ajokelpoisuus ja esteettömyys',
          'Ohjeistaminen ja osaaminen (pelastustie)',
          'Ajokelpoisuuden ja esteettömyyden valvominen',
        ],
      },
      {
        name: 'Palo-osastoinnit',
        items: [
          'Osastoivat rakenteet',
          'Ilmanvaihtokanavien osastointi',
          'Läpivientien tiivistykset',
          'Ohjeistaminen ja osaaminen (palo-osastointi)',
          'Palo-ovien huolto- ja kunnossapito',
        ],
      },
      {
        name: 'Poistuminen',
        items: [
          'Poistumisreittien kulkukelpoisuus ja esteettömyys',
          'Poistumisreittien riittävyys',
          'Lukitukset ja ovien toiminta',
          'Jälkiheijastavat poistumisopasteet',
          'Turva- ja merkkivalaistuksen sijoittelu ja näkyvyys',
        ],
      },
      {
        name: 'Ilmanvaihtokanavat ja -laitteet',
        items: ['Huolto ja puhdistus', 'Kohdepoistojen huolto ja puhdistus'],
      },
      {
        name: 'Tulisijat ja nuohous',
        items: [
          'Tulisijojen ja savunhormien rakenteet ja kunto',
          'Nuohous',
          'Nuohoustyön turvallisuus',
          'Ohjeistaminen ja osaaminen (tulisijat)',
        ],
      },
      {
        name: 'Väestönsuojat',
        items: [
          'Merkinnät ja opasteet',
          'Väestönsuojan rakenteet ja kunto',
          'Poikkeusolojen ilmanvaihto',
          'Väestönsuojan varusteet',
          'Suojelumateriaalit',
          'Huolto ja kunnossapito',
          'Käyttöönoton suunnittelu',
        ],
      },
      {
        name: 'Muu lämmityslaitteisto',
        items: [
          'Lämmityslaitteiston rakenteet ja kunto',
          'Huolto- ja kunnossapito (sis. nuohous)',
          'Kattilahuone',
        ],
      },
    ],
  },
  {
    name: 'TURVALLISUUDEN SUUNNITTELU',
    subCategories: [
      { name: 'Vaarojen ja riskien arviointi' },
      { name: 'Pelastussuunnitelma' },
    ],
  },
  {
    name: 'LAITTEET JA VARUSTEET',
    subCategories: [
      { name: 'Alkusammutuskalusto' },
      { name: 'Palovaroittimet' },
      { name: 'Sähköverkkoon kytketyt palovaroittimet' },
      { name: 'Palovaroitinjärjestelmä' },
      { name: 'Paloilmoitin ilman hätäkeskusyhteyttä' },
      { name: 'Hätäkeskukseen kytketty paloilmoitin' },
      { name: 'Automaattinen sammutuslaitteisto' },
      { name: 'Savunpoisto' },
      { name: 'Kaasusammutuslaitteisto' },
      { name: 'Kiinteät sammutusvesiputkistot' },
      {
        name: 'Turva- ja merkkivalaistus',
        items: [
          'Turva- ja merkkivalaistuksen huolto ja kunnossapito'
        ],
      },
    ],
  },
];