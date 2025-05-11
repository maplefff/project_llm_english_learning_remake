# 英文能力測驗題型定義與存檔格式 (v2)

本文檔記錄了「英文能力測驗範例 (新版)」(`exam_example.html`) 中包含的各類題型、其範例以及對應的 JSON 存檔格式。

## 1. 閱讀能力 (Reading Skills)

### 1.1. 詞彙理解 (Vocabulary Comprehension)

#### 1.1.1. 選擇題 (詞義選擇)

**範例題目:**
*   **Passage:** "The resilient athlete quickly recovered from her injury."
*   **Question:** In the sentence above, the word "resilient" most nearly means:
*   **Options:**
    *   (A) weak
    *   (B) determined
    *   (C) flexible and quick to recover
    *   (D) tired

**LLM生成題本範例:**
```json
{ // 這是 111_generate.ts 輸出的核心 questionData 物件
    "passage": "The resilient athlete quickly recovered from her injury.",
    "targetWord": "resilient",
    "question": "In the sentence above, the word 'resilient' most nearly means:",
    "options": [
    {"A": "weak"},
    {"B": "determined"},
    {"C": "flexible and quick to recover"},
    {"D": "tired"}
    ],
    "standard_answer": "C",
    "explanation_of_Question": "Resilient means being able to withstand or recover quickly from difficult conditions. In this context, an athlete recovering quickly shows flexibility and the ability to bounce back. Option A is incorrect because... Option B is incorrect because... Option D is incorrect because..."
}
```

**JSON 存檔格式範例 (History Entry):**
```json
{
  "questionData": {
    "passage": "The resilient athlete quickly recovered from her injury.",
    "targetWord": "resilient",
    "question": "In the sentence above, the word 'resilient' most nearly means:",
    "options": [
      {"A": "weak"},
      {"B": "determined"},
      {"C": "flexible and quick to recover"},
      {"D": "tired"}
    ],
    "standard_answer": "C",
    "explanation_of_Question": "Resilient means being able to withstand or recover quickly from difficult conditions. In this context, an athlete recovering quickly shows flexibility and the ability to bounce back. Option A is incorrect because weak is an antonym. Option B, while possibly related, doesn't capture the 'recovery' aspect as well as C. Option D is incorrect as resilience implies strength, not tiredness."
  },
  "userAnswer": "C",
  "isCorrect": true,
  "timestamp": 1678886400
}
```

#### 1.1.2. 填空題 (選擇合適詞彙)

**範例題目:**
*   **Passage:** "The ancient castle stood on a hill, its walls _______ against the stormy sky."
*   **Question:** Choose the best word to complete the sentence.
*   **Options:**
    *   (A) illuminated
    *   (B) silhouetted
    *   (C) decorated
    *   (D) vanished

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.1.2",
    "questionType": "MultipleChoice_Radio",
    "passage": "Passage: \"The ancient castle stood on a hill, its walls _______ against the stormy sky.\"",
    "question": "Question: Choose the best word to complete the sentence.",
    "options": [
        {"id": "A", "text": "illuminated"},
        {"id": "B", "text": "silhouetted"},
        {"id": "C", "text": "decorated"},
        {"id": "D", "text": "vanished"}
    ],
    "userAnswer": "B"
}
```

### 1.2. 文法結構 (Grammatical Structure)

#### 1.2.1. 句子改錯

**範例題目:**
*   **Original Sentence:** "She go to the library yesterday for study."
*   **Question:** Identify the error(s) in the sentence above and rewrite it correctly.

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.2.1",
    "questionType": "FreeText_SentenceCorrection",
    "originalSentence": "Original Sentence: \"She go to the library yesterday for study.\"",
    "instruction": "Question: Identify the error(s) in the sentence above and rewrite it correctly.",
    "userAnswer": "She went to the library yesterday to study."
}
```

#### 1.2.2. 選擇題 (選擇正確語法結構)

