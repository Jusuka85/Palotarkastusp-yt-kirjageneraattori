import React from 'react';

interface UserGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="mt-6">
        <h3 className="text-xl font-bold border-b border-slate-300 dark:border-slate-600 pb-2 mb-3">{title}</h3>
        {children}
    </div>
);

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold">Sovelluksen Käyttöohje</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="overflow-y-auto p-6 prose prose-slate dark:prose-invert max-w-none">
                    
                    <GuideSection title="Pikaopas: Näin teet raportin 5 vaiheessa">
                        <ol>
                            <li><strong>Aloita:</strong> Täytä "Perustiedot" ja "Tarkastuksen kulku".</li>
                            <li><strong>Tarkasta:</strong> Käy läpi "Tarkistuslista". Merkitse jokainen kohta joko <strong>OK</strong>, <strong>Puute</strong> tai <strong>Suositus</strong>. Kirjoita kuvaus ja hyödynnä vakiomääräyksiä.</li>
                            <li><strong>Viimeistele:</strong> Tarkista ja muokkaa "Korjausmääräykset" ja "Suositukset" -listoja. Täytä loput osiot ("Kuuleminen", "Liitteet").</li>
                            <li><strong>Tallenna työsi:</strong> Käytä "Tallenna nykyinen" tai "Tallenna uutena" -painikkeita. Tiedot tallentuvat selaimeesi.</li>
                            <li><strong>Vie raportti:</strong> Valitse "Lausunto"-näkymä. Sieltä voit kopioida koko raportin tekstimuodossa esimerkiksi sähköpostiin.</li>
                        </ol>
                    </GuideSection>

                    <GuideSection title="1. Perustiedot">
                        <p>Syötä ensin kohteen perustiedot:</p>
                        <ul>
                            <li><strong>Kohteen nimi ja osoite:</strong> Tarkat tiedot auttavat kohteen tunnistamisessa.</li>
                            <li><strong>Tarkastajat ja Edustajat:</strong> Lisää tai poista kenttiä tarpeen mukaan. Nämä tiedot siirtyvät suoraan lopulliseen raporttiin.</li>
                        </ul>
                    </GuideSection>
                    
                    <GuideSection title="2. Tarkistuslistan tehokas käyttö">
                        <p>Tämä on sovelluksen ydin. Käy läpi tarkastettavat asiat ja kirjaa havaintosi.</p>
                        <ul>
                            <li><strong>Status-painikkeet (OK, Puute, Suositus):</strong> Valitse status, jolloin tekstikenttä avautuu. Voit perua valinnan klikkaamalla samaa painiketta uudelleen.</li>
                             <li><strong>Valitse vakiomääräys:</strong> "Puute"-statuksen yhteydessä voit valita valmiin, lakipykäliin perustuvan vakiomääräyksen. Voit hallita näitä määräyksiä "Korjausmääräykset"-osion alta löytyvästä napista.</li>
                            <li><strong>Väliaikainen OK:</strong> Jos kohta on kunnossa, mutta et halua siitä mainintaa raporttiin, käytä tätä valintaa. Kohde merkitään vihreällä, mutta se ei tule lopulliseen pöytäkirjaan.</li>
                            <li><strong>Profiilit ja listan muokkaus:</strong> Valitse valmis profiili (esim. "Kerrostalo") näyttämään vain oleelliset kohdat. "Muokkaa listaa" -painikkeella voit luoda omia profiileja eri kohdetyypeille.</li>
                            <li><strong>Kohtien piilottaminen:</strong> Voit piilottaa rivejä, ala- tai pääkategorioita väliaikaisesti X-painikkeesta. Saat ne takaisin näkyviin sivun yläreunan "Palauta piilotetut" -painikkeella.</li>
                        </ul>
                    </GuideSection>

                    <GuideSection title="3. Raportin tallennus ja hallinta">
                        <p>Yläpalkin painikkeilla hallitset raporttejasi. Kaikki tallennus tapahtuu <strong>turvallisesti selaimesi paikalliseen muistiin.</strong></p>
                        <dl>
                            <dt><strong>Tallenna nykyinen</strong></dt>
                            <dd>Päivittää ja <strong>ylikirjoittaa</strong> parhaillaan auki olevan raportin. Käytä tätä, kun jatkat saman raportin työstämistä.</dd>
                            
                            <dt><strong>Tallenna uutena</strong></dt>
                            <dd>Luo nykyisestä raportista täysin <strong>uuden kopion</strong>. Käytä tätä, kun haluat käyttää vanhaa raporttia uuden pohjana ilman, että alkuperäinen muuttuu.</dd>

                            <dt><strong>Tallennetut raportit</strong></dt>
                            <dd>Avaa listan kaikista tallentamistasi raporteista. Voit ladata ne muokattavaksi tai poistaa pysyvästi.</dd>

                            <dt><strong>Jaa esitäytettynä</strong></dt>
                            <dd>Luo uniikin linkin, joka sisältää kaikki nykyisen raportin tiedot. Avaa linkki toisella laitteella (esim. puhelimella) ja jatka työtäsi saumattomasti. Erinomainen kenttätyöhön!</dd>

                            <dt><strong>Tyhjennä lomake</strong></dt>
                            <dd>Aloittaa uuden, tyhjän raportin. Varoitus: tämä poistaa kaikki tallentamattomat tiedot.</dd>
                        </dl>
                    </GuideSection>

                    <GuideSection title="4. Viimeistely ja vienti">
                         <p>Kun tarkistus on valmis, siirry "Lausunto"-näkymään. Tämä näkymä muotoilee koko raportin yhtenäiseksi tekstiksi, jonka voit helposti:</p>
                         <ul>
                            <li>Kopioida leikepöydälle ja liittää esimerkiksi sähköpostiin tai toiseen järjestelmään.</li>
                            <li>Lähettää suoraan sähköpostilla käyttäen "Lähetä sähköpostitse" -painiketta.</li>
                        </ul>
                    </GuideSection>

                    <GuideSection title="Tärkeää: Tietosuoja ja tallennus">
                        <p><strong>Kaikki tietosi tallennetaan AINOASTAAN oman selaimesi paikalliseen muistiin.</strong> Mitään tietoja ei lähetetä ulkopuolisille palvelimille.</p>
                        <p className="font-bold">Varoitus: Jos tyhjennät selaimesi "sivustotiedot" (ei pelkkää selaushistoriaa), myös kaikki tallennetut raporttisi poistuvat pysyvästi.</p>
                    </GuideSection>

                </main>
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Sulje</button>
                </footer>
            </div>
        </div>
    );
};

export default UserGuideModal;