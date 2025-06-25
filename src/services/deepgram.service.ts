// @ts-ignore - Deepgram SDK будет установлен позже
import { Deepgram } from '@deepgram/sdk';

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY || '');

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  language: string;
}

export const transcribeAudio = async (audioBuffer: Buffer): Promise<TranscriptionResult> => {
  try {
    const response = await deepgram.transcription.preRecorded({
      buffer: audioBuffer,
      mimetype: 'audio/wav',
    }, {
      language: 'ru-RU',
      model: 'nova-2',
      smart_format: true,
      punctuate: true,
      diarize: true,
      utterances: true,
    });
    
    const result = response.results?.channels[0]?.alternatives[0];
    
    return {
      transcript: result?.transcript || '',
      confidence: result?.confidence || 0,
      language: result?.language || 'ru-RU',
    };
  } catch (error) {
    console.error('Deepgram transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

export const transcribeRealtime = async (audioStream: any): Promise<TranscriptionResult> => {
  try {
    const connection = deepgram.transcription.live({
      language: 'ru-RU',
      model: 'nova-2',
      smart_format: true,
      punctuate: true,
      interim_results: false,
    });

    return new Promise((resolve, reject) => {
      let finalTranscript = '';
      let confidence = 0;

      connection.addListener('transcriptReceived', (transcription: any) => {
        const result = transcription.channel?.alternatives[0];
        if (result?.transcript) {
          finalTranscript = result.transcript;
          confidence = result.confidence || 0;
        }
      });

      connection.addListener('close', () => {
        resolve({
          transcript: finalTranscript,
          confidence,
          language: 'ru-RU',
        });
      });

      connection.addListener('error', (error: any) => {
        reject(error);
      });

      // Отправляем аудио поток
      audioStream.pipe(connection);
    });
  } catch (error) {
    console.error('Deepgram realtime transcription error:', error);
    throw new Error('Failed to transcribe audio in realtime');
  }
};

export const validateTranscription = (transcript: string, confidence: number): boolean => {
  // Проверяем качество транскрипции
  const minConfidence = 0.7;
  const minLength = 3; // Минимальная длина транскрипции в словах
  
  const wordCount = transcript.split(' ').length;
  
  return confidence >= minConfidence && wordCount >= minLength;
};

export const getTranscriptionSuggestions = (transcript: string): string[] => {
  // Предложения для улучшения транскрипции
  const suggestions: string[] = [];
  
  if (transcript.length < 10) {
    suggestions.push('Транскрипция слишком короткая. Попробуйте говорить более четко и громче.');
  }
  
  if (transcript.includes('...') || transcript.includes('???')) {
    suggestions.push('Обнаружены неразборчивые части. Убедитесь, что микрофон работает корректно.');
  }
  
  return suggestions;
}; 