**範例題目:**
*   **Question:** Which of the following sentences is grammatically correct?
*   **Options:**
    *   (A) Him and I is going to the park.
    *   (B) He and I are going to the park.
    *   (C) Me and him are going to the park.
    *   (D) He and me is going to the park.

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.2.2",
    "questionType": "MultipleChoice_Radio",
    "passage": null,
    "question": "Question: Which of the following sentences is grammatically correct?",
    "options": [
        {"id": "A", "text": "Him and I is going to the park."},
        {"id": "B", "text": "He and I are going to the park."},
        {"id": "C", "text": "Me and him are going to the park."},
        {"id": "D", "text": "He and me is going to the park."}
    ],
    "userAnswer": "B"
}
```

#### 1.2.3. 選擇題 (選擇合適的轉承詞)

**範例題目:**
*   **Sentence:** "She studied hard for the exam; _______, she felt confident about her performance."
*   **Question:** Choose the word that best completes the sentence to ensure cohesion.
*   **Options:**
    *   (A) however
    *   (B) therefore
    *   (C) meanwhile
    *   (D) despite

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.2.3",
    "questionType": "MultipleChoice_Radio",
    "sentenceContext": "Sentence: \"She studied hard for the exam; _______, she felt confident about her performance.\"",
    "question": "Question: Choose the word that best completes the sentence to ensure cohesion.",
    "options": [
        {"id": "A", "text": "however"},
        {"id": "B", "text": "therefore"},
        {"id": "C", "text": "meanwhile"},
        {"id": "D", "text": "despite"}
    ],
    "userAnswer": "B"
}
```

### 1.3. 主要思想理解 (Understanding Main Ideas)

#### 1.3.1. 選擇題 (段落主旨)

**範例題目:**
*   **Passage:** [一段描述環保重要性的文字，約50-100字]
*   **Question:** What is the main idea of this paragraph?
*   **Options:**
    *   (A) Recycling is too difficult for most people.
    *   (B) Protecting the environment is crucial for future generations.
    *   (C) There are many types of pollution.
    *   (D) Governments should ban plastic bags.

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.3.1",
    "questionType": "MultipleChoice_Radio",
    "passage": "Passage: [一段描述環保重要性的文字，約50-100字]",
    "question": "Question: What is the main idea of this paragraph?",
    "options": [
        {"id": "A", "text": "Recycling is too difficult for most people."},
        {"id": "B", "text": "Protecting the environment is crucial for future generations."},
        {"id": "C", "text": "There are many types of pollution."},
        {"id": "D", "text": "Governments should ban plastic bags."}
    ],
    "userAnswer": "B"
}
```

### 1.4. 細節理解 (Understanding Details)

#### 1.4.1. 選擇題 (細節查找)

**範例題目:**
*   **Passage:** "The report, published in 2023 by the Energy Institute, indicated a 5% increase in renewable energy consumption globally, while fossil fuel usage also saw a slight rise."
*   **Question:** According to the passage, when was the report published?
*   **Options:**
    *   (A) 2022
    *   (B) 2023
    *   (C) It doesn't say.
    *   (D) 5 years ago.

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.4.1",
    "questionType": "MultipleChoice_Radio",
    "passage": "Passage: \"The report, published in 2023 by the Energy Institute, indicated a 5% increase in renewable energy consumption globally, while fossil fuel usage also saw a slight rise.\"",
    "question": "Question: According to the passage, when was the report published?",
    "options": [
        {"id": "A", "text": "2022"},
        {"id": "B", "text": "2023"},
        {"id": "C", "text": "It doesn\'t say."},
        {"id": "D", "text": "5 years ago."}
    ],
    "userAnswer": "B"
}
```

### 1.5. 進階閱讀理解 (Advanced Reading Comprehension)

**通用評測文本 (Common Passage for 1.5.1-1.5.3):**
`[一段適合進行多角度分析的短文，約150-250字。例如，關於都市化對環境影響的評論性文字，包含明確觀點、潛在暗示以及特定組織結構。]`

#### 1.5.1. 推論能力 (Inference)

