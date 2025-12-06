# Bíblia Palavra Viva - PWA

Este projeto é um Progressive Web App (PWA). Isso significa que ele pode ser instalado em celulares (Android e iOS) e computadores, funcionando como um aplicativo nativo, inclusive com suporte offline.

## Como funciona o PWA

1.  **Manifesto (`manifest.json`)**: Define o nome, ícones, cores e o comportamento "standalone" (sem barra de navegação do navegador).
2.  **Service Worker (`service-worker.js`)**: Um script que roda em segundo plano. Ele salva os arquivos do site no cache do navegador. Assim, quando você abre o app sem internet, ele carrega instantaneamente.

## Como instalar no celular

### Android (Chrome)
1.  Acesse o site.
2.  Geralmente aparecerá uma barra inferior "Adicionar Bíblia Palavra Viva à tela inicial".
3.  Se não aparecer, toque nos três pontinhos do navegador e selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.

### iPhone (Safari)
1.  Acesse o site pelo Safari.
2.  Toque no botão **Compartilhar** (o quadrado com uma seta para cima).
3.  Role para baixo e toque em **"Adicionar à Tela de Início"**.

## Deploy na Vercel

O deploy é automático se este repositório estiver conectado à Vercel.

1.  Certifique-se de que a estrutura de pastas está correta (arquivos `manifest.json`, `service-worker.js` e a pasta `icons` devem estar dentro de `public/`).
2.  Ao fazer o `git push`, a Vercel detectará as mudanças e publicará a nova versão.
3.  **Importante:** Na Vercel, adicione a variável de ambiente `API_KEY` com sua chave do Google Gemini para que a IA funcione.

---

*Nota sobre ícones: O projeto utiliza ícones SVG para máxima compatibilidade e leveza. Se precisar de ícones PNG específicos para lojas de aplicativos, substitua os arquivos em `/public/icons/` e atualize o `manifest.json`.*