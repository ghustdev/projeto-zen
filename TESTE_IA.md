# 🧪 Como Testar se a IA Real Está Funcionando

## 🔍 Verificações Visuais

### 1. **Indicador de Status** (Canto superior direito)
- ✅ **"IA Ativa"** com ponto verde = Gemini funcionando
- ⚠️ **"Modo Local"** com ícone amarelo = Usando respostas automáticas

### 2. **Mensagem de Digitação**
- ✅ **"Neura está analisando..."** = IA real processando
- ⚠️ **"Processando..."** = Modo local

## 🧠 Testes de Comportamento da IA

### Teste 1: **Personalização**
```
Você: "Meu nome é João e tenho 16 anos"
IA Real: Vai lembrar e usar seu nome nas próximas respostas
Modo Local: Resposta genérica sem personalização
```

### Teste 2: **Contexto Complexo**
```
Você: "Estou com ansiedade porque tenho ENEM amanhã, não dormi bem e meus pais estão cobrando muito"
IA Real: Resposta específica abordando múltiplos aspectos
Modo Local: Resposta genérica sobre ansiedade
```

### Teste 3: **Seguimento de Conversa**
```
Você: "Como posso melhorar meu foco?"
IA Real: Pergunta específica sobre suas dificuldades
Você: "Me distraio com o celular"
IA Real: Resposta específica sobre celular
Modo Local: Não mantém contexto da conversa anterior
```

### Teste 4: **Técnicas Específicas**
```
Você: "Ensine-me a técnica 5-4-3-2-1"
IA Real: Explicação detalhada e personalizada
Modo Local: Resposta básica ou genérica
```

## 🚨 Resolução de Problemas

### Problema: Sempre mostra "Modo Local"
**Soluções:**
1. Verifique se criou o arquivo `.env`
2. Confirme se a API key está correta
3. Reinicie o servidor (`npm run dev`)

### Problema: Erro 403/401
**Causa:** API key inválida ou expirada
**Solução:** Gere nova chave em https://aistudio.google.com/app/apikey

### Problema: Erro 429
**Causa:** Limite de requisições excedido
**Solução:** Aguarde alguns minutos ou upgrade do plano

### Problema: Respostas muito lentas
**Causa:** Gemini Flash processando prompt complexo
**Normal:** 2-5 segundos para resposta

## ✅ Confirmação Final

**A IA está funcionando quando:**
- ✅ Indicador mostra "IA Ativa"
- ✅ Respostas são únicas e contextuais
- ✅ Neura lembra informações da conversa
- ✅ Linguagem é natural e variada
- ✅ Técnicas são explicadas detalhadamente

**Está em modo local quando:**
- ❌ Respostas são sempre similares
- ❌ Não lembra contexto anterior
- ❌ Linguagem é repetitiva
- ❌ Indicador mostra "Modo Local"

## 🎯 Exemplo de Conversa Real vs Local

### IA Real (Gemini):
```
Você: "Estou muito ansioso com as provas"
Neura: "Percebo que você está enfrentando ansiedade pré-prova, João. Isso é muito comum e mostra que você se importa com seus resultados. 

Vamos trabalhar isso juntos: primeiro, me conte quando essa ansiedade é mais intensa - na véspera, durante a prova, ou ao estudar? 

Enquanto isso, vamos praticar a respiração 4-7-8: inspire por 4 segundos, segure por 7, expire por 8. Isso ativa seu sistema parassimpático e reduz a ansiedade imediatamente. 🌸

Como você costuma se preparar para as provas?"
```

### Modo Local:
```
Você: "Estou muito ansioso com as provas"
Neura: "Percebo que você está enfrentando ansiedade. Isso é muito comum entre estudantes e é uma resposta natural do seu corpo a situações desafiadoras. Vamos trabalhar isso juntos.

Primeiro, me conte: quando você sente mais ansiedade? Durante provas, ao estudar, ou em outros momentos? Enquanto isso, que tal praticarmos a respiração 4-7-8? Inspire por 4 segundos, segure por 7, expire por 8. 🌸"
```

**Diferença:** A IA real é mais personalizada, contextual e natural!