**範例題目:**
*   **Question:** Based on the passage, what can be inferred about the author's view on current urban development strategies?
*   **Options:**
    *   (A) They are entirely sustainable.
    *   (B) They may have unforeseen negative consequences.
    *   (C) They prioritize economic growth over all other concerns.
    *   (D) They are widely accepted by all residents.

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.5.1",
    "questionType": "MultipleChoice_Radio",
    "passage": "[一段適合進行多角度分析的短文，約150-250字。例如，關於都市化對環境影響的評論性文字，包含明確觀點、潛在暗示以及特定組織結構。]",
    "question": "Question: Based on the passage, what can be inferred about the author\'s view on current urban development strategies?",
    "options": [
        {"id": "A", "text": "They are entirely sustainable."},
        {"id": "B", "text": "They may have unforeseen negative consequences."},
        {"id": "C", "text": "They prioritize economic growth over all other concerns."},
        {"id": "D", "text": "They are widely accepted by all residents."}
    ],
    "userAnswer": "B"
}
```

#### 1.5.2. 作者目的與語氣 (Author's Purpose and Tone)

**範例題目:**
*   **Question 1:** What is the author's primary purpose in writing this passage?
*   **Options (Purpose):**
    *   (A) To provide a historical overview of urbanization.
    *   (B) To argue for stricter regulations on urban expansion.
    *   (C) To describe the benefits of city living.
    *   (D) To entertain readers with fictional stories about cities.
*   **Question 2:** The author's tone in this passage can best be described as:
*   **Options (Tone):**
    *   (A) Optimistic and encouraging
    *   (B) Critical and concerned
    *   (C) Neutral and objective
    *   (D) Sarcastic and dismissive

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.5.2",
    "questionType": "Compound_MultipleChoice_Radio",
    "commonPassage": "[一段適合進行多角度分析的短文，約150-250字。例如，關於都市化對環境影響的評論性文字，包含明確觀點、潛在暗示以及特定組織結構。]",
    "questionTitle": "1.5.2. 作者目的與語氣 (Author\'s Purpose and Tone)",
    "subQuestions": [
        {
            "id": "purpose",
            "questionText": "Question 1: What is the author\'s primary purpose in writing this passage?",
            "options": [
                {"id": "A", "text": "To provide a historical overview of urbanization."},
                {"id": "B", "text": "To argue for stricter regulations on urban expansion."},
                {"id": "C", "text": "To describe the benefits of city living."},
                {"id": "D", "text": "To entertain readers with fictional stories about cities."}
            ],
            "userAnswer": "B"
        },
        {
            "id": "tone",
            "questionText": "Question 2: The author\'s tone in this passage can best be described as:",
            "options": [
                {"id": "A", "text": "Optimistic and encouraging"},
                {"id": "B", "text": "Critical and concerned"},
                {"id": "C", "text": "Neutral and objective"},
                {"id": "D", "text": "Sarcastic and dismissive"}
            ],
            "userAnswer": "B"
        }
    ]
}
```

#### 1.5.3. 文本結構與組織 (Text Structure and Organization)

**範例題目:**
*   **Question:** How is the information in this passage primarily organized?
*   **Options:**
    *   (A) Chronological order of events.
    *   (B) Comparison and contrast of different city types.
    *   (C) Presentation of a problem (urbanization impact) followed by implied solutions or concerns.
    *   (D) Cause and effect analysis of a single event.

**JSON 存檔格式範例:**
```json
{
    "testItem": "1.5.3",
    "questionType": "MultipleChoice_Radio",
    "passage": "[一段適合進行多角度分析的短文，約150-250字。例如，關於都市化對環境影響的評論性文字，包含明確觀點、潛在暗示以及特定組織結構。]",
    "question": "Question: How is the information in this passage primarily organized?",
    "options": [
        {"id": "A", "text": "Chronological order of events."},
        {"id": "B", "text": "Comparison and contrast of different city types."},
        {"id": "C", "text": "Presentation of a problem (urbanization impact) followed by implied solutions or concerns."},
        {"id": "D", "text": "Cause and effect analysis of a single event."}
    ],
    "userAnswer": "C"
}
```

## 2. 寫作能力 (Writing Skills)

### 2.1. 文法與力學 (Grammar and Mechanics)

#### 2.1.1. 句子寫作 (看圖/主題寫作)

**範例題目:**
*   **Prompt:** [一張人們在公園野餐的圖片]
*   **Question:** Write one complete and grammatically correct sentence describing what is happening in the picture.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.1.1",
    "questionType": "FreeText_PromptedSentence",
    "prompt": "Prompt: [一張人們在公園野餐的圖片]",
    "instruction": "Question: Write one complete and grammatically correct sentence describing what is happening in the picture.",
    "userAnswer": "Several people are enjoying a picnic in a sunny park."
}
```

#### 2.1.2. 改錯題 (改正句子)

**範例題目:**
*   **Sentence with errors:** "their going to visit they're grandparents next week because its they anniversary."
*   **Question:** Correct all errors in this sentence.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.1.2",
    "questionType": "FreeText_SentenceCorrection",
    "originalSentence": "Sentence with errors: \"their going to visit they\'re grandparents next week because its they anniversary.\"",
    "instruction": "Question: Correct all errors in this sentence.",
    "userAnswer": "They\'re going to visit their grandparents next week because it\'s their anniversary."
}
```

### 2.2. 句子結構 (Sentence Structure)

#### 2.2.1. 句子合併

