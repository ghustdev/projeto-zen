const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyAS3TpRGNvpmfMuygJNHbiubqN77To0frM';
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    console.log('🧪 Testando Gemini diretamente...');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Responda apenas: "Teste OK"');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Sucesso:', text);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGemini();