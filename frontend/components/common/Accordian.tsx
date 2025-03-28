'use client';

import React from 'react';
/*import { ChevronDownIcon } from '@heroicons/react/24/outline';*/

interface AccordionItem {
    title: string;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    defaultOpen?: number; // index of initially open item (optional)
}

export default function Accordion({ items, defaultOpen }: AccordionProps) {
    const [openIndex, setOpenIndex] = React.useState<number | null>(defaultOpen ?? null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
                <div key={index} className="py-3">
                    <button
                        className="flex w-full justify-between items-center text-left"
                        onClick={() => toggleAccordion(index)}
                    >
                        <h3 className="text-lg font-medium text-gray-900">
                            {item.title}
                        </h3>
                        {/*Chevron Down*/}
                    </button>
                    {openIndex === index && (
                        <div className="mt-3 text-gray-600">
                            {item.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
