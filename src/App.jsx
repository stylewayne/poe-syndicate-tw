import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

// 1. 定義獎勵資料
const syndicateData = {
  "愛斯林": { 
    image: "Aisling.png",
    rewards:{ "傳送使": "雙隱匿詞物品", "禦防使": "隱匿崇高工藝台", "修研使": "隱匿混沌工藝台", "調停使": "苦痛聖甲蟲" }
    },
  "卡麥歷亞": {
    image: "Cameria.png",
    rewards: {"傳送使": "深淵聖甲蟲", "禦防使": "星團珠寶陷阱箱", "修研使": "珠寶工藝台", "調停使": "譫妄聖甲蟲" }
  },
  "艾爾雷恩": {
    image: "Elreon.png",
    rewards: {"傳送使": "地圖碎片", "禦防使": "汙染裝備陷阱箱", "修研使": "玷汙通貨工藝台", "調停使": "超越聖甲蟲" }
  },
  "格拉維奇": {
    image: "Gravicius.png",
    rewards: {"傳送使": "滿疊層命運卡", "禦防使": "隨機命運卡陷阱箱", "修研使": "交換命運卡", "調停使": "命運聖甲蟲" }
    },
  "哥夫": { 
    image: "Guff.png",
    rewards: {"傳送使": "隨機通貨", "禦防使": "稀有裝備陷阱箱", "修研使": "映像迷霧工藝台", "調停使": "凋落聖甲蟲" }
    },
  "哈庫": { 
    image: "Haku.png",
    rewards: {"傳送使": "傳奇保險箱", "禦防使": "支配聖甲蟲", "修研使": "勢力崇高_髮絲工藝台", "調停使": "伏擊聖甲蟲" }
    },
  "西拉客": { 
    image: "Hillock.png",
    rewards: {"傳送使": "勢力裝備陷阱箱", "禦防使": "勢力裝備工藝台", "修研使": "異能通貨工藝台", "調停使": "勢力聖甲蟲" }
    },
  "竄逃之彼": {
    image: "It_That_Fled.png",
    rewards: {"傳送使": "穢生傳奇陷阱箱", "禦防使": "裂痕戒指工藝台(穢生工藝)", "修研使": "玷汙工藝台", "調停使": "裂痕聖甲蟲" }
    },
  "傑納斯": {
    image: "Janus.png",
    rewards: {"傳送使": "金幣", "禦防使": "卡爾格聖甲蟲", "修研使": "卡迪羅傳奇", "調停使": "探險聖甲蟲" }
    },
  "喬恩": {
    image: "Thane_Jorgin.png",
    rewards: {"傳送使": "硫酸聖甲蟲", "禦防使": "掘獄裝備陷阱箱", "修研使": "魔符工藝台", "調停使": "獸獵聖甲蟲" }
    },
  "庫歐": {
    image: "Korell_Goya.png",
    rewards: {"傳送使": "混亂聖甲蟲", "禦防使": "精隨裝備陷阱箱", "修研使": "精隨工藝台", "調停使": "精隨聖甲蟲" }
    },
  "里歐": {
    image: "Leo.png", 
    rewards: {"傳送使": "穿越聖甲蟲", "禦防使": "汙染傳奇陷阱箱", "修研使": "巨靈瓦寶工藝台", "調停使": "通牒聖甲蟲" }
    },
  "萊可": {
    image: "Riker_Maloney.png",
    rewards: {"傳送使": "傳奇物品", "禦防使": "傳奇物品陷阱箱", "修研使": "古變石工藝台", "調停使": "泰坦聖甲蟲" }
    },
  "琳": {
    image: "Rin.png",
    rewards: {"傳送使": "始創者地圖", "禦防使": "傳奇地圖陷阱箱", "修研使": "聖甲蟲陷阱箱", "調停使": "製圖聖甲蟲" }
    },
  "托菈": {
    image: "Tora.png",
    rewards: {"傳送使": "精良寶石_費斯特之鏡", "禦防使": "寶石陷阱箱", "修研使": "寶石工藝台", "調停使": "祭祀聖甲蟲" }
    },
  "瓦甘": {
    image: "Vagan.png",
    rewards: {"傳送使": "孵化器寶箱", "禦防使": "孵化器加速", "修研使": "破裂石工藝台", "調停使": "戰亂聖甲蟲" }
    },
  "瓦西里": {
    image: "Vorici.png",
    rewards: {"傳送使": "滿疊層通貨", "禦防使": "重鑄插槽自選裝備", "修研使": "機會石自選裝備", "調停使": "花園聖甲蟲" }
    }
}

