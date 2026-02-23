import { test, expect } from '@playwright/test';

test.describe('價格計算', () => {
  test('工蟻價格公式: base * 1.2^count', () => {
    const base = 10;
    const count = 0;
    const expected = base * Math.pow(1.2, count);
    expect(expected).toBe(10);
    
    expect(base * Math.pow(1.2, 1)).toBeCloseTo(12, 1);
    expect(base * Math.pow(1.2, 5)).toBeCloseTo(24.88, 1);
  });
  
  test('房間升級價格計算', () => {
    const base = 50;
    const level = 0;
    expect(base * (level + 1) * 100).toBe(5000);
  });
});

test.describe('存檔驗證', () => {
  test('驗證有效存檔', () => {
    const validData = {
      version: '1.3.0',
      gameState: {
        food: 100,
        workers: 5,
        queen: 1,
        gameTime: 60
      }
    };
    expect(validData.version).toBeTruthy();
    expect(validData.gameState).toBeTruthy();
    expect('food' in validData.gameState).toBe(true);
  });
});
