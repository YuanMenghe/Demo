import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RWDFlowChart } from './RWDFlowChart';
import type { RWDFlowNode } from '@/types';

describe('RWDFlowChart', () => {
  it('empty data does not throw', () => {
    const { container } = render(<RWDFlowChart data={[]} />);
    expect(container.textContent).toBe('');
  });

  it('single node shows label and value', () => {
    render(<RWDFlowChart data={[{ id: 'a', label: 'Total', value: 1000 }]} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText((content) => content.includes('1,000')).length).toBeGreaterThan(0);
  });

  it('leaf children are rendered inline with percentage', () => {
    const data: RWDFlowNode[] = [
      { id: 'root', label: 'Root', value: 12500, children: [
        { id: 'm', label: 'Match', value: 320 },
      ]},
    ];
    render(<RWDFlowChart data={data} />);
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Match')).toBeInTheDocument();
    expect(screen.getAllByText((content) => content.includes('2.6')).length).toBeGreaterThan(0);
  });

  it('branch nodes with non-leaf children render as separate cards', () => {
    const data: RWDFlowNode[] = [
      { id: 'root', label: 'Population', value: 1000, children: [
        { id: 'a', label: 'GroupA', value: 600, children: [
          { id: 'a1', label: 'Good', value: 400 },
          { id: 'a2', label: 'Bad', value: 200 },
        ]},
        { id: 'b', label: 'GroupB', value: 400 },
      ]},
    ];
    render(<RWDFlowChart data={data} />);
    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('GroupA')).toBeInTheDocument();
    expect(screen.getByText('GroupB')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Bad')).toBeInTheDocument();
  });
});
