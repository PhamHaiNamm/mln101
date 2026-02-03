import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Home.css';

const Home = () => {
    const { startGame } = useGame();
    const [numPlayers, setNumPlayers] = useState(2);
    const [showRules, setShowRules] = useState(false);

    const handleStart = () => {
        startGame(numPlayers);
    };

    return (
        <div className="home-container">
            <div className="glass-panel home-content">
                <h1 className="title text-gradient">Ludo Master</h1>
                <p className="subtitle">Trải nghiệm Cờ Cá Ngựa hiện đại</p>

                <div className="selection-area">
                    <h3>Chọn số người chơi</h3>
                    <div className="player-options">
                        {[2, 3, 4].map(n => (
                            <button
                                key={n}
                                className={`player-btn ${numPlayers === n ? 'active' : ''}`}
                                onClick={() => setNumPlayers(n)}
                            >
                                {n} người
                            </button>
                        ))}
                    </div>
                </div>

                <p>
                    Mỗi người chơi có 4 quân cờ. Gieo xúc xắc để đưa quân ra khỏi chuồng, đi vòng quanh bàn
                    và đưa đủ 4 quân về nhà. Có thể đá quân đối thủ nếu đáp xuống đúng ô của họ.
                </p>

                <div className="action-area">
                    <button className="premium-btn start-btn" onClick={handleStart}>
                        Bắt đầu chơi
                    </button>
                    <button className="secondary-btn rules-btn" onClick={() => setShowRules(true)}>
                        Hướng dẫn chi tiết
                    </button>
                </div>
            </div>

            {showRules && (
                <div className="modal-overlay" onClick={() => setShowRules(false)}>
                    <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-gradient">Luật chơi</h2>
                        <ul className="rules-list">
                            <li><strong>Ra chuồng:</strong> Phải gieo được 1 hoặc 6 để đưa một quân bất kỳ từ chuồng ra đường đi.</li>
                            <li><strong>Di chuyển:</strong> Mỗi lượt chọn một quân và đi đúng số ô theo xúc xắc theo chiều kim đồng hồ quanh bàn.</li>
                            <li><strong>Đá quân:</strong> Nếu quân của bạn dừng đúng vào ô đang có quân đối thủ, quân đó sẽ bị đá về chuồng.</li>
                            <li><strong>Luật khoảng cách 3 ô:</strong> Nếu có quân đối thủ đứng cách bạn đúng 3 ô:
                                <ul>
                                    <li>Bạn phải gieo đúng 3 mới được đi tới và đá quân đó.</li>
                                    <li>Nếu gieo &gt; 3 thì quân đó bị chặn, không được đi.</li>
                                    <li>Nếu gieo &lt; 3 thì có thể đi bình thường (không đá).</li>
                                </ul>
                            </li>
                            <li><strong>Thắng cuộc:</strong> Người đầu tiên đưa đủ 4 quân vào nhà (về trung tâm) sẽ thắng.</li>
                        </ul>
                        <button className="premium-btn close-btn" onClick={() => setShowRules(false)}>Đã hiểu</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
