'use client';

import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content: React.ReactNode;
}

export function Tabs({
  tabs,
  defaultTab,
  activeTab,
  onChange,
  className = '',
}: {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : internalTab;

  const handleTabClick = (id: string) => {
    if (activeTab === undefined) {
      setInternalTab(id);
    }
    onChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === currentTab)?.content;

  return (
    <div className={`w-full ${className}`.trim()}>
      <div className="tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === currentTab}
            onClick={() => handleTabClick(tab.id)}
            className={`tab ${tab.id === currentTab ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="badge badge-default" style={{ fontSize: '10px', padding: '1px 5px' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="tab-panel">{activeContent}</div>
    </div>
  );
}