**範例題目:**
*   **Sentences:** "The cat is black. The cat is fluffy. The cat is sleeping on the mat."
*   **Question:** Combine these sentences into one clear and concise sentence.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.2.1",
    "questionType": "FreeText_SentenceCombination",
    "originalSentences": "Sentences: \"The cat is black. The cat is fluffy. The cat is sleeping on the mat.\"",
    "instruction": "Question: Combine these sentences into one clear and concise sentence.",
    "userAnswer": "The black, fluffy cat is sleeping on the mat."
}
```

#### 2.2.2. 句子重組 (詞語排序成句)

**範例題目:**
*   **Words:** /is / a / this / beautiful / sunny / day / . /
*   **Question:** Arrange the words to form a grammatically correct sentence.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.2.2",
    "questionType": "FreeText_SentenceScramble",
    "wordsToArrange": "Words: /is / a / this / beautiful / sunny / day / . /",
    "instruction": "Question: Arrange the words to form a grammatically correct sentence.",
    "userAnswer": "This is a beautiful sunny day."
}
```

### 2.3. 連貫與一致 (Cohesion and Coherence)

#### 2.3.1. 段落寫作 (給定主題)

**範例題目:**
*   **Topic:** "The importance of regular exercise."
*   **Question:** Write a short paragraph (3-5 sentences) about the importance of regular exercise. Make sure your ideas flow logically and are well-connected.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.3.1",
    "questionType": "FreeText_Paragraph",
    "topic": "Topic: \"The importance of regular exercise.\"",
    "instruction": "Question: Write a short paragraph (3-5 sentences) about the importance of regular exercise. Make sure your ideas flow logically and are well-connected.",
    "userAnswer": "Regular exercise is crucial for maintaining good health. It helps improve cardiovascular fitness, strengthens muscles and bones, and can boost mental well-being. Additionally, consistent physical activity can reduce the risk of chronic diseases."
}
```

### 2.4. 組織結構 (Organization)

#### 2.4.1. 段落排序

**範例題目:**
*   **Prompt:** The following four sentences (or short paragraphs A, B, C, D) form a coherent larger paragraph (or short essay). Arrange them in the correct logical order.<br>(A) [Sentence/Paragraph A]<br>(B) [Sentence/Paragraph B]<br>(C) [Sentence/Paragraph C]<br>(D) [Sentence/Paragraph D]
*   **Question:** What is the correct order of the sentences/paragraphs? (e.g., B, A, D, C)

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.4.1",
    "questionType": "Ordering_Text",
    "prompt": "Prompt: The following four sentences (or short paragraphs A, B, C, D) form a coherent larger paragraph (or short essay). Arrange them in the correct logical order.<br>(A) [Sentence/Paragraph A]<br>(B) [Sentence/Paragraph B]<br>(C) [Sentence/Paragraph C]<br>(D) [Sentence/Paragraph D]",
    "instruction": "Question: What is the correct order of the sentences/paragraphs? (e.g., B, A, D, C)",
    "userAnswer": "B,D,A,C"
}
```

#### 2.4.2. 短文寫作 (給定提示)

**範例題目:**
*   **Prompt:** "Write a short story about a lost dog finding its way home. Your story should have a clear beginning, middle, and end."
*   **Question:** Write your story in approximately 100-150 words.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.4.2",
    "questionType": "FreeText_ShortStory",
    "prompt": "Prompt: \"Write a short story about a lost dog finding its way home. Your story should have a clear beginning, middle, and end.\"",
    "instruction": "Question: Write your story in approximately 100-150 words.",
    "userAnswer": "Whiskers, a small terrier, shivered in the unfamiliar woods. He\'d chased a squirrel too far and now, the familiar scent of home was gone. Hours passed. Just as despair set in, he spotted a familiar red mailbox in the distance. With renewed hope, he raced towards it, tail wagging furiously. Home at last!"
}
```

### 2.5. 任務完成度/內容表達 (Task Achievement/Content)

#### 2.5.1. 簡答題 (回答問題)

**範例題目:**
*   **Prompt:** Question: "What are two advantages of learning a new language? Explain each advantage briefly."

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.5.1",
    "questionType": "FreeText_ShortAnswer",
    "prompt": "Question: \"What are two advantages of learning a new language? Explain each advantage briefly.\"",
    "instruction": null,
    "userAnswer": "1. Enhanced career opportunities: Bilingualism is often valued by employers. 2. Improved cognitive skills: Learning a new language can boost memory and problem-solving abilities."
}
```

#### 2.5.2. 郵件/信函寫作

