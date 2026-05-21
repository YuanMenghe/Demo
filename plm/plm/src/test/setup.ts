import '@testing-library/jest-dom';
import React from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// 全局 mock：framer-motion 用普通 DOM 替代，避免动画影响测试
vi.mock('framer-motion', () => ({
  motion: {
    div: (p: Record<string, unknown> & { children?: React.ReactNode }) => React.createElement('div', p, p.children),
    span: (p: Record<string, unknown> & { children?: React.ReactNode }) => React.createElement('span', p, p.children),
    button: (p: Record<string, unknown> & { children?: React.ReactNode }) => React.createElement('button', p, p.children),
  },
  AnimatePresence: (p: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, p.children),
}));
