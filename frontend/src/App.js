import React from "react";
import './App.css';
import SortedChampions from './components/SortedChampions';
import TeamComponent from './components/TeamComponent';

const App = () => {
    return (
        <div className="App">
            <header>
                <h1>ARAMSelect</h1>
            </header>
            <main>
                <TeamComponent />
                <SortedChampions />
            </main>
        </div>
    );
};

export default App;