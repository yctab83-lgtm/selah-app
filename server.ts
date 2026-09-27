import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client utility
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Analyze Brain Dump with Scripture Feedback in Afrikaans
app.post('/api/analyze-brain-dump', async (req, res) => {
  try {
    const { brainDumpText } = req.body;

    if (!brainDumpText || typeof brainDumpText !== 'string' || !brainDumpText.trim()) {
      return res.status(400).json({ error: 'Geen teks verskaf vir ontleding nie.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response with authentic Biblical wisdom and 1983-vertaling verses
      const fallbackInsight = 'Neem elke angstige of oorweldigende gedagte gevange (2 Korintiërs 10:5). Wanneer vrees of stres aan jou deur klop, stuur geloof om die deur oop te maak.';
      return res.json({
        summary: 'Jou gedagtes weerspieël die behoefte aan rus, helderheid en die hernuwing van jou gemoed.',
        encouragingMessage:
          'Onthou: Jy kan nie \'n positiewe lewe leef met \'n negatiewe gemoed nie. Die ware stryd vind plaas in jou denke. Moenie probeer om môre se probleme vandag op te los nie. Gee jouself genade en kies vrede vir hierdie oomblik.',
        spiritualInsight: fallbackInsight,
        recommendedScriptures: [
          {
            reference: 'Filippense 4:6-7 (1983-vertaling)',
            text: 'Moet oor niks besorg wees nie, maar maak in alles julle begeertes deur gebed en smeking en met danksegging aan God bekend. En die vrede van God, wat alle verstand te bowe gaan, sal oor julle harte en gedagtes die wag hou in Christus Jesus.',
            practicalApplication: 'Stop en omskep die drie grootste dinge waaroor jy nou dink in konkrete dankgebede.'
          },
          {
            reference: '2 Korintiërs 10:4-5 (1983-vertaling)',
            text: 'Die wapens van ons stryd is nie dié van die wêreld nie, maar kragtig deur God om vestings te breek... en ons neem elke gedagte gevange om dit aan Christus gehoorsaam te maak.',
            practicalApplication: 'Sê hardop: "Ek weier om hierdie bekommernis toe te laat om my vreugde te steel. God is in beheer."'
          },
          {
            reference: 'Matteus 6:34 (1983-vertaling)',
            text: 'Moet julle dus nie oor môre bekommer nie, want môre bring sy eie bekommernis. Elke dag het genoeg aan sy eie kwaad.',
            practicalApplication: 'Fokus slegs op die heel volgende regte stap vir vandag.'
          }
        ]
      });
    }

    const prompt = `Jy is 'n liefdevolle, wyse Christelike mentor wat fokus op praktiese Bybelse wysheid, die vernuwing van die denke en innerlike rus.
Die gebruiker het hul rou breinstorting / gedagte-uitstorting ("brain dump") gedeel in Afrikaans:
"""${brainDumpText}"""

Ontleed hierdie gedagtes en gee diep bemoedigende, praktiese Bybelse terugvoer IN AFRIKAANS.
Gebruik ALTYD die Afrikaanse Bybelvertaling (1983-vertaling of 1933/53-vertaling).

Antwoord in presiese JSON-formaat met die volgende struktuur:
{
  "summary": "Kort opsomming van die kerngevoelens of -temas (1-2 sinne)",
  "encouragingMessage": "Praktiese, warm geestelike bemoediging oor die denke, vryheid van skuld en vrede (3-4 sinne)",
  "spiritualInsight": "'n Kern-insig oor hoe om hierdie gedagtes gevange te neem en vandag in vrede te leef (2 sinne)",
  "recommendedScriptures": [
    {
      "reference": "Skrifverwysing (bv. Filippense 4:6-7 (1983-vertaling))",
      "text": "Die presiese teks in Afrikaans (1983-vertaling of 1933/53)",
      "practicalApplication": "Praktiese handeling om vandag toe te pas"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '';
    const parsedData = JSON.parse(outputText);
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Fout met KI-breinstorting ontleding:', err);
    // Return structured graceful Afrikaans response
    const fallbackInsight = 'Neem jou gedagtes gevange en praat die Woord van God hardop oor jou omstandighede uit.';
    return res.json({
      summary: 'Gedagtes wat verlang na rus en Goddelike perspektief.',
      encouragingMessage:
        'Die Woord herinner ons: God verwag nie van jou om volmaak te wees nie, net om Hom te vertrou en aan te hou vorentoe beweeg. Rus vandag in Sy voldoende genade.',
      spiritualInsight: fallbackInsight,
      recommendedScriptures: [
        {
          reference: 'Filippense 4:6-7 (1983-vertaling)',
          text: 'Moet oor niks besorg wees nie, maar maak in alles julle begeertes deur gebed en smeking en met danksegging aan God bekend.',
          practicalApplication: 'Laat vaar die beheer en vertrou God met die uitkoms.'
        },
        {
          reference: 'Jesaja 40:31 (1983-vertaling)',
          text: 'Maar dié wat op die Here vertrou, kry nuwe krag. Hulle vlieg met arendsvlerke, hulle hardloop en word nie moeg nie.',
          practicalApplication: 'Asem diep in en ontvang vars geestelike krag vir hierdie dag.'
        }
      ]
    });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Selah bediener hardloop op poort ${port}`);
});
