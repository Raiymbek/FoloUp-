// Тестовый скрипт для проверки работы Retell AI с русским языком
const Retell = require('retell-sdk');

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

async function testRussianSupport() {
  console.log('🧪 Тестирование поддержки русского языка в Retell AI...\n');

  try {
    // 1. Создаем LLM модель с русскоязычным промптом
    console.log('1️⃣ Создание LLM модели...');
    const newModel = await retellClient.llm.create({
      model: "gpt-4o",
      general_prompt: `Вы - интервьюер, который ведет интервью на русском языке. 
      Вы должны задавать вопросы на русском языке и понимать ответы на русском языке.
      Всегда отвечайте на русском языке.`,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description: "Завершить звонок, если пользователь говорит 'до свидания', 'пока' или 'хорошего дня'.",
        },
      ],
    });
    console.log('✅ LLM модель создана успешно\n');

    // 2. Создаем агента с русскоязычным голосом
    console.log('2️⃣ Создание агента с русскоязычным голосом...');
    const newAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Anna", // Русскоязычный голос
      agent_name: "Russian Test Agent",
    });
    console.log('✅ Агент создан успешно\n');

    // 3. Создаем тестовый звонок
    console.log('3️⃣ Создание тестового звонка...');
    const testCall = await retellClient.call.createWebCall({
      agent_id: newAgent.agent_id,
      retell_llm_dynamic_variables: {
        mins: "5",
        objective: "Тестовое интервью на русском языке",
        questions: "Расскажите о себе, Какие у вас сильные стороны?",
        name: "Тестовый кандидат"
      },
    });
    console.log('✅ Тестовый звонок создан успешно\n');

    console.log('📋 Результаты тестирования:');
    console.log(`- LLM ID: ${newModel.llm_id}`);
    console.log(`- Agent ID: ${newAgent.agent_id}`);
    console.log(`- Call ID: ${testCall.call_id}`);
    console.log(`- Access Token: ${testCall.access_token ? '✅ Получен' : '❌ Не получен'}\n`);

    console.log('🎯 Retell AI готов к работе с русским языком!');
    console.log('💡 Теперь можно протестировать реальное интервью на русском языке.');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    console.error('🔍 Детали ошибки:', error);
  }
}

// Запускаем тест
if (require.main === module) {
  testRussianSupport();
}

module.exports = { testRussianSupport }; 
