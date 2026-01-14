# 🃏 Munchkin – Gerenciador de Partida

Aplicação web simples para **gerenciar partidas do jogo Munchkin**, facilitando o controle de **jogadores, níveis, bônus, buffs, debuffs e penalidades**, tudo em tempo real e de forma visual.

O projeto foi pensado para ser usado **durante a partida**, em celular ou computador, sem necessidade de internet.

---

## 🎯 Objetivo

Ajudar os jogadores a:
- Controlar **nível** e **bônus** de cada personagem
- Calcular automaticamente o **total de poder**
- Registrar **BUFFs e DEBUFFs** como anotações
- Aplicar **penalidades** que afetam o total
- Gerenciar facilmente **adição e remoção de jogadores**

---

## 🚀 Funcionalidades

### 👥 Gerenciamento de Jogadores
- Sempre inicia com **3 jogadores** (mínimo)
- Máximo de **6 jogadores**
- Botão para **adicionar jogador**
- Botão **X** para remover jogador (com confirmação)
- Cada jogador recebe uma **cor de fundo aleatória**
- O estado é salvo automaticamente no navegador

### ✏️ Nome e Gênero
- Clique no **nome do jogador** para editar
- Clique no **símbolo de gênero** para alternar:
  - ♂ Masculino
  - ♀ Feminino

### 📊 Atributos
- **NÍVEL**
  - Valores entre **1 e 9**
- **BÔNUS**
  - Valor mínimo **0**
- **TOTAL**
  - Calculado automaticamente:
    ```
    TOTAL = NÍVEL + BÔNUS + PENALIDADE
    ```

### 🧠 BUFF
- Tela em formato de **bloco de notas**
- Permite escrever qualquer texto livre
- O conteúdo **não é perdido** até ser apagado
- Salvo automaticamente no navegador (localStorage)
- Cada jogador possui seu próprio BUFF

### 💀 DEBUFF
- Também funciona como **bloco de notas**
- Conteúdo salvo automaticamente
- Cada jogador possui seu próprio DEBUFF

#### ⚠️ Penalidade (dentro do DEBUFF)
- Valor inicial: **0**
- Pode ser **0 ou negativo**
- Nunca pode ser positivo
- Botões:
  - **−** → aumenta a penalidade negativa
  - **+** → remove penalidade (só aparece se valor < 0)
  - **ZERAR** → volta a penalidade para 0
- A penalidade afeta diretamente o **TOTAL**
- Quando a penalidade é negativa, o **TOTAL pulsa em vermelho**

### 📱 Responsividade
- Layout adaptado para celular (ex: **Redmi Note 13**)
- Botões maiores para toque
- Layout reorganizado em telas pequenas

---

## 🧱 Estrutura do Projeto
/
├── index.html
├── README.md
└── src/
├── styles/
│ └── styles.css
└── javascript/
└── script.js


---

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (Flexbox + Grid + Media Queries)
- JavaScript (Vanilla JS)
- Font Awesome (ícones)
- localStorage (persistência dos dados)

---

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente usando **localStorage**, incluindo:
- Jogadores
- Nome
- Gênero
- Nível, bônus e penalidade
- Anotações de BUFF e DEBUFF

👉 Mesmo fechando o navegador, os dados permanecem.

---

## 🧪 Como Usar

1. Baixe ou clone o projeto
2. Abra o arquivo `index.html` no navegador
3. Comece a gerenciar a partida

> Não é necessário servidor ou internet.

---

## 🔮 Funcionalidades Futuras (ideias)
- Exibir penalidade diretamente no card principal
- Histórico de buffs/debuffs
- Botão de “Resetar Partida”
- Modo escuro
- Sistema de batalha automatizado

---

## 🃏 Sobre o Munchkin

Munchkin é um jogo de cartas criado por Steve Jackson, focado em humor, batalhas exageradas e sabotagem entre jogadores.  
Esta aplicação **não substitui as regras oficiais**, apenas auxilia no controle da partida.

---

## 📜 Licença

Projeto de uso livre para fins pessoais e recreativos.