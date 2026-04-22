
import { GoogleGenAI, Type } from "@google/genai";
import { Observation } from '../types';

// The instructions state that process.env.API_KEY is pre-configured and accessible.
// A check is added for robustness, but the app should be built in an environment where this is set.
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
} else {
    console.warn("API key not found in process.env.API_KEY. AI features will be disabled.");
}

interface TargetInfo {
    target?: string;
    address?: string;
    representatives?: string[];
}

export const generateTargetInfo = async (target: string, address: string): Promise<TargetInfo> => {
    if (!ai) {
        throw new Error("Gemini AI client is not initialized. API key might be missing.");
    }

    const prompt = `
        Toimi palotarkastajan avustajana. Annettuina tietoina on tarkastuskohde ja/tai sen osoite. Etsi näillä tiedoilla seuraavat asiat:
        - Kohteen virallinen nimi.
        - Tarkka ja täydellinen osoite.
        - Mahdollisen isännöitsijän, kiinteistöhuollon tai muun vastuuhenkilön nimi ja yhteystiedot.

        Annetut tiedot:
        Kohteen nimi: "${target}"
        Osoite: "${address}"

        OHJEET:
        1.  Palauta vastauksesi JSON-muodossa.
        2.  Objektin tulee sisältää avaimet "target", "address" ja "representatives".
        3.  "representatives" tulee olla lista merkkijonoja, joissa on henkilön nimi ja yhteystiedot, esim. ["Matti Meikäläinen (Isännöitsijä, Puh: 010 123 4567)"].
        4.  Jos jokin tieto ei ole julkisesti saatavilla, jätä sen avaimen arvo tyhjäksi merkkijonoksi ("") tai listan tapauksessa tyhjäksi listaksi ([]).
        5.  Älä lisää mitään ylimääräistä tekstiä tai selityksiä vastaukseen. Vain JSON-objekti.
        
        ESIMERKKIVASTAUS:
        {
            "target": "Asunto Oy Esimerkkitalo",
            "address": "Esimerkkikatu 1 A, 00100 Helsinki",
            "representatives": [
                "Matti Meikäläinen (Esimerkki Isännöinti Oy, Puh: 010 123 4567)",
                "Huoltoyhtiö Virtanen (Puh: 020 765 4321)"
            ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        target: { type: Type.STRING, description: "Kohteen nimi" },
                        address: { type: Type.STRING, description: "Kohteen osoite" },
                        representatives: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Lista kohteen edustajista"
                        }
                    },
                }
            }
        });

        const text = response.text;
        const jsonResponse = JSON.parse(text);
        
        return {
            target: jsonResponse.target || undefined,
            address: jsonResponse.address || undefined,
            representatives: jsonResponse.representatives || undefined,
        };

    } catch (error) {
        console.error("Error generating target info with Gemini:", error);
        throw new Error("Failed to generate target information. Check console for details.");
    }
};

export const generateSingleCorrectionOrder = async (observation: Observation, standardOrdersForTopic: string[], guidance?: string): Promise<string[]> => {
    if (!ai) {
        throw new Error("Gemini AI client is not initialized. API key might be missing.");
    }
    
    if (!observation.description) {
        return [];
    }

    const prompt = standardOrdersForTopic.length > 0
        ? `
        Toimi palotarkastusviranomaisena. Laadi annetusta puutteesta TÄSMÄLLEEN KOLME (3) erilaista, vaihtoehtoista korjausmääräystä.

        Yhdistä jokaiseen laatimaasi määräykseen sille parhaiten sopiva vakiomääräys annetusta listasta.

        OHJEET:
        1.  Luo ensin ytimekäs, velvoittava korjausmääräys perustuen annettuun puutteen kuvaukseen.
        2.  Valitse sitten ANNETUISTA VAKIOMÄÄRÄYKSISTÄ se, joka parhaiten vastaa tilannetta.
        3.  Yhdistä nämä kaksi osaa yhdeksi merkkijonoksi, tyypillisesti kahdeksi peräkkäiseksi virkkeeksi. Varmista, että lopputulos on luonnollinen ja virallinen.
        4.  Toista tämä prosessi kolme kertaa luodaksesi kolme hieman erilaista variaatiota.
        5.  Vastauksen on oltava JSON-muodossa. Palauta objekti, jossa on avain "orders" ja sen arvona on lista, joka sisältää TÄSMÄLLEEN KOLME yhdistettyä merkkijonoa (string[]).

        ANNETUT TIEDOT:
        Puute: "${observation.topic}: ${observation.description}"
        ${guidance ? `\nTARKASTUSOHJE VIHJEeksi:\n"${guidance}"` : ''}

        SAATAVILLA OLEVAT VAKIOMÄÄRÄYKSET (valitse näistä):
        ${standardOrdersForTopic.map(order => `- "${order}"`).join('\n')}

        ESIMERKKI:
        Jos puute olisi "Alkusammutuskalusto: Sammuttimen tarkastusleima on vanhentunut." ja yksi vakiomääräyksistä olisi "Käsisammuttimet on tarkastettava (Pelastuslaki 379/2011 12 §).", hyvä vastaus olisi:
        {
            "orders": [
                "Kohteen käsisammuttimien tarkastus on vanhentunut ja ne tulee tarkastuttaa välittömästi. Käsisammuttimet on tarkastettava (Pelastuslaki 379/2011 12 §).",
                "Käsisammuttimien määräaikaistarkastus on suoritettava viipymättä. Käsisammuttimet on tarkastettava (Pelastuslaki 379/2011 12 §).",
                "Varmistakaa, että käsisammuttimet tarkastetaan asianmukaisesti. Käsisammuttimet on tarkastettava (Pelastuslaki 379/2011 12 §)."
            ]
        }
    `
    : `
        Toimi palotarkastusviranomaisena. Laadi annetusta puutteesta TÄSMÄLLEEN KOLME (3) erilaista, vaihtoehtoista korjausmääräystä.

        OHJEET:
        1.  Jokaisen määräyksen tulee olla lyhyt, ytimekäs ja velvoittava.
        2.  Hyödynnä annettua tarkastusohjetta luodaksesi asiantuntevan ja perustellun määräyksen.
        3.  Variaatio: Kirjoita jokainen määräys hieman eri sanamuodolla, mutta säilytä virallinen sävy.
        4.  ÄLÄ mainitse lakipykäliä.
        5.  Vastauksen on oltava JSON-muodossa. Palauta objekti, jossa on avain "orders" ja sen arvona on lista, joka sisältää TÄSMÄLLEEN KOLME merkkijonoa (string[]).

        ANNETUT TIEDOT:
        Puute: "${observation.topic}: ${observation.description}"
        ${guidance ? `\nTARKASTUSOHJE VIHJEeksi:\n"${guidance}"` : ''}

        ESIMERKKI:
        Jos puute olisi "Osoitemerkintä: Numerokilpi on ruostunut ja kasvillisuuden peitossa.", hyvä vastaus olisi:
        {
            "orders": [
                "Kiinteistön osoitenumerointi on kunnostettava siten, että se on selkeästi luettavissa tieltä.",
                "Rakennuksen osoitemerkintä tulee saattaa sellaiseen kuntoon, että se on havaittavissa vaivattomasti.",
                "Osoitenumeron näkyvyys on varmistettava kaikissa olosuhteissa poistamalla näköesteet ja korjaamalla merkintä."
            ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        orders: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Lista TÄSMÄLLEEN kolmesta korjausmääräyksestä",
                            minItems: 3,
                            maxItems: 3
                        }
                    },
                    required: ["orders"]
                }
            }
        });
        
        const text = response.text;
        const jsonResponse = JSON.parse(text);
        
        if (jsonResponse && Array.isArray(jsonResponse.orders)) {
            return jsonResponse.orders;
        }

        console.warn("AI response for correction orders was not in the expected format:", text);
        return [];
    } catch (error) {
        console.error("Error generating single correction order with Gemini:", error);
        throw new Error("Failed to generate single correction order. Check console for details.");
    }
};