const divisions = ["傳送使", "禦防使", "修研使", "調停使"];
const tiers = ["none", "low", "mid", "high"]; // 對應不同的顏色等級
const npcList = Object.keys(syndicateData);

function App() {
   // 1. 將顏色改為 State，並設定預設值
  const [gridState, setGridState] = useState({});
  const [tierColors, setTierColors] = useState(['#242424', '#259e25', '#ac8a27', '#721c24']);
  
  const clearAll = () => {
    if (window.confirm("確定要清空所有已選顏色嗎？")) {
      setGridState({});
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  };

  // 【優化】初始化：從網址讀取狀態
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  
  // 讀取顏色
  const colorsParam = params.get('colors');
  if (colorsParam) {
    setTierColors(colorsParam.split(',').map(c => `#${c}`));
  }

  // 讀取格子狀態 (原本的邏輯)
  const data = params.get('data');
  if (data) {
    const savedState = {};
    const values = data.split('');
    let index = 0;
    npcList.forEach(npc => {
      // 這裡要包含 NPC 點選狀態與四個單位的狀態
      [...divisions, "header"].forEach(div => {
        const key = div === "header" ? `npc-${npc}` : `${npc}-${div}`;
        savedState[key] = parseInt(values[index]) || 0;
        index++;
      });
    });
    setGridState(savedState);
  }
}, []);

  // 【優化】當狀態改變時，自動更新網址連結
 const updateUrl = (newState, newColors = tierColors) => {
    const dataStr = npcList.flatMap(npc => 
      divisions.concat("header").map(div => {
        const key = div === "header" ? `npc-${npc}` : `${npc}-${div}`;
        return newState[key] || 0;
      })
    ).join('');

     // 將自定義顏色轉成十六進位字串 (拿掉 #) 存入網址
    const colorStr = newColors.map(c => c.replace('#', '')).join(',');
    const newUrl = `${window.location.pathname}?data=${dataStr}&colors=${colorStr}`;
    window.history.replaceState(null, '', newUrl);
  };

  const toggleTier = (npc, div = "header") => {
    const key = div === "header" ? `npc-${npc}` : `${npc}-${div}`;
    const nextTier = ((gridState[key] || 0) + 1) % 4;
    const newState = { ...gridState, [key]: nextTier };
    setGridState(newState);
    updateUrl(newState);
  };

  const takeScreenshot = () => {
    const element = document.getElementById('syndicate-table');
    // 截圖前強制設定一個足夠寬的寬度，確保不會擠壓
    const originalWidth = element.style.width;
    element.style.width = '1800px'; 

    html2canvas(element, { 
      backgroundColor: '#121212',
      scale: 2, // 提高解析度，讓字體更清晰
      useCORS: true 
    }).then((canvas) => {
      element.style.width = originalWidth; // 截完還原
      const link = document.createElement('a');
      link.download = 'poe-syndicate-custom.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

   // 更新顏色選擇 (讓用戶改 Tier 顏色)
 const handleColorChange = (index, newColor) => {
    const nextColors = [...tierColors];
    nextColors[index] = newColor;
    setTierColors(nextColors);
    updateUrl(gridState, nextColors); // 顏色改變時也更新網址
  };

    return (
    <div style={{ padding: '15px', backgroundColor: '#121212', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* 頂部標題與按鈕區 - 縮小間距 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '30px' }}>PoE 反叛機制獎勵自定義表 3.28</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
        </div>
      </div>
      <p style={{ color: '#ffffff', fontSize: '14px', marginTop: '15px' }}>* 點擊格子可循環切換 Tier 顏色</p>

       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', backgroundColor: '#1f1f1f', padding: '15px', borderRadius: '8px', border: '1px solid #333', flexWrap: 'wrap', gap: '20px' }}>
        {/* 左側：功能按鈕 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={takeScreenshot} style={styles.btn}>📸 儲存圖片</button>
          <button onClick={clearAll} style={{ ...styles.btn, backgroundColor: '#442222' }}>🧹 一鍵清空</button>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('連結已複製！');
          }} style={styles.btn}>🔗 複製連結</button>
        </div>

        {/* 右側：顏色自定義區 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#aaa' }}>自定義色階：</span>
          {tierColors.map((color, index) => (
            index === 0 ? null : ( // 預設底色不開放改，只改 1, 2, 3
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '12px',color: '#aaa' }}>T{index}</span>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  style={{ width: '30px', height: '30px', border: 'none', cursor: 'pointer', background: 'none' }}
                />
              </div>
            )
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto', border: '2px solid #000', borderRadius: '4px', backgroundColor: '#1a1a1a' }}>
        <table id="syndicate-table" className="syndicate-table" style={{ width: 'max-content', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ 
                backgroundColor: '#1f1f1f', 
                minWidth: '60px', 
                border: '2px solid #000', 
                position: 'sticky',
                left: 0,
                zIndex: 10
              }}>
              </th>
               {/* NPC 標題列 - 加上點擊換色功能 */}
      {npcList.map(npc => {
        const npcTierIdx = gridState[`npc-${npc}`] || 0;
        return (
          <th 
            key={npc} 
            onClick={() => toggleTier(npc)} // 點擊觸發 NPC 換色
            style={{ 
              backgroundColor: tierColors[npcTierIdx], // 根據狀態變換背景色
              padding: '4px', 
              border: '2px solid #000',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <img 
                src={`/images/${syndicateData[npc].image}`} 
                alt={npc} 
                style={{ 
                  width: '95px', 
                  height: '95px', 
                  borderRadius: '0', 
                  objectFit: 'cover',
                  display: 'block',
                  filter: npcTierIdx === 0 ? 'none' : 'brightness(0.8)' 
                }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ 
                color: npcTierIdx === 0 ? '#eee' : '#fff', 
                fontSize: '20px',
                fontWeight: 'bold' 
              }}>
                {npc}
              </span>
            </div>
          </th>
        );
      })}
    </tr>
  </thead>
          <tbody>
            {divisions.map(div => (
              <tr key={div}>
                {/* 左側單位名稱欄 - 縮小字體 */}
                <td style={{ 
                  backgroundColor: '#252525', 
                  color: '#ffa857', 
                  fontWeight: 'bold', 
                  textAlign: 'center', 
                  padding: '8px 4px', 
                  fontSize: '18px',
                  border: '2px solid #000', 
                  position: 'sticky',
                  left: 0,
                  zIndex: 5
                }}>
                  {div}
                </td>
                
                {/* 獎勵格子 - 縮小寬度與獎勵圖 */}
                {npcList.map(npc => {
                  const rewardName = syndicateData[npc].rewards[div];
                  const tierIdx = gridState[`${npc}-${div}`] || 0;
                  return (
                    <td 
                      key={`${npc}-${div}`} 
                      onClick={() => toggleTier(npc, div)}
                      className="td-reward"
                      style={{ 
                        backgroundColor: tierColors[tierIdx], 
                        border: '2px solid #000', 
                        padding: '4px 2px', 
                        cursor: 'pointer',
                        textAlign: 'center',
                        minWidth: '100px', // 縮小格子寬度 (從 130px -> 105px)
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        {/* 獎勵圖片容器 - 縮小 */}
                        <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={`/images/${rewardName}.png`} 
                            alt={rewardName}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain' 
                            }}
                            onError={(e) => { 
                              const currentSrc = e.target.src;
                              if (currentSrc.toLowerCase().endsWith('.png') && !currentSrc.endsWith('.PNG')) {
                                e.target.src = currentSrc.replace(/\.png$/i, '.PNG');
                              } else {
                                e.target.style.display = 'none'; 
                              }
                            }} 
                          />
                        </div>
                        {/* 獎勵文字 - 縮小字體並限制寬度 */}
                        <span style={{ 
                          fontSize: '12.8px',
                          color: '#fff',
                          lineHeight: '1.1',
                          maxWidth: '90px',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal' ,// 改為不換行，讓高度更一致
                          minHeight: '26px'
                        }}>
                          {rewardName}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' },
  buttonGroup: { display: 'flex', gap: '10px' },
  btn: { padding: '8px 16px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: '2px solid #000', borderRadius: '4px' },
  table: { borderCollapse: 'collapse', width: '100%', border: '2px solid #000' },
  th: { border: '2px solid #000', padding: '12px', backgroundColor: '#1f1f1f', color: '#aaa', fontSize: '14px' },
  tdName: { border: '2px solid #000', padding: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#1a1a1a', width: '100px' },
  tdReward: { border: '2px solid #000', padding: '12px', cursor: 'pointer', fontSize: '13px', textAlign: 'center', minWidth: '120px' },
};

export default App;
