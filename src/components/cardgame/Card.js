import React, { useState, useEffect } from 'react';
import axios from 'axios';

const allCards = ['Cat', 'Defuse', 'Shuffle', 'Exploding Kitten'];

const generateRandomCards = () => {
    const randomCards = [];
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        randomCards.push(allCards[randomIndex]);
    }
    return randomCards;
};

const Card = ({ username }) => {
    const [cards, setCards] = useState(generateRandomCards);
    const [score, setScore] = useState(0);
    const [currentCard, setCurrentCard] = useState('Click Draw card Button');
    const [defuser, setDefuser] = useState(0);
    const [prevGames, setPreviousGames] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
   

    if( !localStorage.getItem('currentUser')){
        localStorage.setItem('currentUser', username);
    }
    const setCurrentGames = async (games) => {
        for(let i=0;i<games.length;i++){
        
            if(games[i].status === 'Playing'){
                setCards(games[i].deck);
                setDefuser(games[i].defusers);
                setCurrentCard('Click to continue');
                break;
            }
        }
    };
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/games/getGames/${localStorage.getItem('currentUser')}`);
            setCurrentGames(response.data);
            
            setPreviousGames(response.data);
            const response2 = await axios.get('http://localhost:3001/games/leaderboard');
            setLeaderboard(response2.data);
            
        } catch (error) {
            console.error('Error fetching previous games:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const saveData = async (passedStatus) => {
        try {
            const data = {
                owner: localStorage.getItem('currentUser'),
                status: passedStatus,
                defusers: defuser,
                deck: cards,
              };
            await axios.post('http://localhost:3001/games/saveGame',data);
        } catch (error) {
            console.error('Error saving game:', error);
        }
    };



const handleTabClose = async () => {
   
        try {
            await saveData('Playing');
        } catch (error) {
            console.error('Error sending data to the server:', error);
        }
    
};
    
useEffect(() => {
    

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [cards, defuser]);
      
    useEffect(() => {
        if (cards.length === 0) {
            alert('You win!!');
            saveData('Won');
            setScore(score + 1);
            setDefuser(0);
            setCurrentCard('Click Draw card to start new');
            setCards(generateRandomCards);
            
            fetchData();
           
        }
    }, [cards, score]);

    
    const drawCard = () => {
        const drawnCard = cards[0];
        setCurrentCard(drawnCard);

        if (drawnCard === 'Exploding Kitten') {
            if (defuser > 0) {
                alert('Whoosh! Your defuser defused the Exploding kitten!');
                setDefuser(defuser - 1);
            } else {
                alert('You lose because you drew Exploding Kitten!');
                setCurrentCard('Click Draw card to start new');
                setDefuser(0);
                setCards(generateRandomCards);
                return;
            }
        }

        if (drawnCard === 'Shuffle') {
            setDefuser(0);
            setCurrentCard('Shuffled! Click Draw card to start again');
            setCards(generateRandomCards);
        }

        if (drawnCard === 'Defuse') {
            setDefuser(defuser + 1);
        }

        if (drawnCard !== 'Shuffle') {
            setCards(cards => cards.slice(1));
        }
    };

    return (
        <div style={{ 
            textAlign: 'center',
            backgroundImage: 'url("https://media.gettyimages.com/id/200340461-001/photo/royal-flush-hand-of-cards-hearts-suit-on-playing-baize-close-up.jpg?s=1024x1024&w=gi&k=20&c=T5h9FCNPhedML2jMd0zZx0PfPXSHTGrkF8MezBQIW90=")',
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat', 
            backgroundPosition: 'center', 
            backdropFilter: 'blur(5px)', 
            }}>
            <h1 style={{color: 'white'}}>Hello {localStorage.getItem('currentUser')} Welcome to the Card Game</h1>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', width: '15%', backgroundColor: 'white', border: '1px solid #dddddd', padding: '2px', alignSelf: 'center' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '2px' }}>
                                <p>Your Score: {score}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '2px' }}>
                                <p>Defusers available: {defuser}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #dddddd', padding: '2px' }}>
                                <p>Cards in deck: {cards.length}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ border: '1px solid black', padding: '20px',margin: '20px', width: '200px', height: '300px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.09)' }}>
                    <h2>Deck</h2>
                    <button style={{ padding: '10px', backgroundColor: 'lightblue', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={drawCard}>Draw Card</button>
                    <p>{currentCard}</p>
                </div>
            </div>
            
            <div style={{ position: 'absolute', top: '10px', right: '10px', textAlign: 'right', color: 'black' }}>
                <h2 style={{ color:'white'}}>Leaderboard</h2>
                <table style={{ borderCollapse: 'collapse', width: '150px', backgroundColor: 'white', border: '1px solid #dddddd', padding: '2px', alignSelf: 'center' }}>
                    <tbody>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>Player</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>Score</th>
                        </tr>
                        {leaderboard.map((player, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{player.player}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{player.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div>
                <h2>History</h2>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>Player</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>Time</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prevGames.map((game, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{game.owner}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{game.timestamp}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{game.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Card;