export const findMatchingStandardOrder = async (description: string, standardOrders: string[]): Promise<string | null> => {
    if (!ai) {
        throw new Error("Gemini AI client is not initialized. API key might be missing.");
    }
    if (!description || standardOrders.length === 0) {
        return null;
    }

    const prompt = `
        Olet palotarkastajan asiantunteva avustaja. Tehtäväsi on yhdistää vapaamuotoinen puutteen kuvaus annettuun listaan virallisia vakiomääräyksiä.

        ANNETUT TIEDOT:
        Puutteen kuvaus: "${description}"
        
        Saatavilla olevat vakiomääräykset:
        ${standardOrders.map(order => `- "${order}"`).join('\n')}

        OHJEET:
        1.  Analysoi puutteen kuvaus huolellisesti.
        2.  Valitse annetuista vakiomääräyksistä YKSI, joka parhaiten vastaa kuvattua puutetta.
        3.  Vastauksesi TÄYTYY olla JSON-objekti, jossa on yksi avain, "matchingOrder".
        4.  Avaimen "matchingOrder" arvon on oltava TÄSMÄLLEEN sama merkkijono kuin valitsemasi vakiomääräys.
        5.  Jos mikään vakiomääräys ei ole selkeästi sopiva, palauta tyhjä merkkijono avaimen "matchingOrder" arvona.

        ESIMERKKI:
        Jos kuvaus olisi "sammuttimen leima on vanha" ja yksi vakiomääräyksistä olisi "Käsisammuttimet on tarkastettava (Pelastuslaki 379/2011 12 §).", vastauksesi olisi:
        {
            "matchingOrder": "Käsisammuttimet on tarkastettava (Pelastuslaki 379/2011 12 §)."
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchingOrder: {
                            type: Type.STRING,
                            description: "The single best matching standard order text from the provided list."
                        }
                    },
                    required: ["matchingOrder"]
                }
            }
        });
        
        const text = response.text;
        const jsonResponse = JSON.parse(text);
        
        if (jsonResponse && typeof jsonResponse.matchingOrder === 'string' && jsonResponse.matchingOrder.trim() !== '') {
            return jsonResponse.matchingOrder;
        }

        console.warn("AI did not find a suitable match or response was not in the expected format:", text);
        return null;
    } catch (error) {
        console.error("Error finding matching standard order with Gemini:", error);
        throw new Error("Failed to find a matching order. Check console for details.");
    }
};

export const generateSafetyObservation = async (observation: Observation, guidance?: string): Promise<string[]> => {
    if (!ai) {
        throw new Error("Gemini AI client is not initialized. API key might be missing.");
    }
    
    if (!observation.description) {
        return [];
    }

    const prompt = `
        Toimi palotarkastajan avustajana. Tehtäväsi on laatia annetusta aiheesta ja puutteen kuvauksesta TÄSMÄLLEEN KOLME (3) erilaista, ytimekästä ja ammattimaista suositusta.

        OHJEET:
        1.  Yhdistä annettu aihe ja kuvaus yhdeksi selkeäksi virkkeeksi, joka toteaa puutteen.
        2.  Lisää toinen virke, joka antaa selkeän suosituksen asian korjaamiseksi.
        3.  Hyödynnä annettua tarkastusohjetta luodaksesi asiantuntevan ja perustellun suosituksen.
        4.  Kirjoita kolme hieman erilaista versiota tästä suosituksesta. Säilytä virallinen, mutta suositteleva sävy.
        5.  Vastauksen on oltava JSON-muodossa. Palauta objekti, jossa on avain "observations" ja sen arvona on lista, joka sisältää TÄSMÄLLEEN KOLME merkkijonoa (string[]).

        ANNETUT TIEDOT:
        Aihe: "${observation.topic}"
        Puutteen kuvaus: "${observation.description}"
        ${guidance ? `\nTARKASTUSOHJE VIHJEeksi:\n"${guidance}"` : ''}

        ESIMERKKI:
        Jos aihe olisi "Pelastussuunnitelma", kuvaus "päivittämättä" ja ohje "Varmista, että suunnitelma on ajan tasalla", hyvä vastaus olisi:
        {
            "observations": [
                "Kohteen pelastussuunnitelma on päivittämättä. Suositellaan saattamaan se ajantasalle vastaamaan nykytilannetta.",
                "Pelastussuunnitelma on vanhentunut, ja se tulee päivittää viipymättä, jotta se ohjaa toimintaa oikein onnettomuustilanteessa.",
                "Kiinteistön pelastussuunnitelma ei ole ajan tasalla. On suositeltavaa päivittää se, jotta turvallisuusjärjestelyt ovat tiedossa."
            ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        observations: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Lista TÄSMÄLLEEN kolmesta suosituksesta",
                            minItems: 3,
                            maxItems: 3
                        }
                    },
                    required: ["observations"]
                }
            }
        });
        
        const text = response.text;
        const jsonResponse = JSON.parse(text);
        
        if (jsonResponse && Array.isArray(jsonResponse.observations)) {
            return jsonResponse.observations;
        }

        console.warn("AI response for safety observations was not in the expected format:", text);
        return [];
    } catch (error) {
        console.error("Error generating safety observations with Gemini:", error);
        throw new Error("Failed to generate safety observations. Check console for details.");
    }
};

