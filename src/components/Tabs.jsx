import { useState } from 'react';

export function Tabs({ tabs, children }) {
    
    const [ selectedTab, setSelectedTab] =  useState(tabs[0]);
    
    return (
        <>
            <div className="flex flex-col md:flex-row justify-center"> 
                { tabs.map((tab) => (
                    <div
                        key={tab}
                        selected={selectedTab === tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`text-base text-primary py-2 px-8 font-bold hover:bg-primary hover:text-white cursor-pointer ${selectedTab === tab ? 'border-b-4 border-solid border-primary' : null}`}
                    >
                        {tab}
                    </div>
                )) }
            </div>
            {children({selectedTab, setSelectedTab})}
        </>
    );
}
