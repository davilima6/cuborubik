# 🎲 Cubo Mágico Interativo

Um app educativo completo para aprender a resolver o Cubo de Rubik, com visualização 3D/2D, tutoriais passo a passo e modo prática.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.160-000000?logo=three.js)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

---

## 📚 Índice

- [Funcionalidades](#-funcionalidades)
- [Como Usar](#-como-usar)
  - [Modo Tutorial](#-modo-tutorial)
  - [Modo Prática](#-modo-prática)
  - [Controles Mobile](#-controles-mobile)
- [Atalhos de Teclado](#-atalhos-de-teclado)
- [Notação de Movimentos](#-notação-de-movimentos)
- [Configurações](#️-configurações)
- [Rodando Localmente](#-rodando-localmente)

---

## ✨ Funcionalidades

### 🎯 Dois Modos de Aprendizado

| Modo | Descrição |
|------|-----------|
| **Tutorial** | Guia passo a passo para iniciantes, desde a cruz branca até resolver o cubo todo |
| **Prática** | Modo livre para treinar movimentos e testar algoritmos |

### 🖥️ Visualização Flexível

- **WebGL (3D)**: Cubo rotativo em 3D com animações suaves
- **Canvas (2D)**: Visualização planificada, ótima para entender as faces

### 🌍 Bilíngue

Interface disponível em **Português** e **Inglês** — troque a qualquer momento!

### 📱 Otimizado para Mobile

- Controles touch nas bordas da tela
- Modo tela cheia para melhor visualização
- Layout adaptativo sem scroll desnecessário

---

## 🎮 Como Usar

### 📖 Modo Tutorial

O modo tutorial te guia por **6 fases** para resolver o cubo do zero:

1. **Cruz Branca** — Forme a cruz na face branca
2. **Cantos Brancos** — Complete a primeira camada
3. **Segunda Camada** — Posicione as peças do meio
4. **Cruz Amarela** — Forme a cruz no topo
5. **Cantos Amarelos** — Posicione os cantos
6. **Camada Final** — Finalize a resolução!

#### Como navegar:

| Botão | Ação |
|-------|------|
| ⬅️ | Passo anterior |
| ▶️ | Executar movimento do passo atual |
| ➡️ | Próximo passo |
| 🔄 | Reiniciar fase atual |

> 💡 **Dica**: Cada passo mostra os movimentos necessários. Clique em "Executar" para ver a animação!

---

### 🏋️ Modo Prática

No modo prática você tem controle total do cubo:

#### Painel de Controles

- **Embaralhar**: Mistura o cubo aleatoriamente (10-20 movimentos)
- **Reiniciar**: Volta o cubo ao estado resolvido
- **Botões de Face**: Clique para executar movimentos (R, L, U, D, F, B)

#### Histórico de Movimentos

O histórico mostra todos os movimentos que você fez:

- **Clique em qualquer movimento** para voltar àquele ponto
- **Checkbox "Animar"**: Quando marcado, a navegação no histórico mostra as animações
- **Setas ⬅️ ➡️**: Navegue um movimento por vez

> 💡 **Dica**: Se você errou, é só clicar no movimento anterior no histórico!

---

### 📱 Controles Mobile

No celular, você tem controles touch especiais:

```
┌─────────────────────────────┐
│      [U]                    │
│                             │
│ [L]      CUBO 3D       [R]  │
│                             │
│      [D]                    │
│                             │
│ [B]                    [F]  │
└─────────────────────────────┘
```

| Toque | Ação |
|-------|------|
| **Toque rápido** | Movimento normal (ex: R) |
| **Toque longo** | Movimento inverso (ex: R') |

#### Modo Tela Cheia

Clique no ícone 🔲 para expandir o cubo e ter mais espaço!

---

## ⌨️ Atalhos de Teclado

No modo prática, use o teclado para movimentos rápidos:

| Tecla | Movimento | Com Shift | Com Ctrl/Cmd |
|-------|-----------|-----------|--------------|
| `U` | Up (Cima) | U' (inverso) | U2 (duplo) |
| `D` | Down (Baixo) | D' | D2 |
| `R` | Right (Direita) | R' | R2 |
| `L` | Left (Esquerda) | L' | L2 |
| `F` | Front (Frente) | F' | F2 |
| `B` | Back (Trás) | B' | B2 |

> 💡 **Dica**: Pratique os atalhos — são muito mais rápidos que clicar nos botões!

---

## 🔤 Notação de Movimentos

O cubo usa a notação internacional padrão:

### Faces

| Letra | Face | Cor (cubo padrão) |
|-------|------|-------------------|
| **R** | Right (Direita) | 🟥 Vermelho |
| **L** | Left (Esquerda) | 🟧 Laranja |
| **U** | Up (Cima) | ⬜ Branco |
| **D** | Down (Baixo) | 🟨 Amarelo |
| **F** | Front (Frente) | 🟩 Verde |
| **B** | Back (Trás) | 🟦 Azul |

### Modificadores

| Símbolo | Significado | Exemplo |
|---------|-------------|---------|
| (nada) | Sentido horário | R = gira direita horário |
| **'** | Sentido anti-horário | R' = gira direita anti-horário |
| **2** | Giro duplo (180°) | R2 = gira direita duas vezes |

### Exemplos

- `R U R' U'` — Algoritmo básico (chamado "Sexy Move")
- `F2 L2 R2 B2` — Giros duplos nas 4 faces laterais

---

## ⚙️ Configurações

### Modo de Renderização

| Modo | Quando usar |
|------|-------------|
| **3D (WebGL)** | Melhor visualização, rotação livre do cubo |
| **2D (Canvas)** | Se seu dispositivo não suporta WebGL ou prefere ver todas as faces |

### Velocidade da Animação

Use o slider para ajustar a velocidade das animações:
- **Lento**: Bom para entender cada movimento
- **Rápido**: Para quando você já manja

### Idioma

Alterne entre 🇧🇷 Português e 🇺🇸 English no seletor do topo.

---

## 🚀 Rodando Localmente

### Pré-requisitos

- Node.js 18+ instalado
- npm ou bun

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPO>

# Entre na pasta
cd cubo-magico

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

O app vai abrir em `http://localhost:5173` 🎉

### Rodando os Testes

```bash
# Testes unitários
npm run test
```

---

## 🧪 Estrutura do Projeto

```
src/
├── components/
│   ├── cube/           # Visualização 3D e 2D do cubo
│   ├── controls/       # Controles, histórico, indicadores
│   ├── tutorial/       # Modo tutorial
│   ├── practice/       # Modo prática
│   ├── mobile/         # Controles touch e fullscreen
│   └── ui/             # Componentes base (shadcn)
├── contexts/
│   └── CubeContext.tsx # Estado global do cubo
├── hooks/
│   ├── use-mobile.tsx  # Detecta dispositivo mobile
│   └── useFullscreen.ts # Controle de tela cheia
└── lib/
    └── rubik/
        ├── cubeLogic.ts    # Lógica de movimentos
        ├── algorithms.ts   # Algoritmos de resolução
        ├── tutorial.ts     # Dados do tutorial
        ├── translations.ts # Traduções pt/en
        └── __tests__/      # Testes unitários
```

---

## 🎓 Próximos Passos

Depois de dominar o básico:

1. **Pratique o método de camadas** — É o mais fácil para iniciantes
2. **Memorize os algoritmos** — Comece pelos mais curtos
3. **Use o modo prática** — Misture e tente resolver sozinho
4. **Cronometre-se** — Tente melhorar seu tempo!

---

## 📝 Licença

Este projeto foi criado com ❤️ usando [Lovable](https://lovable.dev).

---

<p align="center">
  <strong>Bora resolver esse cubo! 🎲✨</strong>
</p>
