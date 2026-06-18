import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeftPanel } from './LeftPanel';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';

// 使用真实 hook 的包装组件
function LeftPanelWithLogic() {
  const logic = useCDSSLogic();
  return (
    <LeftPanel
      logic={logic}
      slim={false}
      onAnalyze={() => {}}
      onResetToInput={() => {}}
      isAnalyzing={false}
    />
  );
}

describe('LeftPanel', () => {
  it('渲染患者信息录入标题与病历输入框', () => {
    render(<LeftPanelWithLogic />);
    expect(screen.getByText(/患者信息录入/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/粘贴患者/)).toBeInTheDocument();
  });

  it('有「演示案例」按钮', () => {
    render(<LeftPanelWithLogic />);
    expect(screen.getByRole('button', { name: /演示案例/ })).toBeInTheDocument();
  });

  it('点击演示案例可展开菜单并加载案例', async () => {
    const user = userEvent.setup();
    render(<LeftPanelWithLogic />);
    await user.click(screen.getByRole('button', { name: /演示案例/ }));
    const firstScenario = screen.getByRole('button', { name: /初治 DLBCL/ });
    expect(firstScenario).toBeInTheDocument();
    await user.click(firstScenario);
    const textarea = screen.getByPlaceholderText(/粘贴患者/);
    expect((textarea as HTMLTextAreaElement).value).toContain('患者男性');
  });
});
