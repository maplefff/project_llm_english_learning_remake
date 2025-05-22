import { Request, Response, NextFunction } from 'express';
import TestOrchestratorService from '../services/TestOrchestratorService';
import { QuestionCacheService } from '../services/QuestionCacheService'; // 導入類別本身以獲取實例
import { getHistory } from '../services/HistoryService';
import { TestOrchestratorQuestion } from '../services/TestOrchestratorService'; // 導入此類型

// 獲取 QuestionCacheService 的單例實例
const questionCacheService = QuestionCacheService.getInstance();
// 創建 TestOrchestratorService 實例並注入依賴
const orchestratorService = new TestOrchestratorService(questionCacheService);

class ApiController {
  async getQuestionTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 返回支援的題型列表
      const questionTypes = [
        { id: '1.1.1', name: '詞義選擇 (Vocabulary - Multiple Choice)' },
        { id: '1.1.2', name: '詞彙填空 (Vocabulary - Cloze Test)' },
        // Future types can be added here
      ];
      res.json(questionTypes);
    } catch (error) {
      next(error);
    }
  }

  async startTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { questionType } = req.body;
      if (questionType !== '1.1.1' && questionType !== '1.1.2') {
        res.status(400).json({ message: '目前僅支援題型 1.1.1 和 1.1.2' });
        return;
      }
      console.log(`[DEBUG api.controller.ts] startTest: Received request for type ${questionType}`);
      const question = await orchestratorService.startSingleTypeTest(questionType);
      if (question) {
        res.json(question);
      } else {
        res.status(404).json({ message: '無法獲取題目，可能快取為空或題型不受支援。' });
      }
    } catch (error) {
      console.error('[DEBUG api.controller.ts] startTest: Error', error);
      next(error);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        questionId, // 前端應傳來作答題目的 ID
        userAnswer,
        questionDataSnapshot // 前端應傳回作答時的完整題目數據 (TestOrchestratorQuestion 結構)
      } = req.body;

      console.log(`[DEBUG api.controller.ts] submitAnswer: Received submission for questionId: ${questionId}`);

      if (!questionId || userAnswer === undefined || !questionDataSnapshot) {
        res.status(400).json({ message: '請求參數不完整 (需要 questionId, userAnswer, questionDataSnapshot)' });
        return;
      }
      
      // 確保 questionDataSnapshot 符合 TestOrchestratorQuestion 結構 (或至少有 id)
      if (questionDataSnapshot.id !== questionId) {
        res.status(400).json({ message: '提交的 questionId 與 questionDataSnapshot.id 不匹配' });
        return;
      }

      const result = await orchestratorService.submitAnswer(
        questionId as string,
        userAnswer,
        questionDataSnapshot as TestOrchestratorQuestion
      );

      if (result) {
        res.json(result);
      } else {
        res.status(500).json({ message: '答案提交失敗，或處理過程中發生錯誤。' });
      }
    } catch (error) {
      console.error('[DEBUG api.controller.ts] submitAnswer: Error', error);
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { questionType, limit, offset } = req.query;
      if (!questionType || typeof questionType !== 'string') {
        res.status(400).json({ message: '必須提供 questionType 查詢參數。' });
        return;
      }

      const limitNum = limit ? parseInt(limit as string, 10) : undefined;
      const offsetNum = offset ? parseInt(offset as string, 10) : undefined;
      
      console.log(`[DEBUG api.controller.ts] getHistory: For type ${questionType}, limit ${limitNum}, offset ${offsetNum}`);

      const historyEntries = await getHistory(questionType, limitNum, offsetNum);
      res.json(historyEntries);
    } catch (error) {
      console.error('[DEBUG api.controller.ts] getHistory: Error', error);
      next(error);
    }
  }
}

export default new ApiController(); 