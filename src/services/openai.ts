import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeImage = async (imageBase64: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in analyzing baby images and drawings. Provide detailed analysis in Arabic, focusing on identifying objects, emotions, and artistic style if it's a drawing. Make your response child-friendly and engaging."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze the following baby image or drawing. Identify objects, emotions, and style if it's a drawing make it short and fun maximum 5 sentences. Always answer in Arabic."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64.split(',')[1]}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const analyzeDrawing = async (canvasData: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in analyzing children's drawings. Provide a fun, encouraging analysis in Arabic. Focus on the creative elements, colors, and what makes the drawing special. Make the child feel proud of their artwork. Keep it short and engaging."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this children's drawing. Tell me what you see, what makes it special, and give some encouraging feedback. Make it fun and engaging for a child. Maximum 5 sentences. Always answer in Arabic."
            },
            {
              type: "image_url",
              image_url: {
                url: canvasData
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing drawing:', error);
    throw error;
  }
};

export const chatWithAI = async (message: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a friendly and helpful AI assistant for children. You speak in Arabic and provide fun, educational, and age-appropriate responses. Keep your answers short, engaging, and easy to understand. Use emojis occasionally to make the conversation more fun!"
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}; 