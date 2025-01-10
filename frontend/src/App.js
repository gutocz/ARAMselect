import React from "react";
import './App.css';
import SortedChampions from './components/SortedChampions';
import TeamComponent from './components/TeamComponent';

const App = () => {
    return (
        <div className="App">
            <header className="header">
                <img src="/logo.png" alt="logo" className="header-image"></img>
            </header>
            <main>
                <TeamComponent />
                <SortedChampions />
            </main>
            <footer>
                <p>dev by Gutocz</p>
            </footer>
        </div>
    );
};

export default App;