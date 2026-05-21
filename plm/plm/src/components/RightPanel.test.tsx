import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RightPanel } from './RightPanel';
import type { Citation } from '@/types';

const guidelineCitation: Citation = {
  id: 'c1', index: 1, title: 'CSCO Guide', sourceType: 'guideline', journal: 'CSCO',
  guidelineLocation: { section: 'Ch3', subsection: '3.1', excerpt: 'R-CHOP base.', pageLabel: 'P.12' },
};
const pubmedCitation: Citation = {
  id: 'c3', index: 3, title: 'POLARIX', sourceType: 'pubmed', journal: 'Lancet', year: '2022', abstract: 'Phase III trial.',
};
const logic = { response: { citations: [guidelineCitation, pubmedCitation] } };

describe('RightPanel', () => {
  it('shows citation list when none selected', () => {
    render(<RightPanel logic={logic} selectedCitation={null} onClose={vi.fn()} onSelectCitation={vi.fn()} />);
    expect(screen.getByText(/参考文献/)).toBeInTheDocument();
    expect(screen.getByText('CSCO Guide')).toBeInTheDocument();
  });

  it('shows guideline location when guideline selected', () => {
    render(<RightPanel logic={logic} selectedCitation={guidelineCitation} onClose={vi.fn()} />);
    expect(screen.getByText(/指南定位/)).toBeInTheDocument();
    expect(screen.getByText('R-CHOP base.')).toBeInTheDocument();
  });

  it('shows abstract when pubmed selected', () => {
    render(<RightPanel logic={logic} selectedCitation={pubmedCitation} onClose={vi.fn()} />);
    expect(screen.getByText('Phase III trial.')).toBeInTheDocument();
  });

  it('close button calls onClose', () => {
    const onClose = vi.fn();
    render(<RightPanel logic={logic} selectedCitation={guidelineCitation} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

