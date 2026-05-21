import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CenterPanel } from './CenterPanel';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';

function Wrapper() {
  const logic = useCDSSLogic();
  React.useEffect(() => { logic.runAnalysis(); }, []);
  return <CenterPanel logic={logic} onCitationClick={vi.fn()} onCitationHover={vi.fn()} />;
}

describe('CenterPanel', () => {
  it('shows four tabs when response exists', async () => {
    render(<Wrapper />);
    await waitFor(() => expect(screen.getByRole('button', { name: /整合视图/ })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /指南推荐/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /循证证据/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /真实世界/ })).toBeInTheDocument();
  });

  it('guidelines tab shows reference guidelines and recommendations', async () => {
    render(<Wrapper />);
    await waitFor(() => screen.getByRole('button', { name: /指南推荐/ }));
    fireEvent.click(screen.getByRole('button', { name: /指南推荐/ }));
    expect(screen.getByText(/参考指南/)).toBeInTheDocument();
    expect(screen.getByText(/指南推荐方案/)).toBeInTheDocument();
  });

  it('evidence tab shows analysis and key studies', async () => {
    render(<Wrapper />);
    await waitFor(() => screen.getByRole('button', { name: /循证证据/ }));
    fireEvent.click(screen.getByRole('button', { name: /循证证据/ }));
    expect(screen.getByText(/循证医学分析/)).toBeInTheDocument();
    expect(screen.getByText(/关键临床研究/)).toBeInTheDocument();
  });

  it('rwd tab shows flow and summary', async () => {
    render(<Wrapper />);
    await waitFor(() => screen.getByRole('button', { name: /真实世界/ }));
    fireEvent.click(screen.getByRole('button', { name: /真实世界/ }));
    expect(screen.getByText(/真实世界队列结局/)).toBeInTheDocument();
    expect(screen.getByText(/总结/)).toBeInTheDocument();
  });
});
