export const guidanceData: Record<string, string> = {
    // RAKENNUS JA SEN YMPÄRISTÖ
    // Merkinnät ja opasteet
    'Osoitemerkintä': `Tarkastusohje:
- Arvioi, löytääkö pelastusyksikkö perille helposti ja nopeasti.
- Tarkasta numeron ja rapputunnuksen näkyvyys tieltä, myös pimeällä.
- Huomioi kasvillisuuden vaikutus näkyvyyteen.
- Varmista, että kerrosnumerot ovat selkeät porrashuoneessa.

Info:
- Osoitemerkinnän on oltava havaittavissa pimeällä. Porrashuoneet merkitään suurilla kirjaimilla. Uudemmissa kerrostaloissa myös kerrosten merkintä on vaatimus.
- Haja-asutusalueella opaste tulee sijoittaa pihaan johtavan tien risteykseen.`,

    'Kiinteistötekniikan merkinnät ja opasteet': `Tarkastusohje:
- Tarkasta, että tärkeimmät kiinteistötekniikan laitteet (sähköpääkeskus, veden ja kaasun pääsulut, IV-hätäpysäytys) on merkitty selkeästi.
- Arvioi, kuinka nopeasti ne ovat löydettävissä hätätilanteessa.

Info:
- Opastuksen tulee alkaa rakennuksen ulkopuolelta ja jatkua kohteeseen asti, jos se sijaitsee syvällä rakennuksessa. Merkintä on vähintään oltava kyseisen tilan ovessa.`,
    
    'Pelastushenkilöstölle vaarallisten tilojen ja laitteiden merkintä': `Tarkastusohje:
- Selvitä, onko kohteessa pelastushenkilöstölle vaaraa aiheuttavia tiloja tai laitteita (esim. putoamisvaara, kaasupullot, korkeajännite, aurinkopaneelit).
- Varmista, että nämä on merkitty asianmukaisin varoitusmerkein.

Info:
- Merkintä on tehtävä viimeistään tilaan johtavaan oveen sen ulkopuolelle. Varoitusmerkkien tulee olla standardin mukaisia.`,
    
    'Luvaton pelastustiemerkintä': `Tarkastusohje:
- Tarkasta, onko tontilla pelastustiemerkintöjä reiteillä, jotka eivät täytä virallisen pelastustien vaatimuksia (kantavuus, leveys).
- Varmistu, ettei reitti ole virallinen pelastustie, ennen kuin määräät merkinnän poistettavaksi.

Info:
- Vain rakennusluvassa hyväksytyn pelastustien saa merkitä pelastustiekilvellä. Virheellinen merkintä voi johtaa pelastusyksikön vaaratilanteeseen.`,

    // Tilojen turvallinen käyttö
    'Tavaran säilyttäminen': `Tarkastusohje:
- Varmista, ettei helposti syttyvää tavaraa säilytetä vaarallisissa paikoissa: rakennuksen seinustoilla tai alla, teknisissä tiloissa (IV-konehuone, sähköpääkeskus), ullakoilla, kellareissa tai saunan kiukaan lähellä.

Info:
- Tavaran säilytys poistumisteillä, teknisissä tiloissa ja rakennuksen ulkopuolella lisää palokuormaa ja palon leviämisen riskiä sekä vaikeuttaa pelastustoimintaa.`,
    
    'Sähkölaitteiden/-laitteistojen kunto ja käyttö': `Tarkastusohje:
- Havainnoi sähkölaitteiden ja -asennusten yleiskuntoa. Etsi näkyviä vikoja, rikkoutuneita johtoja tai virheellisiä asennuksia.
- Varmista, ettei ulkona käytetä sisäkäyttöön tarkoitettuja laitteita.
- Kysy, onko lakisääteiset määräaikaistarkastukset tehty.

Info:
- Viallisia sähkölaitteita ei saa käyttää. Sähköpääkeskuksen kannet on pidettävä kiinni. Sähkölaitteita ei saa peittää.`,
    
    'Tulen käsittely': `Tarkastusohje:
- Arvioi, aiheuttaako avotulen (kynttilät, nuotiot, grillit) tai tupakan käsittely kohteessa palovaaraa.
- Varmista, että kynttilät ovat palamattomalla alustalla ja ettei ulkotulia käytetä sisällä tai katoksien alla.

Info:
- Tulta ei saa jättää valvomatta. Kynttilöiden ja tulisijojen ympärillä on oltava riittävä suojaetäisyys palaviin materiaaleihin. Tupakkapaikan tuhka-astian on oltava palamaton ja turvallisesti sijoitettu.`,

    'Tulityöt': `Tarkastusohje:
- Selvitä, tehdäänkö kohteessa tulitöitä (hitsaus, laikkaleikkaus ym.) ja onko niille laadittu turvalliset käytännöt ja tulityölupa-menettely.
- Varmista, että tilapäisellä tulityöpaikalla on alkusammutuskalusto ja vartiointi.

Info:
- Tulityöpaikka tulee siivota palavasta materiaalista ja suojata kipinöiltä. Vakuutusyhtiöiden suojeluohjeet edellyttävät tulityölupaa ja -vartiointia.`,
    
    'Akkujen lataus': `Tarkastusohje:
- Selvitä akkujen (erityisesti litiumioniakkujen) latauskäytännöt.
- Varmista, että akkuja ladataan valvotusti, palamattomalla alustalla ja ettei latauspaikan välittömässä läheisyydessä ole palavaa materiaalia.

Info:
- Käytä vain ehjiä, laitteeseen soveltuvia akkuja ja latureita. Akkuja ei tule ladata valvomatta, esim. yöllä tai poissa ollessa. Suuremmissa kohteissa lataukselle tulee varata oma palo-osastoitu tila.`,

    'Palavat nesteet, kaasut ja kemikaalit': `Tarkastusohje:
- Varmista, että palavien nesteiden, kaasujen ja kemikaalien säilytysmäärät eivät ylitä sallittuja enimmäismääriä tilan käyttötarkoituksen mukaan (asuintila, varasto, myymälä, ajoneuvosuoja).
- Tarkasta, että säilytysastiat ja -paikat ovat asianmukaisia ja merkittyjä.
- Varmista, että kemikaaleja ei säilytetä yhteisissä irtaimistovarastoissa (ullakko/kellari).
- Varmista, että myymälöissä noudatetaan Tukesin ohjeita ja että poistumistiet ovat esteettömät.
- Selvitä, onko toiminnasta tehty vaadittava ilmoitus pelastusviranomaiselle.
- Tarkasta, että keskenään reagoivat kemikaalit on eroteltu ja että vuotojen hallinta on järjestetty.

Info:
- Säilytysmäärät ja -tavat on määritelty lainsäädännössä (VNa 685/2015). Yleisimmät asuintilojen rajat ovat 25 litraa helposti syttyviä nesteitä ja 50 litraa muita palavia nesteitä. Ajoneuvosuojissa ja varastoissa määrät ovat suurempia. Nestekaasua saa säilyttää enintään 25 kg. Kaikki säilytettävät määrät tulee kirjata pelastussuunnitelmaan.`,

    'Muut havaitut onnettomuusriskit': `Tarkastusohje:
- Havainnoi yleistä turvallisuutta: liukastumis- ja kompastumisvaara, putoavan lumen/jään vaara, kaiteiden puutteet.

Info:
- Kiinteistön omistajalla on vastuu huolehtia alueensa turvallisuudesta, kuten hiekoituksesta ja lumenpudotuksesta.`,

    // Pelastustie
    'Merkintä': `Tarkastusohje:
- Varmista, että rakennuslupaan merkitty pelastustie on merkitty asianmukaisella pelastustiekilvellä.
- Tarkasta merkintöjen näkyvyys ja kunto.

Info:
- Vain virallisen pelastustien saa merkitä. Merkintä auttaa pitämään tien vapaana ja nopeuttaa pelastusyksiköiden saapumista. Myös mahdolliset nostopaikat tulee merkitä.`,

    'Ajokelpoisuus ja esteettömyys': `Tarkastusohje:
- Varmista, että pelastustie on esteetön ja riittävän leveä (väh. 3,5m).
- Tarkasta, että mahdolliset puomit ovat pelastuslaitoksen avaimella helposti avattavissa.
- Arvioi talvikunnossapidon riittävyys.

Info:
- Pelastustielle ei saa pysäköidä. Kiinteistön omistajan vastuulla on pitää pelastustie ajokelpoisena ja esteettömänä ympäri vuoden.`,

    'Ohjeistaminen ja osaaminen (pelastustie)': `Tarkastusohje:
- Kysy, miten kiinteistön käyttäjiä (asukkaat, työntekijät) on ohjeistettu pelastustien merkityksestä ja vapaana pitämisen tärkeydestä.

Info:
- Ohjeistaminen on osa pelastustien esteettömyyden valvontaa. Tehokas tiedotus vähentää virheellistä pysäköintiä.`,
    
    'Ajokelpoisuuden ja esteettömyyden valvominen': `Tarkastusohje:
- Arvioi, onko kohteessa toimivat käytännöt pelastustien valvonnalle. Miten puutteisiin reagoidaan?

Info:
- Kiinteistön omistajalla ja haltijalla on lakisääteinen velvollisuus valvoa pelastustien esteettömyyttä. Tämä voi sisältää säännöllisiä tarkastuksia ja sopimuksen pysäköinninvalvonnan kanssa.`,
    
    // Palo-osastoinnit
    'Osastoivat rakenteet': `Tarkastusohje:
- Vertaa rakennuksen osastointia rakennuslupakuviin.
- Tarkasta, ettei osastoivissa seinissä tai välipohjissa ole reikiä tai laittomia aukkoja.

Info:
- Osastoivien rakenteiden tarkoitus on rajoittaa palon ja savun leviäminen tietylle alueelle määräajaksi. Rakenteen eheyttä ei saa rikkoa.`,

    'Ilmanvaihtokanavien osastointi': `Tarkastusohje:
- Tarkasta, että osastoivan rakenteen läpäisevät ilmanvaihtokanavat on varustettu palopellein tai eristetty vaatimusten mukaisesti.
- Varmista palopeltien toimintakunto ja huolto.

Info:
- Oikein toteutettu IV-kanavien osastointi estää palon ja savukaasujen nopean leviämisen kanavistoa pitkin muihin palo-osastoihin.`,

    'Läpivientien tiivistykset': `Tarkastusohje:
- Tarkasta, että kaikkien putkien, kaapeleiden ja muiden teknisten asennusten läpiviennit osastoivissa rakenteissa on tiivistetty hyväksytyillä palokatkotuotteilla.

Info:
- Yksikin tiivistämätön läpivienti voi mitätöidä koko palo-osastoinnin tehon. Palokatkojen tekeminen vaatii ammattitaitoa.`,

    'Palo-ovien huolto- ja kunnossapito': `Tarkastusohje:
- Tarkista, että palo-ovet sulkeutuvat tiiviisti ja salpautuvat itsestään.
- Varmista, että ovea ei ole kiilattu auki ja että suljinlaite on toimintakunnossa.
- Testaa automaattisten palo-ovien toiminta.

Info:
- Palo-oven tulee olla itsestään sulkeutuva ja salpautuva. Kunnossapitovelvollisuus on kiinteistön omistajalla. Säännöllinen testaus ja huolto varmistavat toiminnan hätätilanteessa.`,
    
    'Ohjeistaminen ja osaaminen (palo-osastointi)': `Tarkastusohje:
- Kysy, miten kiinteistön käyttäjiä (asukkaat, työntekijät) on ohjeistettu palo-osastoinnin merkityksestä, erityisesti palo-ovien kiinnipitämisen tärkeydestä.

Info:
- Toimiva palo-osastointi on tehokkain tapa rajoittaa palon ja savun leviämistä. Oikea käyttäjien toiminta (esim. ovien sulkeminen) on olennainen osa sen toimivuutta.`,

    // Poistuminen
    'Poistumisreittien kulkukelpoisuus ja esteettömyys': `Tarkastusohje:
- Varmista, että poistumisreitit ja uloskäytävät ovat esteettömiä ja vapaita tavarasta.
- Tarkasta, että ovet aukeavat helposti ilman avainta ja ettei niiden eteen ole kasattu lunta tai muuta estettä.

Info:
- Poistumisreiteillä ei saa säilyttää mitään. Turvallinen poistuminen on varmistettava kaikissa tilanteissa.`,

    'Poistumisreittien riittävyys': `Tarkastusohje:
- Arvioi silmämääräisesti ja tarvittaessa rakennuslupakuvista, vastaako uloskäytävien määrä ja leveys tilan henkilömäärää ja käyttötarkoitusta.

Info:
- Jokaiselta poistumisalueelta tulee olla vähintään kaksi erillistä uloskäytävää. Muutokset tiloissa voivat vaatia poistumisjärjestelyjen uudelleenarviointia.`,

    'Lukitukset ja ovien toiminta': `Tarkastusohje:
- Testaa, että poistumisteiden ovet ovat helposti avattavissa sisältäpäin ilman avainta tai erityisosaamista, kun tiloissa on ihmisiä.
- Tarkasta hätäavauspainikkeiden ja -kahvojen toiminta.

Info:
- Poistumisreitin oven tulee olla avattavissa yhdellä toimenpiteellä. Sähköiset lukot tulee varustaa hätäavausjärjestelmällä, joka toimii myös sähkökatkon aikana.`,

    'Jälkiheijastavat poistumisopasteet': `Tarkastusohje:
- Varmista, että poistumisreitit on merkitty selkein, jälkiheijastavin tai turvavalaistuin opastein.
- Tarkasta opasteiden näkyvyys ja kunto.

Info:
- Opasteiden tulee näkyä myös sähkökatkon ja savunmuodostuksen aikana. Vanhat jälkiheijastavat opasteet menettävät tehonsa ajan myötä.`,

    'Turva- ja merkkivalaistuksen sijoittelu ja näkyvyys': `Tarkastusohje:
- Arvioi opasteiden ja turvavalaisimien sijoittelun ja näkyvyyden riittävyys. Varmista, ettei niiden edessä ole esteitä.
- Opasteiden koon tulee olla riittävä katseluetäisyyteen nähden.

Info:
- Opasteet sijoitetaan kaikkiin reitin suunnanmuutoksiin ja uloskäytäville. Turvavalaisimien tulee valaista poistumisreitti riittävän hyvin.`,
    
    'Turva- ja merkkivalaistuksen huolto ja kunnossapito': `Tarkastusohje:
- Varmista, että järjestelmälle on laadittu huolto-ohjelma ja sitä noudatetaan.
- Kysy, miten ja kuinka usein akkujen toimintakunto testataan.

Info:
- Toimiva turvavalaistus on kriittinen poistumisturvallisuudelle. Järjestelmä vaatii säännöllistä testausta ja huoltoa, erityisesti akkujen osalta, jotka tulee uusia valmistajan ohjeen mukaan (yleensä 4-10 vuoden välein).`,

    // Ilmanvaihtokanavat ja -laitteet
    'Huolto ja puhdistus': `Tarkastusohje:
- Kysy, milloin ilmanvaihtokanavat on viimeksi puhdistettu ja millä perusteella puhdistusväli on määritelty.
- Tarkasta silmämääräisesti kanavien ja laitteiden puhtaus, jos mahdollista.

Info:
- Ilmanvaihtokanaviin kertynyt pöly ja lika voivat levittää paloa ja savua. Puhdistustarve on kohdekohtainen, mutta esimerkiksi ammattikeittiöiden rasvakanavat vaativat tiheää puhdistusta.`,

    'Kohdepoistojen huolto ja puhdistus': `Tarkastusohje:
- Kysy erityisesti ammattikeittiöiden rasvakanavien ja muiden kohdepoistojen (esim. autokorjaamot) puhdistuskäytännöistä ja -väleistä.

Info:
- Rasvakanavan säännöllinen puhdistus on erittäin tärkeää paloturvallisuuden kannalta. Puhdistusväli riippuu käytön määrästä ja voi vaihdella 3 kuukaudesta vuoteen.`,

    // Tulisijat ja nuohous
    'Tulisijojen ja savunhormien rakenteet ja kunto': `Tarkastusohje:
- Tarkasta tulisijojen ja hormien kunto silmämääräisesti halkeamien ja vuotojälkien varalta.
- Varmista, että suojaetäisyydet palaviin materiaaleihin ovat riittävät.
- Tarkasta eduspellin olemassaolo.

Info:
- Vioittunut tulisija tai hormi on vakava paloturvallisuusriski ja se tulee asettaa käyttökieltoon kunnes se on korjattu. Hormin ja tulisijan tulee olla yhteensopivia.`,
    
    'Nuohous': `Tarkastusohje:
- Varmista, että nuohous on suoritettu säännöllisesti ja siitä on todistus. Vakituisessa asuinkäytössä olevat tulisijat nuohotaan vuosittain, vapaa-ajan asunnot kolmen vuoden välein.

Info:
- Säännöllinen nuohous ehkäisee nokipaloja. Käyttämätön tulisija on nuohottava ennen käyttöönottoa. Nuohouksen saa suorittaa vain ammattitutkinnon suorittanut henkilö.`,

    'Nuohoustyön turvallisuus': `Tarkastusohje:
- Tarkasta, että katolle on järjestetty turvallinen ja esteetön kulku (seinä- ja lapetikkaat, kattosillat).

Info:
- Kiinteistön omistaja on vastuussa siitä, että nuohoojalla on turvalliset työskentelyolosuhteet. Puutteelliset kattoturvatuotteet voivat estää nuohouksen suorittamisen.`,
    
    'Ohjeistaminen ja osaaminen (tulisijat)': `Tarkastusohje:
- Kysy, miten asukkaita/käyttäjiä on ohjeistettu tulisijan turvallisesta käytöstä (puiden määrä, pellit, tuhkan käsittely).

Info:
- Oikea käyttötekniikka on keskeistä. Esimerkiksi liian suuri puumäärä voi ylikuumentaa hormin, ja kuuman tuhkan säilytys väärässä paikassa on yleinen palonsyy.`,
    
    // Väestönsuojat
    'Merkinnät ja opasteet': `Tarkastusohje:
- Varmista, että väestönsuoja on merkitty kansainvälisellä tunnuksella (sininen kolmio oranssilla pohjalla).

Info:
- Merkintöjen avulla suojaan osataan hakeutua poikkeusoloissa.`,

    'Väestönsuojan rakenteet ja kunto': `Tarkastusohje:
- Tarkasta suojan rakenteiden, oven ja luukkujen tiiveys silmämääräisesti.
- Varmista, ettei rakenteisiin ole tehty luvattomia, tiiveyttä heikentäviä läpivientejä.

Info:
- Väestönsuojan tulee olla tiivis ja paineenkestävä. Tiiveys tarkastetaan määräajoin tehtävällä tiiveyskokeella.`,
    
    'Poikkeusolojen ilmanvaihto': `Tarkastusohje:
- Varmista, että väestönsuojassa on vaatimusten mukainen ilmanvaihtolaite ja suodattimet.
- Tarkasta, että laitteen käsikäyttömahdollisuus on olemassa ja ylipainemittari on kunnossa.

Info:
- Ilmanvaihtolaitteiston tulee toimia myös sähkökatkon aikana. Se suodattaa ulkoa tulevasta ilmasta vaaralliset aineet.`,

    'Väestönsuojan varusteet': `Tarkastusohje:
- Tarkasta, että suojassa on lakisääteiset varusteet, kuten kuivakäymälöitä, vesisäiliöitä ja työkaluja käyttöönottoa varten.

Info:
- Varusteiden määrä riippuu suojan rakentamisajankohdasta. Varusteiden tulee olla käyttökuntoisia.`,
    
    'Suojelumateriaalit': `Tarkastusohje:
- Kysy, mitä suojelumateriaaleja (esim. suojanaamarit, joditabletit) suojaan on hankittu tai suunniteltu hankittavaksi.

Info:
- Suojelumateriaalien tarve perustuu riskinarvioon. Hankinta on kiinteistön omistajan vastuulla.`,

    'Huolto ja kunnossapito': `Tarkastusohje:
- Kysy, miten suojan huollosta ja kunnossapidosta huolehditaan.
- Tarkasta, milloin määräaikaistarkastus ja tiiveyskoe on viimeksi tehty (väh. 10 vuoden välein).

Info:
- Säännöllinen huolto ja tarkastus varmistavat suojan toimintakunnon. Laitteet vanhenevat ja tiivisteet kovettuvat, vaikka suojaa ei käytettäisikään.`,

    'Käyttöönoton suunnittelu': `Tarkastusohje:
- Kysy, onko väestönsuojan käyttöönottoa varten suunnitelmaa ja nimettyä vastuuhenkilöä.
- Arvioi, onko käyttöönotto mahdollista toteuttaa 72 tunnin kuluessa.

Info:
- Suojan käyttöönotto vaatii suunnittelua, erityisesti jos suojaa käytetään rauhan aikana varastona. Tavarat on pystyttävä siirtämään pois 72 tunnin varoitusajalla.`,

    // Muu lämmityslaitteisto
    'Lämmityslaitteiston rakenteet ja kunto': `Tarkastusohje:
- Tarkasta laitteiston (esim. hake/pelletti) ja hormin yleiskunto sekä yhteensopivuus.
- Varmista, että suojaetäisyydet ja takapalosuojaukset ovat kunnossa.

Info:
- Erityisesti kiinteän polttoaineen laitteistoissa takapalon riski on olemassa. Laitteiston tulee olla asennettu valmistajan ohjeiden mukaisesti.`,

    'Huolto- ja kunnossapito (sis. nuohous)': `Tarkastusohje:
- Kysy laitteiston huolto- ja nuohouskäytännöistä. Varmista, että ne tehdään säännöllisesti.

Info:
- Säännöllinen huolto ja nuohous ovat keskeisiä paloturvallisuuden kannalta ja varmistavat laitteiston toiminnan.`,
    
    'Kattilahuone': `Tarkastusohje:
- Varmista, että kattilahuone on palo-osastoitu vaatimusten mukaisesti.
- Tarkasta, ettei tilassa säilytetä sinne kuulumatonta palavaa materiaalia.

Info:
- Kattilahuone ei ole varasto. Siellä saa säilyttää vain vähäisen määrän polttoainetta.`,
    
    // TURVALLISUUDEN SUUNNITTELU
    'Vaarojen ja riskien arviointi': `Tarkastusohje:
- Arvioi, onko arviointiprosessi suunnitelmallinen ja kohteeseen sopiva. Varmista, että kaikki oleelliset onnettomuusriskit (sekä sisäiset että ulkoiset) on tunnistettu. Arvioi myös, onko riskeille suunniteltu riittävät ja turvalliset hallintakeinot.

Info:
- Riskien arviointi on prosessi, jolla tunnistetaan vaarat ja arvioidaan niiden merkitys. Tunnistettuja riskejä voivat olla mm. tulipalot, tapaturmat, sekä ulkoiset uhat kuten sääilmiöt. Jokaiseen tunnistettuun riskiin tulee suunnitella hallintakeinot (esim. rakenteelliset, tekniset tai toiminnalliset), jotka ovat suhteessa riskin suuruuteen.`,

    'Pelastussuunnitelma': `Tarkastusohje:
- Varmista, että pelastussuunnitelma on laadittu ja se on ajan tasalla (päivitys väh. vuosittain). Arvioi, sisältääkö suunnitelma selkeät osiot: 1) Riskienarvioinnin johtopäätökset (syyt & seuraukset), 2) Kuvaus turvallisuusjärjestelyistä, 3) Ohjeet onnettomuuksien ehkäisyyn, ja 4) Toimintaohjeet onnettomuustilanteisiin. Varmista, että suunnitelmasta on tiedotettu henkilöstölle ja asukkaille.

Info:
- Pelastussuunnitelma on lakisääteinen tietyissä kohteissa (esim. väh. 3 asunnon asuinkerrostalot). Sen tulee olla käytännönläheinen asiakirja, joka ohjaa turvalliseen toimintaan. Hyvä suunnitelma on havainnollinen (kuvia, karttoja) ja sen sisältö on jalkautettu koko organisaatiolle säännöllisellä koulutuksella.`,

    // LAITTEET JA VARUSTEET
    'Alkusammutuskalusto': `Tarkastusohje:
- Tarkasta, että sammuttimet ovat helposti saatavilla, merkityillä paikoilla ja niiden tarkastusleima on voimassa. Painemittarin tulee olla vihreällä alueella.

Info:
- Nyrkkisääntö on vähintään yksi sammutin per 200-300 m². Kuivissa tiloissa tarkastusväli on 2 vuotta, kosteissa ja tärinälle alttiissa tiloissa 1 vuosi.`,
    
    'Palovaroittimet': `Tarkastusohje:
- Varmista, että palovaroittimia on vähintään yksi jokaista alkavaa 60 neliömetriä kohden per kerros. Testaa toiminta testinapista.

Info:
- Palovaroitin on pakollinen jokaisessa asunnossa. Se tulee uusia vähintään 10 vuoden välein. Puhdista varoitin pölystä säännöllisesti.`,

    'Sähköverkkoon kytketyt palovaroittimet': `Tarkastusohje:
- Varmista, että varoittimet on kytketty sähköverkkoon ja että niiden varavirran lähde (akku/paristo) on toimintakunnossa. 
- Testaa toiminta testinapista.

Info:
- Uudisrakennuksissa (1.2.2009 jälkeen) sähköverkkoon kytketyt palovaroittimet ovat olleet pakollisia. Myös nämä tulee uusia 10 vuoden välein.`,
    
    'Palovaroitinjärjestelmä': `Tarkastusohje:
- Kysy järjestelmän huolto- ja testaushistoriaa. Varmista, että järjestelmälle on nimetty hoitaja.
- Tarkasta keskuksen tila ja mahdolliset vikailmoitukset.

Info:
- Palovaroitinjärjestelmä vaatii säännöllistä huoltoa ja testausta valmistajan ohjeiden mukaan. Se ei yleensä ole kytketty hätäkeskukseen.`,
    
    'Paloilmoitin ilman hätäkeskusyhteyttä': `Tarkastusohje:
- Kuten palovaroitinjärjestelmä, varmista huolto-ohjelma ja vastuuhenkilö. Tarkasta keskuksen tila.
- Varmista, että opasteet ja käyttöohjeet ovat selkeästi esillä.

Info:
- Järjestelmä vaatii säännöllistä huoltoa ja määräaikaistarkastuksia. Toiminnan varmistaminen on kiinteistön vastuulla.`,

    'Hätäkeskukseen kytketty paloilmoitin': `Tarkastusohje:
- Tarkasta, että määräaikaistarkastus on voimassa (tarra keskuksessa, max 3 vuotta vanha).
- Kysy kuukausittaisten yhteyskokeilujen ja huoltojen kirjanpidosta.
- Tarkasta, ettei keskuksessa ole tarpeettomia irtikytkentöjä.

Info:
- Laitteiston hoidosta tulee olla nimetty vastuuhenkilö. Kaikki muutokset ja huollot tulee suorittaa hyväksytyn asennusliikkeen toimesta. Vikavalvonta on järjestettävä.`,

    'Automaattinen sammutuslaitteisto': `Tarkastusohje:
- Tarkasta, että määräaikaistarkastus on voimassa (yleensä 2-4 vuoden välein).
- Kysy huoltopäiväkirjaa. Varmista, että keskuksen paineet ovat normaalit ja venttiilit oikeissa asennoissa.

Info:
- Laitteiston toimintakunto on varmistettava säännöllisellä huollolla ja hyväksytyn tarkastuslaitoksen suorittamilla määräaikaistarkastuksilla. Kiinteistön omistaja vastaa kunnossapidosta. Varmista, että sprinklerisuuttimien ympärillä on riittävästi vapaata tilaa, jotta vesisuihku pääsee leviämään esteettä.`,

    'Savunpoisto': `Tarkastusohje:
- Varmista, että savunpoistojärjestelmälle on olemassa kunnossapito-ohjelma ja sitä noudatetaan.
- Kysy, milloin laitteisto on viimeksi huollettu ja testattu. Tarkasta, että testauksista pidetään kirjaa.
- Tarkasta laukaisukeskuksen, käsilaukaisimien ja savunpoistoluukkujen opasteiden ja merkintöjen selkeys ja näkyvyys.
- Varmista, että laukaisukeskuksen yhteydessä on ajantasainen paikantamiskaavio ja käyttöohje.
- Testaa savunpoiston toiminta, jos mahdollista ja sovittu (esim. porrashuoneen savunpoistoluukun avautuminen).

Info:
- Savunpoiston tarkoituksena on poistaa savua ja lämpöä, jotta poistuminen on turvallista ja pelastustoiminta helpottuu. Järjestelmän toimintavarmuus on kriittistä, ja se vaatii säännöllistä testausta ja huoltoa.`,
    
    'Kaasusammutuslaitteisto': `Tarkastusohje:
- Kysy huolto-ohjelmasta ja määräaikaistarkastuksista.
- Varmista, että suojattu tila on merkitty ja laukaisusta varoittavat hälytyslaitteet ovat toiminnassa.

Info:
- Kaasusammutuslaitteisto vaatii erityisosaamista vaativaa huoltoa. Kiinteistön on varmistettava, että henkilöstö tietää, miten toimia, jos järjestelmä laukeaa, koska happipitoisuus tilassa laskee.`,
    
    'Kiinteät sammutusvesiputkistot': `Tarkastusohje:
- Tarkasta nousujohtojen (kuiva- tai märkänousu) merkinnät ja liittimien kunto.
- Varmista, että paineenkorotuspumput on huollettu ja testattu.

Info:
- Putkistojen toimintakunto tulee varmistaa säännöllisesti. Erityisesti kuivanousujen venttiilien toimivuus ja putkiston tyhjyys on varmistettava jäätymisvaaran vuoksi.`,
};