export const generatePositiveObservation = async (observation: Observation): Promise<string[]> => {
    if (!ai) {
        throw new Error("Gemini AI client is not initialized. API key might be missing.");
    }

    const prompt = `
        Toimi palotarkastajana. Tehtäväsi on laatia annetusta kunnossa olevasta asiasta TÄSMÄLLEEN KOLME (3) erilaista, vaihtoehtoista positiivista havaintoa.

        OHJEET:
        1.  Jokaisen havainnon tulee todeta, että asia on kunnossa ja vaatimusten mukainen.
        2.  Variaatio: Kirjoita jokainen havainto hieman eri sanankääntein. Käytä monipuolista ja kuvailevaa kieltä ja vältä toistamasta sanaa "asianmukaisesti".
        3.  Käytä annettua kontekstia (alakategoria) luodaksesi tarkan ja kuvaavan havainnon.
        4.  Aloita lause suoraan kohteella (esim. "Pelastussuunnitelma..."), ÄLÄ käytä ilmaisua "Tarkastuksessa todettiin...".
        5.  Vastauksen on oltava JSON-muodossa. Palauta objekti, jossa on avain "observations" ja sen arvona on lista, joka sisältää TÄSMÄLLEEN KOLME merkkijonoa (string[]).

        ANNETTU KOHDE:
        Tarkastuskohde: "${observation.topic}"
        Alakategoria: "${observation.subCategory}"

        ESIMERKKI:
        Jos kohde olisi "Merkintä" ja alakategoria "Pelastustie", hyvä vastaus olisi:
        {
            "observations": [
                "Pelastustien merkinnät olivat selkeät ja vaatimusten mukaiset.",
                "Kiinteistön pelastustie oli merkitty asianmukaisesti ja opasteet olivat hyvässä kunnossa.",
                "Pelastustien opasteet olivat näkyvillä ja täyttivät niille asetetut vaatimukset."
            ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        observations: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Lista TÄSMÄLLEEN kolmesta positiivisesta havainnosta",
                            minItems: 3,
                            maxItems: 3
                        }
                    },
                    required: ["observations"]
                }
            }
        });
        
        const text = response.text;
        const jsonResponse = JSON.parse(text);
        
        if (jsonResponse && Array.isArray(jsonResponse.observations)) {
            return jsonResponse.observations;
        }

        console.warn("AI response for positive observations was not in the expected format:", text);
        return [];
    } catch (error) {
        console.error("Error generating positive observation with Gemini:", error);
        throw new Error("Failed to generate positive observation. Check console for details.");
    }
};


export const isAiAvailable = (): boolean => !!ai;