**範例題目:**
*   **Prompt:** "You recently borrowed a book from your friend but accidentally damaged it. Write an email to your friend (about 80-100 words) to apologize, explain what happened, and suggest a solution."

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.5.2",
    "questionType": "FreeText_Email",
    "prompt": "Prompt: \"You recently borrowed a book from your friend but accidentally damaged it. Write an email to your friend (about 80-100 words) to apologize, explain what happened, and suggest a solution.\"",
    "instruction": null,
    "userAnswer": "Subject: So sorry about your book!\n\nHi [Friend\'s Name],\n\I\'m so incredibly sorry, but I accidentally damaged the book I borrowed from you. I was reading it while having a cup of tea, and I clumsily spilled some on the pages. I feel terrible about it. I\'d be happy to buy you a brand new copy as a replacement, or if you prefer, I can try to find a used one in good condition. Please let me know what you\'d like me to do.\n\nAgain, I\'m really sorry!\n\nBest,\n[Your Name]"
}
```

### 2.6. 風格與語氣 (Style and Tone)

#### 2.6.1. 改寫句子 (正式/非正式轉換)

**範例題目:**
*   **Formal Sentence:** "Kindly be advised that the aforementioned meeting has been rescheduled to the subsequent week due to unforeseen circumstances."
*   **Question:** Rewrite this sentence in an informal way, as if you were telling a colleague you know well.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.6.1",
    "questionType": "FreeText_SentenceRewrite",
    "originalSentence": "Formal Sentence: \"Kindly be advised that the aforementioned meeting has been rescheduled to the subsequent week due to unforeseen circumstances.\"",
    "instruction": "Question: Rewrite this sentence in an informal way, as if you were telling a colleague you know well.",
    "userAnswer": "Hey, just a heads-up, that meeting we talked about? It\'s been moved to next week because something unexpected came up."
}
```

### 2.7. 中翻英 (Chinese to English Translation)

#### 2.7.1. 句子翻譯

**範例題目:**
*   **Prompt:** "這本書不僅內容豐富，而且插圖精美，非常值得一讀。"
*   **Question:** Translate the Chinese sentence into English.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.7.1",
    "questionType": "FreeText_Translation_ZHtoEN_Sentence",
    "sourceSentence": "Prompt: \"這本書不僅內容豐富，而且插圖精美，非常值得一讀。\"",
    "instruction": "Question: Translate the Chinese sentence into English.",
    "userAnswer": "Not only is this book rich in content, but its illustrations are also exquisite; it is very much worth reading."
}
```

#### 2.7.2. 短文翻譯

**範例題目:**
*   **Prompt:** [一段簡短的中文描述，約50-80字，例如描述一個城市公園的清晨景象。]
*   **Question:** Translate the Chinese passage into English.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.7.2",
    "questionType": "FreeText_Translation_ZHtoEN_Passage",
    "sourcePassage": "Prompt: [一段簡短的中文描述，約50-80字，例如描述一個城市公園的清晨景象。]",
    "instruction": "Question: Translate the Chinese passage into English.",
    "userAnswer": "Early in the morning, the city park is tranquil. Dew drops glisten on the fresh green leaves, and the gentle chirping of birds creates a peaceful melody. A few elderly people are practicing Tai Chi, moving slowly and gracefully under the soft sunlight."
}
```

### 2.8. 英翻中 (English to Chinese Translation)

#### 2.8.1. 句子翻譯

**範例題目:**
*   **Prompt:** "Despite the initial setbacks, the team demonstrated remarkable perseverance and ultimately achieved their ambitious goal."
*   **Question:** Translate the English sentence into Chinese.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.8.1",
    "questionType": "FreeText_Translation_ENtoZH_Sentence",
    "sourceSentence": "Prompt: \"Despite the initial setbacks, the team demonstrated remarkable perseverance and ultimately achieved their ambitious goal.\"",
    "instruction": "Question: Translate the English sentence into Chinese.",
    "userAnswer": "儘管初期遭遇挫折，該團隊展現了非凡的毅力，並最終實現了他們宏偉的目標。"
}
```

#### 2.8.2. 短文翻譯

**範例題目:**
*   **Prompt:** [A short English passage, approx. 50-80 words, e.g., describing the benefits of a balanced diet.]
*   **Question:** Translate the English passage into Chinese.

**JSON 存檔格式範例:**
```json
{
    "testItem": "2.8.2",
    "questionType": "FreeText_Translation_ENtoZH_Passage",
    "sourcePassage": "Prompt: [A short English passage, approx. 50-80 words, e.g., describing the benefits of a balanced diet.]",
    "instruction": "Question: Translate the English passage into Chinese.",
    "userAnswer": "均衡的飲食對健康至關重要。它為身體提供必需的營養素，有助於維持健康的體重，並降低患慢性疾病的風險。多樣化的飲食應包括水果、蔬菜、全穀物和瘦肉蛋白。"
}
``` 