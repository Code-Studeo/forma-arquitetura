# FORMA ARQUITETURA

Site institucional de arquitetura e interiores. **“Espaços que fazem sentido.”**

## Tecnologias

O projeto usa HTML semântico, CSS e JavaScript nativos para manter carregamento rápido, acessibilidade e publicação simples.
Um servidor Node leve atende somente ao desenvolvimento local; não há framework nem dependências de runtime.

## Executar

Requer Node.js 20 ou superior.

```bash
npm run dev
```

Abra <http://localhost:4174>. Para conferir a estrutura e executar os testes:

```bash
npm run build
npm test
```

## Recursos

- Layout responsivo, navegação móvel acessível e foco visível.
- Hero fotográfico, animações de entrada, parallax discreto e respeito a `prefers-reduced-motion`.
- Portfólio com filtros por categoria e detalhes em modal.
- Processo criativo navegável por teclado e FAQ expansível.
- Formulário de briefing validado no navegador. Ainda não conectado a um canal de atendimento; não envia nem armazena dados.
- SEO básico, Open Graph, favicon local e carregamento tardio de imagens abaixo da dobra.

## Imagens

As cinco imagens fornecidas para o projeto estão em `public/images/`, em JPEG otimizado e na resolução original. O arquivo `public/images/SOURCES.md` registra a correspondência com os nomes originais.

## Estrutura

```text
index.html                 página e conteúdo
styles.css                 identidade visual e responsividade
app.js                     navegação e interações
server.mjs                 servidor de desenvolvimento local
scripts/check-build.mjs    verificação de arquivos e assets
test/site.test.mjs         testes automatizados com node:test
public/favicon.svg         ícone local
public/images/             imagens de arquitetura e interiores
imagens-referencia/        referências visuais originais
```

## Publicar na Vercel

1. Envie esta pasta para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Selecione **Other** como framework e deixe build command e output directory vazios.
4. Publique. Não há variáveis de ambiente nem chaves a configurar.

O servidor `server.mjs` serve apenas ao desenvolvimento local; a Vercel publica os arquivos estáticos.

## Antes de publicar

Conecte o formulário a um canal de atendimento próprio e revise os dados institucionais antes de publicar.
