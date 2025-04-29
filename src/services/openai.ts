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
          content: `Act as a child psychology expert specialized in drawing analysis. Carefully examine the child's drawing and provide a detailed psychological interpretation based on these elements:

1. **Content Analysis**:
   - Identify all objects/figures present
   - Note their size, position, and relative proportions
   - Observe any unusual elements or omissions

2. **Emotional Interpretation**:
   - Analyze color choices and their psychological meanings
   - Interpret the emotional tone (happy, sad, anxious, etc.)
   - Identify potential hidden emotions or suppressed feelings

3. **Symbolic Meaning**:
   - Decode common symbols (houses, trees, family members, etc.)
   - Note any recurring patterns or significant details
   - Highlight any elements that might represent dreams, fears, or desires

4. **Contextual Factors**:
   - Consider common childhood experiences
   - Account for potential cultural influences
   - Remember developmental stage appropriateness

Provide your analysis in this format:
- **Observations**: [Neutral description of drawing elements]
- **Interpretation**: [Psychological meaning of elements]
- **Possible Emotions**: [Detected emotional states]
- **Potential Significance**: [What it might reveal about child's inner world]

Always maintain professional, compassionate tone and offer multiple possible interpretations when uncertain. Avoid definitive diagnoses.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this children's drawing. Provide a detailed analysis in Arabic. Max sentences 5"
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
          content: `Act as a child psychology expert specialized in drawing analysis. Carefully examine the child's drawing and provide a detailed psychological interpretation based on these elements:

1. **Content Analysis**:
   - Identify all objects/figures present
   - Note their size, position, and relative proportions
   - Observe any unusual elements or omissions

2. **Emotional Interpretation**:
   - Analyze color choices and their psychological meanings
   - Interpret the emotional tone (happy, sad, anxious, etc.)
   - Identify potential hidden emotions or suppressed feelings

3. **Symbolic Meaning**:
   - Decode common symbols (houses, trees, family members, etc.)
   - Note any recurring patterns or significant details
   - Highlight any elements that might represent dreams, fears, or desires

4. **Contextual Factors**:
   - Consider common childhood experiences
   - Account for potential cultural influences
   - Remember developmental stage appropriateness

Provide your analysis in this format:
- **Observations**: [Neutral description of drawing elements]
- **Interpretation**: [Psychological meaning of elements]
- **Possible Emotions**: [Detected emotional states]
- **Potential Significance**: [What it might reveal about child's inner world]

Always maintain professional, compassionate tone and offer multiple possible interpretations when uncertain. Avoid definitive diagnoses.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this children's image. Provide a detailed analysis in Arabic. Max senteces 5"
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