import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('首屏显示输入阶段：左侧为患者信息录入，无方案内容', () => {
    render(<App />);
    expect(screen.getByText(/患者信息录入/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/粘贴患者/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /生成治疗方案/ })).toBeInTheDocument();
  });

  it('无输入时「生成治疗方案」按钮为 disabled', () => {
    render(<App />);
    const btn = screen.getByRole('button', { name: /生成治疗方案/ });
    expect(btn).toBeDisabled();
  });

  it('输入病历后点击生成治疗方案，1.5秒后展示数字孪生诊疗方案', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/粘贴患者/);
    fireEvent.change(textarea, { target: { value: '患者男性65岁，DLBCL III期。' } });
    const btn = screen.getByRole('button', { name: /生成治疗方案/ });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByText(/数字孪生诊疗方案/)).toBeInTheDocument();
  });

  it('点击设置进入设置页，返回回到工作台', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('settings-btn'));
    expect(screen.getByText(/系统设置页/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/返回/));
    expect(screen.getByText(/患者信息录入/)).toBeInTheDocument();
  });
});
