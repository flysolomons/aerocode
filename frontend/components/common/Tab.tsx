'use client';

import React from 'react';

interface TabProps {
    tabs: {
        label: string;
        content: React.ReactNode;
    }[];
}

export default function Tab({ tabs }: TabProps) {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className="w-full">
            <div className="flex justify-center w-full">
                <div className="flex bg-white rounded-full p-1 w-fit border">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                                activeTab === index
                                    ? 'bg-[#1E1B4B] text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="py-4 px-6 border border-gray-200 rounded-[10px] mt-4">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}
