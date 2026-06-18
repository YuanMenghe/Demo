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
  it('shows three tabs when response exists', async () => {
    render(<Wrapper />);
    await waitFor(() => expect(screen.getByRole('button', { name: /综合/ })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /指南问答/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /PubMed 问答/ })).toBeInTheDocument();
  });

  it('guidelines tab shows guideline sources and recommendations', async () => {
    render(<Wrapper />);
    await waitFor(() => screen.getByRole('button', { name: /指南问答/ }));
    fireEvent.click(screen.getByRole('button', { name: /指南问答/ }));
    expect(screen.getByText(/共参考/)).toBeInTheDocument();
    expect(screen.getByText(/CSCO 淋巴瘤诊疗指南/)).toBeInTheDocument();
    expect(screen.getAllByText(/一线治疗/).length).toBeGreaterThan(0);
  });

  it('evidence tab shows key studies', async () => {
    render(<Wrapper />);
    await waitFor(() => screen.getByRole('button', { name: /PubMed 问答/ }));
    fireEvent.click(screen.getByRole('button', { name: /PubMed 问答/ }));
    expect(screen.getByText(/关键临床研究/)).toBeInTheDocument();
    expect(screen.getAllByText(/POLARIX/).length).toBeGreaterThan(0);
  });

  it('follow-up input only renders in guidelines / evidence tabs', async () => {
    render(<Wrapper />);
    await waitFor(() => screen.getByRole('button', { name: /综合/ }));

    // integrated（综合）—— 默认 Tab，应无追问输入
    expect(screen.queryByPlaceholderText(/基于当前指南推荐提问|基于文献证据提问/)).toBeNull();

    // 切到 指南问答
    fireEvent.click(screen.getByRole('button', { name: /指南问答/ }));
    expect(screen.getByPlaceholderText(/基于当前指南推荐提问/)).toBeInTheDocument();

    // 切到 PubMed 问答
    fireEvent.click(screen.getByRole('button', { name: /PubMed 问答/ }));
    expect(screen.getByPlaceholderText(/基于文献证据提问/)).toBeInTheDocument();

    // 切回 综合 —— 追问输入应再次消失
    fireEvent.click(screen.getByRole('button', { name: /综合/ }));
    expect(screen.queryByPlaceholderText(/基于当前指南推荐提问|基于文献证据提问/)).toBeNull();
  });
});
